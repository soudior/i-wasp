/**
 * OnboardingSuccess - Success page after card creation
 * Stealth Luxury Style - Clean, celebratory, with auto-redirect
 */

import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle2, ArrowRight, Share2, ExternalLink, Sparkles } from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";

// Stealth Luxury Colors
const COLORS = {
  bg: "#050807",
  bgCard: "#0A0D0C",
  accent: "#A5A9B4",
  accentLight: "#D1D5DB",
  text: "#F9FAFB",
  textMuted: "rgba(249, 250, 251, 0.7)",
  textDim: "rgba(249, 250, 251, 0.4)",
  border: "rgba(165, 169, 180, 0.15)",
  borderHover: "rgba(165, 169, 180, 0.4)",
};

export default function OnboardingSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const slug = searchParams.get("slug");
  const name = searchParams.get("name") || "Votre carte";
  const [countdown, setCountdown] = useState(5);

  const cardUrl = slug ? `${window.location.origin}/c/${slug}` : "";

  // Trigger confetti on mount
  useEffect(() => {
    const duration = 2000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ['#A5A9B4', '#D1D5DB', '#FFFFFF']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ['#A5A9B4', '#D1D5DB', '#FFFFFF']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  // Auto-redirect countdown
  useEffect(() => {
    if (countdown <= 0) {
      navigate("/dashboard");
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  const handleCopyLink = () => {
    if (cardUrl) {
      navigator.clipboard.writeText(cardUrl);
      toast.success("Lien copié !");
    }
  };

  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div 
      className="min-h-dvh flex flex-col items-center justify-center p-6 relative overflow-hidden"
      style={{ backgroundColor: COLORS.bg }}
    >
      {/* Background glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-[150px]"
        style={{ backgroundColor: `${COLORS.accent}15` }}
      />

      <div className="relative z-10 text-center max-w-md w-full">
        {/* Success Icon */}
        <div className="relative mb-8 inline-block">
          <div 
            className="w-24 h-24 rounded-full flex items-center justify-center shadow-xl animate-scale-in"
            style={{ 
              background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentLight})`,
              boxShadow: `0 20px 40px ${COLORS.accent}30`
            }}
          >
            <CheckCircle2 className="w-12 h-12" style={{ color: COLORS.bg }} />
          </div>
          <div 
            className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center animate-bounce"
            style={{ backgroundColor: `${COLORS.accent}20` }}
          >
            <Sparkles className="w-4 h-4" style={{ color: COLORS.accent }} />
          </div>
        </div>

        {/* Success Messages */}
        <h1 
          className="text-3xl sm:text-4xl font-bold mb-3 animate-fade-in"
          style={{ color: COLORS.text }}
        >
          Ton profil NFC est prêt.
        </h1>
        
        <p 
          className="text-xl mb-8 animate-fade-in" 
          style={{ color: COLORS.textMuted, animationDelay: '0.1s' }}
        >
          Commence à partager en un geste.
        </p>

        {/* Card Name Badge */}
        <div 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 animate-fade-in" 
          style={{ 
            backgroundColor: COLORS.bgCard, 
            border: `1px solid ${COLORS.border}`,
            animationDelay: '0.2s' 
          }}
        >
          <div className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse" />
          <span style={{ color: COLORS.text }}>{name}</span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          {slug && (
            <a 
              href={`/c/${slug}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full p-4 rounded-xl transition-all group"
              style={{ 
                backgroundColor: COLORS.bgCard, 
                border: `1px solid ${COLORS.border}` 
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = COLORS.borderHover}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = COLORS.border}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${COLORS.accent}20` }}
                >
                  <ExternalLink className="w-5 h-5" style={{ color: COLORS.accent }} />
                </div>
                <span className="font-medium" style={{ color: COLORS.text }}>Voir ma carte</span>
              </div>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" style={{ color: COLORS.accent }} />
            </a>
          )}

          <button 
            onClick={handleCopyLink}
            className="flex items-center justify-between w-full p-4 rounded-xl transition-all group"
            style={{ 
              backgroundColor: COLORS.bgCard, 
              border: `1px solid ${COLORS.border}` 
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = COLORS.borderHover}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = COLORS.border}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${COLORS.text}10` }}
              >
                <Share2 className="w-5 h-5" style={{ color: COLORS.textMuted }} />
              </div>
              <span className="font-medium" style={{ color: COLORS.text }}>Partager le lien</span>
            </div>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" style={{ color: COLORS.accent }} />
          </button>
        </div>

        {/* Go to Dashboard CTA */}
        <button
          onClick={handleGoToDashboard}
          className="w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 animate-fade-in"
          style={{ 
            background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentLight})`,
            color: COLORS.bg,
            animationDelay: '0.4s' 
          }}
        >
          Accéder au dashboard
          <ArrowRight size={20} />
        </button>

        {/* Auto-redirect countdown */}
        <p 
          className="text-sm mt-6 animate-fade-in" 
          style={{ color: COLORS.textDim, animationDelay: '0.5s' }}
        >
          Redirection automatique dans {countdown}s...
        </p>
      </div>

      {/* Footer - i-wasp.com CORPORATION */}
      <a 
        href="https://i-wasp.com"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-6 flex items-center gap-1.5 hover:opacity-100 transition-opacity"
        style={{ opacity: 0.6 }}
      >
        <span className="text-xs font-semibold" style={{ color: COLORS.text, letterSpacing: "0.08em" }}>i-wasp.com</span>
        <span className="text-[10px] font-medium uppercase" style={{ color: COLORS.textDim, letterSpacing: "0.12em" }}>CORPORATION</span>
      </a>
    </div>
  );
}
