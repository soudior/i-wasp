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
import cardBlackMatte from "@/assets/cards/card-black-matte.webp";
import cardNavyExecutive from "@/assets/cards/card-navy-executive.png";

/**
 * OrderType - Sélection du type de produit NFC
 * Étape 0 du tunnel de commande - Design IWASP Stealth Luxury
 * Internationalized with auto-detected language/currency
 */

interface ProductOption {
  id: string;
  nameKey: string;
  descKey: string;
  priceMAD: number;
  icon: React.ElementType;
  image?: string;
  available: boolean;
  featuresKeys: string[];
}

const products: ProductOption[] = [
  {
    id: "pvc",
    nameKey: "order.pvcCard",
    descKey: "order.pvcCardDesc",
    priceMAD: 350,
    icon: CreditCard,
    image: cardBlackMatte,
    available: true,
    featuresKeys: ["order.pvcFeature1", "order.pvcFeature2", "order.pvcFeature3"]
  },
  {
    id: "nails",
    nameKey: "order.nfcNails",
    descKey: "order.nfcNailsDesc",
    priceMAD: 590,
    icon: Sparkles,
    image: cardNavyExecutive,
    available: true,
    featuresKeys: ["order.nailsFeature1", "order.nailsFeature2", "order.nailsFeature3"]
  },
  {
    id: "metal",
    nameKey: "order.metalCard",
    descKey: "order.metalCardDesc",
    priceMAD: 990,
    icon: Package,
    available: false,
    featuresKeys: ["order.metalFeature1", "order.metalFeature2", "order.metalFeature3"]
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
            
            <h1 
              className="text-2xl font-bold tracking-tight mb-3"
              style={{ color: STEALTH.text }}
            >
              {t("order.chooseSupport")}
            </h1>
            <p style={{ color: STEALTH.textSecondary }}>
              {t("order.nfcTechnology")}
            </p>
          </div>

          {/* Products List */}
          <div className="space-y-4 mb-8">
            {products.map((product) => {
              const isSelected = state.productType === product.id;
              const Icon = product.icon;

              return (
                <motion.button
                  key={product.id}
                  onClick={() => product.available && handleSelect(product.id)}
                  disabled={!product.available}
                  className={`relative w-full rounded-2xl overflow-hidden text-left transition-all ${
                    product.available 
                      ? "cursor-pointer" 
                      : "cursor-not-allowed opacity-50"
                  }`}
                  style={{
                    backgroundColor: STEALTH.bgCard,
                    border: `2px solid ${isSelected ? STEALTH.accent : STEALTH.border}`,
                    boxShadow: isSelected ? STEALTH.glow : 'none',
                  }}
                  whileHover={product.available ? { scale: 1.01 } : {}}
                  whileTap={product.available ? { scale: 0.99 } : {}}
                >
                  <div className="flex items-center p-4 gap-4">
                    {/* Image */}
                    <div 
                      className="w-20 h-20 rounded-xl flex-shrink-0 overflow-hidden"
                      style={{ backgroundColor: STEALTH.bgInput }}
                    >
                      {product.image ? (
                        <img 
                          src={product.image}
                          alt={t(product.nameKey)}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Icon className="w-8 h-8" style={{ color: STEALTH.textSecondary }} />
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
                          {t(product.nameKey)}
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
                        {t(product.descKey)}
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
