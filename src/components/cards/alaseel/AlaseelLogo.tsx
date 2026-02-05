/**
  * AlaseelLogo - Premium Alaseel Coffee logo with glow effect
  * Modern chic design with subtle animations
 */

import { motion } from 'framer-motion';
import alaseelLogo from '@/assets/alaseel-logo.jpeg';

interface AlaseelLogoProps {
  size?: 'sm' | 'md' | 'lg';
}

export function AlaseelLogo({ size = 'md' }: AlaseelLogoProps) {
  const sizeConfig = {
    sm: { container: 'w-20 h-20', image: 'w-16 h-16', ring: 3 },
    md: { container: 'w-28 h-28', image: 'w-24 h-24', ring: 4 },
    lg: { container: 'w-36 h-36', image: 'w-30 h-30', ring: 5 },
  };

  const config = sizeConfig[size];

  return (
    <div className="relative">
      {/* Outer glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(212, 165, 116, 0.25) 0%, transparent 70%)',
          transform: 'scale(1.4)',
        }}
        initial={{ opacity: 0, scale: 1.2 }}
        animate={{ opacity: 1, scale: 1.4 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
      
      {/* Main logo container */}
      <motion.div
        className={`${config.container} rounded-full flex items-center justify-center relative overflow-hidden`}
        style={{
          background: 'linear-gradient(145deg, #FAF6F1 0%, #F5EDE4 100%)',
          boxShadow: `
            0 20px 50px rgba(61, 44, 34, 0.25),
            0 0 0 ${config.ring}px rgba(212, 165, 116, 0.4),
            0 0 0 ${config.ring + 4}px rgba(212, 165, 116, 0.15),
            inset 0 2px 10px rgba(255, 255, 255, 0.5)
          `,
        }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.img
          src={alaseelLogo}
          alt="Alaseel Coffee - Tea"
          className="w-[85%] h-[85%] object-contain rounded-full"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
      </motion.div>
    </div>
  );
}

export default AlaseelLogo;
