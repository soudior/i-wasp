import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useOrder, getOrderStatusLabel, getOrderStatusColor } from "@/hooks/useOrders";
import { formatPrice } from "@/lib/pricing";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft,
  Package,
  MapPin,
  Phone,
  CreditCard,
  Truck,
  CheckCircle2,
  Clock,
  Factory,
  Loader2,
  FileText,
  Download
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { generateInvoicePDF, downloadInvoice } from "@/lib/invoiceGenerator";
import { toast } from "sonner";

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
      {/* Line and dot */}
      <div className="flex flex-col items-center">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
          isCompleted 
            ? "bg-green-500 text-white" 
            : isActive 
              ? "bg-primary text-primary-foreground animate-pulse" 
              : "bg-secondary text-muted-foreground"
        }`}>
          <Icon className="h-5 w-5" />
        </div>
        {!isLast && (
          <div className={`w-0.5 h-12 mt-2 ${
            isCompleted ? "bg-green-500" : "bg-border"
          }`} />
        )}
      </div>
      
      {/* Content */}
      <div className="pt-2 pb-6">
        <p className={`font-medium ${isCompleted || isActive ? "text-foreground" : "text-muted-foreground"}`}>
          {title}
        </p>
        {date && (
          <p className="text-sm text-muted-foreground mt-1">
            {format(new Date(date), "d MMMM yyyy à HH:mm", { locale: fr })}
          </p>
        )}
      </div>
    </div>
  );
}

export default function OrderDetails() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading, error } = useOrder(orderId);
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);

  const handleDownloadInvoice = async () => {
    if (!order) return;
    
    setIsGeneratingInvoice(true);
    try {
      const blob = await generateInvoicePDF(order);
      downloadInvoice(blob, order.order_number);
      toast.success("Facture téléchargée");
    } catch (error) {
      console.error("Failed to generate invoice:", error);
      toast.error("Erreur lors de la génération de la facture");
    } finally {
      setIsGeneratingInvoice(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container max-w-2xl mx-auto px-6 text-center">
            <Package className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-4">Commande introuvable</h1>
            <p className="text-muted-foreground mb-6">
              Cette commande n'existe pas ou vous n'y avez pas accès.
            </p>
            <Button onClick={() => navigate("/orders")}>
              Voir mes commandes
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Determine timeline status
  const statusOrder = ["pending", "paid", "in_production", "shipped", "delivered"];
  const currentIndex = statusOrder.indexOf(order.status);

  const timelineSteps = [
    { 
      icon: Clock, 
      title: "Commande reçue", 
      date: order.created_at,
      status: "pending" 
    },
    { 
      icon: CheckCircle2, 
      title: "Commande confirmée", 
      date: order.paid_at,
      status: "paid" 
    },
    { 
      icon: Factory, 
      title: "En production", 
      date: order.production_started_at,
      status: "in_production" 
    },
    { 
      icon: Truck, 
      title: "Expédiée", 
      date: order.shipped_at,
      status: "shipped" 
    },
    { 
      icon: Package, 
      title: "Livrée", 
      date: order.delivered_at,
      status: "delivered" 
    },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="noise" />
      
      <Navbar />
      
      <main className="relative z-10 pt-24 pb-16">
        <div className="container max-w-3xl mx-auto px-6">
          {/* Back button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate("/orders")}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Mes commandes
          </Button>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="font-display text-2xl md:text-3xl font-bold">
                  Commande {order.order_number}
                </h1>
                <Badge className={getOrderStatusColor(order.status)}>
                  {getOrderStatusLabel(order.status)}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                Passée le {format(new Date(order.created_at), "d MMMM yyyy à HH:mm", { locale: fr })}
              </p>
            </div>
            
            {/* Download Invoice Button */}
            <Button 
              onClick={handleDownloadInvoice}
              disabled={isGeneratingInvoice}
              className="gap-2"
            >
              {isGeneratingInvoice ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              Télécharger la facture
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Suivi de commande</CardTitle>
              </CardHeader>
              <CardContent>
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
                  <div className="mt-4 p-4 bg-secondary/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Numéro de suivi</p>
                    <p className="font-mono font-medium">{order.tracking_number}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order details */}
            <div className="space-y-6">
              {/* Products */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Détails de la commande</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                        <Package className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-medium">Carte NFC IWASP</p>
                        <p className="text-sm text-muted-foreground">
                          {order.order_type === "personalized" ? "Personnalisée" : "Standard"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">×{order.quantity}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(order.unit_price_cents)}/u
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sous-total</span>
                      <span>{formatPrice(order.quantity * order.unit_price_cents)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Livraison</span>
                      <span className="text-green-600">Gratuite</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(order.total_price_cents)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery address */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Adresse de livraison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">{order.shipping_name}</p>
                    <p className="text-muted-foreground">{order.shipping_address}</p>
                    <p className="text-muted-foreground">
                      {order.shipping_postal_code} {order.shipping_city}
                    </p>
                    <p className="text-muted-foreground">
                      {order.shipping_country === "MA" ? "🇲🇦 Maroc" : order.shipping_country}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Payment method */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Mode de paiement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Paiement à la livraison</p>
                      <p className="text-sm text-muted-foreground">
                        Payez en espèces ou par carte à la réception
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Help section */}
          <Card className="mt-8 bg-secondary/30">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-medium mb-1">Besoin d'aide ?</h3>
                  <p className="text-sm text-muted-foreground">
                    Notre équipe est disponible pour répondre à vos questions
                  </p>
                </div>
                <Button variant="outline" asChild>
                  <a href="mailto:support@iwasp.ma">
                    <Phone className="h-4 w-4 mr-2" />
                    Contacter le support
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
