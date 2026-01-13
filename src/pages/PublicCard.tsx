/**
 * IWASP Public NFC Card Page
 * Ultra-minimal Apple Cupertino style
 * Mobile-first, single screen, no scroll
 * 
 * SECURITY: Uses secure RPC functions - never exposes raw contact data
 * Supports custom templates for private/white-label cards
 */

import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { usePublicCard, useCardActionUrl, useIncrementCardView } from "@/hooks/usePublicCard";
import { useRecordScan } from "@/hooks/useScans";
import { usePublicStory } from "@/hooks/useStories";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Phone, Mail, Linkedin, MessageCircle, UserPlus } from "lucide-react";
import { StoryRing } from "@/components/StoryRing";
import { AutoschluesselTemplate } from "@/components/templates/AutoschluesselTemplate";
import HerbalismEliteTemplate from "@/components/templates/HerbalismEliteTemplate";
import VCardAirbnbBookingTemplate from "@/components/templates/VCardAirbnbBookingTemplate";
import { DarkLuxuryBusinessTemplate } from "@/components/templates/DarkLuxuryBusinessTemplate";
import { IWASPBrandBadgeMinimal } from "@/components/templates/IWASPBrandBadge";
import { IWASPBrandingFooter } from "@/components/IWASPBrandingFooter";
import { PushNotificationOptIn } from "@/components/PushNotificationOptIn";
import DualBrandShowcase from "./DualBrandShowcase";
import MaisonBOpticCard from "./MaisonBOpticCard";
import KechExcluCard from "./KechExcluCard";
import LuxePrestigeCard from "./LuxePrestigeCard";

// Import local profile photo for Herbalism Marrakech
import ibrahimPhoto from "@/assets/clients/ibrahim-herbalism.jpeg";

const PublicCard = () => {
  const { slug } = useParams<{ slug: string }>();

  // Normalize slug from URL/NFC tags (handles trailing spaces/newlines/control chars/unicode issues)
  const cleanedSlug = (slug ?? "")
    .normalize("NFKC")
    .trim()
    .replace(/[\u0000-\u001F\u007F\u00A0\u200B-\u200D\uFEFF]/g, "") // Control chars, NBSP, zero-width chars
    .replace(/\s+/g, "") // Remove all whitespace
    .replace(/[–—]/g, "-") // Normalize dashes (en-dash, em-dash to hyphen)
    .replace(/-+/g, "-") // Collapse multiple hyphens
    .replace(/^-|-$/g, "") // Remove leading/trailing hyphens
    .toLowerCase();

  // Debug logging for NFC troubleshooting
  console.log("[PublicCard] Raw slug:", JSON.stringify(slug));
  console.log("[PublicCard] Cleaned slug:", JSON.stringify(cleanedSlug));
  console.log("[PublicCard] Raw char codes:", slug?.split("").map(c => c.charCodeAt(0)));

  const { data: card, isLoading, error } = usePublicCard(cleanedSlug);
  const { story } = usePublicStory(card?.id || undefined);
  const recordScan = useRecordScan();
  const getActionUrl = useCardActionUrl();
  const incrementView = useIncrementCardView();
  const [scanRecorded, setScanRecorded] = useState(false);

  // Special-case showcase cards that are not stored in the database
  // Use includes/startsWith for more robust matching with potential NFC artifacts
  if (cleanedSlug === "medina-travertin" || cleanedSlug.startsWith("medina-travertin")) {
    return <DualBrandShowcase />;
  }

  // Special-case static client card (no DB dependency)
  if (cleanedSlug === "maison-b-optic" || cleanedSlug.startsWith("maison-b-optic")) {
    return <MaisonBOpticCard />;
  }

  // Special-case static showcase card (no DB dependency)
  // Match various potential NFC artifacts - robust matching
  const isKechExclu = cleanedSlug === "kech-exclu" || 
    cleanedSlug === "kechexclu" ||
    cleanedSlug.startsWith("kech-exclu") || 
    cleanedSlug.startsWith("kechexclu") ||
    cleanedSlug.includes("kech") && cleanedSlug.includes("exclu");
    
  if (isKechExclu) {
    console.log("[PublicCard] Matched kech-exclu, rendering KechExcluCard");
    return <KechExcluCard />;
  }

  // Special-case Luxe Prestige concierge card
  if (cleanedSlug === "luxe-prestige" || cleanedSlug.startsWith("luxe-prestige") || cleanedSlug.includes("luxeprestige")) {
    return <LuxePrestigeCard />;
  }

  // Record scan on first load
  useEffect(() => {
    if (card?.id && !scanRecorded) {
      recordScan.mutate(card.id);
      incrementView(cleanedSlug);
      setScanRecorded(true);
    }
  }, [card?.id, scanRecorded, cleanedSlug, recordScan, incrementView]);

  // Secure action handlers - get URLs from server, never expose raw data
  const handleAction = useCallback(
    async (action: "email" | "phone" | "whatsapp" | "linkedin") => {
      if (!cleanedSlug) return;

      const url = await getActionUrl(cleanedSlug, action);
      if (url) {
        if (action === "linkedin" || action === "whatsapp") {
          window.open(url, "_blank", "noopener,noreferrer");
        } else {
          window.location.href = url;
        }
      }
    },
    [cleanedSlug, getActionUrl]
  );

  const handleCall = () => handleAction("phone");
  const handleEmail = () => handleAction("email");
  const handleLinkedIn = () => handleAction("linkedin");
  const handleWhatsApp = () => handleAction("whatsapp");

  // Secure vCard download - get data from server function
  const handleAddContact = async () => {
    if (!card || !cleanedSlug) return;

    try {
      // Get vCard data securely from server using raw RPC call
      const { data, error } = await supabase.rpc("get_vcard_data" as any, {
        p_slug: cleanedSlug,
      });

      if (error || !data) {
        console.error("Error getting vCard data:", error);
        return;
      }

      const vcardData = data as {
        first_name?: string;
        last_name?: string;
        title?: string;
        company?: string;
        email?: string;
        phone?: string;
        slug?: string;
      };

      // Generate vCard content
      const vCardContent = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `N:${vcardData.last_name || ""};${vcardData.first_name || ""};;;`,
        `FN:${vcardData.first_name || ""} ${vcardData.last_name || ""}`,
        vcardData.title ? `TITLE:${vcardData.title}` : null,
        vcardData.company ? `ORG:${vcardData.company}` : null,
        vcardData.email ? `EMAIL:${vcardData.email}` : null,
        vcardData.phone ? `TEL:${vcardData.phone}` : null,
        `URL:${window.location.origin}/card/${vcardData.slug}`,
        "END:VCARD",
      ]
        .filter(Boolean)
        .join("\r\n");

      const blob = new Blob([vCardContent], { type: "text/vcard" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${vcardData.first_name || "contact"}_${vcardData.last_name || ""}.vcf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading vCard:", err);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div 
        className="min-h-dvh flex items-center justify-center"
        style={{ backgroundColor: "#F5F5F7" }}
      >
        <Loader2 className="h-6 w-6 animate-spin" style={{ color: "#007AFF" }} />
      </div>
    );
  }

  // Error state
  if (error || !card) {
    return (
      <div 
        className="min-h-dvh flex items-center justify-center p-6"
        style={{ backgroundColor: "#F5F5F7" }}
      >
        <div className="text-center">
          <h1 className="text-xl font-semibold mb-2" style={{ color: "#1D1D1F" }}>
            Carte introuvable
          </h1>
          <p className="text-sm" style={{ color: "#8E8E93" }}>
            Cette carte n'existe pas ou a été désactivée.
          </p>
        </div>
      </div>
    );
  }

  // Check for custom template
  const template = (card as any)?.template;
  
  // Use AutoschluesselTemplate for autoschluessel template
  if (template === 'autoschluessel') {
    return (
      <AutoschluesselTemplate 
        cardId={card.id}
        data={{
          phone: card.has_phone ? undefined : undefined, // Data comes from template
          whatsapp: card.has_whatsapp ? undefined : undefined,
          firstName: card.first_name,
          lastName: card.last_name,
        }}
        hideBranding={true}
      />
    );
  }

  // Use HerbalismEliteTemplate for herbalism-elite template
  if (template === 'herbalism-elite') {
    // Determine if this is the personal Ibrahim card or the business card
    const isIbrahimPersonalCard = slug === 'ibrahim-benelfares';
    const isHerbalismBusinessCard = slug === 'herbalism-marrakech';
    
    // Use imported photo for both cards (same person)
    const profilePhotoUrl = ibrahimPhoto;
    
    // Phone numbers: Ibrahim personal vs Herbalism business
    const phoneNumber = isIbrahimPersonalCard ? "+212 675 571257" : "+212 666 540 329";
    const whatsappNumber = isIbrahimPersonalCard ? "212675571257" : "212666540329";
    
    return (
      <HerbalismEliteTemplate 
        cardId={card.id}
        data={{
          brandName: card.company || "Herbalism Marrakech",
          tagline: card.tagline || "An Herbal Experience",
          logo: card.logo_url || undefined,
          profilePhoto: profilePhotoUrl,
          phone: card.has_phone ? phoneNumber : undefined,
          whatsapp: card.has_whatsapp ? whatsappNumber : undefined,
          website: card.website || undefined,
          instagram: card.has_instagram ? "herbalism.marrakech" : undefined,
          googleReviewsUrl: "https://maps.app.goo.gl/ecBsV54n8TZnfN3NA?g_st=iwb",
          tripAdvisorUrl: "https://www.tripadvisor.fr/Attraction_Review-g293734-d25386907-Reviews-Herbalism_Marrakech-Marrakech_Marrakech_Safi.html",
          directionsUrl: "https://maps.app.goo.gl/ecBsV54n8TZnfN3NA?g_st=iwb",
          vcardData: {
            firstName: card.first_name,
            lastName: card.last_name,
            company: card.company || undefined,
            title: card.title || undefined,
            phone: phoneNumber,
          }
        }}
      />
    );
  }

  // Use VCardAirbnbBookingTemplate for vcard-airbnb-booking template
  if (template === 'vcard-airbnb-booking') {
    return (
      <VCardAirbnbBookingTemplate
        cardId={card.id}
        data={{
          propertyName: card.company || `${card.first_name} ${card.last_name}`,
          propertyType: card.title || undefined,
          tagline: card.tagline || undefined,
          coverPhoto: card.photo_url || undefined,
          logoUrl: card.logo_url || undefined,
          address: (card as any).location || undefined,
          phone: card.has_phone ? undefined : undefined,
          whatsapp: card.has_whatsapp ? undefined : undefined,
          email: card.has_email ? undefined : undefined,
          website: card.website || undefined,
        }}
      />
    );
  }

  // Use DarkLuxuryBusinessTemplate for dark-luxury-business template
  if (template === 'dark-luxury-business') {
    return (
      <DarkLuxuryBusinessTemplate
        card={{
          id: card.id,
          slug: card.slug,
          first_name: card.first_name,
          last_name: card.last_name,
          title: card.title,
          company: card.company,
          location: (card as any).location,
          website: card.website,
          tagline: card.tagline,
          photo_url: card.photo_url,
          logo_url: card.logo_url,
          has_phone: card.has_phone,
          has_whatsapp: card.has_whatsapp,
          has_email: card.has_email,
          has_instagram: card.has_instagram,
          social_links: card.social_links,
          blocks: card.blocks,
          custom_styles: card.custom_styles,
        }}
      />
    );
  }

  const fullName = `${card.first_name} ${card.last_name}`;
  const subtitle = [card.title, card.company].filter(Boolean).join(" · ");
  
  // Get custom styles or use defaults
  const customStyles = (card as any).custom_styles;
  const bgColor = customStyles?.backgroundColor || "#F5F5F7";
  const cardBgColor = customStyles?.theme === "dark" ? "#1D1D1F" : "#FFFFFF";
  const textColor = customStyles?.textColor || (customStyles?.theme === "dark" ? "#FFFFFF" : "#1D1D1F");
  const secondaryTextColor = customStyles?.secondaryTextColor || "#8E8E93";
  const accentColor = customStyles?.accentColor || "#007AFF";
  const borderRadius = customStyles?.borderRadius ?? 24;
  
  // Shadow mapping
  const shadowMap: Record<string, string> = {
    none: "none",
    subtle: "0 2px 8px rgba(0, 0, 0, 0.04)",
    medium: "0 4px 16px rgba(0, 0, 0, 0.08)",
    strong: "0 8px 32px rgba(0, 0, 0, 0.12)",
    glow: `0 0 30px ${accentColor}20`,
  };
  const boxShadow = shadowMap[customStyles?.shadowPreset || "subtle"] || shadowMap.subtle;

  return (
    <div 
      className="min-h-dvh flex flex-col items-center justify-center p-4"
      style={{ backgroundColor: bgColor }}
    >
      {/* Card */}
      <div 
        className="w-full max-w-sm p-6"
        style={{ 
          backgroundColor: cardBgColor,
          borderRadius: `${borderRadius}px`,
          boxShadow: boxShadow,
          border: customStyles?.borderWidth > 0 
            ? `${customStyles.borderWidth}px solid ${customStyles.borderColor || "#374151"}` 
            : undefined,
        }}
      >
        {/* Profile Section */}
        <div className="text-center mb-6">
          {/* Photo with Story Ring */}
          <div className="flex justify-center mb-4">
            <StoryRing
              photoUrl={card.photo_url || undefined}
              firstName={card.first_name}
              lastName={card.last_name}
              story={story}
              email={card.has_email ? undefined : undefined}
              size="lg"
            />
          </div>

          {/* Name */}
          <h1 
            className="text-xl font-semibold tracking-tight"
            style={{ color: textColor }}
          >
            {fullName}
          </h1>

          {/* Role / Company */}
          {subtitle && (
            <p className="text-sm mt-1" style={{ color: secondaryTextColor }}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Action Buttons - Only show if contact method exists */}
        <div className="space-y-3">
          {/* Primary Actions Row */}
          <div className="grid grid-cols-2 gap-3">
            {/* Call */}
            {card.has_phone && (
              <button
                onClick={handleCall}
                className="flex items-center justify-center gap-2 py-3.5 rounded-xl transition-all active:scale-[0.98]"
                style={{ backgroundColor: customStyles?.theme === "dark" ? "#2D2D2D" : "#F5F5F7" }}
              >
                <Phone size={18} style={{ color: accentColor }} />
                <span className="text-sm font-medium" style={{ color: textColor }}>
                  Appeler
                </span>
              </button>
            )}

            {/* Email */}
            {card.has_email && (
              <button
                onClick={handleEmail}
                className="flex items-center justify-center gap-2 py-3.5 rounded-xl transition-all active:scale-[0.98]"
                style={{ backgroundColor: customStyles?.theme === "dark" ? "#2D2D2D" : "#F5F5F7" }}
              >
                <Mail size={18} style={{ color: accentColor }} />
                <span className="text-sm font-medium" style={{ color: textColor }}>
                  Email
                </span>
              </button>
            )}
          </div>

          {/* Secondary Actions Row */}
          <div className="grid grid-cols-2 gap-3">
            {/* LinkedIn */}
            {card.has_linkedin && (
              <button
                onClick={handleLinkedIn}
                className="flex items-center justify-center gap-2 py-3.5 rounded-xl transition-all active:scale-[0.98]"
                style={{ backgroundColor: customStyles?.theme === "dark" ? "#2D2D2D" : "#F5F5F7" }}
              >
                <Linkedin size={18} style={{ color: "#0A66C2" }} />
                <span className="text-sm font-medium" style={{ color: textColor }}>
                  LinkedIn
                </span>
              </button>
            )}

            {/* WhatsApp */}
            {card.has_whatsapp && (
              <button
                onClick={handleWhatsApp}
                className="flex items-center justify-center gap-2 py-3.5 rounded-xl transition-all active:scale-[0.98]"
                style={{ backgroundColor: customStyles?.theme === "dark" ? "#2D2D2D" : "#F5F5F7" }}
              >
                <MessageCircle size={18} style={{ color: "#25D366" }} />
                <span className="text-sm font-medium" style={{ color: textColor }}>
                  WhatsApp
                </span>
              </button>
            )}
          </div>

          {/* Add to Contacts - Primary CTA */}
          <button
            onClick={handleAddContact}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-medium transition-all active:scale-[0.98]"
            style={{ backgroundColor: accentColor, color: "#FFFFFF" }}
          >
            <UserPlus size={18} />
            Ajouter au contact
          </button>
        </div>
      </div>
      
      {/* Global IWASP Branding Footer */}
      <IWASPBrandingFooter variant={customStyles?.theme === "dark" ? "dark" : "light"} />
      
      {/* Push Notification Opt-In */}
      <PushNotificationOptIn 
        cardId={card.id}
        ownerName={fullName}
        variant="floating"
      />
    </div>
  );
};

export default PublicCard;
