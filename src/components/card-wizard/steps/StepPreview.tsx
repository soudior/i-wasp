/**
 * StepPreview - Étape 4: Aperçu final + Liens sociaux + Suggestions IA
 * 
 * Interface premium de validation et sélection des réseaux sociaux
 * Intègre les suggestions intelligentes de l'IA
 */

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardFormData } from "../CardWizard";
import { SocialLink } from "@/lib/socialNetworks";
import { SocialNetworkSelector } from "./SocialNetworkSelector";
import { AISuggestions } from "../AISuggestions";
import { WhatsAppEditor } from "@/components/WhatsAppEditor";
import { SmartLocationEditor } from "@/components/SmartLocationEditor";
import { VCardEditor } from "@/components/VCardEditor";
import GoogleReviewsEditor from "@/components/GoogleReviewsEditor";
import { 
  Check, 
  X, 
  Globe,
  Sparkles,
  Star
} from "lucide-react";

interface StepPreviewProps {
  data: CardFormData;
  onChange: (updates: Partial<CardFormData>) => void;
  validation: Record<string, boolean>;
}

export function StepPreview({ data, onChange, validation }: StepPreviewProps) {
  // WhatsApp state from phone number
  const [whatsappData, setWhatsappData] = useState({
    number: "",
    countryCode: "+33",
    message: "",
  });

  // Location state
  const [locationData, setLocationData] = useState({
    address: data.location || "",
    latitude: undefined as number | undefined,
    longitude: undefined as number | undefined,
  });

  // Google Reviews state - initialized from formData
  const [googleReviews, setGoogleReviews] = useState({
    url: data.googleReviews?.url || "",
    rating: data.googleReviews?.rating || 4.5,
    reviewCount: data.googleReviews?.reviewCount || 0,
  });

  // Sync Google Reviews to parent form
  const handleGoogleReviewsChange = (reviewsData: typeof googleReviews) => {
    setGoogleReviews(reviewsData);
    if (reviewsData.url) {
      onChange({ googleReviews: reviewsData });
    }
  };

  // Sync WhatsApp to social links
  const handleWhatsAppChange = (waData: typeof whatsappData) => {
    setWhatsappData(waData);
    if (waData.number) {
      const fullNumber = waData.countryCode + waData.number;
      const existingLinks = (data.socialLinks || []).filter(l => l.networkId !== "whatsapp");
      onChange({
        socialLinks: [
          ...existingLinks,
          { id: `whatsapp-${Date.now()}`, networkId: "whatsapp", value: fullNumber }
        ]
      });
    }
  };

  // Sync location
  const handleLocationChange = (locData: typeof locationData) => {
    setLocationData(locData);
    onChange({ location: locData.address });
  };

  const checks = [
    { 
      label: "Informations complètes", 
      ok: Boolean(data.firstName && data.lastName),
      detail: data.firstName && data.lastName 
        ? `${data.firstName} ${data.lastName}` 
        : "Prénom et nom requis"
    },
    { 
      label: "Photo ou logo", 
      ok: Boolean(data.photoUrl || data.logoUrl),
      detail: data.photoUrl ? "Photo ajoutée" : data.logoUrl ? "Logo ajouté" : "Aucun visuel"
    },
    { 
      label: "Design validé", 
      ok: Boolean(data.template),
      detail: data.template ? `Template: ${data.template}` : "Aucun template"
    },
  ];

  const allValid = checks.every(c => c.ok);

  const handleSocialLinksChange = (links: SocialLink[]) => {
    onChange({ socialLinks: links });
  };

  return (
    <div className="space-y-6">
      {/* AI Suggestions - Smart assistant */}
      <AISuggestions data={data} onChange={onChange} />

      {/* Validation Checklist */}
      <Card className="border-border/50 shadow-xl bg-card/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={18} className="text-accent" />
            <h3 className="font-semibold">Vérification finale</h3>
          </div>
          
          <div className="space-y-3">
            {checks.map((check, index) => (
              <motion.div
                key={check.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4, ease: "easeOut" }}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                  check.ok 
                    ? "bg-accent/10 border border-accent/20" 
                    : "bg-destructive/10 border border-destructive/20"
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-300 ${
                  check.ok ? "bg-accent" : "bg-destructive"
                }`}>
                  {check.ok ? (
                    <Check size={14} className="text-accent-foreground" />
                  ) : (
                    <X size={14} className="text-destructive-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{check.label}</p>
                  <p className="text-xs text-muted-foreground">{check.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {allValid && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.4, ease: "easeOut" }}
              className="mt-4 p-4 rounded-xl bg-accent/5 border border-accent/10 text-center"
            >
              <p className="text-sm font-medium text-accent">
                ✓ Votre carte est prête à être sauvegardée
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* WhatsApp Module */}
      <Card className="border-border/50 shadow-xl bg-card/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <WhatsAppEditor
            value={whatsappData}
            onChange={handleWhatsAppChange}
            phoneNumber={data.phone}
          />
        </CardContent>
      </Card>

      {/* Location Module */}
      <Card className="border-border/50 shadow-xl bg-card/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <SmartLocationEditor
            value={locationData}
            onChange={handleLocationChange}
          />
        </CardContent>
      </Card>

      {/* vCard Module */}
      <Card className="border-border/50 shadow-xl bg-card/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <VCardEditor
            data={{
              firstName: data.firstName,
              lastName: data.lastName,
              title: data.title,
              company: data.company,
              phone: data.phone,
              email: data.email,
              website: data.website,
              location: locationData.address,
              socialLinks: data.socialLinks,
            }}
          />
        </CardContent>
      </Card>

      {/* Google Reviews Module */}
      <Card className="border-border/50 shadow-xl bg-card/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <GoogleReviewsEditor
            initialUrl={googleReviews.url}
            initialRating={googleReviews.rating}
            initialReviewCount={googleReviews.reviewCount}
            onUpdate={handleGoogleReviewsChange}
          />
        </CardContent>
      </Card>

      {/* Social Networks Selection */}
      <Card className="border-border/50 shadow-xl bg-card/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <Globe size={18} className="text-accent" />
            <h3 className="font-semibold">Vos liens</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-5">
            Connectez vos réseaux pour une carte complète et professionnelle
          </p>
          
          <SocialNetworkSelector
            selectedLinks={data.socialLinks || []}
            onChange={handleSocialLinksChange}
          />

          {/* Website field */}
          <div className="mt-5 pt-5 border-t border-border/30">
            <div className="space-y-2">
              <Label className="text-sm flex items-center gap-2 text-muted-foreground">
                <Globe size={14} />
                Site web principal
              </Label>
              <Input
                placeholder="www.votresite.com"
                value={data.website}
                onChange={(e) => onChange({ website: e.target.value })}
                className="h-12 bg-muted/30 border-border/50 rounded-xl focus:ring-accent/30 transition-all duration-300"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Premium message */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
        className="text-center py-6"
      >
        <p className="text-sm text-muted-foreground italic">
          "Vous ne créez pas une carte. Vous créez une impression."
        </p>
        <p className="text-xs text-muted-foreground/70 mt-2">
          — IWASP
        </p>
      </motion.div>
    </div>
  );
}

export default StepPreview;