/**
 * Onboarding - iWasp Style
 * Stealth Luxury theme with Titanium Silver accent (#A5A9B4)
 * Step-by-step card creation after signup
 */

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  Loader2, ArrowLeft, ArrowRight, User, Briefcase, 
  Phone, Link2, Check, Sparkles, Crown, Target,
  Laptop, Camera, Building2, HelpCircle, Mail, MessageCircle,
  Instagram, Linkedin, Lock, Eye, Star, BarChart3, Palette, 
  BadgeCheck, Infinity, Globe
} from "lucide-react";
import { cn } from "@/lib/utils";
import { OnboardingPhotoUpload } from "@/components/onboarding/OnboardingPhotoUpload";
import { QRCodeSVG } from "qrcode.react";

// Stealth Luxury Colors
const COLORS = {
  bg: "#050807",
  bgCard: "#0A0D0C",
  accent: "#A5A9B4",
  accentLight: "#D1D5DB",
  text: "#F9FAFB",
  textMuted: "rgba(249, 250, 251, 0.5)",
  textDim: "rgba(249, 250, 251, 0.3)",
  border: "rgba(165, 169, 180, 0.15)",
  borderActive: "rgba(165, 169, 180, 0.4)",
};

type UserObjective = 'freelance' | 'creator' | 'business' | 'other' | null;

interface FormData {
  first_name: string;
  last_name: string;
  title: string;
  company: string;
  phone: string;
  email: string;
  linkedin: string;
  whatsapp: string;
  instagram: string;
  website: string;
  photo_url: string | null;
  objective: UserObjective;
}

const initialFormData: FormData = {
  first_name: "",
  last_name: "",
  title: "",
  company: "",
  phone: "",
  email: "",
  linkedin: "",
  whatsapp: "",
  instagram: "",
  website: "",
  photo_url: null,
  objective: null,
};

const FREE_LINKS_LIMIT = 3;

const linkFields = [
  { key: 'phone' as const, label: 'Téléphone', icon: Phone, placeholder: '+212 6 00 00 00 00', type: 'tel' },
  { key: 'email' as const, label: 'Email', icon: Mail, placeholder: 'vous@exemple.com', type: 'email' },
  { key: 'whatsapp' as const, label: 'WhatsApp', icon: MessageCircle, placeholder: '+212 6 00 00 00 00', type: 'tel' },
  { key: 'website' as const, label: 'Site web', icon: Globe, placeholder: 'https://monsite.com', type: 'url' },
  { key: 'instagram' as const, label: 'Instagram', icon: Instagram, placeholder: '@votrenom', type: 'text' },
  { key: 'linkedin' as const, label: 'LinkedIn', icon: Linkedin, placeholder: 'linkedin.com/in/votrenom', type: 'text' },
];

const objectiveOptions = [
  { 
    id: 'freelance' as const, 
    label: 'Indépendant / Freelance', 
    icon: Laptop,
    description: 'Consultant, coach, prestataire'
  },
  { 
    id: 'creator' as const, 
    label: 'Créateur / Influenceur', 
    icon: Camera,
    description: 'Artiste, influenceur, content creator'
  },
  { 
    id: 'business' as const, 
    label: 'Entreprise / Équipe', 
    icon: Building2,
    description: 'Startup, PME, équipe commerciale'
  },
  { 
    id: 'other' as const, 
    label: 'Autre', 
    icon: HelpCircle,
    description: 'Usage personnel ou spécifique'
  },
];

const formSteps = [
  { 
    id: 0,
    title: "Bienvenue",
    subtitle: "Découvre iWasp",
    icon: Sparkles,
    fields: [] as const
  },
  { 
    id: 1,
    title: "Objectif",
    subtitle: "Ton usage",
    icon: Target,
    fields: ["objective"] as const
  },
  { 
    id: 2, 
    title: "Profil", 
    subtitle: "Ton identité NFC",
    icon: User,
    fields: ["first_name", "last_name", "title", "company", "photo_url"] as const
  },
  { 
    id: 3, 
    title: "Liens", 
    subtitle: "Tes coordonnées",
    icon: Link2,
    fields: ["phone", "email", "whatsapp", "website", "instagram", "linkedin"] as const
  },
  { 
    id: 4, 
    title: "Aperçu", 
    subtitle: "Ta carte NFC",
    icon: Eye,
    fields: [] as const
  },
  { 
    id: 5, 
    title: "Upgrade", 
    subtitle: "Passe en ELITE",
    icon: Crown,
    fields: [] as const
  },
];

const eliteFeatures = [
  { icon: Infinity, label: "Liens illimités", description: "Ajoute autant de liens que tu veux" },
  { icon: Palette, label: "Templates premium", description: "Designs exclusifs et personnalisables" },
  { icon: BarChart3, label: "Statistiques détaillées", description: "Analyse tes scans et visiteurs" },
  { icon: Star, label: "Personnalisation complète", description: "Couleurs, polices, mise en page" },
  { icon: BadgeCheck, label: "Sans branding iWasp", description: "Ta marque uniquement" },
];

export default function Onboarding() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const progress = useMemo(() => (step / (formSteps.length - 1)) * 100, [step]);

  const createCard = useMutation({
    mutationFn: async (data: FormData) => {
      const slug = `${data.first_name}-${data.last_name}`
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        + `-${Date.now().toString(36)}`;

      const { data: insertedCard, error } = await supabase
        .from("digital_cards")
        .insert({
          first_name: data.first_name,
          last_name: data.last_name,
          title: data.title || null,
          company: data.company || null,
          phone: data.phone || null,
          email: data.email || null,
          linkedin: data.linkedin || null,
          instagram: data.instagram || null,
          whatsapp: data.whatsapp || null,
          website: data.website || null,
          photo_url: data.photo_url || null,
          user_id: user?.id,
          slug,
        })
        .select("slug, first_name, last_name")
        .single();

      if (error) throw error;
      return insertedCard;
    },
    onSuccess: (card) => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      navigate(`/onboarding/success?slug=${card.slug}&name=${encodeURIComponent(`${card.first_name} ${card.last_name}`)}`);
    },
    onError: () => toast.error("Erreur lors de la création"),
  });

  const handleNext = () => {
    if (step === 1) {
      if (!formData.objective) {
        toast.error("Choisis ton objectif pour continuer");
        return;
      }
    }

    if (step === 2) {
      if (!formData.first_name.trim()) {
        toast.error("Le prénom est obligatoire");
        return;
      }
      if (!formData.last_name.trim()) {
        toast.error("Le nom est obligatoire");
        return;
      }
      if (!formData.title.trim()) {
        toast.error("Le poste / activité est obligatoire");
        return;
      }
    }

    if (step < formSteps.length - 1) {
      setStep(step + 1);
    } else {
      createCard.mutate(formData);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    } else {
      navigate("/");
    }
  };

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (authLoading) {
    return (
      <div className="min-h-dvh flex items-center justify-center" style={{ backgroundColor: COLORS.bg }}>
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: COLORS.accent }} />
      </div>
    );
  }

  if (!user) {
    navigate("/signup");
    return null;
  }

  const currentStep = formSteps[step];

  // Welcome Screen (Step 0)
  if (step === 0) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center p-6 relative overflow-hidden" style={{ backgroundColor: COLORS.bg }}>
        {/* Background glow */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-[120px]" 
          style={{ backgroundColor: `${COLORS.accent}10` }}
        />
        
        <div className="relative z-10 text-center max-w-md">
          {/* Logo */}
          <div 
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-8"
            style={{ backgroundColor: `${COLORS.accent}20` }}
          >
            <Crown className="w-10 h-10" style={{ color: COLORS.accent }} />
          </div>
          
          <h1 className="text-4xl font-bold mb-4" style={{ color: COLORS.text }}>
            Bienvenue sur iWasp
          </h1>
          
          <p className="text-xl leading-relaxed mb-8" style={{ color: COLORS.textMuted }}>
            Simplifie le partage de ton identité professionnelle grâce au NFC.
          </p>
          
          <div className="space-y-4 mb-10">
            <div 
              className="flex items-center gap-4 text-left p-4 rounded-xl"
              style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.border}` }}
            >
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${COLORS.accent}20` }}
              >
                <Sparkles className="w-5 h-5" style={{ color: COLORS.accent }} />
              </div>
              <div>
                <p className="font-medium" style={{ color: COLORS.text }}>Crée ton profil en 2 minutes</p>
                <p className="text-sm" style={{ color: COLORS.textDim }}>Simple et rapide</p>
              </div>
            </div>
            
            <div 
              className="flex items-center gap-4 text-left p-4 rounded-xl"
              style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.border}` }}
            >
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${COLORS.accent}20` }}
              >
                <Link2 className="w-5 h-5" style={{ color: COLORS.accent }} />
              </div>
              <div>
                <p className="font-medium" style={{ color: COLORS.text }}>Partage d'un simple tap</p>
                <p className="text-sm" style={{ color: COLORS.textDim }}>NFC + QR Code</p>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleNext}
            className="w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2"
            style={{ 
              backgroundColor: COLORS.accent, 
              color: COLORS.bg 
            }}
          >
            Créer ma carte NFC
            <ArrowRight size={20} />
          </button>
          
          <p className="text-sm mt-6" style={{ color: COLORS.textDim }}>
            Gratuit • Sans engagement
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col" style={{ backgroundColor: COLORS.bg }}>
      {/* Header */}
      <header 
        className="sticky top-0 z-50 backdrop-blur safe-top"
        style={{ backgroundColor: `${COLORS.bg}F2`, borderBottom: `1px solid ${COLORS.border}` }}
      >
        <div className="flex items-center justify-between h-14 px-4">
          <button onClick={handleBack} className="p-2 transition-colors hover:opacity-80" style={{ color: COLORS.textMuted }}>
            <ArrowLeft size={20} />
          </button>
          
          <div className="flex items-center gap-2">
            {formSteps.slice(1).map((s) => (
              <div
                key={s.id}
                className={cn(
                  "h-2 rounded-full transition-all",
                  s.id === step ? "w-6" : "w-2"
                )}
                style={{ 
                  backgroundColor: s.id <= step ? COLORS.accent : `${COLORS.text}20`
                }}
              />
            ))}
          </div>
          
          <div className="w-9" />
        </div>
        
        {/* Progress bar */}
        <div className="h-1" style={{ backgroundColor: COLORS.bgCard }}>
          <div 
            className="h-full transition-all duration-300"
            style={{ width: `${progress}%`, backgroundColor: COLORS.accent }}
          />
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Form section */}
        <div className="flex-1 p-6 md:p-10 animate-fade-in">
          <div className="max-w-md mx-auto">
            {/* Step indicator */}
            <div className="flex items-center gap-3 mb-8">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${COLORS.accent}20` }}
              >
                <currentStep.icon className="h-6 w-6" style={{ color: COLORS.accent }} />
              </div>
              <div>
                <p className="text-sm" style={{ color: COLORS.textDim }}>Étape {step}/{formSteps.length - 1}</p>
                <h1 className="text-xl font-semibold" style={{ color: COLORS.text }}>{currentStep.title}</h1>
              </div>
            </div>

            {/* Form fields */}
            <div className="space-y-4">
              {step === 1 && (
                <>
                  <p className="text-lg font-medium mb-6" style={{ color: COLORS.text }}>
                    Quel est ton objectif avec iWasp ?
                  </p>
                  <div className="space-y-3">
                    {objectiveOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setFormData(prev => ({ ...prev, objective: option.id }))}
                        className="w-full flex items-center gap-4 p-4 rounded-xl transition-all text-left"
                        style={{
                          border: `1px solid ${formData.objective === option.id ? COLORS.borderActive : COLORS.border}`,
                          backgroundColor: formData.objective === option.id ? `${COLORS.accent}10` : COLORS.bgCard
                        }}
                      >
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
                          style={{ 
                            backgroundColor: formData.objective === option.id ? `${COLORS.accent}20` : `${COLORS.text}10`
                          }}
                        >
                          <option.icon 
                            className="w-6 h-6"
                            style={{ color: formData.objective === option.id ? COLORS.accent : COLORS.textMuted }}
                          />
                        </div>
                        <div>
                          <p 
                            className="font-medium"
                            style={{ color: formData.objective === option.id ? COLORS.text : COLORS.textMuted }}
                          >
                            {option.label}
                          </p>
                          <p className="text-sm" style={{ color: COLORS.textDim }}>{option.description}</p>
                        </div>
                        {formData.objective === option.id && (
                          <Check className="w-5 h-5 ml-auto" style={{ color: COLORS.accent }} />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="flex justify-center mb-6">
                    <OnboardingPhotoUpload
                      value={formData.photo_url}
                      onChange={(url) => setFormData(prev => ({ ...prev, photo_url: url }))}
                      initials={`${formData.first_name.charAt(0)}${formData.last_name.charAt(0)}`}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label style={{ color: COLORS.textMuted }}>Prénom *</Label>
                      <Input
                        value={formData.first_name}
                        onChange={(e) => updateField("first_name", e.target.value)}
                        placeholder="Jean"
                        className="h-12"
                        style={{ 
                          backgroundColor: COLORS.bgCard, 
                          borderColor: COLORS.border, 
                          color: COLORS.text 
                        }}
                        autoFocus
                      />
                    </div>
                    <div className="space-y-2">
                      <Label style={{ color: COLORS.textMuted }}>Nom *</Label>
                      <Input
                        value={formData.last_name}
                        onChange={(e) => updateField("last_name", e.target.value)}
                        placeholder="Dupont"
                        className="h-12"
                        style={{ 
                          backgroundColor: COLORS.bgCard, 
                          borderColor: COLORS.border, 
                          color: COLORS.text 
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label style={{ color: COLORS.textMuted }}>Poste / Activité *</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => updateField("title", e.target.value)}
                      placeholder="Directeur Commercial"
                      className="h-12"
                      style={{ 
                        backgroundColor: COLORS.bgCard, 
                        borderColor: COLORS.border, 
                        color: COLORS.text 
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label style={{ color: COLORS.textMuted }}>
                      Entreprise <span style={{ color: COLORS.textDim }}>(optionnel)</span>
                    </Label>
                    <Input
                      value={formData.company}
                      onChange={(e) => updateField("company", e.target.value)}
                      placeholder="iWasp"
                      className="h-12"
                      style={{ 
                        backgroundColor: COLORS.bgCard, 
                        borderColor: COLORS.border, 
                        color: COLORS.text 
                      }}
                    />
                  </div>

                  <p className="text-center text-sm mt-4 flex items-center justify-center gap-2" style={{ color: COLORS.textDim }}>
                    <Check className="w-4 h-4" style={{ color: COLORS.accent }} />
                    Tu pourras modifier ces informations à tout moment.
                  </p>
                </>
              )}

              {step === 3 && (
                <>
                  {/* Links counter */}
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm" style={{ color: COLORS.textMuted }}>
                      Liens ajoutés : <span 
                        className="font-semibold"
                        style={{ 
                          color: linkFields.filter(f => formData[f.key]?.trim()).length >= FREE_LINKS_LIMIT 
                            ? COLORS.accent 
                            : COLORS.text 
                        }}
                      >
                        {linkFields.filter(f => formData[f.key]?.trim()).length}
                      </span>
                      <span style={{ color: COLORS.textDim }}> / {FREE_LINKS_LIMIT} (FREE)</span>
                    </p>
                  </div>

                  <div className="space-y-3">
                    {linkFields.map((field, index) => {
                      const filledCount = linkFields.filter(f => formData[f.key]?.trim()).length;
                      const isCurrentFilled = formData[field.key]?.trim();
                      const isLocked = !isCurrentFilled && filledCount >= FREE_LINKS_LIMIT;
                      
                      return (
                        <div key={field.key} className="relative">
                          <div 
                            className="flex items-center gap-3 p-3 rounded-xl transition-all"
                            style={{
                              border: `1px solid ${isLocked ? COLORS.border : isCurrentFilled ? COLORS.borderActive : COLORS.border}`,
                              backgroundColor: isLocked ? `${COLORS.bgCard}80` : isCurrentFilled ? `${COLORS.accent}05` : COLORS.bgCard,
                              opacity: isLocked ? 0.6 : 1
                            }}
                          >
                            <div 
                              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: isCurrentFilled ? `${COLORS.accent}20` : `${COLORS.text}10` }}
                            >
                              {isLocked ? (
                                <Lock className="w-5 h-5" style={{ color: COLORS.textDim }} />
                              ) : (
                                <field.icon 
                                  className="w-5 h-5"
                                  style={{ color: isCurrentFilled ? COLORS.accent : COLORS.textDim }}
                                />
                              )}
                            </div>
                            <div className="flex-1">
                              <Label className="text-xs mb-1 block" style={{ color: COLORS.textMuted }}>{field.label}</Label>
                              <Input
                                type={field.type}
                                value={formData[field.key]}
                                onChange={(e) => {
                                  if (isLocked) {
                                    toast.error("Passe en ELITE pour des liens illimités");
                                    return;
                                  }
                                  updateField(field.key, e.target.value);
                                }}
                                placeholder={field.placeholder}
                                disabled={isLocked}
                                className={cn(
                                  "h-10 border-0 bg-transparent p-0 focus-visible:ring-0",
                                  isLocked && "cursor-not-allowed"
                                )}
                                style={{ color: COLORS.text }}
                                autoFocus={index === 0}
                              />
                            </div>
                            {isCurrentFilled && (
                              <Check className="w-5 h-5" style={{ color: COLORS.accent }} />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* ELITE upgrade message */}
                  <div 
                    className="mt-6 p-4 rounded-xl"
                    style={{ 
                      background: `linear-gradient(135deg, ${COLORS.accent}15, ${COLORS.accent}05)`,
                      border: `1px solid ${COLORS.borderActive}`
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${COLORS.accent}20` }}
                      >
                        <Crown className="w-5 h-5" style={{ color: COLORS.accent }} />
                      </div>
                      <div>
                        <p className="font-medium text-sm" style={{ color: COLORS.text }}>Passe en ELITE pour des liens illimités</p>
                        <p className="text-xs" style={{ color: COLORS.textDim }}>+ Analytics, CRM, et plus encore</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {step === 4 && (
                <>
                  <p className="text-center mb-6" style={{ color: COLORS.textMuted }}>
                    Voici ce que verront les personnes qui scannent ta carte.
                  </p>

                  {/* Card Preview */}
                  <div className="bg-white rounded-3xl p-6 shadow-2xl mx-auto max-w-[320px]">
                    {/* Profile Photo */}
                    <div className="flex justify-center mb-4">
                      <div className="w-24 h-24 rounded-full bg-[#F5F5F7] flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                        {formData.photo_url ? (
                          <img 
                            src={formData.photo_url} 
                            alt="Photo" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-3xl font-bold text-[#1D1D1F]">
                            {formData.first_name.charAt(0)}{formData.last_name.charAt(0)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Name */}
                    <h2 className="text-xl font-bold text-[#1D1D1F] text-center">
                      {formData.first_name} {formData.last_name}
                    </h2>

                    {/* Title & Company */}
                    {(formData.title || formData.company) && (
                      <p className="text-[#8E8E93] text-center mt-1">
                        {formData.title}{formData.title && formData.company ? " · " : ""}{formData.company}
                      </p>
                    )}

                    {/* Links Preview */}
                    <div className="flex flex-wrap justify-center gap-3 mt-5">
                      {formData.phone && (
                        <div className="w-11 h-11 rounded-full bg-[#A5A9B4]/10 flex items-center justify-center">
                          <Phone className="w-5 h-5 text-[#A5A9B4]" />
                        </div>
                      )}
                      {formData.email && (
                        <div className="w-11 h-11 rounded-full bg-[#A5A9B4]/10 flex items-center justify-center">
                          <Mail className="w-5 h-5 text-[#A5A9B4]" />
                        </div>
                      )}
                      {formData.whatsapp && (
                        <div className="w-11 h-11 rounded-full bg-[#25D366]/10 flex items-center justify-center">
                          <MessageCircle className="w-5 h-5 text-[#25D366]" />
                        </div>
                      )}
                      {formData.website && (
                        <div className="w-11 h-11 rounded-full bg-[#6366F1]/10 flex items-center justify-center">
                          <Globe className="w-5 h-5 text-[#6366F1]" />
                        </div>
                      )}
                      {formData.instagram && (
                        <div className="w-11 h-11 rounded-full bg-[#E4405F]/10 flex items-center justify-center">
                          <Instagram className="w-5 h-5 text-[#E4405F]" />
                        </div>
                      )}
                      {formData.linkedin && (
                        <div className="w-11 h-11 rounded-full bg-[#0A66C2]/10 flex items-center justify-center">
                          <Linkedin className="w-5 h-5 text-[#0A66C2]" />
                        </div>
                      )}
                    </div>

                    {/* QR Code */}
                    <div className="mt-6 flex justify-center">
                      <div className="p-3 bg-[#F5F5F7] rounded-2xl">
                        <QRCodeSVG 
                          value={`https://iwasp.app/c/${formData.first_name.toLowerCase()}-${formData.last_name.toLowerCase()}`}
                          size={100}
                          level="M"
                          fgColor="#1D1D1F"
                          bgColor="#F5F5F7"
                        />
                      </div>
                    </div>

                    {/* i-wasp.com CORPORATION Badge */}
                    <a 
                      href="https://i-wasp.com" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center justify-center gap-1 mt-4 hover:opacity-100 transition-opacity"
                      style={{ opacity: 0.6 }}
                    >
                      <span className="text-[10px] font-semibold text-[#1D1D1F]" style={{ letterSpacing: "0.08em" }}>i-wasp.com</span>
                      <span className="text-[9px] font-medium text-[#8E8E93] uppercase" style={{ letterSpacing: "0.12em" }}>CORPORATION</span>
                    </a>
                  </div>

                  <p className="text-center text-xs mt-6" style={{ color: COLORS.textDim }}>
                    Le QR code sera généré automatiquement après création
                  </p>
                </>
              )}

              {step === 5 && (
                <>
                  {/* ELITE Header */}
                  <div className="text-center mb-8">
                    <div 
                      className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg"
                      style={{ 
                        background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentLight})`,
                        boxShadow: `0 20px 40px ${COLORS.accent}30`
                      }}
                    >
                      <Crown className="w-8 h-8" style={{ color: COLORS.bg }} />
                    </div>
                    <h2 className="text-2xl font-bold mb-2" style={{ color: COLORS.text }}>
                      Débloque tout le potentiel de ta carte NFC
                    </h2>
                    <p style={{ color: COLORS.textMuted }}>
                      Passe en ELITE et transforme ta carte en outil business
                    </p>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 mb-8">
                    {eliteFeatures.map((feature, index) => (
                      <div 
                        key={feature.label}
                        className="flex items-center gap-4 p-4 rounded-xl animate-fade-in"
                        style={{ 
                          backgroundColor: COLORS.bgCard, 
                          border: `1px solid ${COLORS.border}`,
                          animationDelay: `${index * 100}ms` 
                        }}
                      >
                        <div 
                          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${COLORS.accent}20` }}
                        >
                          <feature.icon className="w-5 h-5" style={{ color: COLORS.accent }} />
                        </div>
                        <div>
                          <p className="font-medium" style={{ color: COLORS.text }}>{feature.label}</p>
                          <p className="text-sm" style={{ color: COLORS.textDim }}>{feature.description}</p>
                        </div>
                        <Check className="w-5 h-5 ml-auto flex-shrink-0" style={{ color: COLORS.accent }} />
                      </div>
                    ))}
                  </div>

                  {/* Pricing */}
                  <div 
                    className="p-5 rounded-2xl mb-6"
                    style={{ 
                      background: `linear-gradient(135deg, ${COLORS.accent}20, ${COLORS.accent}05)`,
                      border: `1px solid ${COLORS.borderActive}`
                    }}
                  >
                    <div className="flex items-baseline justify-center gap-1 mb-2">
                      <span className="text-4xl font-bold" style={{ color: COLORS.text }}>49</span>
                      <span className="text-xl" style={{ color: COLORS.textMuted }}>MAD</span>
                      <span style={{ color: COLORS.textDim }}>/mois</span>
                    </div>
                    <p className="text-center text-sm" style={{ color: COLORS.textDim }}>
                      ou 499 MAD/an <span style={{ color: COLORS.accent }}>(2 mois offerts)</span>
                    </p>
                  </div>

                  {/* ELITE CTA Button */}
                  <button 
                    onClick={() => {
                      toast.success("Redirection vers le paiement...");
                      createCard.mutate(formData);
                    }}
                    disabled={createCard.isPending}
                    className="w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    style={{ 
                      background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentLight})`,
                      color: COLORS.bg,
                      boxShadow: `0 20px 40px ${COLORS.accent}30`
                    }}
                  >
                    {createCard.isPending ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <Crown size={20} />
                        Passer en ELITE – 49 MAD/mois
                      </>
                    )}
                  </button>

                  {/* Skip Option */}
                  <button 
                    onClick={() => createCard.mutate(formData)}
                    disabled={createCard.isPending}
                    className="w-full mt-4 py-3 transition-colors text-sm"
                    style={{ color: COLORS.textDim }}
                  >
                    Continuer avec FREE
                  </button>
                </>
              )}
            </div>

            {/* Navigation */}
            <div className="mt-8 flex gap-3">
              {step > 1 && (
                <Button 
                  variant="outline" 
                  onClick={handleBack}
                  className="flex-1 h-12"
                  style={{ 
                    borderColor: COLORS.border, 
                    color: COLORS.textMuted,
                    backgroundColor: 'transparent'
                  }}
                >
                  Retour
                </Button>
              )}
              <button 
                onClick={handleNext}
                disabled={createCard.isPending}
                className="flex-1 h-12 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                style={{ backgroundColor: COLORS.accent, color: COLORS.bg }}
              >
                {createCard.isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : step === formSteps.length - 1 ? (
                  <>
                    <Check size={18} />
                    Créer ma carte
                  </>
                ) : (
                  <>
                    Continuer
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>

            {step > 1 && step < formSteps.length - 1 && (
              <p className="text-center text-xs mt-4" style={{ color: COLORS.textDim }}>
                Ces champs sont optionnels
              </p>
            )}
          </div>
        </div>

        {/* Live preview section - Desktop only */}
        <div 
          className="hidden md:flex md:w-[380px] p-6 items-center justify-center"
          style={{ backgroundColor: `${COLORS.bgCard}80`, borderLeft: `1px solid ${COLORS.border}` }}
        >
          <Card className="w-full max-w-[300px] p-6 bg-white rounded-2xl shadow-xl">
            <div className="text-center">
              <div 
                className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden"
                style={{ backgroundColor: `${COLORS.accent}10` }}
              >
                {formData.photo_url ? (
                  <img 
                    src={formData.photo_url} 
                    alt="Photo" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-semibold" style={{ color: COLORS.accent }}>
                    {formData.first_name.charAt(0) || "?"}
                    {formData.last_name.charAt(0) || ""}
                  </span>
                )}
              </div>
              
              <h2 className="text-lg font-semibold" style={{ color: COLORS.bg }}>
                {formData.first_name || "Prénom"} {formData.last_name || "Nom"}
              </h2>
              
              {(formData.title || formData.company) && (
                <p className="text-sm mt-1" style={{ color: `${COLORS.bg}99` }}>
                  {formData.title}{formData.title && formData.company && " · "}{formData.company}
                </p>
              )}
              
              {formData.email && (
                <p className="text-sm mt-4 truncate" style={{ color: `${COLORS.bg}80` }}>{formData.email}</p>
              )}
              {formData.phone && (
                <p className="text-sm" style={{ color: `${COLORS.bg}80` }}>{formData.phone}</p>
              )}
            </div>
            
            <p className="text-[10px] text-center mt-6" style={{ color: `${COLORS.bg}50` }}>
              Aperçu en temps réel
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
