/**
 * AlaseelCoffeeCard - Premium digital vCard for Alaseel Coffee - Tea
 * Marrakech café with warm coffee aesthetic
 */

import { motion } from 'framer-motion';
import { MapPin, Instagram, Facebook, MessageCircle } from 'lucide-react';
import { AlaseelLogo } from './AlaseelLogo';
import { AlaseelMenu } from './AlaseelMenu';

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
    gradient: 'linear-gradient(135deg, #E1306C 0%, #F77737 50%, #FCAF45 100%)',
  },
  {
    id: 'tiktok',
    icon: <TikTokIcon size={22} />,
    label: 'TikTok',
    url: 'https://www.tiktok.com/@moubtassim.1?_r=1&_t=ZS-93YhtWVzfLI',
    gradient: 'linear-gradient(135deg, #000000 0%, #25F4EE 50%, #FE2C55 100%)',
    bg: '#000000',
  },
  {
    id: 'facebook',
    icon: <Facebook size={22} />,
    label: 'Facebook',
    url: 'https://www.facebook.com/share/16vDaq23AA/',
    gradient: 'linear-gradient(135deg, #1877F2 0%, #3B5998 100%)',
  },
  {
    id: 'whatsapp',
    icon: <MessageCircle size={22} />,
    label: 'WhatsApp',
    url: 'https://wa.me/qr/DR5NBH6FOASAF1',
    gradient: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
  },
];

export function AlaseelCoffeeCard() {
  const handleSocialClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleMapClick = () => {
    window.open(
      'https://maps.google.com/?q=Alaseel+Coffee+Tea+Marrakech',
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div
      className="min-h-[100dvh] flex flex-col overflow-x-hidden"
      style={{ backgroundColor: '#FDF5E6' }}
    >
      {/* Header with Gradient and Pattern */}
      <div
        className="relative pt-10 pb-24 px-5"
        style={{
          background: 'linear-gradient(180deg, #3D2B1F 0%, #2A1F16 50%, #1A120D 100%)',
        }}
      >
        {/* Coffee Beans Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5c-3 0-5 4-5 10s2 10 5 10 5-4 5-10-2-10-5-10zm-15 20c-3 0-5 4-5 10s2 10 5 10 5-4 5-10-2-10-5-10zm30 0c-3 0-5 4-5 10s2 10 5 10 5-4 5-10-2-10-5-10z' fill='%23D97706' fill-opacity='0.4'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
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
          className="text-center mt-5 relative z-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h1
            className="font-serif text-[1.5rem] font-bold tracking-tight"
            style={{ color: '#FDF5E6' }}
          >
            Bienvenue chez Alaseel
          </h1>
          <motion.div
            className="flex items-center justify-center gap-1.5 mt-2"
            style={{ color: '#D97706' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <MapPin size={14} strokeWidth={2.5} />
            <span className="text-[0.8rem] font-medium tracking-wide">Marrakech, Maroc</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div
        className="flex-1 -mt-10 rounded-t-[2.5rem] px-5 pt-6 pb-10 relative z-10"
        style={{ 
          backgroundColor: '#FDF5E6',
          boxShadow: '0 -8px 30px rgba(61, 43, 31, 0.15)',
        }}
      >
        {/* Social Links */}
        <motion.div
          className="grid grid-cols-4 gap-2.5 mb-7"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {socialLinks.map((social, index) => (
            <motion.button
              key={social.id}
              onClick={() => handleSocialClick(social.url)}
              className="flex flex-col items-center gap-1.5 py-3.5 px-2 rounded-2xl active:scale-95 transition-transform"
              style={{
                background: social.bg || social.gradient,
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
              }}
              whileTap={{ scale: 0.92 }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 + index * 0.08 }}
            >
              <span style={{ color: '#ffffff' }}>{social.icon}</span>
              <span
                className="text-[0.65rem] font-semibold tracking-wide"
                style={{ color: 'rgba(255,255,255,0.95)' }}
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
            className="font-serif text-lg font-bold text-center mb-4 tracking-tight"
            style={{ color: '#3D2B1F' }}
          >
            Notre Menu
          </h2>
          <AlaseelMenu />
        </motion.div>

        {/* Map Button */}
        <motion.button
          onClick={handleMapClick}
          className="w-full mt-7 flex items-center justify-center gap-2.5 py-4 rounded-2xl active:scale-[0.98] transition-transform"
          style={{
            background: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '0.95rem',
            letterSpacing: '0.01em',
            boxShadow: '0 8px 30px rgba(217, 119, 6, 0.4)',
          }}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <MapPin size={18} strokeWidth={2.5} />
          Nous trouver sur la carte
        </motion.button>

        {/* Footer */}
        <motion.div
          className="text-center mt-8 pt-5"
          style={{ borderTop: '1px solid rgba(61, 43, 31, 0.08)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p
            className="text-[0.7rem] tracking-wide"
            style={{ color: 'rgba(61, 43, 31, 0.4)' }}
          >
            Powered by{' '}
            <a
              href="https://i-wasp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold"
              style={{ color: '#D97706' }}
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
