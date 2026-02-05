/**
 * AlaseelCoffeeCard - Ultra-premium digital vCard for Alaseel Coffee - Tea
 * Modern chic Marrakech café aesthetic with glassmorphism
 */

import { motion } from 'framer-motion';
import { MapPin, Instagram, Facebook, MessageCircle } from 'lucide-react';
import { AlaseelLogo } from './AlaseelLogo';
import { AlaseelMenu } from './AlaseelMenu';
import { AlaseelOpeningStatus } from './AlaseelOpeningStatus';
import { AlaseelGallery } from './AlaseelGallery';

// TikTok custom icon (not in lucide)
const TikTokIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

const socialLinks = [
  {
    id: 'instagram',
    icon: <Instagram size={22} />,
    label: 'Instagram',
    url: 'https://www.instagram.com/ismail_moubtassim01?igsh=eWVoem16MXJmbGsz',
    gradient: 'linear-gradient(145deg, #E1306C 0%, #C13584 40%, #833AB4 100%)',
  },
  {
    id: 'tiktok',
    icon: <TikTokIcon size={22} />,
    label: 'TikTok',
    url: 'https://www.tiktok.com/@moubtassim.1?_r=1&_t=ZS-93YhtWVzfLI',
    gradient: 'linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%)',
  },
  {
    id: 'facebook',
    icon: <Facebook size={22} />,
    label: 'Facebook',
    url: 'https://www.facebook.com/share/16vDaq23AA/',
    gradient: 'linear-gradient(145deg, #1877F2 0%, #0D65D9 100%)',
  },
  {
    id: 'whatsapp',
    icon: <MessageCircle size={22} />,
    label: 'WhatsApp',
    url: 'https://wa.me/qr/DR5NBH6FOASAF1',
    gradient: 'linear-gradient(145deg, #25D366 0%, #1DA851 100%)',
  },
];

export function AlaseelCoffeeCard() {
  const handleSocialClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleMapClick = () => {
    window.open(
      'https://maps.app.goo.gl/c22RmQiNSL1K7w4z7',
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div
      className="min-h-[100dvh] flex flex-col overflow-x-hidden antialiased"
      style={{ 
        background: 'linear-gradient(180deg, #FAF6F1 0%, #F5EDE4 50%, #EDE4D8 100%)',
      }}
    >
      {/* Header with Gradient and Pattern */}
      <div
        className="relative pt-12 pb-28 px-6"
        style={{
          background: 'linear-gradient(175deg, #4A3728 0%, #3D2C22 40%, #2E211A 100%)',
        }}
      >
        {/* Elegant Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='40' cy='40' r='30' stroke='%23D4A574' stroke-width='0.5' fill='none'/%3E%3Ccircle cx='40' cy='40' r='20' stroke='%23D4A574' stroke-width='0.3' fill='none'/%3E%3C/svg%3E")`,
            backgroundSize: '80px 80px',
          }}
        />
        
        {/* Top Glow Effect */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[200px] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(212, 165, 116, 0.15) 0%, transparent 70%)',
          }}
        />

        {/* Logo */}
        <motion.div
          className="flex justify-center relative z-10"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <AlaseelLogo size="lg" />
        </motion.div>

        {/* Welcome Text */}
        <motion.div
          className="text-center mt-6 relative z-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h1
            className="text-[1.65rem] font-semibold tracking-[-0.02em]"
            style={{ 
              color: '#FAF6F1',
              fontFamily: "'Playfair Display', serif",
              textShadow: '0 2px 20px rgba(0,0,0,0.3)',
            }}
          >
            Bienvenue chez Alaseel
          </h1>
          <motion.div
            className="flex items-center justify-center gap-2 mt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <MapPin size={13} strokeWidth={2} style={{ color: '#D4A574' }} />
            <span 
              className="text-[0.8rem] font-medium tracking-[0.05em] uppercase"
              style={{ color: 'rgba(212, 165, 116, 0.85)' }}
            >
              Marrakech, Maroc
            </span>
          </motion.div>

          {/* Opening Status Badge */}
          <motion.div
            className="flex justify-center mt-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <AlaseelOpeningStatus />
          </motion.div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div
        className="flex-1 -mt-14 rounded-t-[2.5rem] px-5 pt-7 pb-12 relative z-10"
        style={{ 
          background: 'linear-gradient(180deg, #FAF6F1 0%, #F5EDE4 100%)',
          boxShadow: '0 -12px 40px rgba(62, 44, 34, 0.12)',
        }}
      >
        {/* Decorative line */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-[#D4A574]/30" />
        
        {/* Social Links */}
        <motion.div
          className="grid grid-cols-4 gap-3 mt-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {socialLinks.map((social, index) => (
            <motion.button
              key={social.id}
              onClick={() => handleSocialClick(social.url)}
              className="group flex flex-col items-center gap-2 py-4 px-2 rounded-2xl active:scale-95 transition-all duration-300"
              style={{
                background: social.gradient,
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
              }}
              whileHover={{ y: -2, boxShadow: '0 12px 28px rgba(0, 0, 0, 0.2)' }}
              whileTap={{ scale: 0.94 }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 + index * 0.08 }}
            >
              <span className="transition-transform duration-200 group-hover:scale-110" style={{ color: '#ffffff' }}>
                {social.icon}
              </span>
              <span
                className="text-[0.6rem] font-medium tracking-wider uppercase"
                style={{ color: 'rgba(255,255,255,0.9)' }}
              >
                {social.label}
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* Menu Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <h2
            className="text-lg font-semibold text-center mb-5 tracking-[-0.01em]"
            style={{ 
              color: '#3D2C22',
              fontFamily: "'Playfair Display', serif",
            }}
          >
            Notre Menu
          </h2>
          <AlaseelMenu />
        </motion.div>

        {/* Gallery Section */}
        <div className="mt-8">
          <AlaseelGallery />
        </div>

        {/* Map Button */}
        <motion.button
          onClick={handleMapClick}
          className="w-full mt-8 flex items-center justify-center gap-3 py-4 rounded-2xl active:scale-[0.98] transition-all duration-300 group"
          style={{
            background: 'linear-gradient(145deg, #4A3728 0%, #3D2C22 100%)',
            boxShadow: '0 10px 35px rgba(61, 44, 34, 0.3), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
          whileHover={{ boxShadow: '0 14px 40px rgba(61, 44, 34, 0.35)' }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <MapPin size={18} strokeWidth={2} className="transition-transform group-hover:-translate-y-0.5" style={{ color: '#D4A574' }} />
          <span
            className="font-medium tracking-wide"
            style={{ 
              color: '#FAF6F1',
              fontSize: '0.95rem',
            }}
          >
            Nous trouver sur la carte
          </span>
        </motion.button>

        {/* Footer */}
        <motion.div
          className="text-center mt-10 pt-6"
          style={{ borderTop: '1px solid rgba(61, 44, 34, 0.06)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p
            className="text-[0.7rem] tracking-[0.1em] uppercase"
            style={{ color: 'rgba(61, 44, 34, 0.35)' }}
          >
            Powered by{' '}
            <a
              href="https://i-wasp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold transition-colors hover:opacity-80"
              style={{ color: '#3D2C22' }}
            >
              I-WASP
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default AlaseelCoffeeCard;
