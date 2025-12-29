import { DigitalCard } from "@/hooks/useCards";

export interface WalletPassData {
  type: "apple" | "google";
  card: DigitalCard;
  organizationName?: string;
  passTypeIdentifier?: string;
  teamIdentifier?: string;
}

export interface AppleWalletPass {
  formatVersion: number;
  passTypeIdentifier: string;
  serialNumber: string;
  teamIdentifier: string;
  organizationName: string;
  description: string;
  logoText: string;
  foregroundColor: string;
  backgroundColor: string;
  labelColor: string;
  generic: {
    primaryFields: Array<{
      key: string;
      label: string;
      value: string;
    }>;
    secondaryFields: Array<{
      key: string;
      label: string;
      value: string;
    }>;
    auxiliaryFields: Array<{
      key: string;
      label: string;
      value: string;
    }>;
    backFields: Array<{
      key: string;
      label: string;
      value: string;
    }>;
  };
  barcodes?: Array<{
    format: string;
    message: string;
    messageEncoding: string;
  }>;
}

export interface GoogleWalletPass {
  classId: string;
  objectId: string;
  cardTitle: {
    defaultValue: {
      language: string;
      value: string;
    };
  };
  subheader: {
    defaultValue: {
      language: string;
      value: string;
    };
  };
  header: {
    defaultValue: {
      language: string;
      value: string;
    };
  };
  textModulesData: Array<{
    id: string;
    header: string;
    body: string;
  }>;
  linksModuleData?: {
    uris: Array<{
      uri: string;
      description: string;
    }>;
  };
  imageModulesData?: Array<{
    id: string;
    mainImage: {
      sourceUri: {
        uri: string;
      };
      contentDescription: {
        defaultValue: {
          language: string;
          value: string;
        };
      };
    };
  }>;
  barcode?: {
    type: string;
    value: string;
    alternateText: string;
  };
  hexBackgroundColor: string;
  heroImage?: {
    sourceUri: {
      uri: string;
    };
    contentDescription: {
      defaultValue: {
        language: string;
        value: string;
      };
    };
  };
}

/**
 * Generate Apple Wallet pass JSON structure
 * In production, this would be signed and packaged as a .pkpass file
 */
export function generateAppleWalletPass(data: WalletPassData): AppleWalletPass {
  const { card } = data;
  const publicUrl = `${window.location.origin}/c/${card.slug}`;

  return {
    formatVersion: 1,
    passTypeIdentifier: data.passTypeIdentifier || "pass.com.iwasp.businesscard",
    serialNumber: card.id,
    teamIdentifier: data.teamIdentifier || "XXXXXXXXXX",
    organizationName: data.organizationName || "IWASP",
    description: `${card.first_name} ${card.last_name} - Business Card`,
    logoText: card.company || "IWASP",
    foregroundColor: "rgb(255, 255, 255)",
    backgroundColor: "rgb(18, 18, 18)",
    labelColor: "rgb(180, 180, 180)",
    generic: {
      primaryFields: [
        {
          key: "name",
          label: "Nom",
          value: `${card.first_name} ${card.last_name}`,
        },
      ],
      secondaryFields: [
        {
          key: "title",
          label: "Fonction",
          value: card.title || "",
        },
        {
          key: "company",
          label: "Entreprise",
          value: card.company || "",
        },
      ],
      auxiliaryFields: [
        {
          key: "phone",
          label: "Téléphone",
          value: card.phone || "",
        },
        {
          key: "email",
          label: "Email",
          value: card.email || "",
        },
      ],
      backFields: [
        {
          key: "website",
          label: "Site web",
          value: card.website || "",
        },
        {
          key: "location",
          label: "Localisation",
          value: card.location || "",
        },
        {
          key: "linkedin",
          label: "LinkedIn",
          value: card.linkedin ? `linkedin.com/in/${card.linkedin}` : "",
        },
        {
          key: "tagline",
          label: "À propos",
          value: card.tagline || "",
        },
      ],
    },
    barcodes: [
      {
        format: "PKBarcodeFormatQR",
        message: publicUrl,
        messageEncoding: "iso-8859-1",
      },
    ],
  };
}

/**
 * Generate Google Wallet pass JSON structure
 * In production, this would be used with Google Wallet API
 */
export function generateGoogleWalletPass(data: WalletPassData): GoogleWalletPass {
  const { card } = data;
  const publicUrl = `${window.location.origin}/c/${card.slug}`;
  const issuerId = "3388000000022319245"; // This would be your actual issuer ID

  return {
    classId: `${issuerId}.iwasp_businesscard_class`,
    objectId: `${issuerId}.${card.id}`,
    cardTitle: {
      defaultValue: {
        language: "fr-FR",
        value: "Carte de visite",
      },
    },
    subheader: {
      defaultValue: {
        language: "fr-FR",
        value: card.title || "Professionnel",
      },
    },
    header: {
      defaultValue: {
        language: "fr-FR",
        value: `${card.first_name} ${card.last_name}`,
      },
    },
    textModulesData: [
      {
        id: "company",
        header: "Entreprise",
        body: card.company || "",
      },
      {
        id: "phone",
        header: "Téléphone",
        body: card.phone || "",
      },
      {
        id: "email",
        header: "Email",
        body: card.email || "",
      },
      {
        id: "location",
        header: "Localisation",
        body: card.location || "",
      },
    ],
    linksModuleData: {
      uris: [
        {
          uri: publicUrl,
          description: "Voir la carte complète",
        },
        ...(card.website
          ? [
              {
                uri: card.website.startsWith("http") ? card.website : `https://${card.website}`,
                description: "Site web",
              },
            ]
          : []),
        ...(card.linkedin
          ? [
              {
                uri: `https://linkedin.com/in/${card.linkedin}`,
                description: "LinkedIn",
              },
            ]
          : []),
      ],
    },
    barcode: {
      type: "QR_CODE",
      value: publicUrl,
      alternateText: card.slug,
    },
    hexBackgroundColor: "#121212",
    ...(card.photo_url && {
      heroImage: {
        sourceUri: {
          uri: card.photo_url,
        },
        contentDescription: {
          defaultValue: {
            language: "fr-FR",
            value: `Photo de ${card.first_name} ${card.last_name}`,
          },
        },
      },
    }),
  };
}

/**
 * Create Apple Wallet "Add to Wallet" link
 * In production, this would point to your backend that generates signed .pkpass files
 */
export function getAppleWalletAddUrl(card: DigitalCard): string {
  // In production, this would be your API endpoint that generates the .pkpass file
  // The backend would need to:
  // 1. Generate the pass.json
  // 2. Add required images (icon.png, logo.png)
  // 3. Create manifest.json with SHA hashes
  // 4. Sign with Apple Developer certificate
  // 5. Package as .pkpass (ZIP with specific structure)
  return `/api/wallet/apple/${card.id}`;
}

/**
 * Create Google Wallet "Add to Wallet" link
 * In production, this would use Google Wallet API
 */
export function getGoogleWalletAddUrl(card: DigitalCard): string {
  // In production, this would generate a JWT signed with your service account
  // and create the proper Google Wallet save link
  // The structure would be: https://pay.google.com/gp/v/save/{jwt}
  return `/api/wallet/google/${card.id}`;
}

/**
 * Check if device supports Apple Wallet
 */
export function supportsAppleWallet(): boolean {
  const userAgent = navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
}

/**
 * Check if device supports Google Wallet
 */
export function supportsGoogleWallet(): boolean {
  const userAgent = navigator.userAgent.toLowerCase();
  return /android/.test(userAgent);
}

/**
 * Get appropriate wallet type for current device
 */
export function getPreferredWallet(): "apple" | "google" | "both" {
  if (supportsAppleWallet()) return "apple";
  if (supportsGoogleWallet()) return "google";
  return "both"; // Desktop - show both options
}