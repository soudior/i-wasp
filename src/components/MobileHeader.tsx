/**
 * Mobile Header - iOS-style top navigation
 * 
 * Features:
 * - Back button with swipe gesture support
 * - Dynamic title based on route
 * - Glassmorphism design
 * - Safe area support
 */

import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

// Route titles mapping
const routeTitles: Record<string, string> = {
  "/": "IWASP",
  "/templates": "Templates",
  "/cart": "Panier",
  "/dashboard": "Dashboard",
  "/leads": "Leads",
  "/orders": "Commandes",
  "/checkout": "Paiement",
  "/create": "Créer une carte",
  "/edit": "Modifier",
  "/login": "Connexion",
  "/signup": "Inscription",
};

export function MobileHeader() {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide on home page and public card pages
  const isHome = location.pathname === "/";
  const isPublicCard = location.pathname.startsWith("/c/");
  const isLoginSignup = ["/login", "/signup"].includes(location.pathname);

  if (isHome || isPublicCard) return null;

  const title = routeTitles[location.pathname] || "IWASP";
  const canGoBack = !isHome && !isLoginSignup;

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 md:hidden"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      {/* Glassmorphism background */}
      <div className="absolute inset-0 glass-strong border-b border-border/50" />
      
      <div className="relative flex items-center h-12 px-4">
        {/* Back button */}
        {canGoBack && (
          <motion.button
            onClick={handleBack}
            className="flex items-center gap-1 min-w-[48px] min-h-[48px] -ml-3 text-foreground touch-manipulation"
            whileTap={{ scale: 0.95, x: -2 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <ChevronLeft size={28} strokeWidth={2.5} />
          </motion.button>
        )}

        {/* Title */}
        <motion.h1 
          className="flex-1 text-center text-base font-semibold text-foreground truncate px-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          key={title}
        >
          {title}
        </motion.h1>

        {/* Spacer for symmetry when back button is visible */}
        {canGoBack && <div className="w-[48px]" />}
      </div>
    </header>
  );
}
