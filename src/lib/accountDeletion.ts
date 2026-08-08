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

/** UUID sentinelle attribué aux commandes anonymisées (compte supprimé). */
export const DELETED_USER_SENTINEL = "00000000-0000-0000-0000-000000000000";

/**
 * Contrat d'anonymisation d'une commande lors de la suppression de compte.
 * Aucune donnée directement identifiante ne doit subsister ; seules les colonnes
 * comptables non identifiantes (numéro, quantités, montants, dates) sont conservées.
 *
 * ⚠️ Doit rester synchrone avec `supabase/functions/delete-account/index.ts`
 * (source de vérité côté serveur). Ce miroir testable protège contre les
 * régressions : si une colonne PII est ajoutée à `orders`, l'ajouter ici + au
 * serveur, sinon le test de contrat échoue.
 */
export function anonymizedOrderPatch(): Record<string, unknown> {
  return {
    user_id: DELETED_USER_SENTINEL,
    customer_email: "deleted@anonymized.local",
    shipping_name: "Utilisateur supprimé",
    shipping_phone: null,
    shipping_address: null,
    shipping_city: null,
    shipping_postal_code: null,
    shipping_country: null,
    tracking_number: null,
    // Personnalisation potentiellement identifiante → effacée.
    order_items: [],
    admin_notes: null,
    logo_url: null,
    background_image_url: null,
    print_file_url: null,
  };
}
