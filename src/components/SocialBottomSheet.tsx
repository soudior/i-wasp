import { useState, useMemo } from "react";
import { Search, X, Plus, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { socialNetworks, SocialNetwork } from "@/lib/socialNetworks";
import { SocialIcon } from "@/components/SocialIcon";

interface SocialBottomSheetProps {
  open: boolean;
  onClose: () => void;
  onSelect: (network: SocialNetwork) => void;
  excludedIds?: string[];
}

export function SocialBottomSheet({ open, onClose, onSelect, excludedIds = [] }: SocialBottomSheetProps) {
  const [search, setSearch] = useState("");
  
  const filteredNetworks = useMemo(() => {
    const available = socialNetworks.filter(n => !excludedIds.includes(n.id));
    if (!search) return available;
    return available.filter(n => 
      n.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, excludedIds]);

  const groupedNetworks = useMemo(() => ({
    classic: filteredNetworks.filter(n => n.category === "classic"),
    professional: filteredNetworks.filter(n => n.category === "professional"),
    creators: filteredNetworks.filter(n => n.category === "creators"),
    business: filteredNetworks.filter(n => n.category === "business"),
  }), [filteredNetworks]);

  const handleSelect = (network: SocialNetwork) => {
    onSelect(network);
    onClose();
    setSearch("");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-hidden"
          >
            <div className="bg-background/95 backdrop-blur-xl border-t border-border/50 rounded-t-3xl shadow-2xl">
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
              </div>
              
              {/* Header */}
              <div className="px-6 pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground">Ajouter un réseau</h2>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors"
                  >
                    <X size={16} className="text-muted-foreground" />
                  </button>
                </div>
                
                {/* Search */}
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Rechercher un réseau..."
                    className="pl-10 h-11 bg-muted/50 border-0 rounded-xl"
                    autoFocus
                  />
                </div>
              </div>
              
              {/* Networks List */}
              <div className="px-6 pb-8 max-h-[60vh] overflow-y-auto">
                {filteredNetworks.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8 text-sm">
                    Aucun réseau trouvé
                  </p>
                ) : (
                  <div className="space-y-6">
                    {groupedNetworks.classic.length > 0 && (
                      <NetworkGroup 
                        title="Classiques" 
                        networks={groupedNetworks.classic} 
                        onSelect={handleSelect}
                      />
                    )}
                    {groupedNetworks.professional.length > 0 && (
                      <NetworkGroup 
                        title="Professionnels" 
                        networks={groupedNetworks.professional} 
                        onSelect={handleSelect}
                      />
                    )}
                    {groupedNetworks.creators.length > 0 && (
                      <NetworkGroup 
                        title="Créateurs / Tech" 
                        networks={groupedNetworks.creators} 
                        onSelect={handleSelect}
                      />
                    )}
                    {groupedNetworks.business.length > 0 && (
                      <NetworkGroup 
                        title="Business" 
                        networks={groupedNetworks.business} 
                        onSelect={handleSelect}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

interface NetworkGroupProps {
  title: string;
  networks: SocialNetwork[];
  onSelect: (network: SocialNetwork) => void;
}

function NetworkGroup({ title, networks, onSelect }: NetworkGroupProps) {
  return (
    <div>
      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
        {title}
      </h3>
      <div className="space-y-1">
        {networks.map((network) => (
          <motion.button
            key={network.id}
            onClick={() => onSelect(network)}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-muted/50 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
              <SocialIcon networkId={network.id} size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{network.label}</p>
              <p className="text-xs text-muted-foreground">{network.placeholder}</p>
            </div>
            <Plus size={18} className="text-muted-foreground/50 group-hover:text-primary transition-colors" />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
