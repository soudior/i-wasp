import { useState } from "react";
import { CreditCard, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileOptimizedVideo } from "@/components/MobileOptimizedVideo";
import { IWASPLogo } from "@/components/IWASPLogo";
import nfcPoster from "@/assets/posters/nfc-demo-poster.webp";
import nailsPoster from "@/assets/posters/nails-demo-poster.webp";

// iOS: servir les vidéos depuis /public pour éviter les soucis de lecture
const nfcDemoVideo = "/nfc-demo-video.mp4";
const nailsDemoVideo = "/nails-demo-video.mp4";

// WhatsApp links
const WHATSAPP_CARTE = "https://wa.me/33626424394?text=Bonjour%20👋%0AJe%20souhaite%20commander%20une%20carte%20NFC%20i-wasp.";
const WHATSAPP_NAILS = "https://wa.me/33626424394?text=Bonjour%20👋%0AJe%20souhaite%20commander%20un%20Pack%20Nails%20i-wasp.";

/**
 * Index - Page d'accueil i-wasp
 * 
 * Design : Signature carte NFC blanche ultra premium
 * Style : Minimaliste, luxe discret, silencieux
 */

type ProductMode = "carte" | "ongle";

const Index = () => {
  const [mode, setMode] = useState<ProductMode>("carte");

  return (
    <div className="min-h-screen bg-background">
      
      {/* ════════════════════════════════════════════════════════════════
         HERO SECTION — Blanc pur, luxe silencieux
         ════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20">
        
        {/* Texture subtile nid d'abeille */}
        <div className="absolute inset-0 texture-honeycomb-subtle opacity-50" />
        
        <div className="relative max-w-xl mx-auto text-center space-y-10">
          
          {/* Logo */}
          <div className="flex justify-center">
            <IWASPLogo size="xl" />
          </div>
          
          {/* Titre Principal */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-foreground leading-[1.1]">
              Connectez-vous
              <span className="block">d'un simple geste.</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl font-light max-w-md mx-auto">
              Technologie NFC invisible. Élégance absolue.
            </p>
          </div>

          {/* Sélecteur Produit — Minimal */}
          <div className="flex justify-center">
            <div className="inline-flex bg-secondary p-1 rounded-lg">
              <button
                onClick={() => setMode("carte")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  mode === "carte"
                    ? "bg-foreground text-background shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>La Carte</span>
              </button>
              
              <button
                onClick={() => setMode("ongle")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  mode === "ongle"
                    ? "bg-foreground text-background shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>L'Ongle NFC</span>
              </button>
            </div>
          </div>

          {/* Vidéo — Cadre épuré */}
          <div className="relative mx-auto max-w-[280px]">
            {/* Ombre douce */}
            <div className="absolute inset-0 rounded-[2rem] bg-foreground/5 blur-2xl transform translate-y-4 scale-95" />
            
            {/* Cadre smartphone */}
            <div className="relative bg-foreground p-1 rounded-[2rem] shadow-lg overflow-hidden">
              {/* Video Carte */}
              <div className={mode === "carte" ? "block" : "hidden"}>
                <MobileOptimizedVideo 
                  src={nfcDemoVideo}
                  poster={nfcPoster}
                  aspectRatio="9/16"
                  autoPlayOnDesktop={mode === "carte"}
                  rounded="rounded-[1.75rem]"
                />
              </div>
              {/* Video Ongle */}
              <div className={mode === "ongle" ? "block" : "hidden"}>
                <MobileOptimizedVideo 
                  src={nailsDemoVideo}
                  poster={nailsPoster}
                  aspectRatio="9/16"
                  autoPlayOnDesktop={mode === "ongle"}
                  rounded="rounded-[1.75rem]"
                />
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a 
              href={mode === "carte" ? WHATSAPP_CARTE : WHATSAPP_NAILS}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button 
                size="lg" 
                className="w-full bg-foreground text-background hover:bg-foreground/90 font-medium gap-2 px-8 py-6 text-base rounded-lg transition-colors"
              >
                {mode === "carte" ? (
                  <>
                    <CreditCard className="w-4 h-4" />
                    Commander la Carte
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Commander le Pack Nails
                  </>
                )}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </a>
          </div>

          {/* Signature */}
          <p className="text-muted-foreground text-xs font-light tracking-[0.2em] uppercase pt-8">
            Tap · Connect · Empower
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
         SECTION PRODUITS — Grille minimaliste
         ════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-4">
              Deux innovations, une signature.
            </h2>
            <p className="text-muted-foreground text-lg max-w-lg mx-auto">
              Technologie NFC premium, conçue pour les professionnels exigeants.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Carte NFC */}
            <div className="group card-iwasp p-8 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-6">
                <CreditCard className="w-6 h-6 text-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                La Carte i-wasp
              </h3>
              <p className="text-muted-foreground mb-6">
                Carte de visite NFC ultra-premium. Un simple contact transmet votre profil complet.
              </p>
              <a 
                href={WHATSAPP_CARTE}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-foreground font-medium hover:gap-3 transition-all"
              >
                Commander
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Pack Nails */}
            <div className="group card-iwasp p-8 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                L'Ongle NFC
              </h3>
              <p className="text-muted-foreground mb-6">
                Innovation mondiale. La technologie NFC invisible sous votre vernis.
              </p>
              <a 
                href={WHATSAPP_NAILS}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-foreground font-medium hover:gap-3 transition-all"
              >
                Commander
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
         SECTION VALEURS — Luxe silencieux
         ════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-6">
            L'innovation qui ne se voit pas,
            <span className="block text-muted-foreground">mais qui change tout.</span>
          </h2>

          <p className="text-muted-foreground text-lg leading-relaxed mb-12 max-w-2xl mx-auto">
            Né à l'intersection du luxe et de la technologie, i-wasp redéfinit le networking. 
            Une connexion fluide, élégante et instantanée.
          </p>

          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <span className="text-foreground font-semibold">01</span>
              </div>
              <h3 className="font-semibold text-foreground">Minimaliste</h3>
              <p className="text-muted-foreground text-sm">
                Design épuré. Aucun superflu. Chaque détail a une raison d'être.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <span className="text-foreground font-semibold">02</span>
              </div>
              <h3 className="font-semibold text-foreground">Premium</h3>
              <p className="text-muted-foreground text-sm">
                Matériaux nobles. Finitions soignées. Qualité sans compromis.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <span className="text-foreground font-semibold">03</span>
              </div>
              <h3 className="font-semibold text-foreground">Instantané</h3>
              <p className="text-muted-foreground text-sm">
                Un geste suffit. Votre profil complet transmis en une seconde.
              </p>
            </div>
          </div>

          {/* Séparateur subtil */}
          <div className="w-16 h-px bg-border mx-auto mt-16" />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
         CTA FINAL — Sobre et direct
         ════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-foreground text-background">
        <div className="max-w-2xl mx-auto text-center">
          
          <IWASPLogo size="lg" className="justify-center mb-8 [&_*]:text-background" />
          
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-6">
            Prêt à vous connecter ?
          </h2>
          
          <p className="text-background/70 text-lg mb-10">
            Rejoignez les professionnels qui font la différence.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href={WHATSAPP_CARTE}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button 
                size="lg"
                className="bg-background text-foreground hover:bg-background/90 font-medium gap-2 px-8 py-6 rounded-lg"
              >
                <CreditCard className="w-4 h-4" />
                Commander maintenant
                <ArrowRight className="w-4 h-4" />
              </Button>
            </a>
          </div>
          
          <p className="text-background/40 text-xs tracking-[0.15em] uppercase mt-12">
            Livraison Maroc & International
          </p>
        </div>
      </section>
    </div>
  );
};

export default Index;
