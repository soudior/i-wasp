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

import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, Navigation, Loader2, X, Check, Map as MapIcon,
  Crosshair, AlertCircle, Search, Home, Building2, Store, 
  Landmark, TreePine, GraduationCap, Hospital, UtensilsCrossed,
  Hotel, Church, Fuel, ParkingCircle, Train, Plane
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

// Debounce utility
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

// Address suggestion type with extended info
interface AddressSuggestion {
  display_name: string;
  lat: string;
  lon: string;
  place_id: number;
  type?: string;
  class?: string;
  addresstype?: string;
}

// Get icon based on place type
function getPlaceIcon(suggestion: AddressSuggestion) {
  const type = suggestion.type || '';
  const placeClass = suggestion.class || '';
  const addressType = suggestion.addresstype || '';
  
  // Check type/class combinations
  if (['house', 'residential', 'apartments'].includes(type) || addressType === 'house') {
    return { icon: Home, color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
  }
  if (['office', 'commercial', 'company'].includes(type) || placeClass === 'office') {
    return { icon: Building2, color: 'text-blue-500', bg: 'bg-blue-500/10' };
  }
  if (['shop', 'retail', 'supermarket', 'mall'].includes(type) || placeClass === 'shop') {
    return { icon: Store, color: 'text-purple-500', bg: 'bg-purple-500/10' };
  }
  if (['restaurant', 'cafe', 'bar', 'fast_food'].includes(type) || placeClass === 'amenity' && ['restaurant', 'cafe'].includes(type)) {
    return { icon: UtensilsCrossed, color: 'text-orange-500', bg: 'bg-orange-500/10' };
  }
  if (['hotel', 'hostel', 'motel', 'guest_house'].includes(type)) {
    return { icon: Hotel, color: 'text-amber-500', bg: 'bg-amber-500/10' };
  }
  if (['hospital', 'clinic', 'doctors', 'pharmacy'].includes(type)) {
    return { icon: Hospital, color: 'text-red-500', bg: 'bg-red-500/10' };
  }
  if (['school', 'university', 'college', 'kindergarten'].includes(type) || placeClass === 'education') {
    return { icon: GraduationCap, color: 'text-indigo-500', bg: 'bg-indigo-500/10' };
  }
  if (['church', 'mosque', 'synagogue', 'temple'].includes(type) || placeClass === 'place_of_worship') {
    return { icon: Church, color: 'text-slate-500', bg: 'bg-slate-500/10' };
  }
  if (['park', 'garden', 'forest', 'nature_reserve'].includes(type) || placeClass === 'leisure') {
    return { icon: TreePine, color: 'text-green-600', bg: 'bg-green-600/10' };
  }
  if (['fuel', 'gas_station'].includes(type)) {
    return { icon: Fuel, color: 'text-yellow-600', bg: 'bg-yellow-600/10' };
  }
  if (['parking'].includes(type)) {
    return { icon: ParkingCircle, color: 'text-sky-500', bg: 'bg-sky-500/10' };
  }
  if (['station', 'railway', 'bus_station'].includes(type) || placeClass === 'railway') {
    return { icon: Train, color: 'text-cyan-600', bg: 'bg-cyan-600/10' };
  }
  if (['airport', 'aerodrome'].includes(type)) {
    return { icon: Plane, color: 'text-violet-500', bg: 'bg-violet-500/10' };
  }
  if (['government', 'townhall', 'courthouse', 'public_building'].includes(type) || placeClass === 'government') {
    return { icon: Landmark, color: 'text-stone-500', bg: 'bg-stone-500/10' };
  }
  
  // Default
  return { icon: MapPin, color: 'text-accent', bg: 'bg-accent/10' };
}

// Address autocomplete using Nominatim
async function searchAddresses(query: string): Promise<AddressSuggestion[]> {
  if (!query || query.length < 3) return [];
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'fr',
          'User-Agent': 'IWASP-NFC-Cards/1.0'
        }
      }
    );
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error("Address search error:", error);
    return [];
  }
}

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

// Address Autocomplete Component
function AddressAutocomplete({
  value,
  onChange,
  onManualChange,
  onBlur,
  placeholder
}: {
  value: string;
  onChange: (address: string, lat?: number, lon?: number) => void;
  onManualChange: (address: string) => void;
  onBlur?: () => void;
  placeholder?: string;
}) {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedQuery = useDebounce(inputValue, 400);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync external value
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Fetch suggestions when debounced query changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.length < 3) {
        setSuggestions([]);
        return;
      }
      setIsSearching(true);
      const results = await searchAddresses(debouncedQuery);
      setSuggestions(results);
      setIsSearching(false);
      if (results.length > 0) setShowSuggestions(true);
    };
    fetchSuggestions();
  }, [debouncedQuery]);

  // Close suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectSuggestion = (suggestion: AddressSuggestion) => {
    const lat = parseFloat(suggestion.lat);
    const lon = parseFloat(suggestion.lon);
    setInputValue(suggestion.display_name);
    onChange(suggestion.display_name, lat, lon);
    setShowSuggestions(false);
    toast.success("Adresse sélectionnée", {
      description: `Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`
    });
  };

  return (
    <div ref={containerRef} className="space-y-2 relative">
      <Label className="text-xs text-muted-foreground flex items-center gap-2">
        Adresse
        {isSearching && <Loader2 size={12} className="animate-spin" />}
      </Label>
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            onManualChange(e.target.value);
          }}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          onBlur={() => {
            // Delay to allow click on suggestion
            setTimeout(() => onBlur?.(), 200);
          }}
          placeholder={placeholder}
          className="h-11 pl-10"
        />
      </div>
      
      {/* Suggestions dropdown */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute z-50 w-full mt-1 bg-card border border-border rounded-xl shadow-2xl overflow-hidden backdrop-blur-sm"
          >
            <div className="px-3 py-2 border-b border-border/50 bg-muted/30">
              <span className="text-xs font-medium text-muted-foreground">Suggestions</span>
            </div>
            {suggestions.map((suggestion) => {
              const { icon: PlaceIcon, color, bg } = getPlaceIcon(suggestion);
              return (
                <button
                  key={suggestion.place_id}
                  type="button"
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className="w-full text-left px-3 py-3 hover:bg-accent/10 transition-all duration-150 border-b border-border/20 last:border-0 flex items-start gap-3 group"
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                    bg
                  )}>
                    <PlaceIcon size={16} className={color} />
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <span className="text-sm line-clamp-2 leading-snug">{suggestion.display_name}</span>
                    {suggestion.type && (
                      <span className="text-[10px] text-muted-foreground/70 uppercase tracking-wide mt-0.5 block">
                        {suggestion.type.replace(/_/g, ' ')}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Lazy-load map component to avoid SSR issues with better error handling
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
  const [mapError, setMapError] = useState<string | null>(null);
  const [MapContainer, setMapContainer] = useState<any>(null);
  const [TileLayer, setTileLayer] = useState<any>(null);
  const [Marker, setMarker] = useState<any>(null);
  const [useMapEvents, setUseMapEvents] = useState<any>(null);
  const [L, setL] = useState<any>(null);

  // Dynamically import Leaflet with error handling
  useEffect(() => {
    let mounted = true;
    
    const loadMap = async () => {
      try {
        const [reactLeaflet, leaflet] = await Promise.all([
          import('react-leaflet'),
          import('leaflet'),
        ]);
        
        // Import CSS separately to avoid blocking
        try {
          await import('leaflet/dist/leaflet.css');
        } catch {
          // CSS import failure is not critical
        }
        
        if (!mounted) return;
        
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
      } catch (error) {
        console.error("Failed to load map:", error);
        if (mounted) {
          setMapError("Impossible de charger la carte. Utilisez la saisie manuelle.");
        }
      }
    };
    
    loadMap();
    
    return () => {
      mounted = false;
    };
  }, []);

  // Get address when position changes
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        setLoading(true);
        const addr = await reverseGeocode(position[0], position[1]);
        if (addr) setAddress(addr);
      } catch {
        // Silent fail - address can be entered manually
      } finally {
        setLoading(false);
      }
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

  // Show error state
  if (mapError) {
    return (
      <div className="h-[400px] flex flex-col items-center justify-center bg-muted/20 rounded-xl p-6 text-center">
        <AlertCircle className="w-12 h-12 text-amber-500 mb-4" />
        <p className="text-sm text-muted-foreground mb-4">{mapError}</p>
        <Button variant="outline" onClick={onCancel}>
          Saisir manuellement
        </Button>
      </div>
    );
  }

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

// Simple static map preview using OpenStreetMap image tiles (no React-Leaflet = no render2 bug)
function StaticMapPreview({ lat, lng, address }: { lat: number; lng: number; address?: string }) {
  // Use OpenStreetMap static tile image
  const zoom = 15;
  const tileX = Math.floor((lng + 180) / 360 * Math.pow(2, zoom));
  const tileY = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom));
  
  const staticMapUrl = `https://tile.openstreetmap.org/${zoom}/${tileX}/${tileY}.png`;
  
  return (
    <div className="relative h-32 rounded-xl overflow-hidden border border-border/30 bg-muted/20">
      <img 
        src={staticMapUrl}
        alt="Aperçu carte"
        className="w-full h-full object-cover"
        onError={(e) => {
          // Fallback if tile fails to load
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
      {/* Center marker overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center shadow-lg border-2 border-white">
          <MapPin size={16} className="text-white" />
        </div>
      </div>
      {/* Coordinates badge */}
      <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1">
        <p className="text-[10px] text-white/80 truncate">
          {address ? address.substring(0, 50) + (address.length > 50 ? '...' : '') : `${lat.toFixed(4)}, ${lng.toFixed(4)}`}
        </p>
      </div>
    </div>
  );
}

// Error Boundary wrapper for map components
class MapErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Map component error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="h-32 bg-muted/20 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-6 h-6 text-amber-500 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Carte non disponible</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}


export function SmartLocationEditor({ value, onChange, className }: SmartLocationEditorProps) {
  const [isLocating, setIsLocating] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Handle auto-geolocation - only triggered by button click
  const handleAutoLocate = useCallback(async () => {
    setIsLocating(true);
    setLocationError(null);

    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setLocationError("La géolocalisation n'est pas supportée par votre navigateur. Saisissez votre adresse manuellement.");
      toast.error("Géolocalisation non supportée", {
        description: "Veuillez saisir votre adresse manuellement"
      });
      setIsLocating(false);
      return;
    }

    // Request geolocation with timeout and error handling
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        });
      });
      
      const { latitude, longitude } = position.coords;
      
      // Reverse geocode to get address
      let address = value.address;
      try {
        const geocodedAddress = await reverseGeocode(latitude, longitude);
        if (geocodedAddress) address = geocodedAddress;
      } catch {
        // Geocoding failure is not critical
      }
      
      onChange({
        ...value,
        latitude,
        longitude,
        address,
      });
      
      toast.success("Position récupérée !", {
        description: address || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
      });
      
    } catch (error: any) {
      let message = "Impossible de récupérer votre position. Saisissez votre adresse manuellement.";
      
      if (error?.code === 1) { // PERMISSION_DENIED
        message = "Accès refusé. Activez la localisation dans les paramètres de votre navigateur.";
      } else if (error?.code === 2) { // POSITION_UNAVAILABLE
        message = "Position indisponible. Vérifiez votre GPS ou saisissez l'adresse manuellement.";
      } else if (error?.code === 3) { // TIMEOUT
        message = "Délai dépassé. Réessayez ou saisissez votre adresse manuellement.";
      }
      
      setLocationError(message);
      toast.error("Localisation échouée", {
        description: "Vous pouvez saisir votre adresse manuellement"
      });
    } finally {
      setIsLocating(false);
    }
  }, [value, onChange]);

  // Handle map picker confirm
  const handleMapConfirm = useCallback((lat: number, lng: number, address: string) => {
    try {
      onChange({
        ...value,
        latitude: lat,
        longitude: lng,
        address: address || value.address,
      });
      setShowMapPicker(false);
      toast.success("Localisation mise à jour");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    }
  }, [value, onChange]);

  // Update coordinates when address changes manually
  const handleAddressBlur = useCallback(async () => {
    if (value.address && !value.latitude && !value.longitude) {
      try {
        const coords = await forwardGeocode(value.address);
        if (coords) {
          onChange({
            ...value,
            latitude: coords.lat,
            longitude: coords.lon,
          });
        }
      } catch {
        // Silent fail - manual entry still works
      }
    }
  }, [value, onChange]);

  // Generate universal map link for "Y ALLER" button
  const getUniversalMapsUrl = useCallback(() => {
    if (value.latitude && value.longitude) {
      return `https://www.google.com/maps/dir/?api=1&destination=${value.latitude},${value.longitude}`;
    } else if (value.address) {
      return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(value.address)}`;
    }
    return null;
  }, [value]);

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

      {/* Address input with autocomplete */}
      <AddressAutocomplete
        value={value.address}
        onChange={(address, lat, lon) => {
          onChange({
            ...value,
            address,
            latitude: lat,
            longitude: lon,
          });
        }}
        onManualChange={(address) => onChange({ ...value, address })}
        onBlur={handleAddressBlur}
        placeholder="123 Rue de Paris, 75001 Paris"
      />

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
          <MapErrorBoundary>
            <StaticMapPreview lat={value.latitude!} lng={value.longitude!} address={value.address} />
          </MapErrorBoundary>
          
          {/* Universal "Y ALLER" Button - Opens device's default maps app */}
          <Button
            type="button"
            size="lg"
            onClick={() => {
              const url = getUniversalMapsUrl();
              if (url) window.open(url, '_blank');
            }}
            className="w-full h-12 text-sm font-semibold gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg"
          >
            <Navigation size={18} />
            Y ALLER
          </Button>
          
          {/* Secondary Navigation buttons */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Ou choisir une application</Label>
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
