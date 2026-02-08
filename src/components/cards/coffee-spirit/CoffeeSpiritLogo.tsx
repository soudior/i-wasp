/**
 * CoffeeSpiritLogo - Premium Coffee Spirit logo with glow effect
 */

import { motion } from 'framer-motion';
import coffeeCup from '@/assets/coffee-spirit/coffee-cup.jpg';

interface CoffeeSpiritLogoProps {
  size?: 'sm' | 'md' | 'lg';
}

export function CoffeeSpiritLogo({ size = 'md' }: CoffeeSpiritLogoProps) {
  const sizeConfig = {
    sm: { container: 'w-20 h-20', ring: 3 },
    md: { container: 'w-28 h-28', ring: 4 },
    lg: { container: 'w-36 h-36', ring: 5 },
  };

  const config = sizeConfig[size];

  return (
    <div className="relative">
      {/* Outer glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(139, 90, 43, 0.3) 0%, transparent 70%)',
          transform: 'scale(1.5)',
        }}
        initial={{ opacity: 0, scale: 1.2 }}
        animate={{ opacity: 1, scale: 1.5 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
      
      {/* Main logo container */}
      <motion.div
        className={`${config.container} rounded-full flex items-center justify-center relative overflow-hidden`}
        style={{
          background: 'linear-gradient(145deg, #1A1512 0%, #0D0A08 100%)',
          boxShadow: `
            0 20px 50px rgba(0, 0, 0, 0.5),
            0 0 0 ${config.ring}px rgba(139, 90, 43, 0.5),
            0 0 0 ${config.ring + 4}px rgba(139, 90, 43, 0.2),
            inset 0 2px 10px rgba(255, 255, 255, 0.1)
          `,
        }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.img
          src={coffeeCup}
          alt="Coffee Spirit"
          className="w-[90%] h-[90%] object-cover rounded-full"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
      </motion.div>
    </div>
  );
}

export default CoffeeSpiritLogo;
