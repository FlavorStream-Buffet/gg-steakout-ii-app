import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";

/**
 * Option 1 "Soft Splash":
 * - Shows normal /logo.png full-strength for a moment
 * - Fades out smoothly
 * - Then removes itself from the DOM
 * - Does NOT touch App.jsx (safer, fewer regressions)
 */
function mountSplash() {
  // Style block for splash only (kept here so we don't touch styles.css again)
  const style = document.createElement("style");
  style.setAttribute("data-gg-splash", "1");
  style.textContent = `
    #gg-splash {
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(245, 239, 229, 0.92);
      backdrop-filter: blur(8px);
    }
    #gg-splash .wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding: 18px 18px;
      border-radius: 18px;
      box-shadow: 0 18px 50px rgba(0,0,0,.18);
      border: 1px solid rgba(0,0,0,.12);
      background: rgba(255,255,255,.55);
    }
    #gg-splash img {
      width: min(78vw, 420px);
      height: auto;
      display: block;
      /* NORMAL LOGO: no opacity filters, no wash-out */
      opacity: 1;
      filter: none;
    }
    #gg-splash .hint {
      font-weight: 900;
      letter-spacing: .2px;
      color: rgba(0,0,0,.70);
      font-size: 13px;
    }
    #gg-splash.gg-hide {
      animation: ggSplashFade .45s ease forwards;
    }
    @keyframes ggSplashFade {
      to { opacity: 0; transform: translateY(-6px); }
    }
  `;
  document.head.appendChild(style);

  const splash = document.createElement("div");
  splash.id = "gg-splash";
  splash.innerHTML = `
    <div class="wrap">
      <img src="/logo.png" alt="G&G Steakout II" />
      <div class="hint">Loading menu…</div>
    </div>
  `;
  document.body.appendChild(splash);

  // Show briefly, then fade, then remove
  const SHOW_MS = 900;      // how long it stays visible
  const FADE_MS = 450;      // matches CSS animation

  window.setTimeout(() => {
    splash.classList.add("gg-hide");
    window.setTimeout(() => {
      splash.remove();
      style.remove();
    }, FADE_MS + 30);
  }, SHOW_MS);
}

mountSplash();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
