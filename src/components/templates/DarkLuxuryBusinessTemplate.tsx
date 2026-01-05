/**
 * Dark Luxury Business Template
 * Theme: Dark Luxury (#0B0B0B background, #F5F5F5 text, #FFC700 accent)
 * For premium businesses with geolocation, gallery, stories and all social networks
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Phone, 
  MessageCircle, 
  MapPin, 
  Globe, 
  Instagram,
  ExternalLink,
  Star,
  Navigation,
  Linkedin,
  Twitter,
  Facebook,
  Youtube,
  Music2,
  Mail,
  ChevronLeft,
  ChevronRight,
  UserPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCardActionUrl, useIncrementCardView } from "@/hooks/usePublicCard";
import { IWASPBrandingFooter } from "@/components/IWASPBrandingFooter";
import { downloadVCard, VCardData } from "@/lib/vcard";
import { StoryRing } from "@/components/StoryRing";
import { usePublicStory } from "@/hooks/useStories";

interface DarkLuxuryBusinessTemplateProps {
  card: {
    id: string;
    slug: string;
    first_name: string;
    last_name: string;
    title?: string | null;
    company?: string | null;
    location?: string | null;
    website?: string | null;
    tagline?: string | null;
    photo_url?: string | null;
    logo_url?: string | null;
    has_phone?: boolean;
    has_whatsapp?: boolean;
    has_email?: boolean;
    has_instagram?: boolean;
    has_linkedin?: boolean;
    has_twitter?: boolean;
    social_links?: any[];
    blocks?: any[];
  };
}

// Social network icon mapping
const SOCIAL_ICONS: Record<string, any> = {
  instagram: Instagram,
  facebook: Facebook,
  linkedin: Linkedin,
  twitter: Twitter,
  youtube: Youtube,
  tiktok: Music2,
  threads: MessageCircle,
  telegram: MessageCircle,
  spotify: Music2,
  email: Mail,
};

export function DarkLuxuryBusinessTemplate({ card }: DarkLuxuryBusinessTemplateProps) {
  const getActionUrl = useCardActionUrl();
  const incrementView = useIncrementCardView();
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Fetch active story for this card
  const { story } = usePublicStory(card.id);

  // Extract Google Reviews link from blocks or social_links
  const googleReviewsLink = card.blocks?.find((b: any) => b.type === 'google_reviews')?.url ||
    card.social_links?.find((l: any) => l.platform === 'google')?.url;

  // Extract coordinates from blocks
  const locationBlock = card.blocks?.find((b: any) => b.type === 'location');
  const coordinates = locationBlock?.coordinates;

  // Extract gallery from blocks
  const galleryBlock = card.blocks?.find((b: any) => b.type === 'gallery');
  const galleryImages: string[] = galleryBlock?.images || [];

  // Get all social links
  const socialLinks = card.social_links?.filter((l: any) => l.url && l.platform !== 'google') || [];
  
  // Get WhatsApp number for story reply
  const whatsappLink = card.social_links?.find((l: any) => l.platform === 'whatsapp')?.url;

  const handleAction = async (action: "phone" | "whatsapp" | "email") => {
    const url = await getActionUrl(card.slug, action);
    if (url) {
      window.location.href = url;
    }
  };

  const handleOpenMaps = () => {
    setIsNavigating(true);
    if (coordinates?.lat && coordinates?.lng) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`, '_blank');
    } else if (card.location) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(card.location)}`, '_blank');
    }
    setTimeout(() => setIsNavigating(false), 1000);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const handleDownloadVCard = () => {
    // Get social link by platform
    const getSocialLink = (platform: string) => {
      return socialLinks.find((l: any) => l.platform === platform)?.url || '';
    };

    const vCardData: VCardData = {
      firstName: card.first_name,
      lastName: card.last_name,
      title: card.title || undefined,
      company: card.company || undefined,
      website: card.website || undefined,
      photoUrl: card.photo_url || card.logo_url || undefined,
      nfcPageUrl: `${window.location.origin}/card/${card.slug}`,
      address: card.location || undefined,
      // Social networks
      instagram: getSocialLink('instagram') || undefined,
      linkedin: getSocialLink('linkedin') || undefined,
      twitter: getSocialLink('twitter') || undefined,
      facebook: getSocialLink('facebook') || undefined,
      youtube: getSocialLink('youtube') || undefined,
      tiktok: getSocialLink('tiktok') || undefined,
      telegram: getSocialLink('telegram') || undefined,
      // Note with location
      note: card.tagline || undefined,
    };

    downloadVCard(vCardData);
  };

  const displayName = card.company || `${card.first_name} ${card.last_name}`;

  return (
    <div 
      className="min-h-dvh w-full"
      style={{ backgroundColor: '#0B0B0B' }}
    >
      <div className="max-w-md mx-auto px-4 py-8 pb-24">
        {/* Header with Logo or Photo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          {/* Photo with Story Ring */}
          <div className="flex justify-center mb-6">
            <StoryRing
              photoUrl={card.photo_url || card.logo_url || undefined}
              firstName={card.first_name}
              lastName={card.last_name}
              story={story}
              whatsappNumber={whatsappLink}
              size="lg"
              className="border-2 rounded-full"
            />
          </div>

          <h1 
            className="text-2xl font-bold tracking-tight mb-2"
            style={{ color: '#F5F5F5' }}
          >
            {displayName}
          </h1>
          
          {card.title && (
            <p 
              className="text-sm font-medium mb-3"
              style={{ color: '#FFC700' }}
            >
              {card.title}
            </p>
          )}

          {card.location && (
            <div 
              className="flex items-center justify-center gap-1.5 text-sm"
              style={{ color: 'rgba(245, 245, 245, 0.6)' }}
            >
              <MapPin size={14} />
              <span>{card.location}</span>
            </div>
          )}
        </motion.div>

        {/* Quick Actions Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-3 mb-6"
        >
          {card.has_phone && (
            <Button
              onClick={() => handleAction('phone')}
              className="h-14 rounded-xl font-medium text-black"
              style={{ backgroundColor: '#FFC700' }}
            >
              <Phone size={18} className="mr-2" />
              Appeler
            </Button>
          )}

          {card.has_whatsapp && (
            <Button
              onClick={() => handleAction('whatsapp')}
              className="h-14 rounded-xl font-medium border-2"
              style={{ 
                backgroundColor: 'transparent',
                borderColor: '#FFC700',
                color: '#FFC700'
              }}
            >
              <MessageCircle size={18} className="mr-2" />
              WhatsApp
            </Button>
          )}

          {card.location && (
            <Button
              onClick={handleOpenMaps}
              disabled={isNavigating}
              className="h-14 rounded-xl font-medium border-2 col-span-2"
              style={{ 
                backgroundColor: 'transparent',
                borderColor: 'rgba(245, 245, 245, 0.3)',
                color: '#F5F5F5'
              }}
            >
              <Navigation size={18} className="mr-2" />
              {isNavigating ? 'Ouverture...' : 'Itinéraire Google Maps'}
            </Button>
          )}

          {card.website && (
            <Button
              onClick={() => window.open(card.website!, '_blank')}
              className="h-14 rounded-xl font-medium border-2"
              style={{ 
                backgroundColor: 'transparent',
                borderColor: 'rgba(245, 245, 245, 0.3)',
                color: '#F5F5F5'
              }}
            >
              <Globe size={18} className="mr-2" />
              Site Web
            </Button>
          )}

          {card.has_email && (
            <Button
              onClick={() => handleAction('email')}
              className="h-14 rounded-xl font-medium border-2"
              style={{ 
                backgroundColor: 'transparent',
                borderColor: 'rgba(245, 245, 245, 0.3)',
                color: '#F5F5F5'
              }}
            >
              <Mail size={18} className="mr-2" />
              Email
            </Button>
          )}

          {/* Add to Contacts Button */}
          <Button
            onClick={handleDownloadVCard}
            className="h-14 rounded-xl font-medium col-span-2"
            style={{ 
              backgroundColor: 'rgba(34, 197, 94, 0.15)',
              color: '#22C55E',
              border: '2px solid rgba(34, 197, 94, 0.3)'
            }}
          >
            <UserPlus size={18} className="mr-2" />
            Ajouter aux contacts
          </Button>
        </motion.div>

        {/* All Social Networks */}
        {socialLinks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-6"
          >
            <p 
              className="text-xs font-medium mb-3 text-center"
              style={{ color: 'rgba(245, 245, 245, 0.5)' }}
            >
              Réseaux sociaux
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {socialLinks.map((link: any, index: number) => {
                const Icon = SOCIAL_ICONS[link.platform] || Globe;
                return (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.open(link.url, '_blank')}
                    className="w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-colors hover:border-[#FFC700]"
                    style={{ 
                      backgroundColor: 'rgba(255, 199, 0, 0.1)',
                      borderColor: 'rgba(255, 199, 0, 0.3)',
                      color: '#FFC700'
                    }}
                  >
                    <Icon size={20} />
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Description */}
        {card.tagline && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl p-5 mb-6"
            style={{ backgroundColor: 'rgba(255, 199, 0, 0.08)' }}
          >
            <p 
              className="text-sm leading-relaxed"
              style={{ color: 'rgba(245, 245, 245, 0.85)' }}
            >
              {card.tagline}
            </p>
          </motion.div>
        )}

        {/* Image Gallery */}
        {galleryImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mb-6"
          >
            <p 
              className="text-xs font-medium mb-3 text-center"
              style={{ color: 'rgba(245, 245, 245, 0.5)' }}
            >
              Galerie
            </p>
            
            {/* Main Image */}
            <div className="relative rounded-xl overflow-hidden mb-3">
              <img
                src={galleryImages[currentImageIndex]}
                alt={`Gallery ${currentImageIndex + 1}`}
                className="w-full aspect-video object-cover"
              />
              
              {galleryImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                  >
                    <ChevronLeft size={24} style={{ color: '#F5F5F5' }} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                  >
                    <ChevronRight size={24} style={{ color: '#F5F5F5' }} />
                  </button>
                  
                  {/* Dots indicator */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {galleryImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className="w-2 h-2 rounded-full transition-all"
                        style={{ 
                          backgroundColor: idx === currentImageIndex ? '#FFC700' : 'rgba(245, 245, 245, 0.4)',
                          transform: idx === currentImageIndex ? 'scale(1.2)' : 'scale(1)'
                        }}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {galleryImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all"
                    style={{ 
                      borderColor: idx === currentImageIndex ? '#FFC700' : 'transparent',
                      opacity: idx === currentImageIndex ? 1 : 0.6
                    }}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Google Reviews Link */}
        {googleReviewsLink && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              onClick={() => window.open(googleReviewsLink, '_blank')}
              className="w-full h-14 rounded-xl font-medium mb-6"
              style={{ 
                backgroundColor: 'rgba(255, 199, 0, 0.15)',
                color: '#FFC700'
              }}
            >
              <Star size={18} className="mr-2" />
              Voir les Avis Google
              <ExternalLink size={14} className="ml-2" />
            </Button>
          </motion.div>
        )}

        {/* Interactive Map Placeholder */}
        {card.location && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-xl overflow-hidden mb-6 cursor-pointer"
            onClick={handleOpenMaps}
            style={{ backgroundColor: 'rgba(245, 245, 245, 0.05)' }}
          >
            <div className="aspect-video flex items-center justify-center">
              <div className="text-center p-6">
                <div 
                  className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(255, 199, 0, 0.2)' }}
                >
                  <MapPin size={28} style={{ color: '#FFC700' }} />
                </div>
                <p 
                  className="font-medium mb-1"
                  style={{ color: '#F5F5F5' }}
                >
                  {card.location}
                </p>
                <p 
                  className="text-xs"
                  style={{ color: 'rgba(245, 245, 245, 0.5)' }}
                >
                  Appuyez pour ouvrir dans Google Maps
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Status Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mb-8"
        >
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium"
            style={{ 
              backgroundColor: 'rgba(255, 199, 0, 0.1)',
              color: '#FFC700'
            }}
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Carte digitale active
          </div>
        </motion.div>

        {/* IWASP Branding */}
        <IWASPBrandingFooter variant="dark" />
      </div>
    </div>
  );
}

export default DarkLuxuryBusinessTemplate;
