/**
 * useGeolocalization - Auto-detect user's location, timezone, and preferred language/currency
 */

import { useState, useEffect } from "react";
import i18n from "@/i18n";

interface GeoData {
  country: string;
  countryCode: string;
  city: string;
  timezone: string;
  currency: "EUR" | "MAD" | "USD" | "GBP";
  language: string;
  isLoading: boolean;
  error: string | null;
}

// Country to currency mapping
const countryCurrencyMap: Record<string, "EUR" | "MAD" | "USD" | "GBP"> = {
  // Morocco
  MA: "MAD",
  // Europe - EUR
  FR: "EUR", DE: "EUR", ES: "EUR", IT: "EUR", NL: "EUR", BE: "EUR", PT: "EUR",
  AT: "EUR", IE: "EUR", FI: "EUR", GR: "EUR", LU: "EUR", SK: "EUR", SI: "EUR",
  EE: "EUR", LV: "EUR", LT: "EUR", CY: "EUR", MT: "EUR",
  // UK
  GB: "GBP",
  // US and others default to USD
  US: "USD", CA: "USD",
};

// Country to language mapping
const countryLanguageMap: Record<string, string> = {
  FR: "fr", BE: "fr", LU: "fr", MC: "fr", CH: "fr",
  MA: "fr", DZ: "ar", TN: "ar", EG: "ar", SA: "ar", AE: "ar",
  ES: "es", MX: "es", AR: "es", CO: "es",
  IT: "it",
  DE: "de", AT: "de",
  NL: "nl",
  GB: "en", US: "en", CA: "en", AU: "en",
};

export function useGeolocalization() {
  const [geoData, setGeoData] = useState<GeoData>({
    country: "",
    countryCode: "",
    city: "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    currency: "MAD",
    language: "fr",
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const detectLocation = async () => {
      try {
        // Use free IP geolocation service
        const response = await fetch("https://ipapi.co/json/", {
          signal: AbortSignal.timeout(5000),
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch geolocation");
        }

        const data = await response.json();
        
        const countryCode = data.country_code || "FR";
        const detectedCurrency = countryCurrencyMap[countryCode] || "EUR";
        const detectedLanguage = countryLanguageMap[countryCode] || "en";
        
        // Only change language if not already set by user
        const savedLang = localStorage.getItem("i18nextLng");
        if (!savedLang) {
          i18n.changeLanguage(detectedLanguage);
        }

        setGeoData({
          country: data.country_name || "",
          countryCode,
          city: data.city || "",
          timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
          currency: detectedCurrency,
          language: detectedLanguage,
          isLoading: false,
          error: null,
        });

        // Save to localStorage for persistence
        localStorage.setItem("iwasp-geo-country", countryCode);
        localStorage.setItem("iwasp-geo-timezone", data.timezone || "");
        
      } catch (error) {
        console.warn("Geolocation detection failed, using defaults:", error);
        
        // Fall back to browser timezone and navigator language
        const browserLang = navigator.language.split("-")[0];
        const supportedLangs = ["fr", "en", "es", "it", "nl", "de", "ar"];
        const fallbackLang = supportedLangs.includes(browserLang) ? browserLang : "fr";
        
        setGeoData(prev => ({
          ...prev,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          language: fallbackLang,
          isLoading: false,
          error: "Could not detect location",
        }));
      }
    };

    detectLocation();
  }, []);

  return geoData;
}

export default useGeolocalization;
