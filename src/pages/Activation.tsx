/**
 * i-wasp OMNIA — Portail d'Activation (Ignition)
 * 
 * Interface ultra-minimaliste pour l'activation des cartes.
 * Effet "infusion" lors de la saisie du code de série.
 */

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { SEOHead, SEO_CONFIGS } from "@/components/SEOHead";
import { supabase } from "@/integrations/supabase/client";

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

const glowPulse = {
  idle: {
    boxShadow: "0 0 60px rgba(220, 199, 176, 0.1), 0 0 120px rgba(220, 199, 176, 0.05)",
  },
  active: {
    boxShadow: [
      "0 0 80px rgba(220, 199, 176, 0.15), 0 0 160px rgba(220, 199, 176, 0.08)",
      "0 0 120px rgba(220, 199, 176, 0.25), 0 0 200px rgba(220, 199, 176, 0.12)",
      "0 0 80px rgba(220, 199, 176, 0.15), 0 0 160px rgba(220, 199, 176, 0.08)",
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
  success: {
    boxShadow: "0 0 150px rgba(0, 255, 102, 0.2), 0 0 250px rgba(0, 255, 102, 0.1)",
  },
};

const Activation = () => {
  const [serialCode, setSerialCode] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRecognized, setIsRecognized] = useState(false);
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Format serial code as user types (XXXX-XXXX-XXXX)
  const formatSerialCode = (value: string) => {
    const cleaned = value.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
    const parts = [];
    for (let i = 0; i < cleaned.length && i < 12; i += 4) {
      parts.push(cleaned.slice(i, i + 4));
    }
    return parts.join("-");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatSerialCode(e.target.value);
    setSerialCode(formatted);
    setError("");
    setIsRecognized(false);
    
    // Set typing state
    setIsTyping(true);
    
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Reset typing state after delay
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  // Auto-verify when code is complete (12 chars = XXXX-XXXX-XXXX)
  useEffect(() => {
    const cleanCode = serialCode.replace(/-/g, "");
    if (cleanCode.length === 12 && !isVerifying && !isRecognized) {
      verifySerialCode(cleanCode);
    }
  }, [serialCode]);

  const verifySerialCode = async (code: string) => {
    setIsVerifying(true);
    setError("");
    
    try {
      console.log("[Activation] Verifying serial code...");
      
      // Call the edge function to verify the code
      const { data, error: fnError } = await supabase.functions.invoke('verify-activation-code', {
        body: { serial_code: code }
      });
      
      if (fnError) {
        console.error("[Activation] Edge function error:", fnError);
        setError("Erreur de connexion. Veuillez réessayer.");
        setIsVerifying(false);
        return;
      }
      
      if (data?.success) {
        console.log("[Activation] Card found:", data.full_name);
        setUserName(data.full_name || "MEMBRE OMNIA");
        setIsRecognized(true);
        
        // Store card info for later use
        sessionStorage.setItem('activated_card_id', data.card_id);
        sessionStorage.setItem('activated_card_slug', data.slug);
      } else {
        console.log("[Activation] Card not found");
        setError(data?.error || "Code de série non reconnu. Vérifiez et réessayez.");
      }
      
      setIsVerifying(false);
    } catch (err) {
      console.error("[Activation] Unexpected error:", err);
      setError("Erreur de vérification. Veuillez réessayer.");
      setIsVerifying(false);
    }
  };

  const handleContinue = () => {
    // Navigate to dashboard or onboarding
    navigate("/dashboard");
  };

  return (
    <>
      <SEOHead 
        title="Activation | i-wasp Omnia"
        description="Activez votre carte i-wasp et accédez à votre identité digitale."
      />
      
      <div className="min-h-screen bg-[#030303] relative overflow-hidden flex items-center justify-center">
        
        {/* ═══════════════════════════════════════════════════════════════
            AMBIENT GLOW — Multiple layers
            ═══════════════════════════════════════════════════════════════ */}
        <motion.div 
          className="fixed inset-0 pointer-events-none"
          animate={{
            background: isRecognized 
              ? "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(0, 255, 102, 0.06) 0%, transparent 60%)"
              : isTyping 
                ? "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(220, 199, 176, 0.1) 0%, transparent 60%)"
                : "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(220, 199, 176, 0.04) 0%, transparent 60%)",
          }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        />
        
        {/* Secondary glow */}
        <motion.div 
          className="fixed inset-0 pointer-events-none"
          animate={{
            opacity: isTyping ? 1 : 0.5,
          }}
          transition={{ duration: 0.8 }}
          style={{
            background: "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(220, 199, 176, 0.03) 0%, transparent 70%)",
          }}
        />

        {/* ═══════════════════════════════════════════════════════════════
            NAVIGATION — Ultra minimal
            ═══════════════════════════════════════════════════════════════ */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-0 left-0 right-0 z-50 px-6 py-6"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(220, 199, 176, 0.1)",
                  border: "1px solid rgba(220, 199, 176, 0.2)",
                }}
              >
                <span className="font-display text-sm text-[#DCC7B0]">W</span>
              </div>
              <span className="font-display text-xl tracking-[0.1em] text-[#FDFCFB]/90">
                i-wasp <span className="text-[#DCC7B0]">Omnia</span>
              </span>
            </Link>
            
            <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#FDFCFB]/30">
              PORTAIL D'ACTIVATION
            </p>
          </div>
        </motion.nav>

        {/* ═══════════════════════════════════════════════════════════════
            MAIN CONTENT
            ═══════════════════════════════════════════════════════════════ */}
        <div className="relative z-10 w-full max-w-2xl mx-auto px-6">
          
          <AnimatePresence mode="wait">
            {!isRecognized ? (
              <motion.div
                key="input-phase"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40, scale: 0.95 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="text-center"
              >
                {/* Title */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="font-mono text-[10px] tracking-[0.4em] uppercase text-[#DCC7B0]/50 mb-6"
                >
                  IGNITION PROTOCOL
                </motion.p>
                
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 1 }}
                  className="font-display text-4xl sm:text-5xl md:text-6xl font-normal tracking-[0.04em] text-[#FDFCFB] mb-4"
                >
                  Éveillez votre <span className="italic text-[#DCC7B0]">Aura</span>
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="font-body text-base font-extralight text-[#FDFCFB]/40 mb-16 max-w-md mx-auto"
                >
                  Entrez le code de série gravé au dos de votre carte pour activer votre identité digitale.
                </motion.p>
                
                {/* Serial Code Input — Giant & Minimal */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, duration: 1.2 }}
                  className="relative mb-8"
                >
                  <motion.div
                    variants={glowPulse}
                    animate={isTyping ? "active" : isVerifying ? "active" : "idle"}
                    className="relative rounded-3xl overflow-hidden"
                    style={{
                      background: "rgba(255, 255, 255, 0.02)",
                      border: isTyping 
                        ? "1px solid rgba(220, 199, 176, 0.3)" 
                        : "1px solid rgba(255, 255, 255, 0.06)",
                    }}
                  >
                    <input
                      ref={inputRef}
                      type="text"
                      value={serialCode}
                      onChange={handleInputChange}
                      placeholder="XXXX-XXXX-XXXX"
                      maxLength={14}
                      className="w-full px-8 py-8 sm:py-10 bg-transparent text-center font-mono text-3xl sm:text-4xl md:text-5xl tracking-[0.2em] uppercase text-[#FDFCFB] placeholder:text-[#FDFCFB]/15 focus:outline-none"
                      style={{
                        caretColor: "#DCC7B0",
                      }}
                      autoFocus
                    />
                    
                    {/* Typing indicator line */}
                    <motion.div
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-[#DCC7B0]"
                      initial={{ width: 0 }}
                      animate={{ 
                        width: isTyping ? "60%" : "0%",
                        opacity: isTyping ? 1 : 0,
                      }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </motion.div>
                  
                  {/* Verifying state */}
                  <AnimatePresence>
                    {isVerifying && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute -bottom-12 left-0 right-0 flex items-center justify-center gap-3"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border border-[#DCC7B0]/50 border-t-[#DCC7B0] rounded-full"
                        />
                        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#DCC7B0]/70">
                          Vérification en cours...
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                
                {/* Error message */}
                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="font-body text-sm text-red-400/80 mt-6"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>
                
                {/* Helper text */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#FDFCFB]/20 mt-20"
                >
                  Code à 12 caractères • Gravé au dos de votre carte
                </motion.p>
              </motion.div>
            ) : (
              /* ═══════════════════════════════════════════════════════════
                 RECOGNIZED STATE — Identity confirmed
                 ═══════════════════════════════════════════════════════════ */
              <motion.div
                key="recognized-phase"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-center"
              >
                {/* Success badge */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="w-24 h-24 mx-auto mb-10 rounded-full flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, rgba(0, 255, 102, 0.15) 0%, rgba(0, 255, 102, 0.05) 100%)",
                    border: "1px solid rgba(0, 255, 102, 0.3)",
                    boxShadow: "0 0 60px rgba(0, 255, 102, 0.15)",
                  }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                  >
                    <Check className="w-10 h-10 text-[#00FF66]" />
                  </motion.div>
                </motion.div>
                
                {/* Recognition text */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="font-mono text-[10px] tracking-[0.4em] uppercase text-[#00FF66]/70 mb-6"
                >
                  IDENTITÉ RECONNUE
                </motion.p>
                
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 1 }}
                  className="font-display text-4xl sm:text-5xl md:text-6xl font-normal tracking-[0.04em] text-[#FDFCFB] mb-4"
                >
                  Bienvenue,
                </motion.h1>
                
                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 1 }}
                  className="font-display text-3xl sm:text-4xl md:text-5xl font-normal tracking-[0.08em] text-[#DCC7B0] italic mb-12"
                >
                  {userName}
                </motion.h2>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="font-body text-base font-extralight text-[#FDFCFB]/40 mb-16 max-w-md mx-auto"
                >
                  Votre carte i-wasp est maintenant active. Accédez à votre espace personnel pour configurer votre Aura digitale.
                </motion.p>
                
                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                >
                  <motion.button
                    onClick={handleContinue}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative overflow-hidden group cursor-pointer px-16 py-7 rounded-full"
                    style={{
                      background: "linear-gradient(135deg, #DCC7B0 0%, #E8D9C7 50%, #DCC7B0 100%)",
                      boxShadow: "0 10px 40px rgba(220, 199, 176, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                    }}
                  >
                    {/* Shimmer effect */}
                    <motion.div
                      className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                      style={{
                        background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)",
                      }}
                    />
                    
                    <span className="relative z-10 flex items-center justify-center gap-3 font-body text-sm font-light tracking-[0.2em] uppercase text-[#030303]">
                      <Sparkles className="w-4 h-4" />
                      Accéder à mon Espace
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </motion.button>
                </motion.div>
                
                {/* Serial confirmation */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#FDFCFB]/20 mt-16"
                >
                  CARTE ACTIVÉE • {serialCode}
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            FOOTER
            ═══════════════════════════════════════════════════════════════ */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="fixed bottom-0 left-0 right-0 py-6 px-6"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-center">
            <p className="font-mono text-[8px] tracking-[0.3em] uppercase text-[#FDFCFB]/15">
              POWERED BY I-WASP • L'ART DE LA PRÉSENCE
            </p>
          </div>
        </motion.footer>
      </div>
    </>
  );
};

export default Activation;
