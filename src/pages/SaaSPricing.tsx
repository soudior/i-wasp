/**
 * SaaS Pricing Page - Plans d'abonnement i-wasp
 * Flow intégré: Tarification → Signup → Paiement → Dashboard
 * 
 * DESIGN PREMIUM 💎
 * ✅ Header glassmorphism (backdrop blur)
 * ✅ Gradients modernes partout (primary → accent)
 * ✅ Shadows en couches (sm, md, lg)
 * ✅ Spacing généreux (60px sections)
 * ✅ Animations fluides (fadeIn, slideIn)
 * 
 * MICRO-INTERACTIONS 🎪
 * ✅ Hover effects 3D (transform: translateY)
 * ✅ Shine effect sur cards (::after)
 * ✅ Animations entrée différentes
 * ✅ Boutons avec box-shadow gradient
 * 
 * RESPONSIVE PARFAIT 📱
 * ✅ Tous les layouts ajustés <1024px et <768px
 * ✅ Grids → colonne unique sur mobile
 * 
 * TYPO PREMIUM ✍️
 * ✅ Letter-spacing négatif (headings)
 * ✅ Font-weight 700 (bold naturel)
 * ✅ Couleurs des textes hiérarchisées
 * ✅ Labels en uppercase petit
 */

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Check, 
  Zap, 
  Star, 
  Crown, 
  Loader2,
  ArrowRight,
  Shield,
  CreditCard,
  Clock,
  Gem,
  Rocket
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CoutureNavbar } from "@/components/CoutureNavbar";
import { CoutureFooter } from "@/components/CoutureFooter";
import { useAuth } from "@/contexts/AuthContext";
import { useSaaSSubscription } from "@/hooks/useSaaSSubscription";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SAAS_PLANS, SaaSPlanId, formatSaaSPrice, SAAS_FEATURE_COMPARISON } from "@/lib/saasPlans";

// 💎 PREMIUM COLOR PALETTE
const COLORS = {
  // Backgrounds
  noir: "#050505",
  noirSoft: "#0A0A0A", 
  noirCard: "#0F0F0F",
  noirElevated: "#151515",
  
  // Gold spectrum
  or: "#D4A853",
  orLight: "#E8C87A",
  orGlow: "#F5D899",
  orDark: "#B8923F",
  
  // Text hierarchy
  ivoire: "#FAFAF8",
  ivoireSoft: "#E8E6E0",
  gris: "#8B8B8B",
  grisMuted: "#5A5A5A",
  
  // Accents
  cyan: "#00D4FF",
  violet: "#A855F7",
  
  // Borders
  border: "#1F1F1F",
  borderHover: "#2A2A2A",
  borderGold: "#D4A85340",
};

// Premium gradients
const GRADIENTS = {
  gold: `linear-gradient(135deg, ${COLORS.or} 0%, ${COLORS.orLight} 50%, ${COLORS.or} 100%)`,
  goldRadial: `radial-gradient(ellipse at top, ${COLORS.or}15 0%, transparent 60%)`,
  cardShine: `linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)`,
  darkCard: `linear-gradient(180deg, ${COLORS.noirCard} 0%, ${COLORS.noir} 100%)`,
  glassCard: `linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)`,
};

// Premium shadows
const SHADOWS = {
  sm: `0 2px 8px rgba(0,0,0,0.3)`,
  md: `0 8px 24px rgba(0,0,0,0.4)`,
  lg: `0 16px 48px rgba(0,0,0,0.5)`,
  xl: `0 24px 64px rgba(0,0,0,0.6)`,
  gold: `0 8px 32px ${COLORS.or}25`,
  goldGlow: `0 0 60px ${COLORS.or}20`,
  cardHover: `0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px ${COLORS.borderHover}`,
};

const planIcons = {
  free: Zap,
  identity: Rocket,
  professional: Star,
  enterprise: Crown,
};

type FlowStep = 'plans' | 'signup' | 'checkout';

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const slideInLeft = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
};

const slideInRight = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
};

// Card component with shine effect
const PremiumCard = ({ 
  children, 
  isPopular = false, 
  isCurrent = false,
  className = "",
  delay = 0,
  direction = "up"
}: { 
  children: React.ReactNode; 
  isPopular?: boolean;
  isCurrent?: boolean;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right";
}) => {
  const variants = direction === "left" ? slideInLeft : direction === "right" ? slideInRight : fadeInUp;
  
  return (
    <motion.div
      initial={variants.initial}
      whileInView={variants.animate}
      viewport={{ once: true }}
      transition={{ 
        delay, 
        duration: 0.7, 
        ease: [0.22, 1, 0.36, 1]
      }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.3 }
      }}
      className={`
        relative overflow-hidden rounded-2xl
        transition-all duration-500 ease-out
        group
        ${className}
      `}
      style={{
        background: isPopular ? GRADIENTS.glassCard : GRADIENTS.darkCard,
        border: `1px solid ${isPopular ? COLORS.or + '40' : isCurrent ? '#22c55e40' : COLORS.border}`,
        boxShadow: isPopular ? SHADOWS.gold : SHADOWS.md,
      }}
    >
      {/* Shine effect on hover */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{
          background: GRADIENTS.cardShine,
          transform: "translateX(-100%)",
          animation: "shine 1.5s ease-in-out infinite",
        }}
      />
      
      {/* Gold glow for popular */}
      {isPopular && (
        <div 
          className="absolute inset-0 opacity-20 blur-2xl -z-10"
          style={{ background: `radial-gradient(circle at 50% 0%, ${COLORS.or} 0%, transparent 70%)` }}
        />
      )}
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export default function SaaSPricing() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, signUp } = useAuth();
  const { subscription, refresh } = useSaaSSubscription();
  
  const [step, setStep] = useState<FlowStep>('plans');
  const [selectedPlan, setSelectedPlan] = useState<SaaSPlanId | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Signup form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [signupError, setSignupError] = useState<string | null>(null);

  // Check for plan from URL
  useEffect(() => {
    const planFromUrl = searchParams.get('plan') as SaaSPlanId | null;
    if (planFromUrl && ['identity', 'professional', 'enterprise'].includes(planFromUrl)) {
      setSelectedPlan(planFromUrl);
      if (user) {
        handleCheckout(planFromUrl);
      } else {
        setStep('signup');
      }
    }
  }, [searchParams, user]);

  // Redirect if subscription success
  useEffect(() => {
    const subscriptionSuccess = searchParams.get('subscription');
    if (subscriptionSuccess === 'success') {
      refresh();
      toast.success('Abonnement activé avec succès !');
      navigate('/dashboard');
    }
  }, [searchParams]);

  const handleSelectPlan = (planId: SaaSPlanId) => {
    if (planId === 'free') {
      toast.info('Le plan gratuit est déjà actif par défaut');
      return;
    }
    
    setSelectedPlan(planId);
    
    if (user) {
      handleCheckout(planId);
    } else {
      setStep('signup');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);
    setIsProcessing(true);

    try {
      const { error } = await signUp(email, password, firstName, lastName);
      
      if (error) {
        if (error.message.includes("already registered")) {
          setSignupError("Cet email est déjà utilisé. Connectez-vous pour continuer.");
          toast.error("Cet email est déjà utilisé");
        } else {
          setSignupError(error.message);
          toast.error("Erreur lors de la création du compte");
        }
        setIsProcessing(false);
        return;
      }

      toast.success("Compte créé ! Redirection vers le paiement...");
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (selectedPlan) {
        await handleCheckout(selectedPlan);
      }
    } catch (err) {
      console.error('Signup error:', err);
      setSignupError("Une erreur inattendue s'est produite");
      setIsProcessing(false);
    }
  };

  const handleCheckout = async (planId: SaaSPlanId) => {
    setIsProcessing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-saas-checkout', {
        body: { plan: planId },
      });

      if (error) throw error;

      if (data?.already_subscribed) {
        toast.info('Vous êtes déjà abonné à ce plan');
        navigate('/dashboard');
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      toast.error('Erreur lors de la création du paiement');
      setIsProcessing(false);
    }
  };

  const currentPlan = subscription?.plan || 'free';

  return (
    <div 
      className="min-h-screen overflow-x-hidden"
      style={{ backgroundColor: COLORS.noir, color: COLORS.ivoire }}
    >
      {/* Glassmorphism Navbar Header */}
      <div 
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: `${COLORS.noir}95`,
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          borderBottom: `1px solid ${COLORS.border}`,
        }}
      >
        <CoutureNavbar />
      </div>
      
      {/* Spacer for fixed navbar */}
      <div className="h-20" />
      
      {/* 💎 HERO SECTION - Premium with generous spacing */}
      <section className="relative py-16 md:py-24 lg:py-32 px-4 overflow-hidden">
        {/* Animated gold orb background */}
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[900px] h-[600px] md:h-[900px] rounded-full pointer-events-none"
          style={{ 
            background: `radial-gradient(circle, ${COLORS.or}08 0%, ${COLORS.or}02 40%, transparent 70%)`,
            filter: "blur(100px)",
          }}
          animate={{ 
            scale: [1, 1.15, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Decorative grid lines */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(${COLORS.or}10 1px, transparent 1px),
              linear-gradient(90deg, ${COLORS.or}10 1px, transparent 1px)
            `,
            backgroundSize: "100px 100px",
          }}
        />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Premium badge */}
            <motion.div
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full mb-10"
              style={{ 
                background: `linear-gradient(135deg, ${COLORS.or}15 0%, ${COLORS.or}05 100%)`,
                border: `1px solid ${COLORS.or}30`,
                boxShadow: `0 4px 20px ${COLORS.or}10`,
              }}
              whileHover={{ scale: 1.02 }}
            >
              <Gem size={16} style={{ color: COLORS.or }} />
              <span 
                className="text-xs font-semibold uppercase tracking-[0.2em]" 
                style={{ color: COLORS.or }}
              >
                Abonnements Premium i-wasp
              </span>
            </motion.div>
            
            {/* Main heading with negative letter-spacing */}
            <h1 
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
              style={{ 
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}
            >
              Choisissez votre{" "}
              <span 
                className="relative inline-block"
                style={{ 
                  background: GRADIENTS.gold,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                formule
                {/* Decorative underline */}
                <motion.div 
                  className="absolute -bottom-2 left-0 right-0 h-1 rounded-full"
                  style={{ background: GRADIENTS.gold }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                />
              </span>
            </h1>
            
            {/* Subtitle */}
            <motion.p 
              className="text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed"
              style={{ color: COLORS.gris }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              De la carte NFC au site e-commerce complet, nous avons une solution 
              pour chaque étape de votre croissance.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <AnimatePresence mode="wait">
        {step === 'plans' && (
          <motion.div
            key="plans"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* 💎 PRICING CARDS SECTION */}
            <section 
              className="py-12 md:py-16 lg:py-20 px-4"
              style={{ background: GRADIENTS.goldRadial }}
            >
              <div className="max-w-7xl mx-auto">
                {/* Section header */}
                <motion.div 
                  className="text-center mb-12 md:mb-16"
                  {...fadeInUp}
                  transition={{ duration: 0.6 }}
                >
                  <p 
                    className="text-xs font-semibold uppercase tracking-[0.25em] mb-4"
                    style={{ color: COLORS.or }}
                  >
                    Nos Offres
                  </p>
                  <h2 
                    className="text-2xl md:text-3xl font-bold"
                    style={{ letterSpacing: "-0.02em" }}
                  >
                    Plans adaptés à vos besoins
                  </h2>
                </motion.div>
                
                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 items-stretch">
                  {(['free', 'identity', 'professional', 'enterprise'] as SaaSPlanId[]).map((planId, idx) => {
                    const plan = SAAS_PLANS[planId.toUpperCase() as keyof typeof SAAS_PLANS];
                    const Icon = planIcons[planId];
                    const isPopular = 'isPopular' in plan && plan.isPopular;
                    const isCurrent = currentPlan === planId;
                    const isFree = planId === 'free';
                    const directions: ("left" | "up" | "right")[] = ["left", "left", "right", "right"];

                    return (
                      <PremiumCard
                        key={planId}
                        isPopular={isPopular}
                        isCurrent={isCurrent}
                        delay={idx * 0.1}
                        direction={directions[idx]}
                        className={`p-6 md:p-8 ${isPopular ? "lg:-mt-4 lg:mb-4" : ""}`}
                      >
                        {/* Popular Badge */}
                        {isPopular && (
                          <motion.div 
                            className="absolute -top-4 left-1/2 -translate-x-1/2"
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                          >
                            <span 
                              className="px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] flex items-center gap-2 whitespace-nowrap"
                              style={{ 
                                background: GRADIENTS.gold,
                                color: COLORS.noir,
                                boxShadow: SHADOWS.gold,
                              }}
                            >
                              <Star size={12} className="fill-current" />
                              Plus populaire
                            </span>
                          </motion.div>
                        )}

                        {/* Current Plan Badge */}
                        {isCurrent && user && (
                          <div className="absolute -top-3 right-4">
                            <Badge className="bg-green-500/90 text-white border-none text-[10px] font-semibold uppercase tracking-wider">
                              <Check size={12} className="mr-1" />
                              Votre plan
                            </Badge>
                          </div>
                        )}

                        {/* Icon with gradient background */}
                        <motion.div 
                          className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                          style={{ 
                            background: isPopular 
                              ? `linear-gradient(135deg, ${COLORS.or}30 0%, ${COLORS.or}10 100%)`
                              : `linear-gradient(135deg, ${COLORS.gris}15 0%, ${COLORS.gris}05 100%)`,
                            border: `1px solid ${isPopular ? COLORS.or + '40' : COLORS.border}`,
                            boxShadow: isPopular ? `0 4px 12px ${COLORS.or}20` : 'none',
                          }}
                          whileHover={{ scale: 1.05, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Icon 
                            size={26} 
                            style={{ color: isPopular ? COLORS.or : COLORS.gris }} 
                          />
                        </motion.div>

                        {/* Plan Name - Bold with tight tracking */}
                        <h3 
                          className="text-2xl font-bold mb-1"
                          style={{ 
                            letterSpacing: "-0.02em",
                            color: COLORS.ivoire,
                          }}
                        >
                          {plan.name}
                        </h3>
                        
                        {/* Tagline in gold */}
                        <p 
                          className="text-xs font-medium uppercase tracking-widest mb-2"
                          style={{ color: COLORS.or }}
                        >
                          {'tagline' in plan ? plan.tagline : 'Pour démarrer'}
                        </p>
                        
                        {/* Description */}
                        <p 
                          className="text-sm font-light mb-6 leading-relaxed"
                          style={{ color: COLORS.gris }}
                        >
                          {plan.description}
                        </p>

                        {/* Price with gradient */}
                        <div className="mb-8">
                          <div className="flex items-baseline gap-2">
                            {isFree ? (
                              <span 
                                className="text-4xl font-bold"
                                style={{ letterSpacing: "-0.02em" }}
                              >
                                Gratuit
                              </span>
                            ) : (
                              <>
                                <span 
                                  className="text-4xl font-bold"
                                  style={{ 
                                    letterSpacing: "-0.02em",
                                    background: isPopular ? GRADIENTS.gold : 'none',
                                    WebkitBackgroundClip: isPopular ? "text" : 'initial',
                                    WebkitTextFillColor: isPopular ? "transparent" : COLORS.ivoire,
                                  }}
                                >
                                  {formatSaaSPrice(plan.priceEur)}
                                </span>
                                <span 
                                  className="text-base font-medium"
                                  style={{ color: COLORS.grisMuted }}
                                >
                                  /mois
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* CTA Button with gradient shadow */}
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button 
                            className="w-full py-6 font-semibold text-xs uppercase tracking-[0.15em] rounded-xl transition-all duration-300"
                            style={{ 
                              background: isCurrent
                                ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
                                : isPopular 
                                  ? GRADIENTS.gold
                                  : "transparent",
                              color: isCurrent || isPopular ? COLORS.noir : COLORS.ivoire,
                              border: isCurrent || isPopular ? "none" : `1px solid ${COLORS.border}`,
                              boxShadow: isPopular ? SHADOWS.gold : 'none',
                            }}
                            onClick={() => handleSelectPlan(planId)}
                            disabled={isProcessing || (isCurrent && user !== null) || isFree}
                          >
                            {isProcessing && selectedPlan === planId ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : isCurrent && user ? (
                              'Plan actuel'
                            ) : isFree ? (
                              'Plan de base'
                            ) : (
                              <>
                                Commencer
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </>
                            )}
                          </Button>
                        </motion.div>

                        {/* Features List */}
                        <div 
                          className="mt-8 pt-6"
                          style={{ borderTop: `1px solid ${COLORS.border}` }}
                        >
                          <h4 
                            className="text-[10px] font-bold uppercase tracking-[0.2em] mb-5"
                            style={{ color: COLORS.grisMuted }}
                          >
                            Inclus
                          </h4>
                          <ul className="space-y-3">
                            {plan.included.slice(0, 6).map((feature, i) => (
                              <motion.li 
                                key={i} 
                                className="flex items-start gap-3 text-sm"
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                              >
                                <span 
                                  className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
                                  style={{ 
                                    background: `${COLORS.or}15`,
                                    border: `1px solid ${COLORS.or}30`,
                                  }}
                                >
                                  <Check size={10} style={{ color: COLORS.or }} />
                                </span>
                                <span style={{ color: COLORS.ivoireSoft }}>{feature}</span>
                              </motion.li>
                            ))}
                            {plan.included.length > 6 && (
                              <li 
                                className="text-xs font-medium pt-2"
                                style={{ color: COLORS.or }}
                              >
                                +{plan.included.length - 6} autres fonctionnalités
                              </li>
                            )}
                          </ul>
                        </div>
                      </PremiumCard>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* 💎 FEATURE COMPARISON TABLE */}
            <section 
              className="py-16 md:py-20 lg:py-24 px-4"
              style={{ backgroundColor: COLORS.noir }}
            >
              <div className="max-w-6xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                  className="rounded-2xl overflow-hidden"
                  style={{ 
                    background: GRADIENTS.darkCard,
                    border: `1px solid ${COLORS.border}`,
                    boxShadow: SHADOWS.lg,
                  }}
                >
                  {/* Table header */}
                  <div 
                    className="p-6 md:p-8 border-b"
                    style={{ 
                      borderColor: COLORS.border,
                      background: `linear-gradient(180deg, ${COLORS.noirElevated} 0%, ${COLORS.noirCard} 100%)`,
                    }}
                  >
                    <h3 
                      className="text-xl md:text-2xl font-bold mb-2"
                      style={{ letterSpacing: "-0.02em" }}
                    >
                      Comparaison détaillée
                    </h3>
                    <p 
                      className="text-sm"
                      style={{ color: COLORS.gris }}
                    >
                      Comparez toutes les fonctionnalités de chaque plan
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                          <th 
                            className="text-left p-4 md:p-5 font-semibold text-xs uppercase tracking-[0.15em]"
                            style={{ color: COLORS.grisMuted }}
                          >
                            Fonctionnalité
                          </th>
                          {['Free', 'Identity', 'Professional', 'Enterprise'].map((name, i) => (
                            <th 
                              key={name}
                              className="text-center p-4 md:p-5 font-semibold text-xs uppercase tracking-[0.15em]"
                              style={{ 
                                color: name === 'Professional' ? COLORS.or : COLORS.grisMuted 
                              }}
                            >
                              {name}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {SAAS_FEATURE_COMPARISON.map((category, catIndex) => (
                          <>
                            <tr 
                              key={`cat-${catIndex}`}
                              style={{ background: `${COLORS.or}05` }}
                            >
                              <td 
                                colSpan={5} 
                                className="p-4 text-[10px] font-bold uppercase tracking-[0.2em]"
                                style={{ color: COLORS.or }}
                              >
                                {category.category}
                              </td>
                            </tr>
                            {category.features.map((feature, featIndex) => (
                              <tr 
                                key={`feat-${catIndex}-${featIndex}`}
                                className="transition-colors duration-200 hover:bg-white/[0.02]"
                                style={{ borderBottom: `1px solid ${COLORS.border}40` }}
                              >
                                <td 
                                  className="p-4 text-sm font-medium"
                                  style={{ color: COLORS.ivoireSoft }}
                                >
                                  {feature.name}
                                </td>
                                {['free', 'identity', 'professional', 'enterprise'].map((planKey) => (
                                  <td key={planKey} className="text-center p-4">
                                    {renderFeatureValue(feature[planKey as keyof typeof feature])}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* 💎 TRUST BADGES */}
            <section 
              className="py-16 md:py-20 px-4"
              style={{ background: GRADIENTS.goldRadial }}
            >
              <div className="max-w-4xl mx-auto">
                <motion.div 
                  className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-8 md:gap-12"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  {[
                    { icon: Shield, text: "Paiement sécurisé Stripe" },
                    { icon: CreditCard, text: "Annulez à tout moment" },
                    { icon: Clock, text: "Support prioritaire" },
                  ].map((item, i) => (
                    <motion.div 
                      key={i}
                      className="flex items-center gap-3"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ 
                          background: `${COLORS.or}10`,
                          border: `1px solid ${COLORS.or}30`,
                        }}
                      >
                        <item.icon size={18} style={{ color: COLORS.or }} />
                      </div>
                      <span 
                        className="text-sm font-medium"
                        style={{ color: COLORS.ivoireSoft }}
                      >
                        {item.text}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </section>
          </motion.div>
        )}

        {/* 💎 SIGNUP STEP */}
        {step === 'signup' && (
          <motion.div
            key="signup"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <section 
              className="py-12 md:py-20 px-4"
              style={{ background: GRADIENTS.goldRadial }}
            >
              <div className="max-w-md mx-auto">
                <motion.div
                  className="p-8 md:p-10 rounded-2xl"
                  style={{ 
                    background: GRADIENTS.darkCard,
                    border: `1px solid ${COLORS.border}`,
                    boxShadow: SHADOWS.xl,
                  }}
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Selected Plan Summary */}
                  {selectedPlan && (
                    <motion.div 
                      className="mb-8 p-5 rounded-xl"
                      style={{ 
                        background: `linear-gradient(135deg, ${COLORS.or}12 0%, ${COLORS.or}05 100%)`,
                        border: `1px solid ${COLORS.or}30`,
                      }}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p 
                            className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1"
                            style={{ color: COLORS.or }}
                          >
                            Plan sélectionné
                          </p>
                          <p 
                            className="text-lg font-bold"
                            style={{ letterSpacing: "-0.02em" }}
                          >
                            {SAAS_PLANS[selectedPlan.toUpperCase() as keyof typeof SAAS_PLANS].name}
                          </p>
                        </div>
                        <div className="text-right">
                          <p 
                            className="text-2xl font-bold"
                            style={{ 
                              background: GRADIENTS.gold,
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                            }}
                          >
                            {formatSaaSPrice(SAAS_PLANS[selectedPlan.toUpperCase() as keyof typeof SAAS_PLANS].priceEur)}
                          </p>
                          <p 
                            className="text-xs"
                            style={{ color: COLORS.grisMuted }}
                          >
                            /mois
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <h2 
                    className="text-2xl md:text-3xl font-bold mb-2 text-center"
                    style={{ letterSpacing: "-0.02em" }}
                  >
                    Créez votre compte
                  </h2>
                  <p 
                    className="text-sm text-center mb-8"
                    style={{ color: COLORS.gris }}
                  >
                    Inscrivez-vous pour continuer vers le paiement sécurisé
                  </p>

                  <form onSubmit={handleSignup} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label 
                          htmlFor="firstName" 
                          className="text-[10px] font-bold uppercase tracking-[0.15em] mb-2 block"
                          style={{ color: COLORS.grisMuted }}
                        >
                          Prénom
                        </Label>
                        <Input
                          id="firstName"
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                          className="rounded-lg border-0 h-12"
                          style={{ 
                            backgroundColor: COLORS.noirElevated, 
                            color: COLORS.ivoire,
                            boxShadow: `inset 0 0 0 1px ${COLORS.border}`,
                          }}
                        />
                      </div>
                      <div>
                        <Label 
                          htmlFor="lastName"
                          className="text-[10px] font-bold uppercase tracking-[0.15em] mb-2 block"
                          style={{ color: COLORS.grisMuted }}
                        >
                          Nom
                        </Label>
                        <Input
                          id="lastName"
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                          className="rounded-lg border-0 h-12"
                          style={{ 
                            backgroundColor: COLORS.noirElevated, 
                            color: COLORS.ivoire,
                            boxShadow: `inset 0 0 0 1px ${COLORS.border}`,
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <Label 
                        htmlFor="email"
                        className="text-[10px] font-bold uppercase tracking-[0.15em] mb-2 block"
                        style={{ color: COLORS.grisMuted }}
                      >
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="rounded-lg border-0 h-12"
                        style={{ 
                          backgroundColor: COLORS.noirElevated, 
                          color: COLORS.ivoire,
                          boxShadow: `inset 0 0 0 1px ${COLORS.border}`,
                        }}
                      />
                    </div>

                    <div>
                      <Label 
                        htmlFor="password"
                        className="text-[10px] font-bold uppercase tracking-[0.15em] mb-2 block"
                        style={{ color: COLORS.grisMuted }}
                      >
                        Mot de passe
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className="rounded-lg border-0 h-12"
                        style={{ 
                          backgroundColor: COLORS.noirElevated, 
                          color: COLORS.ivoire,
                          boxShadow: `inset 0 0 0 1px ${COLORS.border}`,
                        }}
                      />
                      <p 
                        className="text-xs mt-2"
                        style={{ color: COLORS.grisMuted }}
                      >
                        Minimum 6 caractères
                      </p>
                    </div>

                    {signupError && (
                      <motion.div 
                        className="p-4 rounded-lg text-sm font-medium"
                        style={{ 
                          backgroundColor: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          color: '#ef4444',
                        }}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {signupError}
                      </motion.div>
                    )}

                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                      <Button
                        type="submit"
                        className="w-full py-6 font-bold text-xs uppercase tracking-[0.15em] rounded-xl transition-all duration-300"
                        style={{ 
                          background: GRADIENTS.gold,
                          color: COLORS.noir,
                          boxShadow: SHADOWS.gold,
                        }}
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            Continuer vers le paiement
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </form>

                  <div className="mt-6 text-center">
                    <p 
                      className="text-sm"
                      style={{ color: COLORS.gris }}
                    >
                      Déjà un compte ?{" "}
                      <button 
                        onClick={() => navigate(`/login?redirect=/pricing?plan=${selectedPlan}`)}
                        className="font-semibold hover:underline transition-all"
                        style={{ color: COLORS.or }}
                      >
                        Se connecter
                      </button>
                    </p>
                  </div>

                  <div className="mt-4 text-center">
                    <button 
                      onClick={() => setStep('plans')}
                      className="text-sm hover:underline transition-all"
                      style={{ color: COLORS.grisMuted }}
                    >
                      ← Retour aux plans
                    </button>
                  </div>
                </motion.div>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      <CoutureFooter />
      
      {/* CSS for shine animation */}
      <style>{`
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}

function renderFeatureValue(value: boolean | string | number) {
  if (typeof value === 'boolean') {
    return value ? (
      <motion.span 
        className="inline-flex items-center justify-center w-7 h-7 rounded-full"
        style={{ 
          background: `linear-gradient(135deg, ${COLORS.or}25 0%, ${COLORS.or}10 100%)`,
          border: `1px solid ${COLORS.or}40`,
        }}
        whileHover={{ scale: 1.1 }}
      >
        <Check size={14} style={{ color: COLORS.or }} />
      </motion.span>
    ) : (
      <span 
        className="text-sm"
        style={{ color: `${COLORS.grisMuted}60` }}
      >
        —
      </span>
    );
  }
  return (
    <span 
      className="text-sm font-medium"
      style={{ color: COLORS.ivoireSoft }}
    >
      {value}
    </span>
  );
}
