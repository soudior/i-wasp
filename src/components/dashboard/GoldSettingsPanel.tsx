/**
 * Gold Settings Panel - Navigation & Modulability
 * WiFi toggle, Code change, Magic Import access
 * Premium control center
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Settings,
  Wifi,
  WifiOff,
  Link,
  QrCode,
  Wand2,
  Crown,
  ChevronRight,
  Shield,
  Key,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

interface GoldSettingsPanelProps {
  wifiEnabled?: boolean;
  wifiSSID?: string;
  wifiPassword?: string;
  onWifiToggle?: (enabled: boolean) => void;
  onMagicImport?: () => void;
  cardSlug?: string;
}

export function GoldSettingsPanel({
  wifiEnabled = false,
  wifiSSID = "",
  wifiPassword = "",
  onWifiToggle,
  onMagicImport,
  cardSlug,
}: GoldSettingsPanelProps) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handlePasswordChange = async () => {
    if (!newPassword || newPassword.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }
    
    setIsUpdating(true);
    // Simulate API call
    setTimeout(() => {
      toast.success("Mot de passe WiFi mis à jour");
      setShowPasswordModal(false);
      setNewPassword("");
      setIsUpdating(false);
    }, 1000);
  };

  const handleCopyLink = () => {
    if (!cardSlug) return;
    navigator.clipboard.writeText(`${window.location.origin}/c/${cardSlug}`);
    toast.success("Lien copié !");
  };

  return (
    <>
      <Card className="relative overflow-hidden card-glass border-amber-500/20 backdrop-blur-xl">
        {/* Gold accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600" />

        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 flex items-center justify-center">
              <Settings className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
                Contrôle Gold
                <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-black border-0 text-[10px]">
                  <Crown className="h-3 w-3 mr-0.5" />
                  PRO
                </Badge>
              </h3>
              <p className="text-sm text-muted-foreground">Navigation & Modulabilité</p>
            </div>
          </div>

          {/* Settings Grid */}
          <div className="space-y-4">
            {/* WiFi Toggle */}
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 rounded-2xl bg-secondary/30 border border-border/50 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  wifiEnabled 
                    ? "bg-emerald-500/20 text-emerald-500" 
                    : "bg-secondary text-muted-foreground"
                }`}>
                  {wifiEnabled ? <Wifi className="h-5 w-5" /> : <WifiOff className="h-5 w-5" />}
                </div>
                <div>
                  <p className="font-medium text-foreground">WiFi QR Code</p>
                  <p className="text-xs text-muted-foreground">
                    {wifiEnabled ? `Réseau: ${wifiSSID || "Non configuré"}` : "Désactivé"}
                  </p>
                </div>
              </div>
              <Switch
                checked={wifiEnabled}
                onCheckedChange={onWifiToggle}
              />
            </motion.div>

            {/* Change Password */}
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              onClick={() => setShowPasswordModal(true)}
              className="w-full p-4 rounded-2xl bg-secondary/30 border border-border/50 flex items-center justify-between hover:bg-secondary/50 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                  <Key className="h-5 w-5 text-violet-500" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Changer le code WiFi</p>
                  <p className="text-xs text-muted-foreground">Mettre à jour le mot de passe</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </motion.button>

            {/* Magic Import */}
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              onClick={onMagicImport}
              className="w-full p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-amber-600/5 border border-amber-500/30 flex items-center justify-between hover:from-amber-500/20 hover:to-amber-600/10 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/30 to-amber-600/20 flex items-center justify-center">
                  <Wand2 className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="font-medium text-foreground flex items-center gap-2">
                    Magic Import
                    <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30 text-[10px]">
                      NEW
                    </Badge>
                  </p>
                  <p className="text-xs text-muted-foreground">Mettre à jour via URL du site</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-amber-500" />
            </motion.button>

            {/* Copy Card Link */}
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              onClick={handleCopyLink}
              disabled={!cardSlug}
              className="w-full p-4 rounded-2xl bg-secondary/30 border border-border/50 flex items-center justify-between hover:bg-secondary/50 transition-colors text-left disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Link className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Copier le lien</p>
                  <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                    {cardSlug ? `${window.location.origin}/c/${cardSlug}` : "Aucune carte"}
                  </p>
                </div>
              </div>
              <ExternalLink className="h-5 w-5 text-muted-foreground" />
            </motion.button>
          </div>

          {/* Security badge */}
          <div className="mt-6 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
            <Shield className="h-5 w-5 text-emerald-500" />
            <p className="text-xs text-emerald-500">
              Toutes vos données sont cryptées et sécurisées
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Password Change Modal */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-xl border-border/50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-amber-500" />
              Changer le mot de passe WiFi
            </DialogTitle>
            <DialogDescription>
              Entrez le nouveau mot de passe pour votre réseau WiFi
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nouveau mot de passe</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 8 caractères"
                className="bg-secondary/50 border-border/50"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordModal(false)}>
              Annuler
            </Button>
            <Button
              onClick={handlePasswordChange}
              disabled={isUpdating}
              className="gap-2 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-black"
            >
              {isUpdating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Mise à jour...
                </>
              ) : (
                "Mettre à jour"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
