/**
 * Dashboard Client i-wasp
 * 
 * Design: Apple-like, minimaliste, haute couture
 * Sections:
 * - Mes cartes & supports
 * - Mes leads (avec export CSV)
 * - Statistiques (taps, scans, visites)
 * - Campagnes & notifications
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
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
import { usePushNotificationLogs, useCreatePushNotificationLog } from "@/hooks/usePushNotificationLogs";
import { useScheduledNotifications, useCreateScheduledNotification, useDeleteScheduledNotification } from "@/hooks/useScheduledNotifications";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  generateAppleWalletPass, 
  generateGoogleWalletPass,
} from "@/lib/wallet";
import { 
  Plus, CreditCard, Users, Eye, 
  MoreVertical, Wallet,
  Wifi, WifiOff, Pencil, Trash2, ExternalLink, Copy,
  Apple, Smartphone, ShoppingBag, 
  ChevronRight, Settings, Zap, Loader2,
  Bell, Send, Mail, MessageSquare, Download,
  MousePointerClick, Link2, ArrowRight,
  Sparkles, Crown, Clock, Calendar, X, LogOut
} from "lucide-react";
import {
  DashboardStatsSkeleton,
  DashboardCardListSkeleton,
} from "@/components/dashboard/DashboardSkeletons";
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

// Animation variants - slow, luxurious
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8 }
  }
};

const stagger = {
  visible: {
    transition: { staggerChildren: 0.15 }
  }
};

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
  const { data: pushLogs = [] } = usePushNotificationLogs();
  const createPushLog = useCreatePushNotificationLog();
  const { data: scheduledNotifications = [] } = useScheduledNotifications();
  const createScheduledNotification = useCreateScheduledNotification();
  const deleteScheduledNotification = useDeleteScheduledNotification();
  const [deleteCardId, setDeleteCardId] = useState<string | null>(null);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletCardId, setWalletCardId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<"cards" | "leads" | "stats" | "campaigns">("cards");
  const [showPushModal, setShowPushModal] = useState(false);
  const [pushTitle, setPushTitle] = useState("");
  const [pushMessage, setPushMessage] = useState("");
  const [pushCardId, setPushCardId] = useState<string | null>(null);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
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

  // Recent leads (last 5)
  const recentLeads = leads.slice(0, 5);

  // Top links mock
  const topLinks = [
    { label: "WhatsApp", clicks: Math.floor(totalViews * 0.4), icon: MessageSquare },
    { label: "Email", clicks: Math.floor(totalViews * 0.25), icon: Mail },
    { label: "LinkedIn", clicks: Math.floor(totalViews * 0.2), icon: Link2 },
    { label: "Site web", clicks: Math.floor(totalViews * 0.15), icon: ExternalLink },
  ];

  const navItems = [
    { id: "cards", label: "Cartes", count: cards.length },
    { id: "leads", label: "Leads", count: totalLeads },
    { id: "stats", label: "Statistiques" },
    { id: "campaigns", label: "Campagnes" },
  ] as const;

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background">
      
      {/* ═══════════════════════════════════════════════════════════════════
          NAVIGATION — Ultra minimal
          ═══════════════════════════════════════════════════════════════════ */}
      <motion.nav 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="fixed top-0 left-0 right-0 z-50 px-6 sm:px-12 py-6 sm:py-8 bg-background/80 backdrop-blur-xl border-b border-foreground/5"
      >
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <Link to="/" className="text-foreground font-serif text-xl sm:text-2xl tracking-wide">
            i-wasp
          </Link>
          <div className="flex items-center gap-4 sm:gap-8">
            <Link to="/settings">
              <button className="text-muted-foreground hover:text-foreground transition-colors duration-500">
                <Settings size={18} />
              </button>
            </Link>
            <button 
              onClick={() => signOut()}
              className="text-xs sm:text-sm tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-500 flex items-center gap-2"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="pt-32 pb-24 px-6 sm:px-12">
        <div className="max-w-[1400px] mx-auto">
          
          {/* ═══════════════════════════════════════════════════════════════════
              HEADER — Bienvenue
              ═══════════════════════════════════════════════════════════════════ */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="mb-16 sm:mb-24"
          >
            <motion.p 
              variants={fadeUp}
              className="text-xs sm:text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4"
            >
              Bienvenue
            </motion.p>
            <motion.h1 
              variants={fadeUp}
              className="font-serif text-3xl sm:text-5xl md:text-6xl font-light tracking-tight mb-6"
            >
              {userName}
            </motion.h1>
            <motion.p 
              variants={fadeUp}
              className="text-base sm:text-lg text-muted-foreground max-w-xl"
            >
              Gérez vos cartes digitales et suivez vos performances.
            </motion.p>
          </motion.div>

          {/* ═══════════════════════════════════════════════════════════════════
              STATS OVERVIEW — Grandes métriques
              ═══════════════════════════════════════════════════════════════════ */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-px bg-foreground/5 rounded-2xl overflow-hidden mb-16 sm:mb-24"
          >
            {[
              { label: "Cartes", value: cards.length, icon: CreditCard },
              { label: "Vues", value: totalViews, icon: Eye },
              { label: "Leads", value: totalLeads, icon: Users },
              { label: "Conversion", value: `${conversionRate}%`, icon: MousePointerClick },
            ].map((stat, i) => (
              <motion.div 
                key={stat.label}
                variants={fadeUp}
                className="bg-background p-6 sm:p-10"
              >
                <stat.icon size={20} className="text-muted-foreground mb-4" />
                <p className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-tight mb-2">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground tracking-wide">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* ═══════════════════════════════════════════════════════════════════
              SECTION TABS — Navigation minimaliste
              ═══════════════════════════════════════════════════════════════════ */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-wrap gap-6 sm:gap-12 mb-12 sm:mb-16 border-b border-foreground/5 pb-6"
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`text-sm sm:text-base tracking-wide transition-colors duration-500 pb-2 relative ${
                  activeSection === item.id 
                    ? "text-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
                {'count' in item && item.count > 0 && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    {item.count}
                  </span>
                )}
                {activeSection === item.id && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-px bg-foreground"
                    transition={{ duration: 0.3 }}
                  />
                )}
              </button>
            ))}
          </motion.div>

          {/* ═══════════════════════════════════════════════════════════════════
              SECTION: MES CARTES
              ═══════════════════════════════════════════════════════════════════ */}
          {activeSection === "cards" && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              {/* New card CTA */}
              <motion.div variants={fadeUp} className="flex items-center justify-between mb-10">
                <h2 className="font-serif text-2xl sm:text-3xl font-light tracking-tight">
                  Mes cartes
                </h2>
                <Link to="/create">
                  <button className="inline-flex items-center gap-3 text-xs sm:text-sm tracking-[0.15em] uppercase border border-foreground/30 px-5 py-3 hover:bg-foreground hover:text-background transition-all duration-500">
                    <Plus size={16} />
                    Nouvelle carte
                  </button>
                </Link>
              </motion.div>

              {/* Cards Grid */}
              {cardsLoading ? (
                <DashboardCardListSkeleton count={2} />
              ) : cards.length === 0 ? (
                <motion.div 
                  variants={fadeUp}
                  className="py-24 text-center border border-foreground/10 rounded-2xl"
                >
                  <CreditCard size={40} className="mx-auto text-muted-foreground mb-6" />
                  <h3 className="font-serif text-2xl font-light mb-3">Créez votre première carte</h3>
                  <p className="text-muted-foreground text-sm mb-8 max-w-sm mx-auto">
                    Votre identité digitale premium vous attend
                  </p>
                  <Link to="/create">
                    <button className="inline-flex items-center gap-3 bg-foreground text-background px-8 py-4 text-sm tracking-[0.15em] uppercase hover:opacity-80 transition-opacity duration-500">
                      <Plus size={16} />
                      Créer ma carte
                    </button>
                  </Link>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {cards.map((card, index) => (
                    <motion.div 
                      key={card.id}
                      variants={fadeUp}
                      custom={index}
                      className="group p-6 sm:p-8 border border-foreground/10 rounded-2xl hover:border-foreground/30 transition-all duration-500"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-5 sm:gap-8">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-muted overflow-hidden flex-shrink-0">
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
                            <h3 className="font-serif text-xl sm:text-2xl font-light tracking-tight mb-1">
                              {card.first_name} {card.last_name}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-3">
                              {card.title || card.company || "Carte digitale"}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1.5">
                                <Eye size={12} />
                                {card.view_count || 0} vues
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Users size={12} />
                                {leads.filter(l => l.card_id === card.id).length} leads
                              </span>
                              {card.nfc_enabled && (
                                <span className="flex items-center gap-1.5 text-foreground">
                                  <Zap size={12} />
                                  NFC
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => window.open(`/c/${card.slug}`, '_blank')}
                            className="hidden sm:flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-500"
                          >
                            Voir
                            <ArrowRight size={14} />
                          </button>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors">
                                <MoreVertical size={18} />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 bg-background border-foreground/10">
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
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Orders Section */}
              {orders.length > 0 && (
                <motion.div variants={fadeUp} className="mt-16">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="font-serif text-xl sm:text-2xl font-light tracking-tight">
                      Commandes récentes
                    </h3>
                    <Link to="/orders" className="text-xs sm:text-sm tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-500 flex items-center gap-2">
                      Voir tout
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {orders.slice(0, 3).map((order) => {
                      const statusConfig: Record<string, { label: string }> = {
                        pending: { label: "En attente" },
                        paid: { label: "Payée" },
                        in_production: { label: "Production" },
                        shipped: { label: "Expédiée" },
                        delivered: { label: "Livrée" },
                      };
                      const status = statusConfig[order.status] || statusConfig.pending;
                      
                      return (
                        <Link 
                          key={order.id} 
                          to={`/orders/${order.id}`}
                          className="flex items-center justify-between p-5 border border-foreground/10 rounded-xl hover:border-foreground/30 transition-all duration-500"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                              <ShoppingBag size={18} className="text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium">#{order.order_number}</p>
                              <p className="text-sm text-muted-foreground">
                                {(order.total_price_cents / 100).toFixed(0)} {order.currency}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs tracking-wide uppercase text-muted-foreground">
                            {status.label}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              SECTION: MES LEADS
              ═══════════════════════════════════════════════════════════════════ */}
          {activeSection === "leads" && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-light tracking-tight mb-2">
                    Mes leads
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Contacts collectés via vos cartes NFC
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleExportLeads}
                    disabled={leads.length === 0}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm tracking-[0.15em] uppercase border border-foreground/30 px-4 py-2.5 hover:bg-foreground hover:text-background transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download size={14} />
                    Export CSV
                  </button>
                </div>
              </motion.div>

              {leads.length === 0 ? (
                <motion.div 
                  variants={fadeUp}
                  className="py-24 text-center border border-foreground/10 rounded-2xl"
                >
                  <Users size={40} className="mx-auto text-muted-foreground mb-6" />
                  <h3 className="font-serif text-2xl font-light mb-3">Aucun lead pour le moment</h3>
                  <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                    Les contacts qui interagissent avec votre carte apparaîtront ici
                  </p>
                </motion.div>
              ) : (
                <>
                  {/* Stats mini */}
                  <motion.div 
                    variants={fadeUp}
                    className="grid grid-cols-3 gap-px bg-foreground/5 rounded-xl overflow-hidden mb-10"
                  >
                    <div className="bg-background p-6 text-center">
                      <p className="font-serif text-3xl font-light mb-1">{leads.length}</p>
                      <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                    <div className="bg-background p-6 text-center">
                      <p className="font-serif text-3xl font-light mb-1">
                        {leads.filter(l => l.status === "new").length}
                      </p>
                      <p className="text-xs text-muted-foreground">Nouveaux</p>
                    </div>
                    <div className="bg-background p-6 text-center">
                      <p className="font-serif text-3xl font-light mb-1">
                        {leads.filter(l => l.consent_given).length}
                      </p>
                      <p className="text-xs text-muted-foreground">Consentis</p>
                    </div>
                  </motion.div>

                  {/* Leads list */}
                  <div className="space-y-3">
                    {recentLeads.map((lead, index) => (
                      <motion.div 
                        key={lead.id}
                        variants={fadeUp}
                        className="flex items-center justify-between p-5 border border-foreground/10 rounded-xl"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                            <span className="text-sm font-medium">
                              {lead.name?.charAt(0)?.toUpperCase() || "?"}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{lead.name || "Anonyme"}</p>
                            <p className="text-sm text-muted-foreground">
                              {lead.email || lead.phone || "—"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {lead.consent_given && (
                            <span className="text-xs text-muted-foreground">RGPD ✓</span>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(lead.created_at), "dd MMM", { locale: fr })}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {leads.length > 5 && (
                    <motion.div variants={fadeUp} className="text-center mt-8">
                      <Link to="/leads">
                        <button className="inline-flex items-center gap-3 text-sm tracking-[0.15em] uppercase border border-foreground/30 px-6 py-3 hover:bg-foreground hover:text-background transition-all duration-500">
                          Voir les {leads.length} leads
                          <ChevronRight size={14} />
                        </button>
                      </Link>
                    </motion.div>
                  )}
                </>
              )}
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              SECTION: STATISTIQUES
              ═══════════════════════════════════════════════════════════════════ */}
          {activeSection === "stats" && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              <motion.div variants={fadeUp} className="mb-10">
                <h2 className="font-serif text-2xl sm:text-3xl font-light tracking-tight mb-2">
                  Statistiques
                </h2>
                <p className="text-sm text-muted-foreground">
                  Performance de vos cartes NFC
                </p>
              </motion.div>

              {/* Top links */}
              <motion.div variants={fadeUp} className="mb-12">
                <h3 className="text-xs sm:text-sm tracking-[0.2em] uppercase text-muted-foreground mb-6">
                  Liens les plus cliqués
                </h3>
                <div className="space-y-4">
                  {topLinks.map((link) => (
                    <div key={link.label} className="flex items-center justify-between py-3 border-b border-foreground/5">
                      <div className="flex items-center gap-4">
                        <link.icon size={16} className="text-muted-foreground" />
                        <span className="text-sm">{link.label}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-32 h-1 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-foreground rounded-full"
                            style={{ width: `${(link.clicks / Math.max(totalViews, 1)) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-10 text-right">
                          {link.clicks}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Performance par carte */}
              {cards.length > 0 && (
                <motion.div variants={fadeUp}>
                  <h3 className="text-xs sm:text-sm tracking-[0.2em] uppercase text-muted-foreground mb-6">
                    Performance par carte
                  </h3>
                  <div className="space-y-4">
                    {cards.map((card) => {
                      const cardLeads = leads.filter(l => l.card_id === card.id).length;
                      const cardViews = card.view_count || 0;
                      return (
                        <div key={card.id} className="flex items-center justify-between py-4 border-b border-foreground/5">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-muted overflow-hidden">
                              {card.photo_url ? (
                                <img src={card.photo_url} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <CreditCard size={16} className="text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-sm">
                                {card.first_name} {card.last_name}
                              </p>
                              <p className="text-xs text-muted-foreground">{card.company || "—"}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-8 text-sm">
                            <div className="text-center">
                              <p className="font-medium">{cardViews}</p>
                              <p className="text-xs text-muted-foreground">vues</p>
                            </div>
                            <div className="text-center">
                              <p className="font-medium">{cardLeads}</p>
                              <p className="text-xs text-muted-foreground">leads</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              SECTION: CAMPAGNES
              ═══════════════════════════════════════════════════════════════════ */}
          {activeSection === "campaigns" && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              <motion.div variants={fadeUp} className="mb-10">
                <h2 className="font-serif text-2xl sm:text-3xl font-light tracking-tight mb-2">
                  Campagnes & Notifications
                </h2>
                <p className="text-sm text-muted-foreground">
                  Envoyez des messages à vos contacts
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Email */}
                <motion.div 
                  variants={fadeUp}
                  className="p-8 border border-foreground/10 rounded-2xl"
                >
                  <Mail size={28} className="text-muted-foreground mb-6" />
                  <h3 className="font-serif text-xl font-light mb-2">Campagnes Email</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Envoyez des emails personnalisés à vos leads consentis.
                  </p>
                  <p className="text-xs text-muted-foreground mb-6">
                    {leads.filter(l => l.email && l.consent_given).length} contacts éligibles
                  </p>
                  <button 
                    disabled={!isPremium}
                    className="w-full py-3 border border-foreground/30 text-sm tracking-[0.15em] uppercase hover:bg-foreground hover:text-background transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPremium ? "Créer une campagne" : "Premium requis"}
                  </button>
                </motion.div>

                {/* WhatsApp */}
                <motion.div 
                  variants={fadeUp}
                  className="p-8 border border-foreground/10 rounded-2xl"
                >
                  <MessageSquare size={28} className="text-muted-foreground mb-6" />
                  <h3 className="font-serif text-xl font-light mb-2">Messages WhatsApp</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Relancez vos leads par WhatsApp automatiquement.
                  </p>
                  <p className="text-xs text-muted-foreground mb-6">
                    {leads.filter(l => l.phone && l.consent_given).length} contacts éligibles
                  </p>
                  <button 
                    disabled={!isPremium}
                    className="w-full py-3 border border-foreground/30 text-sm tracking-[0.15em] uppercase hover:bg-foreground hover:text-background transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPremium ? "Configurer" : "Premium requis"}
                  </button>
                </motion.div>

                {/* Push */}
                <motion.div 
                  variants={fadeUp}
                  className="p-8 border border-foreground/10 rounded-2xl"
                >
                  <Bell size={28} className="text-muted-foreground mb-6" />
                  <h3 className="font-serif text-xl font-light mb-2">Notifications Push</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Notifiez les visiteurs qui ont activé les alertes.
                  </p>
                  <p className="text-xs text-muted-foreground mb-6">
                    {pushSubscribers?.total || 0} abonnés
                  </p>
                  <button 
                    onClick={() => setShowPushModal(true)}
                    disabled={cards.length === 0}
                    className="w-full py-3 border border-foreground/30 text-sm tracking-[0.15em] uppercase hover:bg-foreground hover:text-background transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Envoyer
                  </button>
                </motion.div>

                {/* Automation */}
                <motion.div 
                  variants={fadeUp}
                  className="p-8 border border-foreground/10 rounded-2xl"
                >
                  <Sparkles size={28} className="text-muted-foreground mb-6" />
                  <h3 className="font-serif text-xl font-light mb-2">Scénarios automatiques</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Workflows de relance automatique pour vos leads.
                  </p>
                  <p className="text-xs text-muted-foreground mb-6">
                    Offre Élite
                  </p>
                  <Link to="/order/offre">
                    <button className="w-full py-3 border border-foreground/30 text-sm tracking-[0.15em] uppercase hover:bg-foreground hover:text-background transition-all duration-500 flex items-center justify-center gap-2">
                      <Crown size={14} />
                      Découvrir
                    </button>
                  </Link>
                </motion.div>
              </div>

              {/* Push history */}
              {pushLogs.length > 0 && (
                <motion.div variants={fadeUp} className="mt-12">
                  <h3 className="text-xs sm:text-sm tracking-[0.2em] uppercase text-muted-foreground mb-6">
                    Historique des notifications
                  </h3>
                  <div className="space-y-3">
                    {pushLogs.slice(0, 5).map((log) => (
                      <div 
                        key={log.id}
                        className="flex items-center justify-between p-5 border border-foreground/10 rounded-xl"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{log.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{log.body}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(new Date(log.created_at), "dd MMM yyyy 'à' HH:mm", { locale: fr })}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-4 text-xs text-muted-foreground">
                          {log.sent_count > 0 && <span>{log.sent_count} ✓</span>}
                          {log.failed_count > 0 && <span>{log.failed_count} ✗</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Scheduled */}
              {scheduledNotifications.filter(n => n.status === 'pending').length > 0 && (
                <motion.div variants={fadeUp} className="mt-12">
                  <h3 className="text-xs sm:text-sm tracking-[0.2em] uppercase text-muted-foreground mb-6">
                    Notifications programmées
                  </h3>
                  <div className="space-y-3">
                    {scheduledNotifications
                      .filter(n => n.status === 'pending')
                      .slice(0, 5)
                      .map((notif) => (
                        <div 
                          key={notif.id}
                          className="flex items-center justify-between p-5 border border-foreground/10 rounded-xl"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{notif.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{notif.body}</p>
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                              <Calendar size={12} />
                              {format(new Date(notif.scheduled_at), "dd MMM yyyy 'à' HH:mm", { locale: fr })}
                            </p>
                          </div>
                          <button
                            className="text-muted-foreground hover:text-destructive transition-colors"
                            onClick={() => deleteScheduledNotification.mutate(notif.id)}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                  </div>
                </motion.div>
              )}

              {/* Premium upsell */}
              {!isPremium && (
                <motion.div variants={fadeUp} className="mt-12 p-8 border border-foreground/10 rounded-2xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                      <h3 className="font-serif text-xl font-light mb-2">
                        Débloquez toutes les fonctionnalités
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Passez à l'offre Signature pour accéder aux campagnes
                      </p>
                    </div>
                    <Link to="/order/offre">
                      <button className="bg-foreground text-background px-8 py-4 text-sm tracking-[0.15em] uppercase hover:opacity-80 transition-opacity duration-500">
                        Voir les offres
                      </button>
                    </Link>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </main>

      {/* ═══════════════════════════════════════════════════════════════════
          FOOTER — Minimal
          ═══════════════════════════════════════════════════════════════════ */}
      <footer className="py-12 px-6 sm:px-12 border-t border-foreground/5">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <span className="font-serif text-lg tracking-wide">i-wasp</span>
            <p className="text-xs text-muted-foreground mt-1">
              Haute couture digitale
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2025 i-wasp. Tous droits réservés.
          </p>
        </div>
      </footer>

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!deleteCardId} onOpenChange={() => setDeleteCardId(null)}>
        <AlertDialogContent className="bg-background border-foreground/10">
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette carte ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La carte et toutes les données associées seront supprimées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-foreground/20">Annuler</AlertDialogCancel>
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
        <DialogContent className="bg-background border-foreground/10 max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl font-light text-center">Ajouter au Wallet</DialogTitle>
            <DialogDescription className="text-center text-sm text-muted-foreground">
              Choisissez votre portefeuille numérique
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 pt-4">
            <button
              onClick={() => handleWalletAction("apple")}
              className="w-full p-4 bg-foreground text-background font-medium flex items-center justify-center gap-3 hover:opacity-80 transition-all active:scale-[0.98]"
            >
              <Apple size={20} />
              Apple Wallet
            </button>
            
            <button
              onClick={() => handleWalletAction("google")}
              className="w-full p-4 border border-foreground/30 font-medium flex items-center justify-center gap-3 hover:bg-foreground hover:text-background transition-all active:scale-[0.98]"
            >
              <Smartphone size={20} />
              Google Wallet
            </button>
          </div>
          
          <p className="text-xs text-muted-foreground text-center pt-4">
            Votre carte sera accessible depuis votre téléphone
          </p>
        </DialogContent>
      </Dialog>

      {/* Push Notification modal */}
      <Dialog open={showPushModal} onOpenChange={setShowPushModal}>
        <DialogContent className="bg-background border-foreground/10 max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl font-light flex items-center gap-2">
              <Bell size={20} className="text-muted-foreground" />
              Envoyer une notification
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Envoyez une notification push à tous les abonnés
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 pt-4">
            {/* Quick templates */}
            <div className="space-y-2">
              <label className="text-xs tracking-[0.15em] uppercase text-muted-foreground">Modèles</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: "🎉", title: "Nouveauté", body: "Découvrez notre dernière actualité !" },
                  { icon: "💼", title: "Rappel", body: "N'oubliez pas de me contacter" },
                  { icon: "🎁", title: "Offre spéciale", body: "Profitez d'une offre exclusive" },
                  { icon: "👋", title: "Contact", body: "Je suis disponible pour échanger" },
                ].map((template, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setPushTitle(template.title);
                      setPushMessage(template.body);
                    }}
                    className="flex items-center gap-2 p-3 border border-foreground/10 hover:border-foreground/30 transition-colors text-left"
                  >
                    <span className="text-lg">{template.icon}</span>
                    <span className="text-xs font-medium truncate">{template.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Card selector */}
            {cards.length > 1 && (
              <div className="space-y-2">
                <label className="text-xs tracking-[0.15em] uppercase text-muted-foreground">Carte cible</label>
                <select
                  value={pushCardId || cards[0]?.id || ""}
                  onChange={(e) => setPushCardId(e.target.value)}
                  className="w-full px-4 py-3 border border-foreground/10 bg-background focus:outline-none focus:border-foreground/30"
                >
                  {cards.map((card) => (
                    <option key={card.id} value={card.id}>
                      {card.first_name} {card.last_name} {pushSubscribers?.byCard[card.id] ? `(${pushSubscribers.byCard[card.id]} abonnés)` : "(0 abonnés)"}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs tracking-[0.15em] uppercase text-muted-foreground">Titre</label>
              <input
                type="text"
                value={pushTitle}
                onChange={(e) => setPushTitle(e.target.value)}
                placeholder="Ex: Nouveauté !"
                className="w-full px-4 py-3 border border-foreground/10 bg-background placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs tracking-[0.15em] uppercase text-muted-foreground">Message</label>
              <textarea
                value={pushMessage}
                onChange={(e) => setPushMessage(e.target.value)}
                placeholder="Ex: Découvrez notre nouvelle offre..."
                rows={3}
                className="w-full px-4 py-3 border border-foreground/10 bg-background placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30 resize-none"
              />
            </div>

            {/* Schedule toggle */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isScheduled}
                  onChange={(e) => setIsScheduled(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm flex items-center gap-1">
                  <Clock size={14} />
                  Programmer l'envoi
                </span>
              </label>
              
              {isScheduled && (
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="flex-1 px-4 py-2 border border-foreground/10 bg-background focus:outline-none focus:border-foreground/30 text-sm"
                  />
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-28 px-4 py-2 border border-foreground/10 bg-background focus:outline-none focus:border-foreground/30 text-sm"
                  />
                </div>
              )}
            </div>

            {/* Preview */}
            {(pushTitle || pushMessage) && (
              <div className="p-4 border border-foreground/10">
                <p className="text-xs text-muted-foreground mb-2">Aperçu</p>
                <div className="bg-muted/50 p-3">
                  <p className="font-medium text-sm">{pushTitle || "Titre..."}</p>
                  <p className="text-xs text-muted-foreground mt-1">{pushMessage || "Message..."}</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => {
                setShowPushModal(false);
                setPushTitle("");
                setPushMessage("");
                setIsScheduled(false);
                setScheduledDate("");
                setScheduledTime("");
              }}
              className="flex-1 py-3 border border-foreground/30 text-sm tracking-[0.15em] uppercase hover:bg-foreground hover:text-background transition-all duration-500"
            >
              Annuler
            </button>
            <button
              disabled={!pushTitle || !pushMessage || pushSending || cards.length === 0 || (isScheduled && (!scheduledDate || !scheduledTime))}
              onClick={async () => {
                if (cards.length === 0) return;
                const cardId = pushCardId || cards[0].id;
                
                if (isScheduled && scheduledDate && scheduledTime) {
                  const scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`).toISOString();
                  await createScheduledNotification.mutateAsync({
                    card_id: cardId,
                    title: pushTitle,
                    body: pushMessage,
                    scheduled_at: scheduledAt,
                  });
                  toast.success("Notification programmée !");
                } else {
                  const result = await sendNotification(cardId, pushTitle, pushMessage);
                  
                  await createPushLog.mutateAsync({
                    card_id: cardId,
                    title: pushTitle,
                    body: pushMessage,
                    sent_count: result.sent,
                    failed_count: result.failed,
                  });
                  
                  if (result.sent > 0) {
                    toast.success(`${result.sent} notification(s) envoyée(s) !`);
                  } else if (result.failed === 0 && result.sent === 0) {
                    toast.info("Aucun abonné pour le moment");
                  } else {
                    toast.error("Erreur lors de l'envoi");
                  }
                }
                
                setShowPushModal(false);
                setPushTitle("");
                setPushMessage("");
                setPushCardId(null);
                setIsScheduled(false);
                setScheduledDate("");
                setScheduledTime("");
              }}
              className="flex-1 py-3 bg-foreground text-background text-sm tracking-[0.15em] uppercase hover:opacity-80 transition-opacity duration-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {pushSending || createScheduledNotification.isPending ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  {isScheduled ? "Programmation..." : "Envoi..."}
                </>
              ) : isScheduled ? (
                <>
                  <Clock size={14} />
                  Programmer
                </>
              ) : (
                <>
                  <Send size={14} />
                  Envoyer
                </>
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
