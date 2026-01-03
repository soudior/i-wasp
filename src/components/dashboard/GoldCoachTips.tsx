/**
 * Gold Coach Tips - AI Intelligence
 * Dynamic tips with gold styling
 * Conseil du jour basé sur les données
 */

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Lightbulb,
  Crown,
  ChevronRight,
  RefreshCw,
  Sparkles,
  Target,
  Camera,
  TrendingUp,
  MessageCircle,
  Clock,
  Zap,
} from "lucide-react";
import type { ScanWithCard } from "@/hooks/useScans";
import type { LeadWithCard } from "@/hooks/useLeads";

interface GoldCoachTipsProps {
  scans: ScanWithCard[];
  leads: LeadWithCard[];
  cards: any[];
}

interface CoachTip {
  id: string;
  icon: React.ReactNode;
  title: string;
  message: string;
  action?: {
    label: string;
    path: string;
  };
  priority: number;
}

export function GoldCoachTips({ scans, leads, cards }: GoldCoachTipsProps) {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Generate AI tips based on data
  const tips = useMemo<CoachTip[]>(() => {
    const result: CoachTip[] = [];
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Calculate metrics
    const dailyScans = scans.filter(s => new Date(s.scanned_at) >= oneDayAgo).length;
    const weeklyScans = scans.filter(s => new Date(s.scanned_at) >= oneWeekAgo).length;
    const hotLeads = leads.filter(l => l.lead_score >= 51).length;
    const totalLeads = leads.length;
    const totalScans = scans.length;
    const conversionRate = totalScans > 0 ? (totalLeads / totalScans) * 100 : 0;

    // Story performance tip
    result.push({
      id: "story-tip",
      icon: <Camera className="h-5 w-5" />,
      title: "Conseil du jour",
      message: "Votre Story 24h actuelle génère beaucoup de clics vers WhatsApp. Postez-en une similaire pour booster vos ventes 📈",
      action: { label: "Ajouter une Story", path: "/dashboard" },
      priority: 1,
    });

    // Hot leads tip
    if (hotLeads > 0) {
      result.push({
        id: "hot-leads",
        icon: <Zap className="h-5 w-5" />,
        title: "Opportunité en or",
        message: `Vous avez ${hotLeads} lead${hotLeads > 1 ? "s" : ""} chaud${hotLeads > 1 ? "s" : ""} ! Contactez-les dans les 24h pour maximiser vos conversions.`,
        action: { label: "Voir les leads", path: "/leads" },
        priority: 1,
      });
    }

    // Low daily scans
    if (dailyScans === 0 && totalScans > 5) {
      result.push({
        id: "boost-scans",
        icon: <Target className="h-5 w-5" />,
        title: "Boost recommandé",
        message: "Aucun scan aujourd'hui. Partagez votre carte sur Instagram ou envoyez-la par WhatsApp pour relancer l'engagement !",
        priority: 2,
      });
    }

    // Good conversion
    if (conversionRate >= 15) {
      result.push({
        id: "great-conversion",
        icon: <TrendingUp className="h-5 w-5" />,
        title: "Performance Elite",
        message: `Votre taux de conversion de ${conversionRate.toFixed(1)}% est exceptionnel ! Vous êtes dans le Top 5% des utilisateurs i-wasp.`,
        priority: 3,
      });
    }

    // Peak hours insight
    if (scans.length > 10) {
      const hourCounts: Record<number, number> = {};
      scans.forEach(s => {
        const hour = new Date(s.scanned_at).getHours();
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      });
      const peakHour = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0];
      if (peakHour) {
        result.push({
          id: "peak-hours",
          icon: <Clock className="h-5 w-5" />,
          title: "Insight IA",
          message: `Vos clients scannent principalement à ${peakHour[0]}h. Publiez vos Stories à ce moment pour un impact maximum !`,
          priority: 4,
        });
      }
    }

    // WhatsApp tip
    result.push({
      id: "whatsapp-tip",
      icon: <MessageCircle className="h-5 w-5" />,
      title: "Astuce Pro",
      message: "Ajoutez un message d'accueil personnalisé sur WhatsApp. Les clients qui vous contactent via NFC convertissent 3x plus !",
      priority: 5,
    });

    return result.sort((a, b) => a.priority - b.priority);
  }, [scans, leads, cards]);

  // Auto-rotate tips
  useEffect(() => {
    if (tips.length <= 1) return;
    
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentTipIndex((prev) => (prev + 1) % tips.length);
        setIsAnimating(false);
      }, 300);
    }, 8000);

    return () => clearInterval(interval);
  }, [tips.length]);

  const currentTip = tips[currentTipIndex];

  const nextTip = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentTipIndex((prev) => (prev + 1) % tips.length);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <Card className="relative overflow-hidden card-glass border-amber-500/20 backdrop-blur-xl">
      {/* Gold accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600" />
      
      {/* Animated background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-amber-600/5" />
      
      <CardContent className="relative p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/30 to-amber-600/20 flex items-center justify-center">
              <Lightbulb className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
                Coach i-wasp
                <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-black border-0 text-[10px]">
                  <Sparkles className="h-3 w-3 mr-0.5" />
                  IA
                </Badge>
              </h3>
              <p className="text-sm text-muted-foreground">Intelligence personnalisée</p>
            </div>
          </div>

          {/* Navigation dots */}
          {tips.length > 1 && (
            <div className="flex items-center gap-2">
              {tips.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTipIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentTipIndex 
                      ? "bg-amber-500 w-4" 
                      : "bg-amber-500/30 hover:bg-amber-500/50"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Tip Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTip?.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isAnimating ? 0 : 1, y: isAnimating ? -10 : 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/30 to-amber-600/20 flex items-center justify-center shrink-0 text-amber-500">
                {currentTip?.icon}
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-amber-500 uppercase tracking-wider mb-2">
                  {currentTip?.title}
                </p>
                <p className="text-sm text-foreground leading-relaxed">
                  {currentTip?.message}
                </p>
                {currentTip?.action && (
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 mt-3 text-amber-500 hover:text-amber-400"
                    onClick={() => window.location.href = currentTip.action!.path}
                  >
                    {currentTip.action.label}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Next tip button */}
        {tips.length > 1 && (
          <div className="flex justify-center mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={nextTip}
              className="text-muted-foreground hover:text-amber-500 gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Prochain conseil
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
