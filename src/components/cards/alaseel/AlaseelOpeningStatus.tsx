/**
  * AlaseelOpeningStatus - Modern chic dynamic status badge
  * Glassmorphism design with real-time status
 */

import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

// Opening hours: 7h - 23h every day
const OPENING_HOUR = 7;
const CLOSING_HOUR = 23;

type StatusInfo = {
  isOpen: boolean;
  statusText: string;
  nextEvent: string;
};

function getCafeStatus(): StatusInfo {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTime = currentHour * 60 + currentMinutes;
  
  const openTime = OPENING_HOUR * 60; // 7:00 = 420 minutes
  const closeTime = CLOSING_HOUR * 60; // 23:00 = 1380 minutes
  
  if (currentTime >= openTime && currentTime < closeTime) {
    const minsUntilClose = closeTime - currentTime;
    
    if (minsUntilClose <= 60) {
      return {
        isOpen: true,
        statusText: "Ouvert",
        nextEvent: `Ferme dans ${minsUntilClose} min`
      };
    }
    
    const hoursUntilClose = Math.floor(minsUntilClose / 60);
    return {
      isOpen: true,
      statusText: "Ouvert",
      nextEvent: `Jusqu'à 23h`
    };
  }
  
  // Before opening
  if (currentTime < openTime) {
    return {
      isOpen: false,
      statusText: "Fermé",
      nextEvent: `Ouvre à 7h`
    };
  }
  
  // After closing
  return {
    isOpen: false,
    statusText: "Fermé",
    nextEvent: `Ouvre demain à 7h`
  };
}

export function AlaseelOpeningStatus() {
  const [status, setStatus] = useState<StatusInfo>(getCafeStatus);
  
  // Update status every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(getCafeStatus());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full backdrop-blur-md"
      style={{
        background: status.isOpen
          ? "rgba(34, 197, 94, 0.15)"
          : "rgba(239, 68, 68, 0.15)",
        border: `1px solid ${status.isOpen ? "rgba(34, 197, 94, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
        boxShadow: status.isOpen
          ? "0 4px 20px rgba(34, 197, 94, 0.15)"
          : "0 4px 20px rgba(239, 68, 68, 0.15)",
      }}
    >
      {/* Pulsing dot */}
      <span className="relative flex h-2.5 w-2.5">
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
            status.isOpen ? "bg-green-400" : "bg-red-400"
          }`}
        />
        <span
          className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
            status.isOpen ? "bg-green-500" : "bg-red-500"
          }`}
        />
      </span>
      
      {/* Status text */}
      <span
        className={`text-[0.82rem] font-semibold tracking-wide ${
          status.isOpen ? "text-green-700" : "text-red-600"
        }`}
      >
        {status.statusText}
      </span>
      
      {/* Separator */}
      <span className="w-px h-3.5 bg-white/20" />
      
      {/* Clock icon */}
      <Clock size={13} strokeWidth={2} style={{ color: "rgba(255, 255, 255, 0.7)" }} />
      
      {/* Next event */}
      <span
        className="text-[0.78rem] font-medium"
        style={{ color: "rgba(255, 255, 255, 0.85)" }}
      >
        {status.nextEvent}
      </span>
    </motion.div>
  );
}
