import { Link } from "react-router-dom";
import { ArrowRight, Zap, RefreshCw, Shield, Briefcase, Building2, Palette, Users, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PhysicalCardPreview } from "@/components/PhysicalCardPreview";
import phonePreview from "@/assets/phone-preview.png";
import nfcCardWaxSeal from "@/assets/nfc-card-wax-seal.png";

const WHATSAPP_CREATE = "https://wa.me/33626424394?text=Bonjour%20👋%0AJe%20souhaite%20créer%20ma%20carte%20i-wasp.";

/**
 * Index - Page d'accueil i-Wasp
 * Positionnement mondial, premium, direct
 */

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      
      {/* ════════════════════════════════════════════════════════════════
         HERO SECTION — ÉCRAN 1
         ════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Contenu texte */}
            <div className="space-y-8 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
                Votre carte de visite.
                <span className="block text-primary">En un seul geste.</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg mx-auto lg:mx-0">
                La conciergerie digitale qui transforme un simple contact
                en une expérience professionnelle complète.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 justify-center lg:justify-start">
                <Link to="/order/offre">
                  <Button 
                    size="lg" 
                    className="bg-primary text-primary-foreground hover:brightness-110 font-semibold gap-2 px-8 py-6 text-base rounded-lg transition-all"
                  >
                    Créer ma carte
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                
                <Link to="/demo">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-border text-foreground hover:bg-secondary px-8 py-6 text-base rounded-lg font-medium"
                  >
                    Voir comment ça marche
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Visuel — Carte + Téléphone */}
            <div className="relative flex items-center justify-center">
              <div className="relative">
                {/* Carte NFC */}
                <img
                  src={nfcCardWaxSeal}
                  alt="Carte NFC i-Wasp premium"
                  className="w-64 md:w-80 h-auto rounded-2xl shadow-2xl relative z-10"
                  loading="eager"
                />
                
                {/* Téléphone */}
                <div className="absolute -right-8 -bottom-8 md:-right-16 md:-bottom-12 z-20">
                  <img
                    src={phonePreview}
                    alt="Carte digitale i-Wasp sur téléphone"
                    className="w-32 md:w-44 h-auto rounded-xl shadow-xl"
                    loading="eager"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
         SECTION 2 — PROMESSE DE LEADERSHIP
         ════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-6">
            Pensée pour être numéro 1 mondial.
          </h2>
          
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-16">
            i-Wasp ne vend pas une carte.
            <span className="block mt-2">
              i-Wasp crée un standard mondial de l'identité professionnelle digitale.
            </span>
          </p>
          
          {/* 3 Piliers */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Un tap universel</h3>
              <p className="text-sm text-muted-foreground">
                Compatible tous smartphones, sans application.
              </p>
            </div>
            
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Une identité toujours à jour</h3>
              <p className="text-sm text-muted-foreground">
                Modifiez vos informations en temps réel.
              </p>
            </div>
            
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Une expérience maîtrisée</h3>
              <p className="text-sm text-muted-foreground">
                Design premium, données protégées.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
         SECTION 3 — COMMENT ÇA MARCHE
         ════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-card border-t border-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground text-center mb-16">
            Comment ça marche
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                1
              </div>
              <h3 className="font-semibold text-foreground text-lg mb-2">Créez votre carte</h3>
              <p className="text-muted-foreground text-sm">
                En quelques minutes, personnalisez votre profil professionnel.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                2
              </div>
              <h3 className="font-semibold text-foreground text-lg mb-2">Touchez un téléphone</h3>
              <p className="text-muted-foreground text-sm">
                Un simple contact NFC suffit.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                3
              </div>
              <h3 className="font-semibold text-foreground text-lg mb-2">Votre contact est enregistré</h3>
              <p className="text-muted-foreground text-sm">
                Instantanément dans le répertoire de votre interlocuteur.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
         SECTION 4 — POUR QUI
         ════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground text-center mb-16">
            Conçue pour les professionnels exigeants.
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { icon: Briefcase, label: "Entrepreneurs" },
              { icon: Building2, label: "Marques & Hôtels" },
              { icon: Palette, label: "Créateurs" },
              { icon: Users, label: "Commerciaux" },
              { icon: Crown, label: "Dirigeants" },
            ].map((item, i) => (
              <div 
                key={i}
                className="p-6 rounded-xl bg-card border border-border text-center hover:border-primary/50 transition-colors"
              >
                <item.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <p className="font-medium text-foreground text-sm">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
         SECTION 5 — APERÇU CARTE RÉELLE
         ════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-card border-t border-border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
              La carte que vous aurez réellement en main.
            </h2>
            <p className="text-muted-foreground mb-2">
              Impression premium – carte NFC professionnelle
            </p>
            <p className="text-xs text-muted-foreground/70">
              Aucun visuel marketing. Uniquement l'aperçu réel de production.
            </p>
          </div>
          
          <PhysicalCardPreview showSpecs />
          
          <div className="text-center mt-12">
            <Link to="/pricing">
              <Button 
                variant="outline"
                size="lg"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-6 rounded-lg font-medium"
              >
                Voir les offres
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
         SECTION 6 — PREUVE DE SÉRIEUX
         ════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-6 border-t border-border">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg text-muted-foreground">
            Utilisée par des professionnels, marques et établissements premium.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
         SECTION 7 — CTA FINAL
         ════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-card border-t border-border">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-8">
            Passez au standard professionnel supérieur.
          </h2>
          
          <Link to="/order/offre">
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:brightness-110 font-semibold gap-2 px-10 py-6 text-lg rounded-lg transition-all"
            >
              Créer ma carte i-Wasp
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
