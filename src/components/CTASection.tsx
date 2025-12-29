import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Clock, Sparkles } from "lucide-react";

const trustBadges = [
  { icon: Shield, label: "Sans engagement" },
  { icon: Sparkles, label: "RGPD compliant" },
  { icon: Clock, label: "Configuration en 2 min" },
];

export function CTASection() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-surface-1 via-background to-background" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-radial from-amber-500/[0.08] via-amber-600/[0.03] to-transparent blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-8"
          >
            <Sparkles size={14} className="text-amber-400" />
            <span className="text-sm text-amber-400 font-medium">Créez votre carte aujourd'hui</span>
          </motion.div>

          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 leading-tight">
            Prêt à révolutionner votre{" "}
            <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent">
              networking
            </span>
            ?
          </h2>

          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Rejoignez des milliers de professionnels qui ont adopté la carte NFC IWASP 
            pour développer leur réseau.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/signup">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-background font-semibold px-8 py-6 rounded-full shadow-lg shadow-amber-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/30 hover:scale-105"
              >
                Créer ma carte gratuitement
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
            <Link to="/demo">
              <Button 
                variant="outline" 
                size="lg"
                className="border-foreground/20 hover:border-foreground/40 hover:bg-foreground/5 px-8 py-6 rounded-full font-medium"
              >
                Voir une démo
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {trustBadges.map((badge) => (
              <div key={badge.label} className="flex items-center gap-2 text-muted-foreground">
                <badge.icon size={16} className="text-amber-400/60" />
                <span className="text-sm">{badge.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
