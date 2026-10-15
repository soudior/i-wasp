/**
 * Step 2: Identité digitale
 * /order/identite
 * 
 * Style: Haute Couture Digitale — Noir, minimaliste
 */

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useOrderFunnel, DigitalIdentity, OrderFunnelGuard } from "@/contexts/OrderFunnelContext";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useAuth } from "@/contexts/AuthContext";
import { useAccountOperation } from "@/hooks/useAccountOperation";
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
import { EMPTY_IDENTITY, identityErrors, normalizeIdentity } from "@/lib/orderIdentity";

async function uploadPhotoToStorage(dataUrl: string, ownerId: string | undefined, isCurrent: () => boolean): Promise<string> {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (!isCurrent()) throw new Error("Opération interrompue.");
  if (authError || !user || !ownerId || user.id !== ownerId)
    throw new Error("Connectez-vous pour transférer la photo, ou retirez-la pour continuer. Votre saisie est conservée.");

  const blob = await (await fetch(dataUrl)).blob();
  if (!isCurrent()) throw new Error("Opération interrompue.");
  const extension = blob.type === "image/png" ? "png" : blob.type === "image/webp" ? "webp" : "jpg";
  // The existing storage policy requires the authenticated owner as first folder.
  const path = `${ownerId}/photos/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from("card-assets").upload(path, blob, {
    cacheControl: "3600", upsert: false, contentType: blob.type,
  });
  if (!isCurrent()) throw new Error("Opération interrompue.");
  if (error) throw new Error("Échec de l’upload. Réessayez ou retirez la photo. Votre saisie est conservée.");
  return supabase.storage.from("card-assets").getPublicUrl(path).data.publicUrl;
}

function OrderIdentiteContent() {
  const { state, setDigitalIdentity, setIdentityDraft, storageWarning, nextStep, prevStep } = useOrderFunnel();
  const { user } = useAuth();
  const { start, isLocked, isBusy: isNavigating, accountEpoch } = useAccountOperation(user?.id);
  const [mobileView, setMobileView] = useState<"form" | "preview">("form");

  const [formData, setFormData] = useState<DigitalIdentity>(() => ({
    ...EMPTY_IDENTITY,
    ...(state.identityDraft || state.digitalIdentity),
    tagline: (state.identityDraft || state.digitalIdentity)?.tagline ?? (state.identityDraft || state.digitalIdentity)?.bio ?? "",
  }));
  const draftRef = useRef(formData);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  useEffect(() => { setIsUploadingPhoto(false); }, [user?.id, accountEpoch]);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleGeoSuccess = useCallback((geoData: { latitude: number | null; longitude: number | null }) => {
    const lat = geoData.latitude;
    const lng = geoData.longitude;
    if (lat === null || lng === null) return;
    const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
    
    if (isLocked() || !mounted.current) return;
    const next = { ...draftRef.current, latitude: lat, longitude: lng, googleMapsUrl: mapsUrl, profileVisibilityConfirmed: false };
    draftRef.current = next;
    setFormData(next);
    setIdentityDraft(next);
    toast.success("Position enregistrée");
  }, [isLocked, setIdentityDraft]);

  const geolocation = useGeolocation({
    enableHighAccuracy: true,
    timeout: 15000,
    onSuccess: handleGeoSuccess,
  });

  const errors = useMemo(() => {
    const found = identityErrors(formData);
    if (formData.profileVisibilityConfirmed !== true)
      found.profileVisibilityConfirmed = "Confirmez les informations que vous souhaitez rendre publiques.";
    return found;
  }, [formData]);

  const isValid = Object.keys(errors).length === 0;

  const handleChange = useCallback((field: keyof DigitalIdentity, value: string | number | boolean | undefined) => {
    if (isLocked()) return;
    const next = {
      ...draftRef.current,
      [field]: value,
      profileVisibilityConfirmed: field === "profileVisibilityConfirmed" ? value === true : false,
    };
    draftRef.current = next;
    setFormData(next);
    setIdentityDraft(next);
  }, [isLocked, setIdentityDraft]);

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handlePhotoUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || isLocked()) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner une image");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'image doit faire moins de 5 Mo");
      return;
    }

    const operation = start();
    if (!operation) return;
    setIsUploadingPhoto(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      if (!operation.isCurrent()) return;
      const dataUrl = e.target?.result as string;
      // Release the synchronous read lock before applying the new draft.
      // No asynchronous boundary separates the generation check and mutation.
      operation.finish();
      handleChange("photoUrl", dataUrl);
      setIsUploadingPhoto(false);
      toast.success("Photo ajoutée");
    };
    const failRead = () => {
      if (!operation.isCurrent()) return;
      operation.finish();
      if (photoInputRef.current) photoInputRef.current.value = "";
      toast.error("Erreur lors du chargement. Vous pouvez réessayer.");
      setIsUploadingPhoto(false);
    };
    reader.onerror = failRead;
    reader.onabort = failRead;
    try { reader.readAsDataURL(file); } catch { failRead(); }
  }, [handleChange, isLocked, start]);

  const handleRemovePhoto = useCallback(() => {
    handleChange("photoUrl", "");
    if (photoInputRef.current) {
      photoInputRef.current.value = "";
    }
  }, [handleChange]);

  const handleContinue = async () => {
    if (isLocked() || isUploadingPhoto || state.isTransitioning) return;
    const currentDraft = draftRef.current;
    const currentErrors = identityErrors(currentDraft);
    if (currentDraft.profileVisibilityConfirmed !== true)
      currentErrors.profileVisibilityConfirmed = "Confirmez les informations que vous souhaitez rendre publiques.";
    if (Object.keys(currentErrors).length) {
      setTouched(Object.fromEntries(Object.keys(currentErrors).map(key => [key, true])));
      setMobileView("form");
      toast.error("Veuillez vérifier les informations publiques et confirmer votre choix.");
      requestAnimationFrame(() => document.getElementById(`profile-${Object.keys(currentErrors)[0]}`)?.focus());
      return;
    }

    const operation = start();
    if (!operation) return;
    try {
      const normalizedData = normalizeIdentity(currentDraft);
      if (normalizedData.photoUrl?.startsWith("data:")) {
        normalizedData.photoUrl = await uploadPhotoToStorage(normalizedData.photoUrl, user?.id, operation.isCurrent);
        if (!operation.isCurrent()) return;
      }
      if (!operation.isCurrent()) return;
      draftRef.current = normalizedData;
      setFormData(normalizedData);
      setDigitalIdentity(normalizedData);
      await nextStep();
    } catch (error) {
      if (operation.isCurrent()) toast.error(error instanceof Error ? error.message : "Impossible de continuer. Votre saisie est conservée.");
    } finally {
      operation.finish();
    }
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
            disabled={isNavigating}
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
              Ces informations apparaîtront sur votre profil public i‑wasp. Ajoutez uniquement les coordonnées que vous souhaitez partager.
            </p>
          </motion.div>

          {/* Two column layout */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form */}
            <fieldset disabled={isNavigating} className={mobileView === "preview" ? "hidden lg:block" : ""}>
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
                    <Label htmlFor="profile-firstName" className="text-[11px] uppercase tracking-[0.1em]" style={{ color: COUTURE.textMuted }}>
                      Prénom *
                    </Label>
                    <Input
                      id="profile-firstName" aria-invalid={Boolean(touched.firstName && errors.firstName)} aria-describedby={touched.firstName && errors.firstName ? "profile-firstName-error" : undefined}
                      value={formData.firstName}
                      onChange={(e) => handleChange("firstName", e.target.value)}
                      onBlur={() => handleBlur("firstName")}
                      placeholder="Votre prénom"
                      className="rounded-none border-0 border-b bg-transparent focus:ring-0"
                      style={inputStyles}
                    />
                    {touched.firstName && errors.firstName && (
                      <p id="profile-firstName-error" className="text-[10px]" style={{ color: "#8B4049" }}>{errors.firstName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profile-lastName" className="text-[11px] uppercase tracking-[0.1em]" style={{ color: COUTURE.textMuted }}>
                      Nom *
                    </Label>
                    <Input
                      id="profile-lastName" aria-invalid={Boolean(touched.lastName && errors.lastName)} aria-describedby={touched.lastName && errors.lastName ? "profile-lastName-error" : undefined}
                      value={formData.lastName}
                      onChange={(e) => handleChange("lastName", e.target.value)}
                      onBlur={() => handleBlur("lastName")}
                      placeholder="Votre nom"
                      className="rounded-none border-0 border-b bg-transparent focus:ring-0"
                      style={inputStyles}
                    />
                    {touched.lastName && errors.lastName && (
                      <p id="profile-lastName-error" className="text-[10px]" style={{ color: "#8B4049" }}>{errors.lastName}</p>
                    )}
                  </div>
                </div>

                {/* Title & Company */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="profile-title" className="text-[11px] uppercase tracking-[0.1em]" style={{ color: COUTURE.textMuted }}>
                      Titre
                    </Label>
                    <Input
                      id="profile-title" aria-invalid={Boolean(touched.title && errors.title)} aria-describedby={touched.title && errors.title ? "profile-title-error" : undefined}
                      value={formData.title || ""}
                      onChange={(e) => handleChange("title", e.target.value)}
                      placeholder="CEO, Consultant..."
                      className="rounded-none border-0 border-b bg-transparent focus:ring-0"
                      style={inputStyles}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profile-company" className="text-[11px] uppercase tracking-[0.1em]" style={{ color: COUTURE.textMuted }}>
                      Entreprise
                    </Label>
                    <Input
                      id="profile-company" aria-invalid={Boolean(touched.company && errors.company)} aria-describedby={touched.company && errors.company ? "profile-company-error" : undefined}
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
                    <Label htmlFor="profile-email" className="text-[11px] uppercase tracking-[0.1em] flex items-center gap-2" style={{ color: COUTURE.textMuted }}>
                      <Mail className="w-3 h-3" /> Email public (facultatif)
                    </Label>
                    <Input
                      type="email"
                      id="profile-email" aria-invalid={Boolean(touched.email && errors.email)} aria-describedby={touched.email && errors.email ? "profile-email-error" : undefined}
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      onBlur={() => handleBlur("email")}
                      placeholder="vous@email.com"
                      className="rounded-none border-0 border-b bg-transparent focus:ring-0"
                      style={inputStyles}
                    />
                    {touched.email && errors.email && (
                      <p id="profile-email-error" className="text-[10px]" style={{ color: "#8B4049" }}>{errors.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profile-phone" className="text-[11px] uppercase tracking-[0.1em] flex items-center gap-2" style={{ color: COUTURE.textMuted }}>
                      <Phone className="w-3 h-3" /> Téléphone public (facultatif)
                    </Label>
                    <Input
                      type="tel"
                      id="profile-phone" aria-invalid={Boolean(touched.phone && errors.phone)} aria-describedby={touched.phone && errors.phone ? "profile-phone-error" : undefined}
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      onBlur={() => handleBlur("phone")}
                      placeholder="+212 6 00 00 00 00"
                      className="rounded-none border-0 border-b bg-transparent focus:ring-0"
                      style={inputStyles}
                    />
                    <p className="text-[10px] leading-relaxed" style={{ color: COUTURE.textMuted }}>
                      Si renseigné, ce numéro sera public. Le téléphone de livraison sera demandé séparément.
                    </p>
                    {touched.phone && errors.phone && (
                      <p id="profile-phone-error" className="text-[10px]" style={{ color: "#8B4049" }}>{errors.phone}</p>
                    )}
                  </div>
                </div>

                {/* Social */}
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="profile-whatsapp" className="text-[11px] uppercase tracking-[0.1em] flex items-center gap-2" style={{ color: COUTURE.textMuted }}>
                      <MessageCircle className="w-3 h-3" /> WhatsApp
                    </Label>
                    <Input
                      id="profile-whatsapp" aria-invalid={Boolean(touched.whatsapp && errors.whatsapp)} aria-describedby={touched.whatsapp && errors.whatsapp ? "profile-whatsapp-error" : undefined}
                      value={formData.whatsapp || ""}
                      onChange={(e) => handleChange("whatsapp", e.target.value)}
                      placeholder="+212 6 00 00 00 00"
                      className="rounded-none border-0 border-b bg-transparent focus:ring-0"
                      style={inputStyles}
                    />
                    {touched.whatsapp && errors.whatsapp && (
                      <p id="profile-whatsapp-error" className="text-[10px]" style={{ color: "#8B4049" }}>{errors.whatsapp}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profile-instagram" className="text-[11px] uppercase tracking-[0.1em] flex items-center gap-2" style={{ color: COUTURE.textMuted }}>
                      <Instagram className="w-3 h-3" /> Instagram
                    </Label>
                    <Input
                      id="profile-instagram" aria-invalid={Boolean(touched.instagram && errors.instagram)} aria-describedby={touched.instagram && errors.instagram ? "profile-instagram-error" : undefined}
                      value={formData.instagram || ""}
                      onChange={(e) => handleChange("instagram", e.target.value)}
                      placeholder="@votre_compte"
                      className="rounded-none border-0 border-b bg-transparent focus:ring-0"
                      style={inputStyles}
                    />
                    {touched.instagram && errors.instagram && (
                      <p id="profile-instagram-error" className="text-[10px]" style={{ color: "#8B4049" }}>{errors.instagram}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profile-linkedin" className="text-[11px] uppercase tracking-[0.1em] flex items-center gap-2" style={{ color: COUTURE.textMuted }}>
                      <Linkedin className="w-3 h-3" /> LinkedIn
                    </Label>
                    <Input
                      id="profile-linkedin" aria-invalid={Boolean(touched.linkedin && errors.linkedin)} aria-describedby={touched.linkedin && errors.linkedin ? "profile-linkedin-error" : undefined}
                      value={formData.linkedin || ""}
                      onChange={(e) => handleChange("linkedin", e.target.value)}
                      placeholder="linkedin.com/in/vous"
                      className="rounded-none border-0 border-b bg-transparent focus:ring-0"
                      style={inputStyles}
                    />
                    {touched.linkedin && errors.linkedin && (
                      <p id="profile-linkedin-error" className="text-[10px]" style={{ color: "#8B4049" }}>{errors.linkedin}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profile-website" className="text-[11px] uppercase tracking-[0.1em] flex items-center gap-2" style={{ color: COUTURE.textMuted }}>
                      <Globe className="w-3 h-3" /> Site web
                    </Label>
                    <Input
                      id="profile-website" aria-invalid={Boolean(touched.website && errors.website)} aria-describedby={touched.website && errors.website ? "profile-website-error" : undefined}
                      value={formData.website || ""}
                      onChange={(e) => handleChange("website", e.target.value)}
                      placeholder="https://votresite.com"
                      className="rounded-none border-0 border-b bg-transparent focus:ring-0"
                      style={inputStyles}
                    />
                    {touched.website && errors.website && (
                      <p id="profile-website-error" className="text-[10px]" style={{ color: "#8B4049" }}>{errors.website}</p>
                    )}
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-2 pt-4">
                  <Label htmlFor="profile-tagline" className="text-[11px] uppercase tracking-[0.1em]" style={{ color: COUTURE.textMuted }}>
                    Tagline
                  </Label>
                  <Textarea
                    id="profile-tagline" aria-invalid={Boolean(touched.tagline && errors.tagline)} aria-describedby={touched.tagline && errors.tagline ? "profile-tagline-error" : undefined}
                      value={formData.tagline || ""}
                    onChange={(e) => handleChange("tagline", e.target.value.slice(0, 80))}
                    placeholder="Votre signature en une phrase..."
                    rows={2}
                    className="rounded-none border bg-transparent focus:ring-0 resize-none"
                    style={inputStyles}
                  />
                    {touched.tagline && errors.tagline && (
                      <p id="profile-tagline-error" className="text-[10px]" style={{ color: "#8B4049" }}>{errors.tagline}</p>
                    )}
                  <p className="text-[10px] text-right" style={{ color: COUTURE.textMuted }}>
                    {(formData.tagline || "").length}/80
                  </p>
                </div>
              </motion.div>
            </fieldset>

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
          <section className="mx-auto mt-8 max-w-xl space-y-3" style={{ color: COUTURE.silk }} aria-label="Visibilité du profil">
            <p className="text-sm">Ces champs servent au profil public. L’email du compte et les coordonnées de livraison ne sont pas ajoutés automatiquement.</p>
            <label className="flex gap-3 text-sm items-start" htmlFor="profile-profileVisibilityConfirmed">
              <input id="profile-profileVisibilityConfirmed" type="checkbox" className="mt-1 w-5 h-5"
                checked={formData.profileVisibilityConfirmed === true} disabled={isNavigating || isUploadingPhoto}
                aria-invalid={Boolean(touched.profileVisibilityConfirmed && errors.profileVisibilityConfirmed)}
                aria-describedby={touched.profileVisibilityConfirmed && errors.profileVisibilityConfirmed ? "profile-profileVisibilityConfirmed-error" : undefined}
                onChange={e => handleChange("profileVisibilityConfirmed", e.target.checked)} />
              Je confirme que les informations et la photo renseignées ci-dessus seront publiques sur ma carte.
            </label>
            {touched.profileVisibilityConfirmed && errors.profileVisibilityConfirmed && (
              <p id="profile-profileVisibilityConfirmed-error" role="alert" className="text-sm" style={{ color: COUTURE.gold }}>{errors.profileVisibilityConfirmed}</p>
            )}
            {storageWarning && <p role="alert" className="text-sm">Le navigateur ne peut pas conserver ce brouillon après rechargement. Gardez cette page ouverte.</p>}
          </section>
          <p className="mx-auto mt-10 max-w-xl text-center text-[10px] leading-relaxed" style={{ color: COUTURE.textMuted }}>
            En continuant, vous confirmez que les informations fournies sont exactes. Consultez notre{" "}
            <Link to="/privacy" className="underline underline-offset-4" style={{ color: COUTURE.gold }}>
              politique de confidentialité
            </Link>{" "}
            et nos{" "}
            <Link to="/cgv" className="underline underline-offset-4" style={{ color: COUTURE.gold }}>
              conditions générales de vente
            </Link>.
          </p>
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
            disabled={isNavigating || isUploadingPhoto || state.isTransitioning}
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
