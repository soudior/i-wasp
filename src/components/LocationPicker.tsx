import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getMapUrl, isIOS } from "@/lib/socialNetworks";

interface LocationPickerProps {
  address: string;
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  variant?: "minimal" | "button" | "inline";
}

export function LocationPicker({ 
  address, 
  className = "", 
  iconClassName = "",
  textClassName = "",
  variant = "inline" 
}: LocationPickerProps) {
  if (!address) return null;

  const handleOpenMap = (app: "google" | "waze" | "apple") => {
    window.open(getMapUrl(address, app), "_blank");
  };

  if (variant === "minimal") {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <button className={`flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity ${className}`}>
            <MapPin size={16} className={iconClassName} />
            <span className={textClassName}>{address}</span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2 bg-background border-border z-50" align="start">
          <div className="space-y-1">
            <button
              onClick={() => handleOpenMap("google")}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm"
            >
              <Navigation size={16} className="text-blue-500" />
              Google Maps
            </button>
            <button
              onClick={() => handleOpenMap("waze")}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm"
            >
              <Navigation size={16} className="text-cyan-500" />
              Waze
            </button>
            {isIOS() && (
              <button
                onClick={() => handleOpenMap("apple")}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm"
              >
                <Navigation size={16} className="text-slate-500" />
                Apple Plans
              </button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  if (variant === "button") {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className={className}>
            <MapPin size={16} className={iconClassName} />
            <span className={textClassName}>{address}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2 bg-background border-border z-50" align="start">
          <div className="space-y-1">
            <button
              onClick={() => handleOpenMap("google")}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm"
            >
              <Navigation size={16} className="text-blue-500" />
              Google Maps
            </button>
            <button
              onClick={() => handleOpenMap("waze")}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm"
            >
              <Navigation size={16} className="text-cyan-500" />
              Waze
            </button>
            {isIOS() && (
              <button
                onClick={() => handleOpenMap("apple")}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm"
              >
                <Navigation size={16} className="text-slate-500" />
                Apple Plans
              </button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  // Inline variant (default)
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className={`flex items-center gap-3 p-2.5 cursor-pointer hover:bg-slate-800/30 rounded-xl transition-colors ${className}`}>
          <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center">
            <MapPin size={16} className={iconClassName || "text-amber-400"} />
          </div>
          <span className={textClassName || "text-sm text-slate-400"}>{address}</span>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-2 bg-slate-900/95 backdrop-blur-xl border-slate-700 z-50" align="start">
        <p className="text-xs text-slate-400 px-3 py-1.5 mb-1">Ouvrir dans...</p>
        <div className="space-y-1">
          <button
            onClick={() => handleOpenMap("google")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 transition-colors text-sm text-slate-200"
          >
            <Navigation size={16} className="text-blue-400" />
            Google Maps
          </button>
          <button
            onClick={() => handleOpenMap("waze")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 transition-colors text-sm text-slate-200"
          >
            <Navigation size={16} className="text-cyan-400" />
            Waze
          </button>
          {isIOS() && (
            <button
              onClick={() => handleOpenMap("apple")}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 transition-colors text-sm text-slate-200"
            >
              <Navigation size={16} className="text-slate-400" />
              Apple Plans
            </button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
