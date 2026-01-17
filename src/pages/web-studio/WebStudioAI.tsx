/**
 * Web Studio AI - Assistant conversationnel premium
 * Interface de chat style Apple/Cupertino avec animations fluides
 * Support du mode sombre et animations hero avec particules
 */

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Send, Sparkles, Globe, ArrowRight, Zap, CheckCircle2, Moon, Sun } from "lucide-react";
import { CoutureNavbar } from "@/components/CoutureNavbar";
import { SEOHead, SEO_CONFIGS } from "@/components/SEOHead";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Apple-inspired color palette with dark mode support
const getTheme = (isDark: boolean) => ({
  bg: isDark ? "#000000" : "#F5F5F7",
  bgGradient: isDark 
    ? "linear-gradient(180deg, #000000 0%, #1D1D1F 100%)" 
    : "linear-gradient(180deg, #F5F5F7 0%, #E8E8ED 100%)",
  card: isDark ? "rgba(255,255,255,0.08)" : "#FFFFFF",
  cardBorder: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.04)",
  text: isDark ? "#F5F5F7" : "#1D1D1F",
  textSecondary: isDark ? "#8E8E93" : "#86868B",
  accent: "#007AFF",
  accentLight: "#5AC8FA",
  success: "#34C759",
  particle: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,122,255,0.08)",
  inputBg: isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.9)",
  shimmer: isDark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.6)",
});

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface CollectedData {
  businessType?: string;
  businessName?: string;
  description?: string;
  products?: string;
  services?: string;
  style?: string;
  colors?: string;
  contactEmail?: string;
  contactName?: string;
  contactPhone?: string;
}

// Contextual suggestions based on current step
const CONTEXTUAL_SUGGESTIONS: Record<string, Array<{ label: string; icon: string }>> = {
  business_type: [
    { label: "Restaurant", icon: "🍽️" },
    { label: "Boutique en ligne", icon: "🛍️" },
    { label: "Coach sportif", icon: "💪" },
    { label: "Artisan", icon: "🔨" },
    { label: "Agence digitale", icon: "💼" },
    { label: "Freelance", icon: "💻" },
  ],
  business_name: [
    { label: "Je n'ai pas encore de nom", icon: "🤔" },
    { label: "Proposez-moi des idées", icon: "💡" },
  ],
  description: [
    { label: "C'est une entreprise locale", icon: "📍" },
    { label: "Je travaille en ligne uniquement", icon: "🌐" },
    { label: "Je débute mon activité", icon: "🚀" },
    { label: "J'ai déjà des clients", icon: "👥" },
  ],
  services: [
    { label: "Services à domicile", icon: "🏠" },
    { label: "Livraison disponible", icon: "🚚" },
    { label: "Sur rendez-vous", icon: "📅" },
    { label: "Boutique physique", icon: "🏪" },
  ],
  products: [
    { label: "Produits artisanaux", icon: "✨" },
    { label: "Services personnalisés", icon: "🎯" },
    { label: "Formation / Coaching", icon: "📚" },
    { label: "Consultation", icon: "💬" },
  ],
  style: [
    { label: "Moderne et épuré", icon: "✨" },
    { label: "Classique et élégant", icon: "🎩" },
    { label: "Coloré et dynamique", icon: "🌈" },
    { label: "Minimaliste", icon: "⚪" },
    { label: "Luxe et premium", icon: "💎" },
    { label: "Naturel et organique", icon: "🌿" },
  ],
  colors: [
    { label: "Bleu professionnel", icon: "💙" },
    { label: "Vert nature", icon: "💚" },
    { label: "Noir élégant", icon: "🖤" },
    { label: "Orange énergique", icon: "🧡" },
    { label: "Rose moderne", icon: "💗" },
    { label: "Laissez-moi choisir", icon: "🎨" },
  ],
  contact: [
    { label: "Email uniquement", icon: "📧" },
    { label: "Téléphone + Email", icon: "📞" },
    { label: "Formulaire de contact", icon: "📝" },
    { label: "WhatsApp business", icon: "💬" },
  ],
  confirmation: [
    { label: "Oui, c'est parfait !", icon: "✅" },
    { label: "Je veux modifier quelque chose", icon: "✏️" },
    { label: "Recommencer", icon: "🔄" },
  ],
};

const INITIAL_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content: "Bonjour ! 👋\n\nJe suis votre assistant pour créer votre site web professionnel. En quelques questions simples, je vais comprendre votre projet et vous proposer un site sur mesure.\n\nQuel est votre domaine d'activité ?",
  timestamp: new Date(),
};

// Floating particles component
const FloatingParticles = ({ isDark }: { isDark: boolean }) => {
  const theme = getTheme(isDark);
  const particles = useMemo(() => 
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 5,
    })), []
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: theme.particle,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0, 0.8, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Hero animation component
const HeroAnimation = ({ isDark, onComplete }: { isDark: boolean; onComplete: () => void }) => {
  const theme = getTheme(isDark);
  
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: theme.bgGradient }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 2, duration: 0.5 }}
    >
      <FloatingParticles isDark={isDark} />
      
      <div className="text-center">
        {/* Animated logo/icon */}
        <motion.div
          className="relative w-24 h-24 mx-auto mb-8"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
        >
          {/* Glowing rings */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full"
              style={{ border: `2px solid ${theme.accent}` }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: [1, 1.5 + i * 0.3], 
                opacity: [0.6 - i * 0.15, 0] 
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0.5 + i * 0.3,
                ease: "easeOut",
              }}
            />
          ))}
          
          <motion.div
            className="absolute inset-0 rounded-full flex items-center justify-center"
            style={{ 
              background: `linear-gradient(135deg, ${theme.accent}30 0%, ${theme.accentLight}20 100%)`,
              backdropFilter: "blur(10px)",
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles size={40} style={{ color: theme.accent }} />
            </motion.div>
          </motion.div>
        </motion.div>
        
        {/* Title animation */}
        <motion.h1
          className="text-3xl font-semibold mb-3"
          style={{ color: theme.text }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          Web Studio
        </motion.h1>
        
        <motion.p
          className="text-sm"
          style={{ color: theme.textSecondary }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Créez votre site web en quelques minutes
        </motion.p>
        
        {/* Loading dots */}
        <motion.div 
          className="flex items-center justify-center gap-1.5 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: theme.accent }}
              animate={{
                y: [0, -8, 0],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

// Typing animation component
const TypingIndicator = ({ isDark }: { isDark: boolean }) => {
  const theme = getTheme(isDark);
  return (
    <motion.div 
      className="flex items-center gap-1.5 px-4 py-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: theme.accent }}
          animate={{
            y: [0, -6, 0],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </motion.div>
  );
};

// Progress step component
const ProgressStep = ({ active, completed, label, isDark }: { active: boolean; completed: boolean; label: string; isDark: boolean }) => {
  const theme = getTheme(isDark);
  return (
    <motion.div 
      className="flex flex-col items-center gap-1.5"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <motion.div
        className="w-3 h-3 rounded-full flex items-center justify-center"
        style={{
          backgroundColor: completed ? theme.success : active ? theme.accent : isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
        }}
        animate={{
          scale: active ? [1, 1.2, 1] : 1,
        }}
        transition={{
          duration: 2,
          repeat: active ? Infinity : 0,
          ease: "easeInOut",
        }}
      >
        {completed && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <CheckCircle2 size={10} color="white" />
          </motion.div>
        )}
      </motion.div>
      <span className="text-[10px] font-medium" style={{ color: completed ? theme.success : theme.textSecondary }}>
        {label}
      </span>
    </motion.div>
  );
};

// Theme toggle button
const ThemeToggle = ({ isDark, onToggle }: { isDark: boolean; onToggle: () => void }) => {
  const theme = getTheme(isDark);
  return (
    <motion.button
      onClick={onToggle}
      className="fixed top-24 right-4 z-40 p-3 rounded-full backdrop-blur-xl"
      style={{
        backgroundColor: theme.card,
        border: `1px solid ${theme.cardBorder}`,
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        {isDark ? (
          <Sun size={18} style={{ color: "#FFD60A" }} />
        ) : (
          <Moon size={18} style={{ color: theme.textSecondary }} />
        )}
      </motion.div>
    </motion.button>
  );
};

export default function WebStudioAI() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [collectedData, setCollectedData] = useState<CollectedData>({});
  const [currentStep, setCurrentStep] = useState("business_type");
  const [isReadyToGenerate, setIsReadyToGenerate] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSiteUrl, setGeneratedSiteUrl] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [showHero, setShowHero] = useState(true);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const theme = getTheme(isDark);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isLoading && !showHero) inputRef.current?.focus();
  }, [isLoading, showHero]);

  const sendMessage = async (customMessage?: string) => {
    const messageText = customMessage || input.trim();
    if (!messageText || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const conversationHistory = messages.map(m => ({
        role: m.role,
        content: m.content,
      }));
      conversationHistory.push({ role: "user", content: userMessage.content });

      const { data, error } = await supabase.functions.invoke("webstudio-chat", {
        body: {
          messages: conversationHistory,
          conversationState: {
            step: currentStep,
            collectedData,
          },
        },
      });

      if (error) throw error;

      if (data.extractedData) {
        setCollectedData(prev => ({ ...prev, ...data.extractedData }));
      }

      if (data.nextStep) {
        setCurrentStep(data.nextStep);
      }

      if (data.isReadyToGenerate) {
        setIsReadyToGenerate(true);
      }

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error: any) {
      console.error("Chat error:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateSite = async () => {
    setIsGenerating(true);
    setGenerationProgress(10);

    try {
      setGenerationProgress(20);
      const { data: proposalData, error: proposalError } = await supabase.functions.invoke("generate-website", {
        body: collectedData,
      });

      if (proposalError) throw proposalError;
      if (!proposalData?.proposal) throw new Error("Proposition non générée");

      setGenerationProgress(40);

      const { data: orderData, error: orderError } = await supabase.functions.invoke("webstudio-order", {
        body: {
          sessionId: `chat-${Date.now()}`,
          formData: collectedData,
          proposal: proposalData.proposal,
          isExpress: false,
          priceEur: 0,
          priceMad: 0,
        },
      });

      if (orderError) throw orderError;
      if (!orderData?.proposalId) throw new Error("Commande non créée");

      const proposalId = orderData.proposalId;
      setGenerationProgress(60);

      const { error: genError } = await supabase.functions.invoke("generate-website-code", {
        body: { proposalId },
      });

      if (genError) console.error("Site generation error:", genError);

      setGenerationProgress(80);

      let attempts = 0;
      const maxAttempts = 30;

      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const { data: website } = await supabase
          .from("generated_websites")
          .select("status, preview_url, slug")
          .eq("proposal_id", proposalId)
          .single();

        if (website?.status === "completed" && website?.preview_url) {
          setGenerationProgress(100);
          setGeneratedSiteUrl(website.preview_url);
          toast({
            title: "🎉 Votre site est prêt !",
            description: "Découvrez votre nouveau site web",
          });
          return;
        }

        if (website?.status === "failed") break;

        attempts++;
        setGenerationProgress(80 + Math.min(15, attempts * 0.5));
      }

      toast({
        title: "Site en cours de création",
        description: "Vous recevrez un email quand il sera prêt.",
      });

    } catch (error: any) {
      console.error("Generation error:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const progressSteps = [
    { key: "businessType", label: "Activité" },
    { key: "businessName", label: "Nom" },
    { key: "description", label: "Description" },
    { key: "products", label: "Services" },
    { key: "style", label: "Style" },
    { key: "contactEmail", label: "Contact" },
  ];

  const completedSteps = progressSteps.filter(s => collectedData[s.key as keyof CollectedData]).length;

  // Hero animation
  if (showHero) {
    return (
      <>
        <SEOHead {...SEO_CONFIGS.webStudio} />
        <HeroAnimation isDark={isDark} onComplete={() => setShowHero(false)} />
      </>
    );
  }

  // Success state - site generated
  if (generatedSiteUrl) {
    return (
      <>
        <SEOHead {...SEO_CONFIGS.webStudio} />
        <div className="min-h-screen" style={{ background: theme.bgGradient }}>
          <CoutureNavbar />
          <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
          <FloatingParticles isDark={isDark} />
          
          <main className="pt-24 pb-20 px-4 flex items-center justify-center min-h-screen">
            <motion.div
              className="max-w-md w-full rounded-3xl p-10 text-center relative overflow-hidden"
              style={{
                backgroundColor: theme.card,
                border: `1px solid ${theme.cardBorder}`,
                boxShadow: isDark 
                  ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)" 
                  : "0 25px 50px -12px rgba(0, 0, 0, 0.1)",
              }}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <motion.div
                className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${theme.success}20 0%, ${theme.success}10 100%)` }}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                >
                  <Globe size={36} style={{ color: theme.success }} />
                </motion.div>
              </motion.div>
              
              <motion.h2 
                className="text-2xl font-semibold mb-2"
                style={{ color: theme.text }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Votre site est en ligne !
              </motion.h2>
              <motion.p 
                className="text-sm mb-8"
                style={{ color: theme.textSecondary }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {collectedData.businessName || "Votre site"} est maintenant accessible à tous.
              </motion.p>
              
              <motion.a
                href={generatedSiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full px-6 py-4 rounded-2xl font-medium text-white"
                style={{
                  background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accentLight} 100%)`,
                  boxShadow: `0 8px 20px ${theme.accent}30`,
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.02, boxShadow: `0 12px 30px ${theme.accent}40` }}
                whileTap={{ scale: 0.98 }}
              >
                <Globe size={18} />
                Voir mon site
                <ArrowRight size={16} />
              </motion.a>
              
              <motion.button
                onClick={() => {
                  setMessages([INITIAL_MESSAGE]);
                  setCollectedData({});
                  setCurrentStep("business_type");
                  setIsReadyToGenerate(false);
                  setGeneratedSiteUrl(null);
                }}
                className="mt-6 text-sm font-medium"
                style={{ color: theme.accent }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
              >
                Créer un autre site
              </motion.button>
            </motion.div>
          </main>
        </div>
      </>
    );
  }

  // Generating state with beautiful animation
  if (isGenerating) {
    return (
      <>
        <SEOHead {...SEO_CONFIGS.webStudio} />
        <div className="min-h-screen" style={{ background: theme.bgGradient }}>
          <CoutureNavbar />
          <FloatingParticles isDark={isDark} />
          
          <main className="pt-24 pb-20 px-4 flex items-center justify-center min-h-screen">
            <motion.div
              className="max-w-md w-full rounded-3xl p-10 text-center"
              style={{
                backgroundColor: theme.card,
                border: `1px solid ${theme.cardBorder}`,
                boxShadow: isDark 
                  ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)" 
                  : "0 25px 50px -12px rgba(0, 0, 0, 0.1)",
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {/* Animated rings */}
              <div className="relative w-24 h-24 mx-auto mb-8">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 rounded-full"
                    style={{
                      border: `2px solid ${theme.accent}`,
                      opacity: 0.3 - i * 0.1,
                    }}
                    animate={{
                      scale: [1, 1.5 + i * 0.3],
                      opacity: [0.3, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.5,
                      ease: "easeOut",
                    }}
                  />
                ))}
                <motion.div
                  className="absolute inset-0 rounded-full flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${theme.accent}20 0%, ${theme.accentLight}10 100%)` }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles size={32} style={{ color: theme.accent }} />
                </motion.div>
              </div>
              
              <motion.h2 
                className="text-xl font-semibold mb-2"
                style={{ color: theme.text }}
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Création en cours...
              </motion.h2>
              <p className="text-sm mb-8" style={{ color: theme.textSecondary }}>
                {generationProgress < 40 && "Analyse de votre projet..."}
                {generationProgress >= 40 && generationProgress < 70 && "Design et structure en cours..."}
                {generationProgress >= 70 && "Finalisation et mise en ligne..."}
              </p>
              
              {/* Premium progress bar */}
              <div 
                className="relative w-full h-1.5 rounded-full overflow-hidden mb-4" 
                style={{ backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)" }}
              >
                <motion.div
                  className="absolute top-0 left-0 h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${theme.accent}, ${theme.accentLight})` }}
                  initial={{ width: "0%" }}
                  animate={{ width: `${generationProgress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
                <motion.div
                  className="absolute top-0 h-full w-20 rounded-full"
                  style={{ background: `linear-gradient(90deg, transparent, ${theme.shimmer}, transparent)` }}
                  animate={{ left: ["-20%", "120%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
              
              <p className="text-xs font-medium" style={{ color: theme.textSecondary }}>
                {generationProgress}%
              </p>
            </motion.div>
          </main>
        </div>
      </>
    );
  }

  // Chat interface - Premium Apple style with dark mode
  return (
    <>
      <SEOHead {...SEO_CONFIGS.webStudio} />
      <div className="min-h-screen flex flex-col" style={{ background: theme.bgGradient }}>
        <CoutureNavbar />
        <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
        <FloatingParticles isDark={isDark} />
        
        <main className="flex-1 flex flex-col pt-20 pb-4 max-w-2xl mx-auto w-full px-4 relative z-10">
          {/* Header with glassmorphism */}
          <motion.div 
            className="text-center py-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 backdrop-blur-xl"
              style={{ 
                backgroundColor: theme.inputBg,
                border: `1px solid ${theme.cardBorder}`,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles size={14} style={{ color: theme.accent }} />
              </motion.div>
              <span className="text-xs font-semibold" style={{ color: theme.accent }}>
                Assistant Web Studio
              </span>
            </motion.div>
            
            <h1 className="text-2xl font-semibold mb-2" style={{ color: theme.text }}>
              Créez votre site web
            </h1>
            <p className="text-sm" style={{ color: theme.textSecondary }}>
              En quelques questions, votre site sera prêt
            </p>
          </motion.div>

          {/* Progress bar */}
          {completedSteps > 0 && !isReadyToGenerate && (
            <motion.div 
              className="flex items-center justify-center gap-6 mb-6 px-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {progressSteps.map((step, i) => {
                const isCompleted = !!collectedData[step.key as keyof CollectedData];
                const isActive = !isCompleted && progressSteps.slice(0, i).every(s => collectedData[s.key as keyof CollectedData]);
                return (
                  <ProgressStep 
                    key={step.key} 
                    active={isActive} 
                    completed={isCompleted} 
                    label={step.label}
                    isDark={isDark}
                  />
                );
              })}
            </motion.div>
          )}

          {/* Messages container */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 px-2">
            <AnimatePresence mode="popLayout">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                  }}
                >
                  <motion.div
                    className={`max-w-[85%] rounded-2xl px-5 py-3.5 ${
                      message.role === "user" 
                        ? "rounded-br-lg" 
                        : "rounded-bl-lg"
                    }`}
                    style={{
                      backgroundColor: message.role === "user" ? theme.accent : theme.card,
                      color: message.role === "user" ? "#FFFFFF" : theme.text,
                      border: message.role === "assistant" ? `1px solid ${theme.cardBorder}` : "none",
                      boxShadow: message.role === "user" 
                        ? `0 4px 15px ${theme.accent}30`
                        : isDark 
                          ? "0 2px 15px rgba(0, 0, 0, 0.3)"
                          : "0 2px 15px rgba(0, 0, 0, 0.05)",
                    }}
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed font-medium">
                      {message.content}
                    </p>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {/* Typing indicator */}
            {isLoading && (
              <motion.div
                className="flex justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div
                  className="rounded-2xl rounded-bl-lg"
                  style={{
                    backgroundColor: theme.card,
                    border: `1px solid ${theme.cardBorder}`,
                    boxShadow: isDark 
                      ? "0 2px 15px rgba(0, 0, 0, 0.3)"
                      : "0 2px 15px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <TypingIndicator isDark={isDark} />
                </div>
              </motion.div>
            )}
            
            {/* Contextual quick suggestions based on current step */}
            <AnimatePresence mode="wait">
              {!isLoading && !isReadyToGenerate && CONTEXTUAL_SUGGESTIONS[currentStep] && (
                <motion.div
                  key={currentStep}
                  className="flex flex-wrap gap-2.5 justify-center pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10, transition: { duration: 0.15 } }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  {CONTEXTUAL_SUGGESTIONS[currentStep].map((suggestion, i) => (
                    <motion.button
                      key={`${currentStep}-${suggestion.label}`}
                      onClick={() => sendMessage(suggestion.label)}
                      className="px-4 py-2.5 rounded-xl text-[13px] font-medium flex items-center gap-2 backdrop-blur-sm"
                      style={{
                        backgroundColor: theme.card,
                        color: theme.text,
                        boxShadow: isDark 
                          ? "0 2px 10px rgba(0,0,0,0.3)"
                          : "0 2px 10px rgba(0,0,0,0.05)",
                        border: `1px solid ${theme.cardBorder}`,
                      }}
                      initial={{ opacity: 0, y: 12, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ 
                        delay: 0.25 + i * 0.05,
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                      }}
                      whileHover={{ 
                        scale: 1.05, 
                        y: -2,
                        boxShadow: isDark 
                          ? `0 8px 25px rgba(0,0,0,0.4), 0 0 0 1px ${theme.accent}40`
                          : `0 8px 25px rgba(0,0,0,0.08), 0 0 0 1px ${theme.accent}30`,
                        backgroundColor: isDark ? `${theme.accent}20` : `${theme.accent}10`,
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.span
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 + i * 0.05 }}
                      >
                        {suggestion.icon}
                      </motion.span>
                      {suggestion.label}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
            
            <div ref={messagesEndRef} />
          </div>

          {/* Generate button when ready */}
          <AnimatePresence>
            {isReadyToGenerate && (
              <motion.div
                className="mb-4 px-2"
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                <motion.button
                  onClick={handleGenerateSite}
                  className="w-full flex items-center justify-center gap-3 px-6 py-5 rounded-2xl font-semibold text-white relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accentLight} 100%)`,
                    boxShadow: `0 10px 30px ${theme.accent}40`,
                  }}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: `0 15px 40px ${theme.accent}50`,
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${theme.shimmer}, transparent)`,
                    }}
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <Zap size={20} />
                  <span className="relative">Créer mon site maintenant</span>
                  <ArrowRight size={18} />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input area - Floating glassmorphism style */}
          <motion.div
            className="rounded-2xl p-1.5 backdrop-blur-xl"
            style={{
              backgroundColor: theme.inputBg,
              boxShadow: isDark 
                ? "0 8px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)"
                : "0 8px 40px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tapez votre réponse..."
                disabled={isLoading || isReadyToGenerate}
                className="flex-1 bg-transparent px-4 py-4 text-sm outline-none font-medium placeholder:opacity-50"
                style={{ color: theme.text }}
              />
              <motion.button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading}
                className="p-3.5 rounded-xl disabled:opacity-40 transition-all"
                style={{
                  backgroundColor: input.trim() ? theme.accent : isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
                  color: input.trim() ? "#FFFFFF" : theme.textSecondary,
                }}
                whileHover={{ scale: input.trim() ? 1.08 : 1 }}
                whileTap={{ scale: input.trim() ? 0.92 : 1 }}
              >
                <Send size={18} />
              </motion.button>
            </div>
          </motion.div>
          
          {/* Footer hint */}
          <motion.p 
            className="text-center text-xs mt-4 font-medium"
            style={{ color: theme.textSecondary }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Powered by IWASP • Création de site web intelligent
          </motion.p>
        </main>
      </div>
    </>
  );
}
