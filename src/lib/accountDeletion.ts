/**
 * Garde de confirmation pour la suppression définitive de compte
 * (Apple App Store Guideline 5.1.1(v)).
 *
 * La suppression réelle est effectuée côté serveur par l'edge function
 * `delete-account`. Côté client, l'utilisateur doit saisir explicitement le mot
 * de confirmation avant que l'action ne soit déclenchée — ce module isole cette
 * règle pour qu'elle soit testable et réutilisable.
 */

/** Mot de confirmation exact attendu (insensible à la casse et aux espaces). */
export const DELETE_CONFIRM_WORD = "SUPPRIMER";

/**
 * Vrai uniquement si la saisie correspond exactement au mot de confirmation
 * (après trim et normalisation de casse). Toute autre valeur — vide, partielle,
 * ou différente — renvoie false, ce qui bloque la suppression.
 */
export function isDeleteConfirmed(input: string): boolean {
  return input.trim().toUpperCase() === DELETE_CONFIRM_WORD;
}
