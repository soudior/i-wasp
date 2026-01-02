/**
 * StoryEditor - Éditeur pour uploader/créer des stories
 * Supporte images et texte avec couleur de fond
 */

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Type, X, Clock, Sparkles, Image as ImageIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Story {
  id: string;
  content_type: "image" | "text";
  image_url?: string;
  text_content?: string;
  text_background_color?: string;
  created_at: string;
  expires_at: string;
}

interface StoryEditorProps {
  cardId: string;
  currentStory?: Story | null;
  onStoryChange: (story: Story | null) => void;
}

const BACKGROUND_COLORS = [
  { id: "dark", color: "#1D1D1F", label: "Sombre" },
  { id: "amber", color: "#D97706", label: "Doré" },
  { id: "rose", color: "#E11D48", label: "Rose" },
  { id: "blue", color: "#2563EB", label: "Bleu" },
  { id: "emerald", color: "#059669", label: "Émeraude" },
  { id: "purple", color: "#7C3AED", label: "Violet" },
];

export function StoryEditor({ cardId, currentStory, onStoryChange }: StoryEditorProps) {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<"image" | "text" | null>(null);
  const [textContent, setTextContent] = useState(currentStory?.text_content || "");
  const [bgColor, setBgColor] = useState(currentStory?.text_background_color || "#1D1D1F");
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentStory?.image_url || null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      toast.error("Seules les images sont acceptées");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 5 Mo");
      return;
    }

    setUploading(true);
    try {
      // Upload to storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${cardId}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from("stories")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("stories")
        .getPublicUrl(fileName);

      const imageUrl = urlData.publicUrl;
      setPreviewUrl(imageUrl);

      // Save story to database
      const { data: storyData, error: storyError } = await supabase
        .from("card_stories")
        .upsert({
          card_id: cardId,
          content_type: "image",
          image_url: imageUrl,
          is_active: true,
        }, {
          onConflict: "card_id",
        })
        .select()
        .single();

      if (storyError) throw storyError;

      onStoryChange(storyData as Story);
      toast.success("Story publiée ! Elle sera visible pendant 24h");
      setMode(null);
    } catch (error) {
      console.error("Error uploading story:", error);
      toast.error("Erreur lors de l'upload de la story");
    } finally {
      setUploading(false);
    }
  };

  const handleTextSubmit = async () => {
    if (!textContent.trim() || !user) return;

    setUploading(true);
    try {
      const { data: storyData, error } = await supabase
        .from("card_stories")
        .upsert({
          card_id: cardId,
          content_type: "text",
          text_content: textContent.trim(),
          text_background_color: bgColor,
          is_active: true,
        }, {
          onConflict: "card_id",
        })
        .select()
        .single();

      if (error) throw error;

      onStoryChange(storyData as Story);
      toast.success("Story publiée ! Elle sera visible pendant 24h");
      setMode(null);
    } catch (error) {
      console.error("Error creating text story:", error);
      toast.error("Erreur lors de la création de la story");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteStory = async () => {
    if (!currentStory) return;

    try {
      const { error } = await supabase
        .from("card_stories")
        .delete()
        .eq("id", currentStory.id);

      if (error) throw error;

      onStoryChange(null);
      setPreviewUrl(null);
      setTextContent("");
      toast.success("Story supprimée");
    } catch (error) {
      console.error("Error deleting story:", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Sparkles size={16} className="text-rose-500" />
          Story Professionnelle
        </Label>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock size={12} />
          <span>Expire après 24h</span>
        </div>
      </div>

      {/* Current story preview */}
      {currentStory && (
        <div className="relative rounded-xl overflow-hidden border border-border/50">
          {currentStory.content_type === "image" && currentStory.image_url && (
            <img
              src={currentStory.image_url}
              alt="Story actuelle"
              className="w-full h-32 object-cover"
            />
          )}
          {currentStory.content_type === "text" && (
            <div
              className="w-full h-32 flex items-center justify-center p-4"
              style={{ backgroundColor: currentStory.text_background_color }}
            >
              <p className="text-white text-sm font-medium text-center line-clamp-3">
                {currentStory.text_content}
              </p>
            </div>
          )}
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDeleteStory}
            className="absolute top-2 right-2 h-8 w-8 p-0"
          >
            <Trash2 size={14} />
          </Button>
          <div className="absolute bottom-2 left-2 px-2 py-1 rounded-full bg-black/50 text-white text-xs">
            Story active
          </div>
        </div>
      )}

      {/* Mode selector */}
      {!currentStory && !mode && (
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setMode("image")}
            className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-rose-500/30 hover:border-rose-500/50 bg-rose-500/5 hover:bg-rose-500/10 transition-all text-rose-500"
          >
            <ImageIcon size={24} />
            <span className="text-sm font-medium">Image</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setMode("text")}
            className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-purple-500/30 hover:border-purple-500/50 bg-purple-500/5 hover:bg-purple-500/10 transition-all text-purple-500"
          >
            <Type size={24} />
            <span className="text-sm font-medium">Texte</span>
          </motion.button>
        </div>
      )}

      {/* Image upload mode */}
      <AnimatePresence>
        {mode === "image" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "flex flex-col items-center justify-center gap-2 p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all",
                uploading
                  ? "border-rose-500/50 bg-rose-500/10"
                  : "border-border/50 hover:border-rose-500/50 hover:bg-rose-500/5"
              )}
            >
              {uploading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500" />
              ) : (
                <>
                  <Upload size={32} className="text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Cliquez pour uploader une image
                  </p>
                  <p className="text-xs text-muted-foreground/70">
                    Promo, nouveau menu, bien disponible...
                  </p>
                </>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMode(null)}
              className="w-full"
            >
              Annuler
            </Button>
          </motion.div>
        )}

        {/* Text mode */}
        {mode === "text" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Text preview */}
            <div
              className="rounded-xl p-4 min-h-[100px] flex items-center justify-center transition-colors"
              style={{ backgroundColor: bgColor }}
            >
              <p className="text-white text-center font-medium">
                {textContent || "Votre message ici..."}
              </p>
            </div>

            {/* Text input */}
            <Textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Ex: -20% aujourd'hui seulement ! 🎉"
              maxLength={200}
              className="resize-none"
              rows={3}
            />

            {/* Color picker */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Couleur :</span>
              <div className="flex gap-1.5">
                {BACKGROUND_COLORS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setBgColor(c.color)}
                    className={cn(
                      "w-6 h-6 rounded-full border-2 transition-transform",
                      bgColor === c.color
                        ? "border-white scale-110 shadow-lg"
                        : "border-transparent hover:scale-105"
                    )}
                    style={{ backgroundColor: c.color }}
                    title={c.label}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMode(null)}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                onClick={handleTextSubmit}
                disabled={!textContent.trim() || uploading}
                className="flex-1 bg-gradient-to-r from-rose-500 to-purple-500 text-white"
              >
                {uploading ? "Publication..." : "Publier"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-xs text-muted-foreground text-center">
        Parfait pour annoncer une promo, un nouveau menu ou un bien disponible !
      </p>
    </div>
  );
}
