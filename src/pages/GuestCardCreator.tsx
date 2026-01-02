/**
 * Guest Card Creator
 * 
 * Allows users to create a card without signing up.
 * Auth is required only when saving/sharing/ordering.
 * Clear guest mode indicators for conversion-focused UX.
 */

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useGuestCard } from "@/contexts/GuestCardContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, ArrowRight, User, Briefcase, 
  Phone, Link2, Check, Eye, EyeOff, Save, ShoppingBag,
  FlaskConical, Lock, Share2, Sparkles, Upload
} from "lucide-react";
import { cn } from "@/lib/utils";
import { OnboardingPhotoUpload } from "@/components/onboarding/OnboardingPhotoUpload";
import { LogoUploader } from "@/components/LogoUploader";
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
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  const progress = useMemo(() => (step / formSteps.length) * 100, [step]);
  const isGuestMode = !user;

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

  // Soft auth gate - shows prompt before redirecting
  const requireAuth = (action: "save" | "order" | "share") => {
    if (!hasGuestCard) {
      toast.error("Veuillez d'abord remplir les informations de votre carte");
      return;
    }
    
    if (user) {
      // User is logged in
      if (action === "save") {
        navigate("/onboarding/finalize");
      } else if (action === "order") {
        navigate("/onboarding/finalize?order=true");
      } else if (action === "share") {
        navigate("/onboarding/finalize?share=true");
      }
    } else {
      // Show soft prompt before auth
      setShowAuthPrompt(true);
    }
  };

  const handleAuthRedirect = (action: "save" | "order") => {
    const params = action === "order" ? "&order=true" : "";
    navigate(`/login?returnTo=/onboarding/finalize${params}&action=${action}`);
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
          
          {/* Guest Mode Badge - visible in header */}
          {isGuestMode && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20"
            >
              <FlaskConical size={12} className="text-amber-500" />
              <span className="text-xs font-medium text-amber-500">Mode essai</span>
            </motion.div>
          )}
          
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

      {/* Guest Mode Banner */}
      {isGuestMode && hasGuestCard && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-amber-500/10 border-b border-amber-500/10 px-4 py-2.5"
        >
          <p className="text-center text-xs text-amber-600 dark:text-amber-400">
            <FlaskConical size={12} className="inline mr-1.5 -mt-0.5" />
            Votre carte est en mode essai – <button onClick={() => navigate("/login?returnTo=/onboarding/finalize")} className="underline font-medium hover:no-underline">créez un compte</button> pour la sauvegarder
          </p>
        </motion.div>
      )}

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
                  
                  {/* Logo Upload with Real-Time Preview */}
                  <div className="pt-4">
                    <Label className="mb-2 block">Logo de l'entreprise (optionnel)</Label>
                    <LogoUploader
                      value={guestCard.logo_url}
                      onChange={(url) => updateGuestCard("logo_url", url)}
                      cardColor="black"
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
                    <Sparkles className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="font-medium text-foreground">Votre carte est prête !</p>
                    {isGuestMode && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Créez un compte gratuit pour continuer
                      </p>
                    )}
                  </div>

                  {/* NEW: Preview Success Page */}
                  <Button 
                    onClick={() => navigate("/success")}
                    className="w-full h-14 gap-2 text-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500"
                  >
                    <Sparkles size={20} />
                    Voir mon profil
                  </Button>

                  {/* Primary CTA - Save */}
                  <Button 
                    variant="outline"
                    onClick={() => requireAuth("save")}
                    className="w-full h-12 gap-2"
                  >
                    {isGuestMode && <Lock size={16} />}
                    <Save size={18} />
                    Sauvegarder ma carte
                  </Button>
                  
                  {/* Secondary CTA - Order */}
                  <Button 
                    variant="outline"
                    onClick={() => requireAuth("order")}
                    className="w-full h-12 gap-2"
                  >
                    {isGuestMode && <Lock size={16} />}
                    <ShoppingBag size={18} />
                    Commander une carte NFC
                  </Button>

                  {/* Tertiary - Share (disabled for guests) */}
                  <Button 
                    variant="ghost"
                    onClick={() => isGuestMode ? requireAuth("share") : null}
                    className={cn(
                      "w-full h-12 gap-2",
                      isGuestMode && "opacity-60"
                    )}
                  >
                    {isGuestMode && <Lock size={14} />}
                    <Share2 size={16} />
                    Partager
                    {isGuestMode && <span className="text-xs text-muted-foreground ml-1">(compte requis)</span>}
                  </Button>

                  <Button 
                    variant="ghost"
                    onClick={() => setStep(1)}
                    className="w-full h-10 text-sm"
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

            {/* Guest notice - only on first step */}
            {isGuestMode && step === 1 && !hasGuestCard && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 p-3 rounded-xl bg-muted/50 border border-border/50"
              >
                <p className="text-center text-xs text-muted-foreground">
                  <FlaskConical size={12} className="inline mr-1 -mt-0.5" />
                  Testez gratuitement · Pas de compte requis
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Live preview section */}
        <div 
          className={cn(
            "md:w-[400px] bg-secondary/30 border-l border-border/50 p-6 flex flex-col items-center justify-center relative",
            !showPreview && "hidden md:flex"
          )}
        >
          {/* Demo badge on preview */}
          {isGuestMode && hasGuestCard && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30"
            >
              <FlaskConical size={12} className="text-amber-500" />
              <span className="text-xs font-medium text-amber-500">Démo</span>
            </motion.div>
          )}

          <Card className={cn(
            "w-full max-w-[320px] p-6 shadow-lg relative overflow-hidden",
            isGuestMode && hasGuestCard && "ring-2 ring-amber-500/20 ring-offset-2 ring-offset-background"
          )}>
            {/* Client Logo - Top with animation */}
            {guestCard.logo_url ? (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex justify-center mb-6"
              >
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="focus:outline-none"
                >
                  <img 
                    src={guestCard.logo_url} 
                    alt="Logo client" 
                    className="max-h-[80px] w-auto object-contain drop-shadow-md"
                    style={{ 
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                    }}
                  />
                </button>
              </motion.div>
            ) : guestCard.company ? (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center mb-6"
              >
                <span className="text-xl font-semibold text-primary/80">
                  {guestCard.company}
                </span>
              </motion.div>
            ) : null}

            <div className="text-center">
              {/* Avatar */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-20 h-20 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center overflow-hidden shadow-lg"
              >
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
              </motion.div>
              
              {/* Name */}
              <motion.h2 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-lg font-semibold text-foreground"
              >
                {guestCard.first_name || "Prénom"} {guestCard.last_name || "Nom"}
              </motion.h2>
              
              {/* Title & Company */}
              {(guestCard.title || guestCard.company) && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="text-sm text-muted-foreground mt-1"
                >
                  {guestCard.title}{guestCard.title && guestCard.company && " · "}{guestCard.company}
                </motion.p>
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

      {/* Soft Auth Prompt Modal */}
      <AnimatePresence>
        {showAuthPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setShowAuthPrompt(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-card rounded-2xl p-6 shadow-xl border border-border/50"
            >
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Créez un compte gratuit
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Pour sauvegarder votre carte et accéder à toutes les fonctionnalités
                </p>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={() => handleAuthRedirect("save")}
                  className="w-full h-12 gap-2"
                >
                  <Save size={18} />
                  Créer un compte et sauvegarder
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => handleAuthRedirect("order")}
                  className="w-full h-12 gap-2"
                >
                  <ShoppingBag size={18} />
                  Créer un compte et commander
                </Button>

                <Button 
                  variant="ghost"
                  onClick={() => setShowAuthPrompt(false)}
                  className="w-full h-10 text-sm"
                >
                  Continuer en mode essai
                </Button>
              </div>

              <p className="text-[11px] text-center text-muted-foreground mt-4">
                Votre carte sera automatiquement sauvegardée après inscription
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
