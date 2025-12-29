import {
  Linkedin,
  Instagram,
  Facebook,
  Twitter,
  Music,
  Camera,
  Youtube,
  MessageCircle,
  Send,
  Calendar,
  Mail,
  Phone,
  Github,
  Palette,
  FileText,
  BookOpen,
  Building2,
  Globe,
  ShoppingBag,
  LucideIcon,
} from "lucide-react";

// Custom Dribbble icon (not in lucide)
const DribbbleIcon = ({ size = 24, className }: { size?: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94" />
    <path d="M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32" />
    <path d="M8.56 2.75c4.37 6 6 9.42 8 17.72" />
  </svg>
);

const iconMap: Record<string, LucideIcon | typeof DribbbleIcon> = {
  linkedin: Linkedin,
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
  tiktok: Music,
  snapchat: Camera,
  youtube: Youtube,
  whatsapp: MessageCircle,
  telegram: Send,
  calendly: Calendar,
  email: Mail,
  phone: Phone,
  github: Github,
  behance: Palette,
  dribbble: DribbbleIcon,
  notion: FileText,
  medium: BookOpen,
  "google-business": Building2,
  website: Globe,
  store: ShoppingBag,
};

interface SocialIconProps {
  networkId: string;
  size?: number;
  className?: string;
}

export function SocialIcon({ networkId, size = 20, className = "" }: SocialIconProps) {
  const Icon = iconMap[networkId] || Globe;
  return <Icon size={size} className={className} />;
}
