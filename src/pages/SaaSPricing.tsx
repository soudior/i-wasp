/**
 * SaaS Pricing Page - Plans d'abonnement IWASP
 * Flow intégré: Tarification → Signup → Paiement → Dashboard
 * Style: Haute Couture Digitale - Noir & Or
 */

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Check, 
  X, 
  Zap, 
  Star, 
  Crown, 
  Loader2,
  ArrowRight,
  Shield,
  CreditCard,
  Clock
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
  identity: Zap,
  professional: Star,
  enterprise: Crown,
};

type FlowStep = 'plans' | 'signup' | 'checkout';

export default function SaaSPricing() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, signUp, loading: authLoading } = useAuth();
  const { subscription, isLoading: subLoading, refresh } = useSaaSSubscription();
  
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
        // Already logged in, go to checkout
        handleCheckout(planFromUrl);
      } else {
        setStep('signup');
      }
    }
  }, [searchParams, user]);

  // Redirect if already subscribed
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
      // Already logged in, go directly to checkout
      handleCheckout(planId);
    } else {
      // Need to signup first
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
      
      // Wait a bit for auth state to update
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Now proceed to checkout
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
    <div className="min-h-screen" style={{ backgroundColor: COLORS.noir, color: COLORS.ivoire }}>
      <CoutureNavbar />
      
      {/* Hero */}
      <section className="relative py-24 px-4 overflow-hidden">
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[250px] pointer-events-none"
          style={{ backgroundColor: `${COLORS.or}08` }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-8"
              style={{ backgroundColor: `${COLORS.or}15`, border: `1px solid ${COLORS.or}30` }}
            >
              <Sparkles size={14} style={{ color: COLORS.or }} />
              <span className="text-xs uppercase tracking-widest" style={{ color: COLORS.or }}>
                Abonnements SaaS
              </span>
            </motion.div>
            
            <h1 className="font-display text-4xl md:text-6xl font-light tracking-tight mb-6">
              Choisissez votre{" "}
              <span style={{ color: COLORS.or }}>formule</span>
            </h1>
            
            <p className="text-lg font-light max-w-2xl mx-auto" style={{ color: COLORS.gris }}>
              De la carte NFC au site e-commerce complet, nous avons une solution pour chaque étape de votre croissance.
            </p>
          </motion.div>
        </div>
      </section>

      <AnimatePresence mode="wait">
        {step === 'plans' && (
          <motion.div
            key="plans"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {/* Pricing Cards */}
            <section className="py-12 px-4" style={{ backgroundColor: COLORS.noirSoft }}>
              <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
                  {(['free', 'identity', 'professional', 'enterprise'] as SaaSPlanId[]).map((planId, idx) => {
                    const plan = SAAS_PLANS[planId.toUpperCase() as keyof typeof SAAS_PLANS];
                    const Icon = planIcons[planId];
                    const isPopular = 'isPopular' in plan && plan.isPopular;
                    const isCurrent = currentPlan === planId;
                    const isFree = planId === 'free';

                    return (
                      <motion.div
                        key={planId}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1, duration: 0.6 }}
                        className={`relative p-8 rounded-3xl ${isPopular ? "md:-mt-4 md:mb-4" : ""}`}
                        style={{ 
                          backgroundColor: isPopular ? `${COLORS.or}08` : COLORS.noirCard,
                          border: `1px solid ${isPopular ? COLORS.or : isCurrent ? '#22c55e' : COLORS.border}40`,
                        }}
                      >
                        {/* Popular Badge */}
                        {isPopular && (
                          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                            <span 
                              className="px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider flex items-center gap-2"
                              style={{ 
                                background: `linear-gradient(135deg, ${COLORS.or} 0%, ${COLORS.orLight} 100%)`,
                                color: COLORS.noir,
                                boxShadow: `0 4px 20px ${COLORS.or}40`,
                              }}
                            >
                              <Star size={12} />
                              Plus populaire
                            </span>
                          </div>
                        )}

                        {/* Current Plan Badge */}
                        {isCurrent && user && (
                          <div className="absolute -top-4 right-4">
                            <Badge className="bg-green-500 text-white">
                              Votre plan
                            </Badge>
                          </div>
                        )}

                        {/* Icon */}
                        <div 
                          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                          style={{ 
                            backgroundColor: isPopular ? `${COLORS.or}20` : `${COLORS.gris}15`,
                            border: `1px solid ${isPopular ? COLORS.or : COLORS.gris}30`,
                          }}
                        >
                          <Icon size={24} style={{ color: isPopular ? COLORS.or : COLORS.gris }} />
                        </div>

                        {/* Plan Name */}
                        <h3 className="text-2xl font-medium mb-1 tracking-tight" style={{ color: COLORS.ivoire }}>
                          {plan.name}
                        </h3>
                        <p className="text-sm mb-2" style={{ color: COLORS.or }}>
                          {'tagline' in plan ? plan.tagline : ''}
                        </p>
                        <p className="text-sm mb-6 font-light" style={{ color: COLORS.gris }}>
                          {plan.description}
                        </p>

                        {/* Price */}
                        <div className="mb-6">
                          <div className="flex items-baseline gap-2">
                            {isFree ? (
                              <span className="text-4xl font-light" style={{ color: COLORS.ivoire }}>Gratuit</span>
                            ) : (
                              <>
                                <span className="text-4xl font-light" style={{ color: COLORS.ivoire }}>
                                  {formatSaaSPrice(plan.price)}
                                </span>
                                <span className="text-lg" style={{ color: COLORS.gris }}>
                                  /mois
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* CTA Button */}
                        <Button 
                          className="w-full py-6 font-medium text-sm uppercase tracking-widest"
                          style={{ 
                            background: isCurrent
                              ? '#22c55e'
                              : isPopular 
                                ? `linear-gradient(135deg, ${COLORS.or} 0%, ${COLORS.orLight} 100%)`
                                : "transparent",
                            color: isCurrent || isPopular ? COLORS.noir : COLORS.ivoire,
                            border: isCurrent || isPopular ? "none" : `1px solid ${COLORS.border}`,
                          }}
                          onClick={() => handleSelectPlan(planId)}
                          disabled={isProcessing || (isCurrent && user !== null) || isFree}
                        >
                          {isProcessing && selectedPlan === planId ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : isCurrent && user ? (
                            'Plan actuel'
                          ) : isFree ? (
                            'Plan gratuit'
                          ) : (
                            <>
                              Commencer
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </>
                          )}
                        </Button>

                        {/* Features List */}
                        <div className="mt-8 pt-6" style={{ borderTop: `1px solid ${COLORS.border}` }}>
                          <h4 className="text-xs uppercase tracking-widest mb-4" style={{ color: COLORS.gris }}>
                            Inclus
                          </h4>
                          <ul className="space-y-3">
                            {plan.included.slice(0, 8).map((feature, i) => (
                              <li key={i} className="flex items-start gap-3 text-sm font-light" style={{ color: COLORS.gris }}>
                                <Check size={16} className="flex-shrink-0 mt-0.5" style={{ color: COLORS.or }} />
                                <span>{feature}</span>
                              </li>
                            ))}
                            {plan.included.length > 8 && (
                              <li className="text-xs" style={{ color: COLORS.or }}>
                                +{plan.included.length - 8} autres fonctionnalités...
                              </li>
                            )}
                          </ul>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Feature Comparison */}
            <section className="py-20 px-4" style={{ backgroundColor: COLORS.noir }}>
              <div className="max-w-6xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="rounded-3xl overflow-hidden"
                  style={{ backgroundColor: COLORS.noirCard, border: `1px solid ${COLORS.border}` }}
                >
                  <div className="p-8 border-b" style={{ borderColor: COLORS.border }}>
                    <h3 className="text-xl font-medium" style={{ color: COLORS.ivoire }}>
                      Comparaison détaillée
                    </h3>
                    <p className="text-sm mt-2" style={{ color: COLORS.gris }}>
                      Comparez toutes les fonctionnalités de chaque plan
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                          <th className="text-left p-4 font-medium text-sm" style={{ color: COLORS.gris }}>
                            Fonctionnalité
                          </th>
                          <th className="text-center p-4 font-medium text-sm" style={{ color: COLORS.gris }}>
                            Free
                          </th>
                          <th className="text-center p-4 font-medium text-sm" style={{ color: COLORS.gris }}>
                            Identity
                          </th>
                          <th className="text-center p-4 font-medium text-sm" style={{ color: COLORS.or }}>
                            Professional
                          </th>
                          <th className="text-center p-4 font-medium text-sm" style={{ color: COLORS.gris }}>
                            Enterprise
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {SAAS_FEATURE_COMPARISON.map((category, catIndex) => (
                          <>
                            <tr key={`cat-${catIndex}`} style={{ backgroundColor: `${COLORS.or}05` }}>
                              <td colSpan={5} className="p-4 text-xs uppercase tracking-widest font-medium" style={{ color: COLORS.or }}>
                                {category.category}
                              </td>
                            </tr>
                            {category.features.map((feature, featIndex) => (
                              <tr key={`feat-${catIndex}-${featIndex}`} style={{ borderBottom: `1px solid ${COLORS.border}20` }}>
                                <td className="p-4 text-sm" style={{ color: COLORS.ivoire }}>
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

            {/* Trust Badges */}
            <section className="py-16 px-4" style={{ backgroundColor: COLORS.noirSoft }}>
              <div className="max-w-4xl mx-auto">
                <div className="flex flex-wrap justify-center gap-8">
                  {[
                    { icon: Shield, text: "Paiement sécurisé Stripe" },
                    { icon: CreditCard, text: "Annulez à tout moment" },
                    { icon: Clock, text: "Support 24/7" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3" style={{ color: COLORS.gris }}>
                      <item.icon size={20} style={{ color: COLORS.or }} />
                      <span className="text-sm">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {step === 'signup' && (
          <motion.div
            key="signup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <section className="py-12 px-4" style={{ backgroundColor: COLORS.noirSoft }}>
              <div className="max-w-md mx-auto">
                <motion.div
                  className="p-8 rounded-3xl"
                  style={{ backgroundColor: COLORS.noirCard, border: `1px solid ${COLORS.border}` }}
                >
                  {/* Selected Plan Summary */}
                  {selectedPlan && (
                    <div 
                      className="mb-8 p-4 rounded-2xl"
                      style={{ backgroundColor: `${COLORS.or}10`, border: `1px solid ${COLORS.or}30` }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-wider" style={{ color: COLORS.or }}>
                            Plan sélectionné
                          </p>
                          <p className="text-lg font-medium" style={{ color: COLORS.ivoire }}>
                            {SAAS_PLANS[selectedPlan.toUpperCase() as keyof typeof SAAS_PLANS].name}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-light" style={{ color: COLORS.or }}>
                            {formatSaaSPrice(SAAS_PLANS[selectedPlan.toUpperCase() as keyof typeof SAAS_PLANS].price)}
                          </p>
                          <p className="text-xs" style={{ color: COLORS.gris }}>/mois</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <h2 className="text-2xl font-medium mb-2 text-center" style={{ color: COLORS.ivoire }}>
                    Créez votre compte
                  </h2>
                  <p className="text-sm text-center mb-8" style={{ color: COLORS.gris }}>
                    Une fois inscrit, vous serez redirigé vers le paiement sécurisé
                  </p>

                  <form onSubmit={handleSignup} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName" style={{ color: COLORS.gris }}>Prénom</Label>
                        <Input
                          id="firstName"
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                          className="mt-2"
                          style={{ 
                            backgroundColor: COLORS.noir, 
                            borderColor: COLORS.border,
                            color: COLORS.ivoire 
                          }}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName" style={{ color: COLORS.gris }}>Nom</Label>
                        <Input
                          id="lastName"
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                          className="mt-2"
                          style={{ 
                            backgroundColor: COLORS.noir, 
                            borderColor: COLORS.border,
                            color: COLORS.ivoire 
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email" style={{ color: COLORS.gris }}>Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-2"
                        style={{ 
                          backgroundColor: COLORS.noir, 
                          borderColor: COLORS.border,
                          color: COLORS.ivoire 
                        }}
                      />
                    </div>

                    <div>
                      <Label htmlFor="password" style={{ color: COLORS.gris }}>Mot de passe</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className="mt-2"
                        style={{ 
                          backgroundColor: COLORS.noir, 
                          borderColor: COLORS.border,
                          color: COLORS.ivoire 
                        }}
                      />
                      <p className="text-xs mt-1" style={{ color: COLORS.gris }}>
                        Minimum 6 caractères
                      </p>
                    </div>

                    {signupError && (
                      <div 
                        className="p-3 rounded-lg text-sm"
                        style={{ backgroundColor: '#dc262620', color: '#dc2626' }}
                      >
                        {signupError}
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full py-6 font-medium text-sm uppercase tracking-widest"
                      style={{ 
                        background: `linear-gradient(135deg, ${COLORS.or} 0%, ${COLORS.orLight} 100%)`,
                        color: COLORS.noir,
                      }}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          Continuer vers le paiement
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>

                  <div className="mt-6 text-center">
                    <p className="text-sm" style={{ color: COLORS.gris }}>
                      Déjà un compte ?{" "}
                      <button 
                        onClick={() => navigate(`/login?redirect=/saas-pricing?plan=${selectedPlan}`)}
                        className="underline"
                        style={{ color: COLORS.or }}
                      >
                        Se connecter
                      </button>
                    </p>
                  </div>

                  <div className="mt-4 text-center">
                    <button 
                      onClick={() => setStep('plans')}
                      className="text-sm underline"
                      style={{ color: COLORS.gris }}
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
    </div>
  );
}

function renderFeatureValue(value: boolean | string | number) {
  if (typeof value === 'boolean') {
    return value ? (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full" style={{ backgroundColor: `${COLORS.or}20` }}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M10 3L4.5 8.5L2 6" stroke={COLORS.or} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
    ) : (
      <span className="text-sm" style={{ color: `${COLORS.gris}40` }}>—</span>
    );
  }
  return <span className="text-sm" style={{ color: COLORS.ivoire }}>{value}</span>;
}
