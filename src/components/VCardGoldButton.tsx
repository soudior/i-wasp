/**
 * VCardGoldButton - Gold Glassmorphism vCard Download Button V4
 * 
 * Premium button for instant iPhone contact download
 * Style: Glassmorphism with gold accents and black background
 * VCard 4.0 with photos, addresses, social links
 * Auto-scroll confirmation after download
 */

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { User, Download, Check, Sparkles } from "lucide-react";
import { downloadVCard, VCardData } from "@/lib/vcard";
import { toast } from "sonner";

interface VCardGoldButtonProps {
  data: VCardData;
  className?: string;
  size?: "sm" | "md" | "lg";
  label?: string;
  onDownloadComplete?: () => void;
}

export function VCardGoldButton({ 
  data, 
  className = "", 
  size = "md",
  label = "Enregistrer le contact",
  onDownloadComplete
}: VCardGoldButtonProps) {
  const [downloaded, setDownloaded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const confirmationRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to confirmation section
  const scrollToConfirmation = useCallback(() => {
    if (confirmationRef.current) {
      confirmationRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }, []);

  const handleDownload = () => {
    setIsAnimating(true);
    downloadVCard(data);
    setDownloaded(true);
    
    // Show success toast
    toast.success("Contact ajouté aux contacts !", {
      description: "Vérifie ton application Contacts",
      icon: <Check className="text-green-500" size={18} />
    });
    
    // Auto-scroll to show confirmation
    setTimeout(() => {
      scrollToConfirmation();
    }, 100);
    
    // Call callback if provided
    if (onDownloadComplete) {
      onDownloadComplete();
    }
    
    // Reset state after animation
    setTimeout(() => {
      setDownloaded(false);
      setIsAnimating(false);
    }, 3000);
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

  const iconContainerSize = {
    sm: { width: 36, height: 36 },
    md: { width: 44, height: 44 },
    lg: { width: 52, height: 52 }
  };

  const textSize = {
    sm: { title: 14, subtitle: 11 },
    md: { title: 16, subtitle: 13 },
    lg: { title: 18, subtitle: 14 }
  };

  return (
    <div ref={confirmationRef}>
      <motion.button
        ref={buttonRef}
        onClick={handleDownload}
        whileTap={{ scale: 0.98 }}
        whileHover={{ scale: 1.02 }}
        className={`group relative w-full overflow-hidden transition-all duration-300 ${sizeClasses[size]} ${className}`}
        style={{
          background: downloaded 
            ? "linear-gradient(135deg, rgba(34,197,94,0.3) 0%, rgba(22,163,74,0.2) 100%)"
            : "linear-gradient(135deg, rgba(212,175,55,0.25) 0%, rgba(184,134,11,0.15) 100%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: downloaded 
            ? "1px solid rgba(34,197,94,0.5)"
            : "1px solid rgba(212,175,55,0.4)",
          boxShadow: downloaded
            ? "0 8px 32px rgba(34,197,94,0.3), inset 0 1px 0 rgba(255,255,255,0.1)"
            : "0 8px 32px rgba(212,175,55,0.25), inset 0 1px 0 rgba(255,255,255,0.1)"
        }}
      >
        {/* Shimmer effect on hover */}
        <motion.div 
          className="absolute inset-0 pointer-events-none"
          initial={{ x: "-100%" }}
          animate={isAnimating ? { x: "200%" } : {}}
          transition={{ duration: 1, ease: "easeInOut" }}
          style={{
            background: downloaded 
              ? "linear-gradient(90deg, transparent 0%, rgba(34,197,94,0.4) 50%, transparent 100%)"
              : "linear-gradient(90deg, transparent 0%, rgba(255,215,0,0.4) 50%, transparent 100%)",
            width: "50%"
          }}
        />
        
        {/* Background glow effect */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: downloaded 
              ? "radial-gradient(ellipse at center, rgba(34,197,94,0.2) 0%, transparent 70%)"
              : "radial-gradient(ellipse at center, rgba(212,175,55,0.2) 0%, transparent 70%)"
          }}
        />
        
        <div className="relative flex items-center justify-center gap-3">
          {/* Icon container */}
          <motion.div 
            className="flex-shrink-0 flex items-center justify-center rounded-xl"
            animate={downloaded ? { rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.5 }}
            style={{ 
              ...iconContainerSize[size],
              borderRadius: 12,
              background: downloaded 
                ? "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
                : "linear-gradient(135deg, #d4af37 0%, #b8860b 100%)",
              boxShadow: downloaded 
                ? "0 4px 15px rgba(34,197,94,0.5)"
                : "0 4px 15px rgba(212,175,55,0.4)"
            }}
          >
            {downloaded ? (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <Check size={iconSize[size]} className="text-white" strokeWidth={3} />
              </motion.div>
            ) : (
              <User size={iconSize[size]} className="text-black" />
            )}
          </motion.div>
          
          {/* Text */}
          <div className="text-left flex-1">
            <p 
              className="font-semibold text-white" 
              style={{ fontSize: textSize[size].title }}
            >
              {downloaded ? "Contact ajouté !" : label}
            </p>
            <p 
              style={{ 
                fontSize: textSize[size].subtitle,
                color: downloaded ? '#22c55e' : '#d4af37'
              }}
            >
              {downloaded ? "Vérifie ton iPhone ✓" : "VCard 4.0 · Télécharger"}
            </p>
          </div>
          
          {/* Download/Success icon indicator */}
          <div className="absolute right-4">
            {downloaded ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Sparkles size={size === "sm" ? 14 : size === "md" ? 16 : 18} className="text-green-400" />
              </motion.div>
            ) : (
              <Download 
                size={size === "sm" ? 14 : size === "md" ? 16 : 18} 
                className="text-[#d4af37]/60 group-hover:text-[#d4af37] transition-colors"
              />
            )}
          </div>
        </div>
      </motion.button>

      {/* Confirmation message with auto-scroll target */}
      {downloaded && (
        <motion.div
          initial={{ opacity: 0, y: -10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -10, height: 0 }}
          className="mt-3 p-3 rounded-xl text-center"
          style={{
            background: 'rgba(34,197,94,0.1)',
            border: '1px solid rgba(34,197,94,0.2)'
          }}
        >
          <p className="text-sm text-green-400 font-medium">
            ✓ Fichier .vcf généré avec succès
          </p>
          <p className="text-xs text-white/50 mt-1">
            Ouvre ton application Contacts pour voir le nouveau contact
          </p>
        </motion.div>
      )}
    </div>
  );
}

export default VCardGoldButton;
