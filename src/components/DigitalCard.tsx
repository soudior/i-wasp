import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Globe, Linkedin, Instagram, MessageCircle, Plus, Wallet } from "lucide-react";

interface DigitalCardProps {
  data?: {
    firstName?: string;
    lastName?: string;
    title?: string;
    company?: string;
    email?: string;
    phone?: string;
    location?: string;
    website?: string;
    linkedin?: string;
    instagram?: string;
    tagline?: string;
    photo?: string;
  };
  variant?: "default" | "minimal" | "executive";
  showWalletButtons?: boolean;
}

const defaultData = {
  firstName: "Alexandre",
  lastName: "Dubois",
  title: "Directeur Général",
  company: "Prestige Corp",
  email: "a.dubois@prestige.com",
  phone: "+33 6 12 34 56 78",
  location: "Paris, France",
  website: "prestige-corp.com",
  linkedin: "alexandre-dubois",
  instagram: "@adubois",
  tagline: "L'excellence en toute simplicité",
};

export function DigitalCard({ data = defaultData, variant = "default", showWalletButtons = true }: DigitalCardProps) {
  const cardData = { ...defaultData, ...data };

  return (
    <div className="perspective-2000">
      <motion.div
        initial={{ opacity: 0, y: 30, rotateX: 10 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        {/* Ambient glow behind card */}
        <div className="absolute -inset-10 opacity-60 blur-3xl">
          <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-glow-subtle/30 rounded-full" />
          <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-glow-subtle/20 rounded-full" />
        </div>

        {/* Main card container */}
        <motion.div
          className="relative w-full max-w-sm mx-auto animate-float-3d"
          whileHover={{ scale: 1.02, rotateY: 2 }}
          transition={{ duration: 0.4 }}
        >
          {/* Outer glow ring */}
          <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-foreground/20 via-transparent to-foreground/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Card body */}
          <div className="card-glass p-8">
            {/* Shimmer effect */}
            <div className="shimmer" />
            
            {/* Header with photo */}
            <div className="relative z-10 flex items-start gap-5 mb-6">
              {/* Photo container with 3D effect */}
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.05, rotateY: 5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-foreground/10 shadow-lg">
                  {cardData.photo ? (
                    <img 
                      src={cardData.photo} 
                      alt={cardData.firstName} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-surface-2 to-surface-3 flex items-center justify-center">
                      <span className="text-2xl font-semibold text-chrome">
                        {cardData.firstName?.charAt(0)}{cardData.lastName?.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                {/* NFC indicator */}
                <motion.div 
                  className="absolute -bottom-1 -right-1 w-6 h-6 bg-foreground rounded-full flex items-center justify-center shadow-lg"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-background" />
                </motion.div>
              </motion.div>
              
              {/* Name & title */}
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-semibold text-foreground truncate">
                  {cardData.firstName} {cardData.lastName}
                </h2>
                <p className="text-sm text-chrome mt-0.5">{cardData.title}</p>
                <p className="text-sm text-muted-foreground">{cardData.company}</p>
              </div>
            </div>

            {/* Tagline */}
            {cardData.tagline && (
              <div className="relative z-10 mb-6 pl-4 border-l-2 border-foreground/20">
                <p className="text-sm text-muted-foreground italic">
                  "{cardData.tagline}"
                </p>
              </div>
            )}

            {/* Contact info */}
            <div className="relative z-10 space-y-2.5 mb-6">
              {cardData.phone && (
                <a 
                  href={`tel:${cardData.phone}`} 
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-foreground/5 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-xl bg-surface-2 flex items-center justify-center group-hover:bg-surface-3 transition-colors">
                    <Phone size={16} className="text-chrome" />
                  </div>
                  <span className="text-sm text-secondary-foreground group-hover:text-foreground transition-colors">
                    {cardData.phone}
                  </span>
                </a>
              )}
              {cardData.email && (
                <a 
                  href={`mailto:${cardData.email}`} 
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-foreground/5 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-xl bg-surface-2 flex items-center justify-center group-hover:bg-surface-3 transition-colors">
                    <Mail size={16} className="text-chrome" />
                  </div>
                  <span className="text-sm text-secondary-foreground group-hover:text-foreground transition-colors truncate">
                    {cardData.email}
                  </span>
                </a>
              )}
              {cardData.location && (
                <div className="flex items-center gap-3 p-2.5 rounded-xl">
                  <div className="w-9 h-9 rounded-xl bg-surface-2 flex items-center justify-center">
                    <MapPin size={16} className="text-muted-foreground" />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {cardData.location}
                  </span>
                </div>
              )}
            </div>

            {/* Action buttons grid */}
            <div className="relative z-10 grid grid-cols-4 gap-2 mb-6">
              {[
                { icon: Phone, label: "Appeler", href: `tel:${cardData.phone}` },
                { icon: Mail, label: "Email", href: `mailto:${cardData.email}` },
                { icon: MessageCircle, label: "WhatsApp", href: `https://wa.me/${cardData.phone?.replace(/\s/g, '')}` },
                { icon: Globe, label: "Site", href: `https://${cardData.website}` },
              ].map((action) => (
                <motion.a
                  key={action.label}
                  href={action.href}
                  target={action.label === "Site" ? "_blank" : undefined}
                  rel={action.label === "Site" ? "noopener noreferrer" : undefined}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-surface-2/50 hover:bg-surface-3 border border-transparent hover:border-foreground/10 transition-all duration-200"
                >
                  <action.icon size={18} className="text-chrome" />
                  <span className="text-xs text-muted-foreground">{action.label}</span>
                </motion.a>
              ))}
            </div>

            {/* Social links */}
            <div className="relative z-10 flex items-center justify-center gap-4 pb-6 border-b border-foreground/10">
              {cardData.linkedin && (
                <motion.a 
                  href={`https://linkedin.com/in/${cardData.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-xl bg-surface-2 hover:bg-surface-3 flex items-center justify-center transition-colors"
                >
                  <Linkedin size={18} className="text-muted-foreground hover:text-foreground transition-colors" />
                </motion.a>
              )}
              {cardData.instagram && (
                <motion.a 
                  href={`https://instagram.com/${cardData.instagram?.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-xl bg-surface-2 hover:bg-surface-3 flex items-center justify-center transition-colors"
                >
                  <Instagram size={18} className="text-muted-foreground hover:text-foreground transition-colors" />
                </motion.a>
              )}
            </div>

            {/* Add to contacts button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative z-10 w-full mt-6 py-3.5 px-4 btn-chrome rounded-2xl font-semibold text-sm flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              Ajouter aux contacts
            </motion.button>

            {/* Wallet buttons */}
            {showWalletButtons && (
              <div className="relative z-10 grid grid-cols-2 gap-3 mt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="wallet-btn flex items-center justify-center gap-2"
                >
                  <Wallet size={16} />
                  <span className="text-xs">Apple Wallet</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="wallet-btn flex items-center justify-center gap-2"
                >
                  <Wallet size={16} />
                  <span className="text-xs">Google Wallet</span>
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}