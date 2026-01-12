/**
 * OrderType - Sélection du type de produit NFC
 * 
 * Style: Haute Couture Digitale — Noir, minimaliste, silencieux
 */

import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useOrderFunnel } from "@/contexts/OrderFunnelContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Check, ArrowLeft } from "lucide-react";
import { COUTURE } from "@/lib/hauteCouturePalette";
import cardPVCFront from "@/assets/products/card-pvc-front.png";
import cardMetalFront from "@/assets/products/card-metal-front.png";
import nailsImage from "@/assets/nails/nails-hero.png";

interface ProductOption {
  id: string;
  name: string;
  description: string;
  priceMAD: number;
  image?: string;
  available: boolean;
  isSignature?: boolean;
}

const products: ProductOption[] = [
  {
    id: "pvc",
    name: "Carte PVC",
    description: "Format carte bancaire. Finition mate premium.",
    priceMAD: 300,
    image: cardPVCFront,
    available: true,
    isSignature: true,
  },
  {
    id: "nails",
    name: "Ongles NFC",
    description: "Technologie intégrée. Innovation beauté.",
    priceMAD: 500,
    image: nailsImage,
    available: true,
  },
  {
    id: "metal",
    name: "Carte Métal",
    description: "Finition acier brossé. Premium ultime.",
    priceMAD: 850,
    image: cardMetalFront,
    available: true,
  }
];

export default function OrderType() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { state, setProductType } = useOrderFunnel();
  const { formatAmount } = useCurrency();

  useEffect(() => {
    const productParam = searchParams.get("product");
    if (productParam && products.find(p => p.id === productParam && p.available)) {
      setProductType(productParam);
    }
  }, [searchParams, setProductType]);

  const handleSelect = (productId: string) => {
    setProductType(productId);
  };

  const handleContinue = () => {
    if (state.productType) {
      navigate("/order/offre");
    }
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
            onClick={() => navigate("/")}
            className="flex items-center gap-2 transition-all duration-500"
            style={{ color: COUTURE.textMuted }}
            onMouseEnter={(e) => e.currentTarget.style.color = COUTURE.silk}
            onMouseLeave={(e) => e.currentTarget.style.color = COUTURE.textMuted}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-[11px] uppercase tracking-[0.15em]">Accueil</span>
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
              00
            </span>
            <div 
              className="w-12 h-px"
              style={{ backgroundColor: `${COUTURE.gold}40` }}
            />
            <span 
              className="text-[10px] uppercase tracking-[0.2em]"
              style={{ color: COUTURE.textMuted }}
            >
              Support
            </span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="relative z-10 px-6 pb-32">
        <div className="max-w-3xl mx-auto">
          {/* Title */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            <h1 
              className="font-display text-2xl md:text-3xl font-light italic mb-4"
              style={{ color: COUTURE.silk }}
            >
              Choisissez votre <span style={{ color: COUTURE.gold }}>support.</span>
            </h1>
            <p 
              className="text-sm font-light"
              style={{ color: COUTURE.textMuted }}
            >
              Tous reliés au même profil numérique.
            </p>
          </motion.div>

          {/* Products */}
          <div className="space-y-4">
            {products.map((product, i) => {
              const isSelected = state.productType === product.id;
              
              return (
                <motion.button
                  key={product.id}
                  onClick={() => product.available && handleSelect(product.id)}
                  disabled={!product.available}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.8 }}
                  className="w-full text-left p-5 transition-all duration-700 relative flex items-center gap-6 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: isSelected ? `${COUTURE.gold}08` : 'transparent',
                    border: `1px solid ${isSelected ? `${COUTURE.gold}60` : COUTURE.jetSoft}`,
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected && product.available) {
                      e.currentTarget.style.borderColor = `${COUTURE.gold}30`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = COUTURE.jetSoft;
                    }
                  }}
                >
                  {/* Signature badge */}
                  {product.isSignature && (
                    <span 
                      className="absolute top-0 right-5 -translate-y-1/2 px-3 py-0.5 text-[8px] uppercase tracking-[0.15em]"
                      style={{ 
                        backgroundColor: COUTURE.gold,
                        color: COUTURE.jet,
                      }}
                    >
                      Populaire
                    </span>
                  )}

                  {/* Image */}
                  <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center">
                    {product.image && (
                      <img 
                        src={product.image}
                        alt={product.name}
                        className="max-w-full max-h-full object-contain"
                        style={{ 
                          filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))'
                        }}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 
                      className="font-display text-lg font-light mb-1"
                      style={{ color: isSelected ? COUTURE.gold : COUTURE.silk }}
                    >
                      {product.name}
                    </h3>
                    <p 
                      className="text-xs font-light"
                      style={{ color: COUTURE.textMuted }}
                    >
                      {product.description}
                    </p>
                  </div>

                  {/* Price & check */}
                  <div className="flex items-center gap-4">
                    <span 
                      className="text-lg font-light tabular-nums"
                      style={{ color: isSelected ? COUTURE.gold : COUTURE.silk }}
                    >
                      {formatAmount(product.priceMAD)}
                    </span>
                    
                    {isSelected && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-7 h-7 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: COUTURE.gold }}
                      >
                        <Check className="w-4 h-4" style={{ color: COUTURE.jet }} />
                      </motion.div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
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
            disabled={!state.productType}
            className="text-[11px] uppercase tracking-[0.25em] font-light transition-all duration-700 pb-1 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ 
              color: state.productType ? COUTURE.gold : COUTURE.textMuted,
              borderBottom: `1px solid ${state.productType ? `${COUTURE.gold}60` : 'transparent'}`,
            }}
          >
            Continuer
          </button>
        </div>
      </div>
    </div>
  );
}
