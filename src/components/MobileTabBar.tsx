/**
 * Mobile Tab Bar - iOS-style bottom navigation
 * 
 * Features:
 * - Fixed bottom position with safe area insets
 * - 48px+ touch targets
 * - Haptic-style tap feedback
 * - Badge support for cart
 * - Active state indicators
 */

import { Link, useLocation } from "react-router-dom";
import { Home, LayoutGrid, ShoppingCart, LayoutDashboard, User } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";

interface TabItem {
  href: string;
  label: string;
  icon: React.ElementType;
  requiresAuth?: boolean;
  badge?: number;
}

export function MobileTabBar() {
  const location = useLocation();
  const { user } = useAuth();
  const { totalItems } = useCart();

  // Don't show on public card pages, login, signup, or checkout
  const hiddenRoutes = ["/login", "/signup", "/checkout", "/order-confirmation"];
  const isPublicCard = location.pathname.startsWith("/c/");
  const isHidden = hiddenRoutes.includes(location.pathname) || isPublicCard;

  if (isHidden) return null;

  const tabs: TabItem[] = [
    { href: "/", label: "Accueil", icon: Home },
    { href: "/templates", label: "Templates", icon: LayoutGrid },
    { href: "/cart", label: "Panier", icon: ShoppingCart, badge: totalItems },
    { 
      href: user ? "/dashboard" : "/login", 
      label: user ? "Dashboard" : "Compte", 
      icon: user ? LayoutDashboard : User 
    },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {/* Glassmorphism background */}
      <div className="absolute inset-0 glass-strong border-t border-border/50" />
      
      <div className="relative flex items-center justify-around px-2 h-16">
        {tabs.map((tab) => {
          const active = isActive(tab.href);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              to={tab.href}
              className="relative flex flex-col items-center justify-center min-w-[64px] min-h-[48px] touch-manipulation"
            >
              <motion.div
                className={cn(
                  "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors",
                  active ? "text-foreground" : "text-muted-foreground"
                )}
                whileTap={{ scale: 0.92 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <div className="relative">
                  <Icon 
                    size={22} 
                    strokeWidth={active ? 2.5 : 2} 
                    className="transition-all"
                  />
                  
                  {/* Badge */}
                  {tab.badge && tab.badge > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-amber-500 text-background text-[10px] font-bold flex items-center justify-center"
                    >
                      {tab.badge > 9 ? "9+" : tab.badge}
                    </motion.span>
                  )}
                </div>
                
                <span className={cn(
                  "text-[10px] font-medium transition-all",
                  active ? "opacity-100" : "opacity-70"
                )}>
                  {tab.label}
                </span>
                
                {/* Active indicator dot */}
                {active && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-foreground"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
