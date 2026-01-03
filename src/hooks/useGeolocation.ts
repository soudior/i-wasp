/**
 * useGeolocation - Hook for browser geolocation with address auto-fill
 * 
 * Features:
 * - Get current position
 * - Reverse geocoding to get address
 * - Error handling with friendly messages
 */

import { useState, useCallback } from "react";
import { toast } from "sonner";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  city: string | null;
  postalCode: string | null;
  country: string | null;
  neighborhood: string | null;
  isLoading: boolean;
  error: string | null;
}

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  onSuccess?: (data: GeolocationState) => void;
  onError?: (error: string) => void;
}

export function useGeolocation(options: UseGeolocationOptions = {}) {
  const { 
    enableHighAccuracy = true, 
    timeout = 10000,
    onSuccess,
    onError 
  } = options;

  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    address: null,
    city: null,
    postalCode: null,
    country: null,
    neighborhood: null,
    isLoading: false,
    error: null,
  });

  // Reverse geocode using Nominatim (OpenStreetMap) - free, no API key
  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
        {
          headers: {
            "Accept-Language": "fr",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Geocoding failed");
      }

      const data = await response.json();
      
      const addressParts = data.address || {};
      const fullAddress = data.display_name || "";
      
      // Extract components
      const city = addressParts.city || addressParts.town || addressParts.village || addressParts.municipality || "";
      const postalCode = addressParts.postcode || "";
      const country = addressParts.country || "";
      const neighborhood = addressParts.suburb || addressParts.neighbourhood || addressParts.quarter || "";
      
      // Build clean address
      const streetNumber = addressParts.house_number || "";
      const street = addressParts.road || addressParts.street || "";
      const cleanAddress = [streetNumber, street].filter(Boolean).join(" ").trim() || fullAddress.split(",")[0];

      return {
        address: cleanAddress,
        city,
        postalCode,
        country,
        neighborhood,
      };
    } catch (error) {
      console.error("[Geolocation] Reverse geocode error:", error);
      return null;
    }
  }, []);

  // Get current position
  const getCurrentPosition = useCallback(async () => {
    if (!navigator.geolocation) {
      const errorMsg = "La géolocalisation n'est pas supportée par votre navigateur";
      setState(prev => ({ ...prev, error: errorMsg }));
      onError?.(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy,
          timeout,
          maximumAge: 0,
        });
      });

      const { latitude, longitude } = position.coords;

      // Get address from coordinates
      const geocoded = await reverseGeocode(latitude, longitude);

      const newState: GeolocationState = {
        latitude,
        longitude,
        address: geocoded?.address || null,
        city: geocoded?.city || null,
        postalCode: geocoded?.postalCode || null,
        country: geocoded?.country || null,
        neighborhood: geocoded?.neighborhood || null,
        isLoading: false,
        error: null,
      };

      setState(newState);
      onSuccess?.(newState);
      
      if (geocoded?.address) {
        toast.success("Adresse détectée !");
      }

    } catch (error) {
      let errorMsg = "Erreur de géolocalisation";
      
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = "Autorisation de localisation refusée. Activez-la dans les paramètres.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = "Position indisponible. Vérifiez votre connexion GPS.";
            break;
          case error.TIMEOUT:
            errorMsg = "Délai dépassé. Réessayez dans un endroit avec meilleur signal.";
            break;
        }
      }

      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMsg 
      }));
      onError?.(errorMsg);
      toast.error(errorMsg);
    }
  }, [enableHighAccuracy, timeout, reverseGeocode, onSuccess, onError]);

  // Clear state
  const reset = useCallback(() => {
    setState({
      latitude: null,
      longitude: null,
      address: null,
      city: null,
      postalCode: null,
      country: null,
      neighborhood: null,
      isLoading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    getCurrentPosition,
    reset,
    isSupported: typeof navigator !== "undefined" && "geolocation" in navigator,
  };
}

export default useGeolocation;
