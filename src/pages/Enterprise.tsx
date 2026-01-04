import { Button } from "@/components/ui/button";
import { 
  Building2, 
  Users, 
  Shield, 
  BarChart3, 
  Palette, 
  Headphones,
  CheckCircle2,
  ArrowRight,
  Globe,
  Lock
} from "lucide-react";

// WhatsApp links
const WHATSAPP_DEVIS = "https://wa.me/33626424394?text=Bonjour%20👋%0AJe%20souhaite%20demander%20un%20devis%20pour%20des%20cartes%20NFC%20pour%20mon%20entreprise.";
const WHATSAPP_DEMO = "https://wa.me/33626424394?text=Bonjour%20👋%0AJe%20souhaite%20voir%20une%20démo%20de%20la%20solution%20iWasp%20Business.";

const benefits = [
  {
    icon: Users,
    title: "Gestion d'équipes",
    description: "Dashboard admin centralisé pour gérer toutes les cartes de vos collaborateurs. Ajout, modification, désactivation en un clic.",
  },
  {
    icon: Palette,
    title: "Branding entreprise",
    description: "Personnalisez les cartes avec votre logo, vos couleurs et votre charte graphique. Cohérence de marque garantie.",
  },
  {
    icon: BarChart3,
    title: "Analytics équipe",
    description: "Statistiques consolidées pour toute l'équipe. Qui performe le mieux ? Quels événements génèrent le plus de scans ?",
  },
  {
    icon: Shield,
    title: "Sécurité enterprise",
    description: "SSO, authentification 2FA, contrôle des accès granulaire. Vos données sont protégées selon les standards enterprise.",
  },
  {
    icon: Globe,
    title: "Déploiement global",
    description: "Déployez des cartes NFC pour vos équipes à travers le monde. Support multilingue et multi-timezone.",
  },
  {
    icon: Headphones,
    title: "Support dédié",
    description: "Un account manager dédié et support prioritaire. Onboarding personnalisé pour votre équipe.",
  },
];

const useCases = [
  {
    title: "Équipes commerciales",
    description: "Équipez vos commerciaux avec des cartes NFC connectées au CRM. Chaque scan génère automatiquement un lead qualifié.",
  },
  {
    title: "Événements & Salons",
    description: "Cartes temporaires ou permanentes pour vos événements. Collecte de leads automatisée, analytics en temps réel.",
  },
  {
    title: "Hôtellerie & Conciergerie",
    description: "Cartes pour le personnel d'accueil avec accès aux recommandations, réservations et services premium.",
  },
  {
    title: "Agences immobilières",
    description: "Chaque agent avec sa carte NFC liée à son portfolio. Les clients scannent et accèdent directement aux biens.",
  },
];

const trustedBy = [
  "Startups Tech",
  "Agences Immobilières", 
  "Hôtels de Luxe",
  "Cabinets de Conseil",
  "Équipes Commerciales",
  "Événementiel",
];

export default function Enterprise() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative py-20 md:py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 texture-honeycomb opacity-30" />
        
        <div className="relative max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border mb-8">
                <Building2 className="w-4 h-4 text-foreground" />
                <span className="text-sm font-medium text-foreground">i-Wasp Business</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground leading-tight tracking-tight">
                Le NFC professionnel pour les entreprises
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8">
                Équipez votre équipe avec des cartes NFC intelligentes. 
                Dashboard centralisé, analytics équipe, branding personnalisé.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a href={WHATSAPP_DEVIS} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="btn-iwasp px-8">
                    Demander un devis
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </a>
                <a href={WHATSAPP_DEMO} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="lg" className="border-border text-foreground hover:bg-accent">
                    Voir une démo
                  </Button>
                </a>
              </div>
            </div>
            
            <div className="relative hidden md:block">
              <div className="relative p-8 rounded-3xl bg-card border border-border shadow-lg">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-accent">
                    <div className="w-10 h-10 rounded-full bg-foreground flex items-center justify-center">
                      <span className="text-background font-bold">A</span>
                    </div>
                    <div>
                      <p className="text-foreground font-medium">Ahmed Benali</p>
                      <p className="text-muted-foreground text-sm">Commercial Senior</p>
                    </div>
                    <span className="ml-auto text-foreground text-sm font-medium">247 scans</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-accent">
                    <div className="w-10 h-10 rounded-full bg-foreground flex items-center justify-center">
                      <span className="text-background font-bold">S</span>
                    </div>
                    <div>
                      <p className="text-foreground font-medium">Sara Moussaoui</p>
                      <p className="text-muted-foreground text-sm">Directrice Marketing</p>
                    </div>
                    <span className="ml-auto text-foreground text-sm font-medium">189 scans</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-accent">
                    <div className="w-10 h-10 rounded-full bg-foreground flex items-center justify-center">
                      <span className="text-background font-bold">K</span>
                    </div>
                    <div>
                      <p className="text-foreground font-medium">Karim Idrissi</p>
                      <p className="text-muted-foreground text-sm">Account Manager</p>
                    </div>
                    <span className="ml-auto text-foreground text-sm font-medium">156 scans</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-12 px-4 border-y border-border">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-muted-foreground text-sm mb-6">Utilisé par des entreprises dans</p>
          <div className="flex flex-wrap justify-center gap-8">
            {trustedBy.map((company, i) => (
              <span key={i} className="text-foreground/60 font-medium">{company}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
              Tout ce qu'il faut pour gérer votre équipe
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Une solution complète pour déployer et gérer les cartes NFC de tous vos collaborateurs.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-card border border-border hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-4 bg-accent/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
              Cas d'usage
            </h2>
            <p className="text-muted-foreground text-lg">
              i-Wasp Business s'adapte à tous les secteurs et toutes les tailles d'équipe.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {useCases.map((useCase, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-background border border-border"
              >
                <h3 className="text-xl font-semibold text-foreground mb-2">{useCase.title}</h3>
                <p className="text-muted-foreground">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Lock className="w-12 h-12 text-foreground mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-foreground mb-4 tracking-tight">
            Sécurité de niveau enterprise
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Vos données sont protégées selon les standards les plus stricts. 
            Hébergement européen, chiffrement de bout en bout, conformité RGPD.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            {["RGPD Compliant", "Chiffrement AES-256", "SSO / SAML", "2FA", "Audit Logs"].map((badge, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border">
                <CheckCircle2 className="w-4 h-4 text-foreground" />
                <span className="text-foreground text-sm">{badge}</span>
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
              Prêt à équiper votre équipe ?
            </h2>
            <p className="text-background/70 mb-8 max-w-xl mx-auto">
              Discutons de vos besoins. Notre équipe vous accompagne de A à Z dans le déploiement.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href={WHATSAPP_DEVIS} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-background text-foreground hover:bg-background/90 font-semibold px-8">
                  Demander un devis
                </Button>
              </a>
              <a href={WHATSAPP_DEMO} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="border-background/30 text-background hover:bg-background/10">
                  Réserver une démo
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
