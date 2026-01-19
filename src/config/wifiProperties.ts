/**
 * Wi-Fi Properties Configuration
 * 
 * Centralized configuration for all luxury rental properties
 * Each property can have multiple Wi-Fi networks
 */

export interface WifiNetwork {
  ssid: string;
  password: string;
  security: string;
  label: string;
  recommended: boolean;
  description: string;
}

export interface PropertyConfig {
  slug: string;
  brandName: string;
  suiteName?: string;
  subtitle: string;
  footerText: string;
  footerTagline: string;
  whatsappNumber?: string;
  networks: WifiNetwork[];
}

export const WIFI_PROPERTIES: Record<string, PropertyConfig> = {
  "nour-prestige": {
    slug: "nour-prestige",
    brandName: "Nour Prestige",
    subtitle: "Appartement Officiel – Accès Wi-Fi Privé",
    footerText: "Merci de séjourner chez Nour Prestige",
    footerTagline: "Résidences de Luxe",
    whatsappNumber: "+212600000000",
    networks: [
      {
        ssid: "HUAWEI-5G-DxH5",
        password: "NR3ea9N3",
        security: "WPA",
        label: "Connexion Wi-Fi 5G",
        recommended: true,
        description: "Recommandé – Vitesse maximale"
      },
      {
        ssid: "HUAWEI-2.4G-DxH5",
        password: "NR3ea9N3",
        security: "WPA",
        label: "Connexion Wi-Fi 2.4G",
        recommended: false,
        description: "Compatible tous appareils"
      }
    ]
  },
  "abiir-2": {
    slug: "abiir-2",
    brandName: "Abiir",
    suiteName: "Suite 2",
    subtitle: "Appartement Officiel – Accès Wi-Fi Privé",
    footerText: "Merci de séjourner chez Abiir",
    footerTagline: "Résidences de Luxe",
    whatsappNumber: "+212600000000",
    networks: [
      {
        ssid: "Souhail",
        password: "Paname75@",
        security: "WPA",
        label: "Connexion Wi-Fi",
        recommended: true,
        description: "Réseau principal"
      }
    ]
  },
  // Template for adding new properties:
  // "property-slug": {
  //   slug: "property-slug",
  //   brandName: "Brand Name",
  //   suiteName: "Suite X",
  //   subtitle: "Appartement Officiel – Accès Wi-Fi Privé",
  //   footerText: "Merci de séjourner chez Brand Name",
  //   footerTagline: "Résidences de Luxe",
  //   networks: [
  //     {
  //       ssid: "WIFI_NAME",
  //       password: "WIFI_PASSWORD",
  //       security: "WPA",
  //       label: "Connexion Wi-Fi",
  //       recommended: true,
  //       description: "Réseau principal"
  //     }
  //   ]
  // }
};

export const getPropertyBySlug = (slug: string): PropertyConfig | undefined => {
  return WIFI_PROPERTIES[slug];
};

export const getAllPropertySlugs = (): string[] => {
  return Object.keys(WIFI_PROPERTIES);
};
