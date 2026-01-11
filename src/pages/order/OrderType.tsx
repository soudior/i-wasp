/**
 * OrderType - Sélection du type de produit NFC
 * Étape 0 du tunnel de commande - Design IWASP Deep Black & Soft Gold Luxury
 * Internationalized with auto-detected language/currency
 */

import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { CreditCard, Sparkles, Package, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useOrderFunnel } from "@/contexts/OrderFunnelContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useTranslation } from "react-i18next";
import { WorldClockGlobe } from "@/components/WorldClockGlobe";
import { CurrencySelector } from "@/components/CurrencySelector";
import cardPVCFront from "@/assets/products/card-pvc-front.png";
import cardMetalFront from "@/assets/products/card-metal-front.png";
import nailsImage from "@/assets/nails/nails-hero.png";

interface ProductOption {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  priceMAD: number;
  icon: React.ElementType;
  image?: string;
  available: boolean;
  popular?: boolean;
  features: string[];
}

const products: ProductOption[] = [
  {
    id: "pvc",
    name: "Carte NFC PVC",
    subtitle: "Populaire",
    description: "Format carte bancaire. Finition mate premium.",
    priceMAD: 300,
    icon: CreditCard,
    image: cardPVCFront,
    available: true,
    popular: true,
    features: ["Parfait pour le réseautage quotidien", "Solide et élégant", "QR code de secours", "Profil digital illimité"]
  },
  {
    id: "nails",
    name: "Ongles NFC",
    subtitle: "Innovation beauté",
    description: "Technologie intégrée. Innovation beauté.",
    priceMAD: 500,
    icon: Sparkles,
    image: nailsImage,
    available: true,
    features: ["Idéal pour salons, créateurs, artistes", "Un simple geste de la main", "Compatible tous smartphones", "Réseau salons partenaires"]
  },
  {
    id: "metal",
    name: "Carte Métal",
    subtitle: "Premium ultime",
    description: "Finition acier brossé. Premium ultime.",
    priceMAD: 850,
    icon: CreditCard,
    image: cardMetalFront,
    available: true,
    features: ["Effet waouh garanti", "Pour dirigeants et VIP", "Gravure laser précise", "Écrin de présentation"]
  }
];

export default function OrderType() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { state, setProductType } = useOrderFunnel();
  const { formatAmount, currency, currencySymbol } = useCurrency();
  const { t } = useTranslation();

  // Pré-sélection si paramètre URL
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
    <div className="min-h-screen bg-deep-black">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-deep-black/90 border-b border-anthracite-light">
        <div className="container mx-auto px-5 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 transition-colors text-soft-gray hover:text-off-white"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">{t("order.back")}</span>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-soft-gold">
              <span className="font-bold text-sm text-deep-black">iW</span>
            </div>
            <span className="font-semibold text-off-white">{t("order.title")}</span>
          </div>
          
          {/* Currency Selector + World Clock */}
          <div className="flex items-center gap-2">
            <CurrencySelector variant="stealth" />
            <WorldClockGlobe compact className="hidden sm:flex" />
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div className="step-bar">
        <div className="step-bar-fill" style={{ width: '10%' }} />
      </div>

      {/* Content */}
      <main className="container mx-auto px-5 py-10 max-w-premium">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Title with Globe */}
          <div className="text-center mb-10">
            {/* Mobile Globe + Currency */}
            <div className="flex justify-center items-center gap-3 mb-4 sm:hidden">
              <WorldClockGlobe />
            </div>
            
            <p className="text-xs uppercase tracking-widest mb-2 text-soft-gold">
              Étape 2 sur 5 – Choisissez votre support
            </p>
            <h1 className="text-display text-off-white mb-3">
              Choisissez votre support
            </h1>
            <p className="text-soft-gray">
              Technologie NFC intégrée. Tous vos supports sont reliés au même profil numérique.
            </p>
          </div>

          {/* Products List */}
          <div className="space-y-4 mb-8">
            {products.map((product, index) => {
              const isSelected = state.productType === product.id;
              const Icon = product.icon;

              return (
                <motion.button
                  key={product.id}
                  onClick={() => product.available && handleSelect(product.id)}
                  disabled={!product.available}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className={`card-offer group ${
                    !product.available ? 'opacity-50 cursor-not-allowed' : ''
                  } ${isSelected ? 'card-offer-selected' : ''}`}
                >
                  {/* Badge Populaire */}
                  {product.popular && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring", stiffness: 500 }}
                      className="badge-popular"
                    >
                      ⭐ Populaire
                    </motion.div>
                  )}
                  
                  <div className="flex items-center p-5 gap-5">
                    {/* Image avec effet luxe */}
                    <div className="relative w-24 h-24 rounded-xl flex-shrink-0 overflow-hidden transition-transform duration-300 group-hover:scale-105">
                      {product.image ? (
                        <img 
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                          style={{ 
                            filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))'
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center rounded-xl bg-anthracite">
                          <Icon className="w-10 h-10 text-soft-gray" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-base font-semibold text-off-white">
                          {product.name}
                        </h3>
                        {isSelected && (
                          <div className="w-6 h-6 rounded-full flex items-center justify-center bg-soft-gold">
                            <Check className="w-4 h-4 text-deep-black" />
                          </div>
                        )}
                        {!product.available && (
                          <span className="text-xs px-2 py-1 rounded-full bg-anthracite-light text-soft-gray">
                            {t("order.comingSoon")}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm mb-2 line-clamp-1 text-soft-gray">
                        {product.description}
                      </p>

                      <p className={`text-base font-semibold ${isSelected ? 'text-soft-gold' : 'text-off-white'}`}>
                        {formatAmount(product.priceMAD)}
                      </p>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* CTA Desktop */}
          <div className="hidden md:flex justify-center">
            <button
              onClick={handleContinue}
              disabled={!state.productType}
              className="btn-premium disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {t("order.continue")}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </main>

      {/* Sticky CTA Mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 backdrop-blur-lg md:hidden z-40 safe-area-bottom bg-deep-black/90 border-t border-anthracite-light">
        <button
          onClick={handleContinue}
          disabled={!state.productType}
          className="btn-premium w-full disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {state.productType ? t("order.continue") : t("order.selectProduct")}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
      
      <div className="h-24 md:hidden" />
    </div>
  );
}
