/**
 * Push Notifications Panel - Gold Members Only
 * Re-engage clients who scanned the card
 * Glassmorphism Noir & Or design
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Bell,
  Send,
  Users,
  Lock,
  Crown,
  MessageCircle,
  Zap,
  CheckCircle2,
  Sparkles,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import type { LeadWithCard } from "@/hooks/useLeads";

interface PushNotificationsPanelProps {
  leads: LeadWithCard[];
  isPremium: boolean;
  onUpgrade?: () => void;
}

interface NotificationTemplate {
  id: string;
  title: string;
  message: string;
  icon: React.ReactNode;
}

const TEMPLATES: NotificationTemplate[] = [
  {
    id: "promo",
    title: "Offre spéciale",
    message: "🎉 -20% sur votre prochaine visite ! Valable 48h seulement.",
    icon: <Zap className="h-4 w-4" />,
  },
  {
    id: "reminder",
    title: "On vous attend !",
    message: "Ça fait un moment ! Passez nous voir, on a plein de nouveautés 🌟",
    icon: <Clock className="h-4 w-4" />,
  },
  {
    id: "new",
    title: "Nouveauté",
    message: "Découvrez nos dernières créations ! 🆕 Disponibles dès maintenant.",
    icon: <Sparkles className="h-4 w-4" />,
  },
];

export function PushNotificationsPanel({ leads, isPremium, onUpgrade }: PushNotificationsPanelProps) {
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
  const [customTitle, setCustomTitle] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Eligible leads (with consent and contact info)
  const eligibleLeads = leads.filter(l => l.consent_given && (l.email || l.phone));
  const hotLeads = eligibleLeads.filter(l => l.lead_score >= 51);

  const handleSendNotification = async () => {
    if (!isPremium) {
      onUpgrade?.();
      return;
    }

    const title = selectedTemplate?.title || customTitle;
    const message = selectedTemplate?.message || customMessage;

    if (!title || !message) {
      toast.error("Veuillez remplir le titre et le message");
      return;
    }

    setIsSending(true);

    // Simulate sending (in production, this would call an edge function)
    setTimeout(() => {
      toast.success(`Notification envoyée à ${eligibleLeads.length} contacts !`);
      setShowComposeModal(false);
      setSelectedTemplate(null);
      setCustomTitle("");
      setCustomMessage("");
      setIsSending(false);
    }, 1500);
  };

  const handleTemplateSelect = (template: NotificationTemplate) => {
    setSelectedTemplate(template);
    setCustomTitle(template.title);
    setCustomMessage(template.message);
  };

  // Locked state for non-premium users
  if (!isPremium) {
    return (
      <Card className="card-glass border-border/50 backdrop-blur-xl overflow-hidden relative">
        {/* Gold gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />
        
        <div className="p-6 relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/30 to-amber-600/10 flex items-center justify-center">
              <Bell className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                Push Notifications
                <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-black border-0 text-[10px] px-2">
                  <Crown className="h-3 w-3 mr-1" />
                  GOLD
                </Badge>
              </h3>
              <p className="text-xs text-muted-foreground">Recontactez vos clients directement</p>
            </div>
          </div>

          {/* Locked preview */}
          <div className="space-y-3 opacity-50 blur-[1px]">
            {TEMPLATES.slice(0, 2).map((template) => (
              <div key={template.id} className="p-3 rounded-xl border border-border/30 bg-secondary/20">
                <div className="flex items-center gap-2 mb-1">
                  {template.icon}
                  <span className="text-sm font-medium">{template.title}</span>
                </div>
                <p className="text-xs text-muted-foreground">{template.message}</p>
              </div>
            ))}
          </div>

          {/* Lock overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center">
                <Lock className="h-8 w-8 text-amber-500" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">Fonctionnalité Gold</h4>
              <p className="text-sm text-muted-foreground mb-4 max-w-xs">
                Passez à l'abonnement Gold pour envoyer des notifications push à vos clients.
              </p>
              <Button
                variant="chrome"
                className="gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black"
                onClick={onUpgrade}
              >
                <Crown className="h-4 w-4" />
                Passer à Gold
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="card-glass border-border/50 backdrop-blur-xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center">
                <Bell className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  Push Notifications
                  <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-black border-0 text-[10px] px-1.5">
                    GOLD
                  </Badge>
                </h3>
                <p className="text-xs text-muted-foreground">
                  {eligibleLeads.length} contact{eligibleLeads.length > 1 ? "s" : ""} disponible{eligibleLeads.length > 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <Button
              variant="chrome"
              size="sm"
              className="gap-2"
              onClick={() => setShowComposeModal(true)}
              disabled={eligibleLeads.length === 0}
            >
              <Send className="h-4 w-4" />
              Envoyer
            </Button>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-xl bg-secondary/30 border border-border/30">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-lg font-bold text-foreground">{eligibleLeads.length}</span>
              </div>
              <p className="text-xs text-muted-foreground">Contacts joignables</p>
            </div>
            <div className="p-3 rounded-xl bg-secondary/30 border border-border/30">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="h-4 w-4 text-amber-500" />
                <span className="text-lg font-bold text-foreground">{hotLeads.length}</span>
              </div>
              <p className="text-xs text-muted-foreground">Leads chauds</p>
            </div>
          </div>

          {/* Quick templates */}
          <p className="text-xs font-medium text-muted-foreground mb-2">Templates rapides</p>
          <div className="space-y-2">
            {TEMPLATES.map((template) => (
              <motion.button
                key={template.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => {
                  handleTemplateSelect(template);
                  setShowComposeModal(true);
                }}
                className="w-full p-3 rounded-xl border border-border/30 bg-secondary/20 hover:bg-secondary/40 transition-all text-left"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                    {template.icon}
                  </div>
                  <span className="text-sm font-medium text-foreground">{template.title}</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1 ml-8">{template.message}</p>
              </motion.button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Compose Modal */}
      <Dialog open={showComposeModal} onOpenChange={setShowComposeModal}>
        <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-xl border-border/50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              Nouvelle notification
            </DialogTitle>
            <DialogDescription>
              Envoyez un message à {eligibleLeads.length} contact{eligibleLeads.length > 1 ? "s" : ""}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Titre</label>
              <Input
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="Ex: Offre spéciale !"
                className="bg-secondary/50 border-border/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Ex: -20% sur votre prochaine visite..."
                className="bg-secondary/50 border-border/50 min-h-[100px]"
              />
            </div>

            {/* Preview */}
            {(customTitle || customMessage) && (
              <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/30">
                <p className="text-xs text-amber-500 mb-2 font-medium">Aperçu</p>
                <div className="bg-background/80 rounded-lg p-3 shadow-sm">
                  <p className="font-semibold text-sm">{customTitle || "Titre..."}</p>
                  <p className="text-xs text-muted-foreground mt-1">{customMessage || "Message..."}</p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowComposeModal(false)}>
              Annuler
            </Button>
            <Button
              variant="chrome"
              onClick={handleSendNotification}
              disabled={isSending || !customTitle || !customMessage}
              className="gap-2"
            >
              {isSending ? (
                <>
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Envoi...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Envoyer à {eligibleLeads.length} contact{eligibleLeads.length > 1 ? "s" : ""}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
