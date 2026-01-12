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
  Send
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
    title: "Crée ton profil",
    description: "Renseigne tes infos, ajoute vidéo, liens et réseaux. Ton identité digitale premium en 5 minutes."
  },
  {
    step: "02",
    icon: Wifi,
    title: "Partage en un tap",
    description: "Un simple tap NFC ou scan QR suffit. Ton profil s'ouvre instantanément sur le téléphone de ton contact."
  },
  {
    step: "03",
    icon: Target,
    title: "Pilote ton réseau",
    description: "Reçois des notifications, envoie des relances, analyse qui s'intéresse à toi. Ne laisse plus mourir un contact."
  }
];

const features24h = [
  { icon: Eye, text: "Voir qui a consulté ta story" },
  { icon: Target, text: "Suivre les clics sur ton CTA" },
  { icon: Calendar, text: "Compter les RDV générés" },
  { icon: FileText, text: "Partager docs & offres limitées" }
];

const pushFeatures = [
  {
    icon: Eye,
    title: "Contact revisite ta carte",
    description: "Marie vient de revisiter ton profil et a cliqué sur LinkedIn.",
    color: "text-gold-500"
  },
  {
    icon: FileText,
    title: "Document ouvert",
    description: "Pierre a passé 3 minutes sur ta présentation PDF.",
    color: "text-purple-400"
  },
  {
    icon: Bell,
    title: "Contact inactif détecté",
    description: "5 contacts n'ont pas eu d'interaction depuis 14 jours.",
    color: "text-orange-400"
  }
];

const gamificationBadges = [
  { icon: Trophy, name: "Networker du mois", description: "Top 10% des utilisateurs actifs", color: "bg-gradient-to-br from-gold-500 to-gold-600" },
  { icon: Users, name: "100 contacts suivis", description: "Réseau en pleine croissance", color: "bg-gradient-to-br from-purple-500 to-purple-600" },
  { icon: CheckCircle2, name: "0 contact oublié", description: "Aucun lead négligé sur 30 jours", color: "bg-gradient-to-br from-green-500 to-green-600" }
];

const missions = [
  "Ajouter une note à 5 contacts",
  "Planifier 3 RDV depuis i-wasp",
  "Relancer 10 contacts inactifs"
];

const targetAudiences = [
  {
    icon: Briefcase,
    title: "Freelances & Indépendants",
    description: "Impressionne tes prospects dès le premier contact et suis chaque lead sans effort."
  },
  {
    icon: Building2,
    title: "Équipes Commerciales",
    description: "Immobilier, banque, assurance, B2B — équipe toute ton équipe avec un outil qui convertit."
  },
  {
    icon: Hotel,
    title: "Hôtellerie & Événementiel",
    description: "Conciergerie, accueil VIP, salons — offre une expérience premium à chaque rencontre."
  }
];

const faqs = [
  {
    question: "Comment fonctionne la carte NFC i-wasp ?",
    answer: "Ta carte NFC i-wasp contient une puce programmée avec l'URL de ton profil. Quand quelqu'un approche son téléphone, ton profil s'ouvre instantanément — aucune app requise."
  },
  {
    question: "Qu'est-ce que les Stories 24h ?",
    answer: "Après chaque rencontre, une story éphémère est créée automatiquement pour ton contact. Tu peux y ajouter un message, une vidéo, un lien vers Calendly ou une offre limitée. Elle expire après 24h pour créer l'urgence."
  },
  {
    question: "Comment fonctionnent les relances intelligentes ?",
    answer: "Notre IA détecte quand un contact revisite ta carte, ouvre un document ou reste inactif trop longtemps. Elle te propose alors 2-3 messages de relance personnalisés à envoyer en un tap via WhatsApp, email ou LinkedIn."
  },
  {
    question: "C'est compatible avec tous les téléphones ?",
    answer: "Oui. Tous les iPhone depuis le 7 et la majorité des Android supportent le NFC. En cas de doute, un QR code de secours est toujours disponible."
  },
  {
    question: "Puis-je modifier mon profil après avoir reçu ma carte ?",
    answer: "Absolument. Ta carte pointe vers ton profil en ligne. Tu peux le modifier autant que tu veux — les changements sont instantanés, sans réimprimer."
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
              Le concierge digital
              <span className="block mt-2 bg-gradient-to-r from-gold-400 via-gold-500 to-purple-400 bg-clip-text text-transparent">
                de ton réseau.
              </span>
            </h1>
            
            <p className="text-lg text-[#8B8D98] italic mb-4">
              Pas une simple carte NFC.
            </p>
            
            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-[#9CA3AF] max-w-3xl mx-auto mb-10 leading-relaxed">
              Stories 24h, relances intelligentes, notifications push et analytiques 
              pour ne plus jamais laisser mourir un contact.
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
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
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
              Comment ça marche
            </h2>
            <p className="text-[#9CA3AF] text-lg max-w-2xl mx-auto">
              En 3 étapes simples, passe au networking du futur.
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
                Après chaque rencontre,
                <span className="block text-purple-400">une story qui convertit.</span>
              </h2>
              <p className="text-[#9CA3AF] text-lg mb-8 leading-relaxed">
                Chaque scan génère automatiquement une story personnalisée visible 24h avec un call-to-action 
                (prendre RDV, télécharger un doc, offre limitée). Le contact reste engagé, tu restes mémorable.
              </p>
              
              <div className="space-y-4">
                {features24h.map((item, i) => (
                  <motion.div 
                    key={i} 
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-gold-500/10 flex items-center justify-center border border-white/5">
                      <item.icon className="w-5 h-5 text-purple-400" />
                    </div>
                    <span className="text-white">{item.text}</span>
                  </motion.div>
                ))}
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
                  Prendre rendez-vous
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
                Ne laisse plus un 
                <span className="block text-gold-400">contact refroidir.</span>
              </h2>
              <p className="text-[#9CA3AF] text-lg mb-8 leading-relaxed">
                Reçois une notification quand un contact revisite ta carte, ouvre un document ou clique sur un lien. 
                L'IA te propose 2-3 messages de relance personnalisés à envoyer en un tap.
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
                {["WhatsApp", "Email", "LinkedIn", "SMS"].map((channel, i) => (
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
              Transforme ton networking
              <span className="block text-gold-400">en jeu.</span>
            </h2>
            <p className="text-[#9CA3AF] text-lg max-w-2xl mx-auto">
              Gagne des badges, complète des missions hebdomadaires et surveille la santé de ton réseau.
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Badges */}
            <motion.div
              className="card-offer p-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
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
              Pour qui ?
            </h2>
            <p className="text-[#9CA3AF] text-lg max-w-2xl mx-auto">
              i-wasp s'adapte à tous les professionnels qui veulent maximiser leur réseau.
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
          FAQ
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 px-4 bg-gradient-to-b from-[#0F1118]/50 to-transparent">
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
