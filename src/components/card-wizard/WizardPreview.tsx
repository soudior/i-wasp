/**
 * WizardPreview - Aperçu carte premium temps réel
 * 
 * Design IWASP:
 * - Carte centrée avec ombre profonde
 * - Arrondis luxe
 * - Animation subtile
 */

import { motion } from "framer-motion";
import { CardFormData } from "./CardWizard";
import { User, Building2, Briefcase } from "lucide-react";

interface WizardPreviewProps {
  data: CardFormData;
}

export function WizardPreview({ data }: WizardPreviewProps) {
  const hasName = data.firstName || data.lastName;
  const hasMedia = data.photoUrl || data.logoUrl;

  return (
    <div className="relative">
      {/* Phone frame */}
      <div className="relative mx-auto max-w-[280px] md:max-w-[320px]">
        {/* Phone bezel */}
        <div className="relative bg-zinc-900 rounded-[3rem] p-3 shadow-2xl">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-zinc-900 rounded-b-2xl z-10" />
          
          {/* Screen */}
          <div className="relative bg-background rounded-[2.25rem] overflow-hidden aspect-[9/19.5]">
            {/* Status bar mockup */}
            <div className="absolute top-0 inset-x-0 h-11 flex items-end justify-center pb-1 z-20">
              <div className="w-20 h-5 bg-zinc-800 rounded-full" />
            </div>

            {/* Card Content */}
            <div className="absolute inset-0 pt-14 pb-8 px-4 flex flex-col">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-card via-card to-card/80" />
              
              {/* Content */}
              <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center space-y-4">
                {/* Photo */}
                <motion.div
                  initial={false}
                  animate={{ scale: hasMedia ? 1 : 0.9, opacity: hasMedia ? 1 : 0.5 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="relative"
                >
                  {data.photoUrl ? (
                    <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-border/50 shadow-lg">
                      <img 
                        src={data.photoUrl} 
                        alt="Photo" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : data.logoUrl ? (
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-muted flex items-center justify-center shadow-lg">
                      <img 
                        src={data.logoUrl} 
                        alt="Logo" 
                        className="max-w-[80%] max-h-[80%] object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                      <User size={32} className="text-muted-foreground" />
                    </div>
                  )}
                </motion.div>

                {/* Name */}
                <motion.div
                  initial={false}
                  animate={{ opacity: hasName ? 1 : 0.5 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-lg font-bold tracking-tight">
                    {hasName 
                      ? `${data.firstName} ${data.lastName}`.trim()
                      : "Votre nom"
                    }
                  </h2>
                  
                  {(data.title || data.company) && (
                    <p className="text-sm text-muted-foreground mt-1 flex items-center justify-center gap-1.5">
                      {data.title && (
                        <>
                          <Briefcase size={12} />
                          <span>{data.title}</span>
                        </>
                      )}
                      {data.title && data.company && <span>·</span>}
                      {data.company && (
                        <>
                          <Building2 size={12} />
                          <span>{data.company}</span>
                        </>
                      )}
                    </p>
                  )}
                </motion.div>

                {/* Tagline */}
                {data.tagline && (
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-muted-foreground italic max-w-[200px]"
                  >
                    "{data.tagline}"
                  </motion.p>
                )}

                {/* Action buttons placeholder */}
                <div className="flex gap-2 mt-4">
                  {[1, 2, 3].map((i) => (
                    <div 
                      key={i}
                      className="w-12 h-12 rounded-full bg-muted/50"
                    />
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="relative z-10 text-center">
                <p className="text-[10px] text-muted-foreground opacity-50">
                  Propulsé par IWASP
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Reflection effect */}
        <div 
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-4/5 h-8 rounded-full blur-xl opacity-20"
          style={{
            background: "linear-gradient(to right, transparent, hsl(var(--primary)), transparent)",
          }}
        />
      </div>

      {/* Label */}
      <p className="text-center text-xs text-muted-foreground mt-6">
        Aperçu en temps réel
      </p>
    </div>
  );
}

export default WizardPreview;