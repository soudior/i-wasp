import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Sparkles, 
  Droplets, 
  Clock, 
  Hand, 
  Smartphone, 
  ChevronDown,
  Check,
  Star,
  Palette
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import iwaspLogo from "@/assets/iwasp-logo-white.png";
import nailsHero from "@/assets/nails/nails-hero.png";
import nailsCafe from "@/assets/nails/nails-cafe.png";

const Nails = () => {
  const navigate = useNavigate();

  const features = [
    { icon: Sparkles, title: "Élégance discrète", desc: "Un accessoire mode qui cache une technologie révolutionnaire" },
    { icon: Droplets, title: "Résistant à l'eau", desc: "Portez-le sous la douche, à la piscine, sans souci" },
    { icon: Clock, title: "Longue durée", desc: "Jusqu'à 2 semaines de networking stylé" },
    { icon: Palette, title: "2 finitions", desc: "Or Rose & Noir avec logo i-wasp gravé" },
  ];

  const steps = [
    {
      num: 1,
      title: "Collez l'ongle NFC",
      desc: "Appliquez l'ongle comme un ongle classique. Il adhère parfaitement à votre ongle naturel.",
      icon: Hand,
    },
    {
      num: 2,
      title: "Activez votre profil",
      desc: "Connectez-vous à votre dashboard i-wasp et personnalisez votre carte digitale.",
      icon: Smartphone,
    },
    {
      num: 3,
      title: "Connectez-vous !",
      desc: "Approchez votre ongle d'un smartphone. Votre profil s'ouvre instantanément comme par magie.",
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
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-zinc-900">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/">
            <img src={iwaspLogo} alt="i-wasp" className="h-8 w-auto" />
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
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-rose-500/20 to-amber-500/20 border border-rose-400/30 mb-6">
                <Sparkles className="h-4 w-4 text-rose-400" />
                <span className="text-sm text-rose-300 font-medium">Nouveau : Collection Nails</span>
              </div>

              <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                i-wasp Nails
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-300 to-amber-400">
                  Le Networking Discret
                </span>
              </h1>

              <p className="text-lg text-zinc-400 leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
                La technologie NFC dissimulée dans un accessoire mode élégant. 
                Partagez votre profil d'un simple geste, avec style.
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
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-rose-500/20">
                <img 
                  src={nailsHero} 
                  alt="i-wasp Nails - Ongles NFC de luxe" 
                  className="w-full aspect-square object-cover"
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
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 border-t border-zinc-900">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 hover:border-rose-500/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500/20 to-amber-500/20 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-6 w-6 text-rose-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                <p className="text-zinc-500 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lifestyle Image Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative rounded-3xl overflow-hidden"
            >
              <img 
                src={nailsCafe} 
                alt="i-wasp Nails en situation - Café chic" 
                className="w-full aspect-[4/3] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-6">
                L'élégance rencontre
                <span className="text-rose-400"> la technologie</span>
              </h2>
              <p className="text-zinc-400 leading-relaxed mb-6">
                Imaginez-vous au café, lors d'un événement networking, ou simplement en rencontre professionnelle. 
                D'un geste naturel et élégant, vous approchez votre main du smartphone de votre interlocuteur. 
                Votre profil complet apparaît instantanément.
              </p>
              <p className="text-zinc-400 leading-relaxed mb-8">
                Plus besoin de cartes papier qui s'abîment. Plus de "je n'ai plus de cartes sur moi". 
                Votre networking est littéralement au bout de vos doigts.
              </p>
              
              <div className="flex items-center gap-4">
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
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-gradient-to-b from-transparent via-rose-950/10 to-transparent">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              En 3 étapes simples, passez du traditionnel au digital
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-rose-500/50 to-transparent" />
                )}
                
                <div className="relative bg-zinc-900/80 border border-zinc-800 rounded-3xl p-8 text-center hover:border-rose-500/30 transition-all hover:-translate-y-1">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-rose-500/30">
                    <span className="text-2xl font-bold text-white">{step.num}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-4">
              Questions fréquentes
            </h2>
            <p className="text-zinc-400">
              Tout ce que vous devez savoir sur les i-wasp Nails
            </p>
          </motion.div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
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
              </motion.div>
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
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
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
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-zinc-900">
        <div className="container mx-auto px-6 text-center">
          <Link to="/" className="inline-block mb-4">
            <img src={iwaspLogo} alt="i-wasp" className="h-8 w-auto mx-auto" />
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
