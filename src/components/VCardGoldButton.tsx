/**
 * VCardGoldButton - Gold Glassmorphism vCard Download Button
 * 
 * Premium button for instant iPhone contact download
 * Style: Glassmorphism with gold accents, shimmer animation
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Download, Check } from "lucide-react";
import { downloadVCard, VCardData } from "@/lib/vcard";
import { toast } from "sonner";

interface VCardGoldButtonProps {
  data: VCardData;
  className?: string;
  size?: "sm" | "md" | "lg";
  label?: string;
}

export function VCardGoldButton({ 
  data, 
  className = "", 
  size = "md",
  label = "Enregistrer le contact"
}: VCardGoldButtonProps) {
  const [downloaded, setDownloaded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleDownload = () => {
    setIsAnimating(true);
    downloadVCard(data);
    setDownloaded(true);
    toast.success("Contact ajouté aux contacts !");
    
    setTimeout(() => {
      setDownloaded(false);
      setIsAnimating(false);
    }, 2500);
  };

  const sizeClasses = {
    sm: "p-3 rounded-xl",
    md: "p-4 rounded-2xl",
    lg: "p-5 rounded-2xl"
  };

  const iconSize = {
    sm: 18,
    md: 22,
    lg: 26
  };

  return (
    <motion.button
      onClick={handleDownload}
      whileTap={{ scale: 0.98 }}
      className={`group relative w-full overflow-hidden transition-all duration-300 hover:scale-[1.02] ${sizeClasses[size]} ${className}`}
      style={{
        background: "linear-gradient(135deg, rgba(212,175,55,0.2) 0%, rgba(184,134,11,0.15) 100%)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(212,175,55,0.3)",
        boxShadow: "0 8px 32px rgba(212,175,55,0.2), inset 0 1px 0 rgba(255,255,255,0.1)"
      }}
    >
      {/* Shimmer effect on hover */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        initial={{ x: "-100%" }}
        animate={isAnimating ? { x: "200%" } : {}}
        transition={{ duration: 1, ease: "easeInOut" }}
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(255,215,0,0.4) 50%, transparent 100%)",
          width: "50%"
        }}
      />
      
      {/* Background glow effect */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: "radial-gradient(ellipse at center, rgba(212,175,55,0.2) 0%, transparent 70%)"
        }}
      />
      
      <div className="relative flex items-center justify-center gap-3">
        {/* Icon container */}
        <motion.div 
          className="flex-shrink-0 flex items-center justify-center"
          animate={downloaded ? { rotate: [0, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          style={{ 
            width: size === "sm" ? 36 : size === "md" ? 44 : 52,
            height: size === "sm" ? 36 : size === "md" ? 44 : 52,
            borderRadius: 12,
            background: "linear-gradient(135deg, #d4af37 0%, #b8860b 100%)",
            boxShadow: "0 4px 15px rgba(212,175,55,0.4)"
          }}
        >
          {downloaded ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <Check size={iconSize[size]} className="text-black" strokeWidth={3} />
            </motion.div>
          ) : (
            <User size={iconSize[size]} className="text-black" />
          )}
        </motion.div>
        
        {/* Text */}
        <div className="text-left">
          <p className="font-semibold text-white" style={{ fontSize: size === "sm" ? 14 : size === "md" ? 16 : 18 }}>
            {downloaded ? "Contact ajouté !" : label}
          </p>
          <p className="text-[#d4af37]" style={{ fontSize: size === "sm" ? 11 : size === "md" ? 13 : 14 }}>
            {downloaded ? "Vérifie ton iPhone" : "Télécharger vCard"}
          </p>
        </div>
        
        {/* Download icon indicator */}
        {!downloaded && (
          <Download 
            size={size === "sm" ? 14 : size === "md" ? 16 : 18} 
            className="absolute right-4 text-[#d4af37]/60 group-hover:text-[#d4af37] transition-colors"
          />
        )}
      </div>
    </motion.button>
  );
}

export default VCardGoldButton;
