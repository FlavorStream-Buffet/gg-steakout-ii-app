import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";

/**
 * G&G Splash Screen
 * - Normal logo (no wash, no box)
 * - Soft fade-IN
 * - Holds ~3.8s
 * - Slow, premium fade-OUT
 */
function mountSplash() {
  const style = document.createElement("style");
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
      opacity: 0;
      animation: ggSplashFadeIn 0.9s ease forwards;
    }

    #gg-splash img {
      width: min(80vw, 460px);
      height: auto;
      display: block;
      filter: none;
    }

    #gg-splash.fade-out {
      animation: ggSplashFadeOut 1.2s ease forwards;
    }

    @keyframes ggSplashFadeIn {
      from {
        opacity: 0;
        transform: translateY(6px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes ggSplashFadeOut {
      to {
        opacity: 0;
        transform: translateY(-10px);
      }
    }
  `;
  document.head.appendChild(style);

  const splash = document.createElement("div");
  splash.id = "gg-splash";
  splash.innerHTML = `<img src="/logo.png" alt="G&G Steakout II" />`;
  document.body.appendChild(splash);

  const SHOW_MS = 3800; // logo fully visible time
  const FADE_OUT_MS = 1200;

  setTimeout(() => {
    splash.classList.add("fade-out");
    setTimeout(() => {
      splash.remove();
      style.remove();
    }, FADE_OUT_MS);
  }, SHOW_MS);
}

mountSplash();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
