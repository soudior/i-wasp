import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DigitalCard } from "@/components/DigitalCard";
import { ArrowRight, Sparkles, Wallet, Smartphone, Zap } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background effects */}
      <div className="absolute inset-0 bg-hero-glow" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '64px 64px'
      }} />

      <div className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5"
            >
              <Sparkles size={14} className="text-primary" />
              <span className="text-sm text-primary font-medium">Nouvelle génération de networking</span>
            </motion.div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Votre identité
                <br />
                <span className="text-gradient-gold">digitale premium</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                Créez des cartes de visite NFC élégantes et partagez-les instantanément. 
                Apple Wallet, Google Wallet, un simple toucher suffit.
              </p>
            </div>

            {/* Features list */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Wallet, text: "Apple & Google Wallet" },
                { icon: Smartphone, text: "NFC compatible" },
                { icon: Zap, text: "Mise à jour instantanée" },
                { icon: Sparkles, text: "Templates premium" },
              ].map((feature, index) => (
                <motion.div
                  key={feature.text}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                    <feature.icon size={18} className="text-primary" />
                  </div>
                  <span className="text-sm text-secondary-foreground">{feature.text}</span>
                </motion.div>
              ))}
            </div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/signup">
                <Button variant="hero" size="xl">
                  Créer ma carte
                  <ArrowRight size={20} />
                </Button>
              </Link>
              <Link to="/templates">
                <Button variant="heroOutline" size="xl">
                  Voir les templates
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right content - Card preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            {/* Floating card with animation */}
            <div className="animate-float">
              <DigitalCard />
            </div>
            
            {/* NFC pulse effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div className="nfc-wave w-40 h-40" style={{ animationDelay: '0s' }} />
              <div className="nfc-wave w-40 h-40" style={{ animationDelay: '0.5s' }} />
              <div className="nfc-wave w-40 h-40" style={{ animationDelay: '1s' }} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
