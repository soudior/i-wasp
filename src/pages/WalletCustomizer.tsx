import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Wallet, 
  Palette, 
  Image, 
  Eye, 
  Check,
  Smartphone,
  CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface WalletSettings {
  backgroundColor: string;
  foregroundColor: string;
  labelColor: string;
  showTitle: boolean;
  showCompany: boolean;
  showPhone: boolean;
  showEmail: boolean;
  showWebsite: boolean;
  showLocation: boolean;
}

const defaultSettings: WalletSettings = {
  backgroundColor: "#1D1D1F",
  foregroundColor: "#FFFFFF",
  labelColor: "#8E8E93",
  showTitle: true,
  showCompany: true,
  showPhone: true,
  showEmail: true,
  showWebsite: false,
  showLocation: false,
};

const colorPresets = [
  { name: "Noir élégant", bg: "#1D1D1F", fg: "#FFFFFF", label: "#8E8E93" },
  { name: "Bleu marine", bg: "#1B3A5F", fg: "#FFFFFF", label: "#A0C4E8" },
  { name: "Or premium", bg: "#C9A227", fg: "#1D1D1F", label: "#5C4A0F" },
  { name: "Blanc minimal", bg: "#F5F5F7", fg: "#1D1D1F", label: "#8E8E93" },
  { name: "Vert forêt", bg: "#1A3D2E", fg: "#FFFFFF", label: "#7FB09A" },
  { name: "Bordeaux", bg: "#5C1A33", fg: "#FFFFFF", label: "#D4A5B5" },
];

export default function WalletCustomizer() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [settings, setSettings] = useState<WalletSettings>(defaultSettings);
  const [cardData, setCardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCardData();
    }
  }, [user]);

  const fetchCardData = async () => {
    try {
      const { data, error } = await supabase
        .from("digital_cards")
        .select("*")
        .eq("user_id", user?.id)
        .eq("is_active", true)
        .single();

      if (error) throw error;
      
      setCardData(data);
      
      // Load existing wallet settings if available
      const customStyles = data?.custom_styles as Record<string, unknown> | null;
      if (customStyles?.wallet) {
        setSettings({ ...defaultSettings, ...(customStyles.wallet as WalletSettings) });
      }
    } catch (error) {
      console.error("Error fetching card:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePresetSelect = (preset: typeof colorPresets[0]) => {
    setSettings(prev => ({
      ...prev,
      backgroundColor: preset.bg,
      foregroundColor: preset.fg,
      labelColor: preset.label,
    }));
  };

  const handleSave = async () => {
    if (!cardData) return;
    
    setSaving(true);
    try {
      const existingStyles = cardData.custom_styles || {};
      const { error } = await supabase
        .from("digital_cards")
        .update({
          custom_styles: {
            ...existingStyles,
            wallet: settings,
          },
        })
        .eq("id", cardData.id);

      if (error) throw error;
      
      toast.success("Paramètres du pass sauvegardés");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#007AFF] border-t-transparent" />
      </div>
    );
  }

  if (!cardData) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-center p-6 text-center">
        <CreditCard className="w-16 h-16 text-[#8E8E93] mb-4" />
        <h1 className="text-xl font-semibold text-[#1D1D1F] mb-2">Aucune carte trouvée</h1>
        <p className="text-[#8E8E93] mb-6">Créez d'abord votre carte digitale</p>
        <Button onClick={() => navigate("/create-card")} className="bg-[#007AFF]">
          Créer ma carte
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#E5E5E5]">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-[#F5F5F7] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#1D1D1F]" />
          </button>
          <h1 className="text-lg font-semibold text-[#1D1D1F]">Pass Wallet</h1>
          <Button 
            onClick={handleSave} 
            disabled={saving}
            size="sm"
            className="bg-[#007AFF] hover:bg-[#0056CC] text-white"
          >
            {saving ? "..." : "Sauvegarder"}
          </Button>
        </div>
      </header>

      <div className="p-4 pb-24 max-w-lg mx-auto space-y-6">
        {/* Pass Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <div className="flex items-center gap-2 mb-3">
            <Eye className="w-4 h-4 text-[#8E8E93]" />
            <span className="text-sm font-medium text-[#8E8E93]">Aperçu</span>
          </div>
          
          {/* Wallet Pass Preview */}
          <div 
            className="rounded-2xl p-5 shadow-xl relative overflow-hidden"
            style={{ backgroundColor: settings.backgroundColor }}
          >
            {/* Top strip */}
            <div className="absolute top-0 left-0 right-0 h-8 bg-black/10" />
            
            {/* Header */}
            <div className="flex items-start justify-between mb-6 pt-4">
              <div>
                <p 
                  className="text-xs font-medium mb-1 uppercase tracking-wider"
                  style={{ color: settings.labelColor }}
                >
                  Carte de visite
                </p>
                <h2 
                  className="text-xl font-bold"
                  style={{ color: settings.foregroundColor }}
                >
                  {cardData.first_name} {cardData.last_name}
                </h2>
              </div>
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: settings.foregroundColor + "20" }}
              >
                <Wallet className="w-5 h-5" style={{ color: settings.foregroundColor }} />
              </div>
            </div>

            {/* Fields */}
            <div className="space-y-3">
              {settings.showTitle && cardData.title && (
                <div>
                  <p 
                    className="text-[10px] uppercase tracking-wider mb-0.5"
                    style={{ color: settings.labelColor }}
                  >
                    Fonction
                  </p>
                  <p 
                    className="text-sm font-medium"
                    style={{ color: settings.foregroundColor }}
                  >
                    {cardData.title}
                  </p>
                </div>
              )}
              
              {settings.showCompany && cardData.company && (
                <div>
                  <p 
                    className="text-[10px] uppercase tracking-wider mb-0.5"
                    style={{ color: settings.labelColor }}
                  >
                    Entreprise
                  </p>
                  <p 
                    className="text-sm font-medium"
                    style={{ color: settings.foregroundColor }}
                  >
                    {cardData.company}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                {settings.showPhone && cardData.phone && (
                  <div>
                    <p 
                      className="text-[10px] uppercase tracking-wider mb-0.5"
                      style={{ color: settings.labelColor }}
                    >
                      Téléphone
                    </p>
                    <p 
                      className="text-sm font-medium"
                      style={{ color: settings.foregroundColor }}
                    >
                      {cardData.phone}
                    </p>
                  </div>
                )}
                
                {settings.showEmail && cardData.email && (
                  <div>
                    <p 
                      className="text-[10px] uppercase tracking-wider mb-0.5"
                      style={{ color: settings.labelColor }}
                    >
                      Email
                    </p>
                    <p 
                      className="text-sm font-medium truncate"
                      style={{ color: settings.foregroundColor }}
                    >
                      {cardData.email}
                    </p>
                  </div>
                )}
              </div>

              {settings.showWebsite && cardData.website && (
                <div>
                  <p 
                    className="text-[10px] uppercase tracking-wider mb-0.5"
                    style={{ color: settings.labelColor }}
                  >
                    Site web
                  </p>
                  <p 
                    className="text-sm font-medium"
                    style={{ color: settings.foregroundColor }}
                  >
                    {cardData.website}
                  </p>
                </div>
              )}

              {settings.showLocation && cardData.location && (
                <div>
                  <p 
                    className="text-[10px] uppercase tracking-wider mb-0.5"
                    style={{ color: settings.labelColor }}
                  >
                    Localisation
                  </p>
                  <p 
                    className="text-sm font-medium"
                    style={{ color: settings.foregroundColor }}
                  >
                    {cardData.location}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <span 
                className="text-[10px] uppercase tracking-wider"
                style={{ color: settings.labelColor }}
              >
                Powered by IWASP
              </span>
              <Smartphone className="w-4 h-4" style={{ color: settings.labelColor }} />
            </div>
          </div>
        </motion.div>

        {/* Color Presets */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-4 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-4 h-4 text-[#007AFF]" />
            <h3 className="font-semibold text-[#1D1D1F]">Thème de couleur</h3>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {colorPresets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => handlePresetSelect(preset)}
                className={`relative p-3 rounded-xl border-2 transition-all ${
                  settings.backgroundColor === preset.bg
                    ? "border-[#007AFF] shadow-md"
                    : "border-transparent hover:border-[#E5E5E5]"
                }`}
                style={{ backgroundColor: preset.bg }}
              >
                <span 
                  className="text-xs font-medium"
                  style={{ color: preset.fg }}
                >
                  {preset.name}
                </span>
                {settings.backgroundColor === preset.bg && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#007AFF] rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </motion.section>

        {/* Custom Colors */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl p-4 shadow-sm"
        >
          <h3 className="font-semibold text-[#1D1D1F] mb-4">Couleurs personnalisées</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm text-[#1D1D1F]">Fond</Label>
              <input
                type="color"
                value={settings.backgroundColor}
                onChange={(e) => setSettings(prev => ({ ...prev, backgroundColor: e.target.value }))}
                className="w-10 h-10 rounded-lg border-2 border-[#E5E5E5] cursor-pointer"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label className="text-sm text-[#1D1D1F]">Texte principal</Label>
              <input
                type="color"
                value={settings.foregroundColor}
                onChange={(e) => setSettings(prev => ({ ...prev, foregroundColor: e.target.value }))}
                className="w-10 h-10 rounded-lg border-2 border-[#E5E5E5] cursor-pointer"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label className="text-sm text-[#1D1D1F]">Libellés</Label>
              <input
                type="color"
                value={settings.labelColor}
                onChange={(e) => setSettings(prev => ({ ...prev, labelColor: e.target.value }))}
                className="w-10 h-10 rounded-lg border-2 border-[#E5E5E5] cursor-pointer"
              />
            </div>
          </div>
        </motion.section>

        {/* Field Toggles */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-4 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <Image className="w-4 h-4 text-[#007AFF]" />
            <h3 className="font-semibold text-[#1D1D1F]">Informations affichées</h3>
          </div>
          
          <div className="space-y-3">
            {[
              { key: "showTitle", label: "Fonction", value: cardData.title },
              { key: "showCompany", label: "Entreprise", value: cardData.company },
              { key: "showPhone", label: "Téléphone", value: cardData.phone },
              { key: "showEmail", label: "Email", value: cardData.email },
              { key: "showWebsite", label: "Site web", value: cardData.website },
              { key: "showLocation", label: "Localisation", value: cardData.location },
            ].map((field) => (
              <div 
                key={field.key}
                className={`flex items-center justify-between py-2 ${
                  !field.value ? "opacity-50" : ""
                }`}
              >
                <div>
                  <Label className="text-sm text-[#1D1D1F]">{field.label}</Label>
                  {!field.value && (
                    <p className="text-xs text-[#8E8E93]">Non renseigné</p>
                  )}
                </div>
                <Switch
                  checked={settings[field.key as keyof WalletSettings] as boolean}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, [field.key]: checked }))
                  }
                  disabled={!field.value}
                />
              </div>
            ))}
          </div>
        </motion.section>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="text-center text-xs text-[#8E8E93] px-4"
        >
          Ces paramètres seront appliqués lors de l'ajout du pass à Apple Wallet ou Google Wallet.
        </motion.div>
      </div>
    </div>
  );
}
