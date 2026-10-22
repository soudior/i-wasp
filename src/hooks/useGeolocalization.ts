/**
 * useGeolocalization
 * Local timezone only. Language stays on the explicit i18n choice (French
 * by default). Public prices use CurrencyContext, not this hook.
 */

import { useState, useEffect } from "react";
import i18n from "@/i18n";

interface GeoData {
  country: string;
  countryCode: string;
  city: string;
  timezone: string;
  currency: "EUR" | "USD" | "GBP";
  language: string;
  isLoading: boolean;
  error: string | null;
}

export function useGeolocalization() {
  const [geoData, setGeoData] = useState<GeoData>({
    country: "",
    countryCode: "",
    city: "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    currency: "EUR",
    language: "fr",
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setGeoData((current) => ({
      ...current,
      timezone: timeZone,
      language: i18n.resolvedLanguage || i18n.language || "fr",
      isLoading: false,
      error: null,
    }));
  }, []);

  return geoData;
}

export default useGeolocalization;
