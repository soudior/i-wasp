import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import nfcCardWaxSeal from "@/assets/nfc-card-wax-seal.png";

const WHATSAPP_ORDER_URL = "https://wa.me/33626424394?text=Bonjour%20👋%0AJe%20souhaite%20commander%20une%20carte%20NFC%20i-wasp.";

// Stagger container for progressive reveal
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

// Individual text line reveal
const lineVariants = {
  hidden: { 
    opacity: 0, 
    y: 40,
    filter: "blur(10px)",
  },
  visible: { 
    opacity: 1, 
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: "easeOut" as const,
    },
  },
};

// Word-by-word reveal for headline
const wordVariants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    rotateX: 45,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

export function HeroSection() {
  const headlineWords1 = ["Partagez", "vos", "contacts"];
  const headlineWords2 = ["en", "un", "seul", "geste."];

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-background transition-colors duration-300">
      <div className="container mx-auto px-6 py-24 lg:py-32">
        <motion.div 
          className="flex flex-col items-center text-center max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          
          {/* Headline - Progressive word reveal */}
          <motion.h1 
            className="text-[2.5rem] sm:text-[3.5rem] lg:text-[4.5rem] font-semibold leading-[1.05] tracking-[-0.02em] text-foreground"
            style={{ perspective: "1000px" }}
          >
            <motion.span 
              className="block"
              variants={containerVariants}
            >
              {headlineWords1.map((word, index) => (
                <motion.span
                  key={index}
                  variants={wordVariants}
                  className="inline-block mr-[0.25em]"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {word}
                </motion.span>
              ))}
            </motion.span>
            <motion.span 
              className="block text-muted-foreground"
              variants={containerVariants}
            >
              {headlineWords2.map((word, index) => (
                <motion.span
                  key={index}
                  variants={wordVariants}
                  className="inline-block mr-[0.25em]"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {word}
                </motion.span>
              ))}
            </motion.span>
          </motion.h1>

          {/* Subheadline - Blur reveal */}
          <motion.p 
            variants={lineVariants}
            className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed"
          >
            Une carte NFC premium. Un achat unique. Votre profil digital inclus à vie.
          </motion.p>

          {/* Single CTA */}
          <motion.div
            variants={lineVariants}
            className="mt-10"
          >
            <a 
              href={WHATSAPP_ORDER_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-8 py-6 text-lg rounded-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20"
              >
                Commander
              </Button>
            </a>
          </motion.div>

          {/* NFC Card with subtle animation */}
          <motion.div 
            variants={lineVariants}
            className="mt-16 lg:mt-20 relative"
          >
            {/* Subtle glow behind card - adapts to theme */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent blur-3xl scale-150 opacity-50" />
            
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
                className="w-full max-w-md lg:max-w-lg h-auto rounded-3xl shadow-2xl shadow-black/20 dark:shadow-black/40"
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
                  className="w-16 h-16 rounded-full border-2 border-primary/40"
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
                  className="absolute inset-0 w-16 h-16 rounded-full border-2 border-primary/40"
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Minimal trust line */}
          <motion.p
            variants={lineVariants}
            className="mt-12 text-sm text-muted-foreground/70"
          >
            Compatible tous smartphones · Apple & Google Wallet
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
