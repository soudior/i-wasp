import { motion } from "framer-motion";
import { Smartphone, Wallet, RefreshCw, Users, Printer, Shield } from "lucide-react";

const features = [
  { icon: Smartphone, title: "Tap & Share", description: "Un simple contact avec n'importe quel smartphone pour partager votre carte." },
  { icon: Wallet, title: "Apple & Google Wallet", description: "Votre carte accessible depuis l'écran verrouillé, toujours à portée de main." },
  { icon: RefreshCw, title: "Mise à jour instantanée", description: "Modifiez vos informations en temps réel, sans reprogrammer votre puce." },
  { icon: Users, title: "Capture de leads", description: "Récupérez automatiquement les coordonnées de vos nouveaux contacts." },
  { icon: Printer, title: "Impression fidèle", description: "Rendu écran-impression identique. Ce que vous voyez, c'est ce que vous recevez." },
  { icon: Shield, title: "RGPD compliant", description: "Données protégées et hébergées en Europe, conformes aux normes strictes." },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-surface-1" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-amber-500/[0.03] blur-[150px]" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-6">
            Fonctionnalités
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-semibold mb-6">
            Tout ce dont vous avez besoin
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Une solution complète pour votre identité professionnelle digitale
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group"
            >
              <div className="h-full p-8 rounded-2xl bg-surface-2/50 border border-foreground/5 hover:border-amber-500/20 transition-all duration-500 hover:bg-surface-2">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6 group-hover:bg-amber-500/15 transition-colors duration-300">
                  <feature.icon size={24} className="text-amber-400" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
