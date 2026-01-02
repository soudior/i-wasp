// Social network definitions with icons and URL patterns
export interface SocialNetwork {
  id: string;
  label: string;
  category: "classic" | "professional" | "creators" | "business";
  placeholder: string;
  urlTemplate: string; // Use {value} as placeholder for user input
  appScheme?: string; // Native app deep link
  icon: string; // Lucide icon name
  validationPattern?: RegExp; // Pattern to validate input
  normalizeInput?: (input: string) => string; // Custom normalization
}

export interface SocialLink {
  id: string;
  networkId: string;
  value: string;
}

/**
 * Normalize username input - removes URLs, @, slashes, etc.
 * Stores only clean usernames, never full URLs
 */
export function normalizeUsername(input: string, networkId?: string): string {
  if (!input) return "";
  
  let normalized = input.trim().toLowerCase();
  
  // Remove common URL prefixes
  const urlPatterns = [
    /^https?:\/\/(www\.)?/i,
    /^(www\.)?instagram\.com\//i,
    /^(www\.)?snapchat\.com\/add\//i,
    /^(www\.)?t\.me\//i,
    /^(www\.)?telegram\.me\//i,
    /^(www\.)?tiktok\.com\/@?/i,
    /^(www\.)?twitter\.com\//i,
    /^(www\.)?x\.com\//i,
    /^(www\.)?linkedin\.com\/in\//i,
    /^(www\.)?facebook\.com\//i,
    /^(www\.)?github\.com\//i,
    /^(www\.)?youtube\.com\/@?/i,
    /^(www\.)?behance\.net\//i,
    /^(www\.)?dribbble\.com\//i,
    /^(www\.)?medium\.com\/@?/i,
    /^(www\.)?calendly\.com\//i,
    /^(www\.)?wa\.me\//i,
    /^(www\.)?notion\.so\//i,
  ];
  
  for (const pattern of urlPatterns) {
    normalized = normalized.replace(pattern, "");
  }
  
  // Remove leading @ for usernames
  normalized = normalized.replace(/^@+/, "");
  
  // Remove trailing slashes and query params
  normalized = normalized.split("?")[0].replace(/\/+$/, "");
  
  // For phone networks, keep + and digits only
  if (networkId === "phone" || networkId === "whatsapp") {
    return input.replace(/[^\d+]/g, "");
  }
  
  // For email, just trim
  if (networkId === "email") {
    return input.trim().toLowerCase();
  }
  
  // For website, handle differently
  if (networkId === "website" || networkId === "store" || networkId === "google-business") {
    let url = input.trim();
    url = url.replace(/^https?:\/\//i, "");
    url = url.replace(/^www\./i, "");
    return url.replace(/\/+$/, "");
  }
  
  return normalized;
}

/**
 * Validate username format for a network
 */
export function validateUsername(input: string, networkId: string): { valid: boolean; error?: string } {
  if (!input.trim()) {
    return { valid: false, error: "Ce champ est requis" };
  }
  
  const network = getNetworkById(networkId);
  if (!network) {
    return { valid: true };
  }
  
  const normalized = normalizeUsername(input, networkId);
  
  // Specific validations
  if (networkId === "email") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalized)) {
      return { valid: false, error: "Format email invalide" };
    }
  }
  
  if (networkId === "phone" || networkId === "whatsapp") {
    const phoneRegex = /^\+?[0-9]{8,15}$/;
    if (!phoneRegex.test(normalized)) {
      return { valid: false, error: "Format téléphone invalide" };
    }
  }
  
  // General username validation (no spaces, reasonable length)
  if (!["phone", "whatsapp", "email", "website", "store", "google-business", "calendly", "notion"].includes(networkId)) {
    if (normalized.includes(" ")) {
      return { valid: false, error: "Le nom d'utilisateur ne doit pas contenir d'espaces" };
    }
    if (normalized.length > 100) {
      return { valid: false, error: "Nom d'utilisateur trop long" };
    }
  }
  
  return { valid: true };
}

export const socialNetworks: SocialNetwork[] = [
  // Classic Social
  { id: "linkedin", label: "LinkedIn", category: "classic", placeholder: "votre-profil", urlTemplate: "https://linkedin.com/in/{value}", appScheme: "linkedin://in/{value}", icon: "Linkedin" },
  { id: "instagram", label: "Instagram", category: "classic", placeholder: "username", urlTemplate: "https://instagram.com/{value}", appScheme: "instagram://user?username={value}", icon: "Instagram" },
  { id: "facebook", label: "Facebook", category: "classic", placeholder: "username", urlTemplate: "https://facebook.com/{value}", appScheme: "fb://profile/{value}", icon: "Facebook" },
  { id: "twitter", label: "X (Twitter)", category: "classic", placeholder: "username", urlTemplate: "https://twitter.com/{value}", appScheme: "twitter://user?screen_name={value}", icon: "Twitter" },
  { id: "tiktok", label: "TikTok", category: "classic", placeholder: "username", urlTemplate: "https://tiktok.com/@{value}", appScheme: "snssdk1233://user/profile/{value}", icon: "Music" },
  { id: "snapchat", label: "Snapchat", category: "classic", placeholder: "username", urlTemplate: "https://snapchat.com/add/{value}", appScheme: "snapchat://add/{value}", icon: "Camera" },
  { id: "youtube", label: "YouTube", category: "classic", placeholder: "channel", urlTemplate: "https://youtube.com/@{value}", appScheme: "vnd.youtube://www.youtube.com/@{value}", icon: "Youtube" },
  { id: "pinterest", label: "Pinterest", category: "classic", placeholder: "username", urlTemplate: "https://pinterest.com/{value}", icon: "Heart" },
  { id: "threads", label: "Threads", category: "classic", placeholder: "username", urlTemplate: "https://threads.net/@{value}", icon: "AtSign" },
  
  // Professional / Contact
  { id: "whatsapp", label: "WhatsApp", category: "professional", placeholder: "+212612345678", urlTemplate: "https://wa.me/{value}", appScheme: "whatsapp://send?phone={value}", icon: "MessageCircle" },
  { id: "telegram", label: "Telegram", category: "professional", placeholder: "username", urlTemplate: "https://t.me/{value}", appScheme: "tg://resolve?domain={value}", icon: "Send" },
  { id: "calendly", label: "Calendly", category: "professional", placeholder: "votre-lien", urlTemplate: "https://calendly.com/{value}", icon: "Calendar" },
  { id: "doctolib", label: "Doctolib", category: "professional", placeholder: "votre-cabinet", urlTemplate: "https://doctolib.fr/{value}", icon: "Stethoscope" },
  { id: "email", label: "Email", category: "professional", placeholder: "email@example.com", urlTemplate: "mailto:{value}", icon: "Mail" },
  { id: "phone", label: "Téléphone", category: "professional", placeholder: "+212612345678", urlTemplate: "tel:{value}", icon: "Phone" },
  
  // Creators / Entertainment
  { id: "spotify", label: "Spotify", category: "creators", placeholder: "artist/playlist-id", urlTemplate: "https://open.spotify.com/{value}", appScheme: "spotify://{value}", icon: "Music2" },
  { id: "applemusic", label: "Apple Music", category: "creators", placeholder: "artist/album-id", urlTemplate: "https://music.apple.com/{value}", icon: "Headphones" },
  { id: "soundcloud", label: "SoundCloud", category: "creators", placeholder: "username", urlTemplate: "https://soundcloud.com/{value}", icon: "Disc" },
  { id: "github", label: "GitHub", category: "creators", placeholder: "username", urlTemplate: "https://github.com/{value}", icon: "Github" },
  { id: "behance", label: "Behance", category: "creators", placeholder: "username", urlTemplate: "https://behance.net/{value}", icon: "Palette" },
  { id: "dribbble", label: "Dribbble", category: "creators", placeholder: "username", urlTemplate: "https://dribbble.com/{value}", icon: "Dribbble" },
  { id: "notion", label: "Notion", category: "creators", placeholder: "page-id", urlTemplate: "https://notion.so/{value}", icon: "FileText" },
  { id: "medium", label: "Medium", category: "creators", placeholder: "username", urlTemplate: "https://medium.com/@{value}", icon: "BookOpen" },
  { id: "twitch", label: "Twitch", category: "creators", placeholder: "channel", urlTemplate: "https://twitch.tv/{value}", icon: "Tv" },
  
  // Business / Hospitality
  { id: "google-business", label: "Google Business", category: "business", placeholder: "business-id", urlTemplate: "https://g.page/{value}", icon: "Building2" },
  { id: "tripadvisor", label: "TripAdvisor", category: "business", placeholder: "hotel-id", urlTemplate: "https://tripadvisor.com/{value}", icon: "Star" },
  { id: "booking", label: "Booking.com", category: "business", placeholder: "hotel-slug", urlTemplate: "https://booking.com/hotel/{value}", icon: "BedDouble" },
  { id: "airbnb", label: "Airbnb", category: "business", placeholder: "listing-id", urlTemplate: "https://airbnb.com/rooms/{value}", icon: "Home" },
  { id: "website", label: "Site web", category: "business", placeholder: "example.com", urlTemplate: "https://{value}", icon: "Globe" },
  { id: "store", label: "Boutique", category: "business", placeholder: "example.com/shop", urlTemplate: "https://{value}", icon: "ShoppingBag" },
  { id: "menu", label: "Menu / Carte", category: "business", placeholder: "lien-menu", urlTemplate: "https://{value}", icon: "UtensilsCrossed" },
  { id: "reservation", label: "Réservation", category: "business", placeholder: "lien-booking", urlTemplate: "https://{value}", icon: "CalendarCheck" },
];

export function getNetworkById(id: string): SocialNetwork | undefined {
  return socialNetworks.find(n => n.id === id);
}

/**
 * Smart Links - Intelligent URL generation with native app priority
 * Detects platform (iOS/Android) and redirects to appropriate app scheme
 */
export function getSocialUrl(networkId: string, value: string, preferNativeApp = true): string {
  const network = getNetworkById(networkId);
  if (!network) return "";
  
  // Normalize the value first
  const normalizedValue = normalizeUsername(value, networkId);
  
  // For phone numbers with WhatsApp, remove the + for wa.me
  const finalValue = networkId === "whatsapp" 
    ? normalizedValue.replace(/^\+/, '')
    : normalizedValue;
  
  const webUrl = network.urlTemplate.replace("{value}", finalValue);
  
  // Smart Links: Try native app on mobile with intelligent fallback
  if (preferNativeApp && isMobile() && network.appScheme) {
    const appUrl = network.appScheme.replace("{value}", finalValue);
    
    // For iOS, use universal links where available for better UX
    if (isIOS()) {
      // These networks support iOS Universal Links - they open the app if installed
      const universalLinkNetworks = ['instagram', 'linkedin', 'twitter', 'youtube', 'spotify', 'tiktok'];
      if (universalLinkNetworks.includes(networkId)) {
        return webUrl; // Universal links work through web URLs on iOS
      }
      return appUrl;
    }
    
    // For Android, use intent scheme for better app detection
    if (isAndroid()) {
      // WhatsApp, Telegram, etc. work better with their app schemes on Android
      return appUrl;
    }
    
    return appUrl;
  }
  
  return webUrl;
}

/**
 * Open a social link with smart app detection
 * Attempts to open native app, falls back to web if not installed
 */
export function openSmartLink(networkId: string, value: string): void {
  const network = getNetworkById(networkId);
  if (!network || !value) return;
  
  const normalizedValue = normalizeUsername(value, networkId);
  const finalValue = networkId === "whatsapp" 
    ? normalizedValue.replace(/^\+/, '')
    : normalizedValue;
  
  const webUrl = network.urlTemplate.replace("{value}", finalValue);
  
  // On mobile, try native app first with timeout fallback
  if (isMobile() && network.appScheme) {
    const appUrl = network.appScheme.replace("{value}", finalValue);
    
    // Store current time to detect if app opened
    const startTime = Date.now();
    
    // Create hidden iframe to try opening app
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = appUrl;
    document.body.appendChild(iframe);
    
    // Fallback to web if app doesn't open within 1.5s
    setTimeout(() => {
      document.body.removeChild(iframe);
      // If still on page after 1.5s, app didn't open - use web URL
      if (Date.now() - startTime < 2000) {
        window.open(webUrl, '_blank');
      }
    }, 1500);
    
    // Also try window.location for some apps
    window.location.href = appUrl;
  } else {
    window.open(webUrl, '_blank');
  }
}

/**
 * Get appropriate icon based on platform
 */
export function getPlatformSpecificLabel(networkId: string): string {
  const network = getNetworkById(networkId);
  if (!network) return "";
  
  if (isMobile() && network.appScheme) {
    return `Ouvrir ${network.label}`;
  }
  return `Voir sur ${network.label}`;
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
