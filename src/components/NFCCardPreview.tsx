import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NFCCardPreviewProps {
  className?: string;
  name?: string;
  title?: string;
  showFlipHint?: boolean;
}

export function NFCCardPreview({ 
  className, 
  name = "Votre Nom",
  title = "Votre Titre",
  showFlipHint = true 
}: NFCCardPreviewProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className={cn("relative", className)}>
      {/* Flip hint */}
      {showFlipHint && (
        <p className="text-center text-muted-foreground text-sm mb-4">
          Cliquez pour retourner
        </p>
      )}
      
      {/* Card container with perspective */}
      <div 
        className="relative w-full max-w-[340px] mx-auto cursor-pointer"
        style={{ perspective: "1000px" }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <motion.div
          className="relative w-full"
          style={{ 
            transformStyle: "preserve-3d",
            aspectRatio: "1.586/1" // Standard credit card ratio
          }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Front of card */}
          <div 
            className="absolute inset-0 rounded-2xl bg-background border border-border shadow-xl overflow-hidden"
            style={{ backfaceVisibility: "hidden" }}
          >
            {/* Subtle texture */}
            <div className="absolute inset-0 opacity-[0.02]">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
                backgroundSize: '20px 20px'
              }} />
            </div>
            
            {/* Content */}
            <div className="relative h-full flex flex-col justify-between p-6">
              {/* Top section - Logo */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-1">
                  <span className="text-xl font-bold tracking-tight text-foreground">i-Wasp</span>
                  <svg 
                    viewBox="0 0 24 24" 
                    className="w-5 h-5 text-foreground"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M8.5 12.5a2.5 2.5 0 0 0 5 0" strokeLinecap="round" />
                    <path d="M6 10a5 5 0 0 0 10 0" strokeLinecap="round" opacity="0.7" />
                    <path d="M3.5 7.5a7.5 7.5 0 0 0 15 0" strokeLinecap="round" opacity="0.4" />
                  </svg>
                </div>
                
                {/* NFC Symbol */}
                <div className="w-8 h-8 rounded-full border border-border/50 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-muted-foreground" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" opacity="0.3"/>
                    <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" opacity="0.5"/>
                    <circle cx="12" cy="12" r="2"/>
                  </svg>
                </div>
              </div>
              
              {/* Bottom section - Name & Title */}
              <div>
                <p className="text-lg font-semibold text-foreground tracking-tight">{name}</p>
                <p className="text-sm text-muted-foreground">{title}</p>
              </div>
            </div>
            
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-foreground/[0.02] pointer-events-none" />
          </div>

          {/* Back of card */}
          <div 
            className="absolute inset-0 rounded-2xl bg-background border border-border shadow-xl overflow-hidden"
            style={{ 
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)"
            }}
          >
            {/* Honeycomb texture */}
            <div className="absolute inset-0">
              <svg width="100%" height="100%" className="opacity-[0.04]">
                <defs>
                  <pattern id="honeycomb" width="28" height="49" patternUnits="userSpaceOnUse" patternTransform="scale(0.5)">
                    <path 
                      fill="currentColor" 
                      d="M14 0L28 8.66v17.32L14 34.64 0 25.98V8.66L14 0zm0 49L28 40.34V23.02L14 14.36 0 23.02v17.32L14 49z"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#honeycomb)" />
              </svg>
            </div>
            
            {/* Content */}
            <div className="relative h-full flex flex-col items-center justify-center p-6">
              {/* Centered logo */}
              <div className="flex items-center gap-1.5 mb-4">
                <span className="text-2xl font-bold tracking-tight text-foreground">i-Wasp</span>
                <svg 
                  viewBox="0 0 24 24" 
                  className="w-6 h-6 text-foreground"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M8.5 12.5a2.5 2.5 0 0 0 5 0" strokeLinecap="round" />
                  <path d="M6 10a5 5 0 0 0 10 0" strokeLinecap="round" opacity="0.7" />
                  <path d="M3.5 7.5a7.5 7.5 0 0 0 15 0" strokeLinecap="round" opacity="0.4" />
                </svg>
              </div>
              
              {/* QR Code placeholder */}
              <div className="w-20 h-20 rounded-lg bg-foreground/5 border border-border flex items-center justify-center mb-4">
                <svg viewBox="0 0 24 24" className="w-12 h-12 text-foreground/30" fill="currentColor">
                  <path d="M3 3h6v6H3V3zm2 2v2h2V5H5zm8-2h6v6h-6V3zm2 2v2h2V5h-2zM3 13h6v6H3v-6zm2 2v2h2v-2H5zm13-2h1v1h-1v-1zm-3 0h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1zm1 1h1v1h-1v-1zm1-1h1v1h-1v-1zm1 1h1v1h-1v-1zm0 1h1v1h-1v-1zm-1 0h1v1h-1v-1zm-1 1h1v1h-1v-1zm-1-1h1v1h-1v-1zm1-1h1v1h-1v-1zm1 2h1v1h-1v-1z"/>
                </svg>
              </div>
              
              {/* Tagline */}
              <p className="text-xs text-muted-foreground tracking-wide">
                Tap. Connect. Empower.
              </p>
            </div>
            
            {/* Bottom branding */}
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <p className="text-[10px] text-muted-foreground/60 tracking-widest uppercase">
                Premium NFC Card
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Side indicator */}
      <div className="flex justify-center gap-2 mt-6">
        <button
          onClick={() => setIsFlipped(false)}
          className={cn(
            "px-3 py-1 text-xs rounded-full transition-colors",
            !isFlipped 
              ? "bg-foreground text-background" 
              : "bg-accent text-muted-foreground hover:bg-accent/80"
          )}
        >
          Recto
        </button>
        <button
          onClick={() => setIsFlipped(true)}
          className={cn(
            "px-3 py-1 text-xs rounded-full transition-colors",
            isFlipped 
              ? "bg-foreground text-background" 
              : "bg-accent text-muted-foreground hover:bg-accent/80"
          )}
        >
          Verso
        </button>
      </div>
    </div>
  );
}

export default NFCCardPreview;
