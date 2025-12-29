import { useState } from "react";
import { Plus, X, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { socialNetworks, SocialLink, getNetworkById } from "@/lib/socialNetworks";
import { SocialIcon } from "@/components/SocialIcon";

interface SocialLinksManagerProps {
  value: SocialLink[];
  onChange: (links: SocialLink[]) => void;
}

export function SocialLinksManager({ value, onChange }: SocialLinksManagerProps) {
  const [selectedNetwork, setSelectedNetwork] = useState<string>("");

  const handleAddLink = () => {
    if (!selectedNetwork) return;
    
    const newLink: SocialLink = {
      id: `${selectedNetwork}-${Date.now()}`,
      networkId: selectedNetwork,
      value: "",
    };
    
    onChange([...value, newLink]);
    setSelectedNetwork("");
  };

  const handleRemoveLink = (linkId: string) => {
    onChange(value.filter(l => l.id !== linkId));
  };

  const handleUpdateLink = (linkId: string, newValue: string) => {
    onChange(value.map(l => l.id === linkId ? { ...l, value: newValue } : l));
  };

  const groupedNetworks = {
    classic: socialNetworks.filter(n => n.category === "classic"),
    professional: socialNetworks.filter(n => n.category === "professional"),
    creators: socialNetworks.filter(n => n.category === "creators"),
    business: socialNetworks.filter(n => n.category === "business"),
  };

  // Filter out already added networks
  const addedNetworkIds = value.map(l => l.networkId);
  const availableNetworks = socialNetworks.filter(n => !addedNetworkIds.includes(n.id));

  return (
    <div className="space-y-4">
      <Label className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Plus size={14} className="text-chrome" />
        Réseaux sociaux
      </Label>

      {/* Added links */}
      <div className="space-y-3">
        {value.map((link) => {
          const network = getNetworkById(link.networkId);
          if (!network) return null;

          return (
            <div
              key={link.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-surface-2 border border-border/50 animate-fade-in"
            >
              <div className="cursor-move text-muted-foreground hover:text-foreground transition-colors">
                <GripVertical size={16} />
              </div>
              
              <div className="w-9 h-9 rounded-lg bg-surface-3 flex items-center justify-center shrink-0">
                <SocialIcon networkId={link.networkId} size={18} className="text-chrome" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-1">{network.label}</p>
                <Input
                  value={link.value}
                  onChange={(e) => handleUpdateLink(link.id, e.target.value)}
                  placeholder={network.placeholder}
                  className="h-9 bg-background border-border/30 text-sm"
                />
              </div>
              
              <button
                type="button"
                onClick={() => handleRemoveLink(link.id)}
                className="w-8 h-8 rounded-lg hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Add new link */}
      {availableNetworks.length > 0 && (
        <div className="flex gap-2">
          <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
            <SelectTrigger className="flex-1 h-11 bg-surface-2 border-border/50">
              <SelectValue placeholder="Choisir un réseau" />
            </SelectTrigger>
            <SelectContent className="bg-background border-border z-50">
              <SelectGroup>
                <SelectLabel className="text-muted-foreground">Classiques</SelectLabel>
                {groupedNetworks.classic.filter(n => !addedNetworkIds.includes(n.id)).map(n => (
                  <SelectItem key={n.id} value={n.id} className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      <SocialIcon networkId={n.id} size={16} />
                      <span>{n.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
              <SelectGroup>
                <SelectLabel className="text-muted-foreground">Professionnels</SelectLabel>
                {groupedNetworks.professional.filter(n => !addedNetworkIds.includes(n.id)).map(n => (
                  <SelectItem key={n.id} value={n.id} className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      <SocialIcon networkId={n.id} size={16} />
                      <span>{n.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
              <SelectGroup>
                <SelectLabel className="text-muted-foreground">Créateurs / Tech</SelectLabel>
                {groupedNetworks.creators.filter(n => !addedNetworkIds.includes(n.id)).map(n => (
                  <SelectItem key={n.id} value={n.id} className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      <SocialIcon networkId={n.id} size={16} />
                      <span>{n.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
              <SelectGroup>
                <SelectLabel className="text-muted-foreground">Business</SelectLabel>
                {groupedNetworks.business.filter(n => !addedNetworkIds.includes(n.id)).map(n => (
                  <SelectItem key={n.id} value={n.id} className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      <SocialIcon networkId={n.id} size={16} />
                      <span>{n.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          
          <Button
            type="button"
            variant="chrome"
            size="icon"
            onClick={handleAddLink}
            disabled={!selectedNetwork}
            className="h-11 w-11 shrink-0"
          >
            <Plus size={18} />
          </Button>
        </div>
      )}

      {value.length === 0 && (
        <p className="text-xs text-muted-foreground text-center py-4">
          Ajoutez vos réseaux sociaux pour les afficher sur votre carte
        </p>
      )}
    </div>
  );
}
