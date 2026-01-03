/**
 * AI Coach Panel - Personalized recommendations
 * Analyzes scan data and engagement to provide actionable tips
 * Premium Glassmorphism Noir & Or design
 */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Lightbulb,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  RefreshCw,
  Zap,
  Camera,
  MapPin,
  Clock,
  Target,
} from "lucide-react";
import type { ScanWithCard } from "@/hooks/useScans";
import type { LeadWithCard } from "@/hooks/useLeads";

interface AICoachPanelProps {
  scans: ScanWithCard[];
  leads: LeadWithCard[];
  cards: any[];
  isPremium: boolean;
}

interface Insight {
  id: string;
  type: "success" | "warning" | "tip" | "action";
  title: string;
  message: string;
  action?: {
    label: string;
    path: string;
  };
  icon: React.ReactNode;
  priority: number;
}

export function AICoachPanel({ scans, leads, cards, isPremium }: AICoachPanelProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Generate AI insights based on data
  const insights = useMemo<Insight[]>(() => {
    const result: Insight[] = [];
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Calculate metrics
    const weeklyScans = scans.filter(s => new Date(s.scanned_at) >= oneWeekAgo).length;
    const dailyScans = scans.filter(s => new Date(s.scanned_at) >= oneDayAgo).length;
    const totalScans = scans.length;
    const totalLeads = leads.length;
    const conversionRate = totalScans > 0 ? (totalLeads / totalScans) * 100 : 0;
    const hotLeads = leads.filter(l => l.lead_score >= 51).length;

    // Card-specific analysis
    const activeCards = cards.filter(c => c.is_active);
    const cardsWithStories = cards.filter(c => c.blocks?.some?.((b: any) => b.type === "stories"));

    // Low scan warning
    if (weeklyScans < 5 && totalScans > 0) {
      result.push({
        id: "low-scans",
        type: "warning",
        title: "Taux de scan en baisse",
        message: "Seulement " + weeklyScans + " scans cette semaine. Essayez de placer votre carte plus près de la caisse ou dans un endroit visible.",
        icon: <TrendingDown className="h-4 w-4" />,
        priority: 1,
      });
    }

    // No recent scans
    if (dailyScans === 0 && totalScans > 10) {
      result.push({
        id: "no-daily-scans",
        type: "action",
        title: "Aucun scan aujourd'hui",
        message: "Partagez votre lien sur vos réseaux sociaux ou envoyez-le par WhatsApp pour générer plus de contacts.",
        action: { label: "Copier le lien", path: "/dashboard" },
        icon: <AlertCircle className="h-4 w-4" />,
        priority: 2,
      });
    }

    // Good conversion rate
    if (conversionRate >= 15) {
      result.push({
        id: "great-conversion",
        type: "success",
        title: "Excellente conversion !",
        message: `${conversionRate.toFixed(1)}% de vos visiteurs deviennent des leads. Continuez ainsi !`,
        icon: <CheckCircle2 className="h-4 w-4" />,
        priority: 5,
      });
    } else if (conversionRate < 5 && totalScans > 20) {
      result.push({
        id: "low-conversion",
        type: "tip",
        title: "Améliorez votre conversion",
        message: "Ajoutez une offre spéciale ou un call-to-action plus visible sur votre carte pour capturer plus de leads.",
        action: { label: "Éditer ma carte", path: "/create" },
        icon: <Target className="h-4 w-4" />,
        priority: 2,
      });
    }

    // Hot leads notification
    if (hotLeads > 0) {
      result.push({
        id: "hot-leads",
        type: "action",
        title: `${hotLeads} lead${hotLeads > 1 ? "s" : ""} chaud${hotLeads > 1 ? "s" : ""} à contacter`,
        message: "Ces prospects ont un score élevé. Contactez-les rapidement pour maximiser vos chances de conversion !",
        action: { label: "Voir les leads", path: "/leads" },
        icon: <Zap className="h-4 w-4" />,
        priority: 1,
      });
    }

    // Story suggestion
    if (cardsWithStories.length === 0 && isPremium) {
      result.push({
        id: "add-stories",
        type: "tip",
        title: "Stories 24h non utilisées",
        message: "Les Stories augmentent l'engagement de 40%. Publiez une photo ou vidéo pour attirer plus de visiteurs.",
        action: { label: "Ajouter une Story", path: "/dashboard" },
        icon: <Camera className="h-4 w-4" />,
        priority: 3,
      });
    }

    // Location tip
    const cardsWithLocation = cards.filter(c => c.location);
    if (cardsWithLocation.length === 0 && cards.length > 0) {
      result.push({
        id: "add-location",
        type: "tip",
        title: "Ajoutez votre localisation",
        message: "Les cartes avec adresse Maps génèrent 25% plus de visites en boutique.",
        action: { label: "Ajouter l'adresse", path: "/create" },
        icon: <MapPin className="h-4 w-4" />,
        priority: 4,
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
          type: "success",
          title: "Heure de pointe identifiée",
          message: `La majorité de vos scans ont lieu vers ${peakHour[0]}h. Optimisez votre présence à ce moment.`,
          icon: <Clock className="h-4 w-4" />,
          priority: 6,
        });
      }
    }

    // Default encouraging message
    if (result.length === 0) {
      result.push({
        id: "keep-going",
        type: "success",
        title: "Vous êtes sur la bonne voie !",
        message: "Continuez à partager votre carte NFC pour générer plus de leads qualifiés.",
        icon: <Sparkles className="h-4 w-4" />,
        priority: 10,
      });
    }

    // Sort by priority
    return result.sort((a, b) => a.priority - b.priority).slice(0, 3);
  }, [scans, leads, cards, isPremium]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const getTypeStyles = (type: Insight["type"]) => {
    switch (type) {
      case "success":
        return "border-emerald-500/30 bg-emerald-500/5";
      case "warning":
        return "border-amber-500/30 bg-amber-500/5";
      case "action":
        return "border-primary/30 bg-primary/5";
      case "tip":
        return "border-violet-500/30 bg-violet-500/5";
      default:
        return "border-border/50";
    }
  };

  const getTypeIconBg = (type: Insight["type"]) => {
    switch (type) {
      case "success":
        return "bg-emerald-500/20 text-emerald-500";
      case "warning":
        return "bg-amber-500/20 text-amber-500";
      case "action":
        return "bg-primary/20 text-primary";
      case "tip":
        return "bg-violet-500/20 text-violet-500";
      default:
        return "bg-secondary text-muted-foreground";
    }
  };

  return (
    <Card className="card-glass border-border/50 backdrop-blur-xl overflow-hidden">
      {/* Header with gold accent */}
      <div className="p-5 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center">
              <Lightbulb className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                Coach IA
                <Badge variant="secondary" className="bg-amber-500/20 text-amber-500 border-amber-500/30 text-[10px] px-1.5">
                  PRO
                </Badge>
              </h3>
              <p className="text-xs text-muted-foreground">Conseils personnalisés en temps réel</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-8 w-8 rounded-full"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Insights */}
      <CardContent className="p-4 space-y-3">
        <AnimatePresence mode="popLayout">
          {insights.map((insight, index) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl border ${getTypeStyles(insight.type)} transition-all duration-300 hover:scale-[1.01]`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg ${getTypeIconBg(insight.type)} flex items-center justify-center shrink-0`}>
                  {insight.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground mb-1">
                    {insight.title}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {insight.message}
                  </p>
                  {insight.action && (
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 mt-2 text-xs text-primary hover:text-primary/80"
                      onClick={() => window.location.href = insight.action!.path}
                    >
                      {insight.action.label}
                      <ChevronRight className="h-3 w-3 ml-0.5" />
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
