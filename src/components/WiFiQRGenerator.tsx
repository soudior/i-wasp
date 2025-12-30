/**
 * WiFiQRGenerator - Génération QR Wi-Fi automatique
 * 
 * Fonctionnalités :
 * - QR Wi-Fi standard (format WIFI:T:WPA;S:SSID;P:PASSWORD;;)
 * - Couleurs extraites du logo client
 * - Mot de passe JAMAIS visible
 * - Connexion en un geste (scan QR)
 * - Design discret et propre
 */

import { useState, useEffect, useMemo } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Wifi, Eye, EyeOff, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { extractColorsFromLogo, type ColorPalette } from "@/lib/adaptiveTemplateEngine";
import { toast } from "sonner";

type SecurityType = "WPA" | "WEP" | "nopass";

interface WiFiConfig {
  ssid: string;
  password: string;
  security: SecurityType;
  hidden?: boolean;
}

interface WiFiQRGeneratorProps {
  logoUrl?: string;
  initialConfig?: Partial<WiFiConfig>;
  onConfigChange?: (config: WiFiConfig) => void;
  readOnly?: boolean;
  className?: string;
}

/**
 * Generate Wi-Fi QR code string
 * Format: WIFI:T:<security>;S:<SSID>;P:<password>;H:<hidden>;;
 */
function generateWiFiString(config: WiFiConfig): string {
  const { ssid, password, security, hidden } = config;
  
  // Escape special characters in SSID and password
  const escapeValue = (str: string) => 
    str.replace(/\\/g, "\\\\")
       .replace(/;/g, "\\;")
       .replace(/:/g, "\\:")
       .replace(/"/g, '\\"');
  
  const escapedSSID = escapeValue(ssid);
  const escapedPassword = security !== "nopass" ? escapeValue(password) : "";
  
  let wifiString = `WIFI:T:${security};S:${escapedSSID};`;
  
  if (security !== "nopass" && escapedPassword) {
    wifiString += `P:${escapedPassword};`;
  }
  
  if (hidden) {
    wifiString += "H:true;";
  }
  
  wifiString += ";";
  
  return wifiString;
}

export function WiFiQRGenerator({
  logoUrl,
  initialConfig,
  onConfigChange,
  readOnly = false,
  className = "",
}: WiFiQRGeneratorProps) {
  const [config, setConfig] = useState<WiFiConfig>({
    ssid: initialConfig?.ssid || "",
    password: initialConfig?.password || "",
    security: initialConfig?.security || "WPA",
    hidden: initialConfig?.hidden || false,
  });
  
  const [palette, setPalette] = useState<ColorPalette | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  // Extract colors from logo
  useEffect(() => {
    if (!logoUrl) {
      setPalette(null);
      return;
    }
    
    extractColorsFromLogo(logoUrl)
      .then(setPalette)
      .catch(() => setPalette(null));
  }, [logoUrl]);

  // Notify parent of config changes
  useEffect(() => {
    onConfigChange?.(config);
  }, [config, onConfigChange]);

  const updateConfig = (updates: Partial<WiFiConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  // Generate QR string
  const wifiString = useMemo(() => {
    if (!config.ssid) return "";
    return generateWiFiString(config);
  }, [config]);

  // QR colors from palette
  const qrFgColor = palette ? `hsl(${palette.primary})` : "hsl(240 8% 4%)";
  const qrBgColor = "transparent";

  const copySSID = async () => {
    if (!config.ssid) return;
    
    try {
      await navigator.clipboard.writeText(config.ssid);
      setCopied(true);
      toast.success("SSID copié");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Impossible de copier");
    }
  };

  const isValid = config.ssid.length > 0 && 
    (config.security === "nopass" || config.password.length > 0);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Configuration (si pas en lecture seule) */}
      {!readOnly && (
        <div className="space-y-4">
          {/* SSID */}
          <div className="space-y-2">
            <Label htmlFor="ssid" className="text-sm text-muted-foreground">
              Nom du réseau (SSID)
            </Label>
            <Input
              id="ssid"
              type="text"
              value={config.ssid}
              onChange={(e) => updateConfig({ ssid: e.target.value })}
              placeholder="MonReseau"
              maxLength={32}
              className="bg-card border-border/50"
            />
          </div>

          {/* Security type */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">
              Sécurité
            </Label>
            <Select
              value={config.security}
              onValueChange={(value: SecurityType) => updateConfig({ security: value })}
            >
              <SelectTrigger className="bg-card border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WPA">WPA/WPA2/WPA3</SelectItem>
                <SelectItem value="WEP">WEP</SelectItem>
                <SelectItem value="nopass">Réseau ouvert</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Password (hidden by default) */}
          {config.security !== "nopass" && (
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm text-muted-foreground">
                Mot de passe
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={config.password}
                  onChange={(e) => updateConfig({ password: e.target.value })}
                  placeholder="••••••••"
                  maxLength={63}
                  className="bg-card border-border/50 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Masquer" : "Afficher"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Le mot de passe est encodé dans le QR et ne sera jamais affiché.
              </p>
            </div>
          )}
        </div>
      )}

      {/* QR Code Display */}
      {isValid && (
        <div className="flex flex-col items-center gap-4">
          {/* QR Code avec couleurs extraites */}
          <div 
            className="p-6 rounded-2xl border border-border/30"
            style={{
              background: palette 
                ? `linear-gradient(135deg, hsl(${palette.background}) 0%, hsl(${palette.secondary}) 100%)`
                : "hsl(var(--card))",
            }}
          >
            <div className="bg-white p-4 rounded-xl">
              <QRCodeSVG
                value={wifiString}
                size={180}
                level="M"
                fgColor={qrFgColor}
                bgColor={qrBgColor}
                includeMargin={false}
              />
            </div>
          </div>

          {/* SSID avec copie */}
          <div className="flex items-center gap-2 text-sm">
            <Wifi className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{config.ssid}</span>
            <button
              onClick={copySSID}
              className="p-1 rounded hover:bg-muted transition-colors"
              aria-label="Copier SSID"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-green-500" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-muted-foreground" />
              )}
            </button>
          </div>

          {/* Instructions */}
          <p className="text-xs text-center text-muted-foreground max-w-[200px]">
            Scannez le QR code pour vous connecter automatiquement au réseau Wi-Fi
          </p>
        </div>
      )}

      {/* Empty state */}
      {!isValid && !readOnly && (
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center">
            <Wifi className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            Configurez le réseau Wi-Fi pour générer le QR code
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * WiFiQRDisplay - Affichage seul du QR Wi-Fi (pour les cartes NFC)
 * Mot de passe JAMAIS visible
 */
export function WiFiQRDisplay({
  ssid,
  password,
  security = "WPA",
  logoUrl,
  size = 120,
  className = "",
}: {
  ssid: string;
  password: string;
  security?: SecurityType;
  logoUrl?: string;
  size?: number;
  className?: string;
}) {
  const [palette, setPalette] = useState<ColorPalette | null>(null);

  useEffect(() => {
    if (!logoUrl) return;
    extractColorsFromLogo(logoUrl).then(setPalette).catch(() => {});
  }, [logoUrl]);

  const wifiString = useMemo(() => 
    generateWiFiString({ ssid, password, security }), 
    [ssid, password, security]
  );

  const qrFgColor = palette ? `hsl(${palette.primary})` : "hsl(240 8% 4%)";

  if (!ssid) return null;

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className="bg-white p-3 rounded-xl">
        <QRCodeSVG
          value={wifiString}
          size={size}
          level="M"
          fgColor={qrFgColor}
          bgColor="transparent"
          includeMargin={false}
        />
      </div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Wifi className="w-3 h-3" />
        <span>{ssid}</span>
      </div>
    </div>
  );
}