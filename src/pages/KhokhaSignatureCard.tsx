/**
 * 🛡️ FICHIER CLIENT PROTÉGÉ - KHOKHA SIGNATURE
 * 
 * ⚠️ NE PAS MODIFIER lors de mises à jour générales du site
 * Modifications autorisées uniquement sur demande explicite du client
 * 
 * Client: Khokha Signature
 * Secteur: Fashion, Style & Trend
 * Localisation: Marrakech, Maroc
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  MapPin,
  Instagram,
  UserPlus,
  Heart,
  ShoppingBag,
  Sparkles,
  Crown,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  X,
  Navigation,
  Play,
} from "lucide-react";
import { toast } from "sonner";
import { IWASPBrandingFooter } from "@/components/IWASPBrandingFooter";
import { ProductVideoPlayer } from "@/components/clients/khokha-signature/ProductVideoPlayer";

// Import product images
import logoImg from "@/assets/clients/khokha-signature/logo.jpg";
import lookCamel from "@/assets/clients/khokha-signature/look-camel.png";
import lookBurgundyFur from "@/assets/clients/khokha-signature/look-burgundy-fur.png";
import lookLeatherPants from "@/assets/clients/khokha-signature/look-leather-pants.png";
import lookShimmerTop from "@/assets/clients/khokha-signature/look-shimmer-top.png";
import lookTweedJacket from "@/assets/clients/khokha-signature/look-tweed-jacket.png";
import leggingsThermal from "@/assets/clients/khokha-signature/leggings-thermal.png";
import robeNoireElegante from "@/assets/clients/khokha-signature/robe-noire-elegante.png";

// New product images
import ensembleCuirNoir from "@/assets/clients/khokha-signature/products/ensemble-cuir-noir.png";
import jupePlissee from "@/assets/clients/khokha-signature/products/jupe-plissee-elegante.png";
import robeSequinsOr from "@/assets/clients/khokha-signature/products/robe-sequins-or.png";
import ensembleNoirChic from "@/assets/clients/khokha-signature/products/ensemble-noir-chic.png";
import robeBlanc from "@/assets/clients/khokha-signature/products/robe-blanche-elegante.png";
import robeNoireSoiree from "@/assets/clients/khokha-signature/products/robe-noire-soiree.png";
import topDentelleNoir from "@/assets/clients/khokha-signature/products/top-dentelle-noir.png";

// Product videos
import videoProduit1 from "@/assets/clients/khokha-signature/videos/video-produit-1.mp4";
import videoProduit2 from "@/assets/clients/khokha-signature/videos/video-produit-2.mp4";
import videoProduit3 from "@/assets/clients/khokha-signature/videos/video-produit-3.mp4";

const KS_COLORS = {
  background: "#0A0A0A",
  card: "#111111",
  gold: "#D4AF37",
  goldLight: "#F4E4BC",
  goldDark: "#B8960C",
  burgundy: "#722F37",
  cream: "#F5F0E6",
  text: "#FFFFFF",
  textMuted: "#9CA3AF",
  accent: "#1C1C1C",
};

// Snapchat Icon Component
const SnapchatIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    className={className}
  >
    <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-.809-.314-1.214-.705-1.199-1.168 0-.313.24-.675.749-.853.15-.061.33-.09.51-.09.151 0 .3.029.45.074.36.12.735.27 1.05.27.18 0 .315-.029.391-.074-.015-.18-.029-.344-.046-.509-.015-.18-.015-.3-.03-.061-.106-1.634-.229-3.681.296-4.873C7.872 1.008 11.266.793 12.206.793" />
  </svg>
);

// Client contact info - Khokha Signature
const CONTACT = {
  name: "Khokha Signature",
  title: "Fashion, Style & Trend",
  tagline: "Where Style Meets Luxury",
  phone: "+212 7 00 17 68 87",
  whatsapp: "212700176887",
  instagram: "khokha.signature",
  snapchat: "khokha865",
  location: "Jenane Awerad Résidence les Cristaux",
  locationDetail: "À côté GIA Beauty, en face Coffee Shop",
  city: "Marrakech, Maroc",
  gps: { lat: 31.659300, lng: -8.020722 },
  mapsUrl: "https://maps.google.com/?q=31.659300,-8.020722",
};

// Product categories
const CATEGORIES = [
  { id: "all", label: "Tous", icon: Sparkles },
  { id: "robes", label: "Robes", icon: Crown },
  { id: "blazers", label: "Blazers", icon: ShoppingBag },
  { id: "pantalons", label: "Pantalons", icon: ShoppingBag },
  { id: "accessories", label: "Accessoires", icon: Heart },
];

// Product type with optional video
interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  colors: string[];
  sizes: string[];
  material: string;
  image: string;
  video?: string; // Optional video URL
  featured?: boolean;
  tags: string[];
}

// Products catalog
const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Robe Sequins Or",
    category: "robes",
    description: "Robe de soirée entièrement brodée de sequins dorés, coupe ajustée glamour",
    colors: ["Or"],
    sizes: ["XS", "S", "M", "L"],
    material: "Base stretch, sequins cousus main",
    image: robeSequinsOr,
    video: videoProduit1,
    featured: true,
    tags: ["#GoldenGlam", "#PartyDress"],
  },
  {
    id: 2,
    name: "Blazer Oversized Camel",
    category: "blazers",
    description: "Blazer surdimensionné en laine cachemire, coupe décontractée chic",
    colors: ["Camel"],
    sizes: ["S", "M", "L"],
    material: "80% Laine, 20% Cachemire",
    image: lookCamel,
    video: videoProduit2,
    featured: true,
    tags: ["#OversizedStyle", "#CasualLuxury"],
  },
  {
    id: 3,
    name: "Manteau Fourrure Bordeaux",
    category: "blazers",
    description: "Manteau court en fausse fourrure premium, toucher ultra-doux",
    colors: ["Bordeaux"],
    sizes: ["S", "M", "L"],
    material: "Fausse fourrure haute qualité",
    image: lookBurgundyFur,
    video: videoProduit3,
    featured: true,
    tags: ["#WinterLuxury", "#FauxFur"],
  },
  {
    id: 4,
    name: "Ensemble Cuir Noir Chic",
    category: "pantalons",
    description: "Ensemble pantalon cuir et veste assortie, coupe structurée moderne",
    colors: ["Noir"],
    sizes: ["S", "M", "L"],
    material: "Simili cuir premium haute qualité",
    image: ensembleCuirNoir,
    featured: true,
    tags: ["#TotalLook", "#LeatherLuxury"],
  },
  {
    id: 5,
    name: "Robe Blanche Élégante",
    category: "robes",
    description: "Robe midi blanche, coupe fluide avec détails raffinés",
    colors: ["Blanc"],
    sizes: ["S", "M", "L"],
    material: "Crêpe de qualité supérieure",
    image: robeBlanc,
    featured: true,
    tags: ["#WhiteElegance", "#SummerLuxury"],
  },
  {
    id: 6,
    name: "Pantalon Cuir Noir",
    category: "pantalons",
    description: "Pantalon balloon en simili cuir premium, taille élastique confort",
    colors: ["Noir"],
    sizes: ["S", "M", "L", "XL"],
    material: "Simili cuir premium",
    image: lookLeatherPants,
    tags: ["#LeatherStyle", "#TrendSetter"],
  },
  {
    id: 7,
    name: "Top Shimmer Cristaux",
    category: "accessories",
    description: "Top transparent orné de cristaux, effet scintillant",
    colors: ["Noir"],
    sizes: ["S", "M", "L"],
    material: "Mesh stretch, cristaux synthétiques",
    image: lookShimmerTop,
    tags: ["#PartyWear", "#Sparkle"],
  },
  {
    id: 8,
    name: "Veste Tweed Noir & Or",
    category: "blazers",
    description: "Veste courte style Chanel, tweed noir avec fils dorés, noeud décoratif",
    colors: ["Noir/Or"],
    sizes: ["S", "M", "L"],
    material: "Tweed de laine mélangée",
    image: lookTweedJacket,
    featured: true,
    tags: ["#ChanelStyle", "#Timeless"],
  },
  {
    id: 9,
    name: "Robe Noire Soirée",
    category: "robes",
    description: "Robe longue noire pour occasions spéciales, silhouette épurée",
    colors: ["Noir"],
    sizes: ["XS", "S", "M", "L"],
    material: "Jersey stretch luxe, doublure satin",
    image: robeNoireSoiree,
    tags: ["#EveningGown", "#TimelessBlack"],
  },
  {
    id: 10,
    name: "Robe Noire Élégante",
    category: "robes",
    description: "Robe courte noire avec poches structurées, coupe ajustée, col perles",
    colors: ["Noir"],
    sizes: ["S", "M", "L"],
    material: "Crêpe épais, col brodé perles",
    image: robeNoireElegante,
    featured: true,
    tags: ["#LittleBlackDress", "#Elegance"],
  },
  {
    id: 11,
    name: "Jupe Plissée Élégante",
    category: "robes",
    description: "Jupe mi-longue plissée, mouvement fluide et silhouette raffinée",
    colors: ["Camel", "Noir"],
    sizes: ["S", "M", "L"],
    material: "Polyester plissé permanent",
    image: jupePlissee,
    tags: ["#PlissePleat", "#FeminineStyle"],
  },
  {
    id: 12,
    name: "Ensemble Noir Sophistiqué",
    category: "blazers",
    description: "Ensemble veste et pantalon noir, coupe épurée et élégante",
    colors: ["Noir"],
    sizes: ["S", "M", "L", "XL"],
    material: "Gabardine stretch premium",
    image: ensembleNoirChic,
    tags: ["#PowerDressing", "#AllBlack"],
  },
  {
    id: 13,
    name: "Top Dentelle Noir",
    category: "accessories",
    description: "Top en dentelle fine, transparent et sensuel, finitions soignées",
    colors: ["Noir"],
    sizes: ["S", "M", "L"],
    material: "Dentelle française, doublure optionnelle",
    image: topDentelleNoir,
    tags: ["#LaceTop", "#SexyChic"],
  },
  {
    id: 14,
    name: "Legging Thermique Premium",
    category: "pantalons",
    description: "Legging gainant doublé polaire, confort et chaleur optimaux",
    colors: ["Noir"],
    sizes: ["S", "M", "L", "XL"],
    material: "Polyamide technique, doublure polaire",
    image: leggingsThermal,
    tags: ["#ComfortStyle", "#WinterEssential"],
  },
];

export default function KhokhaSignatureCard() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<typeof PRODUCTS[0] | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const filteredProducts = selectedCategory === "all" 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === selectedCategory);

  const featuredProducts = PRODUCTS.filter(p => p.featured);

  const handleAddContact = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${CONTACT.name}
ORG:${CONTACT.name}
TITLE:${CONTACT.title}
TEL;TYPE=CELL:${CONTACT.phone}
ADR;TYPE=WORK:;;${CONTACT.location};${CONTACT.city};;;Maroc
GEO:${CONTACT.gps.lat};${CONTACT.gps.lng}
URL;TYPE=INSTAGRAM:https://instagram.com/${CONTACT.instagram}
URL;TYPE=SNAPCHAT:https://www.snapchat.com/add/${CONTACT.snapchat}
NOTE:${CONTACT.tagline} - ${CONTACT.locationDetail}
END:VCARD`;

    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "khokha-signature.vcf";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Contact ajouté !");
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Bonjour Khokha Signature ! Je suis intéressé(e) par votre collection. 👗✨`);
    window.open(`https://wa.me/${CONTACT.whatsapp}?text=${message}`, "_blank");
  };

  const handleCall = () => {
    window.open(`tel:${CONTACT.phone}`, "_self");
  };

  const handleInstagram = () => {
    window.open(`https://instagram.com/${CONTACT.instagram}`, "_blank");
  };

  const handleSnapchat = () => {
    window.open(`https://www.snapchat.com/add/${CONTACT.snapchat}`, "_blank");
  };

  const handleMaps = () => {
    window.open(CONTACT.mapsUrl, "_blank");
  };

  const handleProductInquiry = (product: typeof PRODUCTS[0]) => {
    const message = encodeURIComponent(
      `Bonjour ! Je suis intéressé(e) par "${product.name}". Est-il disponible en stock ? 👗`
    );
    window.open(`https://wa.me/${CONTACT.whatsapp}?text=${message}`, "_blank");
  };

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{ backgroundColor: KS_COLORS.background }}
    >
      {/* Luxury gradient overlay */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${KS_COLORS.gold}15 0%, transparent 50%)`,
          }}
        />
      </div>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative pt-8 pb-6 px-4"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-6"
        >
          <div
            className="w-32 h-32 rounded-2xl overflow-hidden"
            style={{
              boxShadow: `0 0 40px ${KS_COLORS.gold}40`,
              border: `2px solid ${KS_COLORS.gold}30`,
            }}
          >
            <img
              src={logoImg}
              alt="Khokha Signature Logo"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        {/* Brand Name */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <h1
            className="text-3xl font-bold tracking-tight mb-1"
            style={{ color: KS_COLORS.gold }}
          >
            Khokha Signature
          </h1>
          <p className="text-sm tracking-widest uppercase" style={{ color: KS_COLORS.textMuted }}>
            {CONTACT.title}
          </p>
          <p
            className="text-xs mt-2 italic"
            style={{ color: KS_COLORS.goldLight }}
          >
            "{CONTACT.tagline}"
          </p>
        </motion.div>

        {/* Location */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex items-center justify-center gap-2 mt-4"
        >
          <MapPin size={14} style={{ color: KS_COLORS.gold }} />
          <button
            onClick={handleMaps}
            className="text-xs hover:underline"
            style={{ color: KS_COLORS.textMuted }}
          >
            {CONTACT.location}, {CONTACT.city}
          </button>
        </motion.div>
      </motion.section>

      {/* Action Buttons */}
      <motion.section
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="px-4 pb-6"
      >
        {/* Primary CTA - Add Contact */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddContact}
          className="w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-3 mb-4"
          style={{
            background: `linear-gradient(135deg, ${KS_COLORS.gold} 0%, ${KS_COLORS.goldDark} 100%)`,
            color: KS_COLORS.background,
            boxShadow: `0 8px 24px ${KS_COLORS.gold}40`,
          }}
        >
          <UserPlus size={20} />
          Ajouter aux contacts
        </motion.button>

        {/* Secondary Actions Grid */}
        <div className="grid grid-cols-4 gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCall}
            className="flex flex-col items-center gap-2 py-4 rounded-xl"
            style={{
              backgroundColor: KS_COLORS.card,
              border: `1px solid ${KS_COLORS.gold}30`,
            }}
          >
            <Phone size={20} style={{ color: KS_COLORS.gold }} />
            <span className="text-xs" style={{ color: KS_COLORS.text }}>
              Appeler
            </span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleWhatsApp}
            className="flex flex-col items-center gap-2 py-4 rounded-xl"
            style={{
              backgroundColor: "#25D366",
            }}
          >
            <MessageCircle size={20} style={{ color: "white" }} />
            <span className="text-xs" style={{ color: "white" }}>
              WhatsApp
            </span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleInstagram}
            className="flex flex-col items-center gap-2 py-4 rounded-xl"
            style={{
              background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
            }}
          >
            <Instagram size={20} style={{ color: "white" }} />
            <span className="text-xs" style={{ color: "white" }}>
              Instagram
            </span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSnapchat}
            className="flex flex-col items-center gap-2 py-4 rounded-xl"
            style={{
              backgroundColor: "#FFFC00",
            }}
          >
            <SnapchatIcon size={20} className="text-black" />
            <span className="text-xs font-medium" style={{ color: "#000000" }}>
              Snapchat
            </span>
          </motion.button>
        </div>

        {/* Maps Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleMaps}
          className="w-full mt-3 py-3 rounded-xl flex items-center justify-center gap-2"
          style={{
            backgroundColor: KS_COLORS.card,
            border: `1px solid ${KS_COLORS.gold}30`,
          }}
        >
          <Navigation size={18} style={{ color: KS_COLORS.gold }} />
          <span className="text-sm" style={{ color: KS_COLORS.text }}>
            Itinéraire vers la boutique
          </span>
        </motion.button>
      </motion.section>

      {/* Featured Products Carousel */}
      <motion.section
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="px-4 pb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold" style={{ color: KS_COLORS.gold }}>
            ✨ Sélection Premium
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: KS_COLORS.card, border: `1px solid ${KS_COLORS.gold}30` }}
            >
              <ChevronLeft size={16} style={{ color: KS_COLORS.gold }} />
            </button>
            <button
              onClick={() => setCurrentImageIndex(Math.min(featuredProducts.length - 1, currentImageIndex + 1))}
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: KS_COLORS.card, border: `1px solid ${KS_COLORS.gold}30` }}
            >
              <ChevronRight size={16} style={{ color: KS_COLORS.gold }} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
          <div className="flex gap-4" style={{ width: "max-content" }}>
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                onClick={() => setSelectedProduct(product)}
                className="w-72 flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer group"
                style={{
                  backgroundColor: KS_COLORS.card,
                  border: `2px solid ${KS_COLORS.gold}30`,
                  boxShadow: `0 8px 32px ${KS_COLORS.gold}15`,
                }}
              >
                <div className="relative h-96">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to top, ${KS_COLORS.background} 0%, ${KS_COLORS.background}60 30%, transparent 60%)`,
                    }}
                  />
                  
                  {/* Featured badge */}
                  <div
                    className="absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5"
                    style={{
                      background: `linear-gradient(135deg, ${KS_COLORS.gold} 0%, ${KS_COLORS.goldDark} 100%)`,
                      color: KS_COLORS.background,
                      boxShadow: `0 4px 12px ${KS_COLORS.gold}40`,
                    }}
                  >
                    <Crown size={12} />
                    Premium
                  </div>
                  
                  {/* Video indicator */}
                  {product.video && (
                    <div
                      className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                      style={{
                        backgroundColor: "rgba(0,0,0,0.7)",
                        color: "white",
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      <Play size={10} fill="currentColor" />
                      Vidéo
                    </div>
                  )}
                  
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="font-bold text-lg mb-1" style={{ color: KS_COLORS.text }}>
                      {product.name}
                    </h3>
                    <p className="text-sm mb-2 opacity-80 line-clamp-1" style={{ color: KS_COLORS.textMuted }}>
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium" style={{ color: KS_COLORS.goldLight }}>
                        Prix en boutique
                      </p>
                      <div 
                        className="px-3 py-1.5 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: KS_COLORS.gold + "20",
                          color: KS_COLORS.gold,
                        }}
                      >
                        Voir →
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Category Filters */}
      <motion.section
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="px-4 pb-4"
      >
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all"
                style={{
                  backgroundColor: isActive ? KS_COLORS.gold : KS_COLORS.card,
                  color: isActive ? KS_COLORS.background : KS_COLORS.text,
                  border: `1px solid ${isActive ? KS_COLORS.gold : KS_COLORS.gold}30`,
                }}
              >
                <Icon size={14} />
                <span className="text-sm font-medium">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </motion.section>

      {/* Products Grid */}
      <motion.section
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        className="px-4 pb-8"
      >
        <h2 className="text-lg font-semibold mb-4" style={{ color: KS_COLORS.text }}>
          Collection ({filteredProducts.length})
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedProduct(product)}
              className="rounded-2xl overflow-hidden cursor-pointer group"
              style={{
                backgroundColor: KS_COLORS.card,
                border: `1px solid ${KS_COLORS.gold}20`,
                boxShadow: `0 4px 20px ${KS_COLORS.background}`,
              }}
            >
              <div className="relative aspect-[3/4]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to top, ${KS_COLORS.background} 0%, ${KS_COLORS.background}40 25%, transparent 50%)`,
                  }}
                />
                
                {/* Video indicator badge */}
                {product.video && (
                  <div
                    className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1"
                    style={{
                      backgroundColor: KS_COLORS.gold,
                      color: KS_COLORS.background,
                      boxShadow: `0 2px 8px ${KS_COLORS.gold}50`,
                    }}
                  >
                    <Play size={10} fill="currentColor" />
                    Vidéo
                  </div>
                )}
                
                {/* Featured indicator */}
                {product.featured && !product.video && (
                  <div
                    className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: KS_COLORS.gold,
                      color: KS_COLORS.background,
                    }}
                  >
                    <Crown size={12} />
                  </div>
                )}
                
                {/* Quick info overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="font-semibold text-sm mb-0.5 line-clamp-1" style={{ color: KS_COLORS.text }}>
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium" style={{ color: KS_COLORS.goldLight }}>
                      Prix en boutique
                    </p>
                    <span 
                      className="text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: KS_COLORS.goldLight }}
                    >
                      Voir →
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Product Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center"
            style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-t-3xl overflow-hidden max-h-[90vh] overflow-y-auto"
              style={{ backgroundColor: KS_COLORS.background }}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: KS_COLORS.card }}
              >
                <X size={20} style={{ color: KS_COLORS.text }} />
              </button>

              {/* Product Image or Video */}
              <div className="relative aspect-[4/5]">
                {selectedProduct.video ? (
                  <ProductVideoPlayer
                    src={selectedProduct.video}
                    poster={selectedProduct.image}
                    className="w-full h-full"
                  />
                ) : (
                  <>
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(to top, ${KS_COLORS.background} 0%, transparent 30%)`,
                      }}
                    />
                  </>
                )}
              </div>

              {/* Product Details */}
              <div className="p-6 -mt-16 relative">
                <h2 className="text-2xl font-bold mb-2" style={{ color: KS_COLORS.text }}>
                  {selectedProduct.name}
                </h2>
                <p className="text-lg font-medium mb-4" style={{ color: KS_COLORS.goldLight }}>
                  Prix disponible en boutique ou sur demande
                </p>

                <p className="text-sm mb-4" style={{ color: KS_COLORS.textMuted }}>
                  {selectedProduct.description}
                </p>

                {/* Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-3 py-1 rounded-full" style={{ backgroundColor: KS_COLORS.card, color: KS_COLORS.goldLight }}>
                      Couleurs: {selectedProduct.colors.join(", ")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-3 py-1 rounded-full" style={{ backgroundColor: KS_COLORS.card, color: KS_COLORS.goldLight }}>
                      Tailles: {selectedProduct.sizes.join(", ")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-3 py-1 rounded-full" style={{ backgroundColor: KS_COLORS.card, color: KS_COLORS.textMuted }}>
                      {selectedProduct.material}
                    </span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedProduct.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 rounded"
                      style={{ backgroundColor: KS_COLORS.gold + "20", color: KS_COLORS.gold }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleProductInquiry(selectedProduct)}
                  className="w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-3"
                  style={{
                    background: `linear-gradient(135deg, ${KS_COLORS.gold} 0%, ${KS_COLORS.goldDark} 100%)`,
                    color: KS_COLORS.background,
                  }}
                >
                  <MessageCircle size={20} />
                  Commander via WhatsApp
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="pb-8">
        <IWASPBrandingFooter variant="dark" />
      </div>
    </div>
  );
}
