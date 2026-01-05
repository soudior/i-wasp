/**
 * DualBrandShowcase - Carte de visite dual-brand i-wasp
 * Medina Mall & Le Travertin
 */

import { useState } from 'react';
import { 
  UserPlus, 
  Phone, 
  Mail, 
  Globe, 
  Clock, 
  Instagram, 
  ChevronRight,
  ShoppingBag,
  MapPin,
  Navigation,
  Utensils,
  Gem,
  Beef,
  Flame,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import medinaMallLogo from '@/assets/clients/medina-mall-logo.png';

type BrandKey = 'medina' | 'travertin';

interface Story {
  id: string;
  title: string;
  imageUrl: string;
  link?: string;
}

interface BrandConfig {
  name: string;
  tagline: string;
  url: string;
  insta: string;
  primary: string;
  primaryHex: string;
  accent: string;
  bg: string;
  cardBg: string;
  monogram: string;
  logo?: string;
  phone: string;
  email: string;
  whatsapp: string;
  location: {
    name: string;
    address: string;
    city: string;
    country: string;
    lat: number;
    lng: number;
    googleMaps: string;
  };
  stories: Story[];
  services: {
    icon: typeof ShoppingBag;
    label: string;
    sub: string;
    link?: string;
  }[];
}

const brands: Record<BrandKey, BrandConfig> = {
  medina: {
    name: "Medina Mall",
    tagline: "Authentic · Craft · Modern",
    url: "https://medinamall.ma/",
    insta: "https://www.instagram.com/medina_mall_marrakech/",
    primary: "from-amber-700 to-orange-600",
    primaryHex: "#b45309",
    accent: "text-amber-400",
    bg: "bg-[#1a0f08]",
    cardBg: "linear-gradient(135deg, #2d1b0d 0%, #1a0f08 100%)",
    monogram: "MM",
    logo: medinaMallLogo,
    phone: "+212524385757",
    email: "contact@medinamall.ma",
    whatsapp: "+212661234567",
    location: {
      name: "Medina Mall Marrakech",
      address: "En face du marché Mellah",
      city: "Marrakech",
      country: "Maroc",
      lat: 31.6225,
      lng: -7.9898,
      googleMaps: "https://maps.google.com/?q=31.6225,-7.9898"
    },
    stories: [
      { id: "1", title: "Artisanat", imageUrl: "https://medinamall.ma/wp-content/uploads/2024/12/MG_8062-scaled.jpg" },
      { id: "2", title: "Restaurants", imageUrl: "https://medinamall.ma/wp-content/uploads/2024/12/LA-table-ocre-1.jpg" },
      { id: "3", title: "Cuir", imageUrl: "https://medinamall.ma/wp-content/uploads/2025/01/MG_6956-scaled.jpg" },
      { id: "4", title: "Bijoux", imageUrl: "https://medinamall.ma/wp-content/uploads/2024/12/IMG_2034-1.jpg" },
    ],
    services: [
      { icon: ShoppingBag, label: "Artisanat Marocain", sub: "Bijoux, cuir, tapis berbères" },
      { icon: Utensils, label: "Restaurants", sub: "La Table Ocre, Medina Burger", link: "https://medinamall.ma/restaurants/" },
      { icon: Gem, label: "Beauté & Bien-être", sub: "Cosmétiques bio marocains" },
      { icon: MapPin, label: "Plan du Mall", sub: "Face au Mellah, Marrakech", link: "https://maps.google.com/?q=31.6225,-7.9898" },
      { icon: Globe, label: "Boutique en ligne", sub: "medinamall.ma", link: "https://medinamall.ma/shop/" }
    ]
  },
  travertin: {
    name: "Le Travertin",
    tagline: "Batbut Cheese Steak · Street Food Premium",
    url: "https://www.instagram.com/letravertin/",
    insta: "https://www.instagram.com/letravertin/",
    primary: "from-red-600 to-orange-500",
    primaryHex: "#dc2626",
    accent: "text-red-400",
    bg: "bg-[#1a0a0a]",
    cardBg: "linear-gradient(135deg, #3d1515 0%, #1a0a0a 100%)",
    monogram: "LT",
    phone: "+212600000000",
    email: "contact@letravertin.ma",
    whatsapp: "+212600000000",
    location: {
      name: "Le Travertin",
      address: "Marrakech",
      city: "Marrakech",
      country: "Maroc",
      lat: 31.6295,
      lng: -8.0083,
      googleMaps: "https://maps.google.com/?q=31.6295,-8.0083"
    },
    stories: [
      { id: "1", title: "Batbut", imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400" },
      { id: "2", title: "Cheese", imageUrl: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400" },
      { id: "3", title: "Steak", imageUrl: "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400" },
    ],
    services: [
      { icon: Beef, label: "Batbut Cheese Steak", sub: "Notre spécialité signature" },
      { icon: Flame, label: "Grillades Premium", sub: "Viande de qualité" },
      { icon: Clock, label: "Horaires", sub: "12h - 23h, 7j/7" },
      { icon: Instagram, label: "Instagram", sub: "@letravertin", link: "https://www.instagram.com/letravertin/" },
      { icon: MapPin, label: "Nous trouver", sub: "Marrakech", link: "https://maps.google.com/?q=31.6295,-8.0083" }
    ]
  }
};

const DualBrandShowcase = () => {
  const [activeBrand, setActiveBrand] = useState<BrandKey>('medina');
  const [isTilted, setIsTilted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeStory, setActiveStory] = useState<Story | null>(null);

  const current = brands[activeBrand];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    setMousePos({ x, y });
  };

  const handleSaveContact = () => {
    const vcfData = `BEGIN:VCARD
VERSION:3.0
FN:${current.name}
ORG:${current.name}
TEL:${current.phone}
EMAIL:${current.email}
URL:${current.url}
ADR:;;${current.location.address};${current.location.city};;${current.location.country}
GEO:${current.location.lat};${current.location.lng}
END:VCARD`;
    const blob = new Blob([vcfData], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${current.name.replace(/\s/g, '_')}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCall = () => {
    window.location.href = `tel:${current.phone}`;
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${current.whatsapp.replace(/\+/g, '')}`, '_blank');
  };

  const handleEmail = () => {
    window.location.href = `mailto:${current.email}`;
  };

  const handleInstagram = () => {
    window.open(current.insta, '_blank');
  };

  const handleLocation = () => {
    window.open(current.location.googleMaps, '_blank');
  };

  const handleServiceClick = (service: typeof current.services[0]) => {
    if (service.link) {
      window.open(service.link, '_blank');
    }
  };

  return (
    <div className={`min-h-screen ${current.bg} text-white font-sans relative overflow-hidden transition-colors duration-700`}>
      {/* Dynamic Background Blur */}
      <div 
        className="fixed inset-0 pointer-events-none transition-opacity duration-700"
        style={{
          background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, ${current.primaryHex}25 0%, transparent 50%)`
        }}
      />

      <div className="max-w-md mx-auto px-4 py-6 relative z-10">
        {/* Brand Switcher */}
        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={() => setActiveBrand('medina')}
            className={`px-5 py-2 rounded-full text-xs font-medium tracking-wider uppercase transition-all ${
              activeBrand === 'medina' 
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30' 
                : 'text-white/40 hover:text-white bg-white/5'
            }`}
          >
            Medina Mall
          </button>
          <button
            onClick={() => setActiveBrand('travertin')}
            className={`px-5 py-2 rounded-full text-xs font-medium tracking-wider uppercase transition-all ${
              activeBrand === 'travertin' 
                ? 'bg-stone-500 text-white shadow-lg shadow-stone-500/30' 
                : 'text-white/40 hover:text-white bg-white/5'
            }`}
          >
            Le Travertin
          </button>
        </div>

        {/* Stories Section */}
        <div className="mb-6 overflow-x-auto pb-2 -mx-4 px-4">
          <div className="flex gap-3">
            {current.stories.map((story, idx) => (
              <motion.button
                key={story.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setActiveStory(story)}
                className="flex flex-col items-center gap-1 flex-shrink-0"
              >
                <div 
                  className={`w-16 h-16 rounded-full p-0.5 bg-gradient-to-br ${current.primary}`}
                >
                  <div className="w-full h-full rounded-full overflow-hidden border-2 border-black">
                    <img 
                      src={story.imageUrl} 
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <span className="text-[10px] text-white/60">{story.title}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Header Section */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeBrand}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center mb-6"
          >
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div 
                  className="absolute inset-0 blur-3xl opacity-40"
                  style={{ backgroundColor: current.primaryHex }}
                />
                {current.logo ? (
                  <img 
                    src={current.logo} 
                    alt={current.name}
                    className="relative w-28 h-28 object-contain drop-shadow-2xl"
                    style={{ filter: 'invert(1)' }}
                  />
                ) : (
                  <div 
                    className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${current.primary} flex items-center justify-center text-2xl font-serif font-bold shadow-2xl`}
                  >
                    {current.monogram}
                  </div>
                )}
              </div>
            </div>
            <h1 className="text-2xl font-bold tracking-tight mb-1">
              {current.name}
            </h1>
            <p className={`text-sm ${current.accent} tracking-wide`}>
              {current.tagline}
            </p>
            <button 
              onClick={handleLocation}
              className="mt-2 flex items-center justify-center gap-1 text-xs text-white/50 hover:text-white/70 transition-colors mx-auto"
            >
              <MapPin size={12} />
              {current.location.city}, {current.location.country}
            </button>
          </motion.div>
        </AnimatePresence>

        {/* 3D NFC Card */}
        <div 
          className="perspective-1000 mb-6"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsTilted(true)}
          onMouseLeave={() => setIsTilted(false)}
        >
          <motion.div
            animate={{
              rotateX: isTilted ? (mousePos.y - 0.5) * 15 : 0,
              rotateY: isTilted ? (mousePos.x - 0.5) * 15 : 0,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="preserve-3d"
          >
            <div 
              className="relative rounded-2xl p-5 shadow-2xl border border-white/10 overflow-hidden"
              style={{ background: current.cardBg }}
            >
              {/* Holographic effect */}
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  background: `linear-gradient(${mousePos.x * 360}deg, transparent, rgba(255,255,255,0.1), transparent)`
                }}
              />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">
                      Service i-wasp VIP
                    </p>
                    <p className="text-base font-medium">{current.name}</p>
                    <p className="text-xs text-white/40 mt-0.5">{current.location.address}</p>
                  </div>
                  {current.logo ? (
                    <img 
                      src={current.logo} 
                      alt={current.name}
                      className="w-10 h-10 object-contain"
                      style={{ filter: 'invert(1)' }}
                    />
                  ) : (
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${current.primary} flex items-center justify-center text-sm font-bold`}>
                      {current.monogram}
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[9px] text-white/30 uppercase tracking-widest">
                      EN PARTENARIAT AVEC i-WASP.COM
                    </p>
                    <p className="text-[10px] text-white/50 mt-0.5">
                      Collection Privée 2026
                    </p>
                  </div>
                  <div className={`${current.accent}`}>
                    {activeBrand === 'medina' ? <ShoppingBag size={20} /> : <Flame size={20} />}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          <Button
            onClick={handleCall}
            variant="outline"
            className="flex flex-col items-center gap-1 bg-white/5 hover:bg-white/10 border-white/10 text-white py-4 rounded-xl h-auto"
          >
            <Phone size={18} />
            <span className="text-[10px]">Appeler</span>
          </Button>
          <Button
            onClick={handleWhatsApp}
            variant="outline"
            className="flex flex-col items-center gap-1 bg-green-500/20 hover:bg-green-500/30 border-green-500/30 text-green-400 py-4 rounded-xl h-auto"
          >
            <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span className="text-[10px]">WhatsApp</span>
          </Button>
          <Button
            onClick={handleInstagram}
            variant="outline"
            className="flex flex-col items-center gap-1 bg-pink-500/20 hover:bg-pink-500/30 border-pink-500/30 text-pink-400 py-4 rounded-xl h-auto"
          >
            <Instagram size={18} />
            <span className="text-[10px]">Instagram</span>
          </Button>
          <Button
            onClick={handleLocation}
            variant="outline"
            className="flex flex-col items-center gap-1 bg-blue-500/20 hover:bg-blue-500/30 border-blue-500/30 text-blue-400 py-4 rounded-xl h-auto"
          >
            <Navigation size={18} />
            <span className="text-[10px]">Itinéraire</span>
          </Button>
        </div>

        {/* Save Contact Button */}
        <Button
          onClick={handleSaveContact}
          className={`w-full bg-gradient-to-r ${current.primary} hover:opacity-90 text-white py-6 rounded-xl font-medium mb-6`}
        >
          <UserPlus className="mr-2 h-5 w-5" />
          Ajouter aux contacts
        </Button>

        {/* Brand Specific Services */}
        <div className="space-y-2 mb-6">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Nos services</p>
          {current.services.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => handleServiceClick(item)}
              className={`flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 ${item.link ? 'cursor-pointer hover:bg-white/10' : ''} transition-all`}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${current.primaryHex}30` }}
                >
                  <item.icon size={16} className={current.accent} />
                </div>
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-white/40">{item.sub}</p>
                </div>
              </div>
              {item.link && <ChevronRight size={16} className="text-white/20" />}
            </motion.div>
          ))}
        </div>

        {/* Concierge i-wasp Integration */}
        <div className="relative rounded-2xl p-5 bg-gradient-to-br from-white/5 to-transparent border border-white/10">
          <div className="absolute -top-3 left-5 px-2 py-1 rounded-md bg-black border border-white/20 text-[10px] font-bold tracking-wider">
            i-wasp
          </div>
          
          <div className="pt-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-white/60">Assistance Conciergerie disponible</span>
            </div>
            
            <p className="text-sm text-white/70 mb-4">
              Une demande spécifique pour {current.name} ?
              Nos concierges sont à votre disposition 24/7.
            </p>

            <div className="flex gap-2">
              <Button
                onClick={handleWhatsApp}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-xs font-medium"
              >
                <svg viewBox="0 0 24 24" className="w-3 h-3 mr-1.5 fill-current">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </Button>
              <Button
                onClick={handleEmail}
                variant="outline"
                className="flex-1 bg-white/5 hover:bg-white/10 border-white/10 text-white py-3 rounded-xl text-xs"
              >
                <Mail className="mr-1.5 h-3 w-3" />
                Email
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-[10px] text-white/30">
              Propulsé par
            </span>
            <span className="text-xs font-bold text-white/50">i-wasp.com</span>
          </div>
          <p className="text-[10px] text-white/20">
            © 2026 Tous Droits Réservés
          </p>
        </div>
      </div>

      {/* Story Modal */}
      <AnimatePresence>
        {activeStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setActiveStory(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-sm w-full aspect-[9/16] rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={activeStory.imageUrl} 
                alt={activeStory.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {current.logo ? (
                    <img 
                      src={current.logo} 
                      alt={current.name}
                      className="w-8 h-8 object-contain"
                      style={{ filter: 'invert(1)' }}
                    />
                  ) : (
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${current.primary} flex items-center justify-center text-xs font-bold`}>
                      {current.monogram}
                    </div>
                  )}
                  <span className="text-sm font-medium">{current.name}</span>
                </div>
                <button
                  onClick={() => setActiveStory(null)}
                  className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
              <div className="absolute bottom-4 left-4">
                <p className="text-lg font-bold">{activeStory.title}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
      `}</style>
    </div>
  );
};

export default DualBrandShowcase;
