/**
 * Features Page — Fonctionnalités i-wasp
 * Style: Haute Couture Digitale - Noir Couture unifié
 */

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CoutureNavbar } from "@/components/CoutureNavbar";
import { CoutureFooter } from "@/components/CoutureFooter";
import { motion } from "framer-motion";
import { 
  Smartphone, 
  Wifi, 
  Link2, 
  LayoutTemplate, 
  BarChart3, 
  Zap,
  RefreshCw,
  QrCode,
  Share2,
  Shield,
  Globe,
  CheckCircle2
} from "lucide-react";

// Noir Couture Palette — Harmonisé avec tout le site
const NOIR_COUTURE = {
  jet: "#0A0A0A",          // Fond principal
  jetElevated: "#111111",  // Fond élevé
  silk: "#F6F5F2",         // Texte principal ivoire
  muted: "#9B9B9B",        // Texte secondaire gris cendre
  platinum: "#7E7E7E",     // Accent platine mat
  border: "#1A1A1A",       // Bordures subtiles
};

const features = [
  {
    icon: Wifi,
    title: "Carte NFC Dynamique",
    description: "Une seule carte physique qui se connecte à votre profil digital. Mise à jour instantanée, aucune réimpression nécessaire.",
    highlight: true,
  },
  {
    icon: Smartphone,
    title: "Profil Digital Intelligent",
    description: "Votre mini-site personnel accessible d'un simple tap. Photo, bio, coordonnées et liens - tout en un.",
  },
  {
    icon: Link2,
    title: "Liens Illimités",
    description: "Ajoutez autant de liens que vous voulez : réseaux sociaux, portfolio, calendrier, WhatsApp Business...",
  },
  {
    icon: LayoutTemplate,
    title: "Templates Métiers",
    description: "Des designs optimisés pour chaque secteur : Business, Créateur, Immobilier, Tech, Hôtellerie.",
  },
  {
    icon: BarChart3,
    title: "Statistiques de Scans",
    description: "Suivez qui scanne votre carte, quand et où. Analytics en temps réel pour optimiser votre networking.",
  },
  {
    icon: RefreshCw,
    title: "Mise à Jour Temps Réel",
    description: "Modifiez votre profil depuis l'app. Les changements sont instantanément visibles par vos contacts.",
  },
  {
    icon: QrCode,
    title: "QR Code Backup",
    description: "Un QR code automatique pour les appareils sans NFC. Compatibilité universelle garantie.",
  },
  {
    icon: Share2,
    title: "Partage Universel",
    description: "Partagez votre profil par lien, QR, NFC ou message. Multi-canal pour maximiser votre reach.",
  },
  {
    icon: Shield,
    title: "Sécurisé & Privé",
    description: "Vous contrôlez ce que vous partagez. Données chiffrées, hébergement européen conforme RGPD.",
  },
];

const compatibility = [
  { name: "iPhone", supported: true },
  { name: "Android", supported: true },
  { name: "Apple Watch", supported: true },
  { name: "Samsung Galaxy", supported: true },
  { name: "Google Pixel", supported: true },
  { name: "Tout appareil NFC", supported: true },
];

export default function Features() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: NOIR_COUTURE.jet, color: NOIR_COUTURE.silk }}>
      <CoutureNavbar />
      
      {/* Hero */}
      <section className="relative py-32 px-4 overflow-hidden">
        {/* Subtle glow effect */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[200px]"
          style={{ backgroundColor: `${NOIR_COUTURE.muted}08` }}
        />
        
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8"
              style={{ 
                backgroundColor: `${NOIR_COUTURE.muted}08`,
                borderColor: NOIR_COUTURE.border
              }}
            >
              <Zap className="w-4 h-4" style={{ color: NOIR_COUTURE.muted }} />
              <span className="text-xs uppercase tracking-[0.15em] font-light" style={{ color: NOIR_COUTURE.muted }}>
                Fonctionnalités
              </span>
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-light mb-6 tracking-tight">
              Tout ce dont vous avez besoin
              <span className="block italic" style={{ color: NOIR_COUTURE.muted }}>pour impressionner</span>
            </h1>
            
            <p className="text-lg md:text-xl max-w-2xl mx-auto mb-12 font-light" style={{ color: NOIR_COUTURE.muted }}>
              Une carte NFC intelligente + un profil digital puissant + des analytics en temps réel. 
            </p>
            
            <Link to="/order/type">
              <Button 
                size="lg" 
                className="px-8 py-6 text-sm uppercase tracking-[0.1em] font-medium transition-all duration-500"
                style={{ 
                  backgroundColor: NOIR_COUTURE.silk,
                  color: NOIR_COUTURE.jet,
                }}
              >
                Créer ma Carte
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4" style={{ backgroundColor: NOIR_COUTURE.jetElevated }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.6 }}
                className="p-6 rounded-2xl border transition-all duration-500 group"
                style={{ 
                  backgroundColor: NOIR_COUTURE.jet,
                  borderColor: feature.highlight ? `${NOIR_COUTURE.muted}40` : NOIR_COUTURE.border,
                }}
              >
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-500"
                  style={{ 
                    backgroundColor: feature.highlight ? NOIR_COUTURE.silk : `${NOIR_COUTURE.muted}15`,
                    color: feature.highlight ? NOIR_COUTURE.jet : NOIR_COUTURE.silk
                  }}
                >
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-medium mb-2 tracking-tight">{feature.title}</h3>
                <p className="text-sm font-light leading-relaxed" style={{ color: NOIR_COUTURE.muted }}>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Compatibility */}
      <section className="py-20 px-4" style={{ backgroundColor: NOIR_COUTURE.jet }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Globe className="w-10 h-10 mx-auto mb-6" style={{ color: NOIR_COUTURE.muted }} />
            <h2 className="font-display text-2xl md:text-3xl font-light mb-4 tracking-tight">
              Compatible avec tous vos appareils
            </h2>
            <p className="mb-12 max-w-xl mx-auto font-light" style={{ color: NOIR_COUTURE.muted }}>
              i-wasp fonctionne avec 100% des smartphones modernes équipés NFC.
            </p>
            
            <div className="flex flex-wrap justify-center gap-3">
              {compatibility.map((device, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border"
                  style={{ 
                    backgroundColor: NOIR_COUTURE.jetElevated,
                    borderColor: NOIR_COUTURE.border
                  }}
                >
                  <CheckCircle2 className="w-4 h-4" style={{ color: NOIR_COUTURE.muted }} />
                  <span className="text-sm font-light">{device.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4" style={{ backgroundColor: NOIR_COUTURE.jetElevated }}>
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="p-10 md:p-16 rounded-3xl border"
            style={{ 
              backgroundColor: NOIR_COUTURE.silk,
              borderColor: `${NOIR_COUTURE.muted}30`
            }}
          >
            <h2 className="font-display text-2xl md:text-3xl font-light mb-4 tracking-tight" style={{ color: NOIR_COUTURE.jet }}>
              Prêt à moderniser votre networking ?
            </h2>
            <p className="mb-10 max-w-xl mx-auto font-light" style={{ color: NOIR_COUTURE.platinum }}>
              Rejoignez des milliers de professionnels qui ont déjà adopté la carte de visite du futur.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/order/type">
                <Button 
                  size="lg" 
                  className="font-medium px-8 text-sm uppercase tracking-[0.1em]"
                  style={{ 
                    backgroundColor: NOIR_COUTURE.jet,
                    color: NOIR_COUTURE.silk
                  }}
                >
                  Créer ma Carte
                </Button>
              </Link>
              <Link to="/pricing">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="text-sm uppercase tracking-[0.1em]"
                  style={{ 
                    borderColor: NOIR_COUTURE.jet,
                    color: NOIR_COUTURE.jet
                  }}
                >
                  Voir les tarifs
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      
      <CoutureFooter />
    </div>
  );
}
