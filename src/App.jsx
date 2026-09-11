import { useMemo, useState } from "react";
import { LOCATIONS, getMenuForLocationId } from "./data/menu.js";

const money = (value) => `$${Number(value || 0).toFixed(2)}`;

export default function App() {
  const [fulfillment, setFulfillment] = useState("pickup");
  const [activeItem, setActiveItem] = useState(null);
  const [selections, setSelections] = useState({});
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [curbsideLocation, setCurbsideLocation] = useState("");
  const [vehicle, setVehicle] = useState("");

  const sections = getMenuForLocationId().sections;
  const location = LOCATIONS[0];
  const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  const cartTotal = cart.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);

  const activePrice = useMemo(() => {
    if (!activeItem) return 0;
    return activeItem.price + Object.values(selections).reduce(
      (sum, option) => sum + Number(option?.priceDelta || 0), 0
    );
  }, [activeItem, selections]);

  const requiredComplete = (activeItem?.optionGroups || [])
    .filter((group) => group.required)
    .every((group) => selections[group.id]);

  function openItem(menuItem) {
    const defaults = {};
    (menuItem.optionGroups || []).forEach((group) => {
      const selected = group.options.find((option) => option.default);
      if (selected) defaults[group.id] = selected;
    });
    setSelections(defaults);
    setActiveItem(menuItem);
  }

  function addItem() {
    if (!activeItem || !requiredComplete) return;
    const selectionText = Object.values(selections).map((option) => option.label).join(" · ");
    const key = `${activeItem.id}|${selectionText}`;
    setCart((current) => {
      const found = current.find((line) => line.key === key);
      if (found) {
        return current.map((line) =>
          line.key === key ? { ...line, quantity: line.quantity + 1 } : line
        );
      }
      return [...current, {
        key, item: activeItem, selectionText, unitPrice: activePrice, quantity: 1,
      }];
    });
    setActiveItem(null);
  }

  function changeQuantity(key, delta) {
    setCart((current) => current
      .map((line) => line.key === key ? { ...line, quantity: line.quantity + delta } : line)
      .filter((line) => line.quantity > 0));
  }

  function jumpTo(id) {
    setDrawerOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="appShell">
      <header className="header">
        <button className="brand" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <img src="/logo.png" alt="" />
          <span><strong>G&amp;G Steakout II</strong><small>Downtown Rochester</small></span>
        </button>
        <button className="menuButton" onClick={() => setDrawerOpen(true)} aria-label="Open menu">☰</button>
      </header>

      {drawerOpen && (
        <div className="drawerOverlay" onClick={() => setDrawerOpen(false)}>
          <nav className="drawerPanel" onClick={(event) => event.stopPropagation()}>
            <button className="drawerClose" onClick={() => setDrawerOpen(false)}>✕</button>
            <img src="/logo.png" alt="G&G Steakout II" />
            <button onClick={() => jumpTo("specials")}>Featured Specials</button>
            {sections.slice(1).map((section) => (
              <button key={section.id} onClick={() => jumpTo(section.id)}>{section.title}</button>
            ))}
            <button onClick={() => setCartOpen(true)}>Your Order ({cartCount})</button>
          </nav>
        </div>
      )}

      <main>
        <section className="orderPanel">
          <div>
            <p className="eyebrow">ORDER FROM</p>
            <h1>350 East Main Street</h1>
            <p>Rochester, New York</p>
          </div>
          <div className="fulfillment" aria-label="Fulfillment method">
            <button className={fulfillment === "pickup" ? "active" : ""} onClick={() => setFulfillment("pickup")}>Pickup</button>
            <button className={fulfillment === "curbside" ? "active" : ""} onClick={() => setFulfillment("curbside")}>Curbside</button>
          </div>
          {fulfillment === "curbside" && (
            <div className="curbsideFields">
              <label>Where are you waiting?
                <input value={curbsideLocation} onChange={(e) => setCurbsideLocation(e.target.value)} placeholder="Street, corner, landmark, or curb location" />
              </label>
              <label>Vehicle description
                <input value={vehicle} onChange={(e) => setVehicle(e.target.value)} placeholder="Color, make, and model" />
              </label>
            </div>
          )}
          <div className="hours">
            {location.hours.map((line) => <span key={line.days}><b>{line.days}</b> {line.hours}</span>)}
          </div>
        </section>

        <nav className="categoryBar" aria-label="Menu categories">
          {sections.map((section) => (
            <button key={section.id} onClick={() => jumpTo(section.id)}>{section.title}</button>
          ))}
        </nav>

        {sections.map((section) => (
          <section id={section.id} className={section.featured ? "menuSection featured" : "menuSection"} key={section.id}>
            <div className="sectionHeading">
              <div><p>{section.featured ? "DON'T MISS THESE" : "G&G MENU"}</p><h2>{section.title}</h2></div>
              <span>{section.note}</span>
            </div>
            <div className="menuGrid">
              {section.items.map((menuItem) => (
                <button className="menuCard" key={menuItem.id} onClick={() => openItem(menuItem)}>
                  {menuItem.badge && <span className="dealBadge">{menuItem.badge}</span>}
                  <span className="cardTitle">{menuItem.name}</span>
                  <span className="cardDescription">{menuItem.description}</span>
                  <span className="priceRow">
                    {menuItem.compareAt && <del>{money(menuItem.compareAt)}</del>}
                    <strong>{money(menuItem.price)}</strong><i>+</i>
                  </span>
                </button>
              ))}
            </div>
          </section>
        ))}

        <p className="allergyNotice"><b>Food allergy or intolerance?</b> Please notify us before placing your order.</p>
      </main>

      <button className="cartBar" onClick={() => setCartOpen(true)}>
        <span><b>Your Order ({cartCount})</b><small>{fulfillment === "curbside" ? "Curbside" : "Pickup"}</small></span>
        <strong>{money(cartTotal)}</strong>
      </button>

      {activeItem && (
        <div className="modalOverlay" onClick={() => setActiveItem(null)}>
          <section className="itemModal" onClick={(event) => event.stopPropagation()}>
            <button className="modalClose" onClick={() => setActiveItem(null)}>✕</button>
            {activeItem.badge && <span className="dealBadge">{activeItem.badge}</span>}
            <h2>{activeItem.name}</h2>
            <p>{activeItem.description}</p>
            {(activeItem.optionGroups || []).map((group) => (
              <fieldset key={group.id}>
                <legend>{group.label}{group.required && <em> Required</em>}</legend>
                {group.options.map((option) => (
                  <label className="option" key={option.id}>
                    <input
                      type="radio"
                      name={group.id}
                      checked={selections[group.id]?.id === option.id}
                      onChange={() => setSelections((current) => ({ ...current, [group.id]: option }))}
                    />
                    <span>{option.label}</span>
                    {option.priceDelta ? <b>+{money(option.priceDelta)}</b> : null}
                  </label>
                ))}
              </fieldset>
            ))}
            <label className="instructions">Special instructions
              <textarea placeholder="Add preparation notes or tell us about an allergy." />
            </label>
            <button className="primaryAction" disabled={!requiredComplete} onClick={addItem}>
              Add to Order — {money(activePrice)}
            </button>
          </section>
        </div>
      )}

      {cartOpen && (
        <div className="modalOverlay" onClick={() => setCartOpen(false)}>
          <section className="cartModal" onClick={(event) => event.stopPropagation()}>
            <button className="modalClose" onClick={() => setCartOpen(false)}>✕</button>
            <h2>Your Order</h2>
            {cart.length === 0 ? <p className="empty">Your order is empty.</p> : cart.map((line) => (
              <div className="cartLine" key={line.key}>
                <div><b>{line.item.name}</b>{line.selectionText && <small>{line.selectionText}</small>}</div>
                <div className="quantity">
                  <button onClick={() => changeQuantity(line.key, -1)}>−</button>
                  <span>{line.quantity}</span>
                  <button onClick={() => changeQuantity(line.key, 1)}>+</button>
                </div>
                <strong>{money(line.unitPrice * line.quantity)}</strong>
              </div>
            ))}
            <div className="cartTotal"><span>Total</span><strong>{money(cartTotal)}</strong></div>
            <button className="primaryAction" disabled={!cart.length} onClick={() => alert("Live checkout will activate after payment and Toast credentials are connected.")}>
              Continue to Checkout
            </button>
            <p className="checkoutNote">Checkout remains in preview mode until the restaurant's live systems are connected.</p>
          </section>
        </div>
      )}
    </div>
  );
}
