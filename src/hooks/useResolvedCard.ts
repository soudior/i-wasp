/**
 * Repli de résolution d'une carte.
 *
 * Toute carte doit être joignable depuis https://i-wasp.com/card/[id], y compris
 * celles qui vivent dans iwallet-card et non dans la base native. La fonction
 * `resolve-card` cherche d'abord localement, puis interroge iwallet-card.
 *
 * Ce hook n'est sollicité QUE lorsque la recherche locale n'a rien donné : on ne
 * paie l'aller-retour que dans le cas de repli.
 *
 * Le contenu est rendu sous i-wasp.com — aucune redirection ne remplace le
 * domaine visible, conformément à la décision d'architecture.
 *
 * On utilise fetch plutôt que supabase.functions.invoke : le statut HTTP est
 * l'information décisive ici (404 « inconnue » ne se traite pas comme 502
 * « amont en panne »), et invoke ne l'expose pas.
 */

import { useQuery } from "@tanstack/react-query";

/**
 * Adresse du resolveur, explicite et non deduite.
 *
 * Elle etait auparavant construite a partir de VITE_SUPABASE_URL. Or le
 * resolveur est un service a part : il peut vivre ailleurs que la base que
 * l'application interroge, et c'est le cas aujourd'hui. Deduire son adresse
 * faisait interroger un projet ou la fonction n'existe pas, ce qui renvoyait un
 * 404 « carte inconnue » pour absolument toutes les cartes.
 */
const RESOLVER_URL =
  import.meta.env.VITE_CARD_RESOLVER_URL ||
  "https://i-wasp.pages.dev/api/resolve-card";
const SUPABASE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "";

export interface ResolvedCard {
  id: string;
  name: string;
  role: string;
  company: string;
  phone: string;
  website: string;
  instagram: string;
  city: string;
}

export interface ResolvedCardResult {
  source: "iwasp" | "iwallet-card";
  card: ResolvedCard;
}

/** Distingue « inconnue partout » d'une panne amont : les deux ne se traitent pas pareil. */
export class CardResolutionError extends Error {
  constructor(public readonly kind: "not_found" | "upstream" | "invalid") {
    super(kind);
  }
}

export function useResolvedCard(slug: string, enabled: boolean) {
  return useQuery({
    queryKey: ["resolvedCard", slug],
    enabled: enabled && !!slug,
    // Une panne amont est passagère : on retente. Un 404 est définitif.
    retry: (failureCount, error) =>
      error instanceof CardResolutionError && error.kind === "upstream" && failureCount < 2,
    queryFn: async (): Promise<ResolvedCardResult> => {
      const headers: Record<string, string> = { accept: "application/json" };
      if (SUPABASE_KEY) {
        headers.apikey = SUPABASE_KEY;
        headers.authorization = `Bearer ${SUPABASE_KEY}`;
      }

      const response = await fetch(
        `${RESOLVER_URL}?id=${encodeURIComponent(slug)}`,
        { headers },
      );

      if (response.status === 404) throw new CardResolutionError("not_found");
      if (response.status === 400) throw new CardResolutionError("invalid");
      if (!response.ok) throw new CardResolutionError("upstream");

      const result = (await response.json()) as ResolvedCardResult | null;
      if (!result?.card?.id) throw new CardResolutionError("not_found");
      // L'identifiant renvoyé doit être exactement celui demandé : sinon on
      // afficherait la fiche d'un autre client sous cette URL.
      if (result.card.id !== slug) throw new CardResolutionError("not_found");
      return result;
    },
  });
}
