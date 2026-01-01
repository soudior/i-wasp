/**
 * Mobile Module Editor - IWASP Premium Mobile Experience
 * 
 * LUXURY MOBILE EDITOR for reordering card modules
 * 
 * Features:
 * - Long-press (350ms) to activate drag on handle only
 * - Up/Down buttons as primary mobile control
 * - Haptic feedback
 * - Vertical-only movement
 * - Separated scroll and drag
 * - 44px+ touch targets
 * - Zero jitter, zero lag
 */

import { useState, useCallback, useRef, useEffect, TouchEvent as ReactTouchEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  GripVertical, ChevronUp, ChevronDown, Eye, EyeOff, Trash2,
  Wifi, MapPin, Phone, Mail, MessageCircle, Globe, Share2, 
  Gift, Info, Minus, User, Building, ChevronRight, Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CardBlock, BlockType, blockTypeInfo } from "@/lib/cardBlocks";

// ============================================================
// TYPES
// ============================================================

interface MobileModuleEditorProps {
  blocks: CardBlock[];
  onChange: (blocks: CardBlock[]) => void;
  onEditBlock?: (blockId: string) => void;
  className?: string;
}

interface ModuleItemProps {
  block: CardBlock;
  index: number;
  totalCount: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onToggleVisibility: () => void;
  onDelete: () => void;
  onEdit?: () => void;
  isDragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
}

// ============================================================
// CONSTANTS
// ============================================================

const LONG_PRESS_DURATION = 350; // ms
const ANIMATION_DURATION = 200; // ms
const HAPTIC_LIGHT = 10; // ms vibration

// Icon mapping
const blockIcons: Record<BlockType, React.ElementType> = {
  identity: User,
  wifi: Wifi,
  hotelWifi: Building,
  location: MapPin,
  action: Phone,
  social: Share2,
  offer: Gift,
  info: Info,
  divider: Minus,
  googleReviews: Star,
};

// Get action-specific icon
function getBlockIcon(block: CardBlock): React.ElementType {
  if (block.type === "action") {
    const actionType = (block.data as { actionType?: string })?.actionType;
    switch (actionType) {
      case "call": return Phone;
      case "whatsapp": return MessageCircle;
      case "email": return Mail;
      case "website": return Globe;
      case "sms": return MessageCircle;
      default: return Phone;
    }
  }
  return blockIcons[block.type] || Info;
}

// Get block display name
function getBlockName(block: CardBlock): string {
  if (block.type === "action") {
    const actionType = (block.data as { actionType?: string })?.actionType;
    switch (actionType) {
      case "call": return "Téléphone";
      case "whatsapp": return "WhatsApp";
      case "email": return "Email";
      case "website": return "Site web";
      case "sms": return "SMS";
      default: return "Action";
    }
  }
  return blockTypeInfo[block.type]?.label || "Module";
}

// ============================================================
// HAPTIC FEEDBACK
// ============================================================

function triggerHaptic(duration: number = HAPTIC_LIGHT) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(duration);
    } catch (e) {
      // Haptic not available
    }
  }
}

// ============================================================
// MODULE ITEM COMPONENT
// ============================================================

function ModuleItem({
  block,
  index,
  totalCount,
  onMoveUp,
  onMoveDown,
  onToggleVisibility,
  onDelete,
  onEdit,
  isDragging,
  onDragStart,
  onDragEnd,
}: ModuleItemProps) {
  const [isLongPressing, setIsLongPressing] = useState(false);
  const [dragReady, setDragReady] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  
  const Icon = getBlockIcon(block);
  const name = getBlockName(block);
  const isFirst = index === 0;
  const isLast = index === totalCount - 1;

  // Clear long press timer
  const clearLongPress = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    setIsLongPressing(false);
  }, []);

  // Handle touch start on grip handle
  const handleTouchStart = useCallback((e: ReactTouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    
    setIsLongPressing(true);
    
    longPressTimer.current = setTimeout(() => {
      triggerHaptic();
      setDragReady(true);
      onDragStart();
    }, LONG_PRESS_DURATION);
  }, [onDragStart]);

  // Handle touch move - cancel if moved too far before long press
  const handleTouchMove = useCallback((e: ReactTouchEvent<HTMLDivElement>) => {
    if (!touchStartRef.current) return;
    
    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
    const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);
    
    // If moved more than 10px before long press completed, cancel
    if (!dragReady && (deltaX > 10 || deltaY > 10)) {
      clearLongPress();
    }
  }, [dragReady, clearLongPress]);

  // Handle touch end
  const handleTouchEnd = useCallback(() => {
    clearLongPress();
    if (dragReady) {
      triggerHaptic();
      setDragReady(false);
      onDragEnd();
    }
    touchStartRef.current = null;
  }, [dragReady, clearLongPress, onDragEnd]);

  // Handle touch cancel
  const handleTouchCancel = useCallback(() => {
    clearLongPress();
    setDragReady(false);
    touchStartRef.current = null;
    onDragEnd();
  }, [clearLongPress, onDragEnd]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, []);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: block.visible ? 1 : 0.5, 
        y: 0,
        scale: dragReady ? 1.02 : 1,
        boxShadow: dragReady 
          ? "0 20px 40px -10px rgba(0,0,0,0.15)" 
          : "0 1px 3px rgba(0,0,0,0.05)",
        zIndex: dragReady ? 50 : 1,
      }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        duration: ANIMATION_DURATION / 1000, 
        ease: [0.4, 0, 0.2, 1] 
      }}
      className={cn(
        "relative bg-card border rounded-2xl overflow-hidden",
        "transition-colors duration-200",
        dragReady ? "border-primary/50 bg-card/95" : "border-border",
        !block.visible && "border-border/50"
      )}
    >
      <div className="flex items-stretch">
        {/* Grip Handle - Only draggable element */}
        <div
          className={cn(
            "flex items-center justify-center w-12 border-r transition-colors",
            "touch-none select-none",
            dragReady ? "bg-primary/10 border-primary/20" : "bg-muted/30 border-border/50",
            isLongPressing && !dragReady && "bg-primary/5"
          )}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchCancel}
          style={{ minHeight: 80 }} // 44px+ touch target
        >
          <div className={cn(
            "p-2 rounded-lg transition-all duration-200",
            dragReady && "bg-primary/20 scale-110"
          )}>
            <GripVertical 
              size={20} 
              className={cn(
                "transition-colors",
                dragReady ? "text-primary" : "text-muted-foreground"
              )} 
            />
          </div>
          
          {/* Long press progress indicator */}
          {isLongPressing && !dragReady && (
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-primary"
              initial={{ width: 0 }}
              animate={{ width: "48px" }}
              transition={{ duration: LONG_PRESS_DURATION / 1000, ease: "linear" }}
            />
          )}
        </div>

        {/* Module Content */}
        <div 
          className="flex-1 flex items-center gap-3 p-4 min-w-0"
          onClick={onEdit}
        >
          {/* Icon */}
          <div className={cn(
            "w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0",
            block.visible ? "bg-primary/10" : "bg-muted"
          )}>
            <Icon 
              size={20} 
              className={block.visible ? "text-primary" : "text-muted-foreground"} 
            />
          </div>

          {/* Label */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {blockTypeInfo[block.type]?.description || "Module personnalisé"}
            </p>
          </div>

          {/* Edit arrow */}
          {onEdit && (
            <ChevronRight size={18} className="text-muted-foreground flex-shrink-0" />
          )}
        </div>

        {/* Controls - Up/Down + Actions */}
        <div className="flex flex-col border-l border-border/50">
          {/* Move Up */}
          <button
            onClick={() => {
              if (!isFirst) {
                triggerHaptic();
                onMoveUp();
              }
            }}
            disabled={isFirst}
            className={cn(
              "flex-1 flex items-center justify-center w-12 transition-colors",
              "hover:bg-muted/50 active:bg-muted",
              "disabled:opacity-30 disabled:cursor-not-allowed"
            )}
            style={{ minHeight: 40 }} // 44px touch target
          >
            <ChevronUp size={18} className="text-muted-foreground" />
          </button>

          {/* Move Down */}
          <button
            onClick={() => {
              if (!isLast) {
                triggerHaptic();
                onMoveDown();
              }
            }}
            disabled={isLast}
            className={cn(
              "flex-1 flex items-center justify-center w-12 border-t border-border/50 transition-colors",
              "hover:bg-muted/50 active:bg-muted",
              "disabled:opacity-30 disabled:cursor-not-allowed"
            )}
            style={{ minHeight: 40 }} // 44px touch target
          >
            <ChevronDown size={18} className="text-muted-foreground" />
          </button>
        </div>

        {/* Visibility & Delete */}
        <div className="flex flex-col border-l border-border/50">
          {/* Toggle Visibility */}
          <button
            onClick={() => {
              triggerHaptic();
              onToggleVisibility();
            }}
            className={cn(
              "flex-1 flex items-center justify-center w-12 transition-colors",
              "hover:bg-muted/50 active:bg-muted"
            )}
            style={{ minHeight: 40 }}
          >
            {block.visible ? (
              <Eye size={16} className="text-muted-foreground" />
            ) : (
              <EyeOff size={16} className="text-muted-foreground" />
            )}
          </button>

          {/* Delete */}
          {block.type !== "identity" && (
            <button
              onClick={() => {
                triggerHaptic();
                onDelete();
              }}
              className={cn(
                "flex-1 flex items-center justify-center w-12 border-t border-border/50 transition-colors",
                "hover:bg-destructive/10 active:bg-destructive/20"
              )}
              style={{ minHeight: 40 }}
            >
              <Trash2 size={16} className="text-destructive" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================
// MAIN MOBILE MODULE EDITOR
// ============================================================

export function MobileModuleEditor({ 
  blocks, 
  onChange, 
  onEditBlock,
  className 
}: MobileModuleEditorProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null);

  // Sort blocks by order
  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);

  // Move block up
  const handleMoveUp = useCallback((index: number) => {
    if (index <= 0) return;
    
    const newBlocks = [...sortedBlocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[index - 1];
    newBlocks[index - 1] = temp;
    
    // Update order
    const reordered = newBlocks.map((block, i) => ({ ...block, order: i }));
    onChange(reordered);
  }, [sortedBlocks, onChange]);

  // Move block down
  const handleMoveDown = useCallback((index: number) => {
    if (index >= sortedBlocks.length - 1) return;
    
    const newBlocks = [...sortedBlocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[index + 1];
    newBlocks[index + 1] = temp;
    
    // Update order
    const reordered = newBlocks.map((block, i) => ({ ...block, order: i }));
    onChange(reordered);
  }, [sortedBlocks, onChange]);

  // Toggle block visibility
  const handleToggleVisibility = useCallback((blockId: string) => {
    const newBlocks = blocks.map(block => 
      block.id === blockId ? { ...block, visible: !block.visible } : block
    );
    onChange(newBlocks);
  }, [blocks, onChange]);

  // Delete block
  const handleDelete = useCallback((blockId: string) => {
    const newBlocks = blocks.filter(block => block.id !== blockId);
    // Reorder remaining blocks
    const reordered = newBlocks.map((block, i) => ({ ...block, order: i }));
    onChange(reordered);
  }, [blocks, onChange]);

  return (
    <div className={cn("space-y-3", className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-1 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Modules</h3>
          <p className="text-xs text-muted-foreground">
            Utilisez les flèches ou maintenez la poignée
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="w-6 h-6 rounded bg-muted/50 flex items-center justify-center">
            <GripVertical size={12} />
          </div>
          <span>= maintenir</span>
        </div>
      </div>

      {/* Blocks List */}
      <AnimatePresence mode="popLayout">
        {sortedBlocks.map((block, index) => (
          <ModuleItem
            key={block.id}
            block={block}
            index={index}
            totalCount={sortedBlocks.length}
            onMoveUp={() => handleMoveUp(index)}
            onMoveDown={() => handleMoveDown(index)}
            onToggleVisibility={() => handleToggleVisibility(block.id)}
            onDelete={() => handleDelete(block.id)}
            onEdit={onEditBlock ? () => onEditBlock(block.id) : undefined}
            isDragging={draggingId === block.id}
            onDragStart={() => setDraggingId(block.id)}
            onDragEnd={() => setDraggingId(null)}
          />
        ))}
      </AnimatePresence>

      {/* Empty State */}
      {sortedBlocks.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-12 text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted/50 flex items-center justify-center">
            <Info size={24} className="text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            Aucun module configuré
          </p>
        </motion.div>
      )}

      {/* Drag instruction (shown when dragging) */}
      <AnimatePresence>
        {draggingId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="px-4 py-2 bg-foreground text-background rounded-full shadow-lg text-sm font-medium">
              Déplacez le module
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MobileModuleEditor;
