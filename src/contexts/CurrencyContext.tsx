/**
 * CurrencyContext - Global Currency Management with Geolocation Auto-Detection
 * Supports EUR (Europe), USD (Americas), GBP (UK) - International focus
 */

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Currency = "EUR" | "USD" | "GBP";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  toggleCurrency: () => void;
  formatPrice: (amountCents: number) => string;
  formatAmount: (amount: number) => string;
  region: string;
  regionLabel: string;
  currencySymbol: string;
  isAutoDetected: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Conversion rates (base: EUR)
const CONVERSION_RATES: Record<Currency, number> = {
  EUR: 1,
  USD: 1.08,  // 1 EUR = 1.08 USD
  GBP: 0.85,  // 1 EUR = 0.85 GBP
};

const CURRENCY_CONFIG: Record<Currency, { symbol: string; locale: string; region: string; label: string }> = {
  EUR: { symbol: "€", locale: "en-GB", region: "EU", label: "Europe" },
  USD: { symbol: "$", locale: "en-US", region: "US", label: "Americas" },
  GBP: { symbol: "£", locale: "en-GB", region: "UK", label: "United Kingdom" },
};

interface CurrencyProviderProps {
  children: ReactNode;
}

export function CurrencyProvider({ children }: CurrencyProviderProps) {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem("iwasp-currency");
    if (saved && ["EUR", "USD", "GBP"].includes(saved)) {
      return saved as Currency;
    }
    return "EUR"; // Default to EUR for international
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
        
        // Map country to currency - International focus
        let detectedCurrency: Currency = "EUR"; // Default
        
        // UK
        if (countryCode === "GB") {
          detectedCurrency = "GBP";
        }
        // Americas
        else if (["US", "CA", "MX", "BR", "AR", "CO", "CL", "PE"].includes(countryCode)) {
          detectedCurrency = "USD";
        }
        // Rest of the world defaults to EUR
        
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
    const currencies: Currency[] = ["EUR", "USD", "GBP"];
    const currentIndex = currencies.indexOf(currency);
    const nextIndex = (currentIndex + 1) % currencies.length;
    setCurrency(currencies[nextIndex]);
  };

  // Convert EUR to target currency
  const convertFromEUR = (eurAmount: number, targetCurrency: Currency): number => {
    return Math.round(eurAmount * CONVERSION_RATES[targetCurrency] * 100) / 100;
  };

  // Format price from cents (prices stored in EUR cents)
  const formatPrice = (amountCents: number): string => {
    const eurAmount = amountCents / 100;
    const amount = convertFromEUR(eurAmount, currency);
    const config = CURRENCY_CONFIG[currency];
    
    return new Intl.NumberFormat(config.locale, {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Format a plain amount (assumed to be in EUR)
  const formatAmount = (eurAmount: number): string => {
    const amount = convertFromEUR(eurAmount, currency);
    const config = CURRENCY_CONFIG[currency];
    
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
