import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, TrendingUp, Users, Eye, Download, Mail, Bell, BarChart3, Zap } from "lucide-react";

interface DashboardSlide {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  content: React.ReactNode;
}

export function DashboardCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Simulated chart data
  const chartPoints = [30, 45, 35, 55, 40, 65, 50, 75, 60, 85, 70, 95];
  const maxValue = Math.max(...chartPoints);
  
  const createPath = () => {
    const width = 320;
    const height = 100;
    const stepX = width / (chartPoints.length - 1);
    
    let path = `M 0 ${height - (chartPoints[0] / maxValue) * height}`;
    chartPoints.forEach((point, i) => {
      if (i === 0) return;
      const x = i * stepX;
      const y = height - (point / maxValue) * height;
      path += ` L ${x} ${y}`;
    });
    
    return path;
  };

  const slides: DashboardSlide[] = [
    {
      id: "analytics",
      title: "Analytics Pro",
      subtitle: "Statistiques en temps réel",
      icon: BarChart3,
      content: (
        <div className="space-y-4">
          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Eye, value: "2,847", label: "Scans", trend: "+18%" },
              { icon: Users, value: "156", label: "Leads", trend: "+24%" },
              { icon: TrendingUp, value: "43%", label: "Conv.", trend: "+5%" },
            ].map((stat, i) => (
              <motion.div 
                key={i} 
                className="p-3 rounded-xl bg-white/5 border border-white/10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-center gap-1 mb-1">
                  <stat.icon className="w-3 h-3 text-amber-400" />
                  <span className="text-green-400 text-[10px]">{stat.trend}</span>
                </div>
                <p className="text-white font-bold text-sm">{stat.value}</p>
                <p className="text-gray-500 text-[10px]">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Chart */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-gray-400 text-xs mb-3">Performance 30 jours</p>
            <svg viewBox="0 0 320 100" className="w-full h-20">
              <defs>
                <linearGradient id="carouselGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={`${createPath()} L 320 100 L 0 100 Z`} fill="url(#carouselGradient)" />
              <motion.path 
                d={createPath()}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              <motion.circle 
                cx="320" 
                cy={100 - (chartPoints[chartPoints.length - 1] / maxValue) * 100}
                r="5" 
                fill="#f59e0b"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.5 }}
              />
            </svg>
          </div>
        </div>
      ),
    },
    {
      id: "leads",
      title: "Leads & CRM",
      subtitle: "Gestion de contacts intelligente",
      icon: Users,
      content: (
        <div className="space-y-3">
          {[
            { name: "Sarah El Mansouri", email: "sarah.m@gmail.com", score: 95 },
            { name: "Karim Benali", email: "k.benali@hotel.ma", score: 87 },
            { name: "Emma Dubois", email: "emma.d@airbnb.fr", score: 72 },
          ].map((lead, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/30 to-amber-600/20 flex items-center justify-center">
                  <span className="text-sm font-bold text-amber-400">{lead.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{lead.name}</p>
                  <p className="text-gray-500 text-xs">{lead.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                  lead.score > 80 ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {lead.score}%
                </div>
              </div>
            </motion.div>
          ))}
          
          <div className="flex gap-2 pt-2">
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-500/10 text-amber-400 text-xs border border-amber-500/30">
              <Mail className="w-3 h-3" />
              Contacter
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 text-gray-400 text-xs border border-white/10">
              <Download className="w-3 h-3" />
              Export
            </button>
          </div>
        </div>
      ),
    },
    {
      id: "push",
      title: "Push Notifications",
      subtitle: "Recontactez vos leads",
      icon: Bell,
      content: (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Bell className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Nouvelle Offre</p>
                <p className="text-gray-500 text-xs">Envoyé à 156 contacts</p>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-black/40 text-gray-300 text-sm">
              "🌟 Offre exclusive -20% sur nos services ce weekend ! Réservez maintenant..."
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Envoyées", value: "1,247" },
              { label: "Ouvertes", value: "892" },
              { label: "Clics", value: "234" },
            ].map((stat, i) => (
              <motion.div 
                key={i} 
                className="p-3 rounded-xl bg-white/5 border border-white/10 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <p className="text-white font-bold text-sm">{stat.value}</p>
                <p className="text-gray-500 text-[10px]">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "stories",
      title: "Stories 24h",
      subtitle: "Contenu éphémère premium",
      icon: Zap,
      content: (
        <div className="space-y-4">
          {/* Stories Preview */}
          <div className="flex justify-center gap-3">
            {[1, 2, 3, 4].map((i) => (
              <motion.div 
                key={i} 
                className="relative"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="absolute inset-0 rounded-full p-[2px] bg-gradient-to-br from-amber-400 via-yellow-300 to-amber-500" />
                <div className="relative w-14 h-14 rounded-full bg-zinc-900 border-2 border-black overflow-hidden flex items-center justify-center">
                  <Zap className="w-5 h-5 text-amber-400/50" />
                </div>
                {i === 1 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black flex items-center justify-center">
                    <span className="text-[8px] text-white font-bold">+</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-amber-400 font-bold text-xl">12</p>
              <p className="text-gray-500 text-xs">Stories actives</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-amber-400 font-bold text-xl">3.2K</p>
              <p className="text-gray-500 text-xs">Vues totales</p>
            </div>
          </div>
          
          <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20">
            <p className="text-xs text-gray-400">
              <span className="text-amber-400 font-medium">Astuce:</span> Publiez vos stories aux heures de pointe (18h-21h) pour 3x plus de vues
            </p>
          </div>
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => goToSlide((currentSlide + 1) % slides.length);
  const prevSlide = () => goToSlide((currentSlide - 1 + slides.length) % slides.length);

  const CurrentIcon = slides[currentSlide].icon;

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-zinc-950 via-black to-zinc-950">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-600/10 border border-amber-500/30 text-amber-400 text-sm font-medium mb-6">
            <BarChart3 className="w-4 h-4" />
            Dashboard Gold • Interface Réelle
          </div>
          <h2 className="font-playfair text-2xl md:text-4xl font-bold text-white mb-4">
            Découvrez la Puissance
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">
              de votre Dashboard
            </span>
          </h2>
          <p className="text-zinc-400 text-base md:text-lg max-w-xl mx-auto">
            Toutes les fonctionnalités premium pour transformer chaque scan en opportunité.
          </p>
        </div>

        {/* Carousel Container */}
        <div 
          className="relative max-w-md mx-auto"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Dashboard Frame */}
          <div className="relative rounded-3xl bg-gradient-to-br from-gray-900/95 to-black border border-amber-500/30 p-6 shadow-2xl shadow-amber-500/10">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center">
                  <CurrentIcon className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{slides[currentSlide].title}</h3>
                  <p className="text-gray-500 text-xs">{slides[currentSlide].subtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="px-2 py-0.5 text-xs bg-amber-500/20 text-amber-400 rounded-full border border-amber-500/30">
                  PRO
                </span>
              </div>
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {slides[currentSlide].content}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows */}
          <button 
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 w-10 h-10 rounded-full bg-black/80 border border-amber-500/30 flex items-center justify-center text-amber-400 hover:bg-amber-500/20 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 w-10 h-10 rounded-full bg-black/80 border border-amber-500/30 flex items-center justify-center text-amber-400 hover:bg-amber-500/20 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center gap-2 mt-6">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              onClick={() => goToSlide(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentSlide 
                  ? 'w-8 bg-amber-400' 
                  : 'w-2 bg-gray-600 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>

        {/* Proof Badge */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-green-400">Interface réelle • Clients actifs</span>
          </div>
        </div>
      </div>
    </section>
  );
}
