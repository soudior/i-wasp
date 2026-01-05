/**
 * MobileBottomNav — Navigation mobile fixe en bas
 * Palette Stealth Luxury: Noir Émeraude #050807, Argent Titane #A5A9B4, Platine #D1D5DB
 */

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  ShoppingBag, 
  User, 
  LayoutDashboard,
  CreditCard,
  BarChart3,
  Pencil
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Stealth Luxury Colors
const STEALTH = {
  noir: "#050807",
  titanium: "#A5A9B4",
  platinum: "#D1D5DB",
};

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  requiresAuth?: boolean;
  highlight?: boolean;
}

const publicNavItems: NavItem[] = [
  { icon: Home, label: "Accueil", path: "/" },
  { icon: CreditCard, label: "Produits", path: "/produits" },
  { icon: ShoppingBag, label: "Commander", path: "/order/type", highlight: true },
  { icon: User, label: "Connexion", path: "/login" },
];

const authNavItems: NavItem[] = [
  { icon: Home, label: "Accueil", path: "/" },
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: ShoppingBag, label: "Commander", path: "/order/type", highlight: true },
  { icon: Pencil, label: "Éditer", path: "/card-studio" },
  { icon: BarChart3, label: "Stats", path: "/dashboard" },
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

  // Don't show on certain pages
  const hiddenPaths = ["/login", "/signup", "/order/", "/card/", "/certificat", "/onboarding"];
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
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        >
          {/* Backdrop blur */}
          <div 
            className="absolute inset-0 backdrop-blur-xl"
            style={{ 
              backgroundColor: `${STEALTH.noir}F0`,
              borderTop: `1px solid ${STEALTH.titanium}15`
            }}
          />
          
          {/* Safe area padding for iOS */}
          <div className="relative px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
            <div className="flex items-center justify-around">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path || 
                  (item.path !== "/" && location.pathname.startsWith(item.path));
                const Icon = item.icon;

                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavClick(item.path)}
                    className="flex flex-col items-center gap-1 py-3 px-4 rounded-xl transition-colors duration-100 min-w-[60px] min-h-[52px] touch-manipulation active:opacity-70"
                    style={{
                      color: item.highlight ? STEALTH.platinum : (isActive ? STEALTH.platinum : `${STEALTH.titanium}80`)
                    }}
                  >
                    <div 
                      className={`relative ${isActive ? "scale-110" : ""} transition-transform duration-100 p-2 rounded-xl`}
                      style={{
                        backgroundColor: item.highlight 
                          ? `${STEALTH.titanium}30` 
                          : (isActive ? `${STEALTH.titanium}20` : "transparent")
                      }}
                    >
                      <Icon className="h-5 w-5" />
                      {isActive && !item.highlight && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                          style={{ backgroundColor: STEALTH.platinum }}
                          transition={{ duration: 0.1 }}
                        />
                      )}
                    </div>
                    <span 
                      className="text-[10px] font-medium"
                      style={{ color: item.highlight || isActive ? STEALTH.platinum : `${STEALTH.titanium}80` }}
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
