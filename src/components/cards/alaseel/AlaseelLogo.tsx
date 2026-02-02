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
    lg: 'w-36 h-36',
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} rounded-full bg-white flex items-center justify-center relative`}
      style={{
        boxShadow: '0 8px 32px rgba(61, 43, 31, 0.25), 0 0 0 3px #D97706',
      }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Coffee Cup Icon with Steam */}
      <div className="flex flex-col items-center">
        {/* Steam Animation */}
        <div className="flex gap-1 mb-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-0.5 h-3 rounded-full"
              style={{ backgroundColor: '#D97706' }}
              animate={{
                y: [0, -4, 0],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
        
        {/* Coffee Cup */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={size === 'sm' ? 'w-8 h-8' : size === 'md' ? 'w-10 h-10' : 'w-12 h-12'}
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
        <div className="text-center mt-1">
          <p
            className="font-serif font-bold tracking-wide"
            style={{
              fontSize: size === 'sm' ? '0.5rem' : size === 'md' ? '0.625rem' : '0.75rem',
              color: '#3D2B1F',
              letterSpacing: '0.1em',
            }}
          >
            Alaseel
          </p>
          <p
            className="uppercase tracking-widest"
            style={{
              fontSize: size === 'sm' ? '0.35rem' : size === 'md' ? '0.4rem' : '0.5rem',
              color: '#D97706',
              letterSpacing: '0.2em',
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
