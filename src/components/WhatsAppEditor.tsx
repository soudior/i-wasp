/**
 * WhatsAppEditor - Module WhatsApp & Contact premium IWASP
 * 
 * Fonctionnalités:
 * - Validation par pays avec indicatif
 * - Message pré-rempli optionnel
 * - Bouton aperçu cliquable
 * - Détection automatique si numéro mobile fourni
 */

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, 
  Phone, 
  Check, 
  AlertCircle,
  ExternalLink,
  ChevronDown,
  Sparkles
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface WhatsAppData {
  number: string;
  countryCode: string;
  message?: string;
}

interface WhatsAppEditorProps {
  value: WhatsAppData;
  onChange: (data: WhatsAppData) => void;
  phoneNumber?: string; // Optional: auto-detect from phone field
  className?: string;
}

// Country codes with flags and validation patterns
const COUNTRY_CODES = [
  { code: "+33", country: "France", flag: "🇫🇷", pattern: /^[67]\d{8}$/ },
  { code: "+212", country: "Maroc", flag: "🇲🇦", pattern: /^[67]\d{8}$/ },
  { code: "+1", country: "USA/Canada", flag: "🇺🇸", pattern: /^\d{10}$/ },
  { code: "+44", country: "UK", flag: "🇬🇧", pattern: /^7\d{9}$/ },
  { code: "+34", country: "Espagne", flag: "🇪🇸", pattern: /^[67]\d{8}$/ },
  { code: "+49", country: "Allemagne", flag: "🇩🇪", pattern: /^1[567]\d{8,9}$/ },
  { code: "+39", country: "Italie", flag: "🇮🇹", pattern: /^3\d{9}$/ },
  { code: "+32", country: "Belgique", flag: "🇧🇪", pattern: /^4\d{8}$/ },
  { code: "+41", country: "Suisse", flag: "🇨🇭", pattern: /^7[6-9]\d{7}$/ },
  { code: "+351", country: "Portugal", flag: "🇵🇹", pattern: /^9\d{8}$/ },
  { code: "+971", country: "UAE", flag: "🇦🇪", pattern: /^5\d{8}$/ },
  { code: "+966", country: "Arabie Saoudite", flag: "🇸🇦", pattern: /^5\d{8}$/ },
  { code: "+213", country: "Algérie", flag: "🇩🇿", pattern: /^[567]\d{8}$/ },
  { code: "+216", country: "Tunisie", flag: "🇹🇳", pattern: /^[259]\d{7}$/ },
  { code: "+221", country: "Sénégal", flag: "🇸🇳", pattern: /^7\d{8}$/ },
  { code: "+225", country: "Côte d'Ivoire", flag: "🇨🇮", pattern: /^[027]\d{8}$/ },
];

// Detect country code from full phone number
function detectCountryCode(phone: string): { code: string; number: string } | null {
  const cleaned = phone.replace(/\D/g, "");
  
  // Sort by code length descending to match longer codes first
  const sortedCodes = [...COUNTRY_CODES].sort((a, b) => b.code.length - a.code.length);
  
  for (const country of sortedCodes) {
    const codeDigits = country.code.replace("+", "");
    if (cleaned.startsWith(codeDigits)) {
      return {
        code: country.code,
        number: cleaned.slice(codeDigits.length),
      };
    }
  }
  
  return null;
}

// Validate phone number for country
function validatePhoneForCountry(number: string, countryCode: string): { valid: boolean; error?: string } {
  const country = COUNTRY_CODES.find(c => c.code === countryCode);
  if (!country) {
    return { valid: true }; // Allow unknown countries
  }
  
  const cleaned = number.replace(/\D/g, "");
  if (!cleaned) {
    return { valid: false, error: "Numéro requis" };
  }
  
  if (!country.pattern.test(cleaned)) {
    return { valid: false, error: `Format invalide pour ${country.country}` };
  }
  
  return { valid: true };
}

// Generate WhatsApp URL
function getWhatsAppUrl(countryCode: string, number: string, message?: string): string {
  const cleanNumber = number.replace(/\D/g, "");
  const fullNumber = countryCode.replace("+", "") + cleanNumber;
  
  let url = `https://wa.me/${fullNumber}`;
  if (message) {
    url += `?text=${encodeURIComponent(message)}`;
  }
  return url;
}

export function WhatsAppEditor({ value, onChange, phoneNumber, className }: WhatsAppEditorProps) {
  const [showMessage, setShowMessage] = useState(Boolean(value.message));
  const [autoDetected, setAutoDetected] = useState(false);

  // Validation
  const validation = useMemo(() => {
    if (!value.number) return { valid: false, error: "Numéro requis" };
    return validatePhoneForCountry(value.number, value.countryCode);
  }, [value.number, value.countryCode]);

  // Auto-detect from phone number prop
  useEffect(() => {
    if (phoneNumber && !value.number && !autoDetected) {
      const detected = detectCountryCode(phoneNumber);
      if (detected) {
        onChange({
          ...value,
          countryCode: detected.code,
          number: detected.number,
        });
        setAutoDetected(true);
      } else {
        // Just use the number as-is with default country
        const cleaned = phoneNumber.replace(/\D/g, "");
        if (cleaned.length >= 8) {
          onChange({
            ...value,
            number: cleaned,
          });
          setAutoDetected(true);
        }
      }
    }
  }, [phoneNumber, value, onChange, autoDetected]);

  const handleNumberChange = (input: string) => {
    // If user pastes full number with country code, detect it
    if (input.startsWith("+") || input.length > 10) {
      const detected = detectCountryCode(input);
      if (detected) {
        onChange({
          ...value,
          countryCode: detected.code,
          number: detected.number,
        });
        return;
      }
    }
    
    // Clean and update
    const cleaned = input.replace(/[^\d]/g, "");
    onChange({ ...value, number: cleaned });
  };

  const fullNumber = value.countryCode + value.number.replace(/\D/g, "");
  const whatsappUrl = getWhatsAppUrl(value.countryCode, value.number, value.message);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <MessageCircle size={16} className="text-green-500" />
        <span className="text-sm font-medium">WhatsApp</span>
        {autoDetected && (
          <span className="flex items-center gap-1 text-xs text-accent bg-accent/10 px-2 py-0.5 rounded-full">
            <Sparkles size={10} />
            Auto-détecté
          </span>
        )}
      </div>

      {/* Country + Number */}
      <div className="flex gap-2">
        <Select
          value={value.countryCode}
          onValueChange={(code) => onChange({ ...value, countryCode: code })}
        >
          <SelectTrigger className="w-28 h-11 rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-60 bg-background border-border z-50">
            {COUNTRY_CODES.map((country) => (
              <SelectItem key={country.code} value={country.code}>
                <span className="flex items-center gap-2">
                  <span>{country.flag}</span>
                  <span className="text-sm">{country.code}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <div className="flex-1 relative">
          <Input
            value={value.number}
            onChange={(e) => handleNumberChange(e.target.value)}
            placeholder="612345678"
            type="tel"
            className={cn(
              "h-11 rounded-xl pr-10",
              validation.valid ? "border-border" : "border-amber-500/50"
            )}
          />
          {value.number && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {validation.valid ? (
                <Check size={16} className="text-green-500" />
              ) : (
                <AlertCircle size={16} className="text-amber-500" />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Validation error */}
      <AnimatePresence>
        {!validation.valid && validation.error && value.number && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-xs text-amber-500"
          >
            {validation.error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Message toggle */}
      <button
        type="button"
        onClick={() => setShowMessage(!showMessage)}
        className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronDown 
          size={14} 
          className={cn("transition-transform", showMessage && "rotate-180")} 
        />
        Message pré-rempli (optionnel)
      </button>

      {/* Pre-filled message */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <Textarea
              value={value.message || ""}
              onChange={(e) => onChange({ ...value, message: e.target.value })}
              placeholder="Bonjour, je vous contacte via votre carte IWASP..."
              className="min-h-[80px] rounded-xl resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Ce message sera pré-rempli quand quelqu'un vous contacte
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview card */}
      {validation.valid && value.number && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-green-500/20 bg-green-500/5">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                    <MessageCircle size={14} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Aperçu WhatsApp</p>
                    <p className="text-xs text-muted-foreground">{fullNumber}</p>
                  </div>
                </div>
                <Check size={16} className="text-green-500" />
              </div>
              
              {value.message && (
                <div className="bg-background/50 rounded-lg p-2">
                  <p className="text-xs text-muted-foreground line-clamp-2">{value.message}</p>
                </div>
              )}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => window.open(whatsappUrl, "_blank")}
                className="w-full h-10 rounded-xl border-green-500/30 text-green-600 hover:bg-green-500/10"
              >
                <ExternalLink size={14} className="mr-2" />
                Tester le lien WhatsApp
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Quick suggestion if phone provided but WhatsApp not set */}
      {phoneNumber && !value.number && (
        <motion.button
          type="button"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => {
            const detected = detectCountryCode(phoneNumber);
            if (detected) {
              onChange({
                ...value,
                countryCode: detected.code,
                number: detected.number,
              });
            } else {
              onChange({
                ...value,
                number: phoneNumber.replace(/\D/g, ""),
              });
            }
            setAutoDetected(true);
          }}
          className="flex items-center gap-2 p-3 rounded-xl bg-accent/5 border border-accent/20 hover:bg-accent/10 transition-colors text-left w-full"
        >
          <Sparkles size={14} className="text-accent shrink-0" />
          <div>
            <p className="text-sm font-medium">Utiliser votre numéro de téléphone</p>
            <p className="text-xs text-muted-foreground">{phoneNumber}</p>
          </div>
        </motion.button>
      )}
    </div>
  );
}

export default WhatsAppEditor;
