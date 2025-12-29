import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  useIsAdmin, 
  useAllOrders, 
  useConfirmCODOrder, 
  useStartProduction,
  useMarkShipped,
  useMarkDelivered
} from "@/hooks/useAdmin";
import { getOrderStatusLabel, getOrderStatusColor } from "@/hooks/useOrders";
import { formatPrice } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
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
  Loader2
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { Order, OrderStatus } from "@/hooks/useOrders";

export default function AdminOrders() {
  const navigate = useNavigate();
  const { data: isAdmin, isLoading: checkingAdmin } = useIsAdmin();
  const { data: orders, isLoading: loadingOrders } = useAllOrders();
  
  const confirmOrder = useConfirmCODOrder();
  const startProduction = useStartProduction();
  const markShipped = useMarkShipped();
  const markDelivered = useMarkDelivered();
  
  // Dialog state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [shipDialogOpen, setShipDialogOpen] = useState(false);
  
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
  
  // Get action buttons based on order status
  const getOrderActions = (order: Order) => {
    const actions: JSX.Element[] = [];
    
    switch (order.status) {
      case "pending":
        actions.push(
          <Button
            key="confirm"
            size="sm"
            onClick={() => confirmOrder.mutate(order.id)}
            disabled={confirmOrder.isPending}
          >
            <CheckCircle2 className="h-4 w-4 mr-1" />
            Confirmer
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
            Démarrer production
          </Button>,
          <Button
            key="download"
            size="sm"
            variant="outline"
            onClick={() => {
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
          >
            <Package className="h-4 w-4 mr-1" />
            Livré
          </Button>
        );
        if (order.tracking_number) {
          actions.push(
            <Badge key="tracking" variant="outline" className="ml-2">
              {order.tracking_number}
            </Badge>
          );
        }
        break;
      
      case "delivered":
        actions.push(
          <Badge key="done" variant="secondary">
            ✓ Terminée
          </Badge>
        );
        break;
    }
    
    return actions;
  };
  
  // Stats
  const pendingCount = orders?.filter(o => o.status === "pending").length || 0;
  const productionCount = orders?.filter(o => o.status === "in_production").length || 0;
  const shippedCount = orders?.filter(o => o.status === "shipped").length || 0;
  
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8" />
            Administration des commandes
          </h1>
          <p className="text-muted-foreground mt-2">
            Gestion des commandes COD et production
          </p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-amber-600">{pendingCount}</div>
              <p className="text-sm text-muted-foreground">En attente</p>
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
              <p className="text-sm text-muted-foreground">Total commandes</p>
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>N° Commande</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Quantité</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono font-medium">
                        {order.order_number}
                      </TableCell>
                      <TableCell>
                        {format(new Date(order.created_at), "dd MMM yyyy", { locale: fr })}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.shipping_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.shipping_city}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {order.quantity} carte{order.quantity > 1 ? "s" : ""}
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
                        <div className="flex items-center gap-2">
                          {getOrderActions(order)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Aucune commande pour le moment
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Shipping Dialog */}
        <Dialog open={shipDialogOpen} onOpenChange={setShipDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Expédier la commande</DialogTitle>
              <DialogDescription>
                Commande {selectedOrder?.order_number} - {selectedOrder?.quantity} carte(s)
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <label className="text-sm font-medium">
                Numéro de suivi (optionnel)
              </label>
              <Input
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Entrez le numéro de suivi"
                className="mt-2"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShipDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleConfirmShip} disabled={markShipped.isPending}>
                <Truck className="h-4 w-4 mr-2" />
                Confirmer l'expédition
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
