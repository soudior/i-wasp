/**
 * DashboardGuard - Route-level guard for dashboard access
 * 
 * Prevents dashboard flash for users with 0 cards by:
 * 1. Checking authentication first
 * 2. Fetching card count before rendering
 * 3. Redirecting to /onboarding if no cards exist
 */

import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCards } from "@/hooks/useCards";

interface DashboardGuardProps {
  children: React.ReactNode;
}

export function DashboardGuard({ children }: DashboardGuardProps) {
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

  // Show loading while fetching cards (prevents flash)
  if (cardsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-foreground/20 border-t-foreground animate-spin" />
          <p className="text-muted-foreground text-sm">Préparation...</p>
        </div>
      </div>
    );
  }

  // Redirect to onboarding if user has no cards
  if (cards.length === 0) {
    return <Navigate to="/onboarding" replace />;
  }

  // User has cards - render dashboard
  return <>{children}</>;
}
