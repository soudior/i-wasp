/**
 * DashboardCustomization - Section de personnalisation du Dashboard
 * Gestion des liens, Stories GOLD, WiFi GOLD
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Wifi, Sparkles, Crown, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useCards, useUpdateCard } from "@/hooks/useCards";
import { useFeatureAccess } from "@/hooks/useSubscription";
import { useStories } from "@/hooks/useStories";
import { LinksManager } from "@/components/LinksManager";
import { GoldFeatureCard, GoldVerificationBadge } from "@/components/GoldFeatureCard";
import { StoryEditor } from "@/components/StoryEditor";
import { WiFiQRGenerator } from "@/components/WiFiQRGenerator";
import { SocialLink } from "@/lib/socialNetworks";
import { toast } from "sonner";

export function DashboardCustomization() {
  const { user } = useAuth();
  const { data: cards = [], isLoading } = useCards();
  const { isPremium, canUseStories, canUseWifi } = useFeatureAccess();
  const updateCard = useUpdateCard();
  
  const primaryCard = cards[0];
  const { story: currentStory, updateStory } = useStories(primaryCard?.id);
  
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [wifiConfig, setWifiConfig] = useState<{ ssid: string; password: string; security: "WPA" | "WEP" | "nopass" }>({ 
    ssid: "", 
    password: "", 
    security: "WPA" 
  });
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load social links from card
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
  }, [primaryCard]);

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
      {/* Header with GOLD badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-white">Personnalisation</h2>
          {isPremium && <GoldVerificationBadge />}
        </div>
        
        {hasChanges && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
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
      </div>

      {/* Links Manager - Free for all */}
      <Card className="bg-gradient-to-br from-[#1D1D1F] to-[#2D2D30] border-white/10 p-5">
        <LinksManager
          value={socialLinks}
          onChange={handleLinksChange}
        />
      </Card>

      {/* Premium Features Grid */}
      <div className="grid gap-4 md:grid-cols-2">
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
    </div>
  );
}
