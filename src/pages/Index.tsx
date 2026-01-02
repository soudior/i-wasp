import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CreditCard, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import nfcDemoVideo from "@/assets/nfc-demo-video.mp4";
import nailsDemoVideo from "@/assets/nails/nails-demo-video.mp4";

/**
 * Index - Page d'accueil Dual-Power i-wasp
 * 
 * Sélecteur élégant Carte/Ongle avec transitions premium.
 * Design luxueux noir & or.
 */

type ProductMode = "carte" | "ongle";

const productContent = {
  carte: {
    video: nfcDemoVideo,
    tagline: "L'icône du networking professionnel.",
    description: "Minimaliste, puissante, éternelle.",
    cta: "Commander ma Carte",
    route: "/order/type",
  },
  ongle: {
    video: nailsDemoVideo,
    tagline: "L'innovation invisible.",
    description: "Votre réseau au bout des doigts, sous votre vernis.",
    cta: "Commander mon Pack Nails",
    route: "/nails",
  },
};

const Index = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<ProductMode>("carte");
  const content = productContent[mode];

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-20">
        <div className="max-w-xl mx-auto text-center space-y-8">
          
          {/* Titre Principal */}
          <div className="space-y-3">
            <h1 className="font-playfair text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              i-wasp : Connectez-vous
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">
                d'un simple geste.
              </span>
            </h1>
            <p className="text-zinc-400 text-base md:text-lg font-light">
              La première technologie NFC invisible au Maroc pour cartes et ongles.
            </p>
          </div>

          {/* Sélecteur Carte / Ongle */}
          <div className="flex justify-center">
            <div className="inline-flex bg-zinc-900/80 backdrop-blur-sm p-1.5 rounded-2xl border border-zinc-800">
              <button
                onClick={() => setMode("carte")}
                className={`relative flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                  mode === "carte"
                    ? "text-black"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {mode === "carte" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <CreditCard className="w-4 h-4 relative z-10" />
                <span className="relative z-10">La Carte i-wasp</span>
              </button>
              
              <button
                onClick={() => setMode("ongle")}
                className={`relative flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                  mode === "ongle"
                    ? "text-black"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {mode === "ongle" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Sparkles className="w-4 h-4 relative z-10" />
                <span className="relative z-10">L'Ongle i-wasp</span>
              </button>
            </div>
          </div>

          {/* Vidéo avec transition */}
          <div className="relative mx-auto max-w-xs">
            {/* Ombre dorée flottante */}
            <motion.div 
              className="absolute inset-0 rounded-[2rem] blur-3xl opacity-40"
              animate={{
                background: mode === "carte" 
                  ? 'radial-gradient(ellipse at center, rgba(251, 191, 36, 0.6) 0%, rgba(245, 158, 11, 0.3) 40%, transparent 70%)'
                  : 'radial-gradient(ellipse at center, rgba(236, 72, 153, 0.5) 0%, rgba(251, 191, 36, 0.4) 40%, transparent 70%)',
              }}
              transition={{ duration: 0.5 }}
              style={{ transform: 'translateY(8px) scale(1.05)' }}
            />
            
            {/* Cadre smartphone premium */}
            <div className="relative bg-gradient-to-b from-zinc-800 to-zinc-900 p-1.5 rounded-[2rem] shadow-2xl overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.video
                  key={mode}
                  src={content.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full aspect-[9/16] object-cover rounded-[1.75rem]"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                />
              </AnimatePresence>
            </div>
          </div>

          {/* Tagline dynamique */}
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-1"
            >
              <p className="text-amber-400 font-medium text-lg">{content.tagline}</p>
              <p className="text-zinc-500 text-sm">{content.description}</p>
            </motion.div>
          </AnimatePresence>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:via-yellow-500 hover:to-amber-600 text-black font-semibold gap-2 px-8 py-6 text-base rounded-xl shadow-lg shadow-amber-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/40 hover:scale-[1.02]"
              onClick={() => navigate("/order/type")}
            >
              <CreditCard className="w-4 h-4" />
              Commander ma Carte
            </Button>
            
            <Button 
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-pink-500 via-rose-400 to-amber-400 hover:from-pink-600 hover:via-rose-500 hover:to-amber-500 text-black font-semibold gap-2 px-8 py-6 text-base rounded-xl shadow-lg shadow-pink-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/40 hover:scale-[1.02]"
              onClick={() => navigate("/nails")}
            >
              <Sparkles className="w-4 h-4" />
              Commander mon Pack Nails
            </Button>
          </div>

          {/* Signature subtile */}
          <p className="text-zinc-600 text-sm font-light tracking-widest uppercase pt-4">
            i-wasp · Tap. Connect. Empower.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Index;
