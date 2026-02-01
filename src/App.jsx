import { useMemo, useState } from "react";
import { LOCATIONS, getMenuForLocationId } from "./data/menu.js";

function money(n) {
  const v = Number(n || 0);
  return `$${v.toFixed(2)}`;
}

export default function App() {
  const [fulfillment, setFulfillment] = useState("delivery"); // delivery | pickup
  const [locationId, setLocationId] = useState(LOCATIONS?.[0]?.id || "loc-1");

  const [activeItem, setActiveItem] = useState(null);
  const [mode, setMode] = useState("original"); // original | customize

  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  const location = useMemo(() => {
    return (LOCATIONS || []).find((l) => l.id === locationId) || (LOCATIONS || [])[0];
  }, [locationId]);

  const menu = useMemo(() => getMenuForLocationId(locationId), [locationId]);
  const sections = useMemo(() => menu?.sections || [], [menu]);

  function addToCart(item) {
    const price = Number(item?.price || 0);
    setCartCount((c) => c + 1);
    setCartTotal((t) => t + price);
    setActiveItem(null);
    setMode("original");
  }

  return (
    <div className="container">
      {/* Header (NO in-page logo image — logo is background only) */}
      <div className="header">
        <div className="brand">
          <div className="brandName">G&amp;G Steakout II</div>
          <div className="brandTag">Mobile Ordering</div>
        </div>

        <div className="headerRight">
          <span className="headerMode">{fulfillment === "delivery" ? "Delivery" : "Pickup"}</span>
        </div>
      </div>

      {/* Fulfillment toggle (restored & visible) */}
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
        <div className="locationLabel">Location</div>

        <div className="locationRow">
          <select value={locationId} onChange={(e) => setLocationId(e.target.value)}>
            {(LOCATIONS || []).map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </div>

        {location?.hours?.length ? (
          <div className="storeHours">
            <div className="hoursTitle">
              <span>Store Hours</span>
              <span className="hoursBadge">Downtown</span>
            </div>

            <div className="hoursLines">
              {location.hours.map((h) => (
                <div className="line" key={h.days || h.day}>
                  <span className="day">{h.days || h.day}</span>
                  <span className="time">{h.hours || h.time}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {/* Menu Sections */}
      {sections.map((section) => (
        <div key={section.id || section.title}>
          <div className="sectionTitle">
            <h2>{section.title}</h2>
            <div className="sub">{section.note || "Tap an item to customize"}</div>
          </div>

          <div className="rowScroller">
            {(section.items || []).map((item) => (
              <div
                key={item.id || item.name}
                className="card"
                onClick={() => {
                  setActiveItem(item);
                  setMode("original");
                }}
              >
                <div className="cardInner">
                  <div className="kicker">{section.title}</div>
                  <div className="title">{item.name}</div>
                  <div className="meta">
                    <span className="desc">{item.description || item.desc || ""}</span>
                    <span className="accent">{money(item.price)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

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

      {/* Slide-up Item Sheet */}
      {activeItem && (
        <div className="sheetOverlay" onClick={() => setActiveItem(null)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheetHeader">
              <div className="titleWrap">
                <div className="itemTitle">{activeItem.name}</div>
                <div className="itemSub">{activeItem.description || activeItem.desc || ""}</div>
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
                Add to Cart — {money(activeItem.price)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
