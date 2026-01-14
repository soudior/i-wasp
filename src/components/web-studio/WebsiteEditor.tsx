/**
 * WebsiteEditor - Éditeur visuel professionnel pour personnaliser les sites générés
 * Interface en panneau latéral avec preview en temps réel
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Type, Palette, Image as ImageIcon, Save, Eye, Undo, Redo, 
  ChevronLeft, ChevronRight, Monitor, Smartphone, 
  Loader2, ExternalLink, Sparkles, Upload, Trash2, RefreshCw, Wand2,
  Layers, History, Clock, RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface WebsiteCustomizations {
  texts: Record<string, string>;
  colors: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    text?: string;
  };
  images: Record<string, string>;
}

interface DetectedImage {
  index: number;
  src: string;
  alt: string;
  label: string;
  isPlaceholder: boolean;
}

interface WebsiteEditorProps {
  websiteId: string;
  initialHtml: string;
  originalColors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    text?: string;
  };
  slug: string;
  previewUrl: string;
  onClose: () => void;
  onSave: () => void;
}

export function WebsiteEditor({ 
  websiteId, 
  initialHtml, 
  originalColors,
  slug,
  previewUrl,
  onClose, 
  onSave 
}: WebsiteEditorProps) {
  const [html, setHtml] = useState(initialHtml);
  const [customizations, setCustomizations] = useState<WebsiteCustomizations>({
    texts: {},
    colors: originalColors || {},
    images: {}
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("styles");
  const [history, setHistory] = useState<WebsiteCustomizations[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [uploadingImageIndex, setUploadingImageIndex] = useState<number | null>(null);
  const [generatingImageIndex, setGeneratingImageIndex] = useState<number | null>(null);
  const [regeneratingTextId, setRegeneratingTextId] = useState<string | null>(null);
  const [aiPromptDialog, setAiPromptDialog] = useState<{ open: boolean; imageIndex: number | null }>({ open: false, imageIndex: null });
  const [textAiDialog, setTextAiDialog] = useState<{ open: boolean; textId: string | null; originalText: string; type: string }>({ open: false, textId: null, originalText: "", type: "" });
  const [aiPrompt, setAiPrompt] = useState("");
  const [textInstruction, setTextInstruction] = useState("");
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [versions, setVersions] = useState<Array<{
    id: string;
    version_number: number;
    created_at: string;
    label: string | null;
    is_auto_save: boolean;
  }>>([]);
  const [loadingVersions, setLoadingVersions] = useState(false);
  const [restoringVersion, setRestoringVersion] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  // Extract editable texts from HTML
  const [editableTexts, setEditableTexts] = useState<Array<{ id: string; label: string; value: string; type: string }>>([]);
  const [detectedImages, setDetectedImages] = useState<DetectedImage[]>([]);

  useEffect(() => {
    extractEditableContent();
  }, [initialHtml]);

  const extractEditableContent = () => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(initialHtml, "text/html");
    
    // Extract texts
    const texts: Array<{ id: string; label: string; value: string; type: string }> = [];
    
    doc.querySelectorAll("h1, h2, h3").forEach((el, index) => {
      const tag = el.tagName.toLowerCase();
      texts.push({
        id: `${tag}-${index}`,
        label: `${tag === "h1" ? "Titre principal" : tag === "h2" ? "Sous-titre" : "Section"} ${index + 1}`,
        value: el.textContent?.trim() || "",
        type: "heading"
      });
    });

    doc.querySelectorAll("p").forEach((el, index) => {
      const text = el.textContent?.trim() || "";
      if (text.length > 20 && text.length < 500) {
        texts.push({
          id: `p-${index}`,
          label: `Paragraphe ${index + 1}`,
          value: text,
          type: "paragraph"
        });
      }
    });

    doc.querySelectorAll("button, .btn, a.button, [class*='btn']").forEach((el, index) => {
      const text = el.textContent?.trim() || "";
      if (text.length > 0 && text.length < 50) {
        texts.push({
          id: `btn-${index}`,
          label: `Bouton ${index + 1}`,
          value: text,
          type: "button"
        });
      }
    });

    setEditableTexts(texts);

    // Extract images
    const images: DetectedImage[] = [];
    doc.querySelectorAll("img").forEach((img, index) => {
      const src = img.getAttribute("src") || "";
      const alt = img.getAttribute("alt") || "";
      
      // Determine if it's a placeholder
      const isPlaceholder = 
        src.includes("picsum.photos") || 
        src.includes("placehold") ||
        src.includes("placeholder") ||
        src.includes("unsplash") ||
        src.includes("lorem") ||
        !src.startsWith("http");

      // Create a label based on context
      let label = `Image ${index + 1}`;
      const parentSection = img.closest("section, header, footer, .hero, .about, .services, .contact");
      if (parentSection) {
        const sectionClass = parentSection.className || "";
        if (sectionClass.includes("hero") || sectionClass.includes("header")) {
          label = `Image Hero ${index + 1}`;
        } else if (sectionClass.includes("about")) {
          label = `Image À propos ${index + 1}`;
        } else if (sectionClass.includes("service")) {
          label = `Image Service ${index + 1}`;
        } else if (sectionClass.includes("team")) {
          label = `Photo équipe ${index + 1}`;
        } else if (sectionClass.includes("gallery") || sectionClass.includes("portfolio")) {
          label = `Galerie ${index + 1}`;
        }
      }

      if (alt) {
        label = alt.substring(0, 30) + (alt.length > 30 ? "..." : "");
      }

      images.push({
        index,
        src,
        alt,
        label,
        isPlaceholder
      });
    });

    setDetectedImages(images);
  };

  const updateCustomization = useCallback((
    type: "texts" | "colors" | "images",
    key: string,
    value: string
  ) => {
    setCustomizations(prev => {
      const updated = {
        ...prev,
        [type]: {
          ...prev[type],
          [key]: value
        }
      };
      
      setHistory(h => [...h.slice(0, historyIndex + 1), updated]);
      setHistoryIndex(i => i + 1);
      
      return updated;
    });
  }, [historyIndex]);

  const removeImageCustomization = useCallback((key: string) => {
    setCustomizations(prev => {
      const newImages = { ...prev.images };
      delete newImages[key];
      
      const updated = {
        ...prev,
        images: newImages
      };
      
      setHistory(h => [...h.slice(0, historyIndex + 1), updated]);
      setHistoryIndex(i => i + 1);
      
      return updated;
    });
  }, [historyIndex]);

  const handleImageUpload = async (index: number, file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner une image");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 5 Mo");
      return;
    }

    setUploadingImageIndex(index);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${websiteId}/${Date.now()}-${index}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from("website-images")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from("website-images")
        .getPublicUrl(data.path);

      updateCustomization("images", index.toString(), publicUrl);
      toast.success("Image uploadée avec succès");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Erreur lors de l'upload de l'image");
    } finally {
      setUploadingImageIndex(null);
    }
  };

  const handleAiImageGenerate = async (index: number) => {
    if (!aiPrompt.trim()) {
      toast.error("Veuillez décrire l'image souhaitée");
      return;
    }

    setAiPromptDialog({ open: false, imageIndex: null });
    setGeneratingImageIndex(index);

    try {
      const { data, error } = await supabase.functions.invoke("generate-image", {
        body: { 
          prompt: aiPrompt,
          aspectRatio: "16:9"
        }
      });

      if (error) throw error;
      
      if (!data?.image) {
        throw new Error("Aucune image générée");
      }

      // The image is returned as base64, we need to upload it to storage
      const base64Data = data.image;
      
      // Convert base64 to blob
      const response = await fetch(base64Data);
      const blob = await response.blob();
      
      // Upload to storage
      const fileName = `${websiteId}/${Date.now()}-ai-${index}.png`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("website-images")
        .upload(fileName, blob, {
          cacheControl: "3600",
          upsert: true,
          contentType: "image/png"
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("website-images")
        .getPublicUrl(uploadData.path);

      updateCustomization("images", index.toString(), publicUrl);
      setAiPrompt("");
      toast.success("Image générée et appliquée avec succès !");
    } catch (error) {
      console.error("AI image generation error:", error);
      toast.error("Erreur lors de la génération de l'image");
    } finally {
      setGeneratingImageIndex(null);
    }
  };

  const handleTextRegenerate = async (textId: string, originalText: string, type: string, instruction?: string) => {
    setTextAiDialog({ open: false, textId: null, originalText: "", type: "" });
    setRegeneratingTextId(textId);

    try {
      const { data, error } = await supabase.functions.invoke("regenerate-text", {
        body: { 
          originalText,
          type,
          instruction: instruction || textInstruction
        }
      });

      if (error) throw error;
      
      if (!data?.text) {
        throw new Error("Aucun texte généré");
      }

      updateCustomization("texts", textId, data.text);
      setTextInstruction("");
      toast.success("Texte régénéré avec succès !");
    } catch (error) {
      console.error("Text regeneration error:", error);
      toast.error("Erreur lors de la régénération du texte");
    } finally {
      setRegeneratingTextId(null);
    }
  };

  const handleQuickRegenerate = async (textId: string, originalText: string, type: string) => {
    setRegeneratingTextId(textId);

    try {
      const { data, error } = await supabase.functions.invoke("regenerate-text", {
        body: { originalText, type }
      });

      if (error) throw error;
      
      if (!data?.text) {
        throw new Error("Aucun texte généré");
      }

      updateCustomization("texts", textId, data.text);
      toast.success("Texte régénéré !");
    } catch (error) {
      console.error("Text regeneration error:", error);
      toast.error("Erreur lors de la régénération");
    } finally {
      setRegeneratingTextId(null);
    }
  };

  const applyCustomizationsToHtml = useCallback((baseHtml: string, customs: WebsiteCustomizations): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(baseHtml, "text/html");

    // Apply text changes
    Object.entries(customs.texts).forEach(([id, newValue]) => {
      const [tag, indexStr] = id.split("-");
      const index = parseInt(indexStr, 10);
      const elements = doc.querySelectorAll(tag === "btn" ? "button, .btn, a.button, [class*='btn']" : tag);
      if (elements[index]) {
        elements[index].textContent = newValue;
      }
    });

    // Apply color changes via CSS variables
    if (Object.keys(customs.colors).length > 0) {
      const styleEl = doc.createElement("style");
      styleEl.id = "iwasp-custom-styles";
      styleEl.textContent = `
        :root {
          ${customs.colors.primary ? `--primary-color: ${customs.colors.primary};` : ""}
          ${customs.colors.secondary ? `--secondary-color: ${customs.colors.secondary};` : ""}
          ${customs.colors.accent ? `--accent-color: ${customs.colors.accent};` : ""}
          ${customs.colors.background ? `--bg-color: ${customs.colors.background};` : ""}
          ${customs.colors.text ? `--text-color: ${customs.colors.text};` : ""}
        }
        ${customs.colors.primary ? `
        [style*="background"][style*="#"], 
        .btn, button, [class*="btn-primary"],
        a[class*="btn"] {
          background-color: ${customs.colors.primary} !important;
        }
        ` : ""}
        ${customs.colors.background ? `
        body, .container, main, section {
          background-color: ${customs.colors.background} !important;
        }
        ` : ""}
        ${customs.colors.text ? `
        body, p, span, li {
          color: ${customs.colors.text} !important;
        }
        ` : ""}
        ${customs.colors.accent ? `
        a:not(.btn):not([class*="btn"]), 
        [class*="accent"], [class*="highlight"] {
          color: ${customs.colors.accent} !important;
        }
        ` : ""}
      `;
      
      // Remove existing custom styles
      const existingStyle = doc.getElementById("iwasp-custom-styles");
      if (existingStyle) existingStyle.remove();
      
      doc.head.appendChild(styleEl);
    }

    // Apply image changes
    const images = doc.querySelectorAll("img");
    Object.entries(customs.images).forEach(([indexStr, newSrc]) => {
      const index = parseInt(indexStr, 10);
      if (images[index]) {
        images[index].setAttribute("src", newSrc);
      }
    });

    return "<!DOCTYPE html>" + doc.documentElement.outerHTML;
  }, []);

  // Update preview when customizations change
  useEffect(() => {
    const updatedHtml = applyCustomizationsToHtml(initialHtml, customizations);
    setHtml(updatedHtml);
  }, [customizations, initialHtml, applyCustomizationsToHtml]);

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCustomizations(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCustomizations(history[historyIndex + 1]);
    }
  };

  // Fetch version history
  const fetchVersions = async () => {
    setLoadingVersions(true);
    try {
      const { data, error } = await supabase
        .from("website_versions")
        .select("id, version_number, created_at, label, is_auto_save")
        .eq("website_id", websiteId)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      setVersions(data || []);
    } catch (error) {
      console.error("Error fetching versions:", error);
      toast.error("Erreur lors du chargement des versions");
    } finally {
      setLoadingVersions(false);
    }
  };

  // Save version before making changes
  const saveVersion = async (label?: string) => {
    try {
      const finalHtml = applyCustomizationsToHtml(initialHtml, customizations);
      
      // Get current version count
      const { count } = await supabase
        .from("website_versions")
        .select("*", { count: "exact", head: true })
        .eq("website_id", websiteId);

      await supabase
        .from("website_versions")
        .insert({
          website_id: websiteId,
          version_number: (count || 0) + 1,
          full_page_html: finalHtml,
          customizations: JSON.parse(JSON.stringify(customizations)),
          label: label || null,
          is_auto_save: !label
        });
    } catch (error) {
      console.error("Error saving version:", error);
    }
  };

  // Restore a version
  const restoreVersion = async (versionId: string) => {
    setRestoringVersion(versionId);
    try {
      const { data, error } = await supabase
        .from("website_versions")
        .select("full_page_html, customizations")
        .eq("id", versionId)
        .single();

      if (error) throw error;

      if (data) {
        // Save current state before restoring
        await saveVersion("Avant restauration");

        // Restore the version
        const { error: updateError } = await supabase
          .from("generated_websites")
          .update({
            full_page_html: data.full_page_html,
            customizations: data.customizations,
            updated_at: new Date().toISOString()
          })
          .eq("id", websiteId);

        if (updateError) throw updateError;

        // Update local state
        const rawCustomizations = data.customizations as Record<string, unknown> | null;
        const restoredCustomizations: WebsiteCustomizations = {
          texts: (rawCustomizations?.texts as Record<string, string>) || {},
          colors: (rawCustomizations?.colors as WebsiteCustomizations["colors"]) || {},
          images: (rawCustomizations?.images as Record<string, string>) || {}
        };
        setCustomizations(restoredCustomizations);
        setHtml(data.full_page_html);
        
        setShowVersionHistory(false);
        toast.success("Version restaurée avec succès !");
        onSave();
      }
    } catch (error) {
      console.error("Error restoring version:", error);
      toast.error("Erreur lors de la restauration");
    } finally {
      setRestoringVersion(null);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save current version before updating
      await saveVersion();

      const finalHtml = applyCustomizationsToHtml(initialHtml, customizations);
      
      const { error } = await supabase
        .from("generated_websites")
        .update({
          full_page_html: finalHtml,
          customizations: JSON.parse(JSON.stringify(customizations)),
          updated_at: new Date().toISOString()
        })
        .eq("id", websiteId);

      if (error) throw error;
      
      toast.success("Modifications enregistrées");
      onSave();
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const finalHtml = applyCustomizationsToHtml(initialHtml, customizations);
      
      const { error } = await supabase
        .from("generated_websites")
        .update({
          full_page_html: finalHtml,
          customizations: JSON.parse(JSON.stringify(customizations)),
          is_published: true,
          published_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq("id", websiteId);

      if (error) throw error;
      
      toast.success("Site publié avec succès !");
      window.open(previewUrl, "_blank");
      onSave();
    } catch (error) {
      console.error("Publish error:", error);
      toast.error("Erreur lors de la publication");
    } finally {
      setIsPublishing(false);
    }
  };

  const colorOptions = [
    { key: "primary", label: "Couleur principale", description: "Boutons, liens" },
    { key: "secondary", label: "Couleur secondaire", description: "Arrière-plans" },
    { key: "accent", label: "Couleur d'accent", description: "Éléments mis en avant" },
    { key: "background", label: "Fond de page", description: "Arrière-plan global" },
    { key: "text", label: "Couleur du texte", description: "Texte principal" },
  ];

  const styleTemplates = [
    {
      id: "moderne",
      name: "Moderne",
      description: "Design épuré et contemporain",
      colors: {
        primary: "#007AFF",
        secondary: "#5856D6",
        accent: "#00C7BE",
        background: "#FFFFFF",
        text: "#1D1D1F"
      },
      preview: ["#007AFF", "#5856D6", "#00C7BE", "#FFFFFF", "#1D1D1F"]
    },
    {
      id: "classique",
      name: "Classique",
      description: "Élégance intemporelle",
      colors: {
        primary: "#8B4513",
        secondary: "#D2691E",
        accent: "#DAA520",
        background: "#FDF5E6",
        text: "#2F2F2F"
      },
      preview: ["#8B4513", "#D2691E", "#DAA520", "#FDF5E6", "#2F2F2F"]
    },
    {
      id: "minimaliste",
      name: "Minimaliste",
      description: "Simplicité et clarté",
      colors: {
        primary: "#000000",
        secondary: "#6B7280",
        accent: "#374151",
        background: "#FAFAFA",
        text: "#111827"
      },
      preview: ["#000000", "#6B7280", "#374151", "#FAFAFA", "#111827"]
    },
    {
      id: "colore",
      name: "Coloré",
      description: "Vif et dynamique",
      colors: {
        primary: "#FF6B6B",
        secondary: "#4ECDC4",
        accent: "#FFE66D",
        background: "#FFFFFF",
        text: "#2D3436"
      },
      preview: ["#FF6B6B", "#4ECDC4", "#FFE66D", "#FFFFFF", "#2D3436"]
    },
    {
      id: "sombre",
      name: "Sombre",
      description: "Mode nuit premium",
      colors: {
        primary: "#6366F1",
        secondary: "#8B5CF6",
        accent: "#EC4899",
        background: "#0F172A",
        text: "#F1F5F9"
      },
      preview: ["#6366F1", "#8B5CF6", "#EC4899", "#0F172A", "#F1F5F9"]
    },
    {
      id: "nature",
      name: "Nature",
      description: "Tons naturels apaisants",
      colors: {
        primary: "#059669",
        secondary: "#10B981",
        accent: "#34D399",
        background: "#F0FDF4",
        text: "#064E3B"
      },
      preview: ["#059669", "#10B981", "#34D399", "#F0FDF4", "#064E3B"]
    },
    {
      id: "luxe",
      name: "Luxe",
      description: "Sophistication haut de gamme",
      colors: {
        primary: "#B8860B",
        secondary: "#1A1A2E",
        accent: "#D4AF37",
        background: "#0D0D0D",
        text: "#E8E8E8"
      },
      preview: ["#B8860B", "#1A1A2E", "#D4AF37", "#0D0D0D", "#E8E8E8"]
    },
    {
      id: "ocean",
      name: "Océan",
      description: "Fraîcheur marine",
      colors: {
        primary: "#0077B6",
        secondary: "#00B4D8",
        accent: "#90E0EF",
        background: "#CAF0F8",
        text: "#03045E"
      },
      preview: ["#0077B6", "#00B4D8", "#90E0EF", "#CAF0F8", "#03045E"]
    }
  ];

  const applyStyleTemplate = (templateId: string) => {
    const template = styleTemplates.find(t => t.id === templateId);
    if (!template) return;

    setCustomizations(prev => {
      const updated = {
        ...prev,
        colors: { ...template.colors }
      };
      
      setHistory(h => [...h.slice(0, historyIndex + 1), updated]);
      setHistoryIndex(i => i + 1);
      
      return updated;
    });

    toast.success(`Style "${template.name}" appliqué`);
  };

  const getDisplayedImageSrc = (img: DetectedImage) => {
    return customizations.images[img.index.toString()] || img.src;
  };

  const isImageCustomized = (index: number) => {
    return !!customizations.images[index.toString()];
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
    >
      <div className="h-full flex">
        {/* Panel latéral */}
        <AnimatePresence mode="wait">
          {!panelCollapsed && (
            <motion.div
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="w-80 h-full bg-[#1D1D1F] border-r border-white/10 flex flex-col"
            >
              {/* Header */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-white font-semibold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#007AFF]" />
                    Éditeur
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="text-white/60 hover:text-white hover:bg-white/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Undo/Redo + History */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={undo}
                    disabled={historyIndex <= 0}
                    className="flex-1 bg-white/5 border-white/10 text-white/60 hover:text-white"
                  >
                    <Undo className="w-3 h-3 mr-1" />
                    Annuler
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={redo}
                    disabled={historyIndex >= history.length - 1}
                    className="flex-1 bg-white/5 border-white/10 text-white/60 hover:text-white"
                  >
                    <Redo className="w-3 h-3 mr-1" />
                    Rétablir
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowVersionHistory(true);
                      fetchVersions();
                    }}
                    className="bg-white/5 border-white/10 text-white/60 hover:text-white"
                    title="Historique des versions"
                  >
                    <History className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                <TabsList className="w-full grid grid-cols-4 p-1 m-2 bg-white/5 rounded-lg">
                  <TabsTrigger value="styles" className="data-[state=active]:bg-[#007AFF] data-[state=active]:text-white text-white/60 text-xs">
                    <Layers className="w-3 h-3 mr-1" />
                    Styles
                  </TabsTrigger>
                  <TabsTrigger value="texts" className="data-[state=active]:bg-[#007AFF] data-[state=active]:text-white text-white/60 text-xs">
                    <Type className="w-3 h-3 mr-1" />
                    Textes
                  </TabsTrigger>
                  <TabsTrigger value="colors" className="data-[state=active]:bg-[#007AFF] data-[state=active]:text-white text-white/60 text-xs">
                    <Palette className="w-3 h-3 mr-1" />
                    Couleurs
                  </TabsTrigger>
                  <TabsTrigger value="images" className="data-[state=active]:bg-[#007AFF] data-[state=active]:text-white text-white/60 text-xs">
                    <ImageIcon className="w-3 h-3 mr-1" />
                    Images
                  </TabsTrigger>
                </TabsList>

                <ScrollArea className="flex-1 px-4">
                  {/* Styles prédéfinis */}
                  <TabsContent value="styles" className="mt-0 space-y-3 pb-4">
                    <p className="text-white/60 text-xs mb-3">
                      Appliquez un style prédéfini en un clic
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {styleTemplates.map((template) => (
                        <button
                          key={template.id}
                          onClick={() => applyStyleTemplate(template.id)}
                          className="group p-3 rounded-xl bg-white/5 border border-white/10 hover:border-[#007AFF]/50 hover:bg-white/10 transition-all text-left"
                        >
                          {/* Color preview */}
                          <div className="flex gap-1 mb-2">
                            {template.preview.map((color, i) => (
                              <div
                                key={i}
                                className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                          <h4 className="text-white text-xs font-medium group-hover:text-[#007AFF] transition-colors">
                            {template.name}
                          </h4>
                          <p className="text-white/40 text-[10px] leading-tight mt-0.5">
                            {template.description}
                          </p>
                        </button>
                      ))}
                    </div>
                    
                    <div className="pt-3 border-t border-white/10 mt-4">
                      <p className="text-white/40 text-[10px] text-center">
                        💡 Utilisez l'onglet "Couleurs" pour personnaliser davantage
                      </p>
                    </div>
                  </TabsContent>

                  {/* Textes */}
                  <TabsContent value="texts" className="mt-0 space-y-4 pb-4">
                    {editableTexts.map((item) => (
                      <div key={item.id} className="space-y-2 p-3 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex items-center justify-between">
                          <Label className="text-white/80 text-xs flex items-center gap-2">
                            {item.label}
                            {customizations.texts[item.id] && (
                              <span className="px-1.5 py-0.5 text-[10px] bg-green-500/20 text-green-400 rounded">
                                Modifié
                              </span>
                            )}
                          </Label>
                          <span className="text-[10px] text-white/30 capitalize">{item.type}</span>
                        </div>
                        
                        {item.type === "paragraph" ? (
                          <Textarea
                            value={customizations.texts[item.id] ?? item.value}
                            onChange={(e) => updateCustomization("texts", item.id, e.target.value)}
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/40 text-sm min-h-[80px]"
                          />
                        ) : (
                          <Input
                            value={customizations.texts[item.id] ?? item.value}
                            onChange={(e) => updateCustomization("texts", item.id, e.target.value)}
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/40 text-sm"
                          />
                        )}
                        
                        {/* AI regeneration buttons */}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleQuickRegenerate(
                              item.id, 
                              customizations.texts[item.id] ?? item.value,
                              item.type
                            )}
                            disabled={regeneratingTextId === item.id}
                            className="flex-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-500/30 text-purple-300 hover:text-white hover:border-purple-500/50 text-xs"
                          >
                            {regeneratingTextId === item.id ? (
                              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                            ) : (
                              <Wand2 className="w-3 h-3 mr-1" />
                            )}
                            Réécrire
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setTextInstruction("");
                              setTextAiDialog({
                                open: true,
                                textId: item.id,
                                originalText: customizations.texts[item.id] ?? item.value,
                                type: item.type
                              });
                            }}
                            disabled={regeneratingTextId === item.id}
                            className="text-white/40 hover:text-white hover:bg-white/10"
                            title="Personnaliser la réécriture"
                          >
                            <Sparkles className="w-3 h-3" />
                          </Button>
                          {customizations.texts[item.id] && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                const newTexts = { ...customizations.texts };
                                delete newTexts[item.id];
                                setCustomizations(prev => ({ ...prev, texts: newTexts }));
                              }}
                              className="text-white/40 hover:text-red-400 hover:bg-red-500/10"
                              title="Rétablir le texte original"
                            >
                              <RefreshCw className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    {editableTexts.length === 0 && (
                      <p className="text-white/40 text-sm text-center py-8">
                        Aucun texte éditable détecté
                      </p>
                    )}
                  </TabsContent>

                  {/* Couleurs */}
                  <TabsContent value="colors" className="mt-0 space-y-4 pb-4">
                    {colorOptions.map((color) => (
                      <div key={color.key} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-white/80 text-xs">{color.label}</Label>
                            <p className="text-white/40 text-[10px]">{color.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-8 h-8 rounded-lg border border-white/20 shadow-inner"
                              style={{ 
                                backgroundColor: customizations.colors[color.key as keyof typeof customizations.colors] || 
                                  originalColors?.[color.key as keyof typeof originalColors] || "#007AFF" 
                              }}
                            />
                            <Input
                              type="color"
                              value={customizations.colors[color.key as keyof typeof customizations.colors] || 
                                originalColors?.[color.key as keyof typeof originalColors] || "#007AFF"}
                              onChange={(e) => updateCustomization("colors", color.key, e.target.value)}
                              className="w-10 h-8 p-0 border-0 bg-transparent cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  {/* Images */}
                  <TabsContent value="images" className="mt-0 space-y-4 pb-4">
                    {detectedImages.length > 0 ? (
                      <>
                        <p className="text-white/60 text-xs mb-3">
                          {detectedImages.length} image{detectedImages.length > 1 ? "s" : ""} détectée{detectedImages.length > 1 ? "s" : ""}
                        </p>
                        {detectedImages.map((img) => (
                          <div 
                            key={img.index} 
                            className="space-y-2 p-3 rounded-lg bg-white/5 border border-white/10"
                          >
                            <div className="flex items-center justify-between">
                              <Label className="text-white/80 text-xs flex items-center gap-2">
                                {img.label}
                                {img.isPlaceholder && (
                                  <span className="px-1.5 py-0.5 text-[10px] bg-amber-500/20 text-amber-400 rounded">
                                    Placeholder
                                  </span>
                                )}
                                {isImageCustomized(img.index) && (
                                  <span className="px-1.5 py-0.5 text-[10px] bg-green-500/20 text-green-400 rounded">
                                    Modifié
                                  </span>
                                )}
                              </Label>
                            </div>
                            
                            {/* Image preview */}
                            <div className="relative aspect-video rounded-lg overflow-hidden bg-black/20">
                              <img
                                src={getDisplayedImageSrc(img)}
                                alt={img.alt}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "https://placehold.co/400x300/1D1D1F/8E8E93?text=Image";
                                }}
                              />
                              
                              {(uploadingImageIndex === img.index || generatingImageIndex === img.index) && (
                                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2">
                                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                                  {generatingImageIndex === img.index && (
                                    <span className="text-white/80 text-xs">Génération IA...</span>
                                  )}
                                </div>
                              )}
                            </div>
                            
                            {/* Upload & AI controls */}
                            <div className="flex gap-2">
                              <input
                                type="file"
                                accept="image/*"
                                ref={(el) => { fileInputRefs.current[img.index] = el; }}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleImageUpload(img.index, file);
                                }}
                                className="hidden"
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => fileInputRefs.current[img.index]?.click()}
                                disabled={uploadingImageIndex === img.index || generatingImageIndex === img.index}
                                className="flex-1 bg-white/5 border-white/10 text-white/60 hover:text-white text-xs"
                              >
                                <Upload className="w-3 h-3 mr-1" />
                                Upload
                              </Button>
                              
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setAiPrompt(img.alt || img.label);
                                  setAiPromptDialog({ open: true, imageIndex: img.index });
                                }}
                                disabled={uploadingImageIndex === img.index || generatingImageIndex === img.index}
                                className="flex-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-500/30 text-purple-300 hover:text-white hover:border-purple-500/50 text-xs"
                              >
                                <Wand2 className="w-3 h-3 mr-1" />
                                IA
                              </Button>
                              
                              {isImageCustomized(img.index) && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => removeImageCustomization(img.index.toString())}
                                  className="text-white/40 hover:text-red-400 hover:bg-red-500/10"
                                  title="Rétablir l'image originale"
                                >
                                  <RefreshCw className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </>
                    ) : (
                      <p className="text-white/40 text-sm text-center py-8">
                        Aucune image détectée
                      </p>
                    )}
                  </TabsContent>
                </ScrollArea>
              </Tabs>

              {/* Actions */}
              <div className="p-4 border-t border-white/10 space-y-2">
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full bg-white/10 hover:bg-white/20 text-white"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Enregistrer le brouillon
                </Button>
                <Button
                  onClick={handlePublish}
                  disabled={isPublishing}
                  className="w-full bg-[#007AFF] hover:bg-[#0056CC] text-white"
                >
                  {isPublishing ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <ExternalLink className="w-4 h-4 mr-2" />
                  )}
                  Publier le site
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle panel button */}
        <button
          onClick={() => setPanelCollapsed(!panelCollapsed)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#1D1D1F] text-white/60 hover:text-white p-2 rounded-r-lg border border-l-0 border-white/10 transition-all"
          style={{ left: panelCollapsed ? 0 : 320 }}
        >
          {panelCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Preview area */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="h-14 bg-[#2D2D2F] border-b border-white/10 flex items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <span className="text-white/60 text-sm">{slug}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="bg-white/5 rounded-lg p-1 flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode("desktop")}
                  className={`${viewMode === "desktop" ? "bg-white/10 text-white" : "text-white/40"}`}
                >
                  <Monitor className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode("mobile")}
                  className={`${viewMode === "mobile" ? "bg-white/10 text-white" : "text-white/40"}`}
                >
                  <Smartphone className="w-4 h-4" />
                </Button>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(previewUrl, "_blank")}
                className="text-white/60 hover:text-white"
              >
                <Eye className="w-4 h-4 mr-1" />
                Aperçu
              </Button>
            </div>
          </div>

          {/* iframe preview */}
          <div className="flex-1 bg-[#1A1A1A] flex items-center justify-center p-6 overflow-hidden">
            <motion.div
              animate={{
                width: viewMode === "mobile" ? 375 : "100%",
                maxWidth: viewMode === "mobile" ? 375 : 1200,
              }}
              transition={{ type: "spring", damping: 20 }}
              className="h-full bg-white rounded-xl overflow-hidden shadow-2xl"
            >
              <iframe
                ref={iframeRef}
                srcDoc={html}
                className="w-full h-full border-0"
                title="Website preview"
                sandbox="allow-scripts allow-same-origin"
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* AI Image Generation Dialog */}
      <Dialog open={aiPromptDialog.open} onOpenChange={(open) => setAiPromptDialog({ open, imageIndex: open ? aiPromptDialog.imageIndex : null })}>
        <DialogContent className="bg-[#1D1D1F] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-purple-400" />
              Générer une image par IA
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-white/80">Décrivez l'image souhaitée</Label>
              <Textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Ex: Photo professionnelle d'un bureau moderne avec des plantes vertes et une lumière naturelle..."
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40 min-h-[100px]"
              />
              <p className="text-white/40 text-xs">
                Soyez précis dans votre description pour de meilleurs résultats.
              </p>
            </div>
            
            <div className="bg-white/5 rounded-lg p-3 space-y-2">
              <p className="text-white/60 text-xs font-medium">💡 Conseils :</p>
              <ul className="text-white/40 text-xs space-y-1">
                <li>• Mentionnez le style : moderne, minimaliste, chaleureux...</li>
                <li>• Précisez les couleurs dominantes si besoin</li>
                <li>• Indiquez le type : photo, illustration, abstrait...</li>
              </ul>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAiPromptDialog({ open: false, imageIndex: null })}
              className="bg-white/5 border-white/10 text-white/60 hover:text-white"
            >
              Annuler
            </Button>
            <Button
              onClick={() => aiPromptDialog.imageIndex !== null && handleAiImageGenerate(aiPromptDialog.imageIndex)}
              disabled={!aiPrompt.trim()}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:opacity-90"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Générer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI Text Regeneration Dialog */}
      <Dialog open={textAiDialog.open} onOpenChange={(open) => setTextAiDialog({ open, textId: open ? textAiDialog.textId : null, originalText: open ? textAiDialog.originalText : "", type: open ? textAiDialog.type : "" })}>
        <DialogContent className="bg-[#1D1D1F] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              Réécrire avec instructions
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-white/80 text-xs">Texte actuel</Label>
              <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-white/60 text-sm">
                {textAiDialog.originalText}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-white/80">Instructions (optionnel)</Label>
              <Textarea
                value={textInstruction}
                onChange={(e) => setTextInstruction(e.target.value)}
                placeholder="Ex: Rendre plus professionnel, ajouter un appel à l'action, simplifier le langage..."
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40 min-h-[80px]"
              />
              <p className="text-white/40 text-xs">
                Sans instruction, le texte sera réécrit de manière plus engageante.
              </p>
            </div>
            
            <div className="bg-white/5 rounded-lg p-3 space-y-2">
              <p className="text-white/60 text-xs font-medium">💡 Exemples d'instructions :</p>
              <ul className="text-white/40 text-xs space-y-1">
                <li>• "Rendre plus concis et percutant"</li>
                <li>• "Ajouter un ton plus chaleureux"</li>
                <li>• "Inclure un appel à l'action"</li>
                <li>• "Utiliser un vocabulaire plus simple"</li>
              </ul>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setTextAiDialog({ open: false, textId: null, originalText: "", type: "" })}
              className="bg-white/5 border-white/10 text-white/60 hover:text-white"
            >
              Annuler
            </Button>
            <Button
              onClick={() => textAiDialog.textId && handleTextRegenerate(
                textAiDialog.textId,
                textAiDialog.originalText,
                textAiDialog.type,
                textInstruction
              )}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:opacity-90"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Réécrire
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Version History Dialog */}
      <Dialog open={showVersionHistory} onOpenChange={setShowVersionHistory}>
        <DialogContent className="bg-[#1D1D1F] border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="w-5 h-5 text-[#007AFF]" />
              Historique des versions
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            {loadingVersions ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 text-white/40 animate-spin" />
              </div>
            ) : versions.length > 0 ? (
              <ScrollArea className="max-h-[400px]">
                <div className="space-y-2">
                  {versions.map((version) => (
                    <div
                      key={version.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium text-sm">
                            Version {version.version_number}
                          </span>
                          {version.label && (
                            <span className="px-1.5 py-0.5 text-[10px] bg-[#007AFF]/20 text-[#007AFF] rounded">
                              {version.label}
                            </span>
                          )}
                          {version.is_auto_save && (
                            <span className="px-1.5 py-0.5 text-[10px] bg-white/10 text-white/40 rounded">
                              Auto
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-white/40 text-xs mt-1">
                          <Clock className="w-3 h-3" />
                          {new Date(version.created_at).toLocaleString("fr-FR", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => restoreVersion(version.id)}
                        disabled={restoringVersion === version.id}
                        className="text-white/60 hover:text-white hover:bg-white/10"
                      >
                        {restoringVersion === version.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <RotateCcw className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center py-8">
                <History className="w-10 h-10 text-white/20 mx-auto mb-3" />
                <p className="text-white/40 text-sm">
                  Aucune version sauvegardée
                </p>
                <p className="text-white/30 text-xs mt-1">
                  Les versions sont créées automatiquement lors des sauvegardes
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowVersionHistory(false)}
              className="w-full bg-white/5 border-white/10 text-white/60 hover:text-white"
            >
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
