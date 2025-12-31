/**
 * Onboarding - Guided card creation flow
 * Mobile-first with live preview and progress indicator
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
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { 
  Loader2, ArrowLeft, ArrowRight, User, Briefcase, 
  Phone, Link2, Check, Eye, EyeOff
} from "lucide-react";
import { cn } from "@/lib/utils";

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
};

const formSteps = [
  { 
    id: 1, 
    title: "Identité", 
    icon: User,
    fields: ["first_name", "last_name"] as const
  },
  { 
    id: 2, 
    title: "Profession", 
    icon: Briefcase,
    fields: ["title", "company"] as const
  },
  { 
    id: 3, 
    title: "Contact", 
    icon: Phone,
    fields: ["phone", "email", "whatsapp"] as const
  },
  { 
    id: 4, 
    title: "Liens", 
    icon: Link2,
    fields: ["linkedin", "website"] as const
  },
];

export default function Onboarding() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [showPreview, setShowPreview] = useState(false);

  const progress = useMemo(() => (step / formSteps.length) * 100, [step]);

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
    // Validate current step
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

    if (step < formSteps.length) {
      setStep(step + 1);
    } else {
      createCard.mutate(formData);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate("/dashboard");
    }
  };

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Auth check
  if (!user) {
    navigate("/login");
    return null;
  }

  const currentStep = formSteps[step - 1];

  return (
    <div className="min-h-dvh bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border/50 safe-top">
        <div className="flex items-center justify-between h-14 px-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft size={20} />
          </Button>
          
          <div className="flex items-center gap-2">
            {formSteps.map((s) => (
              <div
                key={s.id}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  s.id === step ? "bg-primary w-6" : 
                  s.id < step ? "bg-primary" : "bg-border"
                )}
              />
            ))}
          </div>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setShowPreview(!showPreview)}
            className="md:hidden"
          >
            {showPreview ? <EyeOff size={20} /> : <Eye size={20} />}
          </Button>
        </div>
        
        {/* Progress bar */}
        <Progress value={progress} className="h-1 rounded-none" />
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Form section */}
        <div 
          className={cn(
            "flex-1 p-6 md:p-10 animate-fade-up",
            showPreview && "hidden md:block"
          )}
        >
          <div className="max-w-md mx-auto">
            {/* Step indicator */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <currentStep.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Étape {step}/{formSteps.length}</p>
                <h1 className="text-xl font-semibold text-foreground">{currentStep.title}</h1>
              </div>
            </div>

            {/* Form fields */}
            <div className="space-y-4">
              {step === 1 && (
                <>
                  <div className="space-y-2">
                    <Label>Prénom *</Label>
                    <Input
                      value={formData.first_name}
                      onChange={(e) => updateField("first_name", e.target.value)}
                      placeholder="Jean"
                      className="h-12"
                      autoFocus
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nom *</Label>
                    <Input
                      value={formData.last_name}
                      onChange={(e) => updateField("last_name", e.target.value)}
                      placeholder="Dupont"
                      className="h-12"
                    />
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="space-y-2">
                    <Label>Poste</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => updateField("title", e.target.value)}
                      placeholder="Directeur Commercial"
                      className="h-12"
                      autoFocus
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Entreprise</Label>
                    <Input
                      value={formData.company}
                      onChange={(e) => updateField("company", e.target.value)}
                      placeholder="IWASP"
                      className="h-12"
                    />
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div className="space-y-2">
                    <Label>Téléphone</Label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      placeholder="+33 6 12 34 56 78"
                      className="h-12"
                      autoFocus
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      placeholder="jean@entreprise.com"
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>WhatsApp</Label>
                    <Input
                      type="tel"
                      value={formData.whatsapp}
                      onChange={(e) => updateField("whatsapp", e.target.value)}
                      placeholder="+33 6 12 34 56 78"
                      className="h-12"
                    />
                  </div>
                </>
              )}

              {step === 4 && (
                <>
                  <div className="space-y-2">
                    <Label>LinkedIn</Label>
                    <Input
                      value={formData.linkedin}
                      onChange={(e) => updateField("linkedin", e.target.value)}
                      placeholder="https://linkedin.com/in/jeandupont"
                      className="h-12"
                      autoFocus
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Site web</Label>
                    <Input
                      value={formData.website}
                      onChange={(e) => updateField("website", e.target.value)}
                      placeholder="https://mon-site.com"
                      className="h-12"
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
                  className="flex-1 h-12"
                >
                  Retour
                </Button>
              )}
              <Button 
                onClick={handleNext}
                disabled={createCard.isPending}
                className="flex-1 h-12 gap-2"
              >
                {createCard.isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : step === formSteps.length ? (
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
              </Button>
            </div>

            {/* Skip hint */}
            {step > 1 && step < formSteps.length && (
              <p className="text-center text-xs text-muted-foreground mt-4">
                Tous les champs sont optionnels, vous pourrez les modifier plus tard
              </p>
            )}
          </div>
        </div>

        {/* Live preview section */}
        <div 
          className={cn(
            "md:w-[400px] bg-secondary/30 border-l border-border/50 p-6 flex items-center justify-center",
            !showPreview && "hidden md:flex"
          )}
        >
          <Card className="w-full max-w-[320px] p-6 shadow-lg">
            {/* Preview card */}
            <div className="text-center">
              {/* Avatar placeholder */}
              <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-semibold text-primary">
                  {formData.first_name.charAt(0) || "?"}
                  {formData.last_name.charAt(0) || ""}
                </span>
              </div>
              
              {/* Name */}
              <h2 className="text-lg font-semibold text-foreground">
                {formData.first_name || "Prénom"} {formData.last_name || "Nom"}
              </h2>
              
              {/* Title & Company */}
              {(formData.title || formData.company) && (
                <p className="text-sm text-muted-foreground mt-1">
                  {formData.title}{formData.title && formData.company && " · "}{formData.company}
                </p>
              )}
              
              {/* Contact info */}
              <div className="mt-6 space-y-2 text-sm text-muted-foreground">
                {formData.email && (
                  <p className="truncate">{formData.email}</p>
                )}
                {formData.phone && (
                  <p>{formData.phone}</p>
                )}
              </div>
              
              {/* Social links */}
              {(formData.linkedin || formData.website) && (
                <div className="mt-4 flex justify-center gap-2">
                  {formData.linkedin && (
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                      <Link2 size={14} className="text-muted-foreground" />
                    </div>
                  )}
                  {formData.website && (
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                      <Link2 size={14} className="text-muted-foreground" />
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Preview label */}
            <p className="text-[10px] text-center text-muted-foreground/50 mt-6">
              Aperçu en temps réel
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
