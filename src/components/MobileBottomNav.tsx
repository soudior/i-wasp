/**
 * MobileBottomNav — Navigation mobile fixe en bas
 * Design: Apple-like, Cupertino style conforme au custom knowledge IWASP
 * Icônes: Accueil, Créer carte, Dashboard, Profil
 */

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  Plus,
  LayoutDashboard,
  User,
  LogIn
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// OMNIA Design System Colors
const COLORS = {
  background: "#030303",
  card: "#111111",
  primary: "#FDFCFB",
  secondary: "rgba(253, 252, 251, 0.6)",
  accent: "#DCC7B0", // Champagne sablé - OMNIA accent
  navBg: "rgba(10, 10, 10, 0.92)",
};

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  isCreate?: boolean;
}

const publicNavItems: NavItem[] = [
  { icon: Home, label: "Accueil", path: "/" },
  { icon: Plus, label: "Créer", path: "/order/offre", isCreate: true },
  { icon: LogIn, label: "Connexion", path: "/login" },
];

const authNavItems: NavItem[] = [
  { icon: Home, label: "Accueil", path: "/" },
  { icon: Plus, label: "Créer", path: "/order/offre", isCreate: true },
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: User, label: "Profil", path: "/settings" },
];

export function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 100);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Don't show on certain pages (login, signup, order funnel, public cards)
  const hiddenPaths = ["/login", "/signup", "/order/", "/card/", "/c/", "/certificat", "/onboarding", "/checkout"];
  const shouldHide = hiddenPaths.some(path => location.pathname.startsWith(path));

  // Only show on mobile
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!isMobile || shouldHide) return null;

  // Choose items based on auth state
  const navItems = user ? authNavItems : publicNavItems;

  const handleNavClick = (path: string) => {
    navigate(path);
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        >
          {/* Glass effect backdrop - Apple style */}
          <div 
            className="absolute inset-0 rounded-t-3xl"
            style={{ 
              backgroundColor: COLORS.navBg,
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
              borderTop: "0.5px solid rgba(0, 0, 0, 0.08)",
              boxShadow: "0 -4px 30px rgba(0, 0, 0, 0.05)"
            }}
          />
          
          {/* Safe area padding for iOS */}
          <div className="relative px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
            <div className="flex items-center justify-around max-w-md mx-auto">
              {navItems.map((item) => {
                const active = isActive(item.path);
                const Icon = item.icon;

                // Special styling for "Create" button
                if (item.isCreate) {
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleNavClick(item.path)}
                      data-tour="create-card"
                      className="flex flex-col items-center gap-1 py-1.5 px-4 touch-manipulation active:scale-95 transition-transform duration-100"
                    >
                      <motion.div 
                        className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                        style={{
                          backgroundColor: COLORS.accent,
                          boxShadow: `0 4px 14px ${COLORS.accent}40`
                        }}
                        whileTap={{ scale: 0.92 }}
                      >
                        <Icon 
                          className="h-6 w-6" 
                          strokeWidth={2.5}
                          style={{ color: "#030303" }}
                        />
                      </motion.div>
                      <span 
                        className="text-[10px] font-medium"
                        style={{ color: COLORS.accent }}
                      >
                        {item.label}
                      </span>
                    </button>
                  );
                }

                // Add tour attribute for specific items
                const tourId = item.path === "/dashboard" ? "dashboard" : item.path === "/settings" ? "profile" : undefined;

                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavClick(item.path)}
                    data-tour={tourId}
                    className="flex flex-col items-center gap-1 py-2 px-4 rounded-2xl touch-manipulation active:scale-95 transition-all duration-100 min-w-[60px] min-h-[52px]"
                  >
                    <div className="relative">
                      <Icon 
                        className="h-6 w-6 transition-colors duration-200" 
                        strokeWidth={active ? 2.2 : 1.8}
                        style={{ 
                          color: active ? COLORS.accent : COLORS.secondary 
                        }}
                      />
                      {/* Active indicator dot */}
                      {active && (
                        <motion.div
                          layoutId="bottomNavIndicator"
                          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                          style={{ backgroundColor: COLORS.accent }}
                          transition={{ 
                            type: "spring", 
                            stiffness: 500, 
                            damping: 35 
                          }}
                        />
                      )}
                    </div>
                    <span 
                      className="text-[10px] font-medium transition-colors duration-200"
                      style={{ 
                        color: active ? COLORS.accent : COLORS.secondary 
                      }}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
