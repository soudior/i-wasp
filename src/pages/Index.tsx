import { useState } from "react";
import { CreditCard, Sparkles, Clock, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileOptimizedVideo } from "@/components/MobileOptimizedVideo";
import { AnimatedIWASPLogo, IWASPSlogan } from "@/components/AnimatedIWASPLogo";
import { GoldPricingComparison } from "@/components/GoldPricingComparison";
import { VisionAnimatedIcons, CertifiedBadgeSection } from "@/components/VisionAnimatedIcons";
import { DashboardCarousel } from "@/components/DashboardCarousel";
import nfcPoster from "@/assets/posters/nfc-demo-poster.webp";
import nailsPoster from "@/assets/posters/nails-demo-poster.webp";

// iOS: servir les vidéos depuis /public pour éviter les soucis de lecture
const nfcDemoVideo = "/nfc-demo-video.mp4";
const nailsDemoVideo = "/nails-demo-video.mp4";

// WhatsApp links
const WHATSAPP_CARTE = "https://wa.me/33626424394?text=Bonjour%20👋%0AJe%20souhaite%20commander%20une%20carte%20NFC%20i-wasp.";
const WHATSAPP_NAILS = "https://wa.me/33626424394?text=Bonjour%20👋%0AJe%20souhaite%20commander%20un%20Pack%20Nails%20i-wasp.";

/**
 * Index - Page d'accueil Dual-Power i-wasp
 * 
 * Design luxueux noir & or. Vidéos optimisées pour mobile iOS/Android.
 */

type ProductMode = "carte" | "ongle";

const productContent = {
  carte: {
    video: nfcDemoVideo,
    tagline: "L'icône du networking professionnel.",
    description: "Minimaliste, puissante, éternelle.",
    cta: "Commander ma Carte",
    whatsapp: WHATSAPP_CARTE,
  },
  ongle: {
    video: nailsDemoVideo,
    tagline: "L'innovation invisible.",
    description: "Votre réseau au bout des doigts, sous votre vernis.",
    cta: "Commander mon Pack Nails",
    whatsapp: WHATSAPP_NAILS,
  },
};

const Index = () => {
  const [mode, setMode] = useState<ProductMode>("carte");
  const content = productContent[mode];

  return (
    <div className="min-h-screen overflow-y-auto scrolling-touch bg-black flex flex-col scroll-smooth">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-20">
        <div className="max-w-xl mx-auto text-center space-y-8">
          
          {/* Logo Animé + Slogan */}
          <div className="space-y-4">
            <AnimatedIWASPLogo size="xl" className="justify-center" />
            <IWASPSlogan className="text-center" />
          </div>
          
          {/* Titre Principal */}
          <div className="space-y-3">
            <h1 className="font-playfair text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              Connectez-vous
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">
                d'un simple geste.
              </span>
            </h1>
            <p className="text-zinc-400 text-base md:text-lg font-light">
              La première technologie NFC invisible au Maroc pour cartes et ongles.
            </p>
          </div>

          {/* Sélecteur Carte / Ongle - Bordures dorées premium */}
          <div className="flex justify-center">
            <div className="inline-flex bg-zinc-900/80 backdrop-blur-sm p-1.5 rounded-2xl border border-amber-500/20 shadow-[0_0_20px_rgba(212,175,55,0.1)]">
              <button
                onClick={() => setMode("carte")}
                className={`relative flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  mode === "carte"
                    ? "text-black bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                    : "text-zinc-400 hover:text-amber-300"
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>La Carte i-wasp</span>
              </button>
              
              <button
                onClick={() => setMode("ongle")}
                className={`relative flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  mode === "ongle"
                    ? "text-black bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                    : "text-zinc-400 hover:text-amber-300"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>L'Ongle i-wasp</span>
              </button>
            </div>
          </div>

          {/* Vidéo optimisée - Sans animations framer-motion */}
          <div className="relative mx-auto max-w-xs">
            {/* Ombre dorée statique */}
            <div 
              className="absolute inset-0 rounded-[2rem] blur-3xl opacity-40"
              style={{
                background: mode === "carte" 
                  ? 'radial-gradient(ellipse at center, rgba(251, 191, 36, 0.6) 0%, rgba(245, 158, 11, 0.3) 40%, transparent 70%)'
                  : 'radial-gradient(ellipse at center, rgba(236, 72, 153, 0.5) 0%, rgba(251, 191, 36, 0.4) 40%, transparent 70%)',
                transform: 'translateY(8px) scale(1.05)'
              }}
            />
            
            {/* Cadre smartphone premium avec bordure dorée */}
            <div className="relative bg-gradient-to-b from-zinc-800 to-zinc-900 p-1.5 rounded-[2rem] shadow-2xl overflow-hidden border border-amber-500/20 gold-glow-border">
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

          {/* Tagline dynamique - Sans animation */}
          <div className="space-y-1">
            <p className="text-amber-400 font-medium text-lg">{content.tagline}</p>
            <p className="text-zinc-500 text-sm">{content.description}</p>
          </div>

          {/* CTA Buttons - Sans hover:scale */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a 
              href={WHATSAPP_CARTE}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button 
                size="lg" 
                className="w-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:via-yellow-500 hover:to-amber-600 text-black font-semibold gap-2 px-8 py-6 text-base rounded-xl shadow-lg shadow-amber-500/30 transition-colors duration-200"
              >
                <CreditCard className="w-4 h-4" />
                Commander ma Carte
              </Button>
            </a>
            
            <a 
              href={WHATSAPP_NAILS}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button 
                size="lg"
                className="w-full bg-gradient-to-r from-pink-500 via-rose-400 to-amber-400 hover:from-pink-600 hover:via-rose-500 hover:to-amber-500 text-black font-semibold gap-2 px-8 py-6 text-base rounded-xl shadow-lg shadow-pink-500/30 transition-colors duration-200"
              >
                <Sparkles className="w-4 h-4" />
                Commander mon Pack Nails
              </Button>
            </a>
          </div>

          {/* Signature subtile */}
          <p className="text-zinc-600 text-sm font-light tracking-widest uppercase pt-4">
            i-wasp · Tap. Connect. Empower.
          </p>
        </div>
      </section>

      {/* Section Stories Dynamiques - Exclusivité */}
      <section className="py-16 px-4 bg-gradient-to-b from-black to-zinc-950">
        <div className="max-w-3xl mx-auto">
          {/* Badge Exclusivité */}
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-600/10 border border-amber-500/30 text-amber-400 text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Exclusivité i-wasp
            </span>
          </div>

          {/* Titre */}
          <h2 className="font-playfair text-2xl md:text-4xl font-bold text-white text-center leading-tight mb-6">
            Stories Dynamiques 24h
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">
              Votre actualité en temps réel
            </span>
          </h2>

          {/* Description */}
          <p className="text-center text-zinc-400 text-base md:text-lg max-w-xl mx-auto mb-10">
            Chaque carte NFC i-wasp vous permet de partager vos <span className="text-amber-400 font-medium">stories éphémères</span> comme sur Instagram. Vos contacts voient vos actualités dès qu'ils scannent votre carte.
          </p>

          {/* Preview Cards */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="relative">
                <div
                  className="absolute inset-0 rounded-full p-[2px]"
                  style={{
                    background: "linear-gradient(135deg, #d4af37, #f5c542, #d4af37)",
                  }}
                />
                <div className="relative w-full aspect-square rounded-full bg-zinc-900 border-2 border-black overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-amber-400/50" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-white font-medium mb-1">24h de visibilité</h3>
              <p className="text-zinc-500 text-sm">Stories éphémères qui disparaissent automatiquement</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-amber-500/20 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-white font-medium mb-1">Un scan suffit</h3>
              <p className="text-zinc-500 text-sm">Vos contacts voient vos stories au scan NFC</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-white font-medium mb-1">Impact maximum</h3>
              <p className="text-zinc-500 text-sm">Partagez vos actualités en temps réel</p>
            </div>
          </div>

          {/* Ligne décorative */}
          <div className="w-24 h-0.5 mx-auto mt-10 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
        </div>
      </section>

      {/* Section À propos */}
      <section className="py-20 px-4 bg-gradient-to-b from-zinc-950 via-black to-black">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Icône décorative statique */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30">
            <Sparkles className="w-8 h-8 text-amber-400" />
          </div>

          {/* Titre */}
          <h2 className="font-playfair text-2xl md:text-4xl font-bold text-white leading-tight">
            L'Innovation qui ne se voit pas,
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">
              mais qui change tout.
            </span>
          </h2>

          {/* Texte */}
          <div className="space-y-6 text-zinc-400 text-base md:text-lg leading-relaxed">
            <p>
              Né à l'intersection du <span className="text-amber-400 font-medium">luxe</span> et de la <span className="text-amber-400 font-medium">technologie</span>, i-wasp redéfinit le networking au Maroc. Nous croyons que la connexion humaine doit être fluide, élégante et instantanée.
            </p>
            <p>
              Que ce soit à travers nos <span className="text-white font-medium">Cartes Premium</span> ou notre innovation mondiale <span className="text-pink-400 font-medium">Nails NFC</span>, nous offrons aux entrepreneurs et aux passionnés de mode un outil unique : une identité numérique accessible d'un simple geste.
            </p>
            <p className="text-zinc-300 font-medium italic">
              Plus qu'une carte, plus qu'une manucure : une révolution invisible qui vous connecte au futur.
            </p>
          </div>

          {/* Ligne décorative dorée */}
          <div className="w-24 h-0.5 mx-auto bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
        </div>
      </section>

      {/* Section Vision avec Icônes Animées */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-zinc-950">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-600/10 border border-amber-500/30 text-amber-400 text-sm font-medium mb-6">
              <Crown className="w-4 h-4" />
              Notre Vision
            </div>
            <h2 className="font-playfair text-2xl md:text-4xl font-bold text-white mb-4">
              Dominer le Physique,
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">
                Régner sur le Digital
              </span>
            </h2>
            <p className="text-zinc-400 text-base md:text-lg max-w-2xl mx-auto">
              Nous voyons un monde où chaque professionnel possède la puissance d'une multinationale.
            </p>
          </div>
          
          <VisionAnimatedIcons className="mb-16" />
          <CertifiedBadgeSection />
        </div>
      </section>

      {/* Dashboard Carousel - Preuves Visuelles */}
      <DashboardCarousel />

      {/* Section Pricing GOLD Comparatif */}
      <GoldPricingComparison />
    </div>
  );
};

export default Index;
