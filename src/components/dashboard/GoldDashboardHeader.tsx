/**
 * Dashboard Header - SaaS Professional Edition
 * Clean, minimal, no decorative effects
 * Style: Uber / Stripe / Linear
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, Bell, Send } from "lucide-react";

interface GoldDashboardHeaderProps {
  userName: string;
  isPremium: boolean;
  onPushNotification: () => void;
  totalScans: number;
}

export function GoldDashboardHeader({ 
  userName, 
  isPremium, 
  onPushNotification,
  totalScans 
}: GoldDashboardHeaderProps) {
  return (
    <div className="mb-8 p-6 md:p-8 rounded-2xl bg-card border border-border">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* Left: User info */}
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-muted flex items-center justify-center">
            <span className="text-xl md:text-2xl font-semibold text-foreground">
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="font-display text-xl md:text-2xl font-semibold text-foreground">
                {userName}
              </h1>
              {isPremium && (
                <Badge className="bg-primary text-primary-foreground border-0 gap-1 px-2.5 py-0.5 text-xs font-medium">
                  <Crown className="h-3 w-3" />
                  GOLD
                </Badge>
              )}
            </div>
            
            <p className="text-muted-foreground text-sm">
              {totalScans} scans · Compte actif
            </p>
          </div>
        </div>

        {/* Right: Push Notification CTA */}
        <Button
          onClick={onPushNotification}
          disabled={!isPremium}
          className={`${
            isPremium 
              ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          } font-medium px-5 py-5 h-auto rounded-xl transition-colors`}
        >
          <Bell className="h-4 w-4 mr-2" />
          Envoyer une Notification
          <Send className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Bottom: Quick stats */}
      <div className="mt-6 pt-6 border-t border-border grid grid-cols-3 gap-4">
        {[
          { label: "Scans", value: totalScans.toString() },
          { label: "Statut", value: isPremium ? "Premium" : "Gratuit" },
          { label: "Profil", value: "Actif" },
        ].map((stat) => (
          <div key={stat.label} className="text-center md:text-left">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              {stat.label}
            </p>
            <p className="font-medium text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
