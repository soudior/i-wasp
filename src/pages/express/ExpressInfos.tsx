/**
 * Express Step 2: Informations client + livraison
 * /express/infos
 * 
 * Formulaire minimal fusionné pour réduire les frictions
 */

import { useState, useMemo, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useExpressCheckout, ExpressCustomerInfo } from "@/contexts/ExpressCheckoutContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, User, Mail, Phone, MapPin, Lock } from "lucide-react";
import { COUTURE } from "@/lib/hauteCouturePalette";
import { toast } from "sonner";

const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.toLowerCase());
};

const validatePhone = (phone: string): boolean => {
  const cleaned = phone.replace(/[\s\-\.\(\)]/g, "");
  return cleaned.length >= 8 && /^[\+]?[0-9]+$/.test(cleaned);
};

export default function ExpressInfos() {
  const navigate = useNavigate();
  const { state, setCustomerInfo, canAccessStep } = useExpressCheckout();
  const [isNavigating, setIsNavigating] = useState(false);

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
      errs.phone = "Téléphone invalide";
    }
    if (!formData.address.trim()) errs.address = "Adresse requise";
    if (!formData.city.trim()) errs.city = "Ville requise";
    return errs;
  }, [formData]);

  const isValid = Object.keys(errors).length === 0;

  const handleChange = (field: keyof ExpressCustomerInfo, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
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

  const inputStyles = {
    backgroundColor: 'transparent',
    borderColor: COUTURE.jetSoft,
    color: COUTURE.silk,
  };

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
      <header className="relative z-10 px-6 py-6">
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
      <div className="relative z-10 px-6 mb-8">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1 rounded-full" style={{ backgroundColor: COUTURE.gold }} />
            <div className="flex-1 h-1 rounded-full" style={{ backgroundColor: COUTURE.gold }} />
            <div className="flex-1 h-1 rounded-full" style={{ backgroundColor: COUTURE.jetSoft }} />
          </div>
          <p className="text-center mt-3 text-[11px] uppercase tracking-[0.15em]" style={{ color: COUTURE.textMuted }}>
            Étape 2/3 — Vos informations
          </p>
        </div>
      </div>

      {/* Main content */}
      <main className="relative z-10 px-6 pb-40">
        <div className="max-w-lg mx-auto">
          {/* Title */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h1 
              className="font-display text-2xl font-light italic mb-2"
              style={{ color: COUTURE.silk }}
            >
              Vos <span style={{ color: COUTURE.gold }}>coordonnées.</span>
            </h1>
            <p className="text-sm" style={{ color: COUTURE.textMuted }}>
              Pour votre carte et la livraison
            </p>
          </motion.div>

          {/* Form compact */}
          <motion.div 
            className="space-y-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Section: Identité */}
            <div className="p-5" style={{ backgroundColor: COUTURE.jetSoft, border: `1px solid ${COUTURE.jetMuted}` }}>
              <div className="flex items-center gap-2 mb-4">
                <User size={14} style={{ color: COUTURE.gold }} />
                <span className="text-[11px] uppercase tracking-[0.1em]" style={{ color: COUTURE.textMuted }}>
                  Identité
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase tracking-[0.1em]" style={{ color: COUTURE.textMuted }}>
                    Prénom *
                  </Label>
                  <Input
                    value={formData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    onBlur={() => handleBlur("firstName")}
                    placeholder="Prénom"
                    className="h-11 rounded-none border-0 border-b bg-transparent focus:ring-0 text-base"
                    style={inputStyles}
                  />
                  {touched.firstName && errors.firstName && (
                    <p className="text-[10px]" style={{ color: "#e74c3c" }}>{errors.firstName}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase tracking-[0.1em]" style={{ color: COUTURE.textMuted }}>
                    Nom *
                  </Label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    onBlur={() => handleBlur("lastName")}
                    placeholder="Nom"
                    className="h-11 rounded-none border-0 border-b bg-transparent focus:ring-0 text-base"
                    style={inputStyles}
                  />
                  {touched.lastName && errors.lastName && (
                    <p className="text-[10px]" style={{ color: "#e74c3c" }}>{errors.lastName}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Section: Contact */}
            <div className="p-5" style={{ backgroundColor: COUTURE.jetSoft, border: `1px solid ${COUTURE.jetMuted}` }}>
              <div className="flex items-center gap-2 mb-4">
                <Phone size={14} style={{ color: COUTURE.gold }} />
                <span className="text-[11px] uppercase tracking-[0.1em]" style={{ color: COUTURE.textMuted }}>
                  Contact
                </span>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase tracking-[0.1em]" style={{ color: COUTURE.textMuted }}>
                    Email *
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: COUTURE.textMuted }} />
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      onBlur={() => handleBlur("email")}
                      placeholder="votre@email.com"
                      className="h-11 pl-6 rounded-none border-0 border-b bg-transparent focus:ring-0 text-base"
                      style={inputStyles}
                    />
                  </div>
                  {touched.email && errors.email && (
                    <p className="text-[10px]" style={{ color: "#e74c3c" }}>{errors.email}</p>
                  )}
                </div>
                
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase tracking-[0.1em]" style={{ color: COUTURE.textMuted }}>
                    Téléphone *
                  </Label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    onBlur={() => handleBlur("phone")}
                    placeholder="+212 6 00 00 00 00"
                    className="h-11 rounded-none border-0 border-b bg-transparent focus:ring-0 text-base"
                    style={inputStyles}
                  />
                  {touched.phone && errors.phone && (
                    <p className="text-[10px]" style={{ color: "#e74c3c" }}>{errors.phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Section: Livraison */}
            <div className="p-5" style={{ backgroundColor: COUTURE.jetSoft, border: `1px solid ${COUTURE.jetMuted}` }}>
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={14} style={{ color: COUTURE.gold }} />
                <span className="text-[11px] uppercase tracking-[0.1em]" style={{ color: COUTURE.textMuted }}>
                  Livraison (gratuite)
                </span>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase tracking-[0.1em]" style={{ color: COUTURE.textMuted }}>
                    Adresse *
                  </Label>
                  <Input
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    onBlur={() => handleBlur("address")}
                    placeholder="123 Rue Mohammed V, Quartier..."
                    className="h-11 rounded-none border-0 border-b bg-transparent focus:ring-0 text-base"
                    style={inputStyles}
                  />
                  {touched.address && errors.address && (
                    <p className="text-[10px]" style={{ color: "#e74c3c" }}>{errors.address}</p>
                  )}
                </div>
                
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase tracking-[0.1em]" style={{ color: COUTURE.textMuted }}>
                    Ville *
                  </Label>
                  <Input
                    value={formData.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    onBlur={() => handleBlur("city")}
                    placeholder="Casablanca"
                    className="h-11 rounded-none border-0 border-b bg-transparent focus:ring-0 text-base"
                    style={inputStyles}
                  />
                  {touched.city && errors.city && (
                    <p className="text-[10px]" style={{ color: "#e74c3c" }}>{errors.city}</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Fixed CTA */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-20 px-6 py-5"
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
            className="w-full flex items-center justify-center gap-3 py-4 transition-all duration-300 disabled:opacity-40"
            style={{ 
              backgroundColor: COUTURE.gold,
              color: COUTURE.jet,
            }}
          >
            <span className="text-sm uppercase tracking-[0.15em] font-medium">
              {isNavigating ? "Chargement..." : "Passer au paiement"}
            </span>
            {!isNavigating && <ArrowRight className="w-5 h-5" />}
          </motion.button>
          
          <div className="flex items-center justify-center gap-2 mt-3">
            <Lock className="w-3 h-3" style={{ color: COUTURE.gold }} />
            <p className="text-[10px]" style={{ color: COUTURE.textMuted }}>
              Données sécurisées · Jamais partagées
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
