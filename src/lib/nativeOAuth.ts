/**
 * Flux OAuth mobile complet pour iOS Capacitor — PAS une auth enfermée dans la
 * WebView :
 *
 *  1. `signInWithOAuth({ skipBrowserRedirect: true })` → Supabase fabrique l'URL
 *     d'autorisation (PKCE : le code_verifier est stocké par supabase-js).
 *  2. Ouverture dans le **navigateur système** via `@capacitor/browser`
 *     (SFSafariViewController — cookies/session Apple du système, exigence Apple).
 *  3. Apple → Supabase (`/auth/v1/callback`, state vérifié côté Supabase) →
 *     redirection vers le **deep link** `iwasp://auth/callback?code=…`.
 *  4. iOS rouvre l'app ; `@capacitor/app` émet `appUrlOpen`.
 *  5. Validation stricte de l'URL reçue, puis `exchangeCodeForSession(code)` —
 *     l'échange n'aboutit que si le `code_verifier` PKCE local correspond
 *     (anti-interception : un code volé est inutilisable sans le verifier).
 *  6. Fermeture du navigateur système, nettoyage du listener.
 *
 * Sécurité :
 *  - l'URL de retour (qui contient le code à usage unique) n'est JAMAIS journalisée ;
 *  - le code n'est ni persisté ni journalisé (mémoire transitoire pendant l'échange) ;
 *  - annulation utilisateur (fermeture du navigateur) → résolution "canceled",
 *    sans erreur affichée ;
 *  - timeout de sécurité pour ne pas laisser une promesse pendante.
 */

import { supabase } from "@/integrations/supabase/client";
import { Capacitor } from "@capacitor/core";

/** Deep link de retour dans l'app (déclaré dans Info.plist, scheme `iwasp`). */
export const NATIVE_OAUTH_REDIRECT = "iwasp://auth/callback";

export type NativeOAuthResult = "success" | "canceled" | "error";

// Coalesce duplicate native URL events while the same one-time code is exchanged.
const inFlightExchanges = new Map<string, Promise<NativeOAuthResult>>();
let activeSignIn: Promise<NativeOAuthResult> | null = null;
let activeSignInProvider: "apple" | "google" | null = null;
let launchCallbackHandled = false;

async function exchangeNativeOAuthCallback(url: string): Promise<NativeOAuthResult | null> {
  if (!isNativeOAuthCallback(url)) return null;

  const providerError = extractAuthError(url);
  if (providerError) {
    return /cancel|denied/i.test(providerError) ? "canceled" : "error";
  }

  const code = extractAuthCode(url);
  if (!code) {
    console.error("Native OAuth: callback sans code d'autorisation");
    return "error";
  }

  const existingExchange = inFlightExchanges.get(code);
  if (existingExchange) return existingExchange;

  const exchange = (async (): Promise<NativeOAuthResult> => {
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        console.error("Native OAuth: échec de l'échange PKCE", error.message);
        return "error";
      }
      return "success";
    } catch (e) {
      console.error("Native OAuth: exception pendant l'échange PKCE");
      return "error";
    }
  })();
  inFlightExchanges.set(code, exchange);
  try {
    return await exchange;
  } finally {
    if (inFlightExchanges.get(code) === exchange) inFlightExchanges.delete(code);
  }
}

/** Vrai si `url` est bien notre deep link de retour OAuth (validation stricte). */
export function isNativeOAuthCallback(url: string): boolean {
  return url.startsWith(`${NATIVE_OAUTH_REDIRECT}?`) || url === NATIVE_OAUTH_REDIRECT
    || url.startsWith(`${NATIVE_OAUTH_REDIRECT}#`);
}

/** Extrait le code d'autorisation d'une URL de callback (ou null). */
export function extractAuthCode(url: string): string | null {
  try {
    const qs = url.split("?")[1]?.split("#")[0] ?? "";
    const code = new URLSearchParams(qs).get("code");
    return code && code.length > 0 ? code : null;
  } catch {
    return null;
  }
}

/** Extrait une erreur OAuth renvoyée par le provider (annulation Apple, etc.). */
export function extractAuthError(url: string): string | null {
  try {
    const qs = url.split("?")[1]?.split("#")[0] ?? "";
    const p = new URLSearchParams(qs);
    return p.get("error_description") || p.get("error");
  } catch {
    return null;
  }
}

const AUTH_TIMEOUT_MS = 5 * 60 * 1000; // 5 min : au-delà, on considère abandonné.
const BROWSER_FINISHED_GRACE_MS = 1500;

/**
 * Exécute le flux OAuth natif complet pour un provider Supabase.
 * Résout "success" | "canceled" | "error" — ne rejette jamais.
 */
export function signInWithProviderNative(
  provider: "apple" | "google",
): Promise<NativeOAuthResult> {
  if (activeSignIn) {
    return activeSignInProvider === provider ? activeSignIn : Promise.resolve("error");
  }

  const operation = runNativeSignIn(provider).catch((e): NativeOAuthResult => {
    console.error("Native OAuth: exception inattendue");
    return "error";
  });
  activeSignIn = operation;
  activeSignInProvider = provider;
  void operation.then(() => {
    if (activeSignIn === operation) {
      activeSignIn = null;
      activeSignInProvider = null;
    }
  });
  return operation;
}

async function runNativeSignIn(provider: "apple" | "google"): Promise<NativeOAuthResult> {
  try {
    const { App } = await import("@capacitor/app");
    const { Browser } = await import("@capacitor/browser");
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: NATIVE_OAUTH_REDIRECT, skipBrowserRedirect: true },
    });
    if (error || !data?.url) {
      console.error("Native OAuth: échec de création de l'URL d'autorisation", error?.message);
      return "error";
    }

    launchCallbackHandled = false;
    return await new Promise<NativeOAuthResult>((resolve) => {
    let settled = false;
    let callbackInProgress = false;
    let urlListener: { remove: () => Promise<void> } | null = null;
    let finishListener: { remove: () => Promise<void> } | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let cancelGraceId: ReturnType<typeof setTimeout> | null = null;

    const cleanup = (closeBrowser: boolean) => {
      if (timeoutId) clearTimeout(timeoutId);
      if (cancelGraceId) clearTimeout(cancelGraceId);
      // Cleanup must not hold up the caller if a native bridge operation stalls.
      void Promise.resolve().then(async () => {
        try { await urlListener?.remove(); } catch { /* noop */ }
        try { await finishListener?.remove(); } catch { /* noop */ }
        if (closeBrowser) {
          try { await Browser.close(); } catch { /* browser already closed */ }
        }
      });
    };
    const settle = (result: NativeOAuthResult, closeBrowser = true) => {
      if (settled) return;
      settled = true;
      cleanup(closeBrowser);
      inFlightExchanges.clear();
      resolve(result);
    };

    // Borne aussi une préparation du bridge ou un échange PKCE qui ne répond pas.
    timeoutId = setTimeout(() => settle(callbackInProgress ? "error" : "canceled"), AUTH_TIMEOUT_MS);

    void (async () => {
      // Installer les listeners AVANT d'ouvrir Safari. Sans cet await, un retour
      // OAuth rapide peut arriver pendant que le bridge natif n'écoute pas encore.
      urlListener = await App.addListener("appUrlOpen", ({ url }) => {
        if (settled || callbackInProgress || !isNativeOAuthCallback(url)) return;
        callbackInProgress = true;
        launchCallbackHandled = true;
        if (cancelGraceId) clearTimeout(cancelGraceId);
        void exchangeNativeOAuthCallback(url).then((result) => {
          if (result) settle(result);
        }).catch((e) => {
          console.error("Native OAuth: exception de traitement du callback");
          settle("error");
        });
      });
      if (settled) {
        try { await urlListener.remove(); } catch { /* noop */ }
        return;
      }

      // Annulation : l'utilisateur ferme le navigateur système sans finir.
      finishListener = await Browser.addListener("browserFinished", () => {
        if (settled || callbackInProgress) return;
        if (cancelGraceId) clearTimeout(cancelGraceId);
        cancelGraceId = setTimeout(() => {
          if (!callbackInProgress) settle("canceled", false);
        }, BROWSER_FINISHED_GRACE_MS);
      });
      if (settled) {
        try { await finishListener.remove(); } catch { /* noop */ }
        return;
      }

      // `popover` is the supported adaptive presentation for iPad; retain it
      // explicitly rather than relying on platform defaults.
      await Browser.open({ url: data.url, presentationStyle: "popover" });
    })().catch((e) => {
      console.error("Native OAuth: impossible de préparer/ouvrir le navigateur système");
      settle("error");
    });
  });
  } catch (e) {
    console.error("Native OAuth: impossible d'initialiser le flux");
    return "error";
  }
}

/**
 * Termine un OAuth qui a relancé l'app à froid. iOS peut supprimer la WebView
 * pendant Safari ; `appUrlOpen` n'a alors plus de listener JavaScript vivant,
 * mais Capacitor conserve l'URL de lancement.
 */
export async function recoverNativeOAuthLaunch(): Promise<NativeOAuthResult | null> {
  try {
    if (!Capacitor.isNativePlatform() || launchCallbackHandled) return null;
    const { App } = await import("@capacitor/app");
    const launch = await App.getLaunchUrl();
    if (!launch?.url || !isNativeOAuthCallback(launch.url)) return null;
    launchCallbackHandled = true;
    return await exchangeNativeOAuthCallback(launch.url);
  } catch (e) {
    console.error("Native OAuth: impossible de récupérer l'URL de lancement");
    return "error";
  }
}

/** OAuth Google commun au web et aux apps Capacitor. */
export async function signInWithGoogleCrossPlatform(
  webRedirectTo: string,
): Promise<NativeOAuthResult> {
  if (Capacitor.isNativePlatform()) {
    return signInWithProviderNative("google");
  }

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: webRedirectTo,
      queryParams: { access_type: "offline", prompt: "consent" },
    },
  });
  return error ? "error" : "success";
}
