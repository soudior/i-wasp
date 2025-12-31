/**
 * IWASP Public NFC Card Page
 * Ultra-minimal Apple Cupertino style
 * Mobile-first, single screen, no scroll
 * 
 * SECURITY: Uses secure RPC functions - never exposes raw contact data
 */

import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { usePublicCard, useCardActionUrl, useIncrementCardView } from "@/hooks/usePublicCard";
import { useRecordScan } from "@/hooks/useScans";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Phone, Mail, Linkedin, MessageCircle, UserPlus } from "lucide-react";

const PublicCard = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: card, isLoading, error } = usePublicCard(slug || "");
  const recordScan = useRecordScan();
  const getActionUrl = useCardActionUrl();
  const incrementView = useIncrementCardView();
  const [scanRecorded, setScanRecorded] = useState(false);

  // Record scan on first load
  useEffect(() => {
    if (card?.id && !scanRecorded) {
      recordScan.mutate(card.id);
      incrementView(slug || "");
      setScanRecorded(true);
    }
  }, [card?.id, scanRecorded, slug]);

  // Secure action handlers - get URLs from server, never expose raw data
  const handleAction = useCallback(async (action: "email" | "phone" | "whatsapp" | "linkedin") => {
    if (!slug) return;
    
    const url = await getActionUrl(slug, action);
    if (url) {
      if (action === "linkedin" || action === "whatsapp") {
        window.open(url, "_blank", "noopener,noreferrer");
      } else {
        window.location.href = url;
      }
    }
  }, [slug, getActionUrl]);

  const handleCall = () => handleAction("phone");
  const handleEmail = () => handleAction("email");
  const handleLinkedIn = () => handleAction("linkedin");
  const handleWhatsApp = () => handleAction("whatsapp");

  // Secure vCard download - get data from server function
  const handleAddContact = async () => {
    if (!card || !slug) return;
    
    try {
      // Get vCard data securely from server using raw RPC call
      const { data, error } = await supabase.rpc("get_vcard_data" as any, {
        p_slug: slug,
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

  const fullName = `${card.first_name} ${card.last_name}`;
  const subtitle = [card.title, card.company].filter(Boolean).join(" · ");

  return (
    <div 
      className="min-h-dvh flex flex-col items-center justify-center p-4"
      style={{ backgroundColor: "#F5F5F7" }}
    >
      {/* Card */}
      <div 
        className="w-full max-w-sm rounded-3xl p-6 shadow-sm"
        style={{ 
          backgroundColor: "#FFFFFF",
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.04)"
        }}
      >
        {/* Profile Section */}
        <div className="text-center mb-6">
          {/* Photo */}
          {card.photo_url ? (
            <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
              <img 
                src={card.photo_url} 
                alt={fullName}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div 
              className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#F5F5F7" }}
            >
              <span className="text-2xl font-medium" style={{ color: "#8E8E93" }}>
                {card.first_name.charAt(0)}{card.last_name.charAt(0)}
              </span>
            </div>
          )}

          {/* Name */}
          <h1 
            className="text-xl font-semibold tracking-tight"
            style={{ color: "#1D1D1F" }}
          >
            {fullName}
          </h1>

          {/* Role / Company */}
          {subtitle && (
            <p className="text-sm mt-1" style={{ color: "#8E8E93" }}>
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
                style={{ backgroundColor: "#F5F5F7" }}
              >
                <Phone size={18} style={{ color: "#007AFF" }} />
                <span className="text-sm font-medium" style={{ color: "#1D1D1F" }}>
                  Appeler
                </span>
              </button>
            )}

            {/* Email */}
            {card.has_email && (
              <button
                onClick={handleEmail}
                className="flex items-center justify-center gap-2 py-3.5 rounded-xl transition-all active:scale-[0.98]"
                style={{ backgroundColor: "#F5F5F7" }}
              >
                <Mail size={18} style={{ color: "#007AFF" }} />
                <span className="text-sm font-medium" style={{ color: "#1D1D1F" }}>
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
                style={{ backgroundColor: "#F5F5F7" }}
              >
                <Linkedin size={18} style={{ color: "#0A66C2" }} />
                <span className="text-sm font-medium" style={{ color: "#1D1D1F" }}>
                  LinkedIn
                </span>
              </button>
            )}

            {/* WhatsApp */}
            {card.has_whatsapp && (
              <button
                onClick={handleWhatsApp}
                className="flex items-center justify-center gap-2 py-3.5 rounded-xl transition-all active:scale-[0.98]"
                style={{ backgroundColor: "#F5F5F7" }}
              >
                <MessageCircle size={18} style={{ color: "#25D366" }} />
                <span className="text-sm font-medium" style={{ color: "#1D1D1F" }}>
                  WhatsApp
                </span>
              </button>
            )}
          </div>

          {/* Add to Contacts - Primary CTA */}
          <button
            onClick={handleAddContact}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-medium transition-all active:scale-[0.98]"
            style={{ backgroundColor: "#007AFF", color: "#FFFFFF" }}
          >
            <UserPlus size={18} />
            Ajouter au contact
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublicCard;
