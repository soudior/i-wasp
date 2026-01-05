/**
 * Features Page — Fonctionnalités i-wasp
 * 
 * Palette Stealth Luxury:
 * - Noir Émeraude: #050807
 * - Argent Titane: #A5A9B4
 * - Platine: #D1D5DB
 */

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ClubNavbar } from "@/components/ClubNavbar";
import { GlobalFooter } from "@/components/GlobalFooter";
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

// Stealth Luxury Colors
const STEALTH = {
  noir: "#050807",
  noirElevated: "#0A0F0D",
  titanium: "#A5A9B4",
  platinum: "#D1D5DB",
  emeraldGlow: "#1A2B26",
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
    <div className="min-h-screen" style={{ backgroundColor: STEALTH.noir, color: 'white' }}>
      <ClubNavbar />
      
      {/* Hero */}
      <section className="relative py-32 px-4 overflow-hidden">
        {/* Glow effect */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[200px]"
          style={{ backgroundColor: `${STEALTH.titanium}08` }}
        />
        
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8"
              style={{ 
                backgroundColor: `${STEALTH.titanium}10`,
                borderColor: `${STEALTH.titanium}30`
              }}
            >
              <Zap className="w-4 h-4" style={{ color: STEALTH.platinum }} />
              <span className="text-sm font-medium" style={{ color: STEALTH.platinum }}>Fonctionnalités</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Tout ce dont vous avez besoin pour
              <span className="block" style={{ color: STEALTH.platinum }}>impressionner</span>
            </h1>
            
            <p className="text-xl max-w-2xl mx-auto mb-10" style={{ color: `${STEALTH.titanium}99` }}>
              Une carte NFC intelligente + un profil digital puissant + des analytics en temps réel. 
              Tout en un seul abonnement.
            </p>
            
            <Link to="/order/type">
              <Button 
                size="lg" 
                className="px-8 py-6 text-lg font-semibold"
                style={{ 
                  background: `linear-gradient(135deg, ${STEALTH.titanium}, ${STEALTH.platinum})`,
                  color: STEALTH.noir
                }}
              >
                Créer ma Carte NFC
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4" style={{ backgroundColor: STEALTH.noirElevated }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-6 rounded-2xl border transition-all duration-200"
                style={{ 
                  backgroundColor: `${STEALTH.noir}80`,
                  borderColor: feature.highlight ? `${STEALTH.titanium}40` : `${STEALTH.titanium}20`,
                  boxShadow: feature.highlight ? `0 0 40px ${STEALTH.titanium}10` : 'none'
                }}
              >
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ 
                    backgroundColor: feature.highlight ? STEALTH.titanium : `${STEALTH.titanium}20`,
                    color: feature.highlight ? STEALTH.noir : STEALTH.platinum
                  }}
                >
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p style={{ color: `${STEALTH.titanium}99` }}>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Compatibility */}
      <section className="py-16 px-4" style={{ backgroundColor: STEALTH.noir }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Globe className="w-12 h-12 mx-auto mb-6" style={{ color: STEALTH.platinum }} />
            <h2 className="text-3xl font-bold mb-4">
              Compatible avec tous vos appareils
            </h2>
            <p className="mb-10 max-w-xl mx-auto" style={{ color: `${STEALTH.titanium}99` }}>
              i-Wasp fonctionne avec 100% des smartphones modernes équipés NFC. 
              Et grâce au QR code intégré, même sans NFC, ça marche.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              {compatibility.map((device, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border"
                  style={{ 
                    backgroundColor: `${STEALTH.noirElevated}`,
                    borderColor: `${STEALTH.titanium}30`
                  }}
                >
                  <CheckCircle2 className="w-4 h-4" style={{ color: STEALTH.platinum }} />
                  <span className="text-sm">{device.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4" style={{ backgroundColor: STEALTH.noirElevated }}>
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 md:p-12 rounded-3xl border"
            style={{ 
              background: `linear-gradient(135deg, ${STEALTH.titanium}, ${STEALTH.platinum})`,
              borderColor: `${STEALTH.platinum}40`
            }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: STEALTH.noir }}>
              Prêt à moderniser votre networking ?
            </h2>
            <p className="mb-8 max-w-xl mx-auto" style={{ color: `${STEALTH.noir}B3` }}>
              Rejoignez des milliers de professionnels qui ont déjà adopté la carte de visite du futur.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/order/type">
                <Button 
                  size="lg" 
                  className="font-semibold px-8"
                  style={{ 
                    backgroundColor: STEALTH.noir,
                    color: 'white'
                  }}
                >
                  Créer ma Carte NFC
                </Button>
              </Link>
              <Link to="/pricing">
                <Button 
                  variant="outline" 
                  size="lg"
                  style={{ 
                    borderColor: `${STEALTH.noir}40`,
                    color: STEALTH.noir
                  }}
                >
                  Voir les tarifs
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      
      <GlobalFooter variant="dark" />
    </div>
  );
}
