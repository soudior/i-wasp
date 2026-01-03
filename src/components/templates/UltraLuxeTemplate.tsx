/**
 * Ultra-Luxe VIP Template
 * Design noir mat & or pour clients VIP au Maroc
 * Élégance absolue, animations fluides, présentation vidéo 4K
 */

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Phone, Mail, MapPin, Linkedin, Instagram, MessageCircle, 
  Globe, Crown, Sparkles, ChevronDown, Play, Pause, ExternalLink,
  Calendar, Star, Diamond
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { IWASPBrandingInline } from "@/components/IWASPBrandingFooter";
import { cn } from "@/lib/utils";

interface UltraLuxeData {
  firstName: string;
  lastName: string;
  title?: string;
  company?: string;
  tagline?: string;
  photoUrl?: string;
  logoUrl?: string;
  videoUrl?: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  linkedin?: string;
  instagram?: string;
  website?: string;
  location?: string;
  calendly?: string;
}

interface UltraLuxeTemplateProps {
  data: UltraLuxeData;
  isPreview?: boolean;
}

export function UltraLuxeTemplate({ data, isPreview = false }: UltraLuxeTemplateProps) {
  const [showVideo, setShowVideo] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const actions = [
    { id: "call", icon: Phone, label: "Appeler", href: `tel:${data.phone}`, show: !!data.phone, color: "from-amber-400 to-yellow-500" },
    { id: "whatsapp", icon: MessageCircle, label: "WhatsApp", href: `https://wa.me/${data.whatsapp?.replace(/\D/g, '')}`, show: !!data.whatsapp, color: "from-green-400 to-emerald-500" },
    { id: "email", icon: Mail, label: "Email", href: `mailto:${data.email}`, show: !!data.email, color: "from-amber-400 to-yellow-500" },
    { id: "linkedin", icon: Linkedin, label: "LinkedIn", href: data.linkedin, show: !!data.linkedin, color: "from-blue-400 to-blue-600" },
    { id: "instagram", icon: Instagram, label: "Instagram", href: data.instagram, show: !!data.instagram, color: "from-pink-400 to-purple-500" },
    { id: "calendly", icon: Calendar, label: "Prendre RDV", href: data.calendly, show: !!data.calendly, color: "from-amber-400 to-yellow-500" },
    { id: "website", icon: Globe, label: "Site Web", href: data.website, show: !!data.website, color: "from-amber-400 to-yellow-500" },
  ].filter(a => a.show);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden">
      {/* Luxurious background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gold gradient orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-amber-500/10 via-yellow-500/5 to-transparent blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[80px]" />
        <div className="absolute bottom-1/4 right-0 w-[200px] h-[400px] bg-gradient-to-t from-amber-400/10 to-transparent blur-[60px]" />
        
        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-[0.015]" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
        }} />
        
        {/* Animated gold particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-amber-400/40 rounded-full"
              initial={{ 
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 400),
                y: -10,
                opacity: 0 
              }}
              animate={{ 
                y: typeof window !== 'undefined' ? window.innerHeight + 10 : 800,
                opacity: [0, 1, 1, 0]
              }}
              transition={{ 
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "linear"
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-md mx-auto px-6 py-12 pb-32">
        {/* VIP Crown Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border border-amber-500/30">
            <Crown size={14} className="text-amber-400" />
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-amber-400">VIP Client</span>
            <Diamond size={12} className="text-amber-400" />
          </div>
        </motion.div>

        {/* Photo with gold ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            {/* Animated gold ring */}
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 animate-[spin_8s_linear_infinite] opacity-80" />
            <div className="absolute -inset-0.5 rounded-full bg-[#0a0a0a]" />
            
            {/* Photo */}
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-amber-500/50">
              {data.photoUrl ? (
                <img 
                  src={data.photoUrl} 
                  alt={`${data.firstName} ${data.lastName}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-amber-500/20 to-yellow-500/10 flex items-center justify-center">
                  <span className="text-3xl font-bold text-amber-400">
                    {data.firstName?.[0]}{data.lastName?.[0]}
                  </span>
                </div>
              )}
            </div>
            
            {/* Sparkle effect */}
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles size={20} className="text-amber-400" />
            </motion.div>
          </div>
        </motion.div>

        {/* Name & Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-6"
        >
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            <span className="bg-gradient-to-r from-white via-amber-100 to-white bg-clip-text text-transparent">
              {data.firstName} {data.lastName}
            </span>
          </h1>
          {data.title && (
            <p className="text-amber-400 font-medium">{data.title}</p>
          )}
          {data.company && (
            <p className="text-gray-400 text-sm mt-1">{data.company}</p>
          )}
        </motion.div>

        {/* Tagline with gold accent */}
        {data.tagline && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mb-8"
          >
            <p className="text-gray-300 text-sm italic relative inline-block">
              <span className="absolute -left-4 top-0 text-amber-500">"</span>
              {data.tagline}
              <span className="absolute -right-4 top-0 text-amber-500">"</span>
            </p>
          </motion.div>
        )}

        {/* Video Presentation */}
        {data.videoUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <div 
              className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-amber-500/10 to-yellow-500/5 border border-amber-500/20 cursor-pointer group"
              onClick={() => setShowVideo(true)}
            >
              {!showVideo ? (
                <div className="aspect-video flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/80" />
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-500/30"
                  >
                    <Play size={24} className="text-black ml-1" />
                  </motion.div>
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <span className="text-xs text-gray-400">Présentation VIP</span>
                    <span className="text-xs text-amber-400 flex items-center gap-1">
                      <Star size={12} /> 4K Ultra HD
                    </span>
                  </div>
                </div>
              ) : (
                <div className="aspect-video relative">
                  <video
                    ref={videoRef}
                    src={data.videoUrl}
                    className="w-full h-full object-cover"
                    playsInline
                    controls
                    autoPlay
                  />
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Location */}
        {data.location && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex items-center justify-center gap-2 text-gray-400 text-sm mb-8"
          >
            <MapPin size={14} className="text-amber-400" />
            <span>{data.location}</span>
          </motion.div>
        )}

        {/* Luxurious divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex items-center justify-center gap-4 mb-8"
        >
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-500/50 to-amber-500" />
          <Diamond size={12} className="text-amber-400" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent via-amber-500/50 to-amber-500" />
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="space-y-3"
        >
          {actions.slice(0, 3).map((action, index) => (
            <motion.a
              key={action.id}
              href={action.href}
              target={action.id !== 'call' && action.id !== 'email' ? '_blank' : undefined}
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className={cn(
                "flex items-center gap-4 w-full p-4 rounded-xl",
                "bg-gradient-to-r from-[#151515] to-[#1a1a1a]",
                "border border-amber-500/20 hover:border-amber-500/40",
                "transition-all duration-300 group",
                "hover:shadow-lg hover:shadow-amber-500/10"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                "bg-gradient-to-r",
                action.color
              )}>
                <action.icon size={18} className="text-black" />
              </div>
              <span className="font-medium text-white group-hover:text-amber-400 transition-colors">
                {action.label}
              </span>
              <ExternalLink size={14} className="ml-auto text-gray-500 group-hover:text-amber-400 transition-colors" />
            </motion.a>
          ))}
        </motion.div>

        {/* Secondary actions grid */}
        {actions.length > 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="grid grid-cols-4 gap-3 mt-6"
          >
            {actions.slice(3).map((action, index) => (
              <motion.a
                key={action.id}
                href={action.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#151515] border border-amber-500/10 hover:border-amber-500/30 transition-all"
              >
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  "bg-gradient-to-r",
                  action.color
                )}>
                  <action.icon size={18} className="text-black" />
                </div>
                <span className="text-xs text-gray-400">{action.label}</span>
              </motion.a>
            ))}
          </motion.div>
        )}

        {/* Logo */}
        {data.logoUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="flex justify-center mt-12"
          >
            <img 
              src={data.logoUrl} 
              alt="Logo"
              className="h-8 object-contain opacity-60"
            />
          </motion.div>
        )}

        {/* Global IWASP Branding Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="mt-12"
        >
          <IWASPBrandingInline variant="light" />
        </motion.div>
      </div>
    </div>
  );
}

export default UltraLuxeTemplate;
