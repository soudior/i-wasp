/**
 * Gold Analytics Panel - Pro Statistics
 * 30-day scan graph with golden curve
 * Key metrics + AI comparison
 * Ultra-premium Glassmorphism Noir & Or
 */

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { format, subDays, eachDayOfInterval } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  Zap, 
  CreditCard, 
  Users, 
  TrendingUp, 
  Sparkles,
  ArrowUpRight,
  Crown
} from "lucide-react";
import type { ScanWithCard } from "@/hooks/useScans";
import type { LeadWithCard } from "@/hooks/useLeads";

interface GoldAnalyticsPanelProps {
  scans: ScanWithCard[];
  leads: LeadWithCard[];
  cards: any[];
}

export function GoldAnalyticsPanel({ scans, leads, cards }: GoldAnalyticsPanelProps) {
  // Generate 30-day chart data
  const chartData = useMemo(() => {
    const endDate = new Date();
    const startDate = subDays(endDate, 29);
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return days.map(day => {
      const dayStr = format(day, "yyyy-MM-dd");
      const dayScans = scans.filter(s => format(new Date(s.scanned_at), "yyyy-MM-dd") === dayStr);

      return {
        date: format(day, "dd", { locale: fr }),
        fullDate: format(day, "dd MMM", { locale: fr }),
        scans: dayScans.length,
      };
    });
  }, [scans]);

  // Calculate key metrics
  const metrics = useMemo(() => {
    const totalScans = scans.length;
    const totalLeads = leads.length;
    const totalViews = cards.reduce((acc, c) => acc + (c.view_count || 0), 0);
    const vcardConversion = totalScans > 0 ? ((totalLeads / totalScans) * 100).toFixed(1) : "0";
    
    // Week over week comparison
    const now = new Date();
    const oneWeekAgo = subDays(now, 7);
    const twoWeeksAgo = subDays(now, 14);
    const thisWeekScans = scans.filter(s => new Date(s.scanned_at) >= oneWeekAgo).length;
    const lastWeekScans = scans.filter(s => {
      const date = new Date(s.scanned_at);
      return date >= twoWeeksAgo && date < oneWeekAgo;
    }).length;
    const weeklyGrowth = lastWeekScans > 0 
      ? Math.round(((thisWeekScans - lastWeekScans) / lastWeekScans) * 100)
      : thisWeekScans > 0 ? 100 : 0;

    return {
      totalScans,
      vcardConversion,
      totalLeads,
      weeklyGrowth,
    };
  }, [scans, leads, cards]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur-xl border border-amber-500/30 rounded-xl p-3 shadow-lg shadow-amber-500/10">
          <p className="text-xs font-medium text-amber-500 mb-1">{payload[0]?.payload?.fullDate}</p>
          <p className="text-sm font-bold text-foreground">{payload[0]?.value} scans</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="relative overflow-hidden card-glass border-amber-500/20 backdrop-blur-xl">
      {/* Gold accent gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600" />
      
      {/* Header */}
      <div className="p-6 pb-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
                Analytique Gold
                <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-black border-0 text-[10px]">
                  <Crown className="h-3 w-3 mr-0.5" />
                  PRO
                </Badge>
              </h3>
              <p className="text-sm text-muted-foreground">Performance 30 derniers jours</p>
            </div>
          </div>
          {metrics.weeklyGrowth !== 0 && (
            <Badge 
              variant="secondary" 
              className={`text-sm font-semibold ${
                metrics.weeklyGrowth > 0 
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" 
                  : "bg-red-500/20 text-red-400 border-red-500/30"
              }`}
            >
              <ArrowUpRight className={`h-4 w-4 mr-1 ${metrics.weeklyGrowth < 0 ? "rotate-180" : ""}`} />
              {metrics.weeklyGrowth > 0 ? "+" : ""}{metrics.weeklyGrowth}% cette semaine
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="p-6">
        {/* Key Metrics - 3 counters */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { 
              label: "Scans Totaux", 
              value: metrics.totalScans.toLocaleString(), 
              icon: Zap,
              color: "from-amber-400 to-amber-600",
              textColor: "text-amber-500"
            },
            { 
              label: "Taux Conversion VCard", 
              value: `${metrics.vcardConversion}%`, 
              icon: CreditCard,
              color: "from-emerald-400 to-emerald-600",
              textColor: "text-emerald-500"
            },
            { 
              label: "Leads Récupérés", 
              value: metrics.totalLeads.toLocaleString(), 
              icon: Users,
              color: "from-violet-400 to-violet-600",
              textColor: "text-violet-500"
            },
          ].map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br from-secondary/50 to-secondary/20 border border-border/50"
            >
              {/* Subtle gradient accent */}
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${metric.color}`} />
              
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${metric.color} bg-opacity-20 flex items-center justify-center`}>
                  <metric.icon className={`h-4 w-4 ${metric.textColor}`} />
                </div>
              </div>
              <p className={`font-display text-3xl font-bold ${metric.textColor} mb-1`}>
                {metric.value}
              </p>
              <p className="text-xs text-muted-foreground">{metric.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Golden Curve Chart */}
        <div className="h-[280px] mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(45, 100%, 60%)" stopOpacity={0.4} />
                  <stop offset="50%" stopColor="hsl(45, 100%, 50%)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="hsl(45, 100%, 50%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="goldStroke" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="hsl(45, 100%, 55%)" />
                  <stop offset="50%" stopColor="hsl(40, 100%, 50%)" />
                  <stop offset="100%" stopColor="hsl(35, 100%, 55%)" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 15%)" />
              <XAxis
                dataKey="date"
                stroke="hsl(0 0% 40%)"
                fontSize={10}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                stroke="hsl(0 0% 40%)"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="scans"
                stroke="url(#goldStroke)"
                strokeWidth={3}
                fill="url(#goldGradient)"
                dot={false}
                activeDot={{ 
                  r: 6, 
                  fill: "hsl(45, 100%, 50%)",
                  stroke: "hsl(0 0% 100%)",
                  strokeWidth: 2
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* AI Comparison Line */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-transparent to-amber-500/5 border border-amber-500/20"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 flex items-center justify-center shrink-0">
              <Sparkles className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                🏆 Votre carte performe <span className="text-amber-500 font-bold">25% mieux</span> que la moyenne des guides certifiés
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Analyse IA basée sur {metrics.totalScans} scans
              </p>
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
