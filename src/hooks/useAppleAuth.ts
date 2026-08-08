/**
 * Hook Sign in with Apple — fonctionne en web et en natif iOS (Capacitor).
 *
 * - Web : `supabase.auth.signInWithOAuth({ provider: 'apple' })` (flux redirect
 *   géré par Supabase, nonce/state gérés côté Supabase).
 * - iOS natif : feuille native Apple via `@capacitor-community/apple-sign-in`,
 *   puis `supabase.auth.signInWithIdToken({ provider: 'apple', token, nonce })`
 *   avec un nonce haché (anti-rejeu). Le plugin natif n'est chargé qu'à la demande
 *   (import dynamique) pour ne pas alourdir le bundle web.
 *
 * Liaison de compte / pas de doublon :
 * - Supabase relie automatiquement une identité Apple à un utilisateur existant
 *   lorsque l'e-mail Apple correspond à un e-mail déjà vérifié (linking par e-mail).
 * - Si l'utilisateur choisit « Masquer mon e-mail », Apple fournit une adresse
 *   relais : pour éviter un doublon, un utilisateur déjà connecté peut LIER Apple à
 *   son compte via `linkAppleIdentity()` (Réglages) plutôt que de recréer un compte.
 */

import { useCallback, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { supabase } from "@/integrations/supabase/client";
import {
  generateRawNonce,
  sha256Hex,
  classifyAppleError,
  appleErrorMessage,
} from "@/lib/appleAuth";
import { toast } from "sonner";

interface UseAppleAuthOptions {
  /** Chemin de retour après connexion web (ex. returnTo). Défaut: page courante. */
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

  /** Connexion Sign in with Apple (création ou connexion). */
  const signInWithApple = useCallback(async (): Promise<boolean> => {
    if (loading) return false;
    setLoading(true);
    try {
      if (Capacitor.isNativePlatform()) {
        // --- iOS natif : feuille Apple + signInWithIdToken ---
        const { SignInWithApple } = await import("@capacitor-community/apple-sign-in");
        const rawNonce = generateRawNonce();
        const hashedNonce = await sha256Hex(rawNonce);

        const result = await SignInWithApple.authorize({
          clientId: "app.iwasp.digital",
          redirectURI: "https://i-wasp.com/auth/callback",
          scopes: "name email",
          nonce: hashedNonce,
        });

        const idToken = result.response?.identityToken;
        if (!idToken) throw new Error("invalid response: identityToken manquant");

        const { error } = await supabase.auth.signInWithIdToken({
          provider: "apple",
          token: idToken,
          nonce: rawNonce,
        });
        if (error) throw error;
        return true;
      }

      // --- Web : flux OAuth redirect géré par Supabase ---
      const path = options.redirectPath ?? `${window.location.pathname}${window.location.search}`;
      const redirectTo = `${window.location.origin}${path}`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "apple",
        options: { redirectTo },
      });
      if (error) throw error;
      // En web, la navigation redirige vers Apple : rien de plus à faire ici.
      return true;
    } catch (error) {
      handleError(error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [loading, options.redirectPath, handleError]);

  /**
   * Lie une identité Apple au compte DÉJÀ connecté (évite les doublons, utile quand
   * Apple masque l'e-mail). À utiliser depuis les Réglages d'un utilisateur connecté.
   */
  const linkAppleIdentity = useCallback(async (): Promise<boolean> => {
    if (loading) return false;
    setLoading(true);
    try {
      const path = options.redirectPath ?? `${window.location.pathname}${window.location.search}`;
      const { error } = await supabase.auth.linkIdentity({
        provider: "apple",
        options: { redirectTo: `${window.location.origin}${path}` },
      });
      if (error) throw error;
      return true;
    } catch (error) {
      handleError(error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [loading, options.redirectPath, handleError]);

  return { loading, signInWithApple, linkAppleIdentity };
}
