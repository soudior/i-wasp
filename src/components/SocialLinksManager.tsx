import { useState } from "react";
import { Plus, X, GripVertical } from "lucide-react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SocialLink, getNetworkById } from "@/lib/socialNetworks";
import { SocialIcon } from "@/components/SocialIcon";
import { SocialBottomSheet } from "@/components/SocialBottomSheet";

interface SocialLinksManagerProps {
  value: SocialLink[];
  onChange: (links: SocialLink[]) => void;
}

export function SocialLinksManager({ value, onChange }: SocialLinksManagerProps) {
  const [sheetOpen, setSheetOpen] = useState(false);

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
  };

  const handleUpdateLink = (linkId: string, newValue: string) => {
    onChange(value.map(l => l.id === linkId ? { ...l, value: newValue } : l));
  };

  const addedNetworkIds = value.map(l => l.networkId);

  return (
    <div className="space-y-4">
      <Label className="flex items-center gap-2 text-sm font-medium text-foreground">
        Réseaux sociaux
      </Label>

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

            return (
              <Reorder.Item
                key={link.id}
                value={link}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.15 }}
              >
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/30 group">
                  <div className="cursor-grab active:cursor-grabbing text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                    <GripVertical size={16} />
                  </div>
                  
                  <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center shrink-0 border border-border/50">
                    <SocialIcon networkId={link.networkId} size={18} className="text-muted-foreground" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-1 font-medium">{network.label}</p>
                    <Input
                      value={link.value}
                      onChange={(e) => handleUpdateLink(link.id, e.target.value)}
                      placeholder={network.placeholder}
                      className="h-9 bg-background border-border/30 text-sm"
                    />
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

      {/* Add button - Apple style */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => setSheetOpen(true)}
        className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary"
      >
        <Plus size={18} />
        <span className="text-sm font-medium">Ajouter un réseau</span>
      </motion.button>

      {value.length === 0 && (
        <p className="text-xs text-muted-foreground text-center">
          Ajoutez vos réseaux sociaux pour les afficher sur votre carte
        </p>
      )}

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
