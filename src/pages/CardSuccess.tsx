/**
 * CardSuccess - Celebration screen after card validation
 * Premium IWASP experience with confetti animation
 */

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ExternalLink,
  MessageCircle,
  Edit2,
  Sparkles,
  CheckCircle2,
  Lightbulb,
  Share2,
  Copy,
  Phone,
  Mail,
  MapPin
} from "lucide-react";
import { toast } from "sonner";
import iwaspLogo from "@/assets/iwasp-logo-white.png";

// Demo data - in production this would come from context/API
interface CardData {
  firstName: string;
  lastName: string;
  title?: string;
  company?: string;
  logoUrl?: string | null;
  photoUrl?: string | null;
  slug: string;
  phone?: string;
  email?: string;
  location?: string;
}

export default function CardSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const confettiTriggered = useRef(false);
  const [copied, setCopied] = useState(false);

  // Get card data from URL params or localStorage
  const [cardData, setCardData] = useState<CardData>({
    firstName: "Votre",
    lastName: "Carte",
    title: "",
    company: "",
    logoUrl: null,
    photoUrl: null,
    slug: "demo",
    phone: "",
    email: "",
    location: ""
  });

  useEffect(() => {
    // Try to get data from localStorage (guest card)
    const stored = localStorage.getItem("iwasp_guest_card");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCardData({
          firstName: parsed.first_name || "Votre",
          lastName: parsed.last_name || "Carte",
          title: parsed.title,
          company: parsed.company,
          logoUrl: parsed.logo_url,
          photoUrl: parsed.photo_url,
          slug: `${parsed.first_name?.toLowerCase() || "demo"}-${parsed.last_name?.toLowerCase() || "card"}`,
          phone: parsed.phone,
          email: parsed.email,
          location: ""
        });
      } catch {
        // Ignore
      }
    }
  }, []);

  // Trigger confetti on mount
  useEffect(() => {
    if (confettiTriggered.current) return;
    confettiTriggered.current = true;

    // Initial burst
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#F59E0B', '#FBBF24', '#FCD34D', '#FFFFFF', '#1A1A1A']
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#F59E0B', '#FBBF24', '#FCD34D', '#FFFFFF', '#1A1A1A']
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const profileUrl = `https://i-wasp.com/card/${cardData.slug}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      toast.success("Lien copié !");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Impossible de copier le lien");
    }
  };

  const handleShareWhatsApp = () => {
    const text = `Découvrez mon profil i-wasp : ${profileUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleTestLink = () => {
    window.open(profileUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0B] via-[#111113] to-[#0A0A0B] flex flex-col">
      {/* Header */}
      <header className="py-6 px-4">
        <div className="flex justify-center">
          <img src={iwaspLogo} alt="IWASP" className="h-6 opacity-70" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-10">
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
          className="mb-8"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-[0_0_60px_rgba(245,158,11,0.3)]">
            <CheckCircle2 className="h-10 w-10 text-black" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Votre profil i-wasp est en ligne ! <span className="text-amber-400">✨</span>
          </h1>
          <p className="text-lg text-white/60 max-w-md mx-auto">
            Votre identité numérique est désormais prête à être partagée avec le monde.
          </p>
        </motion.div>

        {/* Card Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="w-full max-w-sm mb-10"
        >
          <Card className="bg-[#1A1A1A] border-white/10 overflow-hidden shadow-2xl">
            <CardContent className="p-6">
              {/* Logo or Company */}
              {cardData.logoUrl ? (
                <div className="flex justify-center mb-4">
                  <img 
                    src={cardData.logoUrl} 
                    alt="Logo" 
                    className="max-h-[60px] w-auto object-contain"
                  />
                </div>
              ) : cardData.company && (
                <div className="flex justify-center mb-4">
                  <Badge variant="secondary" className="text-xs">
                    {cardData.company}
                  </Badge>
                </div>
              )}

              {/* Profile */}
              <div className="text-center">
                {/* Avatar */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400/20 to-amber-600/10 mx-auto mb-3 flex items-center justify-center border border-amber-400/30">
                  {cardData.photoUrl ? (
                    <img 
                      src={cardData.photoUrl} 
                      alt="Photo" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-xl font-bold text-white/80">
                      {cardData.firstName.charAt(0)}{cardData.lastName.charAt(0)}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-white">
                  {cardData.firstName} {cardData.lastName}
                </h3>
                {(cardData.title || cardData.company) && (
                  <p className="text-sm text-white/50 mt-1">
                    {cardData.title}{cardData.title && cardData.company && " · "}{cardData.company}
                  </p>
                )}
              </div>

              {/* Mini action buttons */}
              <div className="flex justify-center gap-3 mt-5">
                {cardData.phone && (
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                    <Phone className="h-4 w-4 text-green-400" />
                  </div>
                )}
                {cardData.email && (
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                    <Mail className="h-4 w-4 text-blue-400" />
                  </div>
                )}
                {cardData.location && (
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-red-400" />
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="text-center mt-5">
                <p className="text-[10px] text-white/30">Powered by IWASP</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="w-full max-w-sm space-y-3"
        >
          {/* Primary CTA */}
          <Button
            size="lg"
            onClick={handleTestLink}
            className="w-full h-14 text-lg font-semibold rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-[0_0_30px_rgba(245,158,11,0.3)] gap-2"
          >
            <ExternalLink className="h-5 w-5" />
            Tester mon lien
          </Button>

          {/* WhatsApp Share */}
          <Button
            size="lg"
            variant="outline"
            onClick={handleShareWhatsApp}
            className="w-full h-14 rounded-2xl border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/20 hover:text-green-300 gap-2"
          >
            <MessageCircle className="h-5 w-5" />
            Partager sur WhatsApp
          </Button>

          {/* Copy Link */}
          <Button
            variant="ghost"
            onClick={handleCopyLink}
            className="w-full h-12 rounded-xl text-white/60 hover:text-white hover:bg-white/5 gap-2"
          >
            {copied ? <CheckCircle2 className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
            {copied ? "Lien copié !" : "Copier le lien"}
          </Button>
        </motion.div>

        {/* Pro Tip Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="w-full max-w-sm mt-10"
        >
          <Card className="bg-amber-500/10 border-amber-500/20">
            <CardContent className="p-4 flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <Lightbulb className="h-5 w-5 text-amber-400" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-amber-400 mb-1">
                  Conseil Pro
                </p>
                <p className="text-xs text-white/60 leading-relaxed">
                  Pour une connexion optimale, placez votre carte i-wasp près du haut de l'iPhone ou au centre de l'Android de votre client.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Edit Profile Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate("/create")}
            className="text-white/40 hover:text-white/60 gap-2"
          >
            <Edit2 className="h-4 w-4" />
            Modifier mon profil
          </Button>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center">
        <p className="text-xs text-white/20">
          © {new Date().getFullYear()} IWASP · Tap. Connect. Empower.
        </p>
      </footer>
    </div>
  );
}
