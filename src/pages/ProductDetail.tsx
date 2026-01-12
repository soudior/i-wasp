/**
 * ProductDetail - Fiche produit Luxe Max avec carrousel et pastilles de finition
 */

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ClubNavbar } from "@/components/ClubNavbar";
import { GlobalFooter } from "@/components/GlobalFooter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { STEALTH } from "@/lib/stealthPalette";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Star,
  Sparkles,
  Shield,
  Zap,
  Wifi,
  Ruler,
  Weight,
  Droplets,
  Package
} from "lucide-react";

// Import card images
import cardFront from "@/assets/cards/card-base-front.png";
import cardBack from "@/assets/cards/card-base-back.png";
import cardBlackMatte from "@/assets/cards/card-black-matte.png";
import cardNavy from "@/assets/cards/card-navy-executive.png";
import cardGold from "@/assets/cards/card-gold-accent.png";
import cardWhite from "@/assets/cards/card-white-minimal.png";
import cardUsage from "@/assets/products/card-usage-tap.png";
import cardPackaging from "@/assets/products/card-packaging.png";

// Finition options with colors and images
interface FinishOption {
  id: string;
  name: string;
  color: string;
  colorSecondary?: string;
  priceModifier: number; // Cents added
  images: string[];
}

const finishOptions: FinishOption[] = [
  {
    id: "noir-mat",
    name: "Noir Mat",
    color: "#1a1a1a",
    priceModifier: 0,
    images: [cardBlackMatte, cardBack, cardUsage, cardPackaging]
  },
  {
    id: "anthracite",
    name: "Anthracite",
    color: "#2d3436",
    colorSecondary: "#636e72",
    priceModifier: 0,
    images: [cardFront, cardBack, cardUsage, cardPackaging]
  },
  {
    id: "navy",
    name: "Navy Blue",
    color: "#1e3a5f",
    priceModifier: 500,
    images: [cardNavy, cardBack, cardUsage, cardPackaging]
  },
  {
    id: "or-rose",
    name: "Or Rose",
    color: "#b8860b",
    colorSecondary: "#d4af37",
    priceModifier: 1000,
    images: [cardGold, cardBack, cardUsage, cardPackaging]
  },
  {
    id: "blanc",
    name: "Blanc Minimal",
    color: "#f5f5f5",
    priceModifier: 0,
    images: [cardWhite, cardBack, cardUsage, cardPackaging]
  }
];

// Material options
interface MaterialOption {
  id: string;
  name: string;
  priceLabel: string;
  basePrice: number; // In EUR cents
}

const materialOptions: MaterialOption[] = [
  { id: "pvc", name: "PVC Premium", priceLabel: "À partir de 49 €", basePrice: 4900 },
  { id: "metal", name: "Métal", priceLabel: "À partir de 89 €", basePrice: 8900 }
];

interface ProductSpec {
  icon: React.ElementType;
  label: string;
  value: string;
}

interface Product {
  id: string;
  name: string;
  subtitle: string;
  tagline: string;
  bullets: string[];
  specs: ProductSpec[];
  badge?: string;
}

const products: Record<string, Product> = {
  "carte-signature": {
    id: "carte-signature",
    name: "Carte Signature",
    subtitle: "L'essentiel premium",
    tagline: "Partagez votre identité digitale d'un simple tap. Design élégant, finitions luxe, technologie NFC avancée.",
    bullets: [
      "Profil digital illimité & modifiable",
      "Compatible tous smartphones (iOS & Android)",
      "QR code de secours intégré",
      "Livraison gratuite au Maroc"
    ],
    specs: [
      { icon: Ruler, label: "Format", value: "85.6 × 54 mm (standard)" },
      { icon: Weight, label: "Épaisseur", value: "0.84 mm" },
      { icon: Wifi, label: "Technologie", value: "NFC NTAG216" },
      { icon: Droplets, label: "Résistance", value: "IP68 waterproof" },
      { icon: Zap, label: "Portée", value: "1-4 cm" },
      { icon: Shield, label: "Garantie", value: "2 ans" }
    ],
    badge: "Best-seller"
  }
};

export default function ProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedFinish, setSelectedFinish] = useState(finishOptions[0]);
  const [selectedMaterial, setSelectedMaterial] = useState(materialOptions[0]);

  const product = productId ? products[productId] : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  // Redirect non-signature products to generic page for now
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: STEALTH.bg }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Produit non trouvé</h1>
          <Button 
            onClick={() => navigate("/produits")} 
            className="rounded-full"
            style={{ backgroundColor: STEALTH.accent, color: STEALTH.bg }}
          >
            Retour aux produits
          </Button>
        </div>
      </div>
    );
  }

  const currentImages = selectedFinish.images;
  const currentPrice = selectedMaterial.basePrice + selectedFinish.priceModifier;
  const formattedPrice = `${(currentPrice / 100).toFixed(0)} €`;

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? currentImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev === currentImages.length - 1 ? 0 : prev + 1));
  };

  const handleFinishChange = (finish: FinishOption) => {
    setSelectedFinish(finish);
    setActiveImageIndex(0); // Reset to first image when changing finish
  };

  return (
    <div className="min-h-screen text-white relative" style={{ backgroundColor: STEALTH.bg }}>
      <ClubNavbar />
      
      {/* Subtle cyan halos */}
      <div 
        className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full blur-[200px] opacity-15 pointer-events-none"
        style={{ backgroundColor: STEALTH.accent }}
      />
      <div 
        className="absolute bottom-1/4 left-0 w-[400px] h-[400px] rounded-full blur-[180px] opacity-10 pointer-events-none"
        style={{ backgroundColor: STEALTH.accent }}
      />

      {/* Breadcrumb */}
      <div className="pt-24 px-6 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <Link 
            to="/produits"
            className="inline-flex items-center gap-2 text-sm transition-colors hover:opacity-80"
            style={{ color: STEALTH.textSecondary }}
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux produits
          </Link>
        </div>
      </div>

      {/* Main Content - 2 Columns */}
      <section className="py-12 px-6 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            
            {/* LEFT COLUMN: Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              {/* Main Image with 3D effect */}
              <div 
                className="relative aspect-[4/3] rounded-3xl overflow-hidden group"
                style={{ 
                  backgroundColor: STEALTH.bgCard,
                  border: `1px solid ${STEALTH.border}`,
                  boxShadow: STEALTH.shadowCard
                }}
              >
                {/* Subtle reflection effect */}
                <div 
                  className="absolute inset-0 pointer-events-none z-10"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%, rgba(255,255,255,0.02) 100%)"
                  }}
                />
                
                <AnimatePresence mode="wait">
                  <motion.img
                    key={`${selectedFinish.id}-${activeImageIndex}`}
                    src={currentImages[activeImageIndex]}
                    alt={`${product.name} - ${selectedFinish.name}`}
                    className="w-full h-full object-contain p-8"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>
                
                {/* Navigation Arrows */}
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
                >
                  <ChevronLeft className="w-5 h-5" style={{ color: STEALTH.text }} />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
                >
                  <ChevronRight className="w-5 h-5" style={{ color: STEALTH.text }} />
                </button>

                {/* Badge */}
                {product.badge && (
                  <Badge 
                    className="absolute top-4 left-4"
                    style={{ backgroundColor: STEALTH.accent, color: STEALTH.bg }}
                  >
                    <Star className="w-3 h-3 mr-1" />
                    {product.badge}
                  </Badge>
                )}
                
                {/* Image indicator */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {currentImages.map((_, idx) => (
                    <div 
                      key={idx}
                      className="w-2 h-2 rounded-full transition-all"
                      style={{ 
                        backgroundColor: idx === activeImageIndex ? STEALTH.accent : "rgba(255,255,255,0.3)"
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {currentImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden transition-all duration-200"
                    style={{ 
                      border: index === activeImageIndex 
                        ? `2px solid ${STEALTH.accent}` 
                        : `1px solid ${STEALTH.border}`,
                      opacity: index === activeImageIndex ? 1 : 0.6,
                      backgroundColor: STEALTH.bgCard
                    }}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain p-1" />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* RIGHT COLUMN: Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-6"
            >
              {/* Title & Subtitle */}
              <div>
                <p 
                  className="text-sm tracking-[0.2em] uppercase mb-2"
                  style={{ color: STEALTH.accent }}
                >
                  {product.subtitle}
                </p>
                <h1 
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
                  style={{ color: STEALTH.text }}
                >
                  {product.name}
                </h1>
                <p 
                  className="text-lg leading-relaxed"
                  style={{ color: STEALTH.textSecondary }}
                >
                  {product.tagline}
                </p>
              </div>

              {/* Key Benefits - 3-4 short bullets */}
              <ul className="space-y-3">
                {product.bullets.map((bullet, i) => (
                  <li 
                    key={i} 
                    className="flex items-center gap-3 text-base"
                    style={{ color: STEALTH.text }}
                  >
                    <div 
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${STEALTH.accent}20` }}
                    >
                      <Check className="w-3 h-3" style={{ color: STEALTH.accent }} />
                    </div>
                    {bullet}
                  </li>
                ))}
              </ul>

              {/* Finish Selection - Color chips */}
              <div 
                className="pt-6"
                style={{ borderTop: `1px solid ${STEALTH.border}` }}
              >
                <p className="text-sm font-medium mb-3" style={{ color: STEALTH.textSecondary }}>
                  Finition : <span style={{ color: STEALTH.text }}>{selectedFinish.name}</span>
                </p>
                <div className="flex gap-3">
                  {finishOptions.map((finish) => (
                    <button
                      key={finish.id}
                      onClick={() => handleFinishChange(finish)}
                      className="relative w-10 h-10 rounded-full transition-all duration-200"
                      style={{ 
                        background: finish.colorSecondary 
                          ? `linear-gradient(135deg, ${finish.color}, ${finish.colorSecondary})`
                          : finish.color,
                        boxShadow: selectedFinish.id === finish.id 
                          ? `0 0 0 2px ${STEALTH.bg}, 0 0 0 4px ${STEALTH.accent}`
                          : "none",
                        border: finish.color === "#f5f5f5" ? `1px solid ${STEALTH.border}` : "none"
                      }}
                      title={finish.name}
                    >
                      {selectedFinish.id === finish.id && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <Check 
                            className="w-4 h-4" 
                            style={{ color: finish.color === "#f5f5f5" ? "#000" : "#fff" }} 
                          />
                        </motion.div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Material Selection */}
              <div>
                <p className="text-sm font-medium mb-3" style={{ color: STEALTH.textSecondary }}>
                  Matériau
                </p>
                <div className="flex gap-3">
                  {materialOptions.map((material) => (
                    <button
                      key={material.id}
                      onClick={() => setSelectedMaterial(material)}
                      className="px-5 py-3 rounded-xl transition-all duration-200 text-sm font-medium"
                      style={{ 
                        backgroundColor: selectedMaterial.id === material.id 
                          ? STEALTH.accent 
                          : STEALTH.bgCard,
                        color: selectedMaterial.id === material.id 
                          ? STEALTH.bg 
                          : STEALTH.text,
                        border: `1px solid ${selectedMaterial.id === material.id ? STEALTH.accent : STEALTH.border}`
                      }}
                    >
                      {material.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div 
                className="pt-6"
                style={{ borderTop: `1px solid ${STEALTH.border}` }}
              >
                <p className="text-sm mb-1" style={{ color: STEALTH.textSecondary }}>
                  À partir de
                </p>
                <div className="flex items-baseline gap-3">
                  <span 
                    className="text-4xl font-bold"
                    style={{ color: STEALTH.accent }}
                  >
                    {formattedPrice}
                  </span>
                  {selectedMaterial.id === "pvc" && (
                    <span 
                      className="text-sm"
                      style={{ color: STEALTH.textMuted }}
                    >
                      Métal à partir de 89 €
                    </span>
                  )}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-4 pt-2">
                <Button 
                  size="lg"
                  onClick={() => navigate("/order/offre")}
                  className="flex-1 font-semibold rounded-full py-6 gap-2"
                  style={{ 
                    backgroundColor: STEALTH.accent,
                    color: STEALTH.bg
                  }}
                >
                  Commander
                  <ArrowRight className="w-5 h-5" />
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    const specsSection = document.getElementById("specs");
                    specsSection?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-6 rounded-full py-6"
                  style={{ 
                    borderColor: STEALTH.border,
                    color: STEALTH.text
                  }}
                >
                  Voir les détails
                </Button>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-4 pt-4">
                {[
                  { icon: Shield, label: "Garantie 2 ans" },
                  { icon: Zap, label: "Livraison 48h" },
                  { icon: CreditCard, label: "Paiement sécurisé" }
                ].map((item, i) => (
                  <div 
                    key={i}
                    className="flex items-center gap-2 text-sm"
                    style={{ color: STEALTH.textSecondary }}
                  >
                    <item.icon className="w-4 h-4" style={{ color: STEALTH.accent }} />
                    {item.label}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Specifications Section */}
      <section 
        id="specs"
        className="py-20 px-6 relative"
        style={{ backgroundColor: STEALTH.bgCard }}
      >
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[200px] opacity-10 pointer-events-none"
          style={{ backgroundColor: STEALTH.accent }}
        />
        
        <div className="container mx-auto max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p 
              className="text-sm tracking-[0.2em] uppercase mb-3"
              style={{ color: STEALTH.accent }}
            >
              Spécifications
            </p>
            <h2 
              className="text-3xl font-bold"
              style={{ color: STEALTH.text }}
            >
              Conçue pour durer
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {product.specs.map((spec, index) => (
              <motion.div
                key={spec.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="p-5 rounded-2xl"
                style={{ 
                  backgroundColor: STEALTH.bgElevated,
                  border: `1px solid ${STEALTH.border}`
                }}
              >
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${STEALTH.accent}15` }}
                >
                  <spec.icon className="w-5 h-5" style={{ color: STEALTH.accent }} />
                </div>
                <p className="text-sm mb-1" style={{ color: STEALTH.textSecondary }}>
                  {spec.label}
                </p>
                <p className="font-semibold" style={{ color: STEALTH.text }}>
                  {spec.value}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 relative" style={{ backgroundColor: STEALTH.bg }}>
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{ 
            background: `radial-gradient(ellipse at center, ${STEALTH.accent}08 0%, transparent 70%)`
          }}
        />
        
        <div className="container mx-auto max-w-2xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Sparkles className="w-10 h-10 mx-auto mb-6" style={{ color: STEALTH.accent }} />
            <h2 
              className="text-3xl font-bold mb-4"
              style={{ color: STEALTH.text }}
            >
              Prêt à vous démarquer ?
            </h2>
            <p 
              className="text-lg mb-8"
              style={{ color: STEALTH.textSecondary }}
            >
              Commandez votre Carte Signature et rejoignez la nouvelle génération du networking.
            </p>
            <Button 
              size="lg"
              onClick={() => navigate("/order/offre")}
              className="font-semibold px-10 py-6 rounded-full text-lg gap-3"
              style={{ 
                backgroundColor: STEALTH.accent,
                color: STEALTH.bg
              }}
            >
              Commander maintenant
              <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      <GlobalFooter variant="dark" />
    </div>
  );
}
