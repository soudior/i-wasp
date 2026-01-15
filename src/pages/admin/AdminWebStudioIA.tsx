import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin } from "@/hooks/useAdmin";
import { AdminGuard } from "@/components/AdminGuard";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Eye,
  Edit,
  XCircle,
  CheckCircle,
  ExternalLink,
  Search,
  Loader2,
  RefreshCw,
  Package,
  Clock,
  Globe,
  Truck,
  Play,
  Sparkles,
  Wand2,
  AlertCircle
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type OrderStatus = "generated" | "pending" | "paid" | "in_production" | "live" | "delivered" | "cancelled";

interface WebStudioOrder {
  id: string;
  created_at: string;
  updated_at: string;
  status: string | null;
  form_data: {
    businessName?: string;
    email?: string;
    phone?: string;
    pack?: string;
    express?: boolean;
    industry?: string;
    description?: string;
    colorScheme?: string;
    [key: string]: unknown;
  };
  proposal: {
    designStyle?: string;
    pages?: string[];
    [key: string]: unknown;
  };
  price_mad: number | null;
  price_eur: number | null;
  is_express: boolean | null;
  admin_notes: string | null;
  generated_website?: {
    id: string;
    slug: string | null;
    preview_url: string | null;
    status: string;
    is_published: boolean | null;
  } | null;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  generated: { label: "Créé", color: "bg-gray-100 text-gray-800", icon: <Package className="h-3 w-3" /> },
  pending: { label: "En attente", color: "bg-yellow-100 text-yellow-800", icon: <Clock className="h-3 w-3" /> },
  paid: { label: "Payé", color: "bg-blue-100 text-blue-800", icon: <CheckCircle className="h-3 w-3" /> },
  in_production: { label: "En cours", color: "bg-purple-100 text-purple-800", icon: <Play className="h-3 w-3" /> },
  live: { label: "Live", color: "bg-green-100 text-green-800", icon: <Globe className="h-3 w-3" /> },
  delivered: { label: "Livré", color: "bg-emerald-100 text-emerald-800", icon: <Truck className="h-3 w-3" /> },
  cancelled: { label: "Annulé", color: "bg-red-100 text-red-800", icon: <XCircle className="h-3 w-3" /> },
};

const PACK_LABELS: Record<string, string> = {
  basic: "Basic",
  pro: "Pro",
  enterprise: "Enterprise",
};

export default function AdminWebStudioIA() {
  const { data: isAdmin, isLoading: isAdminLoading } = useIsAdmin();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [packFilter, setPackFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<WebStudioOrder | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editNotes, setEditNotes] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [generatingOrderId, setGeneratingOrderId] = useState<string | null>(null);

  // Fetch all orders
  const { data: orders, isLoading, refetch } = useQuery({
    queryKey: ["admin-webstudio-ia-orders"],
    queryFn: async () => {
      const { data: proposals, error } = await supabase
        .from("website_proposals")
        .select(`
          *,
          generated_websites (
            id,
            slug,
            preview_url,
            status,
            is_published
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      return (proposals || []).map(p => ({
        ...p,
        generated_website: Array.isArray(p.generated_websites) 
          ? p.generated_websites[0] || null 
          : p.generated_websites
      })) as WebStudioOrder[];
    },
    enabled: isAdmin === true,
  });

  // Update order mutation
  const updateOrder = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status?: string; notes?: string }) => {
      const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (status) updates.status = status;
      if (notes !== undefined) updates.admin_notes = notes;

      const { error } = await supabase
        .from("website_proposals")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-webstudio-ia-orders"] });
      toast.success("Commande mise à jour");
      setIsEditOpen(false);
    },
    onError: (error) => {
      toast.error("Erreur lors de la mise à jour");
      console.error(error);
    },
  });

  // Generate/Regenerate website mutation
  const generateWebsite = useMutation({
    mutationFn: async (order: WebStudioOrder) => {
      setGeneratingOrderId(order.id);
      
      // Prepare form data for generation
      const formData = order.form_data || {};
      const proposal = order.proposal || {};
      
      const response = await supabase.functions.invoke('generate-website', {
        body: {
          proposalId: order.id,
          businessName: formData.businessName || 'Mon Entreprise',
          industry: formData.industry || 'general',
          description: formData.description || '',
          pages: proposal.pages || ['Accueil', 'À propos', 'Contact'],
          designStyle: proposal.designStyle || 'modern',
          colorScheme: formData.colorScheme || 'blue',
          regenerate: !!order.generated_website
        }
      });

      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-webstudio-ia-orders"] });
      toast.success(data?.message || "Site généré avec succès !");
      setGeneratingOrderId(null);
    },
    onError: (error) => {
      console.error('Generate error:', error);
      toast.error("Erreur lors de la génération du site");
      setGeneratingOrderId(null);
    },
  });

  // Filter orders
  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    
    return orders.filter(order => {
      const matchesSearch = searchTerm === "" || 
        order.form_data?.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.form_data?.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      const matchesPack = packFilter === "all" || order.form_data?.pack === packFilter;
      
      return matchesSearch && matchesStatus && matchesPack;
    });
  }, [orders, searchTerm, statusFilter, packFilter]);

  // Stats
  const stats = useMemo(() => {
    if (!orders) return { total: 0, pending: 0, inProduction: 0, delivered: 0, revenue: 0 };
    
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === "pending" || o.status === "paid").length,
      inProduction: orders.filter(o => o.status === "in_production").length,
      delivered: orders.filter(o => o.status === "delivered" || o.status === "live").length,
      revenue: orders.reduce((sum, o) => sum + (o.price_mad || 0), 0),
    };
  }, [orders]);

  const handleViewDetails = (order: WebStudioOrder) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const handleEdit = (order: WebStudioOrder) => {
    setSelectedOrder(order);
    setEditNotes(order.admin_notes || "");
    setEditStatus(order.status || "generated");
    setIsEditOpen(true);
  };

  const handleSaveEdit = () => {
    if (!selectedOrder) return;
    updateOrder.mutate({
      id: selectedOrder.id,
      status: editStatus,
      notes: editNotes,
    });
  };

  const handleQuickStatus = (order: WebStudioOrder, newStatus: string) => {
    updateOrder.mutate({ id: order.id, status: newStatus });
  };

  const handleGenerateWebsite = (order: WebStudioOrder) => {
    generateWebsite.mutate(order);
  };

  if (isAdminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AdminGuard>
      <DashboardLayout>
        <div className="space-y-6 p-4 md:p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                Web Studio IA
              </h1>
              <p className="text-muted-foreground">Gérez les commandes de sites web IA</p>
            </div>
            <Button onClick={() => refetch()} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">Total commandes</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                <p className="text-xs text-muted-foreground">En attente</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-purple-600">{stats.inProduction}</div>
                <p className="text-xs text-muted-foreground">En production</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-green-600">{stats.revenue.toLocaleString()} MAD</div>
                <p className="text-xs text-muted-foreground">Revenus totaux</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par nom ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                      <SelectItem key={key} value={key}>{config.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={packFilter} onValueChange={setPackFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Pack" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les packs</SelectItem>
                    {Object.entries(PACK_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Orders Table */}
          <Card>
            <CardHeader>
              <CardTitle>Commandes ({filteredOrders.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucune commande trouvée
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Client</TableHead>
                        <TableHead>Pack</TableHead>
                        <TableHead>Prix</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Site</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order) => {
                        const statusConfig = STATUS_CONFIG[order.status || "generated"] || STATUS_CONFIG.generated;
                        const packLabel = PACK_LABELS[order.form_data?.pack || ""] || order.form_data?.pack || "N/A";
                        
                        return (
                          <TableRow key={order.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{order.form_data?.businessName || "Sans nom"}</div>
                                <div className="text-xs text-muted-foreground">{order.form_data?.email}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span>{packLabel}</span>
                                {order.is_express && (
                                  <Badge variant="secondary" className="text-xs">Express</Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="font-medium">{order.price_mad?.toLocaleString() || 0} MAD</span>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm">
                                {format(new Date(order.created_at), "dd MMM yyyy", { locale: fr })}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge className={`${statusConfig.color} flex items-center gap-1 w-fit`}>
                                {statusConfig.icon}
                                {statusConfig.label}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {order.generated_website?.preview_url ? (
                                <a
                                  href={order.generated_website.preview_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline flex items-center gap-1"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                  Voir
                                </a>
                              ) : (
                                <span className="text-muted-foreground text-sm">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleViewDetails(order)}
                                  title="Voir détails"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEdit(order)}
                                  title="Modifier"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                {order.status === "paid" && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleQuickStatus(order, "in_production")}
                                    title="Démarrer production"
                                    className="text-purple-600"
                                  >
                                    <Play className="h-4 w-4" />
                                  </Button>
                                )}
                                {order.status === "in_production" && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleQuickStatus(order, "live")}
                                    title="Mettre en ligne"
                                    className="text-green-600"
                                  >
                                    <Globe className="h-4 w-4" />
                                  </Button>
                                )}
                                {order.status === "live" && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleQuickStatus(order, "delivered")}
                                    title="Marquer comme livré"
                                    className="text-emerald-600"
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                )}
                                {/* Generate/Regenerate button */}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleGenerateWebsite(order)}
                                  disabled={generatingOrderId === order.id}
                                  title={order.generated_website ? "Régénérer le site" : "Générer le site"}
                                  className="text-primary"
                                >
                                  {generatingOrderId === order.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Wand2 className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Details Dialog */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Détails de la commande</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Client</label>
                    <p className="font-medium">{selectedOrder.form_data?.businessName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p>{selectedOrder.form_data?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Téléphone</label>
                    <p>{selectedOrder.form_data?.phone || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Pack</label>
                    <p>{PACK_LABELS[selectedOrder.form_data?.pack || ""] || selectedOrder.form_data?.pack}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Prix</label>
                    <p className="font-bold">{selectedOrder.price_mad?.toLocaleString()} MAD</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Date de création</label>
                    <p>{format(new Date(selectedOrder.created_at), "dd MMMM yyyy à HH:mm", { locale: fr })}</p>
                  </div>
                </div>
                
                {selectedOrder.proposal?.pages && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Pages demandées</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedOrder.proposal.pages.map((page, i) => (
                        <Badge key={i} variant="outline">{page}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedOrder.admin_notes && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Notes admin</label>
                    <p className="mt-1 p-3 bg-muted rounded-lg text-sm">{selectedOrder.admin_notes}</p>
                  </div>
                )}

                {/* Website Generation Section */}
                <div className="pt-4 border-t">
                  <label className="text-sm font-medium text-muted-foreground">Site web</label>
                  {selectedOrder.generated_website ? (
                    <div className="mt-2 space-y-3">
                      <div className="flex items-center gap-4">
                        <Badge>{selectedOrder.generated_website.status}</Badge>
                        {selectedOrder.generated_website.preview_url && (
                          <a
                            href={selectedOrder.generated_website.preview_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-1"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Ouvrir le site
                          </a>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGenerateWebsite(selectedOrder)}
                        disabled={generatingOrderId === selectedOrder.id}
                        className="w-full"
                      >
                        {generatingOrderId === selectedOrder.id ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Régénération en cours...
                          </>
                        ) : (
                          <>
                            <Wand2 className="h-4 w-4 mr-2" />
                            Régénérer le site
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="mt-2 space-y-3">
                      <Alert variant="default" className="bg-yellow-50 border-yellow-200">
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                        <AlertDescription className="text-yellow-800">
                          Aucun site n'a encore été généré pour cette commande.
                        </AlertDescription>
                      </Alert>
                      <Button
                        onClick={() => handleGenerateWebsite(selectedOrder)}
                        disabled={generatingOrderId === selectedOrder.id}
                        className="w-full"
                      >
                        {generatingOrderId === selectedOrder.id ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Génération en cours...
                          </>
                        ) : (
                          <>
                            <Wand2 className="h-4 w-4 mr-2" />
                            Générer le site maintenant
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier la commande</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Statut</label>
                  <Select value={editStatus} onValueChange={setEditStatus}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          <span className="flex items-center gap-2">
                            {config.icon}
                            {config.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Notes admin</label>
                  <Textarea
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Ajouter des notes internes..."
                    className="mt-1"
                    rows={4}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleSaveEdit} disabled={updateOrder.isPending}>
                {updateOrder.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Enregistrer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DashboardLayout>
    </AdminGuard>
  );
}
