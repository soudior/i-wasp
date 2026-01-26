import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "next-themes";
import App from "./App.tsx";
import "./index.css";
import "./i18n";
import { checkAndClearStaleCache, forceRefresh } from "./utils/cacheVersion";

// Check for secret URL parameter to force cache refresh
const urlParams = new URLSearchParams(window.location.search);
const forceRefreshParam = urlParams.get('refresh') === '1';

if (forceRefreshParam) {
  // Remove the parameter from URL before refresh
  urlParams.delete('refresh');
  const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
  window.history.replaceState({}, '', newUrl);
  forceRefresh();
}

// Check for stale cache BEFORE rendering
// This forces external users with old cached versions to refresh
const cacheWasStale = checkAndClearStaleCache();

// If cache was stale, the page will reload automatically
// Don't render anything to avoid flash
if (cacheWasStale) {
  document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:system-ui;color:#666;">Mise à jour en cours...</div>';
} else {
  // Global error handler to prevent white screen
  window.addEventListener("error", (event) => {
    console.error("Global error:", event.error);
    event.preventDefault();
  });

  window.addEventListener("unhandledrejection", (event) => {
    console.error("Unhandled promise rejection:", event.reason);
    event.preventDefault();
  });

  const rootElement = document.getElementById("root");

  if (!rootElement) {
    throw new Error("Root element not found");
  }

  createRoot(rootElement).render(
    <StrictMode>
      <ThemeProvider 
        attribute="class" 
        defaultTheme="system" 
        enableSystem
        disableTransitionOnChange={false}
      >
        <App />
      </ThemeProvider>
    </StrictMode>
  );
}
