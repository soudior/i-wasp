import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Tag, Phone, Star, MapPin, Mail } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BoutiqueTemplateProps {
  card: {
    first_name: string;
    last_name: string;
    title?: string;
    company?: string;
    photo_url?: string;
    logo_url?: string;
    email?: string;
    phone?: string;
    website?: string;
    location?: string;
    tagline?: string;
    social_links?: Record<string, string>;
  };
  onAction?: (action: string, data?: any) => void;
}

const BoutiqueTemplate: React.FC<BoutiqueTemplateProps> = ({ card, onAction }) => {
  const fullName = `${card.first_name} ${card.last_name}`.trim();
  const initials = `${card.first_name?.[0] || ''}${card.last_name?.[0] || ''}`.toUpperCase();

  const primaryActions = [
    {
      id: 'catalogue',
      icon: ShoppingBag,
      label: 'Catalogue',
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      action: () => onAction?.('catalogue'),
    },
    {
      id: 'promotions',
      icon: Tag,
      label: 'Promotions',
      color: 'bg-gradient-to-r from-orange-500 to-red-500',
      action: () => onAction?.('promotions'),
    },
    {
      id: 'contact',
      icon: Phone,
      label: 'Contact',
      color: 'bg-gradient-to-r from-emerald-500 to-teal-500',
      action: () => card.phone && (window.location.href = `tel:${card.phone}`),
    },
    {
      id: 'avis',
      icon: Star,
      label: 'Avis',
      color: 'bg-gradient-to-r from-amber-500 to-yellow-500',
      action: () => onAction?.('reviews'),
    },
  ];

  const secondaryActions = [
    ...(card.location ? [{
      id: 'directions',
      icon: MapPin,
      label: 'Itinéraire',
      action: () => window.open(`https://maps.google.com/?q=${encodeURIComponent(card.location!)}`, '_blank'),
    }] : []),
    ...(card.email ? [{
      id: 'email',
      icon: Mail,
      label: 'Email',
      action: () => window.location.href = `mailto:${card.email}`,
    }] : []),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 flex flex-col items-center justify-start px-4 py-8">
      {/* Logo badge */}
      {card.logo_url && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-4 right-4 w-12 h-12 rounded-xl bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center p-2"
        >
          <img src={card.logo_url} alt="Logo" className="w-full h-full object-contain" />
        </motion.div>
      )}

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center mb-8"
      >
        <Avatar className="w-24 h-24 border-4 border-white shadow-xl mb-4">
          <AvatarImage src={card.photo_url} alt={fullName} />
          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-2xl font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>

        <h1 className="text-2xl font-bold text-gray-900 text-center">
          {card.company || fullName}
        </h1>
        
        {card.tagline && (
          <p className="text-gray-600 text-center mt-1 text-sm max-w-xs">
            {card.tagline}
          </p>
        )}

        {card.location && (
          <p className="text-gray-500 text-sm mt-2 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {card.location}
          </p>
        )}
      </motion.div>

      {/* Primary Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-sm space-y-3 mb-6"
      >
        {primaryActions.map((action, index) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
          >
            <Button
              onClick={action.action}
              className={cn(
                "w-full h-14 text-white font-semibold text-base rounded-2xl shadow-lg",
                "hover:scale-[1.02] active:scale-[0.98] transition-all duration-200",
                action.color
              )}
            >
              <action.icon className="w-5 h-5 mr-3" />
              {action.label}
            </Button>
          </motion.div>
        ))}
      </motion.div>

      {/* Secondary Actions */}
      {secondaryActions.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex gap-3"
        >
          {secondaryActions.map((action) => (
            <Button
              key={action.id}
              variant="outline"
              onClick={action.action}
              className="h-12 px-6 rounded-xl bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white"
            >
              <action.icon className="w-4 h-4 mr-2" />
              {action.label}
            </Button>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default BoutiqueTemplate;
