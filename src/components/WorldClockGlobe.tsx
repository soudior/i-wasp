/**
 * WorldClockGlobe - Animated globe with live timezone clock
 * 
 * Design IWASP:
 * - Subtle animated globe visualization
 * - Real-time clock with seconds
 * - Elegant, minimal design
 */

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Globe, Clock } from "lucide-react";
import { STEALTH } from "@/lib/stealthPalette";

interface WorldClockGlobeProps {
  timezone?: string;
  className?: string;
  compact?: boolean;
}

export function WorldClockGlobe({ 
  timezone = Intl.DateTimeFormat().resolvedOptions().timeZone,
  className = "",
  compact = false,
}: WorldClockGlobeProps) {
  const [time, setTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Format time for display
  const formattedTime = useMemo(() => {
    return time.toLocaleTimeString("en-GB", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  }, [time, timezone]);

  // Get timezone abbreviation
  const timezoneAbbrev = useMemo(() => {
    try {
      const parts = timezone.split("/");
      return parts[parts.length - 1].replace(/_/g, " ");
    } catch {
      return timezone;
    }
  }, [timezone]);

  // Calculate globe rotation based on time
  const globeRotation = useMemo(() => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    // Full rotation in 24 hours
    return ((hours * 3600 + minutes * 60 + seconds) / 86400) * 360;
  }, [time]);

  if (compact) {
    return (
      <motion.div 
        className={`flex items-center gap-2 ${className}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          animate={{ rotate: globeRotation }}
          transition={{ duration: 0.5, ease: "linear" }}
          style={{ transformOrigin: "center" }}
        >
          <Globe className="w-4 h-4" style={{ color: STEALTH.accent }} />
        </motion.div>
        <span 
          className="font-mono text-xs tabular-nums"
          style={{ color: STEALTH.textSecondary }}
        >
          {formattedTime}
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`relative flex items-center gap-3 px-4 py-2 rounded-full ${className}`}
      style={{ 
        backgroundColor: `${STEALTH.bgCard}80`,
        border: `1px solid ${STEALTH.border}`,
      }}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Animated Globe */}
      <div className="relative w-8 h-8">
        {/* Globe background */}
        <motion.div
          className="absolute inset-0 rounded-full overflow-hidden"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${STEALTH.accent}30, ${STEALTH.bgInput} 70%)`,
            boxShadow: `inset 0 0 10px ${STEALTH.accent}20`,
          }}
        >
          {/* Animated meridians */}
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: globeRotation }}
            transition={{ duration: 1, ease: "linear" }}
            style={{ transformOrigin: "center" }}
          >
            {/* Vertical lines (meridians) */}
            {[0, 30, 60, 90, 120, 150].map((deg, i) => (
              <div
                key={i}
                className="absolute top-0 bottom-0 left-1/2 w-px"
                style={{
                  backgroundColor: `${STEALTH.accent}30`,
                  transform: `translateX(-50%) rotateY(${deg}deg)`,
                }}
              />
            ))}
          </motion.div>
          
          {/* Horizontal lines (parallels) */}
          <div 
            className="absolute left-0 right-0 top-1/2 h-px"
            style={{ backgroundColor: `${STEALTH.accent}30` }}
          />
          <div 
            className="absolute left-0 right-0 top-1/3 h-px"
            style={{ backgroundColor: `${STEALTH.accent}20` }}
          />
          <div 
            className="absolute left-0 right-0 top-2/3 h-px"
            style={{ backgroundColor: `${STEALTH.accent}20` }}
          />
        </motion.div>

        {/* Globe icon overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Globe className="w-4 h-4" style={{ color: STEALTH.accent, opacity: 0.8 }} />
        </div>

        {/* Pulsing dot for current location */}
        <motion.div
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            backgroundColor: STEALTH.accent,
            top: "40%",
            left: "60%",
            boxShadow: STEALTH.glow,
          }}
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [1, 0.7, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Time Display */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <motion.span
            key={formattedTime}
            className="font-mono text-sm font-semibold tabular-nums tracking-wider"
            style={{ color: STEALTH.text }}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
          >
            {formattedTime}
          </motion.span>
        </div>
        <span 
          className="text-[10px] uppercase tracking-wider"
          style={{ color: STEALTH.textSecondary }}
        >
          {timezoneAbbrev}
        </span>
      </div>

      {/* Subtle animated border glow */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          border: `1px solid ${STEALTH.accent}`,
          opacity: 0.1,
        }}
        animate={{
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
}

export default WorldClockGlobe;
