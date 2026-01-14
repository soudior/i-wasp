/**
 * WebsiteEditor - Éditeur visuel professionnel pour personnaliser les sites générés
 * Interface en panneau latéral avec preview en temps réel
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Type, Palette, Image, Save, Eye, Undo, Redo, 
  ChevronLeft, ChevronRight, Monitor, Smartphone, 
  Check, Loader2, ExternalLink, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
  const [activeTab, setActiveTab] = useState("texts");
  const [history, setHistory] = useState<WebsiteCustomizations[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Extract editable texts from HTML
  const [editableTexts, setEditableTexts] = useState<Array<{ id: string; label: string; value: string }>>([]);

  useEffect(() => {
    extractEditableContent();
  }, [initialHtml]);

  const extractEditableContent = () => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(initialHtml, "text/html");
    
    const texts: Array<{ id: string; label: string; value: string }> = [];
    
    // Extract headings
    doc.querySelectorAll("h1, h2, h3").forEach((el, index) => {
      const tag = el.tagName.toLowerCase();
      texts.push({
        id: `${tag}-${index}`,
        label: `${tag === "h1" ? "Titre principal" : tag === "h2" ? "Sous-titre" : "Section"} ${index + 1}`,
        value: el.textContent?.trim() || ""
      });
    });

    // Extract paragraphs with substantial content
    doc.querySelectorAll("p").forEach((el, index) => {
      const text = el.textContent?.trim() || "";
      if (text.length > 20 && text.length < 500) {
        texts.push({
          id: `p-${index}`,
          label: `Paragraphe ${index + 1}`,
          value: text
        });
      }
    });

    // Extract button text
    doc.querySelectorAll("button, .btn, a.button, [class*='btn']").forEach((el, index) => {
      const text = el.textContent?.trim() || "";
      if (text.length > 0 && text.length < 50) {
        texts.push({
          id: `btn-${index}`,
          label: `Bouton ${index + 1}`,
          value: text
        });
      }
    });

    setEditableTexts(texts);
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
      
      // Save to history
      setHistory(h => [...h.slice(0, historyIndex + 1), updated]);
      setHistoryIndex(i => i + 1);
      
      return updated;
    });
  }, [historyIndex]);

  const applyCustomizationsToHtml = useCallback((baseHtml: string, customs: WebsiteCustomizations): string => {
    let result = baseHtml;
    const parser = new DOMParser();
    const doc = parser.parseFromString(result, "text/html");

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
      doc.head.appendChild(styleEl);
    }

    // Apply image changes
    Object.entries(customs.images).forEach(([selector, newSrc]) => {
      const img = doc.querySelector(`img[src*="${selector}"]`) || doc.querySelector(`img:nth-of-type(${parseInt(selector) + 1})`);
      if (img) {
        img.setAttribute("src", newSrc);
      }
    });

    return doc.documentElement.outerHTML;
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

  const handleSave = async () => {
    setIsSaving(true);
    try {
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
                
                {/* Undo/Redo */}
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
                </div>
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                <TabsList className="w-full grid grid-cols-3 p-1 m-2 bg-white/5 rounded-lg">
                  <TabsTrigger value="texts" className="data-[state=active]:bg-[#007AFF] data-[state=active]:text-white text-white/60 text-xs">
                    <Type className="w-3 h-3 mr-1" />
                    Textes
                  </TabsTrigger>
                  <TabsTrigger value="colors" className="data-[state=active]:bg-[#007AFF] data-[state=active]:text-white text-white/60 text-xs">
                    <Palette className="w-3 h-3 mr-1" />
                    Couleurs
                  </TabsTrigger>
                  <TabsTrigger value="images" className="data-[state=active]:bg-[#007AFF] data-[state=active]:text-white text-white/60 text-xs">
                    <Image className="w-3 h-3 mr-1" />
                    Images
                  </TabsTrigger>
                </TabsList>

                <ScrollArea className="flex-1 px-4">
                  {/* Textes */}
                  <TabsContent value="texts" className="mt-0 space-y-4 pb-4">
                    {editableTexts.map((item) => (
                      <div key={item.id} className="space-y-2">
                        <Label className="text-white/80 text-xs">{item.label}</Label>
                        <Input
                          value={customizations.texts[item.id] ?? item.value}
                          onChange={(e) => updateCustomization("texts", item.id, e.target.value)}
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/40 text-sm"
                        />
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
                    <p className="text-white/40 text-sm text-center py-8">
                      Gestion des images à venir
                    </p>
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
    </motion.div>
  );
}
