/**
 * CoutureNavbar - Navigation Haute Couture Digitale
 * Style: Ultra minimal, noir couture, typographie éditoriale
 */

import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LayoutDashboard, LogOut, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SubscriptionBadge } from "@/components/SubscriptionBadge";
import { SubscriptionUpgrade } from "@/components/SubscriptionUpgrade";
import { motion, AnimatePresence } from "framer-motion";

// Palette Premium raffinée
const COUTURE = {
  noir: "#030303",
  noirGlass: "rgba(3, 3, 3, 0.85)",
  ivoire: "#F8F7F4",
  or: "#C9A962",
  orLight: "#D4B87A",
  gris: "#888888",
  grisClair: "#ABABAB",
  border: "rgba(255, 255, 255, 0.06)",
  borderHover: "rgba(201, 169, 98, 0.3)",
} as const;

export function CoutureNavbar() {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();

  // Navigation simplifiée - essentiel uniquement
  const navLinks = [
    { href: "/web-studio", label: "Web Studio", icon: Wand2, badge: "IA" },
    { href: "/pricing", label: "Tarifs" },
    { href: "/order/offre", label: "Commencer", highlight: true },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
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
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        transition: "all 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      {/* Gradient overlay for better readability */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-700"
        style={{
          background: isScrolled 
            ? COUTURE.noirGlass
            : `linear-gradient(to bottom, ${COUTURE.noir}90 0%, transparent 100%)`,
          backdropFilter: isScrolled ? "blur(24px) saturate(180%)" : "none",
          WebkitBackdropFilter: isScrolled ? "blur(24px) saturate(180%)" : "none",
        }}
      />
      
      {/* Bottom border with gradient */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px"
        initial={{ opacity: 0 }}
        animate={{ opacity: isScrolled ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        style={{
          background: `linear-gradient(90deg, transparent, ${COUTURE.or}30, transparent)`,
        }}
      />
      
      <nav className="container mx-auto px-6 md:px-10 lg:px-12 relative z-10">
        <div className="flex items-center justify-between h-16 md:h-18">
          
          {/* Logo - Premium typography */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <span 
                className="font-serif text-xl md:text-2xl tracking-wide"
                style={{ color: COUTURE.ivoire }}
              >
                i-wasp
              </span>
              {/* Gold underline on hover */}
              <motion.div
                className="absolute -bottom-1 left-0 right-0 h-px origin-left"
                style={{ backgroundColor: COUTURE.or }}
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation - Refined */}
          <div className="hidden lg:flex items-center">
            <div 
              className="flex items-center gap-0.5 px-2 py-1.5 rounded-full"
              style={{ 
                backgroundColor: `${COUTURE.ivoire}05`,
                border: `1px solid ${COUTURE.border}`,
              }}
            >
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="relative px-4 py-2 text-[13px] transition-all duration-500 flex items-center gap-1.5 rounded-full"
                    style={{
                      color: link.highlight 
                        ? COUTURE.or
                        : isActive 
                        ? COUTURE.ivoire 
                        : COUTURE.gris,
                      fontWeight: link.highlight || isActive ? 500 : 400,
                      letterSpacing: "0.01em",
                      backgroundColor: isActive ? `${COUTURE.ivoire}08` : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive && !link.highlight) {
                        e.currentTarget.style.color = COUTURE.ivoire;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive && !link.highlight) {
                        e.currentTarget.style.color = COUTURE.gris;
                      }
                    }}
                  >
                    {link.icon && <link.icon size={13} strokeWidth={1.5} />}
                    {link.label}
                    {link.badge && (
                      <span 
                        className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full font-medium"
                        style={{ 
                          backgroundColor: `${COUTURE.or}20`,
                          color: COUTURE.or,
                        }}
                      >
                        {link.badge}
                      </span>
                    )}
                    {link.highlight && (
                      <motion.div
                        className="absolute inset-0 rounded-full -z-10"
                        style={{ 
                          border: `1px solid ${COUTURE.or}40`,
                        }}
                        animate={{
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Actions - Simplifié */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Theme Toggle uniquement */}
            <ThemeToggle />

            {/* Auth Buttons */}
            {!loading && (
              user ? (
                <div className="flex items-center gap-2">
                  <SubscriptionBadge 
                    showLabel={true} 
                    size="sm" 
                    onClick={() => setShowUpgrade(true)} 
                  />
                  <Link to="/dashboard">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="gap-2 font-normal rounded-full hover:bg-white/5 text-[13px]"
                      style={{ color: COUTURE.gris }}
                    >
                      <LayoutDashboard size={14} />
                      {t("nav.dashboard")}
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost"
                    size="sm" 
                    onClick={handleLogout} 
                    className="gap-2 font-normal rounded-full hover:bg-white/5 p-2"
                    style={{ color: COUTURE.gris }}
                  >
                    <LogOut size={14} />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="font-normal rounded-full hover:bg-white/5 text-[13px] px-4"
                      style={{ color: COUTURE.gris }}
                    >
                      {t("nav.login")}
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        size="sm" 
                        className="font-medium px-5 rounded-full text-[13px] transition-all duration-300"
                        style={{ 
                          background: `linear-gradient(135deg, ${COUTURE.or} 0%, ${COUTURE.orLight} 100%)`,
                          color: COUTURE.noir,
                          boxShadow: `0 4px 20px ${COUTURE.or}30`,
                        }}
                      >
                        {t("nav.signup")}
                      </Button>
                    </motion.div>
                  </Link>
                </div>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-3">
            <motion.button
              className="p-2 rounded-full transition-colors"
              style={{ 
                color: COUTURE.ivoire,
                backgroundColor: `${COUTURE.ivoire}05`,
                border: `1px solid ${COUTURE.border}`,
              }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isMobileMenuOpen ? "close" : "menu"}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMobileMenuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Premium Full screen overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 top-16 lg:hidden z-40"
            style={{ backgroundColor: COUTURE.noir }}
          >
            {/* Gradient accent */}
            <div 
              className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at top, ${COUTURE.or}10 0%, transparent 70%)`,
              }}
            />
            
            <div className="container mx-auto px-6 py-10 relative z-10">
              <div className="flex flex-col gap-5">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: index * 0.08,
                      ease: [0.22, 1, 0.36, 1] 
                    }}
                  >
                    <Link
                      to={link.href}
                      className="flex items-center gap-3 text-2xl font-serif font-light transition-colors py-2"
                      style={{
                        color: link.highlight ? COUTURE.or : COUTURE.ivoire,
                        letterSpacing: "0.02em",
                      }}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.icon && <link.icon size={22} strokeWidth={1.5} style={{ color: COUTURE.or }} />}
                      <span>{link.label}</span>
                      {link.badge && (
                        <span 
                          className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full font-medium"
                          style={{ 
                            backgroundColor: `${COUTURE.or}20`,
                            color: COUTURE.or,
                          }}
                        >
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  </motion.div>
                ))}
                
                <motion.div 
                  className="pt-8 mt-6 flex flex-col gap-4"
                  style={{ borderTop: `1px solid ${COUTURE.border}` }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <div className="flex items-center gap-4">
                    <ThemeToggle />
                  </div>
                  
                  {user ? (
                    <>
                      <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button 
                          className="w-full gap-2 font-medium rounded-xl h-12"
                          style={{ 
                            background: `linear-gradient(135deg, ${COUTURE.or} 0%, ${COUTURE.orLight} 100%)`,
                            color: COUTURE.noir,
                          }}
                        >
                          <LayoutDashboard size={16} />
                          {t("nav.dashboard")}
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        className="w-full gap-2 font-normal rounded-xl h-12"
                        style={{ 
                          borderColor: COUTURE.border,
                          color: COUTURE.gris,
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
                          className="w-full font-normal rounded-xl h-12"
                          style={{ 
                            borderColor: COUTURE.border,
                            color: COUTURE.gris,
                            backgroundColor: "transparent",
                          }}
                        >
                          {t("nav.login")}
                        </Button>
                      </Link>
                      <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button 
                          className="w-full font-medium rounded-xl h-12"
                          style={{ 
                            background: `linear-gradient(135deg, ${COUTURE.or} 0%, ${COUTURE.orLight} 100%)`,
                            color: COUTURE.noir,
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

      <SubscriptionUpgrade 
        isOpen={showUpgrade} 
        onClose={() => setShowUpgrade(false)} 
      />
    </header>
  );
}
