import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  ArrowRight, 
  Sparkles, 
  Droplets, 
  Hand, 
  ChevronDown,
  Check,
  Star,
  Palette,
  Diamond,
  Eye,
  Zap,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MobileOptimizedVideo } from "@/components/MobileOptimizedVideo";
import iwaspLogo from "@/assets/iwasp-logo-white.png";
import nailsHero from "@/assets/nails/nails-hero.png";
import nailsCafe from "@/assets/nails/nails-cafe.png";
// Video from /public for iOS compatibility
const nailsDemoVideo = "/nails-demo-video.mp4";
import nailsPoster from "@/assets/posters/nails-demo-poster.webp";

const Nails = () => {
  const navigate = useNavigate();

  const features = [
    { icon: Diamond, title: "Technologie Invisible", desc: "Puce ultra-fine qui disparaît sous votre vernis" },
    { icon: Droplets, title: "Résistant à l'eau", desc: "Portez-le sous la douche, à la piscine, sans souci" },
    { icon: Shield, title: "Résistance UV", desc: "Compatible lampes UV et produits manucure" },
    { icon: Palette, title: "2 finitions", desc: "Or Rose & Noir avec logo i-wasp gravé" },
  ];

  const steps = [
    {
      num: 1,
      title: "Posez la puce sur l'ongle",
      desc: "Appliquez la puce ultra-fine sur votre ongle propre. Elle est si légère que vous ne la sentez pas.",
      icon: Hand,
    },
    {
      num: 2,
      title: "Appliquez votre vernis",
      desc: "Vernissez par-dessus (classique ou semi-permanent). La puce disparaît complètement sous la couleur.",
      icon: Palette,
    },
    {
      num: 3,
      title: "Flashez et connectez !",
      desc: "Personne ne verra la puce, mais tout le monde verra votre profil. C'est magique !",
      icon: Sparkles,
    },
  ];

  const faqs = [
    {
      question: "Comment poser et retirer l'ongle NFC ?",
      answer: "L'ongle NFC se pose comme un faux ongle classique avec l'adhésif fourni. Pour le retirer, utilisez simplement de l'eau tiède et faites-le glisser délicatement. Pas besoin d'acétone !"
    },
    {
      question: "Est-il résistant à l'eau ?",
      answer: "Oui ! La puce NFC est totalement étanche. Vous pouvez vous laver les mains, faire la vaisselle, nager... L'ongle reste fonctionnel à 100%."
    },
    {
      question: "Puis-je le vernir ?",
      answer: "Absolument ! Vous pouvez appliquer du vernis classique ou semi-permanent par-dessus. Évitez simplement les couches trop épaisses qui pourraient réduire la portée NFC."
    },
    {
      question: "Combien de temps dure-t-il ?",
      answer: "Avec un usage normal, l'ongle NFC dure 1 à 2 semaines. La puce elle-même a une durée de vie illimitée. Vous recevez 2 ongles par pack pour alterner."
    },
    {
      question: "Est-ce compatible avec tous les smartphones ?",
      answer: "Oui ! Tous les iPhone (XS et plus récent) et la majorité des smartphones Android avec NFC peuvent lire l'ongle. Aucune application requise."
    },
  ];

  return (
    <div className="h-screen overflow-y-scroll scrolling-touch overscroll-y-auto bg-black" style={{ WebkitOverflowScrolling: 'touch' }}>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-zinc-900">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/">
            <img src={iwaspLogo} alt="i-wasp" className="h-8 w-auto" loading="eager" />
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/order/type")}
            className="border-rose-400/50 text-rose-300 hover:bg-rose-500/10"
          >
            Commander
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        {/* Rose gold gradient overlay */}
        <div 
          className="absolute top-0 right-0 w-[600px] h-[600px] opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(244, 143, 177, 0.4) 0%, rgba(183, 110, 121, 0.2) 40%, transparent 70%)',
          }}
        />
        
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text content */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-rose-500/20 to-amber-500/20 border border-rose-400/30 mb-6">
                <Diamond className="h-4 w-4 text-rose-400" />
                <span className="text-sm text-rose-300 font-medium">Technologie Invisible</span>
              </div>

              <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Le secret le mieux gardé
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-300 to-amber-400">
                  de votre manucure 🤫
                </span>
              </h1>

              <p className="text-lg text-zinc-400 leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
                <span className="text-rose-300 font-semibold">Pourquoi porter une carte quand on peut porter l'innovation ?</span>
                {" "}La puce i-wasp est si fine qu'elle devient <span className="text-white font-medium">totalement invisible</span> sous votre vernis.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  onClick={() => navigate("/order/type")}
                  className="bg-gradient-to-r from-rose-500 via-pink-400 to-rose-500 hover:from-rose-600 hover:via-pink-500 hover:to-rose-600 text-white font-semibold gap-2 px-8 py-6 rounded-xl shadow-lg shadow-rose-500/30"
                >
                  Découvrir les i-wasp Nails
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/demo-dashboard")}
                  className="border-zinc-700 text-zinc-300 hover:bg-zinc-900 px-8 py-6 rounded-xl"
                >
                  Voir la démo
                </Button>
              </div>

              {/* Trust badges */}
              <div className="flex items-center gap-6 mt-8 justify-center lg:justify-start text-sm text-zinc-500">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-rose-400" />
                  <span>Pack de 2 ongles</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-rose-400" />
                  <span>Livraison Maroc</span>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-rose-500/20">
                <img 
                  src={nailsHero} 
                  alt="i-wasp Nails - Ongles NFC de luxe" 
                  className="w-full aspect-square object-cover"
                  loading="lazy"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Floating badge */}
                <div className="absolute bottom-6 left-6 right-6 bg-black/80 backdrop-blur-xl rounded-2xl p-4 border border-rose-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-rose-300 text-sm font-medium">Pack i-wasp Nails</p>
                      <p className="text-white font-bold text-lg">2 ongles NFC + Écrin</p>
                    </div>
                    <div className="text-right">
                      <p className="text-zinc-500 text-sm line-through">299 MAD</p>
                      <p className="text-rose-400 font-bold text-xl">199 MAD</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 border-t border-zinc-900">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="text-center p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 hover:border-rose-500/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500/20 to-amber-500/20 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-6 w-6 text-rose-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                <p className="text-zinc-500 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Demo Section - Technologie Invisible */}
      <section className="py-16 relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(168, 85, 247, 0.3) 0%, transparent 60%)',
          }}
        />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-rose-500/20 border border-purple-400/30 mb-6">
              <Eye className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-purple-300 font-medium">Démonstration</span>
            </div>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-4">
              Voyez la magie en action
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              La puce disparaît complètement. Votre manucure reste parfaite et naturelle, mais elle devient connectée.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-purple-500/20 border border-purple-500/20">
              <MobileOptimizedVideo 
                src={nailsDemoVideo}
                poster={nailsPoster}
                aspectRatio="16/9"
                autoPlayOnDesktop={true}
                rounded="rounded-3xl"
              />
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Invisible Technology Section */}
      <section className="py-16 border-t border-zinc-900">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative rounded-3xl overflow-hidden">
              <img 
                src={nailsCafe} 
                alt="i-wasp Nails en situation - Café chic" 
                className="w-full aspect-[4/3] object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-amber-400/30 mb-4">
                <Diamond className="h-3 w-3 text-amber-400" />
                <span className="text-xs text-amber-300 font-medium">Épaisseur nanométrique</span>
              </div>
              
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-400">Technologie Invisible</span>
                <span className="block text-white">sous votre vernis</span>
              </h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Zap className="h-4 w-4 text-rose-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium mb-1">Ultra-fine et légère</p>
                    <p className="text-zinc-400 text-sm">Posée directement sur l'ongle avant le vernis (classique ou semi-permanent)</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Eye className="h-4 w-4 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium mb-1">Disparition totale</p>
                    <p className="text-zinc-400 text-sm">La puce est invisible sous la couleur. Aucune bosse sur l'ongle.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Shield className="h-4 w-4 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium mb-1">Résistance totale</p>
                    <p className="text-zinc-400 text-sm">Compatible lampes UV et tous produits de manucure professionnels</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-500/10 to-amber-500/10 border border-rose-500/20">
                <p className="text-rose-200 text-sm italic">
                  "C'est le futur du networking féminin : l'élégance d'une main soignée, la puissance d'un profil digital."
                </p>
              </div>
              
              <div className="flex items-center gap-4 mt-6">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-amber-500 border-2 border-black flex items-center justify-center">
                      <Star className="h-4 w-4 text-white" />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-white font-semibold">5.0 / 5</p>
                  <p className="text-zinc-500 text-sm">+50 clientes satisfaites</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-gradient-to-b from-transparent via-rose-950/10 to-transparent">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              En 3 étapes simples, passez du traditionnel au digital
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div
                key={step.num}
                className="relative"
              >
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-rose-500/50 to-transparent" />
                )}
                
                <div className="relative bg-zinc-900/80 border border-zinc-800 rounded-3xl p-8 text-center hover:border-rose-500/30 transition-colors">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-rose-500/30">
                    <span className="text-2xl font-bold text-white">{step.num}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-4">
              Questions fréquentes
            </h2>
            <p className="text-zinc-400">
              Tout ce que vous devez savoir sur les i-wasp Nails
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index}>
                <AccordionItem 
                  value={`faq-${index}`} 
                  className="bg-zinc-900/50 border border-zinc-800 rounded-2xl px-6 data-[state=open]:border-rose-500/30"
                >
                  <AccordionTrigger className="text-white hover:text-rose-300 text-left py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-400 pb-5 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </div>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 relative overflow-hidden">
        {/* Background gradient */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(244, 143, 177, 0.3) 0%, transparent 60%)',
          }}
        />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/20 border border-rose-400/30 mb-6">
              <Sparkles className="h-4 w-4 text-rose-400" />
              <span className="text-sm text-rose-300">Offre de lancement</span>
            </div>

            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-6">
              Prête à révolutionner
              <span className="block text-rose-400">votre networking ?</span>
            </h2>

            <p className="text-zinc-400 text-lg mb-8">
              Pack de 2 ongles NFC (Or Rose + Noir) dans un écrin élégant. 
              Livraison gratuite au Maroc.
            </p>

            <div className="flex flex-col items-center gap-4">
              <Button
                size="lg"
                onClick={() => navigate("/order/type")}
                className="bg-gradient-to-r from-rose-500 via-pink-400 to-amber-500 hover:from-rose-600 hover:via-pink-500 hover:to-amber-600 text-white font-bold gap-3 px-12 py-7 rounded-2xl shadow-xl shadow-rose-500/40 text-lg"
              >
                <Sparkles className="h-5 w-5" />
                Commander mes i-wasp Nails
                <ArrowRight className="h-5 w-5" />
              </Button>
              
              <p className="text-zinc-600 text-sm">
                199 MAD au lieu de <span className="line-through">299 MAD</span> • Paiement à la livraison
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-zinc-900">
        <div className="container mx-auto px-6 text-center">
          <Link to="/" className="inline-block mb-4">
            <img src={iwaspLogo} alt="i-wasp" className="h-8 w-auto mx-auto" loading="lazy" />
          </Link>
          <p className="text-zinc-600 text-sm">
            © {new Date().getFullYear()} i-wasp · Tap. Connect. Empower.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Nails;
