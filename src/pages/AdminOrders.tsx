import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Shield,
  XCircle,
  Loader2,
  StickyNote,
  Clock,
  MapPin,
  User
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { Order } from "@/hooks/useOrders";
import { toast } from "sonner";

export default function AdminOrders() {
  const navigate = useNavigate();
  const { data: isAdmin, isLoading: checkingAdmin } = useIsAdmin();
  const { data: orders, isLoading: loadingOrders } = useAllOrders();
  
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
  const [adminNotes, setAdminNotes] = useState("");
  
  // Loading state
  if (checkingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  // Access denied
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
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
  
  // Handle view order details
  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setDetailsDialogOpen(true);
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
  
  // Handle reject order (set back to pending or mark as cancelled)
  const handleRejectOrder = (order: Order) => {
    if (confirm(`Rejeter la commande ${order.order_number} ?`)) {
      // For now, we just add a note - in production, you'd have a cancelled status
      updateOrder.mutate({
        orderId: order.id,
        updates: { admin_notes: `[REJETÉE] ${(order as any).admin_notes || ""}` } as any
      });
      toast.info("Commande marquée comme rejetée");
    }
  };
  
  // Get action buttons based on order status
  const getOrderActions = (order: Order) => {
    const actions: JSX.Element[] = [];
    
    // Always show notes and details buttons
    actions.push(
      <Button
        key="notes"
        size="sm"
        variant="ghost"
        onClick={() => handleOpenNotes(order)}
        title="Notes internes"
      >
        <StickyNote className="h-4 w-4" />
      </Button>,
      <Button
        key="details"
        size="sm"
        variant="ghost"
        onClick={() => handleViewDetails(order)}
        title="Voir détails"
      >
        <Eye className="h-4 w-4" />
      </Button>
    );
    
    switch (order.status) {
      case "pending":
        actions.push(
          <Button
            key="confirm"
            size="sm"
            onClick={() => confirmOrder.mutate(order.id)}
            disabled={confirmOrder.isPending}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle2 className="h-4 w-4 mr-1" />
            Confirmer
          </Button>,
          <Button
            key="reject"
            size="sm"
            variant="destructive"
            onClick={() => handleRejectOrder(order)}
          >
            <XCircle className="h-4 w-4 mr-1" />
            Rejeter
          </Button>
        );
        break;
      
      case "paid":
        actions.push(
          <Button
            key="production"
            size="sm"
            onClick={() => startProduction.mutate(order.id)}
            disabled={startProduction.isPending}
          >
            <Factory className="h-4 w-4 mr-1" />
            Production
          </Button>,
          <Button
            key="download"
            size="sm"
            variant="outline"
            onClick={() => {
              toast.info("Génération PDF en cours...");
              // TODO: Generate and download print PDF
              console.log("Download PDF for order:", order.order_number);
            }}
          >
            <Download className="h-4 w-4 mr-1" />
            PDF
          </Button>
        );
        break;
      
      case "in_production":
        actions.push(
          <Button
            key="ship"
            size="sm"
            onClick={() => handleOpenShipDialog(order)}
            disabled={markShipped.isPending}
          >
            <Truck className="h-4 w-4 mr-1" />
            Expédier
          </Button>,
          <Button
            key="download"
            size="sm"
            variant="outline"
            onClick={() => {
              toast.info("Génération PDF en cours...");
              console.log("Download PDF for order:", order.order_number);
            }}
          >
            <Download className="h-4 w-4 mr-1" />
            PDF
          </Button>
        );
        break;
      
      case "shipped":
        actions.push(
          <Button
            key="delivered"
            size="sm"
            onClick={() => markDelivered.mutate(order.id)}
            disabled={markDelivered.isPending}
            className="bg-green-600 hover:bg-green-700"
          >
            <Package className="h-4 w-4 mr-1" />
            Livré (Payé)
          </Button>
        );
        break;
      
      case "delivered":
        actions.push(
          <Badge key="done" variant="secondary" className="bg-green-100 text-green-800">
            ✓ Terminée
          </Badge>
        );
        break;
    }
    
    return actions;
  };
  
  // Stats
  const pendingCount = orders?.filter(o => o.status === "pending").length || 0;
  const confirmedCount = orders?.filter(o => o.status === "paid").length || 0;
  const productionCount = orders?.filter(o => o.status === "in_production").length || 0;
  const shippedCount = orders?.filter(o => o.status === "shipped").length || 0;
  const deliveredCount = orders?.filter(o => o.status === "delivered").length || 0;

  // Export CSV function
  const handleExportCSV = () => {
    if (!orders || orders.length === 0) {
      toast.error("Aucune commande à exporter");
      return;
    }

    const headers = [
      "N° Commande",
      "Date",
      "Client",
      "Email",
      "Téléphone",
      "Adresse",
      "Ville",
      "Code Postal",
      "Quantité",
      "Total (€)",
      "Statut",
      "Template",
      "Type"
    ];

    const rows = orders.map(order => [
      order.order_number,
      format(new Date(order.created_at), "dd/MM/yyyy HH:mm", { locale: fr }),
      order.shipping_name || "",
      order.customer_email || "",
      order.shipping_phone || "",
      order.shipping_address || "",
      order.shipping_city || "",
      order.shipping_postal_code || "",
      order.quantity.toString(),
      (order.total_price_cents / 100).toFixed(2),
      getOrderStatusLabel(order.status),
      order.template,
      order.order_type
    ]);

    const csvContent = [
      headers.join(";"),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(";"))
    ].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `iwasp-commandes-${format(new Date(), "yyyy-MM-dd")}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`${orders.length} commandes exportées`);
  };
  
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Shield className="h-8 w-8" />
              Administration des commandes
            </h1>
            <p className="text-muted-foreground mt-2">
              Gestion des commandes COD - Maroc
            </p>
          </div>
          <Button onClick={handleExportCSV} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exporter CSV
          </Button>
        </div>
        
        {/* Workflow reminder */}
        <Card className="mb-6 border-amber-200 bg-amber-50/50">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-amber-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-800">Rappel du workflow COD</p>
                <p className="text-amber-700">
                  En attente → <strong>Confirmée</strong> (admin) → Production → Expédiée → <strong>Livrée (Payé)</strong>
                </p>
                <p className="text-amber-600 mt-1">
                  ⚠️ Le PDF imprimeur n'est disponible qu'après confirmation de la commande
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-amber-600">{pendingCount}</div>
              <p className="text-sm text-muted-foreground">En attente</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">{confirmedCount}</div>
              <p className="text-sm text-muted-foreground">Confirmées</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-purple-600">{productionCount}</div>
              <p className="text-sm text-muted-foreground">En production</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-indigo-600">{shippedCount}</div>
              <p className="text-sm text-muted-foreground">Expédiées</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{orders?.length || 0}</div>
              <p className="text-sm text-muted-foreground">Total</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Toutes les commandes</CardTitle>
            <CardDescription>
              Confirmez les commandes COD avant de lancer la production
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingOrders ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : orders && orders.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>N° Commande</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Qté</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id} className={order.status === "pending" ? "bg-amber-50/50" : ""}>
                        <TableCell className="font-mono font-medium">
                          {order.order_number}
                          {(order as any).admin_notes && (
                            <StickyNote className="h-3 w-3 inline ml-1 text-amber-500" />
                          )}
                        </TableCell>
                        <TableCell className="text-sm">
                          {format(new Date(order.created_at), "dd/MM/yy", { locale: fr })}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{order.shipping_name}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {order.shipping_city}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {order.quantity}
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatPrice(order.total_price_cents)}
                        </TableCell>
                        <TableCell>
                          <Badge className={getOrderStatusColor(order.status)}>
                            {getOrderStatusLabel(order.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1 flex-wrap">
                            {getOrderActions(order)}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Aucune commande pour le moment
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Order Details Dialog */}
        <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Détails commande {selectedOrder?.order_number}</DialogTitle>
              <DialogDescription>
                Informations complètes de la commande
              </DialogDescription>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Statut</p>
                    <Badge className={getOrderStatusColor(selectedOrder.status)}>
                      {getOrderStatusLabel(selectedOrder.status)}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Date</p>
                    <p className="font-medium">
                      {format(new Date(selectedOrder.created_at), "dd MMMM yyyy à HH:mm", { locale: fr })}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Quantité</p>
                    <p className="font-medium">{selectedOrder.quantity} carte(s)</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total</p>
                    <p className="font-medium">{formatPrice(selectedOrder.total_price_cents)}</p>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <p className="text-muted-foreground text-sm mb-2">Livraison</p>
                  <div className="bg-muted/50 rounded-lg p-3 text-sm">
                    <p className="font-medium">{selectedOrder.shipping_name}</p>
                    <p>{selectedOrder.shipping_address}</p>
                    <p>{selectedOrder.shipping_postal_code} {selectedOrder.shipping_city}</p>
                    <p>{selectedOrder.shipping_country === "MA" ? "🇲🇦 Maroc" : selectedOrder.shipping_country}</p>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <p className="text-muted-foreground text-sm mb-2">Configuration carte</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Template</p>
                      <p className="font-medium">{selectedOrder.template}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Type</p>
                      <p className="font-medium capitalize">{selectedOrder.order_type}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Fond</p>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded border"
                          style={{ backgroundColor: selectedOrder.background_color || "#fff" }}
                        />
                        <span className="font-medium">{selectedOrder.background_type}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {selectedOrder.tracking_number && (
                  <div className="border-t pt-4">
                    <p className="text-muted-foreground text-sm mb-1">Numéro de suivi</p>
                    <p className="font-mono font-medium">{selectedOrder.tracking_number}</p>
                  </div>
                )}
                
                {(selectedOrder as any).admin_notes && (
                  <div className="border-t pt-4">
                    <p className="text-muted-foreground text-sm mb-1">Notes internes</p>
                    <p className="text-sm bg-amber-50 p-2 rounded">{(selectedOrder as any).admin_notes}</p>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setDetailsDialogOpen(false)}>
                Fermer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Admin Notes Dialog */}
        <Dialog open={notesDialogOpen} onOpenChange={setNotesDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Notes internes</DialogTitle>
              <DialogDescription>
                Commande {selectedOrder?.order_number} - Notes visibles uniquement par les admins
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="admin-notes">Notes</Label>
              <Textarea
                id="admin-notes"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Ajoutez des notes internes sur cette commande..."
                className="mt-2 min-h-[120px]"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNotesDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleSaveNotes} disabled={updateOrder.isPending}>
                {updateOrder.isPending ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Shipping Dialog */}
        <Dialog open={shipDialogOpen} onOpenChange={setShipDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Expédier la commande</DialogTitle>
              <DialogDescription>
                Commande {selectedOrder?.order_number} - {selectedOrder?.quantity} carte(s)
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="bg-muted/50 rounded-lg p-3 text-sm">
                <p className="font-medium">{selectedOrder?.shipping_name}</p>
                <p>{selectedOrder?.shipping_address}</p>
                <p>{selectedOrder?.shipping_postal_code} {selectedOrder?.shipping_city}</p>
              </div>
              <div>
                <Label htmlFor="tracking">Numéro de suivi (optionnel)</Label>
                <Input
                  id="tracking"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Ex: MA123456789"
                  className="mt-2"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShipDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleConfirmShip} disabled={markShipped.isPending}>
                <Truck className="h-4 w-4 mr-2" />
                {markShipped.isPending ? "Traitement..." : "Confirmer l'expédition"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
