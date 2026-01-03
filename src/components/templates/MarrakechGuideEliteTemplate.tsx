import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, MessageCircle, Instagram, MapPin, Star, 
  UtensilsCrossed, Home, Compass, ShoppingBag,
  ChevronRight, X, ExternalLink, Award, Palmtree,
  Play, Volume2, VolumeX
} from 'lucide-react';
import { VCardGoldButton } from '@/components/VCardGoldButton';
import { handleWhatsAppTap, handleSocialTap } from '@/lib/smartActions';
import { StoriesSection, useCardStories } from '@/components/templates/StoriesSection';

// Types
interface Recommendation {
  id: string;
  name: string;
  description: string;
  rating?: number;
  priceRange?: string;
  mapsUrl?: string;
  websiteUrl?: string;
  imageUrl?: string;
  tags?: string[];
}

interface Category {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  items: Recommendation[];
}

interface GuideData {
  name: string;
  title: string;
  photoUrl?: string;
  certificationId?: string;
  phone?: string;
  whatsapp?: string;
  instagram?: string;
  email?: string;
  videoUrl?: string;
  videoPoster?: string;
  categories: Category[];
}

interface MarrakechGuideEliteTemplateProps {
  data?: Partial<GuideData>;
  cardId?: string;
  isPreview?: boolean;
}

// Default data
const defaultData: GuideData = {
  name: "Hassan El Mansouri",
  title: "Guide Officiel de Marrakech",
  photoUrl: "/placeholder.svg",
  certificationId: "MRK-2024-0847",
  phone: "+212 6 12 34 56 78",
  whatsapp: "+212612345678",
  instagram: "marrakech_insider",
  email: "contact@marrakech-guide.ma",
  categories: [
    {
      id: "gastronomy",
      title: "Restaurants & Saveurs Locales",
      subtitle: "Ma sélection des meilleures tables",
      icon: <UtensilsCrossed className="w-6 h-6" />,
      items: [
        {
          id: "1",
          name: "Le Jardin Secret",
          description: "Cuisine marocaine raffinée dans un riad historique",
          rating: 4.8,
          priceRange: "€€€",
          mapsUrl: "https://maps.google.com",
          tags: ["Gastronomique", "Vue terrasse"]
        },
        {
          id: "2",
          name: "Nomad",
          description: "Rooftop moderne avec vue sur la Médina",
          rating: 4.6,
          priceRange: "€€",
          mapsUrl: "https://maps.google.com",
          tags: ["Moderne", "Instagrammable"]
        },
        {
          id: "3",
          name: "Café des Épices",
          description: "L'authentique saveur de la place",
          rating: 4.5,
          priceRange: "€",
          mapsUrl: "https://maps.google.com",
          tags: ["Traditionnel", "Terrasse"]
        }
      ]
    },
    {
      id: "accommodation",
      title: "Riads & Adresses d'Exception",
      subtitle: "Sélection exclusive pour un séjour inoubliable",
      icon: <Home className="w-6 h-6" />,
      items: [
        {
          id: "1",
          name: "Riad Yasmine",
          description: "Piscine iconique et décoration raffinée",
          rating: 4.9,
          priceRange: "€€€€",
          websiteUrl: "https://booking.com",
          tags: ["Piscine", "Luxe"]
        },
        {
          id: "2",
          name: "Dar Anika",
          description: "Charme authentique au cœur de la Médina",
          rating: 4.7,
          priceRange: "€€€",
          websiteUrl: "https://booking.com",
          tags: ["Authentique", "Central"]
        }
      ]
    },
    {
      id: "experiences",
      title: "Excursions & Activités Incontournables",
      subtitle: "Désert, Jardins, Montgolfière...",
      icon: <Compass className="w-6 h-6" />,
      items: [
        {
          id: "1",
          name: "Désert d'Agafay au Coucher du Soleil",
          description: "Dîner sous les étoiles avec quad et chameau",
          rating: 4.9,
          priceRange: "€€€",
          websiteUrl: "#",
          tags: ["Romantique", "Aventure"]
        },
        {
          id: "2",
          name: "Vol en Montgolfière",
          description: "Survol de l'Atlas et des palmeraies",
          rating: 5.0,
          priceRange: "€€€€",
          websiteUrl: "#",
          tags: ["Exclusif", "Vue unique"]
        },
        {
          id: "3",
          name: "Hammam & Spa Traditionnel",
          description: "Rituel de bien-être ancestral",
          rating: 4.8,
          priceRange: "€€",
          websiteUrl: "#",
          tags: ["Détente", "Authentique"]
        }
      ]
    },
    {
      id: "souks",
      title: "Trésors des Souks & Artisans Authentiques",
      subtitle: "Adresses certifiées, loin des pièges touristiques",
      icon: <ShoppingBag className="w-6 h-6" />,
      items: [
        {
          id: "1",
          name: "Atelier Majorelle Cuir",
          description: "Maroquinerie artisanale depuis 3 générations",
          rating: 4.9,
          mapsUrl: "https://maps.google.com",
          tags: ["Cuir", "Artisan certifié"]
        },
        {
          id: "2",
          name: "Berbère Tapis",
          description: "Tapis authentiques des montagnes de l'Atlas",
          rating: 4.7,
          mapsUrl: "https://maps.google.com",
          tags: ["Tapis", "Prix fixe"]
        },
        {
          id: "3",
          name: "Céramiques Fès",
          description: "Poterie peinte à la main, couleurs traditionnelles",
          rating: 4.8,
          mapsUrl: "https://maps.google.com",
          tags: ["Céramique", "Fait main"]
        }
      ]
    }
  ]
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 } as const,
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const }
  }
};

// Moucharabieh Pattern SVG
const MoucharabiehPattern = () => (
  <svg 
    className="absolute inset-0 w-full h-full opacity-5 pointer-events-none"
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidYMid slice"
  >
    <defs>
      <pattern id="moucharabieh" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <path 
          d="M10 0L20 10L10 20L0 10Z M10 5L15 10L10 15L5 10Z" 
          fill="none" 
          stroke="#D4AF37" 
          strokeWidth="0.5"
        />
        <circle cx="10" cy="10" r="2" fill="none" stroke="#D4AF37" strokeWidth="0.3" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#moucharabieh)" />
  </svg>
);

// Gold Glass Button
const GoldGlassButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
}> = ({ children, onClick, icon, variant = 'primary', className = '' }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`
      w-full flex items-center justify-between gap-3 px-5 py-4 rounded-2xl
      backdrop-blur-xl border transition-all duration-300
      ${variant === 'primary' 
        ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border-amber-400/30 text-amber-100 hover:border-amber-400/50' 
        : 'bg-white/5 border-white/10 text-white/90 hover:border-white/20'}
      ${className}
    `}
  >
    <div className="flex items-center gap-3">
      {icon && <span className="text-amber-400">{icon}</span>}
      <span className="font-medium">{children}</span>
    </div>
    <ChevronRight className="w-5 h-5 text-amber-400/70" />
  </motion.button>
);

// Category Card
const CategoryCard: React.FC<{
  category: Category;
  onClick: () => void;
}> = ({ category, onClick }) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="relative overflow-hidden rounded-3xl cursor-pointer group"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-transparent to-amber-600/10" />
    <div className="absolute inset-0 backdrop-blur-xl bg-black/40 border border-amber-400/20 rounded-3xl" />
    
    <div className="relative p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-400/30 to-amber-600/20 border border-amber-400/30">
          <span className="text-amber-400">{category.icon}</span>
        </div>
        <motion.div 
          className="p-2 rounded-full bg-amber-400/20"
          whileHover={{ x: 5 }}
        >
          <ChevronRight className="w-5 h-5 text-amber-400" />
        </motion.div>
      </div>
      
      <h3 className="text-lg font-bold text-amber-100 mb-1">{category.title}</h3>
      <p className="text-sm text-white/60">{category.subtitle}</p>
      
      <div className="mt-4 flex items-center gap-2">
        <span className="text-xs text-amber-400/80 bg-amber-400/10 px-2 py-1 rounded-full">
          {category.items.length} adresses
        </span>
      </div>
    </div>
  </motion.div>
);

// Recommendation Modal
const RecommendationModal: React.FC<{
  category: Category | null;
  onClose: () => void;
}> = ({ category, onClose }) => {
  const scrollToItem = useCallback((id: string) => {
    const element = document.getElementById(`item-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  if (!category) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg max-h-[85vh] bg-gradient-to-b from-zinc-900 to-black rounded-t-3xl overflow-hidden"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-b from-zinc-900 via-zinc-900 to-transparent pb-4">
          <div className="flex items-center justify-between p-6 pb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-400/20 text-amber-400">
                {category.icon}
              </div>
              <div>
                <h2 className="text-xl font-bold text-amber-100">{category.title}</h2>
                <p className="text-sm text-white/50">{category.subtitle}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
        </div>

        {/* Items List */}
        <div className="px-6 pb-8 space-y-4 overflow-y-auto max-h-[calc(85vh-120px)]">
          {category.items.map((item) => (
            <motion.div
              key={item.id}
              id={`item-${item.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/30 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-white mb-1">{item.name}</h3>
                  <p className="text-sm text-white/60">{item.description}</p>
                </div>
                {item.rating && (
                  <div className="flex items-center gap-1 bg-amber-400/20 px-2 py-1 rounded-full">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-xs text-amber-400 font-medium">{item.rating}</span>
                  </div>
                )}
              </div>
              
              {item.tags && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.tags.map((tag, idx) => (
                    <span key={idx} className="text-xs bg-white/10 text-white/70 px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                {item.mapsUrl && (
                  <motion.a
                    href={item.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-400/20 text-amber-400 font-medium text-sm"
                  >
                    <MapPin className="w-4 h-4" />
                    Voir sur Maps
                  </motion.a>
                )}
                {item.websiteUrl && (
                  <motion.a
                    href={item.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/10 text-white font-medium text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Réserver
                  </motion.a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

// Certification Badge
const CertificationBadge: React.FC<{ certificationId?: string }> = ({ certificationId }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-600/10 border border-amber-400/30"
  >
    <div className="p-1 rounded-full bg-amber-400/30">
      <Palmtree className="w-4 h-4 text-amber-400" />
    </div>
    <div className="text-left">
      <span className="block text-xs text-amber-400 font-semibold">Guide Certifié</span>
      {certificationId && (
        <span className="block text-[10px] text-amber-400/60">N° {certificationId}</span>
      )}
    </div>
    <Award className="w-5 h-5 text-amber-400" />
  </motion.div>
);

// Video Player
const VideoPlayer: React.FC<{ 
  videoUrl: string; 
  posterUrl?: string;
}> = ({ videoUrl, posterUrl }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <motion.div 
      variants={itemVariants}
      className="relative rounded-3xl overflow-hidden"
    >
      <video
        ref={videoRef}
        src={videoUrl}
        poster={posterUrl}
        muted
        playsInline
        autoPlay
        loop
        className="w-full aspect-video object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      
      <button
        onClick={toggleMute}
        className="absolute bottom-4 right-4 p-3 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 text-white"
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>
      
      <div className="absolute bottom-4 left-4 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-sm text-white/80">Découvrez Marrakech</span>
      </div>
    </motion.div>
  );
};

// Main Component
export const MarrakechGuideEliteTemplate: React.FC<MarrakechGuideEliteTemplateProps> = ({
  data = {},
  cardId,
  isPreview = false
}) => {
  const guideData: GuideData = { ...defaultData, ...data };
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const storiesRef = useRef<HTMLDivElement>(null);
  const { stories } = useCardStories(cardId);

  const scrollToCategories = useCallback(() => {
    if (categoriesRef.current) {
      categoriesRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleWhatsApp = () => {
    if (guideData.whatsapp) {
      handleWhatsAppTap(guideData.whatsapp);
    }
  };

  const handleInstagram = () => {
    if (guideData.instagram) {
      handleSocialTap('instagram', guideData.instagram);
    }
  };

  const vCardData = {
    firstName: guideData.name.split(' ')[0] || '',
    lastName: guideData.name.split(' ').slice(1).join(' ') || '',
    title: guideData.title,
    phone: guideData.phone,
    email: guideData.email,
    whatsapp: guideData.whatsapp,
    instagram: guideData.instagram
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Moucharabieh Background */}
      <MoucharabiehPattern />
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-900/10 via-transparent to-amber-900/5 pointer-events-none" />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-lg mx-auto px-4 py-8 space-y-8"
      >
        {/* Stories Section - Top Priority */}
        <motion.div variants={itemVariants} ref={storiesRef}>
          <StoriesSection
            cardId={cardId}
            ownerName={guideData.name}
            ownerPhoto={guideData.photoUrl}
            whatsappNumber={guideData.whatsapp}
            variant="premium"
          />
        </motion.div>
        {/* Header Section */}
        <motion.div variants={itemVariants} className="text-center space-y-6">
          {/* Photo */}
          <div className="relative inline-block">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 blur-xl opacity-30" />
            <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-amber-400/50 shadow-2xl">
              <img
                src={guideData.photoUrl || '/placeholder.svg'}
                alt={guideData.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 p-2 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg">
              <Award className="w-5 h-5 text-black" />
            </div>
          </div>

          {/* Name & Title */}
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
              {guideData.name}
            </h1>
            <p className="text-white/70 mt-1">{guideData.title}</p>
          </div>

          {/* Certification Badge */}
          <CertificationBadge certificationId={guideData.certificationId} />
        </motion.div>

        {/* Video Section (if available) */}
        {guideData.videoUrl && (
          <VideoPlayer 
            videoUrl={guideData.videoUrl} 
            posterUrl={guideData.videoPoster}
          />
        )}

        {/* Bons Plans Section */}
        <motion.div variants={itemVariants} ref={categoriesRef}>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
            <h2 className="text-lg font-bold text-amber-100">Bons Plans Exclusifs</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {guideData.categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onClick={() => setSelectedCategory(category)}
              />
            ))}
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
            <h2 className="text-lg font-bold text-amber-100">Contact Direct</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
          </div>

          {guideData.whatsapp && (
            <GoldGlassButton
              onClick={handleWhatsApp}
              icon={<MessageCircle className="w-5 h-5" />}
              variant="primary"
            >
              Contacter mon Guide
            </GoldGlassButton>
          )}

          {guideData.instagram && (
            <GoldGlassButton
              onClick={handleInstagram}
              icon={<Instagram className="w-5 h-5" />}
              variant="secondary"
            >
              Suivre les Aventures
            </GoldGlassButton>
          )}

          {/* VCard Download */}
          <div className="pt-4">
            <VCardGoldButton
              data={vCardData}
              label="Enregistrer le Contact"
              size="lg"
            />
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div 
          variants={itemVariants}
          className="pt-8 text-center"
        >
          <div className="inline-flex items-center gap-2 text-xs text-white/30">
            <Palmtree className="w-4 h-4" />
            <span>Powered by i-wasp • Marrakech</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Category Modal */}
      <AnimatePresence>
        {selectedCategory && (
          <RecommendationModal
            category={selectedCategory}
            onClose={() => setSelectedCategory(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MarrakechGuideEliteTemplate;
