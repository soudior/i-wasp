/**
 * CurrencyContext - Global Currency Management with Geolocation Auto-Detection
 * Supports EUR (Europe), MAD (Morocco), USD (Americas), GBP (UK)
 */

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { detectMarketCurrency } from "@/lib/currencyDetection";

export type Currency = "EUR" | "MAD" | "USD" | "GBP";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  toggleCurrency: () => void;
  formatPrice: (amountCents: number) => string;
  formatAmount: (amount: number) => string;
  formatDualPrice: (eurAmount: number, madAmount: number) => string;
  region: string;
  regionLabel: string;
  currencySymbol: string;
  isAutoDetected: boolean;
  isMAD: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Conversion rates (base: EUR)
const CONVERSION_RATES: Record<Currency, number> = {
  EUR: 1,
  MAD: 11,     // 1 EUR ≈ 11 MAD
  USD: 1.08,   // 1 EUR = 1.08 USD
  GBP: 0.85,   // 1 EUR = 0.85 GBP
};

const CURRENCY_CONFIG: Record<Currency, { symbol: string; locale: string; region: string; label: string; position: "before" | "after" }> = {
  EUR: { symbol: "€", locale: "fr-FR", region: "EU", label: "Europe", position: "after" },
  MAD: { symbol: "DH", locale: "fr-MA", region: "MA", label: "Maroc", position: "after" },
  USD: { symbol: "$", locale: "en-US", region: "US", label: "Americas", position: "before" },
  GBP: { symbol: "£", locale: "en-GB", region: "UK", label: "United Kingdom", position: "before" },
};

interface CurrencyProviderProps {
  children: ReactNode;
}

function readStoredCurrency(): Currency | null {
  try {
    const saved = localStorage.getItem("iwasp-currency");
    if (saved && ["EUR", "MAD", "USD", "GBP"].includes(saved)) return saved as Currency;
  } catch {
    // Ignore private-mode storage failures.
  }
  return null;
}

function localMarketCurrency(): "MAD" | "EUR" {
  try {
    return detectMarketCurrency({
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      languages: typeof navigator !== "undefined" ? navigator.languages : [],
    });
  } catch {
    return "EUR";
  }
}

export function CurrencyProvider({ children }: CurrencyProviderProps) {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    try {
      if (localStorage.getItem("iwasp-currency-manual") === "true") {
        return readStoredCurrency() ?? "EUR";
      }
    } catch {
      // Ignore private-mode storage failures.
    }
    return localMarketCurrency();
  });
  const [isAutoDetected, setIsAutoDetected] = useState(false);

  // Confirm Morocco with the hosting geo hint when the device clock/locale
  // does not already say Morocco. A failed lookup keeps the local result.
  useEffect(() => {
    let cancelled = false;
    const detectCurrency = async () => {
      try {
        if (localStorage.getItem("iwasp-currency-manual") === "true") return;
      } catch {
        return;
      }

      const local = localMarketCurrency();
      if (local === "MAD") {
        setCurrencyState("MAD");
        setIsAutoDetected(true);
        return;
      }

      try {
        const response = await fetch("/geo-hint", { signal: AbortSignal.timeout(2500) });
        const contentType = response.headers.get("content-type") ?? "";
        if (!response.ok || !contentType.includes("application/json")) return;
        const data = await response.json() as { country?: string; timeZone?: string };
        if (cancelled) return;
        const hinted = detectMarketCurrency({
          timeZone: data.timeZone,
          countryCode: data.country,
        });
        if (hinted === "MAD") {
          setCurrencyState("MAD");
          setIsAutoDetected(true);
        }
      } catch {
        // Timezone and locale already decided. Do not fall through to a third-party IP API.
      }
    };

    detectCurrency();
    return () => {
      cancelled = true;
    };
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
    const currencies: Currency[] = ["EUR", "MAD", "USD", "GBP"];
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
    
    if (currency === "MAD") {
      return `${amount.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} DH`;
    }
    
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
    
    if (currency === "MAD") {
      return `${amount.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} DH`;
    }
    
    return new Intl.NumberFormat(config.locale, {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Format dual price (show EUR or MAD based on detection)
  const formatDualPrice = (eurAmount: number, madAmount: number): string => {
    if (currency === "MAD") {
      return `${madAmount.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} DH`;
    }
    return `${eurAmount.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
  };

  const config = CURRENCY_CONFIG[currency];
  const isMAD = currency === "MAD";

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        toggleCurrency,
        formatPrice,
        formatAmount,
        formatDualPrice,
        region: config.region,
        regionLabel: config.label,
        currencySymbol: config.symbol,
        isAutoDetected,
        isMAD,
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

/** EUR outside a provider so isolated checkout tests keep a deterministic price. */
export function useMarketCurrency(): "EUR" | "MAD" {
  const context = useContext(CurrencyContext);
  return context?.currency === "MAD" ? "MAD" : "EUR";
}
