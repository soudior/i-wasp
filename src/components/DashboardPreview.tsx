import { motion } from "framer-motion";
import { TrendingUp, Users, Eye, Download, Mail, Phone } from "lucide-react";

interface DashboardPreviewProps {
  variant?: "analytics" | "leads";
  className?: string;
}

export function DashboardPreview({ variant = "analytics", className = "" }: DashboardPreviewProps) {
  // Simulated chart data points
  const chartPoints = [30, 45, 35, 55, 40, 65, 50, 75, 60, 85, 70, 95];
  const maxValue = Math.max(...chartPoints);
  
  // Create SVG path from points
  const createPath = () => {
    const width = 280;
    const height = 80;
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

  // Simulated leads data
  const leads = [
    { name: "Sarah El Mansouri", email: "sarah.m@gmail.com", date: "Aujourd'hui", score: 95 },
    { name: "Karim Benali", email: "k.benali@hotel.ma", date: "Hier", score: 87 },
    { name: "Emma Dubois", email: "emma.d@airbnb.fr", date: "Il y a 2j", score: 72 },
  ];

  if (variant === "leads") {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className={`rounded-2xl bg-gradient-to-br from-gray-900/95 to-black border border-amber-500/30 p-5 shadow-2xl ${className}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-white font-semibold text-sm">Leads & CRM</span>
          </div>
          <span className="px-2 py-0.5 text-xs bg-amber-500/20 text-amber-400 rounded-full border border-amber-500/30">
            En direct
          </span>
        </div>

        {/* Leads Table */}
        <div className="space-y-2">
          {leads.map((lead, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500/30 to-amber-600/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-amber-400">{lead.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{lead.name}</p>
                  <p className="text-gray-500 text-xs">{lead.email}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-xs">{lead.date}</p>
                <div className="flex items-center gap-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${lead.score > 80 ? 'bg-green-400' : 'bg-amber-400'}`} />
                  <span className="text-xs text-gray-500">{lead.score}%</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Export Button */}
        <div className="mt-4 flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-amber-500/10 text-amber-400 text-xs border border-amber-500/30">
            <Mail className="w-3 h-3" />
            Contacter
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 text-gray-400 text-xs border border-white/10">
            <Download className="w-3 h-3" />
            Export Excel
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`rounded-2xl bg-gradient-to-br from-gray-900/95 to-black border border-amber-500/30 p-5 shadow-2xl ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-white font-semibold text-sm">Dashboard Gold</span>
        </div>
        <span className="px-2 py-0.5 text-xs bg-amber-500/20 text-amber-400 rounded-full border border-amber-500/30">
          PRO
        </span>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { icon: Eye, value: "2,847", label: "Scans", trend: "+18%" },
          { icon: Users, value: "156", label: "Leads", trend: "+24%" },
          { icon: TrendingUp, value: "43%", label: "Conversion", trend: "+5%" },
        ].map((stat, i) => (
          <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-1 mb-1">
              <stat.icon className="w-3 h-3 text-amber-400" />
              <span className="text-green-400 text-[10px]">{stat.trend}</span>
            </div>
            <p className="text-white font-bold text-sm">{stat.value}</p>
            <p className="text-gray-500 text-[10px]">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="p-3 rounded-xl bg-white/5 border border-white/10">
        <p className="text-gray-400 text-xs mb-2">Performance 30 jours</p>
        <svg viewBox="0 0 280 80" className="w-full h-16">
          {/* Gradient fill */}
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Area fill */}
          <path 
            d={`${createPath()} L 280 80 L 0 80 Z`}
            fill="url(#chartGradient)"
          />
          
          {/* Line */}
          <motion.path 
            d={createPath()}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          
          {/* Current point */}
          <motion.circle 
            cx="280" 
            cy={80 - (chartPoints[chartPoints.length - 1] / maxValue) * 80}
            r="4" 
            fill="#f59e0b"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.5 }}
          />
        </svg>
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between text-[10px]">
        <span className="text-gray-500">Dernière mise à jour: il y a 2 min</span>
        <span className="text-amber-400">Voir plus →</span>
      </div>
    </motion.div>
  );
}
