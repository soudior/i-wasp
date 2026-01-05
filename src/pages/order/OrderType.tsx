import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { CreditCard, Sparkles, Package, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useOrderFunnel } from "@/contexts/OrderFunnelContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import cardBlackMatte from "@/assets/cards/card-black-matte.webp";
import cardNavyExecutive from "@/assets/cards/card-navy-executive.png";

/**
 * OrderType - Sélection du type de produit NFC
 * Étape 0 du tunnel de commande - Design IWASP Cupertino
 */

interface ProductOption {
  id: string;
  name: string;
  description: string;
  priceMAD: number;
  icon: React.ElementType;
  image?: string;
  available: boolean;
  features: string[];
}

const products: ProductOption[] = [
  {
    id: "pvc",
    name: "Carte NFC PVC",
    description: "Format carte bancaire. Finition mate premium.",
    priceMAD: 350,
    icon: CreditCard,
    image: cardBlackMatte,
    available: true,
    features: [
      "Format CR80 standard",
      "Finition mat premium",
      "Puce NFC NTAG"
    ]
  },
  {
    id: "nails",
    name: "Ongles NFC",
    description: "Innovation beauté. Technologie intégrée.",
    priceMAD: 590,
    icon: Sparkles,
    image: cardNavyExecutive,
    available: true,
    features: [
      "Kit 10 capsules NFC",
      "Compatible tout smartphone",
      "Pose incluse"
    ]
  },
  {
    id: "metal",
    name: "Carte Métal",
    description: "Finition acier brossé. Premium ultime.",
    priceMAD: 990,
    icon: Package,
    available: false,
    features: [
      "Acier inoxydable",
      "Gravure laser",
      "Édition limitée"
    ]
  }
];

export default function OrderType() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { state, setProductType } = useOrderFunnel();
  const { formatAmount } = useCurrency();

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
    <div className="min-h-screen bg-[#F5F5F7]">
      {/* Header - Style IWASP */}
      <header className="sticky top-0 z-40 bg-[#F5F5F7]/95 backdrop-blur-lg border-b border-[#E5E5E5]">
        <div className="container mx-auto px-5 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-[#8E8E93] hover:text-[#1D1D1F] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Retour</span>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#1D1D1F] flex items-center justify-center">
              <span className="text-white font-bold text-sm">iW</span>
            </div>
            <span className="text-[#1D1D1F] font-semibold">Commande</span>
          </div>
          
          <div className="w-20" />
        </div>
      </header>

      {/* Progress bar */}
      <div className="w-full h-1 bg-[#E5E5E5]">
        <div className="h-full bg-[#007AFF] w-[10%] transition-all" />
      </div>

      {/* Content */}
      <main className="container mx-auto px-5 py-10 max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Title */}
          <div className="text-center mb-10">
            <h1 className="text-2xl font-bold tracking-tight text-[#1D1D1F] mb-3">
              Choisissez votre support
            </h1>
            <p className="text-[#8E8E93] text-base">
              Technologie NFC intégrée
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
                  } ${
                    isSelected 
                      ? "ring-2 ring-[#007AFF] bg-white shadow-lg" 
                      : "bg-white shadow-sm"
                  }`}
                  whileHover={product.available ? { scale: 1.01 } : {}}
                  whileTap={product.available ? { scale: 0.99 } : {}}
                >
                  <div className="flex items-center p-4 gap-4">
                    {/* Image */}
                    <div className="w-20 h-20 rounded-xl bg-[#F5F5F7] flex-shrink-0 overflow-hidden">
                      {product.image ? (
                        <img 
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Icon className="w-8 h-8 text-[#8E8E93]" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-base font-semibold text-[#1D1D1F]">
                          {product.name}
                        </h3>
                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-[#007AFF] flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                        {!product.available && (
                          <span className="text-xs text-[#8E8E93] bg-[#F5F5F7] px-2 py-1 rounded-full">
                            Bientôt
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-[#8E8E93] mb-2 line-clamp-1">
                        {product.description}
                      </p>

                      <p className={`text-base font-semibold ${isSelected ? "text-[#007AFF]" : "text-[#1D1D1F]"}`}>
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
              className="bg-[#007AFF] text-white hover:bg-[#0066D6] font-semibold gap-2 px-10 py-6 text-base rounded-xl transition-all disabled:opacity-40 disabled:bg-[#8E8E93]"
            >
              Continuer
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>
      </main>

      {/* Sticky CTA Mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#F5F5F7]/95 backdrop-blur-lg border-t border-[#E5E5E5] md:hidden z-40 safe-area-bottom">
        <Button
          size="lg"
          onClick={handleContinue}
          disabled={!state.productType}
          className="w-full bg-[#007AFF] text-white hover:bg-[#0066D6] font-semibold gap-2 py-6 text-base rounded-xl min-h-[56px] disabled:opacity-40 disabled:bg-[#8E8E93]"
        >
          {state.productType ? "Continuer" : "Sélectionnez un produit"}
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
      
      <div className="h-24 md:hidden" />
    </div>
  );
}
