import { useState } from "react";
import { CreditCard, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileOptimizedVideo } from "@/components/MobileOptimizedVideo";
import { IWASPLogo } from "@/components/IWASPLogo";
import { NFCCardPreview } from "@/components/NFCCardPreview";
import nfcPoster from "@/assets/posters/nfc-demo-poster.webp";
import nailsPoster from "@/assets/posters/nails-demo-poster.webp";

// iOS: servir les vidéos depuis /public pour éviter les soucis de lecture
const nfcDemoVideo = "/nfc-demo-video.mp4";
const nailsDemoVideo = "/nails-demo-video.mp4";

// WhatsApp links
const WHATSAPP_CARTE = "https://wa.me/33626424394?text=Bonjour%20👋%0AJe%20souhaite%20commander%20une%20carte%20NFC%20i-wasp.";
const WHATSAPP_NAILS = "https://wa.me/33626424394?text=Bonjour%20👋%0AJe%20souhaite%20commander%20un%20Pack%20Nails%20i-wasp.";

/**
 * Index - Page d'accueil i-Wasp
 * 
 * i-Wasp : La conciergerie digitale de votre identité professionnelle.
 * Style : Luxe discret, calme, premium, silencieux.
 */

type ProductMode = "carte" | "ongle";

const Index = () => {
  const [mode, setMode] = useState<ProductMode>("carte");
  const [cardName, setCardName] = useState("");
  const [cardTitle, setCardTitle] = useState("");

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
            <p className="text-sm text-muted-foreground tracking-widest uppercase">
              Conciergerie digitale
            </p>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground leading-[1.1]">
              Votre identité,
              <span className="block">notre service.</span>
            </h1>
            <p className="text-muted-foreground text-lg font-light max-w-md mx-auto">
              Un simple geste. Votre profil complet partagé.
            </p>
          </div>

          {/* Sélecteur Produit — Minimal */}
          <div className="flex justify-center">
            <div className="inline-flex bg-secondary p-1 rounded-lg">
              <button
                onClick={() => setMode("carte")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  mode === "carte"
                    ? "bg-primary text-primary-foreground shadow-sm"
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
                    ? "bg-primary text-primary-foreground shadow-sm"
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
                className="w-full bg-primary text-primary-foreground hover:brightness-105 font-medium gap-2 px-8 py-6 text-base rounded-lg transition-all"
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
            La conciergerie de votre identité.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
         SECTION CARTE PHYSIQUE — Prévisualisation 3D
         ════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-12">
            <p className="text-sm text-muted-foreground tracking-widest uppercase mb-3">
              Aperçu
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-4">
              La Carte. Votre clé d'accès.
            </h2>
            <p className="text-muted-foreground text-lg max-w-lg mx-auto">
              Personnalisez votre aperçu en temps réel.
            </p>
          </div>

          {/* Inputs de personnalisation */}
          <div className="max-w-sm mx-auto mb-10 space-y-4">
            <div className="space-y-2">
              <label htmlFor="cardName" className="text-sm font-medium text-foreground">
                Votre nom
              </label>
              <input
                id="cardName"
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="Prénom Nom"
                className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="cardTitle" className="text-sm font-medium text-foreground">
                Votre titre
              </label>
              <input
                id="cardTitle"
                type="text"
                value={cardTitle}
                onChange={(e) => setCardTitle(e.target.value)}
                placeholder="CEO · Votre Entreprise"
                className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
              />
            </div>
          </div>

          <NFCCardPreview 
            name={cardName || "Votre Nom"} 
            title={cardTitle || "Votre Titre · i-Wasp"}
            showFlipHint={true}
          />
          
          <div className="text-center mt-12">
            <a 
              href={WHATSAPP_CARTE}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground hover:brightness-105 font-medium gap-2 px-8 py-6 text-base rounded-lg"
              >
                <CreditCard className="w-4 h-4" />
                Commander ma Carte
                <ArrowRight className="w-4 h-4" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
         SECTION PRODUITS — Grille minimaliste
         ════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-16">
            <p className="text-sm text-muted-foreground tracking-widest uppercase mb-3">
              Nos services
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-4">
              Une conciergerie. Deux accès.
            </h2>
            <p className="text-muted-foreground text-lg max-w-lg mx-auto">
              Choisissez votre clé d'entrée vers le networking premium.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Carte NFC */}
            <div className="group card-iwasp p-8 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center mb-6">
                <CreditCard className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                La Carte i-Wasp
              </h3>
              <p className="text-muted-foreground mb-6">
                Votre clé d'accès physique. Un contact suffit pour partager votre identité complète.
              </p>
              <a 
                href={WHATSAPP_CARTE}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-foreground font-medium hover:gap-3 transition-all"
              >
                Accéder au service
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
                Le networking invisible. La technologie se fond dans votre style.
              </p>
              <a 
                href={WHATSAPP_NAILS}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-foreground font-medium hover:gap-3 transition-all"
              >
                Accéder au service
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
          
          <p className="text-sm text-muted-foreground tracking-widest uppercase mb-4">
            Notre philosophie
          </p>
          
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-6">
            Quelqu'un s'occupe de vous.
          </h2>

          <p className="text-muted-foreground text-lg leading-relaxed mb-12 max-w-2xl mx-auto">
            i-Wasp est à l'identité professionnelle ce qu'Uber est à la mobilité. 
            Une plateforme silencieuse, élégante, toujours prête.
          </p>

          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-semibold">01</span>
              </div>
              <h3 className="font-semibold text-foreground">Centraliser</h3>
              <p className="text-muted-foreground text-sm">
                Toute votre identité professionnelle en un seul endroit.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <span className="text-foreground font-semibold">02</span>
              </div>
              <h3 className="font-semibold text-foreground">Présenter</h3>
              <p className="text-muted-foreground text-sm">
                Une mise en forme élégante, toujours à jour.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <span className="text-foreground font-semibold">03</span>
              </div>
              <h3 className="font-semibold text-foreground">Partager</h3>
              <p className="text-muted-foreground text-sm">
                Un geste suffit. Votre profil transmis instantanément.
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
          
          <p className="text-background/60 text-xs tracking-widest uppercase mb-8">
            Conciergerie digitale
          </p>
          
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-6">
            Prêt à nous confier votre image ?
          </h2>
          
          <p className="text-background/70 text-lg mb-10">
            Rejoignez les professionnels qui font confiance à i-Wasp.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href={WHATSAPP_CARTE}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button 
                size="lg"
                className="bg-primary text-primary-foreground hover:brightness-105 font-medium gap-2 px-8 py-6 rounded-lg"
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
