/**
 * Conversion Analytics Dashboard
 * Suivi des conversions Express Checkout et Web Studio
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AdminOmniaLayout } from '@/layouts/AdminOmniaLayout';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { format, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  ArrowLeft,
  TrendingUp,
  ShoppingCart,
  Eye,
  MousePointer,
  Globe,
  ArrowRight,
  RefreshCw,
  Calendar,
  DollarSign,
  Percent,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

// OMNIA Design System Colors
const OMNIA = {
  obsidienne: "#030303",
  obsidienneElevated: "#0A0A0A",
  obsidienneSurface: "#111111",
  champagne: "#DCC7B0",
  champagneMuted: "rgba(220, 199, 176, 0.6)",
  ivoire: "#FDFCFB",
  ivoireMuted: "rgba(253, 252, 251, 0.5)",
  border: "rgba(220, 199, 176, 0.15)",
  success: "#22C55E",
  info: "#3B82F6",
  purple: "#A855F7",
  pink: "#EC4899",
};

// Alias for backward compatibility
const COLORS = {
  primary: OMNIA.champagne,
  success: OMNIA.success,
  info: OMNIA.info,
  purple: OMNIA.purple,
  pink: OMNIA.pink,
  bg: OMNIA.obsidienne,
  text: OMNIA.ivoire,
  muted: OMNIA.ivoireMuted,
};

interface FunnelData {
  page_views: number;
  offer_selections: number;
  info_submissions: number;
  payment_initiations: number;
  purchases: number;
  webstudio_clicks: number;
  webstudio_offer_views: number;
}

interface DailyStats {
  day: string;
  page_views: number;
  purchases: number;
  webstudio_clicks: number;
  revenue: number;
}

interface OrderStats {
  total_orders: number;
  total_revenue: number;
  paid_orders: number;
  recent_orders: number;
}

function useFunnelData(days: number) {
  return useQuery({
    queryKey: ['funnelData', days],
    queryFn: async (): Promise<FunnelData> => {
      const { data, error } = await supabase.rpc('get_express_checkout_funnel', { p_days: days });
      if (error) throw error;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = data as any;
      return result || {
        page_views: 0,
        offer_selections: 0,
        info_submissions: 0,
        payment_initiations: 0,
        purchases: 0,
        webstudio_clicks: 0,
        webstudio_offer_views: 0,
      };
    },
    refetchInterval: 30000, // Refresh every 30s
  });
}

function useDailyStats(days: number) {
  return useQuery({
    queryKey: ['dailyStats', days],
    queryFn: async (): Promise<DailyStats[]> => {
      const { data, error } = await supabase.rpc('get_daily_analytics', { p_days: days });
      if (error) throw error;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (data as any) || [];
    },
    refetchInterval: 30000,
  });
}

function useOrderStats() {
  return useQuery({
    queryKey: ['orderStats'],
    queryFn: async (): Promise<OrderStats> => {
      const { data, error } = await supabase
        .from('orders')
        .select('status, total_price_cents, created_at')
        .gte('created_at', subDays(new Date(), 30).toISOString());
      
      if (error) throw error;

      const orders = data || [];
      return {
        total_orders: orders.length,
        total_revenue: orders.reduce((sum, o) => sum + (o.total_price_cents || 0), 0) / 100,
        paid_orders: orders.filter(o => o.status === 'paid').length,
        recent_orders: orders.filter(o => 
          new Date(o.created_at) > subDays(new Date(), 7)
        ).length,
      };
    },
    refetchInterval: 30000,
  });
}

function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  subtitle,
  trend,
}: { 
  title: string; 
  value: string | number; 
  icon: React.ElementType; 
  color: string;
  subtitle?: string;
  trend?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl p-4 border"
      style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderColor: `${color}30`,
      }}
    >
      <div className="flex items-start justify-between">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon size={20} style={{ color }} />
        </div>
        {trend !== undefined && (
          <Badge 
            className="text-xs"
            style={{ 
              backgroundColor: trend >= 0 ? `${COLORS.success}20` : `${COLORS.pink}20`,
              color: trend >= 0 ? COLORS.success : COLORS.pink,
            }}
          >
            {trend >= 0 ? '+' : ''}{trend}%
          </Badge>
        )}
      </div>
      <p 
        className="text-2xl font-bold mt-3"
        style={{ color: COLORS.text }}
      >
        {value}
      </p>
      <p 
        className="text-sm"
        style={{ color: COLORS.muted }}
      >
        {title}
      </p>
      {subtitle && (
        <p 
          className="text-xs mt-1"
          style={{ color }}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

function FunnelStep({ 
  label, 
  value, 
  percentage, 
  color,
  isLast = false,
}: { 
  label: string; 
  value: number; 
  percentage: number;
  color: string;
  isLast?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div 
        className="flex-1 rounded-lg p-3 border"
        style={{ 
          backgroundColor: `${color}10`,
          borderColor: `${color}30`,
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <span 
            className="text-sm font-medium"
            style={{ color: COLORS.text }}
          >
            {label}
          </span>
          <span 
            className="text-lg font-bold"
            style={{ color }}
          >
            {value}
          </span>
        </div>
        <div 
          className="h-2 rounded-full overflow-hidden"
          style={{ backgroundColor: `${color}20` }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
          />
        </div>
        <span 
          className="text-xs mt-1 block"
          style={{ color: COLORS.muted }}
        >
          {percentage.toFixed(1)}% du total
        </span>
      </div>
      {!isLast && (
        <ArrowRight 
          size={20} 
          style={{ color: COLORS.muted }}
          className="shrink-0"
        />
      )}
    </div>
  );
}

function ConversionDashboardContent() {
  const [selectedDays, setSelectedDays] = useState(7);
  const { data: funnel, isLoading: funnelLoading, refetch: refetchFunnel } = useFunnelData(selectedDays);
  const { data: dailyStats, isLoading: dailyLoading } = useDailyStats(selectedDays);
  const { data: orderStats, isLoading: ordersLoading } = useOrderStats();

  const isLoading = funnelLoading || dailyLoading || ordersLoading;

  // Calculate conversion rates
  const conversionRate = funnel && funnel.page_views > 0 
    ? ((funnel.purchases / funnel.page_views) * 100).toFixed(1)
    : '0';

  const offerToInfoRate = funnel && funnel.offer_selections > 0
    ? ((funnel.info_submissions / funnel.offer_selections) * 100).toFixed(1)
    : '0';

  const infoToPurchaseRate = funnel && funnel.info_submissions > 0
    ? ((funnel.purchases / funnel.info_submissions) * 100).toFixed(1)
    : '0';

  return (
    <div className="space-y-8">
      {/* Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div 
            className="flex rounded-xl overflow-hidden border" 
            style={{ 
              borderColor: OMNIA.border,
              backgroundColor: OMNIA.obsidienneElevated 
            }}
          >
            {[7, 14, 30].map((days) => (
              <button
                key={days}
                onClick={() => setSelectedDays(days)}
                className="px-4 py-2 text-sm font-medium transition-colors"
                style={{ 
                  backgroundColor: selectedDays === days ? OMNIA.champagne : 'transparent',
                  color: selectedDays === days ? OMNIA.obsidienne : OMNIA.ivoireMuted,
                }}
              >
                {days}j
              </button>
            ))}
          </div>
        </div>
        <Button
          onClick={() => refetchFunnel()}
          size="sm"
          className="gap-2"
          style={{ 
            backgroundColor: `${OMNIA.champagne}15`,
            borderColor: `${OMNIA.champagne}30`,
            color: OMNIA.champagne 
          }}
        >
          <RefreshCw size={14} />
          Actualiser
        </Button>
      </div>

      {/* Key Metrics */}
      <section>
          <h2 
            className="text-sm font-medium mb-4 flex items-center gap-2"
            style={{ color: COLORS.muted }}
          >
            <TrendingUp size={16} />
            Métriques clés • {selectedDays} derniers jours
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              title="Vues Express"
              value={funnel?.page_views || 0}
              icon={Eye}
              color={COLORS.info}
            />
            <StatCard
              title="Achats"
              value={funnel?.purchases || 0}
              icon={ShoppingCart}
              color={COLORS.success}
              subtitle={`Taux: ${conversionRate}%`}
            />
            <StatCard
              title="Clics Web Studio"
              value={funnel?.webstudio_clicks || 0}
              icon={Globe}
              color={COLORS.purple}
            />
            <StatCard
              title="Revenu total"
              value={`${(orderStats?.total_revenue || 0).toFixed(0)} MAD`}
              icon={DollarSign}
              color={COLORS.primary}
              subtitle={`${orderStats?.total_orders || 0} commandes`}
            />
          </div>
        </section>

        {/* Funnel Express Checkout */}
        <section>
          <h2 
            className="text-sm font-medium mb-4 flex items-center gap-2"
            style={{ color: COLORS.muted }}
          >
            <ShoppingCart size={16} />
            Tunnel Express Checkout
          </h2>
          <Card 
            className="border"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              borderColor: 'rgba(255, 255, 255, 0.1)',
            }}
          >
            <CardContent className="p-6">
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <RefreshCw className="animate-spin" style={{ color: COLORS.primary }} />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <FunnelStep
                    label="Page offres"
                    value={funnel?.page_views || 0}
                    percentage={100}
                    color={COLORS.info}
                  />
                  <FunnelStep
                    label="Offre sélectionnée"
                    value={funnel?.offer_selections || 0}
                    percentage={funnel?.page_views ? (funnel.offer_selections / funnel.page_views) * 100 : 0}
                    color={COLORS.purple}
                  />
                  <FunnelStep
                    label="Infos remplies"
                    value={funnel?.info_submissions || 0}
                    percentage={funnel?.page_views ? (funnel.info_submissions / funnel.page_views) * 100 : 0}
                    color={COLORS.pink}
                  />
                  <FunnelStep
                    label="Page paiement"
                    value={funnel?.payment_initiations || 0}
                    percentage={funnel?.page_views ? (funnel.payment_initiations / funnel.page_views) * 100 : 0}
                    color={COLORS.primary}
                  />
                  <FunnelStep
                    label="Achat finalisé"
                    value={funnel?.purchases || 0}
                    percentage={funnel?.page_views ? (funnel.purchases / funnel.page_views) * 100 : 0}
                    color={COLORS.success}
                    isLast
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Conversion Rates */}
        <section>
          <h2 
            className="text-sm font-medium mb-4 flex items-center gap-2"
            style={{ color: COLORS.muted }}
          >
            <Percent size={16} />
            Taux de conversion
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card 
              className="border"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
              }}
            >
              <CardContent className="p-4 text-center">
                <p 
                  className="text-3xl font-bold"
                  style={{ color: COLORS.info }}
                >
                  {conversionRate}%
                </p>
                <p 
                  className="text-sm mt-1"
                  style={{ color: COLORS.muted }}
                >
                  Vue → Achat
                </p>
              </CardContent>
            </Card>
            <Card 
              className="border"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
              }}
            >
              <CardContent className="p-4 text-center">
                <p 
                  className="text-3xl font-bold"
                  style={{ color: COLORS.purple }}
                >
                  {offerToInfoRate}%
                </p>
                <p 
                  className="text-sm mt-1"
                  style={{ color: COLORS.muted }}
                >
                  Offre → Infos
                </p>
              </CardContent>
            </Card>
            <Card 
              className="border"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
              }}
            >
              <CardContent className="p-4 text-center">
                <p 
                  className="text-3xl font-bold"
                  style={{ color: COLORS.success }}
                >
                  {infoToPurchaseRate}%
                </p>
                <p 
                  className="text-sm mt-1"
                  style={{ color: COLORS.muted }}
                >
                  Infos → Achat
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Web Studio Stats */}
        <section>
          <h2 
            className="text-sm font-medium mb-4 flex items-center gap-2"
            style={{ color: COLORS.muted }}
          >
            <Globe size={16} />
            Web Studio IA
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard
              title="Clics CTA"
              value={funnel?.webstudio_clicks || 0}
              icon={MousePointer}
              color={COLORS.purple}
              subtitle="Landing + Produit"
            />
            <StatCard
              title="Vues page offres"
              value={funnel?.webstudio_offer_views || 0}
              icon={Eye}
              color={COLORS.info}
            />
            <StatCard
              title="Taux clic → vue"
              value={`${funnel && funnel.webstudio_clicks > 0 
                ? ((funnel.webstudio_offer_views / funnel.webstudio_clicks) * 100).toFixed(1) 
                : 0}%`}
              icon={Percent}
              color={COLORS.primary}
            />
          </div>
        </section>

        {/* Daily Activity */}
        {dailyStats && dailyStats.length > 0 && (
          <section>
            <h2 
              className="text-sm font-medium mb-4 flex items-center gap-2"
              style={{ color: COLORS.muted }}
            >
              <Calendar size={16} />
              Activité journalière
            </h2>
            <Card 
              className="border overflow-hidden"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
              }}
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: COLORS.muted }}>Date</th>
                      <th className="px-4 py-3 text-right text-xs font-medium" style={{ color: COLORS.muted }}>Vues</th>
                      <th className="px-4 py-3 text-right text-xs font-medium" style={{ color: COLORS.muted }}>Achats</th>
                      <th className="px-4 py-3 text-right text-xs font-medium" style={{ color: COLORS.muted }}>Web Studio</th>
                      <th className="px-4 py-3 text-right text-xs font-medium" style={{ color: COLORS.muted }}>Revenu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailyStats.map((day) => (
                      <tr 
                        key={day.day}
                        className="border-b last:border-0"
                        style={{ borderColor: 'rgba(255,255,255,0.05)' }}
                      >
                        <td className="px-4 py-3 text-sm" style={{ color: COLORS.text }}>
                          {format(new Date(day.day), 'dd MMM', { locale: fr })}
                        </td>
                        <td className="px-4 py-3 text-right text-sm" style={{ color: COLORS.info }}>
                          {day.page_views}
                        </td>
                        <td className="px-4 py-3 text-right text-sm" style={{ color: COLORS.success }}>
                          {day.purchases}
                        </td>
                        <td className="px-4 py-3 text-right text-sm" style={{ color: COLORS.purple }}>
                          {day.webstudio_clicks}
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-medium" style={{ color: COLORS.primary }}>
                          {day.revenue.toFixed(0)} MAD
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </section>
        )}
      </div>
    );
}

export default function ConversionDashboard() {
  return (
    <AdminOmniaLayout title="Analytics & Conversions" subtitle="Suivi des performances">
      <ConversionDashboardContent />
    </AdminOmniaLayout>
  );
}
