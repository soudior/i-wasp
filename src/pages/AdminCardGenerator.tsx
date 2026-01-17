/**
 * AdminCardGenerator - Générateur de Cartes Complet IWASP
 * Interface admin premium pour créer des cartes visuelles parfaites
 * 
 * Features:
 * - Wizard step-by-step intuitif
 * - Preview temps réel de la carte physique + digitale
 * - Upload logo/photo avec crop
 * - Tous les réseaux sociaux
 * - Génération automatique du slug
 * - Sauvegarde en base de données
 */

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AdminOmniaLayout } from "@/layouts/AdminOmniaLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  ArrowLeft, 
  ArrowRight, 
  Check,
  User,
  Camera,
  Palette,
  Share2,
  CreditCard,
  Loader2,
  Copy,
  ExternalLink,
  Plus,
  Trash2,
  Eye,
  Download,
  Sparkles,
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  MessageCircle,
  Instagram,
  Linkedin,
  Facebook,
  Twitter,
  Youtube,
  Music2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QRCodeSVG } from "qrcode.react";
import { downloadVCard } from "@/lib/vcard";

// OMNIA Design System Colors
const OMNIA = {
  obsidienne: "#030303",
  obsidienneElevated: "#0A0A0A",
  obsidienneSurface: "#111111",
  champagne: "#DCC7B0",
  champagneMuted: "rgba(220, 199, 176, 0.6)",
  ivoire: "#FDFCFB",
  ivoireMuted: "rgba(253, 252, 251, 0.5)",
  border: "rgba(220, 199, 176, 0.15)",
};

// Steps configuration
const STEPS = [
  { id: "identity", label: "Identité", icon: User },
  { id: "visual", label: "Visuels", icon: Camera },
  { id: "contact", label: "Contact", icon: Share2 },
  { id: "design", label: "Design", icon: Palette },
  { id: "complete", label: "Terminé", icon: Check },
];

// Templates
const TEMPLATES = [
  { id: "dark-luxury-business", name: "Dark Luxury", colors: { bg: "#0B0B0B", accent: "#FFC700", text: "#F5F5F5" } },
  { id: "iwasp-signature", name: "IWASP Signature", colors: { bg: "#FFFFFF", accent: "#1D1D1F", text: "#1D1D1F" } },
  { id: "boutique", name: "Boutique", colors: { bg: "#FAF9F6", accent: "#8B7355", text: "#2C2C2C" } },
  { id: "hotel-concierge", name: "Hôtellerie", colors: { bg: "#0D1B2A", accent: "#D4AF37", text: "#F0E6D3" } },
  { id: "default", name: "Minimal", colors: { bg: "#F5F5F7", accent: "#007AFF", text: "#1D1D1F" } },
];

// Social networks
const SOCIAL_NETWORKS = [
  { id: "instagram", name: "Instagram", icon: Instagram },
  { id: "facebook", name: "Facebook", icon: Facebook },
  { id: "linkedin", name: "LinkedIn", icon: Linkedin },
  { id: "twitter", name: "X/Twitter", icon: Twitter },
  { id: "youtube", name: "YouTube", icon: Youtube },
  { id: "tiktok", name: "TikTok", icon: Music2 },
];

interface CardData {
  // Identity
  businessName: string;
  firstName: string;
  lastName: string;
  title: string;
  tagline: string;
  // Contact
  email: string;
  phone: string;
  whatsapp: string;
  website: string;
  location: string;
  // Visual
  logoUrl: string;
  photoUrl: string;
  // Social
  socialLinks: Record<string, string>;
  // Design
  template: string;
}

const initialData: CardData = {
  businessName: "",
  firstName: "",
  lastName: "",
  title: "",
  tagline: "",
  email: "",
  phone: "",
  whatsapp: "",
  website: "",
  location: "",
  logoUrl: "",
  photoUrl: "",
  socialLinks: {},
  template: "dark-luxury-business",
};

export default function AdminCardGenerator() {
  return (
    <AdminOmniaLayout title="Générateur de Carte" subtitle="Création avancée">
      <CardGeneratorContent />
    </AdminOmniaLayout>
  );
}

function CardGeneratorContent() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<CardData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [createdCard, setCreatedCard] = useState<{ id: string; slug: string } | null>(null);

  // Existing cards query
  const { data: existingCards } = useQuery({
    queryKey: ["admin-cards"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("digital_cards")
        .select("id, first_name, last_name, company, slug, photo_url, template")
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const currentStepId = STEPS[currentStep]?.id;
  const selectedTemplate = TEMPLATES.find(t => t.id === formData.template) || TEMPLATES[0];

  // Step validation
  const stepValidation = useMemo(() => ({
    identity: Boolean(formData.businessName.trim() || (formData.firstName.trim() && formData.lastName.trim())),
    visual: true, // Optional
    contact: true, // Optional
    design: Boolean(formData.template),
    complete: true,
  }), [formData]);

  const canProceed = stepValidation[currentStepId as keyof typeof stepValidation] ?? false;

  const updateField = (field: keyof CardData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateSocial = (network: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [network]: value }
    }));
  };

  // Image upload
  const uploadImage = async (file: File, folder: string): Promise<string | null> => {
    if (!user) return null;
    
    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop() || "png";
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
      const filePath = `${user.id}/${folder}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("card-assets")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("card-assets")
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error: any) {
      toast.error("Erreur upload: " + error.message);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file, "logo");
    if (url) {
      updateField("logoUrl", url);
      toast.success("Logo uploadé ✓");
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file, "photo");
    if (url) {
      updateField("photoUrl", url);
      toast.success("Photo uploadée ✓");
    }
  };

  // Generate slug
  const generateSlug = () => {
    const base = formData.businessName || `${formData.firstName}-${formData.lastName}`;
    return base.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      + "-" + Date.now().toString(36);
  };

  // Save card
  const handleSave = async () => {
    if (!user) {
      toast.error("Non authentifié");
      return;
    }

    if (!formData.businessName && !formData.firstName) {
      toast.error("Nom requis");
      return;
    }

    setIsSubmitting(true);
    try {
      const slug = generateSlug();
      const socialLinksArray = Object.entries(formData.socialLinks)
        .filter(([_, url]) => url?.trim())
        .map(([platform, url]) => ({ platform, url }));

      const { data: card, error } = await supabase
        .from("digital_cards")
        .insert([{
          user_id: user.id,
          slug,
          first_name: formData.firstName || formData.businessName,
          last_name: formData.lastName || "",
          title: formData.title || null,
          company: formData.businessName || null,
          tagline: formData.tagline || null,
          email: formData.email || null,
          phone: formData.phone || null,
          whatsapp: formData.whatsapp || null,
          website: formData.website || null,
          location: formData.location || null,
          logo_url: formData.logoUrl || null,
          photo_url: formData.photoUrl || formData.logoUrl || null,
          instagram: formData.socialLinks.instagram || null,
          linkedin: formData.socialLinks.linkedin || null,
          twitter: formData.socialLinks.twitter || null,
          template: formData.template,
          social_links: socialLinksArray,
          is_active: true,
          nfc_enabled: true,
          wallet_enabled: true,
        }])
        .select()
        .single();

      if (error) throw error;

      setCreatedCard({ id: card.id, slug: card.slug });
      setCurrentStep(STEPS.length - 1);
      queryClient.invalidateQueries({ queryKey: ["admin-cards"] });
      toast.success("Carte créée avec succès ! ✓");
    } catch (error: any) {
      toast.error("Erreur: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentStepId === "design") {
      handleSave();
    } else if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const getCardUrl = () => {
    if (!createdCard) return "";
    return `${window.location.origin}/card/${createdCard.slug}`;
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(getCardUrl());
    toast.success("Lien copié ✓");
  };

  const resetForm = () => {
    setFormData(initialData);
    setCreatedCard(null);
    setCurrentStep(0);
  };

  return (
    <div className="min-h-dvh" style={{ backgroundColor: "#0B0B0B" }}>
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/admin/clients")}
            className="flex items-center gap-2 text-sm"
            style={{ color: "#8E8E93" }}
          >
            <ArrowLeft size={18} />
            Retour
          </button>
          
          <h1 className="text-lg font-semibold" style={{ color: "#F5F5F5" }}>
            Générateur de Carte
          </h1>
          
          <div className="w-16" />
        </div>

        {/* Progress */}
        <div className="max-w-6xl mx-auto px-4 pb-4">
          <div className="flex gap-2">
            {STEPS.map((step, index) => (
              <div
                key={step.id}
                className="flex-1 h-1 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: index <= currentStep ? "#FFC700" : "rgba(255,255,255,0.1)"
                }}
              />
            ))}
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs" style={{ color: "#8E8E93" }}>
              Étape {currentStep + 1}/{STEPS.length}
            </span>
            <span className="text-xs font-medium" style={{ color: "#F5F5F5" }}>
              {STEPS[currentStep]?.label}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 pb-32">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Area */}
          <div className="order-2 lg:order-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStepId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
              >
                {/* Step 1: Identity */}
                {currentStepId === "identity" && (
                  <Card style={{ backgroundColor: "#1A1A1A", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <CardContent className="p-6 space-y-5">
                      <div className="text-center mb-6">
                        <h2 className="text-xl font-semibold mb-1" style={{ color: "#F5F5F5" }}>
                          Identité
                        </h2>
                        <p className="text-sm" style={{ color: "#8E8E93" }}>
                          Informations principales de la carte
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label style={{ color: "#F5F5F5" }}>Nom de l'entreprise / Marque *</Label>
                          <Input
                            value={formData.businessName}
                            onChange={(e) => updateField("businessName", e.target.value)}
                            placeholder="Ex: Le Jardin Gourmand"
                            className="mt-1.5 rounded-xl"
                            style={{ backgroundColor: "#0B0B0B", borderColor: "rgba(255,255,255,0.15)", color: "#F5F5F5" }}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label style={{ color: "#F5F5F5" }}>Prénom</Label>
                            <Input
                              value={formData.firstName}
                              onChange={(e) => updateField("firstName", e.target.value)}
                              placeholder="Jean"
                              className="mt-1.5 rounded-xl"
                              style={{ backgroundColor: "#0B0B0B", borderColor: "rgba(255,255,255,0.15)", color: "#F5F5F5" }}
                            />
                          </div>
                          <div>
                            <Label style={{ color: "#F5F5F5" }}>Nom</Label>
                            <Input
                              value={formData.lastName}
                              onChange={(e) => updateField("lastName", e.target.value)}
                              placeholder="Dupont"
                              className="mt-1.5 rounded-xl"
                              style={{ backgroundColor: "#0B0B0B", borderColor: "rgba(255,255,255,0.15)", color: "#F5F5F5" }}
                            />
                          </div>
                        </div>

                        <div>
                          <Label style={{ color: "#F5F5F5" }}>Fonction / Titre</Label>
                          <Input
                            value={formData.title}
                            onChange={(e) => updateField("title", e.target.value)}
                            placeholder="Fondateur & Chef Exécutif"
                            className="mt-1.5 rounded-xl"
                            style={{ backgroundColor: "#0B0B0B", borderColor: "rgba(255,255,255,0.15)", color: "#F5F5F5" }}
                          />
                        </div>

                        <div>
                          <Label style={{ color: "#F5F5F5" }}>Slogan / Description</Label>
                          <Textarea
                            value={formData.tagline}
                            onChange={(e) => updateField("tagline", e.target.value)}
                            placeholder="Une cuisine d'exception, des produits locaux..."
                            rows={2}
                            className="mt-1.5 rounded-xl resize-none"
                            style={{ backgroundColor: "#0B0B0B", borderColor: "rgba(255,255,255,0.15)", color: "#F5F5F5" }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Step 2: Visual */}
                {currentStepId === "visual" && (
                  <Card style={{ backgroundColor: "#1A1A1A", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <CardContent className="p-6 space-y-5">
                      <div className="text-center mb-6">
                        <h2 className="text-xl font-semibold mb-1" style={{ color: "#F5F5F5" }}>
                          Visuels
                        </h2>
                        <p className="text-sm" style={{ color: "#8E8E93" }}>
                          Logo et photo de profil
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {/* Logo */}
                        <div>
                          <Label style={{ color: "#F5F5F5" }}>Logo</Label>
                          <label className="mt-2 block cursor-pointer">
                            <div 
                              className="aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all hover:border-[#FFC700]"
                              style={{ 
                                borderColor: formData.logoUrl ? "#FFC700" : "rgba(255,255,255,0.2)",
                                backgroundColor: "#0B0B0B"
                              }}
                            >
                              {formData.logoUrl ? (
                                <img 
                                  src={formData.logoUrl} 
                                  alt="Logo" 
                                  className="w-full h-full object-contain rounded-xl p-2"
                                />
                              ) : (
                                <>
                                  {isUploading ? (
                                    <Loader2 className="h-6 w-6 animate-spin" style={{ color: "#FFC700" }} />
                                  ) : (
                                    <>
                                      <Building2 className="h-6 w-6" style={{ color: "#8E8E93" }} />
                                      <span className="text-xs" style={{ color: "#8E8E93" }}>Ajouter logo</span>
                                    </>
                                  )}
                                </>
                              )}
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleLogoUpload}
                              className="hidden"
                            />
                          </label>
                        </div>

                        {/* Photo */}
                        <div>
                          <Label style={{ color: "#F5F5F5" }}>Photo</Label>
                          <label className="mt-2 block cursor-pointer">
                            <div 
                              className="aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all hover:border-[#FFC700]"
                              style={{ 
                                borderColor: formData.photoUrl ? "#FFC700" : "rgba(255,255,255,0.2)",
                                backgroundColor: "#0B0B0B"
                              }}
                            >
                              {formData.photoUrl ? (
                                <img 
                                  src={formData.photoUrl} 
                                  alt="Photo" 
                                  className="w-full h-full object-cover rounded-xl"
                                />
                              ) : (
                                <>
                                  {isUploading ? (
                                    <Loader2 className="h-6 w-6 animate-spin" style={{ color: "#FFC700" }} />
                                  ) : (
                                    <>
                                      <Camera className="h-6 w-6" style={{ color: "#8E8E93" }} />
                                      <span className="text-xs" style={{ color: "#8E8E93" }}>Ajouter photo</span>
                                    </>
                                  )}
                                </>
                              )}
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handlePhotoUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Step 3: Contact */}
                {currentStepId === "contact" && (
                  <Card style={{ backgroundColor: "#1A1A1A", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <CardContent className="p-6 space-y-5">
                      <div className="text-center mb-6">
                        <h2 className="text-xl font-semibold mb-1" style={{ color: "#F5F5F5" }}>
                          Contact & Réseaux
                        </h2>
                        <p className="text-sm" style={{ color: "#8E8E93" }}>
                          Moyens de contact et réseaux sociaux
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="flex items-center gap-2" style={{ color: "#F5F5F5" }}>
                              <Phone size={14} /> Téléphone
                            </Label>
                            <Input
                              value={formData.phone}
                              onChange={(e) => updateField("phone", e.target.value)}
                              placeholder="+33 6 00 00 00 00"
                              className="mt-1.5 rounded-xl"
                              style={{ backgroundColor: "#0B0B0B", borderColor: "rgba(255,255,255,0.15)", color: "#F5F5F5" }}
                            />
                          </div>
                          <div>
                            <Label className="flex items-center gap-2" style={{ color: "#F5F5F5" }}>
                              <MessageCircle size={14} /> WhatsApp
                            </Label>
                            <Input
                              value={formData.whatsapp}
                              onChange={(e) => updateField("whatsapp", e.target.value)}
                              placeholder="+33 6 00 00 00 00"
                              className="mt-1.5 rounded-xl"
                              style={{ backgroundColor: "#0B0B0B", borderColor: "rgba(255,255,255,0.15)", color: "#F5F5F5" }}
                            />
                          </div>
                        </div>

                        <div>
                          <Label className="flex items-center gap-2" style={{ color: "#F5F5F5" }}>
                            <Mail size={14} /> Email
                          </Label>
                          <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) => updateField("email", e.target.value)}
                            placeholder="contact@example.com"
                            className="mt-1.5 rounded-xl"
                            style={{ backgroundColor: "#0B0B0B", borderColor: "rgba(255,255,255,0.15)", color: "#F5F5F5" }}
                          />
                        </div>

                        <div>
                          <Label className="flex items-center gap-2" style={{ color: "#F5F5F5" }}>
                            <Globe size={14} /> Site web
                          </Label>
                          <Input
                            value={formData.website}
                            onChange={(e) => updateField("website", e.target.value)}
                            placeholder="https://example.com"
                            className="mt-1.5 rounded-xl"
                            style={{ backgroundColor: "#0B0B0B", borderColor: "rgba(255,255,255,0.15)", color: "#F5F5F5" }}
                          />
                        </div>

                        <div>
                          <Label className="flex items-center gap-2" style={{ color: "#F5F5F5" }}>
                            <MapPin size={14} /> Adresse / Ville
                          </Label>
                          <Input
                            value={formData.location}
                            onChange={(e) => updateField("location", e.target.value)}
                            placeholder="Paris, France"
                            className="mt-1.5 rounded-xl"
                            style={{ backgroundColor: "#0B0B0B", borderColor: "rgba(255,255,255,0.15)", color: "#F5F5F5" }}
                          />
                        </div>

                        {/* Social Networks */}
                        <div className="pt-4 border-t" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                          <Label className="mb-3 block" style={{ color: "#F5F5F5" }}>
                            Réseaux sociaux
                          </Label>
                          <div className="space-y-3">
                            {SOCIAL_NETWORKS.map((network) => (
                              <div key={network.id} className="flex items-center gap-3">
                                <network.icon size={18} style={{ color: "#8E8E93" }} />
                                <Input
                                  value={formData.socialLinks[network.id] || ""}
                                  onChange={(e) => updateSocial(network.id, e.target.value)}
                                  placeholder={`Lien ${network.name}`}
                                  className="flex-1 rounded-xl"
                                  style={{ backgroundColor: "#0B0B0B", borderColor: "rgba(255,255,255,0.15)", color: "#F5F5F5" }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Step 4: Design */}
                {currentStepId === "design" && (
                  <Card style={{ backgroundColor: "#1A1A1A", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <CardContent className="p-6 space-y-5">
                      <div className="text-center mb-6">
                        <h2 className="text-xl font-semibold mb-1" style={{ color: "#F5F5F5" }}>
                          Template
                        </h2>
                        <p className="text-sm" style={{ color: "#8E8E93" }}>
                          Choisissez le design de la carte
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {TEMPLATES.map((template) => (
                          <button
                            key={template.id}
                            onClick={() => updateField("template", template.id)}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${
                              formData.template === template.id 
                                ? "border-[#FFC700]" 
                                : "border-transparent hover:border-white/20"
                            }`}
                            style={{ backgroundColor: template.colors.bg }}
                          >
                            <div 
                              className="text-sm font-medium mb-1"
                              style={{ color: template.colors.text }}
                            >
                              {template.name}
                            </div>
                            <div 
                              className="w-full h-1 rounded-full"
                              style={{ backgroundColor: template.colors.accent }}
                            />
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Step 5: Complete */}
                {currentStepId === "complete" && createdCard && (
                  <Card style={{ backgroundColor: "#1A1A1A", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <CardContent className="p-6 space-y-6">
                      <div className="text-center">
                        <div 
                          className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                          style={{ backgroundColor: "rgba(34, 197, 94, 0.2)" }}
                        >
                          <Check className="h-8 w-8" style={{ color: "#22C55E" }} />
                        </div>
                        <h2 className="text-xl font-semibold mb-1" style={{ color: "#F5F5F5" }}>
                          Carte créée ! 🎉
                        </h2>
                        <p className="text-sm" style={{ color: "#8E8E93" }}>
                          Votre carte digitale est maintenant active
                        </p>
                      </div>

                      {/* QR Code */}
                      <div className="flex justify-center">
                        <div className="p-4 rounded-2xl" style={{ backgroundColor: "#FFFFFF" }}>
                          <QRCodeSVG 
                            value={getCardUrl()} 
                            size={150}
                            level="H"
                          />
                        </div>
                      </div>

                      {/* URL */}
                      <div 
                        className="p-4 rounded-xl flex items-center gap-3"
                        style={{ backgroundColor: "#0B0B0B" }}
                      >
                        <input
                          readOnly
                          value={getCardUrl()}
                          className="flex-1 bg-transparent text-sm truncate"
                          style={{ color: "#F5F5F5" }}
                        />
                        <button
                          onClick={copyLink}
                          className="p-2 rounded-lg transition-colors hover:bg-white/10"
                        >
                          <Copy size={18} style={{ color: "#FFC700" }} />
                        </button>
                        <a
                          href={getCardUrl()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg transition-colors hover:bg-white/10"
                        >
                          <ExternalLink size={18} style={{ color: "#FFC700" }} />
                        </a>
                      </div>

                      {/* Actions */}
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          onClick={resetForm}
                          variant="outline"
                          className="rounded-xl"
                          style={{ borderColor: "rgba(255,255,255,0.2)", color: "#F5F5F5" }}
                        >
                          <Plus size={16} className="mr-2" />
                          Nouvelle carte
                        </Button>
                        <Button
                          onClick={() => navigate("/admin/clients")}
                          className="rounded-xl"
                          style={{ backgroundColor: "#FFC700", color: "#0B0B0B" }}
                        >
                          Voir toutes
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Preview Area */}
          <div className="order-1 lg:order-2 lg:sticky lg:top-32">
            <Card 
              className="overflow-hidden"
              style={{ 
                backgroundColor: selectedTemplate.colors.bg,
                border: "1px solid rgba(255,255,255,0.1)" 
              }}
            >
              <CardContent className="p-6">
                {/* Preview Header */}
                <div className="text-center mb-4">
                  <Badge 
                    variant="secondary"
                    className="text-xs"
                    style={{ backgroundColor: "rgba(255,255,255,0.1)", color: selectedTemplate.colors.text }}
                  >
                    <Eye size={12} className="mr-1" />
                    Aperçu temps réel
                  </Badge>
                </div>

                {/* Card Preview */}
                <div className="space-y-4">
                  {/* Photo/Logo */}
                  <div className="flex justify-center">
                    {formData.photoUrl || formData.logoUrl ? (
                      <img
                        src={formData.photoUrl || formData.logoUrl}
                        alt="Preview"
                        className="w-24 h-24 rounded-2xl object-cover"
                        style={{ border: `2px solid ${selectedTemplate.colors.accent}` }}
                      />
                    ) : (
                      <div 
                        className="w-24 h-24 rounded-2xl flex items-center justify-center"
                        style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                      >
                        <User size={32} style={{ color: selectedTemplate.colors.accent }} />
                      </div>
                    )}
                  </div>

                  {/* Name */}
                  <div className="text-center">
                    <h3 
                      className="text-xl font-bold"
                      style={{ color: selectedTemplate.colors.text }}
                    >
                      {formData.businessName || formData.firstName 
                        ? `${formData.firstName} ${formData.lastName}`.trim() || formData.businessName
                        : "Nom"}
                    </h3>
                    {formData.title && (
                      <p 
                        className="text-sm mt-1"
                        style={{ color: selectedTemplate.colors.accent }}
                      >
                        {formData.title}
                      </p>
                    )}
                    {formData.businessName && formData.firstName && (
                      <p 
                        className="text-xs mt-1 opacity-70"
                        style={{ color: selectedTemplate.colors.text }}
                      >
                        {formData.businessName}
                      </p>
                    )}
                  </div>

                  {/* Actions Preview */}
                  <div className="flex justify-center gap-3 pt-2">
                    {formData.phone && (
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: selectedTemplate.colors.accent }}
                      >
                        <Phone size={16} style={{ color: selectedTemplate.colors.bg }} />
                      </div>
                    )}
                    {formData.email && (
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: selectedTemplate.colors.accent }}
                      >
                        <Mail size={16} style={{ color: selectedTemplate.colors.bg }} />
                      </div>
                    )}
                    {formData.whatsapp && (
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: selectedTemplate.colors.accent }}
                      >
                        <MessageCircle size={16} style={{ color: selectedTemplate.colors.bg }} />
                      </div>
                    )}
                    {formData.website && (
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: selectedTemplate.colors.accent }}
                      >
                        <Globe size={16} style={{ color: selectedTemplate.colors.bg }} />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Cards */}
            {existingCards && existingCards.length > 0 && currentStepId !== "complete" && (
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-3" style={{ color: "#8E8E93" }}>
                  Cartes récentes
                </h4>
                <div className="space-y-2">
                  {existingCards.slice(0, 3).map((card) => (
                    <a
                      key={card.id}
                      href={`/card/${card.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-white/5"
                      style={{ backgroundColor: "rgba(255,255,255,0.02)" }}
                    >
                      {card.photo_url ? (
                        <img 
                          src={card.photo_url} 
                          alt="" 
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                        >
                          <User size={16} style={{ color: "#8E8E93" }} />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: "#F5F5F5" }}>
                          {card.first_name} {card.last_name}
                        </p>
                        <p className="text-xs truncate" style={{ color: "#8E8E93" }}>
                          {card.company || card.slug}
                        </p>
                      </div>
                      <ExternalLink size={14} style={{ color: "#8E8E93" }} />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Sticky Footer */}
      {currentStepId !== "complete" && (
        <div 
          className="fixed bottom-0 left-0 right-0 z-40 backdrop-blur-xl border-t"
          style={{ backgroundColor: "rgba(11, 11, 11, 0.95)", borderColor: "rgba(255,255,255,0.1)" }}
        >
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
            {currentStep > 0 && (
              <button
                onClick={handleBack}
                className="w-12 h-12 rounded-full border flex items-center justify-center transition-colors hover:bg-white/5"
                style={{ borderColor: "rgba(255,255,255,0.2)" }}
              >
                <ArrowLeft size={20} style={{ color: "#F5F5F5" }} />
              </button>
            )}

            <button
              onClick={handleNext}
              disabled={!canProceed || isSubmitting}
              className={`flex-1 h-14 rounded-full font-medium text-base transition-all flex items-center justify-center gap-2 ${
                canProceed ? "" : "opacity-50 cursor-not-allowed"
              }`}
              style={{ backgroundColor: "#FFC700", color: "#0B0B0B" }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Création...</span>
                </>
              ) : currentStepId === "design" ? (
                <>
                  <Sparkles size={20} />
                  <span>Créer la carte</span>
                </>
              ) : (
                <>
                  <span>Continuer</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
