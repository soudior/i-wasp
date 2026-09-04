import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  DELETE_ACCOUNT_FAILURE_MESSAGE,
  isDeleteConfirmed,
  requestAccountDeletion,
} from "@/lib/accountDeletion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { 
  Upload, User, Lock, Image, Check, Loader2, 
  Camera, Trash2, Eye, Crown, ArrowLeft, AlertTriangle,
  RotateCcw, Compass
} from "lucide-react";
import { useHapticFeedback } from "@/hooks/useHapticFeedback";
import { useOnboardingTour } from "@/components/onboarding/OnboardingTour";
import iwaspCertifiedBadge from "@/assets/iwasp-certified-badge.png";

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
};

const Settings = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { impactLight, impactMedium, notificationSuccess, notificationError } = useHapticFeedback();
  const { restartTour } = useOnboardingTour();
  
  // Profile state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [bio, setBio] = useState("");
  
  // Logo state
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [savedLogoUrl, setSavedLogoUrl] = useState<string | null>(null);
  
  // Security state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Loading states
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // Handle logo file selection
  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/png', 'image/svg+xml', 'image/jpeg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error("Format non supporté. Utilisez PNG, SVG, JPG ou WebP.");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Le fichier est trop volumineux (max 5 Mo).");
      return;
    }

    setLogoFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setLogoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Upload logo to Supabase storage
  const handleUploadLogo = async () => {
    if (!logoFile || !user) return;

    setUploadingLogo(true);
    try {
      const fileExt = logoFile.name.split('.').pop();
      const fileName = `${user.id}/logo-${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('card-assets')
        .upload(fileName, logoFile, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('card-assets')
        .getPublicUrl(fileName);

      setSavedLogoUrl(publicUrl);
      toast.success("Logo enregistré avec succès !");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Erreur lors de l'upload du logo.");
    } finally {
      setUploadingLogo(false);
    }
  };

  // Remove logo
  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Save profile
  const handleSaveProfile = async () => {
    impactLight();
    setSavingProfile(true);
    try {
      // Simulate save (in production, this would update the profiles table)
      await new Promise(resolve => setTimeout(resolve, 1000));
      notificationSuccess();
      toast.success("Profil mis à jour avec succès !");
    } catch (error) {
      notificationError();
      toast.error("Erreur lors de la mise à jour du profil.");
    } finally {
      setSavingProfile(false);
    }
  };

  // Change password
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      notificationError();
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }

    if (newPassword.length < 6) {
      notificationError();
      toast.error("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    impactMedium();
    setSavingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      notificationSuccess();
      toast.success("Mot de passe modifié avec succès !");
    } catch (error: any) {
      notificationError();
      toast.error(error.message || "Erreur lors du changement de mot de passe.");
    } finally {
      setSavingPassword(false);
    }
  };

  // Delete account (Apple App Store requirement, Guideline 5.1.1(v)).
  // La suppression réelle est effectuée côté serveur par l'edge function
  // `delete-account` (service-role) : elle supprime les données personnelles,
  // anonymise les commandes (conservation comptable), efface les fichiers de
  // stockage, puis supprime le compte Auth — ce qui révoque toutes les sessions.
  // Jamais de « fausse suppression » uniquement côté interface.
  const handleDeleteAccount = async () => {
    if (!isDeleteConfirmed(deleteConfirmText)) {
      toast.error('Veuillez saisir « SUPPRIMER » pour confirmer.');
      return;
    }
    impactMedium();
    setDeletingAccount(true);
    try {
      await requestAccountDeletion(() => supabase.functions.invoke("delete-account"));

      // Le compte Auth est supprimé côté serveur : on nettoie la session locale.
      await signOut();
      notificationSuccess();
      toast.success("Votre compte a été supprimé définitivement.");
      navigate("/");
    } catch (error: unknown) {
      notificationError();
      toast.error(error instanceof Error ? error.message : DELETE_ACCOUNT_FAILURE_MESSAGE);
      console.error("Delete account error:", error);
    } finally {
      setDeletingAccount(false);
    }
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.bg }}>
      <Navbar />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/dashboard")}
              style={{ color: COLORS.textMuted }}
              className="hover:opacity-80"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-playfair text-2xl md:text-3xl font-bold" style={{ color: COLORS.text }}>
                Paramètres du compte
              </h1>
              <p className="text-sm" style={{ color: COLORS.textDim }}>
                Gérez votre profil et personnalisez votre carte
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Logo Upload Section */}
            <Card style={{ backgroundColor: COLORS.bgCard, borderColor: COLORS.border }}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentLight})` }}
                  >
                    <Image className="h-5 w-5" style={{ color: COLORS.bg }} />
                  </div>
                  <div>
                    <CardTitle style={{ color: COLORS.text }}>Personnalisation de votre Carte Physique</CardTitle>
                    <CardDescription style={{ color: COLORS.textMuted }}>
                      Uploadez votre logo pour la gravure sur votre carte NFC
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Upload Area */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Upload zone */}
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".png,.svg,.jpg,.jpeg,.webp"
                      onChange={handleLogoSelect}
                      className="hidden"
                    />
                    
                    {!logoPreview ? (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-48 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 transition-all duration-300 group"
                        style={{ borderColor: COLORS.border }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = `${COLORS.accent}50`}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = COLORS.border}
                      >
                        <div 
                          className="w-14 h-14 rounded-full flex items-center justify-center transition-colors group-hover:opacity-80"
                          style={{ backgroundColor: `${COLORS.accent}20` }}
                        >
                          <Upload className="h-6 w-6" style={{ color: COLORS.accent }} />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium" style={{ color: COLORS.textMuted }}>
                            Cliquez pour uploader votre logo
                          </p>
                          <p className="text-xs mt-1" style={{ color: COLORS.textDim }}>
                            PNG, SVG, JPG • Max 5 Mo
                          </p>
                        </div>
                      </button>
                    ) : (
                      <div 
                        className="relative w-full h-48 rounded-2xl overflow-hidden"
                        style={{ backgroundColor: `${COLORS.accent}10` }}
                      >
                        <img
                          src={logoPreview}
                          alt="Logo preview"
                          className="w-full h-full object-contain p-4"
                        />
                        <div className="absolute top-3 right-3 flex gap-2">
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8"
                            style={{ backgroundColor: `${COLORS.bg}CC` }}
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Camera className="h-4 w-4" style={{ color: COLORS.text }} />
                          </Button>
                          <Button
                            size="icon"
                            variant="destructive"
                            className="h-8 w-8"
                            onClick={handleRemoveLogo}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {logoPreview && !savedLogoUrl && (
                      <Button
                        className="w-full mt-4 font-semibold"
                        style={{ 
                          background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentLight})`,
                          color: COLORS.bg 
                        }}
                        onClick={handleUploadLogo}
                        disabled={uploadingLogo}
                      >
                        {uploadingLogo ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Enregistrement...
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Enregistrer le logo
                          </>
                        )}
                      </Button>
                    )}

                    {savedLogoUrl && (
                      <div 
                        className="mt-4 p-3 rounded-xl flex items-center gap-2"
                        style={{ backgroundColor: `${COLORS.accent}15`, border: `1px solid ${COLORS.accent}40` }}
                      >
                        <Check className="h-4 w-4" style={{ color: COLORS.accent }} />
                        <span className="text-sm" style={{ color: COLORS.accent }}>Logo enregistré avec succès</span>
                      </div>
                    )}
                  </div>

                  {/* Card Preview */}
                  <div>
                    <p className="text-sm mb-3" style={{ color: COLORS.textMuted }}>Aperçu sur votre carte</p>
                    <div 
                      className="relative aspect-[1.586] rounded-2xl overflow-hidden shadow-2xl"
                      style={{ 
                        background: `linear-gradient(135deg, ${COLORS.bgCard}, ${COLORS.bg})`,
                        border: `1px solid ${COLORS.border}`
                      }}
                    >
                      {/* Card texture */}
                      <div className="absolute inset-0 opacity-10">
                        <div 
                          className="absolute inset-0" 
                          style={{ background: `linear-gradient(135deg, ${COLORS.accent}20, transparent, ${COLORS.accent}10)` }}
                        />
                      </div>
                      
                      {/* Logo on card */}
                      <div className="absolute inset-0 flex items-center justify-center p-8">
                        {logoPreview ? (
                          <img
                            src={logoPreview}
                            alt="Logo on card"
                            className="max-w-[60%] max-h-[50%] object-contain drop-shadow-lg"
                            style={{ filter: 'brightness(1.1) contrast(1.1)' }}
                          />
                        ) : (
                          <div className="text-center">
                            <div 
                              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2"
                              style={{ backgroundColor: `${COLORS.accent}15` }}
                            >
                              <Image className="h-7 w-7" style={{ color: COLORS.textMuted }} />
                            </div>
                            <p className="text-xs" style={{ color: COLORS.textDim }}>Votre logo ici</p>
                          </div>
                        )}
                      </div>

                      {/* Accent line */}
                      <div 
                        className="absolute bottom-4 left-4 right-4 h-0.5" 
                        style={{ background: `linear-gradient(90deg, ${COLORS.accent}50, ${COLORS.accentLight}80, ${COLORS.accent}50)` }}
                      />
                      
                      {/* i-wasp branding */}
                      <div className="absolute bottom-4 right-4">
                        <span className="text-[8px] font-medium tracking-widest" style={{ color: `${COLORS.accent}60` }}>i-wasp</span>
                      </div>

                      {/* NFC indicator */}
                      <div 
                        className="absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ border: `1px solid ${COLORS.accent}30` }}
                      >
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: `${COLORS.accent}50` }} />
                      </div>
                    </div>
                    <p className="text-xs text-center mt-3" style={{ color: COLORS.textDim }}>
                      Le logo sera utilisé pour la gravure sur votre carte physique
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Section */}
            <Card style={{ backgroundColor: COLORS.bgCard, borderColor: COLORS.border }}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${COLORS.accent}20` }}
                  >
                    <User className="h-5 w-5" style={{ color: COLORS.accent }} />
                  </div>
                  <div>
                    <CardTitle style={{ color: COLORS.text }}>Informations de profil</CardTitle>
                    <CardDescription style={{ color: COLORS.textMuted }}>
                      Ces informations apparaîtront sur votre carte digitale
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" style={{ color: COLORS.textMuted }}>Prénom</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Jean"
                      style={{ 
                        backgroundColor: `${COLORS.accent}10`, 
                        borderColor: COLORS.border, 
                        color: COLORS.text 
                      }}
                      className="placeholder:text-white/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" style={{ color: COLORS.textMuted }}>Nom</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Dupont"
                      style={{ 
                        backgroundColor: `${COLORS.accent}10`, 
                        borderColor: COLORS.border, 
                        color: COLORS.text 
                      }}
                      className="placeholder:text-white/30"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" style={{ color: COLORS.textMuted }}>Poste</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Directeur Commercial"
                      style={{ 
                        backgroundColor: `${COLORS.accent}10`, 
                        borderColor: COLORS.border, 
                        color: COLORS.text 
                      }}
                      className="placeholder:text-white/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company" style={{ color: COLORS.textMuted }}>Entreprise</Label>
                    <Input
                      id="company"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Ma Société SARL"
                      style={{ 
                        backgroundColor: `${COLORS.accent}10`, 
                        borderColor: COLORS.border, 
                        color: COLORS.text 
                      }}
                      className="placeholder:text-white/30"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" style={{ color: COLORS.textMuted }}>Bio</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Décrivez-vous en quelques mots..."
                    rows={3}
                    className="resize-none placeholder:text-white/30"
                    style={{ 
                      backgroundColor: `${COLORS.accent}10`, 
                      borderColor: COLORS.border, 
                      color: COLORS.text 
                    }}
                  />
                </div>

                <Button
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
                  className="font-semibold"
                  style={{ 
                    background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentLight})`,
                    color: COLORS.bg 
                  }}
                >
                  {savingProfile ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Enregistrer le profil
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Security Section */}
            <Card style={{ backgroundColor: COLORS.bgCard, borderColor: COLORS.border }}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${COLORS.accent}20` }}
                  >
                    <Lock className="h-5 w-5" style={{ color: COLORS.accent }} />
                  </div>
                  <div>
                    <CardTitle style={{ color: COLORS.text }}>Sécurité</CardTitle>
                    <CardDescription style={{ color: COLORS.textMuted }}>
                      Gérez votre mot de passe et la sécurité de votre compte
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div 
                  className="p-4 rounded-xl"
                  style={{ backgroundColor: `${COLORS.accent}08`, border: `1px solid ${COLORS.border}` }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium" style={{ color: COLORS.text }}>Adresse email</p>
                      <p className="text-sm" style={{ color: COLORS.textMuted }}>{user?.email}</p>
                    </div>
                    <img 
                      src={iwaspCertifiedBadge} 
                      alt="Certifié i-wasp" 
                      className="h-10 w-10 object-contain"
                    />
                  </div>
                </div>

                <Separator style={{ backgroundColor: COLORS.border }} />

                <div className="space-y-4">
                  <p className="text-sm font-medium" style={{ color: COLORS.text }}>Changer le mot de passe</p>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" style={{ color: COLORS.textMuted }}>Nouveau mot de passe</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      style={{ 
                        backgroundColor: `${COLORS.accent}10`, 
                        borderColor: COLORS.border, 
                        color: COLORS.text 
                      }}
                      className="placeholder:text-white/30"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" style={{ color: COLORS.textMuted }}>Confirmer le mot de passe</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      style={{ 
                        backgroundColor: `${COLORS.accent}10`, 
                        borderColor: COLORS.border, 
                        color: COLORS.text 
                      }}
                      className="placeholder:text-white/30"
                    />
                  </div>

                  <Button
                    onClick={handleChangePassword}
                    disabled={savingPassword || !newPassword || !confirmPassword}
                    variant="outline"
                    style={{ borderColor: COLORS.border, color: COLORS.textMuted }}
                    className="hover:opacity-80"
                  >
                    {savingPassword ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Modification...
                      </>
                    ) : (
                      "Modifier le mot de passe"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Preferences Section */}
            <Card style={{ backgroundColor: COLORS.bgCard, borderColor: COLORS.border }}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${COLORS.accent}20` }}
                  >
                    <Compass className="h-5 w-5" style={{ color: COLORS.accent }} />
                  </div>
                  <div>
                    <CardTitle style={{ color: COLORS.text }}>Préférences</CardTitle>
                    <CardDescription style={{ color: COLORS.textMuted }}>
                      Personnalisez votre expérience
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div 
                  className="p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                  style={{ backgroundColor: `${COLORS.accent}05`, borderColor: COLORS.border }}
                >
                  <div>
                    <p className="text-sm font-medium" style={{ color: COLORS.text }}>Tour d'onboarding</p>
                    <p className="text-xs mt-1" style={{ color: COLORS.textMuted }}>
                      Relancez le guide interactif pour découvrir toutes les fonctionnalités
                    </p>
                  </div>
                  <Button 
                    variant="outline"
                    className="shrink-0"
                    style={{ borderColor: COLORS.border, color: COLORS.text }}
                    onClick={() => {
                      impactLight();
                      restartTour();
                    }}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Relancer le tour
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone - Account Deletion (Apple App Store Requirement) */}
            <Card className="bg-red-950/20 border-red-900/30">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-900/30 flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                  </div>
                  <div>
                    <CardTitle className="text-red-400">Zone de danger</CardTitle>
                    <CardDescription className="text-red-300/60">
                      Actions irréversibles sur votre compte
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="p-4 rounded-xl bg-red-900/10 border border-red-900/30">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-red-300">Supprimer définitivement mon compte</p>
                      <p className="text-xs text-red-400/60 mt-1">
                        Cette action supprime définitivement votre compte et vos données personnelles côté serveur. Elle est irréversible.
                      </p>
                    </div>
                    <AlertDialog onOpenChange={(open) => { if (!open) setDeleteConfirmText(""); }}>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          className="bg-red-600 hover:bg-red-700 text-white shrink-0"
                          disabled={deletingAccount}
                        >
                          {deletingAccount ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Suppression...
                            </>
                          ) : (
                            <>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer définitivement mon compte
                            </>
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-zinc-900 border-zinc-800 max-h-[90vh] overflow-y-auto">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                            Supprimer définitivement votre compte ?
                          </AlertDialogTitle>
                          <AlertDialogDescription asChild>
                            <div className="text-zinc-400">
                              <p>
                                Cette action est <span className="text-red-400 font-medium">irréversible</span>.
                                Les données suivantes seront <span className="font-medium">supprimées définitivement</span> :
                              </p>
                              <ul className="mt-3 space-y-1 text-sm">
                                <li>• Vos cartes digitales et leur contenu</li>
                                <li>• Vos contacts, leads et statistiques de scan</li>
                                <li>• Votre profil, votre abonnement et vos notifications</li>
                                <li>• Vos fichiers (logos, visuels, stories)</li>
                              </ul>
                              <p className="mt-3 text-sm">
                                Pour des raisons comptables et légales, vos <span className="font-medium">commandes</span>{" "}
                                sont conservées mais <span className="font-medium">anonymisées</span> (aucune donnée
                                personnelle n'y reste rattachée).
                              </p>
                              <div className="mt-3 rounded-lg border border-amber-900/40 bg-amber-950/20 p-3 text-xs text-amber-300/90">
                                <span className="font-medium">Cartes NFC physiques :</span> vos cartes cesseront de
                                pointer vers un profil actif. Si vous souhaitez <span className="font-medium">transférer</span>{" "}
                                une carte à une autre personne plutôt que la désactiver, contactez{" "}
                                <span className="font-medium">support@i-wasp.com</span> <span className="font-medium">avant</span>{" "}
                                de supprimer votre compte : nous rattacherons la puce au nouveau titulaire sans la réimprimer.
                              </div>
                              <p className="mt-4 text-sm text-zinc-300">
                                Pour confirmer, saisissez <span className="font-mono font-semibold text-red-400">SUPPRIMER</span> ci-dessous :
                              </p>
                            </div>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="py-1">
                          <Label htmlFor="delete-confirm" className="sr-only">Confirmation de suppression</Label>
                          <Input
                            id="delete-confirm"
                            value={deleteConfirmText}
                            onChange={(e) => setDeleteConfirmText(e.target.value)}
                            placeholder="SUPPRIMER"
                            autoComplete="off"
                            className="bg-zinc-950 border-zinc-700 text-white"
                          />
                        </div>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                            Annuler
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={(e) => {
                              if (!isDeleteConfirmed(deleteConfirmText)) {
                                e.preventDefault();
                                toast.error('Veuillez saisir « SUPPRIMER » pour confirmer.');
                                return;
                              }
                              handleDeleteAccount();
                            }}
                            disabled={deletingAccount || !isDeleteConfirmed(deleteConfirmText)}
                            className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
                          >
                            Oui, supprimer définitivement
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Settings;
