import { Link } from "react-router-dom";
import { useUserOrders, getOrderStatusLabel, getOrderStatusColor } from "@/hooks/useOrders";
import { formatPrice } from "@/lib/pricing";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  ChevronRight, 
  ShoppingBag, 
  Clock,
  CheckCircle2,
  Truck,
  Factory,
  Loader2
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

// Status icon mapping
function getStatusIcon(status: string) {
  switch (status) {
    case "pending":
      return <Clock className="h-4 w-4" />;
    case "paid":
      return <CheckCircle2 className="h-4 w-4" />;
    case "in_production":
      return <Factory className="h-4 w-4" />;
    case "shipped":
      return <Truck className="h-4 w-4" />;
    case "delivered":
      return <Package className="h-4 w-4" />;
    default:
      return <Package className="h-4 w-4" />;
  }
}

export default function Orders() {
  const { data: orders, isLoading } = useUserOrders();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-20 left-1/4 w-[600px] h-[600px] orb opacity-20 animate-pulse-glow" />
      <div className="noise" />
      
      <Navbar />
      
      <main className="relative z-10 pt-24 pb-16">
        <div className="container max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 animate-fade-up">
            <div>
              <h1 className="font-display text-3xl font-bold mb-2">
                Mes commandes
              </h1>
              <p className="text-muted-foreground">
                Historique et suivi de vos commandes
              </p>
            </div>
            <Link to="/checkout">
              <Button variant="chrome">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Commander
              </Button>
            </Link>
          </div>

          {/* Orders List */}
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : orders && orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order, index) => (
                <Link 
                  key={order.id} 
                  to={`/orders/${order.id}`}
                  className="block animate-fade-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <Card className="p-5 hover:bg-secondary/30 transition-all cursor-pointer group">
                    <div className="flex items-center justify-between gap-4">
                      {/* Order info */}
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        {/* Icon */}
                        <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                          <Package className="h-6 w-6 text-foreground" />
                        </div>
                        
                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-mono font-semibold text-foreground">
                              {order.order_number}
                            </span>
                            <Badge className={getOrderStatusColor(order.status)}>
                              {getStatusIcon(order.status)}
                              <span className="ml-1">{getOrderStatusLabel(order.status)}</span>
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span>
                              {format(new Date(order.created_at), "d MMMM yyyy", { locale: fr })}
                            </span>
                            <span>•</span>
                            <span>{order.quantity} carte{order.quantity > 1 ? "s" : ""}</span>
                          </div>
                        </div>
                      </div>

                      {/* Price & Arrow */}
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold text-foreground">
                            {formatPrice(order.total_price_cents)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Paiement à la livraison
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center animate-fade-up">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-secondary flex items-center justify-center">
                <ShoppingBag className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">
                Aucune commande
              </h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                Vous n'avez pas encore passé de commande. Découvrez nos cartes NFC premium.
              </p>
              <Link to="/checkout">
                <Button variant="chrome" size="lg">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Commander maintenant
                </Button>
              </Link>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
