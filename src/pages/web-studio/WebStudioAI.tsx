/**
 * Web Studio AI - Assistant conversationnel premium
 * Interface de chat style Apple/Cupertino avec animations fluides
 */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Send, Sparkles, Globe, ArrowRight, MessageCircle, Zap, CheckCircle2 } from "lucide-react";
import { CoutureNavbar } from "@/components/CoutureNavbar";
import { SEOHead, SEO_CONFIGS } from "@/components/SEOHead";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Apple-inspired color palette
const APPLE = {
  bg: "#F5F5F7",
  bgDark: "#1D1D1F",
  card: "#FFFFFF",
  cardDark: "rgba(255,255,255,0.08)",
  text: "#1D1D1F",
  textSecondary: "#86868B",
  accent: "#007AFF",
  accentLight: "#5AC8FA",
  success: "#34C759",
  border: "rgba(0,0,0,0.06)",
};

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

const QUICK_SUGGESTIONS = [
  { label: "Restaurant", icon: "🍽️" },
  { label: "Boutique", icon: "🛍️" },
  { label: "Coach", icon: "💪" },
  { label: "Artisan", icon: "🔨" },
  { label: "Agence", icon: "💼" },
  { label: "Freelance", icon: "💻" },
];

const INITIAL_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content: "Bonjour ! 👋\n\nJe suis votre assistant pour créer votre site web professionnel. En quelques questions simples, je vais comprendre votre projet et vous proposer un site sur mesure.\n\nQuel est votre domaine d'activité ?",
  timestamp: new Date(),
};

// Typing animation component
const TypingIndicator = () => (
  <motion.div 
    className="flex items-center gap-1.5 px-4 py-3"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: APPLE.accent }}
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

// Progress step component
const ProgressStep = ({ active, completed, label }: { active: boolean; completed: boolean; label: string }) => (
  <motion.div 
    className="flex flex-col items-center gap-1.5"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <motion.div
      className="w-3 h-3 rounded-full flex items-center justify-center"
      style={{
        backgroundColor: completed ? APPLE.success : active ? APPLE.accent : "rgba(0,0,0,0.1)",
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
    <span className="text-[10px] font-medium" style={{ color: completed ? APPLE.success : APPLE.textSecondary }}>
      {label}
    </span>
  </motion.div>
);

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
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isLoading) inputRef.current?.focus();
  }, [isLoading]);

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

  // Success state - site generated
  if (generatedSiteUrl) {
    return (
      <>
        <SEOHead {...SEO_CONFIGS.webStudio} />
        <div className="min-h-screen" style={{ background: `linear-gradient(180deg, ${APPLE.bg} 0%, #E8E8ED 100%)` }}>
          <CoutureNavbar />
          <main className="pt-24 pb-20 px-4 flex items-center justify-center min-h-screen">
            <motion.div
              className="max-w-md w-full rounded-3xl p-10 text-center"
              style={{
                backgroundColor: APPLE.card,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.03)",
              }}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <motion.div
                className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${APPLE.success}20 0%, ${APPLE.success}10 100%)` }}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                >
                  <Globe size={36} style={{ color: APPLE.success }} />
                </motion.div>
              </motion.div>
              
              <motion.h2 
                className="text-2xl font-semibold mb-2"
                style={{ color: APPLE.text }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Votre site est en ligne !
              </motion.h2>
              <motion.p 
                className="text-sm mb-8"
                style={{ color: APPLE.textSecondary }}
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
                  background: `linear-gradient(135deg, ${APPLE.accent} 0%, ${APPLE.accentLight} 100%)`,
                  boxShadow: `0 8px 20px ${APPLE.accent}30`,
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.02, boxShadow: `0 12px 30px ${APPLE.accent}40` }}
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
                style={{ color: APPLE.accent }}
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
        <div className="min-h-screen" style={{ background: `linear-gradient(180deg, ${APPLE.bg} 0%, #E8E8ED 100%)` }}>
          <CoutureNavbar />
          <main className="pt-24 pb-20 px-4 flex items-center justify-center min-h-screen">
            <motion.div
              className="max-w-md w-full rounded-3xl p-10 text-center"
              style={{
                backgroundColor: APPLE.card,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)",
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
                      border: `2px solid ${APPLE.accent}`,
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
                  style={{ background: `linear-gradient(135deg, ${APPLE.accent}20 0%, ${APPLE.accentLight}10 100%)` }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles size={32} style={{ color: APPLE.accent }} />
                </motion.div>
              </div>
              
              <motion.h2 
                className="text-xl font-semibold mb-2"
                style={{ color: APPLE.text }}
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Création en cours...
              </motion.h2>
              <p className="text-sm mb-8" style={{ color: APPLE.textSecondary }}>
                {generationProgress < 40 && "Analyse de votre projet..."}
                {generationProgress >= 40 && generationProgress < 70 && "Design et structure en cours..."}
                {generationProgress >= 70 && "Finalisation et mise en ligne..."}
              </p>
              
              {/* Premium progress bar */}
              <div className="relative w-full h-1.5 rounded-full overflow-hidden mb-4" style={{ backgroundColor: "rgba(0,0,0,0.05)" }}>
                <motion.div
                  className="absolute top-0 left-0 h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${APPLE.accent}, ${APPLE.accentLight})` }}
                  initial={{ width: "0%" }}
                  animate={{ width: `${generationProgress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
                {/* Shimmer effect */}
                <motion.div
                  className="absolute top-0 h-full w-20 rounded-full"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)" }}
                  animate={{ left: ["-20%", "120%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
              
              <p className="text-xs font-medium" style={{ color: APPLE.textSecondary }}>
                {generationProgress}%
              </p>
            </motion.div>
          </main>
        </div>
      </>
    );
  }

  // Chat interface - Premium Apple style
  return (
    <>
      <SEOHead {...SEO_CONFIGS.webStudio} />
      <div className="min-h-screen flex flex-col" style={{ background: `linear-gradient(180deg, ${APPLE.bg} 0%, #E8E8ED 100%)` }}>
        <CoutureNavbar />
        
        <main className="flex-1 flex flex-col pt-20 pb-4 max-w-2xl mx-auto w-full px-4">
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
                backgroundColor: "rgba(255,255,255,0.8)",
                border: "1px solid rgba(0,0,0,0.05)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles size={14} style={{ color: APPLE.accent }} />
              </motion.div>
              <span className="text-xs font-semibold" style={{ color: APPLE.accent }}>
                Assistant Web Studio
              </span>
            </motion.div>
            
            <h1 className="text-2xl font-semibold mb-2" style={{ color: APPLE.text }}>
              Créez votre site web
            </h1>
            <p className="text-sm" style={{ color: APPLE.textSecondary }}>
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
                    delay: index === messages.length - 1 ? 0 : 0,
                  }}
                >
                  <motion.div
                    className={`max-w-[85%] rounded-2xl px-5 py-3.5 ${
                      message.role === "user" 
                        ? "rounded-br-lg" 
                        : "rounded-bl-lg"
                    }`}
                    style={{
                      backgroundColor: message.role === "user" ? APPLE.accent : APPLE.card,
                      color: message.role === "user" ? "#FFFFFF" : APPLE.text,
                      boxShadow: message.role === "user" 
                        ? `0 4px 15px ${APPLE.accent}30`
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
                    backgroundColor: APPLE.card,
                    boxShadow: "0 2px 15px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <TypingIndicator />
                </div>
              </motion.div>
            )}
            
            {/* Quick suggestions - First question only */}
            {messages.length === 1 && !isLoading && (
              <motion.div
                className="flex flex-wrap gap-3 justify-center pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, staggerChildren: 0.1 }}
              >
                {QUICK_SUGGESTIONS.map((suggestion, i) => (
                  <motion.button
                    key={suggestion.label}
                    onClick={() => sendMessage(suggestion.label)}
                    className="px-5 py-3 rounded-2xl text-sm font-medium flex items-center gap-2"
                    style={{
                      backgroundColor: APPLE.card,
                      color: APPLE.text,
                      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                      border: "1px solid rgba(0,0,0,0.04)",
                    }}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + i * 0.08 }}
                    whileHover={{ 
                      scale: 1.05, 
                      boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
                      backgroundColor: `${APPLE.accent}10`,
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>{suggestion.icon}</span>
                    {suggestion.label}
                  </motion.button>
                ))}
              </motion.div>
            )}
            
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
                    background: `linear-gradient(135deg, ${APPLE.accent} 0%, ${APPLE.accentLight} 100%)`,
                    boxShadow: `0 10px 30px ${APPLE.accent}40`,
                  }}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: `0 15px 40px ${APPLE.accent}50`,
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
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
              backgroundColor: "rgba(255,255,255,0.9)",
              boxShadow: "0 8px 40px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)",
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
                className="flex-1 bg-transparent px-4 py-4 text-sm outline-none font-medium"
                style={{ color: APPLE.text }}
              />
              <motion.button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading}
                className="p-3.5 rounded-xl disabled:opacity-40 transition-all"
                style={{
                  backgroundColor: input.trim() ? APPLE.accent : "rgba(0,0,0,0.05)",
                  color: input.trim() ? "#FFFFFF" : APPLE.textSecondary,
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
            style={{ color: APPLE.textSecondary }}
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
