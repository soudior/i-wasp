/**
 * CoffeeSpiritCard - Ultra-premium digital vCard for Coffee Spirit
 * Modern premium coffee shop aesthetic - Marrakech
 */

import { motion } from 'framer-motion';
import { MapPin, Instagram, Star, Navigation, MessageSquare } from 'lucide-react';
import { CoffeeSpiritLogo } from './CoffeeSpiritLogo';
import { CoffeeSpiritOpeningStatus } from './CoffeeSpiritOpeningStatus';
import { CoffeeSpiritGallery } from './CoffeeSpiritGallery';
import { CoffeeSpiritMap } from './CoffeeSpiritMap';

// TikTok custom icon
const TikTokIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

// WhatsApp custom icon
const WhatsAppIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const actionButtons = [
  {
    id: 'whatsapp',
    icon: <WhatsAppIcon size={20} />,
    label: 'WhatsApp',
    url: 'https://wa.me/212600000000?text=Bonjour%20Coffee%20Spirit%20!',
    gradient: 'linear-gradient(145deg, #25D366 0%, #128C7E 100%)',
  },
  {
    id: 'directions',
    icon: <Navigation size={20} />,
    label: 'Itinéraire',
    url: 'https://maps.google.com/?q=Coffee+Spirit+Marrakech+Jnan+Awraad',
    gradient: 'linear-gradient(145deg, #4285F4 0%, #3367D6 100%)',
  },
  {
    id: 'review',
    icon: <Star size={20} />,
    label: 'Avis Google',
    url: 'https://search.google.com/local/writereview?placeid=ChIJxxxx', // Placeholder - needs real place ID
    gradient: 'linear-gradient(145deg, #FBBC04 0%, #F9A825 100%)',
  },
  {
    id: 'instagram',
    icon: <Instagram size={20} />,
    label: 'Instagram',
    url: 'https://www.instagram.com/spirit_coffee__shop',
    gradient: 'linear-gradient(145deg, #E1306C 0%, #C13584 40%, #833AB4 100%)',
  },
  {
    id: 'tiktok',
    icon: <TikTokIcon size={20} />,
    label: 'TikTok',
    url: 'https://www.tiktok.com/@MS4wLjABAAAAo6kTUxO_m_Jf0eqFJfQv7_4zQNT0xyql8uq0fNv5I52AgbvZYhHY-eCuooaPjcLD',
    gradient: 'linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%)',
  },
];

export function CoffeeSpiritCard() {
  const handleActionClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="min-h-[100dvh] flex flex-col overflow-x-hidden antialiased"
      style={{ 
        background: 'linear-gradient(180deg, #0D0A08 0%, #1A1512 50%, #0D0A08 100%)',
      }}
    >
      {/* Luxury Header */}
      <div
        className="relative pt-14 pb-32 px-6 overflow-hidden"
        style={{
          background: 'linear-gradient(175deg, #1A1512 0%, #0D0A08 50%, #050403 100%)',
        }}
      >
        {/* Coffee Bean Pattern */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cellipse cx='30' cy='30' rx='12' ry='18' stroke='%238B5A2B' stroke-width='0.5' fill='none' transform='rotate(45 30 30)'/%3E%3Cellipse cx='30' cy='30' rx='6' ry='12' stroke='%238B5A2B' stroke-width='0.3' fill='none' transform='rotate(45 30 30)'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }}
        />
        
        {/* Top Glow */}
        <div
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-[300px] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(139, 90, 43, 0.15) 0%, rgba(100, 60, 30, 0.05) 40%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />

        {/* Logo */}
        <motion.div
          className="flex justify-center relative z-10"
          initial={{ y: -20, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <CoffeeSpiritLogo size="lg" />
        </motion.div>

        {/* Brand Name */}
        <motion.div
          className="text-center mt-6 relative z-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h1
            className="text-[1.75rem] font-bold tracking-[-0.02em]"
            style={{ 
              color: '#FAF6F1',
              fontFamily: "'Playfair Display', serif",
              textShadow: '0 2px 20px rgba(0,0,0,0.3)',
            }}
          >
            Coffee Spirit
          </h1>
          <p
            className="text-[0.9rem] font-medium mt-1 tracking-wide"
            style={{ color: 'rgba(139, 90, 43, 0.9)' }}
          >
            Your daily coffee spirit
          </p>

          <motion.div
            className="flex items-center justify-center gap-2 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <MapPin size={13} strokeWidth={2} style={{ color: '#8B5A2B' }} />
            <span 
              className="text-[0.8rem] font-medium tracking-[0.05em] uppercase"
              style={{ color: 'rgba(139, 90, 43, 0.85)' }}
            >
              Marrakech, Jnan Awraad
            </span>
          </motion.div>

          {/* Google Rating */}
          <motion.div
            className="flex items-center justify-center gap-2 mt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
          >
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="#FBBC04" color="#FBBC04" />
              ))}
            </div>
            <span 
              className="text-[0.8rem] font-semibold"
              style={{ color: '#FAF6F1' }}
            >
              5.0
            </span>
            <span 
              className="text-[0.75rem]"
              style={{ color: 'rgba(250, 246, 241, 0.6)' }}
            >
              (157 avis)
            </span>
          </motion.div>

          {/* Opening Status */}
          <motion.div
            className="flex justify-center mt-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <CoffeeSpiritOpeningStatus />
          </motion.div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div
        className="flex-1 -mt-16 rounded-t-[2.5rem] px-5 pt-8 pb-12 relative z-10"
        style={{ 
          background: 'linear-gradient(180deg, #1A1512 0%, #0D0A08 100%)',
          boxShadow: '0 -20px 60px rgba(0, 0, 0, 0.5), 0 -4px 20px rgba(139, 90, 43, 0.1)',
        }}
      >
        {/* Decorative Handle */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
          <div className="w-6 h-0.5 rounded-full bg-gradient-to-r from-transparent via-[#8B5A2B]/40 to-transparent" />
          <div className="w-10 h-1 rounded-full bg-gradient-to-r from-[#8B5A2B]/30 via-[#8B5A2B]/50 to-[#8B5A2B]/30" />
          <div className="w-6 h-0.5 rounded-full bg-gradient-to-r from-transparent via-[#8B5A2B]/40 to-transparent" />
        </div>

        {/* Description */}
        <motion.p
          className="text-center text-[0.9rem] leading-relaxed mt-4 mb-8 px-2"
          style={{ 
            color: 'rgba(250, 246, 241, 0.7)',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Coffee Spirit est un coffee shop moderne à Marrakech, spécialisé dans le café de qualité et boissons artisanales, dans un cadre cosy et tendance.
        </motion.p>
        
        {/* Action Buttons */}
        <motion.div
          className="grid grid-cols-2 gap-3 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {actionButtons.map((action, index) => (
            <motion.button
              key={action.id}
              onClick={() => handleActionClick(action.url)}
              className="group flex flex-col items-center gap-2 py-4 px-3 rounded-2xl active:scale-95 transition-all duration-300"
              style={{
                background: action.gradient,
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
              }}
              whileHover={{ y: -2, boxShadow: '0 12px 28px rgba(0, 0, 0, 0.4)' }}
              whileTap={{ scale: 0.94 }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 + index * 0.08 }}
            >
              <span className="transition-transform duration-200 group-hover:scale-110" style={{ color: '#ffffff' }}>
                {action.icon}
              </span>
              <span
                className="text-[0.7rem] font-medium tracking-wider uppercase"
                style={{ color: 'rgba(255,255,255,0.9)' }}
              >
                {action.label}
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* Gallery Section */}
        <div className="mt-6">
          <CoffeeSpiritGallery />
        </div>

        {/* Map Section */}
        <div className="mt-8">
          <CoffeeSpiritMap />
        </div>

        {/* Info Section */}
        <motion.div
          className="mt-8 p-5 rounded-2xl"
          style={{
            background: 'linear-gradient(145deg, rgba(139, 90, 43, 0.1) 0%, rgba(100, 60, 30, 0.05) 100%)',
            border: '1px solid rgba(139, 90, 43, 0.2)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <h3 
            className="text-center font-semibold mb-4"
            style={{ 
              color: '#FAF6F1',
              fontFamily: "'Playfair Display', serif",
            }}
          >
            Informations
          </h3>
          
          <div className="space-y-3 text-[0.85rem]" style={{ color: 'rgba(250, 246, 241, 0.7)' }}>
            <div className="flex justify-between items-center">
              <span>📍 Localisation</span>
              <span className="font-medium" style={{ color: '#FAF6F1' }}>Jnan Awraad, Marrakech</span>
            </div>
            <div className="flex justify-between items-center">
              <span>🕐 Horaires</span>
              <span className="font-medium" style={{ color: '#FAF6F1' }}>Tous les jours jusqu'à 23h</span>
            </div>
            <div className="flex justify-between items-center">
              <span>💰 Prix</span>
              <span className="font-medium" style={{ color: '#FAF6F1' }}>1 - 50 MAD</span>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="text-center mt-10 pt-6"
          style={{ borderTop: '1px solid rgba(139, 90, 43, 0.1)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p
            className="text-[0.7rem] tracking-[0.1em] uppercase"
            style={{ color: 'rgba(250, 246, 241, 0.25)' }}
          >
            Powered by{' '}
            <a
              href="https://i-wasp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold transition-colors hover:opacity-80"
              style={{ color: 'rgba(250, 246, 241, 0.5)' }}
            >
              I-WASP
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default CoffeeSpiritCard;
