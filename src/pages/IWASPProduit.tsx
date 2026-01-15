import { motion, type Transition } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, Shield, Zap, RefreshCw, Smartphone, Users, Lock } from "lucide-react";

const luxuryEase = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 1.2, ease: luxuryEase } as Transition
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 }
  }
};

export default function IWASPProduit() {
  const features = [
    "Profil digital premium personnalisé",
    "Technologie NFC intégrée",
    "QR Code professionnel",
    "Partage instantané par lien",
    "Mise à jour en temps réel",
    "Tableau de bord analytics",
    "Support prioritaire",
    "Hébergement sécurisé à vie"
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <motion.nav 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-5 bg-background/80 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link 
            to="/"
            className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors duration-500"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-body text-xs tracking-widest uppercase">Retour</span>
          </Link>
          <span className="font-display text-xl tracking-widest text-foreground/90">
            I-WASP
          </span>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-4xl mx-auto"
        >
          <motion.p 
            variants={fadeUp}
            className="font-body text-xs tracking-[0.3em] uppercase text-[hsl(210,30%,50%)] mb-6"
          >
            Produit
          </motion.p>
          
          <motion.h1 
            variants={fadeUp}
            className="font-display text-4xl sm:text-5xl md:text-6xl tracking-wide leading-[1.1] mb-8"
          >
            Carte de visite digitale<br />I-WASP
          </motion.h1>

          <motion.p 
            variants={fadeUp}
            className="font-body text-muted-foreground text-xl max-w-2xl leading-relaxed"
          >
            L'identité professionnelle nouvelle génération. 
            Conçue pour les décideurs qui veulent se démarquer.
          </motion.p>
        </motion.div>
      </section>

      {/* For whom */}
      <section className="py-20 px-6 border-t border-foreground/8">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="max-w-4xl mx-auto"
        >
          <motion.h2 
            variants={fadeUp}
            className="font-display text-2xl sm:text-3xl tracking-wide mb-12"
          >
            Pour qui ?
          </motion.h2>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: Users, title: "Dirigeants", desc: "PDG, DG, membres de direction" },
              { icon: Zap, title: "Entrepreneurs", desc: "Fondateurs, co-fondateurs, CEOs" },
              { icon: Shield, title: "Cadres", desc: "Managers, consultants, experts" }
            ].map((item) => (
              <motion.div 
                key={item.title}
                variants={fadeUp}
                className="p-6 border border-foreground/8 bg-[hsl(0,0%,6%)]"
              >
                <item.icon className="w-5 h-5 text-[hsl(210,30%,60%)] mb-4" strokeWidth={1.5} />
                <h3 className="font-body text-foreground mb-2">{item.title}</h3>
                <p className="font-body text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* What's included */}
      <section className="py-20 px-6 bg-[hsl(0,0%,6%)]">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="max-w-4xl mx-auto"
        >
          <motion.h2 
            variants={fadeUp}
            className="font-display text-2xl sm:text-3xl tracking-wide mb-12"
          >
            Ce qui est inclus
          </motion.h2>

          <div className="grid sm:grid-cols-2 gap-x-12 gap-y-5">
            {features.map((feature) => (
              <motion.div 
                key={feature}
                variants={fadeUp}
                className="flex items-center gap-4 py-3 border-b border-foreground/8"
              >
                <Check className="w-4 h-4 text-[hsl(210,30%,60%)] shrink-0" strokeWidth={1.5} />
                <span className="font-body text-foreground/90">{feature}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="max-w-4xl mx-auto"
        >
          <motion.h2 
            variants={fadeUp}
            className="font-display text-2xl sm:text-3xl tracking-wide mb-12"
          >
            Comment ça marche
          </motion.h2>

          <div className="space-y-8">
            {[
              { num: "1", icon: Smartphone, title: "Commandez votre carte", desc: "Choisissez votre formule et renseignez vos informations professionnelles." },
              { num: "2", icon: RefreshCw, title: "Recevez et activez", desc: "Recevez votre carte physique NFC et activez votre profil digital." },
              { num: "3", icon: Zap, title: "Partagez instantanément", desc: "Un tap sur un smartphone et vos contacts reçoivent toutes vos informations." }
            ].map((step) => (
              <motion.div 
                key={step.num}
                variants={fadeUp}
                className="flex gap-6 items-start"
              >
                <div className="w-10 h-10 border border-[hsl(210,30%,50%)] flex items-center justify-center shrink-0">
                  <span className="font-body text-sm text-[hsl(210,30%,60%)]">{step.num}</span>
                </div>
                <div className="pt-1">
                  <h3 className="font-body text-foreground mb-2">{step.title}</h3>
                  <p className="font-body text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6 bg-[hsl(0,0%,6%)]">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="max-w-4xl mx-auto"
        >
          <motion.div 
            variants={fadeUp}
            className="border border-foreground/10 p-8 sm:p-12"
          >
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8 mb-8">
              <div>
                <p className="font-body text-xs tracking-[0.3em] uppercase text-[hsl(210,30%,50%)] mb-3">
                  Carte I-WASP
                </p>
                <h3 className="font-display text-3xl sm:text-4xl tracking-wide">
                  490 MAD
                </h3>
                <p className="font-body text-muted-foreground mt-2">
                  Paiement unique. Pas d'abonnement.
                </p>
              </div>
              
              <Link 
                to="/express/offre"
                className="group relative px-10 py-4 bg-foreground text-background font-body text-sm tracking-widest uppercase overflow-hidden transition-all duration-700 text-center"
              >
                <span className="relative z-10">Commander maintenant</span>
                <div className="absolute inset-0 bg-[hsl(210,30%,50%)] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out" />
              </Link>
            </div>

            <div className="pt-8 border-t border-foreground/8">
              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[hsl(210,30%,60%)]" strokeWidth={1.5} />
                  Paiement sécurisé
                </span>
                <span className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[hsl(210,30%,60%)]" strokeWidth={1.5} />
                  Livraison sous 5 jours
                </span>
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[hsl(210,30%,60%)]" strokeWidth={1.5} />
                  Garantie à vie
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Trust badges */}
      <section className="py-20 px-6">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.p 
            variants={fadeUp}
            className="font-body text-muted-foreground mb-8"
          >
            Infrastructure sécurisée. Données protégées. Support dédié.
          </motion.p>

          <motion.div 
            variants={fadeUp}
            className="flex flex-wrap justify-center gap-8 text-xs text-muted-foreground tracking-wide uppercase"
          >
            <span>Hébergement sécurisé</span>
            <span>·</span>
            <span>Conformité RGPD</span>
            <span>·</span>
            <span>Support français</span>
          </motion.div>
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-[hsl(0,0%,6%)] border-t border-foreground/8">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.h2 
            variants={fadeUp}
            className="font-display text-2xl sm:text-3xl tracking-wide mb-8"
          >
            Une question ?
          </motion.h2>

          <motion.p 
            variants={fadeUp}
            className="font-body text-muted-foreground mb-8"
          >
            Notre équipe est disponible pour vous accompagner.
          </motion.p>

          <motion.div 
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link 
              to="/express/offre"
              className="group relative px-10 py-4 bg-foreground text-background font-body text-sm tracking-widest uppercase overflow-hidden transition-all duration-700"
            >
              <span className="relative z-10">Commander la carte</span>
              <div className="absolute inset-0 bg-[hsl(210,30%,50%)] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out" />
            </Link>
            
            <a 
              href="mailto:contact@i-wasp.com"
              className="px-10 py-4 border border-foreground/20 font-body text-sm tracking-widest uppercase text-foreground/80 hover:border-foreground/40 transition-all duration-700"
            >
              Nous contacter
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-foreground/8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-display text-lg tracking-widest text-foreground/60">
            I-WASP
          </span>
          <p className="font-body text-xs text-muted-foreground tracking-wide">
            © 2025 I-WASP. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}
