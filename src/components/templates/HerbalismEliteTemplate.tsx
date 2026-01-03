/**
 * Herbalism Marrakech Élite Template
 * Premium wellness template for herbal/botanical businesses
 * Features: Product gallery, multi-store geolocation, WiFi, Google Reviews, vCard
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, Phone, Mail, Globe, Star, Wifi, 
  Navigation, ChevronRight, Leaf, Droplets,
  Instagram, X, Play, Heart, Sparkles, Store
} from "lucide-react";
import { VCardGoldButton } from "@/components/VCardGoldButton";
import { StoriesSection, useCardStories } from "@/components/templates/StoriesSection";
import { IntroVideoSection } from "@/components/templates/IntroVideoSection";
import { cn } from "@/lib/utils";

// Types
interface Product {
  id: string;
  name: string;
  image: string;
  category: string;
  ingredients: string[];
  benefits: string[];
  price?: string;
}

interface StoreLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  phone?: string;
  coordinates: { lat: number; lng: number };
  isOpen?: boolean;
}

interface HerbalismData {
  // Brand
  logo?: string;
  brandName: string;
  tagline?: string;
  
  // Contact
  phone?: string;
  email?: string;
  website?: string;
  instagram?: string;
  whatsapp?: string;
  
  // Products
  products?: Product[];
  
  // Multi-store
  stores?: StoreLocation[];
  
  // WiFi
  wifiSSID?: string;
  wifiPassword?: string;
  
  // Reviews
  googleReviewsUrl?: string;
  rating?: number;
  reviewCount?: number;
  
  // Introduction Video
  introVideoUrl?: string;
  introVideoPoster?: string;
  
  // vCard
  vcardData?: {
    firstName: string;
    lastName: string;
    company?: string;
    title?: string;
    phone?: string;
    email?: string;
    website?: string;
  };
}

interface HerbalismEliteTemplateProps {
  data?: HerbalismData;
  cardId?: string;
  isPreview?: boolean;
}

// Demo data
const DEMO_DATA: HerbalismData = {
  brandName: "Herbalism Marrakech",
  tagline: "L'art ancestral des plantes",
  logo: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&h=200&fit=crop",
  phone: "+212 524 123 456",
  email: "contact@herbalism-marrakech.ma",
  website: "https://herbalism-marrakech.ma",
  instagram: "herbalism_marrakech",
  whatsapp: "+212524123456",
  googleReviewsUrl: "https://g.page/herbalism-marrakech/review",
  rating: 4.9,
  reviewCount: 847,
  wifiSSID: "Herbalism_Guest",
  wifiPassword: "Wellness2024",
  products: [
    {
      id: "1",
      name: "Huile d'Argan Pure",
      image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=400&fit=crop",
      category: "Huiles",
      ingredients: ["Argan bio", "Vitamine E naturelle"],
      benefits: ["Hydratation intense", "Anti-âge", "Réparation capillaire"],
      price: "350 MAD"
    },
    {
      id: "2",
      name: "Eau de Rose de Damas",
      image: "https://images.unsplash.com/photo-1596178060810-72f53ce9a65c?w=400&h=400&fit=crop",
      category: "Eaux florales",
      ingredients: ["Pétales de rose de Damas", "Eau distillée pure"],
      benefits: ["Tonifiant naturel", "Apaisement", "Éclat du teint"],
      price: "180 MAD"
    },
    {
      id: "3",
      name: "Savon Noir Beldi",
      image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop",
      category: "Soins corps",
      ingredients: ["Huile d'olive noire", "Eucalyptus"],
      benefits: ["Exfoliation douce", "Détoxification", "Peau satinée"],
      price: "120 MAD"
    },
    {
      id: "4",
      name: "Huile de Figue de Barbarie",
      image: "https://images.unsplash.com/photo-1617897903246-719242758050?w=400&h=400&fit=crop",
      category: "Huiles précieuses",
      ingredients: ["Graines de figue de barbarie", "Pressée à froid"],
      benefits: ["Anti-rides puissant", "Régénération cellulaire", "Luxe absolu"],
      price: "890 MAD"
    }
  ],
  stores: [
    {
      id: "1",
      name: "Boutique Médina",
      address: "42 Derb Sidi Ahmed Soussi",
      city: "Marrakech Médina",
      phone: "+212 524 123 456",
      coordinates: { lat: 31.6295, lng: -7.9811 },
      isOpen: true
    },
    {
      id: "2",
      name: "Concept Store Guéliz",
      address: "Avenue Mohammed V, Résidence Al Mokhtar",
      city: "Marrakech Guéliz",
      phone: "+212 524 789 012",
      coordinates: { lat: 31.6347, lng: -8.0083 },
      isOpen: true
    },
    {
      id: "3",
      name: "Espace Bien-être Palmeraie",
      address: "Route de Fès, Km 12",
      city: "Palmeraie",
      phone: "+212 524 345 678",
      coordinates: { lat: 31.6789, lng: -7.9456 },
      isOpen: false
    }
  ],
  vcardData: {
    firstName: "Herbalism",
    lastName: "Marrakech",
    company: "Herbalism Marrakech",
    title: "Boutique de bien-être",
    phone: "+212524123456",
    email: "contact@herbalism-marrakech.ma",
    website: "https://herbalism-marrakech.ma"
  }
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

// Glassmorphism button component
const GlassButton = ({ 
  children, 
  onClick, 
  icon: Icon,
  variant = "default",
  className 
}: { 
  children: React.ReactNode;
  onClick?: () => void;
  icon?: any;
  variant?: "default" | "primary" | "emerald";
  className?: string;
}) => {
  const variants = {
    default: "bg-white/5 border-[#d4af37]/30 hover:bg-white/10 hover:border-[#d4af37]/50",
    primary: "bg-gradient-to-r from-[#d4af37]/20 to-[#c4a030]/20 border-[#d4af37]/50 hover:from-[#d4af37]/30 hover:to-[#c4a030]/30",
    emerald: "bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20 hover:border-emerald-500/50"
  };

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "w-full p-4 rounded-2xl border backdrop-blur-xl",
        "flex items-center justify-between gap-3",
        "text-white/90 transition-all duration-300",
        "shadow-lg shadow-black/20",
        variants[variant],
        className
      )}
    >
      <div className="flex items-center gap-3">
        {Icon && (
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center",
            variant === "emerald" ? "bg-emerald-500/20" : "bg-[#d4af37]/20"
          )}>
            <Icon size={20} className={variant === "emerald" ? "text-emerald-400" : "text-[#d4af37]"} />
          </div>
        )}
        <span className="font-medium">{children}</span>
      </div>
      <ChevronRight size={18} className="text-white/50" />
    </motion.button>
  );
};

// Product Card Component
const ProductCard = ({ 
  product, 
  onClick 
}: { 
  product: Product; 
  onClick: () => void;
}) => (
  <motion.div
    whileHover={{ scale: 1.03, y: -5 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="relative overflow-hidden rounded-2xl cursor-pointer group"
  >
    {/* Image */}
    <div className="aspect-square overflow-hidden">
      <img 
        src={product.image} 
        alt={product.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
    </div>
    
    {/* Gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
    
    {/* Content */}
    <div className="absolute bottom-0 left-0 right-0 p-4">
      <span className="text-emerald-400 text-xs font-medium tracking-wider uppercase">
        {product.category}
      </span>
      <h4 className="text-white font-semibold mt-1">{product.name}</h4>
      {product.price && (
        <span className="text-[#d4af37] font-bold mt-1 block">{product.price}</span>
      )}
    </div>
    
    {/* Hover indicator */}
    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#d4af37]/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
      <Sparkles size={14} className="text-[#d4af37]" />
    </div>
  </motion.div>
);

// Product Detail Modal
const ProductModal = ({ 
  product, 
  onClose 
}: { 
  product: Product; 
  onClose: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    onClick={onClose}
  >
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      onClick={(e) => e.stopPropagation()}
      className="w-full max-w-md bg-gradient-to-b from-zinc-900 to-black rounded-3xl overflow-hidden border border-[#d4af37]/20"
    >
      {/* Product Image */}
      <div className="relative h-64">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center"
        >
          <X size={20} className="text-white" />
        </button>
        
        {/* Category badge */}
        <div className="absolute bottom-4 left-4">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
            {product.category}
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6 space-y-5">
        <div>
          <h3 className="text-2xl font-bold text-white">{product.name}</h3>
          {product.price && (
            <span className="text-[#d4af37] text-xl font-bold mt-1 block">{product.price}</span>
          )}
        </div>
        
        {/* Ingredients */}
        <div>
          <h4 className="text-white/60 text-sm font-medium uppercase tracking-wider mb-2 flex items-center gap-2">
            <Leaf size={14} className="text-emerald-400" />
            Ingrédients
          </h4>
          <div className="flex flex-wrap gap-2">
            {product.ingredients.map((ing, i) => (
              <span 
                key={i}
                className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/80 text-sm"
              >
                {ing}
              </span>
            ))}
          </div>
        </div>
        
        {/* Benefits */}
        <div>
          <h4 className="text-white/60 text-sm font-medium uppercase tracking-wider mb-2 flex items-center gap-2">
            <Heart size={14} className="text-[#d4af37]" />
            Bienfaits
          </h4>
          <ul className="space-y-2">
            {product.benefits.map((benefit, i) => (
              <li key={i} className="flex items-center gap-2 text-white/80">
                <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
        
        {/* CTA */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#d4af37] to-[#c4a030] text-black font-bold text-lg shadow-lg shadow-[#d4af37]/20"
        >
          Découvrir en boutique
        </motion.button>
      </div>
    </motion.div>
  </motion.div>
);

// Store Selector Component
const StoreSelector = ({ 
  stores, 
  onSelect 
}: { 
  stores: StoreLocation[];
  onSelect: (store: StoreLocation) => void;
}) => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearestStore, setNearestStore] = useState<StoreLocation | null>(null);
  
  // Calculate distance between two coordinates
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };
  
  // Find nearest store
  const findNearestStore = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          
          let nearest = stores[0];
          let minDistance = calculateDistance(
            latitude, longitude,
            stores[0].coordinates.lat, stores[0].coordinates.lng
          );
          
          stores.forEach(store => {
            const distance = calculateDistance(
              latitude, longitude,
              store.coordinates.lat, store.coordinates.lng
            );
            if (distance < minDistance) {
              minDistance = distance;
              nearest = store;
            }
          });
          
          setNearestStore(nearest);
          
          // Auto-scroll to store section
          document.getElementById('store-section')?.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
          });
        },
        () => {
          console.log("Geolocation not available");
        }
      );
    }
  };
  
  return (
    <div className="space-y-4" id="store-section">
      {/* Find nearest button */}
      <motion.button
        onClick={findNearestStore}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-xl flex items-center justify-center gap-3 text-emerald-400 font-medium"
      >
        <Navigation size={20} />
        Trouver la boutique la plus proche
      </motion.button>
      
      {/* Nearest store highlight */}
      {nearestStore && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-gradient-to-r from-[#d4af37]/20 to-emerald-500/20 border border-[#d4af37]/30"
        >
          <div className="flex items-center gap-2 text-[#d4af37] text-sm font-medium mb-2">
            <Sparkles size={14} />
            La plus proche de vous
          </div>
          <h4 className="text-white font-semibold">{nearestStore.name}</h4>
          <p className="text-white/60 text-sm mt-1">{nearestStore.address}, {nearestStore.city}</p>
        </motion.div>
      )}
      
      {/* Store list */}
      <div className="space-y-3">
        {stores.map((store) => (
          <motion.button
            key={store.id}
            onClick={() => onSelect(store)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={cn(
              "w-full p-4 rounded-2xl border backdrop-blur-xl text-left transition-all",
              nearestStore?.id === store.id
                ? "bg-[#d4af37]/10 border-[#d4af37]/40"
                : "bg-white/5 border-white/10 hover:border-white/20"
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  store.isOpen ? "bg-emerald-500/20" : "bg-red-500/20"
                )}>
                  <Store size={18} className={store.isOpen ? "text-emerald-400" : "text-red-400"} />
                </div>
                <div>
                  <h4 className="text-white font-medium">{store.name}</h4>
                  <p className="text-white/50 text-sm mt-0.5">{store.address}</p>
                  <p className="text-white/40 text-xs mt-0.5">{store.city}</p>
                </div>
              </div>
              <span className={cn(
                "text-xs font-medium px-2 py-1 rounded-full",
                store.isOpen 
                  ? "bg-emerald-500/20 text-emerald-400" 
                  : "bg-red-500/20 text-red-400"
              )}>
                {store.isOpen ? "Ouvert" : "Fermé"}
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// WiFi Card Component
const WiFiCard = ({ ssid, password }: { ssid: string; password: string }) => {
  const [copied, setCopied] = useState(false);
  
  const copyPassword = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <motion.div 
      className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-[#d4af37]/10 border border-emerald-500/20 backdrop-blur-xl"
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
          <Wifi size={24} className="text-emerald-400" />
        </div>
        <div>
          <h4 className="text-white font-semibold">Connexion Wi-Fi Boutique</h4>
          <p className="text-white/50 text-sm">Connectez-vous gratuitement</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 rounded-xl bg-black/30">
          <span className="text-white/60 text-sm">Réseau</span>
          <span className="text-white font-medium">{ssid}</span>
        </div>
        
        <motion.button
          onClick={copyPassword}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-between p-3 rounded-xl bg-black/30 hover:bg-black/40 transition-colors"
        >
          <span className="text-white/60 text-sm">Mot de passe</span>
          <span className="text-[#d4af37] font-medium">
            {copied ? "✓ Copié!" : "Copier"}
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
};

// Main Template Component
export function HerbalismEliteTemplate({ 
  data = DEMO_DATA,
  cardId,
  isPreview = false 
}: HerbalismEliteTemplateProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { stories } = useCardStories(cardId);
  
  // Handle store selection (open in maps)
  const handleStoreSelect = (store: StoreLocation) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${store.coordinates.lat},${store.coordinates.lng}`;
    if (!isPreview) window.open(url, '_blank');
  };
  
  // Handle action clicks with auto-scroll
  const handleAction = (action: string, value?: string) => {
    if (isPreview) return;
    
    switch (action) {
      case 'phone':
        window.location.href = `tel:${value}`;
        break;
      case 'whatsapp':
        window.open(`https://wa.me/${value?.replace(/\D/g, '')}`, '_blank');
        break;
      case 'email':
        window.location.href = `mailto:${value}`;
        break;
      case 'website':
        window.open(value, '_blank');
        break;
      case 'instagram':
        window.open(`https://instagram.com/${value}`, '_blank');
        break;
      case 'reviews':
        window.open(value, '_blank');
        break;
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black">
      {/* Background pattern */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-[#d4af37]/10 via-transparent to-transparent" />
      </div>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative max-w-md mx-auto px-4 py-8 space-y-8"
      >
        {/* Stories Section - Top Priority */}
        <motion.div variants={itemVariants}>
          <StoriesSection
            cardId={cardId}
            ownerName={data.brandName}
            ownerPhoto={data.logo}
            whatsappNumber={data.whatsapp}
            variant="premium"
          />
        </motion.div>

        {/* Introduction Video */}
        {data.introVideoUrl && (
          <motion.div variants={itemVariants}>
            <IntroVideoSection
              videoUrl={data.introVideoUrl}
              posterUrl={data.introVideoPoster}
              title="Notre Savoir-Faire"
              subtitle="L'art ancestral des plantes"
            />
          </motion.div>
        )}

        {/* Header */}
        <motion.header variants={itemVariants} className="text-center space-y-4">
          {/* Logo */}
          {data.logo && (
            <motion.div 
              className="w-24 h-24 mx-auto rounded-3xl overflow-hidden border-2 border-[#d4af37]/30 shadow-2xl shadow-[#d4af37]/10"
              whileHover={{ scale: 1.05, rotate: 2 }}
            >
              <img 
                src={data.logo} 
                alt={data.brandName}
                className="w-full h-full object-cover"
              />
            </motion.div>
          )}
          
          {/* Brand name */}
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              {data.brandName}
            </h1>
            {data.tagline && (
              <p className="text-emerald-400/80 mt-2 font-light tracking-wide">
                {data.tagline}
              </p>
            )}
          </div>
          
          {/* Rating */}
          {data.rating && (
            <div className="flex items-center justify-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    className={i < Math.floor(data.rating!) ? "text-[#d4af37] fill-[#d4af37]" : "text-white/20"}
                  />
                ))}
              </div>
              <span className="text-[#d4af37] font-semibold">{data.rating}</span>
              <span className="text-white/40 text-sm">({data.reviewCount} avis)</span>
            </div>
          )}
        </motion.header>
        
        {/* Products Gallery */}
        {data.products && data.products.length > 0 && (
          <motion.section variants={itemVariants} className="space-y-4">
            <div className="flex items-center gap-2">
              <Droplets size={18} className="text-emerald-400" />
              <h2 className="text-lg font-semibold text-white">Nos Trésors Naturels</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {data.products.map((product) => (
                <ProductCard 
                  key={product.id}
                  product={product}
                  onClick={() => setSelectedProduct(product)}
                />
              ))}
            </div>
          </motion.section>
        )}
        
        {/* Quick Actions */}
        <motion.section variants={itemVariants} className="space-y-3">
          {data.phone && (
            <GlassButton 
              icon={Phone} 
              onClick={() => handleAction('phone', data.phone)}
            >
              Appeler la boutique
            </GlassButton>
          )}
          
          {data.whatsapp && (
            <GlassButton 
              icon={Phone} 
              variant="emerald"
              onClick={() => handleAction('whatsapp', data.whatsapp)}
            >
              WhatsApp
            </GlassButton>
          )}
          
          {data.website && (
            <GlassButton 
              icon={Globe}
              onClick={() => handleAction('website', data.website)}
            >
              Visiter le site
            </GlassButton>
          )}
          
          {data.instagram && (
            <GlassButton 
              icon={Instagram}
              onClick={() => handleAction('instagram', data.instagram)}
            >
              @{data.instagram}
            </GlassButton>
          )}
        </motion.section>
        
        {/* Stores Section */}
        {data.stores && data.stores.length > 0 && (
          <motion.section variants={itemVariants} className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-[#d4af37]" />
              <h2 className="text-lg font-semibold text-white">Nos Boutiques</h2>
            </div>
            
            <StoreSelector 
              stores={data.stores}
              onSelect={handleStoreSelect}
            />
          </motion.section>
        )}
        
        {/* WiFi Section */}
        {data.wifiSSID && data.wifiPassword && (
          <motion.section variants={itemVariants}>
            <WiFiCard ssid={data.wifiSSID} password={data.wifiPassword} />
          </motion.section>
        )}
        
        {/* Google Reviews */}
        {data.googleReviewsUrl && (
          <motion.section variants={itemVariants}>
            <GlassButton 
              icon={Star}
              variant="primary"
              onClick={() => handleAction('reviews', data.googleReviewsUrl)}
            >
              Laisser un avis Google
            </GlassButton>
          </motion.section>
        )}
        
        {/* vCard Download */}
        {data.vcardData && (
          <motion.section variants={itemVariants}>
            <VCardGoldButton 
              data={data.vcardData}
              label="Enregistrer le contact"
              size="lg"
            />
          </motion.section>
        )}
        
        {/* Footer */}
        <motion.footer 
          variants={itemVariants}
          className="text-center pt-8 pb-4"
        >
          <p className="text-white/30 text-xs tracking-wider">
            Powered by <span className="text-[#d4af37]/50">IWASP</span>
          </p>
        </motion.footer>
      </motion.div>
      
      {/* Product Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductModal 
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default HerbalismEliteTemplate;
