/**
 * Dark Luxury Business Template
 * Theme: Dark Luxury (#0B0B0B background, #F5F5F5 text, #FFC700 accent)
 * For premium businesses with geolocation and quick actions
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
  Navigation
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCardActionUrl, useIncrementCardView } from "@/hooks/usePublicCard";
import { IWASPBrandingFooter } from "@/components/IWASPBrandingFooter";

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
    social_links?: any[];
    blocks?: any[];
  };
}

export function DarkLuxuryBusinessTemplate({ card }: DarkLuxuryBusinessTemplateProps) {
  const getActionUrl = useCardActionUrl();
  const incrementView = useIncrementCardView();
  const [isNavigating, setIsNavigating] = useState(false);

  // Extract Google Reviews link from blocks or social_links
  const googleReviewsLink = card.blocks?.find((b: any) => b.type === 'google_reviews')?.url ||
    card.social_links?.find((l: any) => l.platform === 'google')?.url;

  // Extract coordinates from blocks
  const locationBlock = card.blocks?.find((b: any) => b.type === 'location');
  const coordinates = locationBlock?.coordinates;

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
          {(card.logo_url || card.photo_url) && (
            <div className="relative w-24 h-24 mx-auto mb-6">
              <img
                src={card.logo_url || card.photo_url || ''}
                alt={displayName}
                className="w-full h-full object-cover rounded-2xl border-2"
                style={{ borderColor: '#FFC700' }}
              />
            </div>
          )}

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

          {card.has_instagram && (
            <Button
              onClick={() => {
                const instagramUrl = card.social_links?.find((l: any) => l.platform === 'instagram')?.url;
                if (instagramUrl) window.open(instagramUrl, '_blank');
              }}
              className="h-14 rounded-xl font-medium border-2"
              style={{ 
                backgroundColor: 'transparent',
                borderColor: 'rgba(245, 245, 245, 0.3)',
                color: '#F5F5F5'
              }}
            >
              <Instagram size={18} className="mr-2" />
              Instagram
            </Button>
          )}
        </motion.div>

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
