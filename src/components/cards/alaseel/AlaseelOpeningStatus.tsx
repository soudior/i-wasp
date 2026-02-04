/**
 * AlaseelOpeningStatus - Dynamic opening status badge for Alaseel Coffee
 * Shows real-time Ouvert/Fermé status with countdown
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
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
      style={{
        background: status.isOpen
          ? "rgba(34, 197, 94, 0.12)"
          : "rgba(239, 68, 68, 0.12)",
        border: `1px solid ${status.isOpen ? "rgba(34, 197, 94, 0.25)" : "rgba(239, 68, 68, 0.25)"}`,
      }}
    >
      {/* Pulsing dot */}
      <span
        className={`w-2 h-2 rounded-full animate-pulse ${
          status.isOpen ? "bg-green-500" : "bg-red-500"
        }`}
      />
      
      {/* Status text */}
      <span
        className={`text-sm font-semibold ${
          status.isOpen ? "text-green-600" : "text-red-600"
        }`}
      >
        {status.statusText}
      </span>
      
      {/* Separator */}
      <span style={{ color: "rgba(93, 64, 55, 0.3)" }}>•</span>
      
      {/* Clock icon */}
      <Clock size={14} style={{ color: "rgba(93, 64, 55, 0.5)" }} />
      
      {/* Next event */}
      <span
        className="text-sm"
        style={{ color: "rgba(93, 64, 55, 0.6)" }}
      >
        {status.nextEvent}
      </span>
    </motion.div>
  );
}
