/**
 * CoffeeSpiritMap - Interactive Google Maps section
 * Premium dark aesthetic with glassmorphism
 */

import { motion } from 'framer-motion';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';

// Coffee Spirit - Jnan Awraad, Marrakech (Approximate coordinates: 31.6475, -8.0150)
const GOOGLE_MAPS_EMBED_URL = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3396.5!2d-8.015!3d31.6475!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDM4JzUxLjAiTiA4wrAwMCc1NC4wIlc!5e0!3m2!1sfr!2sma!4v1699000000000!5m2!1sfr!2sma";
const GOOGLE_MAPS_URL = "https://www.google.com/maps/search/Coffee+Spirit+Jnan+Awraad+Marrakech/@31.6475,-8.015,16z";
const GOOGLE_MAPS_DIRECTIONS_URL = "https://www.google.com/maps/dir/?api=1&destination=31.6475,-8.015&destination_place_id=Coffee+Spirit+Jnan+Awraad+Marrakech";

export function CoffeeSpiritMap() {
  const handleDirectionsClick = () => {
    window.open(GOOGLE_MAPS_DIRECTIONS_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="w-full"
    >
      {/* Section Header */}
      <div className="flex-safe items-center-safe justify-center-safe gap-2.5 mb-5">
        <MapPin size={17} strokeWidth={2} style={{ color: '#C9A66B' }} />
        <h2
          className="text-lg font-semibold tracking-[-0.01em]"
          style={{ 
            color: '#FAF6F1',
            fontFamily: "'Playfair Display', serif",
          }}
        >
          Notre Localisation
        </h2>
      </div>

      {/* Map Container */}
      <div
        className="relative rounded-[1.75rem] overflow-hidden"
        style={{
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4), 0 8px 20px rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(201, 166, 107, 0.15)',
        }}
      >
        {/* Map Iframe */}
        <div style={{ aspectRatio: '4/3', width: '100%' }}>
          <iframe
            src={GOOGLE_MAPS_EMBED_URL}
            width="100%"
            height="100%"
            style={{ 
              border: 0,
              filter: 'grayscale(30%) contrast(1.1)',
              WebkitFilter: 'grayscale(30%) contrast(1.1)',
            }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Coffee Spirit Location"
          />
        </div>

        {/* Overlay Gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(10, 8, 6, 0.6) 0%, transparent 30%, transparent 70%, rgba(10, 8, 6, 0.3) 100%)',
          }}
        />

        {/* Location Info Card */}
        <motion.div
          className="absolute bottom-4 left-4 right-4 p-4 rounded-xl backdrop-blur-safe"
          style={{
            background: 'rgba(26, 20, 18, 0.9)',
            border: '1px solid rgba(201, 166, 107, 0.2)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
            WebkitBackdropFilter: 'blur(12px)',
            backdropFilter: 'blur(12px)',
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex-safe items-start gap-3" style={{ justifyContent: 'space-between' }}>
            <div style={{ flex: 1 }}>
              <h3
                className="text-[0.95rem] font-semibold mb-1"
                style={{ 
                  color: '#FAF6F1',
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                Coffee Spirit
              </h3>
              <p
                className="text-[0.75rem]"
                style={{ color: 'rgba(250, 246, 241, 0.6)' }}
              >
                Jnan Awraad, Marrakech 40000
              </p>
            </div>
            
            {/* Directions Button */}
            <motion.button
              onClick={handleDirectionsClick}
              className="vcard-button flex-safe items-center-safe gap-2 px-4 py-2.5 rounded-xl active:scale-95"
              style={{
                background: 'linear-gradient(145deg, #4285F4 0%, #3367D6 100%)',
                boxShadow: '0 4px 12px rgba(66, 133, 244, 0.3)',
                WebkitTransform: 'translateZ(0)',
                transform: 'translateZ(0)',
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Navigation size={16} style={{ color: '#ffffff' }} />
              <span
                className="text-[0.7rem] font-semibold uppercase tracking-wider"
                style={{ color: '#ffffff' }}
              >
                Y aller
              </span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Open in Maps Link */}
      <motion.a
        href={GOOGLE_MAPS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-safe items-center-safe justify-center-safe gap-2 mt-4 py-2 vcard-button"
        style={{ opacity: 0.9 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <span
          className="text-[0.75rem] font-medium"
          style={{ color: 'rgba(201, 166, 107, 0.7)' }}
        >
          Ouvrir dans Google Maps
        </span>
        <ExternalLink size={12} style={{ color: 'rgba(201, 166, 107, 0.7)' }} />
      </motion.a>
    </motion.div>
  );
}

export default CoffeeSpiritMap;
