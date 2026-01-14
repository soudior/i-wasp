/**
 * ClearCacheButton - Helps users resolve PWA cache issues
 * Apple-like minimal design
 */

import { useState } from "react";
import { RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clearCacheAndReload } from "@/utils/clearCache";
import { toast } from "sonner";

interface ClearCacheButtonProps {
  variant?: "default" | "minimal" | "icon";
  className?: string;
}

export function ClearCacheButton({ 
  variant = "default", 
  className = "" 
}: ClearCacheButtonProps) {
  const [isClearing, setIsClearing] = useState(false);

  const handleClearCache = async () => {
    setIsClearing(true);
    toast.info("Nettoyage du cache...");
    
    // Small delay for UX feedback
    await new Promise(resolve => setTimeout(resolve, 500));
    await clearCacheAndReload();
  };

  if (variant === "icon") {
    return (
      <button
        onClick={handleClearCache}
        disabled={isClearing}
        className={`p-2 rounded-xl transition-all active:scale-95 ${className}`}
        style={{ 
          backgroundColor: "rgba(0, 122, 255, 0.1)",
          color: "#007AFF"
        }}
        aria-label="Vider le cache"
      >
        {isClearing ? (
          <RefreshCw className="h-5 w-5 animate-spin" />
        ) : (
          <Trash2 className="h-5 w-5" />
        )}
      </button>
    );
  }

  if (variant === "minimal") {
    return (
      <button
        onClick={handleClearCache}
        disabled={isClearing}
        className={`text-sm flex items-center gap-2 transition-opacity hover:opacity-70 active:scale-95 ${className}`}
        style={{ color: "#8E8E93" }}
      >
        {isClearing ? (
          <RefreshCw className="h-4 w-4 animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
        <span>Vider le cache</span>
      </button>
    );
  }

  return (
    <Button
      onClick={handleClearCache}
      disabled={isClearing}
      variant="outline"
      className={`gap-2 ${className}`}
    >
      {isClearing ? (
        <RefreshCw className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
      Vider le cache
    </Button>
  );
}
