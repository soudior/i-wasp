import { motion } from 'framer-motion';

interface SovereignTickerProps {
  messages?: string[];
}

export function SovereignTicker({ messages }: SovereignTickerProps) {
  const defaultMessages = [
    'ALLIANCE ACTIVE : RÉSEAU SOVEREIGN',
    'HÉGÉMONIE MONDIALE : STANDARD N°1',
    'SCELLEMENT PREMIUM : IWASP NETWORK',
    'CONNEXION ÉLITE : MEMBRES VIP',
  ];

  const tickerMessages = messages || defaultMessages;

  return (
    <div className="w-full overflow-hidden bg-black/50 backdrop-blur-sm border-y border-white/5 py-3">
      <motion.div 
        className="flex whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ 
          duration: 30, 
          repeat: Infinity, 
          ease: 'linear' 
        }}
      >
        {[...Array(4)].map((_, repeatIndex) => (
          <div key={repeatIndex} className="flex">
            {tickerMessages.map((msg, i) => (
              <span 
                key={`${repeatIndex}-${i}`}
                className="mx-12 text-xs font-medium tracking-[0.3em] text-[#A5A9B4]/60 uppercase"
              >
                {msg} <span className="text-[#A5A9B4]/30 mx-4">//</span>
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
