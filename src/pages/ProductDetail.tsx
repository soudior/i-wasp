/**
 * ProductDetail - Page de détail produit avec galerie et spécifications
 */

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ClubNavbar } from "@/components/ClubNavbar";
import { GlobalFooter } from "@/components/GlobalFooter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PartnerSalonsMap } from "@/components/PartnerSalonsMap";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Tag,
  Watch,
  Smartphone,
  Shield,
  Zap,
  QrCode,
  Droplets,
  Ruler,
  Weight,
  Wifi,
  Star,
  Package,
  Sparkles,
  X
} from "lucide-react";

// Import images
import cardFront from "@/assets/cards/card-base-front.png";
import cardBack from "@/assets/cards/card-base-back.png";
import cardTexture from "@/assets/products/card-detail-texture.png";
import cardUsage from "@/assets/products/card-usage-tap.png";
import cardPackaging from "@/assets/products/card-packaging.png";
import nfcTagsImage from "@/assets/products/nfc-tags-collection.png";
import nfcWearablesImage from "@/assets/products/nfc-wearables.png";
import nfcBadgesImage from "@/assets/products/nfc-badges-event.png";
import nfcNailsImage from "@/assets/products/nfc-nails-collection.png";
import nfcNailsApplication from "@/assets/products/nfc-nails-application.png";
import nfcNailsUsage from "@/assets/products/nfc-nails-usage.png";
import nfcNailsPackaging from "@/assets/products/nfc-nails-packaging.png";

// Stealth Luxury Palette
const STEALTH = {
  bg: "#050807",
  bgAlt: "#0A0D0C",
  accent: "#A5A9B4",
  accentLight: "#D1D5DB",
  border: "rgba(165, 169, 180, 0.12)",
  glass: "rgba(255, 255, 255, 0.02)"
};

const WHATSAPP_URL = "https://wa.me/33626424394?text=Bonjour%20👋%0AJe%20souhaite%20commander%20";

interface ProductSpec {
  icon: React.ElementType;
  label: string;
  value: string;
}

interface Product {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  longDescription: string;
  price: { EUR: string; MAD: string };
  images: string[];
  features: string[];
  specs: ProductSpec[];
  included: string[];
  badge?: string;
  category: "card" | "tag" | "wearable" | "badge" | "nails";
}

const products: Record<string, Product> = {
  "carte-signature": {
    id: "carte-signature",
    name: "Carte Signature",
    subtitle: "L'essentiel premium",
    description: "Une carte élégante qui partage ton profil digital en un tap.",
    longDescription: "La Carte Signature i-Wasp est la solution idéale pour les professionnels qui souhaitent faire une première impression mémorable. Fabriquée avec des matériaux premium et équipée d'une puce NFC haute performance, elle permet de partager instantanément votre profil digital complet : coordonnées, réseaux sociaux, portfolio, et plus encore.",
    price: { EUR: "49€", MAD: "490 DH" },
    images: [cardFront, cardBack, cardTexture, cardUsage, cardPackaging],
    features: [
      "Design sur mesure",
      "Finition mat ou brillant",
      "QR code de secours",
      "Profil digital illimité",
      "Compatible iOS & Android",
      "Aucune app requise"
    ],
    specs: [
      { icon: Ruler, label: "Dimensions", value: "85.6 × 54 mm" },
      { icon: Weight, label: "Épaisseur", value: "0.84 mm" },
      { icon: Wifi, label: "Technologie", value: "NFC NTAG216" },
      { icon: Droplets, label: "Résistance", value: "IP68 waterproof" },
      { icon: Zap, label: "Portée", value: "1-4 cm" },
      { icon: Shield, label: "Garantie", value: "2 ans" }
    ],
    included: [
      "1 × Carte NFC personnalisée",
      "1 × Écrin de protection",
      "1 × Guide de démarrage",
      "Accès au tableau de bord"
    ],
    category: "card"
  },
  "carte-executive": {
    id: "carte-executive",
    name: "Carte Executive",
    subtitle: "Pour les professionnels",
    description: "La carte business par excellence avec personnalisation avancée.",
    longDescription: "Conçue pour les dirigeants et professionnels exigeants, la Carte Executive offre une personnalisation complète avec votre logo entreprise gravé au laser. Son design premium et ses fonctionnalités avancées en font l'outil parfait pour le networking professionnel.",
    price: { EUR: "79€", MAD: "790 DH" },
    images: [cardFront, cardTexture, cardUsage, cardBack, cardPackaging],
    features: [
      "Logo entreprise gravé",
      "Personnalisation complète",
      "Analytics détaillés",
      "Support prioritaire",
      "Finition premium",
      "Multi-profils disponibles"
    ],
    specs: [
      { icon: Ruler, label: "Dimensions", value: "85.6 × 54 mm" },
      { icon: Weight, label: "Épaisseur", value: "0.84 mm" },
      { icon: Wifi, label: "Technologie", value: "NFC NTAG424" },
      { icon: Droplets, label: "Résistance", value: "IP68 waterproof" },
      { icon: Zap, label: "Portée", value: "1-5 cm" },
      { icon: Shield, label: "Garantie", value: "3 ans" }
    ],
    included: [
      "1 × Carte NFC Executive",
      "1 × Coffret luxe",
      "1 × Certificat d'authenticité",
      "Support prioritaire 12 mois"
    ],
    badge: "Populaire",
    category: "card"
  },
  "carte-luxury": {
    id: "carte-luxury",
    name: "Carte Luxury",
    subtitle: "L'excellence absolue",
    description: "Pour ceux qui ne font aucun compromis sur la qualité.",
    longDescription: "La Carte Luxury représente le summum de l'artisanat digital. Fabriquée avec des matériaux nobles et une finition mat-brillant exclusive, elle incarne l'excellence pour les professionnels les plus exigeants. Service conciergerie inclus pour une expérience personnalisée.",
    price: { EUR: "149€", MAD: "1 490 DH" },
    images: [cardFront, cardPackaging, cardTexture, cardUsage, cardBack],
    features: [
      "Matériaux premium",
      "Gravure laser HD",
      "Finition mat-brillant",
      "Service conciergerie",
      "Garantie à vie",
      "Édition limitée"
    ],
    specs: [
      { icon: Ruler, label: "Dimensions", value: "85.6 × 54 mm" },
      { icon: Weight, label: "Épaisseur", value: "1.0 mm" },
      { icon: Wifi, label: "Technologie", value: "NFC NTAG424 DNA" },
      { icon: Droplets, label: "Résistance", value: "IP69K" },
      { icon: Zap, label: "Portée", value: "1-6 cm" },
      { icon: Shield, label: "Garantie", value: "À vie" }
    ],
    included: [
      "1 × Carte NFC Luxury",
      "1 × Coffret collector",
      "1 × Certificat numéroté",
      "Service conciergerie illimité"
    ],
    badge: "Premium",
    category: "card"
  },
  "tags-nfc": {
    id: "tags-nfc",
    name: "Tags NFC",
    subtitle: "Discret et polyvalent",
    description: "Stickers NFC à coller partout pour rediriger vers n'importe quelle URL.",
    longDescription: "Les Tags NFC i-Wasp sont la solution parfaite pour digitaliser n'importe quelle surface. Collez-les sur vos vitrines, produits, affiches ou comptoirs pour offrir une expérience interactive à vos clients. Résistants et programmables à volonté.",
    price: { EUR: "29€", MAD: "290 DH" },
    images: [nfcTagsImage, cardTexture, cardUsage],
    features: [
      "Pack de 5 ou 10 tags",
      "Résistant eau et UV",
      "Programmable à volonté",
      "Statistiques de scan",
      "Adhésif haute qualité",
      "Design discret"
    ],
    specs: [
      { icon: Ruler, label: "Diamètre", value: "30 mm" },
      { icon: Weight, label: "Épaisseur", value: "0.3 mm" },
      { icon: Wifi, label: "Technologie", value: "NFC NTAG215" },
      { icon: Droplets, label: "Résistance", value: "IP65" },
      { icon: Zap, label: "Portée", value: "1-3 cm" },
      { icon: Shield, label: "Garantie", value: "1 an" }
    ],
    included: [
      "5 × Tags NFC autocollants",
      "1 × Guide d'installation",
      "Accès tableau de bord",
      "Support par email"
    ],
    category: "tag"
  },
  "wearables-nfc": {
    id: "wearables-nfc",
    name: "Wearables NFC",
    subtitle: "Toujours sur toi",
    description: "Bracelets et bagues connectés pour partager sans carte.",
    longDescription: "Portez votre identité digitale au poignet ou au doigt. Les Wearables NFC i-Wasp combinent style et technologie pour un partage de contact discret et élégant. Étanches et durables, ils vous accompagnent partout.",
    price: { EUR: "69€", MAD: "690 DH" },
    images: [nfcWearablesImage, cardTexture, cardUsage],
    features: [
      "Bracelet silicone ou cuir",
      "Bague métal premium",
      "Étanche et durable",
      "Style personnalisable",
      "Tailles ajustables",
      "Matériaux hypoallergéniques"
    ],
    specs: [
      { icon: Ruler, label: "Tailles", value: "S / M / L / XL" },
      { icon: Weight, label: "Poids", value: "8-15g" },
      { icon: Wifi, label: "Technologie", value: "NFC NTAG216" },
      { icon: Droplets, label: "Résistance", value: "IP68" },
      { icon: Zap, label: "Portée", value: "1-3 cm" },
      { icon: Shield, label: "Garantie", value: "2 ans" }
    ],
    included: [
      "1 × Bracelet OU bague NFC",
      "1 × Pochette de protection",
      "Guide des tailles",
      "Accès tableau de bord"
    ],
    category: "wearable"
  },
  "badges-evenement": {
    id: "badges-evenement",
    name: "Badges Événement",
    subtitle: "Pour les pros",
    description: "Badges NFC pour conférences et salons avec collecte de leads.",
    longDescription: "Optimisez vos événements professionnels avec les Badges NFC i-Wasp. Parfaits pour les conférences, salons et séminaires, ils permettent une collecte de leads automatisée et un networking facilité entre participants.",
    price: { EUR: "Sur devis", MAD: "Sur devis" },
    images: [nfcBadgesImage, cardTexture, cardUsage],
    features: [
      "Impression recto-verso",
      "Lanyard inclus",
      "Export contacts Excel",
      "Intégration CRM",
      "Design personnalisable",
      "Analytics en temps réel"
    ],
    specs: [
      { icon: Ruler, label: "Dimensions", value: "90 × 55 mm" },
      { icon: Weight, label: "Épaisseur", value: "0.76 mm" },
      { icon: Wifi, label: "Technologie", value: "NFC NTAG213" },
      { icon: Droplets, label: "Résistance", value: "Usage intérieur" },
      { icon: Zap, label: "Portée", value: "1-4 cm" },
      { icon: Package, label: "Min. commande", value: "50 unités" }
    ],
    included: [
      "Badges NFC personnalisés",
      "Lanyards assortis",
      "Tableau de bord événement",
      "Export données illimité"
    ],
    category: "badge"
  },
  "ongles-nfc": {
    id: "ongles-nfc",
    name: "Ongles NFC",
    subtitle: "Beauté connectée",
    description: "Révolutionnez votre manucure avec la technologie NFC intégrée.",
    longDescription: "Les Ongles NFC i-Wasp représentent la fusion parfaite entre beauté et technologie. Une micropuce NFC invisible est intégrée directement dans votre ongle lors de votre pose en salon. Partagez vos coordonnées, réseaux sociaux ou portfolio d'un simple toucher élégant. L'innovation beauté ultime pour les professionnelles connectées.",
    price: { EUR: "89€", MAD: "890 DH" },
    images: [nfcNailsImage, nfcNailsApplication, nfcNailsUsage, nfcNailsPackaging],
    features: [
      "Puce NFC micro-intégrée",
      "Compatible tous designs nail art",
      "Tenue 3-4 semaines",
      "Application en salon partenaire",
      "Résistant vernis et gel",
      "Profil digital personnalisable"
    ],
    specs: [
      { icon: Ruler, label: "Taille puce", value: "3 × 3 mm" },
      { icon: Weight, label: "Poids", value: "< 0.1g" },
      { icon: Wifi, label: "Technologie", value: "NFC NTAG213" },
      { icon: Droplets, label: "Résistance", value: "Eau, vernis, gel UV" },
      { icon: Zap, label: "Portée", value: "1-2 cm" },
      { icon: Shield, label: "Durée", value: "3-4 semaines" }
    ],
    included: [
      "1 × Puce NFC pour ongle",
      "Pose en salon partenaire",
      "Configuration profil digital",
      "Support WhatsApp dédié"
    ],
    badge: "Nouveau",
    category: "nails"
  }
};

const categoryIcons: Record<string, React.ElementType> = {
  card: CreditCard,
  tag: Tag,
  wearable: Watch,
  badge: Smartphone,
  nails: Sparkles
};

export default function ProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const product = productId ? products[productId] : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: STEALTH.bg }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Produit non trouvé</h1>
          <Button onClick={() => navigate("/produits")} variant="outline">
            Retour aux produits
          </Button>
        </div>
      </div>
    );
  }

  const CategoryIcon = categoryIcons[product.category];

  const handlePrevImage = () => {
    setActiveImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
  };

  const whatsappMessage = `${WHATSAPP_URL}${encodeURIComponent(product.name)}`;

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: STEALTH.bg }}>
      <ClubNavbar />

      {/* Breadcrumb */}
      <div className="pt-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <Link 
            to="/produits"
            className="inline-flex items-center gap-2 text-sm hover:text-white transition-colors"
            style={{ color: STEALTH.accent }}
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux produits
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              {/* Main Image */}
              <div 
                className="relative aspect-[4/3] rounded-3xl overflow-hidden cursor-zoom-in group"
                onClick={() => setLightboxOpen(true)}
                style={{ backgroundColor: STEALTH.bgAlt }}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImage}
                    src={product.images[activeImage]}
                    alt={`${product.name} - Image ${activeImage + 1}`}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>
                
                {/* Navigation Arrows */}
                <button
                  onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Badge */}
                {product.badge && (
                  <Badge 
                    className={`absolute top-4 left-4 ${
                      product.badge === "Premium" 
                        ? "bg-gradient-to-r from-amber-400 to-amber-600 text-black"
                        : "bg-white text-black"
                    }`}
                  >
                    {product.badge === "Premium" && <Star className="w-3 h-3 mr-1" />}
                    {product.badge}
                  </Badge>
                )}
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      index === activeImage 
                        ? "border-white" 
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Header */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${STEALTH.accent}30 0%, ${STEALTH.accent}10 100%)` }}
                  >
                    <CategoryIcon className="w-5 h-5" style={{ color: STEALTH.accent }} />
                  </div>
                  <span className="text-sm" style={{ color: STEALTH.accent }}>{product.subtitle}</span>
                </div>
                <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: "'Bodoni Moda', serif" }}>
                  {product.name}
                </h1>
                <p className="text-lg" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  {product.description}
                </p>
              </div>

              {/* Price */}
              <div 
                className="p-6 rounded-2xl"
                style={{ background: STEALTH.glass, border: `1px solid ${STEALTH.border}` }}
              >
                <p className="text-sm mb-1" style={{ color: STEALTH.accent }}>À partir de</p>
                <p className="text-4xl font-bold">{product.price.EUR}</p>
                <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  ou {product.price.MAD}
                </p>
              </div>

              {/* CTA */}
              <div className="flex gap-4">
                <Button 
                  size="lg"
                  onClick={() => navigate("/order")}
                  className="flex-1 rounded-full font-semibold gap-2"
                  style={{ backgroundColor: STEALTH.accent, color: STEALTH.bg }}
                >
                  Commander maintenant
                  <ArrowRight className="w-5 h-5" />
                </Button>
                <a href={whatsappMessage} target="_blank" rel="noopener noreferrer">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="rounded-full"
                    style={{ borderColor: STEALTH.border, color: 'white' }}
                  >
                    WhatsApp
                  </Button>
                </a>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Caractéristiques</h3>
                <div className="grid grid-cols-2 gap-3">
                  {product.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="w-4 h-4 flex-shrink-0" style={{ color: STEALTH.accent }} />
                      <span className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Included */}
              <div 
                className="p-5 rounded-2xl"
                style={{ background: STEALTH.glass, border: `1px solid ${STEALTH.border}` }}
              >
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Package className="w-5 h-5" style={{ color: STEALTH.accent }} />
                  Inclus dans votre commande
                </h3>
                <ul className="space-y-2">
                  {product.included.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                      <Sparkles className="w-3 h-3" style={{ color: STEALTH.accent }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Long Description */}
      <section className="py-12 px-6" style={{ backgroundColor: STEALTH.bgAlt }}>
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 
              className="text-3xl font-bold mb-6 text-center"
              style={{ fontFamily: "'Bodoni Moda', serif" }}
            >
              À propos du <span style={{ color: STEALTH.accent }}>{product.name}</span>
            </h2>
            <p className="text-lg leading-relaxed text-center" style={{ color: 'rgba(255,255,255,0.7)' }}>
              {product.longDescription}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Specifications */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 
              className="text-3xl font-bold mb-8 text-center"
              style={{ fontFamily: "'Bodoni Moda', serif" }}
            >
              Spécifications <span style={{ color: STEALTH.accent }}>techniques</span>
            </h2>
            
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {product.specs.map((spec, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-5 rounded-2xl text-center"
                  style={{ background: STEALTH.glass, border: `1px solid ${STEALTH.border}` }}
                >
                  <spec.icon className="w-8 h-8 mx-auto mb-3" style={{ color: STEALTH.accent }} />
                  <p className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{spec.label}</p>
                  <p className="text-lg font-semibold">{spec.value}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6" style={{ backgroundColor: STEALTH.bgAlt }}>
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 
              className="text-3xl font-bold mb-4"
              style={{ fontFamily: "'Bodoni Moda', serif" }}
            >
              Prêt à commander ?
            </h2>
            <p className="mb-8" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Commandez votre {product.name} dès maintenant et recevez-la sous 5 jours ouvrés.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg"
                onClick={() => navigate("/order")}
                className="rounded-full font-semibold px-8 gap-2"
                style={{ backgroundColor: STEALTH.accent, color: STEALTH.bg }}
              >
                Commander — {product.price.EUR}
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Link to="/produits">
                <Button 
                  size="lg"
                  variant="outline"
                  className="rounded-full"
                  style={{ borderColor: STEALTH.border, color: 'white' }}
                >
                  Voir tous les produits
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Partner Salons Map - Only for NFC Nails */}
      {product.category === "nails" && (
        <PartnerSalonsMap />
      )}

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-5xl bg-black/95 border-none p-0">
          <div className="relative aspect-[4/3]">
            <img
              src={product.images[activeImage]}
              alt={product.name}
              className="w-full h-full object-contain"
            />
            <button
              onClick={handlePrevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {product.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === activeImage ? "bg-white w-6" : "bg-white/30"
                  }`}
                />
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <GlobalFooter variant="dark" />
    </div>
  );
}
