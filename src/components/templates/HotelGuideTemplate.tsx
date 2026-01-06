/**
 * IWASP Hotel & Tourist Guide Template
 * Premium NFC card for hotels, riads, and tourist guides
 * 
 * Features:
 * - IWASP + NFC logo fixed top-right
 * - Hotel identity section
 * - Concierge/reception info
 * - Dedicated ActionList (call reception, WiFi, daily offer, maps, reviews)
 * - Apple/Google Wallet buttons
 * - Glassmorphism premium design
 * - Multilingual support ready
 */

import { useState } from "react";
import { IWASPBrandBadge } from "./IWASPBrandBadge";
import { IWASPBrandingInline } from "@/components/IWASPBrandingFooter";
import { CardActionButtons } from "./CardActions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, Wifi, MapPin, Star, Gift, Navigation, Copy, Check,
  Globe, Building2, User, Clock, ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Hotel-specific data interface
export interface HotelCardData {
  // Hotel identity
  hotelName: string;
  hotelCategory?: string; // "5★ Hotel" | "Riad" | "Boutique Hotel"
  hotelLogo?: string;
  hotelTagline?: string;
  
  // Concierge / Reception
  conciergePhoto?: string;
  conciergeName?: string;
  conciergeRole?: string; // "Concierge" | "Reception" | "Manager"
  
  // Contact
  receptionPhone?: string;
  whatsappNumber?: string;
  email?: string;
  
  // WiFi
  wifiSsid?: string;
  wifiPassword?: string;
  
  // Location
  address?: string;
  googleMapsUrl?: string;
  
  // Content
  dailyOffer?: {
    title: string;
    description: string;
    validUntil?: string;
  };
  
  // Places to visit
  placesToVisit?: Array<{
    name: string;
    description?: string;
    url?: string;
    distance?: string;
  }>;
  
  // Reviews
  googleReviewsUrl?: string;
  tripAdvisorUrl?: string;
  googleRating?: number;
  
  // Multilingual
  language?: "fr" | "en" | "ar" | "es";
}

export interface HotelTemplateProps {
  data: HotelCardData;
  showWalletButtons?: boolean;
  cardId?: string;
  enableLeadCapture?: boolean;
  onShareInfo?: () => void;
}

// Translations
const translations = {
  fr: {
    callReception: "Appeler la réception",
    wifiAccess: "Accès WiFi",
    copyPassword: "Copier",
    copied: "Copié !",
    dailyOffer: "Offre du jour",
    validUntil: "Valable jusqu'au",
    getDirections: "Itinéraire",
    googleMaps: "Google Maps",
    waze: "Waze",
    placesToVisit: "À découvrir",
    seeMore: "Voir plus",
    reviews: "Avis clients",
    googleReviews: "Avis Google",
    tripAdvisor: "TripAdvisor",
    poweredBy: "Powered by I-WASP.com",
    addToContacts: "Ajouter aux contacts",
    shareInfo: "Partager mes coordonnées",
  },
  en: {
    callReception: "Call Reception",
    wifiAccess: "WiFi Access",
    copyPassword: "Copy",
    copied: "Copied!",
    dailyOffer: "Daily Offer",
    validUntil: "Valid until",
    getDirections: "Get Directions",
    googleMaps: "Google Maps",
    waze: "Waze",
    placesToVisit: "Places to Visit",
    seeMore: "See more",
    reviews: "Guest Reviews",
    googleReviews: "Google Reviews",
    tripAdvisor: "TripAdvisor",
    poweredBy: "Powered by I-WASP.com",
    addToContacts: "Add to Contacts",
    shareInfo: "Share my info",
  },
  ar: {
    callReception: "اتصل بالاستقبال",
    wifiAccess: "واي فاي",
    copyPassword: "نسخ",
    copied: "تم النسخ!",
    dailyOffer: "عرض اليوم",
    validUntil: "صالح حتى",
    getDirections: "الاتجاهات",
    googleMaps: "خرائط جوجل",
    waze: "ويز",
    placesToVisit: "أماكن للزيارة",
    seeMore: "المزيد",
    reviews: "آراء الضيوف",
    googleReviews: "تقييمات جوجل",
    tripAdvisor: "تريب أدفايزر",
    poweredBy: "مدعوم من I-WASP.com",
    addToContacts: "إضافة إلى جهات الاتصال",
    shareInfo: "مشاركة معلوماتي",
  },
  es: {
    callReception: "Llamar Recepción",
    wifiAccess: "Acceso WiFi",
    copyPassword: "Copiar",
    copied: "¡Copiado!",
    dailyOffer: "Oferta del día",
    validUntil: "Válido hasta",
    getDirections: "Direcciones",
    googleMaps: "Google Maps",
    waze: "Waze",
    placesToVisit: "Lugares para visitar",
    seeMore: "Ver más",
    reviews: "Opiniones",
    googleReviews: "Reseñas Google",
    tripAdvisor: "TripAdvisor",
    poweredBy: "Powered by I-WASP.com",
    addToContacts: "Añadir a contactos",
    shareInfo: "Compartir mis datos",
  },
};

// Empty data for empty preview state - NO HARDCODED VALUES
const emptyHotelData: HotelCardData = {
  hotelName: "",
};

export function HotelGuideTemplate({ 
  data, 
  showWalletButtons = true, 
  cardId,
  enableLeadCapture,
  onShareInfo,
}: HotelTemplateProps) {
  // Use only user-provided data, no defaults
  const hotelData = data;
  const t = translations[hotelData.language || "fr"];
  const [wifiCopied, setWifiCopied] = useState(false);
  const [showPlaces, setShowPlaces] = useState(false);

  // Don't render anything if no hotel name
  if (!hotelData.hotelName) {
    return (
      <div className="w-full max-w-sm mx-auto p-8 text-center">
        <p className="text-muted-foreground">Configurez votre carte hôtel dans l'éditeur</p>
      </div>
    );
  }

  const handleCopyWifi = async () => {
    if (hotelData.wifiPassword) {
      await navigator.clipboard.writeText(hotelData.wifiPassword);
      setWifiCopied(true);
      toast.success(t.copied);
      setTimeout(() => setWifiCopied(false), 2000);
    }
  };

  const handleCall = () => {
    if (hotelData.receptionPhone) {
      window.location.href = `tel:${hotelData.receptionPhone}`;
    }
  };

  const handleMaps = (app: "google" | "waze") => {
    const address = encodeURIComponent(hotelData.address || "");
    if (app === "google") {
      window.open(hotelData.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${address}`, "_blank");
    } else {
      window.open(`https://waze.com/ul?q=${address}`, "_blank");
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto animate-card-enter">
      {/* Card container - Premium glassmorphism */}
      <div className="relative rounded-3xl overflow-hidden">
        {/* Background gradient - Luxury hotel aesthetic */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.1),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(251,191,36,0.05),transparent_50%)]" />
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjEiLz48L2c+PC9zdmc+')]" />
        
        <div className="relative p-6">
          {/* HEADER - Hotel Logo + IWASP NFC (fixed top-right) */}
          <div className="flex items-start justify-between mb-6">
            {/* Hotel Logo */}
            <div className="flex-1">
              {hotelData.hotelLogo ? (
                <img 
                  src={hotelData.hotelLogo} 
                  alt={hotelData.hotelName} 
                  className="h-12 w-auto object-contain"
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-amber-500/20 backdrop-blur-sm flex items-center justify-center border border-amber-500/30">
                  <Building2 size={24} className="text-amber-400" />
                </div>
              )}
            </div>

            {/* IWASP "IWasp )))" Brand Badge - ALWAYS TOP RIGHT - FIXED */}
            <IWASPBrandBadge variant="dark" />
          </div>

          {/* HOTEL IDENTITY */}
          <div className="mb-6">
            {hotelData.hotelCategory && (
              <Badge className="mb-2 bg-amber-500/20 text-amber-400 border-amber-500/30">
                {hotelData.hotelCategory}
              </Badge>
            )}
            <h1 className="font-display text-2xl font-semibold text-white tracking-tight">
              {hotelData.hotelName}
            </h1>
            {hotelData.hotelTagline && (
              <p className="text-amber-100/60 text-sm mt-1 italic">
                {hotelData.hotelTagline}
              </p>
            )}
          </div>

          {/* CONCIERGE / RECEPTION */}
          {hotelData.conciergeName && (
            <div className="flex items-center gap-3 mb-6 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-amber-500/30 flex-shrink-0">
                {hotelData.conciergePhoto ? (
                  <img 
                    src={hotelData.conciergePhoto} 
                    alt={hotelData.conciergeName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-amber-500/20 flex items-center justify-center">
                    <User size={20} className="text-amber-400" />
                  </div>
                )}
              </div>
              <div>
                <p className="text-white font-medium">{hotelData.conciergeName}</p>
                <p className="text-amber-100/50 text-sm">{hotelData.conciergeRole}</p>
              </div>
            </div>
          )}

          {/* ACTIONS LIST */}
          <div className="space-y-2 mb-6">
            {/* Call Reception */}
            {hotelData.receptionPhone && (
              <button
                onClick={handleCall}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-amber-500/10 backdrop-blur-sm border border-amber-500/20 hover:bg-amber-500/20 transition-all active:scale-[0.98]"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <Phone size={18} className="text-amber-400" />
                </div>
                <div className="flex-1 text-left">
                  <span className="text-white font-medium block">{t.callReception}</span>
                  <span className="text-amber-100/50 text-sm">{hotelData.receptionPhone}</span>
                </div>
                <ChevronRight size={16} className="text-amber-400/50" />
              </button>
            )}

            {/* WiFi */}
            {hotelData.wifiSsid && (
              <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <Wifi size={18} className="text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <span className="text-white font-medium block">{t.wifiAccess}</span>
                    <span className="text-white/50 text-sm font-mono">{hotelData.wifiSsid}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10">
                  <span className="flex-1 text-white/70 text-sm font-mono">{hotelData.wifiPassword}</span>
                  <button
                    onClick={handleCopyWifi}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white text-xs transition-colors"
                  >
                    {wifiCopied ? <Check size={12} /> : <Copy size={12} />}
                    {wifiCopied ? t.copied : t.copyPassword}
                  </button>
                </div>
              </div>
            )}

            {/* Daily Offer */}
            {hotelData.dailyOffer && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-rose-500/10 to-orange-500/10 backdrop-blur-sm border border-rose-500/20">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center flex-shrink-0">
                    <Gift size={18} className="text-rose-400" />
                  </div>
                  <div className="flex-1">
                    <span className="text-white font-medium block">{hotelData.dailyOffer.title}</span>
                    <span className="text-white/50 text-sm">{hotelData.dailyOffer.description}</span>
                    {hotelData.dailyOffer.validUntil && (
                      <span className="text-rose-400/60 text-xs block mt-1">
                        {t.validUntil} {hotelData.dailyOffer.validUntil}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Maps / Navigation */}
            {hotelData.address && (
              <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                    <MapPin size={18} className="text-green-400" />
                  </div>
                  <div className="flex-1">
                    <span className="text-white font-medium block">{t.getDirections}</span>
                    <span className="text-white/50 text-sm line-clamp-1">{hotelData.address}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleMaps("google")}
                    className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm transition-colors"
                  >
                    <Navigation size={14} />
                    {t.googleMaps}
                  </button>
                  <button
                    onClick={() => handleMaps("waze")}
                    className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm transition-colors"
                  >
                    <Globe size={14} />
                    {t.waze}
                  </button>
                </div>
              </div>
            )}

            {/* Places to Visit */}
            {hotelData.placesToVisit && hotelData.placesToVisit.length > 0 && (
              <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <MapPin size={18} className="text-purple-400" />
                  </div>
                  <span className="text-white font-medium">{t.placesToVisit}</span>
                </div>
                <div className="space-y-2">
                  {(showPlaces ? hotelData.placesToVisit : hotelData.placesToVisit.slice(0, 3)).map((place, i) => (
                    <div 
                      key={i}
                      className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                      onClick={() => place.url && window.open(place.url, "_blank")}
                    >
                      <span className="text-white/70 text-sm">{place.name}</span>
                      {place.distance && (
                        <Badge variant="outline" className="text-purple-400/60 border-purple-400/20 text-xs">
                          {place.distance}
                        </Badge>
                      )}
                    </div>
                  ))}
                  {hotelData.placesToVisit.length > 3 && !showPlaces && (
                    <button
                      onClick={() => setShowPlaces(true)}
                      className="w-full text-center text-purple-400/60 text-sm py-2 hover:text-purple-400 transition-colors"
                    >
                      {t.seeMore} ({hotelData.placesToVisit.length - 3})
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Reviews */}
            {(hotelData.googleReviewsUrl || hotelData.tripAdvisorUrl) && (
              <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                    <Star size={18} className="text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <span className="text-white font-medium">{t.reviews}</span>
                    {hotelData.googleRating && (
                      <div className="flex items-center gap-1 mt-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={12} 
                            className={i < Math.floor(hotelData.googleRating!) ? "text-yellow-400 fill-yellow-400" : "text-white/20"} 
                          />
                        ))}
                        <span className="text-white/50 text-xs ml-1">{hotelData.googleRating}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {hotelData.googleReviewsUrl && (
                    <button
                      onClick={() => window.open(hotelData.googleReviewsUrl, "_blank")}
                      className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm transition-colors"
                    >
                      {t.googleReviews}
                    </button>
                  )}
                  {hotelData.tripAdvisorUrl && (
                    <button
                      onClick={() => window.open(hotelData.tripAdvisorUrl, "_blank")}
                      className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm transition-colors"
                    >
                      {t.tripAdvisor}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* CTA Buttons - Wallet */}
          {showWalletButtons && (
            <CardActionButtons 
              data={{
                firstName: hotelData.hotelName,
                lastName: "",
                company: hotelData.hotelCategory,
                phone: hotelData.receptionPhone,
                email: hotelData.email,
                location: hotelData.address,
              }} 
              showWalletButtons={true}
              onShareInfo={onShareInfo}
              variant="dark"
              cardId={cardId}
              enableLeadCapture={enableLeadCapture}
            />
          )}
        </div>

        {/* Global IWASP Branding Footer */}
        <div className="border-t border-white/5 py-4">
          <IWASPBrandingInline variant="dark" />
        </div>
      </div>
    </div>
  );
}

/**
 * Light variant - For hotels with white/bright branding
 */
export function HotelGuideLightTemplate(props: HotelTemplateProps) {
  // Use only user-provided data
  const hotelData = props.data;
  const t = translations[hotelData.language || "fr"];
  const [wifiCopied, setWifiCopied] = useState(false);

  // Don't render if no hotel name
  if (!hotelData.hotelName) {
    return (
      <div className="w-full max-w-sm mx-auto p-8 text-center">
        <p className="text-muted-foreground">Configurez votre carte hôtel dans l'éditeur</p>
      </div>
    );
  }

  const handleCopyWifi = async () => {
    if (hotelData.wifiPassword) {
      await navigator.clipboard.writeText(hotelData.wifiPassword);
      setWifiCopied(true);
      toast.success(t.copied);
      setTimeout(() => setWifiCopied(false), 2000);
    }
  };

  const handleCall = () => {
    if (hotelData.receptionPhone) {
      window.location.href = `tel:${hotelData.receptionPhone}`;
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto animate-card-enter">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-stone-50 to-white border border-stone-200">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            {hotelData.hotelLogo ? (
              <img src={hotelData.hotelLogo} alt={hotelData.hotelName} className="h-12 w-auto object-contain" />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-amber-100 flex items-center justify-center">
                <Building2 size={24} className="text-amber-600" />
              </div>
            )}
            <div className="flex items-center gap-1.5 text-stone-400 opacity-60">
              <span className="text-[8px] font-semibold tracking-[0.15em] uppercase">IWasp</span>
            </div>
          </div>

          {/* Hotel Identity */}
          <div className="mb-6">
            {hotelData.hotelCategory && (
              <Badge className="mb-2 bg-amber-100 text-amber-700 border-amber-200">
                {hotelData.hotelCategory}
              </Badge>
            )}
            <h1 className="font-display text-2xl font-semibold text-stone-900 tracking-tight">
              {hotelData.hotelName}
            </h1>
            {hotelData.hotelTagline && (
              <p className="text-stone-500 text-sm mt-1 italic">{hotelData.hotelTagline}</p>
            )}
          </div>

          {/* Quick Actions - Only show if data exists */}
          <div className="space-y-3">
            {/* Call */}
            {hotelData.receptionPhone && (
              <button
                onClick={handleCall}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-200 flex items-center justify-center">
                  <Phone size={18} className="text-amber-700" />
                </div>
                <div className="flex-1 text-left">
                  <span className="text-stone-900 font-medium">{t.callReception}</span>
                </div>
              </button>
            )}

            {/* WiFi - Only show if both SSID and password exist */}
            {hotelData.wifiSsid && hotelData.wifiPassword && (
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                <div className="flex items-center gap-4 mb-2">
                  <Wifi size={18} className="text-blue-600" />
                  <span className="text-stone-700 font-medium">{t.wifiAccess}</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white border border-stone-200">
                  <span className="flex-1 text-stone-600 text-sm font-mono">{hotelData.wifiPassword}</span>
                  <button
                    onClick={handleCopyWifi}
                    className="flex items-center gap-1 px-3 py-1 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs"
                  >
                    {wifiCopied ? <Check size={12} /> : <Copy size={12} />}
                    {t.copyPassword}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Wallet Buttons */}
          {props.showWalletButtons && (
            <div className="mt-6">
              <CardActionButtons 
                data={{
                  firstName: hotelData.hotelName,
                  lastName: "",
                  phone: hotelData.receptionPhone,
                }} 
                showWalletButtons={true}
                variant="light"
                cardId={props.cardId}
                enableLeadCapture={props.enableLeadCapture}
              />
            </div>
          )}
        </div>

        {/* Global IWASP Branding Footer */}
        <div className="border-t border-stone-100 py-4">
          <IWASPBrandingInline variant="light" />
        </div>
      </div>
    </div>
  );
}
