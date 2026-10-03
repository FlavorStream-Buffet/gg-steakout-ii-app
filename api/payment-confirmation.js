import Stripe from "stripe";
import { createHash, timingSafeEqual } from "node:crypto";

export async function buildPaymentSummary(stripe, sessionId, token) {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const expectedHash = session.metadata?.receipt_token_hash;
  const actualHash = createHash("sha256").update(token).digest("hex");
  if (session.metadata?.app !== "flavorstream-gg-steakout" ||
      !/^[a-f0-9]{64}$/.test(expectedHash || "") ||
      !timingSafeEqual(Buffer.from(expectedHash, "hex"), Buffer.from(actualHash, "hex"))) {
    throw Object.assign(new Error("This payment summary is not available in this browser."), { status: 403 });
  }
  if (session.status !== "complete" || session.payment_status !== "paid") {
    throw Object.assign(new Error("Payment is not confirmed yet. Wait a moment and check again."), { status: 409 });
  }
  const lines = await stripe.checkout.sessions.listLineItems(session.id, {
    limit: 100, expand: ["data.price.product"],
  });
  return {
    reference: session.id,
    sandbox: !session.livemode,
    subtotal: session.amount_subtotal,
    tax: session.total_details?.amount_tax || 0,
    total: session.amount_total,
    fulfillment: session.metadata.fulfillment,
    curbsideLocation: session.metadata.curbside_location || "",
    vehicle: session.metadata.vehicle || "",
    preference: session.metadata.confirmation_preference || null,
    items: lines.data.map((line) => ({
      name: line.description,
      options: typeof line.price?.product === "object" ? line.price.product.description || "" : "",
      quantity: line.quantity,
      subtotal: line.amount_subtotal,
    })),
  };
}

export default async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "Method not allowed." });
  }
  const sessionId = request.query?.session_id;
  if (typeof sessionId !== "string" || !/^cs_(test_|live_)?[A-Za-z0-9]{10,200}$/.test(sessionId)) {
    return response.status(400).json({ error: "Invalid payment reference." });
  }
  const cookieName = `gg_receipt_${sessionId}=`;
  const token = String(request.headers.cookie || "").split(";").map((part) => part.trim())
    .find((part) => part.startsWith(cookieName))?.slice(cookieName.length);
  if (!/^[a-f0-9]{64}$/.test(token || "")) {
    return response.status(403).json({ error: "Open this summary in the browser used for checkout. Earlier test payments do not have a saved summary." });
  }
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return response.status(503).json({ error: "Payment verification is unavailable." });
  try {
    return response.status(200).json(await buildPaymentSummary(new Stripe(secretKey), sessionId, token));
  } catch (error) {
    return response.status(error.status || 502).json({
      error: error.status ? error.message : "Unable to verify payment right now. Do not pay again; try Check Again.",
    });
  }
}
