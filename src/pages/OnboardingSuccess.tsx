/**
 * OnboardingSuccess - Success page after card creation
 * iWasp Style - Clean, celebratory, with auto-redirect
 */

import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle2, ArrowRight, Share2, ExternalLink, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import confetti from "canvas-confetti";

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
        colors: ['#FFC700', '#FFD700', '#FFFFFF']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ['#FFC700', '#FFD700', '#FFFFFF']
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
    <div className="min-h-dvh flex flex-col items-center justify-center p-6 bg-[#0B0B0B] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#FFC700]/15 rounded-full blur-[150px]" />

      <div className="relative z-10 text-center max-w-md w-full">
        {/* Success Icon */}
        <div className="relative mb-8 inline-block">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FFC700] to-[#FFD700] flex items-center justify-center shadow-xl shadow-[#FFC700]/30 animate-scale-in">
            <CheckCircle2 className="w-12 h-12 text-[#0B0B0B]" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#FFC700]/20 flex items-center justify-center animate-bounce">
            <Sparkles className="w-4 h-4 text-[#FFC700]" />
          </div>
        </div>

        {/* Success Messages */}
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 animate-fade-in">
          Ton profil NFC est prêt.
        </h1>
        
        <p className="text-xl text-[#E5E5E5]/70 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          Commence à partager en un geste.
        </p>

        {/* Card Name Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1F1F1F] border border-[#E5E5E5]/10 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse" />
          <span className="text-[#E5E5E5]">{name}</span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          {slug && (
            <a 
              href={`/c/${slug}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full p-4 rounded-xl bg-[#1F1F1F] border border-[#E5E5E5]/10 hover:border-[#FFC700]/30 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#FFC700]/20 flex items-center justify-center">
                  <ExternalLink className="w-5 h-5 text-[#FFC700]" />
                </div>
                <span className="text-white font-medium">Voir ma carte</span>
              </div>
              <ArrowRight className="w-5 h-5 text-[#E5E5E5]/50 group-hover:text-[#FFC700] transition-colors" />
            </a>
          )}

          <button 
            onClick={handleCopyLink}
            className="flex items-center justify-between w-full p-4 rounded-xl bg-[#1F1F1F] border border-[#E5E5E5]/10 hover:border-[#FFC700]/30 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#E5E5E5]/10 flex items-center justify-center">
                <Share2 className="w-5 h-5 text-[#E5E5E5]/70" />
              </div>
              <span className="text-white font-medium">Partager le lien</span>
            </div>
            <ArrowRight className="w-5 h-5 text-[#E5E5E5]/50 group-hover:text-[#FFC700] transition-colors" />
          </button>
        </div>

        {/* Go to Dashboard CTA */}
        <button
          onClick={handleGoToDashboard}
          className="w-full py-4 rounded-xl font-bold text-lg text-[#0B0B0B] bg-[#FFC700] hover:bg-[#FFC700]/90 transition-all flex items-center justify-center gap-2 animate-fade-in"
          style={{ animationDelay: '0.4s' }}
        >
          Accéder au dashboard
          <ArrowRight size={20} />
        </button>

        {/* Auto-redirect countdown */}
        <p className="text-[#E5E5E5]/40 text-sm mt-6 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          Redirection automatique dans {countdown}s...
        </p>
      </div>

      {/* Footer */}
      <p className="absolute bottom-6 text-[#E5E5E5]/30 text-xs tracking-wider">
        Powered by IWASP
      </p>
    </div>
  );
}
