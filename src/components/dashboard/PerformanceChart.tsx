/**
 * Performance Chart - Scan analytics per card
 * Interactive charts with Glassmorphism design
 */

import { useMemo } from "react";
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
import { TrendingUp, Eye, Zap, Users } from "lucide-react";
import type { ScanWithCard } from "@/hooks/useScans";
import type { LeadWithCard } from "@/hooks/useLeads";

interface PerformanceChartProps {
  scans: ScanWithCard[];
  leads: LeadWithCard[];
  cards: any[];
}

export function PerformanceChart({ scans, leads, cards }: PerformanceChartProps) {
  // Generate chart data for last 14 days
  const chartData = useMemo(() => {
    const endDate = new Date();
    const startDate = subDays(endDate, 13);
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return days.map(day => {
      const dayStr = format(day, "yyyy-MM-dd");
      const dayScans = scans.filter(s => format(new Date(s.scanned_at), "yyyy-MM-dd") === dayStr);
      const dayLeads = leads.filter(l => format(new Date(l.created_at), "yyyy-MM-dd") === dayStr);

      return {
        date: format(day, "dd MMM", { locale: fr }),
        fullDate: dayStr,
        scans: dayScans.length,
        leads: dayLeads.length,
      };
    });
  }, [scans, leads]);

  // Calculate totals and trends
  const stats = useMemo(() => {
    const now = new Date();
    const oneWeekAgo = subDays(now, 7);
    const twoWeeksAgo = subDays(now, 14);

    const thisWeekScans = scans.filter(s => new Date(s.scanned_at) >= oneWeekAgo).length;
    const lastWeekScans = scans.filter(s => {
      const date = new Date(s.scanned_at);
      return date >= twoWeeksAgo && date < oneWeekAgo;
    }).length;

    const scansTrend = lastWeekScans > 0 
      ? Math.round(((thisWeekScans - lastWeekScans) / lastWeekScans) * 100)
      : thisWeekScans > 0 ? 100 : 0;

    const totalViews = cards.reduce((acc, c) => acc + (c.view_count || 0), 0);
    const conversionRate = totalViews > 0 ? ((leads.length / totalViews) * 100).toFixed(1) : "0";

    return {
      totalScans: scans.length,
      thisWeekScans,
      scansTrend,
      totalViews,
      conversionRate,
      avgScansPerDay: (thisWeekScans / 7).toFixed(1),
    };
  }, [scans, leads, cards]);

  // Top performing cards
  const topCards = useMemo(() => {
    const cardScans: Record<string, { card: any; count: number }> = {};
    
    scans.forEach(scan => {
      if (!cardScans[scan.card_id]) {
        const card = cards.find(c => c.id === scan.card_id);
        if (card) {
          cardScans[scan.card_id] = { card, count: 0 };
        }
      }
      if (cardScans[scan.card_id]) {
        cardScans[scan.card_id].count++;
      }
    });

    return Object.values(cardScans)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  }, [scans, cards]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-xl p-3 shadow-lg">
          <p className="text-xs font-medium text-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground capitalize">{entry.name}:</span>
              <span className="font-semibold text-foreground">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="card-glass border-border/50 backdrop-blur-xl overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Performance NFC</h3>
              <p className="text-xs text-muted-foreground">14 derniers jours</p>
            </div>
          </div>
          {stats.scansTrend !== 0 && (
            <Badge 
              variant="secondary" 
              className={stats.scansTrend > 0 ? "text-emerald-500 bg-emerald-500/10" : "text-red-500 bg-red-500/10"}
            >
              {stats.scansTrend > 0 ? "+" : ""}{stats.scansTrend}%
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="p-5">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="p-3 rounded-xl bg-secondary/30 border border-border/30 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-lg font-bold text-foreground">{stats.thisWeekScans}</span>
            </div>
            <p className="text-[10px] text-muted-foreground">Scans / semaine</p>
          </div>
          <div className="p-3 rounded-xl bg-secondary/30 border border-border/30 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Eye className="h-4 w-4 text-violet-500" />
              <span className="text-lg font-bold text-foreground">{stats.totalViews}</span>
            </div>
            <p className="text-[10px] text-muted-foreground">Vues totales</p>
          </div>
          <div className="p-3 rounded-xl bg-secondary/30 border border-border/30 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users className="h-4 w-4 text-emerald-500" />
              <span className="text-lg font-bold text-foreground">{stats.conversionRate}%</span>
            </div>
            <p className="text-[10px] text-muted-foreground">Conversion</p>
          </div>
        </div>

        {/* Chart */}
        <div className="h-[200px] mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="scansGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(220, 100%, 70%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(220, 100%, 70%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="leadsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(160, 100%, 50%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(160, 100%, 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 20%)" />
              <XAxis
                dataKey="date"
                stroke="hsl(0 0% 40%)"
                fontSize={10}
                tickLine={false}
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
                stroke="hsl(220, 100%, 70%)"
                strokeWidth={2}
                fill="url(#scansGradient)"
                name="Scans"
              />
              <Area
                type="monotone"
                dataKey="leads"
                stroke="hsl(160, 100%, 50%)"
                strokeWidth={2}
                fill="url(#leadsGradient)"
                name="Leads"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top Cards */}
        {topCards.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-3">
              Top cartes performantes
            </p>
            <div className="space-y-2">
              {topCards.map((item, index) => (
                <div 
                  key={item.card.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-secondary/20 border border-border/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {item.card.first_name} {item.card.last_name}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {item.card.title || item.card.company || "Carte personnelle"}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {item.count} scan{item.count > 1 ? "s" : ""}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
