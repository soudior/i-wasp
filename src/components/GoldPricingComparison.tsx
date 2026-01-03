/**
 * Pricing Comparison Component - SaaS Professional
 * Clean table, no decorative effects
 * Style: Stripe / Linear
 */

import { Check, X, Crown, Zap, Bell, BarChart3, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface PlanFeature {
  name: string;
  free: boolean | string;
  gold: boolean | string;
  icon: React.ReactNode;
}

const planFeatures: PlanFeature[] = [
  { 
    name: "Carte NFC Premium", 
    free: true, 
    gold: true, 
    icon: <Shield className="w-4 h-4" /> 
  },
  { 
    name: "Profil digital personnalisé", 
    free: "Limité", 
    gold: "Illimité", 
    icon: <Zap className="w-4 h-4" /> 
  },
  { 
    name: "Stories 24h dynamiques", 
    free: "3 / mois", 
    gold: "Illimitées", 
    icon: <Clock className="w-4 h-4" /> 
  },
  { 
    name: "Dashboard Analytics", 
    free: false, 
    gold: true, 
    icon: <BarChart3 className="w-4 h-4" /> 
  },
  { 
    name: "Capture de Leads CRM", 
    free: false, 
    gold: true, 
    icon: <Crown className="w-4 h-4" /> 
  },
  { 
    name: "Push Notifications", 
    free: false, 
    gold: true, 
    icon: <Bell className="w-4 h-4" /> 
  },
  { 
    name: "Badge Certifié Or", 
    free: false, 
    gold: true, 
    icon: <Crown className="w-4 h-4" /> 
  },
  { 
    name: "Coach IA personnalisé", 
    free: false, 
    gold: true, 
    icon: <Zap className="w-4 h-4" /> 
  },
];

export function GoldPricingComparison() {
  const navigate = useNavigate();

  const renderValue = (value: boolean | string) => {
    if (typeof value === "string") {
      return <span className="text-sm text-foreground">{value}</span>;
    }
    return value ? (
      <Check className="w-5 h-5 text-primary" />
    ) : (
      <X className="w-5 h-5 text-muted-foreground/40" />
    );
  };

  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card border border-border text-sm font-medium text-muted-foreground mb-6">
            <Crown className="w-4 h-4 text-primary" />
            Abonnement Premium
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
            i-wasp <span className="text-primary">GOLD</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            L'Influence Sans Limites
          </p>
        </div>

        {/* Comparison Table */}
        <div className="rounded-xl overflow-hidden border border-border">
          {/* Header Row */}
          <div className="grid grid-cols-3 bg-card">
            <div className="p-4 font-medium text-muted-foreground">Fonctionnalité</div>
            <div className="p-4 text-center font-medium text-foreground border-x border-border">
              <h3>Gratuit</h3>
              <p className="text-2xl font-semibold mt-1">0€</p>
            </div>
            <div className="p-4 text-center font-medium text-foreground bg-primary/5">
              <h3 className="text-primary flex items-center justify-center gap-2">
                <Crown className="w-4 h-4" />
                GOLD
              </h3>
              <p className="text-2xl font-semibold mt-1">
                49€<span className="text-sm text-muted-foreground font-normal">/an</span>
              </p>
            </div>
          </div>

          {/* Feature Rows */}
          {planFeatures.map((feature, index) => (
            <div 
              key={index}
              className={`grid grid-cols-3 ${index % 2 === 0 ? 'bg-muted/30' : 'bg-background'}`}
            >
              <div className="flex items-center gap-3 p-4">
                <span className="text-muted-foreground">{feature.icon}</span>
                <span className="text-foreground text-sm">{feature.name}</span>
              </div>
              <div className="flex items-center justify-center p-4 border-x border-border">
                {renderValue(feature.free)}
              </div>
              <div className="flex items-center justify-center p-4 bg-primary/5">
                {renderValue(feature.gold)}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="grid md:grid-cols-2 gap-4 mt-8">
          <Button 
            variant="outline"
            size="lg"
            className="py-6 border-border text-foreground hover:bg-muted"
            onClick={() => navigate("/order/type")}
          >
            Commencer Gratuitement
          </Button>
          <Button 
            size="lg"
            className="py-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2"
            onClick={() => navigate("/order/type")}
          >
            <Crown className="w-5 h-5" />
            Passer GOLD
          </Button>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-6 mt-10 text-muted-foreground text-xs">
          <span className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Paiement sécurisé
          </span>
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            Annulation à tout moment
          </span>
          <span className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Activation instantanée
          </span>
        </div>
      </div>
    </section>
  );
}
