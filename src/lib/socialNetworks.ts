// Social network definitions with icons and URL patterns
export interface SocialNetwork {
  id: string;
  label: string;
  category: "classic" | "professional" | "creators" | "business";
  placeholder: string;
  urlTemplate: string; // Use {value} as placeholder for user input
  appScheme?: string; // Native app deep link
  icon: string; // Lucide icon name
}

export interface SocialLink {
  id: string;
  networkId: string;
  value: string;
}

export const socialNetworks: SocialNetwork[] = [
  // Classic
  { id: "linkedin", label: "LinkedIn", category: "classic", placeholder: "votre-profil", urlTemplate: "https://linkedin.com/in/{value}", appScheme: "linkedin://in/{value}", icon: "Linkedin" },
  { id: "instagram", label: "Instagram", category: "classic", placeholder: "@username", urlTemplate: "https://instagram.com/{value}", appScheme: "instagram://user?username={value}", icon: "Instagram" },
  { id: "facebook", label: "Facebook", category: "classic", placeholder: "username", urlTemplate: "https://facebook.com/{value}", appScheme: "fb://profile/{value}", icon: "Facebook" },
  { id: "twitter", label: "X (Twitter)", category: "classic", placeholder: "@username", urlTemplate: "https://twitter.com/{value}", appScheme: "twitter://user?screen_name={value}", icon: "Twitter" },
  { id: "tiktok", label: "TikTok", category: "classic", placeholder: "@username", urlTemplate: "https://tiktok.com/@{value}", appScheme: "snssdk1233://user/profile/{value}", icon: "Music" },
  { id: "snapchat", label: "Snapchat", category: "classic", placeholder: "username", urlTemplate: "https://snapchat.com/add/{value}", appScheme: "snapchat://add/{value}", icon: "Camera" },
  { id: "youtube", label: "YouTube", category: "classic", placeholder: "@channel", urlTemplate: "https://youtube.com/@{value}", appScheme: "vnd.youtube://www.youtube.com/@{value}", icon: "Youtube" },
  
  // Professional
  { id: "whatsapp", label: "WhatsApp", category: "professional", placeholder: "+212612345678", urlTemplate: "https://wa.me/{value}", appScheme: "whatsapp://send?phone={value}", icon: "MessageCircle" },
  { id: "telegram", label: "Telegram", category: "professional", placeholder: "@username", urlTemplate: "https://t.me/{value}", appScheme: "tg://resolve?domain={value}", icon: "Send" },
  { id: "calendly", label: "Calendly", category: "professional", placeholder: "votre-lien", urlTemplate: "https://calendly.com/{value}", icon: "Calendar" },
  { id: "email", label: "Email", category: "professional", placeholder: "email@example.com", urlTemplate: "mailto:{value}", icon: "Mail" },
  { id: "phone", label: "Téléphone", category: "professional", placeholder: "+212612345678", urlTemplate: "tel:{value}", icon: "Phone" },
  
  // Creators / Tech
  { id: "github", label: "GitHub", category: "creators", placeholder: "username", urlTemplate: "https://github.com/{value}", icon: "Github" },
  { id: "behance", label: "Behance", category: "creators", placeholder: "username", urlTemplate: "https://behance.net/{value}", icon: "Palette" },
  { id: "dribbble", label: "Dribbble", category: "creators", placeholder: "username", urlTemplate: "https://dribbble.com/{value}", icon: "Dribbble" },
  { id: "notion", label: "Notion", category: "creators", placeholder: "page-id", urlTemplate: "https://notion.so/{value}", icon: "FileText" },
  { id: "medium", label: "Medium", category: "creators", placeholder: "@username", urlTemplate: "https://medium.com/@{value}", icon: "BookOpen" },
  
  // Business
  { id: "google-business", label: "Google Business", category: "business", placeholder: "business-id", urlTemplate: "https://g.page/{value}", icon: "Building2" },
  { id: "website", label: "Site web", category: "business", placeholder: "www.example.com", urlTemplate: "https://{value}", icon: "Globe" },
  { id: "store", label: "Boutique", category: "business", placeholder: "url-boutique", urlTemplate: "https://{value}", icon: "ShoppingBag" },
];

export function getNetworkById(id: string): SocialNetwork | undefined {
  return socialNetworks.find(n => n.id === id);
}

export function getSocialUrl(networkId: string, value: string, preferNativeApp = true): string {
  const network = getNetworkById(networkId);
  if (!network) return "";
  
  // Clean value
  const cleanValue = value.replace(/^[@+]/, '').trim();
  
  // For phone numbers, keep the + if present
  const finalValue = networkId === "phone" || networkId === "whatsapp" 
    ? value.replace(/\s/g, '') 
    : cleanValue;
  
  // Try native app on mobile
  if (preferNativeApp && network.appScheme && isMobile()) {
    return network.appScheme.replace("{value}", finalValue);
  }
  
  return network.urlTemplate.replace("{value}", finalValue);
}

export function isMobile(): boolean {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

export function isIOS(): boolean {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function isAndroid(): boolean {
  return /Android/i.test(navigator.userAgent);
}

// Generate map URL based on platform
export function getMapUrl(address: string, app: "google" | "waze" | "apple" = "google"): string {
  const encodedAddress = encodeURIComponent(address);
  
  switch (app) {
    case "google":
      return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    case "waze":
      return `https://waze.com/ul?q=${encodedAddress}`;
    case "apple":
      return `http://maps.apple.com/?q=${encodedAddress}`;
    default:
      return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  }
}

// Get default map app based on platform
export function getDefaultMapApp(): "google" | "apple" {
  return isIOS() ? "apple" : "google";
}

// Open map with smart platform detection
export function openMap(address: string): void {
  const app = getDefaultMapApp();
  window.open(getMapUrl(address, app), "_blank");
}
