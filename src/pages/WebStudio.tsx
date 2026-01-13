/**
 * WebStudio - Générateur de sites web IA
 * Design Premium Noir & Or - Style i-wasp
 */

import { useState } from "react";
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
import { motion } from "framer-motion";
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
  FileText,
  Loader2,
  ArrowRight,
  CheckCircle2,
  Clock,
  Package,
  Layout
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
  },
  {
    id: "ecommerce",
    name: "E-commerce",
    icon: <ShoppingBag className="w-5 h-5" />,
    businessType: "Boutique en ligne",
    style: "Moderne et épuré",
    colors: "Noir, blanc et accent coloré",
    description: "Catalogue produits, panier, paiement sécurisé",
  },
  {
    id: "portfolio",
    name: "Portfolio",
    icon: <Camera className="w-5 h-5" />,
    businessType: "Portfolio créatif / Photographe",
    style: "Minimaliste et artistique",
    colors: "Noir et blanc avec accent",
    description: "Galerie, projets, à propos, contact",
  },
  {
    id: "corporate",
    name: "Entreprise",
    icon: <Building2 className="w-5 h-5" />,
    businessType: "Cabinet de conseil / Entreprise B2B",
    style: "Professionnel et institutionnel",
    colors: "Bleu marine, gris et blanc",
    description: "Services, équipe, références, contact",
  },
  {
    id: "beauty",
    name: "Beauté",
    icon: <Scissors className="w-5 h-5" />,
    businessType: "Salon de beauté / Spa",
    style: "Luxueux et apaisant",
    colors: "Rose gold, blanc et beige",
    description: "Prestations, tarifs, réservation, galerie",
  },
  {
    id: "fitness",
    name: "Sport",
    icon: <Dumbbell className="w-5 h-5" />,
    businessType: "Coach sportif / Salle de sport",
    style: "Dynamique et énergique",
    colors: "Orange, noir et blanc",
    description: "Programmes, tarifs, témoignages, inscription",
  },
  {
    id: "wedding",
    name: "Mariage",
    icon: <Heart className="w-5 h-5" />,
    businessType: "Wedding planner / Organisateur d'événements",
    style: "Romantique et raffiné",
    colors: "Blanc, doré et pastel",
    description: "Services, galerie, témoignages, devis",
  },
  {
    id: "education",
    name: "Formation",
    icon: <GraduationCap className="w-5 h-5" />,
    businessType: "Centre de formation / Coach",
    style: "Moderne et inspirant",
    colors: "Vert, blanc et gris",
    description: "Formations, formateurs, inscription, blog",
  },
  {
    id: "artisan",
    name: "Artisan",
    icon: <Wrench className="w-5 h-5" />,
    businessType: "Artisan / Services à domicile",
    style: "Authentique et fiable",
    colors: "Marron, beige et vert",
    description: "Services, réalisations, devis, contact",
  },
  {
    id: "consulting",
    name: "Consulting",
    icon: <Briefcase className="w-5 h-5" />,
    businessType: "Consultant indépendant / Freelance",
    style: "Épuré et professionnel",
    colors: "Violet, blanc et gris",
    description: "Expertise, services, cas clients, contact",
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
        
        const base = PRICING[data.proposal.complexity as keyof typeof PRICING];
        const extraPages = Math.max(0, data.proposal.estimatedPages - 5);
        const priceEur = base.base + (extraPages * PAGE_EXTRA.eur);
        const priceMad = base.baseMAD + (extraPages * PAGE_EXTRA.mad);

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
      
      {/* Hero Section - Ultra Premium */}
      <section className="min-h-screen relative overflow-hidden pt-20">
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-[700px] h-[700px] rounded-full blur-[180px] pointer-events-none"
          style={{ backgroundColor: `${STUDIO.or}12` }}
          animate={{
            x: [0, 80, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none"
          style={{ backgroundColor: `${STUDIO.or}08` }}
          animate={{
            x: [0, -60, 0],
            y: [0, 60, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
        
        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full pointer-events-none"
            style={{
              backgroundColor: STUDIO.or,
              left: `${10 + (i * 6)}%`,
              top: `${15 + (i % 5) * 18}%`,
              opacity: 0.4,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 5 + (i % 3),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.4,
            }}
          />
        ))}
        
        {/* Grain texture */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
        
        {/* Decorative lines */}
        <motion.div
          className="absolute top-24 left-8 md:left-16 w-px h-24"
          style={{ backgroundColor: `${STUDIO.or}40` }}
          initial={{ scaleY: 0, originY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.5, delay: 0.8 }}
        />
        <motion.div
          className="absolute top-24 right-8 md:right-16 w-px h-24"
          style={{ backgroundColor: `${STUDIO.or}40` }}
          initial={{ scaleY: 0, originY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.5, delay: 1 }}
        />

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[calc(100vh-80px)] py-16">
            
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Badge with glow */}
              <motion.div
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-8 relative"
                style={{ 
                  backgroundColor: `${STUDIO.or}15`,
                  border: `1px solid ${STUDIO.or}40`,
                }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: `${STUDIO.or}20` }}
                  animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <Sparkles size={14} style={{ color: STUDIO.or }} />
                <span 
                  className="text-[11px] uppercase tracking-[0.2em] font-medium relative z-10"
                  style={{ color: STUDIO.or }}
                >
                  IA + Expertise humaine
                </span>
              </motion.div>
              
              {/* Title with staggered reveal */}
              <div className="overflow-hidden mb-6">
                <motion.h1 
                  className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light leading-[1.05] tracking-tight"
                  style={{ color: STUDIO.ivoire }}
                  initial={{ y: 80, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  Tout votre univers
                  <br />
                  numérique,{" "}
                  <span className="italic" style={{ color: STUDIO.or }}>
                    clé en main.
                  </span>
                </motion.h1>
              </div>
              
              {/* Decorative line */}
              <motion.div
                className="w-16 h-px mb-8"
                style={{ backgroundColor: STUDIO.or }}
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
              />
              
              <motion.p 
                className="text-base md:text-lg font-light leading-relaxed max-w-xl mb-10"
                style={{ color: STUDIO.gris }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 1 }}
              >
                i-wasp Studio utilise l'IA et son expertise pour créer des sites sur mesure, 
                prêts à l'emploi : identité, pages, textes et intégrations essentielles.
              </motion.p>
              
              {/* Feature list with icons */}
              <ul className="space-y-4 mb-12">
                {[
                  { icon: Globe, text: "Sites vitrines et e-commerce sur mesure" },
                  { icon: Sparkles, text: "Génération intelligente de contenu grâce à l'IA" },
                  { icon: Package, text: "Livraison clé en main, prête à l'usage" }
                ].map((feature, i) => (
                  <motion.li 
                    key={i}
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + i * 0.15 }}
                  >
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ 
                        backgroundColor: `${STUDIO.or}10`,
                        border: `1px solid ${STUDIO.or}30`,
                      }}
                    >
                      <feature.icon size={18} style={{ color: STUDIO.or }} />
                    </div>
                    <span 
                      className="text-sm font-light"
                      style={{ color: STUDIO.grisClair }}
                    >
                      {feature.text}
                    </span>
                  </motion.li>
                ))}
              </ul>
              
              {/* CTA Buttons */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
              >
                <motion.button
                  onClick={() => document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 rounded-xl font-medium text-sm flex items-center justify-center gap-3 relative overflow-hidden group"
                  style={{ 
                    background: `linear-gradient(135deg, ${STUDIO.or} 0%, ${STUDIO.orLight} 100%)`,
                    color: STUDIO.noir,
                    boxShadow: `0 8px 32px ${STUDIO.or}40`,
                  }}
                  whileHover={{ scale: 1.02, boxShadow: `0 12px 40px ${STUDIO.or}50` }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10">Décrire mon projet</span>
                  <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)`,
                    }}
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  />
                </motion.button>
                
                <motion.button
                  onClick={() => window.open("https://wa.me/33626424394?text=Bonjour, je souhaite créer un site web professionnel.", "_blank")}
                  className="px-8 py-4 rounded-xl font-medium text-sm flex items-center justify-center gap-3 transition-all duration-300"
                  style={{ 
                    backgroundColor: "transparent",
                    color: STUDIO.ivoire,
                    border: `1px solid ${STUDIO.ivoire}25`,
                  }}
                  whileHover={{ 
                    borderColor: `${STUDIO.or}50`,
                    backgroundColor: `${STUDIO.or}10`,
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MessageCircle size={16} />
                  Parler sur WhatsApp
                </motion.button>
              </motion.div>
              
              {/* Trust badges */}
              <motion.div 
                className="flex items-center gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6 }}
              >
                {[
                  { icon: Clock, text: "Livraison 48h" },
                  { icon: Package, text: "Site complet" },
                  { icon: Zap, text: "Express 24h" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <item.icon size={14} style={{ color: STUDIO.or }} />
                    <span className="text-xs font-light" style={{ color: STUDIO.gris }}>{item.text}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>
            
            {/* Laptop Mockup - Enhanced */}
            <motion.div
              className="relative hidden lg:block"
              initial={{ opacity: 0, x: 50, rotateY: -10 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Glow behind laptop */}
              <motion.div
                className="absolute inset-0 rounded-3xl blur-[100px] pointer-events-none"
                style={{ backgroundColor: `${STUDIO.or}20` }}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 5, repeat: Infinity }}
              />
              
              <div 
                className="relative mx-auto"
                style={{ maxWidth: "550px", perspective: "1000px" }}
              >
                <motion.div
                  whileHover={{ rotateY: 5, rotateX: -2 }}
                  transition={{ duration: 0.4 }}
                >
                  <div 
                    className="rounded-t-2xl p-3"
                    style={{ 
                      backgroundColor: STUDIO.noirCard,
                      border: `1px solid ${STUDIO.ivoire}15`,
                      boxShadow: `0 40px 80px ${STUDIO.noir}80`,
                    }}
                  >
                    <div 
                      className="rounded-xl overflow-hidden aspect-[16/10]"
                      style={{ 
                        backgroundColor: STUDIO.noirSoft,
                        boxShadow: `inset 0 0 40px ${STUDIO.noir}`,
                      }}
                    >
                      <div className="p-5 h-full flex flex-col">
                        {/* Browser bar */}
                        <div 
                          className="flex items-center gap-3 mb-4 px-4 py-2.5 rounded-lg"
                          style={{ backgroundColor: `${STUDIO.ivoire}05` }}
                        >
                          <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#FF5F57" }} />
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#FFBD2E" }} />
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#28CA41" }} />
                          </div>
                          <div 
                            className="flex-1 text-center text-[11px] px-6 py-1.5 rounded-lg"
                            style={{ backgroundColor: `${STUDIO.ivoire}05`, color: STUDIO.gris }}
                          >
                            votre-site-premium.com
                          </div>
                        </div>
                        
                        {/* Fake website content */}
                        <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
                          <motion.div 
                            className="w-14 h-14 rounded-2xl mb-5 flex items-center justify-center"
                            style={{ 
                              background: `linear-gradient(135deg, ${STUDIO.or} 0%, ${STUDIO.orLight} 100%)`,
                              boxShadow: `0 8px 24px ${STUDIO.or}40`,
                            }}
                            animate={{ rotate: [0, 5, 0, -5, 0] }}
                            transition={{ duration: 6, repeat: Infinity }}
                          >
                            <span className="font-bold text-xl" style={{ color: STUDIO.noir }}>W</span>
                          </motion.div>
                          <div 
                            className="text-[11px] uppercase tracking-[0.4em] mb-3"
                            style={{ color: STUDIO.or }}
                          >
                            Web Studio
                          </div>
                          <div 
                            className="text-sm font-light"
                            style={{ color: STUDIO.grisClair }}
                          >
                            Votre site professionnel
                          </div>
                          
                          {/* Fake navigation dots */}
                          <div className="flex gap-2 mt-6">
                            {[1, 2, 3].map((i) => (
                              <div 
                                key={i}
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: i === 1 ? STUDIO.or : `${STUDIO.ivoire}20` }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Laptop base */}
                  <div 
                    className="h-5 rounded-b-2xl mx-8"
                    style={{ 
                      backgroundColor: STUDIO.noirCard,
                      borderBottom: `1px solid ${STUDIO.ivoire}15`,
                      borderLeft: `1px solid ${STUDIO.ivoire}15`,
                      borderRight: `1px solid ${STUDIO.ivoire}15`,
                    }}
                  />
                  <div 
                    className="h-1.5 rounded-b-xl mx-20"
                    style={{ backgroundColor: STUDIO.noirCard }}
                  />
                </motion.div>
              </div>
              
              {/* Floating Badges - Enhanced */}
              <motion.div
                className="absolute -top-2 right-4 px-5 py-2.5 rounded-full backdrop-blur-sm"
                style={{ 
                  backgroundColor: `${STUDIO.noirCard}90`,
                  border: `1px solid ${STUDIO.or}40`,
                  boxShadow: `0 8px 24px ${STUDIO.noir}60`,
                }}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="flex items-center gap-2 text-xs font-medium" style={{ color: STUDIO.or }}>
                  <Sparkles size={14} />
                  Généré par IA
                </span>
              </motion.div>
              
              <motion.div
                className="absolute top-1/3 -right-2 px-5 py-2.5 rounded-full backdrop-blur-sm"
                style={{ 
                  backgroundColor: `${STUDIO.noirCard}90`,
                  border: `1px solid ${STUDIO.ivoire}20`,
                  boxShadow: `0 8px 24px ${STUDIO.noir}60`,
                }}
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
              >
                <span className="flex items-center gap-2 text-xs font-medium" style={{ color: STUDIO.ivoire }}>
                  <Zap size={14} />
                  Prêt à l'emploi
                </span>
              </motion.div>
              
              <motion.div
                className="absolute bottom-1/4 -left-2 px-5 py-2.5 rounded-full backdrop-blur-sm"
                style={{ 
                  backgroundColor: `${STUDIO.noirCard}90`,
                  border: `1px solid ${STUDIO.or}40`,
                  boxShadow: `0 8px 24px ${STUDIO.noir}60`,
                }}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              >
                <span className="flex items-center gap-2 text-xs font-medium" style={{ color: STUDIO.or }}>
                  <Package size={14} />
                  Clé en main
                </span>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
          >
            <span 
              className="text-[10px] uppercase tracking-[0.4em] font-light"
              style={{ color: STUDIO.gris }}
            >
              Scroll
            </span>
            <motion.div
              className="w-px h-10"
              style={{ backgroundColor: STUDIO.or }}
              animate={{ scaleY: [1, 0.4, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </div>
      </section>

      {/* Templates Gallery - Enhanced */}
      <section 
        id="generator"
        className="py-24 relative overflow-hidden"
        style={{ backgroundColor: STUDIO.noirSoft }}
      >
        {/* Subtle gradient accent */}
        <div 
          className="absolute top-0 left-0 right-0 h-40 pointer-events-none"
          style={{
            background: `linear-gradient(to bottom, ${STUDIO.noir} 0%, transparent 100%)`,
          }}
        />
        
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          {/* Section header with animation */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <motion.div
                className="h-px w-12"
                style={{ backgroundColor: STUDIO.or }}
                initial={{ scaleX: 0, originX: 1 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
              <span 
                className="text-[10px] uppercase tracking-[0.4em] font-light"
                style={{ color: STUDIO.or }}
              >
                Templates
              </span>
              <motion.div
                className="h-px w-12"
                style={{ backgroundColor: STUDIO.or }}
                initial={{ scaleX: 0, originX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
            </div>
            <h2 
              className="font-display text-3xl md:text-4xl font-light tracking-tight"
              style={{ color: STUDIO.ivoire }}
            >
              Choisissez un template
            </h2>
            <p 
              className="text-sm font-light mt-4 max-w-md mx-auto"
              style={{ color: STUDIO.gris }}
            >
              Sélectionnez un style prédéfini ou personnalisez librement votre projet
            </p>
          </motion.div>
          
          {/* Templates grid - Enhanced */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
            {TEMPLATES.map((template, index) => (
              <motion.button
                key={template.id}
                onClick={() => handleSelectTemplate(template)}
                className="group relative rounded-2xl p-5 transition-all duration-500 text-left overflow-hidden"
                style={{
                  backgroundColor: selectedTemplate === template.id ? `${STUDIO.or}12` : STUDIO.noirCard,
                  border: selectedTemplate === template.id 
                    ? `2px solid ${STUDIO.or}` 
                    : `1px solid ${STUDIO.ivoire}08`,
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ 
                  scale: 1.03, 
                  borderColor: `${STUDIO.or}50`,
                  boxShadow: `0 20px 40px ${STUDIO.noir}80`,
                }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Hover glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${STUDIO.or}15 0%, transparent 70%)`,
                  }}
                />
                
                <div className="relative z-10">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                    style={{ 
                      backgroundColor: `${STUDIO.or}15`,
                      border: `1px solid ${STUDIO.or}25`,
                      color: STUDIO.or,
                    }}
                  >
                    {template.icon}
                  </div>
                  <h3 
                    className="font-medium text-sm mb-1"
                    style={{ color: STUDIO.ivoire }}
                  >
                    {template.name}
                  </h3>
                  <p 
                    className="text-xs line-clamp-2 font-light"
                    style={{ color: STUDIO.gris }}
                  >
                    {template.description}
                  </p>
                </div>
                
                {selectedTemplate === template.id && (
                  <motion.div 
                    className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ 
                      background: `linear-gradient(135deg, ${STUDIO.or} 0%, ${STUDIO.orLight} 100%)`,
                      boxShadow: `0 4px 12px ${STUDIO.or}50`,
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    <Check className="w-3.5 h-3.5" style={{ color: STUDIO.noir }} />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Generator Section - Ultra Immersive */}
      <section 
        className="py-24 relative overflow-hidden"
        style={{ backgroundColor: STUDIO.noir }}
      >
        {/* Immersive background effects */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full blur-[200px] pointer-events-none"
          style={{ backgroundColor: `${STUDIO.or}06` }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Floating orbs */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full pointer-events-none"
            style={{
              backgroundColor: STUDIO.or,
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              opacity: 0.3,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, (i % 2 === 0 ? 20 : -20), 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
        
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          {/* Section Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-6"
              style={{
                backgroundColor: `${STUDIO.or}15`,
                border: `1px solid ${STUDIO.or}30`,
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles size={14} style={{ color: STUDIO.or }} />
              </motion.div>
              <span className="text-xs uppercase tracking-widest" style={{ color: STUDIO.or }}>
                Créateur intelligent
              </span>
            </motion.div>
            
            <h2 
              className="text-3xl lg:text-4xl font-light tracking-tight mb-4"
              style={{ color: STUDIO.ivoire }}
            >
              Décrivez votre{" "}
              <span 
                className="font-medium"
                style={{
                  background: `linear-gradient(135deg, ${STUDIO.or} 0%, ${STUDIO.orLight} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                vision
              </span>
            </h2>
            <p className="text-sm max-w-lg mx-auto" style={{ color: STUDIO.gris }}>
              Notre IA analyse vos besoins et crée une proposition sur mesure en quelques secondes
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Form - Premium Immersive Design */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Glow effect behind form */}
              <motion.div
                className="absolute -inset-4 rounded-[2rem] pointer-events-none"
                style={{ 
                  background: `radial-gradient(ellipse at center, ${STUDIO.or}08 0%, transparent 70%)`,
                }}
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              
              <div 
                className="relative rounded-3xl p-8 lg:p-10 backdrop-blur-xl"
                style={{ 
                  backgroundColor: `${STUDIO.noirCard}95`,
                  border: `1px solid ${STUDIO.or}15`,
                  boxShadow: `
                    0 40px 100px ${STUDIO.noir}80,
                    inset 0 1px 0 ${STUDIO.ivoire}08
                  `,
                }}
              >
                {/* Form header with animated icon */}
                <div className="flex items-center gap-4 mb-8">
                  <motion.div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center relative overflow-hidden"
                    style={{ 
                      background: `linear-gradient(135deg, ${STUDIO.or}20 0%, ${STUDIO.or}10 100%)`,
                      border: `1px solid ${STUDIO.or}30`,
                    }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {/* Shimmer effect */}
                    <motion.div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${STUDIO.or}20, transparent)`,
                      }}
                      animate={{ x: [-100, 100] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <Palette className="w-6 h-6 relative z-10" style={{ color: STUDIO.or }} />
                  </motion.div>
                  <div>
                    <h3 
                      className="text-xl font-medium tracking-tight"
                      style={{ color: STUDIO.ivoire }}
                    >
                      Votre projet
                    </h3>
                    <p className="text-xs mt-0.5" style={{ color: STUDIO.gris }}>
                      Remplissez les champs pour personnaliser
                    </p>
                  </div>
                </div>

                {/* Form fields with stagger animation */}
                <div className="space-y-6">
                  {/* Business type field - Required */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="group"
                  >
                    <Label 
                      htmlFor="businessType" 
                      className="flex items-center gap-2 mb-2"
                    >
                      <span className="text-sm" style={{ color: STUDIO.ivoire }}>Type d'entreprise</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ 
                        backgroundColor: `${STUDIO.or}20`,
                        color: STUDIO.or,
                      }}>
                        Requis
                      </span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="businessType"
                        placeholder="Ex: Restaurant gastronomique, Photographe..."
                        value={formData.businessType}
                        onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                        className="h-14 pl-5 pr-12 text-base rounded-xl transition-all duration-300 focus:ring-2"
                        style={{
                          backgroundColor: `${STUDIO.noirSoft}80`,
                          border: `1px solid ${STUDIO.ivoire}10`,
                          color: STUDIO.ivoire,
                        }}
                      />
                      <motion.div 
                        className="absolute right-4 top-1/2 -translate-y-1/2"
                        animate={formData.businessType ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 0.3 }}
                      >
                        {formData.businessType && (
                          <CheckCircle2 size={18} style={{ color: STUDIO.or }} />
                        )}
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Business name field */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 }}
                  >
                    <Label htmlFor="businessName" className="mb-2 block">
                      <span className="text-sm" style={{ color: STUDIO.ivoire }}>Nom de l'entreprise</span>
                    </Label>
                    <Input
                      id="businessName"
                      placeholder="Votre nom ou nom de marque"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      className="h-14 pl-5 text-base rounded-xl transition-all duration-300"
                      style={{
                        backgroundColor: `${STUDIO.noirSoft}80`,
                        border: `1px solid ${STUDIO.ivoire}10`,
                        color: STUDIO.ivoire,
                      }}
                    />
                  </motion.div>

                  {/* Description field */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    <Label htmlFor="description" className="mb-2 block">
                      <span className="text-sm" style={{ color: STUDIO.ivoire }}>Description du projet</span>
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Décrivez votre activité, vos objectifs, votre cible..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="min-h-[120px] p-5 text-base rounded-xl transition-all duration-300 resize-none"
                      style={{
                        backgroundColor: `${STUDIO.noirSoft}80`,
                        border: `1px solid ${STUDIO.ivoire}10`,
                        color: STUDIO.ivoire,
                      }}
                    />
                  </motion.div>

                  {/* Style and colors row */}
                  <motion.div 
                    className="grid sm:grid-cols-2 gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.25 }}
                  >
                    <div>
                      <Label htmlFor="style" className="mb-2 block">
                        <span className="text-sm" style={{ color: STUDIO.ivoire }}>Style souhaité</span>
                      </Label>
                      <Input
                        id="style"
                        placeholder="Moderne, Élégant..."
                        value={formData.style}
                        onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                        className="h-14 pl-5 text-base rounded-xl"
                        style={{
                          backgroundColor: `${STUDIO.noirSoft}80`,
                          border: `1px solid ${STUDIO.ivoire}10`,
                          color: STUDIO.ivoire,
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="colors" className="mb-2 block">
                        <span className="text-sm" style={{ color: STUDIO.ivoire }}>Couleurs préférées</span>
                      </Label>
                      <Input
                        id="colors"
                        placeholder="Noir et or, Bleu..."
                        value={formData.colors}
                        onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                        className="h-14 pl-5 text-base rounded-xl"
                        style={{
                          backgroundColor: `${STUDIO.noirSoft}80`,
                          border: `1px solid ${STUDIO.ivoire}10`,
                          color: STUDIO.ivoire,
                        }}
                      />
                    </div>
                  </motion.div>

                  {/* Optional section with collapsible design */}
                  <motion.div 
                    className="pt-6 mt-6"
                    style={{ borderTop: `1px solid ${STUDIO.ivoire}08` }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex items-center gap-3 mb-5">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${STUDIO.ivoire}08` }}
                      >
                        <LinkIcon size={14} style={{ color: STUDIO.gris }} />
                      </div>
                      <span className="text-xs uppercase tracking-widest" style={{ color: STUDIO.gris }}>
                        Optionnel — Analyse approfondie
                      </span>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="websiteUrl" className="mb-2 block">
                          <span className="text-sm" style={{ color: STUDIO.grisClair }}>URL existante</span>
                        </Label>
                        <Input
                          id="websiteUrl"
                          placeholder="https://votre-site-actuel.com"
                          value={formData.websiteUrl}
                          onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                          className="h-12 pl-5 text-sm rounded-xl"
                          style={{
                            backgroundColor: `${STUDIO.noirSoft}50`,
                            border: `1px solid ${STUDIO.ivoire}08`,
                            color: STUDIO.ivoire,
                          }}
                        />
                      </div>
                      <div>
                        <Label htmlFor="socialLinks" className="mb-2 block">
                          <span className="text-sm" style={{ color: STUDIO.grisClair }}>Réseaux sociaux</span>
                        </Label>
                        <Input
                          id="socialLinks"
                          placeholder="@instagram, facebook.com/page..."
                          value={formData.socialLinks}
                          onChange={(e) => setFormData({ ...formData, socialLinks: e.target.value })}
                          className="h-12 pl-5 text-sm rounded-xl"
                          style={{
                            backgroundColor: `${STUDIO.noirSoft}50`,
                            border: `1px solid ${STUDIO.ivoire}08`,
                            color: STUDIO.ivoire,
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Premium Generate Button */}
                <motion.div
                  className="mt-10"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.button
                    className="w-full relative group overflow-hidden rounded-2xl"
                    style={{ height: "64px" }}
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Button background with gradient */}
                    <div
                      className="absolute inset-0 transition-all duration-500"
                      style={{
                        background: isGenerating 
                          ? `linear-gradient(135deg, ${STUDIO.noirCard} 0%, ${STUDIO.noirSoft} 100%)`
                          : `linear-gradient(135deg, ${STUDIO.or} 0%, ${STUDIO.orLight} 50%, ${STUDIO.or} 100%)`,
                        backgroundSize: "200% 100%",
                      }}
                    />
                    
                    {/* Shimmer effect */}
                    {!isGenerating && (
                      <motion.div
                        className="absolute inset-0 opacity-40"
                        style={{
                          background: `linear-gradient(90deg, transparent, ${STUDIO.ivoire}40, transparent)`,
                        }}
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                      />
                    )}
                    
                    {/* Button content */}
                    <div className="relative z-10 flex items-center justify-center gap-3 font-medium text-base">
                      {isGenerating ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <Loader2 size={20} style={{ color: STUDIO.or }} />
                          </motion.div>
                          <span style={{ color: STUDIO.ivoire }}>Génération en cours...</span>
                        </>
                      ) : (
                        <>
                          <motion.div
                            animate={{ rotate: [0, 15, -15, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Sparkles size={20} style={{ color: STUDIO.noir }} />
                          </motion.div>
                          <span style={{ color: STUDIO.noir }}>Générer ma proposition</span>
                          <ArrowRight size={18} style={{ color: STUDIO.noir }} />
                        </>
                      )}
                    </div>
                    
                    {/* Glow effect on hover */}
                    <motion.div
                      className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
                      style={{
                        background: `radial-gradient(circle, ${STUDIO.or}40 0%, transparent 70%)`,
                        filter: "blur(20px)",
                      }}
                    />
                  </motion.button>
                  
                  {/* Helper text */}
                  <motion.p 
                    className="text-center mt-4 text-xs flex items-center justify-center gap-2"
                    style={{ color: STUDIO.gris }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Clock size={12} />
                    Résultat en moins de 30 secondes
                  </motion.p>
                </motion.div>
              </div>
            </motion.div>

            {/* Result - Spectacular Design */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {/* Empty state */}
              {!proposal && !isGenerating && (
                <motion.div 
                  className="relative h-full min-h-[600px] rounded-3xl overflow-hidden flex items-center justify-center"
                  style={{ 
                    backgroundColor: `${STUDIO.noirCard}60`,
                    border: `1px dashed ${STUDIO.ivoire}15`,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {/* Animated background pattern */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                          width: 200 + i * 100,
                          height: 200 + i * 100,
                          border: `1px solid ${STUDIO.or}05`,
                          left: "50%",
                          top: "50%",
                          transform: "translate(-50%, -50%)",
                        }}
                        animate={{
                          scale: [1, 1.1, 1],
                          opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                          duration: 4 + i,
                          repeat: Infinity,
                          delay: i * 0.5,
                        }}
                      />
                    ))}
                  </div>
                  
                  <div className="relative z-10 text-center p-8">
                    <motion.div 
                      className="w-24 h-24 mx-auto mb-8 rounded-3xl flex items-center justify-center relative"
                      style={{ 
                        background: `linear-gradient(135deg, ${STUDIO.noirCard} 0%, ${STUDIO.noir} 100%)`,
                        border: `1px solid ${STUDIO.ivoire}10`,
                        boxShadow: `0 20px 60px ${STUDIO.noir}`,
                      }}
                      animate={{ 
                        y: [0, -10, 0],
                        boxShadow: [
                          `0 20px 60px ${STUDIO.noir}`,
                          `0 30px 80px ${STUDIO.noir}, 0 0 40px ${STUDIO.or}10`,
                          `0 20px 60px ${STUDIO.noir}`,
                        ],
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <Globe className="w-10 h-10" style={{ color: STUDIO.gris }} />
                      
                      {/* Orbiting dot */}
                      <motion.div
                        className="absolute w-3 h-3 rounded-full"
                        style={{ backgroundColor: STUDIO.or }}
                        animate={{
                          rotate: 360,
                        }}
                        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                        initial={{ x: 50 }}
                      />
                    </motion.div>
                    
                    <h3 
                      className="text-xl font-light tracking-tight mb-3"
                      style={{ color: STUDIO.ivoire }}
                    >
                      Votre proposition apparaîtra ici
                    </h3>
                    <p 
                      className="text-sm max-w-xs mx-auto leading-relaxed"
                      style={{ color: STUDIO.gris }}
                    >
                      Remplissez le formulaire et cliquez sur "Générer" pour voir la magie opérer
                    </p>
                    
                    {/* Animated arrow pointing to form */}
                    <motion.div 
                      className="mt-8 flex items-center justify-center gap-2"
                      animate={{ x: [-5, 5, -5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <ArrowRight size={16} style={{ color: STUDIO.or, transform: "rotate(180deg)" }} />
                      <span className="text-xs" style={{ color: STUDIO.or }}>Commencez ici</span>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {/* Loading state */}
              {isGenerating && (
                <motion.div 
                  className="rounded-3xl overflow-hidden"
                  style={{ 
                    border: `1px solid ${STUDIO.or}20`,
                    boxShadow: `0 0 60px ${STUDIO.or}10`,
                  }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <GeneratingAnimation />
                </motion.div>
              )}

              {/* Result state - Spectacular reveal */}
              {proposal && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  {/* Success celebration effect */}
                  <motion.div
                    className="absolute -inset-20 pointer-events-none"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 2, delay: 0.5 }}
                  >
                    {[...Array(12)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: STUDIO.or,
                          left: "50%",
                          top: "50%",
                        }}
                        initial={{ scale: 0, x: 0, y: 0 }}
                        animate={{
                          scale: [0, 1, 0],
                          x: Math.cos((i * Math.PI * 2) / 12) * 200,
                          y: Math.sin((i * Math.PI * 2) / 12) * 200,
                          opacity: [1, 1, 0],
                        }}
                        transition={{
                          duration: 1,
                          delay: i * 0.05,
                          ease: "easeOut",
                        }}
                      />
                    ))}
                  </motion.div>
                  
                  {/* Tabs with premium styling */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "details" | "preview")}>
                      <div 
                        className="p-1.5 rounded-2xl mb-6"
                        style={{ 
                          backgroundColor: STUDIO.noirCard,
                          border: `1px solid ${STUDIO.ivoire}10`,
                        }}
                      >
                        <TabsList className="grid w-full grid-cols-2 bg-transparent h-12">
                          <TabsTrigger 
                            value="details" 
                            className="gap-2 rounded-xl data-[state=active]:bg-transparent transition-all duration-300"
                            style={{
                              color: activeTab === "details" ? STUDIO.or : STUDIO.gris,
                              backgroundColor: activeTab === "details" ? `${STUDIO.or}15` : "transparent",
                              border: activeTab === "details" ? `1px solid ${STUDIO.or}30` : "1px solid transparent",
                            }}
                          >
                            <FileText className="w-4 h-4" />
                            Détails
                          </TabsTrigger>
                          <TabsTrigger 
                            value="preview" 
                            className="gap-2 rounded-xl data-[state=active]:bg-transparent transition-all duration-300"
                            style={{
                              color: activeTab === "preview" ? STUDIO.or : STUDIO.gris,
                              backgroundColor: activeTab === "preview" ? `${STUDIO.or}15` : "transparent",
                              border: activeTab === "preview" ? `1px solid ${STUDIO.or}30` : "1px solid transparent",
                            }}
                          >
                            <Eye className="w-4 h-4" />
                            Aperçu
                          </TabsTrigger>
                        </TabsList>
                      </div>

                      <TabsContent value="details" className="mt-0">
                        <motion.div 
                          className="rounded-3xl p-8 relative overflow-hidden"
                          style={{ 
                            backgroundColor: STUDIO.noirCard,
                            border: `1px solid ${STUDIO.ivoire}10`,
                            boxShadow: `0 40px 80px ${STUDIO.noir}60`,
                          }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          {/* Gradient accent */}
                          <div 
                            className="absolute top-0 left-0 right-0 h-1"
                            style={{
                              background: `linear-gradient(90deg, ${STUDIO.or}, ${STUDIO.orLight}, ${STUDIO.or})`,
                            }}
                          />
                          
                          {/* Header */}
                          <motion.div 
                            className="flex items-start justify-between mb-8"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                          >
                            <div>
                              <motion.h3 
                                className="text-2xl font-light tracking-tight mb-2"
                                style={{ color: STUDIO.ivoire }}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                              >
                                {proposal.siteName}
                              </motion.h3>
                              <motion.p 
                                className="text-sm"
                                style={{ color: STUDIO.gris }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                              >
                                {proposal.tagline}
                              </motion.p>
                            </div>
                            <div className="flex items-center gap-3">
                              <motion.span
                                className="px-4 py-2 rounded-full text-xs font-medium"
                                style={{
                                  backgroundColor: `${STUDIO.or}15`,
                                  color: STUDIO.or,
                                  border: `1px solid ${STUDIO.or}30`,
                                }}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.7, type: "spring" }}
                              >
                                {proposal.complexity.charAt(0).toUpperCase() + proposal.complexity.slice(1)}
                              </motion.span>
                              <ProposalPdfExport 
                                proposal={proposal}
                                priceEur={calculatePrice().eur}
                                priceMad={calculatePrice().mad}
                                isExpress={isExpress}
                                formData={formData}
                              />
                            </div>
                          </motion.div>

                          {/* Color palette with reveal animation */}
                          <motion.div 
                            className="mb-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                          >
                            <h4 
                              className="text-xs uppercase tracking-widest mb-4"
                              style={{ color: STUDIO.gris }}
                            >
                              Palette de couleurs
                            </h4>
                            <div className="flex gap-3">
                              {Object.entries(proposal.colorPalette).map(([name, color], idx) => (
                                <motion.div 
                                  key={name} 
                                  className="text-center group"
                                  initial={{ scale: 0, rotate: -180 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  transition={{ delay: 0.6 + idx * 0.1, type: "spring" }}
                                >
                                  <motion.div 
                                    className="w-12 h-12 rounded-xl shadow-lg cursor-pointer relative overflow-hidden"
                                    style={{ 
                                      backgroundColor: color,
                                      boxShadow: `0 8px 24px ${color}40`,
                                    }}
                                    whileHover={{ scale: 1.15, rotate: 5 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                  >
                                    {/* Shine effect */}
                                    <motion.div
                                      className="absolute inset-0 opacity-0 group-hover:opacity-100"
                                      style={{
                                        background: `linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)`,
                                      }}
                                      animate={{ x: ["-100%", "200%"] }}
                                      transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1 }}
                                    />
                                  </motion.div>
                                  <span 
                                    className="text-[10px] mt-2 block capitalize"
                                    style={{ color: STUDIO.gris }}
                                  >
                                    {name}
                                  </span>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>

                          {/* Pages structure with stagger */}
                          <motion.div 
                            className="mb-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                          >
                            <h4 
                              className="text-xs uppercase tracking-widest mb-4 flex items-center gap-2"
                              style={{ color: STUDIO.gris }}
                            >
                              <Layout size={14} />
                              Structure du site ({proposal.estimatedPages} pages)
                            </h4>
                            <div className="space-y-3">
                              {proposal.pages.map((page, idx) => (
                                <motion.div 
                                  key={idx} 
                                  className="p-4 rounded-xl relative overflow-hidden group"
                                  style={{ 
                                    backgroundColor: `${STUDIO.noirSoft}80`,
                                    border: `1px solid ${STUDIO.ivoire}08`,
                                  }}
                                  initial={{ opacity: 0, x: -30 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.8 + idx * 0.1 }}
                                  whileHover={{ 
                                    borderColor: `${STUDIO.or}30`,
                                    x: 5,
                                  }}
                                >
                                  {/* Hover glow */}
                                  <motion.div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                    style={{
                                      background: `radial-gradient(circle at left, ${STUDIO.or}10 0%, transparent 50%)`,
                                    }}
                                  />
                                  
                                  <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-2">
                                      <span 
                                        className="font-medium text-sm"
                                        style={{ color: STUDIO.ivoire }}
                                      >
                                        {page.name}
                                      </span>
                                      <span 
                                        className="text-xs px-2 py-1 rounded-lg"
                                        style={{ 
                                          backgroundColor: `${STUDIO.ivoire}05`,
                                          color: STUDIO.gris,
                                        }}
                                      >
                                        /{page.slug}
                                      </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                      {page.sections.map((section, sIdx) => (
                                        <motion.span 
                                          key={sIdx} 
                                          className="text-[10px] px-2 py-1 rounded-lg"
                                          style={{ 
                                            backgroundColor: `${STUDIO.or}10`,
                                            color: STUDIO.or,
                                            border: `1px solid ${STUDIO.or}20`,
                                          }}
                                          initial={{ scale: 0 }}
                                          animate={{ scale: 1 }}
                                          transition={{ delay: 0.9 + idx * 0.1 + sIdx * 0.05 }}
                                        >
                                          {section.type}
                                        </motion.span>
                                      ))}
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>

                          {/* Features with pop animation */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 }}
                          >
                            <h4 
                              className="text-xs uppercase tracking-widest mb-4 flex items-center gap-2"
                              style={{ color: STUDIO.gris }}
                            >
                              <Sparkles size={14} />
                              Fonctionnalités incluses
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {proposal.features.map((feature, idx) => (
                                <motion.span 
                                  key={idx} 
                                  className="text-xs px-3 py-2 rounded-xl flex items-center gap-2"
                                  style={{ 
                                    backgroundColor: `${STUDIO.ivoire}05`,
                                    color: STUDIO.ivoire,
                                    border: `1px solid ${STUDIO.ivoire}10`,
                                  }}
                                  initial={{ scale: 0, rotate: -10 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  transition={{ delay: 1.1 + idx * 0.05, type: "spring" }}
                                  whileHover={{ 
                                    scale: 1.05,
                                    backgroundColor: `${STUDIO.or}15`,
                                    borderColor: `${STUDIO.or}30`,
                                  }}
                                >
                                  <Check size={12} style={{ color: STUDIO.or }} />
                                  {feature}
                                </motion.span>
                              ))}
                            </div>
                          </motion.div>
                        </motion.div>
                      </TabsContent>

                      <TabsContent value="preview" className="mt-0">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <WebsitePreview proposal={proposal} />
                        </motion.div>
                      </TabsContent>
                    </Tabs>
                  </motion.div>

                  {/* Pricing card - Premium design */}
                  <motion.div 
                    className="rounded-3xl p-8 relative overflow-hidden"
                    style={{ 
                      background: `linear-gradient(135deg, ${STUDIO.noirCard} 0%, ${STUDIO.noir} 100%)`,
                      border: `1px solid ${STUDIO.or}20`,
                      boxShadow: `0 40px 80px ${STUDIO.noir}60, 0 0 40px ${STUDIO.or}05`,
                    }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    {/* Animated background gradient */}
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: `radial-gradient(ellipse at top right, ${STUDIO.or}08 0%, transparent 50%)`,
                      }}
                      animate={{
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                    />
                    
                    <div className="relative z-10">
                      <h4 
                        className="text-xs uppercase tracking-widest mb-6 flex items-center gap-2"
                        style={{ color: STUDIO.or }}
                      >
                        <Zap size={14} />
                        Estimation tarifaire
                      </h4>
                      
                      {/* Express option */}
                      <motion.button
                        onClick={() => setIsExpress(!isExpress)}
                        className="w-full mb-6 group"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div 
                          className="flex items-center justify-between p-5 rounded-2xl transition-all duration-300"
                          style={{ 
                            backgroundColor: isExpress ? `${STUDIO.or}15` : `${STUDIO.noirSoft}80`,
                            border: `1px solid ${isExpress ? STUDIO.or : STUDIO.ivoire}20`,
                          }}
                        >
                          <div className="flex items-center gap-4">
                            <motion.div 
                              className="w-6 h-6 rounded-lg flex items-center justify-center transition-colors"
                              style={{
                                backgroundColor: isExpress ? STUDIO.or : "transparent",
                                border: `2px solid ${isExpress ? STUDIO.or : STUDIO.gris}`,
                              }}
                              animate={isExpress ? { scale: [1, 1.2, 1] } : {}}
                              transition={{ duration: 0.3 }}
                            >
                              {isExpress && <Check size={14} style={{ color: STUDIO.noir }} />}
                            </motion.div>
                            <div className="text-left">
                              <div className="flex items-center gap-2">
                                <Zap size={16} style={{ color: STUDIO.or }} />
                                <span 
                                  className="font-medium text-sm"
                                  style={{ color: STUDIO.ivoire }}
                                >
                                  Livraison Express (24-48h)
                                </span>
                              </div>
                              <p className="text-xs mt-1" style={{ color: STUDIO.gris }}>
                                Passez devant la file d'attente
                              </p>
                            </div>
                          </div>
                          <span 
                            className="text-sm font-medium px-3 py-1 rounded-lg"
                            style={{ 
                              backgroundColor: `${STUDIO.or}15`,
                              color: STUDIO.or,
                            }}
                          >
                            +50€ / +500DH
                          </span>
                        </div>
                      </motion.button>

                      {/* Price display */}
                      <motion.div 
                        className="p-6 rounded-2xl mb-6"
                        style={{ 
                          backgroundColor: `${STUDIO.noirSoft}80`,
                          border: `1px solid ${STUDIO.ivoire}10`,
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        <div className="flex items-center justify-between">
                          <span style={{ color: STUDIO.gris }}>Total estimé</span>
                          <div className="text-right">
                            <motion.div 
                              className="text-3xl font-light tracking-tight"
                              style={{ 
                                background: `linear-gradient(135deg, ${STUDIO.or} 0%, ${STUDIO.orLight} 100%)`,
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                              }}
                              key={calculatePrice().eur}
                              initial={{ scale: 1.2, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                            >
                              {calculatePrice().eur}€
                            </motion.div>
                            <div className="text-sm" style={{ color: STUDIO.gris }}>
                              {calculatePrice().mad} DH
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      <p className="text-xs mb-6" style={{ color: STUDIO.gris }}>
                        * Prix indicatif. Le devis final dépend des fonctionnalités et personnalisations demandées.
                      </p>

                      {/* CTA buttons */}
                      <div className="space-y-3">
                        <motion.button
                          className="w-full h-14 rounded-2xl relative overflow-hidden group"
                          onClick={handleContactWhatsApp}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div
                            className="absolute inset-0"
                            style={{
                              background: `linear-gradient(135deg, ${STUDIO.or} 0%, ${STUDIO.orLight} 100%)`,
                            }}
                          />
                          <motion.div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100"
                            style={{
                              background: `linear-gradient(90deg, transparent, ${STUDIO.ivoire}30, transparent)`,
                            }}
                            animate={{ x: ["-100%", "200%"] }}
                            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
                          />
                          <span 
                            className="relative z-10 flex items-center justify-center gap-2 font-medium"
                            style={{ color: STUDIO.noir }}
                          >
                            <MessageCircle size={18} />
                            Commander mon site clé en main
                          </span>
                        </motion.button>
                        
                        <motion.button
                          className="w-full h-14 rounded-2xl transition-all duration-300"
                          style={{ 
                            backgroundColor: "transparent",
                            border: `1px solid ${STUDIO.ivoire}20`,
                            color: STUDIO.ivoire,
                          }}
                          onClick={handleContactWhatsApp}
                          whileHover={{ 
                            scale: 1.02,
                            borderColor: STUDIO.or,
                            color: STUDIO.or,
                          }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className="flex items-center justify-center gap-2">
                            <Eye size={18} />
                            Discuter sur WhatsApp
                          </span>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
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
