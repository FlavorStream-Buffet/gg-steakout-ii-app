// src/data/menu.js
// G&G Steakout II — Menu Data
// Phase 1: Structure + flagship item spec
// Now fully built: Mandela Burger options (required + optional + upcharges)

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

function placeholderItem(id, name, price = 0, description = "Menu details coming soon.") {
  return { id, name, price, description, media: { image: "" }, optionGroups: [] };
}

/**
 * Mandela Burger (signature item) — FULL options spec
 * Notes:
 * - We keep the options realistic and restaurant-friendly.
 * - Required choices: Cook Temp, Cheese, Bun.
 * - Optional: Toppings, Sauces, Premium Adds.
 * - We keep “No ___” out of multi-select lists to avoid contradictions.
 */
function mandelaBurgerItem() {
  return {
    id: "mandela-burger",
    name: "Mandela Burger",
    price: 17.99,
    description:
      "Signature burger — built your way. Choose temp, cheese, bun, toppings, sauces, and premium adds.",
    media: { image: "" },

    optionGroups: [
      {
        id: "cook-temp",
        label: "Cook Temperature",
        type: "single",
        required: true,
        options: [
          { id: "temp-medium", label: "Medium", default: true },
          { id: "temp-medium-well", label: "Medium Well" },
          { id: "temp-well-done", label: "Well Done" },
        ],
      },

      {
        id: "bun",
        label: "Bun",
        type: "single",
        required: true,
        options: [
          { id: "bun-regular", label: "Regular Bun", default: true },
          { id: "bun-sesame", label: "Sesame Bun" },
          { id: "bun-pretzel", label: "Pretzel Bun", priceDelta: 1.0 },
          { id: "bun-lettuce-wrap", label: "Lettuce Wrap (No Bun)" },
        ],
      },

      {
        id: "cheese",
        label: "Cheese",
        type: "single",
        required: true,
        options: [
          { id: "cheese-american", label: "American", default: true },
          { id: "cheese-cheddar", label: "Cheddar" },
          { id: "cheese-provolone", label: "Provolone" },
          { id: "cheese-pepperjack", label: "Pepper Jack" },
          { id: "cheese-none", label: "No Cheese" },
        ],
      },

      {
        id: "toppings",
        label: "Toppings (Choose Any)",
        type: "multi",
        required: false,
        options: [
          { id: "top-lettuce", label: "Lettuce" },
          { id: "top-tomato", label: "Tomato" },
          { id: "top-onion", label: "Onion" },
          { id: "top-pickles", label: "Pickles" },
          { id: "top-jalapenos", label: "Jalapeños" },
          { id: "top-banana-peppers", label: "Banana Peppers" },
          { id: "top-sauteed-onions", label: "Sautéed Onions", priceDelta: 0.75 },
          { id: "top-mushrooms", label: "Mushrooms", priceDelta: 0.75 },
        ],
      },

      {
        id: "sauces",
        label: "Sauce (Choose Any)",
        type: "multi",
        required: false,
        options: [
          { id: "sauce-ketchup", label: "Ketchup" },
          { id: "sauce-mayo", label: "Mayo" },
          { id: "sauce-mustard", label: "Mustard" },
          { id: "sauce-bbq", label: "BBQ" },
          { id: "sauce-hot", label: "Hot Sauce" },
          { id: "sauce-gg", label: "G&G Sauce", priceDelta: 0.50 },
          { id: "sauce-ranch", label: "Ranch", priceDelta: 0.50 },
          { id: "sauce-blue-cheese", label: "Blue Cheese", priceDelta: 0.50 },
        ],
      },

      {
        id: "premium-adds",
        label: "Premium Adds",
        type: "multi",
        required: false,
        options: [
          { id: "add-bacon", label: "Add Bacon", priceDelta: 2.0 },
          { id: "add-extra-cheese", label: "Extra Cheese", priceDelta: 1.0 },
          { id: "add-fried-egg", label: "Add Fried Egg", priceDelta: 1.75 },
          { id: "add-avocado", label: "Add Avocado", priceDelta: 2.25 },
          { id: "add-double-patty", label: "Double Patty", priceDelta: 5.0 },
        ],
      },

      {
        id: "make-it-a-combo",
        label: "Make It a Combo",
        type: "single",
        required: false,
        options: [
          { id: "combo-no", label: "No Combo", default: true },
          { id: "combo-fries", label: "Add Fries + Drink", priceDelta: 5.0 },
          { id: "combo-rings", label: "Add Onion Rings + Drink", priceDelta: 6.0 },
        ],
      },

      {
        id: "instructions",
        label: "Special Instructions",
        type: "single",
        required: false,
        options: [
          { id: "instr-none", label: "None", default: true },
          { id: "instr-light", label: "Light on toppings/sauce" },
          { id: "instr-extra", label: "Extra on toppings/sauce" },
          { id: "instr-cut", label: "Cut in half" },
        ],
      },
    ],
  };
}

function steakSandwichItem() {
  return {
    id: "steak-sandwich",
    name: "Steak Sandwich",
    price: 13.99,
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
          { id: "mushrooms", label: "Mushrooms" },
          { id: "peppers", label: "Peppers" },
          { id: "extra-cheese", label: "Extra Cheese", priceDelta: 1.0 },
          { id: "bacon", label: "Add Bacon", priceDelta: 2.0 },
        ],
      },
    ],
  };
}

function wingsItem() {
  return {
    id: "wings-10",
    name: "Wings (10pc)",
    price: 14.49,
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
          { id: "garlic-parm", label: "Garlic Parm", priceDelta: 1.0 },
        ],
      },
    ],
  };
}

function menuLoc1() {
  return {
    sections: [
      {
        id: "top-picks",
        title: "Top Picks",
        note: "Fast favorites — tap to order",
        items: [
          // 🔥 Flagship first: Mandela Burger (signature)
          mandelaBurgerItem(),

          // Next most popular / core
          steakSandwichItem(),
          wingsItem(),
        ],
      },

      {
        id: "classics",
        title: "Classics",
        note: "Core categories (expand & perfect next)",
        items: [
          placeholderItem("cat-breakfast", "G&G Breakfast Menu", 0, "Tap to view breakfast items (coming next)."),
          placeholderItem("cat-steak-sandwiches", "G&G Steak Sandwiches", 0, "Tap to view steak sandwich lineup (coming next)."),
          placeholderItem("cat-burgers", "Burgers", 0, "Tap to view burgers (coming next)."),
          placeholderItem("cat-specialty-sandwiches", "Specialty Sandwiches (Fish, Chicken, Burgers)", 0, "Tap to view specialty sandwiches (coming next)."),
          placeholderItem("cat-wings", "Wings (pieces)", 0, "Tap to view wings by piece count (coming next)."),
          placeholderItem("cat-salads", "Salads", 0, "Tap to view salads (coming next)."),
          placeholderItem("cat-seafood", "Seafood", 0, "Tap to view seafood (coming next)."),
          placeholderItem("cat-dinners", "Dinners", 0, "Tap to view dinner plates (coming next)."),
          placeholderItem("cat-vegetarian", "Vegetarian World", 0, "Tap to view vegetarian options (coming next)."),
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
            price: 12.49,
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
                  { id: "bacon", label: "Add Bacon", priceDelta: 2.0 },
                  { id: "double-meat", label: "Double Meat", priceDelta: 4.0 },
                  { id: "extra-cheese", label: "Extra Cheese", priceDelta: 1.0 },
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
          placeholderItem("cat-beverages", "Beverages", 0, "Tap to view beverages (coming next)."),
          placeholderItem("cat-fizz-sodas", "Fizz Sodas", 0, "Tap to view fizz sodas (coming next)."),
          placeholderItem("cat-fries", "French Fries (Crinkle Cut)", 0, "Tap to view fries (coming next)."),
          placeholderItem("cat-onion-rings", "Onion Rings", 0, "Tap to view onion rings (coming next)."),
          placeholderItem("cat-side-dishes", "Side Dishes", 0, "Tap to view side dishes (coming next)."),
          placeholderItem("cat-side-sauce", "Side of Sauce", 0, "Tap to view sauces (coming next)."),
          placeholderItem("cat-desserts", "Desserts & Fruit", 0, "Tap to view desserts & fruit (coming next)."),
          placeholderItem("cat-bottled-sauce", "G&G Steakout II Bottled Sauce", 0, "Tap to view bottled sauce (coming next)."),
        ],
      },

      {
        id: "specials",
        title: "Specials",
        note: "Daily specials & limited-time",
        items: [
          placeholderItem("cat-daily-specials", "Daily Specials", 0, "Tap to view daily specials (coming next)."),
          placeholderItem("cat-specials", "Specials", 0, "Tap to view specials (coming next)."),
          placeholderItem("cat-small-gourmet-salads", "Small Gourmet Salads", 0, "Tap to view gourmet salads (coming next)."),
          placeholderItem("cat-specialty-sausage", "Specialty Beef Sausage Sandwiches", 0, "Tap to view sausage sandwiches (coming next)."),
        ],
      },
    ],
  };
}

export function getMenuForLocationId(locationId) {
  if (locationId === "loc-1") return menuLoc1();
  // loc-2: for now mirror loc-1; later you can swap to a different menu.
  return menuLoc1();
}
