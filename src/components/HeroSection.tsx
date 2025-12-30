import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import nfcCardWaxSeal from "@/assets/nfc-card-wax-seal.png";
import nfcEnvelopesLuxury from "@/assets/nfc-envelopes-luxury.png";

const stats = [
  { value: "10K+", label: "Professionnels" },
  { value: "4.9/5", label: "Note moyenne" },
  { value: "50K+", label: "Cartes créées" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Premium dark background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-background" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-gradient-radial from-amber-500/[0.08] via-amber-600/[0.03] to-transparent blur-3xl" />
      <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] rounded-full bg-amber-500/[0.04] blur-[150px]" />
      <div className="absolute bottom-1/4 -right-40 w-[400px] h-[400px] rounded-full bg-amber-600/[0.03] blur-[120px]" />
      <div className="absolute inset-0 bg-grid opacity-20" />

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          <div className="space-y-8 max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20"
            >
              <Sparkles size={14} className="text-amber-400" />
              <span className="text-sm text-amber-400 font-medium">Technologie NFC Premium</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-display font-semibold leading-[1.1] tracking-tight"
            >
              <span className="text-white">Carte NFC IWASP</span>
              <br />
              <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent">
                votre identité pro en un geste
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-lg text-white/70 leading-relaxed"
            >
              Partagez vos coordonnées instantanément. Compatible Apple Wallet, Google Wallet, 
              et tous les smartphones NFC. Un simple toucher suffit.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-wrap gap-4 pt-2"
            >
              <Link to="/order">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-background font-semibold px-8 py-6 rounded-full shadow-lg shadow-amber-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/30 hover:scale-105"
                >
                  Commander une carte
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
              <Link to="/demo">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white/20 text-white hover:border-white/40 hover:bg-white/5 px-8 py-6 rounded-full font-medium transition-all duration-300"
                >
                  Voir une démo
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex items-center gap-8 pt-6 border-t border-white/10"
            >
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl font-display font-semibold text-white">{stat.value}</p>
                  <p className="text-xs text-white/50 mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Premium Visual - Luxury card with wax seal */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative"
          >
            <div className="relative">
              {/* Glow effect behind card */}
              <div className="absolute inset-0 bg-gradient-radial from-amber-500/20 via-transparent to-transparent blur-3xl scale-110" />
              
              {/* Main card image - premium black matte with wax seal */}
              <motion.img
                src={nfcCardWaxSeal}
                alt="Carte NFC IWASP premium noir mat avec cachet de cire"
                className="relative z-10 w-full h-auto rounded-3xl shadow-2xl shadow-black/50"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
              
              {/* Floating luxury envelopes */}
              <motion.div
                className="absolute -bottom-8 -right-8 lg:-right-16 w-40 lg:w-56 z-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <motion.img
                  src={nfcEnvelopesLuxury}
                  alt="Enveloppes NFC premium avec cachet de cire"
                  className="w-full h-auto rounded-2xl shadow-xl shadow-black/40"
                  animate={{ y: [0, -6, 0], rotate: [0, 1, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                />
              </motion.div>
              
              {/* Premium badge */}
              <motion.div
                className="absolute top-4 right-4 lg:top-8 lg:right-8 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-sm border border-amber-500/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-xs font-medium text-amber-400">NFC Premium</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
