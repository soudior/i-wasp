/**
 * Hook pour l'authentification Google
 * Utilisé pour sécuriser l'accès au WiFi dans les templates de gestion locative
 */

import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function useGoogleAuth() {
  const { user, session } = useAuth();
  const [loading, setLoading] = useState(false);

  const isAuthenticated = !!user && !!session;

  const signInWithGoogle = useCallback(async () => {
    try {
      setLoading(true);
      
      const redirectUrl = `${window.location.origin}${window.location.pathname}`;
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error("Google auth error:", error);
        toast.error("Erreur de connexion Google");
        return false;
      }

      return true;
    } catch (err) {
      console.error("Google auth exception:", err);
      toast.error("Erreur lors de la connexion");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Déconnecté");
    } catch (err) {
      console.error("Sign out error:", err);
      toast.error("Erreur lors de la déconnexion");
    }
  }, []);

  return {
    isAuthenticated,
    user,
    loading,
    signInWithGoogle,
    signOut,
  };
}
