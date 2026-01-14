/**
 * CurrencyContext - Global Currency Management with Geolocation Auto-Detection
 * Supports EUR (France/EU), MAD (Morocco/MENA), USD, GBP
 */

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Currency = "EUR" | "MAD";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  toggleCurrency: () => void;
  formatPrice: (amountCents: number) => string;
  formatAmount: (amount: number) => string;
  convertToMAD: (eurAmount: number) => number;
  convertToEUR: (madAmount: number) => number;
  region: string;
  regionLabel: string;
  currencySymbol: string;
  isAutoDetected: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Conversion rates (approximate)
const CONVERSION_RATES: Record<Currency, number> = {
  MAD: 1,
  EUR: 10.8,  // 1 EUR = 10.8 MAD
};

const CURRENCY_CONFIG: Record<Currency, { symbol: string; locale: string; region: string; label: string }> = {
  MAD: { symbol: "DH", locale: "fr-MA", region: "MA", label: "Maroc" },
  EUR: { symbol: "€", locale: "fr-FR", region: "EU", label: "Europe" },
};

interface CurrencyProviderProps {
  children: ReactNode;
}

export function CurrencyProvider({ children }: CurrencyProviderProps) {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem("iwasp-currency");
    return (saved as Currency) || "MAD";
  });
  const [isAutoDetected, setIsAutoDetected] = useState(false);

  // Auto-detect currency based on geolocation (only if not manually set)
  useEffect(() => {
    const detectCurrency = async () => {
      const manuallySet = localStorage.getItem("iwasp-currency-manual");
      if (manuallySet === "true") return;

      try {
        const response = await fetch("https://ipapi.co/json/", {
          signal: AbortSignal.timeout(5000),
        });
        
        if (!response.ok) return;
        
        const data = await response.json();
        const countryCode = data.country_code;
        
        // Map country to currency (EUR for all non-Morocco countries)
        const detectedCurrency: Currency = countryCode === "MA" ? "MAD" : "EUR";
        setCurrencyState(detectedCurrency);
        setIsAutoDetected(true);
        localStorage.setItem("iwasp-currency", detectedCurrency);
      } catch (error) {
        console.warn("Currency auto-detection failed:", error);
      }
    };

    detectCurrency();
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("iwasp-currency", currency);
  }, [currency]);

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem("iwasp-currency-manual", "true");
    setIsAutoDetected(false);
  };

  const toggleCurrency = () => {
    setCurrency(currency === "MAD" ? "EUR" : "MAD");
  };

  // Convert EUR to MAD
  const convertToMAD = (eurAmount: number): number => {
    return Math.round(eurAmount * CONVERSION_RATES.EUR);
  };

  // Convert MAD to EUR
  const convertToEUR = (madAmount: number): number => {
    return Math.round((madAmount / CONVERSION_RATES.EUR) * 100) / 100;
  };

  // Convert amount from MAD to target currency
  const convertFromMAD = (madAmount: number, targetCurrency: Currency): number => {
    if (targetCurrency === "MAD") return madAmount;
    return Math.round((madAmount / CONVERSION_RATES[targetCurrency]) * 100) / 100;
  };

  // Format price from cents
  const formatPrice = (amountCents: number): string => {
    const madAmount = amountCents / 100;
    const amount = convertFromMAD(madAmount, currency);
    const config = CURRENCY_CONFIG[currency];
    
    if (currency === "MAD") {
      return `${new Intl.NumberFormat(config.locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount)} DH`;
    }
    
    return new Intl.NumberFormat(config.locale, {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Format a plain amount (assumed to be in MAD)
  const formatAmount = (madAmount: number): string => {
    const amount = convertFromMAD(madAmount, currency);
    const config = CURRENCY_CONFIG[currency];
    
    if (currency === "MAD") {
      return `${new Intl.NumberFormat(config.locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount)} DH`;
    }
    
    return new Intl.NumberFormat(config.locale, {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const config = CURRENCY_CONFIG[currency];

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        toggleCurrency,
        formatPrice,
        formatAmount,
        convertToMAD,
        convertToEUR,
        region: config.region,
        regionLabel: config.label,
        currencySymbol: config.symbol,
        isAutoDetected,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
