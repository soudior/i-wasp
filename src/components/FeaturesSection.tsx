import { motion } from "framer-motion";
import { 
  Smartphone, 
  Wallet, 
  RefreshCw, 
  Users, 
  Shield, 
  Palette,
  Nfc,
  QrCode
} from "lucide-react";

const features = [
  {
    icon: Nfc,
    title: "Technologie NFC",
    description: "Un simple toucher pour partager votre carte. Compatible avec toutes les puces NFC et ongles connectés.",
  },
  {
    icon: Wallet,
    title: "Apple & Google Wallet",
    description: "Ajoutez votre carte directement dans votre wallet. Accessible depuis l'écran verrouillé.",
  },
  {
    icon: RefreshCw,
    title: "Mise à jour en temps réel",
    description: "Modifiez vos informations instantanément sans reprogrammer votre puce NFC.",
  },
  {
    icon: Users,
    title: "Capture de leads",
    description: "Récupérez automatiquement les coordonnées de vos contacts. Analysez vos interactions.",
  },
  {
    icon: Palette,
    title: "Templates premium",
    description: "Choisissez parmi des designs exclusifs créés par des designers de renom.",
  },
  {
    icon: Shield,
    title: "Sécurité RGPD",
    description: "Vos données sont protégées et conformes aux normes européennes les plus strictes.",
  },
  {
    icon: QrCode,
    title: "QR Code de secours",
    description: "Un QR code intégré pour les appareils sans NFC. Ne manquez jamais une opportunité.",
  },
  {
    icon: Smartphone,
    title: "Sans application",
    description: "Vos contacts accèdent à votre carte sans télécharger d'application.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/3 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Fonctionnalités <span className="text-gradient-gold">d'exception</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Une solution complète pour gérer votre identité professionnelle digitale
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-500 hover:shadow-lg">
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon size={24} className="text-primary" />
                </div>
                
                {/* Content */}
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
