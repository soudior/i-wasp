import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Globe, Linkedin, Instagram, MessageCircle } from "lucide-react";

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

export function DigitalCard({ data = defaultData, variant = "default" }: DigitalCardProps) {
  const cardData = { ...defaultData, ...data };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="perspective-1000"
    >
      <div className="relative w-full max-w-sm mx-auto">
        {/* Glow effect */}
        <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent rounded-3xl blur-2xl opacity-60" />
        
        {/* Card */}
        <div className="relative card-premium p-8 rounded-2xl overflow-hidden">
          {/* Background pattern */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-primary/5 to-transparent rounded-full blur-2xl" />
          
          {/* Content */}
          <div className="relative z-10">
            {/* Photo & Name */}
            <div className="flex items-start gap-4 mb-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-secondary to-muted flex items-center justify-center overflow-hidden ring-2 ring-primary/20">
                  {cardData.photo ? (
                    <img src={cardData.photo} alt={cardData.firstName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-display font-bold text-primary">
                      {cardData.firstName?.charAt(0)}{cardData.lastName?.charAt(0)}
                    </span>
                  )}
                </div>
                {/* NFC indicator */}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-primary-foreground animate-pulse" />
                </div>
              </div>
              
              <div className="flex-1">
                <h2 className="font-display text-xl font-bold text-foreground">
                  {cardData.firstName} {cardData.lastName}
                </h2>
                <p className="text-primary font-medium text-sm">{cardData.title}</p>
                <p className="text-muted-foreground text-sm">{cardData.company}</p>
              </div>
            </div>

            {/* Tagline */}
            {cardData.tagline && (
              <p className="text-sm text-muted-foreground italic border-l-2 border-primary/50 pl-3 mb-6">
                "{cardData.tagline}"
              </p>
            )}

            {/* Contact info */}
            <div className="space-y-3 mb-6">
              <a href={`tel:${cardData.phone}`} className="flex items-center gap-3 text-sm text-secondary-foreground hover:text-primary transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Phone size={14} className="text-primary" />
                </div>
                {cardData.phone}
              </a>
              <a href={`mailto:${cardData.email}`} className="flex items-center gap-3 text-sm text-secondary-foreground hover:text-primary transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Mail size={14} className="text-primary" />
                </div>
                {cardData.email}
              </a>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                  <MapPin size={14} className="text-primary" />
                </div>
                {cardData.location}
              </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-4 gap-2">
              <motion.a
                href={`tel:${cardData.phone}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-1 p-3 rounded-xl bg-secondary hover:bg-primary/20 transition-colors"
              >
                <Phone size={18} className="text-primary" />
                <span className="text-xs text-muted-foreground">Appeler</span>
              </motion.a>
              <motion.a
                href={`mailto:${cardData.email}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-1 p-3 rounded-xl bg-secondary hover:bg-primary/20 transition-colors"
              >
                <Mail size={18} className="text-primary" />
                <span className="text-xs text-muted-foreground">Email</span>
              </motion.a>
              <motion.a
                href={`https://wa.me/${cardData.phone?.replace(/\s/g, '')}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-1 p-3 rounded-xl bg-secondary hover:bg-primary/20 transition-colors"
              >
                <MessageCircle size={18} className="text-primary" />
                <span className="text-xs text-muted-foreground">WhatsApp</span>
              </motion.a>
              <motion.a
                href={`https://${cardData.website}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-1 p-3 rounded-xl bg-secondary hover:bg-primary/20 transition-colors"
              >
                <Globe size={18} className="text-primary" />
                <span className="text-xs text-muted-foreground">Site</span>
              </motion.a>
            </div>

            {/* Social links */}
            <div className="mt-4 pt-4 border-t border-border flex items-center justify-center gap-4">
              <a href={`https://linkedin.com/in/${cardData.linkedin}`} className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin size={20} />
              </a>
              <a href={`https://instagram.com/${cardData.instagram?.replace('@', '')}`} className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
            </div>

            {/* Add to contacts button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-6 py-3 px-4 bg-gradient-gold text-primary-foreground font-semibold rounded-xl shadow-lg hover:shadow-gold transition-all duration-300"
            >
              Ajouter aux contacts
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
