/**
 * AlaseelLogo - Official Alaseel Coffee logo
 * Uses the real brand logo image
 */

import { motion } from 'framer-motion';
import alaseelLogo from '@/assets/alaseel-logo.jpeg';

interface AlaseelLogoProps {
  size?: 'sm' | 'md' | 'lg';
}

export function AlaseelLogo({ size = 'md' }: AlaseelLogoProps) {
  const sizeConfig = {
    sm: { container: 'w-20 h-20', image: 'w-16 h-16' },
    md: { container: 'w-28 h-28', image: 'w-24 h-24' },
    lg: { container: 'w-32 h-32', image: 'w-28 h-28' },
  };

  const config = sizeConfig[size];

  return (
    <motion.div
      className={`${config.container} rounded-full flex items-center justify-center relative overflow-hidden`}
      style={{
        background: '#F5E6D3',
        boxShadow: '0 10px 40px rgba(93, 64, 55, 0.3), 0 0 0 3px #5D4037, 0 0 0 6px rgba(93, 64, 55, 0.15)',
      }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <img
        src={alaseelLogo}
        alt="Alaseel Coffee - Tea"
        className={`${config.image} object-contain`}
      />
    </motion.div>
  );
}

export default AlaseelLogo;
