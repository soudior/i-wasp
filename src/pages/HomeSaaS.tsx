import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Wifi, 
  RefreshCw, 
  BarChart3, 
  CheckCircle2, 
  ArrowRight, 
  Zap,
  Users,
  Bell,
  Clock,
  Target,
  MessageSquare,
  Trophy,
  Sparkles,
  Eye,
  Calendar,
  FileText,
  ChevronRight,
  Play,
  Building2,
  Briefcase,
  Hotel,
  Check,
  X,
  ChevronDown,
  Rocket,
  Shield,
  Star,
  Award,
  TrendingUp,
  Send,
  Video,
  Mic,
  Link2,
  UserPlus,
  Smartphone
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// DATA STRUCTURES
// ═══════════════════════════════════════════════════════════════════════════

const howItWorks = [
  {
    step: "01",
    icon: Sparkles,
    title: "Crée ta carte vivante",
    description: "Centralisez votre profil, vos liens, vos offres et vos documents dans une carte digitale NFC qui se met à jour en temps réel. Vous changez de contenu, la carte change instantanément."
  },
  {
    step: "02",
    icon: Wifi,
    title: "Partage en un tap",
    description: "Approchez votre carte d'un smartphone ou partagez un QR. Tes infos s'enregistrent en un geste, avec un mini-profil clair et actionnable pour votre contact."
  },
  {
    step: "03",
    icon: Target,
    title: "Laisse le concierge faire le reste",
    description: "Stories, relances, rappels, stats : i-wasp s'occupe du suivi et te prévient quand c'est le bon moment pour relancer."
  }
];

const storiesFeatures = [
  { 
    icon: Sparkles, 
    text: "Story automatique : résumé de la rencontre + prochaines étapes, visible 24h par ton contact." 
  },
  { 
    icon: Video, 
    text: "Story personnalisable : ajoute une courte vidéo, une note vocale ou un lien (Calendly, offre, PDF)." 
  },
  { 
    icon: Calendar, 
    text: "Appel à l'action intégré : « Réserver un appel », « Découvrir l'offre », « Télécharger la présentation »." 
  }
];

const pushFeatures = [
  {
    icon: Eye,
    title: "Contact revisite ta carte",
    description: "« X vient d'ouvrir ta présentation », « Y vient de revisiter ta carte »",
    color: "text-gold-500"
  },
  {
    icon: Clock,
    title: "Suggestions de timing",
    description: "« C'est le bon moment pour lui écrire » en fonction de ses habitudes de consultation.",
    color: "text-purple-400"
  },
  {
    icon: BarChart3,
    title: "Tableau de bord clair",
    description: "Contacts rencontrés, taux de réponses, rendez-vous générés, « score de santé » de ton réseau.",
    color: "text-green-400"
  }
];

const gamificationPoints = [
  { action: "Contact qualifié", points: "+1 pt" },
  { action: "Relance envoyée", points: "+2 pts" },
  { action: "Rendez-vous confirmé", points: "+5 pts" }
];

const gamificationBadges = [
  { icon: Trophy, name: "Networker du mois", description: "Top 10% des utilisateurs actifs", color: "bg-gradient-to-br from-gold-500 to-gold-600" },
  { icon: Star, name: "Closer salon X", description: "Champion d'un événement", color: "bg-gradient-to-br from-purple-500 to-purple-600" },
  { icon: Users, name: "100 contacts suivis", description: "Sans en oublier un seul", color: "bg-gradient-to-br from-green-500 to-green-600" }
];

const missions = [
  "Ajouter une note à 5 contacts",
  "Relancer 10 contacts inactifs",
  "Planifier 3 RDV cette semaine"
];

const targetAudiences = [
  {
    icon: Briefcase,
    title: "Freelances & experts",
    description: "Coachs, consultants, créateurs, formateurs."
  },
  {
    icon: Building2,
    title: "Commerciaux & agences",
    description: "Immobilier, finance, assurances, B2B."
  },
  {
    icon: Hotel,
    title: "Hôtellerie & événementiel",
    description: "Conciergerie, réception, salons, VIP."
  }
];

const comparisonClassic = [
  "Partagent les coordonnées",
  "Profil de page statique",
  "Aucun suivi, aucun rappel"
];

const comparisonIwasp = [
  "Stories 24h, contenu dynamique et offres limitées",
  "Relances intelligentes, push, analytics et timeline de chaque relation",
  "Gamification, missions, intros automatiques entre les bons contacts"
];

const faqs = [
  {
    question: "Est-ce que mes contacts doivent installer une application ?",
    answer: "Non. Un simple tap NFC ou scan de QR ouvre votre profil dans leur navigateur."
  },
  {
    question: "Et si je change d'offre, de numéro ou de poste ?",
    answer: "Tu modifies ton profil i-wasp, toutes tes cartes physiques affichent instantanément les nouvelles infos."
  },
  {
    question: "Est-ce que c'est sécurisé ?",
    answer: "Les données sont hébergées sur des serveurs sécurisés et tu contrôles ce que chaque contact peut voir."
  },
  {
    question: "C'est compatible avec tous les téléphones ?",
    answer: "Oui. Tous les iPhone depuis le 7 et la majorité des Android supportent le NFC. En cas de doute, un QR code de secours est toujours disponible."
  }
];

const stats = [
  { value: "10K+", label: "Cartes actives" },
  { value: "500K+", label: "Scans mensuels" },
  { value: "98%", label: "Satisfaction" },
  { value: "24/7", label: "Support" }
];

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function HomeSaaS() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#07080D]">
      {/* ═══════════════════════════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 px-4 overflow-hidden">
        {/* Background effects - neon glows */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gold-500/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-gradient-to-r from-gold-500/5 via-purple-500/5 to-gold-500/5 rounded-full blur-[100px]" />
        </div>
        
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,190,10,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,190,10,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
        
        <div className="relative max-w-[1100px] mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0F1118] border border-gold-500/20 mb-8">
              <Zap className="w-4 h-4 text-gold-500" />
              <span className="text-sm font-medium text-gold-400">Concierge digital de networking</span>
            </div>
            
            {/* Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-[1.1] tracking-tight">
              La carte qui travaille
              <span className="block mt-2 bg-gradient-to-r from-gold-400 via-gold-500 to-purple-400 bg-clip-text text-transparent">
                pour ton réseau, 24h/24.
              </span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-[#9CA3AF] max-w-3xl mx-auto mb-10 leading-relaxed">
              i-wasp transforme ta carte NFC en concierge digital : stories 24h après chaque rencontre, 
              relances intelligentes, notifications push et analytiques pour ne plus jamais laisser mourir un contact.
            </p>
            
            {/* Visual flow: Tap → Story → Notif → RDV */}
            <div className="flex items-center justify-center gap-3 md:gap-6 mb-12 flex-wrap">
              {[
                { icon: Wifi, label: "Tap NFC", color: "from-gold-500/20 to-gold-600/20" },
                { icon: Clock, label: "Story 24h", color: "from-purple-500/20 to-purple-600/20" },
                { icon: Bell, label: "Notification", color: "from-gold-500/20 to-gold-600/20" },
                { icon: Calendar, label: "RDV confirmé", color: "from-green-500/20 to-green-600/20" }
              ].map((step, i) => (
                <motion.div 
                  key={i} 
                  className="flex items-center gap-3 md:gap-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${step.color} border border-white/10 flex items-center justify-center backdrop-blur-sm`}>
                      <step.icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                    </div>
                    <span className="text-xs md:text-sm text-[#8B8D98]">{step.label}</span>
                  </div>
                  {i < 3 && (
                    <ChevronRight className="w-5 h-5 text-gold-500/40 mt-[-20px]" />
                  )}
                </motion.div>
              ))}
            </div>
            
            {/* CTAs */}
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Link to="/order/type">
                <Button size="lg" className="btn-premium text-lg px-8 py-6 gap-2 min-h-[56px]">
                  Créer mon profil
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/demo">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-purple-500/40 text-purple-400 hover:bg-purple-500/10 hover:border-purple-500/60 px-8 py-6 text-lg gap-2 min-h-[56px] rounded-full"
                >
                  <Play className="w-5 h-5" />
                  Voir la démo en 2 min
                </Button>
              </Link>
            </motion.div>
            
            {/* Reassurance text */}
            <motion.p 
              className="text-[#8B8D98] text-sm mb-8 flex items-center justify-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <Smartphone className="w-4 h-4" />
              Aucune application obligatoire pour vos contacts. Un tap ou un scan, et tout se passe dans leur navigateur.
            </motion.p>
            
            {/* Trust badges */}
            <motion.div 
              className="flex flex-wrap items-center justify-center gap-6 text-[#8B8D98] text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Compatible tous smartphones</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Setup en 5 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Satisfait ou remboursé</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          STATS BAR
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-12 px-4 border-y border-white/5 bg-[#0F1118]/50">
        <div className="max-w-[1100px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div 
                key={i} 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gold-400 to-gold-500 bg-clip-text text-transparent mb-1">
                  {stat.value}
                </p>
                <p className="text-[#8B8D98] text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          COMMENT ÇA MARCHE - 3 ÉTAPES
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 px-4">
        <div className="max-w-[1100px] mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              En 3 étapes simples
            </h2>
            <p className="text-[#9CA3AF] text-lg max-w-2xl mx-auto">
              Passe au networking du futur en quelques minutes.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((item, i) => (
              <motion.div
                key={i}
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                {/* Connector line */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-12 left-[calc(50%+60px)] w-[calc(100%-120px)] h-[2px] bg-gradient-to-r from-gold-500/30 via-purple-500/30 to-gold-500/30" />
                )}
                
                <div className="card-offer p-8 text-center relative z-10 h-full">
                  {/* Step number */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-[#07080D] text-sm font-bold">
                      {item.step}
                    </span>
                  </div>
                  
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-500/20 to-purple-500/20 flex items-center justify-center mx-auto mt-4 mb-6 border border-white/10">
                    <item.icon className="w-8 h-8 text-gold-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                  <p className="text-[#9CA3AF]">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          STORIES 24H & RELANCES INTELLIGENTES
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 px-4 bg-gradient-to-b from-[#0F1118]/50 to-transparent">
        <div className="max-w-[1100px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-6">
                <Clock className="w-4 h-4" />
                Stories 24h
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                Stories 24h après
                <span className="block text-purple-400">chaque rencontre</span>
              </h2>
              <p className="text-[#9CA3AF] text-lg mb-8 leading-relaxed">
                Après chaque nouveau contact, i-wasp crée une histoire dédiée à cette relation pour garder 
                la rencontre fraîche dans les esprits.
              </p>
              
              <div className="space-y-4 mb-8">
                {storiesFeatures.map((item, i) => (
                  <motion.div 
                    key={i} 
                    className="flex items-start gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-gold-500/10 flex items-center justify-center border border-white/5 flex-shrink-0 mt-1">
                      <item.icon className="w-5 h-5 text-purple-400" />
                    </div>
                    <span className="text-[#9CA3AF]">{item.text}</span>
                  </motion.div>
                ))}
              </div>
              
              {/* Relances intelligentes sub-section */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-gold-500/10 to-transparent border border-gold-500/20">
                <p className="text-gold-400 font-medium mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Relances intelligentes
                </p>
                <p className="text-[#9CA3AF] text-sm mb-4">
                  L'IA vous propose 2 à 3 messages de relance prêts à envoyer (formel, direct, amical).
                </p>
                <p className="text-[#8B8D98] text-sm">
                  En un clic vous envoyez par email, WhatsApp ou message LinkedIn.
                </p>
              </div>
            </motion.div>
            
            {/* Right: Story mockup */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              {/* Glow effects */}
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 via-gold-500/10 to-purple-500/20 rounded-3xl blur-2xl opacity-50" />
              
              <div className="relative bg-[#0F1118] rounded-3xl p-6 border border-white/10 shadow-2xl">
                {/* Story header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-gold-500 flex items-center justify-center">
                    <span className="text-white font-bold">JD</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Jean Dupont</p>
                    <p className="text-[#8B8D98] text-sm flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Expire dans 22h
                    </p>
                  </div>
                  <div className="ml-auto">
                    <span className="badge-purple">Story 24h</span>
                  </div>
                </div>
                
                {/* Story content */}
                <div className="aspect-[9/14] max-h-[320px] bg-gradient-to-br from-purple-900/30 via-[#0F1118] to-gold-900/20 rounded-2xl flex items-center justify-center mb-4 border border-white/5 overflow-hidden relative">
                  <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-5" />
                  <div className="relative text-center p-6 z-10">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-gold-500 flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-white font-semibold text-lg mb-2">Ravi de t'avoir rencontré !</p>
                    <p className="text-[#9CA3AF] text-sm mb-4">Voici ma présentation complète et mes derniers projets.</p>
                    <div className="flex items-center justify-center gap-2 text-purple-400 text-sm">
                      <Eye className="w-4 h-4" />
                      <span>47 vues</span>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full btn-premium gap-2">
                  <Calendar className="w-4 h-4" />
                  Réserver un appel
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          NOTIFICATIONS PUSH & ANALYTICS
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 px-4">
        <div className="max-w-[1100px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Notification mockups */}
            <motion.div
              className="order-2 lg:order-1 space-y-4"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              {pushFeatures.map((item, i) => (
                <motion.div
                  key={i}
                  className="bg-[#0F1118] rounded-2xl p-5 border border-white/10 hover:border-gold-500/20 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-gold-500/20 to-purple-500/10 flex items-center justify-center flex-shrink-0 border border-white/5`}>
                      <item.icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium mb-1">{item.title}</p>
                      <p className="text-[#8B8D98] text-sm">{item.description}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <Bell className="w-4 h-4 text-[#8B8D98]" />
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {/* Suggested message */}
              <motion.div
                className="bg-gradient-to-r from-gold-500/10 to-purple-500/10 rounded-2xl p-5 border border-gold-500/20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-gold-400" />
                  <span className="text-gold-400 font-medium text-sm">Suggestion IA</span>
                </div>
                <p className="text-white text-sm mb-3">
                  "Salut Marie ! J'ai vu que tu as consulté mon profil. On se prévoit un café la semaine prochaine ?"
                </p>
                <div className="flex gap-2">
                  <Button size="sm" className="btn-premium text-xs py-2 px-4">
                    <Send className="w-3 h-3 mr-1" />
                    WhatsApp
                  </Button>
                  <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/5 text-xs py-2 px-4 rounded-full">
                    Email
                  </Button>
                  <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/5 text-xs py-2 px-4 rounded-full">
                    LinkedIn
                  </Button>
                </div>
              </motion.div>
            </motion.div>
            
            {/* Right: Content */}
            <motion.div
              className="order-1 lg:order-2"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-sm font-medium mb-6">
                <Bell className="w-4 h-4" />
                Notifications intelligentes
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                Tu sais qui te regarde,
                <span className="block text-gold-400">et quand.</span>
              </h2>
              <p className="text-[#9CA3AF] text-lg mb-8 leading-relaxed">
                i-wasp te notifie dès qu'un contact revient sur ta carte, ouvre un document ou clique sur un lien important.
              </p>
              
              <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-500/10 to-transparent border border-purple-500/20 mb-6">
                <p className="text-purple-400 font-medium mb-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Pour tes contacts (s'ils acceptent)
                </p>
                <p className="text-[#9CA3AF] text-sm">
                  Notifications ciblées : nouvelle ressource, rappel de RDV, offre spéciale via web push, email ou WhatsApp.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {["WhatsApp", "Email", "LinkedIn", "Web Push"].map((channel, i) => (
                  <span key={i} className="px-4 py-2 rounded-full bg-[#0F1118] border border-white/10 text-sm text-[#9CA3AF]">
                    {channel}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          GAMIFICATION & MISSIONS
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 px-4 bg-gradient-to-b from-[#0F1118]/50 to-transparent">
        <div className="max-w-[1100px] mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-sm font-medium mb-6">
              <Trophy className="w-4 h-4" />
              Gamification
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Le networking devient un jeu
              <span className="block text-gold-400">(mais rentable)</span>
            </h2>
            <p className="text-[#9CA3AF] text-lg max-w-2xl mx-auto">
              i-wasp transforme ta discipline de suivi en missions simples avec points, badges et objectifs hebdomadaires.
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Points & Badges */}
            <motion.div
              className="card-offer p-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {/* Points system */}
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Star className="w-5 h-5 text-gold-400" />
                Système de points
              </h3>
              <div className="space-y-3 mb-8">
                {gamificationPoints.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-[#07080D]/50 border border-white/5">
                    <span className="text-[#9CA3AF]">{item.action}</span>
                    <span className="text-gold-400 font-medium">{item.points}</span>
                  </div>
                ))}
              </div>
              
              {/* Badges */}
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Award className="w-5 h-5 text-gold-400" />
                Badges à débloquer
              </h3>
              <div className="space-y-4">
                {gamificationBadges.map((badge, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-[#07080D]/50 border border-white/5 hover:border-gold-500/20 transition-all">
                    <div className={`w-12 h-12 rounded-xl ${badge.color} flex items-center justify-center shadow-lg`}>
                      <badge.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <span className="text-white font-medium block">{badge.name}</span>
                      <span className="text-[#8B8D98] text-sm">{badge.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            {/* Missions & Dashboard */}
            <motion.div
              className="card-offer p-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Rocket className="w-5 h-5 text-purple-400" />
                Missions hebdomadaires
              </h3>
              
              <div className="space-y-3 mb-8">
                {missions.map((mission, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[#07080D]/50 border border-white/5">
                    <div className="w-6 h-6 rounded-full border-2 border-purple-500/50 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-purple-500/50" />
                    </div>
                    <span className="text-[#9CA3AF] text-sm">{mission}</span>
                    <span className="ml-auto text-purple-400 text-xs font-medium">+5 pts</span>
                  </div>
                ))}
              </div>
              
              <h4 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-gold-400" />
                Tableau de bord
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Contacts", value: "147", icon: Users, trend: "+12" },
                  { label: "Taux réponse", value: "68%", icon: MessageSquare, trend: "+5%" },
                  { label: "Relances auto", value: "23", icon: RefreshCw, trend: "cette semaine" },
                  { label: "Score réseau", value: "A+", icon: TrendingUp, trend: "Excellent" }
                ].map((stat, i) => (
                  <div key={i} className="p-4 rounded-xl bg-[#07080D]/50 border border-white/5 text-center">
                    <stat.icon className="w-5 h-5 text-gold-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white mb-0.5">{stat.value}</p>
                    <p className="text-[#8B8D98] text-xs">{stat.label}</p>
                    <p className="text-green-400 text-xs mt-1">{stat.trend}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          POUR QUI ?
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 px-4">
        <div className="max-w-[1100px] mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Pensé pour ceux dont le réseau
              <span className="block text-gold-400">est le business</span>
            </h2>
            <p className="text-[#9CA3AF] text-lg max-w-2xl mx-auto">
              Si ton chiffre dépend de la qualité de ton réseau et de ton suivi, i-wasp devient ton meilleur assistant.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {targetAudiences.map((audience, i) => (
              <motion.div
                key={i}
                className="card-offer p-8 text-center group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold-500/20 to-purple-500/10 flex items-center justify-center mx-auto mb-6 border border-white/10 group-hover:border-gold-500/30 transition-all">
                  <audience.icon className="w-10 h-10 text-gold-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{audience.title}</h3>
                <p className="text-[#9CA3AF]">{audience.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          COMPARAISON : CARTE CLASSIQUE VS I-WASP
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 px-4 bg-gradient-to-b from-[#0F1118]/50 to-transparent">
        <div className="max-w-[1100px] mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Bien plus qu'une
              <span className="block text-gold-400">carte NFC</span>
            </h2>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Classic Card */}
            <motion.div
              className="p-8 rounded-3xl bg-[#0F1118]/80 border border-white/10"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#1a1b20] flex items-center justify-center">
                  <X className="w-6 h-6 text-[#8B8D98]" />
                </div>
                <h3 className="text-xl font-semibold text-[#8B8D98]">Cartes classiques</h3>
              </div>
              <div className="space-y-4">
                {comparisonClassic.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-[#07080D]/50 border border-white/5">
                    <X className="w-5 h-5 text-red-400/60 flex-shrink-0" />
                    <span className="text-[#8B8D98]">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            
            {/* i-wasp Concierge */}
            <motion.div
              className="p-8 rounded-3xl bg-gradient-to-br from-gold-500/10 to-purple-500/10 border border-gold-500/30"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-[#07080D]" />
                </div>
                <h3 className="text-xl font-semibold text-white">Conciergerie i-wasp</h3>
              </div>
              <div className="space-y-4">
                {comparisonIwasp.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-[#07080D]/50 border border-gold-500/20">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-white">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FAQ
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 px-4">
        <div className="max-w-[800px] mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Questions fréquentes
            </h2>
          </motion.div>
          
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  openFaq === i 
                    ? 'bg-[#0F1118] border-gold-500/30' 
                    : 'bg-[#0F1118]/50 border-white/10 hover:border-white/20'
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <button
                  className="w-full p-6 flex items-center justify-between text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="text-white font-medium pr-4">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-gold-400 flex-shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6">
                    <p className="text-[#9CA3AF] leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 px-4">
        <div className="max-w-[900px] mx-auto text-center">
          <motion.div 
            className="relative p-10 md:p-16 rounded-3xl overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Background gradients */}
            <div className="absolute inset-0 bg-gradient-to-br from-gold-500/10 via-[#0F1118] to-purple-500/10" />
            <div className="absolute inset-0 border border-gold-500/20 rounded-3xl" />
            <div className="absolute top-0 left-1/4 w-[300px] h-[200px] bg-gold-500/10 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 right-1/4 w-[200px] h-[150px] bg-purple-500/10 rounded-full blur-[60px]" />
            
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-500 to-purple-500 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Prêt à transformer ton networking ?
              </h2>
              <p className="text-[#9CA3AF] mb-10 max-w-xl mx-auto text-lg">
                Rejoins des milliers de professionnels qui ne laissent plus mourir leurs contacts.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/order/type">
                  <Button size="lg" className="btn-premium px-10 text-lg min-h-[56px]">
                    Créer mon profil i-wasp
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button variant="outline" size="lg" className="border-purple-500/40 text-purple-400 hover:bg-purple-500/10 rounded-full min-h-[56px]">
                    Voir les tarifs
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
