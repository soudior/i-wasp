/**
 * OrderLoader - Premium animated loader during order creation
 * Style: Haute Couture Digitale — Noir, minimaliste
 */

import { motion } from "framer-motion";
import { COUTURE } from "@/lib/hauteCouturePalette";

interface OrderLoaderProps {
  message?: string;
  submessage?: string;
}

export function OrderLoader({ 
  message = "Création de votre commande", 
  submessage = "Veuillez patienter..." 
}: OrderLoaderProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: COUTURE.jet }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Honeycomb texture */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cpath d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100' fill='none' stroke='${encodeURIComponent("#1a1a1a")}' stroke-width='0.4' stroke-opacity='0.1'/%3E%3C/svg%3E")`,
          backgroundSize: '56px 100px',
        }}
      />

      <div className="relative z-10 text-center px-6">
        {/* Animated hexagon loader */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          {/* Outer rotating hexagon */}
          <motion.svg
            viewBox="0 0 100 100"
            className="absolute inset-0 w-full h-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <polygon
              points="50,5 93,25 93,75 50,95 7,75 7,25"
              fill="none"
              stroke={COUTURE.jetMuted}
              strokeWidth="0.5"
            />
          </motion.svg>

          {/* Middle pulsing hexagon */}
          <motion.svg
            viewBox="0 0 100 100"
            className="absolute inset-0 w-full h-full"
            animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <polygon
              points="50,15 83,30 83,70 50,85 17,70 17,30"
              fill="none"
              stroke={COUTURE.gold}
              strokeWidth="1"
            />
          </motion.svg>

          {/* Inner golden hexagon */}
          <motion.svg
            viewBox="0 0 100 100"
            className="absolute inset-0 w-full h-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          >
            <polygon
              points="50,25 73,35 73,65 50,75 27,65 27,35"
              fill="none"
              stroke={COUTURE.gold}
              strokeWidth="1.5"
            />
          </motion.svg>

          {/* Center dot */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COUTURE.gold }}
            />
          </motion.div>

          {/* Orbiting dots */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "linear",
                delay: i * 1 
              }}
            >
              <motion.div
                className="absolute top-0 left-1/2 -translate-x-1/2"
                style={{ marginTop: "8px" }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.5 }}
              >
                <div 
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: COUTURE.gold }}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <h2 
            className="font-display text-lg font-light italic mb-2"
            style={{ color: COUTURE.silk }}
          >
            {message}
          </h2>
          
          <motion.p 
            className="text-[11px] uppercase tracking-[0.2em]"
            style={{ color: COUTURE.textMuted }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {submessage}
          </motion.p>
        </motion.div>

        {/* Progress bar */}
        <motion.div 
          className="mt-8 mx-auto max-w-[200px] h-[1px] overflow-hidden"
          style={{ backgroundColor: COUTURE.jetMuted }}
        >
          <motion.div
            className="h-full"
            style={{ backgroundColor: COUTURE.gold }}
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
