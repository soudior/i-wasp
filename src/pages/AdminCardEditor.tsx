/**
 * Admin Card Editor
 * Simple interface to edit client cards without code
 */

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Save, Eye, User, Building2, Mail, Phone, 
  MapPin, Instagram, MessageCircle, Globe, FileText,
  Loader2, CheckCircle, ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ClientCardData {
  id?: string;
  slug: string;
  first_name: string;
  last_name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  whatsapp: string;
  location: string;
  website: string;
  instagram: string;
  tagline: string;
  logo_url: string;
  photo_url: string;
}

const STATIC_CARDS: Record<string, ClientCardData> = {
  "maison-b-optic": {
    slug: "maison-b-optic",
    first_name: "Marc Aurel",
    last_name: "Opticien",
    title: "Opticien",
    company: "Marc Aurel Opticien",
    email: "marc.aurel.opticiens@gmail.com",
    phone: "+33758721225",
    whatsapp: "33758721225",
    location: "Paris - Marrakech",
    website: "",
    instagram: "maison_bopticparis",
    tagline: "L'art de la vision, façonné sur mesure.",
    logo_url: "/assets/clients/maison-b-optic-logo.png",
    photo_url: "",
  },
};

const AdminCardEditor = () => {
  const navigate = useNavigate();
  const { cardSlug } = useParams<{ cardSlug: string }>();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<ClientCardData>({
    slug: "",
    first_name: "",
    last_name: "",
    title: "",
    company: "",
    email: "",
    phone: "",
    whatsapp: "",
    location: "",
    website: "",
    instagram: "",
    tagline: "",
    logo_url: "",
    photo_url: "",
  });

  useEffect(() => {
    if (cardSlug && STATIC_CARDS[cardSlug]) {
      setFormData(STATIC_CARDS[cardSlug]);
    }
  }, [cardSlug]);

  const handleChange = (field: keyof ClientCardData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // For now, show what would be saved (static cards need code update)
      console.log("Card data to save:", formData);
      
      // In a full implementation, this would save to database
      // For static cards, we show instructions
      toast.success("Données copiées ! Mettez à jour le code avec ces valeurs.", {
        description: "Les cartes statiques nécessitent une mise à jour du code.",
        duration: 5000,
      });
      
      // Copy to clipboard for easy update
      await navigator.clipboard.writeText(JSON.stringify(formData, null, 2));
      toast.info("JSON copié dans le presse-papier");
      
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    window.open(`/card/${formData.slug}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/admin")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold">Éditeur de Carte</h1>
              <p className="text-sm text-muted-foreground">
                {cardSlug || "Nouvelle carte"}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handlePreview}
            >
              <Eye className="h-4 w-4 mr-2" />
              Aperçu
            </Button>
            <Button 
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Sauvegarder
            </Button>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-6">
          {/* Identity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-4 w-4" />
                Identité
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="first_name">Prénom / Nom affiché</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => handleChange("first_name", e.target.value)}
                  placeholder="Marc Aurel"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Nom de famille</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => handleChange("last_name", e.target.value)}
                  placeholder="Opticien"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Fonction</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="Opticien"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Entreprise</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleChange("company", e.target.value)}
                  placeholder="Marc Aurel Opticien"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="tagline">Bio / Tagline</Label>
                <Textarea
                  id="tagline"
                  value={formData.tagline}
                  onChange={(e) => handleChange("tagline", e.target.value)}
                  placeholder="L'art de la vision, façonné sur mesure."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Phone className="h-4 w-4" />
                Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="email@exemple.com"
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="+33 6 12 34 56 78"
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp (numéro sans +)</Label>
                <div className="relative">
                  <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="whatsapp"
                    value={formData.whatsapp}
                    onChange={(e) => handleChange("whatsapp", e.target.value)}
                    placeholder="33612345678"
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Localisation</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    placeholder="Paris - Marrakech"
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Globe className="h-4 w-4" />
                Réseaux & Web
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram (username)</Label>
                <div className="relative">
                  <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="instagram"
                    value={formData.instagram}
                    onChange={(e) => handleChange("instagram", e.target.value)}
                    placeholder="maison_bopticparis"
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Site Web</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => handleChange("website", e.target.value)}
                    placeholder="https://exemple.com"
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Media */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4" />
                Médias
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="logo_url">URL du Logo</Label>
                <Input
                  id="logo_url"
                  value={formData.logo_url}
                  onChange={(e) => handleChange("logo_url", e.target.value)}
                  placeholder="/assets/logo.png"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="photo_url">URL de la Photo</Label>
                <Input
                  id="photo_url"
                  value={formData.photo_url}
                  onChange={(e) => handleChange("photo_url", e.target.value)}
                  placeholder="/assets/photo.jpg"
                />
              </div>
            </CardContent>
          </Card>

          {/* Slug */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ExternalLink className="h-4 w-4" />
                URL de la Carte
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (partie de l'URL)</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    i-wasp.com/card/
                  </span>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleChange("slug", e.target.value)}
                    placeholder="maison-b-optic"
                    className="flex-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminCardEditor;
