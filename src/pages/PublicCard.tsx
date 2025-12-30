/**
 * IWASP Public Card Page
 * Isolated NFC card view - NO header, footer, menu, or external branding
 * 
 * RULES:
 * - Full height, card centered
 * - Mobile-first
 * - No navigation elements
 * - i-wasp badge top-right only
 */

import { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useCard } from "@/hooks/useCards";
import { useRecordScan } from "@/hooks/useScans";
import { useVisitorTracking } from "@/hooks/useVisitorTracking";
import { useSmartContext } from "@/hooks/useSmartContext";
import { DigitalCard } from "@/components/DigitalCard";
import { TemplateType, CardData } from "@/components/templates/CardTemplates";
import { LeadConsentModal } from "@/components/LeadConsentModal";
import { LeadCaptureSheet } from "@/components/LeadCaptureSheet";
import { ConsentBanner } from "@/components/ConsentBanner";
import { IWASPBrandBadge } from "@/components/templates/IWASPBrandBadge";

// Detect source from URL or referrer
function detectSource(): "nfc" | "qr" | "link" {
  const url = new URL(window.location.href);
  const sourceParam = url.searchParams.get("source");
  
  if (sourceParam === "nfc") return "nfc";
  if (sourceParam === "qr") return "qr";
  
  const referrer = document.referrer.toLowerCase();
  if (referrer.includes("qr") || referrer.includes("scan")) return "qr";
  
  return "link";
}

const PublicCard = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const { data: card, isLoading, error } = useCard(slug || "");
  const recordScan = useRecordScan();
  
  const smartContext = useSmartContext(
    slug || "",
    searchParams,
    card?.company || undefined,
    undefined
  );
  
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [source] = useState<"nfc" | "qr" | "link">(detectSource);
  const [scanRecorded, setScanRecorded] = useState(false);

  const {
    hasConsent,
    trackAction,
    giveConsent,
    declineConsent,
    saveVisitorLead,
  } = useVisitorTracking(card?.id || "");

  // Record scan on first load
  useEffect(() => {
    if (card?.id && !scanRecorded) {
      recordScan.mutate(card.id);
      setScanRecorded(true);
    }
  }, [card?.id, scanRecorded]);

  const handleBannerAccept = useCallback(() => {
    giveConsent();
    saveVisitorLead();
  }, [giveConsent, saveVisitorLead]);

  const handleBannerDecline = useCallback(() => {
    declineConsent();
  }, [declineConsent]);

  const handleConsent = () => {
    setShowConsentModal(false);
    setShowLeadForm(true);
    
    if (card?.id) {
      sessionStorage.setItem(`iwasp_consent_${card.id}`, "seen");
    }
  };

  const handleDecline = () => {
    setShowConsentModal(false);
    
    if (card?.id) {
      sessionStorage.setItem(`iwasp_consent_${card.id}`, "seen");
    }
  };

  const handleLeadComplete = (shared: boolean) => {
    setShowLeadForm(false);
    if (shared) {
      trackAction("shared_contact");
    }
  };

  // Transform card data to template format
  const cardData: CardData | undefined = card ? {
    id: card.id,
    slug: card.slug,
    firstName: card.first_name,
    lastName: card.last_name,
    title: card.title || undefined,
    company: card.company || undefined,
    email: card.email || undefined,
    phone: card.phone || undefined,
    location: card.location || undefined,
    website: card.website || undefined,
    linkedin: card.linkedin || undefined,
    instagram: card.instagram || undefined,
    twitter: card.twitter || undefined,
    tagline: card.tagline || undefined,
    photoUrl: card.photo_url || undefined,
    logoUrl: card.logo_url || undefined,
    socialLinks: card.social_links || undefined,
  } : undefined;

  const cardOwnerName = card ? `${card.first_name} ${card.last_name}` : "";

  return (
    <div className="min-h-dvh bg-background relative flex flex-col">
      {/* i-wasp Badge - Top Right, Fixed */}
      <div className="absolute top-4 right-4 z-50 safe-top safe-right">
        <IWASPBrandBadge variant="dark" />
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full border-2 border-foreground/20 border-t-foreground animate-spin" />
        </div>
      )}

      {/* Error state */}
      {!isLoading && (error || !card) && (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <h1 className="font-display text-xl font-semibold text-foreground mb-2">
              Carte introuvable
            </h1>
            <p className="text-sm text-muted-foreground">
              Cette carte n'existe pas ou a été désactivée.
            </p>
          </div>
        </div>
      )}

      {/* Main content */}
      {!isLoading && card && !error && (
        <div className="flex-1 flex items-center justify-center p-4 py-16 safe-y">
          <div className="w-full max-w-md">
            {cardData && (
              <DigitalCard
                data={cardData}
                template={(card?.template as TemplateType) || "signature"}
                showWalletButtons={true}
                onShareInfo={() => setShowLeadForm(true)}
                cardId={card?.id}
                enableLeadCapture={true}
                smartContext={smartContext}
              />
            )}
          </div>
        </div>
      )}

      {/* Consent Banner - Non-blocking */}
      {card && (
        <ConsentBanner
          cardId={card.id}
          onAccept={handleBannerAccept}
          onDecline={handleBannerDecline}
        />
      )}

      {/* Lead Consent Modal */}
      <LeadConsentModal
        open={showConsentModal}
        onConsent={handleConsent}
        onDecline={handleDecline}
        cardOwnerName={cardOwnerName}
        cardOwnerPhoto={card?.photo_url}
      />

      {/* Lead Capture Form */}
      {card && (
        <LeadCaptureSheet
          open={showLeadForm}
          onClose={() => setShowLeadForm(false)}
          onComplete={handleLeadComplete}
          cardOwnerName={cardOwnerName}
          cardOwnerPhoto={card.photo_url}
          cardOwnerCompany={card.company || undefined}
          cardId={card.id}
        />
      )}
    </div>
  );
};

export default PublicCard;
