/**
 * Step 3: Personnalisation carte physique
 * /order/carte
 * 
 * Style: Haute Couture Digitale — Noir, minimaliste
 */

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useOrderFunnel, OrderFunnelGuard, CardPersonalization } from "@/contexts/OrderFunnelContext";
import { COUTURE } from "@/lib/hauteCouturePalette";
import { ArrowLeft, Upload, Check, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import iwaspLogo from "@/assets/iwasp-logo.png";

interface CardMaterial {
  id: string;
  label: string;
  description: string;
}

const CARD_MATERIALS: CardMaterial[] = [
  { id: "standard", label: "PVC", description: "Élégant et résistant" },
  { id: "soft-touch", label: "Soft-Touch", description: "Toucher velouté" },
  { id: "metal", label: "Métal", description: "Gravure laser" },
];

function OrderCarteContent() {
  const { state, setCardPersonalization, nextStep, prevStep } = useOrderFunnel();
  const [isNavigating, setIsNavigating] = useState(false);
  const [showBack, setShowBack] = useState(false);
  
  const [selectedMaterial, setSelectedMaterial] = useState(state.cardPersonalization?.fileName || "soft-touch");
  const [logoUrl, setLogoUrl] = useState<string | null>(state.cardPersonalization?.imageUrl || null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleLogoUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner une image");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'image doit faire moins de 5 Mo");
      return;
    }

    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      setLogoUrl(e.target?.result as string);
      setIsUploading(false);
      toast.success("Logo ajouté");
    };
    reader.onerror = () => {
      toast.error("Erreur lors du chargement");
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleContinue = async () => {
    if (isNavigating || state.isTransitioning) return;
    setIsNavigating(true);

    const personalization: CardPersonalization = {
      visualType: logoUrl ? "logo" : "photo",
      imageUrl: logoUrl || "",
      fileName: selectedMaterial,
    };

    setCardPersonalization(personalization);
    await nextStep();
  };

  // Skip customization for Essentiel
  if (state.selectedOffer === "essentiel") {
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
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-[11px] uppercase tracking-[0.15em]">Retour</span>
            </button>
            
            <Link to="/" className="font-display text-lg tracking-[0.1em]" style={{ color: COUTURE.silk }}>
              i-wasp
            </Link>
            
            <div className="w-16" />
          </div>
        </header>

        {/* Progress */}
        <div className="relative z-10 px-6 mb-12">
          <div className="max-w-3xl mx-auto flex items-center gap-3 justify-center">
            <span className="text-[10px] uppercase tracking-[0.3em]" style={{ color: COUTURE.gold }}>04</span>
            <div className="w-12 h-px" style={{ backgroundColor: `${COUTURE.gold}40` }} />
            <span className="text-[10px] uppercase tracking-[0.2em]" style={{ color: COUTURE.textMuted }}>Carte</span>
          </div>
        </div>

        {/* Content */}
        <main className="relative z-10 px-6 pb-32">
          <div className="max-w-md mx-auto text-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
            >
              <h1 className="font-display text-2xl font-light italic mb-6" style={{ color: COUTURE.silk }}>
                Votre carte <span style={{ color: COUTURE.gold }}>i‑wasp</span>
              </h1>

              {/* Card preview */}
              <div 
                className="mx-auto mb-8 p-1"
                style={{ 
                  maxWidth: '280px',
                  aspectRatio: '85.6/54',
                  backgroundColor: '#0B0B0B',
                  boxShadow: `0 20px 40px rgba(0,0,0,0.5)`,
                }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <img src={iwaspLogo} alt="i-Wasp" className="w-1/3 opacity-80" />
                </div>
              </div>

              <p className="text-sm font-light mb-2" style={{ color: COUTURE.silk }}>
                Carte standard incluse
              </p>
              <p className="text-xs font-light" style={{ color: COUTURE.textMuted }}>
                Design officiel i‑wasp
              </p>
            </motion.div>
          </div>
        </main>

        {/* Fixed CTA */}
        <div 
          className="fixed bottom-0 left-0 right-0 z-20 px-6 py-6"
          style={{ backgroundColor: COUTURE.jet, borderTop: `1px solid ${COUTURE.jetSoft}` }}
        >
          <div className="max-w-3xl mx-auto flex justify-center">
            <button
              onClick={handleContinue}
              disabled={isNavigating}
              className="text-[11px] uppercase tracking-[0.25em] font-light transition-all duration-700 pb-1"
              style={{ 
                color: COUTURE.gold,
                borderBottom: `1px solid ${COUTURE.gold}60`,
              }}
            >
              {isNavigating ? "Chargement..." : "Continuer"}
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          
          <Link to="/" className="font-display text-lg tracking-[0.1em]" style={{ color: COUTURE.silk }}>
            i-wasp
          </Link>
          
          <div className="w-16" />
        </div>
      </header>

      {/* Progress */}
      <div className="relative z-10 px-6 mb-12">
        <div className="max-w-3xl mx-auto flex items-center gap-3 justify-center">
          <span className="text-[10px] uppercase tracking-[0.3em]" style={{ color: COUTURE.gold }}>04</span>
          <div className="w-12 h-px" style={{ backgroundColor: `${COUTURE.gold}40` }} />
          <span className="text-[10px] uppercase tracking-[0.2em]" style={{ color: COUTURE.textMuted }}>Carte</span>
        </div>
      </div>

      {/* Main content */}
      <main className="relative z-10 px-6 pb-32">
        <div className="max-w-3xl mx-auto">
          {/* Title */}
          <motion.div 
            className="text-center mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            <h1 className="font-display text-2xl md:text-3xl font-light italic mb-3" style={{ color: COUTURE.silk }}>
              Personnalisez votre <span style={{ color: COUTURE.gold }}>carte.</span>
            </h1>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-10">
            {/* Card Preview */}
            <motion.div 
              className="order-1 lg:order-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <div className="sticky top-24">
                {/* Card */}
                <div 
                  className="mx-auto relative"
                  style={{ 
                    maxWidth: '340px',
                    perspective: '1200px',
                  }}
                >
                  <motion.div
                    className="relative"
                    style={{ 
                      aspectRatio: '85.6/54',
                      transformStyle: 'preserve-3d',
                    }}
                    animate={{ rotateY: showBack ? 180 : 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    {/* Front */}
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{
                        backfaceVisibility: 'hidden',
                        backgroundColor: '#0B0B0B',
                        boxShadow: `0 25px 50px rgba(0,0,0,0.6)`,
                      }}
                    >
                      {logoUrl ? (
                        <img src={logoUrl} alt="Votre logo" className="w-2/5 object-contain" />
                      ) : (
                        <img src={iwaspLogo} alt="i-Wasp" className="w-1/3 opacity-80" />
                      )}
                      
                      {/* NFC badge */}
                      <div 
                        className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 text-[8px] uppercase tracking-[0.15em]"
                        style={{ 
                          backgroundColor: 'rgba(255,255,255,0.08)',
                          color: 'rgba(255,255,255,0.5)',
                        }}
                      >
                        NFC
                      </div>
                    </div>

                    {/* Back */}
                    <div
                      className="absolute inset-0"
                      style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        backgroundColor: '#0B0B0B',
                        boxShadow: `0 25px 50px rgba(0,0,0,0.6)`,
                      }}
                    >
                      <div className="absolute top-[15%] left-0 right-0 h-[12%]" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} />
                      <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 w-[20%]">
                        <img src={iwaspLogo} alt="i-Wasp" className="w-full opacity-50" />
                      </div>
                    </div>
                  </motion.div>

                  {/* Flip button */}
                  <button
                    onClick={() => setShowBack(!showBack)}
                    className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[10px] uppercase tracking-[0.1em] transition-all duration-500"
                    style={{ color: COUTURE.textMuted }}
                  >
                    <RotateCcw className="w-3 h-3" />
                    {showBack ? "Voir recto" : "Voir verso"}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Options */}
            <motion.div 
              className="order-2 lg:order-1 space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
            >
              {/* Material */}
              <div className="space-y-4">
                <span className="text-[11px] uppercase tracking-[0.1em]" style={{ color: COUTURE.textMuted }}>
                  Matériau
                </span>
                <div className="space-y-3">
                  {CARD_MATERIALS.map((material) => {
                    const isSelected = selectedMaterial === material.id;
                    return (
                      <button
                        key={material.id}
                        onClick={() => setSelectedMaterial(material.id)}
                        className="w-full p-4 flex items-center justify-between transition-all duration-500"
                        style={{
                          backgroundColor: isSelected ? `${COUTURE.gold}10` : 'transparent',
                          border: `1px solid ${isSelected ? COUTURE.gold : COUTURE.jetSoft}`,
                        }}
                      >
                        <div className="text-left">
                          <p className="font-light" style={{ color: isSelected ? COUTURE.gold : COUTURE.silk }}>
                            {material.label}
                          </p>
                          <p className="text-[11px]" style={{ color: COUTURE.textMuted }}>
                            {material.description}
                          </p>
                        </div>
                        {isSelected && (
                          <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: COUTURE.gold }}>
                            <Check className="w-3 h-3" style={{ color: COUTURE.jet }} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Logo upload */}
              <div className="space-y-4">
                <span className="text-[11px] uppercase tracking-[0.1em]" style={{ color: COUTURE.textMuted }}>
                  Votre logo (optionnel)
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="w-full p-6 flex flex-col items-center gap-3 transition-all duration-500"
                  style={{
                    border: `1px dashed ${logoUrl ? COUTURE.gold : COUTURE.jetSoft}`,
                    backgroundColor: logoUrl ? `${COUTURE.gold}05` : 'transparent',
                  }}
                >
                  <Upload className="w-5 h-5" style={{ color: logoUrl ? COUTURE.gold : COUTURE.textMuted }} />
                  <span className="text-[11px] uppercase tracking-[0.1em]" style={{ color: COUTURE.textMuted }}>
                    {isUploading ? "Chargement..." : logoUrl ? "Changer le logo" : "Ajouter votre logo"}
                  </span>
                </button>
                <p className="text-[10px] text-center" style={{ color: COUTURE.textMuted }}>
                  PNG ou JPG • Max 5 Mo • Fond transparent recommandé
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Fixed CTA */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-20 px-6 py-6"
        style={{ backgroundColor: COUTURE.jet, borderTop: `1px solid ${COUTURE.jetSoft}` }}
      >
        <div className="max-w-3xl mx-auto flex justify-center">
          <button
            onClick={handleContinue}
            disabled={isNavigating}
            className="text-[11px] uppercase tracking-[0.25em] font-light transition-all duration-700 pb-1"
            style={{ 
              color: COUTURE.gold,
              borderBottom: `1px solid ${COUTURE.gold}60`,
            }}
          >
            {isNavigating ? "Chargement..." : "Continuer"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OrderCarte() {
  return (
    <OrderFunnelGuard step={4}>
      <OrderCarteContent />
    </OrderFunnelGuard>
  );
}
