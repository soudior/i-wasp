import { MapPin, Navigation, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getMapUrl, isIOS } from "@/lib/socialNetworks";

interface LocationPickerProps {
  address: string;
  latitude?: number;
  longitude?: number;
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  variant?: "minimal" | "button" | "inline" | "card";
  showMiniMap?: boolean;
}

// Static map preview using OpenStreetMap tiles (no heavy library needed)
function LocationMiniMap({ lat, lng }: { lat: number; lng: number }) {
  const zoom = 15;
  const staticMapUrl = `https://static-maps.yandex.ru/1.x/?ll=${lng},${lat}&z=${zoom}&l=map&size=400,200&pt=${lng},${lat},pm2rdm`;
  const osmUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=${zoom}/${lat}/${lng}`;
  
  return (
    <a 
      href={osmUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-24 rounded-lg overflow-hidden relative group"
    >
      <img 
        src={`https://tile.openstreetmap.org/${zoom}/${Math.floor((lng + 180) / 360 * Math.pow(2, zoom))}/${Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom))}.png`}
        alt="Location"
        className="w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg">
          <MapPin className="w-4 h-4 text-primary-foreground" />
        </div>
      </div>
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
    </a>
  );
}

export function LocationPicker({
  address, 
  latitude,
  longitude,
  className = "", 
  iconClassName = "",
  textClassName = "",
  variant = "inline",
  showMiniMap = false
}: LocationPickerProps) {
  if (!address && !latitude && !longitude) return null;

  const hasCoordinates = latitude !== undefined && longitude !== undefined;

  const handleOpenMap = (app: "google" | "waze" | "apple") => {
    let url: string;
    
    if (hasCoordinates) {
      if (app === "google") {
        url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
      } else if (app === "waze") {
        url = `https://www.waze.com/ul?ll=${latitude},${longitude}&navigate=yes`;
      } else {
        url = `https://maps.apple.com/?ll=${latitude},${longitude}&q=${encodeURIComponent(address || "Location")}`;
      }
    } else {
      url = getMapUrl(address, app);
    }
    
    window.open(url, "_blank");
  };

  // Card variant with mini-map preview
  if (variant === "card") {
    return (
      <div className={`rounded-xl bg-muted/10 border border-border/20 overflow-hidden ${className}`}>
        {showMiniMap && hasCoordinates && (
          <LocationMiniMap lat={latitude} lng={longitude} />
        )}
        <div className="p-3 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <MapPin size={16} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${textClassName}`}>{address}</p>
              {hasCoordinates && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {latitude?.toFixed(5)}, {longitude?.toFixed(5)}
                </p>
              )}
            </div>
          </div>
          
          {/* Navigation buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenMap("google")}
              className="flex-1 h-8 text-xs"
            >
              <Navigation size={12} className="mr-1.5 text-blue-500" />
              Google Maps
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenMap("waze")}
              className="flex-1 h-8 text-xs"
            >
              <Navigation size={12} className="mr-1.5 text-cyan-500" />
              Waze
            </Button>
            {isIOS() && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenMap("apple")}
                className="flex-1 h-8 text-xs"
              >
                <Navigation size={12} className="mr-1.5" />
                Plans
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

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
