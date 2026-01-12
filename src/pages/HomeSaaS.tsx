import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Wifi, 
  RefreshCw, 
  BarChart3, 
  Smartphone, 
  CheckCircle2, 
  ArrowRight, 
  Star,
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
  X
} from "lucide-react";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Section: Ce que fait i-wasp pour toi
const coreFeatures = [
  {
    icon: Sparkles,
    title: "Crée ta carte vivante",
    description: "Profil riche avec vidéo, PDF, liens et tous tes réseaux sociaux. Plus qu'une carte de visite.",
    highlights: ["Vidéo de présentation", "Documents PDF", "Liens illimités"]
  },
  {
    icon: RefreshCw,
    title: "Automatise tes relances",
    description: "L'IA propose des messages personnalisés et assure un suivi intelligent de chaque contact.",
    highlights: ["Suggestions IA", "Messages en 1 tap", "Suivi automatique"]
  },
  {
    icon: Target,
    title: "Garde le contrôle",
    description: "Notes, tags et timeline complète pour chaque contact. Ne perds plus jamais un lead.",
    highlights: ["Notes & tags", "Timeline contact", "Historique complet"]
  }
];

// Section: Pour qui ?
const targetAudiences = [
  {
    icon: Briefcase,
    title: "Freelances & Indépendants",
    description: "Impressionnez vos prospects et suivez vos leads sans effort."
  },
  {
    icon: Building2,
    title: "Équipes Commerciales",
    description: "Immobilier, banque, assurance, B2B — équipez toute l'équipe."
  },
  {
    icon: Hotel,
    title: "Hôtellerie & Événementiel",
    description: "Conciergerie, accueil VIP, salons — l'expérience premium."
  }
];

// Section: Comparaison
const comparisonFeatures = [
  { feature: "Partage de coordonnées", classic: true, iwasp: true },
  { feature: "Profil digital personnalisé", classic: true, iwasp: true },
  { feature: "Stories 24h après rencontre", classic: false, iwasp: true },
  { feature: "IA de relance intelligente", classic: false, iwasp: true },
  { feature: "Notifications push ciblées", classic: false, iwasp: true },
  { feature: "Analytics & insights", classic: false, iwasp: true },
  { feature: "Intros automatiques", classic: false, iwasp: true },
  { feature: "Multi-profils (perso/pro/events)", classic: false, iwasp: true }
];

// Section: Gamification badges
const badges = [
  { icon: Trophy, name: "Networker du mois", color: "text-gold-500" },
  { icon: Users, name: "100 contacts suivis", color: "text-blue-400" },
  { icon: CheckCircle2, name: "0 contact oublié", color: "text-green-400" }
];

const stats = [
  { value: "10K+", label: "Cartes actives" },
  { value: "500K+", label: "Scans mensuels" },
  { value: "98%", label: "Satisfaction" },
  { value: "24/7", label: "Support" }
];

export default function HomeSaaS() {
  return (
    <div className="min-h-screen bg-iwasp-bg">
      {/* ═══════════════════════════════════════════════════════════════════════
          HERO SECTION - Le concierge digital de ton réseau
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 px-4 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-gold-500/5 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold-500/10 rounded-full blur-[120px]" />
        
        <div className="relative max-w-premium mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-iwasp-card border border-gold-500/20 mb-8">
              <Zap className="w-4 h-4 text-gold-500" />
              <span className="text-sm font-medium text-gold-500">Plus qu'une carte NFC</span>
            </div>
            
            {/* Headline */}
            <h1 className="text-display text-white mb-6 max-w-4xl mx-auto">
              Le concierge digital de ton réseau.
              <span className="block text-gold-500">Pas une simple carte NFC.</span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-iwasp-gray max-w-3xl mx-auto mb-10 leading-relaxed">
              Stories 24h, relances intelligentes, notifications push et analytiques 
              pour ne plus jamais laisser mourir un contact.
            </p>
            
            {/* Visual flow: Tap → Story → Notif → RDV */}
            <div className="flex items-center justify-center gap-2 md:gap-4 mb-10 flex-wrap">
              {[
                { icon: Wifi, label: "Tap NFC" },
                { icon: Clock, label: "Story 24h" },
                { icon: Bell, label: "Notification" },
                { icon: Calendar, label: "RDV confirmé" }
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-2 md:gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-iwasp-card border border-gold-500/20 flex items-center justify-center">
                      <step.icon className="w-5 h-5 md:w-6 md:h-6 text-gold-500" />
                    </div>
                    <span className="text-xs md:text-sm text-iwasp-gray">{step.label}</span>
                  </div>
                  {i < 3 && <ChevronRight className="w-4 h-4 text-gold-500/50 mt-[-20px]" />}
                </div>
              ))}
            </div>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <Link to="/order/type">
                <Button size="lg" className="btn-premium text-lg px-8 py-6 gap-2">
                  Créer mon profil
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/demo">
                <Button variant="outline" size="lg" className="border-gold-500/30 text-gold-400 hover:bg-gold-500/10 px-8 py-6 text-lg gap-2">
                  <Play className="w-5 h-5" />
                  Voir la démo en 2 min
                </Button>
              </Link>
            </div>
            
            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-iwasp-gray text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Compatible iPhone & Android</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Setup en 5 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Satisfait ou remboursé</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          STATS BAR
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-12 px-4 border-y border-white/5">
        <div className="max-w-5xl mx-auto">
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
                <p className="text-3xl md:text-4xl font-bold text-gold-500 mb-1">{stat.value}</p>
                <p className="text-iwasp-gray text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          CE QUE FAIT i-wasp POUR TOI
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="section-spacing px-4">
        <div className="max-w-premium mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-heading text-white mb-4">
              Ce que fait i-wasp pour toi
            </h2>
            <p className="text-iwasp-gray text-lg max-w-2xl mx-auto">
              Bien plus qu'une carte de visite digitale — ton assistant personnel pour le networking.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {coreFeatures.map((feature, i) => (
              <motion.div
                key={i}
                className="card-offer p-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <div className="w-14 h-14 rounded-2xl bg-gold-500/10 flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-gold-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-iwasp-gray mb-6">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.highlights.map((highlight, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-iwasp-gray">
                      <CheckCircle2 className="w-4 h-4 text-gold-500 flex-shrink-0" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          STORIES & CONTENU 24H
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="section-spacing px-4 bg-iwasp-card/30">
        <div className="max-w-premium mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-500 text-sm font-medium mb-6">
                <Clock className="w-4 h-4" />
                Stories 24h
              </div>
              <h2 className="text-heading text-white mb-6">
                Après chaque rencontre, une story qui convertit
              </h2>
              <p className="text-iwasp-gray text-lg mb-8">
                Chaque scan génère automatiquement une story personnalisée visible 24h avec un call-to-action 
                (prendre RDV, télécharger un doc, offre limitée). Le contact reste engagé, tu restes mémorable.
              </p>
              
              <div className="space-y-4">
                {[
                  { icon: Eye, text: "Qui a vu ta story" },
                  { icon: Target, text: "Combien de clics sur ton CTA" },
                  { icon: Calendar, text: "Combien de RDV pris depuis la story" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-gold-500" />
                    </div>
                    <span className="text-white">{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              {/* Story mockup */}
              <div className="bg-iwasp-card rounded-3xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center">
                    <span className="text-white font-bold">JD</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Jean Dupont</p>
                    <p className="text-iwasp-gray text-sm">il y a 2h • Expire dans 22h</p>
                  </div>
                </div>
                <div className="aspect-[9/16] max-h-[300px] bg-gradient-to-br from-gold-500/20 to-iwasp-bg rounded-2xl flex items-center justify-center mb-4">
                  <div className="text-center p-6">
                    <Sparkles className="w-12 h-12 text-gold-500 mx-auto mb-4" />
                    <p className="text-white font-medium mb-2">Ravi de t'avoir rencontré !</p>
                    <p className="text-iwasp-gray text-sm">Voici ma présentation complète</p>
                  </div>
                </div>
                <Button className="w-full btn-premium">
                  Prendre rendez-vous
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          RELANCES & NOTIFICATIONS PUSH
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="section-spacing px-4">
        <div className="max-w-premium mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              className="order-2 lg:order-1"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              {/* Notification mockups */}
              <div className="space-y-4">
                <div className="bg-iwasp-card rounded-2xl p-4 border border-gold-500/20">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                      <Eye className="w-5 h-5 text-gold-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium mb-1">Marie vient de revisiter ta carte</p>
                      <p className="text-iwasp-gray text-sm">Elle a cliqué sur ton LinkedIn. Moment idéal pour relancer !</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-iwasp-card rounded-2xl p-4 border border-white/10">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium mb-1">Pierre a ouvert ton PDF</p>
                      <p className="text-iwasp-gray text-sm">Il a passé 3 minutes sur ta présentation.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-iwasp-card rounded-2xl p-4 border border-white/10">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                      <Bell className="w-5 h-5 text-orange-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium mb-1">3 contacts inactifs depuis 14 jours</p>
                      <p className="text-iwasp-gray text-sm">L'IA te suggère des messages de relance personnalisés.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              className="order-1 lg:order-2"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-500 text-sm font-medium mb-6">
                <Bell className="w-4 h-4" />
                Relances intelligentes
              </div>
              <h2 className="text-heading text-white mb-6">
                Ne laisse plus un contact refroidir
              </h2>
              <p className="text-iwasp-gray text-lg mb-8">
                Reçois une notification quand un contact revisite ta carte, ouvre un document ou clique sur un lien. 
                L'IA te propose 2-3 messages de relance à envoyer en un tap.
              </p>
              
              <div className="p-4 rounded-xl bg-gold-500/10 border border-gold-500/20 mb-6">
                <p className="text-gold-400 font-medium mb-2">Pour tes contacts (s'ils acceptent)</p>
                <p className="text-iwasp-gray text-sm">
                  Notifications ciblées : nouvelle ressource, rappel de RDV, offre spéciale via web push, email ou WhatsApp.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {["WhatsApp", "Email", "LinkedIn"].map((channel, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-full bg-iwasp-card border border-white/10 text-sm text-iwasp-gray">
                    {channel}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          GAMIFICATION & STATISTIQUES
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="section-spacing px-4 bg-iwasp-card/30">
        <div className="max-w-premium mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-500 text-sm font-medium mb-6">
              <Trophy className="w-4 h-4" />
              Gamification
            </div>
            <h2 className="text-heading text-white mb-4">
              Transforme ton networking en jeu
            </h2>
            <p className="text-iwasp-gray text-lg max-w-2xl mx-auto">
              Gagne des badges, complète des missions et surveille la santé de ton réseau.
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
              <h3 className="text-xl font-semibold text-white mb-6">Badges à débloquer</h3>
              <div className="space-y-4">
                {badges.map((badge, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-iwasp-bg/50 border border-white/5">
                    <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center">
                      <badge.icon className={`w-6 h-6 ${badge.color}`} />
                    </div>
                    <span className="text-white font-medium">{badge.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            
            {/* Dashboard preview */}
            <motion.div
              className="card-offer p-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-xl font-semibold text-white mb-6">Tableau de bord</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Contacts", value: "147", icon: Users },
                  { label: "Taux de réponse", value: "68%", icon: MessageSquare },
                  { label: "Relances auto", value: "23", icon: RefreshCw },
                  { label: "Score réseau", value: "A+", icon: BarChart3 }
                ].map((stat, i) => (
                  <div key={i} className="p-4 rounded-xl bg-iwasp-bg/50 border border-white/5 text-center">
                    <stat.icon className="w-5 h-5 text-gold-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                    <p className="text-iwasp-gray text-xs">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          POUR QUI ?
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="section-spacing px-4">
        <div className="max-w-premium mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-heading text-white mb-4">
              Pour qui ?
            </h2>
            <p className="text-iwasp-gray text-lg max-w-2xl mx-auto">
              i-wasp s'adapte à tous les professionnels qui veulent maximiser leur réseau.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {targetAudiences.map((audience, i) => (
              <motion.div
                key={i}
                className="card-offer p-8 text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-16 h-16 rounded-2xl bg-gold-500/10 flex items-center justify-center mx-auto mb-6">
                  <audience.icon className="w-8 h-8 text-gold-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{audience.title}</h3>
                <p className="text-iwasp-gray">{audience.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          COMPARAISON : Carte NFC classique vs i-wasp
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="section-spacing px-4 bg-iwasp-card/30">
        <div className="max-w-premium mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-heading text-white mb-4">
              Pourquoi c'est différent d'une simple carte NFC ?
            </h2>
          </motion.div>
          
          <motion.div
            className="bg-iwasp-card rounded-3xl border border-white/10 overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Header */}
            <div className="grid grid-cols-3 gap-4 p-6 border-b border-white/10 bg-iwasp-bg/50">
              <div className="text-iwasp-gray font-medium">Fonctionnalité</div>
              <div className="text-center text-iwasp-gray font-medium">Carte NFC classique</div>
              <div className="text-center">
                <span className="text-gold-500 font-semibold">i-wasp Concierge</span>
              </div>
            </div>
            
            {/* Rows */}
            {comparisonFeatures.map((row, i) => (
              <div 
                key={i} 
                className={`grid grid-cols-3 gap-4 p-4 items-center ${i % 2 === 0 ? 'bg-iwasp-bg/30' : ''}`}
              >
                <div className="text-white text-sm md:text-base">{row.feature}</div>
                <div className="flex justify-center">
                  {row.classic ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <X className="w-5 h-5 text-iwasp-gray/50" />
                  )}
                </div>
                <div className="flex justify-center">
                  <Check className="w-5 h-5 text-gold-500" />
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="section-spacing px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div 
            className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-gold-500/10 to-iwasp-card border border-gold-500/20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Sparkles className="w-12 h-12 text-gold-500 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Prêt à transformer ton networking ?
            </h2>
            <p className="text-iwasp-gray mb-8 max-w-xl mx-auto text-lg">
              Rejoins des milliers de professionnels qui ne laissent plus mourir leurs contacts.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/order/type">
                <Button size="lg" className="btn-premium px-8 text-lg">
                  Créer mon profil i-wasp
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline" size="lg" className="border-gold-500/30 text-gold-400 hover:bg-gold-500/10">
                  Voir les tarifs
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
