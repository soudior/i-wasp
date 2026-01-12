/**
 * Step 2: Identité digitale
 * /order/identite
 * 
 * Style: Haute Couture Digitale — Noir, minimaliste
 */

import { useState, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useOrderFunnel, DigitalIdentity, OrderFunnelGuard } from "@/contexts/OrderFunnelContext";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { COUTURE } from "@/lib/hauteCouturePalette";
import { supabase } from "@/integrations/supabase/client";
import { 
  ArrowLeft, 
  User, 
  Phone,
  Mail,
  MessageCircle,
  Globe,
  Loader2,
  Plus,
  Linkedin,
  Instagram,
  Link2,
  Camera,
  X,
  Eye,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

async function uploadPhotoToStorage(dataUrl: string, fileName: string): Promise<string | null> {
  try {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    const timestamp = Date.now();
    const uniqueFileName = `order-photos/${timestamp}-${fileName}`;
    
    const { data, error } = await supabase.storage
      .from("card-assets")
      .upload(uniqueFileName, blob, {
        cacheControl: "3600",
        upsert: false,
        contentType: blob.type,
      });
    
    if (error) return null;
    
    const { data: urlData } = supabase.storage
      .from("card-assets")
      .getPublicUrl(data.path);
    
    return urlData.publicUrl;
  } catch (err) {
    console.error("Photo upload failed:", err);
    return null;
  }
}

const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.toLowerCase());
};

const validatePhone = (phone: string): boolean => {
  const cleaned = phone.replace(/[\s\-\.\(\)]/g, "");
  return cleaned.length >= 8 && /^[\+]?[0-9]+$/.test(cleaned);
};

function OrderIdentiteContent() {
  const { state, setDigitalIdentity, nextStep, prevStep } = useOrderFunnel();
  const [isNavigating, setIsNavigating] = useState(false);
  const [mobileView, setMobileView] = useState<"form" | "preview">("form");

  const [formData, setFormData] = useState<DigitalIdentity>(
    state.digitalIdentity || {
      clientType: "particulier",
      firstName: "",
      lastName: "",
      tagline: "",
      photoUrl: "",
      title: "",
      company: "",
      phone: "",
      email: "",
      whatsapp: "",
      instagram: "",
      linkedin: "",
      website: "",
      bio: "",
      latitude: undefined,
      longitude: undefined,
      googleMapsUrl: "",
    }
  );

  const photoInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleGeoSuccess = useCallback((geoData: any) => {
    const lat = geoData.latitude;
    const lng = geoData.longitude;
    const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
    
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      googleMapsUrl: mapsUrl,
    }));
    toast.success("Position enregistrée");
  }, []);

  const geolocation = useGeolocation({
    enableHighAccuracy: true,
    timeout: 15000,
    onSuccess: handleGeoSuccess,
  });

  const errors = useMemo(() => {
    const errs: Record<string, string> = {};
    if (!formData.firstName.trim()) errs.firstName = "Prénom requis";
    if (!formData.lastName.trim()) errs.lastName = "Nom requis";
    if (!formData.email.trim()) {
      errs.email = "Email requis";
    } else if (!validateEmail(formData.email)) {
      errs.email = "Email invalide";
    }
    if (!formData.phone.trim()) {
      errs.phone = "Téléphone requis";
    } else if (!validatePhone(formData.phone)) {
      errs.phone = "Téléphone invalide";
    }
    return errs;
  }, [formData]);

  const isValid = Object.keys(errors).length === 0;

  const handleChange = (field: keyof DigitalIdentity, value: string | number | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handlePhotoUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner une image");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'image doit faire moins de 5 Mo");
      return;
    }

    setIsUploadingPhoto(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      handleChange("photoUrl", dataUrl);
      setIsUploadingPhoto(false);
      toast.success("Photo ajoutée");
    };
    reader.onerror = () => {
      toast.error("Erreur lors du chargement");
      setIsUploadingPhoto(false);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleRemovePhoto = useCallback(() => {
    handleChange("photoUrl", "");
    if (photoInputRef.current) {
      photoInputRef.current.value = "";
    }
  }, []);

  const handleContinue = async () => {
    if (isNavigating || state.isTransitioning) return;
    
    if (!isValid) {
      setTouched({
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
      });
      toast.error("Veuillez corriger les erreurs");
      return;
    }

    setIsNavigating(true);

    let finalPhotoUrl = formData.photoUrl;

    if (formData.photoUrl && formData.photoUrl.startsWith("data:")) {
      toast.loading("Upload de la photo...", { id: "photo-upload" });
      
      const fileName = `${formData.firstName}-${formData.lastName}`.toLowerCase().replace(/\s+/g, "-") + ".jpg";
      const uploadedUrl = await uploadPhotoToStorage(formData.photoUrl, fileName);
      
      if (uploadedUrl) {
        finalPhotoUrl = uploadedUrl;
        toast.success("Photo uploadée", { id: "photo-upload" });
      } else {
        toast.error("Échec de l'upload", { id: "photo-upload" });
        setIsNavigating(false);
        return;
      }
    }

    const normalizedData: DigitalIdentity = {
      clientType: formData.clientType,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      tagline: formData.tagline?.trim()?.slice(0, 80),
      photoUrl: finalPhotoUrl,
      title: formData.title?.trim(),
      company: formData.company?.trim(),
      phone: formData.phone.trim(),
      email: formData.email.toLowerCase().trim(),
      whatsapp: formData.whatsapp?.trim(),
      instagram: formData.instagram?.replace("@", "").trim(),
      linkedin: formData.linkedin?.trim(),
      website: formData.website?.trim(),
      bio: formData.bio?.trim(),
      latitude: formData.latitude,
      longitude: formData.longitude,
      googleMapsUrl: formData.googleMapsUrl,
    };

    setDigitalIdentity(normalizedData);
    await nextStep();
  };

  const inputStyles = {
    backgroundColor: 'transparent',
    borderColor: COUTURE.jetSoft,
    color: COUTURE.silk,
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: COUTURE.jet }}>
      {/* Honeycomb texture */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cpath d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100' fill='none' stroke='${encodeURIComponent("#1a1a1a")}' stroke-width='0.4' stroke-opacity='0.04'/%3E%3C/svg%3E")`,
          backgroundSize: '56px 100px',
        }}
      />

      {/* Header */}
      <header className="relative z-10 px-6 py-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => prevStep()}
            className="flex items-center gap-2 transition-all duration-500"
            style={{ color: COUTURE.textMuted }}
            onMouseEnter={(e) => e.currentTarget.style.color = COUTURE.silk}
            onMouseLeave={(e) => e.currentTarget.style.color = COUTURE.textMuted}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-[11px] uppercase tracking-[0.15em]">Retour</span>
          </button>
          
          <Link 
            to="/"
            className="font-display text-lg tracking-[0.1em]"
            style={{ color: COUTURE.silk }}
          >
            i-wasp
          </Link>
          
          <div className="w-16" />
        </div>
      </header>

      {/* Progress indicator */}
      <div className="relative z-10 px-6 mb-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 justify-center">
            <span 
              className="text-[10px] uppercase tracking-[0.3em]"
              style={{ color: COUTURE.gold }}
            >
              02
            </span>
            <div 
              className="w-12 h-px"
              style={{ backgroundColor: `${COUTURE.gold}40` }}
            />
            <span 
              className="text-[10px] uppercase tracking-[0.2em]"
              style={{ color: COUTURE.textMuted }}
            >
              Identité
            </span>
          </div>
        </div>
      </div>

      {/* Mobile toggle */}
      <div className="lg:hidden relative z-10 px-6 mb-6">
        <div className="max-w-3xl mx-auto">
          <div 
            className="flex p-1"
            style={{ 
              backgroundColor: COUTURE.jetSoft,
              border: `1px solid ${COUTURE.jetMuted}`,
            }}
          >
            <button
              onClick={() => setMobileView("form")}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 text-[11px] uppercase tracking-[0.1em] transition-all"
              style={{
                backgroundColor: mobileView === "form" ? COUTURE.gold : 'transparent',
                color: mobileView === "form" ? COUTURE.jet : COUTURE.textMuted,
              }}
            >
              <FileText size={14} />
              Formulaire
            </button>
            <button
              onClick={() => setMobileView("preview")}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 text-[11px] uppercase tracking-[0.1em] transition-all"
              style={{
                backgroundColor: mobileView === "preview" ? COUTURE.gold : 'transparent',
                color: mobileView === "preview" ? COUTURE.jet : COUTURE.textMuted,
              }}
            >
              <Eye size={14} />
              Aperçu
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="relative z-10 px-6 pb-32">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <motion.div 
            className="text-center mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            <h1 
              className="font-display text-2xl md:text-3xl font-light italic mb-3"
              style={{ color: COUTURE.silk }}
            >
              Votre <span style={{ color: COUTURE.gold }}>identité.</span>
            </h1>
            <p 
              className="text-sm font-light"
              style={{ color: COUTURE.textMuted }}
            >
              Ces informations apparaîtront sur votre profil i‑wasp
            </p>
          </motion.div>

          {/* Two column layout */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form */}
            <div className={mobileView === "preview" ? "hidden lg:block" : ""}>
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.8 }}
              >
                {/* Photo */}
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => photoInputRef.current?.click()}
                      disabled={isUploadingPhoto}
                      className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden transition-all duration-500"
                      style={{ 
                        backgroundColor: COUTURE.jetSoft,
                        border: `1px solid ${COUTURE.jetMuted}`,
                      }}
                    >
                      {isUploadingPhoto ? (
                        <Loader2 className="w-6 h-6 animate-spin" style={{ color: COUTURE.gold }} />
                      ) : formData.photoUrl ? (
                        <img 
                          src={formData.photoUrl} 
                          alt="Photo" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Camera className="w-6 h-6" style={{ color: COUTURE.textMuted }} />
                      )}
                    </button>
                    {formData.photoUrl && (
                      <button
                        onClick={handleRemovePhoto}
                        className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: COUTURE.gold }}
                      >
                        <X className="w-3 h-3" style={{ color: COUTURE.jet }} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Name fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[11px] uppercase tracking-[0.1em]" style={{ color: COUTURE.textMuted }}>
                      Prénom *
                    </Label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) => handleChange("firstName", e.target.value)}
                      onBlur={() => handleBlur("firstName")}
                      placeholder="Votre prénom"
                      className="rounded-none border-0 border-b bg-transparent focus:ring-0"
                      style={inputStyles}
                    />
                    {touched.firstName && errors.firstName && (
                      <p className="text-[10px]" style={{ color: "#8B4049" }}>{errors.firstName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[11px] uppercase tracking-[0.1em]" style={{ color: COUTURE.textMuted }}>
                      Nom *
                    </Label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) => handleChange("lastName", e.target.value)}
                      onBlur={() => handleBlur("lastName")}
                      placeholder="Votre nom"
                      className="rounded-none border-0 border-b bg-transparent focus:ring-0"
                      style={inputStyles}
                    />
                    {touched.lastName && errors.lastName && (
                      <p className="text-[10px]" style={{ color: "#8B4049" }}>{errors.lastName}</p>
                    )}
                  </div>
                </div>

                {/* Title & Company */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[11px] uppercase tracking-[0.1em]" style={{ color: COUTURE.textMuted }}>
                      Titre
                    </Label>
                    <Input
                      value={formData.title || ""}
                      onChange={(e) => handleChange("title", e.target.value)}
                      placeholder="CEO, Consultant..."
                      className="rounded-none border-0 border-b bg-transparent focus:ring-0"
                      style={inputStyles}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[11px] uppercase tracking-[0.1em]" style={{ color: COUTURE.textMuted }}>
                      Entreprise
                    </Label>
                    <Input
                      value={formData.company || ""}
                      onChange={(e) => handleChange("company", e.target.value)}
                      placeholder="Votre société"
                      className="rounded-none border-0 border-b bg-transparent focus:ring-0"
                      style={inputStyles}
                    />
                  </div>
                </div>

                {/* Contact */}
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label className="text-[11px] uppercase tracking-[0.1em] flex items-center gap-2" style={{ color: COUTURE.textMuted }}>
                      <Mail className="w-3 h-3" /> Email *
                    </Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      onBlur={() => handleBlur("email")}
                      placeholder="vous@email.com"
                      className="rounded-none border-0 border-b bg-transparent focus:ring-0"
                      style={inputStyles}
                    />
                    {touched.email && errors.email && (
                      <p className="text-[10px]" style={{ color: "#8B4049" }}>{errors.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[11px] uppercase tracking-[0.1em] flex items-center gap-2" style={{ color: COUTURE.textMuted }}>
                      <Phone className="w-3 h-3" /> Téléphone *
                    </Label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      onBlur={() => handleBlur("phone")}
                      placeholder="+212 6 00 00 00 00"
                      className="rounded-none border-0 border-b bg-transparent focus:ring-0"
                      style={inputStyles}
                    />
                    {touched.phone && errors.phone && (
                      <p className="text-[10px]" style={{ color: "#8B4049" }}>{errors.phone}</p>
                    )}
                  </div>
                </div>

                {/* Social */}
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label className="text-[11px] uppercase tracking-[0.1em] flex items-center gap-2" style={{ color: COUTURE.textMuted }}>
                      <MessageCircle className="w-3 h-3" /> WhatsApp
                    </Label>
                    <Input
                      value={formData.whatsapp || ""}
                      onChange={(e) => handleChange("whatsapp", e.target.value)}
                      placeholder="+212 6 00 00 00 00"
                      className="rounded-none border-0 border-b bg-transparent focus:ring-0"
                      style={inputStyles}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[11px] uppercase tracking-[0.1em] flex items-center gap-2" style={{ color: COUTURE.textMuted }}>
                      <Instagram className="w-3 h-3" /> Instagram
                    </Label>
                    <Input
                      value={formData.instagram || ""}
                      onChange={(e) => handleChange("instagram", e.target.value)}
                      placeholder="@votre_compte"
                      className="rounded-none border-0 border-b bg-transparent focus:ring-0"
                      style={inputStyles}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[11px] uppercase tracking-[0.1em] flex items-center gap-2" style={{ color: COUTURE.textMuted }}>
                      <Linkedin className="w-3 h-3" /> LinkedIn
                    </Label>
                    <Input
                      value={formData.linkedin || ""}
                      onChange={(e) => handleChange("linkedin", e.target.value)}
                      placeholder="linkedin.com/in/vous"
                      className="rounded-none border-0 border-b bg-transparent focus:ring-0"
                      style={inputStyles}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[11px] uppercase tracking-[0.1em] flex items-center gap-2" style={{ color: COUTURE.textMuted }}>
                      <Globe className="w-3 h-3" /> Site web
                    </Label>
                    <Input
                      value={formData.website || ""}
                      onChange={(e) => handleChange("website", e.target.value)}
                      placeholder="https://votresite.com"
                      className="rounded-none border-0 border-b bg-transparent focus:ring-0"
                      style={inputStyles}
                    />
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-2 pt-4">
                  <Label className="text-[11px] uppercase tracking-[0.1em]" style={{ color: COUTURE.textMuted }}>
                    Tagline
                  </Label>
                  <Textarea
                    value={formData.tagline || ""}
                    onChange={(e) => handleChange("tagline", e.target.value.slice(0, 80))}
                    placeholder="Votre signature en une phrase..."
                    rows={2}
                    className="rounded-none border bg-transparent focus:ring-0 resize-none"
                    style={inputStyles}
                  />
                  <p className="text-[10px] text-right" style={{ color: COUTURE.textMuted }}>
                    {(formData.tagline || "").length}/80
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Preview */}
            <div className={mobileView === "form" ? "hidden lg:block" : ""}>
              <motion.div 
                className="sticky top-24 p-8"
                style={{ 
                  backgroundColor: COUTURE.jetSoft,
                  border: `1px solid ${COUTURE.jetMuted}`,
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                <div className="text-center space-y-4">
                  {/* Avatar */}
                  <div 
                    className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-xl font-light overflow-hidden"
                    style={{ 
                      backgroundColor: COUTURE.jet,
                      border: `1px solid ${COUTURE.jetMuted}`,
                      color: COUTURE.gold,
                    }}
                  >
                    {formData.photoUrl ? (
                      <img 
                        src={formData.photoUrl} 
                        alt="Photo" 
                        className="w-full h-full object-cover"
                      />
                    ) : formData.firstName && formData.lastName ? (
                      `${formData.firstName.charAt(0)}${formData.lastName.charAt(0)}`.toUpperCase()
                    ) : (
                      <User size={24} style={{ color: COUTURE.textMuted }} />
                    )}
                  </div>

                  {/* Name */}
                  <div>
                    <h3 
                      className="font-display text-xl font-light"
                      style={{ color: COUTURE.silk }}
                    >
                      {formData.firstName || formData.lastName 
                        ? `${formData.firstName} ${formData.lastName}`.trim()
                        : "Votre nom"
                      }
                    </h3>
                    
                    {(formData.title || formData.company) && (
                      <p 
                        className="text-sm mt-1 font-light"
                        style={{ color: COUTURE.textMuted }}
                      >
                        {formData.title}
                        {formData.title && formData.company && " · "}
                        {formData.company}
                      </p>
                    )}
                  </div>

                  {/* Tagline */}
                  {formData.tagline && (
                    <p
                      className="text-sm italic font-light px-4"
                      style={{ color: COUTURE.gold }}
                    >
                      "{formData.tagline}"
                    </p>
                  )}

                  {/* Contact Icons */}
                  <div className="flex justify-center gap-3 pt-2">
                    {formData.phone && (
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: COUTURE.jet }}
                      >
                        <Phone size={16} style={{ color: COUTURE.gold }} />
                      </div>
                    )}
                    {formData.email && (
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: COUTURE.jet }}
                      >
                        <Mail size={16} style={{ color: COUTURE.gold }} />
                      </div>
                    )}
                    {formData.whatsapp && (
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: COUTURE.jet }}
                      >
                        <MessageCircle size={16} style={{ color: COUTURE.gold }} />
                      </div>
                    )}
                    {formData.linkedin && (
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: COUTURE.jet }}
                      >
                        <Linkedin size={16} style={{ color: COUTURE.gold }} />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      {/* Fixed CTA */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-20 px-6 py-6"
        style={{ 
          backgroundColor: COUTURE.jet,
          borderTop: `1px solid ${COUTURE.jetSoft}`,
        }}
      >
        <div className="max-w-3xl mx-auto flex justify-center">
          <button
            onClick={handleContinue}
            disabled={!isValid || isNavigating || state.isTransitioning}
            className="text-[11px] uppercase tracking-[0.25em] font-light transition-all duration-700 pb-1 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ 
              color: isValid ? COUTURE.gold : COUTURE.textMuted,
              borderBottom: `1px solid ${isValid ? `${COUTURE.gold}60` : 'transparent'}`,
            }}
          >
            {isNavigating ? "Chargement..." : "Continuer"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OrderIdentite() {
  return (
    <OrderFunnelGuard step={2}>
      <OrderIdentiteContent />
    </OrderFunnelGuard>
  );
}
