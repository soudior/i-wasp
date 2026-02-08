/**
 * CoffeeSpiritOpeningStatus - Real-time opening status badge
 * Opens daily until 23:00
 */

import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

export function CoffeeSpiritOpeningStatus() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentTime = hours * 60 + minutes;

  // Coffee Spirit: Opens at 8:00, closes at 23:00
  const openTime = 8 * 60; // 8:00
  const closeTime = 23 * 60; // 23:00

  const isOpen = currentTime >= openTime && currentTime < closeTime;

  // Calculate time until status change
  let statusText = '';
  if (isOpen) {
    const minutesUntilClose = closeTime - currentTime;
    if (minutesUntilClose <= 60) {
      statusText = `Ferme dans ${minutesUntilClose} min`;
    } else {
      const hoursUntilClose = Math.floor(minutesUntilClose / 60);
      statusText = `Ouvert · Ferme à 23:00`;
    }
  } else {
    if (currentTime < openTime) {
      const minutesUntilOpen = openTime - currentTime;
      if (minutesUntilOpen <= 60) {
        statusText = `Ouvre dans ${minutesUntilOpen} min`;
      } else {
        statusText = `Fermé · Ouvre à 08:00`;
      }
    } else {
      statusText = `Fermé · Ouvre demain à 08:00`;
    }
  }

  return (
    <motion.div
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
      style={{
        background: isOpen 
          ? 'linear-gradient(145deg, rgba(34, 197, 94, 0.15) 0%, rgba(22, 163, 74, 0.1) 100%)'
          : 'linear-gradient(145deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.1) 100%)',
        border: `1px solid ${isOpen ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
        boxShadow: isOpen 
          ? '0 4px 20px rgba(34, 197, 94, 0.15)'
          : '0 4px 20px rgba(239, 68, 68, 0.15)',
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Pulsing dot */}
      <span className="relative flex h-2 w-2">
        <span 
          className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
          style={{ backgroundColor: isOpen ? '#22c55e' : '#ef4444' }}
        />
        <span 
          className="relative inline-flex rounded-full h-2 w-2"
          style={{ backgroundColor: isOpen ? '#22c55e' : '#ef4444' }}
        />
      </span>
      
      <Clock size={12} style={{ color: isOpen ? '#22c55e' : '#ef4444' }} />
      
      <span 
        className="text-[0.75rem] font-medium"
        style={{ color: isOpen ? '#22c55e' : '#ef4444' }}
      >
        {statusText}
      </span>
    </motion.div>
  );
}

export default CoffeeSpiritOpeningStatus;
