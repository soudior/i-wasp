/**
 * NotFound - 404 Page
 * IWASP Premium Style - Haute Couture aesthetic
 * Auto-redirects to home after countdown
 */

import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Home, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function NotFound() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

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
    <div className="min-h-dvh flex flex-col items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Premium background effects */}
      <div className="absolute inset-0 bg-grid opacity-10" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-primary/5 to-accent/5 blur-3xl" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md space-y-8 relative z-10"
      >
        {/* Premium 404 display */}
        <div className="space-y-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative"
          >
            <span className="text-[120px] md:text-[160px] font-bold text-foreground/5 select-none leading-none tracking-tighter">
              404
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-center gap-2 text-primary">
                <Sparkles className="h-6 w-6" />
                <span className="text-lg font-medium tracking-wide">IWASP</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-2"
          >
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
              Page introuvable
            </h1>
            <p className="text-muted-foreground text-sm md:text-base max-w-sm mx-auto">
              La page que vous recherchez n'existe pas ou a été déplacée vers une nouvelle adresse.
            </p>
          </motion.div>
        </div>

        {/* Auto redirect countdown */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-center"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-muted/50 border border-border/50">
            <div className="relative h-5 w-5">
              <svg className="h-5 w-5 -rotate-90" viewBox="0 0 24 24">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  className="stroke-muted-foreground/20"
                  strokeWidth="2"
                  fill="none"
                />
                <motion.circle
                  cx="12"
                  cy="12"
                  r="10"
                  className="stroke-primary"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ pathLength: 1 }}
                  animate={{ pathLength: countdown / 5 }}
                  transition={{ duration: 1, ease: "linear" }}
                  style={{ strokeDasharray: "1 1" }}
                />
              </svg>
            </div>
            <span className="text-sm text-muted-foreground">
              Redirection dans <span className="font-medium text-foreground">{countdown}s</span>
            </span>
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Button
            variant="outline"
            onClick={handleGoBack}
            className="gap-2 h-11 px-6"
          >
            <ArrowLeft size={16} />
            Retour
          </Button>
          <Button 
            onClick={handleGoHome} 
            className="gap-2 h-11 px-6 bg-primary hover:bg-primary/90"
          >
            <Home size={16} />
            Accueil
          </Button>
        </motion.div>

        {/* Quick links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="pt-4 border-t border-border/30"
        >
          <p className="text-xs text-muted-foreground mb-3">Liens rapides</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/produits" className="text-muted-foreground hover:text-foreground transition-colors">
              Produits
            </Link>
            <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
            <Link to="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
              FAQ
            </Link>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Footer branding */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 text-center"
      >
        <p className="text-xs text-muted-foreground/50">
          Powered by <span className="font-medium">IWASP</span>
        </p>
      </motion.div>
    </div>
  );
}
