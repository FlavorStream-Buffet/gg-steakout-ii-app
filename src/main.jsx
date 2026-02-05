import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";

/**
 * G&G Splash Screen
 * - Uses NORMAL logo (full strength, no wash)
 * - NO background box (true PNG transparency)
 * - Stays visible ~3.5 seconds
 * - Fades out smoothly
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
      animation: ggSplashFade 0.6s ease forwards;
    }

    @keyframes ggSplashFade {
      to {
        opacity: 0;
        transform: translateY(-8px);
      }
    }
  `;
  document.head.appendChild(style);

  const splash = document.createElement("div");
  splash.id = "gg-splash";
  splash.innerHTML = `<img src="/logo.png" alt="G&G Steakout II" />`;
  document.body.appendChild(splash);

  const SHOW_MS = 3800; // 👈 ~3.8 seconds (premium, not a flash)
  const FADE_MS = 600;

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
