/**
 * Premium Card Editor
 * 
 * Production-ready NFC card editor with blocks system.
 * Mobile-first, Apple-level UX, fully modular.
 */

import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useCreateCard, useUpdateCard, useCards, DigitalCard } from "@/hooks/useCards";
import { templateInfo } from "@/components/templates/CardTemplates";
import { PRICING } from "@/lib/pricing";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AITemplateGenerator } from "@/components/AITemplateGenerator";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { 
  ArrowLeft, Save, Plus, Eye, EyeOff, GripVertical, Trash2,
  User, Wifi, MapPin, Zap, Share2, Gift, Info, Minus,
  Phone, Mail, Globe, MessageCircle, ChevronDown, ChevronUp, Copy, Check,
  Wand2, Sparkles
} from "lucide-react";
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
  createHotelWifiBlock,
  createLocationBlock,
  createActionBlock,
  createSocialBlock,
  createOfferBlock,
  createInfoBlock,
  createDividerBlock,
  blockTypeInfo,
  convertLegacyToBlocks,
  convertBlocksToLegacy,
  getVisibleBlocks,
} from "@/lib/cardBlocks";
import { SocialLinksManager } from "@/components/SocialLinksManager";
import { PhotoUpload } from "@/components/PhotoUpload";
import { DynamicCardRenderer } from "@/components/DynamicCardRenderer";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { SocialLink } from "@/lib/socialNetworks";

// Block type icons
const blockIcons: Record<BlockType, React.ElementType> = {
  identity: User,
  wifi: Wifi,
  hotelWifi: Wifi,
  location: MapPin,
  action: Zap,
  social: Share2,
  offer: Gift,
  info: Info,
  divider: Minus,
};

// Individual Block Editors
function IdentityEditor({ block, onChange }: { block: IdentityBlock; onChange: (b: IdentityBlock) => void }) {
  const updateData = (field: keyof IdentityBlock["data"], value: string | null) => {
    onChange({ ...block, data: { ...block.data, [field]: value } });
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

function WifiEditor({ block, onChange }: { block: WifiBlock; onChange: (b: WifiBlock) => void }) {
  const [copied, setCopied] = useState(false);
  const updateData = (field: keyof WifiBlock["data"], value: string) => {
    onChange({ ...block, data: { ...block.data, [field]: value } });
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
          <Button type="button" variant="outline" size="icon" onClick={copyPassword} className="h-10 w-10">
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Type de sécurité</Label>
        <Select value={block.data.security || "WPA2"} onValueChange={(value) => updateData("security", value)}>
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

function LocationEditor({ block, onChange }: { block: LocationBlock; onChange: (b: LocationBlock) => void }) {
  const updateData = (field: keyof LocationBlock["data"], value: string | number | undefined) => {
    onChange({ ...block, data: { ...block.data, [field]: value } });
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
    </div>
  );
}

function ActionEditor({ block, onChange }: { block: ActionBlock; onChange: (b: ActionBlock) => void }) {
  const updateData = (field: keyof ActionBlock["data"], value: string) => {
    onChange({ ...block, data: { ...block.data, [field]: value } });
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
        <Select value={block.data.actionType} onValueChange={(value) => updateData("actionType", value)}>
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
          {block.data.actionType === "email" ? "Email" : block.data.actionType === "website" ? "URL" : "Numéro"}
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

function SocialEditor({ block, onChange }: { block: SocialBlock; onChange: (b: SocialBlock) => void }) {
  const handleLinksChange = (links: SocialLink[]) => {
    onChange({ ...block, data: { ...block.data, links } });
  };

  return (
    <div className="space-y-4">
      <SocialLinksManager value={block.data.links} onChange={handleLinksChange} />
    </div>
  );
}

function OfferEditor({ block, onChange }: { block: OfferBlock; onChange: (b: OfferBlock) => void }) {
  const updateData = (field: keyof OfferBlock["data"], value: string) => {
    onChange({ ...block, data: { ...block.data, [field]: value } });
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
          placeholder="Profitez de 20% de réduction..."
          className="min-h-[80px]"
        />
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

function InfoEditor({ block, onChange }: { block: InfoBlock; onChange: (b: InfoBlock) => void }) {
  const updateData = (field: keyof InfoBlock["data"], value: string) => {
    onChange({ ...block, data: { ...block.data, [field]: value } });
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

function DividerEditor({ block, onChange }: { block: DividerBlock; onChange: (b: DividerBlock) => void }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Style du séparateur</Label>
        <Select
          value={block.data.style || "line"}
          onValueChange={(value) => onChange({ ...block, data: { ...block.data, style: value as any } })}
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

// Block Item Component
function BlockItemCard({
  block,
  onUpdate,
  onDelete,
  onToggleVisibility,
}: {
  block: CardBlock;
  onUpdate: (block: CardBlock) => void;
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = blockIcons[block.type];
  const info = blockTypeInfo[block.type];

  const getBlockTitle = () => {
    if (block.type === "identity") {
      const data = (block as IdentityBlock).data;
      return data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : info.label;
    }
    if (block.type === "wifi") {
      const data = (block as WifiBlock).data;
      return data.ssid || info.label;
    }
    if (block.type === "action") {
      const data = (block as ActionBlock).data;
      return data.label || info.label;
    }
    return info.label;
  };

  const renderEditor = () => {
    switch (block.type) {
      case "identity":
        return <IdentityEditor block={block as IdentityBlock} onChange={(b) => onUpdate(b)} />;
      case "wifi":
        return <WifiEditor block={block as WifiBlock} onChange={(b) => onUpdate(b)} />;
      case "location":
        return <LocationEditor block={block as LocationBlock} onChange={(b) => onUpdate(b)} />;
      case "action":
        return <ActionEditor block={block as ActionBlock} onChange={(b) => onUpdate(b)} />;
      case "social":
        return <SocialEditor block={block as SocialBlock} onChange={(b) => onUpdate(b)} />;
      case "offer":
        return <OfferEditor block={block as OfferBlock} onChange={(b) => onUpdate(b)} />;
      case "info":
        return <InfoEditor block={block as InfoBlock} onChange={(b) => onUpdate(b)} />;
      case "divider":
        return <DividerEditor block={block as DividerBlock} onChange={(b) => onUpdate(b)} />;
      default:
        return null;
    }
  };

  return (
    <Reorder.Item value={block} id={block.id} className="touch-none">
      <motion.div
        layout
        className={cn(
          "bg-surface-1 border border-border/50 rounded-2xl overflow-hidden transition-all",
          !block.visible && "opacity-50"
        )}
      >
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <div className="flex items-center gap-3 p-4">
            <div className="cursor-grab active:cursor-grabbing touch-none">
              <GripVertical size={18} className="text-muted-foreground" />
            </div>
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", "bg-primary/10")}>
              <Icon size={18} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-foreground truncate">{getBlockTitle()}</h4>
              <p className="text-xs text-muted-foreground">{info.description}</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onToggleVisibility(block.id)}
                className="p-2 rounded-lg hover:bg-surface-2 transition-colors"
              >
                {block.visible ? <Eye size={16} className="text-muted-foreground" /> : <EyeOff size={16} className="text-muted-foreground" />}
              </button>
              {block.type !== "identity" && (
                <button
                  onClick={() => onDelete(block.id)}
                  className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 size={16} className="text-destructive" />
                </button>
              )}
              <CollapsibleTrigger asChild>
                <button className="p-2 rounded-lg hover:bg-surface-2 transition-colors">
                  {isExpanded ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
                </button>
              </CollapsibleTrigger>
            </div>
          </div>
          <CollapsibleContent>
            <div className="px-4 pb-4 border-t border-border/30 pt-4">{renderEditor()}</div>
          </CollapsibleContent>
        </Collapsible>
      </motion.div>
    </Reorder.Item>
  );
}

// Add Block Sheet
function AddBlockSheet({
  onAdd,
  existingBlocks,
}: {
  onAdd: (type: BlockType, subtype?: string) => void;
  existingBlocks: CardBlock[];
}) {
  const [open, setOpen] = useState(false);
  const hasIdentity = existingBlocks.some((b) => b.type === "identity");

  const blockOptions: { type: BlockType; subtype?: string; label: string; description: string; icon: React.ElementType }[] = [
    ...(hasIdentity ? [] : [{ type: "identity" as BlockType, label: "Identité", description: "Photo, nom, fonction", icon: User }]),
    { type: "action", subtype: "call", label: "Téléphone", description: "Appel direct", icon: Phone },
    { type: "action", subtype: "whatsapp", label: "WhatsApp", description: "Message instantané", icon: MessageCircle },
    { type: "action", subtype: "sms", label: "SMS", description: "Envoyer un message", icon: MessageCircle },
    { type: "action", subtype: "email", label: "Email", description: "Contact professionnel", icon: Mail },
    { type: "action", subtype: "website", label: "Site web", description: "Lien vers votre site", icon: Globe },
    { type: "wifi", label: "WiFi", description: "Partager un accès WiFi", icon: Wifi },
    { type: "location", label: "Localisation", description: "Adresse et GPS", icon: MapPin },
    { type: "social", label: "Réseaux sociaux", description: "Instagram, LinkedIn...", icon: Share2 },
    { type: "offer", label: "Offre spéciale", description: "Promotion, code promo", icon: Gift },
    { type: "info", label: "Information", description: "Texte libre", icon: Info },
    { type: "divider", label: "Séparateur", description: "Ligne de séparation", icon: Minus },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full gap-2 h-12 border-dashed">
          <Plus size={18} />
          Ajouter une action
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[70vh] rounded-t-3xl">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl">Ajouter un élément</SheetTitle>
        </SheetHeader>
        <div className="grid grid-cols-2 gap-3 overflow-y-auto max-h-[calc(70vh-120px)]">
          {blockOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={`${option.type}-${option.subtype || ""}`}
                onClick={() => {
                  onAdd(option.type, option.subtype);
                  setOpen(false);
                }}
                className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-surface-1 border border-border/50 hover:border-primary/50 hover:bg-surface-2 transition-all text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon size={22} className="text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground">{option.label}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{option.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Main Editor Component
export default function CardEditor() {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const templateParam = searchParams.get("template");
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem: addToCart } = useCart();
  const { data: cards = [] } = useCards();
  const createCard = useCreateCard();
  const updateCard = useUpdateCard();

  const [blocks, setBlocks] = useState<CardBlock[]>([]);
  const [template, setTemplate] = useState<string>(templateParam || "production");
  const [showPreview, setShowPreview] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);

  // Handle AI generated template - Maps all AI fields to editor blocks
  const handleAITemplateGenerated = useCallback((result: { type: string; template: Record<string, any> }) => {
    const templateData = result.template;
    const templateType = result.type;
    const newBlocks: CardBlock[] = [];
    let order = 0;

    // ========== HOTEL TEMPLATE ==========
    if (templateType === "hotel") {
      // Identity block with hotel info
      newBlocks.push({
        ...createIdentityBlock({
          firstName: templateData.hotelName || "",
          lastName: "",
          title: templateData.conciergeRole || "Concierge",
          company: templateData.hotelCategory || "",
          tagline: templateData.hotelTagline || "",
        }),
        order: order++,
      });

      // Concierge name as info block
      if (templateData.conciergeName) {
        newBlocks.push({
          ...createInfoBlock({
            title: "Votre Concierge",
            content: `${templateData.conciergeName} - ${templateData.conciergeRole || "Concierge"}`,
            icon: "user",
          }),
          order: order++,
        });
      }

      // Reception phone
      if (templateData.receptionPhone) {
        newBlocks.push({
          ...createActionBlock("call", {
            label: "Réception",
            subtitle: "Appeler la réception",
            value: templateData.receptionPhone,
          }),
          order: order++,
        });
        newBlocks.push({
          ...createActionBlock("whatsapp", {
            label: "WhatsApp",
            subtitle: "Message instantané",
            value: templateData.receptionPhone,
          }),
          order: order++,
        });
      }

      // WiFi block
      if (templateData.wifiSsid) {
        newBlocks.push({
          ...createHotelWifiBlock({
            ssid: templateData.wifiSsid,
            password: templateData.wifiPassword || "",
            security: "WPA2",
            hotelName: templateData.hotelName,
            welcomeMessage: `Bienvenue au ${templateData.hotelName}`,
          }),
          order: order++,
        });
      }

      // Location
      if (templateData.address) {
        newBlocks.push({
          ...createLocationBlock({
            label: "Notre adresse",
            address: templateData.address,
          }),
          order: order++,
        });
      }

      // Daily offer
      if (templateData.dailyOffer) {
        newBlocks.push({
          ...createOfferBlock({
            title: templateData.dailyOffer.title || "Offre du jour",
            description: templateData.dailyOffer.description || "",
            validUntil: templateData.dailyOffer.validUntil,
          }),
          order: order++,
        });
      }

      // Places to visit
      if (templateData.placesToVisit && Array.isArray(templateData.placesToVisit)) {
        for (const place of templateData.placesToVisit) {
          newBlocks.push({
            ...createInfoBlock({
              title: place.name,
              content: `À ${place.distance}`,
              icon: "map-pin",
            }),
            order: order++,
          });
        }
      }
    }
    // ========== BUSINESS TEMPLATE ==========
    else if (templateType === "business") {
      // Identity block
      newBlocks.push({
        ...createIdentityBlock({
          firstName: templateData.firstName || "",
          lastName: templateData.lastName || "",
          title: templateData.title || "",
          company: templateData.company || "",
          tagline: templateData.tagline || "",
        }),
        order: order++,
      });

      // Phone actions
      if (templateData.phone) {
        newBlocks.push({
          ...createActionBlock("call", {
            label: "Appeler",
            subtitle: "Appel direct",
            value: templateData.phone,
          }),
          order: order++,
        });
        newBlocks.push({
          ...createActionBlock("whatsapp", {
            label: "WhatsApp",
            subtitle: "Message instantané",
            value: templateData.phone,
          }),
          order: order++,
        });
      }

      // Email
      if (templateData.email) {
        newBlocks.push({
          ...createActionBlock("email", {
            label: "Email",
            subtitle: "Contact professionnel",
            value: templateData.email,
          }),
          order: order++,
        });
      }

      // Website
      if (templateData.website) {
        newBlocks.push({
          ...createActionBlock("website", {
            label: "Site web",
            subtitle: "Visiter le site",
            value: templateData.website,
          }),
          order: order++,
        });
      }

      // Location
      if (templateData.location) {
        newBlocks.push({
          ...createLocationBlock({
            label: "Localisation",
            address: templateData.location,
          }),
          order: order++,
        });
      }

      // Social links
      const socialLinks: SocialLink[] = [];
      if (templateData.linkedin) {
        socialLinks.push({ id: `linkedin-${Date.now()}`, networkId: "linkedin", value: templateData.linkedin });
      }
      if (socialLinks.length > 0) {
        newBlocks.push({
          ...createSocialBlock(socialLinks),
          order: order++,
        });
      }
    }
    // ========== TOURISM TEMPLATE ==========
    else if (templateType === "tourism") {
      // Identity block
      newBlocks.push({
        ...createIdentityBlock({
          firstName: templateData.businessName || "",
          lastName: "",
          title: templateData.guideName || "",
          company: templateData.category || "",
          tagline: templateData.tagline || "",
        }),
        order: order++,
      });

      // Phone
      if (templateData.phone) {
        newBlocks.push({
          ...createActionBlock("call", {
            label: "Appeler",
            subtitle: "Réservation directe",
            value: templateData.phone,
          }),
          order: order++,
        });
      }

      // WhatsApp (separate if provided)
      if (templateData.whatsapp) {
        newBlocks.push({
          ...createActionBlock("whatsapp", {
            label: "WhatsApp",
            subtitle: "Message instantané",
            value: templateData.whatsapp,
          }),
          order: order++,
        });
      }

      // Email
      if (templateData.email) {
        newBlocks.push({
          ...createActionBlock("email", {
            label: "Email",
            subtitle: "Contact",
            value: templateData.email,
          }),
          order: order++,
        });
      }

      // Website
      if (templateData.website) {
        newBlocks.push({
          ...createActionBlock("website", {
            label: "Site web",
            subtitle: "Réserver en ligne",
            value: templateData.website,
          }),
          order: order++,
        });
      }

      // Location
      if (templateData.location) {
        newBlocks.push({
          ...createLocationBlock({
            label: "Point de départ",
            address: templateData.location,
          }),
          order: order++,
        });
      }

      // Tours as info blocks
      if (templateData.tours && Array.isArray(templateData.tours)) {
        for (const tour of templateData.tours) {
          newBlocks.push({
            ...createInfoBlock({
              title: tour.name,
              content: `${tour.duration} • ${tour.price}`,
              icon: "compass",
            }),
            order: order++,
          });
        }
      }

      // Languages
      if (templateData.languages && Array.isArray(templateData.languages)) {
        newBlocks.push({
          ...createInfoBlock({
            title: "Langues parlées",
            content: templateData.languages.join(", "),
            icon: "globe",
          }),
          order: order++,
        });
      }

      // Review links
      const socialLinks: SocialLink[] = [];
      if (templateData.googleReviewsUrl) {
        socialLinks.push({ id: `google-${Date.now()}`, networkId: "google", value: templateData.googleReviewsUrl });
      }
      if (templateData.tripAdvisorUrl) {
        socialLinks.push({ id: `tripadvisor-${Date.now()}`, networkId: "tripadvisor", value: templateData.tripAdvisorUrl });
      }
      if (socialLinks.length > 0) {
        newBlocks.push({
          ...createSocialBlock(socialLinks),
          order: order++,
        });
      }
    }
    // ========== FALLBACK ==========
    else {
      // Generic fallback for unknown template types
      newBlocks.push({
        ...createIdentityBlock({
          firstName: templateData.firstName || templateData.name || "",
          lastName: templateData.lastName || "",
          title: templateData.title || "",
          company: templateData.company || "",
          tagline: templateData.tagline || "",
        }),
        order: order++,
      });
    }

    setBlocks(newBlocks.length > 0 ? newBlocks : [createIdentityBlock()]);
    setShowAIGenerator(false);
    toast.success("Template IA appliqué ! Personnalisez les champs.");
  }, []);

  // Get template name for display
  const getTemplateName = (templateId: string) => {
    const info = templateInfo.find(t => t.id === templateId);
    return info?.name || "IWASP Production";
  };

  // Update template when URL param changes
  useEffect(() => {
    if (templateParam && !editId) {
      setTemplate(templateParam);
    }
  }, [templateParam, editId]);

  // Initialize with default identity block
  useEffect(() => {
    if (blocks.length === 0 && !editId) {
      setBlocks([createIdentityBlock()]);
    }
  }, []);

  // Load existing card data
  useEffect(() => {
    if (editId && cards.length > 0) {
      const card = cards.find((c) => c.id === editId);
      if (card) {
        setTemplate(card.template || "production");

        // If card has blocks, use them
        if (card.blocks && Array.isArray(card.blocks) && card.blocks.length > 0) {
          setBlocks(card.blocks);
        } else {
          // Convert legacy data to blocks
          const legacyBlocks = convertLegacyToBlocks({
            firstName: card.first_name,
            lastName: card.last_name,
            title: card.title || undefined,
            company: card.company || undefined,
            tagline: card.tagline || undefined,
            photoUrl: card.photo_url,
            logoUrl: card.logo_url,
            phone: card.phone || undefined,
            email: card.email || undefined,
            location: card.location || undefined,
            website: card.website || undefined,
            linkedin: card.linkedin || undefined,
            instagram: card.instagram || undefined,
            twitter: card.twitter || undefined,
            socialLinks: card.social_links || undefined,
          });
          setBlocks(legacyBlocks);
        }
      }
    }
  }, [editId, cards]);

  // Add a new block
  const handleAddBlock = useCallback(
    (type: BlockType, subtype?: string) => {
      let newBlock: CardBlock;

      switch (type) {
        case "identity":
          newBlock = createIdentityBlock();
          break;
        case "wifi":
          newBlock = createWifiBlock();
          break;
        case "location":
          newBlock = createLocationBlock();
          break;
        case "action":
          newBlock = createActionBlock((subtype as ActionType) || "call");
          break;
        case "social":
          newBlock = createSocialBlock();
          break;
        case "offer":
          newBlock = createOfferBlock();
          break;
        case "info":
          newBlock = createInfoBlock();
          break;
        case "divider":
          newBlock = createDividerBlock();
          break;
        default:
          return;
      }

      newBlock.order = blocks.length;
      setBlocks((prev) => [...prev, newBlock]);
    },
    [blocks.length]
  );

  // Update a block
  const handleUpdateBlock = useCallback((updatedBlock: CardBlock) => {
    setBlocks((prev) => prev.map((b) => (b.id === updatedBlock.id ? updatedBlock : b)));
  }, []);

  // Delete a block
  const handleDeleteBlock = useCallback((id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  // Toggle visibility
  const handleToggleVisibility = useCallback((id: string) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, visible: !b.visible } : b)));
  }, []);

  // Reorder blocks
  const handleReorder = useCallback((newOrder: CardBlock[]) => {
    const reordered = newOrder.map((block, index) => ({ ...block, order: index }));
    setBlocks(reordered);
  }, []);

  // Save card and optionally add to cart
  const handleSave = async (addToCartAfter: boolean = false) => {
    const identityBlock = blocks.find((b) => b.type === "identity") as IdentityBlock | undefined;
    if (!identityBlock || !identityBlock.data.firstName || !identityBlock.data.lastName) {
      toast.error("Veuillez renseigner au moins un prénom et un nom");
      return;
    }

    const legacyData = convertBlocksToLegacy(blocks);
    const cardName = `${legacyData.firstName} ${legacyData.lastName}`;

    try {
      if (editId) {
        await updateCard.mutateAsync({
          id: editId,
          data: {
            first_name: legacyData.firstName,
            last_name: legacyData.lastName,
            title: legacyData.title || null,
            company: legacyData.company || null,
            email: legacyData.email || null,
            phone: legacyData.phone || null,
            location: legacyData.location || null,
            website: legacyData.website || null,
            linkedin: legacyData.linkedin || null,
            instagram: legacyData.instagram || null,
            twitter: legacyData.twitter || null,
            tagline: legacyData.tagline || null,
            photo_url: legacyData.photoUrl || null,
            logo_url: legacyData.logoUrl || null,
            template,
            social_links: legacyData.socialLinks || [],
            blocks,
          } as any,
        });
        navigate("/dashboard");
      } else {
        const newCard = await createCard.mutateAsync({
          first_name: legacyData.firstName,
          last_name: legacyData.lastName,
          title: legacyData.title,
          company: legacyData.company,
          email: legacyData.email,
          phone: legacyData.phone,
          location: legacyData.location,
          website: legacyData.website,
          linkedin: legacyData.linkedin,
          instagram: legacyData.instagram,
          twitter: legacyData.twitter,
          tagline: legacyData.tagline,
          photo_url: legacyData.photoUrl || undefined,
          logo_url: legacyData.logoUrl || undefined,
          template,
          social_links: legacyData.socialLinks,
          blocks,
        });

        if (addToCartAfter) {
          // Add to cart and redirect to cart
          addToCart({
            templateId: template,
            templateName: getTemplateName(template),
            cardName,
            quantity: 1,
            unitPriceCents: PRICING.b2c.single,
            blocks,
            photoUrl: legacyData.photoUrl,
            logoUrl: legacyData.logoUrl,
          });
          toast.success("Carte ajoutée au panier !");
          navigate("/cart");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (error) {
      // Error handled by mutation
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-24 lg:pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <motion.div className="mb-6" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <button
              onClick={() => navigate("/dashboard")}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft size={18} />
              Retour
            </button>
            <h1 className="font-display text-2xl md:text-3xl font-bold">{editId ? "Modifier la carte" : "Créer une carte"}</h1>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6 lg:gap-12">
            {/* Editor Panel */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <Card variant="premium" className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-semibold text-lg">Éléments de la carte</h2>
                  <Button variant="ghost" size="sm" onClick={() => setShowPreview(!showPreview)} className="lg:hidden">
                    <Eye size={18} className="mr-2" />
                    {showPreview ? "Masquer" : "Aperçu"}
                  </Button>
                </div>

                {/* AI Generator Button */}
                <Button
                  variant="outline"
                  onClick={() => setShowAIGenerator(true)}
                  className="w-full mb-4 h-14 border-dashed border-2 border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/10 hover:border-purple-500/50 transition-all"
                >
                  <Wand2 className="w-5 h-5 mr-3 text-purple-500" />
                  <span className="font-medium text-purple-400">Générer avec l'IA</span>
                  <Sparkles className="w-4 h-4 ml-2 text-purple-400" />
                </Button>

                <Reorder.Group axis="y" values={blocks} onReorder={handleReorder} className="space-y-3">
                  <AnimatePresence initial={false}>
                    {blocks.map((block) => (
                      <BlockItemCard
                        key={block.id}
                        block={block}
                        onUpdate={handleUpdateBlock}
                        onDelete={handleDeleteBlock}
                        onToggleVisibility={handleToggleVisibility}
                      />
                    ))}
                  </AnimatePresence>
                </Reorder.Group>

                <div className="mt-4">
                  <AddBlockSheet onAdd={handleAddBlock} existingBlocks={blocks} />
                </div>
              </Card>
            </motion.div>

            {/* Preview Panel - Desktop */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="hidden lg:block lg:sticky lg:top-24 self-start"
            >
              <div className="text-center mb-4">
                <span className="text-sm text-muted-foreground">Aperçu en direct</span>
              </div>
              <div className="flex justify-center">
                <DynamicCardRenderer blocks={getVisibleBlocks(blocks)} theme="dark" showWalletButtons={true} />
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Mobile Preview Sheet */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            className="fixed inset-0 z-50 bg-background lg:hidden overflow-auto"
          >
            <div className="sticky top-0 bg-background/80 backdrop-blur-xl border-b border-border/50 p-4 flex items-center justify-between">
              <h3 className="font-semibold">Aperçu</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)}>
                Fermer
              </Button>
            </div>
            <div className="p-6 flex justify-center">
              <DynamicCardRenderer blocks={getVisibleBlocks(blocks)} theme="dark" showWalletButtons={true} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Save Button - Mobile */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-xl border-t border-border/50 lg:hidden z-40"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
      >
        <Button 
          variant="chrome" 
          className="w-full h-12" 
          onClick={() => handleSave(!editId)} 
          disabled={createCard.isPending || updateCard.isPending}
        >
          {createCard.isPending || updateCard.isPending ? (
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full border-2 border-background/30 border-t-background animate-spin" />
              {editId ? "Enregistrement..." : "Ajout au panier..."}
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Save size={18} />
              {editId ? "Enregistrer" : "Créer et ajouter au panier"}
            </span>
          )}
        </Button>
      </motion.div>

      {/* Desktop Save Button */}
      <div className="hidden lg:block fixed bottom-8 right-8 z-40">
        <Button
          variant="chrome"
          size="lg"
          className="shadow-2xl shadow-primary/20"
          onClick={() => handleSave(!editId)}
          disabled={createCard.isPending || updateCard.isPending}
        >
          {createCard.isPending || updateCard.isPending ? (
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full border-2 border-background/30 border-t-background animate-spin" />
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Save size={18} />
              {editId ? "Enregistrer" : "Créer et ajouter au panier"}
            </span>
          )}
        </Button>
      </div>

      {/* AI Generator Sheet */}
      <Sheet open={showAIGenerator} onOpenChange={setShowAIGenerator}>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl">
          <SheetHeader>
            <SheetTitle>Générateur IA</SheetTitle>
          </SheetHeader>
          <div className="pt-4 overflow-y-auto max-h-[calc(85vh-4rem)]">
            <AITemplateGenerator
              onTemplateGenerated={handleAITemplateGenerated}
              onClose={() => setShowAIGenerator(false)}
            />
          </div>
        </SheetContent>
      </Sheet>

      <Footer />
    </div>
  );
}
