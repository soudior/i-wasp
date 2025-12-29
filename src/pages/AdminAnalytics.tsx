import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useIsAdmin } from "@/hooks/useAdmin";
import { useAdminAnalytics, exportAnalyticsCSV } from "@/hooks/useAdminAnalytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Loader2,
  Shield,
  TrendingUp,
  Users,
  CreditCard,
  Zap,
  Download,
  Flame,
  Thermometer,
  Snowflake,
  BarChart3,
  Activity,
  Package,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
} from "lucide-react";
import { subDays, format } from "date-fns";
import { fr } from "date-fns/locale";
import { formatPrice } from "@/lib/pricing";

const CHART_COLORS = {
  primary: "hsl(220, 100%, 70%)",
  secondary: "hsl(280, 100%, 70%)",
  tertiary: "hsl(160, 100%, 50%)",
  hot: "hsl(0, 85%, 60%)",
  warm: "hsl(35, 100%, 55%)",
  cold: "hsl(210, 100%, 60%)",
};

export default function AdminAnalytics() {
  const navigate = useNavigate();
  const { data: isAdmin, isLoading: checkingAdmin } = useIsAdmin();
  const [dateRangeKey, setDateRangeKey] = useState("30");

  const dateRange = useMemo(() => {
    const days = parseInt(dateRangeKey);
    return {
      start: subDays(new Date(), days),
      end: new Date(),
    };
  }, [dateRangeKey]);

  const { data: analytics, isLoading: loadingAnalytics } = useAdminAnalytics(dateRange);

  if (checkingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <Shield className="h-16 w-16 text-muted-foreground" />
        <h1 className="text-2xl font-bold">Accès refusé</h1>
        <p className="text-muted-foreground">
          Vous n'avez pas les droits d'administration.
        </p>
        <Button onClick={() => navigate("/dashboard")}>
          Retour au tableau de bord
        </Button>
      </div>
    );
  }

  const handleExportCSV = () => {
    if (analytics) {
      exportAnalyticsCSV(analytics, dateRange);
    }
  };

  // Lead temperature data for pie chart
  const leadTemperatureData = analytics ? [
    { name: "Hot", value: analytics.hotLeads, color: CHART_COLORS.hot },
    { name: "Warm", value: analytics.warmLeads, color: CHART_COLORS.warm },
    { name: "Cold", value: analytics.coldLeads, color: CHART_COLORS.cold },
  ] : [];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-20 left-1/4 w-[600px] h-[600px] orb opacity-15 animate-pulse-glow" />
      <div className="absolute bottom-40 right-1/4 w-[400px] h-[400px] orb opacity-10" />
      <div className="noise" />

      <main className="relative z-10 py-8">
        <div className="container max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 animate-fade-up">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                Business Analytics
              </h1>
              <p className="text-muted-foreground mt-2">
                Vue d'ensemble de la performance IWASP
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={dateRangeKey} onValueChange={setDateRangeKey}>
                <SelectTrigger className="w-[180px] bg-secondary/50 border-border/50">
                  <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 derniers jours</SelectItem>
                  <SelectItem value="14">14 derniers jours</SelectItem>
                  <SelectItem value="30">30 derniers jours</SelectItem>
                  <SelectItem value="90">3 derniers mois</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={handleExportCSV}
                disabled={!analytics}
                className="gap-2"
              >
                <Download size={16} />
                Export CSV
              </Button>
            </div>
          </div>

          {loadingAnalytics ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : analytics ? (
            <>
              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  {
                    label: "Scans NFC",
                    value: analytics.totalScans.toLocaleString(),
                    icon: Zap,
                    trend: "+12%",
                    trendUp: true,
                    gradient: "from-blue-500/20 to-blue-500/5",
                  },
                  {
                    label: "Leads générés",
                    value: analytics.totalLeads.toLocaleString(),
                    icon: Users,
                    trend: `${analytics.conversionRate.toFixed(1)}%`,
                    trendUp: true,
                    subtitle: "conversion",
                    gradient: "from-purple-500/20 to-purple-500/5",
                  },
                  {
                    label: "Commandes",
                    value: analytics.totalOrders.toLocaleString(),
                    icon: Package,
                    trend: null,
                    gradient: "from-green-500/20 to-green-500/5",
                  },
                  {
                    label: "Revenu",
                    value: formatPrice(analytics.totalRevenue),
                    icon: DollarSign,
                    trend: null,
                    gradient: "from-amber-500/20 to-amber-500/5",
                  },
                ].map((metric, index) => (
                  <Card
                    key={metric.label}
                    className="card-glass border-border/50 backdrop-blur-xl overflow-hidden animate-fade-up"
                    style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${metric.gradient} flex items-center justify-center`}>
                          <metric.icon size={20} className="text-foreground" />
                        </div>
                        {metric.trend && (
                          <Badge
                            variant="secondary"
                            className={`text-xs ${metric.trendUp ? "text-green-400" : "text-red-400"}`}
                          >
                            {metric.trendUp ? (
                              <ArrowUpRight size={12} className="mr-0.5" />
                            ) : (
                              <ArrowDownRight size={12} className="mr-0.5" />
                            )}
                            {metric.trend}
                          </Badge>
                        )}
                      </div>
                      <p className="font-display text-2xl md:text-3xl font-bold text-foreground">
                        {metric.value}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {metric.label}
                        {metric.subtitle && (
                          <span className="text-xs ml-1">({metric.subtitle})</span>
                        )}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Charts Row */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Scans & Leads Chart */}
                <Card className="card-glass border-border/50 backdrop-blur-xl animate-fade-up" style={{ animationDelay: "0.2s" }}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Activity size={18} className="text-primary" />
                      Scans & Leads
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[280px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={analytics.dailyScans.map((s, i) => ({
                          date: s.date,
                          scans: s.count,
                          leads: analytics.dailyLeads[i]?.count || 0,
                        }))}>
                          <defs>
                            <linearGradient id="scansGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.3} />
                              <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="leadsGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={CHART_COLORS.secondary} stopOpacity={0.3} />
                              <stop offset="95%" stopColor={CHART_COLORS.secondary} stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 20%)" />
                          <XAxis
                            dataKey="date"
                            stroke="hsl(0 0% 40%)"
                            fontSize={11}
                            tickLine={false}
                          />
                          <YAxis
                            stroke="hsl(0 0% 40%)"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                          />
                          <ChartTooltip
                            content={<ChartTooltipContent />}
                            cursor={{ stroke: "hsl(0 0% 30%)" }}
                          />
                          <Area
                            type="monotone"
                            dataKey="scans"
                            stroke={CHART_COLORS.primary}
                            strokeWidth={2}
                            fill="url(#scansGradient)"
                            name="Scans"
                          />
                          <Area
                            type="monotone"
                            dataKey="leads"
                            stroke={CHART_COLORS.secondary}
                            strokeWidth={2}
                            fill="url(#leadsGradient)"
                            name="Leads"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Lead Temperature Distribution */}
                <Card className="card-glass border-border/50 backdrop-blur-xl animate-fade-up" style={{ animationDelay: "0.25s" }}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Thermometer size={18} className="text-primary" />
                      Température des leads
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[280px] flex items-center">
                      <div className="w-1/2">
                        <ResponsiveContainer width="100%" height={200}>
                          <PieChart>
                            <Pie
                              data={leadTemperatureData}
                              cx="50%"
                              cy="50%"
                              innerRadius={50}
                              outerRadius={80}
                              paddingAngle={4}
                              dataKey="value"
                            >
                              {leadTemperatureData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="w-1/2 space-y-4">
                        {[
                          { label: "Hot", count: analytics.hotLeads, icon: Flame, color: "text-red-400", bg: "bg-red-500/20" },
                          { label: "Warm", count: analytics.warmLeads, icon: Thermometer, color: "text-orange-400", bg: "bg-orange-500/20" },
                          { label: "Cold", count: analytics.coldLeads, icon: Snowflake, color: "text-blue-400", bg: "bg-blue-500/20" },
                        ].map((item) => (
                          <div key={item.label} className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center`}>
                              <item.icon size={16} className={item.color} />
                            </div>
                            <div>
                              <p className={`font-semibold ${item.color}`}>{item.count}</p>
                              <p className="text-xs text-muted-foreground">{item.label}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Second Row */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {/* Revenue Chart */}
                <Card className="md:col-span-2 card-glass border-border/50 backdrop-blur-xl animate-fade-up" style={{ animationDelay: "0.3s" }}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <DollarSign size={18} className="text-primary" />
                      Revenu journalier
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[240px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analytics.dailyRevenue}>
                          <defs>
                            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={CHART_COLORS.tertiary} stopOpacity={0.8} />
                              <stop offset="95%" stopColor={CHART_COLORS.tertiary} stopOpacity={0.2} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 20%)" />
                          <XAxis
                            dataKey="date"
                            stroke="hsl(0 0% 40%)"
                            fontSize={11}
                            tickLine={false}
                          />
                          <YAxis
                            stroke="hsl(0 0% 40%)"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(v) => `${v}€`}
                          />
                          <ChartTooltip
                            content={<ChartTooltipContent />}
                            cursor={{ fill: "hsl(0 0% 15%)" }}
                          />
                          <Bar
                            dataKey="amount"
                            fill="url(#revenueGradient)"
                            radius={[4, 4, 0, 0]}
                            name="Revenu"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="card-glass border-border/50 backdrop-blur-xl animate-fade-up" style={{ animationDelay: "0.35s" }}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Clock size={18} className="text-primary" />
                      Activité récente
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-[240px] overflow-y-auto">
                      {analytics.recentActivity.length > 0 ? (
                        analytics.recentActivity.map((activity, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-2 rounded-lg hover:bg-secondary/30 transition-colors"
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                              activity.type === "scan" ? "bg-blue-500/20" :
                              activity.type === "lead" ? "bg-purple-500/20" :
                              "bg-green-500/20"
                            }`}>
                              {activity.type === "scan" ? (
                                <Zap size={14} className="text-blue-400" />
                              ) : activity.type === "lead" ? (
                                <Users size={14} className="text-purple-400" />
                              ) : (
                                <Package size={14} className="text-green-400" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm text-foreground truncate">
                                {activity.description}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {format(new Date(activity.timestamp), "dd/MM HH:mm", { locale: fr })}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          Aucune activité récente
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Tables */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Top Templates */}
                <Card className="card-glass border-border/50 backdrop-blur-xl animate-fade-up" style={{ animationDelay: "0.4s" }}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <CreditCard size={18} className="text-primary" />
                      Performance par template
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analytics.templatePerformance.length > 0 ? (
                        analytics.templatePerformance.slice(0, 5).map((template, index) => (
                          <div
                            key={template.template}
                            className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                                {index + 1}
                              </div>
                              <span className="font-medium text-foreground capitalize">
                                {template.template.replace(/-/g, " ")}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                              <div className="text-right">
                                <p className="font-semibold text-foreground">{template.scans}</p>
                                <p className="text-xs text-muted-foreground">scans</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-foreground">{template.leads}</p>
                                <p className="text-xs text-muted-foreground">leads</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          Aucune donnée disponible
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Top Cards */}
                <Card className="card-glass border-border/50 backdrop-blur-xl animate-fade-up" style={{ animationDelay: "0.45s" }}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <TrendingUp size={18} className="text-primary" />
                      Cartes les plus performantes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analytics.topCards.length > 0 ? (
                        analytics.topCards.map((card, index) => (
                          <div
                            key={card.id}
                            className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                                index === 0 ? "bg-amber-500/20 text-amber-400" :
                                index === 1 ? "bg-zinc-400/20 text-zinc-300" :
                                index === 2 ? "bg-orange-600/20 text-orange-400" :
                                "bg-primary/10 text-primary"
                              }`}>
                                {index + 1}
                              </div>
                              <span className="font-medium text-foreground">
                                {card.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                              <div className="text-right">
                                <p className="font-semibold text-foreground">{card.scans}</p>
                                <p className="text-xs text-muted-foreground">scans</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-foreground">{card.leads}</p>
                                <p className="text-xs text-muted-foreground">leads</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          Aucune carte disponible
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">Impossible de charger les données</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
