/**
 * AdminGuard - Protects admin routes
 * Verifies user has admin role before rendering content
 * 
 * SECURITY: Uses server-side role check via RLS policy
 * NEVER uses client-side storage for admin verification
 */

import { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useIsAdmin } from "@/hooks/useAdmin";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Loader2, ArrowLeft, Bug, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AdminGuardProps {
  children: ReactNode;
}

// Debug button only visible in development
function DevBootstrapButton() {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Only show in development
  if (import.meta.env.PROD) return null;

  const handleBootstrap = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("bootstrap-admin", {
        body: { action: "ensure" }
      });

      if (error) {
        console.error("Bootstrap error:", error);
        toast.error(`Erreur: ${error.message}`);
        return;
      }

      console.log("Bootstrap result:", data);
      
      if (data?.isAdmin) {
        toast.success("✅ Rôle admin activé ! Rechargement...");
        queryClient.invalidateQueries({ queryKey: ["isAdmin", user?.id] });
        // Force page reload after short delay
        setTimeout(() => window.location.reload(), 1000);
      } else {
        toast.info("Email non reconnu comme fondateur. Vérifiez ADMIN_EMAIL.");
      }
    } catch (err) {
      console.error("Bootstrap failed:", err);
      toast.error("Échec de l'appel bootstrap-admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={handleBootstrap}
        disabled={loading}
        size="sm"
        variant="outline"
        className="gap-2 bg-yellow-500/10 border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/20"
      >
        {loading ? (
          <RefreshCw className="h-4 w-4 animate-spin" />
        ) : (
          <Bug className="h-4 w-4" />
        )}
        {loading ? "Bootstrap..." : "Force Admin"}
      </Button>
    </div>
  );
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
        <DevBootstrapButton />
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
        <DevBootstrapButton />
      </div>
    );
  }

  // Admin verified - render children
  return <>{children}</>;
}

export default AdminGuard;
