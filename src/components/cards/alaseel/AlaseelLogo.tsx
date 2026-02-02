/**
 * AlaseelLogo - Premium coffee shop logo component
 * Circular design with coffee cup icon and steam
 */

import { motion } from 'framer-motion';

interface AlaseelLogoProps {
  size?: 'sm' | 'md' | 'lg';
}

export function AlaseelLogo({ size = 'md' }: AlaseelLogoProps) {
  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-28 h-28',
    lg: 'w-32 h-32',
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center relative`}
      style={{
        background: 'linear-gradient(145deg, #FFFFFF 0%, #F8F4EF 100%)',
        boxShadow: '0 10px 40px rgba(61, 43, 31, 0.3), 0 0 0 2.5px #D97706, 0 0 0 4px rgba(217, 119, 6, 0.2)',
      }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Coffee Cup Icon with Steam */}
      <div className="flex flex-col items-center">
        {/* Steam Animation */}
        <div className="flex gap-1 mb-0.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="rounded-full"
              style={{ 
                backgroundColor: '#D97706',
                width: size === 'sm' ? 1.5 : 2,
                height: size === 'sm' ? 8 : size === 'md' ? 10 : 12,
              }}
              animate={{
                y: [0, -3, 0],
                opacity: [0.3, 0.9, 0.3],
                scaleY: [1, 1.1, 1],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                delay: i * 0.25,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
        
        {/* Coffee Cup */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={size === 'sm' ? 'w-7 h-7' : size === 'md' ? 'w-9 h-9' : 'w-10 h-10'}
        >
          {/* Cup body */}
          <path
            d="M4 8h12a2 2 0 012 2v4a6 6 0 01-6 6H8a6 6 0 01-6-6v-4a2 2 0 012-2z"
            fill="#3D2B1F"
          />
          {/* Handle */}
          <path
            d="M18 10h1a3 3 0 010 6h-1"
            stroke="#3D2B1F"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Coffee surface */}
          <ellipse cx="10" cy="10" rx="5" ry="1.5" fill="#D97706" />
        </svg>
        
        {/* Brand Text */}
        <div className="text-center mt-0.5">
          <p
            className="font-serif font-bold"
            style={{
              fontSize: size === 'sm' ? '0.5rem' : size === 'md' ? '0.6rem' : '0.7rem',
              color: '#3D2B1F',
              letterSpacing: '0.12em',
            }}
          >
            Alaseel
          </p>
          <p
            className="uppercase font-semibold"
            style={{
              fontSize: size === 'sm' ? '0.3rem' : size === 'md' ? '0.35rem' : '0.4rem',
              color: '#D97706',
              letterSpacing: '0.18em',
            }}
          >
            Coffee · Tea
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default AlaseelLogo;
