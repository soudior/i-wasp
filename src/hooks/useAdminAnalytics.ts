import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { startOfDay, endOfDay, subDays, format, eachDayOfInterval } from "date-fns";

export interface AnalyticsData {
  totalScans: number;
  totalLeads: number;
  totalOrders: number;
  totalRevenue: number;
  conversionRate: number;
  hotLeads: number;
  warmLeads: number;
  coldLeads: number;
  dailyScans: { date: string; count: number }[];
  dailyLeads: { date: string; count: number }[];
  dailyRevenue: { date: string; amount: number }[];
  templatePerformance: { template: string; scans: number; leads: number }[];
  topCards: { id: string; name: string; scans: number; leads: number }[];
  recentActivity: { type: string; description: string; timestamp: string }[];
}

export function useAdminAnalytics(dateRange: { start: Date; end: Date }) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["admin-analytics", user?.id, dateRange.start, dateRange.end],
    queryFn: async (): Promise<AnalyticsData> => {
      if (!user) throw new Error("Not authenticated");

      const startDate = startOfDay(dateRange.start).toISOString();
      const endDate = endOfDay(dateRange.end).toISOString();

      // Fetch all data in parallel
      const [scansResult, leadsResult, ordersResult, cardsResult] = await Promise.all([
        supabase
          .from("card_scans")
          .select("*, digital_cards!inner(user_id, template, first_name, last_name)")
          .gte("scanned_at", startDate)
          .lte("scanned_at", endDate),
        supabase
          .from("leads")
          .select("*, digital_cards!inner(user_id, template, first_name, last_name)")
          .gte("created_at", startDate)
          .lte("created_at", endDate),
        supabase
          .from("orders")
          .select("*")
          .eq("user_id", user.id)
          .gte("created_at", startDate)
          .lte("created_at", endDate),
        supabase
          .from("digital_cards")
          .select("id, first_name, last_name, template, view_count")
          .eq("user_id", user.id),
      ]);

      // Filter scans and leads for user's cards
      const userCardIds = new Set(cardsResult.data?.map(c => c.id) || []);
      const scans = (scansResult.data || []).filter(s => userCardIds.has(s.card_id));
      const leads = (leadsResult.data || []).filter(l => userCardIds.has(l.card_id));
      const orders = ordersResult.data || [];
      const cards = cardsResult.data || [];

      // Calculate totals
      const totalScans = scans.length;
      const totalLeads = leads.length;
      const totalOrders = orders.length;
      const totalRevenue = orders
        .filter(o => o.status === "delivered")
        .reduce((sum, o) => sum + (o.total_price_cents || 0), 0);
      const conversionRate = totalScans > 0 ? (totalLeads / totalScans) * 100 : 0;

      // Lead temperature breakdown
      const hotLeads = leads.filter(l => (l.lead_score || 0) >= 51).length;
      const warmLeads = leads.filter(l => (l.lead_score || 0) >= 21 && (l.lead_score || 0) <= 50).length;
      const coldLeads = leads.filter(l => (l.lead_score || 0) <= 20).length;

      // Generate daily data
      const days = eachDayOfInterval({ start: dateRange.start, end: dateRange.end });
      
      const dailyScans = days.map(day => {
        const dateStr = format(day, "yyyy-MM-dd");
        const count = scans.filter(s => 
          format(new Date(s.scanned_at), "yyyy-MM-dd") === dateStr
        ).length;
        return { date: format(day, "dd/MM"), count };
      });

      const dailyLeads = days.map(day => {
        const dateStr = format(day, "yyyy-MM-dd");
        const count = leads.filter(l => 
          format(new Date(l.created_at), "yyyy-MM-dd") === dateStr
        ).length;
        return { date: format(day, "dd/MM"), count };
      });

      const dailyRevenue = days.map(day => {
        const dateStr = format(day, "yyyy-MM-dd");
        const amount = orders
          .filter(o => 
            format(new Date(o.created_at), "yyyy-MM-dd") === dateStr &&
            o.status === "delivered"
          )
          .reduce((sum, o) => sum + (o.total_price_cents || 0), 0);
        return { date: format(day, "dd/MM"), amount: amount / 100 };
      });

      // Template performance
      const templateMap = new Map<string, { scans: number; leads: number }>();
      scans.forEach(s => {
        const template = (s.digital_cards as any)?.template || "default";
        const current = templateMap.get(template) || { scans: 0, leads: 0 };
        templateMap.set(template, { ...current, scans: current.scans + 1 });
      });
      leads.forEach(l => {
        const template = (l.digital_cards as any)?.template || "default";
        const current = templateMap.get(template) || { scans: 0, leads: 0 };
        templateMap.set(template, { ...current, leads: current.leads + 1 });
      });
      const templatePerformance = Array.from(templateMap.entries())
        .map(([template, data]) => ({ template, ...data }))
        .sort((a, b) => b.scans - a.scans);

      // Top performing cards
      const cardMap = new Map<string, { name: string; scans: number; leads: number }>();
      cards.forEach(c => {
        cardMap.set(c.id, { 
          name: `${c.first_name} ${c.last_name}`, 
          scans: 0, 
          leads: 0 
        });
      });
      scans.forEach(s => {
        const current = cardMap.get(s.card_id);
        if (current) {
          cardMap.set(s.card_id, { ...current, scans: current.scans + 1 });
        }
      });
      leads.forEach(l => {
        const current = cardMap.get(l.card_id);
        if (current) {
          cardMap.set(l.card_id, { ...current, leads: current.leads + 1 });
        }
      });
      const topCards = Array.from(cardMap.entries())
        .map(([id, data]) => ({ id, ...data }))
        .sort((a, b) => b.scans - a.scans)
        .slice(0, 5);

      // Recent activity
      const recentActivity: AnalyticsData["recentActivity"] = [
        ...scans.slice(-5).map(s => ({
          type: "scan",
          description: `NFC scan`,
          timestamp: s.scanned_at,
        })),
        ...leads.slice(-5).map(l => ({
          type: "lead",
          description: `Nouveau lead: ${l.name || "Anonyme"}`,
          timestamp: l.created_at,
        })),
        ...orders.slice(-5).map(o => ({
          type: "order",
          description: `Commande ${o.order_number}`,
          timestamp: o.created_at,
        })),
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
       .slice(0, 10);

      return {
        totalScans,
        totalLeads,
        totalOrders,
        totalRevenue,
        conversionRate,
        hotLeads,
        warmLeads,
        coldLeads,
        dailyScans,
        dailyLeads,
        dailyRevenue,
        templatePerformance,
        topCards,
        recentActivity,
      };
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Export analytics as CSV
export function exportAnalyticsCSV(data: AnalyticsData, dateRange: { start: Date; end: Date }) {
  const rows: string[][] = [
    ["IWASP Analytics Report"],
    [`Période: ${format(dateRange.start, "dd/MM/yyyy")} - ${format(dateRange.end, "dd/MM/yyyy")}`],
    [],
    ["Résumé"],
    ["Métrique", "Valeur"],
    ["Total Scans NFC", data.totalScans.toString()],
    ["Total Leads", data.totalLeads.toString()],
    ["Taux de conversion", `${data.conversionRate.toFixed(1)}%`],
    ["Commandes", data.totalOrders.toString()],
    ["Revenu Total", `${(data.totalRevenue / 100).toFixed(2)} €`],
    [],
    ["Leads par température"],
    ["Hot (51+)", data.hotLeads.toString()],
    ["Warm (21-50)", data.warmLeads.toString()],
    ["Cold (0-20)", data.coldLeads.toString()],
    [],
    ["Performance par template"],
    ["Template", "Scans", "Leads"],
    ...data.templatePerformance.map(t => [t.template, t.scans.toString(), t.leads.toString()]),
    [],
    ["Top Cartes"],
    ["Nom", "Scans", "Leads"],
    ...data.topCards.map(c => [c.name, c.scans.toString(), c.leads.toString()]),
    [],
    ["Scans journaliers"],
    ["Date", "Scans"],
    ...data.dailyScans.map(d => [d.date, d.count.toString()]),
    [],
    ["Leads journaliers"],
    ["Date", "Leads"],
    ...data.dailyLeads.map(d => [d.date, d.count.toString()]),
  ];

  const csvContent = rows.map(row => row.join(",")).join("\n");
  const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `iwasp-analytics-${format(new Date(), "yyyy-MM-dd")}.csv`;
  link.click();
}
