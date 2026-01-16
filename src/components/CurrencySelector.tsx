/**
 * CurrencySelector - Sélecteur de devise avec drapeaux
 * 
 * Design IWASP:
 * - Dropdown élégant avec arrière-plan opaque
 * - Drapeaux et symboles de devise
 * - Animation subtile
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { useCurrency, Currency } from "@/contexts/CurrencyContext";

interface CurrencyOption {
  code: Currency;
  name: string;
  symbol: string;
  flag: string;
}

const currencies: CurrencyOption[] = [
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
];

interface CurrencySelectorProps {
  variant?: "default" | "compact" | "stealth";
  className?: string;
}

export function CurrencySelector({ 
  variant = "default",
  className = "" 
}: CurrencySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { currency, setCurrency } = useCurrency();

  const currentCurrency = currencies.find(c => c.code === currency) || currencies[0];

  const handleSelect = (code: Currency) => {
    setCurrency(code);
    setIsOpen(false);
  };

  if (variant === "compact") {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md text-sm transition-colors hover:bg-muted/50"
        >
          <span>{currentCurrency.flag}</span>
          <span className="font-medium">{currentCurrency.symbol}</span>
          <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsOpen(false)} 
              />
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-1 w-40 bg-popover border border-border rounded-lg shadow-lg z-50 overflow-hidden"
              >
                {currencies.map((curr) => (
                  <button
                    key={curr.code}
                    onClick={() => handleSelect(curr.code)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-muted ${
                      currency === curr.code ? "bg-primary/10 text-primary" : ""
                    }`}
                  >
                    <span className="text-base">{curr.flag}</span>
                    <span className="flex-1 text-left font-medium">{curr.code}</span>
                    <span className="text-muted-foreground">{curr.symbol}</span>
                    {currency === curr.code && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (variant === "stealth") {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-full text-sm transition-all border border-white/10 bg-white/5 hover:bg-white/10"
          style={{ backdropFilter: "blur(8px)" }}
        >
          <span className="text-base">{currentCurrency.flag}</span>
          <span className="font-medium text-white">{currentCurrency.code}</span>
          <ChevronDown className={`w-3.5 h-3.5 text-white/60 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsOpen(false)} 
              />
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-48 rounded-xl shadow-2xl z-50 overflow-hidden"
                style={{ 
                  backgroundColor: "#1C1C1E",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div className="py-1">
                  {currencies.map((curr) => (
                    <button
                      key={curr.code}
                      onClick={() => handleSelect(curr.code)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                        currency === curr.code 
                          ? "bg-white/10" 
                          : "hover:bg-white/5"
                      }`}
                    >
                      <span className="text-lg">{curr.flag}</span>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-white">{curr.code}</p>
                        <p className="text-xs text-white/50">{curr.name}</p>
                      </div>
                      <span className="text-white/40 font-medium">{curr.symbol}</span>
                      {currency === curr.code && (
                        <Check className="w-4 h-4 text-amber-400" />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border border-border bg-card hover:bg-muted shadow-sm"
      >
        <span className="text-lg">{currentCurrency.flag}</span>
        <span>{currentCurrency.code}</span>
        <span className="text-muted-foreground">{currentCurrency.symbol}</span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-56 bg-popover border border-border rounded-xl shadow-xl z-50 overflow-hidden"
            >
              <div className="p-1">
                {currencies.map((curr) => (
                  <button
                    key={curr.code}
                    onClick={() => handleSelect(curr.code)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      currency === curr.code 
                        ? "bg-primary/10 text-primary" 
                        : "hover:bg-muted"
                    }`}
                  >
                    <span className="text-xl">{curr.flag}</span>
                    <div className="flex-1 text-left">
                      <p className="font-medium">{curr.code}</p>
                      <p className="text-xs text-muted-foreground">{curr.name}</p>
                    </div>
                    <span className="text-muted-foreground font-medium">{curr.symbol}</span>
                    {currency === curr.code && (
                      <Check className="w-4 h-4" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CurrencySelector;
