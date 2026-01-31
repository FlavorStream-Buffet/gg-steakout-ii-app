import { useMemo, useState } from "react";
import { LOCATIONS, getMenuForLocationId } from "./data/menu.js";

function money(n) {
  const v = Number(n || 0);
  return "$" + v.toFixed(2);
}

function normalizeMenu(menu) {
  if (!menu) return [];
  if (Array.isArray(menu)) return menu;
  if (Array.isArray(menu.sections)) return menu.sections;
  if (Array.isArray(menu.categories)) return menu.categories;
  return [];
}

function getHoursLines(location) {
  const hrs = (location && location.hours) || [];
  // supports either {days, hours} or {day, time}
  return hrs.map((h) => ({
    left: h.days || h.day || "",
    right: h.hours || h.time || "",
    key: (h.days || h.day || "") + "|" + (h.hours || h.time || ""),
  }));
}

export default function App() {
  const [fulfillment, setFulfillment] = useState("delivery"); // delivery | pickup
  const [locationId, setLocationId] = useState(LOCATIONS[0]?.id || "loc-1");

  const [activeItem, setActiveItem] = useState(null);
  const [mode, setMode] = useState("original"); // original | customize

  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  const location = useMemo(() => {
    return LOCATIONS.find((l) => l.id === locationId) || LOCATIONS[0];
  }, [locationId]);

  const hoursLines = useMemo(() => getHoursLines(location), [location]);

  const menuForLoc = useMemo(() => getMenuForLocationId(locationId), [locationId]);
  const sections = useMemo(() => normalizeMenu(menuForLoc), [menuForLoc]);

  function addToCart(item) {
    const price = Number(item?.price || 0);
    setCartCount((c) => c + 1);
    setCartTotal((t) => t + price);
    setActiveItem(null);
    setMode("original");
  }

  const headerBadge = fulfillment === "delivery" ? "Delivery" : "Pickup";

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
          <span className="badge mustard">{headerBadge}</span>
        </div>
      </div>

      {/* Fulfillment toggle */}
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
              {hoursLines.map((h) => (
                <div className="line" key={h.key}>
                  <span className="day">{h.left}</span>
                  <span className="time">{h.right}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Menu Sections (horizontal swipe chunks) */}
      {sections.map((section) => {
        const sectionTitle = section.title || section.name || "Menu";
        const sectionNote = section.note || "";

        return (
          <div key={section.id || sectionTitle}>
            <div className="sectionTitle">
              <h2>{sectionTitle}</h2>
              <div className="sub">{sectionNote ? sectionNote : "Tap an item to customize"}</div>
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
                    <div className="kicker">{sectionTitle}</div>
                    <div className="title">{item.name}</div>
                    <div className="meta">
                      <span className="muted">{item.description || item.desc || ""}</span>
                      <span className="accent">{money(item.price)}</span>
                    </div>
                  </div>
                </div>
              ))}
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
                Cart ({cartCount}) — {headerBadge}
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
                    Options <span className="hint">Wiring next</span>
                  </div>

                  <div className="notice">
                    This item’s option groups are already in <b>menu.js</b>. Next step is wiring
                    these controls so selections affect the price and cart.
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
