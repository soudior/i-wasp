import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Users, 
  Bell, 
  Shield, 
  Check,
  Star,
  Building2,
  Calendar,
  Home,
  Palette,
  Briefcase,
  ChefHat,
  Navigation
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ClubNavbar } from "@/components/ClubNavbar";
import { GlobalFooter } from "@/components/GlobalFooter";

const WHATSAPP_PROJECT_URL = "https://wa.me/33626424394?text=Bonjour%20👋%0AJe%20souhaite%20lancer%20mon%20projet%20NFC%20avec%20i-wasp.";

// How it works steps
const steps = [
  {
    number: "01",
    title: "Décris ton projet",
    description: "Notre IA analyse tes besoins et te propose des solutions sur mesure.",
    icon: Sparkles
  },
  {
    number: "02", 
    title: "On conçoit pour toi",
    description: "Design, programmation NFC, intégration IA. On s'occupe de tout.",
    icon: Zap
  },
  {
    number: "03",
    title: "Déploie et connecte",
    description: "Reçois tes cartes NFC. Active les notifications push.",
    icon: Bell
  }
];

// Target audiences
const audiences = [
  { icon: ChefHat, label: "Restauration", description: "Menus, avis, fidélité" },
  { icon: Calendar, label: "Événementiel", description: "Invitations, accès VIP" },
  { icon: Home, label: "Immobilier", description: "Visites, dossiers" },
  { icon: Palette, label: "Créateurs", description: "Portfolio, commandes" },
  { icon: Briefcase, label: "Freelances", description: "Carte augmentée" },
  { icon: Building2, label: "Entreprises", description: "Équipes, événements" }
];

// Why different points
const differentiators = [
  {
    icon: Sparkles,
    title: "NFC + IA intégrée",
    description: "Nos cartes analysent et optimisent chaque interaction."
  },
  {
    icon: Users,
    title: "Conciergerie dédiée",
    description: "Une équipe s'occupe de tout : design, programmation, livraison."
  },
  {
    icon: Bell,
    title: "Notifications push",
    description: "Envoie des messages aux personnes qui ont tapé ta carte."
  },
  {
    icon: Navigation,
    title: "Géolocalisation live",
    description: "Tracez l'origine de votre succès sur une carte mondiale."
  }
];

// Trust stats
const trustStats = [
  { value: "500+", label: "Membres actifs" },
  { value: "50K+", label: "Cartes déployées" },
  { value: "98%", label: "Satisfaction" },
  { value: "24h", label: "Réponse garantie" }
];

// Testimonials
const testimonials = [
  {
    quote: "i-wasp a transformé ma façon de networker. Une carte, zéro effort.",
    author: "Sarah M.",
    role: "Fondatrice, Studio Créatif"
  },
  {
    quote: "La conciergerie m'a tout préparé. J'ai juste eu à valider le design.",
    author: "Thomas L.",
    role: "Restaurateur"
  },
  {
    quote: "Les notifications push ont triplé mon taux de rappel client.",
    author: "Marie K.",
    role: "Agent immobilier"
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-iwasp-midnight text-iwasp-cream overflow-x-hidden">
      <ClubNavbar />
      
      {/* Hero Section — Ultra-Luxe */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Midnight gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-iwasp-midnight via-[#080A0D] to-iwasp-midnight" />
        
        {/* Emerald ambient glow */}
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-iwasp-emerald/10 rounded-full blur-[200px] opacity-50" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-iwasp-bronze/8 rounded-full blur-[180px] opacity-40" />
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(hsl(160 45% 33% / 0.3) 1px, transparent 1px),
                              linear-gradient(90deg, hsl(160 45% 33% / 0.3) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 text-center pt-24 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-5xl mx-auto"
          >
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-iwasp-emerald/10 border border-iwasp-emerald/20 backdrop-blur-sm mb-10"
            >
              <div className="w-2 h-2 rounded-full bg-iwasp-emerald-glow animate-pulse" />
              <span className="text-sm tracking-[0.15em] uppercase text-iwasp-silver font-medium">
                L'Identité Absolue
              </span>
            </motion.div>
            
            {/* Main headline — Playfair Display */}
            <h1 className="font-display text-5xl sm:text-6xl lg:text-8xl font-normal leading-[1.1] mb-8">
              <span className="text-iwasp-cream">Dominez</span>
              <br />
              <span className="text-iwasp-cream">votre</span>
              <br />
              <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-iwasp-bronze via-iwasp-bronze-light to-iwasp-bronze">
                Expansion.
              </span>
            </h1>
            
            {/* Subtitle with left accent bar */}
            <div className="flex items-start justify-center mb-12">
              <div className="w-0.5 h-20 bg-gradient-to-b from-iwasp-bronze to-transparent mr-6 hidden sm:block" />
              <p className="text-lg sm:text-xl text-iwasp-silver max-w-xl text-left leading-relaxed">
                i-Wasp n'est pas un outil, c'est votre héritage digital. 
                Une pression unique pour synchroniser votre influence mondiale.
              </p>
            </div>
            
            {/* CTA — Bronze brossé */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <a href={WHATSAPP_PROJECT_URL} target="_blank" rel="noopener noreferrer">
                <Button 
                  size="lg" 
                  className="bg-iwasp-bronze hover:bg-iwasp-bronze-light text-iwasp-midnight font-semibold px-10 py-7 rounded-2xl text-lg gap-3 tracking-[0.08em] uppercase shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Commencer l'ascension
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </a>
            </motion.div>
          </motion.div>
          
          {/* Scroll indicator */}
          <motion.div 
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-6 h-12 rounded-full border border-iwasp-emerald/30 flex items-start justify-center p-2">
              <div className="w-1 h-3 rounded-full bg-iwasp-bronze" />
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Stats — Trust badges */}
      <section className="py-16 bg-iwasp-midnight border-y border-iwasp-emerald/10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {trustStats.map((stat, index) => (
              <motion.div 
                key={stat.label} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="font-display text-4xl sm:text-5xl font-normal text-iwasp-bronze mb-2">
                  {stat.value}
                </div>
                <div className="text-iwasp-silver text-sm tracking-wide uppercase">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How it works */}
      <section className="py-28 bg-gradient-to-b from-iwasp-midnight to-iwasp-midnight-elevated">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="font-display text-4xl sm:text-5xl font-normal mb-6">
              <span className="italic text-iwasp-bronze">Une Présence</span>
              <br />
              <span className="text-iwasp-cream uppercase tracking-[0.1em]">Sans Frontières.</span>
            </h2>
            <p className="text-iwasp-silver max-w-2xl mx-auto text-lg leading-relaxed">
              Gérez votre flotte de cartes NFC et vos points d'impact sur une carte mondiale interactive.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                className="relative p-8 rounded-3xl bg-iwasp-midnight-elevated/50 border border-iwasp-emerald/10 hover:border-iwasp-bronze/30 transition-all duration-500 group"
              >
                {/* Step number */}
                <div className="text-7xl font-display font-normal text-iwasp-emerald/10 absolute top-4 right-6">
                  {step.number}
                </div>
                
                {/* Icon */}
                <div className="w-14 h-14 rounded-full bg-iwasp-emerald/10 border border-iwasp-emerald/20 flex items-center justify-center mb-6 group-hover:bg-iwasp-bronze/10 group-hover:border-iwasp-bronze/30 transition-all duration-500">
                  <step.icon className="w-6 h-6 text-iwasp-emerald-glow group-hover:text-iwasp-bronze transition-colors duration-500" />
                </div>
                
                <h3 className="font-display text-xl font-normal mb-3 text-iwasp-cream">{step.title}</h3>
                <p className="text-iwasp-silver text-sm leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* For who — Audiences */}
      <section className="py-28 bg-iwasp-midnight-elevated">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl sm:text-5xl font-normal mb-4">
              <span className="text-iwasp-cream">Pour </span>
              <span className="italic text-iwasp-bronze">l'Excellence</span>
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
            {audiences.map((audience, index) => (
              <motion.div
                key={audience.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="p-6 rounded-2xl bg-iwasp-midnight/50 border border-iwasp-emerald/10 hover:border-iwasp-bronze/40 hover:bg-iwasp-midnight transition-all duration-300 text-center group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-iwasp-emerald/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-iwasp-bronze/15 transition-colors duration-300">
                  <audience.icon className="w-5 h-5 text-iwasp-emerald-glow group-hover:text-iwasp-bronze transition-colors duration-300" />
                </div>
                <h3 className="font-medium text-sm mb-1 text-iwasp-cream">{audience.label}</h3>
                <p className="text-xs text-iwasp-silver/70">{audience.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Why different — Features */}
      <section className="py-28 bg-iwasp-midnight relative overflow-hidden">
        {/* Ambient effects */}
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-iwasp-emerald/5 rounded-full blur-[150px] -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-iwasp-bronze/5 rounded-full blur-[120px] -translate-y-1/2" />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="font-display text-4xl sm:text-5xl font-normal mb-6">
              <span className="italic text-iwasp-bronze">Pourquoi</span>
              <span className="text-iwasp-cream"> i-wasp ?</span>
            </h2>
            <p className="text-iwasp-silver max-w-xl mx-auto">
              Pas juste une carte. Un écosystème complet pour connecter et engager.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {differentiators.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.12 }}
                className="p-6 rounded-2xl bg-gradient-to-b from-iwasp-midnight-elevated/80 to-iwasp-midnight-elevated/40 border border-iwasp-emerald/10 hover:border-iwasp-bronze/30 transition-all duration-500"
              >
                <div className="w-14 h-14 rounded-full border border-iwasp-emerald/20 flex items-center justify-center mb-5">
                  <item.icon className="w-6 h-6 text-iwasp-cream" />
                </div>
                <h3 className="text-sm font-semibold mb-2 text-iwasp-cream uppercase tracking-wide">{item.title}</h3>
                <p className="text-sm text-iwasp-silver leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-28 bg-iwasp-midnight-elevated">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl sm:text-5xl font-normal">
              <span className="text-iwasp-cream">Ils font confiance à </span>
              <span className="italic text-iwasp-bronze">i-wasp</span>
            </h2>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.12 }}
                className="p-8 rounded-3xl bg-iwasp-midnight border border-iwasp-emerald/10"
              >
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-iwasp-bronze text-iwasp-bronze" />
                  ))}
                </div>
                <p className="text-iwasp-cream/90 mb-8 leading-relaxed font-light italic">
                  "{testimonial.quote}"
                </p>
                <div className="border-t border-iwasp-emerald/10 pt-5">
                  <div className="font-medium text-iwasp-cream">{testimonial.author}</div>
                  <div className="text-sm text-iwasp-silver">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Final CTA */}
      <section className="py-32 bg-iwasp-midnight relative overflow-hidden">
        {/* Luxe glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-iwasp-emerald/8 rounded-full blur-[200px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-iwasp-bronze/10 rounded-full blur-[150px]" />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="font-display text-4xl sm:text-6xl font-normal mb-8">
              <span className="text-iwasp-cream">Prêt à rejoindre</span>
              <br />
              <span className="italic text-iwasp-bronze">l'élite</span>
              <span className="text-iwasp-cream"> ?</span>
            </h2>
            <p className="text-iwasp-silver text-lg mb-12 max-w-xl mx-auto">
              Lance ton projet NFC dès maintenant. Notre conciergerie te répond en moins de 24h.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-16">
              <a href={WHATSAPP_PROJECT_URL} target="_blank" rel="noopener noreferrer">
                <Button 
                  size="lg" 
                  className="bg-iwasp-bronze hover:bg-iwasp-bronze-light text-iwasp-midnight font-semibold px-10 py-7 rounded-2xl text-lg gap-3 tracking-[0.08em] uppercase"
                >
                  Commencer l'ascension
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </a>
              <Link to="/contact">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-iwasp-emerald/30 text-iwasp-cream hover:bg-iwasp-emerald/10 hover:border-iwasp-emerald/50 px-10 py-7 rounded-2xl text-lg"
                >
                  Nous contacter
                </Button>
              </Link>
            </div>
            
            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-iwasp-silver text-sm">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-iwasp-emerald-glow" />
                <span>Sans engagement</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-iwasp-emerald-glow" />
                <span>Devis gratuit</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-iwasp-emerald-glow" />
                <span>Accompagnement humain</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      <GlobalFooter />
    </div>
  );
};

export default Index;
