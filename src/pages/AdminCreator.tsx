/**
 * Admin Creator Page - Internal card creation without payment
 * Features:
 * - Create cards manually for internal use
 * - Choose any template (including private ones)
 * - Generate cards without payment
 * - Assign cards to existing clients or create new accounts
 * - Status: "Créée par Admin"
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminGuard } from "@/components/AdminGuard";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Shield, 
  Plus, 
  User, 
  CreditCard, 
  Palette,
  Upload,
  Check,
  Loader2,
  ArrowLeft,
  UserPlus,
  Link2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllTemplates, getVisibilityLabel, getVisibilityColor } from "@/lib/templateRegistry";

interface CardFormData {
  firstName: string;
  lastName: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  whatsapp: string;
  linkedin: string;
  instagram: string;
  website: string;
  location: string;
  tagline: string;
  template: string;
  photoUrl: string;
  logoUrl: string;
}

const initialFormData: CardFormData = {
  firstName: "",
  lastName: "",
  title: "",
  company: "",
  email: "",
  phone: "",
  whatsapp: "",
  linkedin: "",
  instagram: "",
  website: "",
  location: "",
  tagline: "",
  template: "signature",
  photoUrl: "",
  logoUrl: "",
};

export default function AdminCreator() {
  return (
    <AdminGuard>
      <AdminCreatorContent />
    </AdminGuard>
  );
}

function AdminCreatorContent() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState<CardFormData>(initialFormData);
  const [isCreating, setIsCreating] = useState(false);
  const [createdCard, setCreatedCard] = useState<{ id: string; slug: string } | null>(null);
  const [assignMode, setAssignMode] = useState<"new" | "existing" | null>(null);
  const [existingEmail, setExistingEmail] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  
  const templates = getAllTemplates();

  const handleInputChange = (field: keyof CardFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `admin-${Date.now()}.${fileExt}`;
    const filePath = `admin-uploads/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('card-assets')
      .upload(filePath, file);

    if (uploadError) {
      toast.error("Erreur upload photo");
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('card-assets')
      .getPublicUrl(filePath);

    setFormData(prev => ({ ...prev, photoUrl: publicUrl }));
    toast.success("Photo uploadée");
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `admin-logo-${Date.now()}.${fileExt}`;
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
    toast.success("Logo uploadé");
  };

  const createCard = async (targetUserId: string) => {
    // Generate a unique slug
    const baseSlug = `${formData.firstName}-${formData.lastName}`.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const uniqueSlug = `${baseSlug}-${Date.now().toString(36)}`;
    
    const { data: card, error } = await supabase
      .from('digital_cards')
      .insert([{
        user_id: targetUserId,
        slug: uniqueSlug,
        first_name: formData.firstName,
        last_name: formData.lastName,
        title: formData.title || null,
        company: formData.company || null,
        email: formData.email || null,
        phone: formData.phone || null,
        whatsapp: formData.whatsapp || null,
        linkedin: formData.linkedin || null,
        instagram: formData.instagram || null,
        website: formData.website || null,
        location: formData.location || null,
        tagline: formData.tagline || null,
        template: formData.template,
        photo_url: formData.photoUrl || null,
        logo_url: formData.logoUrl || null,
        is_active: true,
        nfc_enabled: true,
        wallet_enabled: true,
        hide_branding: false,
      }])
      .select()
      .single();

    if (error) throw error;
    return card;
  };

  const handleCreateForAdmin = async () => {
    if (!formData.firstName || !formData.lastName) {
      toast.error("Prénom et nom obligatoires");
      return;
    }

    if (!user) {
      toast.error("Non authentifié");
      return;
    }

    setIsCreating(true);
    try {
      const card = await createCard(user.id);
      setCreatedCard({ id: card.id, slug: card.slug });
      toast.success("Carte créée par Admin ✓");
    } catch (error: any) {
      console.error("Error creating card:", error);
      toast.error("Erreur: " + error.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleAssignToExisting = async () => {
    if (!existingEmail) {
      toast.error("Email client requis");
      return;
    }

    setIsCreating(true);
    try {
      // Find user by email in profiles (we can't query auth.users directly)
      // We need to create the card and assign it later or use a different approach
      // For now, we'll create an admin card and the admin can manually update the user_id
      
      toast.info("Fonctionnalité en cours de développement");
      // TODO: Implement user lookup and card assignment
    } catch (error: any) {
      toast.error("Erreur: " + error.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateWithNewAccount = async () => {
    if (!newUserEmail || !newUserPassword) {
      toast.error("Email et mot de passe requis");
      return;
    }

    if (!formData.firstName || !formData.lastName) {
      toast.error("Prénom et nom obligatoires");
      return;
    }

    setIsCreating(true);
    try {
      // Create new user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUserEmail,
        password: newUserPassword,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Échec création compte");

      // Create card for new user
      const card = await createCard(authData.user.id);
      setCreatedCard({ id: card.id, slug: card.slug });
      
      toast.success("Compte + carte créés ✓");
    } catch (error: any) {
      console.error("Error:", error);
      toast.error("Erreur: " + error.message);
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setCreatedCard(null);
    setAssignMode(null);
    setExistingEmail("");
    setNewUserEmail("");
    setNewUserPassword("");
  };

  // Success state
  if (createdCard) {
    return (
      <div className="min-h-dvh bg-background p-6">
        <div className="max-w-lg mx-auto">
          <Card className="bg-card border-accent/20">
            <CardContent className="pt-8 text-center space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-accent/20 flex items-center justify-center">
                <Check className="h-10 w-10 text-accent" />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-foreground">Carte créée</h2>
                <p className="text-muted-foreground mt-2">
                  Statut: <Badge variant="outline" className="bg-accent/10 text-accent">Créée par Admin</Badge>
                </p>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Lien public</p>
                <code className="text-sm text-accent break-all">
                  /card/{createdCard.slug}
                </code>
              </div>

              <div className="flex flex-col gap-3">
                <Button 
                  onClick={() => navigate(`/card/${createdCard.slug}`)}
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  Voir la carte
                </Button>
                <Button 
                  variant="outline" 
                  onClick={resetForm}
                >
                  Créer une autre carte
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate("/admin/orders")}
                >
                  Retour Admin
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate("/admin/orders")}
          >
            <ArrowLeft size={20} />
          </Button>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-accent" />
            <h1 className="text-lg font-bold text-foreground">Admin Creator</h1>
          </div>
          <Badge variant="outline" className="ml-auto bg-accent/10 text-accent border-accent/30">
            Mode Admin
          </Badge>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Template Selection */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Palette size={20} className="text-accent" />
              Template
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleInputChange("template", template.id)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    formData.template === template.id
                      ? "border-accent bg-accent/10"
                      : "border-border bg-secondary/30 hover:border-accent/50"
                  }`}
                >
                  <p className="font-medium text-sm text-foreground truncate">{template.name}</p>
                  <Badge className={`text-xs mt-1 ${getVisibilityColor(template.visibility)}`}>
                    {getVisibilityLabel(template.visibility)}
                  </Badge>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Identity Form */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <User size={20} className="text-accent" />
              Identité
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-foreground">Prénom *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className="bg-secondary border-border text-foreground"
                  placeholder="Prénom"
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-foreground">Nom *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className="bg-secondary border-border text-foreground"
                  placeholder="Nom"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title" className="text-foreground">Titre</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="bg-secondary border-border text-foreground"
                  placeholder="CEO, Manager..."
                />
              </div>
              <div>
                <Label htmlFor="company" className="text-foreground">Entreprise</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  className="bg-secondary border-border text-foreground"
                  placeholder="Nom entreprise"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="tagline" className="text-foreground">Tagline</Label>
              <Textarea
                id="tagline"
                value={formData.tagline}
                onChange={(e) => handleInputChange("tagline", e.target.value)}
                className="bg-secondary border-border text-foreground resize-none"
                placeholder="Slogan ou description courte"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="location" className="text-foreground">Localisation</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="bg-secondary border-border text-foreground"
                placeholder="Ville, Pays"
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <CreditCard size={20} className="text-accent" />
              Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="bg-secondary border-border text-foreground"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-foreground">Téléphone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="bg-secondary border-border text-foreground"
                  placeholder="+212..."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="whatsapp" className="text-foreground">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  value={formData.whatsapp}
                  onChange={(e) => handleInputChange("whatsapp", e.target.value)}
                  className="bg-secondary border-border text-foreground"
                  placeholder="+212..."
                />
              </div>
              <div>
                <Label htmlFor="linkedin" className="text-foreground">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={formData.linkedin}
                  onChange={(e) => handleInputChange("linkedin", e.target.value)}
                  className="bg-secondary border-border text-foreground"
                  placeholder="URL LinkedIn"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="instagram" className="text-foreground">Instagram</Label>
                <Input
                  id="instagram"
                  value={formData.instagram}
                  onChange={(e) => handleInputChange("instagram", e.target.value)}
                  className="bg-secondary border-border text-foreground"
                  placeholder="@username"
                />
              </div>
              <div>
                <Label htmlFor="website" className="text-foreground">Site web</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  className="bg-secondary border-border text-foreground"
                  placeholder="https://..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Media Upload */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Upload size={20} className="text-accent" />
              Médias
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-foreground">Photo de profil</Label>
                <div className="mt-2">
                  {formData.photoUrl ? (
                    <div className="relative">
                      <img 
                        src={formData.photoUrl} 
                        alt="Photo" 
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-6 w-6 p-0"
                        onClick={() => handleInputChange("photoUrl", "")}
                      >
                        ×
                      </Button>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center w-24 h-24 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoUpload}
                      />
                      <Plus className="h-6 w-6 text-muted-foreground" />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <Label className="text-foreground">Logo</Label>
                <div className="mt-2">
                  {formData.logoUrl ? (
                    <div className="relative">
                      <img 
                        src={formData.logoUrl} 
                        alt="Logo" 
                        className="w-24 h-24 object-contain rounded-lg bg-secondary p-2"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-6 w-6 p-0"
                        onClick={() => handleInputChange("logoUrl", "")}
                      >
                        ×
                      </Button>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center w-24 h-24 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoUpload}
                      />
                      <Plus className="h-6 w-6 text-muted-foreground" />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Création</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="admin" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-secondary">
                <TabsTrigger value="admin" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                  Carte Admin
                </TabsTrigger>
                <TabsTrigger value="new" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                  Nouveau client
                </TabsTrigger>
                <TabsTrigger value="existing" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                  Client existant
                </TabsTrigger>
              </TabsList>

              <TabsContent value="admin" className="mt-4 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Créer une carte assignée à votre compte admin. Peut être transférée plus tard.
                </p>
                <Button
                  onClick={handleCreateForAdmin}
                  disabled={isCreating || !formData.firstName || !formData.lastName}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Création...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Créer carte Admin
                    </>
                  )}
                </Button>
              </TabsContent>

              <TabsContent value="new" className="mt-4 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Créer un compte client et une carte en même temps.
                </p>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="newEmail" className="text-foreground">Email client</Label>
                    <Input
                      id="newEmail"
                      type="email"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      className="bg-secondary border-border text-foreground"
                      placeholder="client@email.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newPassword" className="text-foreground">Mot de passe</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      className="bg-secondary border-border text-foreground"
                      placeholder="Mot de passe initial"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleCreateWithNewAccount}
                  disabled={isCreating || !newUserEmail || !newUserPassword || !formData.firstName || !formData.lastName}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Création...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Créer compte + carte
                    </>
                  )}
                </Button>
              </TabsContent>

              <TabsContent value="existing" className="mt-4 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Assigner une carte à un client existant (par email).
                </p>
                <div>
                  <Label htmlFor="existingEmail" className="text-foreground">Email du client</Label>
                  <Input
                    id="existingEmail"
                    type="email"
                    value={existingEmail}
                    onChange={(e) => setExistingEmail(e.target.value)}
                    className="bg-secondary border-border text-foreground"
                    placeholder="client@email.com"
                  />
                </div>
                <Button
                  onClick={handleAssignToExisting}
                  disabled={isCreating || !existingEmail || !formData.firstName || !formData.lastName}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Recherche...
                    </>
                  ) : (
                    <>
                      <Link2 className="mr-2 h-4 w-4" />
                      Assigner au client
                    </>
                  )}
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
