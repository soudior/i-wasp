import { Link } from "react-router-dom";
import { ArrowRight, CreditCard, Sparkles, Smartphone, Package, Zap, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import nfcCardWaxSeal from "@/assets/nfc-card-wax-seal.png";
import phonePreview from "@/assets/phone-preview.png";

/**
 * Index - Page d'accueil i-Wasp
 * REFONTE COMPLÈTE — Dark Premium (#0B0B0B)
 * Mobile-first, CTAs visibles, parcours clair
 */

const Index = () => {
  const scrollToProducts = () => {
    document.getElementById("produits-nfc")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      
      {/* ════════════════════════════════════════════════════════════════
         HERO SECTION — Above the fold
         Deux CTAs visibles immédiatement
         ════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-6 pt-24 pb-16">
        <div className="max-w-6xl mx-auto w-full">
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
              
              {/* DEUX CTAs AU-DESSUS DE LA LIGNE DE FLOTTEMENT */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 justify-center lg:justify-start">
                {/* CTA Principal — Jaune */}
                <Link to="/order/type">
                  <Button 
                    size="lg" 
                    className="bg-primary text-primary-foreground hover:brightness-110 font-semibold gap-2 px-8 py-6 text-base rounded-lg transition-all min-h-[56px]"
                  >
                    Créer ma carte maintenant
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                
                {/* CTA Secondaire — Contour jaune */}
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={scrollToProducts}
                  className="border-primary text-primary hover:bg-primary/10 px-8 py-6 text-base rounded-lg font-medium min-h-[56px]"
                >
                  Voir les produits NFC
                </Button>
              </div>
            </div>
            
            {/* Visuel — Carte + Téléphone */}
            <div className="relative flex items-center justify-center">
              <div className="relative">
                {/* Vidéo Hero optionnelle */}
                <video
                  src="/nfc-demo-video.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-72 md:w-96 h-auto rounded-2xl shadow-2xl relative z-10 object-cover"
                  poster={nfcCardWaxSeal}
                />
                
                {/* Téléphone overlay */}
                <div className="absolute -right-4 -bottom-8 md:-right-12 md:-bottom-12 z-20">
                  <img
                    src={phonePreview}
                    alt="Carte digitale i-Wasp sur téléphone"
                    className="w-28 md:w-40 h-auto rounded-xl shadow-xl"
                    loading="eager"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
         HERO VIDEO — Démonstration NFC pleine largeur
         Carte passant devant téléphone, geste évident
         ════════════════════════════════════════════════════════════════ */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)' }}>
            {/* Video avec aspect ratio responsive */}
            <div className="relative aspect-video md:aspect-video">
              <video
                src="/nfc-demo-video.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ backgroundColor: '#0B0B0B' }}
              />
            </div>
            {/* Overlay dégradé subtil bas */}
            <div 
              className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
              style={{ background: 'linear-gradient(to top, rgba(11,11,11,0.6) 0%, transparent 100%)' }}
            />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
         SECTION PRODUITS NFC — Choix des supports
         ════════════════════════════════════════════════════════════════ */}
      <section id="produits-nfc" className="py-20 px-6 border-t border-border scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
              Choisissez votre support NFC
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Chaque support intègre la technologie NFC et se connecte à votre profil digital.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Carte NFC PVC */}
            <Link 
              to="/order/type?product=pvc"
              className="group relative rounded-xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-all"
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <img 
                  src={nfcCardWaxSeal}
                  alt="Carte NFC PVC i-Wasp"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Carte NFC PVC</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Format carte bancaire. Impression Evolis haute définition.
                </p>
                <span className="inline-flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all">
                  Choisir ce support
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
            
            {/* Ongles NFC */}
            <Link 
              to="/order/type?product=nails"
              className="group relative rounded-xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-all"
            >
              <div className="aspect-[4/3] relative overflow-hidden bg-card">
                <video
                  src="/nails-demo-video.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Ongles NFC</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Innovation beauté. Technologie intégrée à vos ongles.
                </p>
                <span className="inline-flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all">
                  Choisir ce support
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
            
            {/* Carte Métal */}
            <div className="group relative rounded-xl overflow-hidden bg-card border border-border opacity-70">
              <div className="aspect-[4/3] relative overflow-hidden bg-secondary flex items-center justify-center">
                <div className="text-center p-6">
                  <Package className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Bientôt disponible</p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-5 h-5 text-muted-foreground" />
                  <h3 className="text-lg font-semibold text-muted-foreground">Carte Métal</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Finition acier brossé. Premium ultime.
                </p>
                <span className="inline-flex items-center gap-2 text-muted-foreground font-medium text-sm">
                  Prochainement
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
         SECTION — COMMENT ÇA MARCHE (3 étapes visuelles)
         ════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-6 bg-card border-t border-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground text-center mb-16">
            Comment ça marche
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Étape 1 */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-6">
                <CreditCard className="w-7 h-7" />
              </div>
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                1
              </div>
              <h3 className="font-semibold text-foreground text-lg mb-2">
                Choisissez votre support NFC
              </h3>
              <p className="text-muted-foreground text-sm">
                Carte PVC, ongles NFC ou carte métal selon vos préférences.
              </p>
            </div>
            
            {/* Étape 2 */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-6">
                <Smartphone className="w-7 h-7" />
              </div>
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                2
              </div>
              <h3 className="font-semibold text-foreground text-lg mb-2">
                Créez votre profil digital
              </h3>
              <p className="text-muted-foreground text-sm">
                Remplissez vos informations en quelques minutes. Modifiable à tout moment.
              </p>
            </div>
            
            {/* Étape 3 */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-6">
                <Zap className="w-7 h-7" />
              </div>
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                3
              </div>
              <h3 className="font-semibold text-foreground text-lg mb-2">
                Recevez et utilisez immédiatement
              </h3>
              <p className="text-muted-foreground text-sm">
                Un simple tap NFC partage votre profil instantanément.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
         SECTION — VIDÉOS PRODUITS
         ════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-6 border-t border-border">
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
                <h3 className="font-semibold text-foreground mb-1">Carte NFC en action</h3>
                <p className="text-sm text-muted-foreground">Un tap suffit pour partager votre profil</p>
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
                <h3 className="font-semibold text-foreground mb-1">Ongles NFC i-Wasp</h3>
                <p className="text-sm text-muted-foreground">Innovation beauté connectée</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
         SECTION — CTA FINAL
         ════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-6 bg-card border-t border-border">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-6">
            Prêt à passer au digital ?
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Créez votre carte NFC en quelques minutes et commencez à partager votre profil.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/order/type">
              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground hover:brightness-110 font-semibold gap-2 px-10 py-6 text-lg rounded-lg transition-all"
              >
                Créer ma carte maintenant
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            
            <Link to="/signup">
              <Button 
                variant="outline"
                size="lg"
                className="border-border text-foreground hover:bg-secondary gap-2 px-8 py-6 text-base rounded-lg"
              >
                <UserPlus className="w-5 h-5" />
                Créer un compte
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
         MOBILE STICKY CTA — Bouton fixe en bas
         ════════════════════════════════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-lg border-t border-border md:hidden z-40 safe-area-bottom">
        <Link to="/order/type" className="block">
          <Button 
            size="lg" 
            className="w-full bg-primary text-primary-foreground hover:brightness-110 font-semibold gap-2 py-6 text-base rounded-lg min-h-[56px]"
          >
            Créer ma carte maintenant
            <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>
      </div>
      
      {/* Spacer pour le sticky CTA mobile */}
      <div className="h-24 md:hidden" />
    </div>
  );
};

export default Index;
