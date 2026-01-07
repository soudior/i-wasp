/**
 * Produits NFC — Catalogue des solutions i-wasp
 * Avec modèles de carte recto/verso flip interactif et galerie 3D
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClubNavbar } from "@/components/ClubNavbar";
import { GlobalFooter } from "@/components/GlobalFooter";
import { Card3DGallery } from "@/components/Card3DGallery";
import { 
  CreditCard, 
  Tag, 
  Watch, 
  Smartphone,
  ArrowRight,
  Check,
  Sparkles,
  ChefHat,
  Building2,
  Calendar,
  Palette,
  RotateCcw,
  Star,
  Zap,
  Shield,
  QrCode,
  Box
} from "lucide-react";

// Import card images
import cardFront from "@/assets/cards/card-base-front.png";
import cardBack from "@/assets/cards/card-base-back.png";

// Import product images
import nfcTagsImage from "@/assets/products/nfc-tags-collection.png";
import nfcWearablesImage from "@/assets/products/nfc-wearables.png";
import nfcBadgesImage from "@/assets/products/nfc-badges-event.png";

// Stealth Luxury Palette
const STEALTH = {
  bg: "#050807",
  bgAlt: "#0A0D0C",
  accent: "#A5A9B4",
  accentLight: "#D1D5DB",
  border: "rgba(165, 169, 180, 0.12)",
  glass: "rgba(255, 255, 255, 0.02)"
};

const WHATSAPP_PROJECT_URL = "https://wa.me/33626424394?text=Bonjour%20👋%0AJe%20souhaite%20commander%20des%20produits%20NFC%20i-wasp.";

interface CardProduct {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  price: { EUR: string; MAD: string };
  features: string[];
  badge?: string;
  popular?: boolean;
  finish: "mat" | "brillant" | "mat-brillant";
  icon: React.ElementType;
}

const cardProducts: CardProduct[] = [
  {
    id: "signature",
    name: "Carte Signature",
    subtitle: "L'essentiel premium",
    description: "Une carte élégante qui partage ton profil digital en un tap. Design personnalisé, finition luxe.",
    price: { EUR: "49€", MAD: "490 DH" },
    features: [
      "Design sur mesure",
      "Finition mat ou brillant",
      "QR code de secours",
      "Profil digital illimité"
    ],
    finish: "mat",
    icon: CreditCard
  },
  {
    id: "executive",
    name: "Carte Executive",
    subtitle: "Pour les professionnels",
    description: "La carte business par excellence. Logo entreprise, personnalisation avancée, support prioritaire.",
    price: { EUR: "79€", MAD: "790 DH" },
    features: [
      "Logo entreprise gravé",
      "Personnalisation complète",
      "Analytics détaillés",
      "Support prioritaire",
      "Finition premium"
    ],
    badge: "Populaire",
    popular: true,
    finish: "brillant",
    icon: Star
  },
  {
    id: "luxury",
    name: "Carte Luxury",
    subtitle: "L'excellence absolue",
    description: "Pour ceux qui ne font aucun compromis. Matériaux nobles, finitions exceptionnelles, service conciergerie.",
    price: { EUR: "149€", MAD: "1 490 DH" },
    features: [
      "Matériaux premium",
      "Gravure laser HD",
      "Finition mat-brillant",
      "Service conciergerie",
      "Garantie à vie",
      "Édition limitée"
    ],
    badge: "Premium",
    finish: "mat-brillant",
    icon: Sparkles
  },
  {
    id: "team",
    name: "Pack Team",
    subtitle: "Pour les équipes",
    description: "Équipez toute votre équipe. Tarifs dégressifs, gestion centralisée, design uniforme.",
    price: { EUR: "39€/carte", MAD: "390 DH/carte" },
    features: [
      "À partir de 5 cartes",
      "Design uniforme",
      "Gestion centralisée",
      "Analytics équipe",
      "Support dédié"
    ],
    badge: "-20%",
    finish: "mat",
    icon: Building2
  }
];

// Other products with images
const otherProducts = [
  {
    id: "tag-nfc",
    icon: Tag,
    image: nfcTagsImage,
    title: "Tags NFC",
    subtitle: "Discret et polyvalent",
    description: "Stickers NFC à coller partout : vitrines, produits, affiches. Redirige vers n'importe quelle URL.",
    features: [
      "Pack de 5 ou 10 tags",
      "Résistant eau et UV",
      "Programmable à volonté",
      "Statistiques de scan"
    ],
    price: "À partir de 29€"
  },
  {
    id: "wearable",
    icon: Watch,
    image: nfcWearablesImage,
    title: "Wearables NFC",
    subtitle: "Toujours sur toi",
    description: "Bracelets, bagues et accessoires connectés. Partage tes infos sans sortir de carte.",
    features: [
      "Bracelet silicone ou cuir",
      "Bague métal premium",
      "Étanche et durable",
      "Style personnalisable"
    ],
    price: "À partir de 69€"
  },
  {
    id: "badge-event",
    icon: Smartphone,
    image: nfcBadgesImage,
    title: "Badges événement",
    subtitle: "Pour les pros",
    description: "Badges NFC pour conférences, salons et événements. Collecte de leads automatisée.",
    features: [
      "Impression recto-verso",
      "Lanyard inclus",
      "Export contacts Excel",
      "Intégration CRM"
    ],
    price: "Sur devis"
  }
];

// Use cases
const useCases = [
  {
    icon: ChefHat,
    sector: "Restauration",
    example: "Menu digital, avis Google, programme fidélité"
  },
  {
    icon: Building2,
    sector: "Immobilier",
    example: "Fiche bien, prise de RDV, dossier locataire"
  },
  {
    icon: Calendar,
    sector: "Événementiel",
    example: "Invitation VIP, check-in, networking"
  },
  {
    icon: Palette,
    sector: "Créateurs",
    example: "Portfolio, boutique, réseaux sociaux"
  }
];

// Flip Card Component
function FlipCard({ product, isFlipped, onFlip }: { 
  product: CardProduct; 
  isFlipped: boolean; 
  onFlip: () => void;
}) {
  return (
    <div 
      className="relative w-full aspect-[1.586/1] cursor-pointer perspective-1000" 
      onClick={onFlip}
    >
      <motion.div
        className="w-full h-full relative"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div 
          className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl"
          style={{ backfaceVisibility: "hidden" }}
        >
          <img 
            src={cardFront} 
            alt={`${product.name} - Recto`}
            className="w-full h-full object-cover"
          />
          {/* Finish overlay effects */}
          {product.finish === "brillant" && (
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10 pointer-events-none" />
          )}
          {product.finish === "mat-brillant" && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
          )}
        </div>
        
        {/* Back */}
        <div 
          className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <img 
            src={cardBack} 
            alt={`${product.name} - Verso`}
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>
      
      {/* Flip indicator */}
      <motion.div 
        className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm rounded-full p-2 z-10"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <RotateCcw className="w-4 h-4 text-white/80" />
      </motion.div>
      
      {/* Side label */}
      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 z-10">
        <span className="text-xs text-white/80">{isFlipped ? "Verso" : "Recto"}</span>
      </div>
    </div>
  );
}

// Card Product Component
function CardProductCard({ product, index }: { product: CardProduct; index: number }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative rounded-3xl p-6"
      style={{
        background: product.popular 
          ? `linear-gradient(135deg, ${STEALTH.accent}15 0%, ${STEALTH.glass} 100%)`
          : STEALTH.glass,
        border: `1px solid ${product.popular ? STEALTH.accent + '30' : STEALTH.border}`
      }}
    >
      {/* Badge */}
      {product.badge && (
        <Badge 
          className={`absolute -top-3 left-6 ${
            product.popular 
              ? "bg-white text-black" 
              : product.badge === "Premium"
              ? "bg-gradient-to-r from-amber-400 to-amber-600 text-black"
              : "bg-emerald-500 text-white"
          }`}
        >
          {product.badge === "Premium" && <Star className="w-3 h-3 mr-1" />}
          {product.badge}
        </Badge>
      )}

      {/* Card Preview with Flip */}
      <div className="mb-6">
        <FlipCard 
          product={product} 
          isFlipped={isFlipped} 
          onFlip={() => setIsFlipped(!isFlipped)} 
        />
      </div>

      {/* Content */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-white">{product.name}</h3>
          <p className="text-sm" style={{ color: STEALTH.accent }}>{product.subtitle}</p>
        </div>

        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
          {product.description}
        </p>

        {/* Features */}
        <ul className="space-y-2">
          {product.features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
              <Check className="w-4 h-4 flex-shrink-0" style={{ color: STEALTH.accent }} />
              {feature}
            </li>
          ))}
        </ul>

        {/* Price & CTA */}
        <div 
          className="pt-4 flex items-center justify-between"
          style={{ borderTop: `1px solid ${STEALTH.border}` }}
        >
          <div>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>À partir de</p>
            <p className="text-2xl font-bold text-white">{product.price.EUR}</p>
          </div>
          <Button 
            onClick={() => navigate("/order")}
            className="rounded-full px-6 gap-2"
            style={{ 
              backgroundColor: product.popular ? 'white' : STEALTH.accent, 
              color: STEALTH.bg 
            }}
          >
            Commander
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProduitsNFC() {
  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: STEALTH.bg }}>
      <ClubNavbar />
      
      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="container mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{ 
                backgroundColor: `${STEALTH.accent}10`, 
                border: `1px solid ${STEALTH.border}` 
              }}
            >
              <CreditCard className="w-4 h-4" style={{ color: STEALTH.accent }} />
              <span className="text-sm" style={{ color: STEALTH.accentLight }}>Collection 2025</span>
            </div>
            
            <h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
              style={{ fontFamily: "'Bodoni Moda', serif" }}
            >
              Cartes NFC<br />
              <span style={{ color: STEALTH.accent }}>Pro</span>
            </h1>
            
            <p className="text-xl max-w-2xl mx-auto mb-10" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Partagez votre profil digital en un tap. Design premium, 
              technologie NFC avancée, finitions exceptionnelles.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features highlights */}
      <section className="px-6 mb-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Smartphone, label: "Compatible tous smartphones" },
              { icon: Shield, label: "NFC sécurisé" },
              { icon: QrCode, label: "QR code backup" },
              { icon: Zap, label: "Activation instantanée" }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl p-4 text-center"
                style={{ 
                  backgroundColor: STEALTH.glass, 
                  border: `1px solid ${STEALTH.border}` 
                }}
              >
                <item.icon className="w-6 h-6 mx-auto mb-2" style={{ color: STEALTH.accent }} />
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3D Gallery Section */}
      <section className="py-16 px-6" style={{ backgroundColor: STEALTH.bgAlt }}>
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
              style={{ 
                backgroundColor: `${STEALTH.accent}10`, 
                border: `1px solid ${STEALTH.border}` 
              }}
            >
              <Box className="w-4 h-4" style={{ color: STEALTH.accent }} />
              <span className="text-sm" style={{ color: STEALTH.accentLight }}>Vue 3D Interactive</span>
            </div>
            <h2 
              className="text-3xl sm:text-4xl font-bold mb-4"
              style={{ fontFamily: "'Bodoni Moda', serif" }}
            >
              Explorez en <span style={{ color: STEALTH.accent }}>360°</span>
            </h2>
            <p className="max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Faites pivoter la carte avec votre souris ou votre doigt pour découvrir chaque détail
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card3DGallery />
          </motion.div>
        </div>
      </section>
      
      {/* Card Products Grid */}
      <section className="py-16 px-6" style={{ backgroundColor: STEALTH.bgAlt }}>
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 
              className="text-3xl sm:text-4xl font-bold mb-4"
              style={{ fontFamily: "'Bodoni Moda', serif" }}
            >
              Nos <span style={{ color: STEALTH.accent }}>cartes</span>
            </h2>
            <p className="max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Cliquez sur chaque carte pour voir le recto et le verso
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {cardProducts.map((product, index) => (
              <CardProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Other Products */}
      <section className="py-16 px-6" style={{ backgroundColor: STEALTH.bg }}>
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 
              className="text-3xl sm:text-4xl font-bold mb-4"
              style={{ fontFamily: "'Bodoni Moda', serif" }}
            >
              Autres <span style={{ color: STEALTH.accent }}>produits</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {otherProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="rounded-3xl overflow-hidden group"
                style={{
                  background: STEALTH.glass,
                  border: `1px solid ${STEALTH.border}`
                }}
              >
                {/* Product Image */}
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div 
                    className="absolute top-3 left-3 w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${STEALTH.accent}40 0%, ${STEALTH.accent}20 100%)`, backdropFilter: 'blur(8px)' }}
                  >
                    <product.icon className="w-5 h-5" style={{ color: STEALTH.accentLight }} />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-white">{product.title}</h3>
                    <p className="text-sm" style={{ color: STEALTH.accent }}>{product.subtitle}</p>
                  </div>
                  
                  <p className="mb-4 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{product.description}</p>
                  
                  <ul className="space-y-2 mb-4">
                    {product.features.slice(0, 3).map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                        <Check className="w-4 h-4 flex-shrink-0" style={{ color: STEALTH.accent }} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <div 
                    className="flex items-center justify-between pt-4"
                    style={{ borderTop: `1px solid ${STEALTH.border}` }}
                  >
                    <span className="text-lg font-semibold" style={{ color: STEALTH.accent }}>{product.price}</span>
                    <a href={WHATSAPP_PROJECT_URL} target="_blank" rel="noopener noreferrer">
                      <Button 
                        size="sm" 
                        className="gap-2 rounded-full"
                        style={{ backgroundColor: STEALTH.accent, color: STEALTH.bg }}
                      >
                        Demander
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Use Cases */}
      <section className="py-24 px-6" style={{ backgroundColor: STEALTH.bgAlt }}>
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 
              className="text-3xl sm:text-4xl font-bold mb-4"
              style={{ fontFamily: "'Bodoni Moda', serif" }}
            >
              <span style={{ color: STEALTH.accent }}>Exemples</span> d'usages
            </h2>
            <p className="max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Chaque secteur a ses besoins. Voici comment nos clients utilisent le NFC.
            </p>
          </motion.div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, index) => (
              <motion.div
                key={useCase.sector}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl text-center"
                style={{ 
                  backgroundColor: STEALTH.glass, 
                  border: `1px solid ${STEALTH.border}` 
                }}
              >
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: `${STEALTH.accent}10` }}
                >
                  <useCase.icon className="w-6 h-6" style={{ color: STEALTH.accent }} />
                </div>
                <h3 className="font-semibold text-white mb-2">{useCase.sector}</h3>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{useCase.example}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-20 px-6" style={{ backgroundColor: STEALTH.bg }}>
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Sparkles className="w-10 h-10 mx-auto mb-6" style={{ color: STEALTH.accent }} />
            <h2 
              className="text-3xl font-bold mb-4"
              style={{ fontFamily: "'Bodoni Moda', serif" }}
            >
              Un projet sur mesure ?
            </h2>
            <p className="mb-8" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Notre conciergerie analyse tes besoins et te propose la solution idéale.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/conciergerie">
                <Button 
                  size="lg" 
                  className="font-semibold px-8 gap-2 rounded-full"
                  style={{ backgroundColor: STEALTH.accent, color: STEALTH.bg }}
                >
                  Parler à la conciergerie
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      
      <GlobalFooter variant="dark" />
    </div>
  );
}
