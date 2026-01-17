/**
 * SaaS Dashboard - Tableau de bord utilisateur
 * Affichage du plan actuel, crédits restants et accès aux fonctionnalités premium
 * Style: Haute Couture Digitale - Noir & Or
 */

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  CreditCard, 
  Globe, 
  Zap, 
  Star, 
  Crown, 
  Settings, 
  LogOut,
  ChevronRight,
  Sparkles,
  Check,
  Lock,
  ExternalLink,
  Bell,
  Users,
  BarChart3,
  Palette,
  MessageSquare,
  Shield,
  Loader2,
  ArrowUpRight,
  Package,
  Calendar,
  Infinity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { useSaaSSubscription } from "@/hooks/useSaaSSubscription";
import { useCards } from "@/hooks/useCards";
import { useLeads } from "@/hooks/useLeads";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SAAS_PLANS, SaaSPlanId, formatSaaSPrice } from "@/lib/saasPlans";
import { IWASPCreditsDisplay } from "@/components/IWASPCreditsDisplay";

const COLORS = {
  noir: "#050505",
  noirSoft: "#0A0A0A",
  noirCard: "#111111",
  or: "#D4A853",
  orLight: "#E8C87A",
  ivoire: "#F5F5F5",
  gris: "#6B6B6B",
  border: "#1A1A1A",
};

const planIcons = {
  free: Zap,
  pro: Star,
  business: Crown,
};

const planColors = {
  free: COLORS.gris,
  pro: COLORS.or,
  business: COLORS.orLight,
};

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const stagger = {
  visible: {
    transition: { staggerChildren: 0.1 }
  }
};

// Feature cards data
const FEATURE_CARDS = [
  {
    id: 'nfc-cards',
    title: 'Cartes NFC',
    description: 'Créez et gérez vos cartes NFC professionnelles',
    icon: CreditCard,
    href: '/dashboard',
    plans: ['pro', 'business'],
    color: COLORS.or,
  },
  {
    id: 'web-studio',
    title: 'Web Studio IA',
    description: 'Générez des sites web avec l\'IA i-wasp',
    icon: Globe,
    href: '/web-studio/offres',
    plans: ['pro', 'business'],
    color: '#3B82F6',
  },
  {
    id: 'analytics',
    title: 'Analytics IA',
    description: 'Statistiques détaillées de vos cartes',
    icon: BarChart3,
    href: '/dashboard',
    plans: ['pro', 'business'],
    color: '#10B981',
  },
  {
    id: 'leads',
    title: 'Capture de Leads',
    description: 'Collectez et gérez vos contacts',
    icon: Users,
    href: '/dashboard',
    plans: ['pro', 'business'],
    color: '#8B5CF6',
  },
  {
    id: 'notifications',
    title: 'Notifications Push',
    description: 'Envoyez des notifications à vos contacts',
    icon: Bell,
    href: '/dashboard',
    plans: ['pro', 'business'],
    color: '#F59E0B',
  },
  {
    id: 'branding',
    title: 'White-label',
    description: 'Supprimez le branding IWASP',
    icon: Palette,
    href: '/dashboard',
    plans: ['business'],
    color: '#EC4899',
  },
  {
    id: 'api',
    title: 'API Complète',
    description: 'Intégrez IWASP à vos outils',
    icon: Package,
    href: '/web-studio/offres',
    plans: ['business'],
    color: '#14B8A6',
  },
  {
    id: 'support',
    title: 'Support Prioritaire',
    description: 'Assistance dédiée',
    icon: MessageSquare,
    href: '/contact',
    plans: ['business'],
    color: '#6366F1',
  },
];

export default function SaaSDashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { subscription, isLoading: subLoading, refresh, planDetails } = useSaaSSubscription();
  const { data: cards = [] } = useCards();
  const { data: leads = [] } = useLeads();
  const [isManaging, setIsManaging] = useState(false);

  const currentPlan = (subscription?.plan || 'free') as SaaSPlanId;
  const planConfig = SAAS_PLANS[currentPlan.toUpperCase() as keyof typeof SAAS_PLANS];
  const PlanIcon = planIcons[currentPlan as keyof typeof planIcons] || Zap;
  
  // Get features based on plan
  const features = subscription?.features || {
    vcard: true,
    qrCode: true,
    nfc: true,
    sitePersonnalise: false,
    collections: false,
    stories: false,
    pushNotifications: false,
    analyticsIA: false,
    whiteLabel: false,
    api: false,
  };

  // Subscription status info
  const isPremium = currentPlan === 'pro' || currentPlan === 'business';

  // NFC cards usage
  const nfcCardsUsed = cards.length;
  const nfcCardsMax = isPremium ? 10 : 1; // Pro/Business: 10 cards, Free: 1 card
  const nfcProgress = nfcCardsMax > 0 ? (nfcCardsUsed / nfcCardsMax) * 100 : 0;

  const userName = user?.user_metadata?.first_name || user?.email?.split("@")[0] || "Utilisateur";

  // Check if feature is available for current plan
  const hasFeature = (featurePlans: string[]) => {
    return featurePlans.includes(currentPlan);
  };

  // Handle manage subscription
  const handleManageSubscription = async () => {
    setIsManaging(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) throw error;
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No portal URL received');
      }
    } catch (err) {
      console.error('Portal error:', err);
      toast.error('Impossible d\'ouvrir le portail de gestion');
    } finally {
      setIsManaging(false);
    }
  };

  if (subLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.noir }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: COLORS.or }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.noir, color: COLORS.ivoire }}>
      {/* Navigation */}
      <nav 
        className="fixed top-0 left-0 right-0 z-50 px-6 py-6"
        style={{ backgroundColor: `${COLORS.noir}90`, backdropFilter: 'blur(20px)' }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="font-serif text-xl tracking-wide">
            i-wasp
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/settings">
              <button className="transition-colors" style={{ color: COLORS.gris }}>
                <Settings size={18} />
              </button>
            </Link>
            <button 
              onClick={() => signOut()}
              className="flex items-center gap-2 text-sm"
              style={{ color: COLORS.gris }}
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-28 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="mb-12"
          >
            <motion.p 
              variants={fadeUp}
              className="text-xs tracking-[0.3em] uppercase mb-4"
              style={{ color: COLORS.gris }}
            >
              Tableau de bord
            </motion.p>
            <motion.h1 
              variants={fadeUp}
              className="font-serif text-3xl sm:text-5xl font-light tracking-tight mb-4"
            >
              Bienvenue, {userName}
            </motion.h1>
            <motion.p 
              variants={fadeUp}
              className="text-lg"
              style={{ color: COLORS.gris }}
            >
              Gérez votre abonnement et accédez à toutes vos fonctionnalités.
            </motion.p>
          </motion.div>

          {/* Plan Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl overflow-hidden mb-8"
            style={{ 
              backgroundColor: COLORS.noirCard,
              border: `1px solid ${currentPlan !== 'free' ? COLORS.or : COLORS.border}40`,
            }}
          >
            <div className="p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                {/* Plan Info */}
                <div className="flex items-center gap-5">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ 
                      background: `linear-gradient(135deg, ${planColors[currentPlan]}20 0%, ${planColors[currentPlan]}10 100%)`,
                      border: `1px solid ${planColors[currentPlan]}40`,
                    }}
                  >
                    <PlanIcon size={28} style={{ color: planColors[currentPlan] }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-2xl font-medium tracking-tight">
                        Plan {planConfig?.name || 'Free'}
                      </h2>
                      {currentPlan !== 'free' && subscription?.subscribed && (
                        <Badge 
                          className="text-xs"
                          style={{ 
                            backgroundColor: `${COLORS.or}20`,
                            color: COLORS.or,
                            border: `1px solid ${COLORS.or}40`,
                          }}
                        >
                          Actif
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm" style={{ color: COLORS.gris }}>
                      {'tagline' in planConfig ? planConfig.tagline : 'Plan gratuit de base'}
                    </p>
                    {subscription?.subscription_end && (
                      <p className="text-xs mt-2" style={{ color: COLORS.gris }}>
                        <Calendar size={12} className="inline mr-1" />
                        Renouvellement le {format(new Date(subscription.subscription_end), 'dd MMMM yyyy', { locale: fr })}
                      </p>
                    )}
                  </div>
                </div>

                {/* Price & Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {currentPlan !== 'free' && (
                    <div className="text-right">
                      <p className="text-3xl font-light" style={{ color: COLORS.or }}>
                        {formatSaaSPrice(planConfig?.priceEur || 0)}
                      </p>
                      <p className="text-xs" style={{ color: COLORS.gris }}>/mois</p>
                    </div>
                  )}
                  
                  <div className="flex gap-3">
                    {currentPlan === 'free' ? (
                      <Button
                        onClick={() => navigate('/saas-pricing')}
                        className="px-6 py-3"
                        style={{ 
                          background: `linear-gradient(135deg, ${COLORS.or} 0%, ${COLORS.orLight} 100%)`,
                          color: COLORS.noir,
                        }}
                      >
                        <Sparkles size={16} className="mr-2" />
                        Passer à un plan payant
                      </Button>
                    ) : (
                      <>
                        <Button
                          onClick={handleManageSubscription}
                          disabled={isManaging}
                          variant="outline"
                          className="px-6 py-3"
                          style={{ 
                            borderColor: COLORS.border,
                            color: COLORS.ivoire,
                          }}
                        >
                          {isManaging ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <Settings size={16} className="mr-2" />
                              Gérer
                            </>
                          )}
                        </Button>
                        {currentPlan !== 'business' && (
                          <Button
                            onClick={() => navigate('/saas-pricing')}
                            className="px-6 py-3"
                            style={{ 
                              background: `linear-gradient(135deg, ${COLORS.or} 0%, ${COLORS.orLight} 100%)`,
                              color: COLORS.noir,
                            }}
                          >
                            <ArrowUpRight size={16} className="mr-2" />
                            Upgrade
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Usage Stats Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* NFC Cards Usage */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 rounded-2xl"
              style={{ 
                backgroundColor: COLORS.noirSoft,
                border: `1px solid ${COLORS.border}`,
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${COLORS.or}20` }}
                >
                  <CreditCard size={20} style={{ color: COLORS.or }} />
                </div>
                <div>
                  <h3 className="text-sm font-medium" style={{ color: COLORS.ivoire }}>
                    Cartes NFC
                  </h3>
                  <p className="text-xs" style={{ color: COLORS.gris }}>
                    Ce mois
                  </p>
                </div>
              </div>

              <div className="flex items-baseline gap-2 mb-4">
                <span 
                  className="text-4xl font-light tracking-tight"
                  style={{ color: COLORS.or }}
                >
                  {nfcCardsUsed}
                </span>
                <span style={{ color: COLORS.gris }}>
                  / {nfcCardsMax > 0 ? nfcCardsMax : '∞'}
                </span>
              </div>

              {nfcCardsMax > 0 && (
                <div 
                  className="w-full h-2 rounded-full overflow-hidden"
                  style={{ backgroundColor: `${COLORS.gris}30` }}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(nfcProgress, 100)}%`,
                      background: nfcProgress > 80 
                        ? '#ef4444' 
                        : `linear-gradient(90deg, ${COLORS.or} 0%, ${COLORS.orLight} 100%)`,
                    }}
                  />
                </div>
              )}

              <p className="text-sm mt-4" style={{ color: COLORS.gris }}>
                {!isPremium 
                  ? "Passez à un plan payant pour plus de cartes"
                  : nfcProgress > 80 
                    ? "Limite bientôt atteinte"
                    : "Créez des cartes NFC professionnelles"
                }
              </p>
            </motion.div>

            {/* Leads Count */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-6 rounded-2xl"
              style={{ 
                backgroundColor: COLORS.noirSoft,
                border: `1px solid ${COLORS.border}`,
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: '#8B5CF620' }}
                >
                  <Users size={20} style={{ color: '#8B5CF6' }} />
                </div>
                <div>
                  <h3 className="text-sm font-medium" style={{ color: COLORS.ivoire }}>
                    Leads Capturés
                  </h3>
                  <p className="text-xs" style={{ color: COLORS.gris }}>
                    Total
                  </p>
                </div>
              </div>

              <div className="flex items-baseline gap-2 mb-4">
                <span 
                  className="text-4xl font-light tracking-tight"
                  style={{ color: '#8B5CF6' }}
                >
                  {leads.length}
                </span>
                <span style={{ color: COLORS.gris }}>contacts</span>
              </div>

              <p className="text-sm" style={{ color: COLORS.gris }}>
                {hasFeature(['professional', 'enterprise']) 
                  ? "Exportez vos leads en CSV"
                  : "Passez à Professional pour capturer des leads"
                }
              </p>
            </motion.div>
          </div>

          {/* Features Grid */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.h2 
              variants={fadeUp}
              className="text-xl font-medium mb-6"
              style={{ color: COLORS.ivoire }}
            >
              Vos fonctionnalités
            </motion.h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {FEATURE_CARDS.map((feature, index) => {
                const isAvailable = hasFeature(feature.plans);
                const FeatureIcon = feature.icon;

                return (
                  <motion.div
                    key={feature.id}
                    variants={fadeUp}
                    custom={index}
                  >
                    {isAvailable ? (
                      <Link to={feature.href}>
                        <div 
                          className="group p-6 rounded-2xl h-full transition-all duration-300 hover:scale-[1.02]"
                          style={{ 
                            backgroundColor: COLORS.noirCard,
                            border: `1px solid ${COLORS.border}`,
                          }}
                        >
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                            style={{ backgroundColor: `${feature.color}20` }}
                          >
                            <FeatureIcon size={24} style={{ color: feature.color }} />
                          </div>
                          <h3 className="font-medium mb-1" style={{ color: COLORS.ivoire }}>
                            {feature.title}
                          </h3>
                          <p className="text-sm" style={{ color: COLORS.gris }}>
                            {feature.description}
                          </p>
                          <div className="mt-4 flex items-center gap-1 text-xs" style={{ color: feature.color }}>
                            Accéder
                            <ChevronRight size={14} />
                          </div>
                        </div>
                      </Link>
                    ) : (
                      <div 
                        className="p-6 rounded-2xl h-full opacity-60"
                        style={{ 
                          backgroundColor: COLORS.noirCard,
                          border: `1px solid ${COLORS.border}`,
                        }}
                      >
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 relative"
                          style={{ backgroundColor: `${COLORS.gris}20` }}
                        >
                          <FeatureIcon size={24} style={{ color: COLORS.gris }} />
                          <Lock 
                            size={14} 
                            className="absolute -bottom-1 -right-1 p-0.5 rounded-full"
                            style={{ 
                              backgroundColor: COLORS.noirCard,
                              color: COLORS.gris,
                            }}
                          />
                        </div>
                        <h3 className="font-medium mb-1" style={{ color: COLORS.gris }}>
                          {feature.title}
                        </h3>
                        <p className="text-sm" style={{ color: `${COLORS.gris}80` }}>
                          {feature.description}
                        </p>
                        <div className="mt-4">
                          <Badge 
                            variant="outline"
                            className="text-xs"
                            style={{ 
                              borderColor: `${COLORS.gris}40`,
                              color: COLORS.gris,
                            }}
                          >
                            {feature.plans[0] === 'enterprise' ? 'Enterprise' : 'Professional+'}
                          </Badge>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12 p-8 rounded-3xl"
            style={{ 
              background: `linear-gradient(135deg, ${COLORS.or}10 0%, ${COLORS.or}05 100%)`,
              border: `1px solid ${COLORS.or}20`,
            }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h3 className="text-xl font-medium mb-2" style={{ color: COLORS.ivoire }}>
                  Besoin d'aide ?
                </h3>
                <p className="text-sm" style={{ color: COLORS.gris }}>
                  Notre équipe est disponible pour vous accompagner.
                </p>
              </div>
              <div className="flex gap-4">
                <Link to="/help">
                  <Button
                    variant="outline"
                    className="px-6"
                    style={{ 
                      borderColor: COLORS.border,
                      color: COLORS.ivoire,
                    }}
                  >
                    Centre d'aide
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button
                    className="px-6"
                    style={{ 
                      background: `linear-gradient(135deg, ${COLORS.or} 0%, ${COLORS.orLight} 100%)`,
                      color: COLORS.noir,
                    }}
                  >
                    <MessageSquare size={16} className="mr-2" />
                    Nous contacter
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
