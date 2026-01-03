import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LayoutDashboard, LogOut, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useTranslation } from "react-i18next";
import { LanguageSelector } from "@/components/LanguageSelector";
import { AnimatedIWASPLogo } from "@/components/AnimatedIWASPLogo";

export function Navbar() {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();
  const { totalItems } = useCart();

  const WHATSAPP_COMMANDER = "https://wa.me/33626424394?text=Bonjour%20👋%0AJe%20souhaite%20commander%20une%20carte%20NFC%20i-wasp.";
  
  const navLinks = [
    { href: "/", label: "Accueil", isExternal: false },
    { href: "/features", label: "Fonctionnalités", isExternal: false },
    { href: "/pricing", label: "Tarifs", isExternal: false },
    { href: "/enterprise", label: "Entreprises", isExternal: false },
    { href: WHATSAPP_COMMANDER, label: "Commander", highlight: true, isExternal: true },
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-iwasp-bg/95 backdrop-blur-xl border-b border-white/5" : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo iWasp */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-gold-500 flex items-center justify-center">
              <span className="text-black font-bold text-sm">iW</span>
            </div>
            <span className="text-white font-semibold text-lg tracking-tight">iWasp</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              link.isExternal ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    link.highlight
                      ? "bg-gold-500 text-black hover:bg-gold-400"
                      : "text-iwasp-gray hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    link.highlight
                      ? "bg-gold-500 text-black hover:bg-gold-400"
                      : location.pathname === link.href
                      ? "text-white bg-white/10"
                      : "text-iwasp-gray hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              )
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Selector */}
            <LanguageSelector />

            {/* Cart Icon */}
            <Link to="/cart" className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-amber-500 text-background text-xs font-semibold flex items-center justify-center">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </Link>

            {!loading && (
              user ? (
                <>
                  <Link to="/dashboard">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <LayoutDashboard size={16} />
                      {t("nav.dashboard")}
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
                    <LogOut size={16} />
                    {t("nav.logout")}
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="sm">
                      {t("nav.login")}
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button variant="chrome" size="sm">
                      {t("nav.signup")}
                    </Button>
                  </Link>
                </>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageSelector />
            <button
              className="p-2 text-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu (CSS-only, kept mounted to avoid DOM reconciliation edge-cases) */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-out transform-gpu ${
            isMobileMenuOpen
              ? "max-h-[520px] opacity-100 translate-y-0"
              : "max-h-0 opacity-0 -translate-y-2 pointer-events-none"
          }`}
          aria-hidden={!isMobileMenuOpen}
        >
          <div className="py-6 space-y-4">
            {navLinks.map((link) => (
              link.isExternal ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block text-lg font-medium transition-colors ${
                    link.highlight
                      ? "inline-flex px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-background font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`block text-lg font-medium transition-colors ${
                    link.highlight
                      ? "inline-flex px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-background font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              )
            ))}
            <div className="pt-4 flex flex-col gap-3">
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="chrome" className="w-full gap-2">
                      <LayoutDashboard size={16} />
                      {t("nav.dashboard")}
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full gap-2"
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
                    <Button variant="outline" className="w-full">
                      {t("nav.login")}
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="chrome" className="w-full">
                      {t("nav.signup")}
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
