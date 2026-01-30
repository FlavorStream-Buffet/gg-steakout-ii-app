import { useMemo, useState } from "react";
import menuData from "./data/menu.js";

const LOCATIONS = [
  {
    id: "downtown",
    name: "Downtown — 350 East Main Street, Rochester, NY",
    hours: [
      { day: "Mon–Wed", time: "6:30am–7pm" },
      { day: "Thurs–Sat", time: "6:30am–9pm" },
      { day: "Sunday", time: "Closed" },
    ],
  },
];

function money(n) {
  const v = Number(n || 0);
  return `$${v.toFixed(2)}`;
}

function normalizeMenu(menu) {
  if (!menu) return [];
  if (Array.isArray(menu)) return menu;
  if (Array.isArray(menu.categories)) return menu.categories;
  if (Array.isArray(menu.sections)) return menu.sections;
  if (Array.isArray(menu.menu)) return menu.menu;
  if (Array.isArray(menu.data)) return menu.data;
  return [];
}

function normalizeItems(section) {
  if (!section) return [];
  if (Array.isArray(section.items)) return section.items;
  if (Array.isArray(section.products)) return section.products;
  if (Array.isArray(section.list)) return section.list;
  return [];
}

export default function App() {
  const [fulfillment, setFulfillment] = useState("delivery"); // delivery | pickup
  const [locationId, setLocationId] = useState(LOCATIONS[0].id);

  const [activeItem, setActiveItem] = useState(null);
  const [mode, setMode] = useState("original"); // original | customize

  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  const location = useMemo(
    () => LOCATIONS.find((l) => l.id === locationId) || LOCATIONS[0],
    [locationId]
  );

  const sections = useMemo(() => normalizeMenu(menuData), []);

  function addToCart(item) {
    const price = Number(item?.price || 0);
    setCartCount((c) => c + 1);
    setCartTotal((t) => t + price);
    setActiveItem(null);
    setMode("original");
  }

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <div className="brand">
          <img src="/logo.png" alt="G&G Steakout II" />
          <div className="titles">
            <div className="name">G&amp;G Steakout II</div>
            <div className="tag">Mobile Ordering</div>
          </div>
        </div>

        <div style={{ marginLeft: "auto" }} className="pill">
          <span className="badge mustard">
            {fulfillment === "delivery" ? "Delivery" : "Pickup"}
          </span>
        </div>
      </div>

      {/* Delivery / Pickup */}
      <div className="toggleRow">
        <button
          className={`toggle ${fulfillment === "delivery" ? "active" : ""}`}
          onClick={() => setFulfillment("delivery")}
        >
          Delivery
        </button>
        <button
          className={`toggle ${fulfillment === "pickup" ? "active" : ""}`}
          onClick={() => setFulfillment("pickup")}
        >
          Pickup
        </button>
      </div>

      {/* Location + Hours */}
      <div className="locationBlock">
        <div className="locationInner">
          <div className="locationLabel">Location</div>

          <div className="locationRow">
            <select value={locationId} onChange={(e) => setLocationId(e.target.value)}>
              {LOCATIONS.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          <div className="storeHours">
            <div className="hoursTitle">
              <span>Store Hours</span>
              <span className="badge ember">Downtown</span>
            </div>

            <div className="hoursLines">
              {location.hours.map((h) => (
                <div className="line" key={h.day}>
                  <span className="day">{h.day}</span>
                  <span className="time">{h.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Menu Sections */}
      {sections.map((section, idx) => {
        const title = section?.name || section?.title || section?.category || `Menu ${idx + 1}`;
        const items = normalizeItems(section);

        return (
          <div key={`${title}-${idx}`}>
            <div className="sectionTitle">
              <h2>{title}</h2>
              <div className="sub">Tap an item to customize</div>
            </div>

            <div className="rowScroller">
              {items.map((item, j) => (
                <div
                  key={`${item?.id || item?.name || "item"}-${j}`}
                  className="card"
                  onClick={() => {
                    setActiveItem(item);
                    setMode("original");
                  }}
                >
                  <div className="cardInner">
                    <div className="kicker">{title}</div>
                    <div className="title">{item?.name || "Item"}</div>
                    <div className="meta">
                      <span className="muted">{item?.desc || item?.description || ""}</span>
                      <span className="accent">{money(item?.price)}</span>
                    </div>
                  </div>
                </div>
              ))}

              {items.length === 0 && (
                <div className="notice">
                  No items found for <b>{title}</b>. (Menu data shape mismatch — safe fallback.)
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Bottom Cart */}
      <div className="bottomBar">
        <div className="inner">
          <button className="cartPill" onClick={() => alert("Checkout coming soon.")}>
            <div className="left">
              <div className="label">
                Cart ({cartCount}) — {fulfillment === "delivery" ? "Delivery" : "Pickup"}
              </div>
              <div className="sub">Checkout placeholder</div>
            </div>
            <div className="total">{money(cartTotal)}</div>
          </button>
        </div>
      </div>

      {/* Slide-up item panel */}
      {activeItem && (
        <div className="sheetOverlay" onClick={() => setActiveItem(null)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheetHeader">
              <div className="titleWrap">
                <div className="itemTitle">{activeItem?.name || "Item"}</div>
                <div className="itemSub">{activeItem?.desc || activeItem?.description || ""}</div>
              </div>
              <button className="closeBtn" onClick={() => setActiveItem(null)} aria-label="Close">
                ✕
              </button>
            </div>

            <div className="sheetBody">
              <div className="modeTabs">
                <button
                  className={`tab ${mode === "original" ? "active" : ""}`}
                  onClick={() => setMode("original")}
                >
                  G&amp;G Original
                </button>
                <button
                  className={`tab ${mode === "customize" ? "active" : ""}`}
                  onClick={() => setMode("customize")}
                >
                  Customize
                </button>
              </div>

              {mode === "customize" ? (
                <div className="optionGroup">
                  <div className="groupTitle">
                    Options <span className="hint">Demo controls</span>
                  </div>

                  <div className="optionRow">
                    <div className="choice">
                      <div className="name">Extra Sauce</div>
                      <div className="right">
                        <span className="muted2">+ $0.50</span>
                        <input type="checkbox" />
                      </div>
                    </div>

                    <div className="choice">
                      <div className="name">Add Cheese</div>
                      <div className="right">
                        <span className="muted2">+ $0.75</span>
                        <input type="checkbox" />
                      </div>
                    </div>

                    <div className="choice">
                      <div className="name">Spice Level</div>
                      <div className="right">
                        <label className="muted2">
                          Mild <input type="radio" name="spice" defaultChecked />
                        </label>
                        <label className="muted2">
                          Hot <input type="radio" name="spice" />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="notice">
                  This item is shown as the <b>G&amp;G Original</b>. Switch to <b>Customize</b> to
                  reveal options.
                </div>
              )}
            </div>

            <div className="sheetFooter">
              <button className="btn ghost" onClick={() => setActiveItem(null)}>
                Cancel
              </button>
              <button className="btn primary" onClick={() => addToCart(activeItem)}>
                Add to Cart — {money(activeItem?.price)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
