import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Wifi, Eye, Users } from "lucide-react";
import { DigitalCard } from "@/hooks/useCards";

interface DashboardCardProps {
  card: DigitalCard;
  index: number;
  leadsCount: number;
  onClick?: () => void;
}

export function DashboardCard({ card, index, leadsCount, onClick }: DashboardCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: 15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1]
      }}
      whileHover={{ 
        scale: 1.02, 
        rotateY: 3,
        z: 20,
      }}
      onClick={onClick}
      className="perspective-2000 cursor-pointer group"
    >
      <div className="relative preserve-3d">
        {/* Ambient glow */}
        <div className="absolute -inset-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl">
          <div className="absolute inset-0 bg-glow-subtle/20 rounded-full" />
        </div>

        {/* Card */}
        <div className="card-glass p-6 relative overflow-hidden">
          {/* Shimmer effect */}
          <div className="shimmer" />
          
          {/* NFC Status indicator */}
          <div className={`absolute top-4 right-4 flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
            card.nfc_enabled 
              ? 'bg-emerald-500/20 text-emerald-400' 
              : 'bg-muted text-muted-foreground'
          }`}>
            <Wifi size={12} />
            {card.nfc_enabled ? 'NFC' : 'Off'}
          </div>

          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            {/* Avatar */}
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.1, rotateZ: 2 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-foreground/10 shadow-lg bg-gradient-to-br from-surface-2 to-surface-3">
                {card.photo_url ? (
                  <img 
                    src={card.photo_url} 
                    alt={card.first_name} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-xl font-semibold text-chrome">
                      {card.first_name?.charAt(0)}{card.last_name?.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              {/* Active pulse */}
              {card.is_active && (
                <motion.div 
                  className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="w-2 h-2 rounded-full bg-white" />
                </motion.div>
              )}
            </motion.div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              {card.logo_url && (
                <img 
                  src={card.logo_url} 
                  alt="" 
                  className="h-4 w-auto object-contain opacity-60 mb-1" 
                />
              )}
              <h3 className="font-display text-lg font-semibold text-foreground truncate">
                {card.first_name} {card.last_name}
              </h3>
              <p className="text-sm text-chrome truncate">{card.title}</p>
              <p className="text-xs text-muted-foreground truncate">{card.company}</p>
            </div>
          </div>

          {/* Contact quick info */}
          <div className="space-y-2 mb-4">
            {card.email && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Mail size={12} className="text-chrome" />
                <span className="truncate">{card.email}</span>
              </div>
            )}
            {card.phone && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Phone size={12} className="text-chrome" />
                <span>{card.phone}</span>
              </div>
            )}
            {card.location && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin size={12} className="text-chrome" />
                <span>{card.location}</span>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 pt-4 border-t border-foreground/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center">
                <Eye size={14} className="text-chrome" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{card.view_count || 0}</p>
                <p className="text-xs text-muted-foreground">Vues</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center">
                <Users size={14} className="text-chrome" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{leadsCount}</p>
                <p className="text-xs text-muted-foreground">Leads</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}