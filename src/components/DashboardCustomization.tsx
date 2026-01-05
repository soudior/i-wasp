/**
 * DashboardCustomization - Section de personnalisation complète avec onglets
 * Style SaaS Professional
 */

import { useState, useEffect, useRef } from "react";
import { 
  Wifi, Sparkles, Crown, Save, Loader2, Upload, X, 
  Palette, Image, Link as LinkIcon, Zap, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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

export function DashboardCustomization() {
  const { user } = useAuth();
  const { data: cards = [], isLoading } = useCards();
  const { isPremium, canUseStories, canUseWifi } = useFeatureAccess();
  const updateCard = useUpdateCard();
  
  const primaryCard = cards[0];
  const { stories, updateStories } = useStories(primaryCard?.id);
  
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

  // Handle logo upload
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith("image/") && file.type !== "image/svg+xml") {
      toast.error("Seules les images sont acceptées (PNG, JPG, SVG)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Le fichier est trop volumineux (max 5MB)");
      return;
    }

    const localUrl = URL.createObjectURL(file);
    setLogoPreview(localUrl);
    setHasChanges(true);
    
    setUploadingLogo(true);
    setUploadProgress(10);

    try {
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

      const { data: urlData } = supabase.storage
        .from("card-assets")
        .getPublicUrl(fileName);

      setUploadProgress(100);
      setLogoUrl(urlData.publicUrl);
      
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
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!primaryCard) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-foreground">Personnalisation</h2>
          {isPremium && <GoldVerificationBadge />}
        </div>
        
        {hasChanges && (
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Enregistrer
          </Button>
        )}
      </div>

      {/* Tabbed Interface */}
      <Card className="bg-card border border-border overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full bg-muted border-b border-border rounded-none p-0 h-auto">
            <TabsTrigger 
              value="design" 
              className="flex-1 py-4 px-4 rounded-none data-[state=active]:bg-background data-[state=active]:text-foreground text-muted-foreground border-b-2 border-transparent data-[state=active]:border-primary transition-colors"
            >
              <Palette className="w-4 h-4 mr-2" />
              Design de la Carte
            </TabsTrigger>
            <TabsTrigger 
              value="links" 
              className="flex-1 py-4 px-4 rounded-none data-[state=active]:bg-background data-[state=active]:text-foreground text-muted-foreground border-b-2 border-transparent data-[state=active]:border-primary transition-colors"
            >
              <LinkIcon className="w-4 h-4 mr-2" />
              Mes Liens
            </TabsTrigger>
            <TabsTrigger 
              value="advanced" 
              className="flex-1 py-4 px-4 rounded-none data-[state=active]:bg-background data-[state=active]:text-foreground text-muted-foreground border-b-2 border-transparent data-[state=active]:border-primary transition-colors"
            >
              <Zap className="w-4 h-4 mr-2" />
              Fonctions Avancées
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Design */}
          <TabsContent value="design" className="p-6 space-y-6 m-0">
            <div className="space-y-4">
              <Label className="flex items-center gap-2 text-foreground">
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
                      <div className="aspect-video rounded-xl bg-muted border border-border overflow-hidden flex items-center justify-center p-4">
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
                      <div className="flex items-center gap-2 mt-2 text-green-500 text-sm">
                        <Check size={14} />
                        <span>Logo chargé</span>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => logoInputRef.current?.click()}
                      disabled={uploadingLogo}
                      className="w-full aspect-video rounded-xl border-2 border-dashed border-border hover:border-primary/50 bg-muted hover:bg-muted/80 transition-colors flex flex-col items-center justify-center gap-3 text-muted-foreground hover:text-foreground"
                    >
                      {uploadingLogo ? (
                        <>
                          <Loader2 className="w-8 h-8 animate-spin" />
                          <span className="text-sm">Téléchargement... {uploadProgress}%</span>
                          <div className="w-32 h-2 bg-background rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <Upload size={32} />
                          <span className="text-sm font-medium">Cliquez pour télécharger</span>
                          <span className="text-xs">PNG, JPG, SVG (max 5MB)</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Live Card Preview */}
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Aperçu en temps réel</p>
                  <div className="aspect-[1.6/1] rounded-xl bg-card p-5 flex flex-col justify-between border border-border">
                    <div className="flex justify-between items-start">
                      {logoPreview ? (
                        <img 
                          src={logoPreview} 
                          alt="Logo preview" 
                          className="h-10 w-auto max-w-[60%] object-contain"
                        />
                      ) : (
                        <div className="h-10 w-20 rounded bg-muted flex items-center justify-center">
                          <Image size={16} className="text-muted-foreground" />
                        </div>
                      )}
                      <div className="text-xs text-primary font-medium">NFC</div>
                    </div>
                    <div>
                      <div className="font-semibold text-lg text-foreground">
                        {primaryCard.first_name} {primaryCard.last_name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {primaryCard.title || "Votre titre"}
                      </div>
                      <div className="text-xs text-primary/80 mt-1">
                        {primaryCard.company || "Votre entreprise"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Tab 2: Links */}
          <TabsContent value="links" className="p-6 m-0">
            <LinksManager
              value={socialLinks}
              onChange={handleLinksChange}
            />
          </TabsContent>

          {/* Tab 3: Advanced */}
          <TabsContent value="advanced" className="p-6 space-y-6 m-0">
            <div className="grid gap-6 md:grid-cols-2">
              <GoldFeatureCard
                title="Ma Story Pro"
                description="Partagez vos actualités"
                icon={<Sparkles className="w-5 h-5" />}
                isUnlocked={canUseStories}
              >
                <StoryEditor
                  cardId={primaryCard.id}
                  stories={stories}
                  onStoriesChange={updateStories}
                />
              </GoldFeatureCard>

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

            {/* GOLD Upsell */}
            {!isPremium && (
              <div className="p-6 rounded-xl bg-primary/5 border border-primary/10 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Crown className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Passez à GOLD
                </h3>
                <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                  Débloquez les Stories Pro, le partage WiFi, le badge de vérification et bien plus encore.
                </p>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-8">
                  <Crown className="w-4 h-4 mr-2" />
                  Devenir GOLD
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
