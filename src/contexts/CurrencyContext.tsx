/**
 * CurrencyContext - Global Currency Management
 * Supports EUR (France/EU) and MAD (Morocco/MENA)
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
  region: "FR" | "MA";
  regionLabel: string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Conversion rate: 1 EUR ≈ 10.8 MAD (approximate)
const EUR_TO_MAD_RATE = 10.8;

interface CurrencyProviderProps {
  children: ReactNode;
}

export function CurrencyProvider({ children }: CurrencyProviderProps) {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    // Load from localStorage or default to MAD
    const saved = localStorage.getItem("iwasp-currency");
    return (saved as Currency) || "MAD";
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("iwasp-currency", currency);
  }, [currency]);

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
  };

  const toggleCurrency = () => {
    setCurrencyState(prev => prev === "EUR" ? "MAD" : "EUR");
  };

  // Convert EUR to MAD
  const convertToMAD = (eurAmount: number): number => {
    return Math.round(eurAmount * EUR_TO_MAD_RATE);
  };

  // Convert MAD to EUR
  const convertToEUR = (madAmount: number): number => {
    return Math.round((madAmount / EUR_TO_MAD_RATE) * 100) / 100;
  };

  // Format price from cents
  const formatPrice = (amountCents: number): string => {
    const amount = amountCents / 100;
    
    if (currency === "EUR") {
      return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(amount);
    } else {
      // Convert EUR to MAD
      const madAmount = convertToMAD(amount);
      return `${new Intl.NumberFormat("fr-MA", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(madAmount)} DH`;
    }
  };

  // Format a plain amount (not cents)
  const formatAmount = (amount: number): string => {
    if (currency === "EUR") {
      return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(amount);
    } else {
      return `${new Intl.NumberFormat("fr-MA", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount)} DH`;
    }
  };

  const region = currency === "EUR" ? "FR" : "MA";
  const regionLabel = currency === "EUR" ? "France / EU" : "Maroc / MENA";

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
        region,
        regionLabel,
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
