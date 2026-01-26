// src/App.jsx
import { useMemo, useState } from "react";
import { LOCATIONS, getMenuForLocationId } from "./data/menu.js";

function money(n) {
  return `$${Number(n || 0).toFixed(2)}`;
}

function clampQty(n) {
  if (Number.isNaN(n)) return 1;
  return Math.max(1, Math.min(99, n));
}

function buildLineLabel(item, chosen) {
  const parts = [];

  const mode = chosen?.mode || "original";
  parts.push(mode === "original" ? "G&G Original" : "Customized");

  // Required single-choice groups
  if (chosen?.single) {
    for (const [groupId, optId] of Object.entries(chosen.single)) {
      const g = (item.optionGroups || []).find((x) => x.id === groupId);
      const o = g?.options?.find((x) => x.id === optId);
      if (g && o) parts.push(`${g.label}: ${o.label}`);
    }
  }

  // Multi-choice groups
  if (chosen?.multi) {
    for (const [groupId, optIds] of Object.entries(chosen.multi)) {
      const g = (item.optionGroups || []).find((x) => x.id === groupId);
      if (!g) continue;
      const labels = (optIds || [])
        .map((id) => g.options.find((x) => x.id === id))
        .filter(Boolean)
        .map((o) => o.label);
      if (labels.length) parts.push(`${g.label}: ${labels.join(", ")}`);
    }
  }

  return parts.join(" • ");
}

function calcOptionsDelta(item, chosen) {
  let delta = 0;

  const groups = item.optionGroups || [];
  const single = chosen?.single || {};
  const multi = chosen?.multi || {};

  for (const g of groups) {
    if (g.type === "single") {
      const picked = single[g.id];
      const opt = g.options.find((o) => o.id === picked);
      if (opt?.priceDelta) delta += opt.priceDelta;
    } else if (g.type === "multi") {
      const pickedList = multi[g.id] || [];
      for (const id of pickedList) {
        const opt = g.options.find((o) => o.id === id);
        if (opt?.priceDelta) delta += opt.priceDelta;
      }
    }
  }

  return delta;
}

function defaultChosenForItem(item) {
  // Default to G&G Original
  const chosen = { mode: "original", single: {}, multi: {} };

  // Preselect defaults for required single-choice groups (even though hidden until Customize)
  for (const g of item.optionGroups || []) {
    if (g.type === "single") {
      const def = g.options.find((o) => o.default) || g.options[0];
      if (def) chosen.single[g.id] = def.id;
    }
  }
  return chosen;
}

export default function App() {
  const [orderMode, setOrderMode] = useState("delivery"); // delivery default (locked)
  const [locationId, setLocationId] = useState(LOCATIONS[0]?.id || "loc-1");

  const menu = useMemo(() => getMenuForLocationId(locationId), [locationId]);

  // Slide-up panel state
  const [panelOpen, setPanelOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [qty, setQty] = useState(1);
  const [chosen, setChosen] = useState(null);

  // Cart (demo)
  const [cart, setCart] = useState([]);

  const cartCount = cart.reduce((sum, x) => sum + (x.qty || 0), 0);
  const cartTotal = cart.reduce((sum, x) => sum + (x.lineTotal || 0), 0);

  function openItem(item) {
    setActiveItem(item);
    setQty(1);
    setChosen(defaultChosenForItem(item));
    setPanelOpen(true);
  }

  function closePanel() {
    setPanelOpen(false);
    // keep activeItem around briefly? not needed
  }

  function setModeForItem(mode) {
    setChosen((prev) => ({ ...(prev || {}), mode }));
  }

  function toggleMulti(groupId, optId) {
    setChosen((prev) => {
      const next = { ...(prev || {}) };
      next.multi = { ...(next.multi || {}) };
      const list = new Set(next.multi[groupId] || []);
      if (list.has(optId)) list.delete(optId);
      else list.add(optId);
      next.multi[groupId] = Array.from(list);
      return next;
    });
  }

  function pickSingle(groupId, optId) {
    setChosen((prev) => {
      const next = { ...(prev || {}) };
      next.single = { ...(next.single || {}) };
      next.single[groupId] = optId;
      return next;
    });
  }

  function addToCart() {
    if (!activeItem) return;

    const optionsDelta = calcOptionsDelta(activeItem, chosen);
    const unit = (activeItem.price || 0) + optionsDelta;
    const q = clampQty(qty);

    const line = {
      id: crypto?.randomUUID ? crypto.randomUUID() : String(Date.now()),
      itemId: activeItem.id,
      name: activeItem.name,
      qty: q,
      unitPrice: unit,
      lineTotal: unit * q,
      detail: buildLineLabel(activeItem, chosen),
    };

    setCart((prev) => [line, ...prev]);
    closePanel();
  }

  const activeOptionsDelta = activeItem ? calcOptionsDelta(activeItem, chosen) : 0;
  const activeUnitPrice = activeItem ? (activeItem.price || 0) + activeOptionsDelta : 0;
  const activeLinePrice = activeUnitPrice * clampQty(qty);

  return (
    <div className="page">
      <header className="top">
        <div className="brand">
          <img className="logo" src="/logo.png" alt="G & G Steakout II" />
          <div className="brandText">
            <div className="title">G &amp; G Steakout II</div>
            <div className="subtitle">Mobile ordering — coming online</div>
          </div>

          <div className="spacer" />

          <div className="miniCart">
            <div className="miniCartLine">
              <span className="miniCartLabel">Cart</span>
              <span className="miniCartValue">{cartCount} item{cartCount === 1 ? "" : "s"}</span>
            </div>
            <div className="miniCartLine">
              <span className="miniCartLabel">Total</span>
              <span className="miniCartValue">{money(cartTotal)}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="shell">
        <section className="card controls">
          <div className="controlsRow">
            <div className="seg">
              <button
                className={orderMode === "delivery" ? "segBtn on" : "segBtn"}
                type="button"
                onClick={() => setOrderMode("delivery")}
              >
                Delivery
              </button>
              <button
                className={orderMode === "pickup" ? "segBtn on" : "segBtn"}
                type="button"
                onClick={() => setOrderMode("pickup")}
              >
                Pickup
              </button>
            </div>

            <div className="location">
              <label className="label" htmlFor="loc">
                Location
              </label>
              <select
                id="loc"
                className="select"
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
              >
                {LOCATIONS.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>

              <div className="hint">
                {orderMode === "delivery"
                  ? "Delivery address is asked at checkout — browse freely now."
                  : "Pickup details are confirmed at checkout — browse freely now."}
              </div>
            </div>
          </div>

          <div className="controlsRow2">
            <div className="pill">No login needed to view the menu</div>
            <div className="pill subtle">Reorder + Curbside will be added after accounts</div>
          </div>
        </section>

        <section className="card menu">
          <div className="menuHeader">
            <h1>Menu</h1>
            <div className="menuSub">
              Chunked for fast browsing: <b>Top Picks</b>, <b>Classics</b>, <b>Build Your Own</b>
            </div>
          </div>

          {menu.sections.map((section) => (
            <div key={section.id} className="section">
              <div className="sectionTop">
                <div className="sectionTitle">{section.title}</div>
                <div className="sectionNote">{section.note}</div>
              </div>

              <div className="row">
                {section.items.map((item) => (
                  <button key={item.id} className="itemCard" type="button" onClick={() => openItem(item)}>
                    <div className="itemMedia">
                      {item.media?.image ? (
                        <img className="itemImg" src={item.media.image} alt={item.name} loading="lazy" />
                      ) : (
                        <div className="itemImgPlaceholder">G&amp;G</div>
                      )}
                    </div>

                    <div className="itemBody">
                      <div className="itemName">{item.name}</div>
                      <div className="itemDesc">{item.description}</div>
                      <div className="itemBottom">
                        <div className="price">{money(item.price)}</div>
                        <div className="tap">Tap</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="card cart">
          <div className="cartTop">
            <div>
              <div className="cartTitle">Cart (demo)</div>
              <div className="cartSub">This is a working cart. Checkout comes next.</div>
            </div>
            <button className="btnPrimary" type="button" onClick={() => alert("Checkout is next (Phase 2).")}>
              Checkout (next)
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="empty">Your cart is empty — tap an item to begin.</div>
          ) : (
            <div className="cartList">
              {cart.map((line) => (
                <div key={line.id} className="cartLine">
                  <div className="cartLeft">
                    <div className="cartName">
                      {line.qty}× {line.name}
                    </div>
                    <div className="cartDetail">{line.detail}</div>
                  </div>
                  <div className="cartRight">{money(line.lineTotal)}</div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="footer">Powered by FlavorStream Buffet</footer>

      {/* Slide-up panel */}
      <div className={panelOpen ? "overlay on" : "overlay"} onClick={closePanel} role="presentation" />

      <aside className={panelOpen ? "panel on" : "panel"} aria-hidden={!panelOpen}>
        <div className="panelHandle" />
        <div className="panelInner">
          {activeItem && (
            <>
              <div className="panelTop">
                <div>
                  <div className="panelTitle">{activeItem.name}</div>
                  <div className="panelDesc">{activeItem.description}</div>
                </div>
                <button className="x" type="button" onClick={closePanel} aria-label="Close">
                  ✕
                </button>
              </div>

              <div className="panelMode">
                <div className="label">How do you want it?</div>
                <div className="seg">
                  <button
                    className={chosen?.mode === "original" ? "segBtn on" : "segBtn"}
                    type="button"
                    onClick={() => setModeForItem("original")}
                  >
                    G&amp;G Original
                  </button>
                  <button
                    className={chosen?.mode === "custom" ? "segBtn on" : "segBtn"}
                    type="button"
                    onClick={() => setModeForItem("custom")}
                  >
                    Customize
                  </button>
                </div>
                <div className="hint">
                  {chosen?.mode === "original"
                    ? "Fastest ticket. Classic prep."
                    : "We’ll only show options that matter — clean and easy."}
                </div>
              </div>

              {/* Options (only show when Customize) */}
              {chosen?.mode === "custom" && (activeItem.optionGroups || []).length > 0 && (
                <div className="options">
                  {(activeItem.optionGroups || []).map((g) => (
                    <div key={g.id} className="group">
                      <div className="groupTop">
                        <div className="groupTitle">{g.label}</div>
                        <div className="groupRule">
                          {g.required ? "Required" : "Optional"} • {g.type === "single" ? "Pick one" : "Pick any"}
                        </div>
                      </div>

                      {g.type === "single" ? (
                        <div className="optList">
                          {g.options.map((o) => {
                            const picked = chosen?.single?.[g.id] === o.id;
                            return (
                              <button
                                key={o.id}
                                type="button"
                                className={picked ? "opt on" : "opt"}
                                onClick={() => pickSingle(g.id, o.id)}
                              >
                                <span className="optLabel">{o.label}</span>
                                <span className="optRight">
                                  {o.priceDelta ? <span className="delta">+{money(o.priceDelta)}</span> : null}
                                  <span className="dot">{picked ? "●" : "○"}</span>
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="optList">
                          {g.options.map((o) => {
                            const list = chosen?.multi?.[g.id] || [];
                            const picked = list.includes(o.id);
                            return (
                              <button
                                key={o.id}
                                type="button"
                                className={picked ? "opt on" : "opt"}
                                onClick={() => toggleMulti(g.id, o.id)}
                              >
                                <span className="optLabel">{o.label}</span>
                                <span className="optRight">
                                  {o.priceDelta ? <span className="delta">+{money(o.priceDelta)}</span> : null}
                                  <span className="dot">{picked ? "☑" : "☐"}</span>
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="panelBottom">
                <div className="qty">
                  <button className="qtyBtn" type="button" onClick={() => setQty((n) => clampQty(n - 1))}>
                    –
                  </button>
                  <div className="qtyNum">{clampQty(qty)}</div>
                  <button className="qtyBtn" type="button" onClick={() => setQty((n) => clampQty(n + 1))}>
                    +
                  </button>
                </div>

                <button className="btnPrimary wide" type="button" onClick={addToCart}>
                  Add to Cart • {money(activeLinePrice)}
                </button>
              </div>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
