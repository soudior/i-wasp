/**
 * Admin Instant Card Creator - FULL VERSION
 * All social networks, image gallery, complete options
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminOmniaLayout } from "@/layouts/AdminOmniaLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Zap, 
  MapPin, 
  Loader2,
  ArrowLeft,
  ExternalLink,
  Share2,
  Copy,
  Globe,
  Instagram,
  Phone,
  MessageCircle,
  Palette,
  Type,
  Layout,
  Check,
  Mail,
  Linkedin,
  Twitter,
  Facebook,
  Youtube,
  Camera,
  Image,
  X,
  Plus,
  Music2,
  Video,
  Calendar,
  Star,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import { StoryEditor } from "@/components/StoryEditor";
import { useStories } from "@/hooks/useStories";

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
// Template options
const TEMPLATES = [
  {
    id: "dark-luxury-business",
    name: "Dark Luxury",
    description: "Fond sombre, accents dorés",
    preview: { bg: "#0B0B0B", accent: "#FFC700", text: "#F5F5F5" }
  },
  {
    id: "iwasp-signature",
    name: "i-Wasp Signature",
    description: "Blanc épuré, premium",
    preview: { bg: "#FFFFFF", accent: "#000000", text: "#1D1D1F" }
  },
  {
    id: "boutique",
    name: "Boutique",
    description: "Élégant, tons neutres",
    preview: { bg: "#FAF9F6", accent: "#8B7355", text: "#2C2C2C" }
  },
  {
    id: "restaurant",
    name: "Restaurant",
    description: "Chaleureux, accueillant",
    preview: { bg: "#1A1A1A", accent: "#E8B86D", text: "#FFFFFF" }
  },
  {
    id: "hotel-concierge",
    name: "Hôtellerie",
    description: "Luxe, service premium",
    preview: { bg: "#0D1B2A", accent: "#D4AF37", text: "#F0E6D3" }
  },
  {
    id: "default",
    name: "Minimal",
    description: "Simple et efficace",
    preview: { bg: "#FAFAFA", accent: "#007AFF", text: "#000000" }
  }
];

// Color presets
const COLOR_PRESETS = [
  { name: "Or", primary: "#FFC700", secondary: "#0B0B0B" },
  { name: "Bleu", primary: "#007AFF", secondary: "#FFFFFF" },
  { name: "Émeraude", primary: "#10B981", secondary: "#0F172A" },
  { name: "Rose", primary: "#EC4899", secondary: "#1F1F1F" },
  { name: "Orange", primary: "#F97316", secondary: "#18181B" },
  { name: "Violet", primary: "#8B5CF6", secondary: "#0C0A1D" }
];

// Font options
const FONT_OPTIONS = [
  { id: "inter", name: "Inter", style: "font-sans" },
  { id: "playfair", name: "Playfair", style: "font-serif" },
  { id: "mono", name: "Mono", style: "font-mono" }
];

// All social networks - Complete list
const SOCIAL_NETWORKS = [
  { id: "instagram", name: "Instagram", icon: Instagram, placeholder: "@username ou lien complet" },
  { id: "facebook", name: "Facebook", icon: Facebook, placeholder: "Lien page ou profil" },
  { id: "linkedin", name: "LinkedIn", icon: Linkedin, placeholder: "Lien profil LinkedIn" },
  { id: "twitter", name: "Twitter/X", icon: Twitter, placeholder: "@username ou lien" },
  { id: "youtube", name: "YouTube", icon: Youtube, placeholder: "Lien chaîne YouTube" },
  { id: "tiktok", name: "TikTok", icon: Music2, placeholder: "@username ou lien" },
  { id: "snapchat", name: "Snapchat", icon: Video, placeholder: "Username Snapchat" },
  { id: "threads", name: "Threads", icon: MessageCircle, placeholder: "@username Threads" },
  { id: "telegram", name: "Telegram", icon: MessageCircle, placeholder: "@username ou t.me/..." },
  { id: "pinterest", name: "Pinterest", icon: Image, placeholder: "Lien profil Pinterest" },
  { id: "spotify", name: "Spotify", icon: Music2, placeholder: "Lien artiste/playlist" },
  { id: "tripadvisor", name: "TripAdvisor", icon: Star, placeholder: "Lien établissement" },
];

interface BusinessCardData {
  businessName: string;
  category: string;
  description: string;
  email: string;
  website: string;
  phone: string;
  whatsapp: string;
  location: string;
  coordinates: { lat: number; lng: number } | null;
  googleReviewsUrl: string;
  bookingUrl: string;
  logoUrl: string;
  photoUrl: string;
  galleryUrls: string[];
  socialLinks: { [key: string]: string };
  template: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
}

const initialData: BusinessCardData = {
  businessName: "",
  category: "",
  description: "",
  email: "",
  website: "",
  phone: "",
  whatsapp: "",
  location: "",
  coordinates: null,
  googleReviewsUrl: "",
  bookingUrl: "",
  logoUrl: "",
  photoUrl: "",
  galleryUrls: [],
  socialLinks: {},
  template: "dark-luxury-business",
  primaryColor: "#FFC700",
  secondaryColor: "#0B0B0B",
  fontFamily: "inter"
};

export default function AdminInstantCard() {
  return (
    <AdminOmniaLayout title="Création vCard Express" subtitle="Carte digitale">
      <AdminInstantCardContent />
    </AdminOmniaLayout>
  );
}

function AdminInstantCardContent() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState<BusinessCardData>(initialData);
  const [isCreating, setIsCreating] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [createdCard, setCreatedCard] = useState<{ id: string; slug: string } | null>(null);
  const [activeSection, setActiveSection] = useState<"info" | "social" | "media" | "story" | "design">("info");
  const [stories, setStories] = useState<any[]>([]);

  const handleInputChange = (field: keyof BusinessCardData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (network: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [network]: value }
    }));
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setFormData(prev => ({
        ...prev,
        template: templateId,
        primaryColor: template.preview.accent,
        secondaryColor: template.preview.bg
      }));
    }
  };

  const handleColorPreset = (preset: typeof COLOR_PRESETS[0]) => {
    setFormData(prev => ({
      ...prev,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary
    }));
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Géolocalisation non supportée");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({
          ...prev,
          coordinates: { lat: latitude, lng: longitude }
        }));

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          if (data.display_name) {
            const city = data.address?.city || data.address?.town || data.address?.village || '';
            const country = data.address?.country || '';
            setFormData(prev => ({
              ...prev,
              location: city ? `${city}, ${country}` : data.display_name.split(',').slice(0, 2).join(',')
            }));
          }
        } catch (error) {
          console.error("Reverse geocoding error:", error);
        }

        setIsLocating(false);
        toast.success("Position détectée ✓");
      },
      (error) => {
        setIsLocating(false);
        toast.error("Impossible de détecter la position");
        console.error("Geolocation error:", error);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const uploadImage = async (file: File, folder: string): Promise<string | null> => {
    if (!user) {
      toast.error("Non authentifié");
      return null;
    }

    const fileExt = file.name.split(".").pop() || "png";
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

    // IMPORTANT: la policy Storage exige que le 1er dossier = user.id
    const filePath = `${user.id}/${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("card-assets")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      toast.error("Erreur upload: " + uploadError.message);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("card-assets")
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);
    const url = await uploadImage(file, 'logo');
    if (url) {
      setFormData(prev => ({ ...prev, logoUrl: url }));
      toast.success("Logo uploadé ✓");
    }
    setIsUploadingLogo(false);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    const url = await uploadImage(file, 'photo');
    if (url) {
      setFormData(prev => ({ ...prev, photoUrl: url }));
      toast.success("Photo uploadée ✓");
    }
    setIsUploadingPhoto(false);
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingGallery(true);
    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const url = await uploadImage(files[i], 'gallery');
      if (url) {
        uploadedUrls.push(url);
      }
    }

    if (uploadedUrls.length > 0) {
      setFormData(prev => ({
        ...prev,
        galleryUrls: [...prev.galleryUrls, ...uploadedUrls]
      }));
      toast.success(`${uploadedUrls.length} image(s) ajoutée(s) ✓`);
    }
    setIsUploadingGallery(false);
  };

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      galleryUrls: prev.galleryUrls.filter((_, i) => i !== index)
    }));
  };

  const createInstantCard = async () => {
    if (!formData.businessName) {
      toast.error("Nom commercial requis");
      return;
    }

    if (!user) {
      toast.error("Non authentifié");
      return;
    }

    setIsCreating(true);
    try {
      const baseSlug = formData.businessName.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      const uniqueSlug = `${baseSlug}-${Date.now().toString(36)}`;

      const blocks: any[] = [];
      
      if (formData.coordinates) {
        blocks.push({
          type: 'location',
          coordinates: formData.coordinates,
          address: formData.location
        });
      }

      if (formData.googleReviewsUrl) {
        blocks.push({
          type: 'google_reviews',
          url: formData.googleReviewsUrl
        });
      }

      if (formData.galleryUrls.length > 0) {
        blocks.push({
          type: 'gallery',
          images: formData.galleryUrls
        });
      }

      if (formData.bookingUrl) {
        blocks.push({
          type: 'booking',
          url: formData.bookingUrl
        });
      }

      // Build social links array
      const socialLinks = Object.entries(formData.socialLinks)
        .filter(([_, url]) => url && url.trim() !== '')
        .map(([platform, url]) => ({ platform, url }));

      // Custom styles with colors and font
      const customStyles = {
        primaryColor: formData.primaryColor,
        secondaryColor: formData.secondaryColor,
        fontFamily: formData.fontFamily
      };

      const { data: card, error } = await supabase
        .from('digital_cards')
        .insert([{
          user_id: user.id,
          slug: uniqueSlug,
          first_name: formData.businessName,
          last_name: "",
          title: formData.category,
          company: formData.businessName,
          tagline: formData.description,
          email: formData.email || null,
          website: formData.website || null,
          phone: formData.phone || null,
          whatsapp: formData.whatsapp || null,
          instagram: formData.socialLinks.instagram || null,
          linkedin: formData.socialLinks.linkedin || null,
          twitter: formData.socialLinks.twitter || null,
          location: formData.location || null,
          logo_url: formData.logoUrl || null,
          photo_url: formData.photoUrl || formData.logoUrl || null,
          template: formData.template,
          blocks: blocks,
          social_links: socialLinks,
          custom_styles: customStyles,
          is_active: true,
          nfc_enabled: true,
          wallet_enabled: true,
          hide_branding: false,
        }])
        .select()
        .single();

      if (error) throw error;

      setCreatedCard({ id: card.id, slug: card.slug });
      toast.success("Carte digitale créée ✓");
    } catch (error: any) {
      console.error("Error creating card:", error);
      toast.error("Erreur: " + error.message);
    } finally {
      setIsCreating(false);
    }
  };

  const getCardUrl = () => {
    if (!createdCard) return '';
    return `${window.location.origin}/card/${createdCard.slug}`;
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(getCardUrl());
    toast.success("Lien copié ✓");
  };

  const shareCard = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: formData.businessName,
          text: formData.description,
          url: getCardUrl()
        });
      } catch (error) {
        copyLink();
      }
    } else {
      copyLink();
    }
  };

  // Success view
  if (createdCard) {
    return (
      <div className="min-h-dvh w-full" style={{ backgroundColor: '#0B0B0B' }}>
        <div className="max-w-md mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div 
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full"
              style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)' }}
            >
              <span className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: '#22C55E' }} />
              <span className="font-semibold" style={{ color: '#22C55E' }}>
                Carte digitale active
              </span>
            </div>
          </div>

          <Card 
            className="border-2 mb-6"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', borderColor: 'rgba(34, 197, 94, 0.3)' }}
          >
            <CardContent className="pt-6">
              <div className="flex justify-center mb-6">
                <div className="p-4 rounded-2xl" style={{ backgroundColor: '#FFFFFF' }}>
                  <QRCodeSVG value={getCardUrl()} size={180} level="H" fgColor="#0B0B0B" bgColor="#FFFFFF" />
                </div>
              </div>

              <div className="text-center mb-6">
                {(formData.photoUrl || formData.logoUrl) && (
                  <img 
                    src={formData.photoUrl || formData.logoUrl} 
                    alt="Profile" 
                    className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-2"
                    style={{ borderColor: formData.primaryColor }}
                  />
                )}
                <h2 className="text-xl font-bold mb-2" style={{ color: '#F5F5F5' }}>
                  {formData.businessName}
                </h2>
                <p className="text-sm mb-2" style={{ color: 'rgba(245, 245, 245, 0.6)' }}>
                  {formData.category}
                </p>
                <Badge style={{ backgroundColor: formData.primaryColor, color: formData.secondaryColor }}>
                  {TEMPLATES.find(t => t.id === formData.template)?.name}
                </Badge>
              </div>

              <div 
                className="rounded-xl p-4 mb-6"
                style={{ backgroundColor: 'rgba(34, 197, 94, 0.08)' }}
              >
                <p className="text-xs mb-1" style={{ color: 'rgba(245, 245, 245, 0.5)' }}>Lien public</p>
                <p className="text-sm font-mono break-all" style={{ color: '#22C55E' }}>{getCardUrl()}</p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => navigate(`/card/${createdCard.slug}`)}
                  className="w-full h-14 rounded-xl font-semibold"
                  style={{ backgroundColor: formData.primaryColor, color: formData.secondaryColor }}
                >
                  <ExternalLink size={18} className="mr-2" />
                  Ouvrir la carte
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  <Button onClick={shareCard} variant="outline" className="h-12 rounded-xl" style={{ borderColor: 'rgba(245, 245, 245, 0.3)', color: '#F5F5F5' }}>
                    <Share2 size={16} className="mr-2" /> Partager
                  </Button>
                  <Button onClick={copyLink} variant="outline" className="h-12 rounded-xl" style={{ borderColor: 'rgba(245, 245, 245, 0.3)', color: '#F5F5F5' }}>
                    <Copy size={16} className="mr-2" /> Copier
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <Button
              onClick={() => { setCreatedCard(null); setFormData(initialData); }}
              variant="ghost"
              className="w-full h-12"
              style={{ color: 'rgba(245, 245, 245, 0.6)' }}
            >
              <Zap size={16} className="mr-2" /> Créer une autre carte
            </Button>
            <Button onClick={() => navigate("/admin")} variant="ghost" className="w-full h-12" style={{ color: 'rgba(245, 245, 245, 0.4)' }}>
              <ArrowLeft size={16} className="mr-2" /> Retour Admin
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const sections = [
    { id: "info", label: "Infos", icon: Type },
    { id: "social", label: "Réseaux", icon: Instagram },
    { id: "media", label: "Médias", icon: Image },
    { id: "story", label: "Story", icon: Sparkles },
    { id: "design", label: "Design", icon: Palette },
  ] as const;

  // Form view
  return (
    <div className="min-h-dvh w-full" style={{ backgroundColor: '#0B0B0B' }}>
      {/* Header */}
      <div 
        className="sticky top-0 z-10 backdrop-blur border-b"
        style={{ backgroundColor: 'rgba(11, 11, 11, 0.95)', borderColor: 'rgba(255, 199, 0, 0.2)' }}
      >
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin")} style={{ color: '#F5F5F5' }}>
            <ArrowLeft size={20} />
          </Button>
          <div className="flex items-center gap-2">
            <Zap size={20} style={{ color: '#FFC700' }} />
            <h1 className="text-lg font-bold" style={{ color: '#F5F5F5' }}>Création Instantanée</h1>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="max-w-2xl mx-auto px-4 pb-2">
          <div className="flex gap-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className="flex-1 py-2 px-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5"
                style={{
                  backgroundColor: activeSection === section.id ? 'rgba(255, 199, 0, 0.15)' : 'transparent',
                  color: activeSection === section.id ? '#FFC700' : 'rgba(245, 245, 245, 0.5)'
                }}
              >
                <section.icon size={14} />
                <span className="hidden sm:inline">{section.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        
        {/* SECTION: INFOS */}
        {activeSection === "info" && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <Card className="border" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', borderColor: 'rgba(255, 199, 0, 0.2)' }}>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <Label style={{ color: '#F5F5F5' }}>Nom commercial *</Label>
                  <Input
                    value={formData.businessName}
                    onChange={(e) => handleInputChange("businessName", e.target.value)}
                    className="h-12 rounded-xl border-2"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 199, 0, 0.3)', color: '#F5F5F5' }}
                    placeholder="Ex: Mon Commerce"
                  />
                </div>

                <div>
                  <Label style={{ color: '#F5F5F5' }}>Catégorie / Métier</Label>
                  <Input
                    value={formData.category}
                    onChange={(e) => handleInputChange("category", e.target.value)}
                    className="h-12 rounded-xl border"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(245, 245, 245, 0.1)', color: '#F5F5F5' }}
                    placeholder="Ex: Restaurant, Boutique..."
                  />
                </div>

                <div>
                  <Label style={{ color: '#F5F5F5' }}>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="rounded-xl border resize-none"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(245, 245, 245, 0.1)', color: '#F5F5F5' }}
                    placeholder="Description courte"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="border" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', borderColor: 'rgba(245, 245, 245, 0.1)' }}>
              <CardContent className="pt-6 space-y-4">
                <h3 className="text-sm font-medium flex items-center gap-2" style={{ color: 'rgba(245, 245, 245, 0.7)' }}>
                  <Phone size={14} /> Contact
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs" style={{ color: 'rgba(245, 245, 245, 0.5)' }}>Téléphone</Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="h-11 rounded-xl border"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(245, 245, 245, 0.1)', color: '#F5F5F5' }}
                      placeholder="+212..."
                    />
                  </div>
                  <div>
                    <Label className="text-xs" style={{ color: 'rgba(245, 245, 245, 0.5)' }}>WhatsApp</Label>
                    <Input
                      value={formData.whatsapp}
                      onChange={(e) => handleInputChange("whatsapp", e.target.value)}
                      className="h-11 rounded-xl border"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(245, 245, 245, 0.1)', color: '#F5F5F5' }}
                      placeholder="+212..."
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs flex items-center gap-1" style={{ color: 'rgba(245, 245, 245, 0.5)' }}>
                    <Mail size={12} /> Email
                  </Label>
                  <Input
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="h-11 rounded-xl border"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(245, 245, 245, 0.1)', color: '#F5F5F5' }}
                    placeholder="contact@..."
                  />
                </div>

                <div>
                  <Label className="text-xs flex items-center gap-1" style={{ color: 'rgba(245, 245, 245, 0.5)' }}>
                    <Globe size={12} /> Site web
                  </Label>
                  <Input
                    value={formData.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                    className="h-11 rounded-xl border"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(245, 245, 245, 0.1)', color: '#F5F5F5' }}
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <Label className="text-xs flex items-center gap-1" style={{ color: 'rgba(245, 245, 245, 0.5)' }}>
                    <Calendar size={12} /> Lien réservation / Booking
                  </Label>
                  <Input
                    value={formData.bookingUrl}
                    onChange={(e) => handleInputChange("bookingUrl", e.target.value)}
                    className="h-11 rounded-xl border"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(245, 245, 245, 0.1)', color: '#F5F5F5' }}
                    placeholder="https://booking.com/..."
                  />
                </div>

                <div>
                  <Label className="text-xs flex items-center gap-1" style={{ color: 'rgba(245, 245, 245, 0.5)' }}>
                    <Star size={12} /> Lien Avis Google
                  </Label>
                  <Input
                    value={formData.googleReviewsUrl}
                    onChange={(e) => handleInputChange("googleReviewsUrl", e.target.value)}
                    className="h-11 rounded-xl border"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(245, 245, 245, 0.1)', color: '#F5F5F5' }}
                    placeholder="https://g.page/..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card className="border" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', borderColor: 'rgba(245, 245, 245, 0.1)' }}>
              <CardContent className="pt-6">
                <Label className="flex items-center gap-2 mb-3" style={{ color: '#F5F5F5' }}>
                  <MapPin size={14} /> Localisation
                </Label>
                <div className="flex gap-3">
                  <Input
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    className="flex-1 h-12 rounded-xl border"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(245, 245, 245, 0.1)', color: '#F5F5F5' }}
                    placeholder="Ville, Pays"
                  />
                  <Button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={isLocating}
                    className="h-12 px-4 rounded-xl"
                    style={{ backgroundColor: '#FFC700', color: '#0B0B0B' }}
                  >
                    {isLocating ? <Loader2 size={18} className="animate-spin" /> : <MapPin size={18} />}
                  </Button>
                </div>
                {formData.coordinates && (
                  <p className="text-xs mt-2" style={{ color: 'rgba(255, 199, 0, 0.7)' }}>✓ Position GPS détectée</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* SECTION: SOCIAL */}
        {activeSection === "social" && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <Card className="border" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', borderColor: 'rgba(255, 199, 0, 0.2)' }}>
              <CardContent className="pt-6 space-y-4">
                <h3 className="text-sm font-medium flex items-center gap-2" style={{ color: '#FFC700' }}>
                  <Instagram size={14} /> Réseaux sociaux
                </h3>
                <p className="text-xs" style={{ color: 'rgba(245, 245, 245, 0.5)' }}>
                  Ajoutez tous vos profils sociaux
                </p>
                
                {SOCIAL_NETWORKS.map((network) => (
                  <div key={network.id}>
                    <Label className="text-xs flex items-center gap-2 mb-1.5" style={{ color: 'rgba(245, 245, 245, 0.6)' }}>
                      <network.icon size={14} /> {network.name}
                    </Label>
                    <Input
                      value={formData.socialLinks[network.id] || ''}
                      onChange={(e) => handleSocialChange(network.id, e.target.value)}
                      className="h-11 rounded-xl border"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(245, 245, 245, 0.1)', color: '#F5F5F5' }}
                      placeholder={network.placeholder}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* SECTION: MEDIA */}
        {activeSection === "media" && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            {/* Logo */}
            <Card className="border" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', borderColor: 'rgba(255, 199, 0, 0.2)' }}>
              <CardContent className="pt-6">
                <Label className="flex items-center gap-2 mb-3" style={{ color: '#F5F5F5' }}>
                  <Image size={14} /> Logo
                </Label>
                <div className="flex gap-3 items-center">
                  <label 
                    className="flex-1 h-24 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors hover:border-[#FFC700]/50"
                    style={{ borderColor: 'rgba(255, 199, 0, 0.3)' }}
                  >
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" disabled={isUploadingLogo} />
                    {isUploadingLogo ? (
                      <Loader2 size={24} className="animate-spin" style={{ color: '#FFC700' }} />
                    ) : (
                      <>
                        <Plus size={24} style={{ color: 'rgba(245, 245, 245, 0.3)' }} />
                        <span className="text-xs mt-2" style={{ color: 'rgba(245, 245, 245, 0.5)' }}>
                          Ajouter logo
                        </span>
                      </>
                    )}
                  </label>
                  {formData.logoUrl && (
                    <div className="relative">
                      <img src={formData.logoUrl} alt="Logo" className="h-24 w-24 rounded-xl object-cover" />
                      <button
                        onClick={() => setFormData(prev => ({ ...prev, logoUrl: '' }))}
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center"
                      >
                        <X size={14} className="text-white" />
                      </button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Photo de profil */}
            <Card className="border" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', borderColor: 'rgba(245, 245, 245, 0.1)' }}>
              <CardContent className="pt-6">
                <Label className="flex items-center gap-2 mb-3" style={{ color: '#F5F5F5' }}>
                  <Camera size={14} /> Photo de profil
                </Label>
                <div className="flex gap-3 items-center">
                  <label 
                    className="flex-1 h-24 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors hover:border-[#FFC700]/50"
                    style={{ borderColor: 'rgba(245, 245, 245, 0.2)' }}
                  >
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" disabled={isUploadingPhoto} />
                    {isUploadingPhoto ? (
                      <Loader2 size={24} className="animate-spin" style={{ color: '#FFC700' }} />
                    ) : (
                      <>
                        <Camera size={24} style={{ color: 'rgba(245, 245, 245, 0.3)' }} />
                        <span className="text-xs mt-2" style={{ color: 'rgba(245, 245, 245, 0.5)' }}>
                          Ajouter photo
                        </span>
                      </>
                    )}
                  </label>
                  {formData.photoUrl && (
                    <div className="relative">
                      <img src={formData.photoUrl} alt="Photo" className="h-24 w-24 rounded-full object-cover border-2" style={{ borderColor: formData.primaryColor }} />
                      <button
                        onClick={() => setFormData(prev => ({ ...prev, photoUrl: '' }))}
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center"
                      >
                        <X size={14} className="text-white" />
                      </button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Galerie */}
            <Card className="border" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', borderColor: 'rgba(245, 245, 245, 0.1)' }}>
              <CardContent className="pt-6">
                <Label className="flex items-center gap-2 mb-3" style={{ color: '#F5F5F5' }}>
                  <Image size={14} /> Galerie d'images ({formData.galleryUrls.length}/10)
                </Label>
                
                <div className="grid grid-cols-3 gap-3">
                  {formData.galleryUrls.map((url, index) => (
                    <div key={index} className="relative aspect-square">
                      <img src={url} alt={`Gallery ${index + 1}`} className="w-full h-full rounded-xl object-cover" />
                      <button
                        onClick={() => removeGalleryImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center"
                      >
                        <X size={14} className="text-white" />
                      </button>
                    </div>
                  ))}
                  
                  {formData.galleryUrls.length < 10 && (
                    <label 
                      className="aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors hover:border-[#FFC700]/50"
                      style={{ borderColor: 'rgba(245, 245, 245, 0.2)' }}
                    >
                      <input 
                        type="file" 
                        accept="image/*" 
                        multiple 
                        onChange={handleGalleryUpload} 
                        className="hidden" 
                        disabled={isUploadingGallery}
                      />
                      {isUploadingGallery ? (
                        <Loader2 size={20} className="animate-spin" style={{ color: '#FFC700' }} />
                      ) : (
                        <>
                          <Plus size={20} style={{ color: 'rgba(245, 245, 245, 0.3)' }} />
                          <span className="text-xs mt-1" style={{ color: 'rgba(245, 245, 245, 0.5)' }}>
                            Ajouter
                          </span>
                        </>
                      )}
                    </label>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* SECTION: STORY */}
        {activeSection === "story" && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <Card className="border" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', borderColor: 'rgba(236, 72, 153, 0.3)' }}>
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <div 
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
                    style={{ backgroundColor: 'rgba(236, 72, 153, 0.15)' }}
                  >
                    <Sparkles size={16} style={{ color: '#EC4899' }} />
                    <span className="text-sm font-medium" style={{ color: '#EC4899' }}>Stories 24h</span>
                  </div>
                  <p className="text-sm" style={{ color: 'rgba(245, 245, 245, 0.6)' }}>
                    Créez plusieurs stories qui défilent comme sur Instagram !
                  </p>
                </div>

                {createdCard ? (
                  <StoryEditor
                    cardId={createdCard.id}
                    stories={stories}
                    onStoriesChange={setStories}
                    maxStories={10}
                  />
                ) : (
                  <div 
                    className="text-center py-8 rounded-xl space-y-4"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                  >
                    <div className="flex justify-center gap-2">
                      {[1, 2, 3].map((i) => (
                        <div 
                          key={i}
                          className="w-14 h-20 rounded-lg border-2 border-dashed flex items-center justify-center"
                          style={{ borderColor: 'rgba(236, 72, 153, 0.3)' }}
                        >
                          <Plus size={16} style={{ color: 'rgba(236, 72, 153, 0.5)' }} />
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'rgba(245, 245, 245, 0.7)' }}>
                        Ajoutez vos stories après la création
                      </p>
                      <p className="text-xs mt-1" style={{ color: 'rgba(245, 245, 245, 0.4)' }}>
                        Jusqu'à 10 stories qui défilent automatiquement
                      </p>
                    </div>
                    <Button
                      onClick={() => setActiveSection("info")}
                      variant="outline"
                      size="sm"
                      className="border-rose-500/30 text-rose-400 hover:bg-rose-500/10"
                    >
                      <ArrowLeft size={14} className="mr-1.5" />
                      Commencer par les infos
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Instructions améliorées */}
            <div 
              className="rounded-xl p-4"
              style={{ backgroundColor: 'rgba(236, 72, 153, 0.08)' }}
            >
              <h4 className="text-sm font-medium mb-3" style={{ color: '#EC4899' }}>📱 Stories style Instagram</h4>
              <ul className="text-xs space-y-2" style={{ color: 'rgba(245, 245, 245, 0.7)' }}>
                <li className="flex items-start gap-2">
                  <span>📸</span>
                  <span>Ajoutez jusqu'à <strong>10 images ou textes</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span>⏱️</span>
                  <span>Défilement automatique toutes les 5 secondes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>👆</span>
                  <span>Navigation tactile gauche/droite</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>📊</span>
                  <span>Statistiques de vues en temps réel</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>🕐</span>
                  <span>Expiration automatique après 24h</span>
                </li>
              </ul>
            </div>

            {/* Idées de contenu */}
            <div 
              className="rounded-xl p-4"
              style={{ backgroundColor: 'rgba(255, 199, 0, 0.08)' }}
            >
              <h4 className="text-sm font-medium mb-2" style={{ color: '#FFC700' }}>💡 Idées de contenu</h4>
              <div className="flex flex-wrap gap-2">
                {[
                  "Promo flash",
                  "Nouveau produit",
                  "Événement",
                  "Coulisses",
                  "Témoignage client",
                  "Actualité"
                ].map((idea) => (
                  <span 
                    key={idea}
                    className="px-2.5 py-1 rounded-full text-xs"
                    style={{ backgroundColor: 'rgba(255, 199, 0, 0.15)', color: '#FFC700' }}
                  >
                    {idea}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* SECTION: DESIGN */}
        {activeSection === "design" && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            {/* Templates */}
            <Card className="border" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', borderColor: 'rgba(255, 199, 0, 0.2)' }}>
              <CardContent className="pt-6">
                <Label className="flex items-center gap-2 mb-4" style={{ color: '#F5F5F5' }}>
                  <Layout size={14} /> Template
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {TEMPLATES.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleTemplateSelect(template.id)}
                      className={`relative p-4 rounded-xl border-2 transition-all text-left ${formData.template === template.id ? 'scale-[1.02]' : 'hover:scale-[1.01]'}`}
                      style={{ backgroundColor: template.preview.bg, borderColor: formData.template === template.id ? template.preview.accent : 'transparent' }}
                    >
                      {formData.template === template.id && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: template.preview.accent }}>
                          <Check size={12} style={{ color: template.preview.bg }} />
                        </div>
                      )}
                      <div className="w-8 h-1 rounded-full mb-2" style={{ backgroundColor: template.preview.accent }} />
                      <p className="text-sm font-semibold" style={{ color: template.preview.text }}>{template.name}</p>
                      <p className="text-xs opacity-60" style={{ color: template.preview.text }}>{template.description}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Colors */}
            <Card className="border" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', borderColor: 'rgba(245, 245, 245, 0.1)' }}>
              <CardContent className="pt-6">
                <Label className="flex items-center gap-2 mb-4" style={{ color: '#F5F5F5' }}>
                  <Palette size={14} /> Couleurs
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  {COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => handleColorPreset(preset)}
                      className={`p-3 rounded-xl border-2 transition-all ${formData.primaryColor === preset.primary ? 'scale-105' : ''}`}
                      style={{ backgroundColor: preset.secondary, borderColor: formData.primaryColor === preset.primary ? preset.primary : 'transparent' }}
                    >
                      <div className="w-full h-6 rounded-lg mb-2" style={{ backgroundColor: preset.primary }} />
                      <p className="text-xs font-medium" style={{ color: preset.primary }}>{preset.name}</p>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t" style={{ borderColor: 'rgba(245, 245, 245, 0.1)' }}>
                  <div>
                    <Label className="text-xs mb-2 block" style={{ color: 'rgba(245, 245, 245, 0.5)' }}>Couleur principale</Label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={formData.primaryColor} onChange={(e) => handleInputChange("primaryColor", e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer border-0" />
                      <Input value={formData.primaryColor} onChange={(e) => handleInputChange("primaryColor", e.target.value)} className="flex-1 h-10 rounded-lg text-xs font-mono" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(245, 245, 245, 0.1)', color: '#F5F5F5' }} />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs mb-2 block" style={{ color: 'rgba(245, 245, 245, 0.5)' }}>Fond</Label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={formData.secondaryColor} onChange={(e) => handleInputChange("secondaryColor", e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer border-0" />
                      <Input value={formData.secondaryColor} onChange={(e) => handleInputChange("secondaryColor", e.target.value)} className="flex-1 h-10 rounded-lg text-xs font-mono" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(245, 245, 245, 0.1)', color: '#F5F5F5' }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fonts */}
            <Card className="border" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', borderColor: 'rgba(245, 245, 245, 0.1)' }}>
              <CardContent className="pt-6">
                <Label className="flex items-center gap-2 mb-4" style={{ color: '#F5F5F5' }}>
                  <Type size={14} /> Police
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  {FONT_OPTIONS.map((font) => (
                    <button
                      key={font.id}
                      onClick={() => handleInputChange("fontFamily", font.id)}
                      className={`p-4 rounded-xl border-2 transition-all ${font.style}`}
                      style={{
                        backgroundColor: formData.fontFamily === font.id ? 'rgba(255, 199, 0, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                        borderColor: formData.fontFamily === font.id ? '#FFC700' : 'rgba(245, 245, 245, 0.1)',
                        color: '#F5F5F5'
                      }}
                    >
                      <p className="text-lg font-semibold mb-1">Aa</p>
                      <p className="text-xs opacity-60">{font.name}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card className="border overflow-hidden" style={{ backgroundColor: formData.secondaryColor, borderColor: formData.primaryColor + '40' }}>
              <CardContent className="pt-6 text-center">
                <p className="text-xs mb-3 opacity-50" style={{ color: formData.primaryColor }}>Aperçu</p>
                {(formData.photoUrl || formData.logoUrl) && (
                  <img src={formData.photoUrl || formData.logoUrl} alt="Preview" className="w-16 h-16 rounded-full object-cover mx-auto mb-3 border-2" style={{ borderColor: formData.primaryColor }} />
                )}
                <h3 
                  className={`text-xl font-bold mb-1 ${formData.fontFamily === 'playfair' ? 'font-serif' : formData.fontFamily === 'mono' ? 'font-mono' : 'font-sans'}`}
                  style={{ color: ['#FFFFFF', '#FAF9F6', '#FAFAFA'].includes(formData.secondaryColor) ? '#1D1D1F' : '#F5F5F5' }}
                >
                  {formData.businessName || "Nom du commerce"}
                </h3>
                <p className="text-sm opacity-60" style={{ color: ['#FFFFFF', '#FAF9F6', '#FAFAFA'].includes(formData.secondaryColor) ? '#1D1D1F' : '#F5F5F5' }}>
                  {formData.category || "Catégorie"}
                </p>
                <div className="inline-block mt-4 px-4 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: formData.primaryColor, color: formData.secondaryColor }}>
                  Contacter
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Create Button */}
        <Button
          onClick={createInstantCard}
          disabled={isCreating || !formData.businessName}
          className="w-full h-14 rounded-xl font-bold text-lg"
          style={{ backgroundColor: formData.primaryColor, color: formData.secondaryColor }}
        >
          {isCreating ? (
            <><Loader2 size={20} className="mr-2 animate-spin" /> Création...</>
          ) : (
            <><Zap size={20} className="mr-2" /> Créer la carte</>
          )}
        </Button>

        <div className="rounded-xl p-4 text-center" style={{ backgroundColor: `${formData.primaryColor}15` }}>
          <p className="text-xs" style={{ color: 'rgba(245, 245, 245, 0.6)' }}>
            NFC activable • Modifiable depuis Admin
          </p>
        </div>
      </div>
    </div>
  );
}
