/**
 * Card Studio - Premium Visual Editor
 * 
 * Full-featured drag-and-drop card editor with:
 * - Visual block editor
 * - Template picker
 * - Live preview
 * - Real-time sync
 */

import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useCards, useCreateCard, useUpdateCard, DigitalCard } from "@/hooks/useCards";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  ArrowLeft, Save, Eye, Layers, Palette, Sparkles, Smartphone,
  Monitor, ChevronLeft, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { VisualBlockEditor, TemplatePicker } from "@/components/editor";
import { DynamicCardRenderer } from "@/components/DynamicCardRenderer";
import {
  CardBlock,
  convertLegacyToBlocks,
  convertBlocksToLegacy,
  createIdentityBlock,
} from "@/lib/cardBlocks";

// ============================================================
// TYPES
// ============================================================

type ViewMode = "mobile" | "desktop";
type EditorTab = "blocks" | "template" | "style";

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function CardStudio() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { data: cards = [], isLoading: cardsLoading } = useCards();
  const createCard = useCreateCard();
  const updateCard = useUpdateCard();

  // State
  const [blocks, setBlocks] = useState<CardBlock[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState("signature");
  const [activeTab, setActiveTab] = useState<EditorTab>("blocks");
  const [viewMode, setViewMode] = useState<ViewMode>("mobile");
  const [showPreview, setShowPreview] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load existing card if editing
  useEffect(() => {
    const cardId = searchParams.get("id");
    if (cardId && cards.length > 0) {
      const existingCard = cards.find((c) => c.id === cardId);
      if (existingCard) {
        setEditingCardId(cardId);
        setSelectedTemplate(existingCard.template || "signature");
        
        // Convert legacy data to blocks if needed
        if (existingCard.blocks && Array.isArray(existingCard.blocks)) {
          setBlocks(existingCard.blocks as CardBlock[]);
        } else {
          // Convert from legacy format
          const legacyData = {
            firstName: existingCard.first_name,
            lastName: existingCard.last_name,
            title: existingCard.title,
            company: existingCard.company,
            photoUrl: existingCard.photo_url,
            logoUrl: existingCard.logo_url,
            tagline: existingCard.tagline,
            phone: existingCard.phone,
            email: existingCard.email,
            website: existingCard.website,
            location: existingCard.location,
            linkedin: existingCard.linkedin,
            instagram: existingCard.instagram,
            twitter: existingCard.twitter,
            socialLinks: existingCard.social_links,
          };
          setBlocks(convertLegacyToBlocks(legacyData));
        }
      }
    } else if (!cardId && cards.length === 0 && !cardsLoading) {
      // New card - add default identity block
      setBlocks([createIdentityBlock()]);
    }
  }, [searchParams, cards, cardsLoading]);

  // Track unsaved changes
  useEffect(() => {
    if (blocks.length > 0) {
      setHasUnsavedChanges(true);
    }
  }, [blocks, selectedTemplate]);

  // Handle save
  const handleSave = useCallback(async () => {
    if (!user) {
      toast.error("Vous devez être connecté pour sauvegarder");
      navigate("/login");
      return;
    }

    setIsSaving(true);
    try {
      // Convert blocks to legacy format for database
      const legacyData = convertBlocksToLegacy(blocks);
      
      const cardData = {
        first_name: legacyData.firstName || "Prénom",
        last_name: legacyData.lastName || "Nom",
        title: legacyData.title,
        company: legacyData.company,
        photo_url: legacyData.photoUrl,
        logo_url: legacyData.logoUrl,
        tagline: legacyData.tagline,
        phone: legacyData.phone,
        email: legacyData.email,
        website: legacyData.website,
        location: legacyData.location,
        linkedin: legacyData.linkedin,
        instagram: legacyData.instagram,
        twitter: legacyData.twitter,
        template: selectedTemplate,
        blocks: blocks,
        social_links: legacyData.socialLinks,
      };

      if (editingCardId) {
        await updateCard.mutateAsync({ id: editingCardId, data: cardData });
        toast.success("Carte mise à jour !");
      } else {
        const newCard = await createCard.mutateAsync(cardData);
        setEditingCardId(newCard.id);
        toast.success("Carte créée !");
      }
      
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setIsSaving(false);
    }
  }, [user, blocks, selectedTemplate, editingCardId, createCard, updateCard, navigate]);

  // Build preview data
  const previewData = convertBlocksToLegacy(blocks);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-8">
        {/* Header */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/dashboard")}
              >
                <ArrowLeft size={20} />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-foreground">
                  Card Studio
                </h1>
                <p className="text-sm text-muted-foreground">
                  Éditeur visuel premium
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {hasUnsavedChanges && (
                <Badge variant="secondary" className="text-xs bg-amber-500/20 text-amber-500">
                  Non sauvegardé
                </Badge>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="gap-2"
              >
                <Eye size={16} />
                <span className="hidden sm:inline">
                  {showPreview ? "Masquer" : "Aperçu"}
                </span>
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
                className="gap-2"
              >
                <Save size={16} />
                <span>{isSaving ? "Sauvegarde..." : "Sauvegarder"}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Main Editor */}
        <div className="container mx-auto px-4">
          <div className={cn(
            "grid gap-6",
            showPreview ? "lg:grid-cols-2" : "lg:grid-cols-1 max-w-2xl mx-auto"
          )}>
            {/* Editor Panel */}
            <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as EditorTab)}>
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="blocks" className="gap-2 text-xs">
                    <Layers size={14} />
                    <span className="hidden sm:inline">Blocs</span>
                  </TabsTrigger>
                  <TabsTrigger value="template" className="gap-2 text-xs">
                    <Sparkles size={14} />
                    <span className="hidden sm:inline">Template</span>
                  </TabsTrigger>
                  <TabsTrigger value="style" className="gap-2 text-xs">
                    <Palette size={14} />
                    <span className="hidden sm:inline">Style</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="blocks" className="mt-0">
                  <VisualBlockEditor
                    blocks={blocks}
                    onChange={setBlocks}
                    selectedTemplate={selectedTemplate}
                    onTemplateChange={setSelectedTemplate}
                  />
                </TabsContent>

                <TabsContent value="template" className="mt-0">
                  <TemplatePicker
                    selectedTemplate={selectedTemplate}
                    onSelect={setSelectedTemplate}
                  />
                </TabsContent>

                <TabsContent value="style" className="mt-0">
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                      <Palette size={24} className="text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Personnalisation avancée
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                      Bientôt disponible
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>

            {/* Preview Panel */}
            <AnimatePresence>
              {showPreview && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50 sticky top-24">
                    {/* Preview Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Eye size={16} className="text-muted-foreground" />
                        <span className="text-sm font-medium">Aperçu</span>
                      </div>
                      <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg">
                        <Button
                          variant={viewMode === "mobile" ? "secondary" : "ghost"}
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => setViewMode("mobile")}
                        >
                          <Smartphone size={14} />
                        </Button>
                        <Button
                          variant={viewMode === "desktop" ? "secondary" : "ghost"}
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => setViewMode("desktop")}
                        >
                          <Monitor size={14} />
                        </Button>
                      </div>
                    </div>

                    {/* Preview Container */}
                    <div
                      className={cn(
                        "mx-auto transition-all duration-300 overflow-hidden",
                        viewMode === "mobile"
                          ? "max-w-[375px]"
                          : "max-w-full"
                      )}
                    >
                      <div className="bg-muted/30 rounded-2xl p-4 min-h-[500px]">
                        <DynamicCardRenderer
                          blocks={blocks}
                          theme="dark"
                          showWalletButtons={false}
                        />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
