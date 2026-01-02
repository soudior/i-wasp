/**
 * SubscriptionCard - Carte affichant le plan actuel et option upgrade
 * Style Apple Cupertino Premium
 */

import { motion } from "framer-motion";
import { Crown, Check, Lock, Zap, MessageCircle, Wifi, BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSubscription } from "@/hooks/useSubscription";

const PREMIUM_FEATURES = [
  { icon: MessageCircle, label: "Stories Professionnelles", description: "Partagez des promos en temps réel" },
  { icon: Wifi, label: "Partage WiFi", description: "QR Code WiFi pour vos clients" },
  { icon: BarChart3, label: "Statistiques avancées", description: "Analytics détaillées" },
  { icon: Zap, label: "Templates illimités", description: "Accès à tous les designs" },
];

interface SubscriptionCardProps {
  onUpgradeRequest?: () => void;
}

export function SubscriptionCard({ onUpgradeRequest }: SubscriptionCardProps) {
  const { subscription, isPremium, isLoading } = useSubscription();

  if (isLoading) {
    return (
      <Card className="p-6 animate-pulse">
        <div className="h-6 bg-muted rounded w-1/3 mb-4" />
        <div className="h-4 bg-muted rounded w-2/3" />
      </Card>
    );
  }

  const handleUpgradeClick = () => {
    if (onUpgradeRequest) {
      onUpgradeRequest();
    } else {
      // Default: open WhatsApp with upgrade request
      const message = encodeURIComponent(
        "Bonjour ! Je souhaite passer au plan Premium i-wasp à 99 DH/mois. Merci de me contacter pour finaliser l'abonnement."
      );
      window.open(`https://wa.me/212XXXXXXXXX?text=${message}`, "_blank");
    }
  };

  if (isPremium) {
    return (
      <Card className="relative overflow-hidden border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-orange-500/10">
        {/* Premium glow effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/20 rounded-full blur-3xl" />
        
        <div className="relative p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg font-bold text-foreground">
                    Plan Premium
                  </h3>
                  <Badge className="bg-amber-500 text-white border-0">
                    Actif
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Toutes les fonctionnalités débloquées
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-display text-2xl font-bold text-foreground">99 DH</p>
              <p className="text-xs text-muted-foreground">/mois</p>
            </div>
          </div>

          {/* Active features */}
          <div className="grid grid-cols-2 gap-3">
            {PREMIUM_FEATURES.map((feature) => (
              <div
                key={feature.label}
                className="flex items-center gap-2 p-2 rounded-xl bg-white/50 dark:bg-white/5"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <feature.icon className="h-4 w-4 text-amber-600" />
                </div>
                <span className="text-sm font-medium text-foreground">{feature.label}</span>
              </div>
            ))}
          </div>

          {subscription?.expires_at && (
            <p className="mt-4 text-xs text-muted-foreground text-center">
              Renouvellement le {new Date(subscription.expires_at).toLocaleDateString("fr-FR")}
            </p>
          )}
        </div>
      </Card>
    );
  }

  // Free plan
  return (
    <Card className="relative overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center">
              <Zap className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg font-bold text-foreground">
                  Plan Gratuit
                </h3>
                <Badge variant="secondary">Actuel</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Fonctionnalités de base
              </p>
            </div>
          </div>
        </div>

        {/* Upgrade prompt */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 mb-4">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shrink-0">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">
                Passez au Premium
              </h4>
              <p className="text-sm text-muted-foreground">
                Débloquez les Stories, WiFi et statistiques avancées
              </p>
            </div>
          </div>

          {/* Locked features preview */}
          <div className="space-y-2 mb-4">
            {PREMIUM_FEATURES.map((feature) => (
              <div
                key={feature.label}
                className="flex items-center justify-between p-2 rounded-xl bg-white/50 dark:bg-white/5"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                    <feature.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-foreground">{feature.label}</span>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
                <Lock className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </div>

          <Button 
            onClick={handleUpgradeClick}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0 gap-2"
          >
            <Crown className="h-4 w-4" />
            Passer au Premium · 99 DH/mois
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          Paiement sécurisé · Annulation à tout moment
        </p>
      </div>
    </Card>
  );
}

/**
 * FeatureGate - Bloque l'accès aux fonctionnalités premium
 */
interface FeatureGateProps {
  feature: "stories" | "wifi" | "stats" | "templates";
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function FeatureGate({ feature, children, fallback }: FeatureGateProps) {
  const { isPremium, isLoading } = useSubscription();

  if (isLoading) {
    return <div className="animate-pulse bg-muted rounded-xl h-32" />;
  }

  if (!isPremium) {
    if (fallback) {
      return <>{fallback}</>;
    }

    const featureLabels = {
      stories: "Stories Professionnelles",
      wifi: "Partage WiFi",
      stats: "Statistiques avancées",
      templates: "Templates illimités",
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-orange-500/5 text-center"
      >
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-amber-500/10 flex items-center justify-center">
          <Lock className="h-6 w-6 text-amber-500" />
        </div>
        <h3 className="font-semibold text-foreground mb-1">
          {featureLabels[feature]}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Cette fonctionnalité est réservée aux membres Premium
        </p>
        <Button
          size="sm"
          className="bg-amber-500 hover:bg-amber-600 text-white gap-2"
          onClick={() => {
            const message = encodeURIComponent(
              `Bonjour ! Je souhaite passer au plan Premium i-wasp pour accéder à ${featureLabels[feature]}.`
            );
            window.open(`https://wa.me/212XXXXXXXXX?text=${message}`, "_blank");
          }}
        >
          <Crown className="h-4 w-4" />
          Passer au Premium
        </Button>
      </motion.div>
    );
  }

  return <>{children}</>;
}
