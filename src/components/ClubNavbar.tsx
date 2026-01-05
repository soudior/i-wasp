/**
 * ClubNavbar — Navigation ultra-luxe i-wasp
 * Palette : Midnight Emerald & Brushed Bronze
 */

import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Crown, LogIn, LayoutDashboard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { href: "/produits", label: "Produits NFC" },
  { href: "/conciergerie", label: "Conciergerie & IA" },
  { href: "/club", label: "Club" },
  { href: "/pricing", label: "Tarifs" },
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? "bg-iwasp-midnight/90 backdrop-blur-xl border-b border-iwasp-emerald/10" 
            : "bg-transparent"
        }`}
      >
        <nav className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo — Brushed Bronze accent */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                {/* Outer glow ring */}
                <div className="absolute inset-0 rounded-xl bg-iwasp-bronze/20 blur-md group-hover:bg-iwasp-bronze/30 transition-all duration-500" />
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-iwasp-bronze to-iwasp-bronze-light flex items-center justify-center shadow-lg">
                  <Crown className="w-5 h-5 text-iwasp-midnight" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-display text-xl text-iwasp-cream tracking-tight italic">iW.</span>
                <span className="text-[10px] text-iwasp-silver tracking-[0.2em] uppercase -mt-1">L'identité absolue</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                    isActive(link.href)
                      ? "text-iwasp-bronze bg-iwasp-bronze/10"
                      : "text-iwasp-silver hover:text-iwasp-cream hover:bg-iwasp-emerald/5"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  <Link to="/dashboard">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-iwasp-silver hover:text-iwasp-cream hover:bg-iwasp-emerald/10 gap-2"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Espace client
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleLogout}
                    className="text-iwasp-silver hover:text-iwasp-cream hover:bg-iwasp-emerald/10 gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Déconnexion
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-iwasp-silver hover:text-iwasp-cream hover:bg-iwasp-emerald/10 gap-2"
                    >
                      <LogIn className="w-4 h-4" />
                      Connexion
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button 
                      size="sm"
                      className="bg-iwasp-bronze hover:bg-iwasp-bronze-light text-iwasp-midnight font-semibold gap-2 rounded-full px-5 tracking-wide uppercase text-xs"
                    >
                      Membres
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-iwasp-silver hover:text-iwasp-cream transition-colors"
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
              className="absolute inset-0 bg-iwasp-midnight/95 backdrop-blur-xl"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Menu content */}
            <div className="relative pt-24 px-6 pb-8">
              <div className="space-y-2">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                      to={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block px-4 py-3 text-lg font-medium rounded-xl transition-all ${
                        isActive(link.href)
                          ? "text-iwasp-bronze bg-iwasp-bronze/10"
                          : "text-iwasp-cream/80 hover:text-iwasp-cream hover:bg-iwasp-emerald/10"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
              
              {/* Auth buttons */}
              <div className="mt-8 pt-6 border-t border-iwasp-emerald/10 space-y-3">
                {user ? (
                  <>
                    <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full bg-iwasp-emerald/20 hover:bg-iwasp-emerald/30 text-iwasp-cream gap-2">
                        <LayoutDashboard className="w-4 h-4" />
                        Espace client
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      className="w-full text-iwasp-silver hover:text-iwasp-cream"
                      onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Déconnexion
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full bg-iwasp-bronze hover:bg-iwasp-bronze-light text-iwasp-midnight font-semibold gap-2 tracking-wide uppercase">
                        <Crown className="w-4 h-4" />
                        Rejoindre
                      </Button>
                    </Link>
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full text-iwasp-silver hover:text-iwasp-cream gap-2">
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
