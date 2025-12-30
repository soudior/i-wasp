/**
 * IWASP Public Card Page
 * Ultra-minimal Apple Cupertino style
 * 
 * RULES:
 * - Full height, card centered
 * - Mobile-first
 * - No navigation, no banners, no modals
 * - Clean and simple
 */

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCard } from "@/hooks/useCards";
import { useRecordScan } from "@/hooks/useScans";
import { DigitalCard } from "@/components/DigitalCard";
import { TemplateType, CardData } from "@/components/templates/CardTemplates";
import { Loader2 } from "lucide-react";

const PublicCard = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: card, isLoading, error } = useCard(slug || "");
  const recordScan = useRecordScan();
  const [scanRecorded, setScanRecorded] = useState(false);

  // Record scan on first load
  useEffect(() => {
    if (card?.id && !scanRecorded) {
      recordScan.mutate(card.id);
      setScanRecorded(true);
    }
  }, [card?.id, scanRecorded]);

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

  return (
    <div 
      className="min-h-dvh flex flex-col"
      style={{ backgroundColor: "#F5F5F7" }}
    >
      {/* Loading state */}
      {isLoading && (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 
            className="h-6 w-6 animate-spin" 
            style={{ color: "#007AFF" }} 
          />
        </div>
      )}

      {/* Error state */}
      {!isLoading && (error || !card) && (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <h1 
              className="text-xl font-semibold mb-2"
              style={{ color: "#1D1D1F" }}
            >
              Carte introuvable
            </h1>
            <p 
              className="text-sm"
              style={{ color: "#8E8E93" }}
            >
              Cette carte n'existe pas ou a été désactivée.
            </p>
          </div>
        </div>
      )}

      {/* Main content - Card centered */}
      {!isLoading && card && !error && cardData && (
        <div className="flex-1 flex items-center justify-center p-4 py-8">
          <div className="w-full max-w-sm">
            <DigitalCard
              data={cardData}
              template={(card.template as TemplateType) || "signature"}
              showWalletButtons={true}
              cardId={card.id}
              enableLeadCapture={false}
            />
          </div>
        </div>
      )}

      {/* Minimal footer */}
      <footer className="py-4 text-center">
        <p 
          className="text-xs"
          style={{ color: "#8E8E93" }}
        >
          Powered by IWASP
        </p>
      </footer>
    </div>
  );
};

export default PublicCard;
