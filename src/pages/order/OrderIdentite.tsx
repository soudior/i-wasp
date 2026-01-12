/**
 * Step 2: Identité digitale
 * /order/identite
 * 
 * IWASP Premium Luxury — Simplified Contact Form
 */

import { useState, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOrderFunnel, DigitalIdentity, OrderFunnelGuard, ClientType } from "@/contexts/OrderFunnelContext";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { OrderProgressBar, PageTransition, contentVariants, itemVariants } from "@/components/order";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { STEALTH } from "@/lib/stealthPalette";
import { supabase } from "@/integrations/supabase/client";
import { 
  ArrowLeft, 
  ArrowRight, 
  User, 
  Phone,
  Mail,
  MessageCircle,
  Globe,
  MapPin,
  Navigation,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Plus,
  Linkedin,
  Instagram,
  Twitter,
  Youtube,
  Facebook,
  Link2,
  Quote,
  Eye,
  FileText,
  Camera,
  X,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

// Helper to upload photo to Supabase Storage
async function uploadPhotoToStorage(dataUrl: string, fileName: string): Promise<string | null> {
  try {
    // Convert data URL to blob
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    
    // Generate unique file name
    const timestamp = Date.now();
    const uniqueFileName = `order-photos/${timestamp}-${fileName}`;
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("card-assets")
      .upload(uniqueFileName, blob, {
        cacheControl: "3600",
        upsert: false,
        contentType: blob.type,
      });
    
    if (error) {
      console.error("Upload error:", error);
      return null;
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from("card-assets")
      .getPublicUrl(data.path);
    
    return urlData.publicUrl;
  } catch (err) {
    console.error("Photo upload failed:", err);
    return null;
  }
}

// Validation helpers
const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.toLowerCase());
};

const validatePhone = (phone: string): boolean => {
  const cleaned = phone.replace(/[\s\-\.\(\)]/g, "");
  return cleaned.length >= 8 && /^[\+]?[0-9]+$/.test(cleaned);
};

// Additional social links options
const ADDITIONAL_LINKS = [
  { id: "twitter", label: "Twitter / X", icon: Twitter, placeholder: "@username" },
  { id: "youtube", label: "YouTube", icon: Youtube, placeholder: "youtube.com/@channel" },
  { id: "facebook", label: "Facebook", icon: Facebook, placeholder: "facebook.com/page" },
  { id: "tiktok", label: "TikTok", icon: Link2, placeholder: "@username" },
  { id: "calendly", label: "Calendly", icon: Link2, placeholder: "calendly.com/vous" },
  { id: "other", label: "Autre lien", icon: Link2, placeholder: "https://..." },
];

function OrderIdentiteContent() {
  const { state, setDigitalIdentity, nextStep, prevStep } = useOrderFunnel();
  const [isNavigating, setIsNavigating] = useState(false);
  const [showAdditionalLinks, setShowAdditionalLinks] = useState(false);
  const [additionalLinks, setAdditionalLinks] = useState<Record<string, string>>({});
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

  // Geolocation
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

  // Validation
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

  // Photo upload handler
  const handlePhotoUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner une image");
      return;
    }

    // Validate file size (max 5MB)
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
      toast.success("Photo ajoutée !");
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

    // Upload photo to Supabase Storage if it's a data URL
    if (formData.photoUrl && formData.photoUrl.startsWith("data:")) {
      toast.loading("Upload de la photo...", { id: "photo-upload" });
      
      const fileName = `${formData.firstName}-${formData.lastName}`.toLowerCase().replace(/\s+/g, "-") + ".jpg";
      const uploadedUrl = await uploadPhotoToStorage(formData.photoUrl, fileName);
      
      if (uploadedUrl) {
        finalPhotoUrl = uploadedUrl;
        toast.success("Photo uploadée !", { id: "photo-upload" });
      } else {
        toast.error("Échec de l'upload photo", { id: "photo-upload" });
        setIsNavigating(false);
        return;
      }
    }

    // Normalize data
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

  // Input styles for dark theme
  const inputStyles = {
    backgroundColor: STEALTH.bgInput,
    borderColor: STEALTH.border,
    color: STEALTH.text,
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: STEALTH.bg }}>
      <Navbar />
      
      <PageTransition>
        <main className="pt-24 pb-32 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Progress Bar */}
            <div className="max-w-2xl mx-auto lg:max-w-none">
              <OrderProgressBar currentStep={2} />
            </div>

            {/* Header */}
            <motion.div 
              className="text-center mb-10"
              variants={contentVariants}
              initial="initial"
              animate="animate"
            >
              <motion.p 
                className="text-sm tracking-widest uppercase mb-3"
                style={{ color: STEALTH.accent }}
                variants={itemVariants}
              >
                Étape 2 sur 7
              </motion.p>
              <motion.h1 
                className="text-3xl md:text-4xl font-display font-bold mb-3"
                style={{ color: STEALTH.text }}
                variants={itemVariants}
              >
                Coordonnées & présence en ligne
              </motion.h1>
              <motion.p 
                className="text-base"
                style={{ color: STEALTH.textSecondary }}
                variants={itemVariants}
              >
                Ces informations seront visibles sur votre profil numérique i‑wasp
              </motion.p>
            </motion.div>

            {/* Mobile Toggle & Compact Preview */}
            <div className="lg:hidden mb-6">
              {/* Toggle Buttons */}
              <div 
                className="flex rounded-2xl p-1 mb-4"
                style={{ backgroundColor: STEALTH.bgCard }}
              >
                <button
                  onClick={() => setMobileView("form")}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all"
                  style={{
                    backgroundColor: mobileView === "form" ? STEALTH.accent : "transparent",
                    color: mobileView === "form" ? STEALTH.bg : STEALTH.textSecondary,
                  }}
                >
                  <FileText size={16} />
                  Formulaire
                </button>
                <button
                  onClick={() => setMobileView("preview")}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all"
                  style={{
                    backgroundColor: mobileView === "preview" ? STEALTH.accent : "transparent",
                    color: mobileView === "preview" ? STEALTH.bg : STEALTH.textSecondary,
                  }}
                >
                  <Eye size={16} />
                  Aperçu
                </button>
              </div>

              {/* Mobile Preview (when selected) */}
              <AnimatePresence mode="wait">
                {mobileView === "preview" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="rounded-3xl p-6 relative overflow-hidden"
                    style={{ 
                      backgroundColor: STEALTH.bgCard,
                      border: `1px solid ${STEALTH.border}`
                    }}
                  >
                    {/* Gradient overlay */}
                    <div 
                      className="absolute inset-0 opacity-30"
                      style={{
                        background: `radial-gradient(circle at top right, ${STEALTH.accent}15, transparent 60%)`
                      }}
                    />

                    <div className="relative z-10 text-center space-y-4">
                      {/* Avatar */}
                      <div 
                        className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-2xl font-bold overflow-hidden"
                        style={{ 
                          backgroundColor: STEALTH.bgInput,
                          color: STEALTH.accent,
                          border: `2px solid ${STEALTH.border}`
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
                          <User size={28} style={{ color: STEALTH.textMuted }} />
                        )}
                      </div>

                      {/* Name */}
                      <div>
                        <h3 
                          className="text-xl font-display font-bold"
                          style={{ color: STEALTH.text }}
                        >
                          {formData.firstName || formData.lastName 
                            ? `${formData.firstName} ${formData.lastName}`.trim()
                            : "Votre nom"
                          }
                        </h3>
                        
                        {(formData.title || formData.company) && (
                          <p 
                            className="text-sm mt-1"
                            style={{ color: STEALTH.textSecondary }}
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
                          className="text-sm italic px-2"
                          style={{ color: STEALTH.textMuted }}
                        >
                          "{formData.tagline}"
                        </p>
                      )}

                      {/* Contact Icons */}
                      <div className="flex justify-center gap-2 pt-1">
                        {formData.phone && (
                          <div 
                            className="w-9 h-9 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: STEALTH.bgInput }}
                          >
                            <Phone size={14} style={{ color: STEALTH.accent }} />
                          </div>
                        )}
                        {formData.email && (
                          <div 
                            className="w-9 h-9 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: STEALTH.bgInput }}
                          >
                            <Mail size={14} style={{ color: STEALTH.accent }} />
                          </div>
                        )}
                        {formData.whatsapp && (
                          <div 
                            className="w-9 h-9 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: STEALTH.bgInput }}
                          >
                            <MessageCircle size={14} style={{ color: STEALTH.accent }} />
                          </div>
                        )}
                        {formData.linkedin && (
                          <div 
                            className="w-9 h-9 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: STEALTH.bgInput }}
                          >
                            <Linkedin size={14} style={{ color: STEALTH.accent }} />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Two Column Layout */}
            <div className="grid lg:grid-cols-5 gap-8">
              {/* Left Column - Form (hidden on mobile when preview is active) */}
              <div className={`lg:col-span-3 ${mobileView === "preview" ? "hidden lg:block" : ""}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-8"
                >
              {/* Client Type Selection */}
              <div 
                className="rounded-3xl p-6"
                style={{ 
                  backgroundColor: STEALTH.bgCard,
                  border: `1px solid ${STEALTH.border}`
                }}
              >
                <div 
                  className="flex items-center gap-2 text-lg font-semibold mb-4"
                  style={{ color: STEALTH.text }}
                >
                  <User size={20} style={{ color: STEALTH.accent }} />
                  Type de client
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "particulier", label: "Particulier", icon: "👤" },
                    { id: "independant", label: "Indépendant", icon: "💼" },
                    { id: "entreprise", label: "Entreprise", icon: "🏢" },
                  ].map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => handleChange("clientType", type.id as ClientType)}
                      className="p-4 rounded-xl text-center transition-all duration-200"
                      style={{
                        backgroundColor: formData.clientType === type.id ? STEALTH.accent : STEALTH.bgInput,
                        border: `2px solid ${formData.clientType === type.id ? STEALTH.accent : STEALTH.border}`,
                        color: formData.clientType === type.id ? STEALTH.bg : STEALTH.text,
                      }}
                    >
                      <span className="text-2xl mb-2 block">{type.icon}</span>
                      <span className="text-sm font-medium">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Personal Info */}
              <div 
                className="rounded-3xl p-6"
                style={{ 
                  backgroundColor: STEALTH.bgCard,
                  border: `1px solid ${STEALTH.border}`
                }}
              >
                <div 
                  className="flex items-center gap-2 text-lg font-semibold mb-5"
                  style={{ color: STEALTH.text }}
                >
                  <User size={20} style={{ color: STEALTH.accent }} />
                  Identité
                </div>
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" style={{ color: STEALTH.text }}>Prénom *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleChange("firstName", e.target.value)}
                        onBlur={() => handleBlur("firstName")}
                        placeholder="Marie"
                        className="rounded-xl h-12"
                        style={inputStyles}
                      />
                      {touched.firstName && errors.firstName && (
                        <p className="text-xs flex items-center gap-1" style={{ color: STEALTH.error }}>
                          <AlertCircle size={12} />
                          {errors.firstName}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" style={{ color: STEALTH.text }}>Nom *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleChange("lastName", e.target.value)}
                        onBlur={() => handleBlur("lastName")}
                        placeholder="Laurent"
                        className="rounded-xl h-12"
                        style={inputStyles}
                      />
                      {touched.lastName && errors.lastName && (
                        <p className="text-xs flex items-center gap-1" style={{ color: STEALTH.error }}>
                          <AlertCircle size={12} />
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Photo Upload */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2" style={{ color: STEALTH.text }}>
                      <Camera size={14} style={{ color: STEALTH.accent }} />
                      Photo de profil
                    </Label>
                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    
                    {formData.photoUrl ? (
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-16 h-16 rounded-full overflow-hidden"
                          style={{ border: `2px solid ${STEALTH.accent}` }}
                        >
                          <img 
                            src={formData.photoUrl} 
                            alt="Photo" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => photoInputRef.current?.click()}
                            className="rounded-xl"
                            style={{ borderColor: STEALTH.border, color: STEALTH.text }}
                          >
                            <Camera size={14} className="mr-2" />
                            Changer
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleRemovePhoto}
                            className="rounded-xl"
                            style={{ color: STEALTH.error }}
                          >
                            <X size={14} />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => photoInputRef.current?.click()}
                        disabled={isUploadingPhoto}
                        className="w-full flex items-center justify-center gap-3 p-4 rounded-xl border-2 border-dashed transition-all hover:border-solid"
                        style={{ 
                          borderColor: STEALTH.border,
                          backgroundColor: STEALTH.bgInput,
                          color: STEALTH.textSecondary 
                        }}
                      >
                        {isUploadingPhoto ? (
                          <Loader2 size={20} className="animate-spin" style={{ color: STEALTH.accent }} />
                        ) : (
                          <Camera size={20} style={{ color: STEALTH.accent }} />
                        )}
                        <span className="text-sm">
                          {isUploadingPhoto ? "Chargement..." : "Ajouter une photo"}
                        </span>
                      </button>
                    )}
                    <p className="text-xs" style={{ color: STEALTH.textMuted }}>
                      Recommandé : photo carrée, min 200×200px
                    </p>
                  </div>

                  {/* Phrase emblème */}
                  <div className="space-y-2">
                    <Label htmlFor="tagline" className="flex items-center gap-2" style={{ color: STEALTH.text }}>
                      <Quote size={14} style={{ color: STEALTH.accent }} />
                      Phrase emblème
                    </Label>
                    <Input
                      id="tagline"
                      value={formData.tagline || ""}
                      onChange={(e) => handleChange("tagline", e.target.value.slice(0, 80))}
                      placeholder="L'excellence en toute simplicité"
                      className="rounded-xl h-12"
                      style={inputStyles}
                      maxLength={80}
                    />
                    <p className="text-xs flex justify-between" style={{ color: STEALTH.textMuted }}>
                      <span>Une phrase qui vous représente</span>
                      <span>{(formData.tagline?.length || 0)}/80</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title" style={{ color: STEALTH.text }}>Fonction</Label>
                      <Input
                        id="title"
                        value={formData.title || ""}
                        onChange={(e) => handleChange("title", e.target.value)}
                        placeholder="Directrice Générale"
                        className="rounded-xl h-12"
                        style={inputStyles}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company" style={{ color: STEALTH.text }}>Entreprise</Label>
                      <Input
                        id="company"
                        value={formData.company || ""}
                        onChange={(e) => handleChange("company", e.target.value)}
                        placeholder="Ma Société"
                        className="rounded-xl h-12"
                        style={inputStyles}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" style={{ color: STEALTH.text }}>Bio courte</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio || ""}
                      onChange={(e) => handleChange("bio", e.target.value)}
                      placeholder="Quelques mots sur vous ou votre activité professionnelle..."
                      rows={3}
                      maxLength={200}
                      className="rounded-xl"
                      style={inputStyles}
                    />
                    <p className="text-xs text-right" style={{ color: STEALTH.textMuted }}>
                      {(formData.bio?.length || 0)}/200
                    </p>
                  </div>
                </div>
              </div>

              {/* ═══════════════════════════════════════════════════════════
                 BLOC 1: CONTACT DIRECT
                 ═══════════════════════════════════════════════════════════ */}
              <div 
                className="rounded-3xl p-6"
                style={{ 
                  backgroundColor: STEALTH.bgCard,
                  border: `1px solid ${STEALTH.border}`
                }}
              >
                <div 
                  className="flex items-center gap-2 text-lg font-semibold mb-2"
                  style={{ color: STEALTH.text }}
                >
                  <Phone size={20} style={{ color: STEALTH.accent }} />
                  Contact direct
                </div>
                <p 
                  className="text-sm mb-6"
                  style={{ color: STEALTH.textSecondary }}
                >
                  Vos coordonnées principales pour être contacté
                </p>

                <div className="space-y-5">
                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2" style={{ color: STEALTH.text }}>
                      <Phone size={14} style={{ color: STEALTH.accent }} />
                      Téléphone *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      onBlur={() => handleBlur("phone")}
                      placeholder="+33 6 12 34 56 78"
                      className="rounded-xl h-12"
                      style={inputStyles}
                    />
                    {touched.phone && errors.phone && (
                      <p className="text-xs flex items-center gap-1" style={{ color: STEALTH.error }}>
                        <AlertCircle size={12} />
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2" style={{ color: STEALTH.text }}>
                      <Mail size={14} style={{ color: STEALTH.accent }} />
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      onBlur={() => handleBlur("email")}
                      placeholder="prenom.nom@entreprise.com"
                      className="rounded-xl h-12"
                      style={inputStyles}
                    />
                    {touched.email && errors.email && (
                      <p className="text-xs flex items-center gap-1" style={{ color: STEALTH.error }}>
                        <AlertCircle size={12} />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* WhatsApp */}
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp" className="flex items-center gap-2" style={{ color: STEALTH.text }}>
                      <MessageCircle size={14} style={{ color: STEALTH.accent }} />
                      WhatsApp
                      <Badge 
                        className="ml-2 text-[10px] font-normal"
                        style={{ 
                          backgroundColor: STEALTH.accentMuted, 
                          color: STEALTH.accent,
                          border: 'none'
                        }}
                      >
                        Recommandé
                      </Badge>
                    </Label>
                    <Input
                      id="whatsapp"
                      type="tel"
                      value={formData.whatsapp || ""}
                      onChange={(e) => handleChange("whatsapp", e.target.value)}
                      placeholder="+33 6 12 34 56 78"
                      className="rounded-xl h-12"
                      style={inputStyles}
                    />
                    <p 
                      className="text-xs"
                      style={{ color: STEALTH.textMuted }}
                    >
                      Permet d'envoyer des relances en un clic depuis i‑wasp
                    </p>
                  </div>
                </div>
              </div>

              {/* ═══════════════════════════════════════════════════════════
                 BLOC 2: RÉSEAUX & WEB
                 ═══════════════════════════════════════════════════════════ */}
              <div 
                className="rounded-3xl p-6"
                style={{ 
                  backgroundColor: STEALTH.bgCard,
                  border: `1px solid ${STEALTH.border}`
                }}
              >
                <div 
                  className="flex items-center gap-2 text-lg font-semibold mb-2"
                  style={{ color: STEALTH.text }}
                >
                  <Globe size={20} style={{ color: STEALTH.accent }} />
                  Réseaux & Web
                </div>
                <p 
                  className="text-sm mb-6"
                  style={{ color: STEALTH.textSecondary }}
                >
                  Votre présence en ligne
                </p>

                <div className="space-y-5">
                  {/* LinkedIn */}
                  <div className="space-y-2">
                    <Label htmlFor="linkedin" className="flex items-center gap-2" style={{ color: STEALTH.text }}>
                      <Linkedin size={14} style={{ color: STEALTH.accent }} />
                      LinkedIn
                    </Label>
                    <Input
                      id="linkedin"
                      value={formData.linkedin || ""}
                      onChange={(e) => handleChange("linkedin", e.target.value)}
                      placeholder="linkedin.com/in/votre-profil"
                      className="rounded-xl h-12"
                      style={inputStyles}
                    />
                  </div>

                  {/* Instagram */}
                  <div className="space-y-2">
                    <Label htmlFor="instagram" className="flex items-center gap-2" style={{ color: STEALTH.text }}>
                      <Instagram size={14} style={{ color: STEALTH.accent }} />
                      Instagram
                    </Label>
                    <div className="relative">
                      <span 
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-sm"
                        style={{ color: STEALTH.textMuted }}
                      >
                        @
                      </span>
                      <Input
                        id="instagram"
                        value={formData.instagram || ""}
                        onChange={(e) => handleChange("instagram", e.target.value.replace("@", ""))}
                        placeholder="votre_compte"
                        className="pl-8 rounded-xl h-12"
                        style={inputStyles}
                      />
                    </div>
                  </div>

                  {/* Website */}
                  <div className="space-y-2">
                    <Label htmlFor="website" className="flex items-center gap-2" style={{ color: STEALTH.text }}>
                      <Globe size={14} style={{ color: STEALTH.accent }} />
                      Site web
                    </Label>
                    <Input
                      id="website"
                      value={formData.website || ""}
                      onChange={(e) => handleChange("website", e.target.value)}
                      placeholder="www.votresite.com"
                      className="rounded-xl h-12"
                      style={inputStyles}
                    />
                  </div>

                  {/* Additional Links Toggle */}
                  <AnimatePresence>
                    {!showAdditionalLinks && (
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        type="button"
                        onClick={() => setShowAdditionalLinks(true)}
                        className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed transition-all"
                        style={{ 
                          borderColor: STEALTH.border,
                          color: STEALTH.textSecondary 
                        }}
                      >
                        <Plus size={16} />
                        <span className="text-sm">Ajouter un autre lien</span>
                      </motion.button>
                    )}
                  </AnimatePresence>

                  {/* Additional Links */}
                  <AnimatePresence>
                    {showAdditionalLinks && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4 pt-4 border-t"
                        style={{ borderColor: STEALTH.border }}
                      >
                        <p 
                          className="text-xs font-medium uppercase tracking-wide"
                          style={{ color: STEALTH.textMuted }}
                        >
                          Liens additionnels
                        </p>
                        {ADDITIONAL_LINKS.slice(0, 3).map((link) => (
                          <div key={link.id} className="space-y-2">
                            <Label className="flex items-center gap-2 text-sm" style={{ color: STEALTH.text }}>
                              <link.icon size={14} style={{ color: STEALTH.textMuted }} />
                              {link.label}
                            </Label>
                            <Input
                              value={additionalLinks[link.id] || ""}
                              onChange={(e) => setAdditionalLinks(prev => ({ ...prev, [link.id]: e.target.value }))}
                              placeholder={link.placeholder}
                              className="rounded-xl h-11"
                              style={inputStyles}
                            />
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Geolocation - Optional */}
              <div 
                className="rounded-3xl p-6"
                style={{ 
                  backgroundColor: STEALTH.bgCard,
                  border: `1px solid ${STEALTH.border}`
                }}
              >
                <div 
                  className="flex items-center gap-2 text-lg font-semibold mb-2"
                  style={{ color: STEALTH.text }}
                >
                  <MapPin size={20} style={{ color: STEALTH.accent }} />
                  Géolocalisation
                  {formData.latitude && (
                    <CheckCircle2 className="h-5 w-5 ml-auto" style={{ color: STEALTH.success }} />
                  )}
                </div>
                <p 
                  className="text-sm mb-4"
                  style={{ color: STEALTH.textSecondary }}
                >
                  Ajoutez votre position pour générer un lien Google Maps automatique
                </p>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => geolocation.getCurrentPosition()}
                  disabled={geolocation.isLoading}
                  className="w-full h-12 gap-2 border-2 border-dashed rounded-xl"
                  style={{ 
                    borderColor: STEALTH.borderActive,
                    backgroundColor: 'transparent',
                    color: STEALTH.text
                  }}
                >
                  {geolocation.isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" style={{ color: STEALTH.accent }} />
                      <span>Localisation en cours...</span>
                    </>
                  ) : (
                    <>
                      <Navigation className="h-5 w-5" style={{ color: STEALTH.accent }} />
                      <span>Utiliser ma position actuelle</span>
                    </>
                  )}
                </Button>

                {geolocation.error && (
                  <p className="text-xs mt-2" style={{ color: STEALTH.error }}>{geolocation.error}</p>
                )}

                {formData.googleMapsUrl && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 p-3 rounded-xl text-sm flex items-center gap-2"
                    style={{ 
                      backgroundColor: STEALTH.successBg,
                      color: STEALTH.success
                    }}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Position enregistrée
                  </motion.div>
                )}
              </div>

              {/* Concierge Note */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center px-4"
              >
                <p 
                  className="text-sm italic"
                  style={{ color: STEALTH.textMuted }}
                >
                  Nous utiliserons ces informations pour faciliter vos relances et vos stories 24h après chaque rencontre.
                </p>
              </motion.div>
            </motion.div>

                {/* Navigation */}
                <motion.div 
                  className="flex justify-between items-center mt-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button 
                    variant="ghost" 
                    onClick={prevStep}
                    disabled={state.isTransitioning}
                    className="gap-2"
                    style={{ color: STEALTH.textSecondary }}
                  >
                    <ArrowLeft size={18} />
                    Retour
                  </Button>
                  <LoadingButton
                    size="xl"
                    onClick={handleContinue}
                    disabled={!isValid || state.isTransitioning}
                    isLoading={isNavigating}
                    loadingText="Chargement..."
                    className="px-8 rounded-full font-semibold disabled:opacity-50"
                    style={{ 
                      backgroundColor: STEALTH.accent,
                      color: STEALTH.bg
                    }}
                  >
                    Continuer
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </LoadingButton>
                </motion.div>
              </div>

              {/* Right Column - Live Preview */}
              <div className="lg:col-span-2 hidden lg:block">
                <div className="sticky top-28">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {/* Preview Label */}
                    <p 
                      className="text-xs uppercase tracking-widest mb-4 text-center"
                      style={{ color: STEALTH.textMuted }}
                    >
                      Aperçu en temps réel
                    </p>

                    {/* Card Preview */}
                    <div 
                      className="rounded-3xl p-8 relative overflow-hidden"
                      style={{ 
                        backgroundColor: STEALTH.bgCard,
                        border: `1px solid ${STEALTH.border}`,
                        boxShadow: STEALTH.shadowCard
                      }}
                    >
                      {/* Subtle gradient overlay */}
                      <div 
                        className="absolute inset-0 opacity-30"
                        style={{
                          background: `radial-gradient(circle at top right, ${STEALTH.accent}15, transparent 60%)`
                        }}
                      />

                      {/* Content */}
                      <div className="relative z-10 text-center space-y-6">
                        {/* Avatar with photo */}
                        <div 
                          className="w-24 h-24 rounded-full mx-auto flex items-center justify-center text-3xl font-bold overflow-hidden"
                          style={{ 
                            backgroundColor: STEALTH.bgInput,
                            color: STEALTH.accent,
                            border: `2px solid ${STEALTH.border}`
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
                            <User size={32} style={{ color: STEALTH.textMuted }} />
                          )}
                        </div>

                        {/* Name */}
                        <div>
                          <h3 
                            className="text-2xl font-display font-bold"
                            style={{ color: STEALTH.text }}
                          >
                            {formData.firstName || formData.lastName 
                              ? `${formData.firstName} ${formData.lastName}`.trim()
                              : "Votre nom"
                            }
                          </h3>
                          
                          {/* Title & Company */}
                          {(formData.title || formData.company) && (
                            <p 
                              className="text-sm mt-1"
                              style={{ color: STEALTH.textSecondary }}
                            >
                              {formData.title}
                              {formData.title && formData.company && " · "}
                              {formData.company}
                            </p>
                          )}
                        </div>

                        {/* Tagline */}
                        {formData.tagline && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-sm italic px-4"
                            style={{ color: STEALTH.textMuted }}
                          >
                            "{formData.tagline}"
                          </motion.p>
                        )}

                        {/* Contact Icons Preview */}
                        <div className="flex justify-center gap-3 pt-2">
                          {formData.phone && (
                            <div 
                              className="w-10 h-10 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: STEALTH.bgInput }}
                            >
                              <Phone size={16} style={{ color: STEALTH.accent }} />
                            </div>
                          )}
                          {formData.email && (
                            <div 
                              className="w-10 h-10 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: STEALTH.bgInput }}
                            >
                              <Mail size={16} style={{ color: STEALTH.accent }} />
                            </div>
                          )}
                          {formData.whatsapp && (
                            <div 
                              className="w-10 h-10 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: STEALTH.bgInput }}
                            >
                              <MessageCircle size={16} style={{ color: STEALTH.accent }} />
                            </div>
                          )}
                          {formData.linkedin && (
                            <div 
                              className="w-10 h-10 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: STEALTH.bgInput }}
                            >
                              <Linkedin size={16} style={{ color: STEALTH.accent }} />
                            </div>
                          )}
                          {formData.instagram && (
                            <div 
                              className="w-10 h-10 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: STEALTH.bgInput }}
                            >
                              <Instagram size={16} style={{ color: STEALTH.accent }} />
                            </div>
                          )}
                        </div>

                        {/* Location if set */}
                        {formData.googleMapsUrl && (
                          <div 
                            className="flex items-center justify-center gap-2 text-xs"
                            style={{ color: STEALTH.success }}
                          >
                            <MapPin size={12} />
                            Position enregistrée
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Powered by badge */}
                    <p 
                      className="text-xs text-center mt-4"
                      style={{ color: STEALTH.textMuted }}
                    >
                      Powered by <span style={{ color: STEALTH.accent }}>IWASP</span>
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </PageTransition>

      <Footer />
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
