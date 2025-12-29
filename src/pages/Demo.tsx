import { useState, useEffect, useRef, MouseEvent } from "react";
import { CardData } from "@/components/templates/CardTemplates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Phone, Mail, User, Building2, MapPin, Globe, Linkedin, Instagram,
  X, Plus, Wallet, Share2, CreditCard, Sparkles, ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";
import { downloadVCard } from "@/lib/vcard";
import { addToAppleWallet, addToGoogleWallet, WalletCardData } from "@/lib/walletService";
import { toast } from "sonner";
import { IWASPLogoSimple } from "@/components/IWASPLogo";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import demoProfileImage from "@/assets/demo-profile.jpg";

// 3D Tilt hook for premium hover effect
function useTilt3D(intensity: number = 15) {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const brightness = useMotionValue(1);
  
  const springConfig = { stiffness: 300, damping: 30 };
  const smoothRotateX = useSpring(rotateX, springConfig);
  const smoothRotateY = useSpring(rotateY, springConfig);
  const smoothBrightness = useSpring(brightness, { stiffness: 200, damping: 25 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    const rotateXValue = (mouseY / (rect.height / 2)) * -intensity;
    const rotateYValue = (mouseX / (rect.width / 2)) * intensity;
    
    rotateX.set(rotateXValue);
    rotateY.set(rotateYValue);
    brightness.set(1.05);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    brightness.set(1);
  };

  return {
    style: {
      rotateX: smoothRotateX,
      rotateY: smoothRotateY,
      filter: smoothBrightness,
    },
    handlers: {
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
    },
  };
}

// Demo card data - IWASP showcase
const demoCardData: CardData = {
  id: "demo-card-001",
  slug: "sarah-laurent-demo",
  firstName: "Sarah",
  lastName: "Laurent",
  title: "Directrice Marketing",
  company: "IWASP",
  email: "sarah@iwasp.ma",
  phone: "+212 6 12 34 56 78",
  location: "Casablanca, Maroc",
  website: "iwasp.ma",
  linkedin: "sarah-laurent",
  instagram: "@sarahlaurent",
  tagline: "L'élégance professionnelle, version numérique",
  photoUrl: demoProfileImage,
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 80,
      damping: 20,
      duration: 0.8,
    },
  },
};

// Action item component with enhanced tap area
function ActionItem({ 
  icon: Icon, 
  label, 
  value, 
  href,
}: { 
  icon: React.ElementType; 
  label: string; 
  value: string; 
  href?: string;
}) {
  const content = (
    <motion.div 
      variants={itemVariants}
      whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.06)" }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.04] transition-colors duration-200 group cursor-pointer"
    >
      <div className="w-11 h-11 rounded-xl bg-white/[0.05] flex items-center justify-center flex-shrink-0 group-hover:bg-white/[0.08] transition-colors">
        <Icon size={20} className="text-white/50 group-hover:text-white/70 transition-colors" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] uppercase tracking-wider text-white/30 mb-0.5">{label}</p>
        <p className="text-sm text-white/80 truncate">{value}</p>
      </div>
    </motion.div>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </a>
    );
  }
  
  return content;
}

export default function Demo() {
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadData, setLeadData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [loadingApple, setLoadingApple] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  
  // 3D Tilt effect
  const { style: tiltStyle, handlers: tiltHandlers } = useTilt3D(12);
  
  // Parallax scroll effect
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 300], [0, -30]);
  const parallaxOpacity = useTransform(scrollY, [0, 200], [1, 0.8]);
  const smoothY = useSpring(parallaxY, { stiffness: 100, damping: 30 });

  // Handle vCard download
  const handleDownloadVCard = () => {
    downloadVCard({
      firstName: demoCardData.firstName,
      lastName: demoCardData.lastName,
      title: demoCardData.title,
      company: demoCardData.company,
      email: demoCardData.email,
      phone: demoCardData.phone,
      website: demoCardData.website,
      location: demoCardData.location,
      linkedin: demoCardData.linkedin,
      instagram: demoCardData.instagram,
    });
    toast.success("Contact ajouté à votre répertoire !");
  };

  // Handle Apple Wallet
  const handleAppleWallet = async () => {
    setLoadingApple(true);
    try {
      const walletData: WalletCardData = {
        id: demoCardData.id!,
        firstName: demoCardData.firstName!,
        lastName: demoCardData.lastName!,
        title: demoCardData.title,
        company: demoCardData.company,
        email: demoCardData.email,
        phone: demoCardData.phone,
        website: demoCardData.website,
        location: demoCardData.location,
        slug: demoCardData.slug!,
        linkedin: demoCardData.linkedin,
        instagram: demoCardData.instagram,
        tagline: demoCardData.tagline,
      };
      await addToAppleWallet(walletData);
    } finally {
      setLoadingApple(false);
    }
  };

  // Handle Google Wallet
  const handleGoogleWallet = async () => {
    setLoadingGoogle(true);
    try {
      const walletData: WalletCardData = {
        id: demoCardData.id!,
        firstName: demoCardData.firstName!,
        lastName: demoCardData.lastName!,
        title: demoCardData.title,
        company: demoCardData.company,
        email: demoCardData.email,
        phone: demoCardData.phone,
        website: demoCardData.website,
        location: demoCardData.location,
        slug: demoCardData.slug!,
        linkedin: demoCardData.linkedin,
        instagram: demoCardData.instagram,
        tagline: demoCardData.tagline,
      };
      await addToGoogleWallet(walletData);
    } finally {
      setLoadingGoogle(false);
    }
  };

  // Handle lead form submission
  const handleShareInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    await new Promise(resolve => setTimeout(resolve, 500));
    toast.success("Vos coordonnées ont été partagées avec succès !");
    setShowLeadForm(false);
    setLeadSubmitted(true);
    setLeadData({ name: "", email: "", phone: "", company: "" });
  };

  return (
    <div className="min-h-screen bg-[hsl(0,0%,3%)] relative overflow-hidden">
      {/* Subtle ambient background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-amber-500/[0.03] via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-radial from-amber-600/[0.02] via-transparent to-transparent" />
      </div>
      
      {/* Noise texture */}
      <div className="absolute inset-0 opacity-[0.015]" style={{ 
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` 
      }} />

      {/* Header */}
      <header className="relative z-20 px-5 py-4 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-light">Retour</span>
        </Link>
        
        {/* Demo badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
          <Sparkles className="h-3 w-3 text-amber-400" />
          <span className="text-[11px] font-medium text-amber-400 tracking-wide">DÉMO INTERACTIVE</span>
        </div>
      </header>

      {/* Main content */}
      <main ref={containerRef} className="relative z-10 flex items-start justify-center px-5 py-6 pb-12">
        <motion.div 
          className="w-full max-w-[380px]"
          style={{ y: smoothY, opacity: parallaxOpacity }}
        >
          
          {/* Premium Card Container with entry animation and 3D tilt */}
          <motion.div 
            className="relative rounded-[28px] overflow-hidden bg-[hsl(0,0%,6%)] border border-white/[0.06] shadow-2xl shadow-black/50"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            style={{ 
              rotateX: tiltStyle.rotateX, 
              rotateY: tiltStyle.rotateY,
              transformPerspective: 1000,
              transformStyle: "preserve-3d",
            }}
            {...tiltHandlers}
            whileHover={{ 
              boxShadow: "0 50px 100px -20px rgba(0,0,0,0.7), 0 0 60px rgba(245,158,11,0.08)",
            }}
            transition={{ boxShadow: { duration: 0.3 } }}
          >
            {/* Subtle top gradient line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            
            {/* IWASP Logo - Top Right */}
            <motion.div 
              className="absolute top-5 right-5 z-10"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 0.3, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <IWASPLogoSimple variant="dark" size="sm" />
            </motion.div>

            {/* Card Content */}
            <div className="p-7 pt-6">
              
              {/* Profile Section with staggered animations */}
              <motion.div 
                className="flex flex-col items-center text-center mb-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Avatar with premium shadow */}
                <motion.div 
                  className="relative mb-5"
                  variants={itemVariants}
                >
                  <motion.div 
                    className="w-28 h-28 rounded-full overflow-hidden ring-2 ring-white/[0.08] shadow-xl shadow-black/40"
                    whileHover={{ scale: 1.05, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.6)" }}
                    transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
                  >
                    <img 
                      src={demoCardData.photoUrl || ""} 
                      alt={`${demoCardData.firstName} ${demoCardData.lastName}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  {/* Status indicator */}
                  <motion.div 
                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-[3px] border-[hsl(0,0%,6%)] flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6, type: "spring" as const, stiffness: 500, damping: 15 }}
                  >
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  </motion.div>
                </motion.div>

                {/* Name - Dominant */}
                <motion.h1 
                  className="font-display text-[26px] font-semibold text-white tracking-tight mb-1"
                  variants={itemVariants}
                >
                  {demoCardData.firstName} {demoCardData.lastName}
                </motion.h1>
                
                {/* Title - Secondary */}
                <motion.p 
                  className="text-[15px] text-white/50 font-light mb-0.5"
                  variants={itemVariants}
                >
                  {demoCardData.title}
                </motion.p>
                
                {/* Company */}
                <motion.p 
                  className="text-[13px] text-white/30 font-light"
                  variants={itemVariants}
                >
                  {demoCardData.company}
                </motion.p>

                {/* Tagline - Subtle italic */}
                {demoCardData.tagline && (
                  <motion.p 
                    className="mt-4 text-[13px] text-white/25 italic font-light max-w-[280px] leading-relaxed"
                    variants={itemVariants}
                  >
                    "{demoCardData.tagline}"
                  </motion.p>
                )}
              </motion.div>

              {/* Action List - Enhanced with stagger */}
              <motion.div 
                className="space-y-2.5 mb-7"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {demoCardData.phone && (
                  <ActionItem 
                    icon={Phone} 
                    label="Téléphone" 
                    value={demoCardData.phone} 
                    href={`tel:${demoCardData.phone}`}
                  />
                )}
                {demoCardData.email && (
                  <ActionItem 
                    icon={Mail} 
                    label="Email" 
                    value={demoCardData.email} 
                    href={`mailto:${demoCardData.email}`}
                  />
                )}
                {demoCardData.website && (
                  <ActionItem 
                    icon={Globe} 
                    label="Site web" 
                    value={demoCardData.website} 
                    href={`https://${demoCardData.website}`}
                  />
                )}
                {demoCardData.location && (
                  <ActionItem 
                    icon={MapPin} 
                    label="Localisation" 
                    value={demoCardData.location} 
                    href={`https://maps.google.com/?q=${encodeURIComponent(demoCardData.location)}`}
                  />
                )}
                {demoCardData.linkedin && (
                  <ActionItem 
                    icon={Linkedin} 
                    label="LinkedIn" 
                    value={demoCardData.linkedin} 
                    href={`https://linkedin.com/in/${demoCardData.linkedin}`}
                  />
                )}
                {demoCardData.instagram && (
                  <ActionItem 
                    icon={Instagram} 
                    label="Instagram" 
                    value={demoCardData.instagram} 
                    href={`https://instagram.com/${demoCardData.instagram.replace('@', '')}`}
                  />
                )}
              </motion.div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                {/* Primary - Add to contacts */}
                <button
                  onClick={handleDownloadVCard}
                  className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[hsl(0,0%,5%)] font-semibold rounded-2xl flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] shadow-lg shadow-amber-500/20"
                >
                  <Plus size={20} strokeWidth={2.5} />
                  Ajouter aux contacts
                </button>

                {/* Wallet buttons */}
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={handleAppleWallet}
                    disabled={loadingApple}
                    className="py-3.5 bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.06] rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    <Wallet size={17} className="text-white/40" />
                    <span className="text-[13px] text-white/60">Apple Wallet</span>
                  </button>
                  <button
                    onClick={handleGoogleWallet}
                    disabled={loadingGoogle}
                    className="py-3.5 bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.06] rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    <Wallet size={17} className="text-white/40" />
                    <span className="text-[13px] text-white/60">Google Wallet</span>
                  </button>
                </div>

                {/* Share info button */}
                <button
                  onClick={() => setShowLeadForm(true)}
                  disabled={leadSubmitted}
                  className="w-full py-3.5 bg-transparent hover:bg-white/[0.03] border border-white/[0.08] rounded-xl flex items-center justify-center gap-2 text-white/40 hover:text-white/60 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  <Share2 size={17} />
                  <span className="text-[13px]">
                    {leadSubmitted ? "Coordonnées partagées ✓" : "Partager mes coordonnées"}
                  </span>
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-white/[0.04] py-4 text-center">
              <p className="text-[10px] text-white/15 tracking-[0.2em] uppercase">
                Powered by IWASP
              </p>
            </div>
          </motion.div>

          {/* CTA to order */}
          <motion.div 
            className="mt-6 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <p className="font-medium text-white">Votre carte NFC premium</p>
                <p className="text-sm text-white/40">À partir de 29€</p>
              </div>
            </div>
            <Link to="/templates">
              <Button className="w-full h-12 bg-white text-[hsl(0,0%,5%)] hover:bg-white/90 font-medium">
                Commander ma carte
              </Button>
            </Link>
          </motion.div>

          {/* IWASP branding */}
          <motion.div 
            className="text-center mt-6 space-y-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <p className="text-[11px] text-white/25">
              🇲🇦 Livraison Maroc • Paiement à la livraison
            </p>
          </motion.div>
        </motion.div>
      </main>

      {/* Lead capture modal */}
      <div 
        className={`fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/80 backdrop-blur-xl transition-opacity duration-200 ${
          showLeadForm ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="w-full max-w-sm rounded-2xl bg-[hsl(0,0%,8%)] border border-white/[0.08] p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">
              Partager mes coordonnées
            </h2>
            <button
              onClick={() => setShowLeadForm(false)}
              className="w-9 h-9 rounded-full bg-white/[0.05] hover:bg-white/[0.1] flex items-center justify-center transition-colors"
            >
              <X size={18} className="text-white/50" />
            </button>
          </div>

          <form onSubmit={handleShareInfo} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="demo-lead-name" className="flex items-center gap-2 text-sm text-white/60">
                <User size={14} />
                Nom complet
              </Label>
              <Input
                id="demo-lead-name"
                value={leadData.name}
                onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
                placeholder="Jean Dupont"
                className="bg-white/[0.04] border-white/[0.08] h-12 text-white placeholder:text-white/30"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="demo-lead-email" className="flex items-center gap-2 text-sm text-white/60">
                <Mail size={14} />
                Email
              </Label>
              <Input
                id="demo-lead-email"
                type="email"
                value={leadData.email}
                onChange={(e) => setLeadData({ ...leadData, email: e.target.value })}
                placeholder="jean@exemple.com"
                className="bg-white/[0.04] border-white/[0.08] h-12 text-white placeholder:text-white/30"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="demo-lead-phone" className="flex items-center gap-2 text-sm text-white/60">
                <Phone size={14} />
                Téléphone
              </Label>
              <Input
                id="demo-lead-phone"
                value={leadData.phone}
                onChange={(e) => setLeadData({ ...leadData, phone: e.target.value })}
                placeholder="+212 6 12 34 56 78"
                className="bg-white/[0.04] border-white/[0.08] h-12 text-white placeholder:text-white/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="demo-lead-company" className="flex items-center gap-2 text-sm text-white/60">
                <Building2 size={14} />
                Entreprise
              </Label>
              <Input
                id="demo-lead-company"
                value={leadData.company}
                onChange={(e) => setLeadData({ ...leadData, company: e.target.value })}
                placeholder="Ma Société"
                className="bg-white/[0.04] border-white/[0.08] h-12 text-white placeholder:text-white/30"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-amber-500 hover:bg-amber-400 text-[hsl(0,0%,5%)] font-medium mt-2"
            >
              Envoyer
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
