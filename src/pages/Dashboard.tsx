import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { useCards, useUpdateCard, useDeleteCard } from "@/hooks/useCards";
import { useLeads } from "@/hooks/useLeads";
import { useScans } from "@/hooks/useScans";
import { useUserOrders, getOrderStatusLabel, getOrderStatusColor } from "@/hooks/useOrders";
import { useSubscription } from "@/hooks/useSubscription";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { DashboardCard } from "@/components/DashboardCard";
import { SubscriptionCard } from "@/components/SubscriptionCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { formatPrice } from "@/lib/pricing";
import { generateInvoicePDF, downloadInvoice } from "@/lib/invoiceGenerator";
import { format } from "date-fns";
import { fr, enUS, es, it, nl } from "date-fns/locale";
import { 
  generateAppleWalletPass, 
  generateGoogleWalletPass,
  supportsAppleWallet,
  supportsGoogleWallet 
} from "@/lib/wallet";
import { PhysicalCardStudio } from "@/components/print/PhysicalCardStudio";
import { DashboardCustomization } from "@/components/DashboardCustomization";
import { GoldVerificationBadge } from "@/components/GoldFeatureCard";
import { AICoachPanel, PushNotificationsPanel, PerformanceChart } from "@/components/dashboard";

import { 
  Plus, CreditCard, Users, Eye, TrendingUp, 
  MoreVertical, Wallet, QrCode,
  Wifi, WifiOff, Pencil, Trash2, ExternalLink, Copy,
  LogOut, X, Apple, Smartphone, ShoppingBag,
  Clock, CheckCircle2, Factory, Truck, Package,
  Download, MapPin, ChevronRight, FileText, Loader2, Image,
  Zap, BarChart3
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Status icon mapping
function getStatusIcon(status: string) {
  switch (status) {
    case "pending":
      return <Clock className="h-3.5 w-3.5" />;
    case "paid":
      return <CheckCircle2 className="h-3.5 w-3.5" />;
    case "in_production":
      return <Factory className="h-3.5 w-3.5" />;
    case "shipped":
      return <Truck className="h-3.5 w-3.5" />;
    case "delivered":
      return <Package className="h-3.5 w-3.5" />;
    default:
      return <Package className="h-3.5 w-3.5" />;
  }
}

// Order timeline step
function OrderTimelineStep({ 
  status, 
  currentStatus, 
  label 
}: { 
  status: string; 
  currentStatus: string; 
  label: string;
}) {
  const statusOrder = ["pending", "paid", "in_production", "shipped", "delivered"];
  const currentIndex = statusOrder.indexOf(currentStatus);
  const stepIndex = statusOrder.indexOf(status);
  const isCompleted = stepIndex < currentIndex;
  const isActive = stepIndex === currentIndex;

  return (
    <div className="flex flex-col items-center">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all ${
        isCompleted 
          ? "bg-green-500 text-white" 
          : isActive 
            ? "bg-primary text-primary-foreground animate-pulse" 
            : "bg-secondary text-muted-foreground"
      }`}>
        {isCompleted ? <CheckCircle2 className="h-3 w-3" /> : getStatusIcon(status)}
      </div>
      <span className={`text-[10px] mt-1 text-center max-w-[60px] leading-tight ${
        isCompleted || isActive ? "text-foreground" : "text-muted-foreground"
      }`}>
        {label}
      </span>
    </div>
  );
}

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: cards = [], isLoading: cardsLoading } = useCards();
  const { data: leads = [] } = useLeads();
  const { data: scans = [] } = useScans();
  const { data: orders = [], isLoading: ordersLoading } = useUserOrders();
  const { isPremium } = useSubscription();
  const updateCard = useUpdateCard();
  const deleteCard = useDeleteCard();
  const [deleteCardId, setDeleteCardId] = useState<string | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletCardId, setWalletCardId] = useState<string | null>(null);
  const [downloadingInvoice, setDownloadingInvoice] = useState<string | null>(null);
  const [physicalCardId, setPhysicalCardId] = useState<string | null>(null);

  // Get locale for date-fns based on current language
  const getDateLocale = () => {
    switch (i18n.language) {
      case 'en': return enUS;
      case 'es': return es;
      case 'it': return it;
      case 'nl': return nl;
      default: return fr;
    }
  };

  const selectedCard = cards.find(c => c.id === selectedCardId);
  const walletCard = cards.find(c => c.id === walletCardId);
  const physicalCard = cards.find(c => c.id === physicalCardId);

  const handleDownloadInvoice = async (order: any) => {
    setDownloadingInvoice(order.id);
    try {
      const blob = await generateInvoicePDF(order);
      downloadInvoice(blob, order.order_number);
      toast.success(t("dashboard.invoiceDownloaded"));
    } catch (error) {
      console.error("Failed to generate invoice:", error);
      toast.error(t("dashboard.invoiceError"));
    } finally {
      setDownloadingInvoice(null);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const handleToggleNFC = async (cardId: string, currentState: boolean) => {
    await updateCard.mutateAsync({
      id: cardId,
      data: { nfc_enabled: !currentState },
    });
    toast.success(currentState ? t("dashboard.nfcDisabled") : t("dashboard.nfcEnabled"));
  };

  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/c/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success(t("dashboard.linkCopied"));
  };

  const handleDeleteCard = async () => {
    if (!deleteCardId) return;
    await deleteCard.mutateAsync(deleteCardId);
    setDeleteCardId(null);
  };

  const handleAddToWallet = (cardId: string) => {
    setWalletCardId(cardId);
    setShowWalletModal(true);
  };

  const handleWalletAction = (type: "apple" | "google") => {
    if (!walletCard) return;
    
    // Generate wallet pass data (in production, this would call backend API)
    if (type === "apple") {
      const passData = generateAppleWalletPass({ type: "apple", card: walletCard });
      console.log("Apple Wallet Pass Data:", passData);
      toast.info("Intégration Apple Wallet bientôt disponible. Les données du pass sont prêtes.");
    } else {
      const passData = generateGoogleWalletPass({ type: "google", card: walletCard });
      console.log("Google Wallet Pass Data:", passData);
      toast.info("Intégration Google Wallet bientôt disponible. Les données du pass sont prêtes.");
    }
    
    setShowWalletModal(false);
  };

  const totalViews = cards.reduce((acc, card) => acc + (card.view_count || 0), 0);
  const totalLeads = leads.length;
  const conversionRate = totalViews > 0 ? ((totalLeads / totalViews) * 100).toFixed(1) : "0";

  // Note: Auth and empty state checks are handled by DashboardGuard at route level

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-20 left-1/4 w-[600px] h-[600px] orb opacity-20 animate-pulse-glow" />
      <div className="absolute bottom-40 right-1/4 w-[400px] h-[400px] orb opacity-15" />
      <div className="noise" />
      
      <Navbar />
      
      <main className="relative z-10 pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 animate-fade-up">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
                {t("dashboard.title")}
                {isPremium && <GoldVerificationBadge />}
              </h1>
              <p className="text-muted-foreground">
                {t("dashboard.welcome")}, {user?.email}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/settings">
                <Button variant="outline" size="icon">
                  <Pencil size={18} />
                </Button>
              </Link>
              <Link to="/orders">
                <Button variant="outline">
                  <ShoppingBag size={18} />
                  {t("dashboard.myOrders")}
                </Button>
              </Link>
              <Link to="/create">
                <Button variant="chrome">
                  <Plus size={18} />
                  {t("dashboard.newCard")}
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: t("dashboard.activeCards"), value: cards.filter(c => c.is_active).length.toString(), icon: CreditCard },
              { label: "Scans NFC", value: scans.length.toString(), icon: Zap },
              { label: t("dashboard.capturedLeads"), value: totalLeads.toString(), icon: Users },
              { label: t("dashboard.conversionRate"), value: `${conversionRate}%`, icon: TrendingUp },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="animate-fade-up"
                style={{ animationDelay: `${0.1 + index * 0.05}s` }}
              >
                <Card variant="premium" className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-foreground/10 flex items-center justify-center">
                      <stat.icon size={20} className="text-chrome" />
                    </div>
                  </div>
                  <p className="font-display text-2xl font-bold text-foreground mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </Card>
              </div>
            ))}
          </div>

          {/* Pro Analytics Section - NEW */}
          <div className="mb-12 animate-fade-up" style={{ animationDelay: '0.11s' }}>
            <h2 className="font-display text-xl font-semibold text-foreground flex items-center gap-2 mb-6">
              <BarChart3 className="h-5 w-5 text-primary" />
              Centre de Commande NFC
              <Badge variant="secondary" className="bg-primary/10 text-primary text-[10px]">PRO</Badge>
            </h2>
            
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Performance Chart */}
              <div className="lg:col-span-2">
                <PerformanceChart 
                  scans={scans} 
                  leads={leads} 
                  cards={cards} 
                />
              </div>
              
              {/* AI Coach */}
              <div className="space-y-6">
                <AICoachPanel 
                  scans={scans} 
                  leads={leads} 
                  cards={cards}
                  isPremium={isPremium}
                />
              </div>
            </div>
          </div>

          {/* Push Notifications Gold - NEW */}
          <div className="mb-12 animate-fade-up" style={{ animationDelay: '0.115s' }}>
            <PushNotificationsPanel 
              leads={leads}
              isPremium={isPremium}
              onUpgrade={() => navigate("/checkout")}
            />
          </div>

          {/* Subscription Section - Mon Plan */}
          <div className="mb-12 animate-fade-up" style={{ animationDelay: '0.12s' }}>
            <h2 className="font-display text-xl font-semibold text-foreground flex items-center gap-2 mb-6">
              {t("dashboard.myPlan")}
            </h2>
            <SubscriptionCard />
          </div>

          {/* Customization Section - Noir & Or */}
          <div className="mb-12 animate-fade-up" style={{ animationDelay: '0.14s' }}>
            <DashboardCustomization />
          </div>

          {/* Orders Section - Premium Glassmorphism */}
          <div className="mb-12 animate-fade-up" style={{ animationDelay: '0.15s' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-semibold text-foreground flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                {t("dashboard.myOrders")}
              </h2>
              {orders.length > 0 && (
                <Link to="/orders">
                  <Button variant="outline" size="sm" className="gap-2">
                    {t("dashboard.viewAll")}
                    <ChevronRight size={14} />
                  </Button>
                </Link>
              )}
            </div>

            {ordersLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : orders.length === 0 ? (
              <Card className="p-8 text-center card-glass border-border/50 backdrop-blur-xl">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-secondary/50 flex items-center justify-center">
                  <ShoppingBag className="h-7 w-7 text-muted-foreground" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">
                  {t("dashboard.noOrders")}
                </h3>
                <p className="text-muted-foreground text-sm mb-5 max-w-xs mx-auto">
                  {t("dashboard.noOrdersDesc")}
                </p>
                <Link to="/checkout">
                  <Button variant="chrome" className="gap-2">
                    <ShoppingBag size={16} />
                    {t("dashboard.orderNow")}
                  </Button>
                </Link>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders.slice(0, 3).map((order, index) => (
                  <Card 
                    key={order.id} 
                    className="card-glass border-border/50 backdrop-blur-xl overflow-hidden animate-fade-up hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                    style={{ animationDelay: `${0.2 + index * 0.05}s` }}
                  >
                    <div className="p-5">
                      {/* Order header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                            <Package className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-semibold text-foreground">
                                {order.order_number}
                              </span>
                              <Badge className={`${getOrderStatusColor(order.status)} text-xs`}>
                                {getStatusIcon(order.status)}
                                <span className="ml-1">{getOrderStatusLabel(order.status)}</span>
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {format(new Date(order.created_at), "d MMMM yyyy", { locale: fr })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-foreground">
                            {formatPrice(order.total_price_cents)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {order.quantity} carte{order.quantity > 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>

                      {/* Timeline mini */}
                      <div className="flex items-center justify-between px-2 py-3 bg-secondary/30 rounded-xl mb-4">
                        <OrderTimelineStep status="pending" currentStatus={order.status} label="Reçue" />
                        <div className="flex-1 h-0.5 bg-border mx-1" />
                        <OrderTimelineStep status="paid" currentStatus={order.status} label="Confirmée" />
                        <div className="flex-1 h-0.5 bg-border mx-1" />
                        <OrderTimelineStep status="in_production" currentStatus={order.status} label="Production" />
                        <div className="flex-1 h-0.5 bg-border mx-1" />
                        <OrderTimelineStep status="shipped" currentStatus={order.status} label="Expédiée" />
                        <div className="flex-1 h-0.5 bg-border mx-1" />
                        <OrderTimelineStep status="delivered" currentStatus={order.status} label="Livrée" />
                      </div>

                      {/* Order details */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                          <div className="text-sm">
                            <p className="font-medium text-foreground">{order.shipping_name}</p>
                            <p className="text-muted-foreground text-xs line-clamp-2">
                              {order.shipping_address}, {order.shipping_city}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <CreditCard className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                          <div className="text-sm">
                            <p className="font-medium text-foreground">Paiement à la livraison</p>
                            <p className="text-muted-foreground text-xs">
                              Cash ou carte
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-3 border-t border-border/50">
                        <Link to={`/orders/${order.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full gap-2">
                            <ExternalLink size={14} />
                            Voir détails
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-2"
                          onClick={() => handleDownloadInvoice(order)}
                          disabled={downloadingInvoice === order.id}
                        >
                          {downloadingInvoice === order.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Download size={14} />
                          )}
                          Facture
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}

                {orders.length > 3 && (
                  <Link to="/orders" className="block">
                    <Card className="p-4 text-center hover:bg-secondary/30 transition-colors cursor-pointer border-dashed">
                      <span className="text-sm text-muted-foreground">
                        Voir les {orders.length - 3} autres commandes
                      </span>
                    </Card>
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Cards Grid - 3D Floating Cards */}
          <div className="mb-12 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-semibold text-foreground">
                Mes cartes
              </h2>
              {cards.length > 0 && (
                <Link to="/create">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Plus size={16} />
                    Ajouter
                  </Button>
                </Link>
              )}
            </div>
            
            {cardsLoading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 rounded-full border-2 border-foreground/20 border-t-foreground animate-spin" />
              </div>
            ) : cards.length === 0 ? (
              <div className="card-glass p-12 text-center animate-scale-in">
                <div className="animate-float-subtle">
                  <CreditCard size={64} className="mx-auto mb-6 text-chrome" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  Créez votre première carte
                </h3>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Votre identité digitale premium vous attend. Créez une carte de visite NFC futuriste en quelques clics.
                </p>
                <Link to="/create">
                  <Button variant="chrome" size="lg" className="gap-2">
                    <Plus size={18} />
                    Créer ma carte
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cards.map((card, index) => (
                  <div key={card.id} className="relative group">
                    <DashboardCard
                      card={card}
                      index={index}
                      leadsCount={leads.filter(l => l.card_id === card.id).length}
                      onClick={() => setSelectedCardId(card.id)}
                    />
                    
                    {/* Quick actions overlay */}
                    <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon" className="w-8 h-8 bg-background/80 backdrop-blur-sm">
                            <MoreVertical size={14} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-48">
                          <DropdownMenuItem onClick={() => navigate(`/create?edit=${card.id}`)}>
                            <Pencil size={14} className="mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleNFC(card.id, card.nfc_enabled)}>
                            {card.nfc_enabled ? (
                              <>
                                <WifiOff size={14} className="mr-2" />
                                Désactiver NFC
                              </>
                            ) : (
                              <>
                                <Wifi size={14} className="mr-2" />
                                Activer NFC
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCopyLink(card.slug)}>
                            <Copy size={14} className="mr-2" />
                            Copier le lien
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => window.open(`/c/${card.slug}`, '_blank')}>
                            <ExternalLink size={14} className="mr-2" />
                            Voir la carte
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setPhysicalCardId(card.id)}>
                            <Image size={14} className="mr-2" />
                            Générer visuel
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAddToWallet(card.id)}>
                            <Wallet size={14} className="mr-2" />
                            Ajouter au Wallet
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => setDeleteCardId(card.id)}
                          >
                            <Trash2 size={14} className="mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}

                {/* Add new card tile */}
                <div
                  className="animate-fade-up"
                  style={{ animationDelay: `${cards.length * 0.1 + 0.2}s` }}
                >
                  <Link to="/create">
                    <div className="h-full min-h-[280px] card-glass border-dashed border-2 border-foreground/10 hover:border-foreground/30 transition-all cursor-pointer group flex flex-col items-center justify-center p-6">
                      <div className="w-14 h-14 rounded-2xl bg-foreground/10 flex items-center justify-center mb-4 group-hover:bg-foreground/20 transition-colors group-hover:scale-110 group-hover:rotate-90 duration-300">
                        <Plus size={24} className="text-chrome" />
                      </div>
                      <span className="font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                        Nouvelle carte
                      </span>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Recent leads */}
          {leads.length > 0 && (
            <div className="mb-12 animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-semibold text-foreground">
                  Leads récents
                </h2>
                <Link to="/leads">
                  <Button variant="outline" size="sm" className="gap-2">
                    Voir tout
                    <ExternalLink size={14} />
                  </Button>
                </Link>
              </div>
              
              <Card variant="premium">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Contact</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Email</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Téléphone</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.slice(0, 5).map((lead) => (
                        <tr key={lead.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                                <span className="text-sm font-medium text-foreground">
                                  {lead.name?.charAt(0) || "?"}
                                </span>
                              </div>
                              <span className="font-medium text-foreground">{lead.name || "—"}</span>
                            </div>
                          </td>
                          <td className="p-4 text-muted-foreground">{lead.email || "—"}</td>
                          <td className="p-4 text-muted-foreground">{lead.phone || "—"}</td>
                          <td className="p-4 text-muted-foreground">
                            {new Date(lead.created_at).toLocaleDateString("fr-FR")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* Recent scans */}
          {scans.length > 0 && (
            <div className="animate-fade-up" style={{ animationDelay: '0.4s' }}>
              <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                Historique des scans
              </h2>
              
              <Card variant="premium">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Carte</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Appareil</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scans.slice(0, 10).map((scan) => (
                        <tr key={scan.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                          <td className="p-4">
                            <span className="font-medium text-foreground">
                              {scan.digital_cards?.first_name} {scan.digital_cards?.last_name}
                            </span>
                          </td>
                          <td className="p-4 text-muted-foreground">
                            {new Date(scan.scanned_at).toLocaleString("fr-FR")}
                          </td>
                          <td className="p-4 text-muted-foreground text-sm">
                            {scan.user_agent?.includes("iPhone") ? "iPhone" :
                             scan.user_agent?.includes("Android") ? "Android" :
                             scan.user_agent?.includes("Mac") ? "Mac" :
                             scan.user_agent?.includes("Windows") ? "Windows" : "Autre"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!deleteCardId} onOpenChange={() => setDeleteCardId(null)}>
        <AlertDialogContent className="card-glass border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Supprimer cette carte ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La carte et toutes les données associées seront supprimées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteCard}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Wallet modal */}
      <Dialog open={showWalletModal} onOpenChange={setShowWalletModal}>
        <DialogContent className="card-glass border-border max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-foreground text-center">Ajouter au Wallet</DialogTitle>
            <DialogDescription className="text-center">
              Choisissez votre portefeuille numérique
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 pt-4">
            <button
              onClick={() => handleWalletAction("apple")}
              className="w-full p-4 rounded-2xl bg-foreground text-background font-medium flex items-center justify-center gap-3 hover:bg-foreground/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Apple size={20} />
              Apple Wallet
            </button>
            
            <button
              onClick={() => handleWalletAction("google")}
              className="w-full p-4 rounded-2xl bg-surface-2 text-foreground font-medium flex items-center justify-center gap-3 hover:bg-surface-3 transition-all border border-border hover:scale-[1.02] active:scale-[0.98]"
            >
              <Smartphone size={20} />
              Google Wallet
            </button>
          </div>
          
          <p className="text-xs text-muted-foreground text-center pt-4">
            Votre carte sera accessible directement depuis votre téléphone
          </p>
        </DialogContent>
      </Dialog>

      {/* Physical Card Generator Modal */}
      <PhysicalCardStudio
        open={!!physicalCardId}
        onOpenChange={(open) => !open && setPhysicalCardId(null)}
        cardId={physicalCardId || undefined}
        logoUrl={physicalCard?.logo_url}
        cardName={physicalCard ? `${physicalCard.first_name}-${physicalCard.last_name}` : "carte"}
      />
    </div>
  );
};

export default Dashboard;
