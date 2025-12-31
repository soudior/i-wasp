/**
 * Guest Card Creator
 * 
 * Allows users to create a card without signing up.
 * Auth is required only when saving/sharing/ordering.
 */

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useGuestCard, GuestCardData } from "@/contexts/GuestCardContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, ArrowRight, User, Briefcase, 
  Phone, Link2, Check, Eye, EyeOff, Save, ShoppingBag
} from "lucide-react";
import { cn } from "@/lib/utils";
import { OnboardingPhotoUpload } from "@/components/onboarding/OnboardingPhotoUpload";
import { toast } from "sonner";

const formSteps = [
  { 
    id: 1, 
    title: "Identité", 
    icon: User,
    fields: ["first_name", "last_name", "photo_url"] as const
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

export default function GuestCardCreator() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { guestCard, updateGuestCard, hasGuestCard } = useGuestCard();
  const [step, setStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);

  const progress = useMemo(() => (step / formSteps.length) * 100, [step]);

  const handleNext = () => {
    if (step === 1) {
      if (!guestCard.first_name.trim()) {
        toast.error("Le prénom est obligatoire");
        return;
      }
      if (!guestCard.last_name.trim()) {
        toast.error("Le nom est obligatoire");
        return;
      }
    }

    if (step < formSteps.length) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate("/");
    }
  };

  // Action that requires auth: Save card
  const handleSave = () => {
    if (!hasGuestCard) {
      toast.error("Veuillez d'abord remplir les informations de votre carte");
      return;
    }
    
    if (user) {
      // User is logged in, go to finalize
      navigate("/onboarding/finalize");
    } else {
      // Redirect to login with return path
      navigate("/login?returnTo=/onboarding/finalize&action=save");
    }
  };

  // Action that requires auth: Order physical card
  const handleOrder = () => {
    if (!hasGuestCard) {
      toast.error("Veuillez d'abord remplir les informations de votre carte");
      return;
    }
    
    if (user) {
      navigate("/onboarding/finalize?order=true");
    } else {
      navigate("/login?returnTo=/onboarding/finalize&action=order&order=true");
    }
  };

  const currentStep = formSteps[step - 1];
  const isComplete = step === formSteps.length && hasGuestCard;

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
                  <div className="flex justify-center mb-6">
                    <OnboardingPhotoUpload
                      value={guestCard.photo_url}
                      onChange={(url) => updateGuestCard("photo_url", url)}
                      initials={`${guestCard.first_name.charAt(0)}${guestCard.last_name.charAt(0)}`}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Prénom *</Label>
                    <Input
                      value={guestCard.first_name}
                      onChange={(e) => updateGuestCard("first_name", e.target.value)}
                      placeholder="Jean"
                      className="h-12"
                      autoFocus
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nom *</Label>
                    <Input
                      value={guestCard.last_name}
                      onChange={(e) => updateGuestCard("last_name", e.target.value)}
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
                      value={guestCard.title}
                      onChange={(e) => updateGuestCard("title", e.target.value)}
                      placeholder="Directeur Commercial"
                      className="h-12"
                      autoFocus
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Entreprise</Label>
                    <Input
                      value={guestCard.company}
                      onChange={(e) => updateGuestCard("company", e.target.value)}
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
                      value={guestCard.phone}
                      onChange={(e) => updateGuestCard("phone", e.target.value)}
                      placeholder="+33 6 12 34 56 78"
                      className="h-12"
                      autoFocus
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={guestCard.email}
                      onChange={(e) => updateGuestCard("email", e.target.value)}
                      placeholder="jean@entreprise.com"
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>WhatsApp</Label>
                    <Input
                      type="tel"
                      value={guestCard.whatsapp}
                      onChange={(e) => updateGuestCard("whatsapp", e.target.value)}
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
                      value={guestCard.linkedin}
                      onChange={(e) => updateGuestCard("linkedin", e.target.value)}
                      placeholder="https://linkedin.com/in/jeandupont"
                      className="h-12"
                      autoFocus
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Site web</Label>
                    <Input
                      value={guestCard.website}
                      onChange={(e) => updateGuestCard("website", e.target.value)}
                      placeholder="https://mon-site.com"
                      className="h-12"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Navigation */}
            <div className="mt-8">
              {!isComplete ? (
                <div className="flex gap-3">
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
                    className="flex-1 h-12 gap-2"
                  >
                    Continuer
                    <ArrowRight size={18} />
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Complete message */}
                  <div className="text-center mb-6 p-4 bg-primary/5 rounded-xl border border-primary/10">
                    <Check className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="font-medium text-foreground">Votre carte est prête !</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Créez un compte pour la sauvegarder
                    </p>
                  </div>

                  {/* Action buttons */}
                  <Button 
                    onClick={handleSave}
                    className="w-full h-12 gap-2"
                  >
                    <Save size={18} />
                    Sauvegarder ma carte
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={handleOrder}
                    className="w-full h-12 gap-2"
                  >
                    <ShoppingBag size={18} />
                    Commander une carte NFC
                  </Button>

                  <Button 
                    variant="ghost"
                    onClick={() => setStep(1)}
                    className="w-full h-12"
                  >
                    Modifier ma carte
                  </Button>
                </div>
              )}
            </div>

            {/* Skip hint */}
            {step > 1 && step < formSteps.length && (
              <p className="text-center text-xs text-muted-foreground mt-4">
                Tous les champs sont optionnels
              </p>
            )}

            {/* Guest notice */}
            {!user && step === 1 && (
              <p className="text-center text-xs text-muted-foreground mt-6">
                Pas de compte requis pour créer votre carte
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
            <div className="text-center">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center overflow-hidden">
                {guestCard.photo_url ? (
                  <img 
                    src={guestCard.photo_url} 
                    alt="Photo" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-semibold text-primary">
                    {guestCard.first_name.charAt(0) || "?"}
                    {guestCard.last_name.charAt(0) || ""}
                  </span>
                )}
              </div>
              
              {/* Name */}
              <h2 className="text-lg font-semibold text-foreground">
                {guestCard.first_name || "Prénom"} {guestCard.last_name || "Nom"}
              </h2>
              
              {/* Title & Company */}
              {(guestCard.title || guestCard.company) && (
                <p className="text-sm text-muted-foreground mt-1">
                  {guestCard.title}{guestCard.title && guestCard.company && " · "}{guestCard.company}
                </p>
              )}
              
              {/* Contact info */}
              <div className="mt-6 space-y-2 text-sm text-muted-foreground">
                {guestCard.email && (
                  <p className="truncate">{guestCard.email}</p>
                )}
                {guestCard.phone && (
                  <p>{guestCard.phone}</p>
                )}
              </div>
              
              {/* Social links */}
              {(guestCard.linkedin || guestCard.website) && (
                <div className="mt-4 flex justify-center gap-2">
                  {guestCard.linkedin && (
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                      <Link2 size={14} className="text-muted-foreground" />
                    </div>
                  )}
                  {guestCard.website && (
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                      <Link2 size={14} className="text-muted-foreground" />
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <p className="text-[10px] text-center text-muted-foreground/50 mt-6">
              Aperçu en temps réel
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
