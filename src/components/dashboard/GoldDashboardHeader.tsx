/**
 * Gold Dashboard Header - Prestige Edition
 * Badge Or Certifié + Push Notification Button
 * Ultra-premium Glassmorphism Noir & Or
 */

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Crown, 
  Bell, 
  Sparkles, 
  Shield, 
  Star,
  Send
} from "lucide-react";

interface GoldDashboardHeaderProps {
  userName: string;
  isPremium: boolean;
  onPushNotification: () => void;
  totalScans: number;
}

export function GoldDashboardHeader({ 
  userName, 
  isPremium, 
  onPushNotification,
  totalScans 
}: GoldDashboardHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl mb-8">
      {/* Background with gold gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-background to-amber-600/5" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent" />
      
      {/* Animated gold particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-400/60 rounded-full"
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: "100%",
              opacity: 0 
            }}
            animate={{ 
              y: "-20%",
              opacity: [0, 1, 0],
            }}
            transition={{ 
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: i * 0.8,
              ease: "easeOut"
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative p-8 md:p-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Left: User info with Gold Badge */}
          <div className="flex items-center gap-4">
            {/* Avatar with gold ring */}
            <motion.div 
              className="relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 p-[2px]">
                <div className="w-full h-full rounded-2xl bg-background flex items-center justify-center">
                  <span className="text-2xl md:text-3xl font-bold text-amber-500">
                    {userName.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              {/* Verified checkmark */}
              {isPremium && (
                <motion.div 
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                >
                  <Shield className="h-4 w-4 text-black" />
                </motion.div>
              )}
            </motion.div>

            <div>
              <motion.div 
                className="flex items-center gap-3 mb-1"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                  {userName}
                </h1>
                {isPremium && (
                  <Badge className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black border-0 gap-1 px-3 py-1 text-xs font-semibold shadow-lg shadow-amber-500/30">
                    <Crown className="h-3.5 w-3.5" />
                    GOLD CERTIFIÉ
                  </Badge>
                )}
              </motion.div>
              
              <motion.p 
                className="text-muted-foreground text-sm md:text-base flex items-center gap-2"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Sparkles className="h-4 w-4 text-amber-500" />
                {totalScans} scans générés • Elite NFC Mondiale
              </motion.p>
            </div>
          </div>

          {/* Right: Push Notification CTA */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              onClick={onPushNotification}
              disabled={!isPremium}
              className="relative overflow-hidden group bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:via-amber-600 hover:to-amber-700 text-black font-semibold px-6 py-6 h-auto rounded-2xl shadow-lg shadow-amber-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/40 hover:scale-[1.02]"
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              
              <div className="relative flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center">
                  <Bell className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold">Envoyer une Notification</p>
                  <p className="text-xs opacity-80">Push vers tous vos clients</p>
                </div>
                <Send className="h-5 w-5 ml-2" />
              </div>
            </Button>
          </motion.div>
        </div>

        {/* Bottom: Quick stats ribbon */}
        <motion.div 
          className="mt-8 grid grid-cols-3 gap-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {[
            { label: "Rang Elite", value: "Top 5%", icon: Star },
            { label: "Performance", value: "+25%", icon: Sparkles },
            { label: "Leads actifs", value: "Excellente", icon: Crown },
          ].map((stat, index) => (
            <div 
              key={stat.label}
              className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2 mb-1">
                <stat.icon className="h-4 w-4 text-amber-500" />
                <span className="text-xs text-amber-500/80">{stat.label}</span>
              </div>
              <p className="font-bold text-foreground">{stat.value}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
