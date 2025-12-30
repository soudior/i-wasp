/**
 * IWASP Restaurant Template
 * 
 * Modules métier :
 * - Menu (obligatoire)
 * - Wi-Fi (obligatoire)
 * - Réservation (obligatoire)
 * - Avis (optionnel)
 * 
 * Design : Sobre, fonctionnel, orienté action.
 */

import { IWASPBrandBadgeMinimal } from "./IWASPBrandBadge";
import { CardData, TemplateProps } from "./CardTemplates";
import { 
  UtensilsCrossed, 
  Wifi, 
  CalendarCheck, 
  Star,
  MapPin,
  Phone,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RestaurantData extends CardData {
  // Restaurant specific
  menuUrl?: string;
  reservationUrl?: string;
  reservationPhone?: string;
  googleReviewsUrl?: string;
  tripAdvisorUrl?: string;
  wifiSsid?: string;
  wifiPassword?: string;
  openingHours?: string;
  cuisine?: string;
}

const defaultData: RestaurantData = {
  firstName: "Le",
  lastName: "Bistrot",
  company: "Restaurant Gastronomique",
  location: "12 Rue de la Paix, Paris",
  phone: "+33 1 23 45 67 89",
  cuisine: "Cuisine française",
  openingHours: "12h-14h30 · 19h-22h30",
};

export function RestaurantTemplate({ 
  data = defaultData, 
  showWalletButtons = true, 
  onShareInfo, 
  cardId, 
  enableLeadCapture 
}: TemplateProps) {
  const cardData = { ...defaultData, ...data } as RestaurantData;
  const logoSrc = cardData.logoUrl;
  
  // Actions with URLs
  const handleMenuClick = () => {
    if (cardData.menuUrl) {
      window.open(cardData.menuUrl, "_blank");
    } else if (cardData.website) {
      window.open(`https://${cardData.website.replace(/^https?:\/\//, "")}`, "_blank");
    }
  };

  const handleReservationClick = () => {
    if (cardData.reservationUrl) {
      window.open(cardData.reservationUrl, "_blank");
    } else if (cardData.reservationPhone || cardData.phone) {
      window.location.href = `tel:${cardData.reservationPhone || cardData.phone}`;
    }
  };

  const handleReviewsClick = () => {
    if (cardData.googleReviewsUrl) {
      window.open(cardData.googleReviewsUrl, "_blank");
    } else if (cardData.tripAdvisorUrl) {
      window.open(cardData.tripAdvisorUrl, "_blank");
    }
  };

  const handleLocationClick = () => {
    if (cardData.location) {
      window.open(`https://maps.google.com/?q=${encodeURIComponent(cardData.location)}`, "_blank");
    }
  };

  const handleCallClick = () => {
    if (cardData.phone) {
      window.location.href = `tel:${cardData.phone}`;
    }
  };

  // Wi-Fi QR string
  const wifiString = cardData.wifiSsid 
    ? `WIFI:T:WPA;S:${cardData.wifiSsid};P:${cardData.wifiPassword || ""};;`
    : "";

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Card container */}
      <div className="relative rounded-3xl overflow-hidden bg-[hsl(var(--card))] border border-border/30">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
        
        <div className="p-6 pb-5">
          {/* Header - Logo + IWASP Badge */}
          <div className="flex items-start justify-between mb-6">
            {logoSrc ? (
              <img 
                src={logoSrc} 
                alt="Logo" 
                className="h-12 w-auto object-contain" 
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center">
                <UtensilsCrossed className="w-6 h-6 text-muted-foreground" />
              </div>
            )}
            <IWASPBrandBadgeMinimal variant="dark" />
          </div>

          {/* Restaurant Name */}
          <div className="mb-6">
            <h1 className="font-display text-xl font-semibold text-foreground mb-1">
              {cardData.firstName} {cardData.lastName}
            </h1>
            {cardData.cuisine && (
              <p className="text-sm text-muted-foreground">
                {cardData.cuisine}
              </p>
            )}
          </div>

          {/* Quick Info */}
          <div className="flex flex-wrap gap-3 mb-6">
            {cardData.openingHours && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                <span>{cardData.openingHours}</span>
              </div>
            )}
          </div>

          {/* Primary Actions - Modules métier */}
          <div className="space-y-2 mb-4">
            {/* Menu */}
            <ActionButton
              icon={<UtensilsCrossed className="w-4 h-4" />}
              label="Voir le menu"
              onClick={handleMenuClick}
              variant="primary"
            />

            {/* Réservation */}
            <ActionButton
              icon={<CalendarCheck className="w-4 h-4" />}
              label="Réserver une table"
              onClick={handleReservationClick}
            />

            {/* Wi-Fi */}
            {cardData.wifiSsid && (
              <WifiButton
                ssid={cardData.wifiSsid}
                wifiString={wifiString}
              />
            )}

            {/* Avis */}
            {(cardData.googleReviewsUrl || cardData.tripAdvisorUrl) && (
              <ActionButton
                icon={<Star className="w-4 h-4" />}
                label="Laisser un avis"
                onClick={handleReviewsClick}
              />
            )}
          </div>

          {/* Secondary Actions */}
          <div className="flex gap-2">
            {cardData.location && (
              <button
                onClick={handleLocationClick}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
              >
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Itinéraire</span>
              </button>
            )}
            {cardData.phone && (
              <button
                onClick={handleCallClick}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
              >
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Appeler</span>
              </button>
            )}
          </div>
        </div>

        {/* Bottom line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/5 to-transparent" />
      </div>
    </div>
  );
}

// Action Button Component
function ActionButton({ 
  icon, 
  label, 
  onClick,
  variant = "default"
}: { 
  icon: React.ReactNode; 
  label: string; 
  onClick: () => void;
  variant?: "default" | "primary";
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all active:scale-[0.98]",
        variant === "primary" 
          ? "bg-foreground text-background hover:bg-foreground/90" 
          : "bg-muted/50 hover:bg-muted text-foreground"
      )}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

// Wi-Fi Button with QR hint
function WifiButton({ 
  ssid, 
  wifiString 
}: { 
  ssid: string; 
  wifiString: string;
}) {
  const handleClick = () => {
    // On mobile, some browsers support wifi: scheme
    // Fallback: show QR or copy SSID
    if (navigator.share) {
      navigator.share({
        title: "Wi-Fi",
        text: `Réseau: ${ssid}`,
      }).catch(() => {});
    }
  };

  return (
    <button
      onClick={handleClick}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/50 hover:bg-muted transition-all active:scale-[0.98]"
    >
      <Wifi className="w-4 h-4 text-foreground" />
      <div className="flex-1 text-left">
        <span className="text-sm font-medium text-foreground">Wi-Fi Gratuit</span>
        <span className="text-xs text-muted-foreground ml-2">{ssid}</span>
      </div>
    </button>
  );
}