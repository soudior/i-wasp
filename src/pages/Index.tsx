/**
 * Index / Home Page — i-wasp Landing
 * 
 * Refonte complète avec les nouveaux textes copywriting
 * Hero + Comment ça marche + Pour qui + Machine à leads + Offres teaser + FAQ
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
  Target,
  BarChart3,
  Smartphone,
  Palette,
  Crown,
  CreditCard,
  Wifi,
  QrCode,
  ShoppingBag,
  Play,
  Building2,
  PartyPopper,
  Hotel,
  Briefcase,
  UserPlus,
  Share2,
  MessageCircle,
  Phone,
  Mail,
  LayoutDashboard,
  HelpCircle,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { ClubNavbar } from "@/components/ClubNavbar";
import { GlobalFooter } from "@/components/GlobalFooter";
import { useAuth } from "@/contexts/AuthContext";

// Stealth Luxury Colors
const STEALTH = {
  noir: "#050807",
  noirElevated: "#0A0F0D",
  titanium: "#A5A9B4",
  platinum: "#D1D5DB",
  emeraldGlow: "#1A2B26",
  accent: "#D4AF37",
};

// Comment ça marche - 3 étapes simples
const howItWorks = [
  {
    step: "01",
    title: "Choisissez votre offre",
    description: "Choisissez votre offre et votre support NFC.",
    icon: ShoppingBag,
  },
  {
    step: "02", 
    title: "Personnalisez",
    description: "Personnalisez votre profil digital en quelques secondes.",
    icon: Palette,
  },
  {
    step: "03",
    title: "Partagez",
    description: "Partagez par un tap, un QR ou un lien. Vos leads arrivent directement dans votre espace i‑wasp.",
    icon: Share2,
  },
];

// Pour qui
const targetAudiences = [
  {
    icon: Briefcase,
    title: "Entrepreneurs & indépendants",
    description: "Networking quotidien, impressionner vos prospects dès le premier contact.",
  },
  {
    icon: Hotel,
    title: "Hôtellerie & luxe",
    description: "Concierges, directeurs d'établissements, expériences VIP.",
  },
  {
    icon: PartyPopper,
    title: "Événementiel & vie nocturne",
    description: "DJ, organisateurs, clubs. Partagez vos infos en un geste.",
  },
];

// Offres teaser
const offersTeaser = [
  {
    id: "essentiel",
    icon: Star,
    name: "Essentiel",
    tagline: "Votre identité numérique de base",
    price: "277 MAD",
    badge: "Idéal pour commencer",
    features: ["Carte NFC standard", "Profil digital complet", "Jusqu'à 3 liens", "Accès tableau de bord"],
  },
  {
    id: "signature",
    icon: Sparkles,
    name: "Signature",
    tagline: "L'expérience complète",
    price: "555 MAD",
    badge: "Populaire",
    isPopular: true,
    features: ["Carte NFC premium", "Liens illimités", "Galerie photo/vidéo", "Collecte de leads", "Statistiques"],
  },
  {
    id: "elite",
    icon: Crown,
    name: "Élite",
    tagline: "Service sur mesure",
    price: "925 MAD",
    badge: "Sur devis pour entreprises",
    features: ["Tout Signature inclus", "Design personnalisé", "Scénarios de relance", "Accompagnement dédié"],
  },
];

// FAQ
const faqs = [
  {
    question: "La carte est-elle compatible avec tous les smartphones ?",
    answer: "Oui ! La technologie NFC fonctionne avec tous les iPhone (XS et +) et tous les smartphones Android récents. Aucune app à installer.",
  },
  {
    question: "Mes données sont-elles sécurisées ?",
    answer: "Absolument. Vos données sont hébergées en Europe, chiffrées, et nous sommes conformes au RGPD. Vous contrôlez tout depuis votre espace.",
  },
  {
    question: "Quels sont les délais de livraison ?",
    answer: "Livraison gratuite au Maroc sous 48h-72h. Nous expédions également à l'international sur demande.",
  },
  {
    question: "Puis-je modifier mes informations après la commande ?",
    answer: "Oui, vous pouvez modifier votre profil digital à tout moment depuis votre espace i-wasp. Les changements sont instantanés.",
  },
];

// Quick access links for logged-in users
const quickLinks = [
  { href: "/dashboard", label: "Mon Dashboard", icon: LayoutDashboard },
  { href: "/order/offre", label: "Commander", icon: ShoppingBag },
  { href: "/card-studio", label: "Éditer ma Carte", icon: Palette },
  { href: "/settings", label: "Paramètres", icon: Crown },
];

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  return (
    <div ref={containerRef} className="relative" style={{ backgroundColor: STEALTH.noir }}>
      <ClubNavbar />

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 1: HERO — Comprendre en 5 secondes
          ═══════════════════════════════════════════════════════════════════ */}
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
        style={{ backgroundColor: STEALTH.noir }}
      >
        {/* Ambient effects */}
        <div 
          className="absolute top-0 left-1/4 w-[800px] h-[800px] rounded-full blur-[200px]"
          style={{ backgroundColor: `${STEALTH.titanium}08` }}
        />
        <div 
          className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full blur-[180px]"
          style={{ backgroundColor: `${STEALTH.emeraldGlow}30` }}
        />
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-6xl mx-auto">
            
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              {/* Badge */}
              <div 
                className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 rounded-full border mb-6 sm:mb-8"
                style={{ 
                  backgroundColor: `${STEALTH.titanium}10`,
                  borderColor: `${STEALTH.titanium}20`
                }}
              >
                <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" style={{ color: STEALTH.platinum }} />
                <span 
                  className="text-xs sm:text-sm font-medium"
                  style={{ color: STEALTH.titanium }}
                >
                  Carte NFC nouvelle génération
                </span>
              </div>
              
              {/* Titre principal - NOUVEAU */}
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.1] mb-4 sm:mb-6">
                <span className="text-white">Une carte NFC.</span>
                <br />
                <span className="text-white">Appuyez un peu.</span>
                <br />
                <span 
                  className="text-transparent bg-clip-text"
                  style={{ 
                    backgroundImage: `linear-gradient(135deg, ${STEALTH.accent}, ${STEALTH.platinum})`
                  }}
                >
                  Tout votre monde connecté.
                </span>
              </h1>
              
              {/* Sous-titre - NOUVEAU */}
              <p 
                className="text-base sm:text-lg lg:text-xl max-w-xl leading-relaxed mb-6 sm:mb-8"
                style={{ color: STEALTH.titanium }}
              >
                i‑wasp remplace vos cartes papier par une identité numérique de luxe qui capture vos leads, 
                envoie des notifications et pilote tout votre réseau NFC depuis un seul espace.
              </p>
              
              {/* CTAs principaux - NOUVEAU */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
                <Link to="/order/offre" className="w-full sm:w-auto">
                  <Button 
                    size="lg" 
                    className="w-full font-semibold px-6 sm:px-8 py-5 sm:py-6 rounded-xl text-base sm:text-lg gap-2 sm:gap-3"
                    style={{ 
                      background: `linear-gradient(135deg, ${STEALTH.accent}, ${STEALTH.platinum})`,
                      color: STEALTH.noir
                    }}
                  >
                    <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                    Créer ma carte maintenant
                  </Button>
                </Link>
                <Link to="/demo" className="w-full sm:w-auto">
                  <Button 
                    variant="outline"
                    size="lg"
                    className="w-full px-6 sm:px-8 py-5 sm:py-6 rounded-xl text-base sm:text-lg gap-2 sm:gap-3"
                    style={{ 
                      borderColor: `${STEALTH.titanium}40`,
                      color: 'white'
                    }}
                  >
                    <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                    Voir une démo en 30 secondes
                  </Button>
                </Link>
              </div>
              
              {/* Micro-preuve - NOUVEAU */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Check className="w-4 h-4" style={{ color: STEALTH.accent }} />
                  <span className="text-xs sm:text-sm" style={{ color: STEALTH.titanium }}>Livraison gratuite au Maroc</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Check className="w-4 h-4" style={{ color: STEALTH.accent }} />
                  <span className="text-xs sm:text-sm" style={{ color: STEALTH.titanium }}>Paiement à la livraison</span>
                </div>
              </div>
            </motion.div>
            
            {/* Right: Visual */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative mx-auto w-full max-w-sm">
                <div 
                  className="absolute inset-0 rounded-[3rem] blur-3xl"
                  style={{ backgroundColor: `${STEALTH.titanium}20` }}
                />
                
                {/* NFC Card */}
                <motion.div
                  className="absolute -left-8 top-1/4 z-20"
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [-5, -3, -5]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div 
                    className="w-48 h-28 rounded-xl border shadow-2xl p-4 flex flex-col justify-between"
                    style={{ 
                      background: `linear-gradient(135deg, ${STEALTH.noirElevated}, ${STEALTH.noir})`,
                      borderColor: `${STEALTH.titanium}40`
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Crown className="w-4 h-4" style={{ color: STEALTH.accent }} />
                      <span className="text-xs font-medium text-white">i-Wasp</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <Wifi className="w-5 h-5" style={{ color: STEALTH.titanium }} />
                      <span className="text-[10px]" style={{ color: STEALTH.titanium }}>NFC</span>
                    </div>
                  </div>
                </motion.div>
                
                {/* Phone frame */}
                <div 
                  className="relative rounded-[2.5rem] p-3 border mx-auto"
                  style={{ 
                    backgroundColor: STEALTH.noir,
                    borderColor: `${STEALTH.titanium}30`
                  }}
                >
                  <div 
                    className="rounded-[2rem] overflow-hidden aspect-[9/16] relative"
                    style={{ 
                      background: `linear-gradient(180deg, ${STEALTH.noirElevated}, ${STEALTH.noir})`
                    }}
                  >
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full" />
                    
                    <div className="pt-14 px-6 text-center">
                      <motion.div
                        className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                        style={{ backgroundColor: `${STEALTH.titanium}20` }}
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Wifi className="w-8 h-8" style={{ color: STEALTH.platinum }} />
                      </motion.div>
                      
                      <div 
                        className="w-20 h-20 rounded-full mx-auto mb-3 border-2"
                        style={{ 
                          background: `linear-gradient(135deg, ${STEALTH.titanium}30, ${STEALTH.titanium}10)`,
                          borderColor: STEALTH.titanium
                        }}
                      />
                      
                      <h3 className="font-display text-lg text-white font-semibold mb-1">Votre Nom</h3>
                      <p className="text-xs mb-4" style={{ color: STEALTH.titanium }}>CEO · Votre Entreprise</p>
                      
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        {[Phone, Mail, Globe].map((Icon, i) => (
                          <div 
                            key={i}
                            className="aspect-square rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${STEALTH.titanium}20` }}
                          >
                            <Icon className="w-4 h-4" style={{ color: STEALTH.platinum }} />
                          </div>
                        ))}
                      </div>
                      
                      <div 
                        className="p-3 rounded-xl text-sm font-medium"
                        style={{ 
                          backgroundColor: STEALTH.accent,
                          color: STEALTH.noir
                        }}
                      >
                        Ajouter aux contacts
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Quick access for logged-in users */}
          {user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-16 max-w-4xl mx-auto"
            >
              <div 
                className="p-6 rounded-2xl border"
                style={{ 
                  backgroundColor: `${STEALTH.noirElevated}80`,
                  borderColor: `${STEALTH.titanium}20`
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Accès rapide</h3>
                  <span className="text-sm" style={{ color: STEALTH.titanium }}>Bonjour, {user.email?.split('@')[0]}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {quickLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200"
                      style={{ 
                        backgroundColor: `${STEALTH.titanium}10`,
                        color: STEALTH.titanium
                      }}
                    >
                      <link.icon className="w-5 h-5" style={{ color: STEALTH.platinum }} />
                      <span className="text-sm font-medium">{link.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 2: COMMENT ÇA MARCHE — 3 étapes
          ═══════════════════════════════════════════════════════════════════ */}
      <section 
        className="py-24 overflow-hidden"
        style={{ backgroundColor: STEALTH.noirElevated }}
      >
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span 
              className="text-sm tracking-[0.3em] uppercase mb-4 block"
              style={{ color: STEALTH.accent }}
            >
              Simple & Rapide
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold mb-6 text-white">
              Comment ça marche ?
            </h2>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {howItWorks.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="text-center relative"
              >
                <div 
                  className="text-6xl font-display font-bold mb-4"
                  style={{ color: `${STEALTH.accent}30` }}
                >
                  {item.step}
                </div>
                
                <div 
                  className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
                  style={{ 
                    background: `linear-gradient(135deg, ${STEALTH.accent}20, ${STEALTH.accent}05)`,
                  }}
                >
                  <item.icon className="w-8 h-8" style={{ color: STEALTH.accent }} />
                </div>
                
                <h3 className="text-2xl font-semibold text-white mb-3">{item.title}</h3>
                <p style={{ color: STEALTH.titanium }}>{item.description}</p>
                
                {index < howItWorks.length - 1 && (
                  <div 
                    className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px"
                    style={{ backgroundColor: `${STEALTH.titanium}20` }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 3: POUR QUI — Audiences cibles
          ═══════════════════════════════════════════════════════════════════ */}
      <section 
        className="py-24 overflow-hidden"
        style={{ backgroundColor: STEALTH.noir }}
      >
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span 
              className="text-sm tracking-[0.3em] uppercase mb-4 block"
              style={{ color: STEALTH.accent }}
            >
              Pour vous
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold mb-6 text-white">
              Conçu pour les pros qui veulent aller plus loin
            </h2>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {targetAudiences.map((audience, index) => (
              <motion.div
                key={audience.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-3xl border text-center"
                style={{ 
                  backgroundColor: STEALTH.noirElevated,
                  borderColor: `${STEALTH.titanium}20`
                }}
              >
                <div 
                  className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
                  style={{ backgroundColor: `${STEALTH.accent}15` }}
                >
                  <audience.icon className="w-8 h-8" style={{ color: STEALTH.accent }} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{audience.title}</h3>
                <p style={{ color: STEALTH.titanium }}>{audience.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 4: MACHINE À LEADS — Capture de contacts
          ═══════════════════════════════════════════════════════════════════ */}
      <section 
        className="py-24 overflow-hidden"
        style={{ backgroundColor: STEALTH.noirElevated }}
      >
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span 
                className="text-sm tracking-[0.3em] uppercase mb-4 block"
                style={{ color: STEALTH.accent }}
              >
                Fonctionnalités
              </span>
              <h2 className="font-display text-4xl sm:text-5xl font-bold mb-6 text-white">
                Pas seulement une carte : une machine à leads
              </h2>
              <p 
                className="text-xl max-w-2xl mx-auto"
                style={{ color: STEALTH.titanium }}
              >
                À chaque clic, votre profil propose : Enregistrer contact, suivre sur les réseaux, 
                et laisser ses coordonnées. Tous les leads sont centralisés dans votre espace i‑wasp 
                pour relances, campagnes et notifications.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid sm:grid-cols-3 gap-6"
            >
              {[
                { icon: UserPlus, title: "Capture leads", desc: "Collectez automatiquement les coordonnées de vos visiteurs" },
                { icon: BarChart3, title: "Statistiques", desc: "Voyez qui consulte votre profil en temps réel" },
                { icon: Bell, title: "Notifications", desc: "Envoyez des campagnes ciblées à vos contacts" },
              ].map((feature, index) => (
                <div 
                  key={feature.title}
                  className="p-6 rounded-2xl border text-center"
                  style={{ 
                    backgroundColor: `${STEALTH.noir}50`,
                    borderColor: `${STEALTH.titanium}20`
                  }}
                >
                  <div 
                    className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center"
                    style={{ backgroundColor: `${STEALTH.accent}20` }}
                  >
                    <feature.icon className="w-6 h-6" style={{ color: STEALTH.accent }} />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm" style={{ color: STEALTH.titanium }}>{feature.desc}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 5: OFFRES TEASER — Choisissez votre expérience
          ═══════════════════════════════════════════════════════════════════ */}
      <section 
        className="py-24 overflow-hidden"
        style={{ backgroundColor: STEALTH.noir }}
      >
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span 
              className="text-sm tracking-[0.3em] uppercase mb-4 block"
              style={{ color: STEALTH.accent }}
            >
              Nos offres
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold mb-6 text-white">
              Choisissez votre expérience
            </h2>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {offersTeaser.map((offer, index) => {
              const Icon = offer.icon;
              return (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative p-6 rounded-3xl border ${
                    offer.isPopular ? 'ring-2 ring-[#D4AF37]' : ''
                  }`}
                  style={{ 
                    backgroundColor: STEALTH.noirElevated,
                    borderColor: offer.isPopular ? STEALTH.accent : `${STEALTH.titanium}20`,
                  }}
                >
                  {/* Badge */}
                  <div 
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold"
                    style={{ 
                      background: offer.isPopular 
                        ? `linear-gradient(135deg, ${STEALTH.accent}, ${STEALTH.platinum})`
                        : STEALTH.noirElevated,
                      color: offer.isPopular ? STEALTH.noir : STEALTH.titanium,
                      border: offer.isPopular ? 'none' : `1px solid ${STEALTH.titanium}30`
                    }}
                  >
                    {offer.badge}
                  </div>
                  
                  <div className="text-center pt-4">
                    <div 
                      className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                      style={{ 
                        backgroundColor: offer.isPopular ? STEALTH.accent : `${STEALTH.titanium}20`
                      }}
                    >
                      <Icon 
                        className="w-7 h-7" 
                        style={{ color: offer.isPopular ? STEALTH.noir : STEALTH.platinum }} 
                      />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-1">{offer.name}</h3>
                    <p className="text-sm mb-4" style={{ color: STEALTH.titanium }}>{offer.tagline}</p>
                    
                    <div className="text-3xl font-bold mb-6" style={{ color: STEALTH.accent }}>
                      {offer.price}
                    </div>
                    
                    <ul className="space-y-2 mb-6 text-left">
                      {offer.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm" style={{ color: STEALTH.titanium }}>
                          <Check className="w-4 h-4 flex-shrink-0" style={{ color: STEALTH.accent }} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <Link to="/order/offre">
                      <Button 
                        className="w-full rounded-xl py-5"
                        style={{ 
                          backgroundColor: offer.isPopular ? STEALTH.accent : `${STEALTH.titanium}20`,
                          color: offer.isPopular ? STEALTH.noir : 'white'
                        }}
                      >
                        Choisir {offer.name}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 6: FAQ — Questions fréquentes
          ═══════════════════════════════════════════════════════════════════ */}
      <section 
        className="py-24 overflow-hidden"
        style={{ backgroundColor: STEALTH.noirElevated }}
      >
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span 
              className="text-sm tracking-[0.3em] uppercase mb-4 block"
              style={{ color: STEALTH.accent }}
            >
              FAQ
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold mb-6 text-white">
              Questions fréquentes
            </h2>
          </motion.div>
          
          <div className="max-w-2xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="rounded-2xl border overflow-hidden"
                style={{ 
                  backgroundColor: STEALTH.noir,
                  borderColor: `${STEALTH.titanium}20`
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full p-5 flex items-center justify-between text-left"
                >
                  <span className="font-medium text-white">{faq.question}</span>
                  <ChevronDown 
                    className={`w-5 h-5 transition-transform ${openFaq === index ? 'rotate-180' : ''}`}
                    style={{ color: STEALTH.titanium }}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-5 pb-5"
                    >
                      <p style={{ color: STEALTH.titanium }}>{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 7: CTA FINAL
          ═══════════════════════════════════════════════════════════════════ */}
      <section 
        className="py-24 overflow-hidden"
        style={{ backgroundColor: STEALTH.noir }}
      >
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center p-10 sm:p-16 rounded-3xl border relative overflow-hidden"
              style={{ 
                background: `linear-gradient(135deg, ${STEALTH.accent}15, ${STEALTH.accent}05)`,
                borderColor: `${STEALTH.accent}40`
              }}
            >
              <div 
                className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[150px] opacity-50"
                style={{ backgroundColor: `${STEALTH.accent}20` }}
              />
              
              <div className="relative z-10">
                <Crown className="w-12 h-12 mx-auto mb-6" style={{ color: STEALTH.accent }} />
                <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4 text-white">
                  Prêt à vous démarquer ?
                </h2>
                <p 
                  className="text-lg mb-3"
                  style={{ color: STEALTH.titanium }}
                >
                  Carte NFC + Profil digital + Gestion complète
                </p>
                <p className="mb-8">
                  <span className="text-4xl font-bold" style={{ color: STEALTH.accent }}>À partir de 277 MAD</span>
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link to="/order/offre">
                    <Button 
                      size="lg" 
                      className="font-semibold px-10 py-6 rounded-xl text-lg gap-3"
                      style={{ 
                        background: `linear-gradient(135deg, ${STEALTH.accent}, ${STEALTH.platinum})`,
                        color: STEALTH.noir
                      }}
                    >
                      <ShoppingBag className="w-5 h-5" />
                      Commander maintenant
                    </Button>
                  </Link>
                </div>
                
                {/* Micro-preuve finale */}
                <p className="mt-6 text-sm" style={{ color: STEALTH.titanium }}>
                  Livraison gratuite au Maroc · Paiement à la livraison disponible
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      <GlobalFooter variant="dark" />
    </div>
  );
};

export default Index;
