import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCards, useUpdateCard, useDeleteCard } from "@/hooks/useCards";
import { useLeads } from "@/hooks/useLeads";
import { useScans } from "@/hooks/useScans";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  Plus, CreditCard, Users, Eye, TrendingUp, 
  Settings, MoreVertical, Wallet, Share2, QrCode,
  Wifi, WifiOff, Pencil, Trash2, ExternalLink, Copy,
  LogOut
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

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: cards = [], isLoading: cardsLoading } = useCards();
  const { data: leads = [] } = useLeads();
  const { data: scans = [] } = useScans();
  const updateCard = useUpdateCard();
  const deleteCard = useDeleteCard();
  const [deleteCardId, setDeleteCardId] = useState<string | null>(null);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const handleToggleNFC = async (cardId: string, currentState: boolean) => {
    await updateCard.mutateAsync({
      id: cardId,
      data: { nfc_enabled: !currentState },
    });
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

  const handleAddToWallet = (type: "apple" | "google") => {
    toast.info(`Intégration ${type === "apple" ? "Apple" : "Google"} Wallet bientôt disponible`);
  };

  const totalViews = cards.reduce((acc, card) => acc + (card.view_count || 0), 0);
  const totalLeads = leads.length;
  const conversionRate = totalViews > 0 ? ((totalLeads / totalViews) * 100).toFixed(1) : "0";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
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
              <Button variant="outline" onClick={handleLogout}>
                <LogOut size={18} />
                Déconnexion
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            {[
              { label: "Cartes actives", value: cards.filter(c => c.is_active).length.toString(), icon: CreditCard },
              { label: "Vues totales", value: totalViews.toString(), icon: Eye },
              { label: "Leads capturés", value: totalLeads.toString(), icon: Users },
              { label: "Taux de conversion", value: `${conversionRate}%`, icon: TrendingUp },
            ].map((stat) => (
              <Card key={stat.label} variant="premium" className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-foreground/10 flex items-center justify-center">
                    <stat.icon size={20} className="text-foreground" />
                  </div>
                </div>
                <p className="font-display text-2xl font-bold text-foreground mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </Card>
            ))}
          </motion.div>

          {/* Cards list */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="font-display text-xl font-semibold text-foreground mb-4">
              Mes cartes
            </h2>
            
            {cardsLoading ? (
              <div className="flex justify-center py-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 rounded-full border-2 border-foreground/20 border-t-foreground"
                />
              </div>
            ) : cards.length === 0 ? (
              <Card variant="default" className="p-12 text-center">
                <CreditCard size={48} className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  Aucune carte
                </h3>
                <p className="text-muted-foreground mb-6">
                  Créez votre première carte de visite digitale
                </p>
                <Link to="/create">
                  <Button variant="chrome">
                    <Plus size={18} />
                    Créer ma carte
                  </Button>
                </Link>
              </Card>
            ) : (
              <div className="space-y-4">
                {cards.map((card) => (
                  <Card key={card.id} variant="premium" className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      {/* Avatar */}
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-foreground/20 to-foreground/5 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {card.photo_url ? (
                          <img src={card.photo_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="font-display text-xl font-bold text-foreground">
                            {card.first_name?.charAt(0)}{card.last_name?.charAt(0)}
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-display text-lg font-semibold text-foreground">
                            {card.first_name} {card.last_name}
                          </h3>
                          {card.nfc_enabled ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs">
                              <Wifi size={12} />
                              NFC
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs">
                              <WifiOff size={12} />
                              NFC off
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {card.title}{card.company && ` • ${card.company}`}
                        </p>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="font-semibold text-foreground">{card.view_count || 0}</p>
                          <p className="text-xs text-muted-foreground">Vues</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-foreground">
                            {leads.filter(l => l.card_id === card.id).length}
                          </p>
                          <p className="text-xs text-muted-foreground">Leads</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          title="Apple Wallet"
                          onClick={() => handleAddToWallet("apple")}
                        >
                          <Wallet size={16} />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          title="Copier le lien"
                          onClick={() => handleCopyLink(card.slug)}
                        >
                          <Copy size={16} />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          title="Voir la carte"
                          onClick={() => window.open(`/c/${card.slug}`, '_blank')}
                        >
                          <ExternalLink size={16} />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                              <MoreVertical size={16} />
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
                            <DropdownMenuItem onClick={() => handleAddToWallet("apple")}>
                              <Wallet size={14} className="mr-2" />
                              Apple Wallet
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAddToWallet("google")}>
                              <Wallet size={14} className="mr-2" />
                              Google Wallet
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

                {/* Add new card */}
                <Link to="/create">
                  <Card variant="default" className="p-6 border-dashed hover:border-foreground/30 transition-colors cursor-pointer group">
                    <div className="flex items-center justify-center gap-3 text-muted-foreground group-hover:text-foreground transition-colors">
                      <Plus size={20} />
                      <span className="font-medium">Créer une nouvelle carte</span>
                    </div>
                  </Card>
                </Link>
              </div>
            )}
          </motion.div>

          {/* Recent leads */}
          {leads.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-12"
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
              className="mt-12"
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
                              {scan.digital_cards.first_name} {scan.digital_cards.last_name}
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
            <AlertDialogTitle>Supprimer cette carte ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La carte et toutes ses données seront supprimées.
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
    </div>
  );
};

export default Dashboard;
