/**
 * IWASP Hotel Concierge Template
 * Premium NFC card for luxury hotel services
 * 
 * Features:
 * - Restaurant reservations
 * - Spa booking
 * - Room service ordering
 * - Premium glassmorphism design
 * - Multilingual support
 */

import { useState } from "react";
import { IWASPBrandBadge } from "./IWASPBrandBadge";
import { IWASPBrandingInline } from "@/components/IWASPBrandingFooter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Phone, Utensils, Sparkles, ConciergeBell, Clock, 
  ChevronRight, Star, Wine, Leaf, Calendar, MessageSquare,
  Building2, User, MapPin, X
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Concierge-specific data interface
export interface ConciergeCardData {
  // Hotel identity
  hotelName: string;
  hotelCategory?: string;
  hotelLogo?: string;
  hotelTagline?: string;
  
  // Concierge info
  conciergePhoto?: string;
  conciergeName?: string;
  conciergeRole?: string;
  conciergePhone?: string;
  
  // Restaurant
  restaurant?: {
    name: string;
    cuisine?: string;
    hours?: string;
    phone?: string;
    reservationUrl?: string;
  };
  
  // Spa
  spa?: {
    name: string;
    description?: string;
    hours?: string;
    phone?: string;
    bookingUrl?: string;
    treatments?: Array<{
      name: string;
      duration: string;
      price?: string;
    }>;
  };
  
  // Room Service
  roomService?: {
    phone?: string;
    hours?: string;
    menuUrl?: string;
    whatsappNumber?: string;
  };
  
  // Additional services
  additionalServices?: Array<{
    name: string;
    icon?: string;
    phone?: string;
    url?: string;
  }>;
  
  // Multilingual
  language?: "fr" | "en" | "ar" | "es";
}

export interface ConciergeTemplateProps {
  data: ConciergeCardData;
  showWalletButtons?: boolean;
  cardId?: string;
  enableLeadCapture?: boolean;
  onShareInfo?: () => void;
}

// Translations
const translations = {
  fr: {
    concierge: "Votre Concierge",
    restaurant: "Réserver une table",
    restaurantDesc: "Cuisine raffinée, service impeccable",
    spa: "Réserver un soin",
    spaDesc: "Détente et bien-être",
    roomService: "Room Service",
    roomServiceDesc: "Service en chambre 24h/24",
    viewMenu: "Voir le menu",
    book: "Réserver",
    call: "Appeler",
    hours: "Horaires",
    treatments: "Nos soins",
    seeAll: "Voir tout",
    whatsapp: "WhatsApp",
    poweredBy: "Powered by I-WASP.com",
    available: "Disponible",
    callConcierge: "Appeler le concierge",
    close: "Fermer",
  },
  en: {
    concierge: "Your Concierge",
    restaurant: "Book a Table",
    restaurantDesc: "Fine dining, impeccable service",
    spa: "Book a Treatment",
    spaDesc: "Relaxation and wellness",
    roomService: "Room Service",
    roomServiceDesc: "24/7 in-room dining",
    viewMenu: "View Menu",
    book: "Book",
    call: "Call",
    hours: "Hours",
    treatments: "Our Treatments",
    seeAll: "See all",
    whatsapp: "WhatsApp",
    poweredBy: "Powered by I-WASP.com",
    available: "Available",
    callConcierge: "Call Concierge",
    close: "Close",
  },
  ar: {
    concierge: "خدمة الكونسيرج",
    restaurant: "حجز طاولة",
    restaurantDesc: "مأكولات راقية، خدمة لا تشوبها شائبة",
    spa: "حجز علاج",
    spaDesc: "الاسترخاء والعافية",
    roomService: "خدمة الغرف",
    roomServiceDesc: "خدمة على مدار الساعة",
    viewMenu: "عرض القائمة",
    book: "حجز",
    call: "اتصال",
    hours: "الأوقات",
    treatments: "علاجاتنا",
    seeAll: "عرض الكل",
    whatsapp: "واتساب",
    poweredBy: "مدعوم من I-WASP.com",
    available: "متاح",
    callConcierge: "اتصل بالكونسيرج",
    close: "إغلاق",
  },
  es: {
    concierge: "Su Conserje",
    restaurant: "Reservar Mesa",
    restaurantDesc: "Cocina refinada, servicio impecable",
    spa: "Reservar Tratamiento",
    spaDesc: "Relajación y bienestar",
    roomService: "Servicio de Habitación",
    roomServiceDesc: "Servicio 24/7",
    viewMenu: "Ver Menú",
    book: "Reservar",
    call: "Llamar",
    hours: "Horario",
    treatments: "Nuestros Tratamientos",
    seeAll: "Ver todo",
    whatsapp: "WhatsApp",
    poweredBy: "Powered by I-WASP.com",
    available: "Disponible",
    callConcierge: "Llamar al Conserje",
    close: "Cerrar",
  },
};

// No default data - all fields come from user input
export function HotelConciergeTemplate({ 
  data, 
  showWalletButtons = true, 
  cardId,
  enableLeadCapture,
  onShareInfo,
}: ConciergeTemplateProps) {
  // Use only user-provided data, no defaults
  const conciergeData = data;
  const t = translations[conciergeData.language || "fr"];
  const [spaModalOpen, setSpaModalOpen] = useState(false);

  // Don't render anything if no hotel name
  if (!conciergeData.hotelName) {
    return (
      <div className="w-full max-w-sm mx-auto p-8 text-center">
        <p className="text-muted-foreground">Configurez votre carte concierge dans l'éditeur</p>
      </div>
    );
  }

  const handleCall = (phone?: string) => {
    if (phone) {
      window.location.href = `tel:${phone}`;
    }
  };

  const handleWhatsApp = (number?: string) => {
    if (number) {
      const cleanNumber = number.replace(/\D/g, '');
      window.open(`https://wa.me/${cleanNumber}`, "_blank");
    }
  };

  const handleUrl = (url?: string) => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto animate-card-enter">
      {/* Card container - Premium dark luxury */}
      <div className="relative rounded-3xl overflow-hidden">
        {/* Background - Deep luxury gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(212,175,55,0.05),transparent_50%)]" />
        
        {/* Subtle luxury pattern */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjAgMjBtLTEwIDBhMTAgMTAgMCAxIDAgMjAgMCAxMCAxMCAwIDEgMCAtMjAgMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZDRhZjM3IiBzdHJva2Utd2lkdGg9IjAuNSIvPjwvc3ZnPg==')]" />
        
        <div className="relative p-6">
          {/* HEADER - Hotel + IWASP */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              {conciergeData.hotelLogo ? (
                <img 
                  src={conciergeData.hotelLogo} 
                  alt={conciergeData.hotelName} 
                  className="h-10 w-auto object-contain"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-[#d4af37]/20 backdrop-blur-sm flex items-center justify-center border border-[#d4af37]/30">
                  <Building2 size={20} className="text-[#d4af37]" />
                </div>
              )}
            </div>

            {/* IWASP "IWasp )))" Brand Badge - ALWAYS TOP RIGHT - FIXED */}
            <IWASPBrandBadge variant="dark" />
          </div>

          {/* HOTEL IDENTITY */}
          <div className="mb-5">
            {conciergeData.hotelCategory && (
              <Badge className="mb-2 bg-[#d4af37]/15 text-[#d4af37] border-[#d4af37]/30 text-xs">
                {conciergeData.hotelCategory}
              </Badge>
            )}
            <h1 className="font-display text-xl font-semibold text-white tracking-tight">
              {conciergeData.hotelName}
            </h1>
            {conciergeData.hotelTagline && (
              <p className="text-[#d4af37]/60 text-sm mt-1 italic">
                {conciergeData.hotelTagline}
              </p>
            )}
          </div>

          {/* CONCIERGE INFO */}
          {conciergeData.conciergeName && (
            <div className="flex items-center gap-3 mb-6 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-[#d4af37]/30 flex-shrink-0">
                {conciergeData.conciergePhoto ? (
                  <img 
                    src={conciergeData.conciergePhoto} 
                    alt={conciergeData.conciergeName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#d4af37]/20 flex items-center justify-center">
                    <User size={18} className="text-[#d4af37]" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm">{conciergeData.conciergeName}</p>
                <p className="text-[#d4af37]/60 text-xs">{conciergeData.conciergeRole}</p>
              </div>
              {conciergeData.conciergePhone && (
                <button
                  onClick={() => handleCall(conciergeData.conciergePhone)}
                  className="w-9 h-9 rounded-lg bg-[#d4af37]/15 flex items-center justify-center hover:bg-[#d4af37]/25 transition-colors"
                >
                  <Phone size={16} className="text-[#d4af37]" />
                </button>
              )}
            </div>
          )}

          {/* SERVICES */}
          <div className="space-y-3">
            {/* Restaurant Reservation */}
            {conciergeData.restaurant && (
              <div className="group">
                <button
                  onClick={() => conciergeData.restaurant?.phone && handleCall(conciergeData.restaurant.phone)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-rose-500/10 to-orange-500/10 backdrop-blur-sm border border-rose-500/20 hover:border-rose-500/40 transition-all active:scale-[0.98]"
                >
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-500/30 to-orange-500/30 flex items-center justify-center flex-shrink-0">
                    <Utensils size={18} className="text-rose-400" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <span className="text-white font-medium block text-sm">{t.restaurant}</span>
                    <span className="text-white/50 text-xs">{conciergeData.restaurant.name}</span>
                    {conciergeData.restaurant.cuisine && (
                      <span className="text-rose-400/60 text-xs block mt-0.5">{conciergeData.restaurant.cuisine}</span>
                    )}
                  </div>
                  <ChevronRight size={16} className="text-rose-400/50 group-hover:text-rose-400 transition-colors" />
                </button>
                {conciergeData.restaurant.hours && (
                  <div className="flex items-center gap-1.5 mt-1.5 px-4">
                    <Clock size={11} className="text-white/30" />
                    <span className="text-white/30 text-[10px]">{conciergeData.restaurant.hours}</span>
                  </div>
                )}
              </div>
            )}

            {/* Spa Booking */}
            {conciergeData.spa && (
              <div className="group">
                <button
                  onClick={() => setSpaModalOpen(true)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 backdrop-blur-sm border border-emerald-500/20 hover:border-emerald-500/40 transition-all active:scale-[0.98]"
                >
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500/30 to-teal-500/30 flex items-center justify-center flex-shrink-0">
                    <Sparkles size={18} className="text-emerald-400" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <span className="text-white font-medium block text-sm">{t.spa}</span>
                    <span className="text-white/50 text-xs">{conciergeData.spa.name}</span>
                    {conciergeData.spa.description && (
                      <span className="text-emerald-400/60 text-xs block mt-0.5 line-clamp-1">{conciergeData.spa.description}</span>
                    )}
                  </div>
                  <ChevronRight size={16} className="text-emerald-400/50 group-hover:text-emerald-400 transition-colors" />
                </button>
                {conciergeData.spa.hours && (
                  <div className="flex items-center gap-1.5 mt-1.5 px-4">
                    <Clock size={11} className="text-white/30" />
                    <span className="text-white/30 text-[10px]">{conciergeData.spa.hours}</span>
                  </div>
                )}
              </div>
            )}

            {/* Room Service */}
            {conciergeData.roomService && (
              <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-11 h-11 rounded-xl bg-[#d4af37]/20 flex items-center justify-center flex-shrink-0">
                    <ConciergeBell size={18} className="text-[#d4af37]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-white font-medium block text-sm">{t.roomService}</span>
                    <span className="text-white/50 text-xs">{t.roomServiceDesc}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {conciergeData.roomService.phone && (
                    <button
                      onClick={() => handleCall(conciergeData.roomService?.phone)}
                      className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-lg bg-[#d4af37]/10 hover:bg-[#d4af37]/20 border border-[#d4af37]/20 text-[#d4af37] text-xs font-medium transition-colors"
                    >
                      <Phone size={14} />
                      {t.call}
                    </button>
                  )}
                  {conciergeData.roomService.whatsappNumber && (
                    <button
                      onClick={() => handleWhatsApp(conciergeData.roomService?.whatsappNumber)}
                      className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-400 text-xs font-medium transition-colors"
                    >
                      <MessageSquare size={14} />
                      {t.whatsapp}
                    </button>
                  )}
                  {conciergeData.roomService.menuUrl && (
                    <button
                      onClick={() => handleUrl(conciergeData.roomService?.menuUrl)}
                      className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 text-xs font-medium transition-colors"
                    >
                      <Wine size={14} />
                      {t.viewMenu}
                    </button>
                  )}
                </div>
                {conciergeData.roomService.hours && (
                  <div className="flex items-center justify-center gap-1.5 mt-2">
                    <Clock size={11} className="text-[#d4af37]/50" />
                    <span className="text-[#d4af37]/50 text-[10px]">{conciergeData.roomService.hours}</span>
                  </div>
                )}
              </div>
            )}

            {/* Additional Services */}
            {conciergeData.additionalServices && conciergeData.additionalServices.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {conciergeData.additionalServices.map((service, i) => (
                  <button
                    key={i}
                    onClick={() => service.phone ? handleCall(service.phone) : handleUrl(service.url)}
                    className="flex items-center gap-2 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all active:scale-[0.98]"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                      <Star size={14} className="text-white/60" />
                    </div>
                    <span className="text-white/70 text-xs font-medium truncate">{service.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Global IWASP Branding Footer */}
          <div className="mt-6 pt-4 border-t border-white/5">
            <IWASPBrandingInline variant="dark" />
          </div>
        </div>
      </div>

      {/* Spa Treatments Modal */}
      <Dialog open={spaModalOpen} onOpenChange={setSpaModalOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Sparkles size={18} className="text-emerald-400" />
              </div>
              <div>
                <span className="block text-lg">{conciergeData.spa?.name}</span>
                <span className="block text-xs text-white/50 font-normal">{t.treatments}</span>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3 mt-4">
            {conciergeData.spa?.treatments?.map((treatment, i) => (
              <div 
                key={i}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10"
              >
                <div>
                  <p className="text-white text-sm font-medium">{treatment.name}</p>
                  <p className="text-emerald-400/60 text-xs">{treatment.duration}</p>
                </div>
                {treatment.price && (
                  <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30">
                    {treatment.price}
                  </Badge>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-4">
            {conciergeData.spa?.phone && (
              <Button
                onClick={() => {
                  handleCall(conciergeData.spa?.phone);
                  setSpaModalOpen(false);
                }}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                <Phone size={16} className="mr-2" />
                {t.book}
              </Button>
            )}
            {conciergeData.spa?.bookingUrl && (
              <Button
                onClick={() => {
                  handleUrl(conciergeData.spa?.bookingUrl);
                  setSpaModalOpen(false);
                }}
                variant="outline"
                className="flex-1 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
              >
                <Calendar size={16} className="mr-2" />
                {t.book}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default HotelConciergeTemplate;
