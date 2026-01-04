import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { CreditCard, Sparkles, Package, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useOrderFunnel } from "@/contexts/OrderFunnelContext";
import nfcCardWaxSeal from "@/assets/nfc-card-wax-seal.png";

/**
 * OrderType - Sélection du type de produit NFC
 * Étape 0 du tunnel de commande
 * 
 * Produits disponibles :
 * - Carte NFC PVC
 * - Ongles NFC
 * - Carte Métal (bientôt)
 */

interface ProductOption {
  id: string;
  name: string;
  description: string;
  price: string;
  icon: React.ElementType;
  image?: string;
  video?: string;
  available: boolean;
  features: string[];
}

const products: ProductOption[] = [
  {
    id: "pvc",
    name: "Carte NFC PVC",
    description: "Format carte bancaire. Impression Evolis haute définition.",
    price: "À partir de 29€",
    icon: CreditCard,
    image: nfcCardWaxSeal,
    available: true,
    features: [
      "Format CR80 standard",
      "Finition mat premium",
      "Puce NFC NTAG intégrée",
      "Personnalisation complète"
    ]
  },
  {
    id: "nails",
    name: "Ongles NFC",
    description: "Innovation beauté. Technologie NFC intégrée à vos ongles.",
    price: "À partir de 49€",
    icon: Sparkles,
    video: "/nails-demo-video.mp4",
    available: true,
    features: [
      "Kit 10 capsules NFC",
      "Compatible tout smartphone",
      "Design personnalisable",
      "Pose professionnelle incluse"
    ]
  },
  {
    id: "metal",
    name: "Carte Métal",
    description: "Finition acier brossé. Premium ultime.",
    price: "À partir de 89€",
    icon: Package,
    available: false,
    features: [
      "Acier inoxydable brossé",
      "Gravure laser",
      "Finition premium",
      "Édition limitée"
    ]
  }
];

export default function OrderType() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { state, setProductType } = useOrderFunnel();

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Retour</span>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
              <span className="text-background font-bold text-sm">iW</span>
            </div>
            <span className="text-foreground font-semibold">Commande</span>
          </div>
          
          <div className="w-20" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Progress bar */}
      <div className="w-full h-1 bg-secondary">
        <div className="h-full bg-primary w-[10%] transition-all" />
      </div>

      {/* Content */}
      <main className="container mx-auto px-6 py-12 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
              Choisissez votre support NFC
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Chaque support intègre la technologie NFC et se connecte à votre profil digital personnalisé.
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
              {products.map((product) => {
                const isSelected = state.productType === product.id;
              const Icon = product.icon;

              return (
                <motion.button
                  key={product.id}
                  onClick={() => product.available && handleSelect(product.id)}
                  disabled={!product.available}
                  className={`relative rounded-xl overflow-hidden text-left transition-all ${
                    product.available 
                      ? "cursor-pointer hover:ring-2 hover:ring-primary/50" 
                      : "cursor-not-allowed opacity-60"
                  } ${
                    isSelected 
                      ? "ring-2 ring-primary bg-card" 
                      : "bg-card border border-border"
                  }`}
                  whileHover={product.available ? { scale: 1.02 } : {}}
                  whileTap={product.available ? { scale: 0.98 } : {}}
                >
                  {/* Selected indicator */}
                  {isSelected && (
                    <div className="absolute top-4 right-4 z-10 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}

                  {/* Not available badge */}
                  {!product.available && (
                    <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-secondary text-muted-foreground text-xs font-medium">
                      Bientôt
                    </div>
                  )}

                  {/* Media */}
                  <div className="aspect-[4/3] relative overflow-hidden bg-secondary">
                    {product.video ? (
                      <video
                        src={product.video}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : product.image ? (
                      <img 
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Icon className="w-16 h-16 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className={`w-5 h-5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                      <h3 className="text-lg font-semibold text-foreground">{product.name}</h3>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4">
                      {product.description}
                    </p>

                    {/* Features */}
                    <ul className="space-y-1.5 mb-4">
                      {product.features.slice(0, 3).map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="w-1 h-1 rounded-full bg-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {/* Price */}
                    <p className={`font-semibold ${isSelected ? "text-primary" : "text-foreground"}`}>
                      {product.price}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>

          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={handleContinue}
              disabled={!state.productType}
              className="bg-primary text-primary-foreground hover:brightness-110 font-semibold gap-2 px-10 py-6 text-lg rounded-lg transition-all disabled:opacity-50"
            >
              Continuer
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-lg border-t border-border md:hidden z-40 safe-area-bottom">
        <Button
          size="lg"
          onClick={handleContinue}
          disabled={!state.productType}
          className="w-full bg-primary text-primary-foreground hover:brightness-110 font-semibold gap-2 py-6 text-base rounded-lg min-h-[56px] disabled:opacity-50"
        >
          {state.productType ? "Continuer" : "Sélectionnez un produit"}
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
      
      {/* Spacer for mobile sticky CTA */}
      <div className="h-24 md:hidden" />
    </div>
  );
}
