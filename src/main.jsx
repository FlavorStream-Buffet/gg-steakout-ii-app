import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";

/**
 * G&G Splash Screen (Refined)
 * - Pure opacity fade-in (NO movement)
 * - Gentle, understated
 * - Holds ~3.8s
 * - Smooth opacity fade-out
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
      animation: ggSplashFadeIn 1.2s ease-out forwards;
    }

    #gg-splash img {
      width: min(80vw, 460px);
      height: auto;
      display: block;
    }

    #gg-splash.fade-out {
      animation: ggSplashFadeOut 1.2s ease-in forwards;
    }

    @keyframes ggSplashFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes ggSplashFadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  const splash = document.createElement("div");
  splash.id = "gg-splash";
  splash.innerHTML = `<img src="/logo.png" alt="G&G Steakout II" />`;
  document.body.appendChild(splash);

  const SHOW_MS = 3800;
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
