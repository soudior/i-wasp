/**
 * WebsiteImporter - Auto-génération de template par URL
 * Scrape un site web pour extraire logo, couleurs, produits, réseaux sociaux
 * Design: Gold Shimmer progress bar avec effet premium
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Sparkles, Check, AlertCircle, Loader2, ArrowRight } from "lucide-react";
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
  className?: string;
}

type ImportStatus = "idle" | "loading" | "success" | "error";

const ANALYSIS_STEPS = [
  "Connexion au site...",
  "Extraction du logo et des couleurs...",
  "Récupération des produits...",
  "Analyse des réseaux sociaux...",
  "Finalisation...",
];

export function WebsiteImporter({ onDataImported, className = "" }: WebsiteImporterProps) {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<ImportStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [importedData, setImportedData] = useState<ScrapedWebsiteData | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Progress animation during loading
  useEffect(() => {
    if (status !== "loading") return;

    const stepDuration = 2000; // 2s per step
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= ANALYSIS_STEPS.length - 1) {
          return prev;
        }
        return prev + 1;
      });
      setProgress((prev) => Math.min(prev + 20, 90));
    }, stepDuration);

    return () => clearInterval(interval);
  }, [status]);

  // Auto-scroll to result after success
  useEffect(() => {
    if (status === "success" && resultRef.current) {
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 500);
    }
  }, [status]);

  const handleImport = useCallback(async () => {
    if (!url.trim()) {
      toast.error("Veuillez entrer une URL");
      return;
    }

    setStatus("loading");
    setProgress(10);
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
      
      // Small delay for visual effect
      await new Promise((resolve) => setTimeout(resolve, 500));

      setStatus("success");
      setImportedData(data.data);
      onDataImported(data.data);
      
      toast.success("Site analysé avec succès !", {
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
  };

  return (
    <div className={`${className}`}>
      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative p-6 rounded-2xl border border-[#d4af37]/30 bg-gradient-to-br from-black/80 to-zinc-900/80 backdrop-blur-xl"
        style={{
          boxShadow: "0 8px 32px rgba(212,175,55,0.15)",
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#b8860b] flex items-center justify-center">
            <Globe size={20} className="text-black" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Importer mon site web</h3>
            <p className="text-xs text-white/50">
              Génération automatique de votre template
            </p>
          </div>
        </div>

        {/* URL Input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="exemple.com ou https://monsite.com"
              disabled={status === "loading"}
              className="h-12 pl-4 pr-10 bg-black/50 border-white/10 text-white placeholder:text-white/30 focus:border-[#d4af37]/50 rounded-xl"
            />
            {status === "success" && (
              <Check className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500" size={20} />
            )}
          </div>
          <Button
            onClick={status === "success" ? handleReset : handleImport}
            disabled={status === "loading" || (!url.trim() && status !== "success")}
            className="h-12 px-6 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-black font-medium hover:opacity-90 transition-opacity"
          >
            {status === "loading" ? (
              <Loader2 className="animate-spin" size={20} />
            ) : status === "success" ? (
              "Réinitialiser"
            ) : (
              <>
                <Sparkles size={18} className="mr-2" />
                Analyser
              </>
            )}
          </Button>
        </div>

        {/* Progress Bar - Loading State */}
        <AnimatePresence>
          {status === "loading" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6"
            >
              {/* Progress Bar with Gold Shimmer */}
              <div className="relative h-2 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                  style={{
                    background: "linear-gradient(90deg, #d4af37, #f7dc6f, #d4af37)",
                    backgroundSize: "200% 100%",
                  }}
                />
                {/* Shimmer Effect */}
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    backgroundPosition: ["200% 0%", "-200% 0%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                    backgroundSize: "50% 100%",
                  }}
                />
              </div>

              {/* Current Step */}
              <div className="mt-3 flex items-center gap-2">
                <Loader2 className="animate-spin text-[#d4af37]" size={14} />
                <span className="text-sm text-white/70">
                  {ANALYSIS_STEPS[currentStep]}
                </span>
              </div>
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
              className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3"
            >
              <AlertCircle className="text-red-400" size={18} />
              <span className="text-sm text-red-300">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Success Preview */}
      <AnimatePresence>
        {status === "success" && importedData && (
          <motion.div
            ref={resultRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-6 p-6 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-900/20 to-black/80"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Check className="text-emerald-400" size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-white">Importation réussie</h4>
                <p className="text-xs text-emerald-400">
                  Données extraites et prêtes à l'emploi
                </p>
              </div>
            </div>

            {/* Extracted Data Preview */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              {importedData.logo && (
                <div className="col-span-2 flex items-center gap-3 p-3 rounded-xl bg-white/5">
                  <img 
                    src={importedData.logo} 
                    alt="Logo" 
                    className="h-10 w-auto object-contain"
                  />
                  <span className="text-white/70">Logo détecté</span>
                </div>
              )}
              
              {importedData.brandName && (
                <div className="p-3 rounded-xl bg-white/5">
                  <span className="text-white/50 text-xs">Nom</span>
                  <p className="text-white font-medium truncate">{importedData.brandName}</p>
                </div>
              )}
              
              {importedData.phone && (
                <div className="p-3 rounded-xl bg-white/5">
                  <span className="text-white/50 text-xs">Téléphone</span>
                  <p className="text-white font-medium truncate">{importedData.phone}</p>
                </div>
              )}
              
              {importedData.colors?.primary && (
                <div className="p-3 rounded-xl bg-white/5 flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded-full border border-white/20"
                    style={{ backgroundColor: importedData.colors.primary }}
                  />
                  <span className="text-white/70 text-xs">Couleur principale</span>
                </div>
              )}
              
              {(importedData.products?.length || 0) > 0 && (
                <div className="p-3 rounded-xl bg-white/5">
                  <span className="text-white/50 text-xs">Produits</span>
                  <p className="text-white font-medium">{importedData.products?.length} détectés</p>
                </div>
              )}
            </div>

            {/* Continue CTA */}
            <div className="mt-4 flex justify-end">
              <Button
                size="sm"
                className="bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-black font-medium"
              >
                Continuer avec ces données
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default WebsiteImporter;
