/**
 * WebsiteImporter - i-wasp Magic Import
 * Auto-génération de template par URL avec design Dark Luxury
 * Scrape un site web pour extraire logo, couleurs, produits, réseaux sociaux
 * Design: Gold Shimmer progress bar avec effet premium
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Sparkles, Check, AlertCircle, Loader2, ArrowRight, Wand2, Edit3, Image, MapPin, Phone, Instagram, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ScrapedWebsiteData {
  logo?: string;
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
  };
  brandName?: string;
  tagline?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  instagram?: string;
  facebook?: string;
  googleMapsUrl?: string;
  latitude?: number;
  longitude?: number;
  website?: string;
  products?: Array<{
    name: string;
    image?: string;
    price?: string;
    category?: string;
  }>;
  images?: string[];
  storyImages?: string[];
}

interface WebsiteImporterProps {
  onDataImported: (data: ScrapedWebsiteData) => void;
  onEditImportedData?: () => void;
  className?: string;
}

type ImportStatus = "idle" | "loading" | "success" | "error";

const ANALYSIS_STEPS = [
  "Connexion au site...",
  "Extraction du logo et des couleurs...",
  "Récupération des images produits...",
  "Analyse des réseaux sociaux...",
  "Détection WhatsApp & Maps...",
  "Création de votre univers i-wasp...",
];

export function WebsiteImporter({ onDataImported, onEditImportedData, className = "" }: WebsiteImporterProps) {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<ImportStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [importedData, setImportedData] = useState<ScrapedWebsiteData | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Progress animation during loading with stepped increments
  useEffect(() => {
    if (status !== "loading") return;

    const stepDuration = 1500; // 1.5s per step
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= ANALYSIS_STEPS.length - 1) {
          return prev;
        }
        return prev + 1;
      });
      setProgress((prev) => Math.min(prev + 15, 90));
    }, stepDuration);

    return () => clearInterval(interval);
  }, [status]);

  // Auto-scroll to result after success with smooth animation
  useEffect(() => {
    if (status === "success" && resultRef.current) {
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 600);
    }
  }, [status]);

  const handleImport = useCallback(async () => {
    if (!url.trim()) {
      toast.error("Veuillez entrer l'URL de votre site");
      return;
    }

    setStatus("loading");
    setProgress(5);
    setCurrentStep(0);
    setError(null);
    setImportedData(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("scrape-website", {
        body: { url: url.trim() },
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (!data?.success) {
        throw new Error(data?.error || "Échec de l'analyse du site");
      }

      setProgress(100);
      setCurrentStep(ANALYSIS_STEPS.length - 1);
      
      // Delay for visual effect
      await new Promise((resolve) => setTimeout(resolve, 800));

      setStatus("success");
      setImportedData(data.data);
      onDataImported(data.data);
      
      toast.success("✨ Magie i-wasp terminée !", {
        description: `${data.data.products?.length || 0} produits et ${data.data.storyImages?.length || 0} images importés`,
      });

    } catch (err) {
      console.error("Import error:", err);
      setStatus("error");
      setError(err instanceof Error ? err.message : "Erreur inconnue");
      toast.error("Échec de l'importation", {
        description: err instanceof Error ? err.message : "Vérifiez l'URL et réessayez",
      });
    }
  }, [url, onDataImported]);

  const handleReset = () => {
    setStatus("idle");
    setProgress(0);
    setCurrentStep(0);
    setError(null);
    setImportedData(null);
    setUrl("");
  };

  return (
    <div className={`${className}`}>
      {/* Main Import Card - Dark Luxury Design */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border-2 border-[#d4af37]/40 bg-gradient-to-br from-black via-zinc-900/95 to-black"
        style={{
          boxShadow: "0 20px 60px rgba(212,175,55,0.15), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        {/* Decorative Gold Corner */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#d4af37]/20 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#d4af37]/10 to-transparent pointer-events-none" />

        <div className="relative p-8">
          {/* Header with Gold Icon */}
          <div className="flex items-center gap-4 mb-6">
            <motion.div 
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#d4af37] via-[#f7dc6f] to-[#b8860b] flex items-center justify-center shadow-lg"
              animate={{ 
                boxShadow: [
                  "0 0 20px rgba(212,175,55,0.3)",
                  "0 0 40px rgba(212,175,55,0.5)",
                  "0 0 20px rgba(212,175,55,0.3)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Wand2 size={26} className="text-black" />
            </motion.div>
            <div>
              <h3 className="text-xl font-bold text-white">i-wasp Magic Import</h3>
              <p className="text-sm text-[#d4af37]/70">
                Générez votre carte en 1 clic à partir de votre site
              </p>
            </div>
          </div>

          {/* URL Input - Premium Style */}
          <div className="space-y-4">
            <div className="relative">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-[#d4af37]/60" size={20} />
              <Input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="monsite.com ou https://www.exemple.com"
                disabled={status === "loading" || status === "success"}
                className="h-14 pl-12 pr-4 text-lg bg-black/60 border-2 border-white/10 text-white placeholder:text-white/30 focus:border-[#d4af37]/60 rounded-xl transition-all"
                onKeyDown={(e) => e.key === "Enter" && status === "idle" && handleImport()}
              />
              {status === "success" && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  <Check className="text-emerald-400" size={22} />
                </motion.div>
              )}
            </div>

            {/* Action Button - Gold Shimmer */}
            <motion.div
              whileHover={{ scale: status === "idle" ? 1.02 : 1 }}
              whileTap={{ scale: status === "idle" ? 0.98 : 1 }}
            >
              <Button
                onClick={status === "success" ? handleReset : handleImport}
                disabled={status === "loading" || (!url.trim() && status !== "success")}
                className="w-full h-16 text-lg font-semibold rounded-xl relative overflow-hidden group disabled:opacity-50"
                style={{
                  background: status === "success" 
                    ? "linear-gradient(135deg, #059669, #10b981)" 
                    : "linear-gradient(135deg, #d4af37, #f7dc6f, #d4af37)",
                  backgroundSize: "200% 100%",
                  color: status === "success" ? "#ffffff" : "#000000",
                }}
              >
                {/* Shimmer Effect */}
                {status === "idle" && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    animate={{
                      backgroundPosition: ["200% 0%", "-200% 0%"],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={{
                      background: "linear-gradient(90deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)",
                      backgroundSize: "50% 100%",
                    }}
                  />
                )}
                
                {status === "loading" ? (
                  <span className="flex items-center gap-3">
                    <Loader2 className="animate-spin" size={22} />
                    Création de votre univers i-wasp...
                  </span>
                ) : status === "success" ? (
                  <span className="flex items-center gap-3">
                    <Check size={22} />
                    Nouvelle importation
                  </span>
                ) : (
                  <span className="flex items-center gap-3">
                    <Sparkles size={22} />
                    Générer ma Carte Magique
                  </span>
                )}
              </Button>
            </motion.div>
          </div>

          {/* Progress Section - Loading State */}
          <AnimatePresence>
            {status === "loading" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-8"
              >
                {/* Luxury Progress Bar with Gold Shimmer */}
                <div className="relative h-3 rounded-full bg-white/5 overflow-hidden border border-white/10">
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    style={{
                      background: "linear-gradient(90deg, #b8860b, #d4af37, #f7dc6f, #d4af37, #b8860b)",
                      backgroundSize: "200% 100%",
                    }}
                  />
                  {/* Animated Shimmer */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    animate={{
                      backgroundPosition: ["200% 0%", "-200% 0%"],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={{
                      background: "linear-gradient(90deg, transparent 20%, rgba(255,255,255,0.5) 50%, transparent 80%)",
                      backgroundSize: "30% 100%",
                    }}
                  />
                </div>

                {/* Current Step Display */}
                <motion.div 
                  className="mt-4 flex items-center gap-3"
                  key={currentStep}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <motion.div
                    className="w-8 h-8 rounded-full bg-[#d4af37]/20 flex items-center justify-center"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="text-[#d4af37]" size={16} />
                  </motion.div>
                  <span className="text-sm text-white/80 font-medium">
                    {ANALYSIS_STEPS[currentStep]}
                  </span>
                  <span className="ml-auto text-sm text-[#d4af37]">{progress}%</span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error State */}
          <AnimatePresence>
            {status === "error" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3"
              >
                <AlertCircle className="text-red-400 flex-shrink-0" size={20} />
                <span className="text-sm text-red-300">{error}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="ml-auto text-red-400 hover:text-red-300"
                >
                  Réessayer
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Success Result Card - Auto-scrolled */}
      <AnimatePresence>
        {status === "success" && importedData && (
          <motion.div
            ref={resultRef}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mt-8 rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-950/40 via-black to-black overflow-hidden"
            style={{
              boxShadow: "0 20px 60px rgba(16,185,129,0.15)",
            }}
          >
            {/* Success Header */}
            <div className="p-6 border-b border-emerald-500/20 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.div 
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  <Check className="text-black" size={24} />
                </motion.div>
                <div>
                  <h4 className="text-lg font-bold text-white">Importation réussie !</h4>
                  <p className="text-sm text-emerald-400">
                    Votre univers i-wasp est prêt
                  </p>
                </div>
              </div>
              
              {/* Edit Button */}
              {onEditImportedData && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onEditImportedData}
                  className="border-[#d4af37]/50 text-[#d4af37] hover:bg-[#d4af37]/10 gap-2"
                >
                  <Edit3 size={16} />
                  Modifier l'Importation
                </Button>
              )}
            </div>

            {/* Extracted Data Grid */}
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* Logo */}
                {importedData.logo && (
                  <motion.div 
                    className="col-span-2 md:col-span-1 p-4 rounded-xl bg-white/5 border border-white/10"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={importedData.logo} 
                        alt="Logo" 
                        className="h-12 w-auto object-contain rounded-lg bg-white/10 p-1"
                      />
                      <div>
                        <span className="text-xs text-white/50">Logo</span>
                        <p className="text-sm text-white font-medium">Détecté ✓</p>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {/* Brand Name */}
                {importedData.brandName && (
                  <motion.div 
                    className="p-4 rounded-xl bg-white/5 border border-white/10"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <span className="text-xs text-white/50">Nom</span>
                    <p className="text-white font-semibold truncate">{importedData.brandName}</p>
                  </motion.div>
                )}
                
                {/* Colors */}
                {importedData.colors?.primary && (
                  <motion.div 
                    className="p-4 rounded-xl bg-white/5 border border-white/10"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <span className="text-xs text-white/50 mb-2 block">Couleurs</span>
                    <div className="flex gap-2">
                      <div 
                        className="w-8 h-8 rounded-full border-2 border-white/20 shadow-lg"
                        style={{ backgroundColor: importedData.colors.primary }}
                      />
                      {importedData.colors.secondary && (
                        <div 
                          className="w-8 h-8 rounded-full border-2 border-white/20 shadow-lg"
                          style={{ backgroundColor: importedData.colors.secondary }}
                        />
                      )}
                    </div>
                  </motion.div>
                )}
                
                {/* Phone/WhatsApp */}
                {(importedData.phone || importedData.whatsapp) && (
                  <motion.div 
                    className="p-4 rounded-xl bg-white/5 border border-white/10"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Phone size={14} className="text-emerald-400" />
                      <span className="text-xs text-white/50">Contact</span>
                    </div>
                    <p className="text-sm text-white truncate">{importedData.phone || importedData.whatsapp}</p>
                  </motion.div>
                )}
                
                {/* Instagram */}
                {importedData.instagram && (
                  <motion.div 
                    className="p-4 rounded-xl bg-white/5 border border-white/10"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Instagram size={14} className="text-pink-400" />
                      <span className="text-xs text-white/50">Instagram</span>
                    </div>
                    <p className="text-sm text-white truncate">{importedData.instagram}</p>
                  </motion.div>
                )}
                
                {/* Maps */}
                {importedData.googleMapsUrl && (
                  <motion.div 
                    className="p-4 rounded-xl bg-white/5 border border-white/10"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin size={14} className="text-red-400" />
                      <span className="text-xs text-white/50">Maps</span>
                    </div>
                    <p className="text-sm text-emerald-400">Géolocalisation ✓</p>
                  </motion.div>
                )}
                
                {/* Products Count */}
                {(importedData.products?.length || 0) > 0 && (
                  <motion.div 
                    className="p-4 rounded-xl bg-gradient-to-br from-[#d4af37]/20 to-transparent border border-[#d4af37]/30"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <ExternalLink size={14} className="text-[#d4af37]" />
                      <span className="text-xs text-white/50">Produits</span>
                    </div>
                    <p className="text-lg font-bold text-[#d4af37]">{importedData.products?.length}</p>
                  </motion.div>
                )}
                
                {/* Story Images */}
                {(importedData.storyImages?.length || 0) > 0 && (
                  <motion.div 
                    className="p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-transparent border border-purple-500/30"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Image size={14} className="text-purple-400" />
                      <span className="text-xs text-white/50">Stories 24h</span>
                    </div>
                    <p className="text-lg font-bold text-purple-400">{importedData.storyImages?.length}</p>
                  </motion.div>
                )}
              </div>

              {/* Continue CTA */}
              <motion.div 
                className="mt-6 flex justify-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="text-center">
                  <p className="text-sm text-white/60 mb-3">
                    Ces données seront appliquées à votre template à l'étape Design
                  </p>
                  <div className="flex items-center justify-center gap-2 text-[#d4af37]">
                    <Sparkles size={16} />
                    <span className="text-sm font-medium">Continuez pour voir la magie opérer</span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default WebsiteImporter;
