/**
 * Visual Block Editor - Premium Drag & Drop Interface
 * 
 * Canvas-style editor with:
 * - Drag & drop block reordering
 * - Live preview synchronization
 * - Premium template switching
 * - Real-time customization
 */

import { useState, useCallback } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import {
  Plus, Trash2, GripVertical, Eye, EyeOff, ChevronDown, ChevronUp,
  User, Wifi, MapPin, Zap, Share2, Gift, Info, Minus, Star,
  Layers, Palette, Layout, Sparkles, Move, Copy, Settings2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  CardBlock,
  BlockType,
  blockTypeInfo,
  createIdentityBlock,
  createWifiBlock,
  createLocationBlock,
  createActionBlock,
  createSocialBlock,
  createOfferBlock,
  createInfoBlock,
  createDividerBlock,
} from "@/lib/cardBlocks";

// ============================================================
// TYPES
// ============================================================

interface VisualBlockEditorProps {
  blocks: CardBlock[];
  onChange: (blocks: CardBlock[]) => void;
  selectedTemplate: string;
  onTemplateChange: (template: string) => void;
  className?: string;
}

interface BlockPaletteItem {
  type: BlockType;
  icon: React.ElementType;
  label: string;
  description: string;
  color: string;
  premium?: boolean;
}

// ============================================================
// BLOCK PALETTE CONFIG
// ============================================================

const blockPalette: BlockPaletteItem[] = [
  {
    type: "identity",
    icon: User,
    label: "Identité",
    description: "Photo, nom, fonction",
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
  {
    type: "action",
    icon: Zap,
    label: "Action",
    description: "Appel, email, lien",
    color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  },
  {
    type: "social",
    icon: Share2,
    label: "Réseaux",
    description: "LinkedIn, Instagram...",
    color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  },
  {
    type: "wifi",
    icon: Wifi,
    label: "Wi-Fi",
    description: "QR code connexion auto",
    color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  },
  {
    type: "location",
    icon: MapPin,
    label: "Localisation",
    description: "Adresse avec carte",
    color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  {
    type: "offer",
    icon: Gift,
    label: "Offre",
    description: "Promotion, code promo",
    color: "bg-rose-500/20 text-rose-400 border-rose-500/30",
    premium: true,
  },
  {
    type: "info",
    icon: Info,
    label: "Info",
    description: "Texte personnalisé",
    color: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  },
  {
    type: "divider",
    icon: Minus,
    label: "Séparateur",
    description: "Espace visuel",
    color: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  },
  {
    type: "googleReviews",
    icon: Star,
    label: "Avis Google",
    description: "Note et lien avis",
    color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    premium: true,
  },
];

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
  googleReviews: Star,
};

// ============================================================
// DRAGGABLE BLOCK ITEM
// ============================================================

interface DraggableBlockProps {
  block: CardBlock;
  isSelected: boolean;
  onSelect: () => void;
  onToggleVisibility: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

function DraggableBlock({
  block,
  isSelected,
  onSelect,
  onToggleVisibility,
  onDuplicate,
  onDelete,
}: DraggableBlockProps) {
  const Icon = blockIcons[block.type];
  const info = blockTypeInfo[block.type] || { label: block.type, icon: "info", description: "" };
  const paletteItem = blockPalette.find((p) => p.type === block.type);

  return (
    <Reorder.Item
      value={block}
      id={block.id}
      className={cn(
        "relative group cursor-grab active:cursor-grabbing",
        isSelected && "z-10"
      )}
      whileDrag={{ scale: 1.02, boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}
    >
      <motion.div
        onClick={onSelect}
        className={cn(
          "flex items-center gap-3 p-3 rounded-xl border transition-all duration-200",
          "bg-card/80 backdrop-blur-sm",
          isSelected
            ? "border-primary ring-2 ring-primary/20"
            : "border-border/50 hover:border-border",
          !block.visible && "opacity-50"
        )}
        layout
      >
        {/* Drag Handle */}
        <div className="flex-shrink-0 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors">
          <GripVertical size={16} />
        </div>

        {/* Block Icon */}
        <div
          className={cn(
            "w-9 h-9 rounded-lg flex items-center justify-center border",
            paletteItem?.color || "bg-muted"
          )}
        >
          <Icon size={16} />
        </div>

        {/* Block Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {info.label}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {info.description}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleVisibility();
                  }}
                >
                  {block.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                {block.visible ? "Masquer" : "Afficher"}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicate();
                  }}
                >
                  <Copy size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Dupliquer</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                >
                  <Trash2 size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Supprimer</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </motion.div>
    </Reorder.Item>
  );
}

// ============================================================
// ADD BLOCK PALETTE
// ============================================================

interface AddBlockPaletteProps {
  onAddBlock: (type: BlockType) => void;
  existingBlockTypes: BlockType[];
}

function AddBlockPalette({ onAddBlock, existingBlockTypes }: AddBlockPaletteProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-3">
      <Button
        variant="outline"
        className="w-full gap-2 border-dashed border-2 h-11"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Plus size={16} />
        <span>Ajouter un bloc</span>
        <motion.span
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="ml-auto"
        >
          <ChevronDown size={16} />
        </motion.span>
      </Button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-2 p-1">
              {blockPalette.map((item) => {
                const isDisabled =
                  item.type === "identity" &&
                  existingBlockTypes.includes("identity");

                return (
                  <motion.button
                    key={item.type}
                    whileHover={{ scale: isDisabled ? 1 : 1.02 }}
                    whileTap={{ scale: isDisabled ? 1 : 0.98 }}
                    onClick={() => {
                      if (!isDisabled) {
                        onAddBlock(item.type);
                        setIsExpanded(false);
                      }
                    }}
                    disabled={isDisabled}
                    className={cn(
                      "relative flex flex-col items-center gap-2 p-3 rounded-xl border transition-all",
                      "bg-card hover:bg-muted/50",
                      isDisabled
                        ? "opacity-40 cursor-not-allowed"
                        : "cursor-pointer",
                      item.color
                    )}
                  >
                    {item.premium && (
                      <Badge
                        variant="secondary"
                        className="absolute -top-1 -right-1 px-1.5 py-0 text-[10px] bg-amber-500/20 text-amber-400 border-amber-500/30"
                      >
                        PRO
                      </Badge>
                    )}
                    <item.icon size={20} />
                    <div className="text-center">
                      <p className="text-xs font-medium">{item.label}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export function VisualBlockEditor({
  blocks,
  onChange,
  selectedTemplate,
  onTemplateChange,
  className,
}: VisualBlockEditorProps) {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  // Handlers
  const handleReorder = useCallback(
    (newBlocks: CardBlock[]) => {
      // Preserve order property
      const reorderedBlocks = newBlocks.map((block, index) => ({
        ...block,
        order: index,
      }));
      onChange(reorderedBlocks);
    },
    [onChange]
  );

  const handleAddBlock = useCallback(
    (type: BlockType) => {
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
          newBlock = createActionBlock("call");
          break;
        case "social":
          newBlock = createSocialBlock([]);
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
      onChange([...blocks, newBlock]);
      setSelectedBlockId(newBlock.id);
    },
    [blocks, onChange]
  );

  const handleToggleVisibility = useCallback(
    (blockId: string) => {
      onChange(
        blocks.map((b) =>
          b.id === blockId ? { ...b, visible: !b.visible } : b
        )
      );
    },
    [blocks, onChange]
  );

  const handleDuplicate = useCallback(
    (blockId: string) => {
      const blockToDuplicate = blocks.find((b) => b.id === blockId);
      if (!blockToDuplicate) return;

      const duplicatedBlock: CardBlock = {
        ...blockToDuplicate,
        id: crypto.randomUUID(),
        order: blocks.length,
      };

      onChange([...blocks, duplicatedBlock]);
      setSelectedBlockId(duplicatedBlock.id);
    },
    [blocks, onChange]
  );

  const handleDelete = useCallback(
    (blockId: string) => {
      onChange(blocks.filter((b) => b.id !== blockId));
      if (selectedBlockId === blockId) {
        setSelectedBlockId(null);
      }
    },
    [blocks, onChange, selectedBlockId]
  );

  const existingBlockTypes = blocks.map((b) => b.type);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Layers size={16} className="text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Éditeur Visuel
            </h3>
            <p className="text-xs text-muted-foreground">
              Glissez pour réorganiser
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="text-xs">
          {blocks.length} blocs
        </Badge>
      </div>

      <Separator />

      {/* Blocks List */}
      <ScrollArea className="h-[400px] pr-2">
        <Reorder.Group
          axis="y"
          values={blocks}
          onReorder={handleReorder}
          className="space-y-2"
        >
          <AnimatePresence mode="popLayout">
            {blocks
              .sort((a, b) => a.order - b.order)
              .map((block) => (
                <DraggableBlock
                  key={block.id}
                  block={block}
                  isSelected={selectedBlockId === block.id}
                  onSelect={() => setSelectedBlockId(block.id)}
                  onToggleVisibility={() => handleToggleVisibility(block.id)}
                  onDuplicate={() => handleDuplicate(block.id)}
                  onDelete={() => handleDelete(block.id)}
                />
              ))}
          </AnimatePresence>
        </Reorder.Group>

        {blocks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
              <Layers size={24} className="text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">
              Aucun bloc pour le moment
            </p>
            <p className="text-xs text-muted-foreground/70">
              Ajoutez des blocs pour personnaliser votre carte
            </p>
          </div>
        )}
      </ScrollArea>

      {/* Add Block Palette */}
      <AddBlockPalette
        onAddBlock={handleAddBlock}
        existingBlockTypes={existingBlockTypes}
      />
    </div>
  );
}

export default VisualBlockEditor;
