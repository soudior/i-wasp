/**
 * SmartLocationEditor - Simple location input with address
 * Lightweight version without heavy map dependencies
 */

import { useState } from "react";
import { MapPin, Navigation, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface LocationData {
  address: string;
  latitude?: number;
  longitude?: number;
}

interface SmartLocationEditorProps {
  value: LocationData;
  onChange: (value: LocationData) => void;
}

export function SmartLocationEditor({ value, onChange }: SmartLocationEditorProps) {
  const [isSearching, setIsSearching] = useState(false);

  const handleAddressChange = (address: string) => {
    onChange({ ...value, address });
  };

  const handleUseCurrentLocation = async () => {
    if (!navigator.geolocation) {
      return;
    }

    setIsSearching(true);
    
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
        });
      });

      const { latitude, longitude } = position.coords;
      
      // Try to reverse geocode using Nominatim
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        const data = await response.json();
        const address = data.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        
        onChange({
          address,
          latitude,
          longitude,
        });
      } catch {
        onChange({
          address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          latitude,
          longitude,
        });
      }
    } catch (error) {
      console.error("Geolocation error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Localisation</h3>
      </div>

      <div className="space-y-3">
        <div>
          <Label htmlFor="location-address" className="text-sm text-muted-foreground">
            Adresse
          </Label>
          <div className="flex gap-2 mt-1.5">
            <Input
              id="location-address"
              value={value.address}
              onChange={(e) => handleAddressChange(e.target.value)}
              placeholder="123 Rue Example, Ville, Pays"
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleUseCurrentLocation}
              disabled={isSearching}
              title="Utiliser ma position actuelle"
            >
              {isSearching ? (
                <Search className="w-4 h-4 animate-pulse" />
              ) : (
                <Navigation className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {value.latitude && value.longitude && (
          <div className="text-xs text-muted-foreground">
            📍 Coordonnées: {value.latitude.toFixed(4)}, {value.longitude.toFixed(4)}
          </div>
        )}
      </div>
    </div>
  );
}

export default SmartLocationEditor;
