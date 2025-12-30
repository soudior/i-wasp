/**
 * IWASP Public NFC Card Page
 * Ultra-minimal Apple Cupertino style
 * Mobile-first, single screen, no scroll
 */

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCard } from "@/hooks/useCards";
import { useRecordScan } from "@/hooks/useScans";
import { downloadVCard } from "@/lib/vcard";
import { Loader2, Phone, Mail, Linkedin, MessageCircle, UserPlus } from "lucide-react";

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

  // Action handlers - all functional
  const handleCall = () => {
    if (card?.phone) {
      window.location.href = `tel:${card.phone}`;
    }
  };

  const handleEmail = () => {
    if (card?.email) {
      window.location.href = `mailto:${card.email}`;
    }
  };

  const handleLinkedIn = () => {
    if (card?.linkedin) {
      const url = card.linkedin.startsWith("http") 
        ? card.linkedin 
        : `https://linkedin.com/in/${card.linkedin}`;
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const handleWhatsApp = () => {
    const whatsappNumber = (card as any)?.whatsapp || card?.phone;
    if (whatsappNumber) {
      const cleanNumber = whatsappNumber.replace(/\D/g, "");
      window.open(`https://wa.me/${cleanNumber}`, "_blank", "noopener,noreferrer");
    }
  };

  const handleAddContact = () => {
    if (!card) return;
    
    downloadVCard({
      firstName: card.first_name,
      lastName: card.last_name,
      title: card.title || undefined,
      company: card.company || undefined,
      email: card.email || undefined,
      phone: card.phone || undefined,
      nfcPageUrl: `${window.location.origin}/card/${card.slug}`,
    });
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
  const whatsappNumber = (card as any)?.whatsapp || card?.phone;

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

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Primary Actions Row */}
          <div className="grid grid-cols-2 gap-3">
            {/* Call */}
            {card.phone && (
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
            {card.email && (
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
            {card.linkedin && (
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
            {whatsappNumber && (
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
