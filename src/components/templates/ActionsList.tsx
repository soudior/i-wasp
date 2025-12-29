import { Phone, Mail, MapPin, Globe, MessageCircle, Plus, Send, Calendar, Video, Store, FileText, Briefcase, Building2 } from "lucide-react";
import { handlePhoneTap, handleEmailTap, handleWhatsAppTap, handleSmsTap, handleWebsiteTap, handleSocialTap } from "@/lib/smartActions";
import { SocialLink, getNetworkById } from "@/lib/socialNetworks";
import { SocialIcon } from "@/components/SocialIcon";
import { LocationPicker } from "@/components/LocationPicker";
import { cn } from "@/lib/utils";

interface ActionItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  onClick: () => void;
  priority: number;
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
}

// Labels for social networks and actions
const LABELS: Record<string, string> = {
  // Primary actions
  phone: "Appeler",
  whatsapp: "WhatsApp",
  email: "Envoyer un email",
  sms: "Message",
  location: "Itinéraire",
  website: "Site web",
  
  // Social networks
  linkedin: "LinkedIn",
  instagram: "Instagram",
  twitter: "X (Twitter)",
  tiktok: "TikTok",
  snapchat: "Snapchat",
  youtube: "YouTube",
  facebook: "Facebook",
  telegram: "Telegram",
  calendly: "Calendly",
  github: "GitHub",
  behance: "Behance",
  dribbble: "Dribbble",
  notion: "Notion",
  medium: "Medium",
  google_business: "Google Business",
  custom_website: "Site web",
  store: "Boutique",
};

// Variant styles
const variantStyles = {
  dark: {
    container: "bg-slate-900/50 border-slate-700/50",
    item: "hover:bg-slate-800/70 active:bg-slate-700/70",
    iconBg: "bg-slate-800",
    icon: "text-amber-400",
    label: "text-slate-100",
    sublabel: "text-slate-400",
    divider: "border-slate-700/50",
  },
  light: {
    container: "bg-white border-neutral-200",
    item: "hover:bg-neutral-50 active:bg-neutral-100",
    iconBg: "bg-neutral-100",
    icon: "text-neutral-600",
    label: "text-neutral-900",
    sublabel: "text-neutral-500",
    divider: "border-neutral-100",
  },
  glass: {
    container: "bg-white/10 border-white/20 backdrop-blur-sm",
    item: "hover:bg-white/20 active:bg-white/30",
    iconBg: "bg-white/20",
    icon: "text-white",
    label: "text-white",
    sublabel: "text-white/60",
    divider: "border-white/10",
  },
  amber: {
    container: "bg-amber-900/20 border-amber-500/20",
    item: "hover:bg-amber-900/40 active:bg-amber-900/50",
    iconBg: "bg-amber-900/40",
    icon: "text-amber-400",
    label: "text-amber-100",
    sublabel: "text-amber-200/60",
    divider: "border-amber-500/20",
  },
  rose: {
    container: "bg-stone-900/50 border-rose-500/20",
    item: "hover:bg-stone-800/70 active:bg-stone-700/70",
    iconBg: "bg-rose-500/20",
    icon: "text-rose-400",
    label: "text-stone-100",
    sublabel: "text-stone-400",
    divider: "border-stone-700/50",
  },
  tech: {
    container: "bg-gray-900/50 border-cyan-500/20",
    item: "hover:bg-gray-800/70 active:bg-gray-700/70",
    iconBg: "bg-gray-900",
    icon: "text-cyan-400",
    label: "text-gray-100 font-mono",
    sublabel: "text-gray-500 font-mono",
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
}: ActionsListProps) {
  const s = variantStyles[variant];
  
  // Build actions list with priority ordering
  const actions: ActionItem[] = [];
  
  // Priority 1: Phone call
  if (phone) {
    actions.push({
      id: "phone",
      icon: <Phone size={18} className={s.icon} />,
      label: LABELS.phone,
      sublabel: phone,
      onClick: () => handlePhoneTap(phone),
      priority: 1,
    });
  }
  
  // Priority 2: WhatsApp (if phone exists)
  if (phone) {
    actions.push({
      id: "whatsapp",
      icon: <SocialIcon networkId="whatsapp" size={18} className={s.icon} />,
      label: LABELS.whatsapp,
      sublabel: phone,
      onClick: () => handleWhatsAppTap(phone),
      priority: 2,
    });
  }
  
  // Priority 3: SMS
  if (phone) {
    actions.push({
      id: "sms",
      icon: <MessageCircle size={18} className={s.icon} />,
      label: LABELS.sms,
      onClick: () => handleSmsTap(phone),
      priority: 3,
    });
  }
  
  // Priority 4: Email
  if (email) {
    actions.push({
      id: "email",
      icon: <Mail size={18} className={s.icon} />,
      label: LABELS.email,
      sublabel: email,
      onClick: () => handleEmailTap(email),
      priority: 4,
    });
  }
  
  // Priority 5: Website
  if (website) {
    actions.push({
      id: "website",
      icon: <Globe size={18} className={s.icon} />,
      label: LABELS.website,
      sublabel: website,
      onClick: () => handleWebsiteTap(website),
      priority: 5,
    });
  }
  
  // Priority 6: LinkedIn (if present in legacy fields)
  if (linkedin) {
    actions.push({
      id: "linkedin",
      icon: <SocialIcon networkId="linkedin" size={18} className={s.icon} />,
      label: LABELS.linkedin,
      sublabel: linkedin,
      onClick: () => handleSocialTap("linkedin", linkedin),
      priority: 6,
    });
  }
  
  // Priority 7: Instagram (if present in legacy fields)
  if (instagram) {
    actions.push({
      id: "instagram",
      icon: <SocialIcon networkId="instagram" size={18} className={s.icon} />,
      label: LABELS.instagram,
      sublabel: instagram.replace("@", ""),
      onClick: () => handleSocialTap("instagram", instagram),
      priority: 7,
    });
  }
  
  // Priority 8: Twitter (if present in legacy fields)
  if (twitter) {
    actions.push({
      id: "twitter",
      icon: <SocialIcon networkId="twitter" size={18} className={s.icon} />,
      label: LABELS.twitter,
      sublabel: twitter.replace("@", ""),
      onClick: () => handleSocialTap("twitter", twitter),
      priority: 8,
    });
  }
  
  // Add dynamic social links with lower priority
  socialLinks.forEach((link, index) => {
    const network = getNetworkById(link.networkId);
    actions.push({
      id: `social-${link.id}`,
      icon: <SocialIcon networkId={link.networkId} size={18} className={s.icon} />,
      label: LABELS[link.networkId] || network?.label || link.networkId,
      sublabel: link.value,
      onClick: () => handleSocialTap(link.networkId, link.value),
      priority: 10 + index,
    });
  });
  
  // Sort by priority
  actions.sort((a, b) => a.priority - b.priority);

  if (actions.length === 0 && !location) {
    return null;
  }

  return (
    <div className={cn("rounded-2xl border overflow-hidden", s.container, className)}>
      {/* Location at top if present */}
      {location && (
        <>
          <LocationPicker
            address={location}
            variant="inline"
            className={cn(
              "w-full min-h-[52px] px-4 transition-colors",
              s.item
            )}
            iconClassName={s.icon}
            textClassName={cn("text-sm", s.label)}
          />
          {actions.length > 0 && <div className={cn("border-t", s.divider)} />}
        </>
      )}
      
      {/* Action items */}
      {actions.map((action, index) => (
        <div key={action.id}>
          <button
            onClick={action.onClick}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 min-h-[52px] transition-all duration-150 text-left",
              s.item
            )}
            aria-label={action.label}
          >
            <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0", s.iconBg)}>
              {action.icon}
            </div>
            <div className="flex-1 min-w-0">
              <span className={cn("text-sm font-medium block", s.label)}>
                {action.label}
              </span>
              {action.sublabel && (
                <span className={cn("text-xs truncate block", s.sublabel)}>
                  {action.sublabel}
                </span>
              )}
            </div>
          </button>
          {index < actions.length - 1 && (
            <div className={cn("border-t mx-4", s.divider)} />
          )}
        </div>
      ))}
    </div>
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
