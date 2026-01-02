import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  Upload, User, Lock, Image, Check, Loader2, 
  Camera, Trash2, Eye, Crown, ArrowLeft
} from "lucide-react";
import iwaspCertifiedBadge from "@/assets/iwasp-certified-badge.png";

const Settings = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
    setSavingProfile(true);
    try {
      // Simulate save (in production, this would update the profiles table)
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Profil mis à jour avec succès !");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du profil.");
    } finally {
      setSavingProfile(false);
    }
  };

  // Change password
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setSavingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Mot de passe modifié avec succès !");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors du changement de mot de passe.");
    } finally {
      setSavingPassword(false);
    }
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/dashboard")}
              className="text-zinc-400 hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-playfair text-2xl md:text-3xl font-bold text-white">
                Paramètres du compte
              </h1>
              <p className="text-zinc-500 text-sm">
                Gérez votre profil et personnalisez votre carte
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Logo Upload Section */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                    <Image className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white">Personnalisation de votre Carte Physique</CardTitle>
                    <CardDescription className="text-zinc-500">
                      Uploadez votre logo pour la gravure dorée sur votre carte NFC
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
                        className="w-full h-48 border-2 border-dashed border-zinc-700 hover:border-amber-500/50 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all duration-300 group"
                      >
                        <div className="w-14 h-14 rounded-full bg-zinc-800 group-hover:bg-amber-500/20 flex items-center justify-center transition-colors">
                          <Upload className="h-6 w-6 text-zinc-500 group-hover:text-amber-400" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-zinc-400">
                            Cliquez pour uploader votre logo
                          </p>
                          <p className="text-xs text-zinc-600 mt-1">
                            PNG, SVG, JPG • Max 5 Mo
                          </p>
                        </div>
                      </button>
                    ) : (
                      <div className="relative w-full h-48 bg-zinc-800/50 rounded-2xl overflow-hidden">
                        <img
                          src={logoPreview}
                          alt="Logo preview"
                          className="w-full h-full object-contain p-4"
                        />
                        <div className="absolute top-3 right-3 flex gap-2">
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8 bg-zinc-900/80"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Camera className="h-4 w-4" />
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
                        className="w-full mt-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold"
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
                      <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2">
                        <Check className="h-4 w-4 text-emerald-400" />
                        <span className="text-sm text-emerald-400">Logo enregistré avec succès</span>
                      </div>
                    )}
                  </div>

                  {/* Card Preview */}
                  <div>
                    <p className="text-sm text-zinc-500 mb-3">Aperçu sur votre carte</p>
                    <div className="relative aspect-[1.586] bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 rounded-2xl overflow-hidden shadow-2xl border border-zinc-700/50">
                      {/* Card texture */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 via-transparent to-amber-500/10" />
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
                            <div className="w-16 h-16 rounded-full bg-zinc-700/50 flex items-center justify-center mx-auto mb-2">
                              <Image className="h-7 w-7 text-zinc-500" />
                            </div>
                            <p className="text-xs text-zinc-500">Votre logo ici</p>
                          </div>
                        )}
                      </div>

                      {/* Gold accent line */}
                      <div className="absolute bottom-4 left-4 right-4 h-0.5 bg-gradient-to-r from-amber-400/50 via-amber-300/80 to-amber-400/50" />
                      
                      {/* i-wasp branding */}
                      <div className="absolute bottom-4 right-4">
                        <span className="text-[8px] text-amber-400/60 font-medium tracking-widest">i-wasp</span>
                      </div>

                      {/* NFC indicator */}
                      <div className="absolute top-4 right-4 w-6 h-6 rounded-full border border-amber-400/30 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-amber-400/50" />
                      </div>
                    </div>
                    <p className="text-xs text-zinc-600 text-center mt-3">
                      Le logo sera utilisé pour la gravure dorée sur votre carte physique
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Section */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center">
                    <User className="h-5 w-5 text-zinc-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white">Informations de profil</CardTitle>
                    <CardDescription className="text-zinc-500">
                      Ces informations apparaîtront sur votre carte digitale
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-zinc-400">Prénom</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Jean"
                      className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-amber-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-zinc-400">Nom</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Dupont"
                      className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-amber-500/50"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-zinc-400">Poste</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Directeur Commercial"
                      className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-amber-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-zinc-400">Entreprise</Label>
                    <Input
                      id="company"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Ma Société SARL"
                      className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-amber-500/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-zinc-400">Bio</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Décrivez-vous en quelques mots..."
                    rows={3}
                    className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-amber-500/50 resize-none"
                  />
                </div>

                <Button
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold"
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
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center">
                    <Lock className="h-5 w-5 text-zinc-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white">Sécurité</CardTitle>
                    <CardDescription className="text-zinc-500">
                      Gérez votre mot de passe et la sécurité de votre compte
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-zinc-800/30 border border-zinc-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium text-white">Adresse email</p>
                      <p className="text-sm text-zinc-500">{user?.email}</p>
                    </div>
                    <img 
                      src={iwaspCertifiedBadge} 
                      alt="Certifié i-wasp" 
                      className="h-10 w-10 object-contain"
                    />
                  </div>
                </div>

                <Separator className="bg-zinc-800" />

                <div className="space-y-4">
                  <p className="text-sm font-medium text-white">Changer le mot de passe</p>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-zinc-400">Nouveau mot de passe</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-amber-500/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-zinc-400">Confirmer le mot de passe</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-amber-500/50"
                    />
                  </div>

                  <Button
                    onClick={handleChangePassword}
                    disabled={savingPassword || !newPassword || !confirmPassword}
                    variant="outline"
                    className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
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
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Settings;
