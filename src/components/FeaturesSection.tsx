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
    <section className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-surface-1" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-glow-subtle/10 blur-[150px] opacity-50" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-glow-subtle/10 blur-[120px] opacity-40" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-semibold mb-6">
            Fonctionnalités <span className="text-chrome">d'exception</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Une solution complète pour gérer votre identité professionnelle digitale
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group"
            >
              <div className="h-full p-6 rounded-2xl card-glass hover:bg-foreground/[0.03] transition-all duration-500">
                {/* Icon */}
                <motion.div 
                  className="w-12 h-12 rounded-xl bg-surface-2 flex items-center justify-center mb-5 group-hover:bg-surface-3 transition-colors duration-300"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <feature.icon size={22} className="text-chrome" />
                </motion.div>
                
                {/* Content */}
                <h3 className="text-lg font-semibold text-foreground mb-2">
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