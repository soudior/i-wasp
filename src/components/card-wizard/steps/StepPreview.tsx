/**
 * StepPreview - Étape 4: Aperçu final + Liens sociaux + Suggestions IA
 * 
 * Interface premium de validation et sélection des réseaux sociaux
 * Intègre les suggestions intelligentes de l'IA
 * Inclut le système de validation pré-publication IWASP
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
import { PublicationBlocker } from "@/components/PublicationBlocker";
import { validateForPublication } from "@/lib/publicationValidator";
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
  onValidationChange?: (canPublish: boolean) => void;
}

export function StepPreview({ data, onChange, validation, onValidationChange }: StepPreviewProps) {
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

  // Publication validation - calcul en temps réel
  const publicationValidation = useMemo(() => {
    return validateForPublication(data);
  }, [data]);

  // Notify parent of validation state changes
  useMemo(() => {
    onValidationChange?.(publicationValidation.canPublish);
  }, [publicationValidation.canPublish, onValidationChange]);

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

  const handleSocialLinksChange = (links: SocialLink[]) => {
    onChange({ socialLinks: links });
  };

  return (
    <div className="space-y-6">
      {/* AI Suggestions - Smart assistant */}
      <AISuggestions data={data} onChange={onChange} />

      {/* IWASP Publication Validator */}
      <PublicationBlocker validation={publicationValidation} />

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