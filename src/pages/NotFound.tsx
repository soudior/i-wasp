/**
 * NotFound - 404 Page
 * Apple Cupertino style - Always redirects to home after 3 seconds
 * No page blanche - TOUJOURS une UI claire
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);

  // Auto-redirect to home after countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/", { replace: true });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleGoHome = () => {
    navigate("/", { replace: true });
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      handleGoHome();
    }
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center p-6 bg-background">
      <div className="text-center max-w-md space-y-6">
        <div className="space-y-2">
          <h1 className="text-7xl font-bold text-foreground/30">404</h1>
          <h2 className="text-2xl font-semibold text-foreground">
            Page introuvable
          </h2>
          <p className="text-muted-foreground">
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>
        </div>

        {/* Auto redirect indicator */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Redirection vers l'accueil dans {countdown}s...</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="outline"
            onClick={handleGoBack}
            className="gap-2"
          >
            <ArrowLeft size={16} />
            Retour
          </Button>
          <Button onClick={handleGoHome} className="gap-2">
            <Home size={16} />
            Accueil
          </Button>
        </div>
      </div>
    </div>
  );
}
