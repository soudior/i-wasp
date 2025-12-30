import { Link } from "react-router-dom";
import { ArrowRight, Wifi, CreditCard, Building2, Hotel, Store, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NFCPhysicalCardSection } from "@/components/print/NFCPhysicalCardSection";
import { NFCAnimation3D } from "@/components/NFCAnimation3D";
import iwaspLogo from "@/assets/iwasp-logo-white.png";

/**
 * Index - Page institutionnelle i-wasp
 * 
 * Interface minimaliste orientée système.
 * Aucun contenu marketing, aucune animation décorative.
 * Présentation fonctionnelle du système NFC métier.
 */

const sectors = [
  { icon: Hotel, label: "Hôtellerie" },
  { icon: Store, label: "Commerce" },
  { icon: Building2, label: "Immobilier" },
  { icon: CalendarDays, label: "Événementiel" },
];

const Index = () => {
  return (
    <div className="min-h-[calc(100dvh-3.5rem)] flex flex-col">
      {/* Section principale */}
      <section className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Titre système */}
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-foreground">
              Infrastructure NFC métier
            </h1>
            <p className="text-muted-foreground text-lg">
              Cartes connectées automatisées pour professionnels
            </p>
          </div>

          {/* Secteurs supportés */}
          <div className="flex flex-wrap justify-center gap-4 py-6">
            {sectors.map(({ icon: Icon, label }) => (
              <div 
                key={label}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-muted/30"
              >
                <Icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>

          {/* Fonctionnalités clés */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6">
            <div className="p-4 rounded-lg border border-border/30 bg-card/50">
              <CreditCard className="w-5 h-5 text-foreground mb-2" />
              <p className="text-sm font-medium">Carte NFC</p>
              <p className="text-xs text-muted-foreground">Physique + digitale</p>
            </div>
            <div className="p-4 rounded-lg border border-border/30 bg-card/50">
              <Wifi className="w-5 h-5 text-foreground mb-2" />
              <p className="text-sm font-medium">Wi-Fi intégré</p>
              <p className="text-xs text-muted-foreground">QR automatique</p>
            </div>
            <div className="p-4 rounded-lg border border-border/30 bg-card/50">
              <Building2 className="w-5 h-5 text-foreground mb-2" />
              <p className="text-sm font-medium">White-label</p>
              <p className="text-xs text-muted-foreground">Marque client</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link to="/signup">
              <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90 gap-2">
                Accéder au système
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/demo">
              <Button variant="outline" size="lg">
                Voir une démonstration
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Section Animation NFC Spline */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-xl md:text-2xl font-medium text-foreground">
              Technologie NFC intégrée
            </h2>
            <p className="text-muted-foreground mt-2">
              Un simple geste pour partager vos informations
            </p>
          </div>
          
          {/* Animation 3D - Desktop visible, Mobile hidden for performance */}
          <div className="hidden md:block">
            <div 
              className="relative mx-auto rounded-2xl overflow-hidden"
              style={{ 
                height: "400px",
                maxWidth: "600px",
              }}
            >
              <NFCAnimation3D className="w-full h-full" />
            </div>
          </div>
          
          {/* Mobile fallback - Static visual */}
          <div className="md:hidden">
            <div 
              className="relative mx-auto rounded-2xl overflow-hidden bg-[#F7F7F5] flex items-center justify-center p-8"
              style={{ 
                height: "200px",
                maxWidth: "300px",
              }}
            >
              <div className="text-center">
                <CreditCard className="w-12 h-12 mx-auto text-muted-foreground/60 mb-3" />
                <p className="text-sm text-muted-foreground">
                  Approchez votre téléphone
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Template carte physique NFC */}
      <NFCPhysicalCardSection logoUrl={iwaspLogo} />

      {/* Footer minimal */}
      <footer className="py-6 px-4 border-t border-border/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} i-wasp</span>
          <span>Infrastructure NFC métier</span>
        </div>
      </footer>
    </div>
  );
};

export default Index;
