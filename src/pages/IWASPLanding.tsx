import { motion, type Transition } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, Zap, RefreshCw, ArrowRight, CheckCircle2, Globe, Sparkles, Check, Star, Users, Clock, MessageCircle, BadgeCheck, Truck, CreditCard } from "lucide-react";
import { ExitIntentPopup } from "@/components/ExitIntentPopup";
import { useWebStudioTracking } from "@/hooks/useAnalyticsEvents";
import { PortfolioSection } from "@/components/PortfolioSection";
import { useState, useEffect } from "react";

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

// Animated counter hook
function useCounter(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated) return;
    setHasAnimated(true);
    
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration, hasAnimated]);

  return count;
}

// Live activity notification
function LiveActivity() {
  const [show, setShow] = useState(false);
  const [currentActivity, setCurrentActivity] = useState(0);
  
  const activities = [
    { city: "Casablanca", time: "Il y a 3 min", action: "a commandé une carte" },
    { city: "Rabat", time: "Il y a 7 min", action: "a activé sa carte" },
    { city: "Marrakech", time: "Il y a 12 min", action: "a commandé une carte" },
    { city: "Tanger", time: "Il y a 18 min", action: "a partagé son profil" },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 3000);
    const interval = setInterval(() => {
      setShow(false);
      setTimeout(() => {
        setCurrentActivity(prev => (prev + 1) % activities.length);
        setShow(true);
      }, 500);
    }, 8000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  if (!show) return null;

  const activity = activities[currentActivity];
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="fixed bottom-6 left-6 z-40 bg-background/95 backdrop-blur-sm border border-foreground/10 px-4 py-3 shadow-xl max-w-xs"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-[hsl(210,30%,50%)]/20 flex items-center justify-center">
          <Users className="w-4 h-4 text-[hsl(210,30%,60%)]" />
        </div>
        <div>
          <p className="text-xs text-foreground">
            Quelqu'un à <span className="font-medium">{activity.city}</span> {activity.action}
          </p>
          <p className="text-[10px] text-muted-foreground">{activity.time}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function IWASPLanding() {
  const { trackCTAClick } = useWebStudioTracking();
  const cardsCount = useCounter(547, 2500);
  const clientsCount = useCounter(89, 2000);

  const handleWebStudioClick = () => {
    trackCTAClick('landing_webstudio_section');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Live Activity Notifications */}
      <LiveActivity />

      {/* Top Banner - Urgency */}
      <div className="bg-[hsl(210,30%,50%)] py-2.5 px-4 text-center">
        <p className="text-xs sm:text-sm text-white font-medium tracking-wide flex items-center justify-center gap-2">
          <Truck className="w-4 h-4" />
          <span>Livraison GRATUITE au Maroc • Expédition sous 48h</span>
        </p>
      </div>

      {/* Navigation */}
      <motion.nav 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="sticky top-0 z-50 px-6 py-4 bg-background/80 backdrop-blur-md border-b border-foreground/5"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="font-display text-xl tracking-widest text-foreground/90">
            I-WASP
          </span>
          <div className="flex items-center gap-6">
            <a 
              href="https://wa.me/33626424394?text=Bonjour%20👋%0AJ'ai%20une%20question%20sur%20la%20carte%20NFC."
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 text-xs text-[hsl(142,70%,45%)] hover:text-[hsl(142,70%,50%)] transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
            <Link 
              to="/express/offre"
              className="px-4 py-2 bg-foreground text-background text-xs tracking-wider uppercase font-medium hover:bg-foreground/90 transition-colors"
            >
              Commander
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section - Conversion Optimized */}
      <section className="py-16 sm:py-24 px-6 relative overflow-hidden">
        {/* Subtle grain overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')]" />
        
        {/* Subtle radial gradient */}
        <div className="absolute inset-0 bg-gradient-radial from-[hsl(210,20%,8%)] via-background to-background opacity-50" />

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-6xl mx-auto"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div>
              {/* Social Proof Badge */}
              <motion.div 
                variants={fadeUp}
                className="inline-flex items-center gap-2 px-4 py-2 border border-[hsl(210,30%,50%)]/30 bg-[hsl(210,30%,50%)]/10 mb-6"
              >
                <div className="flex -space-x-1">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-5 h-5 rounded-full bg-gradient-to-br from-[hsl(210,30%,60%)] to-[hsl(210,30%,40%)] border border-background flex items-center justify-center text-[8px] text-white font-medium">
                      {["K", "S", "A", "M"][i]}
                    </div>
                  ))}
                </div>
                <span className="text-xs text-[hsl(210,30%,70%)]">
                  +{cardsCount} cartes livrées au Maroc
                </span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1 
                variants={fadeUp}
                className="font-display text-4xl sm:text-5xl md:text-6xl tracking-wide leading-[1.1] mb-6"
              >
                La carte de visite<br />
                <span className="text-[hsl(210,30%,60%)]">des décideurs.</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p 
                variants={fadeUp}
                className="font-body text-muted-foreground text-lg max-w-lg mb-6 leading-relaxed"
              >
                Carte NFC premium pour dirigeants et entrepreneurs. 
                Partagez votre profil professionnel d'un simple geste.
              </motion.p>

              {/* Trust Points */}
              <motion.div 
                variants={fadeUp}
                className="flex flex-wrap gap-4 mb-8"
              >
                {[
                  { icon: Truck, text: "Livraison gratuite" },
                  { icon: CreditCard, text: "Paiement à la livraison" },
                  { icon: Clock, text: "Expédition 48h" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <item.icon className="w-4 h-4 text-[hsl(210,30%,60%)]" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </motion.div>

              {/* Price & CTA */}
              <motion.div variants={fadeUp} className="space-y-4">
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-4xl text-foreground">149 DH</span>
                  <span className="text-lg text-muted-foreground line-through">249 DH</span>
                  <span className="px-2 py-1 bg-[hsl(0,70%,50%)]/20 text-[hsl(0,70%,60%)] text-xs font-medium">
                    -40%
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link 
                    to="/express/offre"
                    className="group relative px-8 py-4 bg-foreground text-background font-body text-sm tracking-widest uppercase overflow-hidden transition-all duration-700 text-center"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Commander maintenant
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-[hsl(210,30%,50%)] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out" />
                  </Link>
                  
                  <a 
                    href="https://wa.me/33626424394?text=Bonjour%20👋%0AJe%20souhaite%20plus%20d'infos%20sur%20la%20carte%20NFC."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 border border-[hsl(142,70%,45%)]/30 text-[hsl(142,70%,50%)] font-body text-sm tracking-wider uppercase hover:bg-[hsl(142,70%,45%)]/10 transition-all duration-300 text-center flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Une question ?
                  </a>
                </div>

                {/* Urgency */}
                <p className="text-xs text-[hsl(0,70%,60%)] flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  Offre limitée • Plus que 12 cartes à ce prix
                </p>
              </motion.div>
            </div>

            {/* Right: Product Visual */}
            <motion.div 
              variants={fadeUp}
              className="relative"
            >
              <div className="relative aspect-square max-w-md mx-auto">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-radial from-[hsl(210,30%,50%)]/20 via-transparent to-transparent blur-3xl" />
                
                {/* Card mockup */}
                <div className="relative bg-gradient-to-br from-[hsl(0,0%,8%)] to-[hsl(0,0%,4%)] rounded-2xl p-8 border border-foreground/10 shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
                  <div className="aspect-[1.6/1] bg-gradient-to-br from-[hsl(0,0%,12%)] to-[hsl(0,0%,6%)] rounded-xl border border-foreground/10 p-6 flex flex-col justify-between relative overflow-hidden">
                    {/* NFC waves */}
                    <div className="absolute top-4 right-4">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-[hsl(210,30%,50%)]">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" fill="currentColor" opacity="0.3"/>
                        <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" fill="currentColor" opacity="0.5"/>
                        <circle cx="12" cy="12" r="2" fill="currentColor"/>
                      </svg>
                    </div>
                    
                    <div>
                      <span className="font-display text-2xl tracking-widest text-foreground/90">I-WASP</span>
                    </div>
                    
                    <div>
                      <p className="font-body text-xs text-muted-foreground mb-1">Votre nom</p>
                      <p className="font-display text-lg tracking-wide text-foreground/80">Prénom Nom</p>
                      <p className="font-body text-xs text-[hsl(210,30%,60%)]">PDG • Votre Entreprise</p>
                    </div>
                  </div>

                  {/* Stats below card */}
                  <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="font-display text-2xl text-foreground">{cardsCount}+</p>
                      <p className="text-xs text-muted-foreground">Cartes livrées</p>
                    </div>
                    <div>
                      <p className="font-display text-2xl text-foreground">{clientsCount}%</p>
                      <p className="text-xs text-muted-foreground">Satisfaction</p>
                    </div>
                    <div>
                      <p className="font-display text-2xl text-foreground">48h</p>
                      <p className="text-xs text-muted-foreground">Livraison</p>
                    </div>
                  </div>
                </div>

                {/* Floating badges */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5, duration: 0.8 }}
                  className="absolute -bottom-4 left-4 bg-background border border-foreground/10 px-3 py-2 shadow-lg"
                >
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="w-4 h-4 text-[hsl(210,30%,60%)]" />
                    <span className="text-xs font-medium">Qualité Premium</span>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.8, duration: 0.8 }}
                  className="absolute -top-4 right-4 bg-background border border-foreground/10 px-3 py-2 shadow-lg"
                >
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-[hsl(45,90%,50%)] text-[hsl(45,90%,50%)]" />
                    ))}
                    <span className="text-xs ml-1">4.9/5</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Trust Logos / Social Proof Bar */}
          <motion.div 
            variants={fadeUp}
            className="mt-16 pt-12 border-t border-foreground/5"
          >
            <p className="text-center text-xs text-muted-foreground mb-6 tracking-wider uppercase">
              Ils nous font confiance
            </p>
            <div className="flex flex-wrap justify-center gap-8 opacity-50">
              {["Atlas Consulting", "Meridian Capital", "TechVentures", "Royal Advisory", "Summit Partners"].map((name) => (
                <span key={name} className="font-display text-lg tracking-widest text-foreground/60">
                  {name}
                </span>
              ))}
            </div>
          </motion.div>
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

      {/* Trust Section with Testimonials */}
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
            className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6 text-center"
          >
            Témoignages
          </motion.p>
          
          <motion.h2 
            variants={fadeUp}
            className="font-display text-3xl sm:text-4xl tracking-wide mb-12 text-center"
          >
            Ce qu'en disent nos clients.
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                quote: "La carte qui a changé ma façon de networker. Mes contacts sont impressionnés à chaque fois.", 
                name: "Karim B.", 
                role: "CEO, Atlas Consulting",
                rating: 5 
              },
              { 
                quote: "Qualité irréprochable et livraison ultra-rapide. Je recommande sans hésiter.", 
                name: "Sophie M.", 
                role: "Directrice Générale",
                rating: 5 
              },
              { 
                quote: "Enfin une carte à la hauteur de mon image. Le NFC fonctionne parfaitement.", 
                name: "Ahmed E.", 
                role: "Fondateur, TechVentures",
                rating: 5 
              },
            ].map((testimonial, i) => (
              <motion.div 
                key={testimonial.name}
                variants={fadeUp}
                className="border border-foreground/10 bg-background/50 p-6"
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[hsl(45,90%,50%)] text-[hsl(45,90%,50%)]" />
                  ))}
                </div>
                <p className="font-body text-foreground/80 mb-6 leading-relaxed italic">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="font-body font-medium text-foreground">{testimonial.name}</p>
                  <p className="font-body text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trust badges */}
          <motion.div 
            variants={fadeUp}
            className="flex flex-wrap justify-center gap-8 mt-12 pt-12 border-t border-foreground/5"
          >
            {[
              { icon: Shield, label: "Paiement sécurisé" },
              { icon: Truck, label: "Livraison gratuite" },
              { icon: RefreshCw, label: "Satisfait ou remboursé" },
              { icon: BadgeCheck, label: "Qualité garantie" },
            ].map((badge) => (
              <div key={badge.label} className="flex items-center gap-2 text-muted-foreground">
                <badge.icon className="w-5 h-5 text-[hsl(210,30%,60%)]" />
                <span className="text-sm">{badge.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Portfolio Section */}
      <PortfolioSection />

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
                  onClick={handleWebStudioClick}
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

      {/* Final CTA Section - High Conversion */}
      <section className="py-32 sm:py-48 px-6 bg-gradient-to-b from-background to-[hsl(0,0%,6%)]">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.div 
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-2 border border-[hsl(0,70%,50%)]/30 bg-[hsl(0,70%,50%)]/10 mb-6"
          >
            <Clock className="w-4 h-4 text-[hsl(0,70%,60%)]" />
            <span className="font-body text-xs tracking-[0.2em] uppercase text-[hsl(0,70%,60%)]">
              Offre limitée
            </span>
          </motion.div>

          <motion.h2 
            variants={fadeUp}
            className="font-display text-3xl sm:text-4xl md:text-5xl tracking-wide mb-6"
          >
            Votre carte premium<br />vous attend.
          </motion.h2>

          <motion.div 
            variants={fadeUp}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <span className="font-display text-5xl text-foreground">149 DH</span>
            <div className="text-left">
              <span className="text-xl text-muted-foreground line-through block">249 DH</span>
              <span className="px-2 py-1 bg-[hsl(0,70%,50%)]/20 text-[hsl(0,70%,60%)] text-xs font-medium">
                Économisez 100 DH
              </span>
            </div>
          </motion.div>

          <motion.p 
            variants={fadeUp}
            className="font-body text-muted-foreground mb-8 leading-relaxed"
          >
            Livraison gratuite • Paiement à la livraison • Expédition sous 48h
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/express/offre"
              className="group inline-flex items-center justify-center gap-3 px-12 py-5 bg-foreground text-background font-body text-sm tracking-widest uppercase relative overflow-hidden transition-all duration-700"
            >
              <span className="relative z-10">Commander maintenant</span>
              <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform duration-500" />
              <div className="absolute inset-0 bg-[hsl(210,30%,50%)] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out" />
            </Link>
            
            <a 
              href="https://wa.me/33626424394?text=Bonjour%20👋%0AJe%20souhaite%20commander%20une%20carte%20NFC."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-5 border border-[hsl(142,70%,45%)] text-[hsl(142,70%,50%)] font-body text-sm tracking-widest uppercase hover:bg-[hsl(142,70%,45%)] hover:text-white transition-all duration-500"
            >
              <MessageCircle className="w-4 h-4" />
              Commander via WhatsApp
            </a>
          </motion.div>

          {/* Final trust points */}
          <motion.div 
            variants={fadeUp}
            className="mt-12 flex flex-wrap justify-center gap-6"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4 text-[hsl(210,30%,60%)]" />
              <span>Paiement sécurisé</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Truck className="w-4 h-4 text-[hsl(210,30%,60%)]" />
              <span>Livraison gratuite</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BadgeCheck className="w-4 h-4 text-[hsl(210,30%,60%)]" />
              <span>Satisfait ou remboursé</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-foreground/8 bg-[hsl(0,0%,6%)]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-display text-lg tracking-widest text-foreground/60">
            I-WASP
          </span>
          <div className="flex items-center gap-6">
            <a 
              href="https://wa.me/33626424394"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-[hsl(142,70%,50%)] transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
            <p className="font-body text-xs text-muted-foreground tracking-wide">
              © 2025 I-WASP. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>

      {/* Exit Intent Popup */}
      <ExitIntentPopup discountCode="IWASP10" discountPercent={10} />

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/33626424394?text=Bonjour%20👋%0AJe%20souhaite%20des%20informations%20sur%20la%20carte%20NFC."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,50%)] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </a>
    </div>
  );
}
