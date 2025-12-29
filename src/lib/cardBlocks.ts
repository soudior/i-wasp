/**
 * Card Block Types & Utilities
 * 
 * Modular block system for dynamic, client-editable NFC cards.
 * Every element is addable, editable, removable via dashboard.
 */

import { SocialLink } from "./socialNetworks";

// ============================================================
// BLOCK TYPE DEFINITIONS
// ============================================================

export type BlockType = 
  | "identity" 
  | "wifi" 
  | "location" 
  | "action" 
  | "social" 
  | "offer" 
  | "info"
  | "divider";

export interface BaseBlock {
  id: string;
  type: BlockType;
  visible: boolean;
  order: number;
}

// Identity Block - Profile photo, name, role
export interface IdentityBlock extends BaseBlock {
  type: "identity";
  data: {
    firstName: string;
    lastName: string;
    title?: string;
    company?: string;
    tagline?: string;
    photoUrl?: string | null;
    logoUrl?: string | null;
  };
}

// WiFi Block - SSID & password
export interface WifiBlock extends BaseBlock {
  type: "wifi";
  data: {
    ssid: string;
    password: string;
    networkType?: "WPA" | "WEP" | "open";
    label?: string;
  };
}

// Location Block - GPS coordinates
export interface LocationBlock extends BaseBlock {
  type: "location";
  data: {
    label?: string;
    address: string;
    latitude?: number;
    longitude?: number;
    placeId?: string; // Google Places ID
  };
}

// Action Block - Phone, Email, SMS, WhatsApp, etc.
export type ActionType = 
  | "call" 
  | "whatsapp" 
  | "sms" 
  | "email" 
  | "website" 
  | "custom";

export interface ActionBlock extends BaseBlock {
  type: "action";
  data: {
    actionType: ActionType;
    label: string;
    subtitle?: string;
    value: string; // phone number, email, url
    icon?: string;
  };
}

// Social Block - Social network links
export interface SocialBlock extends BaseBlock {
  type: "social";
  data: {
    links: SocialLink[];
  };
}

// Offer Block - Special offers, promotions
export interface OfferBlock extends BaseBlock {
  type: "offer";
  data: {
    title: string;
    description: string;
    validFrom?: string;
    validUntil?: string;
    code?: string;
    imageUrl?: string;
  };
}

// Info Block - Generic text/rich content
export interface InfoBlock extends BaseBlock {
  type: "info";
  data: {
    title: string;
    content: string;
    icon?: string;
  };
}

// Divider Block - Visual separator
export interface DividerBlock extends BaseBlock {
  type: "divider";
  data: {
    style?: "line" | "dots" | "diamond";
  };
}

// Union type for all blocks
export type CardBlock = 
  | IdentityBlock 
  | WifiBlock 
  | LocationBlock 
  | ActionBlock 
  | SocialBlock 
  | OfferBlock 
  | InfoBlock
  | DividerBlock;

// ============================================================
// CARD BLOCKS CONFIGURATION
// ============================================================

export interface CardBlocksConfig {
  blocks: CardBlock[];
  theme?: "dark" | "light";
  showWallet?: boolean;
  showAddToContacts?: boolean;
  enableLeadCapture?: boolean;
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

export function generateBlockId(): string {
  return `block_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export function createIdentityBlock(data: Partial<IdentityBlock["data"]> = {}): IdentityBlock {
  return {
    id: generateBlockId(),
    type: "identity",
    visible: true,
    order: 0,
    data: {
      firstName: "",
      lastName: "",
      ...data,
    },
  };
}

export function createWifiBlock(data: Partial<WifiBlock["data"]> = {}): WifiBlock {
  return {
    id: generateBlockId(),
    type: "wifi",
    visible: true,
    order: 0,
    data: {
      ssid: "",
      password: "",
      networkType: "WPA",
      label: "WiFi",
      ...data,
    },
  };
}

export function createLocationBlock(data: Partial<LocationBlock["data"]> = {}): LocationBlock {
  return {
    id: generateBlockId(),
    type: "location",
    visible: true,
    order: 0,
    data: {
      label: "Localisation",
      address: "",
      ...data,
    },
  };
}

export function createActionBlock(actionType: ActionType, data: Partial<ActionBlock["data"]> = {}): ActionBlock {
  const defaults: Record<ActionType, { label: string; subtitle: string }> = {
    call: { label: "Appeler", subtitle: "Appel direct" },
    whatsapp: { label: "WhatsApp", subtitle: "Message instantané" },
    sms: { label: "Message", subtitle: "Envoyer un SMS" },
    email: { label: "Email", subtitle: "Contact professionnel" },
    website: { label: "Site web", subtitle: "Visiter le site" },
    custom: { label: "Action", subtitle: "" },
  };

  return {
    id: generateBlockId(),
    type: "action",
    visible: true,
    order: 0,
    data: {
      actionType,
      label: defaults[actionType].label,
      subtitle: defaults[actionType].subtitle,
      value: "",
      ...data,
    },
  };
}

export function createSocialBlock(links: SocialLink[] = []): SocialBlock {
  return {
    id: generateBlockId(),
    type: "social",
    visible: true,
    order: 0,
    data: {
      links,
    },
  };
}

export function createOfferBlock(data: Partial<OfferBlock["data"]> = {}): OfferBlock {
  return {
    id: generateBlockId(),
    type: "offer",
    visible: true,
    order: 0,
    data: {
      title: "",
      description: "",
      ...data,
    },
  };
}

export function createInfoBlock(data: Partial<InfoBlock["data"]> = {}): InfoBlock {
  return {
    id: generateBlockId(),
    type: "info",
    visible: true,
    order: 0,
    data: {
      title: "",
      content: "",
      ...data,
    },
  };
}

export function createDividerBlock(): DividerBlock {
  return {
    id: generateBlockId(),
    type: "divider",
    visible: true,
    order: 0,
    data: {
      style: "line",
    },
  };
}

// Reorder blocks and update order property
export function reorderBlocks(blocks: CardBlock[], fromIndex: number, toIndex: number): CardBlock[] {
  const result = [...blocks];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result.map((block, index) => ({ ...block, order: index }));
}

// Get only visible blocks, sorted by order
export function getVisibleBlocks(blocks: CardBlock[]): CardBlock[] {
  return blocks
    .filter(block => block.visible)
    .sort((a, b) => a.order - b.order);
}

// Convert legacy CardData to blocks format
export function convertLegacyToBlocks(legacyData: {
  firstName?: string;
  lastName?: string;
  title?: string;
  company?: string;
  tagline?: string;
  photoUrl?: string | null;
  logoUrl?: string | null;
  phone?: string;
  email?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  instagram?: string;
  twitter?: string;
  socialLinks?: SocialLink[];
}): CardBlock[] {
  const blocks: CardBlock[] = [];
  let order = 0;

  // Identity block (always first)
  blocks.push({
    ...createIdentityBlock({
      firstName: legacyData.firstName,
      lastName: legacyData.lastName,
      title: legacyData.title,
      company: legacyData.company,
      tagline: legacyData.tagline,
      photoUrl: legacyData.photoUrl,
      logoUrl: legacyData.logoUrl,
    }),
    order: order++,
  });

  // Action blocks in strict order
  if (legacyData.phone) {
    blocks.push({ ...createActionBlock("call", { value: legacyData.phone }), order: order++ });
    blocks.push({ ...createActionBlock("whatsapp", { value: legacyData.phone }), order: order++ });
    blocks.push({ ...createActionBlock("sms", { value: legacyData.phone }), order: order++ });
  }

  if (legacyData.email) {
    blocks.push({ ...createActionBlock("email", { value: legacyData.email }), order: order++ });
  }

  if (legacyData.location) {
    blocks.push({ ...createLocationBlock({ address: legacyData.location }), order: order++ });
  }

  if (legacyData.website) {
    blocks.push({ ...createActionBlock("website", { value: legacyData.website }), order: order++ });
  }

  // Social links
  const socialLinks: SocialLink[] = legacyData.socialLinks || [];
  
  if (legacyData.linkedin) {
    socialLinks.push({ id: "linkedin-legacy", networkId: "linkedin", value: legacyData.linkedin });
  }
  if (legacyData.instagram) {
    socialLinks.push({ id: "instagram-legacy", networkId: "instagram", value: legacyData.instagram });
  }
  if (legacyData.twitter) {
    socialLinks.push({ id: "twitter-legacy", networkId: "twitter", value: legacyData.twitter });
  }

  if (socialLinks.length > 0) {
    blocks.push({ ...createSocialBlock(socialLinks), order: order++ });
  }

  return blocks;
}

// Convert blocks back to legacy CardData format (for compatibility)
export function convertBlocksToLegacy(blocks: CardBlock[]): {
  firstName: string;
  lastName: string;
  title?: string;
  company?: string;
  tagline?: string;
  photoUrl?: string | null;
  logoUrl?: string | null;
  phone?: string;
  email?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  instagram?: string;
  twitter?: string;
  socialLinks?: SocialLink[];
} {
  const result: any = {
    firstName: "",
    lastName: "",
  };

  for (const block of blocks) {
    if (block.type === "identity") {
      const data = (block as IdentityBlock).data;
      result.firstName = data.firstName;
      result.lastName = data.lastName;
      result.title = data.title;
      result.company = data.company;
      result.tagline = data.tagline;
      result.photoUrl = data.photoUrl;
      result.logoUrl = data.logoUrl;
    }

    if (block.type === "action") {
      const data = (block as ActionBlock).data;
      if (data.actionType === "call") result.phone = data.value;
      if (data.actionType === "email") result.email = data.value;
      if (data.actionType === "website") result.website = data.value;
    }

    if (block.type === "location") {
      const data = (block as LocationBlock).data;
      result.location = data.address;
    }

    if (block.type === "social") {
      const data = (block as SocialBlock).data;
      result.socialLinks = data.links;
      
      // Extract legacy fields
      for (const link of data.links) {
        if (link.networkId === "linkedin") result.linkedin = link.value;
        if (link.networkId === "instagram") result.instagram = link.value;
        if (link.networkId === "twitter") result.twitter = link.value;
      }
    }
  }

  return result;
}

// Get Google Maps URL from coordinates or address
export function getGoogleMapsUrl(location: LocationBlock["data"]): string {
  if (location.latitude && location.longitude) {
    return `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
  }
  if (location.placeId) {
    return `https://www.google.com/maps/search/?api=1&query_place_id=${location.placeId}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`;
}

// Get Waze URL from coordinates or address
export function getWazeUrl(location: LocationBlock["data"]): string {
  if (location.latitude && location.longitude) {
    return `https://waze.com/ul?ll=${location.latitude},${location.longitude}&navigate=yes`;
  }
  return `https://waze.com/ul?q=${encodeURIComponent(location.address)}`;
}

// Generate WiFi QR code data string
export function getWifiQrString(wifi: WifiBlock["data"]): string {
  const type = wifi.networkType || "WPA";
  if (type === "open") {
    return `WIFI:S:${wifi.ssid};;`;
  }
  return `WIFI:T:${type};S:${wifi.ssid};P:${wifi.password};;`;
}

// Block type metadata for UI
export const blockTypeInfo: Record<BlockType, { label: string; icon: string; description: string }> = {
  identity: { label: "Identité", icon: "User", description: "Photo, nom, fonction" },
  wifi: { label: "WiFi", icon: "Wifi", description: "SSID et mot de passe" },
  location: { label: "Localisation", icon: "MapPin", description: "Adresse et GPS" },
  action: { label: "Action", icon: "Zap", description: "Appeler, email, site web..." },
  social: { label: "Réseaux sociaux", icon: "Share2", description: "Instagram, LinkedIn..." },
  offer: { label: "Offre", icon: "Gift", description: "Promotion, offre spéciale" },
  info: { label: "Information", icon: "Info", description: "Texte libre, description" },
  divider: { label: "Séparateur", icon: "Minus", description: "Ligne de séparation" },
};
