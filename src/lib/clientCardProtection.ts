/**
 * 🛡️ CLIENT CARD PROTECTION REGISTRY
 * 
 * ⚠️ CRITICAL: Ce fichier liste toutes les cartes clients protégées.
 * Ces fichiers ne doivent JAMAIS être modifiés lors de mises à jour générales du site.
 * 
 * Avant de modifier un fichier, vérifiez s'il est dans cette liste.
 * Si oui, NE PAS MODIFIER sauf demande explicite du client.
 * 
 * @author IWASP Team
 * @protected
 */

export interface ProtectedClientCard {
  /** Identifiant unique de la carte */
  slug: string;
  /** Nom du client */
  clientName: string;
  /** Chemin du fichier (relatif à src/) */
  filePath: string;
  /** Date de création */
  createdAt: string;
  /** Notes additionnelles */
  notes?: string;
}

/**
 * 🔒 LISTE DES CARTES CLIENTS PROTÉGÉES
 * 
 * ⚠️ NE JAMAIS MODIFIER CES FICHIERS LORS DE MISES À JOUR GÉNÉRALES ⚠️
 */
export const PROTECTED_CLIENT_CARDS: ProtectedClientCard[] = [
  {
    slug: "luxe-prestige",
    clientName: "Luxe Prestige",
    filePath: "pages/LuxePrestigeCard.tsx",
    createdAt: "2024-01-01",
    notes: "Conciergerie de luxe Marrakech - Voitures, jets, villas"
  },
  {
    slug: "maison-b-optic",
    clientName: "Maison B Optic / Marc Aurel",
    filePath: "pages/MaisonBOpticCard.tsx",
    createdAt: "2024-01-01",
    notes: "Opticien Paris-Marrakech - Géré par BADI"
  },
  {
    slug: "kech-exclu",
    clientName: "Kech Exclu",
    filePath: "pages/KechExcluCard.tsx",
    createdAt: "2024-01-01",
    notes: "Immobilier/lifestyle exclusif Marrakech"
  },
  {
    slug: "herbalism-marrakech",
    clientName: "Herbalism Marrakech",
    filePath: "pages/HerbalismCard.tsx",
    createdAt: "2024-01-01",
    notes: "Boutique produits naturels - Médina Marrakech"
  },
  {
    slug: "charles-lazimi",
    clientName: "Charles Lazimi",
    filePath: "pages/CharlesLazimiCard.tsx",
    createdAt: "2024-01-01",
    notes: "B2B Data Architect - Kompass France"
  },
  {
    slug: "ariella-khiat-cohen",
    clientName: "Ariella Khiat Cohen",
    filePath: "pages/AriellaCard.tsx",
    createdAt: "2024-01-01",
    notes: "Avocat à la Cour - Cabinet AKC Paris"
  },
  {
    slug: "la-maison-cupcake",
    clientName: "La Maison Cupcake",
    filePath: "pages/LaMaisonCupcakeCard.tsx",
    createdAt: "2024-01-01",
    notes: "Pâtisserie artisanale"
  },
  {
    slug: "medina-travertin",
    clientName: "Medina Mall & Le Travertin",
    filePath: "pages/DualBrandShowcase.tsx",
    createdAt: "2024-01-01",
    notes: "Dual-brand showcase - Centre commercial"
  },
  {
    slug: "khokha-signature",
    clientName: "Khokha Signature",
    filePath: "pages/KhokhaSignatureCard.tsx",
    createdAt: "2026-01-16",
    notes: "Boutique Fashion Luxury - Marrakech - Noir & Or"
  }
];

/**
 * Liste des fichiers protégés (chemins relatifs à src/)
 */
export const PROTECTED_FILES: string[] = PROTECTED_CLIENT_CARDS.map(card => card.filePath);

/**
 * Vérifie si un fichier est protégé
 * @param filePath Chemin du fichier (relatif à src/ ou absolu)
 * @returns true si le fichier est protégé
 */
export function isProtectedFile(filePath: string): boolean {
  const normalizedPath = filePath
    .replace(/^src\//, "")
    .replace(/^\.\//, "");
  
  return PROTECTED_FILES.some(protectedPath => 
    normalizedPath.includes(protectedPath) || protectedPath.includes(normalizedPath)
  );
}

/**
 * Récupère les informations d'une carte protégée par son slug
 */
export function getProtectedCardBySlug(slug: string): ProtectedClientCard | undefined {
  return PROTECTED_CLIENT_CARDS.find(card => card.slug === slug);
}

/**
 * Récupère les informations d'une carte protégée par son chemin de fichier
 */
export function getProtectedCardByFilePath(filePath: string): ProtectedClientCard | undefined {
  const normalizedPath = filePath.replace(/^src\//, "").replace(/^\.\//, "");
  return PROTECTED_CLIENT_CARDS.find(card => 
    normalizedPath.includes(card.filePath) || card.filePath.includes(normalizedPath)
  );
}

/**
 * Message d'avertissement à afficher lors d'une tentative de modification
 */
export const PROTECTION_WARNING = `
⚠️ ATTENTION: FICHIER CLIENT PROTÉGÉ ⚠️

Ce fichier contient des données spécifiques à un client.
NE PAS MODIFIER lors de mises à jour générales du site.

Modifications autorisées uniquement si:
1. Le client a explicitement demandé une modification
2. La modification concerne uniquement les données de CE client
3. Aucune donnée client n'est remplacée par des données génériques

En cas de doute, NE PAS MODIFIER.
`;

/**
 * Templates protégés (utilisés par des clients spécifiques)
 */
export const PROTECTED_TEMPLATES: string[] = [
  "components/templates/HerbalismEliteTemplate.tsx",
  "components/templates/DarkLuxuryBusinessTemplate.tsx",
  "components/templates/AutoschluesselTemplate.tsx",
  "components/templates/VCardAirbnbBookingTemplate.tsx"
];

/**
 * Vérifie si un template est protégé
 */
export function isProtectedTemplate(templatePath: string): boolean {
  const normalizedPath = templatePath.replace(/^src\//, "").replace(/^\.\//, "");
  return PROTECTED_TEMPLATES.some(protectedPath => 
    normalizedPath.includes(protectedPath) || protectedPath.includes(normalizedPath)
  );
}
