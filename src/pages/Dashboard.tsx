/**
 * Dashboard Client i-wasp
 * 
 * Sections:
 * - Mes cartes & supports
 * - Mes leads (avec export CSV)
 * - Statistiques (taps, scans, visites)
 * - Campagnes & notifications
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useAuth } from "@/contexts/AuthContext";
import { useCards, useUpdateCard, useDeleteCard } from "@/hooks/useCards";
import { useLeads } from "@/hooks/useLeads";
import { useScans } from "@/hooks/useScans";
import { useUserOrders } from "@/hooks/useOrders";
import { useSubscription } from "@/hooks/useSubscription";
import { useSendPushNotification } from "@/hooks/usePushNotifications";
import { usePushSubscribers } from "@/hooks/usePushSubscribers";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  generateAppleWalletPass, 
  generateGoogleWalletPass,
} from "@/lib/wallet";
import { 
  Plus, CreditCard, Users, Eye, 
  MoreVertical, Wallet,
  Wifi, WifiOff, Pencil, Trash2, ExternalLink, Copy,
  Apple, Smartphone, ShoppingBag, TrendingUp,
  ChevronRight, Loader2, Settings, Zap,
  Bell, Send, Mail, MessageSquare, Download,
  BarChart3, MousePointerClick, QrCode, Link2,
  Sparkles, Crown
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

const Dashboard = () => {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: cards = [], isLoading: cardsLoading } = useCards();
  const { data: leads = [] } = useLeads();
  const { data: scans = [] } = useScans();
  const { data: orders = [] } = useUserOrders();
  const { isPremium } = useSubscription();
  const updateCard = useUpdateCard();
  const deleteCard = useDeleteCard();
  const { data: pushSubscribers } = usePushSubscribers();
  const [deleteCardId, setDeleteCardId] = useState<string | null>(null);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletCardId, setWalletCardId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("cards");
  const [showPushModal, setShowPushModal] = useState(false);
  const [pushTitle, setPushTitle] = useState("");
  const [pushMessage, setPushMessage] = useState("");
  const { sendNotification, isLoading: pushSending } = useSendPushNotification();

  const walletCard = cards.find(c => c.id === walletCardId);

  const handleToggleNFC = async (cardId: string, currentState: boolean) => {
    await updateCard.mutateAsync({
      id: cardId,
      data: { nfc_enabled: !currentState },
    });
    toast.success(currentState ? "NFC désactivé" : "NFC activé");
  };

  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/c/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Lien copié !");
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
    
    if (type === "apple") {
      generateAppleWalletPass({ type: "apple", card: walletCard });
      toast.info("Intégration Apple Wallet bientôt disponible.");
    } else {
      generateGoogleWalletPass({ type: "google", card: walletCard });
      toast.info("Intégration Google Wallet bientôt disponible.");
    }
    
    setShowWalletModal(false);
  };

  // Export leads to CSV
  const handleExportLeads = () => {
    const csvContent = [
      ["Nom", "Email", "Téléphone", "Entreprise", "Date", "Source"].join(","),
      ...leads.map((lead) =>
        [
          lead.name || "-",
          lead.email || "-",
          lead.phone || "-",
          lead.company || "-",
          format(new Date(lead.created_at), "dd/MM/yyyy", { locale: fr }),
          lead.source || "nfc",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-iwasp-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Export CSV téléchargé");
  };

  // Stats calculations
  const totalViews = cards.reduce((acc, card) => acc + (card.view_count || 0), 0);
  const totalLeads = leads.length;
  const totalScans = scans.length;
  const conversionRate = totalViews > 0 ? ((totalLeads / totalViews) * 100).toFixed(1) : "0";

  const userName = user?.user_metadata?.first_name || user?.email?.split("@")[0] || "Utilisateur";

  // Stats cards
  const statsData = [
    { 
      label: "Taps NFC", 
      value: totalScans, 
      icon: MousePointerClick, 
      color: "text-blue-500",
      description: "Scans de vos cartes"
    },
    { 
      label: "Visites profil", 
      value: totalViews, 
      icon: Eye, 
      color: "text-purple-500",
      description: "Vues de vos profils"
    },
    { 
      label: "Leads collectés", 
      value: totalLeads, 
      icon: Users, 
      color: "text-green-500",
      description: "Contacts capturés"
    },
    { 
      label: "Taux conversion", 
      value: `${conversionRate}%`, 
      icon: TrendingUp, 
      color: "text-orange-500",
      description: "Leads / Visites"
    },
  ];

  // Recent leads (last 5)
  const recentLeads = leads.slice(0, 5);

  // Get most clicked links (mock for now)
  const topLinks = [
    { label: "WhatsApp", clicks: Math.floor(totalViews * 0.4), icon: MessageSquare },
    { label: "Email", clicks: Math.floor(totalViews * 0.25), icon: Mail },
    { label: "LinkedIn", clicks: Math.floor(totalViews * 0.2), icon: Link2 },
    { label: "Site web", clicks: Math.floor(totalViews * 0.15), icon: ExternalLink },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  Bonjour, {userName}
                </h1>
                <p className="text-muted-foreground">
                  Votre tableau de bord i-wasp
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link to="/create">
                  <Button className="gap-2 bg-primary text-primary-foreground">
                    <Plus size={18} />
                    Nouvelle carte
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Navigation Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid h-auto p-1">
              <TabsTrigger value="cards" className="gap-2 py-2.5">
                <CreditCard size={16} />
                <span className="hidden sm:inline">Mes cartes</span>
                <span className="sm:hidden">Cartes</span>
              </TabsTrigger>
              <TabsTrigger value="leads" className="gap-2 py-2.5">
                <Users size={16} />
                <span className="hidden sm:inline">Mes leads</span>
                <span className="sm:hidden">Leads</span>
                {totalLeads > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                    {totalLeads}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="stats" className="gap-2 py-2.5">
                <BarChart3 size={16} />
                <span className="hidden sm:inline">Statistiques</span>
                <span className="sm:hidden">Stats</span>
              </TabsTrigger>
              <TabsTrigger value="campaigns" className="gap-2 py-2.5">
                <Bell size={16} />
                <span className="hidden sm:inline">Campagnes</span>
                <span className="sm:hidden">Notifs</span>
              </TabsTrigger>
            </TabsList>

            {/* ═══════════════════════════════════════════════════════════════════
                TAB 1: MES CARTES & SUPPORTS
                ═══════════════════════════════════════════════════════════════════ */}
            <TabsContent value="cards" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: "Cartes actives", value: cards.length, icon: CreditCard, color: "text-primary" },
                    { label: "Vues totales", value: totalViews, icon: Eye, color: "text-blue-500" },
                    { label: "Leads", value: totalLeads, icon: Users, color: "text-green-500" },
                    { label: "NFC actifs", value: cards.filter(c => c.nfc_enabled).length, icon: Wifi, color: "text-purple-500" },
                  ].map((stat) => (
                    <Card key={stat.label} className="bg-card border-border/50">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <stat.icon size={16} className={stat.color} />
                          <span className="text-xs text-muted-foreground">{stat.label}</span>
                        </div>
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Cards List */}
                {cardsLoading ? (
                  <div className="flex justify-center py-16">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : cards.length === 0 ? (
                  <Card className="p-12 text-center border-dashed border-2 border-border/50">
                    <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-secondary flex items-center justify-center">
                      <CreditCard size={28} className="text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Créez votre première carte
                    </h3>
                    <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
                      Votre identité digitale premium vous attend
                    </p>
                    <Link to="/create">
                      <Button className="gap-2 bg-primary text-primary-foreground">
                        <Plus size={18} />
                        Créer ma carte
                      </Button>
                    </Link>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {cards.map((card) => (
                      <Card 
                        key={card.id}
                        className="p-5 bg-card border-border/50 hover:border-border transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-secondary overflow-hidden flex-shrink-0">
                              {card.photo_url ? (
                                <img 
                                  src={card.photo_url} 
                                  alt={card.first_name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                  <CreditCard size={24} />
                                </div>
                              )}
                            </div>
                            
                            <div>
                              <h3 className="font-semibold text-foreground">
                                {card.first_name} {card.last_name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {card.title || card.company || "Carte digitale"}
                              </p>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Eye size={12} />
                                  {card.view_count || 0}
                                </span>
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Users size={12} />
                                  {leads.filter(l => l.card_id === card.id).length}
                                </span>
                                {card.nfc_enabled && (
                                  <Badge variant="secondary" className="text-xs gap-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                    <Zap size={10} />
                                    NFC
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="hidden sm:flex gap-1 text-muted-foreground hover:text-foreground"
                              onClick={() => window.open(`/c/${card.slug}`, '_blank')}
                            >
                              <ExternalLink size={14} />
                              Voir
                            </Button>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-9 w-9">
                                  <MoreVertical size={18} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
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
                                  Ouvrir
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
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
                      </Card>
                    ))}
                  </div>
                )}

                {/* Orders Section */}
                {orders.length > 0 && (
                  <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-foreground">Commandes récentes</h3>
                      <Link to="/orders">
                        <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                          Voir tout <ChevronRight size={14} />
                        </Button>
                      </Link>
                    </div>
                    <Card className="divide-y divide-border/50">
                      {orders.slice(0, 3).map((order) => {
                        const statusConfig: Record<string, { label: string; color: string }> = {
                          pending: { label: "En attente", color: "bg-amber-100 text-amber-700" },
                          paid: { label: "Payée", color: "bg-green-100 text-green-700" },
                          in_production: { label: "Production", color: "bg-purple-100 text-purple-700" },
                          shipped: { label: "Expédiée", color: "bg-blue-100 text-blue-700" },
                          delivered: { label: "Livrée", color: "bg-emerald-100 text-emerald-700" },
                        };
                        const status = statusConfig[order.status] || statusConfig.pending;
                        
                        return (
                          <Link 
                            key={order.id} 
                            to={`/orders/${order.id}`}
                            className="p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors block"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                                <ShoppingBag size={18} className="text-muted-foreground" />
                              </div>
                              <div>
                                <p className="font-medium text-foreground">#{order.order_number}</p>
                                <p className="text-sm text-muted-foreground">
                                  {(order.total_price_cents / 100).toFixed(0)} {order.currency}
                                </p>
                              </div>
                            </div>
                            <Badge className={status.color}>{status.label}</Badge>
                          </Link>
                        );
                      })}
                    </Card>
                  </div>
                )}
              </motion.div>
            </TabsContent>

            {/* ═══════════════════════════════════════════════════════════════════
                TAB 2: MES LEADS
                ═══════════════════════════════════════════════════════════════════ */}
            <TabsContent value="leads" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Header with export */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Mes leads</h2>
                    <p className="text-sm text-muted-foreground">
                      Contacts collectés via vos cartes NFC
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleExportLeads}
                      disabled={leads.length === 0}
                      className="gap-2"
                    >
                      <Download size={14} />
                      Export CSV
                    </Button>
                    <Link to="/leads">
                      <Button variant="outline" size="sm" className="gap-2">
                        Voir tout
                        <ChevronRight size={14} />
                      </Button>
                    </Link>
                  </div>
                </div>

                {leads.length === 0 ? (
                  <Card className="p-12 text-center border-dashed border-2 border-border/50">
                    <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-secondary flex items-center justify-center">
                      <Users size={28} className="text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Aucun lead pour le moment
                    </h3>
                    <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                      Les contacts qui interagissent avec votre carte apparaîtront ici
                    </p>
                  </Card>
                ) : (
                  <>
                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <Card className="bg-card border-border/50">
                        <CardContent className="p-4 text-center">
                          <p className="text-3xl font-bold text-foreground">{leads.length}</p>
                          <p className="text-xs text-muted-foreground">Total leads</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-card border-border/50">
                        <CardContent className="p-4 text-center">
                          <p className="text-3xl font-bold text-foreground">
                            {leads.filter(l => l.status === "new").length}
                          </p>
                          <p className="text-xs text-muted-foreground">Nouveaux</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-card border-border/50">
                        <CardContent className="p-4 text-center">
                          <p className="text-3xl font-bold text-foreground">
                            {leads.filter(l => l.consent_given).length}
                          </p>
                          <p className="text-xs text-muted-foreground">Consentis</p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Leads list */}
                    <Card className="divide-y divide-border/50">
                      {recentLeads.map((lead) => (
                        <div key={lead.id} className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-sm font-medium text-primary">
                                {lead.name?.charAt(0)?.toUpperCase() || "?"}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{lead.name || "Anonyme"}</p>
                              <p className="text-sm text-muted-foreground">
                                {lead.email || lead.phone || "—"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {lead.consent_given && (
                              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                                RGPD ✓
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(lead.created_at), "dd MMM", { locale: fr })}
                            </span>
                          </div>
                        </div>
                      ))}
                    </Card>

                    {leads.length > 5 && (
                      <div className="text-center mt-4">
                        <Link to="/leads">
                          <Button variant="outline" className="gap-2">
                            Voir les {leads.length} leads
                            <ChevronRight size={14} />
                          </Button>
                        </Link>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            </TabsContent>

            {/* ═══════════════════════════════════════════════════════════════════
                TAB 3: STATISTIQUES
                ═══════════════════════════════════════════════════════════════════ */}
            <TabsContent value="stats" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-foreground">Statistiques</h2>
                  <p className="text-sm text-muted-foreground">
                    Performance de vos cartes NFC
                  </p>
                </div>

                {/* Main stats grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {statsData.map((stat) => (
                    <Card key={stat.label} className="bg-card border-border/50">
                      <CardContent className="p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`p-2.5 rounded-xl bg-secondary ${stat.color}`}>
                            <stat.icon size={20} />
                          </div>
                        </div>
                        <p className="text-3xl font-bold text-foreground tracking-tight">
                          {stat.value}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {stat.label}
                        </p>
                        <p className="text-xs text-muted-foreground/70 mt-0.5">
                          {stat.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Top clicked links */}
                <Card className="bg-card border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <Link2 size={16} className="text-primary" />
                      Liens les plus cliqués
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {topLinks.map((link) => (
                        <div key={link.label} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                              <link.icon size={14} className="text-muted-foreground" />
                            </div>
                            <span className="text-sm text-foreground">{link.label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${(link.clicks / Math.max(totalViews, 1)) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-muted-foreground w-12 text-right">
                              {link.clicks}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Cards performance */}
                {cards.length > 0 && (
                  <Card className="bg-card border-border/50 mt-6">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <CreditCard size={16} className="text-primary" />
                        Performance par carte
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        {cards.map((card) => {
                          const cardLeads = leads.filter(l => l.card_id === card.id).length;
                          const cardViews = card.view_count || 0;
                          return (
                            <div key={card.id} className="flex items-center justify-between py-2">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-secondary overflow-hidden">
                                  {card.photo_url ? (
                                    <img src={card.photo_url} alt="" className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <CreditCard size={16} className="text-muted-foreground" />
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium text-foreground text-sm">
                                    {card.first_name} {card.last_name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">{card.company || "—"}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 text-sm">
                                <div className="text-center">
                                  <p className="font-semibold text-foreground">{cardViews}</p>
                                  <p className="text-xs text-muted-foreground">vues</p>
                                </div>
                                <div className="text-center">
                                  <p className="font-semibold text-foreground">{cardLeads}</p>
                                  <p className="text-xs text-muted-foreground">leads</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </TabsContent>

            {/* ═══════════════════════════════════════════════════════════════════
                TAB 4: CAMPAGNES & NOTIFICATIONS
                ═══════════════════════════════════════════════════════════════════ */}
            <TabsContent value="campaigns" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-foreground">Campagnes & Notifications</h2>
                  <p className="text-sm text-muted-foreground">
                    Envoyez des messages à vos contacts
                  </p>
                </div>

                {/* Feature Cards */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Email campaigns */}
                  <Card className="bg-card border-border/50 p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                        <Mail size={24} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">Campagnes Email</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Envoyez des emails personnalisés à vos leads qui ont donné leur consentement.
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {leads.filter(l => l.email && l.consent_given).length} contacts éligibles
                          </Badge>
                        </div>
                        <Button 
                          className="mt-4 w-full gap-2" 
                          variant="outline"
                          disabled={!isPremium}
                        >
                          <Send size={14} />
                          {isPremium ? "Créer une campagne" : "Fonctionnalité Premium"}
                        </Button>
                      </div>
                    </div>
                  </Card>

                  {/* WhatsApp campaigns */}
                  <Card className="bg-card border-border/50 p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                        <MessageSquare size={24} className="text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">Messages WhatsApp</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Relancez vos leads par WhatsApp avec des messages automatisés.
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {leads.filter(l => l.phone && l.consent_given).length} contacts éligibles
                          </Badge>
                        </div>
                        <Button 
                          className="mt-4 w-full gap-2" 
                          variant="outline"
                          disabled={!isPremium}
                        >
                          <Send size={14} />
                          {isPremium ? "Configurer WhatsApp" : "Fonctionnalité Premium"}
                        </Button>
                      </div>
                    </div>
                  </Card>

                  {/* Push notifications */}
                  <Card className="bg-card border-border/50 p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                        <Bell size={24} className="text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">Notifications Push</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Envoyez des notifications aux visiteurs qui ont activé les alertes sur votre profil.
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                            {pushSubscribers?.total || 0} abonnés
                          </Badge>
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            Actif
                          </Badge>
                        </div>
                        <Button 
                          className="mt-4 w-full gap-2" 
                          variant="outline"
                          onClick={() => setShowPushModal(true)}
                          disabled={cards.length === 0}
                        >
                          <Bell size={14} />
                          Envoyer une notification
                        </Button>
                      </div>
                    </div>
                  </Card>

                  {/* Automation */}
                  <Card className="bg-card border-border/50 p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                        <Sparkles size={24} className="text-orange-600 dark:text-orange-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">Scénarios automatiques</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Créez des workflows de relance automatique pour vos nouveaux leads.
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700">
                            Offre Élite
                          </Badge>
                        </div>
                        <Link to="/order/offre">
                          <Button 
                            className="mt-4 w-full gap-2" 
                            variant="outline"
                          >
                            <Crown size={14} />
                            Découvrir l'offre Élite
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Premium upsell */}
                {!isPremium && (
                  <Card className="mt-6 p-6 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">
                          Débloquez toutes les fonctionnalités
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Passez à l'offre Signature pour accéder aux campagnes et notifications
                        </p>
                      </div>
                      <Link to="/order/offre">
                        <Button className="bg-primary text-primary-foreground">
                          Voir les offres
                        </Button>
                      </Link>
                    </div>
                  </Card>
                )}
              </motion.div>
            </TabsContent>
          </Tabs>

        </div>
      </main>

      <Footer />

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!deleteCardId} onOpenChange={() => setDeleteCardId(null)}>
        <AlertDialogContent className="bg-card border-border">
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
        <DialogContent className="bg-card border-border max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-foreground text-center">Ajouter au Wallet</DialogTitle>
            <DialogDescription className="text-center">
              Choisissez votre portefeuille numérique
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 pt-4">
            <button
              onClick={() => handleWalletAction("apple")}
              className="w-full p-4 rounded-xl bg-foreground text-background font-medium flex items-center justify-center gap-3 hover:bg-foreground/90 transition-all active:scale-[0.98]"
            >
              <Apple size={20} />
              Apple Wallet
            </button>
            
            <button
              onClick={() => handleWalletAction("google")}
              className="w-full p-4 rounded-xl bg-secondary text-foreground font-medium flex items-center justify-center gap-3 hover:bg-secondary/80 transition-all border border-border active:scale-[0.98]"
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

      {/* Push Notification modal */}
      <Dialog open={showPushModal} onOpenChange={setShowPushModal}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <Bell size={20} className="text-purple-500" />
              Envoyer une notification
            </DialogTitle>
            <DialogDescription>
              Envoyez une notification push à tous les abonnés de votre carte
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Titre</label>
              <input
                type="text"
                value={pushTitle}
                onChange={(e) => setPushTitle(e.target.value)}
                placeholder="Ex: Nouveauté !"
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Message</label>
              <textarea
                value={pushMessage}
                onChange={(e) => setPushMessage(e.target.value)}
                placeholder="Ex: Découvrez notre nouvelle offre..."
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            {/* Preview */}
            {(pushTitle || pushMessage) && (
              <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                <p className="text-xs text-muted-foreground mb-2">Aperçu</p>
                <div className="bg-background rounded-lg p-3 border border-border shadow-sm">
                  <p className="font-semibold text-sm text-foreground">{pushTitle || "Titre..."}</p>
                  <p className="text-xs text-muted-foreground mt-1">{pushMessage || "Message..."}</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setShowPushModal(false);
                setPushTitle("");
                setPushMessage("");
              }}
            >
              Annuler
            </Button>
            <Button
              className="flex-1 gap-2"
              disabled={!pushTitle || !pushMessage || pushSending || cards.length === 0}
              onClick={async () => {
                if (cards.length === 0) return;
                const result = await sendNotification(cards[0].id, pushTitle, pushMessage);
                if (result.sent > 0) {
                  toast.success(`${result.sent} notification(s) envoyée(s) !`);
                } else if (result.failed === 0 && result.sent === 0) {
                  toast.info("Aucun abonné aux notifications pour le moment");
                } else {
                  toast.error("Erreur lors de l'envoi");
                }
                setShowPushModal(false);
                setPushTitle("");
                setPushMessage("");
              }}
            >
              {pushSending ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Envoi...
                </>
              ) : (
                <>
                  <Send size={14} />
                  Envoyer
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
