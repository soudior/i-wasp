import { useState } from "react";
import { Phone, MessageCircle, Copy, Mail, MapPin, Globe, X, Navigation, ExternalLink } from "lucide-react";
import { SocialIcon } from "@/components/SocialIcon";
import { cn } from "@/lib/utils";
import { copyToClipboard, handlePhoneTap, handleWhatsAppTap, handleEmailTap, handleWebsiteTap, handleSmsTap } from "@/lib/smartActions";
import { getMapUrl, isIOS } from "@/lib/socialNetworks";
import { toast } from "sonner";

export type ActionSheetType = "phone" | "email" | "location" | "social" | "website";

interface ActionSheetOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "destructive";
}

interface ActionSheetProps {
  open: boolean;
  onClose: () => void;
  type: ActionSheetType;
  value: string;
  label?: string;
}

export function ActionSheet({ open, onClose, type, value, label }: ActionSheetProps) {
  if (!open) return null;

  const handleCopy = async (text: string, what: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      toast.success(`${what} copié !`);
    }
    onClose();
  };

  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  // Build options based on type
  const getOptions = (): ActionSheetOption[] => {
    switch (type) {
      case "phone":
        return [
          {
            id: "call",
            label: "Appeler",
            icon: <Phone size={20} />,
            onClick: () => handleAction(() => handlePhoneTap(value)),
          },
          {
            id: "whatsapp",
            label: "WhatsApp",
            icon: <SocialIcon networkId="whatsapp" size={20} />,
            onClick: () => handleAction(() => handleWhatsAppTap(value)),
          },
          {
            id: "sms",
            label: "Envoyer un SMS",
            icon: <MessageCircle size={20} />,
            onClick: () => handleAction(() => handleSmsTap(value)),
          },
          {
            id: "copy",
            label: "Copier le numéro",
            icon: <Copy size={20} />,
            onClick: () => handleCopy(value, "Numéro"),
          },
        ];

      case "email":
        return [
          {
            id: "email",
            label: "Envoyer un email",
            icon: <Mail size={20} />,
            onClick: () => handleAction(() => handleEmailTap(value)),
          },
          {
            id: "copy",
            label: "Copier l'email",
            icon: <Copy size={20} />,
            onClick: () => handleCopy(value, "Email"),
          },
        ];

      case "location":
        const options: ActionSheetOption[] = [
          {
            id: "google",
            label: "Google Maps",
            icon: <Navigation size={20} />,
            onClick: () => handleAction(() => window.open(getMapUrl(value, "google"), "_blank")),
          },
          {
            id: "waze",
            label: "Waze",
            icon: <Navigation size={20} />,
            onClick: () => handleAction(() => window.open(getMapUrl(value, "waze"), "_blank")),
          },
        ];
        if (isIOS()) {
          options.push({
            id: "apple",
            label: "Apple Plans",
            icon: <MapPin size={20} />,
            onClick: () => handleAction(() => window.open(getMapUrl(value, "apple"), "_blank")),
          });
        }
        options.push({
          id: "copy",
          label: "Copier l'adresse",
          icon: <Copy size={20} />,
          onClick: () => handleCopy(value, "Adresse"),
        });
        return options;

      case "website":
        return [
          {
            id: "open",
            label: "Ouvrir le site",
            icon: <ExternalLink size={20} />,
            onClick: () => handleAction(() => handleWebsiteTap(value)),
          },
          {
            id: "copy",
            label: "Copier le lien",
            icon: <Copy size={20} />,
            onClick: () => handleCopy(value.startsWith("http") ? value : `https://${value}`, "Lien"),
          },
        ];

      case "social":
        return [
          {
            id: "open",
            label: "Ouvrir le profil",
            icon: <ExternalLink size={20} />,
            onClick: () => handleAction(() => handleWebsiteTap(value)),
          },
          {
            id: "copy",
            label: "Copier le lien",
            icon: <Copy size={20} />,
            onClick: () => handleCopy(value, "Lien"),
          },
        ];

      default:
        return [];
    }
  };

  const options = getOptions();
  const title = label || getDefaultTitle(type);

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom duration-300">
        <div className="max-w-md mx-auto">
          {/* Options card */}
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl border border-white/20 dark:border-slate-700/50">
            {/* Header */}
            <div className="px-4 py-3 border-b border-neutral-200/50 dark:border-slate-700/50">
              <p className="text-center text-sm font-medium text-neutral-500 dark:text-slate-400">
                {title}
              </p>
            </div>

            {/* Options */}
            {options.map((option, index) => (
              <button
                key={option.id}
                onClick={option.onClick}
                className={cn(
                  "w-full flex items-center gap-4 px-5 py-4 text-left transition-colors",
                  "hover:bg-neutral-100 dark:hover:bg-slate-800 active:bg-neutral-200 dark:active:bg-slate-700",
                  index < options.length - 1 && "border-b border-neutral-100 dark:border-slate-800"
                )}
              >
                <span className="text-neutral-600 dark:text-slate-400">
                  {option.icon}
                </span>
                <span className="text-base font-medium text-neutral-900 dark:text-slate-100">
                  {option.label}
                </span>
              </button>
            ))}
          </div>

          {/* Cancel button */}
          <button
            onClick={onClose}
            className="w-full mt-2 px-5 py-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 transition-colors hover:bg-neutral-100 dark:hover:bg-slate-800"
          >
            <span className="text-base font-semibold text-blue-500">
              Annuler
            </span>
          </button>
        </div>
      </div>
    </>
  );
}

function getDefaultTitle(type: ActionSheetType): string {
  switch (type) {
    case "phone": return "Options téléphone";
    case "email": return "Options email";
    case "location": return "Ouvrir avec";
    case "website": return "Options";
    case "social": return "Options";
    default: return "Options";
  }
}

// Hook for long press detection
export function useLongPress(
  callback: () => void,
  { delay = 400 }: { delay?: number } = {}
) {
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [isLongPress, setIsLongPress] = useState(false);

  const start = () => {
    setIsLongPress(false);
    const t = setTimeout(() => {
      setIsLongPress(true);
      callback();
    }, delay);
    setTimer(t);
  };

  const stop = () => {
    if (timer) {
      clearTimeout(timer);
      setTimer(null);
    }
  };

  const cancel = () => {
    stop();
    setIsLongPress(false);
  };

  return {
    onMouseDown: start,
    onMouseUp: stop,
    onMouseLeave: cancel,
    onTouchStart: start,
    onTouchEnd: stop,
    onTouchCancel: cancel,
    isLongPress,
  };
}
