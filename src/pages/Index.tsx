import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Users, 
  Bell, 
  Shield, 
  Check,
  Star,
  Globe,
  Leaf,
  Send,
  Target,
  BarChart3,
  Smartphone,
  Palette,
  Eye,
  MapPin,
  TrendingUp,
  Lock,
  Crown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ClubNavbar } from "@/components/ClubNavbar";
import { GlobalFooter } from "@/components/GlobalFooter";

const WHATSAPP_PROJECT_URL = "https://wa.me/33626424394?text=Bonjour%20👋%0AJe%20souhaite%20lancer%20mon%20projet%20NFC%20avec%20i-wasp.";

// Section navigation
const sections = [
  { id: "lobby", label: "Lobby" },
  { id: "arsenal", label: "Arsenal" },
  { id: "identite", label: "Identité" },
  { id: "monde", label: "Monde" },
  { id: "heritage", label: "Héritage" },
  { id: "sanctuaire", label: "Sanctuaire" },
];

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  return (
    <div ref={containerRef} className="relative">
      <ClubNavbar />
      
      {/* Fixed section indicator */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="group flex items-center gap-3"
          >
            <span className="text-xs text-iwasp-silver/50 group-hover:text-iwasp-bronze transition-colors opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">
              {section.label}
            </span>
            <div className="w-2 h-2 rounded-full bg-iwasp-silver/20 group-hover:bg-iwasp-bronze group-hover:scale-125 transition-all" />
          </a>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 1: LE LOBBY — Choc émotionnel, espace vide luxueux
          Palette: Midnight Emerald & Bronze
          ═══════════════════════════════════════════════════════════════════ */}
      <section 
        id="lobby"
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-iwasp-midnight"
      >
        {/* Ambient effects */}
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-iwasp-emerald/8 rounded-full blur-[200px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-iwasp-bronze/6 rounded-full blur-[180px]" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `linear-gradient(hsl(160 45% 33% / 0.4) 1px, transparent 1px),
                              linear-gradient(90deg, hsl(160 45% 33% / 0.4) 1px, transparent 1px)`,
            backgroundSize: '80px 80px'
          }}
        />
        
        <div className="relative z-10 container mx-auto px-6 text-center pt-32 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-5xl mx-auto"
          >
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-iwasp-emerald/10 border border-iwasp-emerald/20 mb-12"
            >
              <div className="w-2 h-2 rounded-full bg-iwasp-emerald-glow animate-pulse" />
              <span className="text-sm tracking-[0.2em] uppercase text-iwasp-silver">
                L'Identité Absolue
              </span>
            </motion.div>
            
            {/* Giant typography */}
            <h1 className="font-display text-6xl sm:text-7xl lg:text-[10rem] font-normal leading-[0.9] mb-12">
              <span className="block text-iwasp-cream">Dominez</span>
              <span className="block text-iwasp-cream">votre</span>
              <span className="block italic text-transparent bg-clip-text bg-gradient-to-r from-iwasp-bronze via-iwasp-bronze-light to-iwasp-bronze">
                Destin.
              </span>
            </h1>
            
            {/* Tagline with accent bar */}
            <div className="flex items-start justify-center mb-16">
              <div className="w-px h-24 bg-gradient-to-b from-iwasp-bronze to-transparent mr-8 hidden sm:block" />
              <p className="text-xl sm:text-2xl text-iwasp-silver max-w-2xl text-left leading-relaxed font-light">
                i-Wasp n'est pas un produit. C'est votre héritage digital. 
                Une pression unique pour synchroniser votre influence mondiale.
              </p>
            </div>
            
            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <a href={WHATSAPP_PROJECT_URL} target="_blank" rel="noopener noreferrer">
                <Button 
                  size="lg" 
                  className="bg-iwasp-bronze hover:bg-iwasp-bronze-light text-iwasp-midnight font-semibold px-12 py-8 rounded-2xl text-lg gap-4 tracking-[0.1em] uppercase shadow-2xl hover:shadow-iwasp-bronze/20 transition-all duration-500"
                >
                  Commencer l'ascension
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </a>
            </motion.div>
          </motion.div>
          
          {/* Scroll indicator */}
          <motion.div 
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-6 h-14 rounded-full border border-iwasp-emerald/30 flex items-start justify-center p-2">
              <div className="w-1 h-4 rounded-full bg-iwasp-bronze" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 2: L'ARSENAL — Puissance technologique
          Push, Leads, Ads — Le tunnel de vente
          ═══════════════════════════════════════════════════════════════════ */}
      <section 
        id="arsenal"
        className="relative py-32 overflow-hidden bg-gradient-to-b from-iwasp-midnight via-iwasp-midnight-elevated to-iwasp-midnight"
      >
        {/* Tech grid effect */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(160 45% 33%) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="text-iwasp-emerald-glow text-sm tracking-[0.3em] uppercase mb-4 block">
              L'Arsenal
            </span>
            <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl font-normal mb-8">
              <span className="text-iwasp-cream">La carte n'est que</span>
              <br />
              <span className="italic text-iwasp-bronze">la porte d'entrée.</span>
            </h2>
            <p className="text-iwasp-silver text-xl max-w-3xl mx-auto leading-relaxed">
              Derrière chaque tap se cache un tunnel de vente complet. 
              Push notifications, scoring de leads, retargeting publicitaire.
            </p>
          </motion.div>
          
          {/* Arsenal features grid */}
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Bell,
                title: "Push Notifications",
                subtitle: "Restez dans leur esprit",
                description: "Chaque personne qui tape votre carte devient joignable. Envoyez des messages ciblés, des offres exclusives, des rappels.",
                stats: "3x plus de rappels clients"
              },
              {
                icon: Target,
                title: "Lead Scoring IA",
                subtitle: "Triez l'or du sable",
                description: "Notre IA analyse chaque interaction et attribue un score à vos prospects. Focalisez-vous sur ceux qui comptent.",
                stats: "87% de conversion en plus"
              },
              {
                icon: TrendingUp,
                title: "Retargeting Ads",
                subtitle: "Reconquérez les indécis",
                description: "Synchronisez vos leads avec vos campagnes Meta, Google, LinkedIn. Créez des audiences sur mesure automatiquement.",
                stats: "Audiences qualifiées"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="group relative p-8 rounded-3xl bg-gradient-to-b from-iwasp-emerald/10 to-transparent border border-iwasp-emerald/20 hover:border-iwasp-bronze/40 transition-all duration-500"
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-3xl bg-iwasp-bronze/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-iwasp-emerald/20 border border-iwasp-emerald/30 flex items-center justify-center mb-6 group-hover:bg-iwasp-bronze/20 group-hover:border-iwasp-bronze/40 transition-all duration-500">
                    <feature.icon className="w-8 h-8 text-iwasp-emerald-glow group-hover:text-iwasp-bronze transition-colors duration-500" />
                  </div>
                  
                  <span className="text-iwasp-silver/60 text-xs tracking-[0.2em] uppercase">{feature.subtitle}</span>
                  <h3 className="font-display text-2xl font-normal text-iwasp-cream mt-2 mb-4">{feature.title}</h3>
                  <p className="text-iwasp-silver leading-relaxed mb-6">{feature.description}</p>
                  
                  <div className="pt-4 border-t border-iwasp-emerald/10">
                    <span className="text-iwasp-bronze font-medium">{feature.stats}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 3: L'IDENTITÉ — Focus visuel et social
          Stories, modification instantanée, objet physique + digital
          ═══════════════════════════════════════════════════════════════════ */}
      <section 
        id="identite"
        className="relative py-32 overflow-hidden bg-iwasp-midnight-elevated"
      >
        {/* Bronze ambient glow */}
        <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-iwasp-bronze/8 rounded-full blur-[200px] -translate-y-1/2" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-iwasp-bronze text-sm tracking-[0.3em] uppercase mb-4 block">
                L'Identité
              </span>
              <h2 className="font-display text-5xl sm:text-6xl font-normal mb-8 leading-tight">
                <span className="text-iwasp-cream">Votre visage.</span>
                <br />
                <span className="italic text-iwasp-bronze">Partout.</span>
              </h2>
              <p className="text-iwasp-silver text-lg leading-relaxed mb-10">
                Stories éphémères, photos dynamiques, informations modifiables en temps réel. 
                Votre carte physique est vivante, connectée à votre identité digitale.
              </p>
              
              {/* Features list */}
              <div className="space-y-6">
                {[
                  { icon: Eye, text: "Stories visibles 24h sur votre profil" },
                  { icon: Smartphone, text: "Modification instantanée depuis l'app" },
                  { icon: Palette, text: "Design personnalisable sans limite" },
                ].map((item, index) => (
                  <motion.div
                    key={item.text}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-iwasp-bronze/10 border border-iwasp-bronze/20 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-iwasp-bronze" />
                    </div>
                    <span className="text-iwasp-cream">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            {/* Right: Card mockup */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Phone mockup with card */}
              <div className="relative mx-auto w-72 sm:w-80">
                {/* Glow behind */}
                <div className="absolute inset-0 bg-iwasp-bronze/20 rounded-[3rem] blur-3xl" />
                
                {/* Phone frame */}
                <div className="relative bg-iwasp-midnight rounded-[2.5rem] p-3 border border-iwasp-bronze/30">
                  {/* Screen */}
                  <div className="bg-gradient-to-b from-iwasp-midnight-elevated to-iwasp-midnight rounded-[2rem] overflow-hidden aspect-[9/16] relative">
                    {/* Dynamic island */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full" />
                    
                    {/* Profile content */}
                    <div className="pt-16 px-6 text-center">
                      {/* Avatar ring */}
                      <div className="w-24 h-24 rounded-full mx-auto mb-4 relative">
                        <div className="absolute inset-0 rounded-full border-2 border-iwasp-bronze animate-pulse" />
                        <div className="absolute inset-1 rounded-full bg-gradient-to-br from-iwasp-silver/20 to-iwasp-silver/5" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Crown className="w-10 h-10 text-iwasp-bronze" />
                        </div>
                      </div>
                      
                      <h3 className="font-display text-xl text-iwasp-cream italic mb-1">Vincenzo Wasp</h3>
                      <p className="text-xs text-iwasp-silver tracking-[0.15em] uppercase">Founding Partner</p>
                      
                      {/* Story indicators */}
                      <div className="flex justify-center gap-2 mt-6">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="w-12 h-12 rounded-lg bg-iwasp-emerald/20 border border-iwasp-emerald/30" />
                        ))}
                      </div>
                      
                      {/* Status */}
                      <div className="mt-8 p-4 rounded-xl bg-iwasp-emerald/10 border border-iwasp-emerald/20">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-iwasp-silver">Influence Map</span>
                          <span className="text-iwasp-emerald-glow">Active</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 4: LE MONDE — Bleu Abysse, évasion et contrôle global
          Géolocalisation comme carte de conquête mondiale
          ═══════════════════════════════════════════════════════════════════ */}
      <section 
        id="monde"
        className="relative py-32 overflow-hidden bg-iwasp-abyss"
      >
        {/* Ocean glow effects */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-iwasp-ocean/10 rounded-full blur-[200px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-iwasp-abyss-glow/20 rounded-full blur-[150px]" />
        
        {/* World grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(circle, hsl(217 91% 60% / 0.3) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="text-iwasp-ocean text-sm tracking-[0.3em] uppercase mb-4 block">
              Le Monde
            </span>
            <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl font-normal mb-8">
              <span className="italic text-iwasp-ocean">Une Présence</span>
              <br />
              <span className="text-white uppercase tracking-[0.1em]">Sans Frontières.</span>
            </h2>
            <p className="text-white/60 text-xl max-w-3xl mx-auto leading-relaxed">
              Gérez votre flotte de cartes NFC et vos points d'impact sur une carte mondiale interactive. 
              Chaque tap est une donnée précieuse, chaque connexion un territoire conquis.
            </p>
          </motion.div>
          
          {/* World map visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative max-w-5xl mx-auto mb-16"
          >
            <div className="aspect-[16/9] rounded-3xl bg-gradient-to-b from-iwasp-abyss-light to-iwasp-abyss border border-iwasp-ocean/20 overflow-hidden relative">
              {/* Fake world map dots */}
              <div className="absolute inset-0">
                {/* Connection points */}
                {[
                  { top: '30%', left: '20%' },
                  { top: '40%', left: '45%' },
                  { top: '35%', left: '75%' },
                  { top: '55%', left: '30%' },
                  { top: '60%', left: '60%' },
                  { top: '25%', left: '55%' },
                  { top: '50%', left: '85%' },
                ].map((pos, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{ top: pos.top, left: pos.left }}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  >
                    <div className="w-3 h-3 rounded-full bg-iwasp-ocean" />
                    <div className="absolute inset-0 w-3 h-3 rounded-full bg-iwasp-ocean animate-ping" />
                  </motion.div>
                ))}
                
                {/* Connection lines */}
                <svg className="absolute inset-0 w-full h-full">
                  <line x1="20%" y1="30%" x2="45%" y2="40%" stroke="hsl(217 91% 60% / 0.2)" strokeWidth="1" />
                  <line x1="45%" y1="40%" x2="75%" y2="35%" stroke="hsl(217 91% 60% / 0.2)" strokeWidth="1" />
                  <line x1="45%" y1="40%" x2="30%" y2="55%" stroke="hsl(217 91% 60% / 0.2)" strokeWidth="1" />
                  <line x1="45%" y1="40%" x2="60%" y2="60%" stroke="hsl(217 91% 60% / 0.2)" strokeWidth="1" />
                </svg>
              </div>
              
              {/* Stats overlay */}
              <div className="absolute bottom-6 left-6 right-6 flex justify-between">
                {[
                  { value: "47", label: "Pays" },
                  { value: "12.4K", label: "Connexions" },
                  { value: "Live", label: "Tracking" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-3xl font-display text-iwasp-ocean">{stat.value}</div>
                    <div className="text-xs text-white/40 uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
          
          {/* Features */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Globe, title: "Géolocalisation Live", desc: "Tracez l'origine de chaque scan en temps réel." },
              { icon: MapPin, title: "Points d'Impact", desc: "Visualisez votre rayonnement sur une carte mondiale." },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4 p-6 rounded-2xl bg-iwasp-abyss-light/50 border border-iwasp-ocean/20"
              >
                <div className="w-12 h-12 rounded-xl bg-iwasp-ocean/20 border border-iwasp-ocean/30 flex items-center justify-center shrink-0">
                  <item.icon className="w-6 h-6 text-iwasp-ocean" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                  <p className="text-white/60 text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 5: L'HÉRITAGE — Blanc Perle/Sable, durabilité
          Luxe noble, zéro papier, sans impact
          ═══════════════════════════════════════════════════════════════════ */}
      <section 
        id="heritage"
        className="relative py-32 overflow-hidden bg-iwasp-pearl"
      >
        {/* Soft warm glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-iwasp-bronze/10 rounded-full blur-[150px]" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            {/* Left: Visual */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <div className="relative">
                {/* Card visual */}
                <div className="relative mx-auto w-80 aspect-[1.6/1] rounded-2xl bg-gradient-to-br from-iwasp-sand to-iwasp-pearl border border-iwasp-sand-warm shadow-2xl shadow-iwasp-stone/10">
                  {/* Card content */}
                  <div className="absolute inset-6 flex flex-col justify-between">
                    <div className="flex items-center gap-2">
                      <Crown className="w-6 h-6 text-iwasp-stone" />
                      <span className="font-display text-lg text-iwasp-stone italic">iW.</span>
                    </div>
                    <div>
                      <div className="text-xs text-iwasp-stone/60 uppercase tracking-wider mb-1">NFC Card</div>
                      <div className="text-iwasp-stone font-medium">Eco Premium</div>
                    </div>
                  </div>
                  
                  {/* Leaf accent */}
                  <div className="absolute top-4 right-4">
                    <Leaf className="w-8 h-8 text-iwasp-emerald-glow/40" />
                  </div>
                </div>
                
                {/* Floating stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="absolute -bottom-8 -right-8 bg-white rounded-2xl p-5 shadow-xl border border-iwasp-sand"
                >
                  <div className="text-3xl font-display text-iwasp-emerald mb-1">0</div>
                  <div className="text-xs text-iwasp-stone uppercase tracking-wider">Arbres coupés</div>
                </motion.div>
              </div>
            </motion.div>
            
            {/* Right: Content */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <span className="text-iwasp-emerald text-sm tracking-[0.3em] uppercase mb-4 block">
                L'Héritage
              </span>
              <h2 className="font-display text-5xl sm:text-6xl font-normal mb-8 leading-tight text-iwasp-midnight">
                <span>Le luxe peut être</span>
                <br />
                <span className="italic text-iwasp-emerald">noble.</span>
              </h2>
              <p className="text-iwasp-stone text-lg leading-relaxed mb-10">
                Zéro papier, zéro impression. Une seule carte NFC remplace des milliers de cartes de visite traditionnelles. 
                Votre élégance n'a pas à coûter à la planète.
              </p>
              
              {/* Eco stats */}
              <div className="grid grid-cols-3 gap-6">
                {[
                  { value: "10K+", label: "Cartes papier économisées" },
                  { value: "100%", label: "Recyclable" },
                  { value: "∞", label: "Mises à jour" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-2xl font-display text-iwasp-emerald">{stat.value}</div>
                    <div className="text-xs text-iwasp-stone/70 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 6: LE SANCTUAIRE — Dashboard membres
          Gestion, statistiques, vision globale
          ═══════════════════════════════════════════════════════════════════ */}
      <section 
        id="sanctuaire"
        className="relative py-32 overflow-hidden bg-iwasp-midnight"
      >
        {/* Premium glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-iwasp-bronze/8 rounded-full blur-[200px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-iwasp-emerald/10 rounded-full blur-[150px]" />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-iwasp-bronze text-sm tracking-[0.3em] uppercase mb-4 block">
              Le Sanctuaire
            </span>
            <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl font-normal mb-8">
              <span className="text-iwasp-cream">Votre</span>
              <br />
              <span className="italic text-iwasp-bronze">Centre de Contrôle.</span>
            </h2>
            <p className="text-iwasp-silver text-xl max-w-2xl mx-auto leading-relaxed">
              Un espace réservé à l'élite. Gérez vos statistiques, modifiez vos informations, 
              et visualisez vos conquêtes mondiales en temps réel.
            </p>
          </motion.div>
          
          {/* Dashboard preview */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <div className="relative">
              {/* Glow behind */}
              <div className="absolute inset-0 bg-iwasp-bronze/10 rounded-3xl blur-3xl" />
              
              {/* Dashboard mockup */}
              <div className="relative bg-iwasp-midnight-elevated rounded-3xl border border-iwasp-bronze/20 overflow-hidden">
                {/* Header bar */}
                <div className="flex items-center justify-between p-6 border-b border-iwasp-emerald/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-iwasp-bronze flex items-center justify-center">
                      <Crown className="w-5 h-5 text-iwasp-midnight" />
                    </div>
                    <span className="font-display text-lg text-iwasp-cream italic">iW. Dashboard</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-iwasp-silver">
                      <div className="w-2 h-2 rounded-full bg-iwasp-emerald-glow animate-pulse" />
                      Live
                    </div>
                    <div className="w-8 h-8 rounded-full bg-iwasp-emerald/20 border border-iwasp-emerald/30" />
                  </div>
                </div>
                
                {/* Dashboard content */}
                <div className="p-8 grid grid-cols-4 gap-6">
                  {/* Stats cards */}
                  {[
                    { label: "Scans ce mois", value: "1,247", trend: "+23%" },
                    { label: "Leads générés", value: "89", trend: "+12%" },
                    { label: "Taux de conversion", value: "7.1%", trend: "+0.8%" },
                    { label: "Pays atteints", value: "12", trend: "+3" },
                  ].map((stat, index) => (
                    <div key={stat.label} className="p-5 rounded-2xl bg-iwasp-midnight border border-iwasp-emerald/10">
                      <div className="text-xs text-iwasp-silver/60 uppercase tracking-wider mb-2">{stat.label}</div>
                      <div className="flex items-end justify-between">
                        <span className="text-2xl font-display text-iwasp-cream">{stat.value}</span>
                        <span className="text-xs text-iwasp-emerald-glow">{stat.trend}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Lock overlay for non-members */}
                <div className="absolute inset-0 bg-iwasp-midnight/80 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center">
                    <Lock className="w-12 h-12 text-iwasp-bronze mx-auto mb-4" />
                    <h3 className="text-xl font-display text-iwasp-cream mb-2">Réservé aux membres</h3>
                    <p className="text-iwasp-silver text-sm mb-6">Rejoignez le club pour accéder au Sanctuaire</p>
                    <Link to="/signup">
                      <Button className="bg-iwasp-bronze hover:bg-iwasp-bronze-light text-iwasp-midnight font-semibold px-8 py-6 rounded-xl tracking-wide uppercase">
                        Rejoindre l'élite
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Final CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-24"
          >
            <p className="text-iwasp-silver mb-8">
              Prêt à transformer votre présence digitale ?
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href={WHATSAPP_PROJECT_URL} target="_blank" rel="noopener noreferrer">
                <Button 
                  size="lg" 
                  className="bg-iwasp-bronze hover:bg-iwasp-bronze-light text-iwasp-midnight font-semibold px-10 py-7 rounded-2xl text-lg gap-3 tracking-[0.08em] uppercase"
                >
                  Commencer l'ascension
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </a>
              <Link to="/contact">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-iwasp-emerald/30 text-iwasp-cream hover:bg-iwasp-emerald/10 px-10 py-7 rounded-2xl text-lg"
                >
                  Nous contacter
                </Button>
              </Link>
            </div>
            
            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-8 mt-12 text-iwasp-silver text-sm">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-iwasp-emerald-glow" />
                <span>Sans engagement</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-iwasp-emerald-glow" />
                <span>Devis gratuit</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-iwasp-emerald-glow" />
                <span>Accompagnement humain</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      <GlobalFooter />
    </div>
  );
};

export default Index;
