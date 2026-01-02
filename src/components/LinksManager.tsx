/**
 * LinksManager - Gestion des liens sociaux avec drag-drop et icônes automatiques
 * Design Noir & Or premium
 */

import { useState, useCallback } from "react";
import { Plus, X, GripVertical, Check, AlertCircle } from "lucide-react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { Input } from "@/components/ui/input";
import { SocialLink, getNetworkById, normalizeUsername, validateUsername } from "@/lib/socialNetworks";
import { SocialIcon } from "@/components/SocialIcon";
import { SocialBottomSheet } from "@/components/SocialBottomSheet";
import { cn } from "@/lib/utils";

interface LinksManagerProps {
  value: SocialLink[];
  onChange: (links: SocialLink[]) => void;
  maxLinks?: number;
}

export function LinksManager({ value, onChange, maxLinks = 999 }: LinksManagerProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleAddNetwork = (network: { id: string }) => {
    if (maxLinks && value.length >= maxLinks) return;
    
    const newLink: SocialLink = {
      id: `${network.id}-${Date.now()}`,
      networkId: network.id,
      value: "",
    };
    onChange([...value, newLink]);
  };

  const handleRemoveLink = (linkId: string) => {
    onChange(value.filter(l => l.id !== linkId));
    setValidationErrors(prev => {
      const next = { ...prev };
      delete next[linkId];
      return next;
    });
  };

  const handleUpdateLink = useCallback((linkId: string, newValue: string, networkId: string) => {
    const normalized = normalizeUsername(newValue, networkId);
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
    
    onChange(value.map(l => l.id === linkId ? { ...l, value: normalized } : l));
  }, [value, onChange]);

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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-white">Mes Liens</h3>
          <span className="text-xs text-white/40 bg-white/10 px-2 py-0.5 rounded-full">
            {value.length} lien{value.length !== 1 ? "s" : ""}
          </span>
        </div>
        <span className="text-xs text-[#D4AF37]">Illimité ✨</span>
      </div>

      {/* Links list with reorder */}
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
                  "flex items-center gap-3 p-3 rounded-xl bg-white/5 border group transition-colors",
                  error ? "border-red-500/50" : "border-white/10",
                  isValid && "border-[#D4AF37]/30"
                )}>
                  <div className="cursor-grab active:cursor-grabbing text-white/30 hover:text-white/60 transition-colors">
                    <GripVertical size={16} />
                  </div>
                  
                  <div className={cn(
                    "w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 transition-colors",
                    isValid && "bg-[#D4AF37]/20"
                  )}>
                    <SocialIcon networkId={link.networkId} size={18} className={isValid ? "text-[#D4AF37]" : "text-white/60"} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white/50 mb-1 font-medium">{network.label}</p>
                    <div className="relative">
                      <Input
                        value={link.value}
                        onChange={(e) => handleUpdateLink(link.id, e.target.value, link.networkId)}
                        onBlur={() => handleBlur(link.id, link.networkId)}
                        placeholder={network.placeholder}
                        className={cn(
                          "h-9 bg-white/5 text-white text-sm pr-8 border-white/10 focus:border-[#D4AF37]/50",
                          error && "border-red-500/50 focus:border-red-500/50"
                        )}
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        {error && <AlertCircle size={14} className="text-red-500" />}
                        {isValid && <Check size={14} className="text-[#D4AF37]" />}
                      </div>
                    </div>
                    {error && (
                      <p className="text-xs text-red-400 mt-1">{error}</p>
                    )}
                  </div>
                  
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleRemoveLink(link.id)}
                    className="w-8 h-8 rounded-lg hover:bg-red-500/20 flex items-center justify-center text-white/30 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X size={16} />
                  </motion.button>
                </div>
              </Reorder.Item>
            );
          })}
        </AnimatePresence>
      </Reorder.Group>

      {/* Add button */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => setSheetOpen(true)}
        className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-[#D4AF37]/30 hover:border-[#D4AF37]/50 bg-[#D4AF37]/5 hover:bg-[#D4AF37]/10 transition-all text-[#D4AF37]"
      >
        <Plus size={18} />
        <span className="text-sm font-medium">Ajouter un lien</span>
      </motion.button>

      {value.length === 0 && (
        <p className="text-xs text-white/40 text-center">
          Ajoutez Instagram, Spotify, WhatsApp, TikTok, Snapchat et plus encore...
        </p>
      )}

      <p className="text-xs text-center text-white/30">
        ↕ Glissez-déposez pour réorganiser l'ordre d'affichage
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
