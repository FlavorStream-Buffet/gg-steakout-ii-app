export const LOCATIONS = [{
  id: "loc-1",
  name: "Downtown — 350 East Main Street, Rochester, NY",
  hours: [
    { days: "Mon – Wed", hours: "6:30am – 7:00pm" },
    { days: "Thurs – Sat", hours: "6:30am – 9:00pm" },
    { days: "Sunday", hours: "Closed" },
  ],
}];

const item = (id, name, price, description = "Prepared fresh to order.", extra = {}) => ({
  id, name, price, description, optionGroups: [], ...extra,
});

const sideChoice = {
  id: "side",
  label: "Choose one side",
  required: true,
  options: [
    { id: "crinkle-fries", label: "Crinkle Cut Fries" },
    { id: "sweet-potato-fries", label: "Sweet Potato Fries" },
    { id: "macaroni-salad", label: "Macaroni Salad" },
    { id: "potato-salad", label: "Potato Salad" },
    { id: "onion-rings", label: "Onion Rings" },
  ],
};

const drinkChoice = {
  id: "drink",
  label: "Choose a 16 oz drink",
  required: true,
  options: [
    { id: "lemonade", label: "Mr. G's Pucker Up Lemonade" },
    { id: "iced-tea", label: "Iced Tea" },
  ],
};

export const MENU_SECTIONS = [
  {
    id: "specials", title: "Featured Specials",
    note: "The deals G&G wants front and center", featured: true,
    items: [
      item("daily-10", "$10 Daily Meal Deal", 10, "Choose an entrée, one side, and a 16 oz drink.", {
        badge: "DAILY DEAL",
        optionGroups: [
          {
            id: "entree", label: "Choose an entrée", required: true,
            options: [
              { id: "mini-steak", label: "Mini Steak Sandwich" },
              { id: "three-wings", label: "3 Whole Wings" },
              { id: "five-tenders", label: "5 Piece Chicken Tenders" },
              { id: "double-cheeseburger", label: "Double Cheeseburger" },
              { id: "spicy-chicken", label: "Spicy Chicken Sandwich" },
            ],
          },
          sideChoice, drinkChoice,
        ],
      }),
      item("mini-steak-wings-special", "Mini Steak Combo + 3 Wings", 12, "Mini steak combo with three wings and one side.", {
        badge: "$12 SPECIAL",
        optionGroups: [
          sideChoice,
          {
            id: "add-drink", label: "Add a 16 oz drink",
            options: [
              { id: "none", label: "No drink", default: true },
              { id: "lemonade", label: "Mr. G's Pucker Up Lemonade", priceDelta: 2 },
              { id: "iced-tea", label: "Iced Tea", priceDelta: 2 },
            ],
          },
        ],
      }),
      item("wednesday-bogo", "Wednesday Steak BOGO", 18, "Buy one Small Regular Steak Sandwich and get the second half price.", {
        badge: "WEDNESDAY ONLY", compareAt: 24,
        optionGroups: [{
          id: "combo", label: "Supersize both sandwiches",
          options: [
            { id: "no", label: "Sandwiches only", default: true },
            { id: "yes", label: "Add 2 sides + 2 drinks", priceDelta: 10 },
          ],
        }],
      }),
      item("shrimp-meal-deal", "5 Colossal Shrimp & Fries", 10, "Five colossal fried shrimp served with fries.", {
        badge: "THURS–SAT ONLY",
      }),
    ],
  },
  {
    id: "steak-sandwiches", title: "Steak Sandwiches",
    note: "Regular, deluxe, and Siberian favorites",
    items: [
      item("mini-regular-steak", "Mini Regular Steak", 7),
      item("mini-regular-steak-fries", "Mini Regular Steak with Fries Combo", 10),
      item("mini-deluxe-steak", "Mini Deluxe Steak", 10),
      item("mini-deluxe-steak-fries", "Mini Deluxe Steak with Fries Combo", 12),
      item("small-regular-steak", "Small Regular Steak", 12),
      item("small-regular-deluxe", "Small Regular Deluxe Steak", 14),
      item("jumbo-regular-steak", "Jumbo Regular Steak", 16),
      item("jumbo-regular-deluxe", "Jumbo Regular Deluxe Steak", 18),
      item("regular-supreme-siberian", "Regular Supreme Siberian", 20),
      item("deluxe-supreme-siberian", "Deluxe Supreme Siberian", 22),
    ],
  },
  {
    id: "burgers-sausage", title: "Burgers & Beef Sausage", note: "G&G originals",
    items: [
      item("regular-mandela", "Regular Mandela Burger", 15),
      item("deluxe-mandela", "Mandela Deluxe Burger", 17),
      item("regular-hamburger", "Regular Hamburger", 4),
      item("deluxe-hamburger", "Deluxe Hamburger", 6),
      item("regular-beef-sausage", "Regular Beef Sausage", 10),
      item("deluxe-beef-sausage", "Deluxe Beef Sausage", 12),
    ],
  },
  {
    id: "wings", title: "Wings", note: "Whole wings and wingettes",
    items: [
      item("10-wingettes", "10 Piece Wingettes", 18),
      item("20-wingettes", "20 Piece Wingettes", 28),
      item("6-wings-fries", "6 Wings with Fries", 12),
      item("3-wing-snack", "3 Wing Snack Pack", 8),
    ],
  },
  {
    id: "hoagies-fish", title: "Hoagies & Fish", note: "Chicken, fish, and fish-fry favorites",
    items: [
      item("regular-chicken-hoagie", "Regular Chicken Hoagie", 16),
      item("deluxe-chicken-hoagie", "Deluxe Chicken Hoagie", 18),
      item("regular-fish-hoagie", "Regular Fish Hoagie", 16),
      item("deluxe-fish-hoagie", "Deluxe Fish Hoagie", 18),
      item("haddock-fish-fry", "Haddock Fish Fry", 25),
      item("catfish", "Catfish", 7),
      item("whiting", "Whiting", 7),
    ],
  },
  {
    id: "fries", title: "Fries & Sides", note: "Add something on the side",
    items: [
      item("french-fries-small", "French Fries — Small", 4),
      item("french-fries-large", "French Fries — Large", 6),
      item("sweet-potato-fries-regular", "Sweet Potato Fries — Regular", 4),
      item("sweet-potato-fries-large", "Sweet Potato Fries — Large", 6),
    ],
  },
  {
    id: "drinks", title: "Drinks", note: "Cold drinks to complete the order",
    items: [
      item("lemonade-tea-small", "Lemonade or Iced Tea — Small", 3),
      item("lemonade-tea-large", "Lemonade or Iced Tea — Large", 5),
      item("water", "Water", 2),
      item("soda", "Soda", 3),
      item("four-sodas", "4 Sodas", 10),
    ],
  },
];

export function getMenuForLocationId() {
  return { sections: MENU_SECTIONS };
}
