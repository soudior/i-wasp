/**
 * CurrencySwitch - Global Currency Toggle Component
 * Stealth Luxury Style (#050807, #A5A9B4, #D1D5DB)
 */

import { useCurrency } from "@/contexts/CurrencyContext";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface CurrencySwitchProps {
  variant?: "default" | "compact" | "pill";
  className?: string;
}

export function CurrencySwitch({ variant = "default", className }: CurrencySwitchProps) {
  const { currency, toggleCurrency, regionLabel } = useCurrency();

  if (variant === "compact") {
    return (
      <button
        onClick={toggleCurrency}
        className={cn(
          "flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium transition-all",
          "bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#A5A9B4]/40",
          "text-[#A5A9B4]",
          className
        )}
        title={`Changer vers ${currency === "EUR" ? "MAD" : "EUR"}`}
      >
        <Globe size={12} />
        {currency}
      </button>
    );
  }

  if (variant === "pill") {
    return (
      <button
        onClick={toggleCurrency}
        className={cn(
          "relative flex items-center h-8 rounded-full p-0.5 transition-all",
          "bg-[#0A0D0C] border border-[rgba(165,169,180,0.15)]",
          className
        )}
      >
        {/* Background slider */}
        <div
          className="absolute h-7 w-12 rounded-full transition-all duration-300"
          style={{
            backgroundColor: "#A5A9B4",
            left: currency === "EUR" ? "2px" : "calc(100% - 50px)",
          }}
        />
        
        {/* EUR option */}
        <span
          className={cn(
            "relative z-10 px-3 py-1 text-xs font-bold tracking-wide transition-colors",
            currency === "EUR" ? "text-[#050807]" : "text-[rgba(249,250,251,0.5)]"
          )}
        >
          EUR
        </span>
        
        {/* MAD option */}
        <span
          className={cn(
            "relative z-10 px-3 py-1 text-xs font-bold tracking-wide transition-colors",
            currency === "MAD" ? "text-[#050807]" : "text-[rgba(249,250,251,0.5)]"
          )}
        >
          MAD
        </span>
      </button>
    );
  }

  // Default variant
  return (
    <button
      onClick={toggleCurrency}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-full transition-all",
        "bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#A5A9B4]/40",
        className
      )}
    >
      <Globe size={14} className="text-[#A5A9B4]" />
      <span className="text-xs font-bold tracking-widest text-[#F9FAFB]">
        {regionLabel}
      </span>
    </button>
  );
}

export default CurrencySwitch;
