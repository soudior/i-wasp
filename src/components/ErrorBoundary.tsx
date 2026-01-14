/**
 * ErrorBoundary - Production-ready error handling
 * Clean user experience, no technical details exposed
 *
 * NOTE:
 * This screen is mainly shown when a user has an outdated cached build
 * (common on direct links / PWA installs after a deployment).
 * We auto-reload once to recover seamlessly.
 */

import React, { Component, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Home, Trash2 } from "lucide-react";
import { clearCacheAndReload } from "@/utils/clearCache";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage?: string;
  autoReloadTriggered?: boolean;
}

function isLikelyStaleBuildError(message: string | undefined) {
  if (!message) return false;
  const m = message.toLowerCase();

  return (
    m.includes("chunkloaderror") ||
    m.includes("loading chunk") ||
    m.includes("failed to fetch dynamically imported module") ||
    m.includes("dynamically imported module") ||
    m.includes("importing a module script failed") ||
    // Happens when a cached HTML is returned instead of a JS chunk after deploy
    m.includes("unexpected token '<'")
  );
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error?.message };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error for debugging
    console.error("[ErrorBoundary] Caught error:", error.message);
    console.error("[ErrorBoundary] Component stack:", errorInfo.componentStack);
  }

  componentDidUpdate(_: Props, prevState: State) {
    if (!prevState.hasError && this.state.hasError) {
      const shouldAutoReload = isLikelyStaleBuildError(this.state.errorMessage);
      if (!shouldAutoReload) return;

      const key = `iwasp:stale-build-reload:${window.location.pathname}`;
      const alreadyTried = window.sessionStorage.getItem(key) === "1";
      if (alreadyTried) return;

      window.sessionStorage.setItem(key, "1");
      this.setState({ autoReloadTriggered: true }, () => {
        // Small delay so the UI paints before reloading
        window.setTimeout(() => {
          window.location.reload();
        }, 250);
      });
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleClearCache = async () => {
    await clearCacheAndReload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      const isAutoReloading = !!this.state.autoReloadTriggered;

      return (
        <div
          className="min-h-dvh flex items-center justify-center p-6"
          style={{ backgroundColor: "#F5F5F7" }}
        >
          <div className="max-w-md w-full text-center space-y-6">
            <div className="flex justify-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#F5F5F7" }}
              >
                <RefreshCw
                  className={isAutoReloading ? "h-7 w-7 animate-spin" : "h-7 w-7"}
                  style={{ color: "#1D1D1F" }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs tracking-wide" style={{ color: "#8E8E93" }}>
                IWASP
              </p>
              <h1 className="text-2xl font-semibold" style={{ color: "#1D1D1F" }}>
                Actualisation requise
              </h1>
              <p style={{ color: "#8E8E93" }}>
                {isAutoReloading
                  ? "Mise à jour en cours…"
                  : "Veuillez rafraîchir la page pour continuer."}
              </p>
            </div>

            {!isAutoReloading && (
              <div className="flex flex-col gap-3 justify-center">
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button variant="outline" onClick={this.handleReload} className="gap-2">
                    <RefreshCw size={16} />
                    Réessayer
                  </Button>
                  <Button
                    onClick={this.handleGoHome}
                    className="gap-2"
                    style={{ backgroundColor: "#007AFF", color: "#FFFFFF" }}
                  >
                    <Home size={16} />
                    Accueil
                  </Button>
                </div>
                <button
                  onClick={this.handleClearCache}
                  className="text-sm flex items-center gap-2 justify-center transition-opacity hover:opacity-70 mx-auto mt-2"
                  style={{ color: "#8E8E93" }}
                >
                  <Trash2 size={14} />
                  Vider le cache
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
