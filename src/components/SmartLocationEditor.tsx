/**
 * Smart Location Editor
 * 
 * Advanced location editor with:
 * - Auto-geolocation via browser API
 * - Interactive map picker (OpenStreetMap/Leaflet)
 * - Reverse geocoding for address
 * - Mini-map preview
 * 
 * Mobile-first, IWASP dark theme.
 */

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, Navigation, Loader2, X, Check, Map as MapIcon,
  Crosshair, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface LocationData {
  address: string;
  latitude?: number;
  longitude?: number;
  label?: string;
}

interface SmartLocationEditorProps {
  value: LocationData;
  onChange: (data: LocationData) => void;
  className?: string;
}

// Reverse geocoding using OpenStreetMap Nominatim (free, no API key)
async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'fr',
          'User-Agent': 'IWASP-NFC-Cards/1.0'
        }
      }
    );
    const data = await response.json();
    return data.display_name || null;
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return null;
  }
}

// Forward geocoding (address to coordinates)
async function forwardGeocode(address: string): Promise<{ lat: number; lon: number } | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
      {
        headers: {
          'Accept-Language': 'fr',
          'User-Agent': 'IWASP-NFC-Cards/1.0'
        }
      }
    );
    const data = await response.json();
    if (data && data.length > 0) {
      return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
    }
    return null;
  } catch (error) {
    console.error("Forward geocoding error:", error);
    return null;
  }
}

// Lazy-load map component to avoid SSR issues
function MapPicker({ 
  initialLat, 
  initialLng, 
  onConfirm, 
  onCancel 
}: { 
  initialLat: number; 
  initialLng: number; 
  onConfirm: (lat: number, lng: number, address: string) => void;
  onCancel: () => void;
}) {
  const [position, setPosition] = useState<[number, number]>([initialLat, initialLng]);
  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [MapContainer, setMapContainer] = useState<any>(null);
  const [TileLayer, setTileLayer] = useState<any>(null);
  const [Marker, setMarker] = useState<any>(null);
  const [useMapEvents, setUseMapEvents] = useState<any>(null);
  const [L, setL] = useState<any>(null);

  // Dynamically import Leaflet
  useEffect(() => {
    Promise.all([
      import('react-leaflet'),
      import('leaflet'),
      import('leaflet/dist/leaflet.css')
    ]).then(([reactLeaflet, leaflet]) => {
      setMapContainer(() => reactLeaflet.MapContainer);
      setTileLayer(() => reactLeaflet.TileLayer);
      setMarker(() => reactLeaflet.Marker);
      setUseMapEvents(() => reactLeaflet.useMapEvents);
      setL(leaflet.default);
      
      // Fix default marker icon
      delete (leaflet.default.Icon.Default.prototype as any)._getIconUrl;
      leaflet.default.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });
    });
  }, []);

  // Get address when position changes
  useEffect(() => {
    const fetchAddress = async () => {
      setLoading(true);
      const addr = await reverseGeocode(position[0], position[1]);
      if (addr) setAddress(addr);
      setLoading(false);
    };
    fetchAddress();
  }, [position]);

  // Map click handler component
  const MapClickHandler = () => {
    if (!useMapEvents) return null;
    useMapEvents({
      click: (e: any) => {
        setPosition([e.latlng.lat, e.latlng.lng]);
      },
    });
    return null;
  };

  if (!MapContainer || !TileLayer || !Marker || !L) {
    return (
      <div className="h-[400px] flex items-center justify-center bg-muted/20 rounded-xl">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="h-[400px] rounded-xl overflow-hidden border border-border/30">
        <MapContainer 
          center={position} 
          zoom={15} 
          className="h-full w-full"
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker 
            position={position}
            draggable={true}
            eventHandlers={{
              dragend: (e: any) => {
                const marker = e.target;
                const pos = marker.getLatLng();
                setPosition([pos.lat, pos.lng]);
              },
            }}
          />
          <MapClickHandler />
        </MapContainer>
      </div>

      {/* Selected address */}
      <div className="bg-muted/20 rounded-xl p-4 space-y-2">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-primary" />
          <span className="text-sm font-medium">Adresse sélectionnée</span>
          {loading && <Loader2 size={14} className="animate-spin text-muted-foreground" />}
        </div>
        <p className="text-sm text-muted-foreground">
          {address || "Cliquez sur la carte ou déplacez le marqueur..."}
        </p>
        <p className="text-xs text-muted-foreground/60">
          Lat: {position[0].toFixed(6)}, Lng: {position[1].toFixed(6)}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button 
          variant="outline" 
          onClick={onCancel}
          className="flex-1"
        >
          <X size={16} className="mr-2" />
          Annuler
        </Button>
        <Button 
          onClick={() => onConfirm(position[0], position[1], address)}
          disabled={!address || loading}
          className="flex-1"
        >
          <Check size={16} className="mr-2" />
          Valider
        </Button>
      </div>
    </div>
  );
}

// Mini map preview component
function MiniMapPreview({ lat, lng }: { lat: number; lng: number }) {
  const [MapContainer, setMapContainer] = useState<any>(null);
  const [TileLayer, setTileLayer] = useState<any>(null);
  const [Marker, setMarker] = useState<any>(null);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      import('react-leaflet'),
      import('leaflet'),
      import('leaflet/dist/leaflet.css')
    ]).then(([reactLeaflet, leaflet]) => {
      setMapContainer(() => reactLeaflet.MapContainer);
      setTileLayer(() => reactLeaflet.TileLayer);
      setMarker(() => reactLeaflet.Marker);
      setL(leaflet.default);
      
      delete (leaflet.default.Icon.Default.prototype as any)._getIconUrl;
      leaflet.default.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });
    });
  }, []);

  if (!MapContainer || !TileLayer || !Marker) {
    return (
      <div className="h-32 bg-muted/20 rounded-xl flex items-center justify-center">
        <MapPin className="text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="h-32 rounded-xl overflow-hidden border border-border/30">
      <MapContainer 
        center={[lat, lng]} 
        zoom={14} 
        className="h-full w-full"
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        dragging={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[lat, lng]} />
      </MapContainer>
    </div>
  );
}

export function SmartLocationEditor({ value, onChange, className }: SmartLocationEditorProps) {
  const [isLocating, setIsLocating] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Handle auto-geolocation
  const handleAutoLocate = useCallback(async () => {
    setIsLocating(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("La géolocalisation n'est pas supportée par votre navigateur");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Reverse geocode to get address
        const address = await reverseGeocode(latitude, longitude);
        
        onChange({
          ...value,
          latitude,
          longitude,
          address: address || value.address,
        });
        
        toast.success("Position récupérée !", {
          description: address || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
        });
        
        setIsLocating(false);
      },
      (error) => {
        let message = "Impossible de récupérer votre position";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = "Accès à la localisation refusé. Activez-le dans les paramètres.";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "Position indisponible. Vérifiez votre GPS.";
            break;
          case error.TIMEOUT:
            message = "Délai dépassé. Réessayez.";
            break;
        }
        
        setLocationError(message);
        toast.error(message);
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }, [value, onChange]);

  // Handle map picker confirm
  const handleMapConfirm = useCallback((lat: number, lng: number, address: string) => {
    onChange({
      ...value,
      latitude: lat,
      longitude: lng,
      address: address || value.address,
    });
    setShowMapPicker(false);
    toast.success("Localisation mise à jour");
  }, [value, onChange]);

  // Update coordinates when address changes manually
  const handleAddressBlur = useCallback(async () => {
    if (value.address && !value.latitude && !value.longitude) {
      const coords = await forwardGeocode(value.address);
      if (coords) {
        onChange({
          ...value,
          latitude: coords.lat,
          longitude: coords.lon,
        });
      }
    }
  }, [value, onChange]);

  const hasCoordinates = value.latitude !== undefined && value.longitude !== undefined;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <MapPin size={16} className="text-accent" />
        <span className="text-sm font-medium">Géolocalisation</span>
      </div>

      {/* Geolocation buttons */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAutoLocate}
          disabled={isLocating}
          className="flex-1 h-11 rounded-xl bg-accent/5 border-accent/20 hover:bg-accent/10"
        >
          {isLocating ? (
            <Loader2 size={16} className="mr-2 animate-spin" />
          ) : (
            <Crosshair size={16} className="mr-2 text-accent" />
          )}
          {isLocating ? "Localisation..." : "Ma position actuelle"}
        </Button>
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowMapPicker(true)}
          className="flex-1 h-11 rounded-xl"
        >
          <MapIcon size={16} className="mr-2" />
          Choisir sur carte
        </Button>
      </div>

      {/* Error message */}
      <AnimatePresence>
        {locationError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 text-sm text-amber-500 bg-amber-500/10 px-3 py-2 rounded-lg"
          >
            <AlertCircle size={14} />
            {locationError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Address input */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Adresse</Label>
        <Input
          value={value.address}
          onChange={(e) => onChange({ ...value, address: e.target.value })}
          onBlur={handleAddressBlur}
          placeholder="123 Rue de Paris, 75001 Paris"
          className="h-10"
        />
      </div>

      {/* Coordinates (read-only or editable) */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Latitude</Label>
          <Input
            value={value.latitude ?? ""}
            onChange={(e) => onChange({ 
              ...value, 
              latitude: e.target.value ? parseFloat(e.target.value) : undefined 
            })}
            placeholder="48.8566"
            type="number"
            step="any"
            className="h-10"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Longitude</Label>
          <Input
            value={value.longitude ?? ""}
            onChange={(e) => onChange({ 
              ...value, 
              longitude: e.target.value ? parseFloat(e.target.value) : undefined 
            })}
            placeholder="2.3522"
            type="number"
            step="any"
            className="h-10"
          />
        </div>
      </div>

      {/* Label */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Label affiché</Label>
        <Input
          value={value.label || ""}
          onChange={(e) => onChange({ ...value, label: e.target.value })}
          placeholder="Notre adresse"
          className="h-10"
        />
      </div>

      {/* Mini-map preview with navigation buttons */}
      {hasCoordinates && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <Label className="text-xs text-muted-foreground">Aperçu</Label>
          <MiniMapPreview lat={value.latitude!} lng={value.longitude!} />
          
          {/* Navigation buttons - Auto-generated */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Ouvrir dans l'application</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => window.open(
                  `https://www.google.com/maps/search/?api=1&query=${value.latitude},${value.longitude}`,
                  '_blank'
                )}
                className="h-10 text-xs gap-1.5"
              >
                <Navigation size={14} className="text-blue-500" />
                <span>Google</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => window.open(
                  `https://maps.apple.com/?ll=${value.latitude},${value.longitude}&q=${encodeURIComponent(value.address || 'Location')}`,
                  '_blank'
                )}
                className="h-10 text-xs gap-1.5"
              >
                <Navigation size={14} className="text-slate-500" />
                <span>Plans</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => window.open(
                  `https://www.waze.com/ul?ll=${value.latitude},${value.longitude}&navigate=yes`,
                  '_blank'
                )}
                className="h-10 text-xs gap-1.5"
              >
                <Navigation size={14} className="text-cyan-500" />
                <span>Waze</span>
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Map Picker Dialog */}
      <Dialog open={showMapPicker} onOpenChange={setShowMapPicker}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapIcon size={20} />
              Choisir sur la carte
            </DialogTitle>
          </DialogHeader>
          <MapPicker
            initialLat={value.latitude || 48.8566}
            initialLng={value.longitude || 2.3522}
            onConfirm={handleMapConfirm}
            onCancel={() => setShowMapPicker(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SmartLocationEditor;
