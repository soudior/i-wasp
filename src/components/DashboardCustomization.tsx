/**
 * DashboardCustomization - Section de personnalisation complète avec onglets
 * 
 * Onglets: [Design de la Carte] [Mes Liens] [Fonctions Avancées]
 * - Upload logo avec aperçu immédiat (URL locale)
 * - Gestion illimitée des liens sociaux
 * - Story et WiFi verrouillés GOLD
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wifi, Sparkles, Crown, Save, Loader2, Upload, X, 
  Palette, Image, Link as LinkIcon, Zap, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useCards, useUpdateCard } from "@/hooks/useCards";
import { useFeatureAccess } from "@/hooks/useSubscription";
import { useStories } from "@/hooks/useStories";
import { LinksManager } from "@/components/LinksManager";
import { GoldFeatureCard, GoldVerificationBadge } from "@/components/GoldFeatureCard";
import { StoryEditor } from "@/components/StoryEditor";
import { WiFiQRGenerator } from "@/components/WiFiQRGenerator";
import { SocialLink } from "@/lib/socialNetworks";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function DashboardCustomization() {
  const { user } = useAuth();
  const { data: cards = [], isLoading } = useCards();
  const { isPremium, canUseStories, canUseWifi } = useFeatureAccess();
  const updateCard = useUpdateCard();
  
  const primaryCard = cards[0];
  const { story: currentStory, updateStory } = useStories(primaryCard?.id);
  
  // Form state
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [wifiConfig, setWifiConfig] = useState<{ ssid: string; password: string; security: "WPA" | "WEP" | "nopass" }>({ 
    ssid: "", 
    password: "", 
    security: "WPA" 
  });
  
  // UI state
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("design");
  
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Load data from card
  useEffect(() => {
    if (primaryCard?.social_links) {
      try {
        const links = primaryCard.social_links as unknown;
        if (Array.isArray(links)) {
          setSocialLinks(links as SocialLink[]);
        }
      } catch {
        setSocialLinks([]);
      }
    }
    if (primaryCard?.logo_url) {
      setLogoUrl(primaryCard.logo_url);
      setLogoPreview(primaryCard.logo_url);
    }
  }, [primaryCard]);

  // Handle logo upload with immediate local preview
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file
    if (!file.type.startsWith("image/") && file.type !== "image/svg+xml") {
      toast.error("Seules les images sont acceptées (PNG, JPG, SVG)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Le fichier est trop volumineux (max 5MB)");
      return;
    }

    // IMMEDIATE LOCAL PREVIEW - This shows instantly
    const localUrl = URL.createObjectURL(file);
    setLogoPreview(localUrl);
    setHasChanges(true);
    
    // Now upload to storage
    setUploadingLogo(true);
    setUploadProgress(10);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 20, 80));
      }, 200);

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/logo-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from("card-assets")
        .upload(fileName, file, { upsert: true });

      clearInterval(progressInterval);
      setUploadProgress(90);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("card-assets")
        .getPublicUrl(fileName);

      setUploadProgress(100);
      setLogoUrl(urlData.publicUrl);
      
      // Clean up local URL
      URL.revokeObjectURL(localUrl);
      setLogoPreview(urlData.publicUrl);
      
      toast.success("Logo ajouté avec succès !");
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast.error("Erreur lors de l'upload du logo");
      setLogoPreview(null);
    } finally {
      setUploadingLogo(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveLogo = () => {
    if (logoPreview && logoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(logoPreview);
    }
    setLogoUrl(null);
    setLogoPreview(null);
    setHasChanges(true);
    if (logoInputRef.current) logoInputRef.current.value = "";
  };

  const handleLinksChange = (newLinks: SocialLink[]) => {
    setSocialLinks(newLinks);
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!primaryCard) return;
    
    setSaving(true);
    try {
      await updateCard.mutateAsync({
        id: primaryCard.id,
        data: {
          social_links: socialLinks,
          logo_url: logoUrl,
        },
      });
      setHasChanges(false);
      toast.success("Modifications enregistrées !");
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  if (!primaryCard) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header with GOLD badge and Save button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-foreground">Personnalisation</h2>
          {isPremium && <GoldVerificationBadge />}
        </div>
        
        <AnimatePresence>
          {hasChanges && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] text-[#1D1D1F] hover:from-[#C9A431] hover:to-[#E5C75E] font-semibold"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Enregistrer
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tabbed Interface */}
      <Card className="bg-gradient-to-br from-[#1D1D1F] to-[#2D2D30] border-white/10 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full bg-white/5 border-b border-white/10 rounded-none p-0 h-auto">
            <TabsTrigger 
              value="design" 
              className="flex-1 py-4 px-4 rounded-none data-[state=active]:bg-[#D4AF37]/10 data-[state=active]:text-[#D4AF37] text-white/60 border-b-2 border-transparent data-[state=active]:border-[#D4AF37] transition-all"
            >
              <Palette className="w-4 h-4 mr-2" />
              Design de la Carte
            </TabsTrigger>
            <TabsTrigger 
              value="links" 
              className="flex-1 py-4 px-4 rounded-none data-[state=active]:bg-[#D4AF37]/10 data-[state=active]:text-[#D4AF37] text-white/60 border-b-2 border-transparent data-[state=active]:border-[#D4AF37] transition-all"
            >
              <LinkIcon className="w-4 h-4 mr-2" />
              Mes Liens
            </TabsTrigger>
            <TabsTrigger 
              value="advanced" 
              className="flex-1 py-4 px-4 rounded-none data-[state=active]:bg-[#D4AF37]/10 data-[state=active]:text-[#D4AF37] text-white/60 border-b-2 border-transparent data-[state=active]:border-[#D4AF37] transition-all"
            >
              <Zap className="w-4 h-4 mr-2" />
              Fonctions Avancées
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Design de la Carte */}
          <TabsContent value="design" className="p-6 space-y-6 m-0">
            {/* Logo Upload Section */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2 text-white">
                <Image size={18} />
                Logo de votre entreprise
              </Label>
              
              <input
                ref={logoInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                onChange={handleLogoUpload}
                className="hidden"
              />

              <div className="grid md:grid-cols-2 gap-6">
                {/* Upload Zone */}
                <div>
                  {logoPreview ? (
                    <div className="relative">
                      <div className="aspect-video rounded-xl bg-white/5 border border-white/20 overflow-hidden flex items-center justify-center p-4">
                        <img
                          src={logoPreview}
                          alt="Logo"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleRemoveLogo}
                        className="absolute top-2 right-2"
                      >
                        <X size={14} />
                      </Button>
                      <div className="flex items-center gap-2 mt-2 text-green-400 text-sm">
                        <Check size={14} />
                        <span>Logo chargé</span>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => logoInputRef.current?.click()}
                      disabled={uploadingLogo}
                      className="w-full aspect-video rounded-xl border-2 border-dashed border-[#D4AF37]/30 hover:border-[#D4AF37]/50 bg-[#D4AF37]/5 hover:bg-[#D4AF37]/10 transition-all flex flex-col items-center justify-center gap-3 text-[#D4AF37]"
                    >
                      {uploadingLogo ? (
                        <>
                          <Loader2 className="w-8 h-8 animate-spin" />
                          <span className="text-sm">Téléchargement... {uploadProgress}%</span>
                          <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#D4AF37] transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <Upload size={32} />
                          <span className="text-sm font-medium">Cliquez pour télécharger</span>
                          <span className="text-xs text-white/40">PNG, JPG, SVG (max 5MB)</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Live Card Preview */}
                <div className="space-y-2">
                  <p className="text-sm text-white/60">Aperçu en temps réel</p>
                  <div 
                    className="aspect-[1.6/1] rounded-2xl bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] p-5 flex flex-col justify-between shadow-2xl border border-white/10"
                  >
                    <div className="flex justify-between items-start">
                      {logoPreview ? (
                        <img 
                          src={logoPreview} 
                          alt="Logo preview" 
                          className="h-10 w-auto max-w-[60%] object-contain"
                        />
                      ) : (
                        <div className="h-10 w-20 rounded bg-white/10 flex items-center justify-center">
                          <Image size={16} className="text-white/30" />
                        </div>
                      )}
                      <div className="text-xs text-[#D4AF37]/60 font-medium">NFC</div>
                    </div>
                    <div>
                      <div className="font-semibold text-lg text-white">
                        {primaryCard.first_name} {primaryCard.last_name}
                      </div>
                      <div className="text-sm text-white/60">
                        {primaryCard.title || "Votre titre"}
                      </div>
                      <div className="text-xs text-[#D4AF37]/80 mt-1">
                        {primaryCard.company || "Votre entreprise"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Tab 2: Mes Liens */}
          <TabsContent value="links" className="p-6 m-0">
            <LinksManager
              value={socialLinks}
              onChange={handleLinksChange}
            />
          </TabsContent>

          {/* Tab 3: Fonctions Avancées */}
          <TabsContent value="advanced" className="p-6 space-y-6 m-0">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Story Pro - GOLD */}
              <GoldFeatureCard
                title="Ma Story Pro"
                description="Partagez vos actualités"
                icon={<Sparkles className="w-5 h-5" />}
                isUnlocked={canUseStories}
              >
                <StoryEditor
                  cardId={primaryCard.id}
                  currentStory={currentStory}
                  onStoryChange={updateStory}
                />
              </GoldFeatureCard>

              {/* WiFi Sharing - GOLD */}
              <GoldFeatureCard
                title="Partage WiFi"
                description="QR code de connexion"
                icon={<Wifi className="w-5 h-5" />}
                isUnlocked={canUseWifi}
              >
                <WiFiQRGenerator
                  logoUrl={primaryCard.logo_url || undefined}
                  initialConfig={wifiConfig}
                  onConfigChange={(config) => setWifiConfig({
                    ssid: config.ssid,
                    password: config.password,
                    security: config.security,
                  })}
                />
              </GoldFeatureCard>
            </div>

            {/* GOLD Upsell if not premium */}
            {!isPremium && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative rounded-2xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/20 to-[#F5D76E]/20" />
                <div className="absolute inset-0 bg-[#1D1D1F]/90" />
                
                <div className="relative p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#F5D76E] flex items-center justify-center">
                    <Crown className="w-8 h-8 text-[#1D1D1F]" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Passez à GOLD
                  </h3>
                  <p className="text-white/60 mb-4 max-w-md mx-auto">
                    Débloquez les Stories Pro, le partage WiFi, le badge de vérification et bien plus encore.
                  </p>
                  <Button className="bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] text-[#1D1D1F] hover:from-[#C9A431] hover:to-[#E5C75E] font-semibold px-8">
                    <Crown className="w-4 h-4 mr-2" />
                    Devenir GOLD
                  </Button>
                </div>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
