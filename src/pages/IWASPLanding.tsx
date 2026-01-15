import { motion, type Transition } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, Zap, RefreshCw, ArrowRight, CheckCircle2, Globe, Sparkles, Check } from "lucide-react";
import { ExitIntentPopup } from "@/components/ExitIntentPopup";

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
    transition: { staggerChildren: 0.15, delayChildren: 0.3 }
  }
};

export default function IWASPLanding() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <motion.nav 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-5"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="font-display text-xl tracking-widest text-foreground/90">
            I-WASP
          </span>
          <Link 
            to="/produit"
            className="text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors duration-700"
          >
            Produit
          </Link>
        </div>
      </motion.nav>

      {/* Hero Section - Fullscreen */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 relative">
        {/* Subtle grain overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')]" />
        
        {/* Subtle radial gradient */}
        <div className="absolute inset-0 bg-gradient-radial from-[hsl(210,20%,8%)] via-background to-background opacity-50" />

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative z-10 text-center max-w-4xl mx-auto"
        >
          {/* Main Headline */}
          <motion.h1 
            variants={fadeUp}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-wide leading-[1.1] mb-8"
          >
            La carte des décideurs.
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            variants={fadeUp}
            className="font-body text-muted-foreground text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Carte de visite digitale premium pour dirigeants et entrepreneurs.
          </motion.p>

          {/* CTAs */}
          <motion.div 
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
          >
            <Link 
              to="/express/offre"
              className="group relative w-full sm:w-auto px-10 py-4 bg-foreground text-background font-body text-sm tracking-widest uppercase overflow-hidden transition-all duration-700"
            >
              <span className="relative z-10">Commander la carte</span>
              <div className="absolute inset-0 bg-[hsl(210,30%,50%)] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out" />
            </Link>
            
            <Link 
              to="/produit"
              className="w-full sm:w-auto px-10 py-4 border border-foreground/20 font-body text-sm tracking-widest uppercase text-foreground/80 hover:border-foreground/40 hover:text-foreground transition-all duration-700"
            >
              Créer mon identité digitale
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <div className="w-px h-16 bg-gradient-to-b from-foreground/40 to-transparent" />
        </motion.div>
      </section>

      {/* Section: À qui s'adresse I-WASP */}
      <section className="py-32 sm:py-40 px-6">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-5xl mx-auto"
        >
          <motion.p 
            variants={fadeUp}
            className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6"
          >
            À qui s'adresse I-WASP
          </motion.p>
          
          <motion.h2 
            variants={fadeUp}
            className="font-display text-3xl sm:text-4xl md:text-5xl tracking-wide mb-16"
          >
            Pour ceux qui dirigent.
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-12 md:gap-8">
            {[
              { title: "Décideurs", desc: "Représentants de grandes entreprises et institutions." },
              { title: "Entrepreneurs", desc: "Fondateurs et dirigeants de startups et PME." },
              { title: "Dirigeants", desc: "Cadres supérieurs et membres de direction." }
            ].map((item, i) => (
              <motion.div 
                key={item.title}
                variants={fadeUp}
                className="border-t border-foreground/10 pt-8"
              >
                <h3 className="font-display text-2xl tracking-wide mb-4">{item.title}</h3>
                <p className="font-body text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Product Focus Section */}
      <section className="py-32 sm:py-40 px-6 bg-[hsl(0,0%,6%)]">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-5xl mx-auto"
        >
          <motion.p 
            variants={fadeUp}
            className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6"
          >
            Votre carte digitale
          </motion.p>
          
          <motion.h2 
            variants={fadeUp}
            className="font-display text-3xl sm:text-4xl md:text-5xl tracking-wide mb-8"
          >
            Une identité à la hauteur<br />de vos ambitions.
          </motion.h2>

          <motion.p 
            variants={fadeUp}
            className="font-body text-muted-foreground text-lg max-w-2xl mb-16 leading-relaxed"
          >
            Une carte de visite digitale premium, accessible instantanément, 
            sécurisée et toujours à jour.
          </motion.p>

          <div className="grid sm:grid-cols-2 gap-8">
            {[
              { icon: Zap, title: "Accès instantané", desc: "Partagez vos coordonnées en un geste." },
              { icon: Shield, title: "Infrastructure sécurisée", desc: "Vos données protégées, toujours." },
              { icon: RefreshCw, title: "Mises à jour en temps réel", desc: "Modifiez vos informations à tout moment." },
              { icon: CheckCircle2, title: "Usage professionnel", desc: "Conçue pour les environnements d'affaires." }
            ].map((item, i) => (
              <motion.div 
                key={item.title}
                variants={fadeUp}
                className="flex gap-5 p-6 border border-foreground/8 bg-background/50"
              >
                <item.icon className="w-5 h-5 text-[hsl(210,30%,60%)] shrink-0 mt-1" strokeWidth={1.5} />
                <div>
                  <h3 className="font-body text-foreground mb-2">{item.title}</h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* How it works */}
      <section className="py-32 sm:py-40 px-6">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-5xl mx-auto"
        >
          <motion.p 
            variants={fadeUp}
            className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6"
          >
            Comment ça fonctionne
          </motion.p>
          
          <motion.h2 
            variants={fadeUp}
            className="font-display text-3xl sm:text-4xl md:text-5xl tracking-wide mb-16"
          >
            Trois étapes. C'est tout.
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-12 md:gap-8">
            {[
              { num: "01", title: "Commandez", desc: "Choisissez votre formule et passez commande." },
              { num: "02", title: "Activez", desc: "Recevez votre carte et activez-la en quelques secondes." },
              { num: "03", title: "Partagez", desc: "Partagez votre identité d'un simple geste." }
            ].map((step, i) => (
              <motion.div 
                key={step.num}
                variants={fadeUp}
                className="relative"
              >
                <span className="font-body text-xs tracking-[0.3em] text-[hsl(210,30%,50%)] mb-4 block">{step.num}</span>
                <h3 className="font-display text-2xl tracking-wide mb-4">{step.title}</h3>
                <p className="font-body text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Trust Section */}
      <section className="py-32 sm:py-40 px-6 bg-[hsl(0,0%,6%)]">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.p 
            variants={fadeUp}
            className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6"
          >
            Confiance
          </motion.p>
          
          <motion.h2 
            variants={fadeUp}
            className="font-display text-3xl sm:text-4xl tracking-wide mb-8"
          >
            Conçu pour les professionnels exigeants.
          </motion.h2>

          <motion.p 
            variants={fadeUp}
            className="font-body text-muted-foreground text-lg leading-relaxed mb-12"
          >
            Infrastructure sécurisée. Données protégées. 
            Expérience optimisée pour les environnements d'affaires les plus exigeants.
          </motion.p>

          <motion.div 
            variants={fadeUp}
            className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground"
          >
            <span className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[hsl(210,30%,50%)]" />
              Usage professionnel
            </span>
            <span className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[hsl(210,30%,50%)]" />
              Infrastructure sécurisée
            </span>
            <span className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[hsl(210,30%,50%)]" />
              Support dédié
            </span>
          </motion.div>
        </motion.div>
      </section>

      {/* Web Studio IA Section */}
      <section className="py-32 sm:py-40 px-6">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-5xl mx-auto"
        >
          <motion.div 
            variants={fadeUp}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 border border-[hsl(210,30%,50%)]/30 bg-[hsl(210,30%,50%)]/10 mb-6">
              <Sparkles className="w-4 h-4 text-[hsl(210,30%,60%)]" />
              <span className="font-body text-xs tracking-[0.2em] uppercase text-[hsl(210,30%,60%)]">Nouveau</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl tracking-wide mb-4">
              Création de site web IA
            </h2>
            <p className="font-body text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Besoin d'un site vitrine professionnel ? Notre studio IA crée votre site web en quelques minutes.
            </p>
          </motion.div>

          <motion.div 
            variants={fadeUp}
            className="border border-foreground/10 p-8 bg-gradient-to-br from-[hsl(210,30%,50%)]/5 to-transparent"
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="w-6 h-6 text-[hsl(210,30%,60%)]" />
                  <h3 className="font-body text-lg">Web Studio I-WASP</h3>
                </div>
                <ul className="space-y-3 mb-6">
                  {[
                    "Site vitrine professionnel",
                    "Généré par intelligence artificielle",
                    "Personnalisable à volonté",
                    "Hébergement inclus"
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-muted-foreground text-sm">
                      <Check className="w-4 h-4 text-[hsl(210,30%,60%)] shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link 
                  to="/web-studio/offres"
                  className="group inline-flex items-center gap-3 px-8 py-3 border border-[hsl(210,30%,50%)] text-[hsl(210,30%,60%)] font-body text-sm tracking-widest uppercase hover:bg-[hsl(210,30%,50%)] hover:text-foreground transition-all duration-500"
                >
                  Découvrir le Web Studio
                </Link>
              </div>
              <div className="w-full md:w-48 h-32 bg-gradient-to-br from-[hsl(210,30%,50%)]/20 to-[hsl(210,30%,50%)]/5 flex items-center justify-center border border-foreground/10">
                <Globe className="w-16 h-16 text-[hsl(210,30%,50%)]/40" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 sm:py-48 px-6">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.h2 
            variants={fadeUp}
            className="font-display text-3xl sm:text-4xl md:text-5xl tracking-wide mb-8"
          >
            Prêt à transformer<br />votre identité professionnelle ?
          </motion.h2>

          <motion.p 
            variants={fadeUp}
            className="font-body text-muted-foreground text-lg mb-12 leading-relaxed"
          >
            Rejoignez les dirigeants qui ont choisi I-WASP.
          </motion.p>

          <motion.div variants={fadeUp}>
            <Link 
              to="/express/offre"
              className="group inline-flex items-center gap-3 px-12 py-5 bg-foreground text-background font-body text-sm tracking-widest uppercase relative overflow-hidden transition-all duration-700"
            >
              <span className="relative z-10">Commander la carte</span>
              <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform duration-500" />
              <div className="absolute inset-0 bg-[hsl(210,30%,50%)] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out" />
            </Link>
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

      {/* Exit Intent Popup */}
      <ExitIntentPopup discountCode="IWASP10" discountPercent={10} />
    </div>
  );
}
