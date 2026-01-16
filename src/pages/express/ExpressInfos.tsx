/**
 * Express Step 2: Informations client + livraison
 * /express/infos
 * 
 * Formulaire OPTIMISÉ pour conversion maximale:
 * - Auto-format téléphone
 * - Preuve sociale
 * - CTA WhatsApp d'aide
 * - UI simplifiée
 */

import { useState, useMemo, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useExpressCheckout, ExpressCustomerInfo, EXPRESS_OFFERS } from "@/contexts/ExpressCheckoutContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, User, Mail, Phone, MapPin, Lock, MessageCircle, CheckCircle, Shield, Truck } from "lucide-react";
import { COUTURE } from "@/lib/hauteCouturePalette";
import { toast } from "sonner";
import { useExpressCheckoutTracking } from "@/hooks/useAnalyticsEvents";

const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.toLowerCase());
};

const validatePhone = (phone: string): boolean => {
  const cleaned = phone.replace(/[\s\-\.\(\)]/g, "");
  return cleaned.length >= 9 && /^[\+]?[0-9]+$/.test(cleaned);
};

// Auto-format phone number for Morocco
const formatPhoneNumber = (value: string): string => {
  // Remove all non-digit characters except +
  let digits = value.replace(/[^\d+]/g, "");
  
  // If starts with 0, convert to +212
  if (digits.startsWith("0")) {
    digits = "+212" + digits.slice(1);
  }
  
  // If no prefix, assume Morocco
  if (digits.length > 0 && !digits.startsWith("+")) {
    if (digits.length <= 9) {
      digits = "+212" + digits;
    }
  }
  
  // Format: +212 6 XX XX XX XX
  if (digits.startsWith("+212") && digits.length > 4) {
    const rest = digits.slice(4);
    let formatted = "+212";
    if (rest.length > 0) formatted += " " + rest.slice(0, 1);
    if (rest.length > 1) formatted += " " + rest.slice(1, 3);
    if (rest.length > 3) formatted += " " + rest.slice(3, 5);
    if (rest.length > 5) formatted += " " + rest.slice(5, 7);
    if (rest.length > 7) formatted += " " + rest.slice(7, 9);
    return formatted;
  }
  
  return digits;
};

// Moroccan cities for autocomplete
const POPULAR_CITIES = [
  "Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", 
  "Agadir", "Oujda", "Kenitra", "Tétouan", "Salé"
];

export default function ExpressInfos() {
  const navigate = useNavigate();
  const { state, setCustomerInfo, canAccessStep } = useExpressCheckout();
  const [isNavigating, setIsNavigating] = useState(false);
  const { trackInfoSubmit } = useExpressCheckoutTracking('infos');
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const selectedOffer = EXPRESS_OFFERS.find(o => o.id === state.selectedOffer);

  // Redirect if no offer selected
  useEffect(() => {
    if (!canAccessStep(2)) {
      navigate("/express/offre", { replace: true });
    }
  }, [canAccessStep, navigate]);

  const [formData, setFormData] = useState<ExpressCustomerInfo>(
    state.customerInfo || {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
    }
  );

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const errors = useMemo(() => {
    const errs: Record<string, string> = {};
    if (!formData.firstName.trim()) errs.firstName = "Prénom requis";
    if (!formData.lastName.trim()) errs.lastName = "Nom requis";
    if (!formData.email.trim()) {
      errs.email = "Email requis";
    } else if (!validateEmail(formData.email)) {
      errs.email = "Email invalide";
    }
    if (!formData.phone.trim()) {
      errs.phone = "Téléphone requis";
    } else if (!validatePhone(formData.phone)) {
      errs.phone = "Format: +212 6 XX XX XX XX";
    }
    if (!formData.address.trim()) errs.address = "Adresse requise";
    if (!formData.city.trim()) errs.city = "Ville requise";
    return errs;
  }, [formData]);

  const isValid = Object.keys(errors).length === 0;

  const handleChange = (field: keyof ExpressCustomerInfo, value: string) => {
    if (field === "phone") {
      value = formatPhoneNumber(value);
    }
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    if (field === "city") {
      setTimeout(() => setShowCityDropdown(false), 200);
    }
  };

  const handleCitySelect = (city: string) => {
    setFormData(prev => ({ ...prev, city }));
    setShowCityDropdown(false);
  };

  const handleContinue = () => {
    if (isNavigating) return;
    
    if (!isValid) {
      setTouched({
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        address: true,
        city: true,
      });
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    setIsNavigating(true);
    
    // Track info submission
    trackInfoSubmit(formData.city.trim());
    
    setCustomerInfo({
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.toLowerCase().trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      city: formData.city.trim(),
    });
    navigate("/express/payer");
  };

  const handleWhatsAppHelp = () => {
    const message = encodeURIComponent(`Bonjour ! J'ai besoin d'aide pour ma commande ${selectedOffer?.name || "IWASP"}.`);
    window.open(`https://wa.me/33626424394?text=${message}`, "_blank");
  };

  const inputStyles = {
    backgroundColor: 'transparent',
    borderColor: COUTURE.jetSoft,
    color: COUTURE.silk,
  };

  const filteredCities = POPULAR_CITIES.filter(city => 
    city.toLowerCase().includes(formData.city.toLowerCase())
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: COUTURE.jet }}>
      {/* Honeycomb texture */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cpath d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100' fill='none' stroke='${encodeURIComponent("#1a1a1a")}' stroke-width='0.4' stroke-opacity='0.04'/%3E%3C/svg%3E")`,
          backgroundSize: '56px 100px',
        }}
      />

      {/* Header */}
      <header className="relative z-10 px-6 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate("/express/offre")}
            className="flex items-center gap-2 transition-all duration-300"
            style={{ color: COUTURE.textMuted }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-[11px] uppercase tracking-[0.1em]">Retour</span>
          </button>
          
          <Link 
            to="/"
            className="font-display text-xl tracking-[0.1em]"
            style={{ color: COUTURE.silk }}
          >
            i-wasp
          </Link>
          
          <div className="w-16" />
        </div>
      </header>

      {/* Progress bar */}
      <div className="relative z-10 px-6 mb-6">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1 rounded-full" style={{ backgroundColor: COUTURE.gold }} />
            <div className="flex-1 h-1 rounded-full" style={{ backgroundColor: COUTURE.gold }} />
            <div className="flex-1 h-1 rounded-full" style={{ backgroundColor: COUTURE.jetSoft }} />
          </div>
          <p className="text-center mt-2 text-[11px] uppercase tracking-[0.15em]" style={{ color: COUTURE.textMuted }}>
            Étape 2/3 — Plus que 2 minutes
          </p>
        </div>
      </div>

      {/* Main content */}
      <main className="relative z-10 px-6 pb-44">
        <div className="max-w-lg mx-auto">
          {/* Social Proof Banner */}
          <motion.div 
            className="mb-6 p-3 rounded-lg flex items-center justify-center gap-2"
            style={{ backgroundColor: "rgba(212, 175, 55, 0.1)", border: `1px solid ${COUTURE.gold}30` }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <CheckCircle className="w-4 h-4" style={{ color: COUTURE.gold }} />
            <span className="text-xs" style={{ color: COUTURE.gold }}>
              <strong>+500 cartes</strong> livrées au Maroc · Livraison 48-72h
            </span>
          </motion.div>

          {/* Title */}
          <motion.div 
            className="text-center mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h1 
              className="font-display text-2xl font-light italic mb-1"
              style={{ color: COUTURE.silk }}
            >
              Où vous <span style={{ color: COUTURE.gold }}>livrer ?</span>
            </h1>
            <p className="text-sm" style={{ color: COUTURE.textMuted }}>
              {selectedOffer?.name} · {selectedOffer?.priceDisplay}
            </p>
          </motion.div>

          {/* Unified Form */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Name Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[10px] uppercase tracking-[0.1em]" style={{ color: COUTURE.textMuted }}>
                  Prénom
                </Label>
                <Input
                  value={formData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  onBlur={() => handleBlur("firstName")}
                  placeholder="Prénom"
                  className="h-12 rounded-lg bg-[#1a1a1a] border-[#333] focus:border-[#D4AF37] text-base"
                  style={{ color: COUTURE.silk }}
                />
                {touched.firstName && errors.firstName && (
                  <p className="text-[10px]" style={{ color: "#e74c3c" }}>{errors.firstName}</p>
                )}
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] uppercase tracking-[0.1em]" style={{ color: COUTURE.textMuted }}>
                  Nom
                </Label>
                <Input
                  value={formData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  onBlur={() => handleBlur("lastName")}
                  placeholder="Nom"
                  className="h-12 rounded-lg bg-[#1a1a1a] border-[#333] focus:border-[#D4AF37] text-base"
                  style={{ color: COUTURE.silk }}
                />
                {touched.lastName && errors.lastName && (
                  <p className="text-[10px]" style={{ color: "#e74c3c" }}>{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Phone with auto-format */}
            <div className="space-y-1">
              <Label className="text-[10px] uppercase tracking-[0.1em] flex items-center gap-2" style={{ color: COUTURE.textMuted }}>
                <Phone className="w-3 h-3" style={{ color: COUTURE.gold }} />
                Téléphone WhatsApp
              </Label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                onBlur={() => handleBlur("phone")}
                placeholder="+212 6 00 00 00 00"
                className="h-12 rounded-lg bg-[#1a1a1a] border-[#333] focus:border-[#D4AF37] text-base"
                style={{ color: COUTURE.silk }}
              />
              {touched.phone && errors.phone && (
                <p className="text-[10px]" style={{ color: "#e74c3c" }}>{errors.phone}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <Label className="text-[10px] uppercase tracking-[0.1em] flex items-center gap-2" style={{ color: COUTURE.textMuted }}>
                <Mail className="w-3 h-3" style={{ color: COUTURE.gold }} />
                Email (pour le suivi)
              </Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                placeholder="votre@email.com"
                className="h-12 rounded-lg bg-[#1a1a1a] border-[#333] focus:border-[#D4AF37] text-base"
                style={{ color: COUTURE.silk }}
              />
              {touched.email && errors.email && (
                <p className="text-[10px]" style={{ color: "#e74c3c" }}>{errors.email}</p>
              )}
            </div>

            {/* City with suggestions */}
            <div className="space-y-1 relative">
              <Label className="text-[10px] uppercase tracking-[0.1em] flex items-center gap-2" style={{ color: COUTURE.textMuted }}>
                <MapPin className="w-3 h-3" style={{ color: COUTURE.gold }} />
                Ville
              </Label>
              <Input
                value={formData.city}
                onChange={(e) => {
                  handleChange("city", e.target.value);
                  setShowCityDropdown(true);
                }}
                onFocus={() => setShowCityDropdown(true)}
                onBlur={() => handleBlur("city")}
                placeholder="Casablanca"
                className="h-12 rounded-lg bg-[#1a1a1a] border-[#333] focus:border-[#D4AF37] text-base"
                style={{ color: COUTURE.silk }}
              />
              {showCityDropdown && filteredCities.length > 0 && formData.city.length > 0 && (
                <div 
                  className="absolute top-full left-0 right-0 mt-1 rounded-lg overflow-hidden z-30"
                  style={{ backgroundColor: "#1a1a1a", border: `1px solid ${COUTURE.jetSoft}` }}
                >
                  {filteredCities.slice(0, 5).map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => handleCitySelect(city)}
                      className="w-full text-left px-4 py-3 text-sm hover:bg-[#252525] transition-colors"
                      style={{ color: COUTURE.silk }}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
              {touched.city && errors.city && (
                <p className="text-[10px]" style={{ color: "#e74c3c" }}>{errors.city}</p>
              )}
            </div>

            {/* Address */}
            <div className="space-y-1">
              <Label className="text-[10px] uppercase tracking-[0.1em] flex items-center gap-2" style={{ color: COUTURE.textMuted }}>
                <Truck className="w-3 h-3" style={{ color: COUTURE.gold }} />
                Adresse de livraison
              </Label>
              <Input
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                onBlur={() => handleBlur("address")}
                placeholder="123 Rue Mohammed V, Quartier..."
                className="h-12 rounded-lg bg-[#1a1a1a] border-[#333] focus:border-[#D4AF37] text-base"
                style={{ color: COUTURE.silk }}
              />
              {touched.address && errors.address && (
                <p className="text-[10px]" style={{ color: "#e74c3c" }}>{errors.address}</p>
              )}
            </div>

            {/* WhatsApp Help */}
            <motion.button
              type="button"
              onClick={handleWhatsAppHelp}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg transition-all"
              style={{ 
                backgroundColor: "rgba(37, 211, 102, 0.1)", 
                border: "1px solid rgba(37, 211, 102, 0.3)",
                color: "#25D366"
              }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">Besoin d'aide ? WhatsApp</span>
            </motion.button>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" style={{ color: COUTURE.gold }} />
                <span className="text-[10px]" style={{ color: COUTURE.textMuted }}>Paiement sécurisé</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" style={{ color: COUTURE.gold }} />
                <span className="text-[10px]" style={{ color: COUTURE.textMuted }}>Livraison gratuite</span>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Fixed CTA */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-20 px-6 py-4"
        style={{ 
          backgroundColor: COUTURE.jet,
          borderTop: `1px solid ${COUTURE.jetSoft}`,
        }}
      >
        <div className="max-w-lg mx-auto">
          <motion.button
            onClick={handleContinue}
            disabled={isNavigating}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-xl transition-all duration-300 disabled:opacity-40"
            style={{ 
              backgroundColor: COUTURE.gold,
              color: COUTURE.jet,
            }}
          >
            <span className="text-sm uppercase tracking-[0.15em] font-medium">
              {isNavigating ? "Chargement..." : "Continuer vers le paiement"}
            </span>
            {!isNavigating && <ArrowRight className="w-5 h-5" />}
          </motion.button>
          
          <div className="flex items-center justify-center gap-2 mt-2">
            <Lock className="w-3 h-3" style={{ color: COUTURE.gold }} />
            <p className="text-[10px]" style={{ color: COUTURE.textMuted }}>
              Données cryptées · Jamais partagées
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
