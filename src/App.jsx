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
  return hrs.map((h) => ({
    left: h.days || h.day || "",
    right: h.hours || h.time || "",
    key: (h.days || h.day || "") + "|" + (h.hours || h.time || ""),
  }));
}

function findItemByNameLike(sections, needle) {
  const n = String(needle || "").toLowerCase().trim();
  if (!n) return null;
  for (const sec of sections || []) {
    for (const item of sec.items || []) {
      const name = String(item?.name || "").toLowerCase();
      if (name.includes(n)) return item;
    }
  }
  return null;
}

function findItemById(sections, id) {
  for (const sec of sections || []) {
    for (const item of sec.items || []) {
      if (item?.id === id) return item;
    }
  }
  return null;
}

export default function App() {
  const [fulfillment, setFulfillment] = useState("delivery");
  const [locationId, setLocationId] = useState(LOCATIONS[0]?.id || "loc-1");

  const [activeItem, setActiveItem] = useState(null);
  const [mode, setMode] = useState("original");

  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  const location = useMemo(() => {
    return LOCATIONS.find((l) => l.id === locationId) || LOCATIONS[0];
  }, [locationId]);

  const hoursLines = useMemo(() => getHoursLines(location), [location]);

  const menuForLoc = useMemo(() => getMenuForLocationId(locationId), [locationId]);
  const sections = useMemo(() => normalizeMenu(menuForLoc), [menuForLoc]);

  const featuredSteak =
    findItemById(sections, "steak-sandwich") || findItemByNameLike(sections, "steak sandwich");
  const featuredMandela = findItemByNameLike(sections, "mandela burger");

  const headerBadge = fulfillment === "delivery" ? "Delivery" : "Pickup";

  function openItem(item) {
    if (!item) return;
    setActiveItem(item);
    setMode("original");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function addToCart(item) {
    const price = Number(item?.price || 0);
    setCartCount((c) => c + 1);
    setCartTotal((t) => t + price);
    setActiveItem(null);
    setMode("original");
  }

  return (
    <div className="container">
      {/* FIXED HERO BANNER (logo is the background) */}
      <div className="heroBanner">
        <div className="heroTopRow">
          <span className="badge mustard">{headerBadge}</span>
        </div>

        <div className="heroLogoWrap">
          <img className="heroLogo" src="/logo.png" alt="G&G Steakout II" />
        </div>

        <div className="heroSeam" />
      </div>

      {/* Featured “Metal Plates” */}
      <div style={{ marginTop: 4 }}>
        <div className="sectionTitle" style={{ marginTop: 8 }}>
          <h2>G&amp;G Signature</h2>
          <div className="sub">House plates — front and center</div>
        </div>

        <div className="featureGrid">
          <div
            className="metalPlate"
            onClick={() => openItem(featuredSteak)}
            style={{ cursor: featuredSteak ? "pointer" : "default" }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && openItem(featuredSteak)}
          >
            <div className="platePad">
              <div className="plateTop">
                <span className="badge ember">HOUSE PLATE</span>
                <span style={{ fontWeight: 1000, color: "rgba(0,0,0,.90)" }}>
                  {featuredSteak ? money(featuredSteak.price) : ""}
                </span>
              </div>
              <div className="plateTitle">Steak Sandwiches</div>
              <div className="plateDesc">
                {featuredSteak
                  ? featuredSteak.description || featuredSteak.desc || "Tap to order"
                  : "Not found in menu yet"}
              </div>
            </div>
            <div className="plateEdge" />
          </div>

          <div
            className="metalPlate"
            onClick={() => openItem(featuredMandela)}
            style={{ cursor: featuredMandela ? "pointer" : "default" }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && openItem(featuredMandela)}
          >
            <div className="platePad">
              <div className="plateTop">
                <span className="badge mustard">SIGNATURE</span>
                <span style={{ fontWeight: 1000, color: "rgba(0,0,0,.90)" }}>
                  {featuredMandela ? money(featuredMandela.price) : ""}
                </span>
              </div>
              <div className="plateTitle">Mandela Burger</div>
              <div className="plateDesc">
                {featuredMandela
                  ? featuredMandela.description || featuredMandela.desc || "Tap to order"
                  : "Not found in menu yet"}
              </div>
            </div>
            <div className="plateEdge" />
          </div>
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

      {/* Menu Sections */}
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
              <div className="label">Cart ({cartCount}) — {headerBadge}</div>
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
                  <div className="notice">
                    Options wiring is next (your menu.js already has the groups). We’re keeping this
                    stable while we polish visuals.
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
