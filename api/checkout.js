import Stripe from "stripe";
import { MENU_SECTIONS } from "../src/data/menu.js";

const RESTAURANT_TAX_PERCENT = 8;
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
  if (!secretKey?.startsWith("sk_test_")) {
    return response.status(503).json({ error: "Stripe sandbox is not configured." });
  }

  try {
    const { cart, fulfillment, curbsideLocation, vehicle } = request.body || {};
    if (!Array.isArray(cart) || cart.length === 0 || cart.length > 50) {
      return response.status(400).json({ error: "Your order is empty or too large." });
    }
    if (!["pickup", "curbside"].includes(fulfillment)) {
      return response.status(400).json({ error: "Choose Pickup or Curbside." });
    }
    if (fulfillment === "curbside" && (!curbsideLocation?.trim() || !vehicle?.trim())) {
      return response.status(400).json({ error: "Curbside location and vehicle description are required." });
    }

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
        fulfillment,
        curbside_location: String(curbsideLocation || "").trim().slice(0, 500),
        vehicle: String(vehicle || "").trim().slice(0, 500),
        environment: "sandbox",
      },
      payment_intent_data: {
        metadata: { app: "flavorstream-gg-steakout", fulfillment, environment: "sandbox" },
      },
    });
    return response.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error", error);
    return response.status(400).json({ error: error?.message || "Unable to start Stripe checkout." });
  }
}
