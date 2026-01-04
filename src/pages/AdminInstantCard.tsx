/**
 * Admin Instant Card Creator
 * Mode "Création instantanée vCard – Admin i-Wasp"
 * Creates digital business cards instantly without payment
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminGuard } from "@/components/AdminGuard";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Zap, 
  MapPin, 
  Check,
  Loader2,
  ArrowLeft,
  ExternalLink,
  QrCode,
  Share2,
  Smartphone,
  Copy,
  Globe,
  Instagram,
  Phone,
  MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QRCodeSVG } from "qrcode.react";

interface BusinessCardData {
  businessName: string;
  category: string;
  description: string;
  website: string;
  instagram: string;
  phone: string;
  whatsapp: string;
  location: string;
  coordinates: { lat: number; lng: number } | null;
  googleReviewsUrl: string;
  logoUrl: string;
}

const initialData: BusinessCardData = {
  businessName: "",
  category: "",
  description: "",
  website: "",
  instagram: "",
  phone: "",
  whatsapp: "",
  location: "",
  coordinates: null,
  googleReviewsUrl: "",
  logoUrl: "",
};

// Prefilled data for Medina Mall demo
const MEDINA_MALL_DATA: BusinessCardData = {
  businessName: "Medina Mall",
  category: "Commerce / Centre commercial premium",
  description: "Centre commercial premium à Marrakech",
  website: "https://medinamall.ma",
  instagram: "https://www.instagram.com/letravertin",
  phone: "",
  whatsapp: "",
  location: "Marrakech, Maroc",
  coordinates: null,
  googleReviewsUrl: "",
  logoUrl: "",
};

export default function AdminInstantCard() {
  return (
    <AdminGuard>
      <AdminInstantCardContent />
    </AdminGuard>
  );
}

function AdminInstantCardContent() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState<BusinessCardData>(MEDINA_MALL_DATA);
  const [isCreating, setIsCreating] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [createdCard, setCreatedCard] = useState<{ id: string; slug: string } | null>(null);

  const handleInputChange = (field: keyof BusinessCardData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

        // Reverse geocode to get address
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

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `instant-${Date.now()}.${fileExt}`;
    const filePath = `admin-uploads/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('card-assets')
      .upload(filePath, file);

    if (uploadError) {
      toast.error("Erreur upload logo");
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('card-assets')
      .getPublicUrl(filePath);

    setFormData(prev => ({ ...prev, logoUrl: publicUrl }));
    toast.success("Logo uploadé ✓");
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
      // Generate unique slug
      const baseSlug = formData.businessName.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      const uniqueSlug = `${baseSlug}-${Date.now().toString(36)}`;

      // Prepare blocks for location and Google Reviews
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

      // Prepare social links
      const socialLinks: any[] = [];
      if (formData.instagram) {
        socialLinks.push({ platform: 'instagram', url: formData.instagram });
      }

      // Create the card
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
          website: formData.website || null,
          phone: formData.phone || null,
          whatsapp: formData.whatsapp || null,
          instagram: formData.instagram || null,
          location: formData.location || null,
          logo_url: formData.logoUrl || null,
          photo_url: formData.logoUrl || null,
          template: "dark-luxury-business",
          blocks: blocks,
          social_links: socialLinks,
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
      <div 
        className="min-h-dvh w-full"
        style={{ backgroundColor: '#0B0B0B' }}
      >
        <div className="max-w-md mx-auto px-4 py-8">
          {/* Status Badge */}
          <div className="text-center mb-8">
            <div 
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full"
              style={{ backgroundColor: 'rgba(255, 199, 0, 0.15)' }}
            >
              <span 
                className="w-3 h-3 rounded-full animate-pulse"
                style={{ backgroundColor: '#22C55E' }}
              />
              <span 
                className="font-semibold"
                style={{ color: '#FFC700' }}
              >
                Carte digitale active
              </span>
            </div>
          </div>

          {/* QR Code Card */}
          <Card 
            className="border-2 mb-6"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              borderColor: 'rgba(255, 199, 0, 0.3)'
            }}
          >
            <CardContent className="pt-6">
              <div className="flex justify-center mb-6">
                <div 
                  className="p-4 rounded-2xl"
                  style={{ backgroundColor: '#FFFFFF' }}
                >
                  <QRCodeSVG
                    value={getCardUrl()}
                    size={180}
                    level="H"
                    fgColor="#0B0B0B"
                    bgColor="#FFFFFF"
                    includeMargin={false}
                  />
                </div>
              </div>

              <div className="text-center mb-6">
                <h2 
                  className="text-xl font-bold mb-2"
                  style={{ color: '#F5F5F5' }}
                >
                  {formData.businessName}
                </h2>
                <p 
                  className="text-sm"
                  style={{ color: 'rgba(245, 245, 245, 0.6)' }}
                >
                  {formData.category}
                </p>
              </div>

              {/* URL Display */}
              <div 
                className="rounded-xl p-4 mb-6"
                style={{ backgroundColor: 'rgba(255, 199, 0, 0.08)' }}
              >
                <p 
                  className="text-xs mb-1"
                  style={{ color: 'rgba(245, 245, 245, 0.5)' }}
                >
                  Lien public
                </p>
                <p 
                  className="text-sm font-mono break-all"
                  style={{ color: '#FFC700' }}
                >
                  {getCardUrl()}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={() => navigate(`/card/${createdCard.slug}`)}
                  className="w-full h-14 rounded-xl font-semibold text-black"
                  style={{ backgroundColor: '#FFC700' }}
                >
                  <ExternalLink size={18} className="mr-2" />
                  Ouvrir la carte
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={shareCard}
                    className="h-12 rounded-xl font-medium border-2"
                    style={{ 
                      backgroundColor: 'transparent',
                      borderColor: 'rgba(255, 199, 0, 0.5)',
                      color: '#FFC700'
                    }}
                  >
                    <Share2 size={16} className="mr-2" />
                    Partager
                  </Button>
                  <Button
                    onClick={copyLink}
                    className="h-12 rounded-xl font-medium border-2"
                    style={{ 
                      backgroundColor: 'transparent',
                      borderColor: 'rgba(245, 245, 245, 0.3)',
                      color: '#F5F5F5'
                    }}
                  >
                    <Copy size={16} className="mr-2" />
                    Copier
                  </Button>
                </div>

                <Button
                  onClick={() => toast.info("Wallet Pass disponible après connexion")}
                  className="w-full h-12 rounded-xl font-medium border-2"
                  style={{ 
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(245, 245, 245, 0.2)',
                    color: 'rgba(245, 245, 245, 0.7)'
                  }}
                >
                  <Smartphone size={16} className="mr-2" />
                  Ajouter au téléphone
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Create Another */}
          <div className="space-y-3">
            <Button
              onClick={() => {
                setCreatedCard(null);
                setFormData(initialData);
              }}
              variant="ghost"
              className="w-full h-12"
              style={{ color: 'rgba(245, 245, 245, 0.6)' }}
            >
              <Zap size={16} className="mr-2" />
              Créer une autre carte
            </Button>
            <Button
              onClick={() => navigate("/admin/orders")}
              variant="ghost"
              className="w-full h-12"
              style={{ color: 'rgba(245, 245, 245, 0.4)' }}
            >
              <ArrowLeft size={16} className="mr-2" />
              Retour Admin
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Form view
  return (
    <div 
      className="min-h-dvh w-full"
      style={{ backgroundColor: '#0B0B0B' }}
    >
      {/* Header */}
      <div 
        className="sticky top-0 z-10 backdrop-blur border-b"
        style={{ 
          backgroundColor: 'rgba(11, 11, 11, 0.95)',
          borderColor: 'rgba(255, 199, 0, 0.2)'
        }}
      >
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate("/admin/orders")}
            style={{ color: '#F5F5F5' }}
          >
            <ArrowLeft size={20} />
          </Button>
          <div className="flex items-center gap-2">
            <Zap size={20} style={{ color: '#FFC700' }} />
            <h1 
              className="text-lg font-bold"
              style={{ color: '#F5F5F5' }}
            >
              Création Instantanée
            </h1>
          </div>
          <Badge 
            className="ml-auto"
            style={{ 
              backgroundColor: 'rgba(255, 199, 0, 0.15)',
              color: '#FFC700'
            }}
          >
            Dark Luxury
          </Badge>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Business Identity */}
        <Card 
          className="border"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            borderColor: 'rgba(255, 199, 0, 0.2)'
          }}
        >
          <CardContent className="pt-6 space-y-4">
            <div>
              <Label style={{ color: '#F5F5F5' }}>Nom commercial *</Label>
              <Input
                value={formData.businessName}
                onChange={(e) => handleInputChange("businessName", e.target.value)}
                className="h-12 rounded-xl border-2"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderColor: 'rgba(255, 199, 0, 0.3)',
                  color: '#F5F5F5'
                }}
                placeholder="Ex: Medina Mall"
              />
            </div>

            <div>
              <Label style={{ color: '#F5F5F5' }}>Catégorie</Label>
              <Input
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="h-12 rounded-xl border"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderColor: 'rgba(245, 245, 245, 0.1)',
                  color: '#F5F5F5'
                }}
                placeholder="Ex: Commerce / Centre commercial"
              />
            </div>

            <div>
              <Label style={{ color: '#F5F5F5' }}>Description courte</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="rounded-xl border resize-none"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderColor: 'rgba(245, 245, 245, 0.1)',
                  color: '#F5F5F5'
                }}
                placeholder="Description courte du commerce"
                rows={2}
              />
            </div>

            {/* Logo Upload */}
            <div>
              <Label style={{ color: '#F5F5F5' }}>Logo</Label>
              <div className="flex gap-3">
                <label 
                  className="flex-1 h-12 rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer transition-colors hover:border-[#FFC700]/50"
                  style={{ borderColor: 'rgba(255, 199, 0, 0.3)' }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <span style={{ color: 'rgba(245, 245, 245, 0.5)' }}>
                    {formData.logoUrl ? 'Logo uploadé ✓' : 'Choisir un logo'}
                  </span>
                </label>
                {formData.logoUrl && (
                  <img 
                    src={formData.logoUrl} 
                    alt="Logo" 
                    className="h-12 w-12 rounded-xl object-cover"
                  />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact & Links */}
        <Card 
          className="border"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            borderColor: 'rgba(245, 245, 245, 0.1)'
          }}
        >
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="flex items-center gap-2" style={{ color: '#F5F5F5' }}>
                  <Phone size={14} /> Téléphone
                </Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="h-12 rounded-xl border"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'rgba(245, 245, 245, 0.1)',
                    color: '#F5F5F5'
                  }}
                  placeholder="+212..."
                />
              </div>
              <div>
                <Label className="flex items-center gap-2" style={{ color: '#F5F5F5' }}>
                  <MessageCircle size={14} /> WhatsApp
                </Label>
                <Input
                  value={formData.whatsapp}
                  onChange={(e) => handleInputChange("whatsapp", e.target.value)}
                  className="h-12 rounded-xl border"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'rgba(245, 245, 245, 0.1)',
                    color: '#F5F5F5'
                  }}
                  placeholder="+212..."
                />
              </div>
            </div>

            <div>
              <Label className="flex items-center gap-2" style={{ color: '#F5F5F5' }}>
                <Globe size={14} /> Site web
              </Label>
              <Input
                value={formData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                className="h-12 rounded-xl border"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderColor: 'rgba(245, 245, 245, 0.1)',
                  color: '#F5F5F5'
                }}
                placeholder="https://..."
              />
            </div>

            <div>
              <Label className="flex items-center gap-2" style={{ color: '#F5F5F5' }}>
                <Instagram size={14} /> Instagram
              </Label>
              <Input
                value={formData.instagram}
                onChange={(e) => handleInputChange("instagram", e.target.value)}
                className="h-12 rounded-xl border"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderColor: 'rgba(245, 245, 245, 0.1)',
                  color: '#F5F5F5'
                }}
                placeholder="https://instagram.com/..."
              />
            </div>

            <div>
              <Label style={{ color: '#F5F5F5' }}>Lien Avis Google (optionnel)</Label>
              <Input
                value={formData.googleReviewsUrl}
                onChange={(e) => handleInputChange("googleReviewsUrl", e.target.value)}
                className="h-12 rounded-xl border"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderColor: 'rgba(245, 245, 245, 0.1)',
                  color: '#F5F5F5'
                }}
                placeholder="https://g.page/..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card 
          className="border"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            borderColor: 'rgba(245, 245, 245, 0.1)'
          }}
        >
          <CardContent className="pt-6 space-y-4">
            <div>
              <Label className="flex items-center gap-2" style={{ color: '#F5F5F5' }}>
                <MapPin size={14} /> Localisation
              </Label>
              <div className="flex gap-3">
                <Input
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  className="flex-1 h-12 rounded-xl border"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'rgba(245, 245, 245, 0.1)',
                    color: '#F5F5F5'
                  }}
                  placeholder="Ville, Pays"
                />
                <Button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={isLocating}
                  className="h-12 px-4 rounded-xl"
                  style={{ 
                    backgroundColor: '#FFC700',
                    color: '#0B0B0B'
                  }}
                >
                  {isLocating ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <MapPin size={18} />
                  )}
                </Button>
              </div>
              {formData.coordinates && (
                <p 
                  className="text-xs mt-2"
                  style={{ color: 'rgba(255, 199, 0, 0.7)' }}
                >
                  ✓ Position GPS: {formData.coordinates.lat.toFixed(6)}, {formData.coordinates.lng.toFixed(6)}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Create Button */}
        <Button
          onClick={createInstantCard}
          disabled={isCreating || !formData.businessName}
          className="w-full h-14 rounded-xl font-bold text-lg"
          style={{ 
            backgroundColor: '#FFC700',
            color: '#0B0B0B'
          }}
        >
          {isCreating ? (
            <>
              <Loader2 size={20} className="mr-2 animate-spin" />
              Création en cours...
            </>
          ) : (
            <>
              <Zap size={20} className="mr-2" />
              Créer la carte instantanément
            </>
          )}
        </Button>

        {/* Info Note */}
        <div 
          className="rounded-xl p-4 text-center"
          style={{ backgroundColor: 'rgba(255, 199, 0, 0.08)' }}
        >
          <p 
            className="text-xs"
            style={{ color: 'rgba(245, 245, 245, 0.6)' }}
          >
            Carte créée sans paiement • NFC activable • Modifiable depuis Admin
          </p>
        </div>
      </div>
    </div>
  );
}
