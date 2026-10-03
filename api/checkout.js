import Stripe from "stripe";
import { randomBytes, createHash } from "node:crypto";
import { MENU_SECTIONS } from "../src/data/menu.js";

const RESTAURANT_TAX_PERCENT = 8;
const FSB_COMMISSION_PERCENT = 15;
const FOOD_TAX_CODE = "txcd_40060003";
const catalog = new Map(
  MENU_SECTIONS.flatMap((section) => section.items).map((menuItem) => [menuItem.id, menuItem])
);

function getOrigin(request) {
  const host = request.headers["x-forwarded-host"] || request.headers.host;
  const protocol = request.headers["x-forwarded-proto"] || "https";
  if (!host) throw new Error("Unable to determine checkout return address.");
  return `${protocol}://${host}`;
}

function selectedOptions(menuItem, requestedSelections = []) {
  const requestedIds = new Set(requestedSelections);
  const chosen = [];
  for (const group of menuItem.optionGroups || []) {
    const option = group.options.find((candidate) => requestedIds.has(candidate.id));
    if (group.required && !option) {
      throw new Error(`A required choice is missing for ${menuItem.name}.`);
    }
    if (option) chosen.push(option);
  }
  return chosen;
}

async function getRestaurantTaxRate(stripe) {
  const existing = await stripe.taxRates.list({ active: true, limit: 100 });
  const matching = existing.data.find((taxRate) =>
    taxRate.percentage === RESTAURANT_TAX_PERCENT &&
    taxRate.inclusive === false &&
    taxRate.metadata?.fsb_location === "gg-downtown-rochester"
  );
  if (matching) return matching.id;

  const created = await stripe.taxRates.create({
    display_name: "Sales tax",
    description: "G&G Steakout II — Rochester, NY",
    jurisdiction: "US-NY",
    percentage: RESTAURANT_TAX_PERCENT,
    inclusive: false,
    metadata: { fsb_location: "gg-downtown-rochester" },
  });
  return created.id;
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed." });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  const isTestMode = secretKey?.startsWith("sk_test_");
  const isLiveMode = secretKey?.startsWith("sk_live_");
  const connectedAccountId = process.env.STRIPE_CONNECTED_ACCOUNT_ID;

  if (!isTestMode && !isLiveMode) {
    return response.status(503).json({ error: "Stripe is not configured." });
  }
  if (isLiveMode && process.env.STRIPE_LIVE_ENABLED !== "true") {
    return response.status(503).json({ error: "Live ordering is not enabled yet." });
  }
  if (isLiveMode && !connectedAccountId?.startsWith("acct_")) {
    return response.status(503).json({ error: "G&G payment onboarding is incomplete." });
  }

  try {
    const { cart, fulfillment, curbsideLocation, vehicle, confirmationPreference = "email" } = request.body || {};
    if (!Array.isArray(cart) || cart.length === 0 || cart.length > 50) {
      return response.status(400).json({ error: "Your order is empty or too large." });
    }
    if (!["pickup", "curbside"].includes(fulfillment)) {
      return response.status(400).json({ error: "Choose Pickup or Curbside." });
    }
    if (fulfillment === "curbside" && (!curbsideLocation?.trim() || !vehicle?.trim())) {
      return response.status(400).json({ error: "Curbside location and vehicle description are required." });
    }

    if (!["email", "text", "both"].includes(confirmationPreference)) {
      return response.status(400).json({ error: "Choose Email, Text, or Both." });
    }
    const receiptToken = randomBytes(32).toString("hex");
    let pretaxSubtotalCents = 0;
    const lineItems = cart.map((line) => {
      const menuItem = catalog.get(line.itemId);
      const quantity = Number(line.quantity);
      if (!menuItem || !Number.isInteger(quantity) || quantity < 1 || quantity > 25) {
        throw new Error("An order item is invalid. Please rebuild the cart.");
      }
      const options = selectedOptions(menuItem, line.selectionIds);
      const unitAmount = Math.round((menuItem.price + options.reduce(
        (sum, option) => sum + Number(option.priceDelta || 0), 0
      )) * 100);
      pretaxSubtotalCents += unitAmount * quantity;
      const description = options.map((option) => option.label).join(" · ").slice(0, 500);
      return {
        quantity,
        tax_rates: [],
        price_data: {
          currency: "usd",
          unit_amount: unitAmount,
          product_data: {
            name: menuItem.name.slice(0, 127),
            ...(description ? { description } : {}),
            tax_code: FOOD_TAX_CODE,
            metadata: { menu_item_id: menuItem.id },
          },
        },
      };
    });

    const stripe = new Stripe(secretKey);
    const taxRateId = await getRestaurantTaxRate(stripe);
    lineItems.forEach((line) => { line.tax_rates = [taxRateId]; });
    const origin = getOrigin(request);
    const environment = isLiveMode ? "live" : "sandbox";
    const applicationFeeAmount = Math.round(
      pretaxSubtotalCents * FSB_COMMISSION_PERCENT / 100
    );
    const connectPaymentData = connectedAccountId ? {
      application_fee_amount: applicationFeeAmount,
      on_behalf_of: connectedAccountId,
      transfer_data: { destination: connectedAccountId },
    } : {};
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_creation: "always",
      phone_number_collection: { enabled: true },
      billing_address_collection: "auto",
      line_items: lineItems,
      success_url: `${origin}/?checkout=success&session_id={CHECKOUT_SESSION_ID}#/`,
      cancel_url: `${origin}/?checkout=cancelled#/`,
      metadata: {
        app: "flavorstream-gg-steakout",
        receipt_token_hash: createHash("sha256").update(receiptToken).digest("hex"),
        confirmation_preference: confirmationPreference,
        fulfillment,
        curbside_location: String(curbsideLocation || "").trim().slice(0, 500),
        vehicle: String(vehicle || "").trim().slice(0, 500),
        environment,
        pretax_subtotal_cents: String(pretaxSubtotalCents),
        fsb_commission_cents: String(applicationFeeAmount),
        fsb_commission_percent: String(FSB_COMMISSION_PERCENT),
        connected_account: connectedAccountId || "sandbox-platform-only",
      },
      payment_intent_data: {
        ...connectPaymentData,
        metadata: {
          app: "flavorstream-gg-steakout",
          fulfillment,
          environment,
          pretax_subtotal_cents: String(pretaxSubtotalCents),
          fsb_commission_cents: String(applicationFeeAmount),
          connected_account: connectedAccountId || "sandbox-platform-only",
        },
      },
    });
    response.setHeader("Cache-Control", "no-store");
    response.setHeader("Set-Cookie", `gg_receipt_${session.id}=${receiptToken}; HttpOnly; Secure; SameSite=Lax; Path=/api/payment-confirmation; Max-Age=604800`);
    return response.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error", error);
    return response.status(400).json({ error: error?.message || "Unable to start Stripe checkout." });
  }
}

