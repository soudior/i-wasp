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
  Phone, Link2, Check, Sparkles, Crown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { OnboardingPhotoUpload } from "@/components/onboarding/OnboardingPhotoUpload";

interface FormData {
  first_name: string;
  last_name: string;
  title: string;
  company: string;
  phone: string;
  email: string;
  linkedin: string;
  whatsapp: string;
  website: string;
  photo_url: string | null;
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
  website: "",
  photo_url: null,
};

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
    title: "Identité", 
    subtitle: "Qui es-tu ?",
    icon: User,
    fields: ["first_name", "last_name", "photo_url"] as const
  },
  { 
    id: 2, 
    title: "Profession", 
    subtitle: "Que fais-tu ?",
    icon: Briefcase,
    fields: ["title", "company"] as const
  },
  { 
    id: 3, 
    title: "Contact", 
    subtitle: "Comment te joindre ?",
    icon: Phone,
    fields: ["phone", "email", "whatsapp"] as const
  },
  { 
    id: 4, 
    title: "Liens", 
    subtitle: "Tes réseaux",
    icon: Link2,
    fields: ["linkedin", "website"] as const
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
      if (!formData.first_name.trim()) {
        toast.error("Le prénom est obligatoire");
        return;
      }
      if (!formData.last_name.trim()) {
        toast.error("Le nom est obligatoire");
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
                  <div className="flex justify-center mb-6">
                    <OnboardingPhotoUpload
                      value={formData.photo_url}
                      onChange={(url) => setFormData(prev => ({ ...prev, photo_url: url }))}
                      initials={`${formData.first_name.charAt(0)}${formData.last_name.charAt(0)}`}
                    />
                  </div>
                  
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
                </>
              )}

              {step === 2 && (
                <>
                  <div className="space-y-2">
                    <Label className="text-[#E5E5E5]/70">Poste</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => updateField("title", e.target.value)}
                      placeholder="Directeur Commercial"
                      className="h-12 bg-[#1F1F1F] border-[#E5E5E5]/10 text-white placeholder:text-[#E5E5E5]/30 focus:border-[#FFC700]/50"
                      autoFocus
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#E5E5E5]/70">Entreprise</Label>
                    <Input
                      value={formData.company}
                      onChange={(e) => updateField("company", e.target.value)}
                      placeholder="iWasp"
                      className="h-12 bg-[#1F1F1F] border-[#E5E5E5]/10 text-white placeholder:text-[#E5E5E5]/30 focus:border-[#FFC700]/50"
                    />
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div className="space-y-2">
                    <Label className="text-[#E5E5E5]/70">Téléphone</Label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      placeholder="+212 6 00 00 00 00"
                      className="h-12 bg-[#1F1F1F] border-[#E5E5E5]/10 text-white placeholder:text-[#E5E5E5]/30 focus:border-[#FFC700]/50"
                      autoFocus
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#E5E5E5]/70">Email</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      placeholder="vous@exemple.com"
                      className="h-12 bg-[#1F1F1F] border-[#E5E5E5]/10 text-white placeholder:text-[#E5E5E5]/30 focus:border-[#FFC700]/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#E5E5E5]/70">WhatsApp</Label>
                    <Input
                      type="tel"
                      value={formData.whatsapp}
                      onChange={(e) => updateField("whatsapp", e.target.value)}
                      placeholder="+212 6 00 00 00 00"
                      className="h-12 bg-[#1F1F1F] border-[#E5E5E5]/10 text-white placeholder:text-[#E5E5E5]/30 focus:border-[#FFC700]/50"
                    />
                  </div>
                </>
              )}

              {step === 4 && (
                <>
                  <div className="space-y-2">
                    <Label className="text-[#E5E5E5]/70">LinkedIn</Label>
                    <Input
                      value={formData.linkedin}
                      onChange={(e) => updateField("linkedin", e.target.value)}
                      placeholder="https://linkedin.com/in/votrenom"
                      className="h-12 bg-[#1F1F1F] border-[#E5E5E5]/10 text-white placeholder:text-[#E5E5E5]/30 focus:border-[#FFC700]/50"
                      autoFocus
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#E5E5E5]/70">Site web</Label>
                    <Input
                      value={formData.website}
                      onChange={(e) => updateField("website", e.target.value)}
                      placeholder="https://votre-site.com"
                      className="h-12 bg-[#1F1F1F] border-[#E5E5E5]/10 text-white placeholder:text-[#E5E5E5]/30 focus:border-[#FFC700]/50"
                    />
                  </div>
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
