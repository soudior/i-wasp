/**
 * Admin Dashboard - MANSORY COMMAND CENTER
 * Tableau de bord ultra-luxe inspiré des finitions Mansory
 * Noir profond, or mat, cuir digital, puissance silencieuse
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
  Gauge,
  Gem,
  CircleDot,
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
import { ClientDataExportImport } from "@/components/admin/ClientDataExportImport";
import { ClientRemindersWidget } from "@/components/admin/ClientRemindersWidget";
import { TagReminderRulesWidget } from "@/components/admin/TagReminderRulesWidget";

// MANSORY Ultra-Luxe Color Palette
const MANSORY = {
  // Backgrounds - Deep carbon fiber blacks
  bg: '#050506',
  bgDeep: '#030304',
  surface: '#0A0A0C',
  surfaceElevated: '#0F0F12',
  surfaceHover: '#141418',
  
  // Matte gold - Signature Mansory accent
  gold: '#C9A962',
  goldLight: '#D4B978',
  goldMuted: 'rgba(201, 169, 98, 0.15)',
  goldGlow: 'rgba(201, 169, 98, 0.3)',
  
  // Premium borders
  border: 'rgba(201, 169, 98, 0.12)',
  borderMuted: 'rgba(255, 255, 255, 0.04)',
  borderActive: 'rgba(201, 169, 98, 0.4)',
  
  // Text hierarchy
  text: '#F8F8F8',
  textSecondary: '#B8B8BC',
  textMuted: 'rgba(184, 184, 188, 0.6)',
  
  // Status colors - refined
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

// Gradient presets
const GRADIENTS = {
  gold: `linear-gradient(135deg, ${MANSORY.gold} 0%, ${MANSORY.goldLight} 50%, ${MANSORY.gold} 100%)`,
  goldSubtle: `linear-gradient(135deg, ${MANSORY.goldMuted} 0%, transparent 100%)`,
  surface: `linear-gradient(180deg, ${MANSORY.surface} 0%, ${MANSORY.bgDeep} 100%)`,
  carbonFiber: `repeating-linear-gradient(
    45deg,
    ${MANSORY.bgDeep} 0px,
    ${MANSORY.bgDeep} 2px,
    ${MANSORY.bg} 2px,
    ${MANSORY.bg} 4px
  )`,
};

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  path: string;
  color: string;
  colorMuted: string;
  badge?: string;
  shortcut?: string;
}

const quickActions: QuickAction[] = [
  {
    id: 'instant',
    title: "Création vCard",
    description: "Créer instantanément",
    icon: Zap,
    path: "/admin/instant",
    color: MANSORY.gold,
    colorMuted: MANSORY.goldMuted,
    badge: "⚡",
    shortcut: "C",
  },
  {
    id: 'evolis',
    title: "Impression Evolis",
    description: "Générer PDF carte",
    icon: Printer,
    path: "/admin/evolis",
    color: MANSORY.success,
    colorMuted: MANSORY.successMuted,
    shortcut: "P",
  },
  {
    id: 'webstudio',
    title: "Web Studio",
    description: "Sites web IA",
    icon: Globe,
    path: "/admin/webstudio",
    color: MANSORY.goldLight,
    colorMuted: MANSORY.goldMuted,
    badge: "✦",
  },
  {
    id: 'analytics',
    title: "Analytics Live",
    description: "Conversions temps réel",
    icon: BarChart3,
    path: "/admin/analytics",
    color: MANSORY.info,
    colorMuted: MANSORY.infoMuted,
    badge: "●",
  },
  {
    id: 'creator',
    title: "Gestion Cartes",
    description: "Créer et gérer",
    icon: CreditCard,
    path: "/admin/creator",
    color: MANSORY.purple,
    colorMuted: MANSORY.purpleMuted,
  },
  {
    id: 'orders',
    title: "Commandes NFC",
    description: "Suivi commandes",
    icon: Package,
    path: "/admin/orders",
    color: MANSORY.pink,
    colorMuted: MANSORY.pinkMuted,
  },
  {
    id: 'clients',
    title: "Base Clients",
    description: "CRM complet",
    icon: Users,
    path: "/admin/clients",
    color: MANSORY.cyan,
    colorMuted: MANSORY.cyanMuted,
  },
  {
    id: 'brand',
    title: "Brand Assets",
    description: "Fichiers officiels",
    icon: FileImage,
    path: "/brand-assets",
    color: MANSORY.warning,
    colorMuted: MANSORY.warningMuted,
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
          color: MANSORY.gold,
        })),
        ...(cards.data || []).map(c => ({
          id: `card-${c.id}`,
          type: 'card' as const,
          title: `Carte créée`,
          subtitle: `${c.first_name} ${c.last_name}`,
          slug: c.slug,
          createdAt: new Date(c.created_at),
          icon: CreditCard,
          color: MANSORY.purple,
        })),
        ...(leads.data || []).map(l => ({
          id: `lead-${l.id}`,
          type: 'lead' as const,
          title: `Nouveau lead`,
          subtitle: l.name || l.email || 'Inconnu',
          createdAt: new Date(l.created_at),
          icon: Users,
          color: MANSORY.cyan,
        })),
      ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 10);

      return activities;
    },
    refetchInterval: 15000,
  });
}

// Premium Stat Card with Mansory styling
function MansoryStatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color,
  colorMuted,
  trend,
  onClick,
  featured = false,
}: { 
  title: string; 
  value: string | number; 
  subtitle?: string;
  icon: React.ElementType; 
  color: string;
  colorMuted?: string;
  trend?: { value: number; label: string };
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
          ? `linear-gradient(145deg, ${MANSORY.surfaceElevated} 0%, ${MANSORY.surface} 100%)`
          : MANSORY.surface,
        border: `1px solid ${featured ? MANSORY.border : MANSORY.borderMuted}`,
        boxShadow: featured ? `0 8px 32px ${MANSORY.goldMuted}, inset 0 1px 0 ${MANSORY.borderMuted}` : 'none',
      }}
    >
      {/* Ambient glow */}
      <div 
        className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-20 transition-opacity duration-500"
        style={{ backgroundColor: color }}
      />
      
      {/* Gold accent line */}
      {featured && (
        <div 
          className="absolute top-0 left-6 right-6 h-px"
          style={{ background: GRADIENTS.gold }}
        />
      )}
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
            style={{ 
              background: colorMuted || `${color}15`,
              boxShadow: `0 4px 12px ${color}20`,
            }}
          >
            <Icon size={22} style={{ color }} />
          </div>
          {trend && (
            <div 
              className="flex items-center gap-1 px-2 py-1 rounded-full"
              style={{ 
                backgroundColor: trend.value >= 0 ? MANSORY.successMuted : MANSORY.dangerMuted,
              }}
            >
              <ArrowUpRight 
                size={12} 
                style={{ 
                  color: trend.value >= 0 ? MANSORY.success : MANSORY.danger,
                  transform: trend.value < 0 ? 'rotate(90deg)' : 'none',
                }} 
              />
              <span 
                className="text-xs font-medium"
                style={{ color: trend.value >= 0 ? MANSORY.success : MANSORY.danger }}
              >
                {trend.value >= 0 ? '+' : ''}{trend.value}%
              </span>
            </div>
          )}
        </div>
        
        <p 
          className="text-xs font-medium uppercase tracking-[0.15em] mb-2"
          style={{ color: MANSORY.textMuted }}
        >
          {title}
        </p>
        
        <p 
          className="text-3xl font-light tracking-tight mb-1"
          style={{ 
            color: featured ? MANSORY.gold : MANSORY.text,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {value}
        </p>
        
        {subtitle && (
          <p className="text-xs" style={{ color: MANSORY.textSecondary }}>
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
    { label: 'En attente', count: stats?.orders?.pending || 0, color: MANSORY.warning, colorMuted: MANSORY.warningMuted, icon: Clock },
    { label: 'Production', count: stats?.orders?.inProduction || 0, color: MANSORY.info, colorMuted: MANSORY.infoMuted, icon: Settings },
    { label: 'Expédiées', count: stats?.orders?.shipped || 0, color: MANSORY.purple, colorMuted: MANSORY.purpleMuted, icon: Truck },
    { label: 'Livrées', count: stats?.orders?.delivered || 0, color: MANSORY.success, colorMuted: MANSORY.successMuted, icon: CheckCircle2 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      onClick={() => navigate('/admin/orders')}
      className="relative overflow-hidden rounded-2xl p-6 cursor-pointer transition-all duration-500"
      style={{ 
        background: `linear-gradient(145deg, ${MANSORY.surfaceElevated} 0%, ${MANSORY.surface} 100%)`,
        border: `1px solid ${MANSORY.border}`,
        boxShadow: `0 8px 32px ${MANSORY.goldMuted}`,
      }}
    >
      {/* Carbon fiber texture overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{ background: GRADIENTS.carbonFiber }}
      />
      
      {/* Gold accent line */}
      <div 
        className="absolute top-0 left-8 right-8 h-px"
        style={{ background: GRADIENTS.gold }}
      />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: MANSORY.goldMuted }}
            >
              <Gauge size={20} style={{ color: MANSORY.gold }} />
            </div>
            <div>
              <h3 
                className="text-sm font-semibold uppercase tracking-wider"
                style={{ color: MANSORY.text }}
              >
                Pipeline Commandes
              </h3>
              <p className="text-xs" style={{ color: MANSORY.textMuted }}>
                Suivi en temps réel
              </p>
            </div>
          </div>
          <ChevronRight size={20} style={{ color: MANSORY.gold }} />
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
                style={{ color: MANSORY.text }}
              >
                {stage.count}
              </p>
              <p 
                className="text-[10px] uppercase tracking-widest mt-1"
                style={{ color: MANSORY.textMuted }}
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

// Premium Quick Action Card
function PremiumActionCard({ action, index }: { action: QuickAction; index: number }) {
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
        backgroundColor: MANSORY.surface,
        border: `1px solid ${MANSORY.borderMuted}`,
      }}
    >
      {/* Hover gradient */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ 
          background: `linear-gradient(135deg, ${action.colorMuted} 0%, transparent 60%)`,
        }}
      />
      
      {/* Gold line on hover */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
        style={{ background: GRADIENTS.gold }}
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
          <div className="flex items-center gap-2">
            {action.badge && (
              <span 
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ backgroundColor: action.colorMuted, color: action.color }}
              >
                {action.badge}
              </span>
            )}
            {action.shortcut && (
              <kbd 
                className="hidden sm:flex items-center justify-center w-6 h-6 rounded text-xs font-mono"
                style={{ 
                  backgroundColor: MANSORY.bg, 
                  color: MANSORY.textMuted, 
                  border: `1px solid ${MANSORY.borderMuted}` 
                }}
              >
                {action.shortcut}
              </kbd>
            )}
          </div>
        </div>
        
        <h3 
          className="font-semibold text-sm mb-1 transition-colors duration-300 group-hover:text-[#C9A962]"
          style={{ color: MANSORY.text }}
        >
          {action.title}
        </h3>
        <p className="text-xs" style={{ color: MANSORY.textMuted }}>
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
      case 'pending': return MANSORY.warning;
      case 'paid': return MANSORY.success;
      case 'in_production': return MANSORY.info;
      case 'shipped': return MANSORY.purple;
      case 'delivered': return MANSORY.success;
      default: return MANSORY.textMuted;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 4, backgroundColor: MANSORY.surfaceHover }}
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
        <p className="text-sm font-medium truncate" style={{ color: MANSORY.text }}>
          {activity.title}
        </p>
        <p className="text-xs truncate" style={{ color: MANSORY.textMuted }}>
          {activity.subtitle}
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        {activity.amount && (
          <p className="text-sm font-semibold" style={{ color: MANSORY.gold }}>
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
        <p className="text-[10px] mt-0.5" style={{ color: MANSORY.textMuted }}>
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
  const [showSearch, setShowSearch] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useGlobalStats();
  const { data: activities, isLoading: activitiesLoading } = useRecentActivity();

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

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
    <div 
      className="min-h-dvh w-full"
      style={{ 
        backgroundColor: MANSORY.bg,
        backgroundImage: `
          radial-gradient(ellipse 80% 50% at 50% -20%, ${MANSORY.goldMuted} 0%, transparent 50%),
          ${GRADIENTS.surface}
        `,
      }}
    >
      {/* Notification sound */}
      <audio ref={audioRef} preload="auto">
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleOk7A5TJ1X1pq0sjOKLa0aFtNxUtnMvWoHRNJSCexMmqb2AnNqHEwJ5lVEc4m7qmkWdhUXOVr6iZbGpPaJOxqqiUe3Fqa46rrJ6Ji3xqbpWnoZ2HhXdmZZOknpyJg3FdYZaioJqIgG5aY5yinZeHfGlba56gmJODdWBWYqGglpOBb1ZWaqGel5J9Z09QbKWdlpN7Y0xMdaqckZJ4X0hFfq+bjpN0WkJBh7SZi491UzxAlrqXiI9vTDlGnr6UhY1oRDhMpcGSgopjQDlUpMSQgIdcPz1apsOPfYRWPUJppsSMeYFPQUpvq8aJdX1LQ1J1ssWGcXhIR1x8t8aDa3RHSml/usKBZW9IS3SEx8B8YGlOT4CJysF3WmJWU4qQz8FxUVpfV5WW0sJqR1JoWqCa1MNkO0tzXKeez8JdLkV9YKyf0L9XJD2JZLGez7xSGzWWaa6dz7dOEi2jaLOez7RLCiexareezbJJBSW4a7yczbBIAx/Ba76czK5HAhvJbsGbzKxGABbRb8Sby6tEABLYcMWby6lD" type="audio/wav" />
      </audio>

      {/* Luxury Header */}
      <header 
        className="sticky top-0 z-50 backdrop-blur-2xl border-b px-6 py-4"
        style={{ 
          backgroundColor: 'rgba(5, 5, 6, 0.85)',
          borderColor: MANSORY.border,
          boxShadow: `0 4px 30px rgba(0, 0, 0, 0.5)`,
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-5">
            {/* Logo */}
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.05 }}
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center relative overflow-hidden"
                style={{ 
                  background: GRADIENTS.gold,
                  boxShadow: `0 0 30px ${MANSORY.goldGlow}`,
                }}
              >
                <Gem size={24} className="text-black relative z-10" />
              </div>
              {/* Pulse effect */}
              <div 
                className="absolute inset-0 rounded-xl animate-ping opacity-20"
                style={{ backgroundColor: MANSORY.gold }}
              />
            </motion.div>
            
            <div>
              <h1 
                className="text-xl font-semibold tracking-tight flex items-center gap-2"
                style={{ color: MANSORY.text }}
              >
                <span style={{ background: GRADIENTS.gold, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  MANSORY
                </span>
                <span className="text-sm font-light" style={{ color: MANSORY.textMuted }}>
                  Command
                </span>
              </h1>
              <p className="text-xs flex items-center gap-2" style={{ color: MANSORY.textMuted }}>
                <span>{format(currentTime, 'EEEE d MMMM', { locale: fr })}</span>
                <span>•</span>
                <span>{format(currentTime, 'HH:mm')}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Search trigger */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowSearch(true)}
              className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-xl border transition-all duration-300"
              style={{ 
                backgroundColor: MANSORY.surface, 
                borderColor: MANSORY.borderMuted,
              }}
            >
              <Search size={14} style={{ color: MANSORY.textMuted }} />
              <span className="text-xs" style={{ color: MANSORY.textMuted }}>Rechercher...</span>
              <kbd 
                className="text-[10px] px-2 py-0.5 rounded-md ml-4"
                style={{ backgroundColor: MANSORY.bg, color: MANSORY.textMuted }}
              >
                ⌘K
              </kbd>
            </motion.button>

            {/* Push notifications widget */}
            <PushNotificationsWidget />

            {/* Refresh */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => refetchStats()}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
              style={{ 
                backgroundColor: MANSORY.surface,
                border: `1px solid ${MANSORY.borderMuted}`,
              }}
            >
              <RefreshCw size={16} style={{ color: MANSORY.textMuted }} />
            </motion.button>

            {/* Quick create */}
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: `0 0 30px ${MANSORY.goldGlow}` }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/admin/instant")}
              className="h-10 px-5 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300"
              style={{ 
                background: GRADIENTS.gold,
                color: '#000',
                boxShadow: `0 4px 20px ${MANSORY.goldMuted}`,
              }}
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Créer</span>
            </motion.button>

            {/* Status indicator */}
            <div 
              className="flex items-center gap-2 px-4 py-2 rounded-xl"
              style={{ 
                backgroundColor: MANSORY.successMuted,
                border: `1px solid ${MANSORY.success}30`,
              }}
            >
              <CircleDot 
                size={12} 
                className="animate-pulse"
                style={{ color: MANSORY.success }} 
              />
              <span className="text-xs font-medium" style={{ color: MANSORY.success }}>
                En ligne
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Revenue Hero Card */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl p-8"
          style={{ 
            background: `linear-gradient(145deg, ${MANSORY.surfaceElevated} 0%, ${MANSORY.surface} 100%)`,
            border: `1px solid ${MANSORY.border}`,
            boxShadow: `0 20px 60px ${MANSORY.goldMuted}`,
          }}
        >
          {/* Carbon fiber texture */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{ background: GRADIENTS.carbonFiber }}
          />
          
          {/* Gold accent lines */}
          <div 
            className="absolute top-0 left-12 right-12 h-px"
            style={{ background: GRADIENTS.gold }}
          />
          <div 
            className="absolute bottom-0 left-12 right-12 h-px"
            style={{ background: GRADIENTS.gold }}
          />
          
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ 
                    background: MANSORY.goldMuted,
                    boxShadow: `0 8px 24px ${MANSORY.goldMuted}`,
                  }}
                >
                  <DollarSign size={28} style={{ color: MANSORY.gold }} />
                </div>
                <div>
                  <p 
                    className="text-xs font-medium uppercase tracking-[0.2em]"
                    style={{ color: MANSORY.textMuted }}
                  >
                    Revenu Total
                  </p>
                  <p 
                    className="text-4xl font-light tracking-tight"
                    style={{ 
                      background: GRADIENTS.gold,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {(stats?.orders?.revenue || 0).toLocaleString()} <span className="text-lg">MAD</span>
                  </p>
                </div>
              </div>
              <p className="text-sm" style={{ color: MANSORY.textSecondary }}>
                +{(stats?.orders?.revenueThisMonth || 0).toLocaleString()} MAD ce mois-ci
              </p>
            </div>
            
            <div className="hidden lg:grid grid-cols-3 gap-8">
              <div className="text-center">
                <p className="text-3xl font-light" style={{ color: MANSORY.text }}>
                  {stats?.orders?.total || 0}
                </p>
                <p className="text-xs uppercase tracking-wider" style={{ color: MANSORY.textMuted }}>
                  Commandes
                </p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-light" style={{ color: MANSORY.text }}>
                  {stats?.cards?.active || 0}
                </p>
                <p className="text-xs uppercase tracking-wider" style={{ color: MANSORY.textMuted }}>
                  Cartes actives
                </p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-light" style={{ color: MANSORY.text }}>
                  {(stats?.cards?.totalViews || 0).toLocaleString()}
                </p>
                <p className="text-xs uppercase tracking-wider" style={{ color: MANSORY.textMuted }}>
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
              style={{ backgroundColor: MANSORY.goldMuted }}
            >
              <Activity size={16} style={{ color: MANSORY.gold }} />
            </div>
            <h2 
              className="text-xs font-semibold uppercase tracking-[0.2em]"
              style={{ color: MANSORY.textMuted }}
            >
              Métriques en temps réel
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <MansoryStatCard
              title="Commandes"
              value={stats?.orders?.total || 0}
              subtitle={`${stats?.orders?.today || 0} aujourd'hui`}
              icon={Package}
              color={MANSORY.purple}
              colorMuted={MANSORY.purpleMuted}
              onClick={() => navigate('/admin/orders')}
            />
            <MansoryStatCard
              title="Utilisateurs"
              value={stats?.users?.total || 0}
              subtitle={`+${stats?.users?.recent || 0} cette semaine`}
              icon={Users}
              color={MANSORY.pink}
              colorMuted={MANSORY.pinkMuted}
              onClick={() => navigate('/admin/clients')}
            />
            <MansoryStatCard
              title="Premium"
              value={stats?.subscriptions?.premium || 0}
              subtitle={`${stats?.subscriptions?.active || 0} abonnés actifs`}
              icon={Crown}
              color={MANSORY.gold}
              colorMuted={MANSORY.goldMuted}
              featured
            />
            <MansoryStatCard
              title="Leads"
              value={stats?.leads?.total || 0}
              subtitle={`${stats?.leads?.new || 0} nouveaux`}
              icon={Target}
              color={MANSORY.cyan}
              colorMuted={MANSORY.cyanMuted}
            />
            <MansoryStatCard
              title="Web Studio"
              value={stats?.proposals?.total || 0}
              subtitle={`${stats?.proposals?.pending || 0} en attente`}
              icon={Globe}
              color={MANSORY.goldLight}
              colorMuted={MANSORY.goldMuted}
              onClick={() => navigate('/admin/webstudio')}
            />
          </div>
        </section>

        {/* Pipeline + Activity */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Pipeline */}
          <div className="lg:col-span-2">
            <LuxuryOrderPipeline stats={stats} />
          </div>

          {/* Live Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl overflow-hidden"
            style={{ 
              backgroundColor: MANSORY.surface,
              border: `1px solid ${MANSORY.borderMuted}`,
            }}
          >
            <div 
              className="px-5 py-4 border-b flex items-center justify-between"
              style={{ borderColor: MANSORY.borderMuted }}
            >
              <div className="flex items-center gap-3">
                <Activity size={16} style={{ color: MANSORY.gold }} />
                <h3 
                  className="text-sm font-semibold uppercase tracking-wider"
                  style={{ color: MANSORY.text }}
                >
                  Activité Live
                </h3>
              </div>
              <div 
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: MANSORY.success }}
              />
            </div>
            <ScrollArea className="h-[280px]">
              <div className="p-2">
                {activities?.map((activity) => (
                  <LiveActivityItem key={activity.id} activity={activity} />
                ))}
                {!activities?.length && (
                  <p className="text-center py-12 text-sm" style={{ color: MANSORY.textMuted }}>
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

        {/* Quick Actions Grid */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: MANSORY.goldMuted }}
              >
                <Zap size={16} style={{ color: MANSORY.gold }} />
              </div>
              <h2 
                className="text-xs font-semibold uppercase tracking-[0.2em]"
                style={{ color: MANSORY.textMuted }}
              >
                Actions rapides
              </h2>
            </div>
            <p className="text-[10px] tracking-wider" style={{ color: MANSORY.textMuted }}>
              ⌘ + lettre pour accès rapide
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <PremiumActionCard key={action.id} action={action} index={index} />
            ))}
          </div>
        </section>

        {/* Pro Tips - Luxury Edition */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl p-6"
          style={{ 
            background: `linear-gradient(135deg, ${MANSORY.goldMuted} 0%, transparent 100%)`,
            border: `1px solid ${MANSORY.border}`,
          }}
        >
          <div className="flex items-start gap-4">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: GRADIENTS.gold }}
            >
              <Sparkles size={20} className="text-black" />
            </div>
            <div className="flex-1">
              <h3 
                className="font-semibold mb-3"
                style={{ color: MANSORY.gold }}
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
                        background: GRADIENTS.gold,
                        color: MANSORY.bg,
                      }}
                    >
                      {item.step}
                    </span>
                    <div>
                      <p className="text-sm font-medium" style={{ color: MANSORY.text }}>
                        {item.action}
                      </p>
                      <p className="text-xs" style={{ color: MANSORY.textMuted }}>
                        {item.shortcut}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>
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
