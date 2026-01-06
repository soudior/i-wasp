import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useCards, useUpdateCard, useDeleteCard } from "@/hooks/useCards";
import { useLeads } from "@/hooks/useLeads";
import { useScans } from "@/hooks/useScans";
import { useUserOrders } from "@/hooks/useOrders";
import { useSubscription } from "@/hooks/useSubscription";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  ChevronRight, Loader2, Settings, Zap
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
  const [deleteCardId, setDeleteCardId] = useState<string | null>(null);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletCardId, setWalletCardId] = useState<string | null>(null);

  const walletCard = cards.find(c => c.id === walletCardId);

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
    
    if (type === "apple") {
      generateAppleWalletPass({ type: "apple", card: walletCard });
      toast.info("Intégration Apple Wallet bientôt disponible.");
    } else {
      generateGoogleWalletPass({ type: "google", card: walletCard });
      toast.info("Intégration Google Wallet bientôt disponible.");
    }
    
    setShowWalletModal(false);
  };

  const totalViews = cards.reduce((acc, card) => acc + (card.view_count || 0), 0);
  const totalLeads = leads.length;
  const conversionRate = totalViews > 0 ? ((totalLeads / totalViews) * 100).toFixed(1) : "0";

  const userName = user?.user_metadata?.first_name || user?.email?.split("@")[0] || "Utilisateur";

  // Stats data
  const stats = [
    { label: "Vues", value: totalViews, icon: Eye, color: "text-blue-500" },
    { label: "Leads", value: totalLeads, icon: Users, color: "text-green-500" },
    { label: "Conversion", value: `${conversionRate}%`, icon: TrendingUp, color: "text-purple-500" },
    { label: "Cartes", value: cards.length, icon: CreditCard, color: "text-orange-500" },
  ];

  // Quick actions
  const quickActions = [
    { label: "Nouvelle carte", icon: Plus, href: "/create", primary: true },
    { label: "Mes commandes", icon: ShoppingBag, href: "/orders", count: orders.length },
    { label: "Paramètres", icon: Settings, href: "/settings" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-5xl">
          
          {/* Header - Cupertino style */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">
              Bonjour, {userName}
            </h1>
            <p className="text-muted-foreground">
              Votre tableau de bord IWASP
            </p>
          </motion.div>

          {/* Stats Grid - Apple-like cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
          >
            {stats.map((stat, index) => (
              <Card 
                key={stat.label}
                className="p-5 bg-card border-border/50 hover:border-border transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-xl bg-secondary ${stat.color}`}>
                    <stat.icon size={18} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground tracking-tight">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">
                  {stat.label}
                </p>
              </Card>
            ))}
          </motion.div>

          {/* Quick Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-3 mb-10"
          >
            {quickActions.map((action) => (
              <Link key={action.label} to={action.href}>
                <Button 
                  variant={action.primary ? "default" : "outline"}
                  className={`gap-2 h-11 px-5 rounded-xl ${
                    action.primary 
                      ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                      : "hover:bg-secondary"
                  }`}
                >
                  <action.icon size={18} />
                  {action.label}
                  {action.count !== undefined && action.count > 0 && (
                    <span className="ml-1 px-2 py-0.5 text-xs bg-secondary rounded-full">
                      {action.count}
                    </span>
                  )}
                </Button>
              </Link>
            ))}
          </motion.div>

          {/* Cards Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">
                Mes cartes
              </h2>
              {cards.length > 0 && (
                <Link to="/create">
                  <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground">
                    Voir tout
                    <ChevronRight size={16} />
                  </Button>
                </Link>
              )}
            </div>

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
                  <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
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
                    className="p-5 bg-card border-border/50 hover:border-border transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
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
                        
                        {/* Info */}
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
                              <span className="text-xs text-green-500 flex items-center gap-1">
                                <Zap size={12} />
                                NFC
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
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
          </motion.section>

          {/* Recent Leads - Simple list */}
          {leads.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-12"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">
                  Leads récents
                </h2>
                <Link to="/leads">
                  <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground">
                    Voir tout
                    <ChevronRight size={16} />
                  </Button>
                </Link>
              </div>

              <Card className="divide-y divide-border/50">
                {leads.slice(0, 5).map((lead) => (
                  <div key={lead.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                        <span className="text-sm font-medium text-foreground">
                          {lead.name?.charAt(0) || "?"}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{lead.name || "Anonyme"}</p>
                        <p className="text-sm text-muted-foreground">{lead.email || lead.phone || "—"}</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(lead.created_at).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                ))}
              </Card>
            </motion.section>
          )}

          {/* Premium upsell - Subtle */}
          {!isPremium && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="p-6 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Passez à Premium</h3>
                    <p className="text-sm text-muted-foreground">
                      Débloquez toutes les fonctionnalités avancées
                    </p>
                  </div>
                  <Link to="/checkout">
                    <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                      Découvrir
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          )}

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
    </div>
  );
};

export default Dashboard;
