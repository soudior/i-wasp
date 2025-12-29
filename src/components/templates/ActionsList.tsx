import { useState, useCallback, useRef } from "react";
import { Phone, Mail, MapPin, Globe, MessageCircle, MoreHorizontal } from "lucide-react";
import { handlePhoneTap, handleEmailTap, handleWhatsAppTap, handleSmsTap, handleWebsiteTap, handleSocialTap } from "@/lib/smartActions";
import { SocialLink, getNetworkById } from "@/lib/socialNetworks";
import { SocialIcon } from "@/components/SocialIcon";
import { LocationPicker } from "@/components/LocationPicker";
import { ActionSheet, ActionSheetType } from "@/components/ActionSheet";
import { cn } from "@/lib/utils";

export type ActionType = "call" | "whatsapp" | "sms" | "email" | "maps" | "website" | "social";

interface ActionItem {
  id: string;
  type: ActionType;
  icon: React.ReactNode;
  label: string;
  subtitle: string;
  value: string;
  onClick: () => void;
  priority: number;
  trackingAction?: string; // For lead scoring
}

interface ActionsListProps {
  phone?: string;
  email?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  instagram?: string;
  twitter?: string;
  socialLinks?: SocialLink[];
  variant?: "dark" | "light" | "glass" | "amber" | "rose" | "tech";
  className?: string;
  onActionTrack?: (actionName: string) => void; // For lead scoring
}

// Labels and subtitles for actions - Apple style descriptive
const ACTION_CONFIG: Record<string, { label: string; subtitle: string }> = {
  // Primary actions
  phone: { label: "Appeler", subtitle: "Appel direct" },
  whatsapp: { label: "WhatsApp", subtitle: "Message instantané" },
  sms: { label: "Message", subtitle: "Envoyer un SMS" },
  email: { label: "Envoyer un email", subtitle: "Contact professionnel" },
  location: { label: "Itinéraire", subtitle: "Google Maps / Waze" },
  website: { label: "Site web", subtitle: "Visiter le site" },
  
  // Social networks
  linkedin: { label: "LinkedIn", subtitle: "Voir le profil pro" },
  instagram: { label: "Instagram", subtitle: "Voir le profil" },
  twitter: { label: "X (Twitter)", subtitle: "Voir le profil" },
  tiktok: { label: "TikTok", subtitle: "Voir les vidéos" },
  snapchat: { label: "Snapchat", subtitle: "Ajouter sur Snap" },
  youtube: { label: "YouTube", subtitle: "Voir la chaîne" },
  facebook: { label: "Facebook", subtitle: "Voir le profil" },
  telegram: { label: "Telegram", subtitle: "Contacter sur Telegram" },
  calendly: { label: "Calendly", subtitle: "Prendre rendez-vous" },
  github: { label: "GitHub", subtitle: "Voir les projets" },
  behance: { label: "Behance", subtitle: "Voir le portfolio" },
  dribbble: { label: "Dribbble", subtitle: "Voir les créations" },
  notion: { label: "Notion", subtitle: "Accéder à Notion" },
  medium: { label: "Medium", subtitle: "Lire les articles" },
  google_business: { label: "Google Business", subtitle: "Voir l'entreprise" },
  custom_website: { label: "Site web", subtitle: "Lien personnalisé" },
  store: { label: "Boutique", subtitle: "Voir la boutique" },
};

// Variant styles - Premium glassmorphism
const variantStyles = {
  dark: {
    container: "bg-slate-900/60 backdrop-blur-xl border-slate-700/50 shadow-xl shadow-black/20",
    item: "hover:bg-slate-800/80 active:bg-slate-700/80 active:scale-[0.98]",
    iconBg: "bg-gradient-to-br from-slate-700 to-slate-800 shadow-inner",
    icon: "text-amber-400",
    label: "text-slate-100 font-medium",
    subtitle: "text-slate-400",
    sublabel: "text-slate-500 text-xs",
    divider: "border-slate-700/30",
  },
  light: {
    container: "bg-white/90 backdrop-blur-xl border-neutral-200/80 shadow-xl shadow-neutral-200/30",
    item: "hover:bg-neutral-50/90 active:bg-neutral-100/90 active:scale-[0.98]",
    iconBg: "bg-gradient-to-br from-neutral-100 to-neutral-200 shadow-inner",
    icon: "text-neutral-700",
    label: "text-neutral-900 font-medium",
    subtitle: "text-neutral-500",
    sublabel: "text-neutral-400 text-xs",
    divider: "border-neutral-100",
  },
  glass: {
    container: "bg-white/15 backdrop-blur-2xl border-white/25 shadow-2xl shadow-black/10",
    item: "hover:bg-white/25 active:bg-white/35 active:scale-[0.98]",
    iconBg: "bg-white/25 backdrop-blur-sm shadow-inner",
    icon: "text-white",
    label: "text-white font-medium",
    subtitle: "text-white/70",
    sublabel: "text-white/50 text-xs",
    divider: "border-white/15",
  },
  amber: {
    container: "bg-amber-950/40 backdrop-blur-xl border-amber-500/20 shadow-xl shadow-amber-950/30",
    item: "hover:bg-amber-900/50 active:bg-amber-900/60 active:scale-[0.98]",
    iconBg: "bg-gradient-to-br from-amber-800/50 to-amber-900/50 shadow-inner",
    icon: "text-amber-400",
    label: "text-amber-100 font-medium",
    subtitle: "text-amber-200/60",
    sublabel: "text-amber-300/40 text-xs",
    divider: "border-amber-500/15",
  },
  rose: {
    container: "bg-stone-900/60 backdrop-blur-xl border-rose-500/20 shadow-xl shadow-stone-950/30",
    item: "hover:bg-stone-800/80 active:bg-stone-700/80 active:scale-[0.98]",
    iconBg: "bg-gradient-to-br from-rose-500/30 to-rose-600/20 shadow-inner",
    icon: "text-rose-400",
    label: "text-stone-100 font-medium",
    subtitle: "text-stone-400",
    sublabel: "text-stone-500 text-xs",
    divider: "border-stone-700/30",
  },
  tech: {
    container: "bg-gray-950/80 backdrop-blur-xl border-cyan-500/30 shadow-xl shadow-cyan-500/10",
    item: "hover:bg-gray-900/90 active:bg-gray-800/90 active:scale-[0.98] hover:border-cyan-500/30",
    iconBg: "bg-gray-900 border border-cyan-500/20",
    icon: "text-cyan-400",
    label: "text-gray-100 font-mono font-medium",
    subtitle: "text-gray-500 font-mono",
    sublabel: "text-gray-600 font-mono text-xs",
    divider: "border-gray-800",
  },
};

export function ActionsList({
  phone,
  email,
  location,
  website,
  linkedin,
  instagram,
  twitter,
  socialLinks = [],
  variant = "dark",
  className,
  onActionTrack,
}: ActionsListProps) {
  const s = variantStyles[variant];
  
  // State for action sheet
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetType, setSheetType] = useState<ActionSheetType>("phone");
  const [sheetValue, setSheetValue] = useState("");
  const [sheetLabel, setSheetLabel] = useState("");
  
  // Long press timer ref
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef(false);

  const openActionSheet = (type: ActionSheetType, value: string, label: string) => {
    setSheetType(type);
    setSheetValue(value);
    setSheetLabel(label);
    setSheetOpen(true);
  };

  const handleLongPressStart = (type: ActionSheetType, value: string, label: string) => {
    isLongPress.current = false;
    longPressTimer.current = setTimeout(() => {
      isLongPress.current = true;
      openActionSheet(type, value, label);
    }, 400);
  };

  const handleLongPressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleClick = (action: ActionItem) => {
    if (!isLongPress.current) {
      action.onClick();
      // Track action for lead scoring
      if (onActionTrack && action.trackingAction) {
        onActionTrack(action.trackingAction);
      }
    }
    isLongPress.current = false;
  };

  // Map action ID to ActionSheetType
  const getSheetType = (id: string): ActionSheetType => {
    if (id === "phone" || id === "whatsapp" || id === "sms") return "phone";
    if (id === "email") return "email";
    if (id === "website") return "website";
    if (id === "location") return "location";
    return "social";
  };

  // Build actions list with IWASP priority ordering
  const actions: ActionItem[] = [];
  
  const getConfig = (id: string) => ACTION_CONFIG[id] || { label: id, subtitle: "" };
  
  // Priority 1: Phone call
  if (phone) {
    const config = getConfig("phone");
    actions.push({
      id: "phone",
      type: "call",
      icon: <Phone size={18} className={s.icon} />,
      label: config.label,
      subtitle: config.subtitle,
      value: phone,
      onClick: () => handlePhoneTap(phone),
      priority: 1,
      trackingAction: "phone_click",
    });
  }
  
  // Priority 2: WhatsApp (if phone exists)
  if (phone) {
    const config = getConfig("whatsapp");
    actions.push({
      id: "whatsapp",
      type: "whatsapp",
      icon: <SocialIcon networkId="whatsapp" size={18} className={s.icon} />,
      label: config.label,
      subtitle: config.subtitle,
      value: phone,
      onClick: () => handleWhatsAppTap(phone),
      priority: 2,
      trackingAction: "whatsapp_click",
    });
  }
  
  // Priority 3: SMS
  if (phone) {
    const config = getConfig("sms");
    actions.push({
      id: "sms",
      type: "sms",
      icon: <MessageCircle size={18} className={s.icon} />,
      label: config.label,
      subtitle: config.subtitle,
      value: phone,
      onClick: () => handleSmsTap(phone),
      priority: 3,
      trackingAction: "sms_click",
    });
  }
  
  // Priority 4: Email
  if (email) {
    const config = getConfig("email");
    actions.push({
      id: "email",
      type: "email",
      icon: <Mail size={18} className={s.icon} />,
      label: config.label,
      subtitle: config.subtitle,
      value: email,
      onClick: () => handleEmailTap(email),
      priority: 4,
      trackingAction: "email_click",
    });
  }
  
  // Priority 5: Website
  if (website) {
    const config = getConfig("website");
    actions.push({
      id: "website",
      type: "website",
      icon: <Globe size={18} className={s.icon} />,
      label: config.label,
      subtitle: config.subtitle,
      value: website,
      onClick: () => handleWebsiteTap(website),
      priority: 5,
      trackingAction: "website_click",
    });
  }
  
  // Priority 6: LinkedIn (if present in legacy fields)
  if (linkedin) {
    const config = getConfig("linkedin");
    actions.push({
      id: "linkedin",
      type: "social",
      icon: <SocialIcon networkId="linkedin" size={18} className={s.icon} />,
      label: config.label,
      subtitle: config.subtitle,
      value: `https://linkedin.com/in/${linkedin}`,
      onClick: () => handleSocialTap("linkedin", linkedin),
      priority: 6,
      trackingAction: "social_click",
    });
  }
  
  // Priority 7: Instagram (if present in legacy fields)
  if (instagram) {
    const config = getConfig("instagram");
    actions.push({
      id: "instagram",
      type: "social",
      icon: <SocialIcon networkId="instagram" size={18} className={s.icon} />,
      label: config.label,
      subtitle: config.subtitle,
      value: `https://instagram.com/${instagram.replace("@", "")}`,
      onClick: () => handleSocialTap("instagram", instagram),
      priority: 7,
      trackingAction: "social_click",
    });
  }
  
  // Priority 8: Twitter (if present in legacy fields)
  if (twitter) {
    const config = getConfig("twitter");
    actions.push({
      id: "twitter",
      type: "social",
      icon: <SocialIcon networkId="twitter" size={18} className={s.icon} />,
      label: config.label,
      subtitle: config.subtitle,
      value: `https://x.com/${twitter.replace("@", "")}`,
      onClick: () => handleSocialTap("twitter", twitter),
      priority: 8,
      trackingAction: "social_click",
    });
  }
  
  // Add dynamic social links with lower priority
  socialLinks.forEach((link, index) => {
    const network = getNetworkById(link.networkId);
    const config = getConfig(link.networkId);
    actions.push({
      id: `social-${link.id}`,
      type: "social",
      icon: <SocialIcon networkId={link.networkId} size={18} className={s.icon} />,
      label: config.label || network?.label || link.networkId,
      subtitle: config.subtitle,
      value: link.value,
      onClick: () => handleSocialTap(link.networkId, link.value),
      priority: 10 + index,
      trackingAction: "social_click",
    });
  });
  
  // Sort by priority
  actions.sort((a, b) => a.priority - b.priority);

  if (actions.length === 0 && !location) {
    return null;
  }

  return (
    <>
      <div className={cn("rounded-2xl border overflow-hidden", s.container, className)}>
        {/* Location at top - Itinéraire */}
        {location && (
          <>
            <LocationPicker
              address={location}
              variant="inline"
              className={cn(
                "w-full min-h-[56px] px-4 transition-all duration-150",
                s.item
              )}
              iconClassName={s.icon}
              textClassName={cn("text-sm", s.label)}
            />
            {actions.length > 0 && <div className={cn("border-t", s.divider)} />}
          </>
        )}
        
        {/* Action items with Apple-style layout + long press */}
        {actions.map((action, index) => (
          <div key={action.id}>
            <button
              onClick={() => handleClick(action)}
              onMouseDown={() => handleLongPressStart(getSheetType(action.id), action.value, action.label)}
              onMouseUp={handleLongPressEnd}
              onMouseLeave={handleLongPressEnd}
              onTouchStart={() => handleLongPressStart(getSheetType(action.id), action.value, action.label)}
              onTouchEnd={handleLongPressEnd}
              onTouchCancel={handleLongPressEnd}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3.5 min-h-[56px] transition-all duration-150 text-left select-none",
                s.item
              )}
              aria-label={action.label}
            >
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", s.iconBg)}>
                {action.icon}
              </div>
              <div className="flex-1 min-w-0">
                <span className={cn("text-sm block", s.label)}>
                  {action.label}
                </span>
                <span className={cn("text-xs block mt-0.5", s.subtitle)}>
                  {action.subtitle}
                </span>
              </div>
              {/* More options indicator */}
              <MoreHorizontal size={16} className={cn("shrink-0 opacity-30", s.icon)} />
            </button>
            {index < actions.length - 1 && (
              <div className={cn("border-t mx-4", s.divider)} />
            )}
          </div>
        ))}
      </div>

      {/* Action Sheet */}
      <ActionSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        type={sheetType}
        value={sheetValue}
        label={sheetLabel}
      />
    </>
  );
}

// Compact version for quick actions grid
export function QuickActionsGrid({
  phone,
  email,
  website,
  variant = "dark",
  className,
}: {
  phone?: string;
  email?: string;
  website?: string;
  variant?: "dark" | "light" | "glass" | "amber" | "rose" | "tech";
  className?: string;
}) {
  const s = variantStyles[variant];
  
  const quickActions = [
    phone && {
      id: "call",
      icon: <Phone size={18} className={s.icon} />,
      label: "Appeler",
      onClick: () => handlePhoneTap(phone),
    },
    phone && {
      id: "whatsapp",
      icon: <SocialIcon networkId="whatsapp" size={18} className={s.icon} />,
      label: "WhatsApp",
      onClick: () => handleWhatsAppTap(phone),
    },
    email && {
      id: "email",
      icon: <Mail size={18} className={s.icon} />,
      label: "Email",
      onClick: () => handleEmailTap(email),
    },
    website && {
      id: "website",
      icon: <Globe size={18} className={s.icon} />,
      label: "Site",
      onClick: () => handleWebsiteTap(website),
    },
  ].filter(Boolean) as { id: string; icon: React.ReactNode; label: string; onClick: () => void }[];

  if (quickActions.length === 0) return null;

  return (
    <div className={cn("grid grid-cols-2 gap-2", className)}>
      {quickActions.map((action) => (
        <button
          key={action.id}
          onClick={action.onClick}
          className={cn(
            "flex items-center gap-2 px-4 py-3 min-h-[48px] rounded-xl border transition-all duration-150",
            s.container,
            s.item
          )}
          aria-label={action.label}
        >
          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", s.iconBg)}>
            {action.icon}
          </div>
          <span className={cn("text-sm font-medium", s.label)}>{action.label}</span>
        </button>
      ))}
    </div>
  );
}
