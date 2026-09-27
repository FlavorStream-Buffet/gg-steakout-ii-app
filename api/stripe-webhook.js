import Stripe from "stripe";

export const config = { api: { bodyParser: false } };

async function readRawBody(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks);
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed." });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers["stripe-signature"];

  if (!secretKey?.startsWith("sk_test_") || !webhookSecret || !signature) {
    return response.status(503).json({ error: "Stripe sandbox webhook is not configured." });
  }

  try {
    const stripe = new Stripe(secretKey);
    const event = stripe.webhooks.constructEvent(
      await readRawBody(request),
      signature,
      webhookSecret
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      console.info("Verified G&G sandbox payment", {
        eventId: event.id,
        sessionId: session.id,
        paymentStatus: session.payment_status,
        amountTotal: session.amount_total,
        fulfillment: session.metadata?.fulfillment,
      });
      // Toast submission and permanent order storage remain intentionally disabled.
    }

    return response.status(200).json({ received: true });
  } catch (error) {
    console.error("Stripe webhook verification failed", error);
    return response.status(400).json({ error: "Invalid Stripe webhook signature." });
  }
}
