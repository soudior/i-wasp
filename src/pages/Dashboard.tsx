import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCards, useUpdateCard, useDeleteCard } from "@/hooks/useCards";
import { useLeads } from "@/hooks/useLeads";
import { useScans } from "@/hooks/useScans";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { DashboardCard } from "@/components/DashboardCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  generateAppleWalletPass, 
  generateGoogleWalletPass,
  supportsAppleWallet,
  supportsGoogleWallet 
} from "@/lib/wallet";
import { 
  Plus, CreditCard, Users, Eye, TrendingUp, 
  MoreVertical, Wallet, QrCode,
  Wifi, WifiOff, Pencil, Trash2, ExternalLink, Copy,
  LogOut, X, Apple, Smartphone
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
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: cards = [], isLoading: cardsLoading } = useCards();
  const { data: leads = [] } = useLeads();
  const { data: scans = [] } = useScans();
  const updateCard = useUpdateCard();
  const deleteCard = useDeleteCard();
  const [deleteCardId, setDeleteCardId] = useState<string | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletCardId, setWalletCardId] = useState<string | null>(null);

  const selectedCard = cards.find(c => c.id === selectedCardId);
  const walletCard = cards.find(c => c.id === walletCardId);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
                Tableau de bord
              </h1>
              <p className="text-muted-foreground">
                Bienvenue, {user?.email}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/create">
                <Button variant="chrome">
                  <Plus size={18} />
                  Nouvelle carte
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          >
            {[
              { label: "Cartes actives", value: cards.filter(c => c.is_active).length.toString(), icon: CreditCard },
              { label: "Vues totales", value: totalViews.toString(), icon: Eye },
              { label: "Leads capturés", value: totalLeads.toString(), icon: Users },
              { label: "Taux de conversion", value: `${conversionRate}%`, icon: TrendingUp },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
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
              </motion.div>
            ))}
          </motion.div>

          {/* Cards Grid - 3D Floating Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
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
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card-glass p-12 text-center"
              >
                <motion.div
                  initial={{ y: 10 }}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <CreditCard size={64} className="mx-auto mb-6 text-chrome" />
                </motion.div>
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
              </motion.div>
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
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: cards.length * 0.1 + 0.2 }}
                >
                  <Link to="/create">
                    <div className="h-full min-h-[280px] card-glass border-dashed border-2 border-foreground/10 hover:border-foreground/30 transition-all cursor-pointer group flex flex-col items-center justify-center p-6">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        transition={{ duration: 0.3 }}
                        className="w-14 h-14 rounded-2xl bg-foreground/10 flex items-center justify-center mb-4 group-hover:bg-foreground/20 transition-colors"
                      >
                        <Plus size={24} className="text-chrome" />
                      </motion.div>
                      <span className="font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                        Nouvelle carte
                      </span>
                    </div>
                  </Link>
                </motion.div>
              </div>
            )}
          </motion.div>

          {/* Recent leads */}
          {leads.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-12"
            >
              <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                Leads récents
              </h2>
              
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
                      {leads.slice(0, 10).map((lead) => (
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
            </motion.div>
          )}

          {/* Recent scans */}
          {scans.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
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
            </motion.div>
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
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleWalletAction("apple")}
              className="w-full p-4 rounded-2xl bg-foreground text-background font-medium flex items-center justify-center gap-3 hover:bg-foreground/90 transition-colors"
            >
              <Apple size={20} />
              Apple Wallet
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleWalletAction("google")}
              className="w-full p-4 rounded-2xl bg-surface-2 text-foreground font-medium flex items-center justify-center gap-3 hover:bg-surface-3 transition-colors border border-border"
            >
              <Smartphone size={20} />
              Google Wallet
            </motion.button>
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