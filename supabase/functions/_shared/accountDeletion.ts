/** UUID sentinelle attribué aux commandes anonymisées. */
export const DELETED_USER_SENTINEL = "00000000-0000-0000-0000-000000000000";

/** Données comptables conservées, données directement identifiantes neutralisées. */
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
    order_items: [],
    admin_notes: null,
    logo_url: null,
    background_image_url: null,
    print_file_url: null,
  };
}

/** Conserve les montants et références de paiement, sans données client directes. */
export function anonymizedWebstudioOrderPatch(): Record<string, unknown> {
  return {
    user_id: null,
    proposal_id: null,
    customer_email: "deleted@anonymized.local",
    customer_name: null,
    stripe_customer_id: null,
    items: [],
    options: [],
    admin_notes: null,
  };
}
