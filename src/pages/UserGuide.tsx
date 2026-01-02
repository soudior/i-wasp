/**
 * UserGuide - Guide d'utilisation pour configurer la carte NFC
 */

import { motion } from "framer-motion";
import { 
  Smartphone, 
  Wifi, 
  UserPlus, 
  Share2, 
  CheckCircle,
  ArrowRight,
  MessageCircle,
  MapPin,
  CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import iwaspLogo from "@/assets/iwasp-logo.png";
import nfcDemoVideo from "@/assets/nfc-demo-video.mp4";

const steps = [
  {
    number: "01",
    icon: CreditCard,
    title: "Recevez votre carte",
    description: "Votre carte i-wasp arrive prête à l'emploi. Elle contient une puce NFC déjà programmée avec votre profil unique.",
    tip: "Conservez votre carte dans un endroit sec, à l'abri des aimants puissants."
  },
  {
    number: "02",
    icon: Smartphone,
    title: "Approchez un téléphone",
    description: "Placez la carte près du téléphone de votre contact. Sur iPhone, positionnez-la en haut. Sur Android, au centre du dos.",
    tip: "Aucune application n'est requise. Le NFC fonctionne nativement sur tous les smartphones récents."
  },
  {
    number: "03",
    icon: Wifi,
    title: "Connexion automatique",
    description: "Une notification apparaît instantanément sur le téléphone. Un simple tap ouvre votre profil professionnel.",
    tip: "Assurez-vous que le NFC est activé dans les paramètres du téléphone."
  },
  {
    number: "04",
    icon: UserPlus,
    title: "Enregistrement du contact",
    description: "Votre contact peut sauvegarder vos coordonnées en un clic. Toutes vos informations sont transférées automatiquement.",
    tip: "Le fichier VCF inclut nom, téléphone, email, entreprise et photo."
  },
  {
    number: "05",
    icon: Share2,
    title: "Partagez et connectez",
    description: "Votre contact peut vous appeler, vous envoyer un WhatsApp ou trouver votre localisation directement depuis votre profil.",
    tip: "Votre profil reste accessible via le lien unique, même sans la carte physique."
  }
];

const faqs = [
  {
    question: "La carte fonctionne-t-elle sur tous les téléphones ?",
    answer: "Oui, sur tous les smartphones équipés NFC : iPhone 7 et plus récents, et la plupart des Android depuis 2015."
  },
  {
    question: "Puis-je modifier mes informations après réception ?",
    answer: "Absolument. Connectez-vous à votre espace i-wasp pour mettre à jour votre profil à tout moment. Les changements sont instantanés."
  },
  {
    question: "Que faire si le NFC ne fonctionne pas ?",
    answer: "Vérifiez que le NFC est activé dans les paramètres du téléphone. Sur iPhone, il est toujours actif. Sur Android, allez dans Paramètres > Connexions > NFC."
  },
  {
    question: "Ma carte a-t-elle une durée de vie limitée ?",
    answer: "Non, la puce NFC n'a pas de batterie et ne s'use pas. Votre carte i-wasp est conçue pour durer des années."
  }
];

export default function UserGuide() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="px-6 py-8 border-b border-white/10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/">
            <img src={iwaspLogo} alt="IWASP" className="h-8 brightness-0 invert" />
          </Link>
          <Link to="/create">
            <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
              Créer ma carte
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Video - Instagram Reels Style */}
      <section className="px-6 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-sm mx-auto"
        >
          {/* Video Container - Reels Format (9:16) */}
          <div className="relative aspect-[9/16] rounded-3xl overflow-hidden bg-gradient-to-b from-primary/20 to-primary/5 shadow-2xl shadow-primary/20">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src={nfcDemoVideo} type="video/mp4" />
            </video>
          </div>
          
          {/* Caption under video */}
          <p className="text-center text-white/50 text-sm mt-4">
            Un simple tap pour partager votre profil
          </p>
        </motion.div>
      </section>

      {/* Hero Text */}
      <section className="px-6 py-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary text-sm font-medium mb-6">
            Guide d'utilisation
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Configurez votre carte <span className="text-primary">i-wasp</span>
          </h1>
          <p className="text-lg text-white/60">
            Tout ce que vous devez savoir pour utiliser votre carte de visite NFC 
            et impressionner vos contacts professionnels.
          </p>
        </motion.div>
      </section>

      {/* Steps */}
      <section className="px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="flex gap-6">
                  {/* Number & Line */}
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
                      <step.icon size={24} className="text-primary" />
                    </div>
                    {index < steps.length - 1 && (
                      <div className="w-px h-full bg-gradient-to-b from-primary/40 to-transparent mt-4" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="pb-8">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-medium text-primary">{step.number}</span>
                      <h3 className="text-xl font-semibold">{step.title}</h3>
                    </div>
                    <p className="text-white/70 mb-3">{step.description}</p>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-sm text-white/50">
                      <CheckCircle size={14} className="text-green-400" />
                      {step.tip}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Guide */}
      <section className="px-6 py-12 bg-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Positionnement de la carte</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* iPhone */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#1a1a1a] rounded-3xl p-6 text-center"
            >
              <div className="w-20 h-36 mx-auto mb-4 rounded-2xl bg-gradient-to-b from-white/20 to-white/5 relative">
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-1.5 rounded-full bg-white/30" />
                <div className="absolute top-6 left-1/2 -translate-x-1/2">
                  <div className="w-10 h-10 rounded-lg bg-primary/30 animate-pulse flex items-center justify-center">
                    <Wifi size={20} className="text-primary" />
                  </div>
                </div>
                <ArrowRight size={16} className="absolute top-8 -right-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">iPhone</h3>
              <p className="text-sm text-white/60">Placez la carte en haut, près de l'encoche ou Dynamic Island</p>
            </motion.div>

            {/* Android */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-[#1a1a1a] rounded-3xl p-6 text-center"
            >
              <div className="w-20 h-36 mx-auto mb-4 rounded-2xl bg-gradient-to-b from-white/20 to-white/5 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-10 h-10 rounded-lg bg-primary/30 animate-pulse flex items-center justify-center">
                    <Wifi size={20} className="text-primary" />
                  </div>
                </div>
                <ArrowRight size={16} className="absolute top-1/2 -translate-y-1/2 -right-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">Android</h3>
              <p className="text-sm text-white/60">Placez la carte au centre du dos du téléphone</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Actions Available */}
      <section className="px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-3">Ce que vos contacts peuvent faire</h2>
          <p className="text-white/60 mb-8">Votre profil i-wasp offre plusieurs actions en un tap</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Smartphone, label: "Appeler", color: "bg-green-500/20 text-green-400" },
              { icon: MessageCircle, label: "WhatsApp", color: "bg-emerald-500/20 text-emerald-400" },
              { icon: MapPin, label: "Localiser", color: "bg-blue-500/20 text-blue-400" },
              { icon: UserPlus, label: "Enregistrer", color: "bg-purple-500/20 text-purple-400" },
            ].map((action, i) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 rounded-2xl p-4"
              >
                <div className={`w-12 h-12 rounded-xl ${action.color} mx-auto mb-3 flex items-center justify-center`}>
                  <action.icon size={24} />
                </div>
                <p className="font-medium">{action.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-12 bg-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Questions fréquentes</h2>
          
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-[#1a1a1a] rounded-2xl p-5"
              >
                <h3 className="font-semibold mb-2">{faq.question}</h3>
                <p className="text-sm text-white/60">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto"
        >
          <h2 className="text-2xl font-bold mb-3">Prêt à créer votre carte ?</h2>
          <p className="text-white/60 mb-6">
            Configurez votre profil en quelques minutes et recevez votre carte NFC i-wasp.
          </p>
          <Link to="/create">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-xl px-8">
              Créer ma carte i-wasp
              <ArrowRight size={18} className="ml-2" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-white/10 text-center">
        <p className="text-sm text-white/40">
          Powered by <span className="text-primary font-medium">IWASP</span> · Tap. Connect. Empower.
        </p>
      </footer>
    </div>
  );
}
