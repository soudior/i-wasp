/**
 * Index / Home Page — i-wasp Landing
 * 
 * Palette Stealth Luxury:
 * - Noir Émeraude: #050807
 * - Argent Titane: #A5A9B4
 * - Platine: #D1D5DB
 * 
 * Objectif: Comprendre immédiatement le produit + accès rapide à toutes les fonctions
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
  Target,
  BarChart3,
  Smartphone,
  Palette,
  Eye,
  MapPin,
  TrendingUp,
  Lock,
  Crown,
  CreditCard,
  Wifi,
  QrCode,
  ShoppingBag,
  Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRef } from "react";
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
};

const WHATSAPP_PROJECT_URL = "https://wa.me/33626424394?text=Bonjour%20👋%0AJe%20souhaite%20lancer%20mon%20projet%20NFC%20avec%20i-wasp.";

// Comment ça marche - 3 étapes simples
const howItWorks = [
  {
    step: "01",
    title: "Commandez",
    description: "Choisissez votre design et personnalisez votre carte NFC premium.",
    icon: ShoppingBag,
  },
  {
    step: "02", 
    title: "Recevez",
    description: "Votre carte arrive chez vous, prête à l'emploi avec votre profil digital.",
    icon: CreditCard,
  },
  {
    step: "03",
    title: "Connectez",
    description: "Un tap suffit. Vos contacts reçoivent instantanément vos informations.",
    icon: Wifi,
  },
];

// Fonctionnalités principales
const mainFeatures = [
  {
    icon: Smartphone,
    title: "Profil Digital",
    description: "Votre mini-site accessible d'un tap. Photo, bio, liens, réseaux sociaux.",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "Suivez qui scanne votre carte, quand et où. Stats en temps réel.",
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Restez en contact avec ceux qui vous ont scanné. Push ciblés.",
  },
  {
    icon: Palette,
    title: "Personnalisation",
    description: "Modifiez votre profil à volonté. Design illimité, mises à jour gratuites.",
  },
];

// Quick access links for logged-in users
const quickLinks = [
  { href: "/dashboard", label: "Mon Dashboard", icon: LayoutDashboard },
  { href: "/card-studio", label: "Éditer ma Carte", icon: Palette },
  { href: "/order/type", label: "Commander", icon: ShoppingBag },
  { href: "/settings", label: "Paramètres", icon: Crown },
];

import { LayoutDashboard } from "lucide-react";

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  
  return (
    <div ref={containerRef} className="relative" style={{ backgroundColor: STEALTH.noir }}>
      <ClubNavbar />

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 1: HERO — Comprendre immédiatement le produit
          CTA clair + Explication visuelle + Accès rapides
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
        
        <div className="relative z-10 container mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Badge - Explication claire */}
              <div 
                className="inline-flex items-center gap-3 px-4 py-2 rounded-full border mb-8"
                style={{ 
                  backgroundColor: `${STEALTH.titanium}10`,
                  borderColor: `${STEALTH.titanium}20`
                }}
              >
                <CreditCard className="w-4 h-4" style={{ color: STEALTH.platinum }} />
                <span 
                  className="text-sm font-medium"
                  style={{ color: STEALTH.titanium }}
                >
                  Carte de visite NFC nouvelle génération
                </span>
              </div>
              
              {/* Titre clair et direct */}
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6">
                <span className="text-white">Un tap.</span>
                <br />
                <span className="text-white">Vos contacts</span>
                <br />
                <span 
                  className="text-transparent bg-clip-text"
                  style={{ 
                    backgroundImage: `linear-gradient(135deg, ${STEALTH.titanium}, ${STEALTH.platinum})`
                  }}
                >
                  instantanément.
                </span>
              </h1>
              
              {/* Description claire du produit */}
              <p 
                className="text-lg sm:text-xl max-w-xl leading-relaxed mb-8"
                style={{ color: STEALTH.titanium }}
              >
                Remplacez vos cartes de visite papier par une carte NFC élégante. 
                Un simple contact sur un smartphone partage votre profil digital complet.
              </p>
              
              {/* CTAs principaux */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link to="/order/type">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto font-semibold px-8 py-6 rounded-xl text-lg gap-3"
                    style={{ 
                      background: `linear-gradient(135deg, ${STEALTH.titanium}, ${STEALTH.platinum})`,
                      color: STEALTH.noir
                    }}
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Commander ma carte
                  </Button>
                </Link>
                <Link to="/demo">
                  <Button 
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto px-8 py-6 rounded-xl text-lg gap-3"
                    style={{ 
                      borderColor: `${STEALTH.titanium}40`,
                      color: 'white'
                    }}
                  >
                    <Play className="w-5 h-5" />
                    Voir une démo
                  </Button>
                </Link>
              </div>
              
              {/* Trust badges */}
              <div className="flex items-center gap-6">
                {[
                  { icon: Shield, text: "RGPD" },
                  { icon: Zap, text: "Livraison 48h" },
                  { icon: Star, text: "4.9/5" },
                ].map((badge) => (
                  <div key={badge.text} className="flex items-center gap-2">
                    <badge.icon className="w-4 h-4" style={{ color: STEALTH.platinum }} />
                    <span className="text-sm" style={{ color: STEALTH.titanium }}>{badge.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            
            {/* Right: Visual explanation */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Phone + Card mockup showing the concept */}
              <div className="relative mx-auto w-full max-w-sm">
                {/* Glow behind */}
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
                      <Crown className="w-4 h-4" style={{ color: STEALTH.platinum }} />
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
                    <div className="pt-14 px-6 text-center">
                      {/* NFC tap indicator */}
                      <motion.div
                        className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                        style={{ backgroundColor: `${STEALTH.titanium}20` }}
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Wifi className="w-8 h-8" style={{ color: STEALTH.platinum }} />
                      </motion.div>
                      
                      {/* Avatar */}
                      <div 
                        className="w-20 h-20 rounded-full mx-auto mb-3 border-2"
                        style={{ 
                          background: `linear-gradient(135deg, ${STEALTH.titanium}30, ${STEALTH.titanium}10)`,
                          borderColor: STEALTH.titanium
                        }}
                      />
                      
                      <h3 className="font-display text-lg text-white font-semibold mb-1">Votre Nom</h3>
                      <p className="text-xs mb-4" style={{ color: STEALTH.titanium }}>CEO · Votre Entreprise</p>
                      
                      {/* Quick actions */}
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
                      
                      {/* Add to contacts button */}
                      <div 
                        className="p-3 rounded-xl text-sm font-medium"
                        style={{ 
                          backgroundColor: STEALTH.titanium,
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
          SECTION VIDEO — Démonstration NFC
          ═══════════════════════════════════════════════════════════════════ */}
      <section 
        className="py-20 overflow-hidden"
        style={{ backgroundColor: STEALTH.noirElevated }}
      >
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span 
              className="text-sm tracking-[0.3em] uppercase mb-4 block"
              style={{ color: STEALTH.platinum }}
            >
              Voyez par vous-même
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4 text-white">
              Un geste. Une connexion.
            </h2>
            <p 
              className="text-lg max-w-xl mx-auto"
              style={{ color: STEALTH.titanium }}
            >
              Approchez votre carte NFC d'un smartphone et partagez instantanément vos informations.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <div 
              className="relative rounded-3xl overflow-hidden border shadow-2xl"
              style={{ 
                borderColor: `${STEALTH.titanium}20`,
                boxShadow: `0 40px 80px -20px ${STEALTH.noir}`
              }}
            >
              {/* Glow effect behind video */}
              <div 
                className="absolute inset-0 blur-3xl opacity-30"
                style={{ backgroundColor: STEALTH.titanium }}
              />
              
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-auto relative z-10"
                poster="/posters/nfc-demo-poster.webp"
              >
                <source src="/nfc-demo-video.mp4" type="video/mp4" />
              </video>
            </div>
            
            {/* Caption */}
            <p 
              className="text-center text-sm mt-6"
              style={{ color: STEALTH.titanium }}
            >
              Compatible avec tous les smartphones récents (iOS & Android)
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 2: COMMENT ÇA MARCHE — 3 étapes simples
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
              style={{ color: STEALTH.platinum }}
            >
              Simple & Rapide
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold mb-6 text-white">
              Comment ça marche ?
            </h2>
            <p 
              className="text-xl max-w-2xl mx-auto"
              style={{ color: STEALTH.titanium }}
            >
              De la commande à l'utilisation, tout est pensé pour être fluide.
            </p>
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
                {/* Step number */}
                <div 
                  className="text-6xl font-display font-bold mb-4"
                  style={{ color: `${STEALTH.titanium}20` }}
                >
                  {item.step}
                </div>
                
                {/* Icon */}
                <div 
                  className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
                  style={{ 
                    background: `linear-gradient(135deg, ${STEALTH.titanium}20, ${STEALTH.titanium}05)`,
                    borderColor: `${STEALTH.titanium}30`
                  }}
                >
                  <item.icon className="w-8 h-8" style={{ color: STEALTH.platinum }} />
                </div>
                
                <h3 className="text-2xl font-semibold text-white mb-3">{item.title}</h3>
                <p style={{ color: STEALTH.titanium }}>{item.description}</p>
                
                {/* Connector line */}
                {index < howItWorks.length - 1 && (
                  <div 
                    className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px"
                    style={{ backgroundColor: `${STEALTH.titanium}20` }}
                  />
                )}
              </motion.div>
            ))}
          </div>
          
          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <Link to="/order/type">
              <Button 
                size="lg" 
                className="font-semibold px-10 py-6 rounded-xl text-lg gap-3"
                style={{ 
                  background: `linear-gradient(135deg, ${STEALTH.titanium}, ${STEALTH.platinum})`,
                  color: STEALTH.noir
                }}
              >
                Créer ma carte maintenant
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 3: FONCTIONNALITÉS — Ce que vous pouvez faire
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
              style={{ color: STEALTH.platinum }}
            >
              Fonctionnalités
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold mb-6 text-white">
              Tout depuis votre compte
            </h2>
            <p 
              className="text-xl max-w-2xl mx-auto"
              style={{ color: STEALTH.titanium }}
            >
              Gérez facilement votre carte, vos stats et vos contacts depuis n'importe où.
            </p>
          </motion.div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {mainFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl border transition-all duration-300 hover:border-opacity-50"
                style={{ 
                  backgroundColor: `${STEALTH.noirElevated}80`,
                  borderColor: `${STEALTH.titanium}20`
                }}
              >
                <div 
                  className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center"
                  style={{ backgroundColor: `${STEALTH.titanium}20` }}
                >
                  <feature.icon className="w-6 h-6" style={{ color: STEALTH.platinum }} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm" style={{ color: STEALTH.titanium }}>{feature.description}</p>
              </motion.div>
            ))}
          </div>
          
          {/* Link to features page */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/features">
              <Button 
                variant="outline"
                size="lg"
                className="gap-2"
                style={{ 
                  borderColor: `${STEALTH.titanium}40`,
                  color: 'white'
                }}
              >
                Voir toutes les fonctionnalités
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 4: TARIFS RAPIDES — Accès direct
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
              className="text-center p-10 sm:p-16 rounded-3xl border relative overflow-hidden"
              style={{ 
                background: `linear-gradient(135deg, ${STEALTH.titanium}10, ${STEALTH.titanium}05)`,
                borderColor: `${STEALTH.titanium}30`
              }}
            >
              {/* Glow */}
              <div 
                className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[150px] opacity-50"
                style={{ backgroundColor: `${STEALTH.titanium}15` }}
              />
              
              <div className="relative z-10">
                <Crown className="w-12 h-12 mx-auto mb-6" style={{ color: STEALTH.platinum }} />
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
                  <span className="text-4xl font-bold text-white">À partir de 290 DH</span>
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link to="/order/type">
                    <Button 
                      size="lg" 
                      className="font-semibold px-10 py-6 rounded-xl text-lg gap-3"
                      style={{ 
                        background: `linear-gradient(135deg, ${STEALTH.titanium}, ${STEALTH.platinum})`,
                        color: STEALTH.noir
                      }}
                    >
                      <ShoppingBag className="w-5 h-5" />
                      Commander maintenant
                    </Button>
                  </Link>
                  <Link to="/pricing">
                    <Button 
                      variant="outline"
                      size="lg"
                      className="px-8 py-6 rounded-xl"
                      style={{ 
                        borderColor: `${STEALTH.titanium}40`,
                        color: 'white'
                      }}
                    >
                      Voir tous les tarifs
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      <GlobalFooter variant="dark" />
    </div>
  );
};

// Import missing icons
import { Phone, Mail } from "lucide-react";

export default Index;
