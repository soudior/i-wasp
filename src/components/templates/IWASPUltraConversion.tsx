/**
 * IWASP Ultra Conversion Template
 * Premium Mobile-First orienté "Action" et Lead Generation
 * 
 * FEATURES:
 * - Photo avec bordure dégradée animée
 * - Badge "Vérifié" 
 * - Formulaire de contact minimaliste
 * - Prise de RDV (Calendly-style)
 * - Portfolio/Galerie avec zoom
 * - Avis clients avec étoiles
 * - Design Bento Box
 * - Animations Framer Motion
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Download, 
  Globe, 
  Linkedin, 
  Instagram, 
  MessageCircle,
  MapPin,
  Mail,
  Phone,
  BadgeCheck,
  Calendar,
  Send,
  X,
  Star,
  ChevronRight,
  ExternalLink,
  Image as ImageIcon,
} from "lucide-react";
import { downloadVCard, VCardData } from "@/lib/vcard";
import { CardData, TemplateProps } from "./CardTemplates";
import { IWASPBrandBadgeMinimal } from "./IWASPBrandBadge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Accent color - customizable
const ACCENT_COLOR = "#D4AF37"; // Gold by default

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  },
};

// Bento Box Card Component
const BentoCard = ({ 
  children, 
  className = "",
  delay = 0,
}: { 
  children: React.ReactNode; 
  className?: string;
  delay?: number;
}) => (
  <motion.div
    className={`rounded-3xl p-5 ${className}`}
    style={{
      background: "rgba(255, 255, 255, 0.03)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(255, 255, 255, 0.06)",
    }}
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay: delay * 0.1, duration: 0.4 }}
    whileHover={{ 
      borderColor: `${ACCENT_COLOR}30`,
      transition: { duration: 0.2 }
    }}
  >
    {children}
  </motion.div>
);

// Social Link Button
const SocialButton = ({ 
  icon, 
  label, 
  href,
}: { 
  icon: React.ReactNode; 
  label: string; 
  href: string;
}) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300"
    style={{
      background: "rgba(255, 255, 255, 0.05)",
      border: "1px solid rgba(255, 255, 255, 0.08)",
    }}
    whileHover={{ 
      scale: 1.05,
      background: `${ACCENT_COLOR}20`,
      borderColor: `${ACCENT_COLOR}40`,
    }}
    whileTap={{ scale: 0.95 }}
    title={label}
  >
    {icon}
  </motion.a>
);

// Star Rating Component
const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        size={14}
        className={star <= rating ? "fill-[#D4AF37] text-[#D4AF37]" : "text-white/20"}
      />
    ))}
  </div>
);

// Review Card Component
const ReviewCard = ({ 
  name, 
  rating, 
  text, 
  date 
}: { 
  name: string; 
  rating: number; 
  text: string; 
  date: string;
}) => (
  <div 
    className="flex-shrink-0 w-72 p-4 rounded-2xl"
    style={{
      background: "rgba(255, 255, 255, 0.03)",
      border: "1px solid rgba(255, 255, 255, 0.06)",
    }}
  >
    <StarRating rating={rating} />
    <p className="text-sm text-white/70 mt-3 line-clamp-3">{text}</p>
    <div className="flex items-center justify-between mt-3">
      <span className="text-xs font-medium text-white/90">{name}</span>
      <span className="text-xs text-white/40">{date}</span>
    </div>
  </div>
);

// Portfolio Image with Zoom Modal
const PortfolioImage = ({ 
  src, 
  alt, 
  onClick 
}: { 
  src: string; 
  alt: string; 
  onClick: () => void;
}) => (
  <motion.button
    onClick={onClick}
    className="relative aspect-square rounded-2xl overflow-hidden group"
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <img src={src} alt={alt} className="w-full h-full object-cover" />
    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
      <ImageIcon size={24} className="text-white" />
    </div>
  </motion.button>
);

// Contact Form Component
const ContactForm = ({ onSubmit }: { onSubmit: (data: { name: string; email: string; subject: string }) => void }) => {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 800));
    onSubmit(formData);
    setFormData({ name: "", email: "", subject: "" });
    setIsSubmitting(false);
    toast.success("Demande envoyée avec succès !");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="relative">
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Votre nom"
          className="bg-white/5 border-white/10 text-white placeholder:text-white/40 h-12 rounded-xl focus:border-[#D4AF37]/50"
        />
      </div>
      <div className="relative">
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Votre email"
          className="bg-white/5 border-white/10 text-white placeholder:text-white/40 h-12 rounded-xl focus:border-[#D4AF37]/50"
        />
      </div>
      <div className="relative">
        <Textarea
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          placeholder="Objet de votre demande..."
          rows={3}
          className="bg-white/5 border-white/10 text-white placeholder:text-white/40 rounded-xl resize-none focus:border-[#D4AF37]/50"
        />
      </div>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-12 rounded-xl font-semibold text-sm"
        style={{
          background: `linear-gradient(135deg, ${ACCENT_COLOR} 0%, #B8962E 100%)`,
          color: "#0a0a0a",
        }}
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Envoi...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Send size={16} />
            Envoyer ma demande
          </span>
        )}
      </Button>
    </form>
  );
};

// Booking Modal Component
const BookingModal = ({ 
  isOpen, 
  onClose, 
  calendlyUrl 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  calendlyUrl?: string;
}) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div 
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          className="relative w-full max-w-md rounded-3xl overflow-hidden"
          style={{
            background: "#0a0a0a",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
        >
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h3 className="text-lg font-semibold text-white">Réserver un créneau</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X size={16} className="text-white" />
            </button>
          </div>
          <div className="p-6">
            {calendlyUrl ? (
              <iframe
                src={calendlyUrl}
                className="w-full h-96 rounded-xl"
                frameBorder="0"
              />
            ) : (
              <div className="text-center py-10">
                <Calendar size={48} className="mx-auto text-white/30 mb-4" />
                <p className="text-white/60 text-sm mb-4">
                  Sélectionnez un créneau qui vous convient
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {["Lun 10h", "Mar 14h", "Mer 9h", "Jeu 16h"].map((slot) => (
                    <button
                      key={slot}
                      onClick={() => {
                        toast.success(`Créneau "${slot}" sélectionné !`);
                        onClose();
                      }}
                      className="py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-white/80 text-sm hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/10 transition-all"
                    >
                      {slot}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-white/40 mt-4">
                  ⚡ Réponse garantie sous 24h
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// Image Zoom Modal
const ImageModal = ({ 
  isOpen, 
  onClose, 
  imageSrc, 
  imageAlt 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  imageSrc: string;
  imageAlt: string;
}) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/90" />
        <motion.img
          src={imageSrc}
          alt={imageAlt}
          className="relative max-w-full max-h-[80vh] rounded-2xl object-contain"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
        />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <X size={20} className="text-white" />
        </button>
      </motion.div>
    )}
  </AnimatePresence>
);

// Demo data
const demoReviews = [
  { name: "Marie L.", rating: 5, text: "Professionnalisme remarquable. Une vraie différence dans ma prospection !", date: "Il y a 2j" },
  { name: "Thomas B.", rating: 5, text: "La carte NFC a impressionné tous mes clients. Excellent investissement.", date: "Il y a 1 sem" },
  { name: "Sophie M.", rating: 4, text: "Design élégant et service impeccable. Je recommande vivement.", date: "Il y a 2 sem" },
];

const demoPortfolio = [
  "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=400&fit=crop",
];

export function IWASPUltraConversion({ 
  data, 
  showWalletButtons = true,
  onShareInfo,
}: TemplateProps) {
  const [showBooking, setShowBooking] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  
  const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim();
  const initials = `${data.firstName?.charAt(0) || ''}${data.lastName?.charAt(0) || ''}`;
  
  const handleDownloadVCard = () => {
    const vcardData: VCardData = {
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      title: data.title,
      company: data.company,
      email: data.email,
      phone: data.phone,
    };
    downloadVCard(vcardData);
  };

  const handleContactSubmit = (formData: { name: string; email: string; subject: string }) => {
    console.log("Contact form submitted:", formData);
    // Here you would typically send to your backend/Supabase
  };

  const getLinkedInUrl = () => {
    if (!data.linkedin) return "";
    if (data.linkedin.startsWith("http")) return data.linkedin;
    return `https://linkedin.com/in/${data.linkedin}`;
  };

  const getInstagramUrl = () => {
    if (!data.instagram) return "";
    const handle = data.instagram.replace("@", "");
    return `https://instagram.com/${handle}`;
  };

  const getWebsiteUrl = () => {
    if (!data.website) return "";
    if (data.website.startsWith("http")) return data.website;
    return `https://${data.website}`;
  };

  const getWhatsAppUrl = () => {
    if (!data.phone) return "";
    const number = (data.phone || "").replace(/\D/g, "");
    return `https://wa.me/${number}`;
  };

  return (
    <div 
      className="min-h-screen px-4 py-8 pb-safe"
      style={{ 
        backgroundColor: "#050505",
        color: "#ffffff",
      }}
    >
      {/* Background ambient glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        <div 
          className="absolute"
          style={{
            top: "-15%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "600px",
            height: "600px",
            background: `radial-gradient(circle, ${ACCENT_COLOR}08 0%, transparent 60%)`,
            filter: "blur(80px)",
          }}
        />
      </div>

      {/* Main Container - Mobile First Bento Layout */}
      <motion.div 
        className="w-full max-w-md mx-auto relative space-y-4"
        style={{ zIndex: 10 }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Identity Card - Hero */}
        <BentoCard delay={0} className="relative overflow-hidden">
          {/* IWASP Badge */}
          <div className="absolute top-4 right-4">
            <IWASPBrandBadgeMinimal variant="dark" />
          </div>

          <div className="flex flex-col items-center text-center pt-2 pb-4">
            {/* Profile Photo with Animated Gradient Border */}
            <motion.div 
              className="relative mb-5"
              animate={{ 
                boxShadow: [
                  `0 0 20px ${ACCENT_COLOR}20`,
                  `0 0 40px ${ACCENT_COLOR}30`,
                  `0 0 20px ${ACCENT_COLOR}20`,
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ borderRadius: "50%" }}
            >
              <div 
                className="w-28 h-28 rounded-full p-[3px]"
                style={{
                  background: `linear-gradient(135deg, ${ACCENT_COLOR}, #B8962E, ${ACCENT_COLOR})`,
                  backgroundSize: "200% 200%",
                  animation: "gradientShift 3s ease infinite",
                }}
              >
                <div className="w-full h-full rounded-full overflow-hidden bg-[#0a0a0a]">
                  {data.photoUrl ? (
                    <img 
                      src={data.photoUrl} 
                      alt={fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-2xl font-semibold" style={{ color: ACCENT_COLOR }}>
                        {initials}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Name with Verified Badge */}
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold tracking-tight">{fullName}</h1>
              <BadgeCheck size={20} className="text-[#D4AF37]" />
            </div>
            
            {/* Title & Company */}
            {data.title && (
              <p className="text-sm font-medium" style={{ color: ACCENT_COLOR }}>
                {data.title}
              </p>
            )}
            {data.company && (
              <p className="text-sm text-white/50">{data.company}</p>
            )}

            {/* Location */}
            {data.location && (
              <div className="flex items-center gap-1.5 mt-2 text-xs text-white/40">
                <MapPin size={12} />
                <span>{data.location}</span>
              </div>
            )}

            {/* Social Links Row */}
            <div className="flex items-center gap-2 mt-5">
              {data.linkedin && (
                <SocialButton
                  icon={<Linkedin size={18} className="text-[#D4AF37]" />}
                  label="LinkedIn"
                  href={getLinkedInUrl()}
                />
              )}
              {data.phone && (
                <SocialButton
                  icon={<MessageCircle size={18} className="text-[#D4AF37]" />}
                  label="WhatsApp"
                  href={getWhatsAppUrl()}
                />
              )}
              {data.instagram && (
                <SocialButton
                  icon={<Instagram size={18} className="text-[#D4AF37]" />}
                  label="Instagram"
                  href={getInstagramUrl()}
                />
              )}
              {data.website && (
                <SocialButton
                  icon={<Globe size={18} className="text-[#D4AF37]" />}
                  label="Site Web"
                  href={getWebsiteUrl()}
                />
              )}
            </div>
          </div>
        </BentoCard>

        {/* CTA Buttons Row */}
        <div className="grid grid-cols-2 gap-3">
          {/* Add to Contacts - Pulsing */}
          <motion.button
            onClick={handleDownloadVCard}
            className="relative py-4 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${ACCENT_COLOR} 0%, #B8962E 100%)`,
              color: "#0a0a0a",
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className="absolute inset-0"
              style={{ background: "rgba(255,255,255,0.2)" }}
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <Download size={18} />
            Ajouter
          </motion.button>

          {/* Book Appointment */}
          <motion.button
            onClick={() => setShowBooking(true)}
            className="py-4 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: `1px solid ${ACCENT_COLOR}30`,
              color: ACCENT_COLOR,
            }}
            whileHover={{ 
              scale: 1.02,
              background: `${ACCENT_COLOR}15`,
            }}
            whileTap={{ scale: 0.98 }}
          >
            <Calendar size={18} />
            RDV
          </motion.button>
        </div>

        {/* Contact Form Card */}
        <BentoCard delay={2}>
          <h3 className="text-sm font-semibold text-white/90 mb-4 flex items-center gap-2">
            <Mail size={16} className="text-[#D4AF37]" />
            Envoyer une demande
          </h3>
          <ContactForm onSubmit={handleContactSubmit} />
        </BentoCard>

        {/* Portfolio Section */}
        <BentoCard delay={3}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white/90">Réalisations</h3>
            <button className="text-xs text-[#D4AF37] flex items-center gap-1">
              Voir tout <ChevronRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {demoPortfolio.map((img, i) => (
              <PortfolioImage
                key={i}
                src={img}
                alt={`Réalisation ${i + 1}`}
                onClick={() => setZoomedImage(img)}
              />
            ))}
          </div>
        </BentoCard>

        {/* Reviews Section */}
        <BentoCard delay={4}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white/90 flex items-center gap-2">
              <Star size={16} className="text-[#D4AF37]" />
              Avis clients
            </h3>
            <div className="flex items-center gap-1">
              <StarRating rating={5} />
              <span className="text-xs text-white/50 ml-1">4.9</span>
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
            {demoReviews.map((review, i) => (
              <ReviewCard key={i} {...review} />
            ))}
          </div>
        </BentoCard>

        {/* Footer */}
        <motion.div 
          className="text-center pt-4 pb-2"
          variants={itemVariants}
        >
          <p 
            className="text-[10px] uppercase tracking-[0.2em]"
            style={{ color: "rgba(255, 255, 255, 0.25)" }}
          >
            Powered by IWASP
          </p>
        </motion.div>
      </motion.div>

      {/* Modals */}
      <BookingModal
        isOpen={showBooking}
        onClose={() => setShowBooking(false)}
      />
      <ImageModal
        isOpen={!!zoomedImage}
        onClose={() => setZoomedImage(null)}
        imageSrc={zoomedImage || ""}
        imageAlt="Réalisation"
      />

      {/* CSS for gradient animation */}
      <style>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

export default IWASPUltraConversion;
