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

  // Featured “House Plates”
  const featuredSteak =
    findItemById(sections, "steak-sandwich") || findItemByNameLike(sections, "steak sandwich");
  const featuredMandela = findItemByNameLike(sections, "mandela burger");

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

  const headerBadge = fulfillment === "delivery" ? "Delivery" : "Pickup";

  // Full-width helper style (break out of container cleanly)
  const fullBleed = {
    width: "100vw",
    marginLeft: "calc(50% - 50vw)",
    marginRight: "calc(50% - 50vw)",
  };

  return (
    <div className="container">
      {/* FULL-WIDTH STORE-FRONT BANNER */}
      <div
        style={{
          ...fullBleed,
          borderBottom: "1px solid rgba(255,255,255,.10)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,.07), rgba(0,0,0,.35) 55%, rgba(0,0,0,.55))",
          boxShadow: "0 14px 34px rgba(0,0,0,.55)",
        }}
      >
        <div
          style={{
            maxWidth: "980px",
            margin: "0 auto",
            padding: "18px 14px 14px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "14px 18px",
              borderRadius: "18px",
              border: "1px solid rgba(255,255,255,.12)",
              background:
                "linear-gradient(180deg, rgba(255,255,255,.09), rgba(0,0,0,.25))",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,.10), 0 12px 26px rgba(0,0,0,.55)",
            }}
          >
            <img
              src="/logo.png"
              alt="G&G Steakout II"
              style={{
                height: 86,
                width: "auto",
                objectFit: "contain",
                display: "block",
                filter: "drop-shadow(0 10px 14px rgba(0,0,0,.55))",
              }}
            />
          </div>

          <div
            style={{
              marginTop: 10,
              fontWeight: 900,
              letterSpacing: ".4px",
              fontSize: 13,
              color: "rgba(255,255,255,.86)",
            }}
          >
            MOBILE ORDERING
          </div>

          <div
            style={{
              marginTop: 10,
              display: "flex",
              justifyContent: "center",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <span className="badge mustard">{headerBadge}</span>
          </div>
        </div>

        {/* subtle “weld seam / heat line” */}
        <div
          style={{
            height: 2,
            background:
              "linear-gradient(90deg, transparent, rgba(255,90,31,.55), rgba(244,183,64,.45), rgba(255,90,31,.55), transparent)",
          }}
        />
      </div>

      {/* Featured “House Plates” */}
      <div style={{ marginTop: 16 }}>
        <div className="sectionTitle" style={{ marginTop: 14 }}>
          <h2>G&amp;G Signature</h2>
          <div className="sub">House plates — front and center</div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}
        >
          {/* STEAK SANDWICH PLATE */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => openItem(featuredSteak)}
            onKeyDown={(e) => {
              if (e.key === "Enter") openItem(featuredSteak);
            }}
            style={{
              borderRadius: 18,
              border: "1px solid rgba(255,255,255,.14)",
              background:
                "linear-gradient(135deg, rgba(255,255,255,.10), rgba(0,0,0,.25) 40%, rgba(0,0,0,.45))",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,.10), 0 14px 28px rgba(0,0,0,.55)",
              overflow: "hidden",
              cursor: featuredSteak ? "pointer" : "default",
              minHeight: 118,
            }}
          >
            <div style={{ padding: "14px 14px 12px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 10,
                }}
              >
                <span className="badge ember">HOUSE PLATE</span>
                <span style={{ fontWeight: 950, color: "rgba(244,183,64,.95)" }}>
                  {featuredSteak ? money(featuredSteak.price) : ""}
                </span>
              </div>

              <div
                style={{
                  marginTop: 10,
                  fontWeight: 950,
                  letterSpacing: ".3px",
                  fontSize: 16,
                  lineHeight: 1.1,
                  color: "rgba(255,255,255,.95)",
                  textTransform: "uppercase",
                }}
              >
                Steak Sandwiches
              </div>

              <div style={{ marginTop: 8, color: "rgba(255,255,255,.78)", fontSize: 12 }}>
                {featuredSteak
                  ? featuredSteak.description || featuredSteak.desc || "Tap to order"
                  : "Not found in menu yet"}
              </div>
            </div>

            <div
              style={{
                height: 2,
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,.18), transparent)",
              }}
            />
            <div
              style={{
                height: 8,
                background:
                  "linear-gradient(90deg, rgba(255,90,31,.22), rgba(0,0,0,0), rgba(244,183,64,.18))",
              }}
            />
          </div>

          {/* MANDELA BURGER PLATE */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => openItem(featuredMandela)}
            onKeyDown={(e) => {
              if (e.key === "Enter") openItem(featuredMandela);
            }}
            style={{
              borderRadius: 18,
              border: "1px solid rgba(255,255,255,.14)",
              background:
                "linear-gradient(135deg, rgba(255,255,255,.10), rgba(0,0,0,.25) 40%, rgba(0,0,0,.45))",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,.10), 0 14px 28px rgba(0,0,0,.55)",
              overflow: "hidden",
              cursor: featuredMandela ? "pointer" : "default",
              minHeight: 118,
            }}
          >
            <div style={{ padding: "14px 14px 12px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 10,
                }}
              >
                <span className="badge mustard">SIGNATURE</span>
                <span style={{ fontWeight: 950, color: "rgba(244,183,64,.95)" }}>
                  {featuredMandela ? money(featuredMandela.price) : ""}
                </span>
              </div>

              <div
                style={{
                  marginTop: 10,
                  fontWeight: 950,
                  letterSpacing: ".3px",
                  fontSize: 16,
                  lineHeight: 1.1,
                  color: "rgba(255,255,255,.95)",
                  textTransform: "uppercase",
                }}
              >
                Mandela Burger
              </div>

              <div style={{ marginTop: 8, color: "rgba(255,255,255,.78)", fontSize: 12 }}>
                {featuredMandela
                  ? featuredMandela.description || featuredMandela.desc || "Tap to order"
                  : "Not found in menu yet"}
              </div>
            </div>

            <div
              style={{
                height: 2,
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,.18), transparent)",
              }}
            />
            <div
              style={{
                height: 8,
                background:
                  "linear-gradient(90deg, rgba(244,183,64,.20), rgba(0,0,0,0), rgba(73,194,116,.14))",
              }}
            />
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
