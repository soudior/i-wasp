/**
 * AdminOmniaLayout - Unified Admin Layout with OMNIA Design System
 * 
 * Palette OMNIA:
 * - Obsidienne: #030303 (Fond principal)
 * - Champagne: #DCC7B0 (Accent principal)
 * - Ivoire: #FDFCFB (Texte & détails)
 */

import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useAdmin";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard,
  Package,
  Users,
  Globe,
  BarChart3,
  Printer,
  CreditCard,
  ChevronRight,
  LogOut,
  Menu,
  X,
  Shield,
  Loader2,
  Zap,
  ArrowLeft,
  Command,
} from "lucide-react";

interface AdminOmniaLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

// Navigation items for admin
const navItems = [
  { path: "/admin", icon: LayoutDashboard, label: "Dashboard", shortcut: "D" },
  { path: "/admin/orders", icon: Package, label: "Commandes", shortcut: "O" },
  { path: "/admin/clients", icon: Users, label: "Clients", shortcut: "C" },
  { path: "/admin/webstudio", icon: Globe, label: "Web Studio", shortcut: "W" },
  { path: "/admin/analytics", icon: BarChart3, label: "Analytics", shortcut: "A" },
  { path: "/admin/evolis", icon: Printer, label: "Impression", shortcut: "P" },
  { path: "/admin/creator", icon: CreditCard, label: "Cartes", shortcut: "K" },
  { path: "/admin/instant", icon: Zap, label: "Création vCard", shortcut: "V" },
];

export function AdminOmniaLayout({ children, title, subtitle }: AdminOmniaLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { data: isAdmin, isLoading } = useIsAdmin();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        // Could trigger global search here
      }
      
      // Navigation shortcuts (when not in input)
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
      
      const shortcut = e.key.toUpperCase();
      const navItem = navItems.find(item => item.shortcut === shortcut);
      if (navItem) {
        navigate(navItem.path);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center gap-4 bg-omnia-obsidienne">
        <div className="relative">
          <Shield className="h-12 w-12 text-omnia-champagne/50 animate-pulse" />
          <Loader2 className="h-6 w-6 animate-spin absolute -bottom-1 -right-1 text-omnia-champagne" />
        </div>
        <p className="text-omnia-ivoire-muted text-sm font-light tracking-wide">
          Vérification des accès...
        </p>
      </div>
    );
  }

  // Access denied
  if (!isAdmin) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center gap-6 p-6 bg-omnia-obsidienne">
        <div className="text-center space-y-4 max-w-sm">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mx-auto w-20 h-20 rounded-full bg-omnia-obsidienne-surface border border-omnia-champagne/20 flex items-center justify-center"
          >
            <Shield className="h-10 w-10 text-omnia-champagne/60" />
          </motion.div>
          <h1 className="text-2xl font-display text-omnia-ivoire tracking-tight">
            Accès refusé
          </h1>
          <p className="text-omnia-ivoire-muted text-sm font-light">
            Cette section est réservée aux administrateurs.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-omnia-champagne/10 border border-omnia-champagne/20 text-omnia-champagne text-sm font-medium hover:bg-omnia-champagne/20 transition-all"
          >
            <ArrowLeft size={16} />
            Retour à l'accueil
          </motion.button>
        </div>
      </div>
    );
  }

  const currentNav = navItems.find(item => location.pathname === item.path);

  return (
    <div className="min-h-dvh bg-omnia-obsidienne">
      {/* ═══════════════════════════════════════════════════════════════════
          DESKTOP SIDEBAR
          ═══════════════════════════════════════════════════════════════════ */}
      <aside className="fixed left-0 top-0 bottom-0 w-72 hidden lg:flex flex-col border-r border-white/5 bg-omnia-obsidienne z-50">
        {/* Brand */}
        <div className="p-6 border-b border-white/5">
          <Link to="/admin" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-omnia-champagne/20 to-omnia-champagne/5 flex items-center justify-center border border-omnia-champagne/20 group-hover:border-omnia-champagne/40 transition-colors">
              <Command className="h-5 w-5 text-omnia-champagne" />
            </div>
            <div>
              <h1 className="font-display text-omnia-ivoire text-lg tracking-tight">
                OMNIA
              </h1>
              <p className="text-xs text-omnia-champagne/60 font-light tracking-wider uppercase">
                L'Atelier
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-light transition-all duration-300 group",
                  isActive
                    ? "bg-omnia-champagne/10 text-omnia-champagne border border-omnia-champagne/20"
                    : "text-omnia-ivoire/60 hover:text-omnia-ivoire hover:bg-white/5"
                )}
              >
                <item.icon 
                  size={18} 
                  className={cn(
                    "transition-colors",
                    isActive ? "text-omnia-champagne" : "text-omnia-ivoire/40 group-hover:text-omnia-ivoire/60"
                  )}
                />
                <span className="flex-1">{item.label}</span>
                <span className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded font-mono tracking-wider",
                  isActive 
                    ? "bg-omnia-champagne/20 text-omnia-champagne"
                    : "bg-white/5 text-omnia-ivoire/30"
                )}>
                  {item.shortcut}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-light text-omnia-ivoire/50 hover:text-omnia-ivoire/80 hover:bg-white/5 transition-all"
          >
            <LogOut size={18} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* ═══════════════════════════════════════════════════════════════════
          MOBILE HEADER
          ═══════════════════════════════════════════════════════════════════ */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-omnia-obsidienne/95 backdrop-blur-xl border-b border-white/5 z-50 flex items-center justify-between px-4">
        <Link to="/admin" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-omnia-champagne/20 to-omnia-champagne/5 flex items-center justify-center border border-omnia-champagne/20">
            <Command className="h-4 w-4 text-omnia-champagne" />
          </div>
          <span className="font-display text-omnia-ivoire text-base tracking-tight">
            OMNIA
          </span>
        </Link>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-omnia-ivoire/70"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden fixed top-16 left-0 right-0 bottom-0 bg-omnia-obsidienne/98 backdrop-blur-xl z-40 overflow-y-auto"
          >
            <nav className="p-4 space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-4 rounded-xl text-base font-light transition-all",
                      isActive
                        ? "bg-omnia-champagne/10 text-omnia-champagne border border-omnia-champagne/20"
                        : "text-omnia-ivoire/70 hover:bg-white/5"
                    )}
                  >
                    <item.icon size={20} className={isActive ? "text-omnia-champagne" : "text-omnia-ivoire/40"} />
                    <span className="flex-1">{item.label}</span>
                    <ChevronRight size={16} className="text-omnia-ivoire/20" />
                  </Link>
                );
              })}
              
              <div className="pt-4 border-t border-white/5 mt-4">
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-4 rounded-xl text-base font-light text-omnia-ivoire/50"
                >
                  <LogOut size={20} />
                  <span>Déconnexion</span>
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════════
          MAIN CONTENT
          ═══════════════════════════════════════════════════════════════════ */}
      <main className="lg:pl-72 pt-16 lg:pt-0 min-h-dvh">
        {/* Page Header */}
        <AnimatePresence mode="wait">
          {(title || subtitle) && (
            <motion.div 
              key={`header-${location.pathname}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="border-b border-white/5 px-6 py-6"
            >
              <div className="max-w-7xl mx-auto">
                {subtitle && (
                  <motion.p 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05, duration: 0.2 }}
                    className="text-xs text-omnia-champagne/60 font-light tracking-wider uppercase mb-1"
                  >
                    {subtitle}
                  </motion.p>
                )}
                {title && (
                  <motion.h1 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, duration: 0.2 }}
                    className="text-2xl lg:text-3xl font-display text-omnia-ivoire tracking-tight"
                  >
                    {title}
                  </motion.h1>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Content with page transition */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ 
              duration: 0.25, 
              ease: [0.25, 0.46, 0.45, 0.94] 
            }}
            className="p-4 lg:p-6"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.2 }}
              className="max-w-7xl mx-auto"
            >
              {children}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default AdminOmniaLayout;
