import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Sparkles, 
  Globe, 
  Wifi, 
  Shield, 
  Zap,
  Crown,
  Bell,
  CreditCard,
  Users,
  MapPin,
  Star,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

// Assets
import heroLounge from "@/assets/club/hero-lounge.jpg";
import worldConnected from "@/assets/club/world-connected.jpg";
import cardBlackMatte from "@/assets/cards/card-black-matte.png";

/**
 * Index — i-wasp Club
 * Private futuristic club aesthetic
 * Warm yet high-tech, exclusive yet welcoming
 */

const Index = () => {
  return (
    <div className="min-h-screen bg-[#050508] text-white overflow-x-hidden">
      
      {/* ════════════════════════════════════════════════════════════════
         HERO — Club entrance immersive
         ════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <img 
            src={heroLounge} 
            alt="i-wasp Club Lounge"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#050508]" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />
        </div>
        
        {/* Animated glow accents */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-amber-400/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
        
        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          
          {/* Club badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 backdrop-blur-sm border border-amber-500/20">
              <Crown className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium tracking-wide text-amber-200/90">
                Membership Club Mondial
              </span>
            </div>
          </motion.div>
          
          {/* Main headline */}
          <motion.h1 
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
          >
            <span className="block">Bienvenue au</span>
            <span className="block bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
              i-wasp Club
            </span>
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p 
            className="text-xl md:text-2xl text-white/60 max-w-2xl mx-auto leading-relaxed mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Un cercle exclusif de membres connectés au futur.
            <br className="hidden md:block" />
            NFC • IA • Conciergerie • Partout dans le monde.
          </motion.p>
          
          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Link to="/signup">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold gap-2 px-8 py-6 text-base rounded-full transition-all min-h-[56px] shadow-lg shadow-amber-500/25"
              >
                <Crown className="w-5 h-5" />
                Rejoindre le Club
              </Button>
            </Link>
            
            <Button 
              variant="ghost"
              size="lg"
              className="text-white/60 hover:text-white hover:bg-white/5 px-6 py-6 text-base rounded-full border border-white/10"
              onClick={() => document.getElementById("discover")?.scrollIntoView({ behavior: "smooth" })}
            >
              Découvrir les avantages
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-amber-500/30 flex items-start justify-center p-2">
            <motion.div 
              className="w-1.5 h-1.5 rounded-full bg-amber-400"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
         SECTION — Le Club Mondial
         ════════════════════════════════════════════════════════════════ */}
      <section id="discover" className="relative py-32 px-6 overflow-hidden scroll-mt-20">
        {/* World map background */}
        <div className="absolute inset-0 opacity-30">
          <img 
            src={worldConnected} 
            alt="Réseau mondial"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050508] via-transparent to-[#050508]" />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
              <Globe className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-amber-300/80">Réseau mondial</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Un club sans frontières
            </h2>
            <p className="text-xl text-white/50 max-w-2xl mx-auto">
              i-wasp est plus qu'une carte NFC. C'est une appartenance à un cercle 
              de visionnaires connectés au futur, accessible depuis n'importe où sur Terre.
            </p>
          </motion.div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {[
              { value: "50+", label: "Pays connectés" },
              { value: "10K+", label: "Membres actifs" },
              { value: "24/7", label: "Conciergerie IA" },
              { value: "∞", label: "Possibilités NFC" }
            ].map((stat, i) => (
              <motion.div 
                key={stat.label}
                className="text-center p-6 rounded-2xl bg-white/[0.02] border border-white/5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-3xl md:text-4xl font-bold text-amber-400 mb-2">{stat.value}</div>
                <div className="text-sm text-white/40">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
         SECTION — Avantages Membres
         ════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-gradient-to-b from-[#050508] to-[#0A0A0F]">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Votre membership,<br />
              <span className="text-amber-400">vos avantages</span>
            </h2>
            <p className="text-lg text-white/50 max-w-xl mx-auto">
              En rejoignant i-wasp, vous accédez à un écosystème complet d'outils et de services premium.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 - NFC Custom */}
            <motion.div 
              className="group relative p-8 rounded-3xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 hover:border-amber-500/30 transition-all duration-500"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <CreditCard className="w-7 h-7 text-amber-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Cartes NFC sur mesure</h3>
                <p className="text-white/50 leading-relaxed">
                  Cartes premium personnalisées avec votre identité. Design luxe, technologie invisible, 
                  impact immédiat.
                </p>
              </div>
            </motion.div>
            
            {/* Card 2 - AI Concierge */}
            <motion.div 
              className="group relative p-8 rounded-3xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 hover:border-amber-500/30 transition-all duration-500"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-7 h-7 text-amber-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Conciergerie IA</h3>
                <p className="text-white/50 leading-relaxed">
                  Un assistant intelligent qui optimise votre profil, suggère des améliorations et 
                  analyse vos performances.
                </p>
              </div>
            </motion.div>
            
            {/* Card 3 - Push Notifications */}
            <motion.div 
              className="group relative p-8 rounded-3xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 hover:border-amber-500/30 transition-all duration-500"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Bell className="w-7 h-7 text-amber-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Notifications Push</h3>
                <p className="text-white/50 leading-relaxed">
                  Soyez alerté en temps réel quand quelqu'un scanne votre carte ou interagit 
                  avec votre profil.
                </p>
              </div>
            </motion.div>
            
            {/* Card 4 - Global Network */}
            <motion.div 
              className="group relative p-8 rounded-3xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 hover:border-amber-500/30 transition-all duration-500"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Users className="w-7 h-7 text-amber-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Réseau exclusif</h3>
                <p className="text-white/50 leading-relaxed">
                  Connectez-vous avec des entrepreneurs, créateurs et visionnaires du monde entier. 
                  Un cercle d'exception.
                </p>
              </div>
            </motion.div>
            
            {/* Card 5 - Analytics */}
            <motion.div 
              className="group relative p-8 rounded-3xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 hover:border-amber-500/30 transition-all duration-500"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <MapPin className="w-7 h-7 text-amber-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Analytics avancés</h3>
                <p className="text-white/50 leading-relaxed">
                  Visualisez qui scanne, d'où, quand. Géolocalisation, statistiques détaillées 
                  et insights précieux.
                </p>
              </div>
            </motion.div>
            
            {/* Card 6 - Security */}
            <motion.div 
              className="group relative p-8 rounded-3xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 hover:border-amber-500/30 transition-all duration-500"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="w-7 h-7 text-amber-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Sécurité maximale</h3>
                <p className="text-white/50 leading-relaxed">
                  Vos données sont protégées. Chiffrement de bout en bout, contrôle total 
                  sur ce que vous partagez.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
         SECTION — La Carte Membre
         ════════════════════════════════════════════════════════════════ */}
      <section className="py-32 px-6 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[150px]" />
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Card visual */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative aspect-[1.6/1] max-w-md mx-auto">
                {/* Glow behind card */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/30 to-amber-600/10 rounded-3xl blur-2xl transform rotate-6" />
                
                {/* Card image */}
                <img 
                  src={cardBlackMatte} 
                  alt="Carte membre i-wasp"
                  className="relative w-full h-full object-contain drop-shadow-2xl transform hover:rotate-2 hover:scale-105 transition-transform duration-500"
                />
                
                {/* Floating elements */}
                <motion.div 
                  className="absolute -top-4 -right-4 px-3 py-1.5 rounded-full bg-amber-500/20 backdrop-blur-sm border border-amber-500/30 text-xs font-medium text-amber-300"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Zap className="w-3 h-3 inline mr-1" />
                  NFC Activé
                </motion.div>
              </div>
            </motion.div>
            
            {/* Text content */}
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/60 mb-6">
                  <Star className="w-3 h-3 text-amber-400" />
                  Édition Premium
                </div>
                
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                  Votre passeport vers<br />
                  <span className="text-amber-400">l'avenir</span>
                </h2>
                
                <p className="text-lg text-white/50 leading-relaxed">
                  Chaque carte i-wasp est unique. Personnalisée avec votre identité, 
                  programmée avec votre univers. Un simple tap pour partager tout ce qui compte.
                </p>
              </div>
              
              {/* Features list */}
              <div className="space-y-4">
                {[
                  "Design premium personnalisé",
                  "Technologie NFC haute fréquence",
                  "Profil digital illimité",
                  "Support Apple & Google Wallet"
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center">
                      <Zap className="w-3 h-3 text-amber-400" />
                    </div>
                    <span className="text-white/70">{feature}</span>
                  </div>
                ))}
              </div>
              
              <Link to="/order/offre">
                <Button 
                  size="lg" 
                  className="bg-white text-black hover:bg-white/90 font-semibold gap-2 px-8 py-6 text-base rounded-full"
                >
                  Créer ma carte
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
         SECTION — CTA Final
         ════════════════════════════════════════════════════════════════ */}
      <section className="py-32 px-6 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0F] to-[#050508]" />
        <div className="absolute inset-0 bg-[url('/pattern-circuit.svg')] opacity-5" />
        
        {/* Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-400/5 rounded-full blur-[120px]" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-8">
              <Crown className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-amber-300/80">Rejoignez le cercle</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Prêt à appartenir<br />
              <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                au futur ?
              </span>
            </h2>
            
            <p className="text-xl text-white/50 max-w-2xl mx-auto mb-10">
              Rejoignez plus de 10 000 membres qui ont déjà choisi i-wasp pour 
              connecter, impressionner et se démarquer.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold gap-2 px-10 py-7 text-lg rounded-full transition-all shadow-lg shadow-amber-500/25"
                >
                  <Crown className="w-5 h-5" />
                  Devenir membre
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              
              <Link to="/demo">
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-white/20 text-white hover:bg-white/5 px-8 py-7 text-lg rounded-full"
                >
                  Voir une démo
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
         FOOTER — Minimal
         ════════════════════════════════════════════════════════════════ */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <Wifi className="w-4 h-4 text-black" />
            </div>
            <span className="font-semibold tracking-tight">i-wasp</span>
          </div>
          
          <div className="flex items-center gap-8 text-sm text-white/40">
            <Link to="/about" className="hover:text-white transition-colors">À propos</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Confidentialité</Link>
          </div>
          
          <div className="text-sm text-white/30">
            © 2025 i-wasp. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
