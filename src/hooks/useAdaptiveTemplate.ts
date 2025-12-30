/**
 * useAdaptiveTemplate - Hook for IWASP Adaptive Templates Engine
 * 
 * Provides reactive template generation based on:
 * - Client logo (color extraction)
 * - Business sector
 */

import { useState, useEffect, useCallback } from "react";
import {
  BusinessSector,
  ColorPalette,
  AdaptiveTemplate,
  extractColorsFromLogo,
  getModulesForSector,
  generateAdaptiveTemplate,
} from "@/lib/adaptiveTemplateEngine";

interface UseAdaptiveTemplateOptions {
  logoUrl?: string | null;
  sector?: BusinessSector;
  autoGenerate?: boolean;
}

interface UseAdaptiveTemplateReturn {
  template: AdaptiveTemplate | null;
  palette: ColorPalette | null;
  isLoading: boolean;
  error: string | null;
  generate: (logoUrl?: string | null, sector?: BusinessSector) => Promise<void>;
  setPalette: (palette: ColorPalette) => void;
}

export function useAdaptiveTemplate(
  options: UseAdaptiveTemplateOptions = {}
): UseAdaptiveTemplateReturn {
  const { logoUrl, sector = "business", autoGenerate = false } = options;
  
  const [template, setTemplate] = useState<AdaptiveTemplate | null>(null);
  const [palette, setPaletteState] = useState<ColorPalette | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (
    overrideLogoUrl?: string | null,
    overrideSector?: BusinessSector
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const finalLogoUrl = overrideLogoUrl !== undefined ? overrideLogoUrl : logoUrl;
      const finalSector = overrideSector || sector;
      
      const result = await generateAdaptiveTemplate(finalLogoUrl || null, finalSector);
      
      setTemplate(result);
      setPaletteState(result.palette);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur de génération";
      setError(message);
      console.error("Template generation error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [logoUrl, sector]);

  // Auto-generate on mount if enabled
  useEffect(() => {
    if (autoGenerate) {
      generate();
    }
  }, [autoGenerate, generate]);

  const setPalette = useCallback((newPalette: ColorPalette) => {
    setPaletteState(newPalette);
    if (template) {
      setTemplate({ ...template, palette: newPalette });
    }
  }, [template]);

  return {
    template,
    palette,
    isLoading,
    error,
    generate,
    setPalette,
  };
}
