import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateCard, useUpdateCard, useCards, DigitalCard } from "@/hooks/useCards";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DigitalCard as DigitalCardPreview } from "@/components/DigitalCard";
import { PhotoUpload } from "@/components/PhotoUpload";
import { templateInfo, TemplateType } from "@/components/templates/CardTemplates";
import { toast } from "sonner";
import { 
  User, Mail, Phone, MapPin, Globe, Briefcase, Building2, 
  MessageSquare, Linkedin, Instagram, Twitter, Save, ArrowLeft,
  Sparkles, Camera, Image, Palette, Check
} from "lucide-react";

const CreateCard = () => {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: cards = [] } = useCards();
  const createCard = useCreateCard();
  const updateCard = useUpdateCard();
  
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>("executive");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    title: "",
    company: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    instagram: "",
    twitter: "",
    tagline: "",
    photoUrl: null as string | null,
    logoUrl: null as string | null,
  });

  // Load card data if editing
  useEffect(() => {
    if (editId && cards.length > 0) {
      const card = cards.find(c => c.id === editId);
      if (card) {
        setFormData({
          firstName: card.first_name || "",
          lastName: card.last_name || "",
          title: card.title || "",
          company: card.company || "",
          email: card.email || "",
          phone: card.phone || "",
          location: card.location || "",
          website: card.website || "",
          linkedin: card.linkedin || "",
          instagram: card.instagram || "",
          twitter: card.twitter || "",
          tagline: card.tagline || "",
          photoUrl: card.photo_url || null,
          logoUrl: card.logo_url || null,
        });
        setSelectedTemplate((card.template as TemplateType) || "executive");
      }
    }
  }, [editId, cards]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.firstName || !formData.lastName) {
      toast.error("Veuillez renseigner votre prénom et nom");
      return;
    }

    try {
      if (editId) {
        await updateCard.mutateAsync({
          id: editId,
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            title: formData.title || null,
            company: formData.company || null,
            email: formData.email || null,
            phone: formData.phone || null,
            location: formData.location || null,
            website: formData.website || null,
            linkedin: formData.linkedin || null,
            instagram: formData.instagram || null,
            twitter: formData.twitter || null,
            tagline: formData.tagline || null,
            photo_url: formData.photoUrl,
            logo_url: formData.logoUrl,
            template: selectedTemplate,
          },
        });
      } else {
        await createCard.mutateAsync({
          first_name: formData.firstName,
          last_name: formData.lastName,
          title: formData.title || undefined,
          company: formData.company || undefined,
          email: formData.email || undefined,
          phone: formData.phone || undefined,
          location: formData.location || undefined,
          website: formData.website || undefined,
          linkedin: formData.linkedin || undefined,
          instagram: formData.instagram || undefined,
          twitter: formData.twitter || undefined,
          tagline: formData.tagline || undefined,
          photo_url: formData.photoUrl || undefined,
          logo_url: formData.logoUrl || undefined,
          template: selectedTemplate,
        });
      }
      navigate("/dashboard");
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="mb-8 animate-fade-up">
            <button
              onClick={() => navigate("/dashboard")}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft size={18} />
              Retour au dashboard
            </button>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
              {editId ? "Modifier la carte" : "Créer une carte"}
            </h1>
            <p className="text-muted-foreground">
              {editId ? "Mettez à jour les informations de votre carte" : "Personnalisez votre carte de visite digitale"}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <div className="animate-fade-right" style={{ animationDelay: '0.2s' }}>
              <Card variant="premium" className="p-6">
                <Tabs defaultValue="template" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-secondary mb-6">
                    <TabsTrigger value="template">Template</TabsTrigger>
                    <TabsTrigger value="media">Media</TabsTrigger>
                    <TabsTrigger value="info">Infos</TabsTrigger>
                    <TabsTrigger value="social">Social</TabsTrigger>
                  </TabsList>

                  <TabsContent value="template" className="space-y-4">
                    <div>
                      <Label className="flex items-center gap-2 mb-4">
                        <Palette size={14} className="text-chrome" />
                        Choisissez un template
                      </Label>
                      <div className="grid grid-cols-2 gap-3">
                        {templateInfo.map((template) => (
                          <button
                            key={template.id}
                            type="button"
                            onClick={() => setSelectedTemplate(template.id as TemplateType)}
                            className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                              selectedTemplate === template.id
                                ? "border-primary bg-primary/5"
                                : "border-border/50 hover:border-border"
                            }`}
                          >
                            {selectedTemplate === template.id && (
                              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                <Check size={12} className="text-primary-foreground" />
                              </div>
                            )}
                            <h4 className="font-medium text-foreground mb-1">{template.name}</h4>
                            <p className="text-xs text-muted-foreground">{template.description}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="media" className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="flex items-center gap-2 mb-3">
                          <Camera size={14} className="text-chrome" />
                          Photo de profil
                        </Label>
                        <PhotoUpload
                          value={formData.photoUrl}
                          onChange={(url) => setFormData({ ...formData, photoUrl: url })}
                          type="photo"
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          Recommandé: Image carrée, 400x400px minimum
                        </p>
                      </div>

                      <div>
                        <Label className="flex items-center gap-2 mb-3">
                          <Image size={14} className="text-chrome" />
                          Logo de l'entreprise
                        </Label>
                        <PhotoUpload
                          value={formData.logoUrl}
                          onChange={(url) => setFormData({ ...formData, logoUrl: url })}
                          type="logo"
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          Recommandé: Format rectangulaire, fond transparent
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="info" className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="flex items-center gap-2">
                          <User size={14} className="text-chrome" />
                          Prénom *
                        </Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          placeholder="Alexandre"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="bg-surface-2 border-border/50 h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="flex items-center gap-2">
                          <User size={14} className="text-chrome" />
                          Nom *
                        </Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          placeholder="Dubois"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="bg-surface-2 border-border/50 h-11"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="title" className="flex items-center gap-2">
                        <Briefcase size={14} className="text-chrome" />
                        Fonction
                      </Label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="Directeur Général"
                        value={formData.title}
                        onChange={handleChange}
                        className="bg-surface-2 border-border/50 h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company" className="flex items-center gap-2">
                        <Building2 size={14} className="text-chrome" />
                        Entreprise
                      </Label>
                      <Input
                        id="company"
                        name="company"
                        placeholder="Prestige Corp"
                        value={formData.company}
                        onChange={handleChange}
                        className="bg-surface-2 border-border/50 h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail size={14} className="text-chrome" />
                        Email
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="contact@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="bg-surface-2 border-border/50 h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone size={14} className="text-chrome" />
                        Téléphone
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="+33 6 12 34 56 78"
                        value={formData.phone}
                        onChange={handleChange}
                        className="bg-surface-2 border-border/50 h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location" className="flex items-center gap-2">
                        <MapPin size={14} className="text-chrome" />
                        Localisation
                      </Label>
                      <Input
                        id="location"
                        name="location"
                        placeholder="Paris, France"
                        value={formData.location}
                        onChange={handleChange}
                        className="bg-surface-2 border-border/50 h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tagline" className="flex items-center gap-2">
                        <MessageSquare size={14} className="text-chrome" />
                        Phrase emblématique
                      </Label>
                      <Input
                        id="tagline"
                        name="tagline"
                        placeholder="L'excellence en toute simplicité"
                        value={formData.tagline}
                        onChange={handleChange}
                        className="bg-surface-2 border-border/50 h-11"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="social" className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="website" className="flex items-center gap-2">
                        <Globe size={14} className="text-chrome" />
                        Site web
                      </Label>
                      <Input
                        id="website"
                        name="website"
                        placeholder="www.example.com"
                        value={formData.website}
                        onChange={handleChange}
                        className="bg-surface-2 border-border/50 h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="linkedin" className="flex items-center gap-2">
                        <Linkedin size={14} className="text-chrome" />
                        LinkedIn
                      </Label>
                      <Input
                        id="linkedin"
                        name="linkedin"
                        placeholder="votre-profil"
                        value={formData.linkedin}
                        onChange={handleChange}
                        className="bg-surface-2 border-border/50 h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instagram" className="flex items-center gap-2">
                        <Instagram size={14} className="text-chrome" />
                        Instagram
                      </Label>
                      <Input
                        id="instagram"
                        name="instagram"
                        placeholder="@votre_compte"
                        value={formData.instagram}
                        onChange={handleChange}
                        className="bg-surface-2 border-border/50 h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="twitter" className="flex items-center gap-2">
                        <Twitter size={14} className="text-chrome" />
                        Twitter / X
                      </Label>
                      <Input
                        id="twitter"
                        name="twitter"
                        placeholder="@votre_compte"
                        value={formData.twitter}
                        onChange={handleChange}
                        className="bg-surface-2 border-border/50 h-11"
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex gap-4 mt-8">
                  <Button 
                    variant="chrome" 
                    className="flex-1"
                    onClick={handleSubmit}
                    disabled={createCard.isPending || updateCard.isPending}
                  >
                    {createCard.isPending || updateCard.isPending ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-5 h-5 rounded-full border-2 border-background/30 border-t-background animate-spin" />
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Save size={18} />
                        {editId ? "Enregistrer" : "Créer la carte"}
                      </span>
                    )}
                  </Button>
                </div>
              </Card>
            </div>

            {/* Preview */}
            <div className="lg:sticky lg:top-24 self-start animate-fade-left" style={{ animationDelay: '0.4s' }}>
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-foreground/5 border border-foreground/10 mb-4">
                  <Sparkles size={14} className="text-chrome" />
                  <span className="text-sm text-muted-foreground">Aperçu en direct</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Votre carte se met à jour automatiquement
                </p>
              </div>
              
              <DigitalCardPreview 
                data={{
                  firstName: formData.firstName || "Alexandre",
                  lastName: formData.lastName || "Dubois",
                  title: formData.title || "Directeur Général",
                  company: formData.company || "Prestige Corp",
                  email: formData.email || "a.dubois@prestige.com",
                  phone: formData.phone || "+33 6 12 34 56 78",
                  location: formData.location || "Paris, France",
                  website: formData.website || "prestige-corp.com",
                  linkedin: formData.linkedin || "alexandre-dubois",
                  instagram: formData.instagram || "@adubois",
                  tagline: formData.tagline || "L'excellence en toute simplicité",
                  photoUrl: formData.photoUrl,
                  logoUrl: formData.logoUrl,
                }} 
                template={selectedTemplate}
                showWalletButtons={false}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateCard;
