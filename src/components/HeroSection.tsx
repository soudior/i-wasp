import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import nfcCardWaxSeal from "@/assets/nfc-card-wax-seal.png";

const WHATSAPP_ORDER_URL = "https://wa.me/33626424394?text=Bonjour%20👋%0AJe%20souhaite%20commander%20une%20carte%20NFC%20i-wasp.";

export function HeroSection() {
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-[#F5F5F7]">
      <div className="container mx-auto px-6 py-24 lg:py-32">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          
          {/* Headline - Apple-like large typography */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-[2.5rem] sm:text-[3.5rem] lg:text-[4.5rem] font-semibold leading-[1.05] tracking-[-0.02em] text-[#1D1D1F]"
          >
            Partagez vos contacts
            <br />
            <span className="text-[#8E8E93]">en un seul geste.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mt-6 text-lg sm:text-xl text-[#8E8E93] max-w-2xl leading-relaxed"
          >
            Une carte NFC premium. Un achat unique. Votre profil digital inclus à vie.
          </motion.p>

          {/* Single CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mt-10"
          >
            <a 
              href={WHATSAPP_ORDER_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button 
                size="lg" 
                className="bg-[#007AFF] hover:bg-[#0066D6] text-white font-medium px-8 py-6 text-lg rounded-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#007AFF]/20"
              >
                Commander
              </Button>
            </a>
          </motion.div>

          {/* NFC Card with subtle animation */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mt-16 lg:mt-20 relative"
          >
            {/* Subtle glow behind card */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#007AFF]/10 to-transparent blur-3xl scale-150 opacity-50" />
            
            {/* NFC Card with hover animation */}
            <motion.div
              animate={{ 
                y: [0, -8, 0],
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative"
            >
              <img
                src={nfcCardWaxSeal}
                alt="Carte NFC IWASP"
                className="w-full max-w-md lg:max-w-lg h-auto rounded-3xl shadow-2xl shadow-black/10"
                loading="eager"
              />
              
              {/* NFC waves animation */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <motion.div
                  animate={{ 
                    scale: [1, 2, 2],
                    opacity: [0.4, 0.1, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                  className="w-16 h-16 rounded-full border-2 border-[#007AFF]/40"
                />
                <motion.div
                  animate={{ 
                    scale: [1, 2, 2],
                    opacity: [0.4, 0.1, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut",
                    delay: 0.5
                  }}
                  className="absolute inset-0 w-16 h-16 rounded-full border-2 border-[#007AFF]/40"
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Minimal trust line */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 text-sm text-[#8E8E93]"
          >
            Compatible tous smartphones · Apple & Google Wallet
          </motion.p>
        </div>
      </div>
    </section>
  );
}
