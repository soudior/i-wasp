import { normalizeExpressPhone } from "@/lib/expressPublicProfile";
/**
 * Express Step 2: Informations client + livraison
 * /express/infos
 * 
 * Style: Apple/Cupertino - Clean, professional, high-conversion
 */

import { useState, useMemo, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useExpressCheckout, ExpressCustomerInfo, EXPRESS_OFFERS } from "@/contexts/ExpressCheckoutContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, User, Mail, Phone, MapPin, MessageCircle, CheckCircle, Shield, Truck } from "lucide-react";
import { APPLE } from "@/lib/applePalette";
import { toast } from "sonner";
import { useExpressCheckoutTracking } from "@/hooks/useAnalyticsEvents";

const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.toLowerCase());
};

const validatePhone = (phone: string): boolean => {
  const cleaned = phone.replace(/[\s\-\.\(\)]/g, "");
  return /^\+?[0-9]{8,15}$/.test(cleaned);
};

const POPULAR_CITIES = [
  "Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", 
  "Agadir", "Oujda", "Kenitra", "Tétouan", "Salé"
];

export default function ExpressInfos() {
  const navigate = useNavigate();
  const { state, setCustomerInfo, setCustomerDraft, storageWarning, canAccessStep } = useExpressCheckout();
  const [isNavigating, setIsNavigating] = useState(false);
  const { trackInfoSubmit } = useExpressCheckoutTracking('infos');
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const selectedOffer = EXPRESS_OFFERS.find(o => o.id === state.selectedOffer);

  useEffect(() => {
    if (!canAccessStep(2)) {
      navigate("/express/offre", { replace: true });
    }
  }, [canAccessStep, navigate]);

  const [formData, setFormData] = useState<ExpressCustomerInfo>(
    state.customerDraft || state.customerInfo || {
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
      errs.phone = "Indiquez 8 à 15 chiffres ; aucun indicatif n’est ajouté automatiquement.";
    }
    if (!formData.address.trim()) errs.address = "Adresse requise";
    if (!formData.city.trim()) errs.city = "Ville requise";
    return errs;
  }, [formData]);

  const isValid = Object.keys(errors).length === 0;

  const handleChange = (field: keyof ExpressCustomerInfo, value: string) => {
    const next = { ...formData, [field]: value, publishNameOnly: false };
    setFormData(next);
    setCustomerDraft(next);
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    if (field === "city") {
      setTimeout(() => setShowCityDropdown(false), 200);
    }
  };

  const handleCitySelect = (city: string) => {
    handleChange("city", city);
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
      requestAnimationFrame(() => document.getElementById(`express-${Object.keys(errors)[0]}`)?.focus());
      return;
    }

    setIsNavigating(true);
    trackInfoSubmit(formData.city.trim());
    
    setCustomerInfo({
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.toLowerCase().trim(),
      phone: normalizeExpressPhone(formData.phone),
      publishNameOnly: formData.publishNameOnly === true,
      address: formData.address.trim(),
      city: formData.city.trim(),
    });
    navigate("/express/payer");
  };

  const handleWhatsAppHelp = () => {
    const message = encodeURIComponent(`Bonjour ! J'ai besoin d'aide pour ma commande ${selectedOffer?.name || "IWASP"}.`);
    window.open(`https://wa.me/33626424394?text=${message}`, "_blank");
  };

  const filteredCities = POPULAR_CITIES.filter(city => 
    city.toLowerCase().includes(formData.city.toLowerCase())
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: APPLE.background }}>
      {/* Header */}
      <header className="px-6 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate("/express/offre")}
            className="flex items-center gap-2 transition-all"
            style={{ color: APPLE.textSecondary }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Retour</span>
          </button>
          
          <Link 
            to="/"
            className="text-xl font-semibold tracking-tight"
            style={{ color: APPLE.text }}
          >
            IWASP
          </Link>
          
          <div className="w-16" />
        </div>
      </header>

      {/* Progress bar */}
      <div className="px-6 mb-6">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1 rounded-full" style={{ backgroundColor: APPLE.accent }} />
            <div className="flex-1 h-1 rounded-full" style={{ backgroundColor: APPLE.accent }} />
            <div className="flex-1 h-1 rounded-full" style={{ backgroundColor: APPLE.border }} />
          </div>
          <p className="text-center mt-2 text-xs font-medium" style={{ color: APPLE.textMuted }}>
            Étape 2 sur 3 — Coordonnées de commande
          </p>
        </div>
      </div>

      {/* Main content */}
      <main className="px-6 pb-44">
        <div className="max-w-lg mx-auto">
          {/* Title */}
          <motion.div 
            className="text-center mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h1 
              className="text-2xl font-semibold tracking-tight mb-2"
              style={{ color: APPLE.text }}
            >
              Où vous livrer ?
            </h1>
            <p className="text-base" style={{ color: APPLE.textSecondary }}>
              {selectedOffer?.name} · {selectedOffer?.priceDisplay}
            </p>
          </motion.div>

          {/* Form */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Name Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="express-firstName" className="text-sm font-medium" style={{ color: APPLE.textSecondary }}>
                  Prénom
                </Label>
                <Input
                  id="express-firstName" required aria-invalid={Boolean(touched.firstName && errors.firstName)} aria-describedby={touched.firstName && errors.firstName ? "express-firstName-error" : undefined}
                value={formData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  onBlur={() => handleBlur("firstName")}
                  placeholder="Prénom"
                  className="h-12 text-base"
                  style={{ 
                    backgroundColor: APPLE.card,
                    borderColor: touched.firstName && errors.firstName ? APPLE.error : APPLE.border,
                    borderRadius: APPLE.radiusMd,
                    color: APPLE.text,
                  }}
                />
                {touched.firstName && errors.firstName && (
                  <p id="express-firstName-error" className="text-xs" style={{ color: APPLE.error }}>{errors.firstName}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="express-lastName" className="text-sm font-medium" style={{ color: APPLE.textSecondary }}>
                  Nom
                </Label>
                <Input
                  id="express-lastName" required aria-invalid={Boolean(touched.lastName && errors.lastName)} aria-describedby={touched.lastName && errors.lastName ? "express-lastName-error" : undefined}
                value={formData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  onBlur={() => handleBlur("lastName")}
                  placeholder="Nom"
                  className="h-12 text-base"
                  style={{ 
                    backgroundColor: APPLE.card,
                    borderColor: touched.lastName && errors.lastName ? APPLE.error : APPLE.border,
                    borderRadius: APPLE.radiusMd,
                    color: APPLE.text,
                  }}
                />
                {touched.lastName && errors.lastName && (
                  <p id="express-lastName-error" className="text-xs" style={{ color: APPLE.error }}>{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <Label htmlFor="express-phone" className="text-sm font-medium flex items-center gap-2" style={{ color: APPLE.textSecondary }}>
                <Phone className="w-4 h-4" style={{ color: APPLE.accent }} />
                Téléphone WhatsApp
              </Label>
              <Input
                type="tel"
                id="express-phone" required aria-invalid={Boolean(touched.phone && errors.phone)} aria-describedby={touched.phone && errors.phone ? "express-phone-error" : undefined}
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                onBlur={() => handleBlur("phone")}
                placeholder="+212 6 00 00 00 00"
                className="h-12 text-base"
                style={{ 
                  backgroundColor: APPLE.card,
                  borderColor: touched.phone && errors.phone ? APPLE.error : APPLE.border,
                  borderRadius: APPLE.radiusMd,
                  color: APPLE.text,
                }}
              />
              {touched.phone && errors.phone && (
                <p id="express-phone-error" className="text-xs" style={{ color: APPLE.error }}>{errors.phone}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="express-email" className="text-sm font-medium flex items-center gap-2" style={{ color: APPLE.textSecondary }}>
                <Mail className="w-4 h-4" style={{ color: APPLE.accent }} />
                Email (pour le suivi)
              </Label>
              <Input
                type="email"
                id="express-email" required aria-invalid={Boolean(touched.email && errors.email)} aria-describedby={touched.email && errors.email ? "express-email-error" : undefined}
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                placeholder="votre@email.com"
                className="h-12 text-base"
                style={{ 
                  backgroundColor: APPLE.card,
                  borderColor: touched.email && errors.email ? APPLE.error : APPLE.border,
                  borderRadius: APPLE.radiusMd,
                  color: APPLE.text,
                }}
              />
              {touched.email && errors.email && (
                <p id="express-email-error" className="text-xs" style={{ color: APPLE.error }}>{errors.email}</p>
              )}
            </div>

            {/* City */}
            <div className="space-y-1.5 relative">
              <Label htmlFor="express-city" className="text-sm font-medium flex items-center gap-2" style={{ color: APPLE.textSecondary }}>
                <MapPin className="w-4 h-4" style={{ color: APPLE.accent }} />
                Ville
              </Label>
              <Input
                id="express-city" required aria-invalid={Boolean(touched.city && errors.city)} aria-describedby={touched.city && errors.city ? "express-city-error" : undefined}
                value={formData.city}
                onChange={(e) => {
                  handleChange("city", e.target.value);
                  setShowCityDropdown(true);
                }}
                onFocus={() => setShowCityDropdown(true)}
                onBlur={() => handleBlur("city")}
                placeholder="Casablanca"
                className="h-12 text-base"
                style={{ 
                  backgroundColor: APPLE.card,
                  borderColor: touched.city && errors.city ? APPLE.error : APPLE.border,
                  borderRadius: APPLE.radiusMd,
                  color: APPLE.text,
                }}
              />
              {showCityDropdown && filteredCities.length > 0 && formData.city.length > 0 && (
                <div 
                  className="absolute top-full left-0 right-0 mt-1 overflow-hidden z-30"
                  style={{ 
                    backgroundColor: APPLE.card, 
                    borderRadius: APPLE.radiusMd,
                    border: `1px solid ${APPLE.border}`,
                    boxShadow: APPLE.shadowMd,
                  }}
                >
                  {filteredCities.slice(0, 5).map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => handleCitySelect(city)}
                      className="w-full text-left px-4 py-3 text-base hover:bg-gray-50 transition-colors"
                      style={{ color: APPLE.text }}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
              {touched.city && errors.city && (
                <p id="express-city-error" className="text-xs" style={{ color: APPLE.error }}>{errors.city}</p>
              )}
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <Label htmlFor="express-address" className="text-sm font-medium flex items-center gap-2" style={{ color: APPLE.textSecondary }}>
                <Truck className="w-4 h-4" style={{ color: APPLE.accent }} />
                Adresse de livraison
              </Label>
              <Input
                id="express-address" required aria-invalid={Boolean(touched.address && errors.address)} aria-describedby={touched.address && errors.address ? "express-address-error" : undefined}
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                onBlur={() => handleBlur("address")}
                placeholder="123 Rue Mohammed V, Quartier..."
                className="h-12 text-base"
                style={{ 
                  backgroundColor: APPLE.card,
                  borderColor: touched.address && errors.address ? APPLE.error : APPLE.border,
                  borderRadius: APPLE.radiusMd,
                  color: APPLE.text,
                }}
              />
              {touched.address && errors.address && (
                <p id="express-address-error" className="text-xs" style={{ color: APPLE.error }}>{errors.address}</p>
              )}
            </div>

            <section className="rounded-xl border p-4 space-y-3" style={{color: APPLE.text, backgroundColor: APPLE.card}} aria-label="Visibilité du profil">
              <p className="text-sm">L’email, le téléphone et l’adresse ci-dessus servent à la commande. Ils ne sont pas copiés sur votre profil public.</p>
              <label className="flex gap-3 text-sm items-start">
                <input type="checkbox" className="mt-1 w-5 h-5" checked={formData.publishNameOnly === true}
                  onChange={e => { const next = {...formData, publishNameOnly:e.target.checked}; setFormData(next); setCustomerDraft(next); }} />
                Je souhaite aussi un profil public avec uniquement mon prénom et mon nom (facultatif, pour un compte connecté).
              </label>
              <p className="text-sm">Sans cette option, ce tunnel ne crée pas de profil. Pour choisir les informations et la palette de votre carte, utilisez le <Link to="/order/offre" className="underline">parcours de personnalisation</Link>.</p>
              <p className="text-sm">Brouillon conservé dans cet onglet. <Link to="/privacy" className="underline">Confidentialité</Link></p>
              {storageWarning && <p role="alert">Le navigateur ne peut pas conserver ce brouillon après rechargement. Gardez cette page ouverte.</p>}
            </section>

            {/* WhatsApp Help */}
            <motion.button
              type="button"
              onClick={handleWhatsAppHelp}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl transition-all"
              style={{ 
                backgroundColor: "rgba(37, 211, 102, 0.1)", 
                border: "1px solid rgba(37, 211, 102, 0.3)",
                color: "#25D366",
                borderRadius: APPLE.radiusMd,
              }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Besoin d'aide ? WhatsApp</span>
            </motion.button>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-6 pt-2">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" style={{ color: APPLE.accent }} />
                <span className="text-xs font-medium" style={{ color: APPLE.textSecondary }}>Paiement sécurisé</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4" style={{ color: APPLE.accent }} />
                <span className="text-xs font-medium" style={{ color: APPLE.textSecondary }}>Livraison gratuite</span>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Fixed CTA */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-20 px-6 py-5"
        style={{ 
          backgroundColor: APPLE.background,
          borderTop: `1px solid ${APPLE.border}`,
        }}
      >
        <div className="max-w-lg mx-auto">
          <motion.button
            onClick={handleContinue}
            disabled={isNavigating}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-xl transition-all duration-200"
            style={{ 
              backgroundColor: APPLE.accent,
              color: "#FFFFFF",
              fontWeight: 600,
            }}
          >
            <span className="text-base">
              {isNavigating ? "Chargement..." : "Continuer vers le paiement"}
            </span>
            {!isNavigating && <ArrowRight className="w-5 h-5" />}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
