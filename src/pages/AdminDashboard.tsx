/**
 * Admin Dashboard - GOTHAM COMMAND CENTER
 * Centre de commande ultime pour le créateur et gestionnaire IWASP
 * Vision globale, contrôle total, créativité sans limite
 */

import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { AdminGuard } from "@/components/AdminGuard";
import { useAuth } from "@/contexts/AuthContext";
import { useAllOrders } from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
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
  AlertCircle,
  Bell,
  Globe,
  BarChart3,
  Eye,
  Plus,
  Search,
  RefreshCw,
  ChevronRight,
  Sparkles,
  Crown,
  Activity,
  DollarSign,
  Target,
  Layers,
  Rocket,
  Shield,
  Database,
  MessageSquare,
  Mail,
  ExternalLink,
  Copy,
  MoreVertical,
  ArrowUpRight,
  Wifi,
  Command,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { GlobalSearchModal } from "@/components/admin/GlobalSearchModal";
import { PushNotificationsWidget } from "@/components/admin/PushNotificationsWidget";
import { AllClientsWidget } from "@/components/admin/AllClientsWidget";

// Gotham color palette
const GOTHAM = {
  bg: '#0A0A0B',
  surface: '#111113',
  surfaceHover: '#1A1A1D',
  border: 'rgba(255, 199, 0, 0.15)',
  borderMuted: 'rgba(255, 255, 255, 0.08)',
  gold: '#FFC700',
  goldMuted: 'rgba(255, 199, 0, 0.2)',
  text: '#F5F5F5',
  textMuted: 'rgba(245, 245, 245, 0.6)',
  success: '#22C55E',
  info: '#3B82F6',
  warning: '#F59E0B',
  danger: '#EF4444',
  purple: '#A855F7',
  pink: '#EC4899',
};

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  path: string;
  color: string;
  badge?: string;
  shortcut?: string;
}

const quickActions: QuickAction[] = [
  {
    id: 'instant',
    title: "Création vCard",
    description: "Créer une carte digitale instantanément",
    icon: Zap,
    path: "/admin/instant",
    color: GOTHAM.gold,
    badge: "⚡ Instantané",
    shortcut: "C",
  },
  {
    id: 'evolis',
    title: "Impression Evolis",
    description: "Générer PDF pour carte physique",
    icon: Printer,
    path: "/admin/evolis",
    color: GOTHAM.success,
    shortcut: "P",
  },
  {
    id: 'webstudio',
    title: "Web Studio",
    description: "Commandes de sites web IA",
    icon: Globe,
    path: "/admin/webstudio",
    color: "#D4A853",
    badge: "🆕 Nouveau",
  },
  {
    id: 'analytics',
    title: "Analytics Live",
    description: "Conversions & Funnel temps réel",
    icon: BarChart3,
    path: "/admin/analytics",
    color: GOTHAM.info,
    badge: "🔴 Live",
  },
  {
    id: 'creator',
    title: "Gestion Cartes",
    description: "Créer et gérer toutes les cartes",
    icon: CreditCard,
    path: "/admin/creator",
    color: GOTHAM.purple,
  },
  {
    id: 'orders',
    title: "Commandes NFC",
    description: "Suivi et gestion des commandes",
    icon: Package,
    path: "/admin/orders",
    color: GOTHAM.pink,
  },
  {
    id: 'clients',
    title: "Base Clients",
    description: "CRM et données clients",
    icon: Users,
    path: "/admin/clients",
    color: "#06B6D4",
  },
  {
    id: 'brand',
    title: "Brand Assets",
    description: "Logos et fichiers officiels",
    icon: FileImage,
    path: "/brand-assets",
    color: "#F97316",
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
      const contactsData = contacts.data || [];

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
        contacts: {
          pending: contactsData.filter(c => c.status === 'pending').length,
        },
      };
    },
    refetchInterval: 10000, // Refresh every 10s
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
          color: GOTHAM.gold,
        })),
        ...(cards.data || []).map(c => ({
          id: `card-${c.id}`,
          type: 'card' as const,
          title: `Carte créée`,
          subtitle: `${c.first_name} ${c.last_name}`,
          slug: c.slug,
          createdAt: new Date(c.created_at),
          icon: CreditCard,
          color: GOTHAM.purple,
        })),
        ...(leads.data || []).map(l => ({
          id: `lead-${l.id}`,
          type: 'lead' as const,
          title: `Nouveau lead`,
          subtitle: l.name || l.email || 'Inconnu',
          createdAt: new Date(l.created_at),
          icon: Users,
          color: GOTHAM.info,
        })),
      ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 10);

      return activities;
    },
    refetchInterval: 15000,
  });
}

// Stat Card Component
function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color,
  trend,
  onClick,
}: { 
  title: string; 
  value: string | number; 
  subtitle?: string;
  icon: React.ElementType; 
  color: string;
  trend?: { value: number; label: string };
  onClick?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: onClick ? 1.02 : 1 }}
      whileTap={{ scale: onClick ? 0.98 : 1 }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl p-4 border transition-all ${onClick ? 'cursor-pointer' : ''}`}
      style={{ 
        backgroundColor: GOTHAM.surface,
        borderColor: GOTHAM.borderMuted,
      }}
    >
      {/* Glow effect */}
      <div 
        className="absolute -top-12 -right-12 w-24 h-24 rounded-full blur-2xl opacity-20"
        style={{ backgroundColor: color }}
      />
      
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider mb-1" style={{ color: GOTHAM.textMuted }}>
            {title}
          </p>
          <p className="text-2xl font-bold" style={{ color: GOTHAM.text }}>
            {value}
          </p>
          {subtitle && (
            <p className="text-xs mt-1" style={{ color }}>
              {subtitle}
            </p>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <ArrowUpRight size={12} style={{ color: trend.value >= 0 ? GOTHAM.success : GOTHAM.danger }} />
              <span className="text-xs" style={{ color: trend.value >= 0 ? GOTHAM.success : GOTHAM.danger }}>
                {trend.value >= 0 ? '+' : ''}{trend.value}%
              </span>
              <span className="text-xs" style={{ color: GOTHAM.textMuted }}>
                {trend.label}
              </span>
            </div>
          )}
        </div>
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon size={20} style={{ color }} />
        </div>
      </div>
    </motion.div>
  );
}

// Order Pipeline Card
function OrderPipeline({ stats }: { stats: any }) {
  const navigate = useNavigate();
  const stages = [
    { label: 'En attente', count: stats?.orders?.pending || 0, color: GOTHAM.warning, icon: Clock },
    { label: 'Production', count: stats?.orders?.inProduction || 0, color: GOTHAM.info, icon: Settings },
    { label: 'Expédiées', count: stats?.orders?.shipped || 0, color: GOTHAM.purple, icon: Truck },
    { label: 'Livrées', count: stats?.orders?.delivered || 0, color: GOTHAM.success, icon: CheckCircle2 },
  ];

  return (
    <Card 
      className="border cursor-pointer transition-all hover:border-[#FFC700]/30"
      style={{ backgroundColor: GOTHAM.surface, borderColor: GOTHAM.borderMuted }}
      onClick={() => navigate('/admin/orders')}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2" style={{ color: GOTHAM.textMuted }}>
            <Package size={16} />
            Pipeline Commandes
          </CardTitle>
          <ChevronRight size={16} style={{ color: GOTHAM.textMuted }} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-2">
          {stages.map((stage) => (
            <div 
              key={stage.label}
              className="text-center p-3 rounded-lg"
              style={{ backgroundColor: `${stage.color}10` }}
            >
              <stage.icon size={16} className="mx-auto mb-1" style={{ color: stage.color }} />
              <p className="text-xl font-bold" style={{ color: GOTHAM.text }}>{stage.count}</p>
              <p className="text-[10px] uppercase tracking-wider" style={{ color: GOTHAM.textMuted }}>{stage.label}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
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
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(action.path)}
      className="relative overflow-hidden rounded-xl p-4 border cursor-pointer transition-all group"
      style={{ 
        backgroundColor: GOTHAM.surface,
        borderColor: GOTHAM.borderMuted,
      }}
    >
      {/* Hover glow */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ 
          background: `linear-gradient(135deg, ${action.color}10 0%, transparent 60%)`,
        }}
      />
      
      <div className="relative z-10 flex items-start gap-3">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${action.color}20` }}
        >
          <action.icon size={20} style={{ color: action.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm" style={{ color: GOTHAM.text }}>
              {action.title}
            </h3>
            {action.badge && (
              <span 
                className="text-[10px] px-1.5 py-0.5 rounded-full"
                style={{ backgroundColor: `${action.color}20`, color: action.color }}
              >
                {action.badge}
              </span>
            )}
          </div>
          <p className="text-xs mt-0.5" style={{ color: GOTHAM.textMuted }}>
            {action.description}
          </p>
        </div>
        {action.shortcut && (
          <kbd 
            className="hidden sm:flex items-center justify-center w-6 h-6 rounded text-xs font-mono"
            style={{ backgroundColor: GOTHAM.bg, color: GOTHAM.textMuted, border: `1px solid ${GOTHAM.borderMuted}` }}
          >
            {action.shortcut}
          </kbd>
        )}
      </div>
    </motion.div>
  );
}

// Activity Feed Item
function ActivityItem({ activity }: { activity: any }) {
  const navigate = useNavigate();
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return GOTHAM.warning;
      case 'paid': return GOTHAM.success;
      case 'in_production': return GOTHAM.info;
      case 'shipped': return GOTHAM.purple;
      case 'delivered': return GOTHAM.success;
      default: return GOTHAM.textMuted;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-white/5 cursor-pointer"
      onClick={() => {
        if (activity.type === 'order') navigate('/admin/orders');
        if (activity.type === 'card') navigate('/admin/creator');
        if (activity.type === 'lead') navigate('/admin/clients');
      }}
    >
      <div 
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${activity.color}20` }}
      >
        <activity.icon size={14} style={{ color: activity.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" style={{ color: GOTHAM.text }}>
          {activity.title}
        </p>
        <p className="text-xs truncate" style={{ color: GOTHAM.textMuted }}>
          {activity.subtitle}
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        {activity.amount && (
          <p className="text-sm font-semibold" style={{ color: GOTHAM.gold }}>
            {activity.amount}
          </p>
        )}
        {activity.status && (
          <span 
            className="text-[10px] px-1.5 py-0.5 rounded-full"
            style={{ backgroundColor: `${getStatusColor(activity.status)}20`, color: getStatusColor(activity.status) }}
          >
            {activity.status}
          </span>
        )}
        <p className="text-[10px] mt-0.5" style={{ color: GOTHAM.textMuted }}>
          {formatDistanceToNow(activity.createdAt, { addSuffix: true, locale: fr })}
        </p>
      </div>
    </motion.div>
  );
}

// Main Dashboard Content
function AdminDashboardContent() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
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
            `🔔 Nouvelle commande #${newOrder.order_number}`,
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

  const isLoading = statsLoading || activitiesLoading;

  return (
    <div className="min-h-dvh w-full" style={{ backgroundColor: GOTHAM.bg }}>
      {/* Notification sound */}
      <audio ref={audioRef} preload="auto">
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleOk7A5TJ1X1pq0sjOKLa0aFtNxUtnMvWoHRNJSCexMmqb2AnNqHEwJ5lVEc4m7qmkWdhUXOVr6iZbGpPaJOxqqiUe3Fqa46rrJ6Ji3xqbpWnoZ2HhXdmZZOknpyJg3FdYZaioJqIgG5aY5yinZeHfGlba56gmJODdWBWYqGglpOBb1ZWaqGel5J9Z09QbKWdlpN7Y0xMdaqckZJ4X0hFfq+bjpN0WkJBh7SZi491UzxAlrqXiI9vTDlGnr6UhY1oRDhMpcGSgopjQDlUpMSQgIdcPz1apsOPfYRWPUJppsSMeYFPQUpvq8aJdX1LQ1J1ssWGcXhIR1x8t8aDa3RHSml/usKBZW9IS3SEx8B8YGlOT4CJysF3WmJWU4qQz8FxUVpfV5WW0sJqR1JoWqCa1MNkO0tzXKeez8JdLkV9YKyf0L9XJD2JZLGez7xSGzWWaa6dz7dOEi2jaLOez7RLCiexareezbJJBSW4a7yczbBIAx/Ba76czK5HAhvJbsGbzKxGABbRb8Sby6tEABLYcMWby6lD" type="audio/wav" />
      </audio>

      {/* Header */}
      <header 
        className="sticky top-0 z-50 backdrop-blur-xl border-b px-4 py-3"
        style={{ 
          backgroundColor: 'rgba(10, 10, 11, 0.9)',
          borderColor: GOTHAM.border,
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ 
                  background: `linear-gradient(135deg, ${GOTHAM.gold} 0%, #D4A853 100%)`,
                  boxShadow: `0 0 20px ${GOTHAM.gold}40`,
                }}
              >
                <Command size={20} className="text-black" />
              </div>
              <div>
                <h1 className="text-lg font-bold flex items-center gap-2" style={{ color: GOTHAM.text }}>
                  Command Center
                  <Crown size={14} style={{ color: GOTHAM.gold }} />
                </h1>
                <p className="text-xs" style={{ color: GOTHAM.textMuted }}>
                  IWASP Admin • {user?.email?.split('@')[0]}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search trigger */}
            <button
              onClick={() => setShowSearch(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors hover:border-[#FFC700]/30"
              style={{ backgroundColor: GOTHAM.surface, borderColor: GOTHAM.borderMuted }}
            >
              <Search size={14} style={{ color: GOTHAM.textMuted }} />
              <span className="text-xs" style={{ color: GOTHAM.textMuted }}>Rechercher...</span>
              <kbd className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: GOTHAM.bg, color: GOTHAM.textMuted }}>
                ⌘K
              </kbd>
            </button>

            {/* Push notifications widget */}
            <PushNotificationsWidget />

            {/* Refresh */}
            <Button
              onClick={() => refetchStats()}
              size="icon"
              variant="ghost"
              className="h-9 w-9"
            >
              <RefreshCw size={16} style={{ color: GOTHAM.textMuted }} />
            </Button>

            {/* Quick create */}
            <Button
              onClick={() => navigate("/admin/instant")}
              className="h-9 px-4 font-semibold gap-2"
              style={{ 
                background: `linear-gradient(135deg, ${GOTHAM.gold} 0%, #D4A853 100%)`,
                color: '#000',
              }}
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Créer</span>
            </Button>

            {/* Live indicator */}
            <div 
              className="flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{ backgroundColor: `${GOTHAM.success}20` }}
            >
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: GOTHAM.success }} />
              <span className="text-xs font-medium" style={{ color: GOTHAM.success }}>Live</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Key Metrics */}
        <section>
          <h2 className="text-xs uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: GOTHAM.textMuted }}>
            <Activity size={14} />
            Métriques clés
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <StatCard
              title="Revenu total"
              value={`${(stats?.orders?.revenue || 0).toLocaleString()} MAD`}
              subtitle={`+${(stats?.orders?.revenueThisMonth || 0).toLocaleString()} ce mois`}
              icon={DollarSign}
              color={GOTHAM.gold}
              onClick={() => navigate('/admin/orders')}
            />
            <StatCard
              title="Commandes"
              value={stats?.orders?.total || 0}
              subtitle={`${stats?.orders?.today || 0} aujourd'hui`}
              icon={Package}
              color={GOTHAM.purple}
              onClick={() => navigate('/admin/orders')}
            />
            <StatCard
              title="Cartes actives"
              value={stats?.cards?.active || 0}
              subtitle={`${(stats?.cards?.totalViews || 0).toLocaleString()} vues`}
              icon={CreditCard}
              color={GOTHAM.info}
              onClick={() => navigate('/admin/creator')}
            />
            <StatCard
              title="Utilisateurs"
              value={stats?.users?.total || 0}
              subtitle={`+${stats?.users?.recent || 0} cette semaine`}
              icon={Users}
              color={GOTHAM.pink}
              onClick={() => navigate('/admin/clients')}
            />
            <StatCard
              title="Abonnés Premium"
              value={stats?.subscriptions?.premium || 0}
              subtitle={`${stats?.subscriptions?.active || 0} actifs`}
              icon={Crown}
              color={GOTHAM.gold}
            />
            <StatCard
              title="Web Studio"
              value={stats?.proposals?.total || 0}
              subtitle={`${stats?.proposals?.pending || 0} en attente`}
              icon={Globe}
              color="#D4A853"
              onClick={() => navigate('/admin/webstudio')}
            />
          </div>
        </section>

        {/* Pipeline + Activity */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Pipeline */}
          <div className="lg:col-span-2">
            <OrderPipeline stats={stats} />
          </div>

          {/* Live Activity */}
          <Card 
            className="border"
            style={{ backgroundColor: GOTHAM.surface, borderColor: GOTHAM.borderMuted }}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2" style={{ color: GOTHAM.textMuted }}>
                <Activity size={16} />
                Activité en direct
                <div className="w-2 h-2 rounded-full animate-pulse ml-auto" style={{ backgroundColor: GOTHAM.success }} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                {activities?.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
                {!activities?.length && (
                  <p className="text-center py-8 text-sm" style={{ color: GOTHAM.textMuted }}>
                    Aucune activité récente
                  </p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* All Clients Widget */}
        <section>
          <AllClientsWidget />
        </section>

        {/* Quick Actions Grid */}
        <section>
          <h2 className="text-xs uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: GOTHAM.textMuted }}>
            <Zap size={14} />
            Actions rapides
            <span className="text-[10px] ml-auto" style={{ color: GOTHAM.textMuted }}>
              ⌘ + lettre pour accès rapide
            </span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {quickActions.map((action, index) => (
              <QuickActionCard key={action.id} action={action} index={index} />
            ))}
          </div>
        </section>

        {/* Pro Tips */}
        <Card 
          className="border"
          style={{ 
            backgroundColor: `${GOTHAM.gold}08`,
            borderColor: GOTHAM.border,
          }}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Sparkles size={20} style={{ color: GOTHAM.gold }} />
              <div>
                <h3 className="font-medium mb-2" style={{ color: GOTHAM.gold }}>
                  Workflow recommandé
                </h3>
                <div className="grid sm:grid-cols-3 gap-4 text-sm" style={{ color: GOTHAM.textMuted }}>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: `${GOTHAM.gold}20`, color: GOTHAM.gold }}>1</span>
                    <span><strong>⌘+C</strong> → Créer vCard</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: `${GOTHAM.gold}20`, color: GOTHAM.gold }}>2</span>
                    <span><strong>⌘+P</strong> → Imprimer PDF</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: `${GOTHAM.gold}20`, color: GOTHAM.gold }}>3</span>
                    <span>Expédier + NFC activé</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Global Search Modal */}
      <GlobalSearchModal open={showSearch} onClose={() => setShowSearch(false)} />
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <AdminGuard>
      <AdminDashboardContent />
    </AdminGuard>
  );
}
