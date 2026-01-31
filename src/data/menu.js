// src/data/menu.js
// Menu source of truth.
// Prices are centralized in PRICE so updates are fast (one place).

export const LOCATIONS = [
  {
    id: "loc-1",
    name: "Downtown — 350 East Main Street, Rochester, NY",
    hours: [
      { days: "Mon – Wed", hours: "6:30am – 7:00pm" },
      { days: "Thurs – Sat", hours: "6:30am – 9:00pm" },
      { days: "Sunday", hours: "Closed" },
    ],
  },
  {
    id: "loc-2",
    name: "Location 2 (coming soon)",
    hours: [{ days: "Mon – Sun", hours: "Hours coming soon" }],
  },
];

/**
 * CENTRAL PRICE LIST
 * Update prices here (one place) instead of hunting through items.
 */
const PRICE = {
  "steak-sandwich": 13.99,
  "wings-10": 14.49,
  "byo-sub": 12.49,

  // Example add-ons (if/when you wire price deltas later)
  "delta-extra-cheese": 1.0,
  "delta-bacon": 2.0,
  "delta-garlic-parm": 1.0,
  "delta-double-meat": 4.0,
  "delta-extra-sauce": 0.5,
};

function P(key, fallback = 0) {
  const v = PRICE[key];
  return typeof v === "number" ? v : fallback;
}

function placeholderItem(id, name, description = "Menu details coming soon.") {
  return { id, name, price: 0, description, media: { image: "" }, optionGroups: [] };
}

function menuLoc1() {
  return {
    sections: [
      {
        id: "top-picks",
        title: "Top Picks",
        note: "Fast favorites — tap to order",
        items: [
          {
            id: "steak-sandwich",
            name: "Steak Sandwich",
            price: P("steak-sandwich"),
            description: "Classic steak sandwich done the G&G way.",
            media: { image: "" },
            optionGroups: [
              {
                id: "roll",
                label: "Bread",
                type: "single",
                required: true,
                options: [
                  { id: "roll-standard", label: "Standard Roll", default: true },
                  { id: "roll-italian", label: "Italian Roll" },
                  { id: "roll-hoagie", label: "Hoagie Roll" },
                ],
              },
              {
                id: "toppings",
                label: "Toppings",
                type: "multi",
                required: false,
                options: [
                  { id: "onions", label: "Onions" },
                  { id: "no-onions", label: "No Onions" },
                  { id: "mushrooms", label: "Mushrooms" },
                  { id: "peppers", label: "Peppers" },
                  { id: "extra-cheese", label: "Extra Cheese", priceDelta: P("delta-extra-cheese") },
                  { id: "bacon", label: "Add Bacon", priceDelta: P("delta-bacon") },
                ],
              },
            ],
          },
          {
            id: "wings-10",
            name: "Wings (10pc)",
            price: P("wings-10"),
            description: "Crispy wings — sauce it your way.",
            media: { image: "" },
            optionGroups: [
              {
                id: "sauce",
                label: "Sauce",
                type: "single",
                required: true,
                options: [
                  { id: "mild", label: "Mild", default: true },
                  { id: "medium", label: "Medium" },
                  { id: "hot", label: "Hot" },
                  { id: "bbq", label: "BBQ" },
                  { id: "garlic-parm", label: "Garlic Parm", priceDelta: P("delta-garlic-parm") },
                ],
              },
            ],
          },
        ],
      },

      {
        id: "classics",
        title: "Classics",
        note: "Core categories (expand & perfect next)",
        items: [
          placeholderItem("cat-breakfast", "G&G Breakfast Menu", "Tap to view breakfast items (coming next)."),
          placeholderItem("cat-steak-sandwiches", "G&G Steak Sandwiches", "Tap to view steak sandwich lineup (coming next)."),
          placeholderItem("cat-burgers", "Burgers", "Tap to view burgers (coming next)."),
          placeholderItem("cat-specialty-sandwiches", "Specialty Sandwiches (Fish, Chicken, Burgers)", "Tap to view specialty sandwiches (coming next)."),
          placeholderItem("cat-wings", "Wings (pieces)", "Tap to view wings by piece count (coming next)."),
          placeholderItem("cat-salads", "Salads", "Tap to view salads (coming next)."),
          placeholderItem("cat-seafood", "Seafood", "Tap to view seafood (coming next)."),
          placeholderItem("cat-dinners", "Dinners", "Tap to view dinner plates (coming next)."),
          placeholderItem("cat-vegetarian", "Vegetarian World", "Tap to view vegetarian options (coming next)."),
        ],
      },

      {
        id: "build-your-own",
        title: "Build Your Own",
        note: "One item — lots of control",
        items: [
          {
            id: "byo-sub",
            name: "Build Your Own Sub",
            price: P("byo-sub"),
            description: "Start with the basics — customize it how you want.",
            media: { image: "" },
            optionGroups: [
              {
                id: "protein",
                label: "Protein",
                type: "single",
                required: true,
                options: [
                  { id: "steak", label: "Steak", default: true },
                  { id: "chicken", label: "Chicken" },
                  { id: "turkey", label: "Turkey" },
                  { id: "veggie", label: "Veggie" },
                ],
              },
              {
                id: "cheese",
                label: "Cheese",
                type: "single",
                required: true,
                options: [
                  { id: "american", label: "American", default: true },
                  { id: "provolone", label: "Provolone" },
                  { id: "cheddar", label: "Cheddar" },
                  { id: "none", label: "No Cheese" },
                ],
              },
              {
                id: "toppings",
                label: "Toppings",
                type: "multi",
                required: false,
                options: [
                  { id: "lettuce", label: "Lettuce" },
                  { id: "tomato", label: "Tomato" },
                  { id: "onions", label: "Onions" },
                  { id: "mushrooms", label: "Mushrooms" },
                  { id: "peppers", label: "Peppers" },
                  { id: "jalapenos", label: "Jalapeños" },
                ],
              },
              {
                id: "premium",
                label: "Premium Adds",
                type: "multi",
                required: false,
                options: [
                  { id: "bacon", label: "Add Bacon", priceDelta: P("delta-bacon") },
                  { id: "double-meat", label: "Double Meat", priceDelta: P("delta-double-meat") },
                  { id: "extra-cheese", label: "Extra Cheese", priceDelta: P("delta-extra-cheese") },
                ],
              },
            ],
          },
        ],
      },

      {
        id: "extras",
        title: "Extras",
        note: "Sides, drinks, sauces, desserts",
        items: [
          placeholderItem("cat-beverages", "Beverages", "Tap to view beverages (coming next)."),
          placeholderItem("cat-fizz-sodas", "Fizz Sodas", "Tap to view fizz sodas (coming next)."),
          placeholderItem("cat-fries", "French Fries (Crinkle Cut)", "Tap to view fries (coming next)."),
          placeholderItem("cat-onion-rings", "Onion Rings", "Tap to view onion rings (coming next)."),
          placeholderItem("cat-side-dishes", "Side Dishes", "Tap to view side dishes (coming next)."),
          placeholderItem("cat-side-sauce", "Side of Sauce", "Tap to view sauces (coming next)."),
          placeholderItem("cat-desserts", "Desserts & Fruit", "Tap to view desserts & fruit (coming next)."),
          placeholderItem("cat-bottled-sauce", "G&G Steakout II Bottled Sauce", "Tap to view bottled sauce (coming next)."),
        ],
      },

      {
        id: "specials",
        title: "Specials",
        note: "Daily specials & limited-time",
        items: [
          placeholderItem("cat-daily-specials", "Daily Specials", "Tap to view daily specials (coming next)."),
          placeholderItem("cat-specials", "Specials", "Tap to view specials (coming next)."),
          placeholderItem("cat-small-gourmet-salads", "Small Gourmet Salads", "Tap to view gourmet salads (coming next)."),
          placeholderItem("cat-specialty-sausage", "Specialty Beef Sausage Sandwiches", "Tap to view sausage sandwiches (coming next)."),
        ],
      },
    ],
  };
}

export function getMenuForLocationId(locationId) {
  if (locationId === "loc-1") return menuLoc1();
  return menuLoc1();
}
