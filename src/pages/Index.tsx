import { Link } from "react-router-dom";
import { ArrowRight, Smartphone, Sparkles, Users, ShoppingBag, Wifi, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import cardWhiteMinimal from "@/assets/cards/card-white-minimal.png";
import cardBlackMatte from "@/assets/cards/card-black-matte.png";
import cardGoldAccent from "@/assets/cards/card-gold-accent.png";

/**
 * Index - Page d'accueil NFC Mode
 * Design sombre, ultra-premium, focus "tap"
 * Mobile-first
 */

const Index = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white overflow-x-hidden">
      
      {/* ════════════════════════════════════════════════════════════════
         HERO — Écran sombre, slogan géant, geste tap
         ════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20 pb-16 overflow-hidden">
        {/* Background gradient subtil */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(255,255,255,0.03) 0%, transparent 60%)'
          }}
        />
        
        <div className="max-w-5xl mx-auto w-full relative z-10">
          <div className="text-center space-y-8">
            
            {/* Badge subtil */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/60">
                <Sparkles className="w-4 h-4" />
                Accessoires NFC Premium
              </span>
            </motion.div>
            
            {/* Slogan principal — très grand */}
            <motion.h1 
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <span className="block">Tape.</span>
              <span className="block">Connecte.</span>
              <span className="block text-white/40">Appartiens.</span>
            </motion.h1>
            
            {/* Sous-titre */}
            <motion.p 
              className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Accessoires NFC pour débloquer profils, réseaux, contenus exclusifs et avantages IRL.
            </motion.p>
            
            {/* CTA */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Link to="/order/offre">
                <Button 
                  size="lg" 
                  className="bg-white text-black hover:bg-white/90 font-semibold gap-2 px-8 py-6 text-base rounded-full transition-all min-h-[56px]"
                >
                  Découvrir les produits
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              
              <Button 
                variant="ghost"
                size="lg"
                className="text-white/60 hover:text-white hover:bg-white/5 px-6 py-6 text-base rounded-full"
                onClick={() => document.getElementById("tap-demo")?.scrollIntoView({ behavior: "smooth" })}
              >
                Voir le geste tap
              </Button>
            </motion.div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
            <motion.div 
              className="w-1.5 h-1.5 rounded-full bg-white/40"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
         SECTION TAP DEMO — Animation du geste
         ════════════════════════════════════════════════════════════════ */}
      <section id="tap-demo" className="py-24 px-6 scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Video démo */}
            <motion.div 
              className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-[#111]"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <video
                src="/nfc-demo-video.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
            </motion.div>
            
            {/* Texte explicatif */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Un simple tap,<br />
                <span className="text-white/40">un nouveau monde.</span>
              </h2>
              
              <div className="space-y-4 text-white/60 text-lg">
                <p>Plus de cartes papier. Plus de QR codes moches.</p>
                <p>Un seul tap pour tout montrer.</p>
              </div>
              
              {/* Étapes visuelles */}
              <div className="flex items-center gap-4 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-white/60" />
                  </div>
                  <span className="text-sm text-white/40">Approcher</span>
                </div>
                <ArrowRight className="w-4 h-4 text-white/20" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-sm">
                    TAP
                  </div>
                  <span className="text-sm text-white/40">Tap</span>
                </div>
                <ArrowRight className="w-4 h-4 text-white/20" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                    <Zap className="w-5 h-5 text-black" />
                  </div>
                  <span className="text-sm text-white/40">Connecté</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
         SECTION CAS D'USAGE — 3 blocs mode/social
         ════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-[#0D0D0D]">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Pour chaque moment
            </h2>
            <p className="text-white/50 text-lg max-w-xl mx-auto">
              Un accessoire NFC pour chaque occasion
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Soirées & festivals */}
            <motion.div 
              className="group p-8 rounded-2xl bg-[#111] border border-white/5 hover:border-white/10 transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors">
                <Users className="w-7 h-7 text-white/60" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Soirées & festivals</h3>
              <p className="text-white/50 leading-relaxed">
                Partage ton profil en un tap. Plus besoin de dicter ton @ ou d'échanger des numéros.
              </p>
            </motion.div>
            
            {/* Créateurs & marques */}
            <motion.div 
              className="group p-8 rounded-2xl bg-[#111] border border-white/5 hover:border-white/10 transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors">
                <ShoppingBag className="w-7 h-7 text-white/60" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Créateurs & marques</h3>
              <p className="text-white/50 leading-relaxed">
                Donne accès à une collection, un lookbook, un drop secret directement depuis ton accessoire.
              </p>
            </motion.div>
            
            {/* Influence & networking */}
            <motion.div 
              className="group p-8 rounded-2xl bg-[#111] border border-white/5 hover:border-white/10 transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors">
                <Sparkles className="w-7 h-7 text-white/60" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Influence & networking</h3>
              <p className="text-white/50 leading-relaxed">
                Tous tes liens dans un seul tag NFC. Instagram, TikTok, Linktree, portfolio — tout en un tap.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
         SECTION PRODUITS — 3 produits NFC max
         ════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Nos produits NFC
            </h2>
            <p className="text-white/50 text-lg max-w-xl mx-auto">
              Design mode. Technologie invisible. Impact réel.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Carte NFC Premium */}
            <motion.div 
              className="group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Link to="/order/offre" className="block">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-[#111] border border-white/5 group-hover:border-white/20 transition-all mb-4">
                  <img 
                    src={cardWhiteMinimal} 
                    alt="Carte NFC Premium blanche"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-lg font-semibold mb-1">Carte NFC Premium</h3>
                <p className="text-white/50 text-sm mb-3">Blanc minimal · PVC haute qualité</p>
                <span className="inline-flex items-center gap-2 text-sm text-white/60 group-hover:text-white transition-colors">
                  Personnaliser
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </motion.div>
            
            {/* Carte Black Edition */}
            <motion.div 
              className="group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Link to="/order/offre" className="block">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-[#111] border border-white/5 group-hover:border-white/20 transition-all mb-4">
                  <img 
                    src={cardBlackMatte} 
                    alt="Carte NFC Black Edition"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-lg font-semibold mb-1">Black Edition</h3>
                <p className="text-white/50 text-sm mb-3">Noir mat · Finition soft-touch</p>
                <span className="inline-flex items-center gap-2 text-sm text-white/60 group-hover:text-white transition-colors">
                  Personnaliser
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </motion.div>
            
            {/* Édition limitée Gold */}
            <motion.div 
              className="group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Link to="/order/offre" className="block">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-[#111] border border-white/5 group-hover:border-white/20 transition-all mb-4 relative">
                  <img 
                    src={cardGoldAccent} 
                    alt="Carte NFC Gold Edition"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Badge édition limitée */}
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-xs font-medium">
                    Édition limitée
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-1">Gold Accent</h3>
                <p className="text-white/50 text-sm mb-3">Or · Drop exclusif</p>
                <span className="inline-flex items-center gap-2 text-sm text-white/60 group-hover:text-white transition-colors">
                  Réserver
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
         SECTION CONFIANCE — Bandeau technique
         ════════════════════════════════════════════════════════════════ */}
      <section className="py-16 px-6 bg-[#0D0D0D] border-y border-white/5">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="flex flex-wrap items-center justify-center gap-8 md:gap-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 text-white/50">
              <Smartphone className="w-5 h-5" />
              <span className="text-sm">Compatible iOS & Android</span>
            </div>
            <div className="flex items-center gap-3 text-white/50">
              <Wifi className="w-5 h-5" />
              <span className="text-sm">Aucune app à installer</span>
            </div>
            <div className="flex items-center gap-3 text-white/50">
              <Shield className="w-5 h-5" />
              <span className="text-sm">Résistant à l'eau</span>
            </div>
            <div className="flex items-center gap-3 text-white/50">
              <Zap className="w-5 h-5" />
              <span className="text-sm">Programmable en secondes</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
         CTA FINAL
         ════════════════════════════════════════════════════════════════ */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2 
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Prêt à<br />
            <span className="text-white/40">te connecter ?</span>
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link to="/order/offre">
              <Button 
                size="lg" 
                className="bg-white text-black hover:bg-white/90 font-semibold gap-2 px-10 py-7 text-lg rounded-full transition-all"
              >
                Créer mon accessoire NFC
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer minimal */}
      <footer className="py-8 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/30">
          <p>© 2025 i-Wasp. Tous droits réservés.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-white/50 transition-colors">Confidentialité</Link>
            <Link to="/contact" className="hover:text-white/50 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
