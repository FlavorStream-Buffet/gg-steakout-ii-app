import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";

/**
 * G&G Splash Screen
 * - Uses NORMAL logo (full strength, no wash)
 * - NO background box (true PNG transparency)
 * - Holds ~3.8s
 * - Slower, smoother fade-out
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
    }

    #gg-splash img {
      width: min(80vw, 460px);
      height: auto;
      display: block;
      opacity: 1;
      filter: none;
    }

    #gg-splash.fade-out {
      animation: ggSplashFade 1.2s ease forwards;
    }

    @keyframes ggSplashFade {
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

  const SHOW_MS = 3800; // how long logo stays fully visible
  const FADE_MS = 1200; // 👈 slower fade (premium feel)

  setTimeout(() => {
    splash.classList.add("fade-out");
    setTimeout(() => {
      splash.remove();
      style.remove();
    }, FADE_MS);
  }, SHOW_MS);
}

mountSplash();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
