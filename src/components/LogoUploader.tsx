/**
 * LogoUploader - Composant d'upload de logo avec aperçu temps réel
 * Barre de progression et feedback visuel premium
 */

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Check, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface LogoUploaderProps {
  value: string | null;
  onChange: (url: string | null) => void;
  className?: string;
  cardColor?: "black" | "white" | "navy";
}

export function LogoUploader({ value, onChange, className, cardColor = "black" }: LogoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    // Start upload simulation with progress
    setUploading(true);
    setUploadProgress(0);

    // Simulate progress animation
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    // Revoke old URL if it was a blob
    if (value?.startsWith("blob:")) {
      URL.revokeObjectURL(value);
    }

    // Create local preview URL
    const localUrl = URL.createObjectURL(file);
    
    // Complete progress
    setTimeout(() => {
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        onChange(localUrl);
        setUploading(false);
        setUploadProgress(0);
        toast.success("Logo ajouté avec succès !");
      }, 300);
    }, 800);

    // Reset input
    e.target.value = "";
  };

  const handleRemove = () => {
    if (value?.startsWith("blob:")) {
      URL.revokeObjectURL(value);
    }
    onChange(null);
  };

  // Card background colors
  const cardBgColors = {
    black: "from-zinc-900 via-zinc-800 to-zinc-900",
    white: "from-zinc-100 via-white to-zinc-100",
    navy: "from-slate-900 via-slate-800 to-slate-900",
  };

  const textColors = {
    black: "text-zinc-500",
    white: "text-zinc-400",
    navy: "text-slate-400",
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* File Input Hidden */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".png,.svg,.jpg,.jpeg,.webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload Zone */}
      <AnimatePresence mode="wait">
        {!value ? (
          <motion.button
            key="upload-zone"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full h-32 border-2 border-dashed border-zinc-700 hover:border-amber-500/50 rounded-xl flex flex-col items-center justify-center gap-2 transition-all duration-300 group bg-zinc-900/50"
          >
            {uploading ? (
              <>
                <Loader2 className="h-8 w-8 text-amber-500 animate-spin" />
                <p className="text-sm text-amber-500">Chargement...</p>
                <Progress value={uploadProgress} className="w-2/3 h-1.5" />
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-zinc-800 group-hover:bg-amber-500/20 flex items-center justify-center transition-colors">
                  <Upload className="h-5 w-5 text-zinc-500 group-hover:text-amber-400" />
                </div>
                <p className="text-sm font-medium text-zinc-400">Cliquez pour uploader</p>
                <p className="text-xs text-zinc-600">PNG, SVG, JPG (max 5 Mo)</p>
              </>
            )}
          </motion.button>
        ) : (
          <motion.div
            key="preview-zone"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative"
          >
            {/* Logo Preview */}
            <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
              <img 
                src={value} 
                alt="Logo" 
                className="h-14 w-auto max-w-[120px] object-contain"
              />
              <div className="flex-1">
                <div className="flex items-center gap-1.5 text-emerald-400 text-sm">
                  <Check className="h-4 w-4" />
                  <span>Logo chargé</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-zinc-400 hover:text-white"
                >
                  Changer
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemove}
                  className="text-red-400 hover:text-red-300"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Real-Time Card Preview */}
      <div>
        <p className="text-sm text-zinc-500 mb-2">Aperçu en temps réel</p>
        <motion.div 
          initial={false}
          animate={{ scale: value ? 1.02 : 1 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "relative aspect-[1.586] rounded-xl overflow-hidden shadow-xl border",
            cardColor === "black" && "bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 border-zinc-700/50",
            cardColor === "white" && "bg-gradient-to-br from-white via-zinc-50 to-white border-zinc-200",
            cardColor === "navy" && "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700/50"
          )}
        >
          {/* Card texture overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 via-transparent to-amber-500/10" />
          </div>
          
          {/* Logo on card - Centered */}
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <AnimatePresence mode="wait">
              {value ? (
                <motion.img
                  key="logo"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  src={value}
                  alt="Logo sur carte"
                  className="max-w-[60%] max-h-[50%] object-contain drop-shadow-lg"
                  style={{ filter: 'brightness(1.1) contrast(1.05)' }}
                />
              ) : (
                <motion.div 
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <div className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-2",
                    cardColor === "black" && "bg-zinc-700/50",
                    cardColor === "white" && "bg-zinc-200/50",
                    cardColor === "navy" && "bg-slate-700/50"
                  )}>
                    <ImageIcon className={cn(
                      "h-6 w-6",
                      textColors[cardColor]
                    )} />
                  </div>
                  <p className={cn("text-xs", textColors[cardColor])}>Votre logo ici</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Gold accent line */}
          <div className="absolute bottom-3 left-3 right-3 h-0.5 bg-gradient-to-r from-amber-400/50 via-amber-300/80 to-amber-400/50" />
          
          {/* i-wasp branding */}
          <div className="absolute bottom-3 right-3">
            <span className="text-[8px] text-amber-400/60 font-medium tracking-widest uppercase">i-wasp</span>
          </div>

          {/* NFC indicator */}
          <div className="absolute top-3 right-3 w-5 h-5 rounded-full border border-amber-400/30 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400/50 animate-pulse" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/**
 * CardColorSelector - Sélecteur de couleur de carte
 */
interface CardColorSelectorProps {
  value: "black" | "white" | "navy";
  onChange: (color: "black" | "white" | "navy") => void;
}

export function CardColorSelector({ value, onChange }: CardColorSelectorProps) {
  const colors = [
    { id: "black" as const, label: "Noir", bg: "bg-zinc-900", border: "border-zinc-700" },
    { id: "white" as const, label: "Blanc", bg: "bg-white", border: "border-zinc-200" },
    { id: "navy" as const, label: "Bleu", bg: "bg-slate-900", border: "border-slate-700" },
  ];

  return (
    <div className="flex gap-2">
      {colors.map((color) => (
        <button
          key={color.id}
          onClick={() => onChange(color.id)}
          className={cn(
            "w-10 h-10 rounded-full border-2 transition-all duration-200",
            color.bg,
            value === color.id ? "ring-2 ring-amber-500 ring-offset-2 ring-offset-zinc-900" : color.border,
            "hover:scale-110"
          )}
          title={color.label}
        />
      ))}
    </div>
  );
}
