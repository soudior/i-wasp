import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { formatPrice } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Factory,
  Loader2,
  Search,
  MapPin,
  ExternalLink
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { getOrderStatusLabel, getOrderStatusColor } from "@/hooks/useOrders";
import type { Database } from "@/integrations/supabase/types";

type Order = Database["public"]["Tables"]["orders"]["Row"];

// Timeline step component
function TimelineStep({ 
  icon: Icon, 
  title, 
  date, 
  isCompleted, 
  isActive,
  isLast 
}: { 
  icon: React.ElementType;
  title: string;
  date?: string | null;
  isCompleted: boolean;
  isActive: boolean;
  isLast: boolean;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
          isCompleted 
            ? "bg-green-500 text-white" 
            : isActive 
              ? "bg-[#007AFF] text-white animate-pulse" 
              : "bg-[#F5F5F7] text-[#8E8E93]"
        }`}>
          <Icon className="h-5 w-5" />
        </div>
        {!isLast && (
          <div className={`w-0.5 h-12 mt-2 ${
            isCompleted ? "bg-green-500" : "bg-[#E5E5E5]"
          }`} />
        )}
      </div>
      
      <div className="pt-2 pb-6">
        <p className={`font-medium ${isCompleted || isActive ? "text-[#1D1D1F]" : "text-[#8E8E93]"}`}>
          {title}
        </p>
        {date && (
          <p className="text-sm text-[#8E8E93] mt-1">
            {format(new Date(date), "d MMMM yyyy à HH:mm", { locale: fr })}
          </p>
        )}
      </div>
    </div>
  );
}

export default function TrackOrder() {
  const [searchParams] = useSearchParams();
  const initialOrderNumber = searchParams.get("order") || "";
  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [searchQuery, setSearchQuery] = useState(initialOrderNumber);

  const { data: order, isLoading, error, refetch } = useQuery({
    queryKey: ["public-order", searchQuery],
    queryFn: async () => {
      if (!searchQuery) return null;
      
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("order_number", searchQuery.toUpperCase())
        .maybeSingle();

      if (error) throw error;
      return data as Order | null;
    },
    enabled: !!searchQuery,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(orderNumber.trim());
  };

  const statusOrder = ["pending", "paid", "in_production", "shipped", "delivered"];
  const currentIndex = order ? statusOrder.indexOf(order.status) : -1;

  const timelineSteps = [
    { icon: Clock, title: "Commande reçue", date: order?.created_at, status: "pending" },
    { icon: CheckCircle2, title: "Commande confirmée", date: order?.paid_at, status: "paid" },
    { icon: Factory, title: "En production", date: order?.production_started_at, status: "in_production" },
    { icon: Truck, title: "Expédiée", date: order?.shipped_at, status: "shipped" },
    { icon: Package, title: "Livrée", date: order?.delivered_at, status: "delivered" },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      {/* Header */}
      <header className="bg-white border-b border-[#E5E5E5]">
        <div className="container max-w-2xl mx-auto px-6 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#1D1D1F] tracking-tight">IWASP</h1>
            <p className="text-xs text-[#8E8E93] tracking-widest mt-1">SUIVI DE COMMANDE</p>
          </div>
        </div>
      </header>

      <main className="container max-w-2xl mx-auto px-6 py-8">
        {/* Search form */}
        <Card className="bg-white rounded-3xl shadow-sm border-0 mb-6">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8E8E93]" />
                <Input
                  type="text"
                  placeholder="Entrez votre numéro de commande"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="pl-12 h-12 rounded-xl border-[#E5E5E5] bg-[#F5F5F7] focus:bg-white transition-colors"
                />
              </div>
              <Button 
                type="submit" 
                className="h-12 px-6 rounded-xl bg-[#1D1D1F] hover:bg-[#1D1D1F]/90"
                disabled={!orderNumber.trim() || isLoading}
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Suivre"}
              </Button>
            </form>
            <p className="text-xs text-[#8E8E93] text-center mt-3">
              Ex: 2601XXXX
            </p>
          </CardContent>
        </Card>

        {/* Results */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#8E8E93]" />
          </div>
        )}

        {!isLoading && searchQuery && !order && (
          <Card className="bg-white rounded-3xl shadow-sm border-0">
            <CardContent className="p-8 text-center">
              <Package className="h-16 w-16 mx-auto mb-4 text-[#8E8E93]" />
              <h2 className="text-lg font-semibold text-[#1D1D1F] mb-2">
                Commande introuvable
              </h2>
              <p className="text-[#8E8E93] text-sm">
                Vérifiez le numéro de commande et réessayez.
              </p>
            </CardContent>
          </Card>
        )}

        {order && (
          <div className="space-y-6">
            {/* Order header */}
            <Card className="bg-white rounded-3xl shadow-sm border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-[#8E8E93] uppercase tracking-wide mb-1">Commande</p>
                    <h2 className="text-xl font-bold text-[#1D1D1F]">{order.order_number}</h2>
                  </div>
                  <Badge className={`${getOrderStatusColor(order.status)} rounded-full px-4 py-1`}>
                    {getOrderStatusLabel(order.status)}
                  </Badge>
                </div>
                <p className="text-sm text-[#8E8E93]">
                  Passée le {format(new Date(order.created_at), "d MMMM yyyy", { locale: fr })}
                </p>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="bg-white rounded-3xl shadow-sm border-0">
              <CardContent className="p-6">
                <h3 className="text-sm font-semibold text-[#1D1D1F] uppercase tracking-wide mb-6">
                  Suivi
                </h3>
                {timelineSteps.map((step, index) => {
                  const stepIndex = statusOrder.indexOf(step.status);
                  const isCompleted = stepIndex < currentIndex;
                  const isActive = stepIndex === currentIndex;
                  
                  return (
                    <TimelineStep
                      key={step.status}
                      icon={step.icon}
                      title={step.title}
                      date={isCompleted || isActive ? step.date : null}
                      isCompleted={isCompleted}
                      isActive={isActive}
                      isLast={index === timelineSteps.length - 1}
                    />
                  );
                })}

                {/* Tracking number */}
                {order.tracking_number && (
                  <div className="mt-4 p-4 bg-[#007AFF] rounded-2xl">
                    <p className="text-xs text-white/80 uppercase tracking-wide mb-1">Numéro de suivi</p>
                    <p className="font-mono font-semibold text-white text-lg">{order.tracking_number}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Delivery address */}
            {order.shipping_name && (
              <Card className="bg-white rounded-3xl shadow-sm border-0">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#F5F5F7] flex items-center justify-center shrink-0">
                      <MapPin className="h-5 w-5 text-[#1D1D1F]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#1D1D1F] uppercase tracking-wide mb-2">
                        Livraison
                      </h3>
                      <p className="font-medium text-[#1D1D1F]">{order.shipping_name}</p>
                      <p className="text-sm text-[#8E8E93]">{order.shipping_address}</p>
                      <p className="text-sm text-[#8E8E93]">
                        {order.shipping_postal_code} {order.shipping_city}
                      </p>
                      <p className="text-sm text-[#8E8E93]">
                        {order.shipping_country === "MA" ? "🇲🇦 Maroc" : order.shipping_country}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Order summary */}
            <Card className="bg-white rounded-3xl shadow-sm border-0">
              <CardContent className="p-6">
                <h3 className="text-sm font-semibold text-[#1D1D1F] uppercase tracking-wide mb-4">
                  Récapitulatif
                </h3>
                <div className="flex items-center justify-between py-3 border-b border-[#E5E5E5]">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#F5F5F7] flex items-center justify-center">
                      <Package className="h-6 w-6 text-[#1D1D1F]" />
                    </div>
                    <div>
                      <p className="font-medium text-[#1D1D1F]">Carte NFC IWASP</p>
                      <p className="text-sm text-[#8E8E93]">
                        {order.order_type === "personalized" ? "Personnalisée" : "Standard"}
                      </p>
                    </div>
                  </div>
                  <p className="font-medium text-[#1D1D1F]">×{order.quantity}</p>
                </div>
                <div className="flex justify-between pt-4">
                  <span className="font-semibold text-[#1D1D1F]">Total</span>
                  <span className="font-bold text-[#1D1D1F]">{formatPrice(order.total_price_cents)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Help */}
            <Card className="bg-[#1D1D1F] rounded-3xl shadow-sm border-0">
              <CardContent className="p-6 text-center">
                <p className="text-white/80 text-sm mb-3">Besoin d'aide ?</p>
                <Button 
                  variant="outline" 
                  className="bg-white text-[#1D1D1F] border-0 rounded-xl hover:bg-white/90"
                  asChild
                >
                  <a 
                    href="https://wa.me/212600000000" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Contacter le support
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center py-8 mt-8">
          <p className="text-xs text-[#8E8E93]">
            Tap. Connect. Empower.
          </p>
          <p className="text-xs text-[#8E8E93] mt-1">
            © {new Date().getFullYear()} IWASP
          </p>
        </footer>
      </main>
    </div>
  );
}