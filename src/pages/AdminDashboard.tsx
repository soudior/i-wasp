/**
 * Admin Dashboard - OMNIA COMMAND CENTER
 * Tableau de bord ultra-luxe avec design system OMNIA
 * Obsidienne, Champagne, Ivoire - L'Art de la Présence
 */

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Zap,
  Printer,
  CreditCard,
  Package,
  Users,
  FileImage,
  Settings,
  TrendingUp,
  Clock,
  CheckCircle2,
  Truck,
  Globe,
  BarChart3,
  Plus,
  Search,
  RefreshCw,
  ChevronRight,
  Sparkles,
  Crown,
  Activity,
  DollarSign,
  Target,
  Gauge,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { GlobalSearchModal } from "@/components/admin/GlobalSearchModal";
import { PushNotificationsWidget } from "@/components/admin/PushNotificationsWidget";
import { AllClientsWidget } from "@/components/admin/AllClientsWidget";
import { ClientDataExportImport } from "@/components/admin/ClientDataExportImport";
import { ClientRemindersWidget } from "@/components/admin/ClientRemindersWidget";
import { TagReminderRulesWidget } from "@/components/admin/TagReminderRulesWidget";
import { SerialCodesWidget } from "@/components/admin/SerialCodesWidget";
import { AdminOmniaLayout } from "@/layouts/AdminOmniaLayout";

// ═══════════════════════════════════════════════════════════════════════════
// OMNIA PALETTE - Obsidienne, Champagne, Ivoire
// ═══════════════════════════════════════════════════════════════════════════
const OMNIA = {
  obsidienne: '#030303',
  obsidienneSurface: '#0A0A0A',
  obsidienneElevated: '#111111',
  champagne: '#DCC7B0',
  champagneLight: '#E8D9C7',
  champagneMuted: 'rgba(220, 199, 176, 0.15)',
  champagneGlow: 'rgba(220, 199, 176, 0.08)',
  ivoire: '#FDFCFB',
  ivoireMuted: 'rgba(253, 252, 251, 0.6)',
  ivoireSubtle: 'rgba(253, 252, 251, 0.4)',
  border: 'rgba(255, 255, 255, 0.05)',
  borderActive: 'rgba(220, 199, 176, 0.2)',
  success: '#4ADE80',
  successMuted: 'rgba(74, 222, 128, 0.15)',
  info: '#60A5FA',
  infoMuted: 'rgba(96, 165, 250, 0.15)',
  warning: '#FBBF24',
  warningMuted: 'rgba(251, 191, 36, 0.15)',
  danger: '#F87171',
  dangerMuted: 'rgba(248, 113, 113, 0.15)',
  purple: '#A78BFA',
  purpleMuted: 'rgba(167, 139, 250, 0.15)',
  pink: '#F472B6',
  pinkMuted: 'rgba(244, 114, 182, 0.15)',
  cyan: '#22D3EE',
  cyanMuted: 'rgba(34, 211, 238, 0.15)',
};

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  path: string;
  color: string;
  colorMuted: string;
  shortcut?: string;
}

const quickActions: QuickAction[] = [
  {
    id: 'instant',
    title: "Création vCard",
    description: "Créer instantanément",
    icon: Zap,
    path: "/admin/instant",
    color: OMNIA.champagne,
    colorMuted: OMNIA.champagneMuted,
    shortcut: "C",
  },
  {
    id: 'evolis',
    title: "Impression Evolis",
    description: "Générer PDF carte",
    icon: Printer,
    path: "/admin/evolis",
    color: OMNIA.success,
    colorMuted: OMNIA.successMuted,
    shortcut: "P",
  },
  {
    id: 'webstudio',
    title: "Web Studio",
    description: "Sites web IA",
    icon: Globe,
    path: "/admin/webstudio",
    color: OMNIA.champagneLight,
    colorMuted: OMNIA.champagneMuted,
  },
  {
    id: 'analytics',
    title: "Analytics Live",
    description: "Conversions temps réel",
    icon: BarChart3,
    path: "/admin/analytics",
    color: OMNIA.info,
    colorMuted: OMNIA.infoMuted,
  },
  {
    id: 'creator',
    title: "Gestion Cartes",
    description: "Créer et gérer",
    icon: CreditCard,
    path: "/admin/creator",
    color: OMNIA.purple,
    colorMuted: OMNIA.purpleMuted,
  },
  {
    id: 'orders',
    title: "Commandes NFC",
    description: "Suivi commandes",
    icon: Package,
    path: "/admin/orders",
    color: OMNIA.pink,
    colorMuted: OMNIA.pinkMuted,
  },
  {
    id: 'clients',
    title: "Base Clients",
    description: "CRM complet",
    icon: Users,
    path: "/admin/clients",
    color: OMNIA.cyan,
    colorMuted: OMNIA.cyanMuted,
  },
  {
    id: 'brand',
    title: "Brand Assets",
    description: "Fichiers officiels",
    icon: FileImage,
    path: "/brand-assets",
    color: OMNIA.warning,
    colorMuted: OMNIA.warningMuted,
  },
];

// Hook for real-time stats
function useGlobalStats() {
  return useQuery({
    queryKey: ['globalStats'],
    queryFn: async () => {
      const [orders, cards, leads, users, subscriptions, proposals, contacts] = await Promise.all([
        supabase.from('orders').select('id, status, total_price_cents, created_at, payment_method'),
        supabase.from('digital_cards').select('id, created_at, view_count, is_active'),
        supabase.from('leads').select('id, created_at, status'),
        supabase.from('profiles').select('id, created_at'),
        supabase.from('subscriptions').select('id, status, plan'),
        supabase.from('website_proposals').select('id, status, created_at'),
        supabase.from('contact_requests').select('id, status, created_at'),
      ]);

      const ordersData = orders.data || [];
      const cardsData = cards.data || [];
      const leadsData = leads.data || [];
      const usersData = users.data || [];
      const subsData = subscriptions.data || [];
      const proposalsData = proposals.data || [];

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      return {
        orders: {
          total: ordersData.length,
          pending: ordersData.filter(o => o.status === 'pending').length,
          inProduction: ordersData.filter(o => o.status === 'in_production').length,
          shipped: ordersData.filter(o => o.status === 'shipped').length,
          delivered: ordersData.filter(o => o.status === 'delivered').length,
          today: ordersData.filter(o => new Date(o.created_at) >= today).length,
          revenue: ordersData.reduce((sum, o) => sum + (o.total_price_cents || 0), 0) / 100,
          revenueThisMonth: ordersData
            .filter(o => new Date(o.created_at) >= last30Days)
            .reduce((sum, o) => sum + (o.total_price_cents || 0), 0) / 100,
        },
        cards: {
          total: cardsData.length,
          active: cardsData.filter(c => c.is_active).length,
          totalViews: cardsData.reduce((sum, c) => sum + (c.view_count || 0), 0),
          recentCards: cardsData.filter(c => new Date(c.created_at) >= last7Days).length,
        },
        leads: {
          total: leadsData.length,
          new: leadsData.filter(l => l.status === 'new').length,
          recent: leadsData.filter(l => new Date(l.created_at) >= last7Days).length,
        },
        users: {
          total: usersData.length,
          recent: usersData.filter(u => new Date(u.created_at) >= last7Days).length,
        },
        subscriptions: {
          active: subsData.filter(s => s.status === 'active').length,
          premium: subsData.filter(s => s.plan === 'premium').length,
        },
        proposals: {
          total: proposalsData.length,
          pending: proposalsData.filter(p => p.status === 'pending').length,
          recent: proposalsData.filter(p => new Date(p.created_at) >= last7Days).length,
        },
      };
    },
    refetchInterval: 10000,
  });
}

// Hook for recent activity
function useRecentActivity() {
  return useQuery({
    queryKey: ['recentActivity'],
    queryFn: async () => {
      const [orders, cards, leads] = await Promise.all([
        supabase.from('orders').select('id, order_number, shipping_name, status, created_at, total_price_cents').order('created_at', { ascending: false }).limit(5),
        supabase.from('digital_cards').select('id, first_name, last_name, slug, created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('leads').select('id, name, email, created_at').order('created_at', { ascending: false }).limit(5),
      ]);

      const activities = [
        ...(orders.data || []).map(o => ({
          id: `order-${o.id}`,
          type: 'order' as const,
          title: `Commande #${o.order_number}`,
          subtitle: o.shipping_name || 'Client',
          amount: o.total_price_cents ? `${(o.total_price_cents / 100).toFixed(0)} MAD` : undefined,
          status: o.status,
          createdAt: new Date(o.created_at),
          icon: Package,
          color: OMNIA.champagne,
        })),
        ...(cards.data || []).map(c => ({
          id: `card-${c.id}`,
          type: 'card' as const,
          title: `Carte créée`,
          subtitle: `${c.first_name} ${c.last_name}`,
          slug: c.slug,
          createdAt: new Date(c.created_at),
          icon: CreditCard,
          color: OMNIA.purple,
        })),
        ...(leads.data || []).map(l => ({
          id: `lead-${l.id}`,
          type: 'lead' as const,
          title: `Nouveau lead`,
          subtitle: l.name || l.email || 'Inconnu',
          createdAt: new Date(l.created_at),
          icon: Users,
          color: OMNIA.cyan,
        })),
      ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 10);

      return activities;
    },
    refetchInterval: 15000,
  });
}

// OMNIA Stat Card Component
function OmniaStatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color,
  colorMuted,
  onClick,
  featured = false,
}: { 
  title: string; 
  value: string | number; 
  subtitle?: string;
  icon: React.ElementType; 
  color: string;
  colorMuted?: string;
  onClick?: () => void;
  featured?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: onClick ? 1.02 : 1, y: onClick ? -4 : 0 }}
      whileTap={{ scale: onClick ? 0.98 : 1 }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl p-5 transition-all duration-500 ${onClick ? 'cursor-pointer' : ''}`}
      style={{ 
        background: featured 
          ? `linear-gradient(145deg, ${OMNIA.obsidienneElevated} 0%, ${OMNIA.obsidienneSurface} 100%)`
          : OMNIA.obsidienneSurface,
        border: `1px solid ${featured ? OMNIA.borderActive : OMNIA.border}`,
        boxShadow: featured ? `0 8px 32px ${OMNIA.champagneGlow}` : 'none',
      }}
    >
      <div 
        className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-20 transition-opacity duration-500"
        style={{ backgroundColor: color }}
      />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ 
              background: colorMuted || `${color}15`,
              boxShadow: `0 4px 12px ${color}20`,
            }}
          >
            <Icon size={22} style={{ color }} />
          </div>
        </div>
        
        <p 
          className="text-xs font-medium uppercase tracking-[0.15em] mb-2"
          style={{ color: OMNIA.ivoireSubtle }}
        >
          {title}
        </p>
        
        <p 
          className="text-3xl font-light tracking-tight mb-1"
          style={{ 
            color: featured ? OMNIA.champagne : OMNIA.ivoire,
          }}
        >
          {value}
        </p>
        
        {subtitle && (
          <p className="text-xs" style={{ color: OMNIA.ivoireMuted }}>
            {subtitle}
          </p>
        )}
      </div>
    </motion.div>
  );
}

// Luxury Order Pipeline
function LuxuryOrderPipeline({ stats }: { stats: any }) {
  const navigate = useNavigate();
  const stages = [
    { label: 'En attente', count: stats?.orders?.pending || 0, color: OMNIA.warning, colorMuted: OMNIA.warningMuted, icon: Clock },
    { label: 'Production', count: stats?.orders?.inProduction || 0, color: OMNIA.info, colorMuted: OMNIA.infoMuted, icon: Settings },
    { label: 'Expédiées', count: stats?.orders?.shipped || 0, color: OMNIA.purple, colorMuted: OMNIA.purpleMuted, icon: Truck },
    { label: 'Livrées', count: stats?.orders?.delivered || 0, color: OMNIA.success, colorMuted: OMNIA.successMuted, icon: CheckCircle2 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      onClick={() => navigate('/admin/orders')}
      className="relative overflow-hidden rounded-2xl p-6 cursor-pointer transition-all duration-500"
      style={{ 
        background: `linear-gradient(145deg, ${OMNIA.obsidienneElevated} 0%, ${OMNIA.obsidienneSurface} 100%)`,
        border: `1px solid ${OMNIA.borderActive}`,
        boxShadow: `0 8px 32px ${OMNIA.champagneGlow}`,
      }}
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: OMNIA.champagneMuted }}
            >
              <Gauge size={20} style={{ color: OMNIA.champagne }} />
            </div>
            <div>
              <h3 
                className="text-sm font-semibold uppercase tracking-wider"
                style={{ color: OMNIA.ivoire }}
              >
                Pipeline Commandes
              </h3>
              <p className="text-xs" style={{ color: OMNIA.ivoireSubtle }}>
                Suivi en temps réel
              </p>
            </div>
          </div>
          <ChevronRight size={20} style={{ color: OMNIA.champagne }} />
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          {stages.map((stage, index) => (
            <motion.div 
              key={stage.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-4 rounded-xl transition-all duration-300 hover:scale-105"
              style={{ 
                backgroundColor: stage.colorMuted,
                border: `1px solid ${stage.color}20`,
              }}
            >
              <stage.icon size={18} className="mx-auto mb-2" style={{ color: stage.color }} />
              <p 
                className="text-2xl font-light tracking-tight"
                style={{ color: OMNIA.ivoire }}
              >
                {stage.count}
              </p>
              <p 
                className="text-[10px] uppercase tracking-widest mt-1"
                style={{ color: OMNIA.ivoireSubtle }}
              >
                {stage.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Quick Action Card
function QuickActionCard({ action, index }: { action: QuickAction; index: number }) {
  const navigate = useNavigate();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(action.path)}
      className="group relative overflow-hidden rounded-2xl p-5 cursor-pointer transition-all duration-500"
      style={{ 
        backgroundColor: OMNIA.obsidienneSurface,
        border: `1px solid ${OMNIA.border}`,
      }}
    >
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ 
          background: `linear-gradient(135deg, ${action.colorMuted} 0%, transparent 60%)`,
        }}
      />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div 
            className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
            style={{ 
              backgroundColor: action.colorMuted,
              boxShadow: `0 4px 12px ${action.color}20`,
            }}
          >
            <action.icon size={20} style={{ color: action.color }} />
          </div>
          {action.shortcut && (
            <kbd 
              className="hidden sm:flex items-center justify-center w-6 h-6 rounded text-xs font-mono"
              style={{ 
                backgroundColor: OMNIA.obsidienne, 
                color: OMNIA.ivoireSubtle, 
                border: `1px solid ${OMNIA.border}` 
              }}
            >
              {action.shortcut}
            </kbd>
          )}
        </div>
        
        <h3 
          className="font-semibold text-sm mb-1 transition-colors duration-300"
          style={{ color: OMNIA.ivoire }}
        >
          {action.title}
        </h3>
        <p className="text-xs" style={{ color: OMNIA.ivoireSubtle }}>
          {action.description}
        </p>
      </div>
    </motion.div>
  );
}

// Live Activity Feed Item
function LiveActivityItem({ activity }: { activity: any }) {
  const navigate = useNavigate();
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return OMNIA.warning;
      case 'paid': return OMNIA.success;
      case 'in_production': return OMNIA.info;
      case 'shipped': return OMNIA.purple;
      case 'delivered': return OMNIA.success;
      default: return OMNIA.ivoireSubtle;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 4, backgroundColor: OMNIA.obsidienneElevated }}
      className="flex items-center gap-4 p-4 rounded-xl transition-all duration-300 cursor-pointer"
      onClick={() => {
        if (activity.type === 'order') navigate('/admin/orders');
        if (activity.type === 'card') navigate('/admin/creator');
        if (activity.type === 'lead') navigate('/admin/clients');
      }}
    >
      <div 
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${activity.color}15` }}
      >
        <activity.icon size={16} style={{ color: activity.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" style={{ color: OMNIA.ivoire }}>
          {activity.title}
        </p>
        <p className="text-xs truncate" style={{ color: OMNIA.ivoireSubtle }}>
          {activity.subtitle}
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        {activity.amount && (
          <p className="text-sm font-semibold" style={{ color: OMNIA.champagne }}>
            {activity.amount}
          </p>
        )}
        {activity.status && (
          <span 
            className="text-[10px] px-2 py-0.5 rounded-full"
            style={{ 
              backgroundColor: `${getStatusColor(activity.status)}15`, 
              color: getStatusColor(activity.status) 
            }}
          >
            {activity.status}
          </span>
        )}
        <p className="text-[10px] mt-0.5" style={{ color: OMNIA.ivoireSubtle }}>
          {formatDistanceToNow(activity.createdAt, { addSuffix: true, locale: fr })}
        </p>
      </div>
    </motion.div>
  );
}

// Main Dashboard Component
export default function AdminDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [showSearch, setShowSearch] = useState(false);

  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useGlobalStats();
  const { data: activities, isLoading: activitiesLoading } = useRecentActivity();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        switch (e.key.toLowerCase()) {
          case 'k':
            e.preventDefault();
            setShowSearch(true);
            break;
          case 'c':
            e.preventDefault();
            navigate('/admin/instant');
            break;
          case 'p':
            e.preventDefault();
            navigate('/admin/evolis');
            break;
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  // Real-time subscription for new orders
  useEffect(() => {
    const channel = supabase
      .channel('admin-orders-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload) => {
          const newOrder = payload.new as any;
          
          if (audioRef.current) {
            audioRef.current.play().catch(() => {});
          }

          toast.success(
            `💰 Nouvelle commande #${newOrder.order_number}`,
            {
              description: `${newOrder.shipping_name || 'Client'} • ${((newOrder.total_price_cents || 0) / 100).toFixed(0)} MAD`,
              duration: 8000,
              action: {
                label: "Voir",
                onClick: () => navigate("/admin/orders")
              }
            }
          );

          queryClient.invalidateQueries({ queryKey: ["globalStats"] });
          queryClient.invalidateQueries({ queryKey: ["recentActivity"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [navigate, queryClient]);

  return (
    <AdminOmniaLayout title="Dashboard" subtitle="Centre de commande">
      {/* Notification sound */}
      <audio ref={audioRef} preload="auto">
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleOk7A5TJ1X1pq0sjOKLa0aFtNxUtnMvWoHRNJSCexMmqb2AnNqHEwJ5lVEc4m7qmkWdhUXOVr6iZbGpPaJOxqqiUe3Fqa46rrJ6Ji3xqbpWnoZ2HhXdmZZOknpyJg3FdYZaioJqIgG5aY5yinZeHfGlba56gmJODdWBWYqGglpOBb1ZWaqGel5J9Z09QbKWdlpN7Y0xMdaqckZJ4X0hFfq+bjpN0WkJBh7SZi491UzxAlrqXiI9vTDlGnr6UhY1oRDhMpcGSgopjQDlUpMSQgIdcPz1apsOPfYRWPUJppsSMeYFPQUpvq8aJdX1LQ1J1ssWGcXhIR1x8t8aDa3RHSml/usKBZW9IS3SEx8B8YGlOT4CJysF3WmJWU4qQz8FxUVpfV5WW0sJqR1JoWqCa1MNkO0tzXKeez8JdLkV9YKyf0L9XJD2JZLGez7xSGzWWaa6dz7dOEi2jaLOez7RLCiexareezbJJBSW4a7yczbBIAx/Ba76czK5HAhvJbsGbzKxGABbRb8Sby6tEABLYcMWby6lD" type="audio/wav" />
      </audio>

      <div className="space-y-8">
        {/* Revenue Hero Card */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl p-8"
          style={{ 
            background: `linear-gradient(145deg, ${OMNIA.obsidienneElevated} 0%, ${OMNIA.obsidienneSurface} 100%)`,
            border: `1px solid ${OMNIA.borderActive}`,
            boxShadow: `0 20px 60px ${OMNIA.champagneGlow}`,
          }}
        >
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ 
                    background: OMNIA.champagneMuted,
                    boxShadow: `0 8px 24px ${OMNIA.champagneGlow}`,
                  }}
                >
                  <DollarSign size={28} style={{ color: OMNIA.champagne }} />
                </div>
                <div>
                  <p 
                    className="text-xs font-medium uppercase tracking-[0.2em]"
                    style={{ color: OMNIA.ivoireSubtle }}
                  >
                    Revenu Total
                  </p>
                  <p 
                    className="text-4xl font-light tracking-tight"
                    style={{ color: OMNIA.champagne }}
                  >
                    {(stats?.orders?.revenue || 0).toLocaleString()} <span className="text-lg">MAD</span>
                  </p>
                </div>
              </div>
              <p className="text-sm" style={{ color: OMNIA.ivoireMuted }}>
                +{(stats?.orders?.revenueThisMonth || 0).toLocaleString()} MAD ce mois-ci
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-8">
              <div className="text-center">
                <p className="text-3xl font-light" style={{ color: OMNIA.ivoire }}>
                  {stats?.orders?.total || 0}
                </p>
                <p className="text-xs uppercase tracking-wider" style={{ color: OMNIA.ivoireSubtle }}>
                  Commandes
                </p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-light" style={{ color: OMNIA.ivoire }}>
                  {stats?.cards?.active || 0}
                </p>
                <p className="text-xs uppercase tracking-wider" style={{ color: OMNIA.ivoireSubtle }}>
                  Cartes actives
                </p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-light" style={{ color: OMNIA.ivoire }}>
                  {(stats?.cards?.totalViews || 0).toLocaleString()}
                </p>
                <p className="text-xs uppercase tracking-wider" style={{ color: OMNIA.ivoireSubtle }}>
                  Vues totales
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Key Metrics Grid */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: OMNIA.champagneMuted }}
            >
              <Activity size={16} style={{ color: OMNIA.champagne }} />
            </div>
            <h2 
              className="text-xs font-semibold uppercase tracking-[0.2em]"
              style={{ color: OMNIA.ivoireSubtle }}
            >
              Métriques en temps réel
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <OmniaStatCard
              title="Commandes"
              value={stats?.orders?.total || 0}
              subtitle={`${stats?.orders?.today || 0} aujourd'hui`}
              icon={Package}
              color={OMNIA.purple}
              colorMuted={OMNIA.purpleMuted}
              onClick={() => navigate('/admin/orders')}
            />
            <OmniaStatCard
              title="Utilisateurs"
              value={stats?.users?.total || 0}
              subtitle={`+${stats?.users?.recent || 0} cette semaine`}
              icon={Users}
              color={OMNIA.pink}
              colorMuted={OMNIA.pinkMuted}
              onClick={() => navigate('/admin/clients')}
            />
            <OmniaStatCard
              title="Premium"
              value={stats?.subscriptions?.premium || 0}
              subtitle={`${stats?.subscriptions?.active || 0} abonnés actifs`}
              icon={Crown}
              color={OMNIA.champagne}
              colorMuted={OMNIA.champagneMuted}
              featured
            />
            <OmniaStatCard
              title="Leads"
              value={stats?.leads?.total || 0}
              subtitle={`${stats?.leads?.new || 0} nouveaux`}
              icon={Target}
              color={OMNIA.cyan}
              colorMuted={OMNIA.cyanMuted}
            />
            <OmniaStatCard
              title="Web Studio"
              value={stats?.proposals?.total || 0}
              subtitle={`${stats?.proposals?.pending || 0} en attente`}
              icon={Globe}
              color={OMNIA.champagneLight}
              colorMuted={OMNIA.champagneMuted}
              onClick={() => navigate('/admin/webstudio')}
            />
          </div>
        </section>

        {/* Pipeline + Activity */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <LuxuryOrderPipeline stats={stats} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl overflow-hidden"
            style={{ 
              backgroundColor: OMNIA.obsidienneSurface,
              border: `1px solid ${OMNIA.border}`,
            }}
          >
            <div 
              className="px-5 py-4 border-b flex items-center justify-between"
              style={{ borderColor: OMNIA.border }}
            >
              <div className="flex items-center gap-3">
                <Activity size={16} style={{ color: OMNIA.champagne }} />
                <h3 
                  className="text-sm font-semibold uppercase tracking-wider"
                  style={{ color: OMNIA.ivoire }}
                >
                  Activité Live
                </h3>
              </div>
              <div 
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: OMNIA.success }}
              />
            </div>
            <ScrollArea className="h-[280px]">
              <div className="p-2">
                {activities?.map((activity) => (
                  <LiveActivityItem key={activity.id} activity={activity} />
                ))}
                {!activities?.length && (
                  <p className="text-center py-12 text-sm" style={{ color: OMNIA.ivoireSubtle }}>
                    Aucune activité récente
                  </p>
                )}
              </div>
            </ScrollArea>
          </motion.div>
        </div>

        {/* All Clients & Export/Import Grid */}
        <section className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AllClientsWidget />
          </div>
          <ClientDataExportImport />
        </section>

        {/* Reminders Section */}
        <section className="grid lg:grid-cols-2 gap-6">
          <ClientRemindersWidget />
          <TagReminderRulesWidget />
        </section>

        {/* Serial Codes Section */}
        <section>
          <SerialCodesWidget />
        </section>

        {/* Quick Actions Grid */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: OMNIA.champagneMuted }}
              >
                <Zap size={16} style={{ color: OMNIA.champagne }} />
              </div>
              <h2 
                className="text-xs font-semibold uppercase tracking-[0.2em]"
                style={{ color: OMNIA.ivoireSubtle }}
              >
                Actions rapides
              </h2>
            </div>
            <p className="text-[10px] tracking-wider" style={{ color: OMNIA.ivoireSubtle }}>
              ⌘ + lettre pour accès rapide
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <QuickActionCard key={action.id} action={action} index={index} />
            ))}
          </div>
        </section>

        {/* Pro Tips */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl p-6"
          style={{ 
            background: `linear-gradient(135deg, ${OMNIA.champagneMuted} 0%, transparent 100%)`,
            border: `1px solid ${OMNIA.borderActive}`,
          }}
        >
          <div className="flex items-start gap-4">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: OMNIA.champagne }}
            >
              <Sparkles size={20} style={{ color: OMNIA.obsidienne }} />
            </div>
            <div className="flex-1">
              <h3 
                className="font-semibold mb-3"
                style={{ color: OMNIA.champagne }}
              >
                Workflow Élite
              </h3>
              <div className="grid sm:grid-cols-3 gap-6">
                {[
                  { step: '1', shortcut: '⌘+C', action: 'Créer vCard' },
                  { step: '2', shortcut: '⌘+P', action: 'Imprimer PDF' },
                  { step: '3', shortcut: '⌘+K', action: 'Recherche globale' },
                ].map((item) => (
                  <div key={item.step} className="flex items-center gap-3">
                    <span 
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                      style={{ 
                        backgroundColor: OMNIA.champagne,
                        color: OMNIA.obsidienne,
                      }}
                    >
                      {item.step}
                    </span>
                    <div>
                      <p className="text-sm font-medium" style={{ color: OMNIA.ivoire }}>
                        {item.action}
                      </p>
                      <p className="text-xs" style={{ color: OMNIA.ivoireSubtle }}>
                        {item.shortcut}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>
      </div>

      {/* Global Search Modal */}
      <GlobalSearchModal open={showSearch} onClose={() => setShowSearch(false)} />
    </AdminOmniaLayout>
  );
}
