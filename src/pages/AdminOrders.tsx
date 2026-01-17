/**
 * AdminOrders - Order Management with OMNIA Design System
 * 
 * Palette OMNIA:
 * - Obsidienne: #030303 (Fond principal)
 * - Champagne: #DCC7B0 (Accent principal)
 * - Ivoire: #FDFCFB (Texte & détails)
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  useIsAdmin, 
  useAllOrders, 
  useConfirmCODOrder, 
  useStartProduction,
  useMarkShipped,
  useMarkDelivered,
  useAdminUpdateOrder
} from "@/hooks/useAdmin";
import { getOrderStatusLabel, getOrderStatusColor } from "@/hooks/useOrders";
import { formatPrice } from "@/lib/pricing";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  CheckCircle2, 
  Factory, 
  Truck, 
  Package, 
  Download,
  Eye,
  XCircle,
  Loader2,
  StickyNote,
  Clock,
  MapPin,
  TrendingUp,
  Crown,
  CreditCard,
  MessageCircle,
  Phone,
  Pencil,
  Settings,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { Order } from "@/hooks/useOrders";
import { toast } from "sonner";
import { AdminOmniaLayout } from "@/layouts/AdminOmniaLayout";
import { useEffect } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// OMNIA PALETTE
// ═══════════════════════════════════════════════════════════════════════════
const OMNIA = {
  obsidienne: '#030303',
  obsidienneSurface: '#0A0A0A',
  obsidienneElevated: '#111111',
  champagne: '#DCC7B0',
  champagneMuted: 'rgba(220, 199, 176, 0.15)',
  ivoire: '#FDFCFB',
  ivoireMuted: 'rgba(253, 252, 251, 0.6)',
  ivoireSubtle: 'rgba(253, 252, 251, 0.4)',
  border: 'rgba(255, 255, 255, 0.05)',
  borderActive: 'rgba(220, 199, 176, 0.2)',
  success: '#4ADE80',
  successMuted: 'rgba(74, 222, 128, 0.15)',
  warning: '#FBBF24',
  warningMuted: 'rgba(251, 191, 36, 0.15)',
  info: '#60A5FA',
  infoMuted: 'rgba(96, 165, 250, 0.15)',
  purple: '#A78BFA',
  purpleMuted: 'rgba(167, 139, 250, 0.15)',
  danger: '#F87171',
  dangerMuted: 'rgba(248, 113, 113, 0.15)',
};

// Admin statistics hook
function useAdminStats() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    goldSubscribers: 0,
    cardsToProuce: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const { data: ordersData } = await supabase
          .from("orders")
          .select("total_price_cents, status");
        
        const totalRevenue = ordersData?.reduce((acc, o) => acc + (o.total_price_cents || 0), 0) || 0;
        const cardsToProuce = ordersData?.filter(o => 
          o.status === "pending" || o.status === "paid" || o.status === "in_production"
        ).length || 0;

        const { count: goldCount } = await supabase
          .from("subscriptions")
          .select("*", { count: "exact", head: true })
          .eq("plan", "premium")
          .eq("status", "active");

        setStats({
          totalRevenue,
          goldSubscribers: goldCount || 0,
          cardsToProuce
        });
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return { stats, loading };
}

// Stat Card Component - OMNIA Style
function OmniaStatCard({ 
  label, 
  value, 
  icon: Icon, 
  color,
  colorMuted,
}: { 
  label: string; 
  value: string | number; 
  icon: React.ElementType; 
  color: string;
  colorMuted: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl p-5"
      style={{ 
        background: `linear-gradient(135deg, ${OMNIA.obsidienneElevated} 0%, ${OMNIA.obsidienneSurface} 100%)`,
        border: `1px solid ${OMNIA.border}`,
      }}
    >
      <div 
        className="absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-30"
        style={{ backgroundColor: color }}
      />
      <div className="relative z-10 flex items-start gap-4">
        <div 
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: colorMuted }}
        >
          <Icon size={20} style={{ color }} />
        </div>
        <div>
          <p 
            className="text-2xl font-light tracking-tight"
            style={{ color: OMNIA.ivoire }}
          >
            {value}
          </p>
          <p 
            className="text-xs font-light uppercase tracking-wider mt-0.5"
            style={{ color: OMNIA.ivoireSubtle }}
          >
            {label}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// Pipeline Stage Component
function PipelineStage({ 
  label, 
  count, 
  icon: Icon, 
  color,
  colorMuted,
  isActive,
}: { 
  label: string; 
  count: number; 
  icon: React.ElementType; 
  color: string;
  colorMuted: string;
  isActive?: boolean;
}) {
  return (
    <div 
      className="flex flex-col items-center p-4 rounded-xl transition-all duration-300"
      style={{ 
        backgroundColor: isActive ? colorMuted : 'transparent',
        border: `1px solid ${isActive ? color + '40' : OMNIA.border}`,
      }}
    >
      <Icon size={18} className="mb-2" style={{ color }} />
      <p 
        className="text-xl font-light"
        style={{ color: OMNIA.ivoire }}
      >
        {count}
      </p>
      <p 
        className="text-[10px] uppercase tracking-widest mt-1"
        style={{ color: OMNIA.ivoireSubtle }}
      >
        {label}
      </p>
    </div>
  );
}

export default function AdminOrders() {
  const navigate = useNavigate();
  const { data: isAdmin, isLoading: checkingAdmin } = useIsAdmin();
  const { data: orders, isLoading: loadingOrders } = useAllOrders();
  const { stats, loading: loadingStats } = useAdminStats();
  
  const confirmOrder = useConfirmCODOrder();
  const startProduction = useStartProduction();
  const markShipped = useMarkShipped();
  const markDelivered = useMarkDelivered();
  const updateOrder = useAdminUpdateOrder();
  
  // Dialog states
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [shipDialogOpen, setShipDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [editStatus, setEditStatus] = useState<string>("");
  const [editTracking, setEditTracking] = useState("");

  // Download logo helper
  const handleDownloadLogo = async (order: Order) => {
    if (!order.logo_url) {
      toast.error("Aucun logo disponible pour cette commande");
      return;
    }
    
    try {
      const response = await fetch(order.logo_url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `logo-${order.order_number}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Logo téléchargé");
    } catch (error) {
      console.error("Error downloading logo:", error);
      toast.error("Erreur lors du téléchargement");
    }
  };

  // Generate WhatsApp confirmation message
  const generateWhatsAppLink = (order: Order) => {
    const phone = order.shipping_phone?.replace(/[\s\-\.\(\)]/g, "") || "";
    const cleanPhone = phone.startsWith("+") ? phone.slice(1) : phone;
    
    const productType = getProductTypeLabel(order);
    const productName = productType.label;
    
    const message = encodeURIComponent(
      `Bonjour ${order.shipping_name || ""},\n\n` +
      `Ici l'équipe i-wasp Maroc 🐝\n\n` +
      `Nous avons bien reçu votre commande :\n\n` +
      `📦 ${productName} (x${order.quantity})\n` +
      `📍 Livraison à : ${order.shipping_city || "Maroc"}\n\n` +
      `Pour valider l'envoi et lancer la gravure personnalisée, merci de confirmer par un simple *OUI* ou un 👍\n\n` +
      `Votre profil digital est déjà prêt à configurer !\n\n` +
      `Merci de votre confiance,\n` +
      `L'équipe i-wasp`
    );
    
    return `https://wa.me/${cleanPhone}?text=${message}`;
  };

  // Get product type label
  const getProductTypeLabel = (order: Order) => {
    const items = order.order_items as any[];
    if (items && items.length > 0) {
      const hasNails = items.some(item => 
        item.name?.toLowerCase().includes("nail") || 
        item.name?.toLowerCase().includes("ongle")
      );
      if (hasNails) return { label: "Ongles NFC", color: OMNIA.purple };
    }
    return { label: "Carte NFC", color: OMNIA.info };
  };
  
  // Handle view order details
  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setDetailsDialogOpen(true);
  };

  // Handle open edit dialog
  const handleOpenEdit = (order: Order) => {
    setSelectedOrder(order);
    setEditStatus(order.status);
    setEditTracking(order.tracking_number || "");
    setEditDialogOpen(true);
  };

  // Handle save edit
  const handleSaveEdit = () => {
    if (selectedOrder) {
      const updates: any = { 
        status: editStatus,
        tracking_number: editTracking || null 
      };
      
      if (editStatus === "paid" && selectedOrder.status !== "paid") {
        updates.paid_at = new Date().toISOString();
      }
      if (editStatus === "in_production" && selectedOrder.status !== "in_production") {
        updates.production_started_at = new Date().toISOString();
      }
      if (editStatus === "shipped" && selectedOrder.status !== "shipped") {
        updates.shipped_at = new Date().toISOString();
      }
      if (editStatus === "delivered" && selectedOrder.status !== "delivered") {
        updates.delivered_at = new Date().toISOString();
      }
      
      updateOrder.mutate({
        orderId: selectedOrder.id,
        updates
      });
      setEditDialogOpen(false);
    }
  };
  
  // Handle open notes dialog
  const handleOpenNotes = (order: Order) => {
    setSelectedOrder(order);
    setAdminNotes((order as any).admin_notes || "");
    setNotesDialogOpen(true);
  };
  
  // Handle save notes
  const handleSaveNotes = () => {
    if (selectedOrder) {
      updateOrder.mutate({
        orderId: selectedOrder.id,
        updates: { admin_notes: adminNotes } as any
      });
      setNotesDialogOpen(false);
      toast.success("Notes enregistrées");
    }
  };
  
  // Handle shipping dialog
  const handleOpenShipDialog = (order: Order) => {
    setSelectedOrder(order);
    setTrackingNumber("");
    setShipDialogOpen(true);
  };
  
  const handleConfirmShip = () => {
    if (selectedOrder) {
      markShipped.mutate({ 
        orderId: selectedOrder.id, 
        trackingNumber: trackingNumber || undefined 
      });
      setShipDialogOpen(false);
    }
  };
  
  // Handle reject order
  const handleRejectOrder = (order: Order) => {
    if (confirm(`Rejeter la commande ${order.order_number} ?`)) {
      updateOrder.mutate({
        orderId: order.id,
        updates: { admin_notes: `[REJETÉE] ${(order as any).admin_notes || ""}` } as any
      });
      toast.info("Commande marquée comme rejetée");
    }
  };

  // Export CSV function
  const handleExportCSV = () => {
    if (!orders || orders.length === 0) {
      toast.error("Aucune commande à exporter");
      return;
    }

    const getCardTypeForExport = (template: string): string => {
      if (template.includes("airbnb") || template.includes("hotel") || template.includes("rental") || template.includes("booking")) {
        return "Airbnb / Booking";
      }
      if (template.includes("employee") || template.includes("salari")) {
        return "Salarié";
      }
      return "Business";
    };

    const getOfferFromPrice = (priceCents: number): string => {
      if (priceCents === 0) return "Free";
      if (priceCents <= 15000) return "Gold";
      return "Premium";
    };

    const getStatusEmoji = (status: string): string => {
      switch (status) {
        case "pending": return "🟡 Nouvelle";
        case "paid": return "🟠 En cours";
        case "in_production": return "🟠 En cours";
        case "shipped": return "🟢 Prête";
        case "delivered": return "🔴 Livrée";
        default: return status;
      }
    };

    const headers = [
      "Nom du client",
      "Téléphone",
      "Type de carte",
      "Offre",
      "Prix (MAD)",
      "Mode de paiement",
      "Statut",
      "Lien carte i-wasp.com",
      "Date",
      "Remarque"
    ];

    const rows = orders.map(order => {
      const cardType = getCardTypeForExport(order.template);
      const offer = getOfferFromPrice(order.total_price_cents);
      const priceMad = Math.round(order.total_price_cents / 100).toString();
      const paymentMode = order.payment_method === "cod" ? "Cash" : (order.payment_method || "Cash");
      const status = getStatusEmoji(order.status);
      const cardLink = `https://i-wasp.com/c/${order.order_number}`;
      const date = format(new Date(order.created_at), "dd/MM/yyyy", { locale: fr });
      const notes = (order as any).admin_notes || "";

      return [
        order.shipping_name || "",
        order.shipping_phone || "",
        cardType,
        offer,
        priceMad,
        paymentMode,
        status,
        cardLink,
        date,
        notes
      ];
    });

    const csvContent = [
      headers.join("\t"),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join("\t"))
    ].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `commandes-iwasp-${format(new Date(), "yyyy-MM-dd")}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`${orders.length} commandes exportées`);
  };
  
  // Stats
  const pendingCount = orders?.filter(o => o.status === "pending").length || 0;
  const confirmedCount = orders?.filter(o => o.status === "paid").length || 0;
  const productionCount = orders?.filter(o => o.status === "in_production").length || 0;
  const shippedCount = orders?.filter(o => o.status === "shipped").length || 0;
  const deliveredCount = orders?.filter(o => o.status === "delivered").length || 0;

  // Get order status for OMNIA
  const getOmniaStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return { bg: OMNIA.warningMuted, text: OMNIA.warning };
      case 'paid': return { bg: OMNIA.infoMuted, text: OMNIA.info };
      case 'in_production': return { bg: OMNIA.purpleMuted, text: OMNIA.purple };
      case 'shipped': return { bg: OMNIA.champagneMuted, text: OMNIA.champagne };
      case 'delivered': return { bg: OMNIA.successMuted, text: OMNIA.success };
      default: return { bg: OMNIA.border, text: OMNIA.ivoireMuted };
    }
  };

  return (
    <AdminOmniaLayout title="Commandes" subtitle="Gestion des commandes">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <OmniaStatCard
            label="Chiffre d'affaires"
            value={loadingStats ? "..." : formatPrice(stats.totalRevenue)}
            icon={TrendingUp}
            color={OMNIA.champagne}
            colorMuted={OMNIA.champagneMuted}
          />
          <OmniaStatCard
            label="Abonnés GOLD"
            value={loadingStats ? "..." : stats.goldSubscribers}
            icon={Crown}
            color={OMNIA.warning}
            colorMuted={OMNIA.warningMuted}
          />
          <OmniaStatCard
            label="Cartes à produire"
            value={loadingStats ? "..." : stats.cardsToProuce}
            icon={CreditCard}
            color={OMNIA.purple}
            colorMuted={OMNIA.purpleMuted}
          />
        </div>

        {/* Pipeline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-5"
          style={{ 
            background: `linear-gradient(135deg, ${OMNIA.obsidienneElevated} 0%, ${OMNIA.obsidienneSurface} 100%)`,
            border: `1px solid ${OMNIA.border}`,
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 
              className="text-sm font-medium uppercase tracking-wider"
              style={{ color: OMNIA.champagne }}
            >
              Pipeline
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExportCSV}
              className="text-xs"
              style={{ color: OMNIA.ivoireMuted }}
            >
              <Download size={14} className="mr-2" />
              Export CSV
            </Button>
          </div>
          
          <div className="grid grid-cols-5 gap-2">
            <PipelineStage label="Attente" count={pendingCount} icon={Clock} color={OMNIA.warning} colorMuted={OMNIA.warningMuted} isActive={pendingCount > 0} />
            <PipelineStage label="Confirmées" count={confirmedCount} icon={CheckCircle2} color={OMNIA.info} colorMuted={OMNIA.infoMuted} />
            <PipelineStage label="Production" count={productionCount} icon={Settings} color={OMNIA.purple} colorMuted={OMNIA.purpleMuted} />
            <PipelineStage label="Expédiées" count={shippedCount} icon={Truck} color={OMNIA.champagne} colorMuted={OMNIA.champagneMuted} />
            <PipelineStage label="Livrées" count={deliveredCount} icon={Package} color={OMNIA.success} colorMuted={OMNIA.successMuted} />
          </div>
        </motion.div>

        {/* Orders List */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl overflow-hidden"
          style={{ 
            background: OMNIA.obsidienneElevated,
            border: `1px solid ${OMNIA.border}`,
          }}
        >
          <div className="p-5 border-b" style={{ borderColor: OMNIA.border }}>
            <h3 
              className="text-sm font-medium uppercase tracking-wider"
              style={{ color: OMNIA.champagne }}
            >
              Toutes les commandes
            </h3>
            <p className="text-xs mt-1" style={{ color: OMNIA.ivoireSubtle }}>
              {orders?.length || 0} commandes au total
            </p>
          </div>

          {loadingOrders ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin" style={{ color: OMNIA.champagne }} />
            </div>
          ) : orders && orders.length > 0 ? (
            <div className="divide-y" style={{ borderColor: OMNIA.border }}>
              {orders.map((order, index) => {
                const statusColor = getOmniaStatusColor(order.status);
                const productType = getProductTypeLabel(order);
                
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="p-4 hover:bg-white/[0.02] transition-colors"
                    style={{ borderColor: OMNIA.border }}
                  >
                    <div className="flex items-center gap-4">
                      {/* Order Number & Status */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <span 
                            className="font-mono text-sm font-medium"
                            style={{ color: OMNIA.ivoire }}
                          >
                            #{order.order_number}
                          </span>
                          <span 
                            className="text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider"
                            style={{ backgroundColor: statusColor.bg, color: statusColor.text }}
                          >
                            {getOrderStatusLabel(order.status)}
                          </span>
                          {(order as any).admin_notes && (
                            <StickyNote size={12} style={{ color: OMNIA.warning }} />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs" style={{ color: OMNIA.ivoireMuted }}>
                          <span>{order.shipping_name}</span>
                          <span>·</span>
                          <MapPin size={10} />
                          <span>{order.shipping_city}</span>
                          <span>·</span>
                          <span style={{ color: productType.color }}>{productType.label}</span>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p 
                          className="font-medium"
                          style={{ color: OMNIA.champagne }}
                        >
                          {formatPrice(order.total_price_cents)}
                        </p>
                        <p className="text-[10px]" style={{ color: OMNIA.ivoireSubtle }}>
                          {format(new Date(order.created_at), "dd/MM/yy", { locale: fr })}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1">
                        {order.shipping_phone && (
                          <>
                            <a
                              href={generateWhatsAppLink(order)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg transition-colors"
                              style={{ backgroundColor: OMNIA.successMuted }}
                              title="WhatsApp"
                            >
                              <MessageCircle size={14} style={{ color: OMNIA.success }} />
                            </a>
                            <a
                              href={`tel:${order.shipping_phone}`}
                              className="p-2 rounded-lg transition-colors"
                              style={{ backgroundColor: OMNIA.infoMuted }}
                              title="Appeler"
                            >
                              <Phone size={14} style={{ color: OMNIA.info }} />
                            </a>
                          </>
                        )}
                        
                        <button
                          onClick={() => handleOpenEdit(order)}
                          className="p-2 rounded-lg transition-colors hover:bg-white/5"
                          title="Modifier"
                        >
                          <Pencil size={14} style={{ color: OMNIA.ivoireMuted }} />
                        </button>
                        
                        <button
                          onClick={() => handleOpenNotes(order)}
                          className="p-2 rounded-lg transition-colors hover:bg-white/5"
                          title="Notes"
                        >
                          <StickyNote size={14} style={{ color: OMNIA.ivoireMuted }} />
                        </button>
                        
                        <button
                          onClick={() => handleViewDetails(order)}
                          className="p-2 rounded-lg transition-colors hover:bg-white/5"
                          title="Détails"
                        >
                          <Eye size={14} style={{ color: OMNIA.ivoireMuted }} />
                        </button>

                        {/* Status actions */}
                        {order.status === "pending" && (
                          <>
                            <button
                              onClick={() => confirmOrder.mutate(order.id)}
                              disabled={confirmOrder.isPending}
                              className="p-2 rounded-lg transition-colors"
                              style={{ backgroundColor: OMNIA.successMuted }}
                              title="Confirmer"
                            >
                              <CheckCircle2 size={14} style={{ color: OMNIA.success }} />
                            </button>
                            <button
                              onClick={() => handleRejectOrder(order)}
                              className="p-2 rounded-lg transition-colors"
                              style={{ backgroundColor: OMNIA.dangerMuted }}
                              title="Rejeter"
                            >
                              <XCircle size={14} style={{ color: OMNIA.danger }} />
                            </button>
                          </>
                        )}
                        
                        {order.status === "paid" && (
                          <button
                            onClick={() => startProduction.mutate(order.id)}
                            disabled={startProduction.isPending}
                            className="p-2 rounded-lg transition-colors"
                            style={{ backgroundColor: OMNIA.purpleMuted }}
                            title="Production"
                          >
                            <Factory size={14} style={{ color: OMNIA.purple }} />
                          </button>
                        )}
                        
                        {order.status === "in_production" && (
                          <button
                            onClick={() => handleOpenShipDialog(order)}
                            disabled={markShipped.isPending}
                            className="p-2 rounded-lg transition-colors"
                            style={{ backgroundColor: OMNIA.champagneMuted }}
                            title="Expédier"
                          >
                            <Truck size={14} style={{ color: OMNIA.champagne }} />
                          </button>
                        )}
                        
                        {order.status === "shipped" && (
                          <button
                            onClick={() => markDelivered.mutate(order.id)}
                            disabled={markDelivered.isPending}
                            className="p-2 rounded-lg transition-colors"
                            style={{ backgroundColor: OMNIA.successMuted }}
                            title="Livré"
                          >
                            <Package size={14} style={{ color: OMNIA.success }} />
                          </button>
                        )}

                        <ChevronRight size={14} style={{ color: OMNIA.ivoireSubtle }} />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12" style={{ color: OMNIA.ivoireSubtle }}>
              Aucune commande pour le moment
            </div>
          )}
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          DIALOGS - OMNIA Style
          ═══════════════════════════════════════════════════════════════════ */}
      
      {/* Order Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="bg-omnia-obsidienne-surface border-white/10 text-omnia-ivoire">
          <DialogHeader>
            <DialogTitle className="text-omnia-champagne">
              Détails commande {selectedOrder?.order_number}
            </DialogTitle>
            <DialogDescription className="text-omnia-ivoire-muted">
              Informations complètes
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-omnia-ivoire-muted text-xs uppercase tracking-wider mb-1">Statut</p>
                  <span 
                    className="text-xs px-2 py-1 rounded-full"
                    style={{ 
                      backgroundColor: getOmniaStatusColor(selectedOrder.status).bg,
                      color: getOmniaStatusColor(selectedOrder.status).text
                    }}
                  >
                    {getOrderStatusLabel(selectedOrder.status)}
                  </span>
                </div>
                <div>
                  <p className="text-omnia-ivoire-muted text-xs uppercase tracking-wider mb-1">Date</p>
                  <p className="font-medium">
                    {format(new Date(selectedOrder.created_at), "dd MMMM yyyy", { locale: fr })}
                  </p>
                </div>
                <div>
                  <p className="text-omnia-ivoire-muted text-xs uppercase tracking-wider mb-1">Quantité</p>
                  <p className="font-medium">{selectedOrder.quantity} carte(s)</p>
                </div>
                <div>
                  <p className="text-omnia-ivoire-muted text-xs uppercase tracking-wider mb-1">Total</p>
                  <p className="font-medium text-omnia-champagne">{formatPrice(selectedOrder.total_price_cents)}</p>
                </div>
              </div>
              
              <div className="border-t border-white/10 pt-4">
                <p className="text-omnia-ivoire-muted text-xs uppercase tracking-wider mb-2">Livraison</p>
                <div className="bg-white/5 rounded-xl p-3 text-sm">
                  <p className="font-medium">{selectedOrder.shipping_name}</p>
                  <p className="text-omnia-ivoire-muted">{selectedOrder.shipping_address}</p>
                  <p className="text-omnia-ivoire-muted">{selectedOrder.shipping_postal_code} {selectedOrder.shipping_city}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDetailsDialogOpen(false)}
              className="border-white/10 text-omnia-ivoire hover:bg-white/5"
            >
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Admin Notes Dialog */}
      <Dialog open={notesDialogOpen} onOpenChange={setNotesDialogOpen}>
        <DialogContent className="bg-omnia-obsidienne-surface border-white/10 text-omnia-ivoire">
          <DialogHeader>
            <DialogTitle className="text-omnia-champagne">Notes internes</DialogTitle>
            <DialogDescription className="text-omnia-ivoire-muted">
              Commande {selectedOrder?.order_number}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Ajoutez des notes..."
              className="min-h-[120px] bg-white/5 border-white/10 text-omnia-ivoire placeholder:text-omnia-ivoire-muted"
            />
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setNotesDialogOpen(false)}
              className="border-white/10 text-omnia-ivoire hover:bg-white/5"
            >
              Annuler
            </Button>
            <Button 
              onClick={handleSaveNotes} 
              disabled={updateOrder.isPending}
              className="bg-omnia-champagne text-omnia-obsidienne hover:bg-omnia-champagne/90"
            >
              {updateOrder.isPending ? "..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Shipping Dialog */}
      <Dialog open={shipDialogOpen} onOpenChange={setShipDialogOpen}>
        <DialogContent className="bg-omnia-obsidienne-surface border-white/10 text-omnia-ivoire">
          <DialogHeader>
            <DialogTitle className="text-omnia-champagne">Expédier la commande</DialogTitle>
            <DialogDescription className="text-omnia-ivoire-muted">
              {selectedOrder?.order_number} - {selectedOrder?.quantity} carte(s)
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="bg-white/5 rounded-xl p-3 text-sm">
              <p className="font-medium">{selectedOrder?.shipping_name}</p>
              <p className="text-omnia-ivoire-muted">{selectedOrder?.shipping_address}</p>
              <p className="text-omnia-ivoire-muted">{selectedOrder?.shipping_postal_code} {selectedOrder?.shipping_city}</p>
            </div>
            <div>
              <Label className="text-omnia-ivoire-muted text-xs uppercase tracking-wider">
                Numéro de suivi (optionnel)
              </Label>
              <Input
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Ex: MA123456789"
                className="mt-2 bg-white/5 border-white/10 text-omnia-ivoire"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShipDialogOpen(false)}
              className="border-white/10 text-omnia-ivoire hover:bg-white/5"
            >
              Annuler
            </Button>
            <Button 
              onClick={handleConfirmShip} 
              disabled={markShipped.isPending}
              className="bg-omnia-champagne text-omnia-obsidienne hover:bg-omnia-champagne/90"
            >
              <Truck className="h-4 w-4 mr-2" />
              {markShipped.isPending ? "..." : "Confirmer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Status Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-omnia-obsidienne-surface border-white/10 text-omnia-ivoire">
          <DialogHeader>
            <DialogTitle className="text-omnia-champagne">Modifier la commande</DialogTitle>
            <DialogDescription className="text-omnia-ivoire-muted">
              {selectedOrder?.order_number}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label className="text-omnia-ivoire-muted text-xs uppercase tracking-wider">Statut</Label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="mt-2 w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-omnia-ivoire text-sm"
              >
                <option value="pending">🟡 En attente</option>
                <option value="paid">🔵 Confirmée</option>
                <option value="in_production">🟣 Production</option>
                <option value="shipped">🔷 Expédiée</option>
                <option value="delivered">🟢 Livrée</option>
              </select>
            </div>
            <div>
              <Label className="text-omnia-ivoire-muted text-xs uppercase tracking-wider">Numéro de suivi</Label>
              <Input
                value={editTracking}
                onChange={(e) => setEditTracking(e.target.value)}
                placeholder="Ex: MA123456789"
                className="mt-2 bg-white/5 border-white/10 text-omnia-ivoire"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setEditDialogOpen(false)}
              className="border-white/10 text-omnia-ivoire hover:bg-white/5"
            >
              Annuler
            </Button>
            <Button 
              onClick={handleSaveEdit} 
              disabled={updateOrder.isPending}
              className="bg-omnia-champagne text-omnia-obsidienne hover:bg-omnia-champagne/90"
            >
              {updateOrder.isPending ? "..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminOmniaLayout>
  );
}
