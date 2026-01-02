import { useNavigate } from "react-router-dom";
import { ArrowRight, Building2, Hotel, Store, CalendarDays, Check, X, Crown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NFCPhysicalCardSection } from "@/components/print/NFCPhysicalCardSection";
import iwaspLogo from "@/assets/iwasp-logo-white.png";
import nfcDemoVideo from "@/assets/nfc-demo-video.mp4";
/**
 * Index - Page institutionnelle i-wasp
 * 
 * Interface minimaliste orientée système.
 * PARCOURS OBLIGATOIRE : Toujours /order, jamais d'achat direct.
 */

const sectors = [
  { icon: Hotel, label: "Hôtellerie" },
  { icon: Store, label: "Commerce" },
  { icon: Building2, label: "Immobilier" },
  { icon: CalendarDays, label: "Événementiel" },
];

// Grille tarifaire - CONFIGURATION OBLIGATOIRE (pas d'achat direct)
const pricingPlans = [
  {
    id: "particulier",
    name: "Particulier",
    price: "29",
    description: "Carte NFC personnelle",
    features: [
      "1 carte NFC premium",
      "Profil digital illimité",
      "Apple & Google Wallet",
      "QR Code de secours",
    ],
    cta: "Configurer ma carte",
    popular: false,
  },
  {
    id: "professionnel",
    name: "Professionnel",
    price: "49",
    description: "Carte personnalisée entreprise",
    features: [
      "Carte couleur au choix",
      "Logo imprimé",
      "Nom, titre & entreprise",
      "Analytics détaillées",
      "Capture de leads",
    ],
    cta: "Configurer ma carte",
    popular: true,
  },
  {
    id: "equipe",
    name: "Équipe",
    price: "39",
    priceNote: "/ carte dès 10",
    description: "Tarif dégressif entreprise",
    features: [
      "Design unifié équipe",
      "Personnalisation corporate",
      "Paiement à la livraison",
      "Support prioritaire",
      "-15% dès 10 cartes",
      "-20% dès 25 cartes",
    ],
    cta: "Configurer ma carte",
    popular: false,
  },
];

const Index = () => {
  const navigate = useNavigate();

  /**
   * PARCOURS OBLIGATOIRE : Toujours rediriger vers /order
   * JAMAIS d'achat direct, configuration obligatoire
   */
  const handleConfigureCard = () => {
    navigate("/order/type");
  };

  return (
    <div className="min-h-[calc(100dvh-3.5rem)] flex flex-col">
      {/* Hero Section - Value proposition claire */}
      <section className="flex-1 flex items-center justify-center px-4 py-12 md:py-16">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          {/* Titre principal */}
          <div className="space-y-3">
            <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-foreground">
              Partagez vos contacts en un geste
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto">
              Une carte NFC premium. Un achat unique.
              <span className="block">Votre profil digital inclus à vie.</span>
            </p>
          </div>

          {/* Secteurs supportés */}
          <div className="flex flex-wrap justify-center gap-3 py-4">
            {sectors.map(({ icon: Icon, label }) => (
              <div 
                key={label}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/50 bg-muted/30"
              >
                <Icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>

          {/* Actions - CTA principal vers configuration */}
          <div className="flex flex-col items-center gap-4 pt-4">
            <Button 
              size="lg" 
              className="bg-foreground text-background hover:bg-foreground/90 gap-2 px-8 py-6 text-base"
              onClick={handleConfigureCard}
            >
              Configurer ma carte
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="lg"
              onClick={() => navigate("/demo")}
              className="text-muted-foreground hover:text-foreground"
            >
              Voir une démonstration
            </Button>
            <span className="text-sm text-muted-foreground">Parcours guidé en 7 étapes</span>
          </div>
        </div>
      </section>

      {/* Demo Section - Étapes du parcours */}
      <section className="py-12 px-4 bg-muted/30 border-y border-border/20">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-semibold text-foreground">
              Créez votre carte en 7 étapes
            </h2>
            <p className="text-muted-foreground">
              Parcours guidé, simple et sécurisé.
            </p>
          </div>

          {/* Étapes du parcours */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 py-4">
            {[
              { step: 1, title: "Type", desc: "Particulier, Pro, Équipe" },
              { step: 2, title: "Infos", desc: "Vos coordonnées" },
              { step: 3, title: "Lieu", desc: "Géolocalisation" },
              { step: 4, title: "Design", desc: "Logo & couleur" },
              { step: 5, title: "Options", desc: "Quantité & promo" },
              { step: 6, title: "Récap", desc: "Vérification" },
              { step: 7, title: "Paiement", desc: "Sécurisé" },
            ].map(({ step, title, desc }) => (
              <div key={step} className="p-3 rounded-xl border border-border/30 bg-card/50">
                <div className="w-7 h-7 rounded-full bg-foreground/10 flex items-center justify-center mx-auto mb-2">
                  <span className="text-xs font-semibold text-foreground">{step}</span>
                </div>
                <p className="text-xs font-medium">{title}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{desc}</p>
              </div>
            ))}
          </div>

          <Button 
            variant="outline" 
            size="lg"
            className="gap-2"
            onClick={handleConfigureCard}
          >
            Commencer la configuration
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Section Comparaison - Starter vs GOLD */}
      <section id="pricing" className="py-16 px-4 bg-muted/20 border-t border-border/20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
              Choisissez votre formule
            </h2>
            <p className="text-muted-foreground">
              Carte NFC incluse dans les deux offres. Passez au GOLD pour débloquer le maximum.
            </p>
          </div>

          {/* Comparison Table */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Pack Starter */}
            <div className="relative p-6 rounded-2xl border border-border/50 bg-card/50">
              <div className="text-center mb-6">
                <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-secondary flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-1">Pack Starter</h3>
                <p className="text-sm text-muted-foreground mb-3">Inclus avec votre carte</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-bold text-foreground">0 DH</span>
                  <span className="text-sm text-muted-foreground">/mois</span>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { label: "Carte NFC Physique", included: true },
                  { label: "Profil Personnalisable", included: true },
                  { label: "Liens (Insta, WA, etc.)", included: true },
                  { label: "Modification en temps réel", included: true },
                  { label: "Fonction Story", included: false },
                  { label: "Accès WiFi Rapide", included: false },
                  { label: "Statistiques (Analytics)", included: false },
                ].map((feature) => (
                  <div key={feature.label} className="flex items-center gap-3 text-sm">
                    {feature.included ? (
                      <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                        <X className="w-3 h-3 text-muted-foreground" />
                      </div>
                    )}
                    <span className={feature.included ? "text-foreground" : "text-muted-foreground"}>
                      {feature.label}
                    </span>
                  </div>
                ))}
              </div>

              <Button 
                className="w-full mt-6" 
                variant="outline"
                onClick={handleConfigureCard}
              >
                Commander ma carte
              </Button>
            </div>

            {/* i-wasp GOLD */}
            <div className="relative p-6 rounded-2xl border-2 border-amber-500/50 bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-orange-500/10 shadow-xl shadow-amber-500/10">
              {/* Popular badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold rounded-full flex items-center gap-1">
                <Crown className="w-3 h-3" />
                RECOMMANDÉ
              </div>
              
              {/* Gold glow effect */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/20 rounded-full blur-3xl" />
              
              <div className="relative text-center mb-6">
                <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-1">i-wasp GOLD</h3>
                <p className="text-sm text-muted-foreground mb-3">Toutes les fonctionnalités</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-bold text-amber-600">99 DH</span>
                  <span className="text-sm text-muted-foreground">/mois</span>
                </div>
              </div>

              <div className="relative space-y-3">
                {[
                  { label: "Carte NFC Physique", included: true },
                  { label: "Profil Personnalisable", included: true },
                  { label: "Liens (Insta, WA, etc.)", included: true },
                  { label: "Modification en temps réel", included: true },
                  { label: "Fonction Story", included: true, highlight: true },
                  { label: "Accès WiFi Rapide", included: true, highlight: true },
                  { label: "Statistiques (Analytics)", included: true, highlight: true },
                ].map((feature) => (
                  <div key={feature.label} className="flex items-center gap-3 text-sm">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      feature.highlight 
                        ? "bg-amber-500 shadow-sm shadow-amber-500/50" 
                        : "bg-green-500/10"
                    }`}>
                      <Check className={`w-3 h-3 ${feature.highlight ? "text-white" : "text-green-600"}`} />
                    </div>
                    <span className={feature.highlight ? "text-foreground font-medium" : "text-foreground"}>
                      {feature.label}
                      {feature.highlight && (
                        <span className="ml-2 text-xs text-amber-600 font-semibold">EXCLUSIF</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>

              <Button 
                className="w-full mt-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0 gap-2"
                onClick={handleConfigureCard}
              >
                <Crown className="w-4 h-4" />
                Passer au GOLD
              </Button>
            </div>
          </div>

          {/* Promotion */}
          <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-center mb-12">
            <p className="text-sm font-medium text-foreground">
              🎁 Offre de lancement : -10% avec le code <span className="font-mono bg-foreground/10 px-2 py-0.5 rounded">IWASP10</span>
            </p>
          </div>

          {/* FAQ Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground text-center mb-6">
              Questions fréquentes
            </h3>
            
            {[
              {
                question: "Comment passer au GOLD ?",
                answer: "Après avoir commandé votre carte, accédez à votre Dashboard et cliquez sur « Passer au Premium ». Vous serez mis en contact avec notre équipe via WhatsApp pour finaliser votre abonnement en toute simplicité."
              },
              {
                question: "Puis-je annuler mon abonnement GOLD ?",
                answer: "Oui, vous pouvez annuler à tout moment. Votre accès aux fonctionnalités GOLD reste actif jusqu'à la fin de la période payée. Aucun engagement, aucune surprise."
              },
              {
                question: "La carte NFC est-elle incluse dans le GOLD ?",
                answer: "La carte NFC physique est achetée séparément (à partir de 290 DH). L'abonnement GOLD (99 DH/mois) débloque les fonctionnalités avancées : Stories, WiFi rapide et Analytics."
              },
              {
                question: "Que se passe-t-il si je reste en Pack Starter ?",
                answer: "Votre carte NFC fonctionne parfaitement avec le Pack Starter inclus. Vous pouvez modifier votre profil et vos liens à tout moment. Seules les fonctionnalités exclusives (Story, WiFi, Stats) nécessitent le GOLD."
              },
            ].map((faq, index) => (
              <div 
                key={index}
                className="p-4 rounded-xl border border-border/50 bg-card/30"
              >
                <h4 className="font-medium text-foreground mb-2 flex items-start gap-2">
                  <span className="text-amber-500">?</span>
                  {faq.question}
                </h4>
                <p className="text-sm text-muted-foreground pl-5">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Template carte physique NFC */}
      <NFCPhysicalCardSection logoUrl={iwaspLogo} />

      {/* Section Vidéo Démo - L'expérience i-wasp */}
      <section className="py-16 px-4 bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Titre */}
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
              L'expérience i-wasp en action
            </h2>
            <p className="text-muted-foreground">
              Un geste suffit pour partager votre identité professionnelle
            </p>
          </div>

          {/* Vidéo avec effet premium */}
          <div className="relative mx-auto max-w-sm">
            {/* Ombre dorée */}
            <div 
              className="absolute inset-0 rounded-3xl blur-2xl opacity-30"
              style={{ 
                background: "linear-gradient(135deg, #D4AF37 0%, #F4E4BC 50%, #B8860B 100%)",
                transform: "translateY(8px) scale(0.95)"
              }}
            />
            
            {/* Conteneur vidéo */}
            <div className="relative rounded-3xl overflow-hidden border border-border/30 shadow-2xl group cursor-pointer">
              <video
                src={nfcDemoVideo}
                autoPlay
                loop
                muted
                playsInline
                className="w-full aspect-[9/16] object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]"
              />
            </div>
          </div>

          {/* CTA */}
          <Button 
            size="lg"
            className="bg-foreground text-background hover:bg-foreground/90 gap-2 px-10 py-6 text-base"
            onClick={handleConfigureCard}
          >
            Commander ma carte i-wasp
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

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