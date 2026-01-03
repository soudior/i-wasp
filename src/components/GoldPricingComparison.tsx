/**
 * Gold Pricing Comparison Component
 * Tableau comparatif Or & Noir - Gratuit vs GOLD
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
      return <span className="text-sm">{value}</span>;
    }
    return value ? (
      <Check className="w-5 h-5 text-amber-400" />
    ) : (
      <X className="w-5 h-5 text-zinc-600" />
    );
  };

  return (
    <section className="py-20 px-4 bg-black relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-amber-500/10 rounded-full blur-[100px]" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-600/10 border border-amber-500/30 text-amber-400 text-sm font-medium mb-6">
            <Crown className="w-4 h-4" />
            Abonnement Premium
          </div>
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-4">
            i-wasp <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">GOLD</span>
          </h2>
          <p className="text-zinc-400 text-lg">
            L'Influence Sans Limites
          </p>
          <p className="text-amber-400/60 text-sm mt-2 italic">
            L'investissement dans votre croissance la plus rapide
          </p>
        </div>

        {/* Comparison Table */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {/* Header Row */}
          <div className="col-span-1" />
          <div className="text-center p-4 rounded-t-2xl bg-zinc-900/50 border border-zinc-800">
            <h3 className="text-zinc-400 font-medium">Gratuit</h3>
            <p className="text-2xl font-bold text-white mt-1">0€</p>
            <p className="text-zinc-500 text-xs">Fonctions de base</p>
          </div>
          <div className="text-center p-4 rounded-t-2xl bg-gradient-to-b from-amber-500/20 to-amber-600/5 border-2 border-amber-500/50 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-amber-500 to-yellow-400 text-black text-xs font-bold rounded-full">
              RECOMMANDÉ
            </div>
            <h3 className="text-amber-400 font-bold flex items-center justify-center gap-2">
              <Crown className="w-4 h-4" />
              GOLD
            </h3>
            <p className="text-2xl font-bold text-white mt-1">
              49€<span className="text-sm text-zinc-400 font-normal">/an</span>
            </p>
            <p className="text-amber-400/60 text-xs">Puissance maximale</p>
          </div>

          {/* Feature Rows */}
          {planFeatures.map((feature, index) => (
            <>
              <div 
                key={`feature-${index}`}
                className={`flex items-center gap-3 p-4 ${
                  index % 2 === 0 ? 'bg-zinc-900/30' : 'bg-zinc-900/10'
                } ${index === planFeatures.length - 1 ? 'rounded-bl-2xl' : ''}`}
              >
                <span className="text-amber-400/60">{feature.icon}</span>
                <span className="text-white text-sm">{feature.name}</span>
              </div>
              <div 
                key={`free-${index}`}
                className={`flex items-center justify-center p-4 border-x border-zinc-800 ${
                  index % 2 === 0 ? 'bg-zinc-900/30' : 'bg-zinc-900/10'
                } ${index === planFeatures.length - 1 ? 'rounded-b-none' : ''}`}
              >
                {renderValue(feature.free)}
              </div>
              <div 
                key={`gold-${index}`}
                className={`flex items-center justify-center p-4 border-x-2 border-amber-500/30 ${
                  index % 2 === 0 ? 'bg-amber-500/5' : 'bg-amber-500/[0.02]'
                } ${index === planFeatures.length - 1 ? 'rounded-b-none' : ''}`}
              >
                {renderValue(feature.gold)}
              </div>
            </>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="grid md:grid-cols-2 gap-4 mt-8">
          <Button 
            variant="outline"
            size="lg"
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 py-6"
            onClick={() => navigate("/order/type")}
          >
            Commencer Gratuitement
          </Button>
          <Button 
            size="lg"
            className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:via-yellow-500 hover:to-amber-600 text-black font-bold py-6 shadow-lg shadow-amber-500/30 gap-2"
            onClick={() => navigate("/order/type")}
          >
            <Crown className="w-5 h-5" />
            Rejoindre l'Empire i-wasp
          </Button>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-6 mt-10 text-zinc-500 text-xs">
          <span className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400/50" />
            Paiement sécurisé
          </span>
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4 text-amber-400/50" />
            Annulation à tout moment
          </span>
          <span className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400/50" />
            Activation instantanée
          </span>
        </div>
      </div>
    </section>
  );
}
