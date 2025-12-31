/**
 * EmptyDashboard - Empty state with visual stepper
 * Guides users to create their first NFC card
 */

import { Link } from "react-router-dom";
import { CreditCard, Sparkles, Zap, Smartphone, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { OnboardingStepper } from "./OnboardingStepper";

interface EmptyDashboardProps {
  userName?: string;
}

export function EmptyDashboard({ userName }: EmptyDashboardProps) {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-8">
      {/* Welcome header */}
      <div className="text-center mb-8 animate-fade-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          <Sparkles size={16} />
          Bienvenue sur IWASP
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
          {userName ? `Bonjour ${userName.split('@')[0]}` : 'Créez votre carte NFC'}
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Suivez ces étapes pour créer votre première carte de visite NFC intelligente
        </p>
      </div>

      {/* Stepper */}
      <div className="w-full mb-10 animate-fade-up" style={{ animationDelay: '0.1s' }}>
        <OnboardingStepper currentStep={1} />
      </div>

      {/* Main CTA Card */}
      <Card 
        className="w-full max-w-md p-6 sm:p-8 text-center animate-fade-up border-primary/20 bg-gradient-to-b from-primary/5 to-transparent"
        style={{ animationDelay: '0.2s' }}
      >
        <div className="w-16 h-16 rounded-2xl bg-primary mx-auto mb-5 flex items-center justify-center">
          <CreditCard className="h-8 w-8 text-primary-foreground" />
        </div>
        
        <h2 className="font-display text-xl font-semibold text-foreground mb-2">
          Créez votre première carte
        </h2>
        <p className="text-muted-foreground text-sm mb-6">
          Configurez votre profil digital en quelques minutes
        </p>
        
        <Link to="/onboarding">
          <Button 
            size="lg" 
            className="w-full h-12 text-base font-medium gap-2"
          >
            <Zap size={18} />
            Créer ma carte NFC
          </Button>
        </Link>
      </Card>

      {/* Feature highlights */}
      <div className="grid grid-cols-3 gap-4 mt-10 w-full max-w-md animate-fade-up" style={{ animationDelay: '0.3s' }}>
        {[
          { icon: Smartphone, label: "Mobile-first" },
          { icon: Zap, label: "Scan NFC" },
          { icon: Package, label: "Carte premium" },
        ].map(({ icon: Icon, label }) => (
          <div 
            key={label}
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-secondary/50"
          >
            <Icon size={20} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
