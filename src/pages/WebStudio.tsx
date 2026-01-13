/**
 * WebStudio - Générateur de sites web IA
 * Design Premium Noir & Or - Style i-wasp
 */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
import { CoutureNavbar } from "@/components/CoutureNavbar";
import { CoutureFooter } from "@/components/CoutureFooter";
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
  Loader2,
  ArrowRight,
  CheckCircle2,
  Clock,
  Package
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Palette Premium Noir & Or
const STUDIO = {
  noir: "#050505",
  noirSoft: "#0A0A0A",
  noirCard: "#111111",
  or: "#D4A853",
  orLight: "#E8C87A",
  orDark: "#B8923C",
  ivoire: "#F5F5F5",
  gris: "#6B6B6B",
  grisClair: "#9A9A9A",
};

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
    <div className="min-h-screen" style={{ backgroundColor: STUDIO.noir }}>
      <CoutureNavbar />
      
      {/* ═══════════════════════════════════════════════════════════════════
          HERO PREMIUM — Noir & Or avec Mockup Laptop
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="min-h-screen relative overflow-hidden pt-20">
        {/* Gradient de fond */}
        <div 
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 70% 30%, ${STUDIO.or}15 0%, transparent 50%), 
                         radial-gradient(ellipse at 30% 70%, ${STUDIO.or}08 0%, transparent 50%)`,
          }}
        />
        
        {/* Grain texture */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[calc(100vh-80px)] py-16">
            
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Badge */}
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
                style={{ 
                  backgroundColor: `${STUDIO.or}15`,
                  border: `1px solid ${STUDIO.or}30`,
                }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Sparkles size={14} style={{ color: STUDIO.or }} />
                <span 
                  className="text-[11px] uppercase tracking-[0.2em] font-medium"
                  style={{ color: STUDIO.or }}
                >
                  IA + Expertise humaine
                </span>
              </motion.div>
              
              {/* Headline */}
              <h1 
                className="font-display text-4xl md:text-5xl lg:text-6xl font-light leading-[1.1] tracking-tight mb-6"
                style={{ color: STUDIO.ivoire }}
              >
                Tout votre univers numérique,{" "}
                <span className="italic" style={{ color: STUDIO.or }}>
                  clé en main.
                </span>
              </h1>
              
              {/* Subtitle */}
              <p 
                className="text-base md:text-lg font-light leading-relaxed max-w-xl mb-8"
                style={{ color: STUDIO.gris }}
              >
                i-wasp Studio utilise l'IA et son expertise pour créer des sites sur mesure, 
                prêts à l'emploi : identité, pages, textes et intégrations essentielles.
              </p>
              
              {/* Features list */}
              <ul className="space-y-3 mb-10">
                {[
                  "Sites vitrines et e-commerce sur mesure",
                  "Génération intelligente de contenu grâce à l'IA",
                  "Livraison clé en main, prête à l'usage"
                ].map((feature, i) => (
                  <motion.li 
                    key={i}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                  >
                    <CheckCircle2 size={18} style={{ color: STUDIO.or }} />
                    <span 
                      className="text-sm font-light"
                      style={{ color: STUDIO.grisClair }}
                    >
                      {feature}
                    </span>
                  </motion.li>
                ))}
              </ul>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <motion.button
                  onClick={() => document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 rounded-xl font-medium text-sm flex items-center justify-center gap-3 transition-all duration-300 hover:scale-105"
                  style={{ 
                    backgroundColor: STUDIO.or,
                    color: STUDIO.noir,
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  Décrire mon projet
                  <ArrowRight size={16} />
                </motion.button>
                
                <motion.button
                  onClick={() => window.open("https://wa.me/33626424394?text=Bonjour, je souhaite créer un site web professionnel.", "_blank")}
                  className="px-8 py-4 rounded-xl font-medium text-sm flex items-center justify-center gap-3 transition-all duration-300"
                  style={{ 
                    backgroundColor: "transparent",
                    color: STUDIO.ivoire,
                    border: `1px solid ${STUDIO.ivoire}20`,
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MessageCircle size={16} />
                  Parler sur WhatsApp
                </motion.button>
              </div>
              
              {/* Trust badges */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Clock size={14} style={{ color: STUDIO.or }} />
                  <span className="text-xs" style={{ color: STUDIO.gris }}>Livraison 48h</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package size={14} style={{ color: STUDIO.or }} />
                  <span className="text-xs" style={{ color: STUDIO.gris }}>Site complet</span>
                </div>
              </div>
            </motion.div>
            
            {/* Right: Laptop Mockup with floating badges */}
            <motion.div
              className="relative hidden lg:block"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Laptop Mockup */}
              <div 
                className="relative mx-auto"
                style={{
                  maxWidth: "550px",
                }}
              >
                {/* Laptop frame */}
                <div 
                  className="rounded-t-xl p-2"
                  style={{ 
                    backgroundColor: STUDIO.noirCard,
                    border: `1px solid ${STUDIO.ivoire}10`,
                  }}
                >
                  {/* Screen */}
                  <div 
                    className="rounded-lg overflow-hidden aspect-[16/10]"
                    style={{ 
                      backgroundColor: STUDIO.noirSoft,
                      boxShadow: `inset 0 0 30px ${STUDIO.noir}`,
                    }}
                  >
                    {/* Fake website preview */}
                    <div className="p-4 h-full flex flex-col">
                      {/* Browser bar */}
                      <div 
                        className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg"
                        style={{ backgroundColor: `${STUDIO.ivoire}05` }}
                      >
                        <div className="flex gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#FF5F57" }} />
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#FFBD2E" }} />
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#28CA41" }} />
                        </div>
                        <div 
                          className="flex-1 text-center text-[10px] px-4 py-1 rounded"
                          style={{ backgroundColor: `${STUDIO.ivoire}05`, color: STUDIO.gris }}
                        >
                          votre-site.com
                        </div>
                      </div>
                      
                      {/* Fake content */}
                      <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
                        <div 
                          className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center"
                          style={{ backgroundColor: STUDIO.or }}
                        >
                          <span className="font-bold text-lg" style={{ color: STUDIO.noir }}>P</span>
                        </div>
                        <div 
                          className="text-[10px] uppercase tracking-[0.3em] mb-2"
                          style={{ color: STUDIO.gris }}
                        >
                          Premium Agency
                        </div>
                        <div 
                          className="text-xs font-light"
                          style={{ color: STUDIO.grisClair }}
                        >
                          Votre site professionnel
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Laptop base */}
                <div 
                  className="h-4 rounded-b-xl mx-6"
                  style={{ 
                    backgroundColor: STUDIO.noirCard,
                    borderBottom: `1px solid ${STUDIO.ivoire}10`,
                    borderLeft: `1px solid ${STUDIO.ivoire}10`,
                    borderRight: `1px solid ${STUDIO.ivoire}10`,
                  }}
                />
                <div 
                  className="h-1 rounded-b-xl mx-16"
                  style={{ backgroundColor: STUDIO.noirCard }}
                />
              </div>
              
              {/* Floating Badges */}
              <motion.div
                className="absolute -top-4 right-0 px-4 py-2 rounded-full"
                style={{ 
                  backgroundColor: STUDIO.noirCard,
                  border: `1px solid ${STUDIO.or}30`,
                }}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="flex items-center gap-2 text-xs" style={{ color: STUDIO.or }}>
                  <Sparkles size={12} />
                  Généré par IA
                </span>
              </motion.div>
              
              <motion.div
                className="absolute top-1/3 -right-4 px-4 py-2 rounded-full"
                style={{ 
                  backgroundColor: STUDIO.noirCard,
                  border: `1px solid ${STUDIO.ivoire}15`,
                }}
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                <span className="flex items-center gap-2 text-xs" style={{ color: STUDIO.ivoire }}>
                  <Zap size={12} />
                  Prêt à l'emploi
                </span>
              </motion.div>
              
              <motion.div
                className="absolute bottom-1/4 -left-4 px-4 py-2 rounded-full"
                style={{ 
                  backgroundColor: STUDIO.noirCard,
                  border: `1px solid ${STUDIO.or}30`,
                }}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <span className="flex items-center gap-2 text-xs" style={{ color: STUDIO.or }}>
                  <Package size={12} />
                  Clé en main
                </span>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <span 
              className="text-[10px] uppercase tracking-[0.3em]"
              style={{ color: STUDIO.gris }}
            >
              Scroll
            </span>
            <motion.div
              className="w-px h-8"
              style={{ backgroundColor: STUDIO.gris }}
              animate={{ scaleY: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
        </div>
      </section>

      {/* Templates Gallery */}
      <section 
        id="generator"
        className="py-20"
        style={{ backgroundColor: STUDIO.noirSoft }}
      >
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <span 
              className="text-[10px] uppercase tracking-[0.4em] font-light"
              style={{ color: STUDIO.or }}
            >
              Templates
            </span>
            <h2 
              className="font-display text-2xl md:text-3xl font-light mt-4 tracking-tight"
              style={{ color: STUDIO.ivoire }}
            >
              Choisissez un template pour démarrer
            </h2>
            <p 
              className="text-sm font-light mt-3"
              style={{ color: STUDIO.gris }}
            >
              Sélectionnez un style prédéfini ou personnalisez librement
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {TEMPLATES.map((template) => (
              <motion.button
                key={template.id}
                onClick={() => handleSelectTemplate(template)}
                className="group relative rounded-xl p-4 transition-all duration-300 text-left"
                style={{
                  backgroundColor: selectedTemplate === template.id ? `${STUDIO.or}10` : STUDIO.noirCard,
                  border: selectedTemplate === template.id 
                    ? `2px solid ${STUDIO.or}` 
                    : `1px solid ${STUDIO.ivoire}10`,
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                  style={{ 
                    backgroundColor: `${STUDIO.or}20`,
                    color: STUDIO.or,
                  }}
                >
                  {template.icon}
                </div>
                <h3 
                  className="font-medium text-sm"
                  style={{ color: STUDIO.ivoire }}
                >
                  {template.name}
                </h3>
                <p 
                  className="text-xs mt-1 line-clamp-2 font-light"
                  style={{ color: STUDIO.gris }}
                >
                  {template.description}
                </p>
                
                {selectedTemplate === template.id && (
                  <div 
                    className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: STUDIO.or }}
                  >
                    <Check className="w-3 h-3" style={{ color: STUDIO.noir }} />
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Generator Section */}
      <section 
        className="py-20"
        style={{ backgroundColor: STUDIO.noir }}
      >
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Form */}
            <div 
              className="rounded-2xl p-6 lg:p-8"
              style={{ 
                backgroundColor: STUDIO.noirCard,
                border: `1px solid ${STUDIO.ivoire}10`,
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${STUDIO.or}20` }}
                >
                  <Palette className="w-5 h-5" style={{ color: STUDIO.or }} />
                </div>
                <h2 
                  className="text-xl font-medium"
                  style={{ color: STUDIO.ivoire }}
                >
                  Décrivez votre projet
                </h2>
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
              </div>
            </div>

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
      <section 
        className="py-20"
        style={{ backgroundColor: STUDIO.noirSoft }}
      >
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <span 
              className="text-[10px] uppercase tracking-[0.4em] font-light"
              style={{ color: STUDIO.or }}
            >
              Processus
            </span>
            <h2 
              className="font-display text-2xl md:text-3xl font-light mt-4 tracking-tight"
              style={{ color: STUDIO.ivoire }}
            >
              Comment ça marche ?
            </h2>
          </div>
          
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
              <motion.div 
                key={item.step} 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div 
                  className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ 
                    backgroundColor: `${STUDIO.or}15`,
                    border: `1px solid ${STUDIO.or}30`,
                  }}
                >
                  <span 
                    className="text-2xl font-light"
                    style={{ color: STUDIO.or }}
                  >
                    {item.step}
                  </span>
                </div>
                <h3 
                  className="text-lg font-medium mb-2"
                  style={{ color: STUDIO.ivoire }}
                >
                  {item.title}
                </h3>
                <p 
                  className="text-sm font-light"
                  style={{ color: STUDIO.gris }}
                >
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      <CoutureFooter />
    </div>
  );
}
