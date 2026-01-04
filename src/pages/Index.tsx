import { Link } from "react-router-dom";
import { ArrowRight, Zap, RefreshCw, Shield, Briefcase, Building2, Palette, Users, Crown, CreditCard, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PhysicalCardPreview } from "@/components/PhysicalCardPreview";
import phonePreview from "@/assets/phone-preview.png";
import nfcCardWaxSeal from "@/assets/nfc-card-wax-seal.png";

/**
 * Index - Page d'accueil i-Wasp
 * Dark Luxury Theme - Fond noir, accent jaune unique
 */

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      
      {/* ════════════════════════════════════════════════════════════════
         HERO SECTION — Dark Luxury
         Fond noir, pas de dégradé
         ════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Contenu texte */}
            <div className="space-y-8 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
                Une carte NFC.
                <span className="block text-foreground">Un profil qui évolue.</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg mx-auto lg:mx-0">
                Carte physique premium. Identité digitale vivante.
                <span className="block mt-1">Zéro réimpression.</span>
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 justify-center lg:justify-start">
                <Link to="/order/offre">
                  <Button 
                    size="lg" 
                    className="bg-primary text-primary-foreground hover:brightness-110 font-semibold gap-2 px-8 py-6 text-base rounded-lg transition-all"
                  >
                    Commander
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                
                <a href="#carte-reelle">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-border text-foreground hover:bg-secondary px-8 py-6 text-base rounded-lg font-medium"
                  >
                    Voir la carte réelle
                  </Button>
                </a>
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
         SECTION — CARTE PHYSIQUE vs CARTE DIGITALE
         Deux blocs distincts
         ════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Carte Physique */}
            <div className="p-8 rounded-xl bg-card border border-border">
              <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <CreditCard className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Carte physique</h3>
              <p className="text-muted-foreground leading-relaxed">
                Support PVC premium avec puce NFC intégrée. Impression Evolis haute définition.
                Design verrouillé, qualité professionnelle.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>• Format CR80 standard</li>
                <li>• Finition mat premium</li>
                <li>• Puce NFC NTAG intégrée</li>
              </ul>
            </div>
            
            {/* Carte Digitale */}
            <div className="p-8 rounded-xl bg-card border border-border">
              <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <Smartphone className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Carte digitale</h3>
              <p className="text-muted-foreground leading-relaxed">
                Profil en ligne modifiable à tout moment. Évoluez sans réimprimer.
                Accessible via tap NFC ou lien direct.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>• Modifiable en temps réel</li>
                <li>• Réseaux sociaux intégrés</li>
                <li>• vCard automatique</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
         SECTION — CARTE RÉELLE
         Rendu 1:1
         ════════════════════════════════════════════════════════════════ */}
      <section id="carte-reelle" className="py-24 px-6 bg-card border-t border-border scroll-mt-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
              La carte que vous aurez réellement en main.
            </h2>
            <p className="text-primary font-medium mb-2">
              Rendu réel — impression Evolis haute définition.
            </p>
            <p className="text-xs text-muted-foreground">
              Aucun visuel marketing. Uniquement l'aperçu de production.
            </p>
          </div>
          
          <PhysicalCardPreview showSpecs />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
         SECTION — VIDÉOS NFC
         ════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground text-center mb-12">
            Voyez la technologie en action
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Vidéo carte NFC */}
            <div className="rounded-xl overflow-hidden bg-card border border-border">
              <video
                src="/nfc-demo-video.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <p className="text-sm text-muted-foreground">Carte NFC en main</p>
              </div>
            </div>
            
            {/* Vidéo ongles NFC */}
            <div className="rounded-xl overflow-hidden bg-card border border-border">
              <video
                src="/nails-demo-video.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <p className="text-sm text-muted-foreground">NFC en usage réel</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
         SECTION — COMMENT ÇA MARCHE
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
              <h3 className="font-semibold text-foreground text-lg mb-2">Contact enregistré</h3>
              <p className="text-muted-foreground text-sm">
                Instantanément dans le répertoire.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
         SECTION — POUR QUI
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
         SECTION — CTA FINAL
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
              Commander
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
