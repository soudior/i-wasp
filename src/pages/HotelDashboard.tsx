import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Smartphone, 
  Eye, 
  MousePointer, 
  TrendingUp,
  Wifi,
  Phone,
  MapPin,
  Star,
  Gift,
  Apple,
  Tablet
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: string;
  delay?: number;
}

const StatCard = ({ title, value, subtitle, icon, trend, delay = 0 }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="card-glass p-6 rounded-2xl"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="w-10 h-10 rounded-xl glass-strong flex items-center justify-center">
        {icon}
      </div>
      {trend && (
        <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-medium">
          {trend}
        </span>
      )}
    </div>
    <div className="space-y-1">
      <p className="text-4xl font-bold text-foreground tracking-tight">{value}</p>
      <p className="text-sm text-muted-foreground">{title}</p>
      {subtitle && (
        <p className="text-xs text-muted-foreground/60">{subtitle}</p>
      )}
    </div>
  </motion.div>
);

interface ActionStatProps {
  icon: React.ReactNode;
  label: string;
  count: number;
  percentage: number;
  color: string;
  delay?: number;
}

const ActionStat = ({ icon, label, count, percentage, color, delay = 0 }: ActionStatProps) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4, delay }}
    className="flex items-center gap-4 p-4 rounded-xl glass hover:glass-strong transition-all duration-300"
  >
    <div 
      className="w-10 h-10 rounded-xl flex items-center justify-center"
      style={{ backgroundColor: `${color}20` }}
    >
      <div style={{ color }}>{icon}</div>
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-foreground truncate">{label}</p>
      <p className="text-xs text-muted-foreground">{count} clics</p>
    </div>
    <div className="text-right">
      <p className="text-lg font-bold text-foreground">{percentage}%</p>
    </div>
    <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.8, delay: delay + 0.3 }}
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  </motion.div>
);

interface DeviceStatProps {
  icon: React.ReactNode;
  label: string;
  percentage: number;
  count: number;
}

const DeviceStat = ({ icon, label, percentage, count }: DeviceStatProps) => (
  <div className="flex items-center gap-3 p-3 rounded-xl glass">
    <div className="w-8 h-8 rounded-lg bg-foreground/10 flex items-center justify-center">
      {icon}
    </div>
    <div className="flex-1">
      <p className="text-sm font-medium text-foreground">{label}</p>
      <p className="text-xs text-muted-foreground">{count} appareils</p>
    </div>
    <p className="text-xl font-bold text-foreground">{percentage}%</p>
  </div>
);

type TimeRange = "today" | "7days" | "30days";

const HotelDashboard = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>("7days");

  // Mock data - À remplacer par les vraies données Supabase
  const stats = {
    today: {
      scans: 47,
      uniqueVisitors: 38,
      actionsClicked: 124,
      conversionRate: 82,
    },
    "7days": {
      scans: 312,
      uniqueVisitors: 256,
      actionsClicked: 847,
      conversionRate: 78,
    },
    "30days": {
      scans: 1243,
      uniqueVisitors: 978,
      actionsClicked: 3412,
      conversionRate: 75,
    },
  };

  const currentStats = stats[timeRange];

  const actionStats = [
    { icon: <Wifi className="w-5 h-5" />, label: "WiFi", count: 234, percentage: 38, color: "#3B82F6" },
    { icon: <Phone className="w-5 h-5" />, label: "Réception", count: 156, percentage: 25, color: "#10B981" },
    { icon: <MapPin className="w-5 h-5" />, label: "Maps / Waze", count: 98, percentage: 16, color: "#F59E0B" },
    { icon: <Star className="w-5 h-5" />, label: "Avis Google", count: 87, percentage: 14, color: "#EF4444" },
    { icon: <Gift className="w-5 h-5" />, label: "Offres du jour", count: 45, percentage: 7, color: "#8B5CF6" },
  ];

  const topAction = actionStats.reduce((prev, current) => 
    (prev.count > current.count) ? prev : current
  );

  const deviceStats = {
    ios: { percentage: 62, count: 159 },
    android: { percentage: 38, count: 97 },
  };

  const timeRangeLabels: Record<TimeRange, string> = {
    today: "Aujourd'hui",
    "7days": "7 jours",
    "30days": "30 jours",
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="orb w-[600px] h-[600px] -top-40 -right-40 opacity-30" />
        <div className="orb w-[400px] h-[400px] bottom-20 -left-20 opacity-20" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Dashboard Hôtel
          </h1>
          <p className="text-muted-foreground">
            Statistiques NFC en temps réel
          </p>
        </motion.div>

        {/* Time Range Selector */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex gap-2 mb-8"
        >
          {(Object.keys(timeRangeLabels) as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                timeRange === range
                  ? "glass-strong text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:glass"
              }`}
            >
              {timeRangeLabels[range]}
            </button>
          ))}
        </motion.div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Scans"
            value={currentStats.scans.toLocaleString()}
            icon={<Smartphone className="w-5 h-5 text-foreground" />}
            trend="+12%"
            delay={0.1}
          />
          <StatCard
            title="Visiteurs uniques"
            value={currentStats.uniqueVisitors.toLocaleString()}
            icon={<Eye className="w-5 h-5 text-foreground" />}
            trend="+8%"
            delay={0.15}
          />
          <StatCard
            title="Actions cliquées"
            value={currentStats.actionsClicked.toLocaleString()}
            icon={<MousePointer className="w-5 h-5 text-foreground" />}
            delay={0.2}
          />
          <StatCard
            title="Taux conversion"
            value={`${currentStats.conversionRate}%`}
            subtitle="Scan → Action"
            icon={<TrendingUp className="w-5 h-5 text-foreground" />}
            delay={0.25}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Actions Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2 card-glass p-6 rounded-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Actions cliquées</h2>
                <p className="text-sm text-muted-foreground">Répartition par type</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-medium text-emerald-400">
                  Top: {topAction.label}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              {actionStats.map((action, index) => (
                <ActionStat
                  key={action.label}
                  {...action}
                  delay={0.4 + index * 0.1}
                />
              ))}
            </div>
          </motion.div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Devices */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="card-glass p-6 rounded-2xl"
            >
              <h2 className="text-lg font-semibold text-foreground mb-4">Appareils</h2>
              <div className="space-y-3">
                <DeviceStat
                  icon={<Apple className="w-4 h-4 text-foreground" />}
                  label="iOS"
                  percentage={deviceStats.ios.percentage}
                  count={deviceStats.ios.count}
                />
                <DeviceStat
                  icon={<Tablet className="w-4 h-4 text-foreground" />}
                  label="Android"
                  percentage={deviceStats.android.percentage}
                  count={deviceStats.android.count}
                />
              </div>
            </motion.div>

            {/* Quick Insights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="card-glass p-6 rounded-2xl"
            >
              <h2 className="text-lg font-semibold text-foreground mb-4">Insights</h2>
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <p className="text-sm text-blue-400 font-medium">💡 WiFi en tête</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    38% des visiteurs accèdent au WiFi via NFC
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-sm text-emerald-400 font-medium">⭐ Avis Google</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    +23 avis ce mois via la carte NFC
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDashboard;
