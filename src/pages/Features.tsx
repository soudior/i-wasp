import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative py-20 md:py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 texture-honeycomb opacity-30" />
        
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border mb-8">
            <Zap className="w-4 h-4 text-foreground" />
            <span className="text-sm font-medium text-foreground">Fonctionnalités</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground tracking-tight">
            Tout ce dont vous avez besoin pour
            <span className="block">impressionner</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Une carte NFC intelligente + un profil digital puissant + des analytics en temps réel. 
            Tout en un seul abonnement.
          </p>
          
          <Link to="/order/type">
            <Button size="lg" className="btn-iwasp px-8 py-6 text-lg">
              Créer ma Carte NFC
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className={`p-6 rounded-2xl bg-card border transition-all duration-200 hover:shadow-lg ${
                  feature.highlight 
                    ? 'border-foreground/20 shadow-md' 
                    : 'border-border'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                  feature.highlight 
                    ? 'bg-foreground text-background' 
                    : 'bg-accent'
                }`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compatibility */}
      <section className="py-16 px-4 bg-accent/50">
        <div className="max-w-4xl mx-auto text-center">
          <Globe className="w-12 h-12 text-foreground mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Compatible avec tous vos appareils
          </h2>
          <p className="text-muted-foreground mb-10 max-w-xl mx-auto">
            i-Wasp fonctionne avec 100% des smartphones modernes équipés NFC. 
            Et grâce au QR code intégré, même sans NFC, ça marche.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            {compatibility.map((device, i) => (
              <div 
                key={i}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border"
              >
                <CheckCircle2 className="w-4 h-4 text-foreground" />
                <span className="text-foreground text-sm">{device.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="p-8 md:p-12 rounded-3xl bg-foreground text-background">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Prêt à moderniser votre networking ?
            </h2>
            <p className="text-background/70 mb-8 max-w-xl mx-auto">
              Rejoignez des milliers de professionnels qui ont déjà adopté la carte de visite du futur.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/order/type">
                <Button size="lg" className="bg-background text-foreground hover:bg-background/90 font-semibold px-8">
                  Créer ma Carte NFC
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline" size="lg" className="border-background/30 text-background hover:bg-background/10">
                  Voir les tarifs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
