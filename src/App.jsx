import { useMemo, useState } from "react";
import { LOCATIONS, getMenuForLocationId } from "./data/menu.js";

function money(n) {
  const v = Number(n || 0);
  return `$${v.toFixed(2)}`;
}

function normalizeMenu(menu) {
  if (!menu) return [];
  if (Array.isArray(menu)) return menu;
  if (Array.isArray(menu.sections)) return menu.sections;
  return [];
}

export default function App() {
  const [fulfillment, setFulfillment] = useState("delivery"); // delivery | pickup | curbside
  const [locationId, setLocationId] = useState(LOCATIONS?.[0]?.id || "loc-1");

  const [activeItem, setActiveItem] = useState(null);
  const [mode, setMode] = useState("original"); // original | customize (kept for later)
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  const location = useMemo(() => {
    return LOCATIONS.find((l) => l.id === locationId) || LOCATIONS[0];
  }, [locationId]);

  const sections = useMemo(() => {
    const menu = getMenuForLocationId(locationId);
    return normalizeMenu(menu);
  }, [locationId]);

  function addToGrill(item) {
    setCartCount((c) => c + 1);
    setCartTotal((t) => t + Number(item?.price || 0));
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

        {/* Pocket Door button (top-right) */}
        <button
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
          style={{
            marginLeft: "auto",
            minHeight: 40,
            minWidth: 44,
            padding: "8px 12px",
            borderRadius: 14,
            border: "1px solid rgba(0,0,0,.18)",
            background: "rgba(255,255,255,.20)",
            backdropFilter: "blur(10px)",
            fontWeight: 950,
            cursor: "pointer",
            color: "#111",
          }}
        >
          ☰
        </button>
      </div>

      {/* Pocket Door (Slide-over Drawer) */}
      {drawerOpen && (
        <>
          {/* Dim overlay */}
          <div
            onClick={() => setDrawerOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,.45)",
              zIndex: 50,
            }}
          />

          {/* Drawer panel */}
          <div
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              height: "100%",
              width: "85%",
              maxWidth: 420,
              zIndex: 60,
              background: "linear-gradient(180deg, #1c1c1f, #0f0f12)",
              boxShadow: "-18px 0 40px rgba(0,0,0,.55)",
              borderLeft: "1px solid rgba(255,255,255,.08)",
              padding: 18,
              display: "flex",
              flexDirection: "column",
              gap: 16,
              transform: "translateX(0)",
              animation: "ggDrawerIn .22s ease-out",
            }}
          >
            {/* Close row */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => setDrawerOpen(false)}
                aria-label="Close"
                style={{
                  minHeight: 40,
                  minWidth: 40,
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,.10)",
                  background: "rgba(255,255,255,.06)",
                  color: "#f2f2f2",
                  cursor: "pointer",
                  fontWeight: 950,
                }}
              >
                ✕
              </button>
            </div>

            {/* Logo badge */}
            <div style={{ textAlign: "center", paddingTop: 2 }}>
              <img
                src="/logo.png"
                alt="G&G Steakout II"
                style={{
                  width: 150,
                  height: "auto",
                  filter: "drop-shadow(0 10px 22px rgba(0,0,0,.65))",
                }}
              />
              <div
                style={{
                  marginTop: 10,
                  color: "rgba(255,255,255,.85)",
                  fontWeight: 900,
                  letterSpacing: ".2px",
                }}
              >
                Pocket Door
              </div>
            </div>

            {/* Vertical list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 6 }}>
              {[
                "Rewards & Savings",
                "G&G Sauces",
                "Account",
                "Curbside",
              ].map((label) => (
                <button
                  key={label}
                  onClick={() => alert(`${label} — coming next.`)}
                  style={{
                    textAlign: "left",
                    padding: "14px 14px",
                    borderRadius: 16,
                    border: "1px solid rgba(255,255,255,.10)",
                    background: "rgba(255,255,255,.06)",
                    color: "rgba(255,255,255,.92)",
                    fontWeight: 950,
                    cursor: "pointer",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Small note */}
            <div style={{ marginTop: "auto", color: "rgba(255,255,255,.55)", fontSize: 12 }}>
              This panel stays out of the ordering flow so the menu stays clean.
            </div>
          </div>

          {/* Keyframes (inline, so we don’t touch styles.css) */}
          <style>{`
            @keyframes ggDrawerIn {
              from { transform: translateX(100%); }
              to { transform: translateX(0%); }
            }
          `}</style>
        </>
      )}

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
        <button
          className={`toggle ${fulfillment === "curbside" ? "active" : ""}`}
          onClick={() => setFulfillment("curbside")}
        >
          Curbside
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
              {(location?.hours || []).map((h) => (
                <div className="line" key={h.days || h.day}>
                  <span className="day">{h.days || h.day}</span>
                  <span className="time">{h.hours || h.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Menu Sections */}
      {sections.map((section) => (
        <div key={section.id || section.title}>
          <div className="sectionTitle">
            <h2>{section.title || "Menu"}</h2>
            <div className="sub">Tap an item to customize</div>
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
                  <div className="kicker">{section.title || "Category"}</div>
                  <div className="title">{item.name}</div>
                  <div className="meta">
                    <span className="muted">
                      {item.description || item.desc || " "}
                    </span>
                    <span className="accent">{money(item.price)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Bottom Grill */}
      <div className="bottomBar">
        <div className="inner">
          <button className="cartPill" onClick={() => alert("Grill detail view coming next.")}>
            <div className="left">
              <div className="label">
                Grill ({cartCount}) —{" "}
                {fulfillment === "delivery"
                  ? "Delivery"
                  : fulfillment === "pickup"
                  ? "Pickup"
                  : "Curbside"}
              </div>
              <div className="sub">Checkout placeholder</div>
            </div>
            <div className="total">{money(cartTotal)}</div>
          </button>
        </div>
      </div>

      {/* Item Sheet */}
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
              {/* Mode tabs kept for later (Mandela Burger options etc.) */}
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
                      <div className="name">GG Sauce</div>
                      <div className="right">
                        <label className="muted2">
                          Mild <input type="radio" name="ggsauce" defaultChecked />
                        </label>
                        <label className="muted2">
                          Hot <input type="radio" name="ggsauce" />
                        </label>
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
                      <div className="name">Extra Sauce</div>
                      <div className="right">
                        <span className="muted2">+ $0.50</span>
                        <input type="checkbox" />
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
              <button className="btn primary" onClick={() => addToGrill(activeItem)}>
                Send to Grill — {money(activeItem.price)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
