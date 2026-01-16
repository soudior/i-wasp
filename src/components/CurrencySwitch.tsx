/**
 * CurrencySwitch - Global Currency Toggle Component
 * International: EUR, USD, GBP
 */

import { useCurrency, Currency } from "@/contexts/CurrencyContext";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface CurrencySwitchProps {
  variant?: "default" | "compact" | "pill";
  className?: string;
}

const currencyOrder: Currency[] = ["EUR", "USD", "GBP"];

export function CurrencySwitch({ variant = "default", className }: CurrencySwitchProps) {
  const { currency, setCurrency, regionLabel } = useCurrency();

  const handleClick = () => {
    const currentIndex = currencyOrder.indexOf(currency);
    const nextIndex = (currentIndex + 1) % currencyOrder.length;
    setCurrency(currencyOrder[nextIndex]);
  };

  if (variant === "compact") {
    return (
      <button
        onClick={handleClick}
        className={cn(
          "flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium transition-all",
          "bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#A5A9B4]/40",
          "text-[#A5A9B4]",
          className
        )}
        title={`Switch currency`}
      >
        <Globe size={12} />
        {currency}
      </button>
    );
  }

  if (variant === "pill") {
    const currentIndex = currencyOrder.indexOf(currency);
    
    return (
      <div
        className={cn(
          "relative flex items-center h-8 rounded-full p-0.5",
          "bg-[#0A0D0C] border border-[rgba(165,169,180,0.15)]",
          className
        )}
      >
        {/* Background slider */}
        <div
          className="absolute h-7 w-12 rounded-full transition-all duration-300"
          style={{
            backgroundColor: "#A5A9B4",
            left: `${2 + currentIndex * 48}px`,
          }}
        />
        
        {currencyOrder.map((curr, index) => (
          <button
            key={curr}
            onClick={() => setCurrency(curr)}
            className={cn(
              "relative z-10 px-3 py-1 text-xs font-bold tracking-wide transition-colors",
              currency === curr ? "text-[#050807]" : "text-[rgba(249,250,251,0.5)]"
            )}
          >
            {curr}
          </button>
        ))}
      </div>
    );
  }

  // Default variant
  return (
    <button
      onClick={handleClick}
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
