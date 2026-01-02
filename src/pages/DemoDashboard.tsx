/**
 * DemoDashboard - Page de démonstration publique du dashboard
 * Simule le dashboard sans authentification pour vérifier le design
 */

import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wifi, Sparkles, Crown, Save, Loader2, Upload, X, 
  Palette, Image, Link as LinkIcon, Zap, Check, ArrowLeft,
  Lock, Plus, GripVertical, Instagram, Music, Globe, MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Mock data for demo
const MOCK_CARD = {
  first_name: "Karim",
  last_name: "Benjelloun",
  title: "Directeur Commercial",
  company: "Riad Palais Azur",
};

const MOCK_LINKS = [
  { id: "1", networkId: "instagram", value: "riadpalaisazur", label: "Instagram" },
  { id: "2", networkId: "whatsapp", value: "+212600123456", label: "WhatsApp" },
];

export default function DemoDashboard() {
  const [activeTab, setActiveTab] = useState("design");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [links, setLinks] = useState(MOCK_LINKS);
  const [hasChanges, setHasChanges] = useState(false);
  
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Simulate logo upload with immediate preview
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      toast.error("Seules les images sont acceptées");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Le fichier est trop volumineux (max 5MB)");
      return;
    }

    // IMMEDIATE LOCAL PREVIEW
    const localUrl = URL.createObjectURL(file);
    setLogoPreview(localUrl);
    setHasChanges(true);
    
    // Simulate upload progress
    setUploadingLogo(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadingLogo(false);
          toast.success("Logo ajouté avec succès !");
          return 100;
        }
        return prev + 20;
      });
    }, 200);
  };

  const handleRemoveLogo = () => {
    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
    }
    setLogoPreview(null);
    setHasChanges(true);
    if (logoInputRef.current) logoInputRef.current.value = "";
  };

  const handleSave = () => {
    toast.success("Modifications enregistrées ! (simulation)");
    setHasChanges(false);
  };

  const addLink = () => {
    const newLink = {
      id: Date.now().toString(),
      networkId: "custom",
      value: "",
      label: "Nouveau lien",
    };
    setLinks([...links, newLink]);
    setHasChanges(true);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              to="/"
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft size={18} />
              <span>Retour</span>
            </Link>
            
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full">
                MODE DÉMO
              </span>
            </div>

            <Link to="/signup">
              <Button variant="chrome" size="sm">
                Créer mon compte
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">
              Dashboard de Personnalisation
            </h1>
            <p className="text-white/60">
              Découvrez comment personnaliser votre carte NFC IWASP
            </p>
          </div>

          {/* Header with Save button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-white">Personnalisation</h2>
              <span className="px-2 py-0.5 bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] text-[#1D1D1F] text-xs font-bold rounded-full flex items-center gap-1">
                <Crown size={10} />
                GOLD
              </span>
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
                    className="bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] text-[#1D1D1F] hover:from-[#C9A431] hover:to-[#E5C75E] font-semibold"
                  >
                    <Save className="w-4 h-4 mr-2" />
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
                            {MOCK_CARD.first_name} {MOCK_CARD.last_name}
                          </div>
                          <div className="text-sm text-white/60">
                            {MOCK_CARD.title}
                          </div>
                          <div className="text-xs text-[#D4AF37]/80 mt-1">
                            {MOCK_CARD.company}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Tab 2: Mes Liens */}
              <TabsContent value="links" className="p-6 m-0 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white">Mes Liens</h3>
                    <span className="text-xs text-white/40 bg-white/10 px-2 py-0.5 rounded-full">
                      {links.length} liens
                    </span>
                  </div>
                  <span className="text-xs text-[#D4AF37]">Illimité ✨</span>
                </div>

                <div className="space-y-2">
                  {links.map((link) => (
                    <div 
                      key={link.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 group"
                    >
                      <div className="cursor-grab text-white/30">
                        <GripVertical size={16} />
                      </div>
                      
                      <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center">
                        {link.networkId === "instagram" && <Instagram size={18} className="text-[#D4AF37]" />}
                        {link.networkId === "whatsapp" && <MessageCircle size={18} className="text-[#D4AF37]" />}
                        {link.networkId === "custom" && <Globe size={18} className="text-[#D4AF37]" />}
                      </div>
                      
                      <div className="flex-1">
                        <p className="text-xs text-white/50 mb-1">{link.label}</p>
                        <Input
                          value={link.value}
                          onChange={() => setHasChanges(true)}
                          placeholder="Entrez votre lien"
                          className="h-9 bg-white/5 text-white text-sm border-white/10"
                        />
                      </div>
                      
                      <button className="w-8 h-8 rounded-lg hover:bg-red-500/20 flex items-center justify-center text-white/30 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={addLink}
                  className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-[#D4AF37]/30 hover:border-[#D4AF37]/50 bg-[#D4AF37]/5 hover:bg-[#D4AF37]/10 transition-all text-[#D4AF37]"
                >
                  <Plus size={18} />
                  <span className="text-sm font-medium">Ajouter un lien</span>
                </button>

                <p className="text-xs text-center text-white/30">
                  ↕ Glissez-déposez pour réorganiser l'ordre d'affichage
                </p>
              </TabsContent>

              {/* Tab 3: Fonctions Avancées */}
              <TabsContent value="advanced" className="p-6 space-y-6 m-0">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Story Pro - GOLD UNLOCKED */}
                  <div className="relative rounded-2xl overflow-hidden border border-[#D4AF37]/30 bg-gradient-to-br from-[#D4AF37]/5 to-transparent">
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-white">Ma Story Pro</h4>
                            <p className="text-xs text-white/50">Partagez vos actualités</p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 bg-[#D4AF37] text-[#1D1D1F] text-xs font-bold rounded-full">
                          GOLD
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <button className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-rose-500/30 hover:border-rose-500/50 bg-rose-500/5 text-rose-500">
                          <Image size={24} />
                          <span className="text-sm">Image</span>
                        </button>
                        <button className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-purple-500/30 hover:border-purple-500/50 bg-purple-500/5 text-purple-500">
                          <Music size={24} />
                          <span className="text-sm">Texte</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* WiFi - GOLD UNLOCKED */}
                  <div className="relative rounded-2xl overflow-hidden border border-[#D4AF37]/30 bg-gradient-to-br from-[#D4AF37]/5 to-transparent">
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center">
                            <Wifi className="w-5 h-5 text-[#D4AF37]" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-white">Partage WiFi</h4>
                            <p className="text-xs text-white/50">QR code de connexion</p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 bg-[#D4AF37] text-[#1D1D1F] text-xs font-bold rounded-full">
                          GOLD
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <Label className="text-xs text-white/60">Nom du réseau (SSID)</Label>
                          <Input 
                            placeholder="WiFi_Riad_Palais" 
                            className="mt-1 bg-white/5 border-white/10 text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-white/60">Mot de passe</Label>
                          <Input 
                            type="password"
                            placeholder="••••••••" 
                            className="mt-1 bg-white/5 border-white/10 text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Demo: Locked version preview */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-sm text-white/60 text-center mb-3">
                    👆 Aperçu GOLD débloqué. Voici à quoi ressemble la version verrouillée :
                  </p>
                  <div className="relative rounded-xl overflow-hidden border border-white/10 bg-white/5 p-4 opacity-50">
                    <div className="absolute inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-10">
                      <div className="text-center">
                        <Lock className="w-8 h-8 text-[#D4AF37] mx-auto mb-2" />
                        <p className="text-white text-sm font-medium">Fonctionnalité GOLD</p>
                        <p className="text-white/60 text-xs">Passez à GOLD pour débloquer</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/10" />
                      <div>
                        <div className="h-4 w-24 bg-white/10 rounded mb-1" />
                        <div className="h-3 w-32 bg-white/10 rounded" />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>

          {/* CTA */}
          <div className="text-center pt-8">
            <p className="text-white/60 mb-4">Prêt à créer votre carte NFC ?</p>
            <div className="flex justify-center gap-4">
              <Link to="/signup">
                <Button className="bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] text-[#1D1D1F] font-semibold px-8">
                  Créer mon compte gratuit
                </Button>
              </Link>
              <Link to="/order/type">
                <Button variant="outline" className="border-[#D4AF37]/50 text-[#D4AF37]">
                  Commander une carte
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
