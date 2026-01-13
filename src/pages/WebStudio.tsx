/**
 * WebStudio - Générateur de sites web IA
 * Génère des propositions de sites web sur-mesure via IA
 */

import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { WebsitePreview, GeneratingAnimation, ProposalPdfExport } from "@/components/studio";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Zap, 
  Globe, 
  Palette, 
  Check,
  Link as LinkIcon,
  MessageCircle,
  UtensilsCrossed,
  ShoppingBag,
  Briefcase,
  Camera,
  Heart,
  Dumbbell,
  Building2,
  Scissors,
  GraduationCap,
  Wrench,
  Eye,
  Rocket,
  History,
  FileText,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WebsiteProposal {
  siteName: string;
  tagline: string;
  colorPalette: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
  };
  pages: Array<{
    name: string;
    slug: string;
    sections: Array<{
      type: string;
      title: string;
      content: string;
      items?: string[];
    }>;
  }>;
  features: string[];
  estimatedPages: number;
  complexity: "simple" | "standard" | "premium";
}

interface Template {
  id: string;
  name: string;
  icon: React.ReactNode;
  businessType: string;
  style: string;
  colors: string;
  description: string;
  gradient: string;
}

const TEMPLATES: Template[] = [
  {
    id: "restaurant",
    name: "Restaurant",
    icon: <UtensilsCrossed className="w-5 h-5" />,
    businessType: "Restaurant gastronomique",
    style: "Élégant et chaleureux",
    colors: "Bordeaux, crème et or",
    description: "Menu, réservation en ligne, galerie photos",
    gradient: "from-amber-500/20 to-red-500/20",
  },
  {
    id: "ecommerce",
    name: "E-commerce",
    icon: <ShoppingBag className="w-5 h-5" />,
    businessType: "Boutique en ligne",
    style: "Moderne et épuré",
    colors: "Noir, blanc et accent coloré",
    description: "Catalogue produits, panier, paiement sécurisé",
    gradient: "from-purple-500/20 to-pink-500/20",
  },
  {
    id: "portfolio",
    name: "Portfolio",
    icon: <Camera className="w-5 h-5" />,
    businessType: "Portfolio créatif / Photographe",
    style: "Minimaliste et artistique",
    colors: "Noir et blanc avec accent",
    description: "Galerie, projets, à propos, contact",
    gradient: "from-gray-500/20 to-slate-500/20",
  },
  {
    id: "corporate",
    name: "Entreprise",
    icon: <Building2 className="w-5 h-5" />,
    businessType: "Cabinet de conseil / Entreprise B2B",
    style: "Professionnel et institutionnel",
    colors: "Bleu marine, gris et blanc",
    description: "Services, équipe, références, contact",
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    id: "beauty",
    name: "Beauté & Bien-être",
    icon: <Scissors className="w-5 h-5" />,
    businessType: "Salon de beauté / Spa",
    style: "Luxueux et apaisant",
    colors: "Rose gold, blanc et beige",
    description: "Prestations, tarifs, réservation, galerie",
    gradient: "from-pink-500/20 to-rose-500/20",
  },
  {
    id: "fitness",
    name: "Sport & Fitness",
    icon: <Dumbbell className="w-5 h-5" />,
    businessType: "Coach sportif / Salle de sport",
    style: "Dynamique et énergique",
    colors: "Orange, noir et blanc",
    description: "Programmes, tarifs, témoignages, inscription",
    gradient: "from-orange-500/20 to-yellow-500/20",
  },
  {
    id: "wedding",
    name: "Mariage & Événements",
    icon: <Heart className="w-5 h-5" />,
    businessType: "Wedding planner / Organisateur d'événements",
    style: "Romantique et raffiné",
    colors: "Blanc, doré et pastel",
    description: "Services, galerie, témoignages, devis",
    gradient: "from-rose-500/20 to-amber-500/20",
  },
  {
    id: "education",
    name: "Formation",
    icon: <GraduationCap className="w-5 h-5" />,
    businessType: "Centre de formation / Coach",
    style: "Moderne et inspirant",
    colors: "Vert, blanc et gris",
    description: "Formations, formateurs, inscription, blog",
    gradient: "from-green-500/20 to-emerald-500/20",
  },
  {
    id: "artisan",
    name: "Artisan",
    icon: <Wrench className="w-5 h-5" />,
    businessType: "Artisan / Services à domicile",
    style: "Authentique et fiable",
    colors: "Marron, beige et vert",
    description: "Services, réalisations, devis, contact",
    gradient: "from-amber-600/20 to-green-600/20",
  },
  {
    id: "consulting",
    name: "Consulting",
    icon: <Briefcase className="w-5 h-5" />,
    businessType: "Consultant indépendant / Freelance",
    style: "Épuré et professionnel",
    colors: "Violet, blanc et gris",
    description: "Expertise, services, cas clients, contact",
    gradient: "from-violet-500/20 to-indigo-500/20",
  }
];

const PRICING = {
  simple: { base: 200, baseMAD: 2000 },
  standard: { base: 350, baseMAD: 3500 },
  premium: { base: 500, baseMAD: 5000 },
};

const EXPRESS_SURCHARGE = { eur: 50, mad: 500 };
const PAGE_EXTRA = { eur: 30, mad: 300 };

export default function WebStudio() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    businessType: "",
    businessName: "",
    description: "",
    style: "",
    colors: "",
    websiteUrl: "",
    socialLinks: "",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [proposal, setProposal] = useState<WebsiteProposal | null>(null);
  const [isExpress, setIsExpress] = useState(false);
  const [savedProposalId, setSavedProposalId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"details" | "preview">("details");
  const { toast } = useToast();

  // Generate session ID for non-logged users
  const [sessionId] = useState(() => {
    const stored = localStorage.getItem("iwasp_studio_session");
    if (stored) return stored;
    const newId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("iwasp_studio_session", newId);
    return newId;
  });

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template.id);
    setFormData({
      ...formData,
      businessType: template.businessType,
      style: template.style,
      colors: template.colors,
      description: template.description,
    });
    toast({
      title: `Template "${template.name}" sélectionné`,
      description: "Les champs ont été pré-remplis. Personnalisez si besoin !",
    });
  };

  const handleGenerate = async () => {
    if (!formData.businessType.trim()) {
      toast({
        title: "Champ requis",
        description: "Veuillez indiquer le type d'entreprise ou d'activité",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setProposal(null);
    setSavedProposalId(null);

    try {
      const { data, error } = await supabase.functions.invoke("generate-website", {
        body: formData,
      });

      if (error) throw error;

      if (data.proposal) {
        setProposal(data.proposal);
        
        // Calculate price for saving
        const base = PRICING[data.proposal.complexity as keyof typeof PRICING];
        const extraPages = Math.max(0, data.proposal.estimatedPages - 5);
        const priceEur = base.base + (extraPages * PAGE_EXTRA.eur);
        const priceMad = base.baseMAD + (extraPages * PAGE_EXTRA.mad);

        // Save to database
        try {
          const { data: savedData, error: saveError } = await supabase
            .from("website_proposals")
            .insert({
              session_id: sessionId,
              form_data: formData,
              proposal: data.proposal,
              is_express: isExpress,
              price_eur: priceEur,
              price_mad: priceMad,
            })
            .select("id")
            .single();

          if (!saveError && savedData) {
            setSavedProposalId(savedData.id);
          }
        } catch (saveErr) {
          console.warn("Could not save proposal:", saveErr);
        }

        toast({
          title: "✨ Site généré !",
          description: "Votre proposition de site web est prête",
        });
      }
    } catch (error: any) {
      console.error("Generation error:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la génération",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const calculatePrice = () => {
    if (!proposal) return { eur: 0, mad: 0 };
    
    const base = PRICING[proposal.complexity];
    const extraPages = Math.max(0, proposal.estimatedPages - 5);
    
    let totalEur = base.base + (extraPages * PAGE_EXTRA.eur);
    let totalMAD = base.baseMAD + (extraPages * PAGE_EXTRA.mad);
    
    if (isExpress) {
      totalEur += EXPRESS_SURCHARGE.eur;
      totalMAD += EXPRESS_SURCHARGE.mad;
    }
    
    return { eur: totalEur, mad: totalMAD };
  };

  const handleContactWhatsApp = () => {
    const price = calculatePrice();
    const message = encodeURIComponent(
      `🚀 Demande de devis - Studio IA\n\n` +
      `📌 Projet: ${proposal?.siteName || formData.businessName || formData.businessType}\n` +
      `📄 Pages: ${proposal?.estimatedPages || "À définir"}\n` +
      `⚡ Express (24-48h): ${isExpress ? "Oui" : "Non"}\n` +
      `💰 Estimation: ${price.eur}€ / ${price.mad}DH\n\n` +
      `Je souhaite en savoir plus sur cette proposition !`
    );
    window.open(`https://wa.me/33626424394?text=${message}`, "_blank");
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              Générateur IA
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
              Créez votre site en{" "}
              <span className="text-primary">quelques secondes</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Décrivez votre projet, et notre IA génère instantanément une proposition 
              de site web sur-mesure avec structure, contenu et design.
            </p>

            {/* Pricing Pills */}
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Zap className="w-4 h-4 mr-2" />
                À partir de 200€ / 2000DH
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Rocket className="w-4 h-4 mr-2" />
                Express 24-48h: +50€ / +500DH
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Gallery */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Choisissez un template pour démarrer
            </h2>
            <p className="text-muted-foreground">
              Sélectionnez un style prédéfini ou personnalisez librement
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => handleSelectTemplate(template)}
                className={`group relative rounded-xl border-2 p-4 transition-all duration-300 text-left ${
                  selectedTemplate === template.id
                    ? "border-primary shadow-lg shadow-primary/20 ring-2 ring-primary/30 bg-primary/5"
                    : "border-border hover:border-primary/50 bg-card"
                }`}
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${template.gradient} flex items-center justify-center mb-3`}>
                  {template.icon}
                </div>
                <h3 className="font-semibold text-foreground text-sm">{template.name}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{template.description}</p>
                
                {selectedTemplate === template.id && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Generator Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Form */}
            <Card>
              <CardContent className="p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Palette className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">Décrivez votre projet</h2>
                </div>

                <div className="space-y-5">
                  <div>
                    <Label htmlFor="businessType">Type d'entreprise / Activité *</Label>
                    <Input
                      id="businessType"
                      placeholder="Ex: Restaurant gastronomique, Photographe..."
                      value={formData.businessType}
                      onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="businessName">Nom de l'entreprise</Label>
                    <Input
                      id="businessName"
                      placeholder="Votre nom ou nom de marque"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description du projet</Label>
                    <Textarea
                      id="description"
                      placeholder="Décrivez votre activité, vos objectifs, votre cible..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="mt-1 min-h-[100px]"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="style">Style souhaité</Label>
                      <Input
                        id="style"
                        placeholder="Moderne, Élégant, Minimaliste..."
                        value={formData.style}
                        onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="colors">Couleurs préférées</Label>
                      <Input
                        id="colors"
                        placeholder="Noir et or, Bleu marine..."
                        value={formData.colors}
                        onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
                      <LinkIcon className="w-4 h-4" />
                      Optionnel : Analysez un site ou vos réseaux
                    </p>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="websiteUrl">URL de site existant</Label>
                        <Input
                          id="websiteUrl"
                          placeholder="https://votre-site-actuel.com"
                          value={formData.websiteUrl}
                          onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="socialLinks">Réseaux sociaux</Label>
                        <Input
                          id="socialLinks"
                          placeholder="@instagram, facebook.com/page..."
                          value={formData.socialLinks}
                          onChange={(e) => setFormData({ ...formData, socialLinks: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full mt-6" 
                  size="lg"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Générer ma proposition
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Result */}
            <div className="space-y-6">
              {!proposal && !isGenerating && (
                <Card className="h-full min-h-[400px] flex items-center justify-center">
                  <CardContent className="text-center p-8">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-muted flex items-center justify-center">
                      <Globe className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Votre proposition apparaîtra ici
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Remplissez le formulaire et cliquez sur "Générer" pour voir 
                      la magie opérer en quelques secondes.
                    </p>
                  </CardContent>
                </Card>
              )}

              {isGenerating && (
                <Card className="min-h-[400px]">
                  <GeneratingAnimation />
                </Card>
              )}

              {proposal && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Tabs for Details/Preview */}
                  <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "details" | "preview")}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="details" className="gap-2">
                        <FileText className="w-4 h-4" />
                        Détails
                      </TabsTrigger>
                      <TabsTrigger value="preview" className="gap-2">
                        <Eye className="w-4 h-4" />
                        Aperçu
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="mt-4">
                      {/* Site Details Card */}
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-6">
                            <div>
                              <h3 className="text-2xl font-bold text-foreground">{proposal.siteName}</h3>
                              <p className="text-muted-foreground">{proposal.tagline}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge>
                                {proposal.complexity.charAt(0).toUpperCase() + proposal.complexity.slice(1)}
                              </Badge>
                              <ProposalPdfExport 
                                proposal={proposal}
                                priceEur={calculatePrice().eur}
                                priceMad={calculatePrice().mad}
                                isExpress={isExpress}
                                formData={formData}
                              />
                            </div>
                          </div>

                          {/* Color Palette */}
                          <div className="mb-6">
                            <h4 className="text-sm font-medium text-foreground mb-3">Palette de couleurs</h4>
                            <div className="flex gap-2">
                              {Object.entries(proposal.colorPalette).map(([name, color]) => (
                                <div key={name} className="text-center">
                                  <div 
                                    className="w-10 h-10 rounded-lg border border-border shadow-sm"
                                    style={{ backgroundColor: color }}
                                  />
                                  <span className="text-[10px] text-muted-foreground mt-1 block capitalize">
                                    {name}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Pages */}
                          <div className="mb-6">
                            <h4 className="text-sm font-medium text-foreground mb-3">
                              Structure du site ({proposal.estimatedPages} pages)
                            </h4>
                            <div className="space-y-2">
                              {proposal.pages.map((page, idx) => (
                                <div key={idx} className="p-3 rounded-lg bg-muted/50 border border-border">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-foreground text-sm">{page.name}</span>
                                    <span className="text-xs text-muted-foreground">/{page.slug}</span>
                                  </div>
                                  <div className="flex flex-wrap gap-1">
                                    {page.sections.map((section, sIdx) => (
                                      <Badge key={sIdx} variant="secondary" className="text-[10px]">
                                        {section.type}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Features */}
                          <div>
                            <h4 className="text-sm font-medium text-foreground mb-3">Fonctionnalités incluses</h4>
                            <div className="flex flex-wrap gap-2">
                              {proposal.features.map((feature, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  <Check className="w-3 h-3 mr-1" />
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="preview" className="mt-4">
                      <WebsitePreview proposal={proposal} />
                    </TabsContent>
                  </Tabs>

                  {/* Pricing Card */}
                  <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                    <CardContent className="p-6">
                      <h4 className="text-sm font-medium text-foreground mb-4">Estimation tarifaire</h4>
                      
                      {/* Express Toggle */}
                      <button
                        onClick={() => setIsExpress(!isExpress)}
                        className="w-full mb-4"
                      >
                        <div className="flex items-center justify-between p-4 rounded-xl bg-background border border-border hover:border-primary/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                              isExpress ? 'bg-primary border-primary' : 'border-muted-foreground'
                            }`}>
                              {isExpress && <Check className="w-3 h-3 text-primary-foreground" />}
                            </div>
                            <div className="text-left">
                              <div className="flex items-center gap-2">
                                <Zap className="w-4 h-4 text-primary" />
                                <span className="font-medium text-foreground text-sm">Livraison Express (24-48h)</span>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Passez devant la file d'attente
                              </p>
                            </div>
                          </div>
                          <span className="text-sm font-medium text-primary">+50€ / +500DH</span>
                        </div>
                      </button>

                      {/* Price Display */}
                      <div className="p-4 rounded-xl bg-background border border-border mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Total estimé</span>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-foreground">
                              {calculatePrice().eur}€
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {calculatePrice().mad} DH
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground mb-4">
                        * Prix indicatif. Le devis final dépend des fonctionnalités et 
                        personnalisations demandées.
                      </p>

                      {/* CTA Buttons */}
                      <div className="space-y-3">
                        <Button className="w-full" size="lg" onClick={handleContactWhatsApp}>
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Commander mon site clé en main
                        </Button>
                        <Button variant="outline" className="w-full" size="lg" onClick={handleContactWhatsApp}>
                          <Eye className="w-4 h-4 mr-2" />
                          Discuter sur WhatsApp
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Comment ça marche ?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Décrivez votre projet",
                description: "Indiquez votre activité, style souhaité et éventuellement vos réseaux ou site existant."
              },
              {
                step: "2",
                title: "L'IA génère votre site",
                description: "En quelques secondes, obtenez une proposition complète avec structure, design et contenu."
              },
              {
                step: "3",
                title: "Commandez & recevez",
                description: "Validez le devis et recevez votre site en quelques jours (24-48h en express)."
              }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">{item.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
