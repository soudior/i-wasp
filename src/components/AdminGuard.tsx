/**
 * AdminGuard - Protects admin routes
 * Verifies user has admin role before rendering content
 * 
 * SECURITY: Uses server-side role check via RLS policy
 * NEVER uses client-side storage for admin verification
 */

import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useIsAdmin } from "@/hooks/useAdmin";
import { Shield, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminGuardProps {
  children: ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const navigate = useNavigate();
  const { data: isAdmin, isLoading } = useIsAdmin();

  // Loading state - Premium feel
  if (isLoading) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center gap-4 bg-background">
        <div className="relative">
          <Shield className="h-12 w-12 text-muted-foreground animate-pulse" />
          <Loader2 className="h-6 w-6 animate-spin absolute -bottom-1 -right-1 text-accent" />
        </div>
        <p className="text-muted-foreground text-sm">Vérification des accès...</p>
      </div>
    );
  }

  // Access denied - Clear messaging
  if (!isAdmin) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center gap-6 p-6 bg-background">
        <div className="text-center space-y-4 max-w-sm">
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <Shield className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold">Accès refusé</h1>
          <p className="text-muted-foreground">
            Cette section est réservée aux administrateurs IWASP.
          </p>
          <Button
            onClick={() => navigate("/", { replace: true })}
            className="gap-2"
          >
            <ArrowLeft size={16} />
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  // Admin verified - render children
  return <>{children}</>;
}

export default AdminGuard;
