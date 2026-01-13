/**
 * GlobalErrorBoundary - Gestion globale des erreurs
 * Affiche un écran d'erreur élégant au lieu d'une page blanche
 * Style IWASP Premium
 */

import { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("GlobalErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
    
    // Here you could send error to monitoring service
    // e.g., Sentry, LogRocket, etc.
  }

  private handleRefresh = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = "/";
  };

  private handleContact = () => {
    window.open("https://wa.me/33626424394?text=Bonjour%20👋%20J'ai%20rencontré%20une%20erreur%20sur%20votre%20site.", "_blank");
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-dvh flex flex-col items-center justify-center p-6 bg-background">
          <div className="text-center max-w-md space-y-6">
            {/* Error icon */}
            <div className="mx-auto w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>

            {/* Error message */}
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold text-foreground">
                Une erreur est survenue
              </h1>
              <p className="text-muted-foreground text-sm">
                Nous nous excusons pour ce désagrément. Notre équipe a été notifiée et travaille à résoudre le problème.
              </p>
            </div>

            {/* Error details (development only) */}
            {import.meta.env.DEV && this.state.error && (
              <div className="p-4 rounded-lg bg-muted/50 border border-border text-left">
                <p className="text-xs font-mono text-destructive mb-2">
                  {this.state.error.message}
                </p>
                {this.state.errorInfo && (
                  <pre className="text-xs font-mono text-muted-foreground overflow-auto max-h-32">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col gap-3">
              <Button
                onClick={this.handleRefresh}
                className="w-full gap-2"
              >
                <RefreshCw size={16} />
                Actualiser la page
              </Button>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={this.handleGoHome}
                  className="flex-1 gap-2"
                >
                  <Home size={16} />
                  Accueil
                </Button>
                <Button
                  variant="outline"
                  onClick={this.handleContact}
                  className="flex-1 gap-2"
                >
                  <MessageCircle size={16} />
                  Aide
                </Button>
              </div>
            </div>

            {/* Branding */}
            <p className="text-xs text-muted-foreground/50 pt-4">
              Powered by <span className="font-medium">IWASP</span>
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;
