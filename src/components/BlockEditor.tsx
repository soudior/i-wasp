/**
 * Block Editor Component
 * 
 * Dashboard UI for adding, editing, removing, and reordering card blocks.
 * Mobile-first, premium design with drag & drop support.
 */

import { useState, useCallback } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { 
  Plus, Trash2, GripVertical, Eye, EyeOff, ChevronDown, ChevronUp,
  User, Wifi, MapPin, Zap, Share2, Gift, Info, Minus, Phone, Mail,
  Globe, MessageCircle, Copy, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { SocialLinksManager } from "@/components/SocialLinksManager";
import { PhotoUpload } from "@/components/PhotoUpload";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  CardBlock,
  BlockType,
  IdentityBlock,
  WifiBlock,
  LocationBlock,
  ActionBlock,
  SocialBlock,
  OfferBlock,
  InfoBlock,
  DividerBlock,
  ActionType,
  createIdentityBlock,
  createWifiBlock,
  createLocationBlock,
  createActionBlock,
  createSocialBlock,
  createOfferBlock,
  createInfoBlock,
  createDividerBlock,
  reorderBlocks,
  blockTypeInfo,
} from "@/lib/cardBlocks";
import { SocialLink } from "@/lib/socialNetworks";

// ============================================================
// BLOCK EDITOR PROPS
// ============================================================

interface BlockEditorProps {
  blocks: CardBlock[];
  onChange: (blocks: CardBlock[]) => void;
  className?: string;
}

// ============================================================
// ICON MAPPING
// ============================================================

const blockIcons: Record<BlockType, React.ElementType> = {
  identity: User,
  wifi: Wifi,
  location: MapPin,
  action: Zap,
  social: Share2,
  offer: Gift,
  info: Info,
  divider: Minus,
};

const actionIcons: Record<ActionType, React.ElementType> = {
  call: Phone,
  whatsapp: MessageCircle,
  sms: MessageCircle,
  email: Mail,
  website: Globe,
  custom: Zap,
};

// ============================================================
// INDIVIDUAL BLOCK EDITORS
// ============================================================

function IdentityBlockEditor({ 
  block, 
  onChange 
}: { 
  block: IdentityBlock; 
  onChange: (block: IdentityBlock) => void;
}) {
  const updateData = (field: keyof IdentityBlock["data"], value: string | null) => {
    onChange({
      ...block,
      data: { ...block.data, [field]: value },
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Prénom *</Label>
          <Input
            value={block.data.firstName}
            onChange={(e) => updateData("firstName", e.target.value)}
            placeholder="Alexandre"
            className="h-10"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Nom *</Label>
          <Input
            value={block.data.lastName}
            onChange={(e) => updateData("lastName", e.target.value)}
            placeholder="Dubois"
            className="h-10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Fonction</Label>
        <Input
          value={block.data.title || ""}
          onChange={(e) => updateData("title", e.target.value)}
          placeholder="Directeur Général"
          className="h-10"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Entreprise</Label>
        <Input
          value={block.data.company || ""}
          onChange={(e) => updateData("company", e.target.value)}
          placeholder="Prestige Corp"
          className="h-10"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Phrase emblématique</Label>
        <Input
          value={block.data.tagline || ""}
          onChange={(e) => updateData("tagline", e.target.value)}
          placeholder="L'excellence en toute simplicité"
          className="h-10"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Photo de profil</Label>
          <PhotoUpload
            value={block.data.photoUrl}
            onChange={(url) => updateData("photoUrl", url)}
            type="photo"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Logo entreprise</Label>
          <PhotoUpload
            value={block.data.logoUrl}
            onChange={(url) => updateData("logoUrl", url)}
            type="logo"
          />
        </div>
      </div>
    </div>
  );
}

function WifiBlockEditor({ 
  block, 
  onChange 
}: { 
  block: WifiBlock; 
  onChange: (block: WifiBlock) => void;
}) {
  const [copied, setCopied] = useState(false);

  const updateData = (field: keyof WifiBlock["data"], value: string) => {
    onChange({
      ...block,
      data: { ...block.data, [field]: value },
    });
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(block.data.password);
    setCopied(true);
    toast.success("Mot de passe copié !");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Nom du réseau (SSID)</Label>
        <Input
          value={block.data.ssid}
          onChange={(e) => updateData("ssid", e.target.value)}
          placeholder="MonWiFi"
          className="h-10"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Mot de passe</Label>
        <div className="flex gap-2">
          <Input
            value={block.data.password}
            onChange={(e) => updateData("password", e.target.value)}
            placeholder="••••••••"
            type="password"
            className="h-10 flex-1"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={copyPassword}
            className="h-10 w-10"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Type de sécurité</Label>
        <Select
          value={block.data.security || "WPA2"}
          onValueChange={(value) => updateData("security", value)}
        >
          <SelectTrigger className="h-10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="WPA2">WPA2 (Recommandé)</SelectItem>
            <SelectItem value="WPA">WPA</SelectItem>
            <SelectItem value="WEP">WEP (Ancien)</SelectItem>
            <SelectItem value="open">Ouvert (pas de mot de passe)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Label affiché</Label>
        <Input
          value={block.data.label || ""}
          onChange={(e) => updateData("label", e.target.value)}
          placeholder="WiFi Gratuit"
          className="h-10"
        />
      </div>
    </div>
  );
}

function LocationBlockEditor({ 
  block, 
  onChange 
}: { 
  block: LocationBlock; 
  onChange: (block: LocationBlock) => void;
}) {
  const updateData = (field: keyof LocationBlock["data"], value: string | number | undefined) => {
    onChange({
      ...block,
      data: { ...block.data, [field]: value },
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Adresse</Label>
        <Input
          value={block.data.address}
          onChange={(e) => updateData("address", e.target.value)}
          placeholder="123 Rue de Paris, 75001 Paris"
          className="h-10"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Latitude (optionnel)</Label>
          <Input
            value={block.data.latitude || ""}
            onChange={(e) => updateData("latitude", e.target.value ? parseFloat(e.target.value) : undefined)}
            placeholder="48.8566"
            type="number"
            step="any"
            className="h-10"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Longitude (optionnel)</Label>
          <Input
            value={block.data.longitude || ""}
            onChange={(e) => updateData("longitude", e.target.value ? parseFloat(e.target.value) : undefined)}
            placeholder="2.3522"
            type="number"
            step="any"
            className="h-10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Label affiché</Label>
        <Input
          value={block.data.label || ""}
          onChange={(e) => updateData("label", e.target.value)}
          placeholder="Notre adresse"
          className="h-10"
        />
      </div>

      <p className="text-xs text-muted-foreground">
        💡 Astuce: Les coordonnées GPS permettent une navigation plus précise.
      </p>
    </div>
  );
}

function ActionBlockEditor({ 
  block, 
  onChange 
}: { 
  block: ActionBlock; 
  onChange: (block: ActionBlock) => void;
}) {
  const updateData = (field: keyof ActionBlock["data"], value: string) => {
    onChange({
      ...block,
      data: { ...block.data, [field]: value },
    });
  };

  const getPlaceholder = () => {
    switch (block.data.actionType) {
      case "call":
      case "whatsapp":
      case "sms":
        return "+33 6 12 34 56 78";
      case "email":
        return "contact@exemple.com";
      case "website":
        return "www.exemple.com";
      default:
        return "Valeur";
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Type d'action</Label>
        <Select
          value={block.data.actionType}
          onValueChange={(value) => updateData("actionType", value as ActionType)}
        >
          <SelectTrigger className="h-10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="call">📞 Appeler</SelectItem>
            <SelectItem value="whatsapp">💬 WhatsApp</SelectItem>
            <SelectItem value="sms">✉️ SMS</SelectItem>
            <SelectItem value="email">📧 Email</SelectItem>
            <SelectItem value="website">🌐 Site web</SelectItem>
            <SelectItem value="custom">⚡ Personnalisé</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">
          {block.data.actionType === "email" ? "Email" : 
           block.data.actionType === "website" ? "URL" : "Numéro"}
        </Label>
        <Input
          value={block.data.value}
          onChange={(e) => updateData("value", e.target.value)}
          placeholder={getPlaceholder()}
          className="h-10"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Label</Label>
          <Input
            value={block.data.label}
            onChange={(e) => updateData("label", e.target.value)}
            placeholder="Appeler"
            className="h-10"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Sous-titre</Label>
          <Input
            value={block.data.subtitle || ""}
            onChange={(e) => updateData("subtitle", e.target.value)}
            placeholder="Appel direct"
            className="h-10"
          />
        </div>
      </div>
    </div>
  );
}

function SocialBlockEditor({ 
  block, 
  onChange 
}: { 
  block: SocialBlock; 
  onChange: (block: SocialBlock) => void;
}) {
  const handleLinksChange = (links: SocialLink[]) => {
    onChange({
      ...block,
      data: { ...block.data, links },
    });
  };

  return (
    <div className="space-y-4">
      <SocialLinksManager
        value={block.data.links}
        onChange={handleLinksChange}
      />
    </div>
  );
}

function OfferBlockEditor({ 
  block, 
  onChange 
}: { 
  block: OfferBlock; 
  onChange: (block: OfferBlock) => void;
}) {
  const updateData = (field: keyof OfferBlock["data"], value: string) => {
    onChange({
      ...block,
      data: { ...block.data, [field]: value },
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Titre de l'offre</Label>
        <Input
          value={block.data.title}
          onChange={(e) => updateData("title", e.target.value)}
          placeholder="Offre spéciale -20%"
          className="h-10"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Description</Label>
        <Textarea
          value={block.data.description}
          onChange={(e) => updateData("description", e.target.value)}
          placeholder="Profitez de 20% de réduction sur votre première commande..."
          className="min-h-[80px]"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Valide du</Label>
          <Input
            type="date"
            value={block.data.validFrom || ""}
            onChange={(e) => updateData("validFrom", e.target.value)}
            className="h-10"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Valide jusqu'au</Label>
          <Input
            type="date"
            value={block.data.validUntil || ""}
            onChange={(e) => updateData("validUntil", e.target.value)}
            className="h-10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Code promo (optionnel)</Label>
        <Input
          value={block.data.code || ""}
          onChange={(e) => updateData("code", e.target.value)}
          placeholder="BIENVENUE20"
          className="h-10"
        />
      </div>
    </div>
  );
}

function InfoBlockEditor({ 
  block, 
  onChange 
}: { 
  block: InfoBlock; 
  onChange: (block: InfoBlock) => void;
}) {
  const updateData = (field: keyof InfoBlock["data"], value: string) => {
    onChange({
      ...block,
      data: { ...block.data, [field]: value },
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Titre</Label>
        <Input
          value={block.data.title}
          onChange={(e) => updateData("title", e.target.value)}
          placeholder="À propos"
          className="h-10"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Contenu</Label>
        <Textarea
          value={block.data.content}
          onChange={(e) => updateData("content", e.target.value)}
          placeholder="Entrez votre texte ici..."
          className="min-h-[100px]"
        />
      </div>
    </div>
  );
}

function DividerBlockEditor({ 
  block, 
  onChange 
}: { 
  block: DividerBlock; 
  onChange: (block: DividerBlock) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Style du séparateur</Label>
        <Select
          value={block.data.style || "line"}
          onValueChange={(value) => onChange({
            ...block,
            data: { ...block.data, style: value as DividerBlock["data"]["style"] },
          })}
        >
          <SelectTrigger className="h-10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="line">Ligne</SelectItem>
            <SelectItem value="dots">Points</SelectItem>
            <SelectItem value="diamond">Diamant</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

// ============================================================
// SINGLE BLOCK WRAPPER
// ============================================================

interface BlockItemProps {
  block: CardBlock;
  onChange: (block: CardBlock) => void;
  onDelete: () => void;
}

function BlockItem({ block, onChange, onDelete }: BlockItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = blockIcons[block.type];
  const info = blockTypeInfo[block.type];

  const toggleVisibility = () => {
    onChange({ ...block, visible: !block.visible });
  };

  const renderEditor = () => {
    switch (block.type) {
      case "identity":
        return <IdentityBlockEditor block={block as IdentityBlock} onChange={onChange as any} />;
      case "wifi":
        return <WifiBlockEditor block={block as WifiBlock} onChange={onChange as any} />;
      case "location":
        return <LocationBlockEditor block={block as LocationBlock} onChange={onChange as any} />;
      case "action":
        return <ActionBlockEditor block={block as ActionBlock} onChange={onChange as any} />;
      case "social":
        return <SocialBlockEditor block={block as SocialBlock} onChange={onChange as any} />;
      case "offer":
        return <OfferBlockEditor block={block as OfferBlock} onChange={onChange as any} />;
      case "info":
        return <InfoBlockEditor block={block as InfoBlock} onChange={onChange as any} />;
      case "divider":
        return <DividerBlockEditor block={block as DividerBlock} onChange={onChange as any} />;
      default:
        return null;
    }
  };

  return (
    <Reorder.Item
      value={block}
      id={block.id}
      className="touch-none"
    >
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={cn(
          "border rounded-xl overflow-hidden transition-all",
          block.visible 
            ? "bg-card border-border" 
            : "bg-muted/30 border-border/50 opacity-60"
        )}
      >
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex items-center gap-2 p-3">
            {/* Drag handle */}
            <div className="cursor-grab active:cursor-grabbing touch-none p-1">
              <GripVertical size={16} className="text-muted-foreground" />
            </div>

            {/* Icon */}
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center",
              block.visible ? "bg-primary/10" : "bg-muted"
            )}>
              <Icon size={16} className={block.visible ? "text-primary" : "text-muted-foreground"} />
            </div>

            {/* Label */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{info.label}</p>
              <p className="text-xs text-muted-foreground truncate">{info.description}</p>
            </div>

            {/* Actions */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={toggleVisibility}
            >
              {block.visible ? (
                <Eye size={14} className="text-muted-foreground" />
              ) : (
                <EyeOff size={14} className="text-muted-foreground" />
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={onDelete}
            >
              <Trash2 size={14} />
            </Button>

            <CollapsibleTrigger asChild>
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
                {isOpen ? (
                  <ChevronUp size={14} className="text-muted-foreground" />
                ) : (
                  <ChevronDown size={14} className="text-muted-foreground" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent>
            <div className="px-4 pb-4 pt-2 border-t border-border/50">
              {renderEditor()}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </motion.div>
    </Reorder.Item>
  );
}

// ============================================================
// ADD BLOCK MENU
// ============================================================

interface AddBlockMenuProps {
  onAdd: (type: BlockType, actionType?: ActionType) => void;
  existingTypes: BlockType[];
}

function AddBlockMenu({ onAdd, existingTypes }: AddBlockMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const hasIdentity = existingTypes.includes("identity");

  const blockOptions: { type: BlockType; actionType?: ActionType; label: string; icon: React.ElementType }[] = [
    ...(hasIdentity ? [] : [{ type: "identity" as BlockType, label: "Identité", icon: User }]),
    { type: "action", actionType: "call", label: "Téléphone", icon: Phone },
    { type: "action", actionType: "whatsapp", label: "WhatsApp", icon: MessageCircle },
    { type: "action", actionType: "email", label: "Email", icon: Mail },
    { type: "action", actionType: "website", label: "Site web", icon: Globe },
    { type: "location", label: "Localisation", icon: MapPin },
    { type: "wifi", label: "WiFi", icon: Wifi },
    { type: "social", label: "Réseaux sociaux", icon: Share2 },
    { type: "offer", label: "Offre spéciale", icon: Gift },
    { type: "info", label: "Information", icon: Info },
    { type: "divider", label: "Séparateur", icon: Minus },
  ];

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        className="w-full h-12 border-dashed"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Plus size={16} className="mr-2" />
        Ajouter un bloc
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 z-10 mt-2 bg-popover border border-border rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-2 max-h-[300px] overflow-y-auto">
              <div className="grid grid-cols-2 gap-2">
                {blockOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={`${option.type}-${option.actionType || ""}`}
                      type="button"
                      className="flex items-center gap-2 p-3 rounded-lg hover:bg-muted transition-colors text-left"
                      onClick={() => {
                        onAdd(option.type, option.actionType);
                        setIsOpen(false);
                      }}
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon size={14} className="text-primary" />
                      </div>
                      <span className="text-sm font-medium">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================
// MAIN BLOCK EDITOR
// ============================================================

export function BlockEditor({ blocks, onChange, className }: BlockEditorProps) {
  const handleReorder = (newBlocks: CardBlock[]) => {
    const reordered = newBlocks.map((block, index) => ({ ...block, order: index }));
    onChange(reordered);
  };

  const handleBlockChange = useCallback((updatedBlock: CardBlock) => {
    onChange(blocks.map(b => b.id === updatedBlock.id ? updatedBlock : b));
  }, [blocks, onChange]);

  const handleDeleteBlock = useCallback((blockId: string) => {
    onChange(blocks.filter(b => b.id !== blockId));
  }, [blocks, onChange]);

  const handleAddBlock = useCallback((type: BlockType, actionType?: ActionType) => {
    let newBlock: CardBlock;
    const order = blocks.length;

    switch (type) {
      case "identity":
        newBlock = { ...createIdentityBlock(), order };
        break;
      case "wifi":
        newBlock = { ...createWifiBlock(), order };
        break;
      case "location":
        newBlock = { ...createLocationBlock(), order };
        break;
      case "action":
        newBlock = { ...createActionBlock(actionType || "call"), order };
        break;
      case "social":
        newBlock = { ...createSocialBlock(), order };
        break;
      case "offer":
        newBlock = { ...createOfferBlock(), order };
        break;
      case "info":
        newBlock = { ...createInfoBlock(), order };
        break;
      case "divider":
        newBlock = { ...createDividerBlock(), order };
        break;
      default:
        return;
    }

    onChange([...blocks, newBlock]);
  }, [blocks, onChange]);

  const existingTypes = blocks.map(b => b.type);

  return (
    <div className={cn("space-y-4", className)}>
      <Reorder.Group
        axis="y"
        values={blocks}
        onReorder={handleReorder}
        className="space-y-3"
      >
        <AnimatePresence mode="popLayout">
          {blocks.map((block) => (
            <BlockItem
              key={block.id}
              block={block}
              onChange={handleBlockChange}
              onDelete={() => handleDeleteBlock(block.id)}
            />
          ))}
        </AnimatePresence>
      </Reorder.Group>

      <AddBlockMenu onAdd={handleAddBlock} existingTypes={existingTypes} />
    </div>
  );
}

export default BlockEditor;
