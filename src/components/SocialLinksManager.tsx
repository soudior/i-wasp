import { useState, useCallback } from "react";
import { Plus, X, GripVertical, AlertCircle, Check } from "lucide-react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SocialLink, getNetworkById, normalizeUsername, validateUsername } from "@/lib/socialNetworks";
import { SocialIcon } from "@/components/SocialIcon";
import { SocialBottomSheet } from "@/components/SocialBottomSheet";
import { cn } from "@/lib/utils";

interface SocialLinksManagerProps {
  value: SocialLink[];
  onChange: (links: SocialLink[]) => void;
}

export function SocialLinksManager({ value, onChange }: SocialLinksManagerProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleAddNetwork = (network: { id: string }) => {
    const newLink: SocialLink = {
      id: `${network.id}-${Date.now()}`,
      networkId: network.id,
      value: "",
    };
    onChange([...value, newLink]);
  };

  const handleRemoveLink = (linkId: string) => {
    onChange(value.filter(l => l.id !== linkId));
    // Clear validation error
    setValidationErrors(prev => {
      const next = { ...prev };
      delete next[linkId];
      return next;
    });
  };

  const handleUpdateLink = useCallback((linkId: string, newValue: string, networkId: string) => {
    // Normalize the input as user types
    const normalized = normalizeUsername(newValue, networkId);
    
    // Validate
    const validation = validateUsername(newValue, networkId);
    
    if (newValue && !validation.valid) {
      setValidationErrors(prev => ({ ...prev, [linkId]: validation.error || "Invalide" }));
    } else {
      setValidationErrors(prev => {
        const next = { ...prev };
        delete next[linkId];
        return next;
      });
    }
    
    // Store normalized value
    onChange(value.map(l => l.id === linkId ? { ...l, value: normalized } : l));
  }, [value, onChange]);

  // Handle blur to finalize normalization
  const handleBlur = useCallback((linkId: string, networkId: string) => {
    const link = value.find(l => l.id === linkId);
    if (link && link.value) {
      const normalized = normalizeUsername(link.value, networkId);
      if (normalized !== link.value) {
        onChange(value.map(l => l.id === linkId ? { ...l, value: normalized } : l));
      }
    }
  }, [value, onChange]);

  const addedNetworkIds = value.map(l => l.networkId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2 text-sm font-medium text-foreground">
          Réseaux & Services
        </Label>
        {value.length > 0 && (
          <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
            {value.length} lien{value.length > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Added links with reorder */}
      <Reorder.Group 
        axis="y" 
        values={value} 
        onReorder={onChange}
        className="space-y-2"
      >
        <AnimatePresence mode="popLayout">
          {value.map((link) => {
            const network = getNetworkById(link.networkId);
            if (!network) return null;
            
            const error = validationErrors[link.id];
            const isValid = link.value && !error;

            return (
              <Reorder.Item
                key={link.id}
                value={link}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.15 }}
              >
                <div className={cn(
                  "flex items-center gap-3 p-3 rounded-xl bg-muted/30 border group transition-colors",
                  error ? "border-destructive/50" : "border-border/30",
                  isValid && "border-emerald-500/30"
                )}>
                  <div className="cursor-grab active:cursor-grabbing text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                    <GripVertical size={16} />
                  </div>
                  
                  <div className={cn(
                    "w-10 h-10 rounded-xl bg-background flex items-center justify-center shrink-0 border transition-colors",
                    error ? "border-destructive/30" : "border-border/50",
                    isValid && "border-emerald-500/30"
                  )}>
                    <SocialIcon networkId={link.networkId} size={18} className="text-muted-foreground" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-1 font-medium">{network.label}</p>
                    <div className="relative">
                      <Input
                        value={link.value}
                        onChange={(e) => handleUpdateLink(link.id, e.target.value, link.networkId)}
                        onBlur={() => handleBlur(link.id, link.networkId)}
                        placeholder={network.placeholder}
                        className={cn(
                          "h-9 bg-background text-sm pr-8",
                          error ? "border-destructive/50 focus-visible:ring-destructive/50" : "border-border/30"
                        )}
                      />
                      {/* Status indicator */}
                      <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        {error && <AlertCircle size={14} className="text-destructive" />}
                        {isValid && <Check size={14} className="text-emerald-500" />}
                      </div>
                    </div>
                    {error && (
                      <p className="text-xs text-destructive mt-1">{error}</p>
                    )}
                  </div>
                  
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleRemoveLink(link.id)}
                    className="w-8 h-8 rounded-lg hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X size={16} />
                  </motion.button>
                </div>
              </Reorder.Item>
            );
          })}
        </AnimatePresence>
      </Reorder.Group>

      {/* Add button - Premium style */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => setSheetOpen(true)}
        className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-amber-500/30 hover:border-amber-500/50 bg-gradient-to-r from-amber-500/5 to-amber-600/5 hover:from-amber-500/10 hover:to-amber-600/10 transition-all text-amber-600 dark:text-amber-400"
      >
        <Plus size={18} />
        <span className="text-sm font-medium">Ajouter un lien</span>
      </motion.button>

      {value.length === 0 && (
        <p className="text-xs text-muted-foreground text-center">
          Ajoutez Instagram, Spotify, WhatsApp, TikTok, et plus encore...
        </p>
      )}

      <p className="text-xs text-center text-muted-foreground/70">
        ↕ Glissez-déposez pour réorganiser l'ordre
      </p>

      {/* Bottom Sheet */}
      <SocialBottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSelect={handleAddNetwork}
        excludedIds={addedNetworkIds}
      />
    </div>
  );
}
