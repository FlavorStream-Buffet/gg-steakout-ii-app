import { useEffect, useMemo, useState } from "react";
import { LOCATIONS, getMenuForLocationId } from "./data/menu.js";

function money(n) {
  const v = Number(n || 0);
  return `$${v.toFixed(2)}`;
}

function getDefaultSelections(item) {
  const groups = Array.isArray(item?.optionGroups) ? item.optionGroups : [];
  const sel = {};

  for (const g of groups) {
    if (g.type === "single") {
      const opts = Array.isArray(g.options) ? g.options : [];
      const def = opts.find((o) => o.default) || (g.required ? opts[0] : null);
      sel[g.id] = def ? def.id : "";
    } else if (g.type === "multi") {
      sel[g.id] = [];
    }
  }

  return sel;
}

function calcPrice(item, selections) {
  const base = Number(item?.price || 0);
  const groups = Array.isArray(item?.optionGroups) ? item.optionGroups : [];

  let delta = 0;

  for (const g of groups) {
    const opts = Array.isArray(g.options) ? g.options : [];
    const chosen = selections?.[g.id];

    if (g.type === "single") {
      const picked = opts.find((o) => o.id === chosen);
      delta += Number(picked?.priceDelta || 0);
    } else if (g.type === "multi") {
      const ids = Array.isArray(chosen) ? chosen : [];
      for (const id of ids) {
        const picked = opts.find((o) => o.id === id);
        delta += Number(picked?.priceDelta || 0);
      }
    }
  }

  return base + delta;
}

export default function App() {
  const [fulfillment, setFulfillment] = useState("delivery"); // delivery | pickup | curbside
  const [locationId, setLocationId] = useState(LOCATIONS?.[0]?.id || "loc-1");

  const [activeItem, setActiveItem] = useState(null);
  const [mode, setMode] = useState("original"); // original | customize

  const [selections, setSelections] = useState({});
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  const location = useMemo(
    () => LOCATIONS.find((l) => l.id === locationId) || LOCATIONS[0],
    [locationId]
  );

  const menu = useMemo(() => getMenuForLocationId(locationId), [locationId]);

  // Pricing order strategy: highest -> lowest price inside each section
  const sections = useMemo(() => {
    const secs = Array.isArray(menu?.sections) ? menu.sections : [];
    return secs.map((s) => {
      const items = Array.isArray(s.items) ? s.items.slice() : [];
      items.sort((a, b) => Number(b?.price || 0) - Number(a?.price || 0));
      return { ...s, items };
    });
  }, [menu]);

  const computedPrice = useMemo(() => {
    if (!activeItem) return 0;
    return calcPrice(activeItem, selections);
  }, [activeItem, selections]);

  useEffect(() => {
    if (!activeItem) return;
    setSelections(getDefaultSelections(activeItem));
    setMode("original");
  }, [activeItem]);

  function addToCart(item) {
    const price = Number(calcPrice(item, selections) || 0);
    setCartCount((c) => c + 1);
    setCartTotal((t) => t + price);
    setActiveItem(null);
    setMode("original");
  }

  function toggleMulti(groupId, optionId) {
    setSelections((prev) => {
      const current = Array.isArray(prev[groupId]) ? prev[groupId] : [];
      const exists = current.includes(optionId);
      const next = exists ? current.filter((x) => x !== optionId) : [...current, optionId];
      return { ...prev, [groupId]: next };
    });
  }

  function setSingle(groupId, optionId) {
    setSelections((prev) => ({ ...prev, [groupId]: optionId }));
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
            {fulfillment === "delivery"
              ? "Delivery"
              : fulfillment === "pickup"
              ? "Pickup"
              : "Curbside"}
          </span>
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
                <div className="line" key={h.days}>
                  <span className="day">{h.days}</span>
                  <span className="time">{h.hours}</span>
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
            <div className="sub">{section.note || "Tap an item to customize"}</div>
          </div>

          <div className="rowScroller">
            {(section.items || []).map((item) => (
              <div
                key={item.id || item.name}
                className="card"
                onClick={() => setActiveItem(item)}
              >
                <div className="cardInner">
                  <div className="kicker">{section.title || "Category"}</div>
                  <div className="title">{item.name}</div>
                  <div className="meta">
                    <span className="muted">
                      {item.description || item.desc || ""}
                    </span>
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
                Cart ({cartCount}) —{" "}
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
                Array.isArray(activeItem.optionGroups) && activeItem.optionGroups.length > 0 ? (
                  activeItem.optionGroups.map((g) => (
                    <div className="optionGroup" key={g.id}>
                      <div className="groupTitle">
                        {g.label}
                        <span className="hint">
                          {g.required ? "Required" : g.type === "multi" ? "Optional" : "Optional"}
                        </span>
                      </div>

                      <div className="optionRow">
                        {(g.options || []).map((o) => {
                          const delta = Number(o.priceDelta || 0);
                          const priceTag = delta > 0 ? `+ ${money(delta)}` : "";

                          if (g.type === "single") {
                            const checked = selections[g.id] === o.id;
                            return (
                              <div className="choice" key={o.id}>
                                <div className="name">{o.label}</div>
                                <div className="right">
                                  {priceTag ? <span className="muted2">{priceTag}</span> : null}
                                  <input
                                    type="radio"
                                    name={g.id}
                                    checked={checked}
                                    onChange={() => setSingle(g.id, o.id)}
                                  />
                                </div>
                              </div>
                            );
                          }

                          // multi
                          const current = Array.isArray(selections[g.id]) ? selections[g.id] : [];
                          const checked = current.includes(o.id);

                          return (
                            <div className="choice" key={o.id}>
                              <div className="name">{o.label}</div>
                              <div className="right">
                                {priceTag ? <span className="muted2">{priceTag}</span> : null}
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => toggleMulti(g.id, o.id)}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="notice">
                    No options yet for this item — we’ll build these next.
                  </div>
                )
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
                Add to Cart — {money(computedPrice)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
