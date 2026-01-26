// src/data/menu.js

// Multi-location ready: add more stores here later.
// Menus can diverge per location whenever you want.
export const LOCATIONS = [
  { id: "loc-1", name: "G & G Steakout II — Main Location" },
  { id: "loc-2", name: "G & G Steakout II — Location 2 (coming soon)" }
];

function baseMenu() {
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
                  { id: "roll-hoagie", label: "Hoagie Roll" }
                ]
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
                  { id: "extra-cheese", label: "Extra Cheese", priceDelta: 1.0 },
                  { id: "bacon", label: "Add Bacon", priceDelta: 2.0 }
                ]
              }
            ]
          },
          {
            id: "wings-10",
            name: "10pc Wings",
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
                  { id: "garlic-parm", label: "Garlic Parm", priceDelta: 1.0 }
                ]
              }
            ]
          },
          {
            id: "loaded-fries",
            name: "Loaded Fries",
            price: 8.99,
            description: "Fries loaded up — perfect side or snack.",
            media: { image: "" },
            optionGroups: [
              {
                id: "extras",
                label: "Extras",
                type: "multi",
                required: false,
                options: [
                  { id: "extra-cheese", label: "Extra Cheese", priceDelta: 1.0 },
                  { id: "bacon", label: "Add Bacon", priceDelta: 2.0 },
                  { id: "jalapenos", label: "Jalapeños" }
                ]
              }
            ]
          }
        ]
      },

      {
        id: "classics",
        title: "Classics",
        note: "The everyday go-to’s",
        items: [
          {
            id: "cheeseburger",
            name: "Cheeseburger",
            price: 11.49,
            description: "Juicy, classic, and built right.",
            media: { image: "" },
            optionGroups: [
              {
                id: "cook",
                label: "Cook Temp",
                type: "single",
                required: true,
                options: [
                  { id: "med", label: "Medium", default: true },
                  { id: "med-well", label: "Med-Well" },
                  { id: "well", label: "Well Done" }
                ]
              },
              {
                id: "burger-toppings",
                label: "Toppings",
                type: "multi",
                required: false,
                options: [
                  { id: "lettuce", label: "Lettuce" },
                  { id: "tomato", label: "Tomato" },
                  { id: "onions", label: "Onions" },
                  { id: "pickles", label: "Pickles" },
                  { id: "mayo", label: "Mayo" },
                  { id: "no-mayo", label: "No Mayo" }
                ]
              }
            ]
          },
          {
            id: "chicken-sub",
            name: "Chicken Sub",
            price: 12.99,
            description: "Hot, satisfying, and customizable.",
            media: { image: "" },
            optionGroups: [
              {
                id: "chicken-style",
                label: "Style",
                type: "single",
                required: true,
                options: [
                  { id: "grilled", label: "Grilled", default: true },
                  { id: "crispy", label: "Crispy" }
                ]
              },
              {
                id: "sub-extras",
                label: "Extras",
                type: "multi",
                required: false,
                options: [
                  { id: "extra-cheese", label: "Extra Cheese", priceDelta: 1.0 },
                  { id: "bacon", label: "Add Bacon", priceDelta: 2.0 }
                ]
              }
            ]
          }
        ]
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
                  { id: "veggie", label: "Veggie" }
                ]
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
                  { id: "none", label: "No Cheese" }
                ]
              },
              {
                id: "byo-toppings",
                label: "Toppings",
                type: "multi",
                required: false,
                options: [
                  { id: "lettuce", label: "Lettuce" },
                  { id: "tomato", label: "Tomato" },
                  { id: "onions", label: "Onions" },
                  { id: "mushrooms", label: "Mushrooms" },
                  { id: "peppers", label: "Peppers" },
                  { id: "jalapenos", label: "Jalapeños" }
                ]
              },
              {
                id: "premium",
                label: "Premium Adds",
                type: "multi",
                required: false,
                options: [
                  { id: "bacon", label: "Add Bacon", priceDelta: 2.0 },
                  { id: "double-meat", label: "Double Meat", priceDelta: 4.0 },
                  { id: "extra-cheese", label: "Extra Cheese", priceDelta: 1.0 }
                ]
              }
            ]
          }
        ]
      }
    ]
  };
}

export function getMenuForLocationId(locationId) {
  // Right now: same menu for both locations.
  // Later: switch/copy menus per location here.
  // Example: if (locationId === "loc-2") return { ... }
  return baseMenu();
}
