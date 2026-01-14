/**
 * Admin Web Studio Orders - Dashboard pour gérer les commandes de sites web
 */

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminGuard } from "@/components/AdminGuard";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Globe,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  MessageCircle,
  Mail,
  ArrowLeft,
  Zap,
  RefreshCw,
  Search,
  Filter,
  TrendingUp,
  Calendar,
  DollarSign,
  FileText
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const COLORS = {
  noir: "#050505",
  noirSoft: "#0A0A0A",
  noirCard: "#111111",
  or: "#D4A853",
  orLight: "#E8C87A",
  ivoire: "#F5F5F5",
  gris: "#6B6B6B",
  border: "#1A1A1A",
  success: "#22C55E",
  warning: "#F59E0B",
  error: "#EF4444",
};

interface WebsiteProposal {
  id: string;
  form_data: {
    businessType?: string;
    businessName?: string;
    description?: string;
    style?: string;
    colors?: string;
    websiteUrl?: string;
    socialLinks?: string;
  };
  proposal: {
    siteName?: string;
    tagline?: string;
    estimatedPages?: number;
    complexity?: string;
    features?: string[];
    colorPalette?: {
      primary?: string;
      secondary?: string;
    };
  };
  session_id: string | null;
  is_express: boolean | null;
  price_eur: number | null;
  price_mad: number | null;
  status: string | null;
  created_at: string;
  updated_at: string;
  user_id: string | null;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  generated: { label: "Généré", color: COLORS.gris, icon: FileText },
  ordered: { label: "Commandé", color: COLORS.warning, icon: Package },
  in_progress: { label: "En cours", color: COLORS.or, icon: Clock },
  review: { label: "En révision", color: "#3B82F6", icon: Eye },
  completed: { label: "Terminé", color: COLORS.success, icon: CheckCircle2 },
  cancelled: { label: "Annulé", color: COLORS.error, icon: XCircle },
};

function AdminWebStudioOrdersContent() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<WebsiteProposal | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch all website proposals with status "ordered" or other non-generated statuses
  const { data: orders, isLoading, refetch } = useQuery({
    queryKey: ["admin-webstudio-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("website_proposals")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as WebsiteProposal[];
    },
  });

  // Update order status
  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("website_proposals")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-webstudio-orders"] });
      toast.success("Statut mis à jour");
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour");
    },
  });

  // Filter orders
  const filteredOrders = orders?.filter((order) => {
    const matchesSearch = 
      order.proposal?.siteName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.form_data?.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.form_data?.businessType?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Statistics
  const stats = {
    total: orders?.length || 0,
    ordered: orders?.filter((o) => o.status === "ordered").length || 0,
    inProgress: orders?.filter((o) => o.status === "in_progress").length || 0,
    completed: orders?.filter((o) => o.status === "completed").length || 0,
    totalRevenue: orders?.reduce((sum, o) => sum + (o.price_eur || 0), 0) || 0,
  };

  const handleContactWhatsApp = (order: WebsiteProposal) => {
    const message = encodeURIComponent(
      `🚀 Suivi commande Web Studio\n\n` +
      `📌 Projet: ${order.proposal?.siteName || order.form_data?.businessName}\n` +
      `📄 Pages: ${order.proposal?.estimatedPages || "N/A"}\n` +
      `💰 Prix: ${order.price_eur}€\n\n` +
      `Je vous contacte concernant votre commande...`
    );
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.noir }}>
      {/* Header */}
      <header 
        className="sticky top-0 z-50 backdrop-blur-xl border-b"
        style={{ 
          backgroundColor: `${COLORS.noir}90`,
          borderColor: COLORS.border 
        }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/admin">
                <Button variant="ghost" size="sm" className="gap-2" style={{ color: COLORS.gris }}>
                  <ArrowLeft size={16} />
                  Retour
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-medium flex items-center gap-2" style={{ color: COLORS.ivoire }}>
                  <Globe size={24} style={{ color: COLORS.or }} />
                  Web Studio - Commandes
                </h1>
                <p className="text-sm" style={{ color: COLORS.gris }}>
                  Gérez les commandes de sites web
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refetch()}
              className="gap-2"
              style={{ borderColor: COLORS.border, color: COLORS.ivoire }}
            >
              <RefreshCw size={14} />
              Actualiser
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Total", value: stats.total, icon: FileText, color: COLORS.gris },
            { label: "Commandés", value: stats.ordered, icon: Package, color: COLORS.warning },
            { label: "En cours", value: stats.inProgress, icon: Clock, color: COLORS.or },
            { label: "Terminés", value: stats.completed, icon: CheckCircle2, color: COLORS.success },
            { label: "Revenue", value: `${stats.totalRevenue}€`, icon: DollarSign, color: COLORS.or },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card style={{ backgroundColor: COLORS.noirCard, borderColor: COLORS.border }}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon size={18} style={{ color: stat.color }} />
                    <span className="text-2xl font-light" style={{ color: COLORS.ivoire }}>
                      {stat.value}
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: COLORS.gris }}>{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: COLORS.gris }} />
            <Input
              placeholder="Rechercher par nom de projet..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              style={{ 
                backgroundColor: COLORS.noirCard, 
                borderColor: COLORS.border,
                color: COLORS.ivoire 
              }}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger 
              className="w-full md:w-48"
              style={{ backgroundColor: COLORS.noirCard, borderColor: COLORS.border, color: COLORS.ivoire }}
            >
              <Filter size={14} className="mr-2" />
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent style={{ backgroundColor: COLORS.noirCard, borderColor: COLORS.border }}>
              <SelectItem value="all">Tous les statuts</SelectItem>
              {Object.entries(statusConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>{config.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i} 
                className="h-32 rounded-xl animate-pulse"
                style={{ backgroundColor: COLORS.noirCard }}
              />
            ))}
          </div>
        ) : filteredOrders && filteredOrders.length > 0 ? (
          <div className="grid gap-4">
            <AnimatePresence>
              {filteredOrders.map((order, index) => {
                const status = statusConfig[order.status || "generated"];
                const StatusIcon = status?.icon || FileText;
                
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <Card 
                      className="cursor-pointer transition-all duration-300 hover:scale-[1.01]"
                      style={{ 
                        backgroundColor: COLORS.noirCard, 
                        borderColor: order.status === "ordered" ? `${COLORS.or}40` : COLORS.border,
                      }}
                      onClick={() => setSelectedOrder(order)}
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div 
                              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: `${status?.color || COLORS.gris}20` }}
                            >
                              <StatusIcon size={20} style={{ color: status?.color || COLORS.gris }} />
                            </div>
                            <div>
                              <h3 className="font-medium mb-1" style={{ color: COLORS.ivoire }}>
                                {order.proposal?.siteName || order.form_data?.businessName || "Projet sans nom"}
                              </h3>
                              <p className="text-sm mb-2" style={{ color: COLORS.gris }}>
                                {order.form_data?.businessType}
                              </p>
                              <div className="flex items-center gap-3 flex-wrap">
                                <Badge 
                                  variant="outline"
                                  style={{ 
                                    borderColor: status?.color,
                                    color: status?.color,
                                    backgroundColor: `${status?.color}10`
                                  }}
                                >
                                  {status?.label || "Généré"}
                                </Badge>
                                {order.is_express && (
                                  <Badge style={{ backgroundColor: `${COLORS.or}20`, color: COLORS.or }}>
                                    <Zap size={12} className="mr-1" />
                                    Express
                                  </Badge>
                                )}
                                <span className="text-xs" style={{ color: COLORS.gris }}>
                                  {order.proposal?.estimatedPages || "?"} pages
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-6 md:text-right">
                            <div>
                              <p className="text-lg font-medium" style={{ color: COLORS.or }}>
                                {order.price_eur || 0}€
                              </p>
                              <p className="text-xs" style={{ color: COLORS.gris }}>
                                {order.price_mad || 0} DH
                              </p>
                            </div>
                            <div>
                              <p className="text-sm" style={{ color: COLORS.ivoire }}>
                                {format(new Date(order.created_at), "dd MMM yyyy", { locale: fr })}
                              </p>
                              <p className="text-xs" style={{ color: COLORS.gris }}>
                                {format(new Date(order.created_at), "HH:mm", { locale: fr })}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <Card style={{ backgroundColor: COLORS.noirCard, borderColor: COLORS.border }}>
            <CardContent className="p-12 text-center">
              <Globe size={48} className="mx-auto mb-4" style={{ color: COLORS.gris }} />
              <h3 className="text-lg mb-2" style={{ color: COLORS.ivoire }}>
                Aucune commande trouvée
              </h3>
              <p className="text-sm" style={{ color: COLORS.gris }}>
                Les commandes Web Studio apparaîtront ici
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent 
          className="max-w-2xl max-h-[90vh] overflow-y-auto"
          style={{ backgroundColor: COLORS.noirCard, borderColor: COLORS.border }}
        >
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3" style={{ color: COLORS.ivoire }}>
                  <Globe size={24} style={{ color: COLORS.or }} />
                  {selectedOrder.proposal?.siteName || selectedOrder.form_data?.businessName}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 mt-4">
                {/* Status Update */}
                <div>
                  <label className="text-sm font-medium mb-2 block" style={{ color: COLORS.gris }}>
                    Statut
                  </label>
                  <Select 
                    value={selectedOrder.status || "generated"}
                    onValueChange={(value) => {
                      updateStatus.mutate({ id: selectedOrder.id, status: value });
                      setSelectedOrder({ ...selectedOrder, status: value });
                    }}
                  >
                    <SelectTrigger style={{ backgroundColor: COLORS.noirSoft, borderColor: COLORS.border, color: COLORS.ivoire }}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent style={{ backgroundColor: COLORS.noirCard, borderColor: COLORS.border }}>
                      {Object.entries(statusConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <config.icon size={14} style={{ color: config.color }} />
                            {config.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Project Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl" style={{ backgroundColor: COLORS.noirSoft }}>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: COLORS.gris }}>Type</p>
                    <p className="font-medium" style={{ color: COLORS.ivoire }}>
                      {selectedOrder.form_data?.businessType || "N/A"}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl" style={{ backgroundColor: COLORS.noirSoft }}>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: COLORS.gris }}>Pages</p>
                    <p className="font-medium" style={{ color: COLORS.ivoire }}>
                      {selectedOrder.proposal?.estimatedPages || "N/A"}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl" style={{ backgroundColor: COLORS.noirSoft }}>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: COLORS.gris }}>Prix EUR</p>
                    <p className="font-medium" style={{ color: COLORS.or }}>
                      {selectedOrder.price_eur || 0}€
                    </p>
                  </div>
                  <div className="p-4 rounded-xl" style={{ backgroundColor: COLORS.noirSoft }}>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: COLORS.gris }}>Prix MAD</p>
                    <p className="font-medium" style={{ color: COLORS.or }}>
                      {selectedOrder.price_mad || 0} DH
                    </p>
                  </div>
                </div>

                {/* Tagline */}
                {selectedOrder.proposal?.tagline && (
                  <div className="p-4 rounded-xl" style={{ backgroundColor: COLORS.noirSoft }}>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: COLORS.gris }}>Tagline</p>
                    <p style={{ color: COLORS.ivoire }}>{selectedOrder.proposal.tagline}</p>
                  </div>
                )}

                {/* Features */}
                {selectedOrder.proposal?.features && selectedOrder.proposal.features.length > 0 && (
                  <div>
                    <p className="text-xs uppercase tracking-wider mb-2" style={{ color: COLORS.gris }}>Fonctionnalités</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedOrder.proposal.features.map((feature, i) => (
                        <Badge 
                          key={i}
                          variant="outline"
                          style={{ borderColor: COLORS.border, color: COLORS.ivoire }}
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Colors */}
                {selectedOrder.proposal?.colorPalette && (
                  <div>
                    <p className="text-xs uppercase tracking-wider mb-2" style={{ color: COLORS.gris }}>Palette de couleurs</p>
                    <div className="flex gap-2">
                      {Object.entries(selectedOrder.proposal.colorPalette).map(([name, color]) => (
                        <div key={name} className="flex items-center gap-2">
                          <div 
                            className="w-6 h-6 rounded-full border"
                            style={{ backgroundColor: color as string, borderColor: COLORS.border }}
                          />
                          <span className="text-xs capitalize" style={{ color: COLORS.gris }}>{name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Express Badge */}
                {selectedOrder.is_express && (
                  <div 
                    className="p-4 rounded-xl flex items-center gap-3"
                    style={{ backgroundColor: `${COLORS.or}15`, borderColor: `${COLORS.or}40` }}
                  >
                    <Zap size={20} style={{ color: COLORS.or }} />
                    <div>
                      <p className="font-medium" style={{ color: COLORS.or }}>Livraison Express</p>
                      <p className="text-sm" style={{ color: COLORS.gris }}>24-48h demandée</p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4" style={{ borderTop: `1px solid ${COLORS.border}` }}>
                  <Button 
                    className="flex-1 gap-2"
                    style={{ 
                      backgroundColor: COLORS.or, 
                      color: COLORS.noir 
                    }}
                    onClick={() => handleContactWhatsApp(selectedOrder)}
                  >
                    <MessageCircle size={16} />
                    Contacter sur WhatsApp
                  </Button>
                  <Button 
                    variant="outline"
                    className="gap-2"
                    style={{ borderColor: COLORS.border, color: COLORS.ivoire }}
                    onClick={() => setSelectedOrder(null)}
                  >
                    Fermer
                  </Button>
                </div>

                {/* Metadata */}
                <div className="text-xs pt-4" style={{ color: COLORS.gris, borderTop: `1px solid ${COLORS.border}` }}>
                  <p>ID: {selectedOrder.id}</p>
                  <p>Session: {selectedOrder.session_id || "N/A"}</p>
                  <p>Créé le: {format(new Date(selectedOrder.created_at), "dd/MM/yyyy à HH:mm", { locale: fr })}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function AdminWebStudioOrders() {
  return (
    <AdminGuard>
      <AdminWebStudioOrdersContent />
    </AdminGuard>
  );
}
