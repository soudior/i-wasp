/**
 * ErrorBoundary - Production-ready error handling
 * Clean user experience, no technical details exposed
 */

import React, { Component, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error for debugging
    console.error("[ErrorBoundary] Caught error:", error.message);
    console.error("[ErrorBoundary] Component stack:", errorInfo.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
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
                <span className="text-4xl">🔄</span>
              </div>
            </div>

            <div className="space-y-2">
              <h1 
                className="text-2xl font-semibold"
                style={{ color: "#1D1D1F" }}
              >
                Actualisation requise
              </h1>
              <p style={{ color: "#8E8E93" }}>
                Veuillez rafraîchir la page pour continuer.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="outline"
                onClick={this.handleReset}
                className="gap-2"
              >
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
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
