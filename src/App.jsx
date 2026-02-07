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
  const [mode, setMode] = useState("original"); // original | customize
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerClosing, setDrawerClosing] = useState(false);

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

  function openDrawer() {
    setDrawerClosing(false);
    setDrawerOpen(true);
  }

  function closeDrawer() {
    // play slide-out animation, then unmount
    setDrawerClosing(true);
    window.setTimeout(() => {
      setDrawerOpen(false);
      setDrawerClosing(false);
    }, 240);
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

        {/* Drawer button */}
        <button className="drawerBtn" onClick={openDrawer} aria-label="Open menu">
          ☰
        </button>
      </div>

      {/* Drawer */}
      {drawerOpen && (
        <>
          <div className={`drawerOverlay ${drawerClosing ? "closing" : ""}`} onClick={closeDrawer} />

          <div className={`drawerPanel ${drawerClosing ? "closing" : ""}`} role="dialog" aria-label="Menu">
            <div className="drawerTop">
              <button className="drawerClose" onClick={closeDrawer} aria-label="Close">
                ✕
              </button>
            </div>

            <div className="drawerLogoWrap">
              <img className="drawerLogo" src="/logo.png" alt="G&G Steakout II" />
            </div>

            <div className="drawerList">
              {["Rewards & Savings", "G&G Sauces", "Account", "Curbside"].map((label) => (
                <button
                  key={label}
                  className="drawerItem"
                  onClick={() => alert(`${label} — coming next.`)}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="drawerNote">
              This stays out of the ordering flow so the menu stays clean.
            </div>
          </div>
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
                    <span className="muted">{item.description || item.desc || " "}</span>
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
