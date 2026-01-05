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
  Calendar, 
  Instagram, 
  ChevronRight,
  ShoppingBag,
  Sparkles,
  MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

type BrandKey = 'medina' | 'travertin';

interface BrandConfig {
  name: string;
  tagline: string;
  url: string;
  insta: string;
  primary: string;
  accent: string;
  bg: string;
  cardBg: string;
  monogram: string;
  phone: string;
  email: string;
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
    tagline: "L'Expérience Shopping Culturelle",
    url: "https://medinamall.ma/",
    insta: "https://www.instagram.com/medinamall",
    primary: "from-orange-800 to-amber-600",
    accent: "text-amber-500",
    bg: "bg-[#0f0a05]",
    cardBg: "linear-gradient(135deg, #2d1b0d 0%, #0f0a05 100%)",
    monogram: "MM",
    phone: "+212522000000",
    email: "contact@medinamall.ma",
    services: [
      { icon: ShoppingBag, label: "Personal Shopper", sub: "Accompagnement VIP" },
      { icon: MapPin, label: "Plan du Mall", sub: "Marrakech, Maroc" },
      { icon: Globe, label: "Site Officiel", sub: "medinamall.ma", link: "https://medinamall.ma/" }
    ]
  },
  travertin: {
    name: "Le Travertin",
    tagline: "Design & Mobilier d'Exception",
    url: "https://www.instagram.com/letravertin",
    insta: "https://www.instagram.com/letravertin?igsh=MW0xN2Zkb3RjOXNhYw==",
    primary: "from-stone-400 to-stone-600",
    accent: "text-stone-300",
    bg: "bg-[#0d0d0d]",
    cardBg: "linear-gradient(135deg, #44403c 0%, #0c0a09 100%)",
    monogram: "LT",
    phone: "+212600000000",
    email: "contact@letravertin.ma",
    services: [
      { icon: Sparkles, label: "Catalogue Design", sub: "Collection 2024" },
      { icon: Instagram, label: "Inspirations Instagram", sub: "@letravertin", link: "https://www.instagram.com/letravertin" },
      { icon: Calendar, label: "Prendre Rendez-vous", sub: "Showroom Privé" }
    ]
  }
};

const DualBrandShowcase = () => {
  const [activeBrand, setActiveBrand] = useState<BrandKey>('medina');
  const [isTilted, setIsTilted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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
FN:i-wasp | ${current.name}
ORG:${current.name}
TEL:${current.phone}
EMAIL:${current.email}
URL:${current.url}
END:VCARD`;
    const blob = new Blob([vcfData], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${activeBrand}_contact.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCall = () => {
    window.location.href = `tel:${current.phone}`;
  };

  const handleEmail = () => {
    window.location.href = `mailto:${current.email}`;
  };

  const handleInstagram = () => {
    window.open(current.insta, '_blank');
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
          background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, ${activeBrand === 'medina' ? 'rgba(217,119,6,0.15)' : 'rgba(168,162,158,0.15)'} 0%, transparent 50%)`
        }}
      />

      <div className="max-w-md mx-auto px-6 py-8 relative z-10">
        {/* Brand Switcher */}
        <div className="flex justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveBrand('medina')}
            className={`px-6 py-2 rounded-full text-xs font-medium tracking-widest uppercase transition-all ${
              activeBrand === 'medina' 
                ? 'bg-amber-600 text-white shadow-lg' 
                : 'text-white/40 hover:text-white'
            }`}
          >
            Medina Mall
          </button>
          <button
            onClick={() => setActiveBrand('travertin')}
            className={`px-6 py-2 rounded-full text-xs font-medium tracking-widest uppercase transition-all ${
              activeBrand === 'travertin' 
                ? 'bg-stone-500 text-white shadow-lg' 
                : 'text-white/40 hover:text-white'
            }`}
          >
            Le Travertin
          </button>
        </div>

        {/* Header Section */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeBrand}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center mb-8"
          >
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className={`absolute inset-0 bg-gradient-to-r ${current.primary} blur-2xl opacity-30`} />
                <div 
                  className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${current.primary} flex items-center justify-center text-2xl font-serif font-bold shadow-2xl`}
                >
                  {current.monogram}
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-serif font-bold tracking-tight mb-2">
              {current.name}
            </h1>
            <p className={`text-sm ${current.accent} tracking-wide`}>
              {current.tagline}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* 3D NFC Card */}
        <div 
          className="perspective-1000 mb-8"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsTilted(true)}
          onMouseLeave={() => setIsTilted(false)}
        >
          <motion.div
            animate={{
              rotateX: isTilted ? (mousePos.y - 0.5) * 20 : 0,
              rotateY: isTilted ? (mousePos.x - 0.5) * 20 : 0,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="preserve-3d"
          >
            <div 
              className="relative rounded-2xl p-6 shadow-2xl border border-white/10 overflow-hidden"
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
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <p className="text-xs text-white/50 uppercase tracking-widest mb-1">
                      Service i-wasp VIP
                    </p>
                    <p className="text-lg font-medium">{current.name}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${current.primary} flex items-center justify-center text-sm font-bold`}>
                    {current.monogram}
                  </div>
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest">
                      EN PARTENARIAT AVEC i-WASP.COM
                    </p>
                    <p className="text-xs text-white/60 mt-1">
                      Collection Privée 2026
                    </p>
                  </div>
                  <div className={`${current.accent}`}>
                    {activeBrand === 'medina' ? <ShoppingBag size={24} /> : <Sparkles size={24} />}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <Button
            onClick={handleInstagram}
            className={`flex-1 bg-gradient-to-r ${current.primary} hover:opacity-90 text-white py-6 rounded-xl font-medium`}
          >
            <Instagram className="mr-2 h-4 w-4" />
            Instagram
          </Button>
          <Button
            onClick={handleSaveContact}
            variant="outline"
            className="flex-1 bg-white/5 hover:bg-white/10 border-white/10 text-white py-6 rounded-xl"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Contact
          </Button>
        </div>

        {/* Brand Specific Services */}
        <div className="space-y-3 mb-8">
          {current.services.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => handleServiceClick(item)}
              className={`flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 ${item.link ? 'cursor-pointer hover:bg-white/10' : ''} transition-all`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${current.primary} bg-opacity-20 flex items-center justify-center`}>
                  <item.icon size={18} className={current.accent} />
                </div>
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-white/50">{item.sub}</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-white/30" />
            </motion.div>
          ))}
        </div>

        {/* Concierge i-wasp Integration */}
        <div className="relative rounded-2xl p-6 bg-gradient-to-br from-white/5 to-transparent border border-white/10">
          <div className="absolute -top-4 left-6 w-8 h-8 rounded-lg bg-black border border-white/20 flex items-center justify-center text-xs font-bold">
            iW
          </div>
          
          <div className="pt-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-white/60">Assistance Conciergerie</span>
            </div>
            
            <p className="text-sm text-white/70 mb-4">
              Une demande spécifique pour {current.name} ?<br />
              Nos concierges i-wasp sont à votre disposition.
            </p>

            <div className="flex gap-3">
              <Button
                onClick={handleCall}
                className={`flex-1 bg-gradient-to-r ${current.primary} hover:opacity-90 text-white py-3 rounded-xl text-xs font-medium`}
              >
                <Phone className="mr-2 h-3 w-3" />
                Appeler
              </Button>
              <Button
                onClick={handleEmail}
                variant="outline"
                className="flex-1 bg-black/40 hover:bg-black/60 border-white/10 text-white py-3 rounded-xl text-xs"
              >
                <Mail className="mr-2 h-3 w-3" />
                Email
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center text-[10px] font-bold">
              iW
            </div>
            <span className="text-xs text-white/40">
              Membre du Réseau i-wasp.com
            </span>
          </div>
          <p className="text-[10px] text-white/20">
            © 2026 Tous Droits Réservés
          </p>
        </div>
      </div>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
      `}</style>
    </div>
  );
};

export default DualBrandShowcase;
