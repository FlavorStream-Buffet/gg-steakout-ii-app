export default function App() {
  return (
    <div className="page">
      <header className="top">
        <div className="brand">
          <img className="logo" src="/logo.png" alt="G & G Steakout II" />
          <div className="brandText">
            <div className="title">G &amp; G Steakout II</div>
            <div className="subtitle">Mobile ordering — coming online</div>
          </div>
        </div>
      </header>

      <main className="card">
        <h1>Welcome</h1>
        <p>
          This is the new clean-slate build. Next we’ll add the menu categories
          as big tap-friendly buttons (no long dropdowns).
        </p>

        <div className="actions">
          <button className="btnPrimary" type="button">
            Start Order
          </button>
          <button className="btnGhost" type="button">
            View Menu
          </button>
        </div>

        <div className="note">
          If you see this page on Vercel, the GitHub → Vercel pipeline is working.
        </div>
      </main>

      <footer className="footer">
        Powered by FlavorStream Buffet
      </footer>
    </div>
  );
}
