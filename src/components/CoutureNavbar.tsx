/**
 * CoutureNavbar - Navigation Haute Couture Digitale
 * Style: Ultra minimal, noir couture, typographie éditoriale
 */

import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LayoutDashboard, LogOut, ShoppingCart, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useTranslation } from "react-i18next";
import { LanguageSelector } from "@/components/LanguageSelector";
import { CurrencySwitch } from "@/components/CurrencySwitch";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SubscriptionBadge } from "@/components/SubscriptionBadge";
import { SubscriptionUpgrade } from "@/components/SubscriptionUpgrade";
import { motion, AnimatePresence } from "framer-motion";

// Noir Couture Palette - Consistent with design system
const NOIR_COUTURE = {
  background: "#0A0A0A",
  backgroundGlass: "rgba(10, 10, 10, 0.9)",
  ivoire: "#F6F5F2",
  cendre: "#9B9B9B",
  platine: "#7E7E7E",
  border: "rgba(255, 255, 255, 0.08)",
  borderHover: "rgba(255, 255, 255, 0.15)",
} as const;

export function CoutureNavbar() {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();
  const { totalItems } = useCart();

  const navLinks = [
    { href: "/", label: "Accueil" },
    { href: "/maison", label: "La Maison" },
    { href: "/web-studio", label: "Web Studio", icon: Wand2 },
    { href: "/features", label: "Fonctionnalités" },
    { href: "/pricing", label: "Tarifs" },
    { href: "/order/offre", label: "Découvrir", highlight: true },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all"
      style={{
        backgroundColor: isScrolled ? NOIR_COUTURE.backgroundGlass : "transparent",
        backdropFilter: isScrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: isScrolled ? "blur(20px)" : "none",
        borderBottom: isScrolled ? `0.5px solid ${NOIR_COUTURE.border}` : "none",
        transitionDuration: "800ms",
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <nav className="container mx-auto px-8 md:px-12 py-5">
        <div className="flex items-center justify-between">
          {/* Logo - Typography éditoriale */}
          <Link to="/" className="flex items-center gap-3 group">
            <span 
              className="font-serif text-xl tracking-wide"
              style={{ color: NOIR_COUTURE.ivoire }}
            >
              i-wasp
            </span>
            <span 
              className="hidden sm:inline text-[10px] uppercase tracking-[0.3em] font-light"
              style={{ color: NOIR_COUTURE.cendre }}
            >
              Digital Identity
            </span>
          </Link>

          {/* Desktop Navigation - Minimal */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="relative px-5 py-2 text-sm transition-all flex items-center gap-1.5"
                style={{
                  color: link.highlight 
                    ? NOIR_COUTURE.ivoire 
                    : location.pathname === link.href 
                    ? NOIR_COUTURE.ivoire 
                    : NOIR_COUTURE.cendre,
                  fontWeight: link.highlight ? 500 : 400,
                  letterSpacing: "0.02em",
                  transitionDuration: "600ms",
                }}
              >
                {link.icon && <link.icon size={14} strokeWidth={1.5} />}
                {link.label}
                {location.pathname === link.href && !link.highlight && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute bottom-0 left-5 right-5 h-px"
                    style={{ backgroundColor: NOIR_COUTURE.ivoire }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* CTA & Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />
            <CurrencySwitch variant="pill" />
            <LanguageSelector />

            {/* Cart */}
            <Link 
              to="/cart" 
              className="relative p-2 transition-colors"
              style={{ 
                color: NOIR_COUTURE.cendre,
                transitionDuration: "400ms",
              }}
            >
              <ShoppingCart size={18} strokeWidth={1.5} />
              {totalItems > 0 && (
                <span 
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 text-[10px] font-medium flex items-center justify-center"
                  style={{ 
                    backgroundColor: NOIR_COUTURE.ivoire, 
                    color: NOIR_COUTURE.background,
                  }}
                >
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </Link>

            {!loading && (
              user ? (
                <>
                  <SubscriptionBadge 
                    showLabel={true} 
                    size="sm" 
                    onClick={() => setShowUpgrade(true)} 
                  />
                  <Link to="/dashboard">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="gap-2 font-normal hover:bg-white/5"
                      style={{ color: NOIR_COUTURE.cendre }}
                    >
                      <LayoutDashboard size={14} />
                      {t("nav.dashboard")}
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost"
                    size="sm" 
                    onClick={handleLogout} 
                    className="gap-2 font-normal hover:bg-white/5"
                    style={{ color: NOIR_COUTURE.cendre }}
                  >
                    <LogOut size={14} />
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="font-normal hover:bg-white/5"
                      style={{ color: NOIR_COUTURE.cendre }}
                    >
                      {t("nav.login")}
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button 
                      size="sm" 
                      className="font-normal px-5"
                      style={{ 
                        backgroundColor: NOIR_COUTURE.ivoire,
                        color: NOIR_COUTURE.background,
                      }}
                    >
                      {t("nav.signup")}
                    </Button>
                  </Link>
                </>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <Link 
              to="/cart" 
              className="relative p-2"
              style={{ color: NOIR_COUTURE.cendre }}
            >
              <ShoppingCart size={18} strokeWidth={1.5} />
              {totalItems > 0 && (
                <span 
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 text-[10px] font-medium flex items-center justify-center"
                  style={{ 
                    backgroundColor: NOIR_COUTURE.ivoire, 
                    color: NOIR_COUTURE.background,
                  }}
                >
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              className="p-2 transition-colors"
              style={{ color: NOIR_COUTURE.ivoire }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Full screen overlay - NOIR COUTURE */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 top-[65px] lg:hidden z-40"
              style={{ backgroundColor: NOIR_COUTURE.background }}
            >
              <div className="container mx-auto px-8 py-12">
                <div className="flex flex-col gap-6">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        duration: 0.5, 
                        delay: index * 0.1,
                        ease: [0.22, 1, 0.36, 1] 
                      }}
                    >
                      <Link
                        to={link.href}
                        className="flex items-center gap-3 text-2xl font-serif font-light transition-colors"
                        style={{
                          color: link.highlight ? NOIR_COUTURE.ivoire : NOIR_COUTURE.ivoire,
                          letterSpacing: "0.02em",
                        }}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.icon && <link.icon size={20} strokeWidth={1.5} />}
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                  
                  <motion.div 
                    className="pt-8 mt-8 flex flex-col gap-4"
                    style={{ borderTop: `1px solid ${NOIR_COUTURE.border}` }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <div className="flex items-center gap-4">
                      <ThemeToggle />
                      <CurrencySwitch variant="compact" />
                      <LanguageSelector />
                    </div>
                    
                    {user ? (
                      <>
                        <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                          <Button 
                            className="w-full gap-2 font-normal"
                            style={{ 
                              backgroundColor: NOIR_COUTURE.ivoire,
                              color: NOIR_COUTURE.background,
                            }}
                          >
                            <LayoutDashboard size={16} />
                            {t("nav.dashboard")}
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          className="w-full gap-2 font-normal"
                          style={{ 
                            borderColor: NOIR_COUTURE.border,
                            color: NOIR_COUTURE.cendre,
                            backgroundColor: "transparent",
                          }}
                          onClick={() => {
                            handleLogout();
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <LogOut size={16} />
                          {t("nav.logout")}
                        </Button>
                      </>
                    ) : (
                      <>
                        <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                          <Button 
                            variant="outline" 
                            className="w-full font-normal"
                            style={{ 
                              borderColor: NOIR_COUTURE.border,
                              color: NOIR_COUTURE.cendre,
                              backgroundColor: "transparent",
                            }}
                          >
                            {t("nav.login")}
                          </Button>
                        </Link>
                        <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                          <Button 
                            className="w-full font-normal"
                            style={{ 
                              backgroundColor: NOIR_COUTURE.ivoire,
                              color: NOIR_COUTURE.background,
                            }}
                          >
                            {t("nav.signup")}
                          </Button>
                        </Link>
                      </>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <SubscriptionUpgrade 
        isOpen={showUpgrade} 
        onClose={() => setShowUpgrade(false)} 
      />
    </header>
  );
}
