import { useMemo, useState } from "react";
import menuData from "./data/menu";

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
  const [fulfillment, setFulfillment] = useState("delivery");
  const [activeItem, setActiveItem] = useState(null);
  const [mode, setMode] = useState("original");
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const sections = useMemo(() => normalizeMenu(menuData), []);

  function addToCart(item) {
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
          <div>
            <div className="name">G&amp;G Steakout II</div>
            <div className="tag">Mobile Ordering</div>
          </div>
        </div>

        <button
          style={{
            marginLeft: "auto",
            background: "rgba(0,0,0,.15)",
            border: "1px solid rgba(0,0,0,.2)",
            borderRadius: "12px",
            padding: "8px 12px",
            fontWeight: 900,
            cursor: "pointer",
          }}
          onClick={() => setDrawerOpen(true)}
        >
          ☰
        </button>
      </div>

      {/* Drawer Overlay */}
      {drawerOpen && (
        <>
          <div
            onClick={() => setDrawerOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,.45)",
              zIndex: 20,
            }}
          />

          <div
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              height: "100%",
              width: "85%",
              maxWidth: "420px",
              background: "linear-gradient(180deg,#1c1c1f,#111)",
              boxShadow: "-10px 0 30px rgba(0,0,0,.5)",
              zIndex: 30,
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              animation: "slideIn .25s ease-out",
            }}
          >
            {/* Logo */}
            <div style={{ textAlign: "center" }}>
              <img
                src="/logo.png"
                alt="G&G Steakout II"
                style={{
                  width: "120px",
                  marginBottom: "10px",
                  filter: "drop-shadow(0 8px 18px rgba(0,0,0,.6))",
                }}
              />
            </div>

            {/* Vertical List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div className="drawerItem">Rewards &amp; Savings</div>
              <div className="drawerItem">G&amp;G Sauces</div>
              <div className="drawerItem">Account</div>
              <div className="drawerItem">Curbside</div>
            </div>
          </div>
        </>
      )}

      {/* Menu Sections */}
      {sections.map((section) => (
        <div key={section.id}>
          <div className="sectionTitle">
            <h2>{section.title}</h2>
          </div>

          <div className="rowScroller">
            {section.items.map((item) => (
              <div
                key={item.id}
                className="card"
                onClick={() => {
                  setActiveItem(item);
                  setMode("original");
                }}
              >
                <div className="title">{item.name}</div>
                <div className="desc">{item.description}</div>
                <div className="accent">{money(item.price)}</div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Bottom Grill */}
      <div className="bottomBar">
        <div className="cartPill">
          <div className="label">Grill ({cartCount})</div>
          <div className="total">{money(cartTotal)}</div>
        </div>
      </div>

      {/* Item Sheet */}
      {activeItem && (
        <div className="sheetOverlay" onClick={() => setActiveItem(null)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheetHeader">
              <div>
                <div className="itemTitle">{activeItem.name}</div>
                <div className="itemSub">{activeItem.description}</div>
              </div>
            </div>

            <div className="sheetBody">
              <button
                className="btn primary"
                onClick={() => addToCart(activeItem)}
              >
                Send to Grill — {money(activeItem.price)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
