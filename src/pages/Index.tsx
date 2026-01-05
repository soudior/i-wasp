/**
 * Index / Home Page — i-wasp Landing
 * 
 * Palette Stealth Luxury:
 * - Noir Émeraude: #050807
 * - Argent Titane: #A5A9B4
 * - Platine: #D1D5DB
 */

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

// Stealth Luxury Colors
const STEALTH = {
  noir: "#050807",
  noirElevated: "#0A0F0D",
  titanium: "#A5A9B4",
  platinum: "#D1D5DB",
  emeraldGlow: "#1A2B26",
  emeraldSubtle: "#0F1A17",
};

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
    <div ref={containerRef} className="relative" style={{ backgroundColor: STEALTH.noir }}>
      <ClubNavbar />
      
      {/* Fixed section indicator */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="group flex items-center gap-3"
          >
            <span 
              className="text-xs opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"
              style={{ color: `${STEALTH.titanium}80` }}
            >
              {section.label}
            </span>
            <div 
              className="w-2 h-2 rounded-full transition-all group-hover:scale-125"
              style={{ backgroundColor: `${STEALTH.titanium}40` }}
            />
          </a>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 1: LE LOBBY — Choc émotionnel, espace vide luxueux
          ═══════════════════════════════════════════════════════════════════ */}
      <section 
        id="lobby"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: STEALTH.noir }}
      >
        {/* Ambient effects - Titane subtil */}
        <div 
          className="absolute top-0 left-1/4 w-[800px] h-[800px] rounded-full blur-[200px]"
          style={{ backgroundColor: `${STEALTH.titanium}08` }}
        />
        <div 
          className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full blur-[180px]"
          style={{ backgroundColor: `${STEALTH.emeraldGlow}30` }}
        />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `linear-gradient(${STEALTH.titanium}40 1px, transparent 1px),
                              linear-gradient(90deg, ${STEALTH.titanium}40 1px, transparent 1px)`,
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
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full border mb-12"
              style={{ 
                backgroundColor: `${STEALTH.titanium}10`,
                borderColor: `${STEALTH.titanium}20`
              }}
            >
              <div 
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: STEALTH.platinum }}
              />
              <span 
                className="text-sm tracking-[0.2em] uppercase"
                style={{ color: STEALTH.titanium }}
              >
                L'Identité Absolue
              </span>
            </motion.div>
            
            {/* Giant typography */}
            <h1 className="font-display text-6xl sm:text-7xl lg:text-[10rem] font-normal leading-[0.9] mb-12">
              <span className="block text-white">Dominez</span>
              <span className="block text-white">votre</span>
              <span 
                className="block italic text-transparent bg-clip-text"
                style={{ 
                  backgroundImage: `linear-gradient(135deg, ${STEALTH.titanium}, ${STEALTH.platinum})`
                }}
              >
                Destin.
              </span>
            </h1>
            
            {/* Tagline with accent bar */}
            <div className="flex items-start justify-center mb-16">
              <div 
                className="w-px h-24 mr-8 hidden sm:block"
                style={{ background: `linear-gradient(to bottom, ${STEALTH.titanium}, transparent)` }}
              />
              <p 
                className="text-xl sm:text-2xl max-w-2xl text-left leading-relaxed font-light"
                style={{ color: STEALTH.titanium }}
              >
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
                  className="font-semibold px-12 py-8 rounded-2xl text-lg gap-4 tracking-[0.1em] uppercase shadow-2xl transition-all duration-500"
                  style={{ 
                    background: `linear-gradient(135deg, ${STEALTH.titanium}, ${STEALTH.platinum})`,
                    color: STEALTH.noir
                  }}
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
            <div 
              className="w-6 h-14 rounded-full border flex items-start justify-center p-2"
              style={{ borderColor: `${STEALTH.titanium}30` }}
            >
              <div 
                className="w-1 h-4 rounded-full"
                style={{ backgroundColor: STEALTH.titanium }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 2: L'ARSENAL — Puissance technologique
          ═══════════════════════════════════════════════════════════════════ */}
      <section 
        id="arsenal"
        className="relative py-32 overflow-hidden"
        style={{ backgroundColor: STEALTH.noirElevated }}
      >
        {/* Tech grid effect */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, ${STEALTH.titanium} 1px, transparent 0)`,
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
            <span 
              className="text-sm tracking-[0.3em] uppercase mb-4 block"
              style={{ color: STEALTH.platinum }}
            >
              L'Arsenal
            </span>
            <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl font-normal mb-8">
              <span className="text-white">La carte n'est que</span>
              <br />
              <span 
                className="italic text-transparent bg-clip-text"
                style={{ 
                  backgroundImage: `linear-gradient(135deg, ${STEALTH.titanium}, ${STEALTH.platinum})`
                }}
              >
                la porte d'entrée.
              </span>
            </h2>
            <p 
              className="text-xl max-w-3xl mx-auto leading-relaxed"
              style={{ color: STEALTH.titanium }}
            >
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
                className="group relative p-8 rounded-3xl border transition-all duration-500"
                style={{ 
                  background: `linear-gradient(180deg, ${STEALTH.titanium}10, transparent)`,
                  borderColor: `${STEALTH.titanium}20`
                }}
              >
                {/* Glow effect on hover */}
                <div 
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ backgroundColor: `${STEALTH.titanium}05` }}
                />
                
                <div className="relative z-10">
                  <div 
                    className="w-16 h-16 rounded-2xl border flex items-center justify-center mb-6 transition-all duration-500"
                    style={{ 
                      backgroundColor: `${STEALTH.titanium}20`,
                      borderColor: `${STEALTH.titanium}30`
                    }}
                  >
                    <feature.icon className="w-8 h-8" style={{ color: STEALTH.platinum }} />
                  </div>
                  
                  <span 
                    className="text-xs tracking-[0.2em] uppercase"
                    style={{ color: `${STEALTH.titanium}80` }}
                  >
                    {feature.subtitle}
                  </span>
                  <h3 className="font-display text-2xl font-normal text-white mt-2 mb-4">{feature.title}</h3>
                  <p 
                    className="leading-relaxed mb-6"
                    style={{ color: STEALTH.titanium }}
                  >
                    {feature.description}
                  </p>
                  
                  <div 
                    className="pt-4"
                    style={{ borderTop: `1px solid ${STEALTH.titanium}20` }}
                  >
                    <span className="font-medium" style={{ color: STEALTH.platinum }}>{feature.stats}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 3: L'IDENTITÉ — Focus visuel et social
          ═══════════════════════════════════════════════════════════════════ */}
      <section 
        id="identite"
        className="relative py-32 overflow-hidden"
        style={{ backgroundColor: STEALTH.noir }}
      >
        {/* Titanium ambient glow */}
        <div 
          className="absolute top-1/2 left-0 w-[600px] h-[600px] rounded-full blur-[200px] -translate-y-1/2"
          style={{ backgroundColor: `${STEALTH.titanium}08` }}
        />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span 
                className="text-sm tracking-[0.3em] uppercase mb-4 block"
                style={{ color: STEALTH.platinum }}
              >
                L'Identité
              </span>
              <h2 className="font-display text-5xl sm:text-6xl font-normal mb-8 leading-tight">
                <span className="text-white">Votre visage.</span>
                <br />
                <span 
                  className="italic text-transparent bg-clip-text"
                  style={{ 
                    backgroundImage: `linear-gradient(135deg, ${STEALTH.titanium}, ${STEALTH.platinum})`
                  }}
                >
                  Partout.
                </span>
              </h2>
              <p 
                className="text-lg leading-relaxed mb-10"
                style={{ color: STEALTH.titanium }}
              >
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
                    <div 
                      className="w-12 h-12 rounded-xl border flex items-center justify-center"
                      style={{ 
                        backgroundColor: `${STEALTH.titanium}10`,
                        borderColor: `${STEALTH.titanium}20`
                      }}
                    >
                      <item.icon className="w-5 h-5" style={{ color: STEALTH.platinum }} />
                    </div>
                    <span className="text-white">{item.text}</span>
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
                <div 
                  className="absolute inset-0 rounded-[3rem] blur-3xl"
                  style={{ backgroundColor: `${STEALTH.titanium}20` }}
                />
                
                {/* Phone frame */}
                <div 
                  className="relative rounded-[2.5rem] p-3 border"
                  style={{ 
                    backgroundColor: STEALTH.noir,
                    borderColor: `${STEALTH.titanium}30`
                  }}
                >
                  {/* Screen */}
                  <div 
                    className="rounded-[2rem] overflow-hidden aspect-[9/16] relative"
                    style={{ 
                      background: `linear-gradient(180deg, ${STEALTH.noirElevated}, ${STEALTH.noir})`
                    }}
                  >
                    {/* Dynamic island */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full" />
                    
                    {/* Profile content */}
                    <div className="pt-16 px-6 text-center">
                      {/* Avatar ring */}
                      <div className="w-24 h-24 rounded-full mx-auto mb-4 relative">
                        <div 
                          className="absolute inset-0 rounded-full border-2 animate-pulse"
                          style={{ borderColor: STEALTH.titanium }}
                        />
                        <div 
                          className="absolute inset-1 rounded-full"
                          style={{ 
                            background: `linear-gradient(135deg, ${STEALTH.titanium}20, ${STEALTH.titanium}05)`
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Crown className="w-10 h-10" style={{ color: STEALTH.platinum }} />
                        </div>
                      </div>
                      
                      <h3 className="font-display text-xl text-white italic mb-1">Vincenzo Wasp</h3>
                      <p 
                        className="text-xs tracking-[0.15em] uppercase"
                        style={{ color: STEALTH.titanium }}
                      >
                        Founding Partner
                      </p>
                      
                      {/* Story indicators */}
                      <div className="flex justify-center gap-2 mt-6">
                        {[1, 2, 3].map((i) => (
                          <div 
                            key={i} 
                            className="w-12 h-12 rounded-lg border"
                            style={{ 
                              backgroundColor: `${STEALTH.titanium}20`,
                              borderColor: `${STEALTH.titanium}30`
                            }}
                          />
                        ))}
                      </div>
                      
                      {/* Status */}
                      <div 
                        className="mt-8 p-4 rounded-xl border"
                        style={{ 
                          backgroundColor: `${STEALTH.titanium}10`,
                          borderColor: `${STEALTH.titanium}20`
                        }}
                      >
                        <div className="flex items-center justify-between text-sm">
                          <span style={{ color: STEALTH.titanium }}>Influence Map</span>
                          <span style={{ color: STEALTH.platinum }}>Active</span>
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
          SECTION 4: LE MONDE — Géolocalisation comme carte de conquête
          ═══════════════════════════════════════════════════════════════════ */}
      <section 
        id="monde"
        className="relative py-32 overflow-hidden"
        style={{ backgroundColor: STEALTH.noirElevated }}
      >
        {/* Glow effects */}
        <div 
          className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-[200px]"
          style={{ backgroundColor: `${STEALTH.titanium}10` }}
        />
        <div 
          className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-[150px]"
          style={{ backgroundColor: `${STEALTH.emeraldGlow}20` }}
        />
        
        {/* World grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(circle, ${STEALTH.titanium}30 1px, transparent 1px)`,
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
            <span 
              className="text-sm tracking-[0.3em] uppercase mb-4 block"
              style={{ color: STEALTH.platinum }}
            >
              Le Monde
            </span>
            <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl font-normal mb-8">
              <span 
                className="italic text-transparent bg-clip-text"
                style={{ 
                  backgroundImage: `linear-gradient(135deg, ${STEALTH.titanium}, ${STEALTH.platinum})`
                }}
              >
                Une Présence
              </span>
              <br />
              <span className="text-white uppercase tracking-[0.1em]">Sans Frontières.</span>
            </h2>
            <p 
              className="text-xl max-w-3xl mx-auto leading-relaxed"
              style={{ color: `${STEALTH.titanium}99` }}
            >
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
            <div 
              className="aspect-[16/9] rounded-3xl border overflow-hidden relative"
              style={{ 
                background: `linear-gradient(180deg, ${STEALTH.noir}, ${STEALTH.noirElevated})`,
                borderColor: `${STEALTH.titanium}20`
              }}
            >
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
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: STEALTH.titanium }}
                    />
                    <div 
                      className="absolute inset-0 w-3 h-3 rounded-full animate-ping"
                      style={{ backgroundColor: STEALTH.titanium }}
                    />
                  </motion.div>
                ))}
                
                {/* Connection lines */}
                <svg className="absolute inset-0 w-full h-full">
                  <line x1="20%" y1="30%" x2="45%" y2="40%" stroke={`${STEALTH.titanium}20`} strokeWidth="1" />
                  <line x1="45%" y1="40%" x2="75%" y2="35%" stroke={`${STEALTH.titanium}20`} strokeWidth="1" />
                  <line x1="45%" y1="40%" x2="30%" y2="55%" stroke={`${STEALTH.titanium}20`} strokeWidth="1" />
                  <line x1="45%" y1="40%" x2="60%" y2="60%" stroke={`${STEALTH.titanium}20`} strokeWidth="1" />
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
                    <div className="text-3xl font-display" style={{ color: STEALTH.platinum }}>{stat.value}</div>
                    <div 
                      className="text-xs uppercase tracking-wider"
                      style={{ color: `${STEALTH.titanium}60` }}
                    >
                      {stat.label}
                    </div>
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
                className="flex items-start gap-4 p-6 rounded-2xl border"
                style={{ 
                  backgroundColor: `${STEALTH.noir}80`,
                  borderColor: `${STEALTH.titanium}20`
                }}
              >
                <div 
                  className="w-12 h-12 rounded-xl border flex items-center justify-center shrink-0"
                  style={{ 
                    backgroundColor: `${STEALTH.titanium}20`,
                    borderColor: `${STEALTH.titanium}30`
                  }}
                >
                  <item.icon className="w-6 h-6" style={{ color: STEALTH.platinum }} />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm" style={{ color: `${STEALTH.titanium}99` }}>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 5: L'HÉRITAGE — Durabilité, luxe noble
          ═══════════════════════════════════════════════════════════════════ */}
      <section 
        id="heritage"
        className="relative py-32 overflow-hidden"
        style={{ backgroundColor: STEALTH.noir }}
      >
        {/* Soft warm glow */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[150px]"
          style={{ backgroundColor: `${STEALTH.titanium}10` }}
        />
        
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
                <div 
                  className="relative mx-auto w-80 aspect-[1.6/1] rounded-2xl border shadow-2xl"
                  style={{ 
                    background: `linear-gradient(135deg, ${STEALTH.noirElevated}, ${STEALTH.noir})`,
                    borderColor: `${STEALTH.titanium}30`
                  }}
                >
                  {/* Card content */}
                  <div className="absolute inset-6 flex flex-col justify-between">
                    <div className="flex items-center gap-2">
                      <Crown className="w-6 h-6" style={{ color: STEALTH.platinum }} />
                      <span className="font-display text-lg italic text-white">iW.</span>
                    </div>
                    <div>
                      <div 
                        className="text-xs uppercase tracking-wider mb-1"
                        style={{ color: `${STEALTH.titanium}80` }}
                      >
                        NFC Card
                      </div>
                      <div className="text-white font-medium">Eco Premium</div>
                    </div>
                  </div>
                  
                  {/* Leaf accent */}
                  <div className="absolute top-4 right-4">
                    <Leaf className="w-8 h-8" style={{ color: `${STEALTH.titanium}40` }} />
                  </div>
                </div>
                
                {/* Floating stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="absolute -bottom-8 -right-8 rounded-2xl p-5 shadow-xl border"
                  style={{ 
                    backgroundColor: STEALTH.noirElevated,
                    borderColor: `${STEALTH.titanium}30`
                  }}
                >
                  <div className="text-3xl font-display mb-1" style={{ color: STEALTH.platinum }}>0</div>
                  <div 
                    className="text-xs uppercase tracking-wider"
                    style={{ color: STEALTH.titanium }}
                  >
                    Arbres coupés
                  </div>
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
              <span 
                className="text-sm tracking-[0.3em] uppercase mb-4 block"
                style={{ color: STEALTH.platinum }}
              >
                L'Héritage
              </span>
              <h2 className="font-display text-5xl sm:text-6xl font-normal mb-8 leading-tight">
                <span className="text-white">Le luxe peut être</span>
                <br />
                <span 
                  className="italic text-transparent bg-clip-text"
                  style={{ 
                    backgroundImage: `linear-gradient(135deg, ${STEALTH.titanium}, ${STEALTH.platinum})`
                  }}
                >
                  noble.
                </span>
              </h2>
              <p 
                className="text-lg leading-relaxed mb-10"
                style={{ color: STEALTH.titanium }}
              >
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
                    <div className="text-2xl font-display" style={{ color: STEALTH.platinum }}>{stat.value}</div>
                    <div 
                      className="text-xs mt-1"
                      style={{ color: `${STEALTH.titanium}B3` }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 6: LE SANCTUAIRE — Dashboard membres
          ═══════════════════════════════════════════════════════════════════ */}
      <section 
        id="sanctuaire"
        className="relative py-32 overflow-hidden"
        style={{ backgroundColor: STEALTH.noirElevated }}
      >
        {/* Premium glow */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full blur-[200px]"
          style={{ backgroundColor: `${STEALTH.titanium}08` }}
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px]"
          style={{ backgroundColor: `${STEALTH.emeraldGlow}10` }}
        />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span 
              className="text-sm tracking-[0.3em] uppercase mb-4 block"
              style={{ color: STEALTH.platinum }}
            >
              Le Sanctuaire
            </span>
            <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl font-normal mb-8">
              <span className="text-white">Votre</span>
              <br />
              <span 
                className="italic text-transparent bg-clip-text"
                style={{ 
                  backgroundImage: `linear-gradient(135deg, ${STEALTH.titanium}, ${STEALTH.platinum})`
                }}
              >
                Centre de Contrôle.
              </span>
            </h2>
            <p 
              className="text-xl max-w-2xl mx-auto leading-relaxed"
              style={{ color: STEALTH.titanium }}
            >
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
              <div 
                className="absolute inset-0 rounded-3xl blur-3xl"
                style={{ backgroundColor: `${STEALTH.titanium}10` }}
              />
              
              {/* Dashboard mockup */}
              <div 
                className="relative rounded-3xl border overflow-hidden"
                style={{ 
                  backgroundColor: STEALTH.noir,
                  borderColor: `${STEALTH.titanium}20`
                }}
              >
                {/* Header bar */}
                <div 
                  className="flex items-center justify-between p-6"
                  style={{ borderBottom: `1px solid ${STEALTH.titanium}10` }}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: STEALTH.titanium }}
                    >
                      <Crown className="w-5 h-5" style={{ color: STEALTH.noir }} />
                    </div>
                    <span className="font-display text-lg text-white italic">iW. Dashboard</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div 
                      className="flex items-center gap-2 text-sm"
                      style={{ color: STEALTH.titanium }}
                    >
                      <div 
                        className="w-2 h-2 rounded-full animate-pulse"
                        style={{ backgroundColor: STEALTH.platinum }}
                      />
                      Live
                    </div>
                    <div 
                      className="w-8 h-8 rounded-full border"
                      style={{ 
                        backgroundColor: `${STEALTH.titanium}20`,
                        borderColor: `${STEALTH.titanium}30`
                      }}
                    />
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
                    <div 
                      key={stat.label} 
                      className="p-5 rounded-2xl border"
                      style={{ 
                        backgroundColor: STEALTH.noirElevated,
                        borderColor: `${STEALTH.titanium}10`
                      }}
                    >
                      <div 
                        className="text-xs uppercase tracking-wider mb-2"
                        style={{ color: `${STEALTH.titanium}80` }}
                      >
                        {stat.label}
                      </div>
                      <div className="flex items-end justify-between">
                        <span className="text-2xl font-display text-white">{stat.value}</span>
                        <span className="text-xs" style={{ color: STEALTH.platinum }}>{stat.trend}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Lock overlay for non-members */}
                <div 
                  className="absolute inset-0 backdrop-blur-sm flex items-center justify-center"
                  style={{ backgroundColor: `${STEALTH.noir}CC` }}
                >
                  <div className="text-center">
                    <Lock className="w-12 h-12 mx-auto mb-4" style={{ color: STEALTH.platinum }} />
                    <h3 className="text-xl font-display text-white mb-2">Réservé aux membres</h3>
                    <p className="text-sm mb-6" style={{ color: STEALTH.titanium }}>Rejoignez le club pour accéder au Sanctuaire</p>
                    <Link to="/signup">
                      <Button 
                        className="font-semibold px-8 py-6 rounded-xl tracking-wide uppercase"
                        style={{ 
                          background: `linear-gradient(135deg, ${STEALTH.titanium}, ${STEALTH.platinum})`,
                          color: STEALTH.noir
                        }}
                      >
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
            <p className="mb-8" style={{ color: STEALTH.titanium }}>
              Prêt à transformer votre présence digitale ?
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href={WHATSAPP_PROJECT_URL} target="_blank" rel="noopener noreferrer">
                <Button 
                  size="lg" 
                  className="font-semibold px-10 py-7 rounded-2xl text-lg gap-3 tracking-[0.08em] uppercase"
                  style={{ 
                    background: `linear-gradient(135deg, ${STEALTH.titanium}, ${STEALTH.platinum})`,
                    color: STEALTH.noir
                  }}
                >
                  Commencer l'ascension
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </a>
              <Link to="/contact">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="px-10 py-7 rounded-2xl text-lg"
                  style={{ 
                    borderColor: `${STEALTH.titanium}30`,
                    color: 'white'
                  }}
                >
                  Nous contacter
                </Button>
              </Link>
            </div>
            
            {/* Trust badges */}
            <div className="flex items-center justify-center gap-8 mt-16">
              {[
                { icon: Shield, text: "RGPD" },
                { icon: Lock, text: "Chiffré" },
                { icon: Globe, text: "Mondial" },
              ].map((badge) => (
                <div key={badge.text} className="flex items-center gap-2">
                  <badge.icon className="w-4 h-4" style={{ color: `${STEALTH.titanium}80` }} />
                  <span 
                    className="text-sm"
                    style={{ color: `${STEALTH.titanium}80` }}
                  >
                    {badge.text}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      
      <GlobalFooter variant="dark" />
    </div>
  );
};

export default Index;
