import { motion, AnimatePresence } from 'framer-motion';

interface SovereignCelebrationProps {
  active: boolean;
}

export function SovereignCelebration({ active }: SovereignCelebrationProps) {
  if (!active) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center"
      >
        {/* Core expansion effect */}
        <motion.div 
          className="absolute w-20 h-20 rounded-full bg-gradient-to-br from-[#A5A9B4] to-[#D1D5DB]"
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 8, opacity: 0 }}
          transition={{ duration: 2, ease: [0, 0, 0.2, 1] }}
        />

        {/* Particles */}
        {[...Array(60)].map((_, i) => {
          const angle = (i / 60) * 360;
          const distance = 200 + Math.random() * 300;
          
          return (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: i % 3 === 0 
                  ? 'linear-gradient(135deg, #A5A9B4, #D1D5DB)' 
                  : i % 3 === 1 
                    ? '#FFFFFF' 
                    : '#A5A9B4',
                boxShadow: '0 0 10px rgba(165, 169, 180, 0.8)',
              }}
              initial={{ 
                x: 0, 
                y: 0, 
                scale: 0,
                opacity: 1 
              }}
              animate={{ 
                x: Math.cos(angle * Math.PI / 180) * distance,
                y: Math.sin(angle * Math.PI / 180) * distance,
                scale: [0, 1.5, 0],
                opacity: [1, 1, 0]
              }}
              transition={{ 
                duration: 1.5 + Math.random() * 0.5,
                ease: [0, 0, 0.2, 1],
                delay: Math.random() * 0.3
              }}
            />
          );
        })}

        {/* Success text */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5, ease: [0, 0, 0.2, 1] }}
          className="absolute flex flex-col items-center"
        >
          <motion.div 
            className="w-24 h-24 rounded-full bg-gradient-to-br from-[#A5A9B4] to-[#D1D5DB] flex items-center justify-center mb-6"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <svg className="w-12 h-12 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <motion.path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M5 13l4 4L19 7"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              />
            </svg>
          </motion.div>
          <motion.p 
            className="text-2xl font-bold text-white tracking-wide"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            SOVEREIGN STANDARD
          </motion.p>
          <motion.p 
            className="text-[#A5A9B4] mt-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Héritage Scellé
          </motion.p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
