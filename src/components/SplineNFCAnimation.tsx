/**
 * SplineNFCAnimation - Placeholder pour animation 3D NFC
 * 
 * NOTE: La scène Spline community nécessite une URL publique valide.
 * Remplacez SPLINE_EMBED_URL par votre propre scène Spline publique.
 * 
 * Usage : Page d'accueil uniquement.
 * INTERDIT sur /card/*, checkout, dashboard.
 */

import { useState } from "react";
import { Smartphone, CreditCard } from "lucide-react";

interface SplineNFCAnimationProps {
  className?: string;
}

// TODO: Remplacer par votre URL Spline publique
// Format: https://prod.spline.design/VOTRE_SCENE_ID/scene.splinecode
const SPLINE_EMBED_URL = "";

export function SplineNFCAnimation({ className = "" }: SplineNFCAnimationProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Si pas d'URL Spline, afficher le placeholder animé
  if (!SPLINE_EMBED_URL) {
    return (
      <div 
        className={`relative overflow-hidden bg-[#F7F7F5] ${className}`}
        style={{ pointerEvents: "none" }}
      >
        {/* Placeholder animé illustrant le geste NFC */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Carte NFC */}
            <div 
              className="w-48 h-32 rounded-xl bg-white shadow-xl border border-gray-200 flex items-center justify-center"
              style={{ backgroundColor: "#F7F7F5" }}
            >
              <CreditCard className="w-12 h-12 text-gray-400" />
            </div>
            
            {/* Téléphone animé */}
            <div 
              className="absolute -top-8 -right-8 animate-pulse"
              style={{ animationDuration: "2s" }}
            >
              <Smartphone className="w-16 h-16 text-gray-500" />
            </div>
            
            {/* Ondes NFC */}
            <div className="absolute -top-4 right-0 flex gap-1">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i}
                  className="w-1 h-6 rounded-full bg-gray-300 animate-pulse"
                  style={{ 
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: "1.5s"
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ pointerEvents: "none" }}
    >
      <iframe
        src={SPLINE_EMBED_URL}
        frameBorder="0"
        title="Animation NFC"
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ border: "none", pointerEvents: "none" }}
        loading="lazy"
      />
      <div className="absolute inset-0 z-10" style={{ pointerEvents: "auto" }} />
    </div>
  );
}

export default SplineNFCAnimation;
