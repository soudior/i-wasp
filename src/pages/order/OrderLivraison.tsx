/**
 * Step 4: Livraison
 * /order/livraison
 * 
 * Style: Haute Couture Digitale — Noir, minimaliste
 */

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useOrderFunnel, ShippingInfo, OrderFunnelGuard } from "@/contexts/OrderFunnelContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { COUTURE } from "@/lib/hauteCouturePalette";
import { ArrowLeft, MapPin, Home, Building, Hotel } from "lucide-react";
import { toast } from "sonner";

const ADDRESS_TYPES = [
  { id: "domicile" as const, icon: Home, label: "Domicile" },
  { id: "entreprise" as const, icon: Building, label: "Bureau" },
  { id: "hotel" as const, icon: Hotel, label: "Hôtel" },
];

function OrderLivraisonContent() {
  const { state, setShippingInfo, setPaymentInfo, nextStep, prevStep } = useOrderFunnel();
  const [isNavigating, setIsNavigating] = useState(false);
  
  const [formData, setFormData] = useState<ShippingInfo>(
    state.shippingInfo || {
      addressType: "domicile",
      address: "",
      city: "",
      country: "Maroc",
      phone: "",
    }
  );

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const errors = useMemo(() => {
    const errs: Record<string, string> = {};
    if (!formData.address.trim()) errs.address = "Adresse requise";
    if (!formData.city.trim()) errs.city = "Ville requise";
    if (!formData.phone.trim()) errs.phone = "Téléphone requis";
    return errs;
  }, [formData]);

  const isValid = Object.keys(errors).length === 0;

  const handleChange = (field: keyof ShippingInfo, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleContinue = async () => {
    if (isNavigating || state.isTransitioning) return;
    
    if (!isValid) {
      setTouched({
        address: true,
        city: true,
        phone: true,
      });
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    setIsNavigating(true);

    const normalizedData: ShippingInfo = {
      addressType: formData.addressType,
      address: formData.address.trim(),
      city: formData.city.trim(),
      country: formData.country.trim() || "Maroc",
      phone: formData.phone.trim(),
    };

    setShippingInfo(normalizedData);
    setPaymentInfo({ method: "cod" });
    await nextStep();
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
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => prevStep()}
            className="flex items-center gap-2 transition-all duration-500"
            style={{ color: COUTURE.textMuted }}
            onMouseEnter={(e) => e.currentTarget.style.color = COUTURE.silk}
            onMouseLeave={(e) => e.currentTarget.style.color = COUTURE.textMuted}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-[11px] uppercase tracking-[0.15em]">Retour</span>
          </button>
          
          <Link 
            to="/"
            className="font-display text-lg tracking-[0.1em]"
            style={{ color: COUTURE.silk }}
          >
            i-wasp
          </Link>
          
          <div className="w-16" />
        </div>
      </header>

      {/* Progress indicator */}
      <div className="relative z-10 px-6 mb-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 justify-center">
            <span 
              className="text-[10px] uppercase tracking-[0.3em]"
              style={{ color: COUTURE.gold }}
            >
              05
            </span>
            <div 
              className="w-12 h-px"
              style={{ backgroundColor: `${COUTURE.gold}40` }}
            />
            <span 
              className="text-[10px] uppercase tracking-[0.2em]"
              style={{ color: COUTURE.textMuted }}
            >
              Livraison
            </span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="relative z-10 px-6 pb-32">
        <div className="max-w-xl mx-auto">
          {/* Title */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            <h1 
              className="font-display text-2xl md:text-3xl font-light italic mb-3"
              style={{ color: COUTURE.silk }}
            >
              Adresse de <span style={{ color: COUTURE.gold }}>livraison.</span>
            </h1>
            <p 
              className="text-sm font-light"
              style={{ color: COUTURE.textMuted }}
            >
              Où livrer votre carte ?
            </p>
          </motion.div>

          {/* Form */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
          >
            {/* Address type */}
            <div className="space-y-3">
              <Label className="text-[11px] uppercase tracking-[0.1em] flex items-center gap-2" style={{ color: COUTURE.textMuted }}>
                <MapPin className="w-3 h-3" /> Type d'adresse
              </Label>
              <div className="grid grid-cols-3 gap-3">
                {ADDRESS_TYPES.map((type) => {
                  const isSelected = formData.addressType === type.id;
                  const Icon = type.icon;
                  
                  return (
                    <button
                      key={type.id}
                      onClick={() => handleChange("addressType", type.id)}
                      className="flex flex-col items-center py-4 transition-all duration-500"
                      style={{
                        backgroundColor: isSelected ? `${COUTURE.gold}10` : 'transparent',
                        border: `1px solid ${isSelected ? COUTURE.gold : COUTURE.jetSoft}`,
                      }}
                    >
                      <Icon 
                        className="w-5 h-5 mb-2" 
                        style={{ color: isSelected ? COUTURE.gold : COUTURE.textMuted }} 
                      />
                      <span 
                        className="text-[10px] uppercase tracking-[0.1em]"
                        style={{ color: isSelected ? COUTURE.gold : COUTURE.textMuted }}
                      >
                        {type.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label className="text-[11px] uppercase tracking-[0.1em]" style={{ color: COUTURE.textMuted }}>
                Adresse complète *
              </Label>
              <Input
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                onBlur={() => handleBlur("address")}
                placeholder="123 Rue Mohammed V, Quartier Maarif"
                className="rounded-none border-0 border-b bg-transparent focus:ring-0"
                style={inputStyles}
              />
              {touched.address && errors.address && (
                <p className="text-[10px]" style={{ color: "#8B4049" }}>{errors.address}</p>
              )}
            </div>

            {/* City */}
            <div className="space-y-2">
              <Label className="text-[11px] uppercase tracking-[0.1em]" style={{ color: COUTURE.textMuted }}>
                Ville *
              </Label>
              <Input
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
                onBlur={() => handleBlur("city")}
                placeholder="Casablanca"
                className="rounded-none border-0 border-b bg-transparent focus:ring-0"
                style={inputStyles}
              />
              {touched.city && errors.city && (
                <p className="text-[10px]" style={{ color: "#8B4049" }}>{errors.city}</p>
              )}
            </div>

            {/* Country */}
            <div className="space-y-2">
              <Label className="text-[11px] uppercase tracking-[0.1em]" style={{ color: COUTURE.textMuted }}>
                Pays
              </Label>
              <Input
                value={formData.country}
                onChange={(e) => handleChange("country", e.target.value)}
                placeholder="Maroc"
                className="rounded-none border-0 border-b bg-transparent focus:ring-0"
                style={inputStyles}
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label className="text-[11px] uppercase tracking-[0.1em]" style={{ color: COUTURE.textMuted }}>
                Téléphone de livraison *
              </Label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                onBlur={() => handleBlur("phone")}
                placeholder="+212 6 00 00 00 00"
                className="rounded-none border-0 border-b bg-transparent focus:ring-0"
                style={inputStyles}
              />
              {touched.phone && errors.phone && (
                <p className="text-[10px]" style={{ color: "#8B4049" }}>{errors.phone}</p>
              )}
            </div>

            {/* Info */}
            <p 
              className="text-[11px] text-center pt-4 font-light"
              style={{ color: COUTURE.textMuted }}
            >
              Livraison gratuite • 48h-72h
            </p>
          </motion.div>
        </div>
      </main>

      {/* Fixed CTA */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-20 px-6 py-6"
        style={{ 
          backgroundColor: COUTURE.jet,
          borderTop: `1px solid ${COUTURE.jetSoft}`,
        }}
      >
        <div className="max-w-3xl mx-auto flex justify-center">
          <button
            onClick={handleContinue}
            disabled={!isValid || isNavigating || state.isTransitioning}
            className="text-[11px] uppercase tracking-[0.25em] font-light transition-all duration-700 pb-1 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ 
              color: isValid ? COUTURE.gold : COUTURE.textMuted,
              borderBottom: `1px solid ${isValid ? `${COUTURE.gold}60` : 'transparent'}`,
            }}
          >
            {isNavigating ? "Chargement..." : "Continuer"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OrderLivraison() {
  return (
    <OrderFunnelGuard step={5}>
      <OrderLivraisonContent />
    </OrderFunnelGuard>
  );
}
