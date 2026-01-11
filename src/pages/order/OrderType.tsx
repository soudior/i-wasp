import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { CreditCard, Sparkles, Package, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useOrderFunnel } from "@/contexts/OrderFunnelContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useTranslation } from "react-i18next";
import { STEALTH } from "@/lib/stealthPalette";
import { WorldClockGlobe } from "@/components/WorldClockGlobe";
import { CurrencySelector } from "@/components/CurrencySelector";
import cardPVCFront from "@/assets/products/card-pvc-front.png";
import cardMetalFront from "@/assets/products/card-metal-front.png";
import nailsImage from "@/assets/nails/nails-hero.png";
/**
 * OrderType - Sélection du type de produit NFC
 * Étape 0 du tunnel de commande - Design IWASP Stealth Luxury
 * Internationalized with auto-detected language/currency
 */

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
    <div className="min-h-screen" style={{ backgroundColor: STEALTH.bg }}>
      {/* Header */}
      <header 
        className="sticky top-0 z-40 backdrop-blur-lg"
        style={{ 
          backgroundColor: `${STEALTH.bg}E6`,
          borderBottom: `1px solid ${STEALTH.border}`
        }}
      >
        <div className="container mx-auto px-5 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 transition-colors"
            style={{ color: STEALTH.textSecondary }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">{t("order.back")}</span>
          </button>
          
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: STEALTH.accent }}
            >
              <span className="font-bold text-sm" style={{ color: STEALTH.bg }}>iW</span>
            </div>
            <span className="font-semibold" style={{ color: STEALTH.text }}>{t("order.title")}</span>
          </div>
          
          {/* Currency Selector + World Clock */}
          <div className="flex items-center gap-2">
            <CurrencySelector variant="stealth" />
            <WorldClockGlobe compact className="hidden sm:flex" />
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div className="w-full h-1" style={{ backgroundColor: STEALTH.border }}>
        <div 
          className="h-full w-[10%] transition-all" 
          style={{ background: STEALTH.gradientAccent }}
        />
      </div>

      {/* Content */}
      <main className="container mx-auto px-5 py-10 max-w-lg">
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
            
            <p 
              className="text-xs uppercase tracking-widest mb-2"
              style={{ color: STEALTH.accent }}
            >
              Étape 2 sur 5 – Choisissez votre support
            </p>
            <h1 
              className="text-2xl font-bold tracking-tight mb-3"
              style={{ color: STEALTH.text }}
            >
              Choisissez votre support
            </h1>
            <p style={{ color: STEALTH.textSecondary }}>
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
                  className={`group relative w-full rounded-2xl overflow-hidden text-left transition-all duration-300 ${
                    product.available 
                      ? "cursor-pointer" 
                      : "cursor-not-allowed opacity-50"
                  }`}
                  style={{
                    backgroundColor: STEALTH.bgCard,
                    border: `2px solid ${isSelected ? STEALTH.accent : STEALTH.border}`,
                    boxShadow: isSelected 
                      ? `0 0 30px ${STEALTH.accent}40, 0 10px 40px rgba(0,0,0,0.3)` 
                      : '0 4px 20px rgba(0,0,0,0.2)',
                  }}
                  whileHover={product.available ? { 
                    scale: 1.02, 
                    y: -4,
                    boxShadow: `0 8px 40px rgba(0,0,0,0.4), 0 0 20px ${STEALTH.accent}20`
                  } : {}}
                  whileTap={product.available ? { scale: 0.98 } : {}}
                >
                  {/* Badge Populaire */}
                  {product.popular && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring", stiffness: 500 }}
                      className="absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-bold z-10 shadow-lg"
                      style={{ 
                        background: `linear-gradient(135deg, ${STEALTH.accent}, ${STEALTH.accent}DD)`,
                        color: STEALTH.bg 
                      }}
                    >
                      ⭐ Populaire
                    </motion.div>
                  )}
                  
                  <div className="flex items-center p-5 gap-5">
                    {/* Image avec effet luxe */}
                    <div 
                      className="relative w-24 h-24 rounded-xl flex-shrink-0 overflow-hidden transition-transform duration-300 group-hover:scale-105"
                      style={{ 
                        background: 'transparent',
                      }}
                    >
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
                        <div 
                          className="w-full h-full flex items-center justify-center rounded-xl"
                          style={{ 
                            background: `linear-gradient(135deg, ${STEALTH.bgCard}, ${STEALTH.border})` 
                          }}
                        >
                          <Icon className="w-10 h-10" style={{ color: STEALTH.textSecondary }} />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 
                          className="text-base font-semibold"
                          style={{ color: STEALTH.text }}
                        >
                          {product.name}
                        </h3>
                        {isSelected && (
                          <div 
                            className="w-6 h-6 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: STEALTH.accent }}
                          >
                            <Check className="w-4 h-4" style={{ color: STEALTH.bg }} />
                          </div>
                        )}
                        {!product.available && (
                          <span 
                            className="text-xs px-2 py-1 rounded-full"
                            style={{ 
                              backgroundColor: STEALTH.accentMuted, 
                              color: STEALTH.textSecondary 
                            }}
                          >
                            {t("order.comingSoon")}
                          </span>
                        )}
                      </div>
                      
                      <p 
                        className="text-sm mb-2 line-clamp-1"
                        style={{ color: STEALTH.textSecondary }}
                      >
                        {product.description}
                      </p>

                      <p 
                        className="text-base font-semibold"
                        style={{ color: isSelected ? STEALTH.accent : STEALTH.text }}
                      >
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
            <Button
              size="lg"
              onClick={handleContinue}
              disabled={!state.productType}
              className="font-semibold gap-2 px-10 py-6 text-base rounded-full transition-all disabled:opacity-40"
              style={{ 
                backgroundColor: STEALTH.accent, 
                color: STEALTH.bg 
              }}
            >
              {t("order.continue")}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>
      </main>

      {/* Sticky CTA Mobile */}
      <div 
        className="fixed bottom-0 left-0 right-0 p-4 backdrop-blur-lg md:hidden z-40 safe-area-bottom"
        style={{ 
          backgroundColor: `${STEALTH.bg}E6`,
          borderTop: `1px solid ${STEALTH.border}`
        }}
      >
        <Button
          size="lg"
          onClick={handleContinue}
          disabled={!state.productType}
          className="w-full font-semibold gap-2 py-6 text-base rounded-full min-h-[56px] disabled:opacity-40"
          style={{ 
            backgroundColor: STEALTH.accent, 
            color: STEALTH.bg 
          }}
        >
          {state.productType ? t("order.continue") : t("order.selectProduct")}
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
      
      <div className="h-24 md:hidden" />
    </div>
  );
}
