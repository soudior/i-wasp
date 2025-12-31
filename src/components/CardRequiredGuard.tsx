/**
 * CardRequiredGuard - Ensures user has at least 1 digital card
 * 
 * Use this guard for routes that require a digital card to exist:
 * - Pricing page
 * - Checkout
 * - Order flow
 * 
 * Redirects to /onboarding if user has 0 cards.
 */

import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCards } from "@/hooks/useCards";

interface CardRequiredGuardProps {
  children: React.ReactNode;
}

export function CardRequiredGuard({ children }: CardRequiredGuardProps) {
  const { user, loading: authLoading } = useAuth();
  const { data: cards = [], isLoading: cardsLoading } = useCards();

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-foreground/20 border-t-foreground animate-spin" />
          <p className="text-muted-foreground text-sm">Chargement...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Show loading while fetching cards
  if (cardsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-foreground/20 border-t-foreground animate-spin" />
          <p className="text-muted-foreground text-sm">Vérification...</p>
        </div>
      </div>
    );
  }

  // Redirect to onboarding if user has no cards
  if (cards.length === 0) {
    return <Navigate to="/onboarding" replace />;
  }

  // User has cards - render protected content
  return <>{children}</>;
}
