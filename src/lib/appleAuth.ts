/**
 * Sign in with Apple — logique partagée (web + iOS Capacitor).
 *
 * Sécurité du nonce :
 * - on génère un nonce aléatoire (`rawNonce`) ;
 * - on envoie à Apple le SHA-256 **hexadécimal** de ce nonce (`hashedNonce`) ;
 * - Apple place ce hash dans le jeton d'identité ;
 * - on transmet à Supabase le `rawNonce` : GoTrue recalcule SHA-256(rawNonce) et
 *   le compare au claim du jeton → protège contre le rejeu.
 *
 * Ce module ne contient que de la logique pure (testable) ; l'orchestration des
 * appels réseau vit dans `useAppleAuth`.
 */

/** Génère un nonce aléatoire cryptographiquement sûr (hex, 32 octets). */
export function generateRawNonce(bytes = 32): string {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}

/** SHA-256 hexadécimal d'une chaîne (utilisé pour le nonce envoyé à Apple). */
export async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Certains retours d'Apple utilisent une adresse relais privée
 * (`…@privaterelay.appleid.com`) quand l'utilisateur choisit « Masquer mon e-mail ».
 * On la détecte pour adapter l'UX (ne pas prétendre disposer de l'e-mail réel).
 */
export function isApplePrivateRelayEmail(email: string | null | undefined): boolean {
  return !!email && /@privaterelay\.appleid\.com$/i.test(email.trim());
}

export type AppleAuthErrorKind =
  | "canceled"
  | "invalid_response"
  | "network"
  | "not_supported"
  | "unknown";

/** Classe une erreur Apple/Supabase en catégorie stable (pour messages + tests). */
export function classifyAppleError(error: unknown): AppleAuthErrorKind {
  const raw =
    typeof error === "string"
      ? error
      : error && typeof error === "object"
        ? String(
            (error as { message?: unknown; code?: unknown }).message ??
              (error as { code?: unknown }).code ??
              "",
          )
        : "";
  const msg = raw.toLowerCase();
  if (
    msg.includes("cancel") || // ASAuthorizationError canceled / popup fermé
    msg.includes("1001") ||
    msg.includes("popup_closed") ||
    msg.includes("user closed")
  ) {
    return "canceled";
  }
  if (msg.includes("network") || msg.includes("fetch") || msg.includes("timeout")) {
    return "network";
  }
  if (msg.includes("not available") || msg.includes("unsupported") || msg.includes("not supported")) {
    return "not_supported";
  }
  if (msg.includes("nonce") || msg.includes("token") || msg.includes("invalid")) {
    return "invalid_response";
  }
  return "unknown";
}

/** Message utilisateur (FR) pour chaque catégorie d'erreur. */
export function appleErrorMessage(kind: AppleAuthErrorKind): string {
  switch (kind) {
    case "canceled":
      return "Connexion Apple annulée.";
    case "network":
      return "Problème de réseau pendant la connexion Apple. Réessayez.";
    case "not_supported":
      return "Sign in with Apple n'est pas disponible sur cet appareil.";
    case "invalid_response":
      return "Réponse Apple invalide. Réessayez ou utilisez une autre méthode.";
    default:
      return "Erreur lors de la connexion avec Apple.";
  }
}
