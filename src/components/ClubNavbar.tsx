/**
 * ClubNavbar — Navigation ultra-luxe i-wasp
 * Palette Stealth Luxury: Noir Émeraude #050807, Argent Titane #A5A9B4, Platine #D1D5DB
 */

import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Crown, LogIn, LayoutDashboard, LogOut, ShoppingBag, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

// Stealth Luxury Colors
const STEALTH = {
  noir: "#050807",
  noirElevated: "#0A0F0D",
  titanium: "#A5A9B4",
  platinum: "#D1D5DB",
};

const NAV_LINKS = [
  { href: "/produits", label: "Produits NFC" },
  { href: "/features", label: "Fonctionnalités" },
  { href: "/pricing", label: "Tarifs" },
  { href: "/club", label: "Club" },
  { href: "/contact", label: "Contact" },
];

export function ClubNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const isActive = (href: string) => location.pathname === href;

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          backgroundColor: isScrolled ? `${STEALTH.noir}F0` : "transparent",
          backdropFilter: isScrolled ? "blur(20px)" : "none",
          borderBottom: isScrolled ? `1px solid ${STEALTH.titanium}10` : "none"
        }}
      >
        <nav className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div 
                  className="absolute inset-0 rounded-xl blur-md transition-all duration-500"
                  style={{ backgroundColor: `${STEALTH.titanium}20` }}
                />
                <div 
                  className="relative w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${STEALTH.titanium}, ${STEALTH.platinum})` }}
                >
                  <Crown className="w-5 h-5" style={{ color: STEALTH.noir }} />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-display text-xl text-white tracking-tight italic">iW.</span>
                <span 
                  className="text-[10px] tracking-[0.2em] uppercase -mt-1"
                  style={{ color: STEALTH.titanium }}
                >
                  Cartes NFC Pro
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300"
                  style={{
                    color: isActive(link.href) ? STEALTH.platinum : STEALTH.titanium,
                    backgroundColor: isActive(link.href) ? `${STEALTH.titanium}15` : "transparent"
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {/* CTA Commander - Toujours visible */}
              <Link to="/order/type">
                <Button 
                  size="sm"
                  className="gap-2 rounded-full px-5 font-semibold"
                  style={{ 
                    background: `linear-gradient(135deg, ${STEALTH.titanium}, ${STEALTH.platinum})`,
                    color: STEALTH.noir
                  }}
                >
                  <ShoppingBag className="w-4 h-4" />
                  Commander
                </Button>
              </Link>
              
              {user ? (
                <>
                  <Link to="/dashboard">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="gap-2"
                      style={{ color: STEALTH.titanium }}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Mon Espace
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleLogout}
                    className="gap-2"
                    style={{ color: STEALTH.titanium }}
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <Link to="/login">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="gap-2"
                    style={{ color: STEALTH.titanium }}
                  >
                    <LogIn className="w-4 h-4" />
                    Connexion
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 transition-colors"
              style={{ color: STEALTH.titanium }}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 backdrop-blur-xl"
              style={{ backgroundColor: `${STEALTH.noir}F5` }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Menu content */}
            <div className="relative pt-24 px-6 pb-8">
              {/* CTA Commander en premier - visible */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <Link to="/order/type" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button 
                    className="w-full gap-2 py-6 text-lg font-semibold rounded-2xl"
                    style={{ 
                      background: `linear-gradient(135deg, ${STEALTH.titanium}, ${STEALTH.platinum})`,
                      color: STEALTH.noir
                    }}
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Commander ma Carte NFC
                  </Button>
                </Link>
              </motion.div>
              
              <div className="space-y-2">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3 text-lg font-medium rounded-xl transition-all"
                      style={{
                        color: isActive(link.href) ? STEALTH.platinum : `${STEALTH.titanium}CC`,
                        backgroundColor: isActive(link.href) ? `${STEALTH.titanium}15` : "transparent"
                      }}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
              
              {/* Auth buttons */}
              <div 
                className="mt-8 pt-6 space-y-3"
                style={{ borderTop: `1px solid ${STEALTH.titanium}15` }}
              >
                {user ? (
                  <>
                    <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button 
                        className="w-full gap-2"
                        style={{ 
                          backgroundColor: `${STEALTH.titanium}20`,
                          color: 'white'
                        }}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Mon Espace Client
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      className="w-full"
                      style={{ color: STEALTH.titanium }}
                      onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Déconnexion
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button 
                        className="w-full gap-2 font-semibold tracking-wide uppercase"
                        style={{ 
                          backgroundColor: `${STEALTH.titanium}20`,
                          color: 'white'
                        }}
                      >
                        <Crown className="w-4 h-4" />
                        Créer un compte
                      </Button>
                    </Link>
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button 
                        variant="ghost" 
                        className="w-full gap-2"
                        style={{ color: STEALTH.titanium }}
                      >
                        <LogIn className="w-4 h-4" />
                        Connexion
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
