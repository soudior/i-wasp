/**
 * Logo Upload Validator for Evolis Printing
 * Validates minimum dimensions (1000x1000px) and provides print quality feedback
 */

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Check,
  X,
  AlertTriangle,
  Image as ImageIcon,
  Loader2,
  Trash2,
  ZoomIn,
  FileImage,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Print quality requirements
const LOGO_REQUIREMENTS = {
  MIN_WIDTH: 1000,
  MIN_HEIGHT: 1000,
  RECOMMENDED_WIDTH: 1500,
  RECOMMENDED_HEIGHT: 1500,
  MAX_FILE_SIZE: 15 * 1024 * 1024, // 15MB
  ALLOWED_FORMATS: ["image/png", "image/jpeg", "image/svg+xml", "image/webp"],
  PRINT_DPI: 300,
};

interface LogoDimensions {
  width: number;
  height: number;
  aspectRatio: number;
}

interface ValidationResult {
  isValid: boolean;
  isPrintReady: boolean;
  isOptimal: boolean;
  messages: string[];
  warnings: string[];
}

interface LogoUploadValidatorProps {
  onLogoUploaded: (url: string, dimensions: LogoDimensions) => void;
  currentLogoUrl?: string;
  bucketName?: string;
  folderPath?: string;
}

export function LogoUploadValidator({
  onLogoUploaded,
  currentLogoUrl,
  bucketName = "card-assets",
  folderPath = "logos"
}: LogoUploadValidatorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentLogoUrl || null);
  const [dimensions, setDimensions] = useState<LogoDimensions | null>(null);
  const [validation, setValidation] = useState<ValidationResult | null>(null);

  // Validate image dimensions
  const validateImage = useCallback((file: File): Promise<{ dimensions: LogoDimensions; validation: ValidationResult }> => {
    return new Promise((resolve, reject) => {
      // Check file size
      if (file.size > LOGO_REQUIREMENTS.MAX_FILE_SIZE) {
        reject(new Error(`Fichier trop volumineux (max ${LOGO_REQUIREMENTS.MAX_FILE_SIZE / 1024 / 1024}MB)`));
        return;
      }

      // Check file format
      if (!LOGO_REQUIREMENTS.ALLOWED_FORMATS.includes(file.type)) {
        reject(new Error("Format non supporté. Utilisez PNG, JPEG, SVG ou WebP"));
        return;
      }

      // For SVG, we don't need dimension validation
      if (file.type === "image/svg+xml") {
        resolve({
          dimensions: { width: 9999, height: 9999, aspectRatio: 1 },
          validation: {
            isValid: true,
            isPrintReady: true,
            isOptimal: true,
            messages: ["Format vectoriel SVG - qualité optimale"],
            warnings: []
          }
        });
        return;
      }

      const img = new Image();
      img.onload = () => {
        const dims: LogoDimensions = {
          width: img.naturalWidth,
          height: img.naturalHeight,
          aspectRatio: img.naturalWidth / img.naturalHeight
        };

        const messages: string[] = [];
        const warnings: string[] = [];
        let isValid = true;
        let isPrintReady = true;
        let isOptimal = true;

        // Check minimum dimensions
        if (dims.width < LOGO_REQUIREMENTS.MIN_WIDTH || dims.height < LOGO_REQUIREMENTS.MIN_HEIGHT) {
          isValid = false;
          isPrintReady = false;
          isOptimal = false;
          messages.push(`Dimensions insuffisantes: ${dims.width}×${dims.height}px`);
          messages.push(`Minimum requis: ${LOGO_REQUIREMENTS.MIN_WIDTH}×${LOGO_REQUIREMENTS.MIN_HEIGHT}px`);
        } else {
          messages.push(`Dimensions: ${dims.width}×${dims.height}px ✓`);
        }

        // Check recommended dimensions
        if (isValid && (dims.width < LOGO_REQUIREMENTS.RECOMMENDED_WIDTH || dims.height < LOGO_REQUIREMENTS.RECOMMENDED_HEIGHT)) {
          isOptimal = false;
          warnings.push(`Pour une qualité optimale, utilisez ${LOGO_REQUIREMENTS.RECOMMENDED_WIDTH}×${LOGO_REQUIREMENTS.RECOMMENDED_HEIGHT}px`);
        }

        // Calculate print size at 300 DPI
        if (isValid) {
          const printWidthMM = (dims.width / LOGO_REQUIREMENTS.PRINT_DPI) * 25.4;
          const printHeightMM = (dims.height / LOGO_REQUIREMENTS.PRINT_DPI) * 25.4;
          messages.push(`Taille d'impression: ${printWidthMM.toFixed(1)}×${printHeightMM.toFixed(1)}mm @ 300 DPI`);
        }

        URL.revokeObjectURL(img.src);
        
        resolve({
          dimensions: dims,
          validation: { isValid, isPrintReady, isOptimal, messages, warnings }
        });
      };

      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        reject(new Error("Impossible de lire l'image"));
      };

      img.src = URL.createObjectURL(file);
    });
  }, []);

  // Handle file selection
  const handleFileSelect = useCallback(async (file: File) => {
    setIsValidating(true);
    setValidation(null);
    setPreviewUrl(null);

    try {
      const { dimensions: dims, validation: val } = await validateImage(file);
      
      setDimensions(dims);
      setValidation(val);
      setPreviewUrl(URL.createObjectURL(file));

      if (!val.isValid) {
        toast.error("Logo non conforme pour l'impression");
        return;
      }

      // Upload if valid
      setIsUploading(true);
      setUploadProgress(20);

      const fileExt = file.name.split('.').pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      const filePath = `${folderPath}/${fileName}`;

      setUploadProgress(40);

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      setUploadProgress(80);

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      setUploadProgress(100);
      
      onLogoUploaded(publicUrl, dims);
      toast.success("Logo uploadé et validé ✓");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Erreur upload logo");
      setPreviewUrl(null);
    } finally {
      setIsValidating(false);
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 500);
    }
  }, [validateImage, onLogoUploaded, bucketName, folderPath]);

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleRemove = useCallback(() => {
    setPreviewUrl(null);
    setDimensions(null);
    setValidation(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const getStatusColor = () => {
    if (!validation) return 'rgba(255, 199, 0, 0.3)';
    if (!validation.isValid) return 'rgba(239, 68, 68, 0.5)';
    if (!validation.isOptimal) return 'rgba(251, 191, 36, 0.5)';
    return 'rgba(34, 197, 94, 0.5)';
  };

  const getStatusIcon = () => {
    if (!validation) return <Upload size={24} />;
    if (!validation.isValid) return <X size={24} />;
    if (!validation.isOptimal) return <AlertTriangle size={24} />;
    return <Check size={24} />;
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="relative cursor-pointer transition-all duration-200"
        style={{
          border: `2px dashed ${isDragging ? '#FFC700' : getStatusColor()}`,
          borderRadius: '16px',
          backgroundColor: isDragging ? 'rgba(255, 199, 0, 0.05)' : 'rgba(255, 255, 255, 0.02)',
          minHeight: previewUrl ? 'auto' : '180px'
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={LOGO_REQUIREMENTS.ALLOWED_FORMATS.join(',')}
          onChange={handleInputChange}
          className="hidden"
        />

        <AnimatePresence mode="wait">
          {isValidating || isUploading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center p-8"
            >
              <Loader2 size={32} className="animate-spin mb-4" style={{ color: '#FFC700' }} />
              <p style={{ color: '#F5F5F5' }}>
                {isValidating ? 'Validation en cours...' : 'Upload en cours...'}
              </p>
              {isUploading && (
                <div className="w-full max-w-xs mt-4">
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}
            </motion.div>
          ) : previewUrl ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-4"
            >
              <div className="flex gap-4">
                {/* Preview Image */}
                <div 
                  className="relative w-32 h-32 rounded-xl overflow-hidden flex-shrink-0"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                >
                  <img
                    src={previewUrl}
                    alt="Logo preview"
                    className="w-full h-full object-contain"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove();
                    }}
                    className="absolute top-1 right-1 p-1.5 rounded-full transition-colors"
                    style={{ backgroundColor: 'rgba(239, 68, 68, 0.8)' }}
                  >
                    <Trash2 size={14} color="#FFFFFF" />
                  </button>
                </div>

                {/* Validation Info */}
                <div className="flex-1 space-y-2">
                  {/* Status Badge */}
                  <div 
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: validation?.isValid 
                        ? validation.isOptimal 
                          ? 'rgba(34, 197, 94, 0.15)' 
                          : 'rgba(251, 191, 36, 0.15)'
                        : 'rgba(239, 68, 68, 0.15)',
                      color: validation?.isValid
                        ? validation.isOptimal
                          ? '#22C55E'
                          : '#FBBF24'
                        : '#EF4444'
                    }}
                  >
                    {getStatusIcon()}
                    <span>
                      {validation?.isValid
                        ? validation.isOptimal
                          ? 'Qualité optimale'
                          : 'Qualité acceptable'
                        : 'Non conforme'}
                    </span>
                  </div>

                  {/* Messages */}
                  {validation && (
                    <div className="space-y-1">
                      {validation.messages.map((msg, i) => (
                        <p 
                          key={i} 
                          className="text-xs"
                          style={{ 
                            color: validation.isValid 
                              ? 'rgba(245, 245, 245, 0.7)' 
                              : 'rgba(239, 68, 68, 0.9)'
                          }}
                        >
                          {msg}
                        </p>
                      ))}
                      {validation.warnings.map((warn, i) => (
                        <p 
                          key={`w-${i}`} 
                          className="text-xs flex items-center gap-1"
                          style={{ color: '#FBBF24' }}
                        >
                          <AlertTriangle size={12} />
                          {warn}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center p-8 text-center"
            >
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ backgroundColor: 'rgba(255, 199, 0, 0.1)' }}
              >
                <FileImage size={28} style={{ color: '#FFC700' }} />
              </div>
              <p 
                className="font-medium mb-1"
                style={{ color: '#F5F5F5' }}
              >
                Glissez votre logo ici
              </p>
              <p 
                className="text-sm mb-4"
                style={{ color: 'rgba(245, 245, 245, 0.5)' }}
              >
                ou cliquez pour sélectionner
              </p>
              <div 
                className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full"
                style={{ 
                  backgroundColor: 'rgba(255, 199, 0, 0.1)',
                  color: '#FFC700'
                }}
              >
                <Sparkles size={12} />
                Minimum 1000×1000px pour impression HD
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Requirements Info */}
      <div 
        className="rounded-xl p-4"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
      >
        <p 
          className="text-xs font-medium mb-2"
          style={{ color: 'rgba(245, 245, 245, 0.6)' }}
        >
          Exigences pour impression Evolis
        </p>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Check size={14} style={{ color: '#22C55E' }} />
            <span style={{ color: 'rgba(245, 245, 245, 0.7)' }}>
              Min. {LOGO_REQUIREMENTS.MIN_WIDTH}×{LOGO_REQUIREMENTS.MIN_HEIGHT}px
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Check size={14} style={{ color: '#22C55E' }} />
            <span style={{ color: 'rgba(245, 245, 245, 0.7)' }}>
              PNG, JPEG, SVG, WebP
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles size={14} style={{ color: '#FFC700' }} />
            <span style={{ color: 'rgba(245, 245, 245, 0.7)' }}>
              Idéal: {LOGO_REQUIREMENTS.RECOMMENDED_WIDTH}×{LOGO_REQUIREMENTS.RECOMMENDED_HEIGHT}px
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ZoomIn size={14} style={{ color: '#FFC700' }} />
            <span style={{ color: 'rgba(245, 245, 245, 0.7)' }}>
              Résolution: 300 DPI
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogoUploadValidator;
