/**
 * Hook Sign in with Apple — fonctionne en web et en iOS Capacitor.
 *
 * Implémentation : flux OAuth Supabase `signInWithOAuth({ provider: 'apple' })`.
 * - Web : redirection navigateur classique gérée par Supabase.
 * - iOS Capacitor : la même redirection s'ouvre dans la WebView / le navigateur
 *   système ; le retour se fait vers `redirectTo` (URL de l'app / deep link
 *   configuré dans Supabase → URL Configuration).
 *
 * Note (feuille native) : le plugin communautaire `@capacitor-community/apple-sign-in`
 * n'a pas encore de version compatible **Capacitor 8** (son Package.swift épingle
 * `capacitor-swift-pm` 7.x, ce qui casse la résolution SPM face aux plugins core en
 * 8.x). On utilise donc le flux OAuth, compatible et sans dépendance native. Les
 * utilitaires de nonce (`src/lib/appleAuth.ts`) restent prêts pour réactiver la
 * feuille native (`signInWithIdToken`) dès qu'un plugin compatible Cap 8 existe.
 *
 * Liaison de compte / pas de doublon :
 * - Supabase relie automatiquement une identité Apple à un utilisateur existant
 *   lorsque l'e-mail Apple correspond à un e-mail déjà vérifié (linking par e-mail).
 * - Si l'utilisateur choisit « Masquer mon e-mail », Apple fournit une adresse
 *   relais : pour éviter un doublon, un utilisateur déjà connecté peut LIER Apple à
 *   son compte via `linkAppleIdentity()` (Réglages) plutôt que de recréer un compte.
 */

import { useCallback, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { classifyAppleError, appleErrorMessage } from "@/lib/appleAuth";
import { toast } from "sonner";

interface UseAppleAuthOptions {
  /** Chemin de retour après connexion (ex. returnTo). Défaut: page courante. */
  redirectPath?: string;
}

export function useAppleAuth(options: UseAppleAuthOptions = {}) {
  const [loading, setLoading] = useState(false);

  const handleError = useCallback((error: unknown) => {
    const kind = classifyAppleError(error);
    if (kind !== "canceled") {
      console.error("Apple auth error:", error);
      toast.error(appleErrorMessage(kind));
    }
    return kind;
  }, []);

  const resolveRedirectTo = useCallback(() => {
    const path = options.redirectPath ?? `${window.location.pathname}${window.location.search}`;
    return `${window.location.origin}${path}`;
  }, [options.redirectPath]);

  /** Connexion Sign in with Apple (création ou connexion). */
  const signInWithApple = useCallback(async (): Promise<boolean> => {
    if (loading) return false;
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "apple",
        options: { redirectTo: resolveRedirectTo() },
      });
      if (error) throw error;
      // La navigation redirige vers Apple : rien de plus à faire ici.
      return true;
    } catch (error) {
      handleError(error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [loading, resolveRedirectTo, handleError]);

  /**
   * Lie une identité Apple au compte DÉJÀ connecté (évite les doublons, utile quand
   * Apple masque l'e-mail). À utiliser depuis les Réglages d'un utilisateur connecté.
   */
  const linkAppleIdentity = useCallback(async (): Promise<boolean> => {
    if (loading) return false;
    setLoading(true);
    try {
      const { error } = await supabase.auth.linkIdentity({
        provider: "apple",
        options: { redirectTo: resolveRedirectTo() },
      });
      if (error) throw error;
      return true;
    } catch (error) {
      handleError(error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [loading, resolveRedirectTo, handleError]);

  return { loading, signInWithApple, linkAppleIdentity };
}
