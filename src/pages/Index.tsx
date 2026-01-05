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
  ChefHat
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ClubNavbar } from "@/components/ClubNavbar";
import { GlobalFooter } from "@/components/GlobalFooter";

// Assets
import heroLounge from "@/assets/club/hero-lounge.jpg";
import worldConnected from "@/assets/club/world-connected.jpg";

const WHATSAPP_PROJECT_URL = "https://wa.me/33626424394?text=Bonjour%20👋%0AJe%20souhaite%20lancer%20mon%20projet%20NFC%20avec%20i-wasp.";

// How it works steps
const steps = [
  {
    number: "01",
    title: "Décris ton projet",
    description: "Dis-nous ce que tu veux créer. Notre IA analyse tes besoins et te propose des solutions sur mesure.",
    icon: Sparkles
  },
  {
    number: "02", 
    title: "On conçoit pour toi",
    description: "Notre conciergerie s'occupe de tout : design, programmation NFC, intégration IA.",
    icon: Zap
  },
  {
    number: "03",
    title: "Déploie et connecte",
    description: "Reçois tes cartes et tags NFC. Active les notifications push pour engager ton audience.",
    icon: Bell
  }
];

// Target audiences
const audiences = [
  { icon: ChefHat, label: "Restauration", description: "Menus, avis, fidélité" },
  { icon: Calendar, label: "Événementiel", description: "Invitations, accès VIP" },
  { icon: Home, label: "Immobilier", description: "Visites, dossiers, contacts" },
  { icon: Palette, label: "Créateurs", description: "Portfolio, commandes" },
  { icon: Briefcase, label: "Freelances", description: "Carte de visite augmentée" },
  { icon: Building2, label: "Entreprises", description: "Équipes, événements" }
];

// Why different points
const differentiators = [
  {
    icon: Sparkles,
    title: "NFC + IA intégrée",
    description: "Nos cartes analysent et optimisent chaque interaction grâce à l'intelligence artificielle."
  },
  {
    icon: Users,
    title: "Conciergerie dédiée",
    description: "Une équipe s'occupe de tout pour toi : design, programmation, livraison."
  },
  {
    icon: Bell,
    title: "Notifications push",
    description: "Envoie des messages aux personnes qui ont tapé ta carte. Réengage ton audience."
  },
  {
    icon: Shield,
    title: "Club privé mondial",
    description: "Accès à un réseau exclusif de créateurs et entrepreneurs connectés."
  }
];

// Trust stats
const trustStats = [
  { value: "500+", label: "Membres actifs" },
  { value: "50K+", label: "Cartes déployées" },
  { value: "98%", label: "Satisfaction client" },
  { value: "24h", label: "Temps de réponse" }
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
    <div className="min-h-screen bg-[#0B0B0B] text-white overflow-x-hidden">
      <ClubNavbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img 
            src={heroLounge} 
            alt="Club i-wasp" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0B]/60 via-[#0B0B0B]/40 to-[#0B0B0B]" />
        </div>
        
        {/* Warm glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 text-center pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-sm text-white/70">Club privé mondial</span>
            </div>
            
            {/* Main headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-6">
              <span className="text-white">Crée ton club privé</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                avec une simple carte NFC
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
              i-wasp conçoit pour toi cartes, tags et expériences NFC, 
              <span className="text-amber-400"> augmentées par l'IA</span>, 
              avec conciergerie sur mesure.
            </p>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href={WHATSAPP_PROJECT_URL} target="_blank" rel="noopener noreferrer">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-semibold px-8 py-6 rounded-full text-lg gap-2"
                >
                  Lancer mon projet NFC
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </a>
              <Link to="/club">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white/20 text-white hover:bg-white/10 px-8 py-6 rounded-full text-lg"
                >
                  Découvrir le club i-wasp
                </Button>
              </Link>
            </div>
          </motion.div>
          
          {/* Scroll indicator */}
          <motion.div 
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
              <div className="w-1.5 h-3 rounded-full bg-amber-400" />
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* How it works */}
      <section className="py-24 bg-[#0B0B0B]">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Comment ça marche en <span className="text-amber-400">3 étapes</span>
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">
              De l'idée à la carte NFC connectée, on s'occupe de tout.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-amber-500/50 transition-all group"
              >
                <div className="text-6xl font-bold text-white/5 absolute top-4 right-4">
                  {step.number}
                </div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <step.icon className="w-7 h-7 text-amber-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-white/60">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* For who */}
      <section className="py-24 bg-[#121212]">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Pour <span className="text-amber-400">qui</span> ?
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">
              i-wasp s'adapte à tous les secteurs et tous les projets.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {audiences.map((audience, index) => (
              <motion.div
                key={audience.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/50 hover:bg-white/10 transition-all text-center group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <audience.icon className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="font-semibold mb-1">{audience.label}</h3>
                <p className="text-xs text-white/50">{audience.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Why different */}
      <section className="py-24 bg-[#0B0B0B] relative overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img 
            src={worldConnected} 
            alt="Monde connecté" 
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0B] via-[#0B0B0B]/80 to-[#0B0B0B]" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Pourquoi i-wasp est <span className="text-amber-400">différent</span> ?
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">
              Pas juste une carte. Un écosystème complet pour connecter et engager.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {differentiators.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 hover:border-amber-500/30 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-white/60">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Trust & Social Proof */}
      <section className="py-24 bg-[#121212]">
        <div className="container mx-auto px-6">
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
          >
            {trustStats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mb-2">
                  {stat.value}
                </div>
                <div className="text-white/50 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
          
          {/* Testimonials */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ils font confiance à <span className="text-amber-400">i-wasp</span>
            </h2>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-white/80 mb-6 italic">"{testimonial.quote}"</p>
                <div>
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-sm text-white/50">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Final CTA */}
      <section className="py-24 bg-[#0B0B0B] relative overflow-hidden">
        {/* Glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[150px]" />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl sm:text-5xl font-bold mb-6">
              Prêt à rejoindre le <span className="text-amber-400">club</span> ?
            </h2>
            <p className="text-white/60 text-lg mb-10">
              Lance ton projet NFC dès maintenant. Notre conciergerie te répond en moins de 24h.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <a href={WHATSAPP_PROJECT_URL} target="_blank" rel="noopener noreferrer">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-semibold px-8 py-6 rounded-full text-lg gap-2"
                >
                  Lancer mon projet NFC
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </a>
              <Link to="/contact">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white/20 text-white hover:bg-white/10 px-8 py-6 rounded-full text-lg"
                >
                  Nous contacter
                </Button>
              </Link>
            </div>
            
            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-white/40 text-sm">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-400" />
                <span>Sans engagement</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-400" />
                <span>Devis gratuit</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-400" />
                <span>Accompagnement humain</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      <GlobalFooter variant="dark" />
    </div>
  );
};

export default Index;
