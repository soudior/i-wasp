/**
 * Web Studio AI - Assistant conversationnel pour créer des sites web
 * Interface de chat simple et intuitive
 */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, Sparkles, Globe, Check, ArrowRight } from "lucide-react";
import { CoutureNavbar } from "@/components/CoutureNavbar";
import { SEOHead, SEO_CONFIGS } from "@/components/SEOHead";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const STUDIO = {
  noir: "#050505",
  noirSoft: "#0A0A0A",
  noirCard: "#111111",
  or: "#D4A853",
  orLight: "#E8C87A",
  ivoire: "#F5F5F5",
  gris: "#6B6B6B",
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
  "Restaurant",
  "Boutique",
  "Coach",
  "Artisan",
  "Agence",
  "Consultant",
];

const INITIAL_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content: "Bonjour ! 👋 Je suis votre assistant pour créer votre site web professionnel. En quelques questions, je vais comprendre votre projet et vous proposer un site sur mesure.\n\nPour commencer, quel est votre domaine d'activité ? (ex: restaurant, boutique, coach, artisan...)",
  timestamp: new Date(),
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
    inputRef.current?.focus();
  }, [isLoading]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Prepare conversation for API
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

      // Update collected data
      if (data.extractedData) {
        setCollectedData(prev => ({ ...prev, ...data.extractedData }));
      }

      // Update step
      if (data.nextStep) {
        setCurrentStep(data.nextStep);
      }

      // Check if ready to generate
      if (data.isReadyToGenerate) {
        setIsReadyToGenerate(true);
      }

      // Add assistant response
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
      // Step 1: Generate proposal
      setGenerationProgress(20);
      const { data: proposalData, error: proposalError } = await supabase.functions.invoke("generate-website", {
        body: collectedData,
      });

      if (proposalError) throw proposalError;
      if (!proposalData?.proposal) throw new Error("Proposition non générée");

      setGenerationProgress(40);

      // Step 2: Create order
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

      // Step 3: Generate actual site
      const { data: genData, error: genError } = await supabase.functions.invoke("generate-website-code", {
        body: { proposalId },
      });

      if (genError) {
        console.error("Site generation error:", genError);
      }

      setGenerationProgress(80);

      // Step 4: Poll for completion
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

        if (website?.status === "failed") {
          break;
        }

        attempts++;
        setGenerationProgress(80 + Math.min(15, attempts * 0.5));
      }

      // If we reach here, show success anyway
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

  // Success state - site generated
  if (generatedSiteUrl) {
    return (
      <>
        <SEOHead {...SEO_CONFIGS.webStudio} />
        <div className="min-h-screen" style={{ backgroundColor: STUDIO.noir }}>
          <CoutureNavbar />
          <main className="pt-24 pb-20 px-4 flex items-center justify-center min-h-screen">
            <motion.div
              className="max-w-md w-full rounded-3xl p-8 text-center"
              style={{
                backgroundColor: STUDIO.noirCard,
                border: `1px solid ${STUDIO.or}30`,
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <motion.div
                className="w-24 h-24 rounded-full mx-auto mb-8 flex items-center justify-center"
                style={{ backgroundColor: `${STUDIO.or}20` }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
              >
                <Globe size={48} style={{ color: STUDIO.or }} />
              </motion.div>
              
              <h2 className="text-2xl font-medium mb-3" style={{ color: STUDIO.ivoire }}>
                Votre site est en ligne ! 🎉
              </h2>
              <p className="text-sm mb-8" style={{ color: STUDIO.gris }}>
                {collectedData.businessName || "Votre site"} est maintenant accessible à tous.
              </p>
              
              <motion.a
                href={generatedSiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full px-6 py-4 rounded-xl font-medium text-sm mb-4"
                style={{
                  background: `linear-gradient(135deg, ${STUDIO.or} 0%, ${STUDIO.orLight} 100%)`,
                  color: STUDIO.noir,
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Globe size={18} />
                Voir mon site
                <ArrowRight size={16} />
              </motion.a>
              
              <button
                onClick={() => {
                  setMessages([INITIAL_MESSAGE]);
                  setCollectedData({});
                  setCurrentStep("business_type");
                  setIsReadyToGenerate(false);
                  setGeneratedSiteUrl(null);
                }}
                className="text-sm underline"
                style={{ color: STUDIO.gris }}
              >
                Créer un autre site
              </button>
            </motion.div>
          </main>
        </div>
      </>
    );
  }

  // Generating state
  if (isGenerating) {
    return (
      <>
        <SEOHead {...SEO_CONFIGS.webStudio} />
        <div className="min-h-screen" style={{ backgroundColor: STUDIO.noir }}>
          <CoutureNavbar />
          <main className="pt-24 pb-20 px-4 flex items-center justify-center min-h-screen">
            <motion.div
              className="max-w-md w-full rounded-3xl p-8 text-center"
              style={{
                backgroundColor: STUDIO.noirCard,
                border: `1px solid ${STUDIO.or}30`,
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <motion.div
                className="w-24 h-24 rounded-full mx-auto mb-8 flex items-center justify-center"
                style={{ backgroundColor: `${STUDIO.or}15` }}
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles size={40} style={{ color: STUDIO.or }} />
              </motion.div>
              
              <h2 className="text-xl font-medium mb-3" style={{ color: STUDIO.ivoire }}>
                Création de votre site en cours...
              </h2>
              <p className="text-sm mb-6" style={{ color: STUDIO.gris }}>
                {generationProgress < 40 && "Analyse de votre projet..."}
                {generationProgress >= 40 && generationProgress < 70 && "Design et structure en cours..."}
                {generationProgress >= 70 && "Finalisation et mise en ligne..."}
              </p>
              
              <div className="w-full h-2 rounded-full overflow-hidden mb-4" style={{ backgroundColor: `${STUDIO.ivoire}10` }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${STUDIO.or}, ${STUDIO.orLight})` }}
                  initial={{ width: "0%" }}
                  animate={{ width: `${generationProgress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              
              <p className="text-xs" style={{ color: STUDIO.gris }}>
                {generationProgress}% • Environ 30-60 secondes
              </p>
            </motion.div>
          </main>
        </div>
      </>
    );
  }

  // Chat interface
  return (
    <>
      <SEOHead {...SEO_CONFIGS.webStudio} />
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: STUDIO.noir }}>
        <CoutureNavbar />
        
        {/* Chat container */}
        <main className="flex-1 flex flex-col pt-20 pb-4 max-w-2xl mx-auto w-full px-4">
          {/* Header */}
          <div className="text-center py-6">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
              style={{ backgroundColor: `${STUDIO.or}15`, border: `1px solid ${STUDIO.or}30` }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Sparkles size={14} style={{ color: STUDIO.or }} />
              <span className="text-xs font-medium" style={{ color: STUDIO.or }}>
                Assistant Web Studio
              </span>
            </motion.div>
            <h1 className="text-xl font-medium" style={{ color: STUDIO.ivoire }}>
              Créez votre site en quelques minutes
            </h1>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            <AnimatePresence mode="popLayout">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      message.role === "user" ? "rounded-br-md" : "rounded-bl-md"
                    }`}
                    style={{
                      backgroundColor: message.role === "user" ? STUDIO.or : STUDIO.noirCard,
                      color: message.role === "user" ? STUDIO.noir : STUDIO.ivoire,
                      border: message.role === "assistant" ? `1px solid ${STUDIO.ivoire}10` : "none",
                    }}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {/* Loading indicator */}
            {isLoading && (
              <motion.div
                className="flex justify-start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div
                  className="rounded-2xl rounded-bl-md px-4 py-3"
                  style={{
                    backgroundColor: STUDIO.noirCard,
                    border: `1px solid ${STUDIO.ivoire}10`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" style={{ color: STUDIO.or }} />
                    <span className="text-sm" style={{ color: STUDIO.gris }}>
                      En train d'écrire...
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Quick suggestions for first question */}
            {messages.length === 1 && !isLoading && (
              <motion.div
                className="flex flex-wrap gap-2 justify-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {QUICK_SUGGESTIONS.map((suggestion) => (
                  <motion.button
                    key={suggestion}
                    onClick={() => {
                      setInput(suggestion);
                      setTimeout(() => {
                        const event = { key: "Enter", shiftKey: false, preventDefault: () => {} };
                        setInput(suggestion);
                      }, 100);
                    }}
                    className="px-4 py-2 rounded-full text-xs transition-all"
                    style={{
                      backgroundColor: `${STUDIO.ivoire}08`,
                      border: `1px solid ${STUDIO.ivoire}20`,
                      color: STUDIO.ivoire,
                    }}
                    whileHover={{
                      backgroundColor: `${STUDIO.or}20`,
                      borderColor: STUDIO.or,
                      color: STUDIO.or,
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {suggestion}
                  </motion.button>
                ))}
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Generate button when ready */}
          {isReadyToGenerate && (
            <motion.div
              className="mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <motion.button
                onClick={handleGenerateSite}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-medium text-sm"
                style={{
                  background: `linear-gradient(135deg, ${STUDIO.or} 0%, ${STUDIO.orLight} 100%)`,
                  color: STUDIO.noir,
                  boxShadow: `0 8px 32px ${STUDIO.or}40`,
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Sparkles size={18} />
                Créer mon site maintenant
                <ArrowRight size={16} />
              </motion.button>
            </motion.div>
          )}

          {/* Input area */}
          <div
            className="rounded-2xl p-2"
            style={{
              backgroundColor: STUDIO.noirCard,
              border: `1px solid ${STUDIO.ivoire}15`,
            }}
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
                className="flex-1 bg-transparent px-4 py-3 text-sm outline-none"
                style={{ color: STUDIO.ivoire }}
              />
              <motion.button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="p-3 rounded-xl disabled:opacity-50"
                style={{
                  backgroundColor: input.trim() ? STUDIO.or : `${STUDIO.ivoire}10`,
                  color: input.trim() ? STUDIO.noir : STUDIO.gris,
                }}
                whileHover={{ scale: input.trim() ? 1.05 : 1 }}
                whileTap={{ scale: input.trim() ? 0.95 : 1 }}
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </motion.button>
            </div>
          </div>

          {/* Progress indicator */}
          {Object.keys(collectedData).length > 0 && !isReadyToGenerate && (
            <motion.div
              className="flex items-center justify-center gap-2 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {["businessType", "businessName", "description", "products", "style", "contactEmail"].map((field, i) => (
                <div
                  key={field}
                  className="w-2 h-2 rounded-full transition-all"
                  style={{
                    backgroundColor: collectedData[field as keyof CollectedData] ? STUDIO.or : `${STUDIO.ivoire}20`,
                  }}
                />
              ))}
              <span className="text-xs ml-2" style={{ color: STUDIO.gris }}>
                {Object.keys(collectedData).filter(k => collectedData[k as keyof CollectedData]).length}/6 infos collectées
              </span>
            </motion.div>
          )}
        </main>
      </div>
    </>
  );
}
