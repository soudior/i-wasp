/**
 * Onboarding - iWasp Style
 * Dark theme with gold accent (#FFC700)
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
  Instagram, Linkedin, Lock, Eye
} from "lucide-react";
import { cn } from "@/lib/utils";
import { OnboardingPhotoUpload } from "@/components/onboarding/OnboardingPhotoUpload";
import { QRCodeSVG } from "qrcode.react";

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
    fields: ["phone", "email", "whatsapp", "instagram", "linkedin"] as const
  },
  { 
    id: 4, 
    title: "Aperçu", 
    subtitle: "Ta carte NFC",
    icon: Eye,
    fields: [] as const
  },
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
      <div className="min-h-dvh flex items-center justify-center bg-[#0B0B0B]">
        <Loader2 className="h-8 w-8 animate-spin text-[#FFC700]" />
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
      <div className="min-h-dvh flex flex-col items-center justify-center p-6 bg-[#0B0B0B] relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#FFC700]/10 rounded-full blur-[120px]" />
        
        <div className="relative z-10 text-center max-w-md">
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#FFC700]/20 mb-8">
            <Crown className="w-10 h-10 text-[#FFC700]" />
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">
            Bienvenue sur iWasp
          </h1>
          
          <p className="text-xl text-[#E5E5E5]/70 leading-relaxed mb-8">
            Simplifie le partage de ton identité professionnelle grâce au NFC.
          </p>
          
          <div className="space-y-4 mb-10">
            <div className="flex items-center gap-4 text-left p-4 rounded-xl bg-[#1F1F1F] border border-[#E5E5E5]/10">
              <div className="w-10 h-10 rounded-lg bg-[#FFC700]/20 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-[#FFC700]" />
              </div>
              <div>
                <p className="text-white font-medium">Crée ton profil en 2 minutes</p>
                <p className="text-[#E5E5E5]/50 text-sm">Simple et rapide</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-left p-4 rounded-xl bg-[#1F1F1F] border border-[#E5E5E5]/10">
              <div className="w-10 h-10 rounded-lg bg-[#FFC700]/20 flex items-center justify-center flex-shrink-0">
                <Link2 className="w-5 h-5 text-[#FFC700]" />
              </div>
              <div>
                <p className="text-white font-medium">Partage d'un simple tap</p>
                <p className="text-[#E5E5E5]/50 text-sm">NFC + QR Code</p>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleNext}
            className="w-full py-4 rounded-xl font-bold text-lg text-[#0B0B0B] bg-[#FFC700] hover:bg-[#FFC700]/90 transition-all flex items-center justify-center gap-2"
          >
            Créer ma carte NFC
            <ArrowRight size={20} />
          </button>
          
          <p className="text-[#E5E5E5]/40 text-sm mt-6">
            Gratuit • Sans engagement
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#0B0B0B] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0B0B0B]/95 backdrop-blur border-b border-[#E5E5E5]/10 safe-top">
        <div className="flex items-center justify-between h-14 px-4">
          <button onClick={handleBack} className="p-2 text-[#E5E5E5]/70 hover:text-white">
            <ArrowLeft size={20} />
          </button>
          
          <div className="flex items-center gap-2">
            {formSteps.slice(1).map((s) => (
              <div
                key={s.id}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  s.id === step ? "bg-[#FFC700] w-6" : 
                  s.id < step ? "bg-[#FFC700]" : "bg-[#E5E5E5]/20"
                )}
              />
            ))}
          </div>
          
          <div className="w-9" />
        </div>
        
        {/* Progress bar */}
        <div className="h-1 bg-[#1F1F1F]">
          <div 
            className="h-full bg-[#FFC700] transition-all duration-300"
            style={{ width: `${progress}%` }}
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
              <div className="w-12 h-12 rounded-xl bg-[#FFC700]/20 flex items-center justify-center">
                <currentStep.icon className="h-6 w-6 text-[#FFC700]" />
              </div>
              <div>
                <p className="text-sm text-[#E5E5E5]/50">Étape {step}/{formSteps.length - 1}</p>
                <h1 className="text-xl font-semibold text-white">{currentStep.title}</h1>
              </div>
            </div>

            {/* Form fields */}
            <div className="space-y-4">
              {step === 1 && (
                <>
                  <p className="text-lg text-white font-medium mb-6">
                    Quel est ton objectif avec iWasp ?
                  </p>
                  <div className="space-y-3">
                    {objectiveOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setFormData(prev => ({ ...prev, objective: option.id }))}
                        className={cn(
                          "w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left",
                          formData.objective === option.id
                            ? "border-[#FFC700] bg-[#FFC700]/10"
                            : "border-[#E5E5E5]/10 bg-[#1F1F1F] hover:border-[#E5E5E5]/30"
                        )}
                      >
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors",
                          formData.objective === option.id
                            ? "bg-[#FFC700]/20"
                            : "bg-[#E5E5E5]/10"
                        )}>
                          <option.icon className={cn(
                            "w-6 h-6",
                            formData.objective === option.id ? "text-[#FFC700]" : "text-[#E5E5E5]/70"
                          )} />
                        </div>
                        <div>
                          <p className={cn(
                            "font-medium",
                            formData.objective === option.id ? "text-white" : "text-[#E5E5E5]"
                          )}>
                            {option.label}
                          </p>
                          <p className="text-sm text-[#E5E5E5]/50">{option.description}</p>
                        </div>
                        {formData.objective === option.id && (
                          <Check className="w-5 h-5 text-[#FFC700] ml-auto" />
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
                      <Label className="text-[#E5E5E5]/70">Prénom *</Label>
                      <Input
                        value={formData.first_name}
                        onChange={(e) => updateField("first_name", e.target.value)}
                        placeholder="Jean"
                        className="h-12 bg-[#1F1F1F] border-[#E5E5E5]/10 text-white placeholder:text-[#E5E5E5]/30 focus:border-[#FFC700]/50"
                        autoFocus
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[#E5E5E5]/70">Nom *</Label>
                      <Input
                        value={formData.last_name}
                        onChange={(e) => updateField("last_name", e.target.value)}
                        placeholder="Dupont"
                        className="h-12 bg-[#1F1F1F] border-[#E5E5E5]/10 text-white placeholder:text-[#E5E5E5]/30 focus:border-[#FFC700]/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[#E5E5E5]/70">Poste / Activité *</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => updateField("title", e.target.value)}
                      placeholder="Directeur Commercial"
                      className="h-12 bg-[#1F1F1F] border-[#E5E5E5]/10 text-white placeholder:text-[#E5E5E5]/30 focus:border-[#FFC700]/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[#E5E5E5]/70">Entreprise <span className="text-[#E5E5E5]/40">(optionnel)</span></Label>
                    <Input
                      value={formData.company}
                      onChange={(e) => updateField("company", e.target.value)}
                      placeholder="iWasp"
                      className="h-12 bg-[#1F1F1F] border-[#E5E5E5]/10 text-white placeholder:text-[#E5E5E5]/30 focus:border-[#FFC700]/50"
                    />
                  </div>

                  <p className="text-center text-sm text-[#E5E5E5]/50 mt-4 flex items-center justify-center gap-2">
                    <Check className="w-4 h-4 text-[#FFC700]" />
                    Tu pourras modifier ces informations à tout moment.
                  </p>
                </>
              )}

              {step === 3 && (
                <>
                  {/* Links counter */}
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-[#E5E5E5]/70">
                      Liens ajoutés : <span className={cn(
                        "font-semibold",
                        linkFields.filter(f => formData[f.key]?.trim()).length >= FREE_LINKS_LIMIT 
                          ? "text-[#FFC700]" 
                          : "text-white"
                      )}>
                        {linkFields.filter(f => formData[f.key]?.trim()).length}
                      </span>
                      <span className="text-[#E5E5E5]/40"> / {FREE_LINKS_LIMIT} (FREE)</span>
                    </p>
                  </div>

                  <div className="space-y-3">
                    {linkFields.map((field, index) => {
                      const filledCount = linkFields.filter(f => formData[f.key]?.trim()).length;
                      const isCurrentFilled = formData[field.key]?.trim();
                      const isLocked = !isCurrentFilled && filledCount >= FREE_LINKS_LIMIT;
                      
                      return (
                        <div key={field.key} className="relative">
                          <div className={cn(
                            "flex items-center gap-3 p-3 rounded-xl border transition-all",
                            isLocked 
                              ? "border-[#E5E5E5]/5 bg-[#1F1F1F]/50 opacity-60" 
                              : formData[field.key]?.trim() 
                                ? "border-[#FFC700]/30 bg-[#FFC700]/5" 
                                : "border-[#E5E5E5]/10 bg-[#1F1F1F]"
                          )}>
                            <div className={cn(
                              "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                              formData[field.key]?.trim() ? "bg-[#FFC700]/20" : "bg-[#E5E5E5]/10"
                            )}>
                              {isLocked ? (
                                <Lock className="w-5 h-5 text-[#E5E5E5]/40" />
                              ) : (
                                <field.icon className={cn(
                                  "w-5 h-5",
                                  formData[field.key]?.trim() ? "text-[#FFC700]" : "text-[#E5E5E5]/50"
                                )} />
                              )}
                            </div>
                            <div className="flex-1">
                              <Label className="text-[#E5E5E5]/70 text-xs mb-1 block">{field.label}</Label>
                              <Input
                                type={field.type}
                                value={formData[field.key]}
                                onChange={(e) => {
                                  if (isLocked) {
                                    toast.error("Passe en GOLD pour des liens illimités");
                                    return;
                                  }
                                  updateField(field.key, e.target.value);
                                }}
                                placeholder={field.placeholder}
                                disabled={isLocked}
                                className={cn(
                                  "h-10 border-0 bg-transparent text-white placeholder:text-[#E5E5E5]/30 p-0 focus-visible:ring-0",
                                  isLocked && "cursor-not-allowed"
                                )}
                                autoFocus={index === 0}
                              />
                            </div>
                            {formData[field.key]?.trim() && (
                              <Check className="w-5 h-5 text-[#FFC700]" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* GOLD upgrade message */}
                  <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-[#FFC700]/10 to-[#FFC700]/5 border border-[#FFC700]/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#FFC700]/20 flex items-center justify-center flex-shrink-0">
                        <Crown className="w-5 h-5 text-[#FFC700]" />
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">Passe en GOLD pour des liens illimités</p>
                        <p className="text-[#E5E5E5]/50 text-xs">+ Analytics, CRM, et plus encore</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {step === 4 && (
                <>
                  <p className="text-center text-[#E5E5E5]/70 mb-6">
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
                    <div className="flex justify-center gap-3 mt-5">
                      {formData.phone && (
                        <div className="w-11 h-11 rounded-full bg-[#007AFF]/10 flex items-center justify-center">
                          <Phone className="w-5 h-5 text-[#007AFF]" />
                        </div>
                      )}
                      {formData.email && (
                        <div className="w-11 h-11 rounded-full bg-[#007AFF]/10 flex items-center justify-center">
                          <Mail className="w-5 h-5 text-[#007AFF]" />
                        </div>
                      )}
                      {formData.whatsapp && (
                        <div className="w-11 h-11 rounded-full bg-[#25D366]/10 flex items-center justify-center">
                          <MessageCircle className="w-5 h-5 text-[#25D366]" />
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

                    {/* IWASP Badge */}
                    <p className="text-center text-[10px] text-[#8E8E93] mt-4 tracking-wide">
                      Powered by IWASP
                    </p>
                  </div>

                  <p className="text-center text-xs text-[#E5E5E5]/40 mt-6">
                    Le QR code sera généré automatiquement après création
                  </p>
                </>
              )}
            </div>

            {/* Navigation */}
            <div className="mt-8 flex gap-3">
              {step > 1 && (
                <Button 
                  variant="outline" 
                  onClick={handleBack}
                  className="flex-1 h-12 border-[#E5E5E5]/20 text-[#E5E5E5] hover:bg-[#1F1F1F]"
                >
                  Retour
                </Button>
              )}
              <button 
                onClick={handleNext}
                disabled={createCard.isPending}
                className="flex-1 h-12 rounded-xl font-bold text-[#0B0B0B] bg-[#FFC700] hover:bg-[#FFC700]/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
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
              <p className="text-center text-xs text-[#E5E5E5]/40 mt-4">
                Ces champs sont optionnels
              </p>
            )}
          </div>
        </div>

        {/* Live preview section - Desktop only */}
        <div className="hidden md:flex md:w-[380px] bg-[#1F1F1F]/50 border-l border-[#E5E5E5]/10 p-6 items-center justify-center">
          <Card className="w-full max-w-[300px] p-6 bg-white rounded-2xl shadow-xl">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-[#FFC700]/10 mx-auto mb-4 flex items-center justify-center overflow-hidden">
                {formData.photo_url ? (
                  <img 
                    src={formData.photo_url} 
                    alt="Photo" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-semibold text-[#FFC700]">
                    {formData.first_name.charAt(0) || "?"}
                    {formData.last_name.charAt(0) || ""}
                  </span>
                )}
              </div>
              
              <h2 className="text-lg font-semibold text-[#0B0B0B]">
                {formData.first_name || "Prénom"} {formData.last_name || "Nom"}
              </h2>
              
              {(formData.title || formData.company) && (
                <p className="text-sm text-[#0B0B0B]/60 mt-1">
                  {formData.title}{formData.title && formData.company && " · "}{formData.company}
                </p>
              )}
              
              {formData.email && (
                <p className="text-sm text-[#0B0B0B]/50 mt-4 truncate">{formData.email}</p>
              )}
              {formData.phone && (
                <p className="text-sm text-[#0B0B0B]/50">{formData.phone}</p>
              )}
            </div>
            
            <p className="text-[10px] text-center text-[#0B0B0B]/30 mt-6">
              Aperçu en temps réel
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
