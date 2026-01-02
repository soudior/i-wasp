import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  CreditCard, 
  User, 
  Settings, 
  LayoutDashboard,
  Sparkles
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  requiresAuth?: boolean;
}

const navItems: NavItem[] = [
  { icon: Home, label: "Accueil", path: "/" },
  { icon: Sparkles, label: "Nails", path: "/nails" },
  { icon: CreditCard, label: "Commander", path: "/order/type" },
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard", requiresAuth: true },
  { icon: User, label: "Profil", path: "/settings", requiresAuth: true },
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
  const hiddenPaths = ["/login", "/signup", "/order/", "/card/", "/certificat"];
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

  // Filter items based on auth
  const visibleItems = navItems.filter(item => !item.requiresAuth || user);

  const handleNavClick = (path: string) => {
    navigate(path);
    // Haptic feedback on supported devices
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
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        >
          {/* Backdrop blur */}
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl border-t border-white/10" />
          
          {/* Safe area padding for iOS */}
          <div className="relative px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
            <div className="flex items-center justify-around">
              {visibleItems.map((item) => {
                const isActive = location.pathname === item.path || 
                  (item.path !== "/" && location.pathname.startsWith(item.path));
                const Icon = item.icon;

                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavClick(item.path)}
                    className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all duration-200 min-w-[60px] ${
                      isActive 
                        ? "text-amber-400" 
                        : "text-gray-500 active:text-gray-300"
                    }`}
                  >
                    <div className={`relative ${isActive ? "scale-110" : ""} transition-transform`}>
                      <Icon className="h-5 w-5" />
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-400 rounded-full"
                        />
                      )}
                    </div>
                    <span className={`text-[10px] font-medium ${isActive ? "text-amber-400" : ""}`}>
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
