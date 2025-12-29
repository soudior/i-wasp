/**
 * IWASP Public Card Page
 * Premium NFC card viewing with lead capture flow
 * Apple-level UX - Non-blocking consent
 */

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useCard } from "@/hooks/useCards";
import { useRecordScan } from "@/hooks/useScans";
import { DigitalCard } from "@/components/DigitalCard";
import { TemplateType, CardData } from "@/components/templates/CardTemplates";
import { LeadConsentModal } from "@/components/LeadConsentModal";
import { LeadCaptureSheet } from "@/components/LeadCaptureSheet";
import { Sparkles } from "lucide-react";

// Detect source from URL or referrer
function detectSource(): "nfc" | "qr" | "link" {
  const url = new URL(window.location.href);
  const sourceParam = url.searchParams.get("source");
  
  if (sourceParam === "nfc") return "nfc";
  if (sourceParam === "qr") return "qr";
  
  // Check referrer for common QR code scanners
  const referrer = document.referrer.toLowerCase();
  if (referrer.includes("qr") || referrer.includes("scan")) return "qr";
  
  // Default to link if accessed directly
  return "link";
}

const PublicCard = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const { data: card, isLoading, error } = useCard(slug || "");
  const recordScan = useRecordScan();
  
  // Lead capture flow state
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [hasSeenConsent, setHasSeenConsent] = useState(false);
  const [source] = useState<"nfc" | "qr" | "link">(detectSource);

  // Record scan and show consent on first load
  useEffect(() => {
    if (card?.id && !hasSeenConsent) {
      // Record the scan
      recordScan.mutate(card.id);
      
      // Check if user has already seen consent for this card
      const consentKey = `iwasp_consent_${card.id}`;
      const hasConsented = sessionStorage.getItem(consentKey);
      
      if (!hasConsented) {
        // Show consent modal after a brief delay for premium feel
        const timer = setTimeout(() => {
          setShowConsentModal(true);
          setHasSeenConsent(true);
        }, 1500);
        
        return () => clearTimeout(timer);
      } else {
        setHasSeenConsent(true);
      }
    }
  }, [card?.id, hasSeenConsent]);

  const handleConsent = () => {
    setShowConsentModal(false);
    setShowLeadForm(true);
    
    // Mark as seen for this session
    if (card?.id) {
      sessionStorage.setItem(`iwasp_consent_${card.id}`, "seen");
    }
  };

  const handleDecline = () => {
    setShowConsentModal(false);
    
    // Mark as seen for this session
    if (card?.id) {
      sessionStorage.setItem(`iwasp_consent_${card.id}`, "seen");
    }
  };

  const handleLeadComplete = (shared: boolean) => {
    setShowLeadForm(false);
    // Could track analytics here
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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] orb opacity-30" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] orb opacity-20" />
      <div className="noise" />

      {/* Loading state */}
      <div 
        className={`absolute inset-0 z-20 flex items-center justify-center bg-background transition-opacity duration-200 ${
          isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-foreground/20 border-t-foreground animate-spin" />
        </div>
      </div>

      {/* Error state */}
      <div 
        className={`absolute inset-0 z-20 flex items-center justify-center p-6 bg-background transition-opacity duration-200 ${
          !isLoading && (error || !card) ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="text-center">
          <Sparkles size={48} className="mx-auto mb-4 text-muted-foreground" />
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">
            Carte introuvable
          </h1>
          <p className="text-muted-foreground">
            Cette carte n'existe pas ou a été désactivée.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div 
        className={`relative z-10 min-h-screen flex items-center justify-center p-6 py-12 transition-opacity duration-200 ${
          !isLoading && card && !error ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="w-full max-w-md">
          {/* Card using selected template */}
          <div className="perspective-2000">
            {cardData && (
              <DigitalCard
                data={cardData}
                template={(card?.template as TemplateType) || "signature"}
                showWalletButtons={true}
                onShareInfo={() => setShowLeadForm(true)}
                cardId={card?.id}
                enableLeadCapture={true}
              />
            )}
          </div>

          {/* IWASP branding with RGPD notice */}
          <div className="text-center mt-8 space-y-2">
            <p className="text-xs text-muted-foreground">
              Powered by <span className="font-semibold text-foreground">IWASP</span>
            </p>
            <p className="text-[10px] text-muted-foreground/60">
              Conforme au RGPD – consentement explicite requis
            </p>
          </div>
        </div>
      </div>

      {/* Lead Consent Modal - Apple-style */}
      <LeadConsentModal
        open={showConsentModal}
        onConsent={handleConsent}
        onDecline={handleDecline}
        cardOwnerName={cardOwnerName}
        cardOwnerPhoto={card?.photo_url}
      />

      {/* Lead Capture Form - Bottom Sheet */}
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
