/**
 * Admin Web Studio Orders - Dashboard pour gérer les commandes de sites web
 */

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminGuard } from "@/components/AdminGuard";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Globe,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  MessageCircle,
  Mail,
  ArrowLeft,
  Zap,
  RefreshCw,
  Search,
  Filter,
  TrendingUp,
  Calendar,
  DollarSign,
  FileText,
  StickyNote,
  User,
  Flag,
  History,
  Plus,
  Save,
  Send,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const COLORS = {
  noir: "#050505",
  noirSoft: "#0A0A0A",
  noirCard: "#111111",
  or: "#D4A853",
  orLight: "#E8C87A",
  ivoire: "#F5F5F5",
  gris: "#6B6B6B",
  border: "#1A1A1A",
  success: "#22C55E",
  warning: "#F59E0B",
  error: "#EF4444",
};

interface StatusHistoryEntry {
  status: string;
  timestamp: string;
  note?: string;
}

interface WebsiteProposal {
  id: string;
  form_data: {
    businessType?: string;
    businessName?: string;
    description?: string;
    style?: string;
    colors?: string;
    websiteUrl?: string;
    socialLinks?: string;
    contactEmail?: string;
    contactPhone?: string;
    products?: string;
  };
  proposal: {
    siteName?: string;
    tagline?: string;
    estimatedPages?: number;
    complexity?: string;
    features?: string[];
    colorPalette?: {
      primary?: string;
      secondary?: string;
    };
  };
  session_id: string | null;
  is_express: boolean | null;
  price_eur: number | null;
  price_mad: number | null;
  status: string | null;
  created_at: string;
  updated_at: string;
  user_id: string | null;
  admin_notes: string | null;
  status_history: StatusHistoryEntry[] | null;
  assigned_to: string | null;
  priority: string | null;
  deadline: string | null;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  generated: { label: "Généré", color: COLORS.gris, icon: FileText },
  ordered: { label: "Commandé", color: COLORS.warning, icon: Package },
  in_progress: { label: "En cours", color: COLORS.or, icon: Clock },
  review: { label: "En révision", color: "#3B82F6", icon: Eye },
  completed: { label: "Terminé", color: COLORS.success, icon: CheckCircle2 },
  cancelled: { label: "Annulé", color: COLORS.error, icon: XCircle },
};

// Email templates
const emailTemplates = [
  {
    id: "custom",
    label: "✏️ Message personnalisé",
    subject: "",
    message: "",
  },
  {
    id: "info_request",
    label: "📋 Demande d'informations",
    subject: "Informations complémentaires nécessaires - {{siteName}}",
    message: `Bonjour,

Pour avancer sur votre projet "{{siteName}}", nous aurions besoin de quelques informations complémentaires :

• [Élément 1 à préciser]
• [Élément 2 à préciser]
• [Élément 3 à préciser]

Merci de nous répondre dès que possible afin de ne pas retarder la livraison.

Cordialement,
L'équipe IWASP Web Studio`,
  },
  {
    id: "mockup_ready",
    label: "🎨 Maquette prête",
    subject: "Votre maquette est prête ! - {{siteName}}",
    message: `Bonjour,

Excellente nouvelle ! La maquette de votre site "{{siteName}}" est maintenant prête pour validation.

📎 Vous la trouverez en pièce jointe ou via le lien ci-dessous :
[Lien vers la maquette]

Merci de nous faire part de vos retours :
✅ Validation pour passer au développement
🔄 Modifications souhaitées (merci de lister les points)

Nous restons à votre disposition pour toute question.

Cordialement,
L'équipe IWASP Web Studio`,
  },
  {
    id: "in_development",
    label: "🛠️ Développement en cours",
    subject: "Votre site est en cours de développement - {{siteName}}",
    message: `Bonjour,

Nous voulions vous tenir informé : le développement de votre site "{{siteName}}" est maintenant en cours ! 🚀

Notre équipe travaille activement sur :
• L'intégration du design validé
• La mise en place des fonctionnalités
• L'optimisation pour mobile

Prochaine étape : Vous recevrez un lien de prévisualisation d'ici quelques jours.

Cordialement,
L'équipe IWASP Web Studio`,
  },
  {
    id: "preview_ready",
    label: "👀 Prévisualisation disponible",
    subject: "Prévisualisez votre site ! - {{siteName}}",
    message: `Bonjour,

Votre site "{{siteName}}" est prêt à être prévisualisé ! 🎉

🔗 Lien de prévisualisation :
[Insérer le lien ici]

Merci de tester les différentes pages et de nous faire part de vos retours :
• Navigation et ergonomie
• Contenu et textes
• Images et visuels
• Fonctionnalités

Une fois validé, nous procéderons à la mise en ligne finale.

Cordialement,
L'équipe IWASP Web Studio`,
  },
  {
    id: "delivery_soon",
    label: "🚀 Livraison imminente",
    subject: "Livraison de votre site dans 24-48h - {{siteName}}",
    message: `Bonjour,

Nous avons le plaisir de vous annoncer que votre site "{{siteName}}" sera livré dans les prochaines 24 à 48 heures ! 🎊

Nous préparons actuellement :
• Les dernières optimisations de performance
• La configuration du domaine et hébergement
• Les tests finaux de compatibilité

Vous recevrez très bientôt un email avec :
• L'URL définitive de votre site
• Les accès à votre espace d'administration
• Un guide de prise en main

Merci de votre confiance !

Cordialement,
L'équipe IWASP Web Studio`,
  },
  {
    id: "delivered",
    label: "✅ Site livré",
    subject: "🎉 Votre site est en ligne ! - {{siteName}}",
    message: `Bonjour,

Félicitations ! Votre site "{{siteName}}" est maintenant en ligne ! 🎉

🌐 URL de votre site : [URL du site]

📋 Vos accès administrateur :
• URL admin : [URL admin]
• Identifiant : [email]
• Mot de passe : [À définir lors de la première connexion]

📚 Ressources utiles :
• Guide de prise en main (en pièce jointe)
• Support : reply à cet email

Nous restons disponibles pour toute question ou modification future.

Merci de votre confiance !

Cordialement,
L'équipe IWASP Web Studio`,
  },
];

function AdminWebStudioOrdersContent() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<WebsiteProposal | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState("normal");
  const [deadline, setDeadline] = useState("");
  
  // Email followup state
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("custom");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [includeOrderDetails, setIncludeOrderDetails] = useState(true);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Apply template
  const applyTemplate = (templateId: string, siteName: string) => {
    const template = emailTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      if (templateId !== "custom") {
        setEmailSubject(template.subject.replace(/\{\{siteName\}\}/g, siteName));
        setEmailMessage(template.message.replace(/\{\{siteName\}\}/g, siteName));
      }
    }
  };

  // Fetch all website proposals with status "ordered" or other non-generated statuses
  const { data: orders, isLoading, refetch } = useQuery({
    queryKey: ["admin-webstudio-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("website_proposals")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Transform data to match interface
      return (data || []).map(item => ({
        ...item,
        form_data: item.form_data as WebsiteProposal['form_data'],
        proposal: item.proposal as WebsiteProposal['proposal'],
        status_history: (Array.isArray(item.status_history) ? item.status_history : []) as unknown as StatusHistoryEntry[],
      })) as WebsiteProposal[];
    },
  });

  // Update order status with history
  const updateStatus = useMutation({
    mutationFn: async ({ id, status, currentHistory }: { id: string; status: string; currentHistory: StatusHistoryEntry[] }) => {
      const newHistoryEntry = {
        status,
        timestamp: new Date().toISOString(),
        note: `Statut changé en: ${statusConfig[status]?.label || status}`
      };
      
      const updatedHistory = [...currentHistory, newHistoryEntry];
      
      const { error } = await supabase
        .from("website_proposals")
        .update({ 
          status, 
          status_history: updatedHistory as unknown as Json[],
          updated_at: new Date().toISOString() 
        })
        .eq("id", id);
      
      if (error) throw error;
      return updatedHistory as StatusHistoryEntry[];
    },
    onSuccess: (updatedHistory) => {
      queryClient.invalidateQueries({ queryKey: ["admin-webstudio-orders"] });
      if (selectedOrder) {
        setSelectedOrder({ ...selectedOrder, status_history: updatedHistory });
      }
      toast.success("Statut mis à jour");
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour");
    },
  });

  // Save notes and details
  const saveOrderDetails = useMutation({
    mutationFn: async ({ 
      id, 
      admin_notes, 
      assigned_to, 
      priority, 
      deadline,
      currentHistory,
      noteToAdd
    }: { 
      id: string; 
      admin_notes: string; 
      assigned_to: string;
      priority: string;
      deadline: string;
      currentHistory: StatusHistoryEntry[];
      noteToAdd?: string;
    }) => {
      let updatedHistory = [...currentHistory];
      
      if (noteToAdd && noteToAdd.trim()) {
        updatedHistory.push({
          status: 'note',
          timestamp: new Date().toISOString(),
          note: noteToAdd
        });
      }
      
      const { error } = await supabase
        .from("website_proposals")
        .update({ 
          admin_notes, 
          assigned_to: assigned_to || null,
          priority,
          deadline: deadline || null,
          status_history: updatedHistory as unknown as Json[],
          updated_at: new Date().toISOString() 
        })
        .eq("id", id);
      
      if (error) throw error;
      return updatedHistory;
    },
    onSuccess: (updatedHistory) => {
      queryClient.invalidateQueries({ queryKey: ["admin-webstudio-orders"] });
      setNewNote("");
      if (selectedOrder) {
        setSelectedOrder({ ...selectedOrder, status_history: updatedHistory });
      }
      toast.success("Détails sauvegardés");
    },
    onError: () => {
      toast.error("Erreur lors de la sauvegarde");
    },
  });

  // Handle opening order details
  const handleOpenOrder = (order: WebsiteProposal) => {
    setSelectedOrder(order);
    setAdminNotes(order.admin_notes || "");
    setAssignedTo(order.assigned_to || "");
    setPriority(order.priority || "normal");
    setDeadline(order.deadline ? order.deadline.split('T')[0] : "");
    setNewNote("");
  };

  // Filter orders
  const filteredOrders = orders?.filter((order) => {
    const matchesSearch = 
      order.proposal?.siteName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.form_data?.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.form_data?.businessType?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Statistics
  const stats = {
    total: orders?.length || 0,
    ordered: orders?.filter((o) => o.status === "ordered").length || 0,
    inProgress: orders?.filter((o) => o.status === "in_progress").length || 0,
    completed: orders?.filter((o) => o.status === "completed").length || 0,
    totalRevenue: orders?.reduce((sum, o) => sum + (o.price_eur || 0), 0) || 0,
  };

  const handleContactWhatsApp = (order: WebsiteProposal) => {
    const message = encodeURIComponent(
      `🚀 Suivi commande Web Studio\n\n` +
      `📌 Projet: ${order.proposal?.siteName || order.form_data?.businessName}\n` +
      `📄 Pages: ${order.proposal?.estimatedPages || "N/A"}\n` +
      `💰 Prix: ${order.price_eur}€\n\n` +
      `Je vous contacte concernant votre commande...`
    );
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  const handleOpenEmailDialog = (order: WebsiteProposal) => {
    const siteName = order.proposal?.siteName || order.form_data?.businessName || "votre projet";
    // Reset to custom template
    setSelectedTemplate("custom");
    setEmailSubject(`Mise à jour de votre projet - ${siteName}`);
    setEmailMessage(`Bonjour,

Nous vous contactons concernant l'avancement de votre projet "${siteName}".

[Votre message ici]

Cordialement,
L'équipe IWASP Web Studio`);
    setIncludeOrderDetails(true);
    setShowEmailDialog(true);
  };

  const handleSendFollowupEmail = async () => {
    if (!selectedOrder || !selectedOrder.form_data?.contactEmail) {
      toast.error("Email du client non disponible");
      return;
    }

    setIsSendingEmail(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Session expirée, veuillez vous reconnecter");
        return;
      }

      const response = await supabase.functions.invoke("send-webstudio-followup", {
        body: {
          orderId: selectedOrder.id,
          email: selectedOrder.form_data.contactEmail,
          siteName: selectedOrder.proposal?.siteName || selectedOrder.form_data?.businessName || "Projet",
          subject: emailSubject,
          message: emailMessage,
          includeOrderDetails,
        },
      });

      if (response.error) {
        throw new Error(response.error.message || "Erreur lors de l'envoi");
      }

      toast.success("Email envoyé avec succès");
      setShowEmailDialog(false);
      setEmailSubject("");
      setEmailMessage("");
      
      // Refresh the order data to get updated history
      queryClient.invalidateQueries({ queryKey: ["admin-webstudio-orders"] });
    } catch (error) {
      console.error("Error sending followup email:", error);
      toast.error(error instanceof Error ? error.message : "Erreur lors de l'envoi de l'email");
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.noir }}>
      {/* Header */}
      <header 
        className="sticky top-0 z-50 backdrop-blur-xl border-b"
        style={{ 
          backgroundColor: `${COLORS.noir}90`,
          borderColor: COLORS.border 
        }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/admin">
                <Button variant="ghost" size="sm" className="gap-2" style={{ color: COLORS.gris }}>
                  <ArrowLeft size={16} />
                  Retour
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-medium flex items-center gap-2" style={{ color: COLORS.ivoire }}>
                  <Globe size={24} style={{ color: COLORS.or }} />
                  Web Studio - Commandes
                </h1>
                <p className="text-sm" style={{ color: COLORS.gris }}>
                  Gérez les commandes de sites web
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refetch()}
              className="gap-2"
              style={{ borderColor: COLORS.border, color: COLORS.ivoire }}
            >
              <RefreshCw size={14} />
              Actualiser
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Total", value: stats.total, icon: FileText, color: COLORS.gris },
            { label: "Commandés", value: stats.ordered, icon: Package, color: COLORS.warning },
            { label: "En cours", value: stats.inProgress, icon: Clock, color: COLORS.or },
            { label: "Terminés", value: stats.completed, icon: CheckCircle2, color: COLORS.success },
            { label: "Revenue", value: `${stats.totalRevenue}€`, icon: DollarSign, color: COLORS.or },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card style={{ backgroundColor: COLORS.noirCard, borderColor: COLORS.border }}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon size={18} style={{ color: stat.color }} />
                    <span className="text-2xl font-light" style={{ color: COLORS.ivoire }}>
                      {stat.value}
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: COLORS.gris }}>{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: COLORS.gris }} />
            <Input
              placeholder="Rechercher par nom de projet..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              style={{ 
                backgroundColor: COLORS.noirCard, 
                borderColor: COLORS.border,
                color: COLORS.ivoire 
              }}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger 
              className="w-full md:w-48"
              style={{ backgroundColor: COLORS.noirCard, borderColor: COLORS.border, color: COLORS.ivoire }}
            >
              <Filter size={14} className="mr-2" />
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent style={{ backgroundColor: COLORS.noirCard, borderColor: COLORS.border }}>
              <SelectItem value="all">Tous les statuts</SelectItem>
              {Object.entries(statusConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>{config.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i} 
                className="h-32 rounded-xl animate-pulse"
                style={{ backgroundColor: COLORS.noirCard }}
              />
            ))}
          </div>
        ) : filteredOrders && filteredOrders.length > 0 ? (
          <div className="grid gap-4">
            <AnimatePresence>
              {filteredOrders.map((order, index) => {
                const status = statusConfig[order.status || "generated"];
                const StatusIcon = status?.icon || FileText;
                
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <Card 
                      className="cursor-pointer transition-all duration-300 hover:scale-[1.01]"
                      style={{ 
                        backgroundColor: COLORS.noirCard, 
                        borderColor: order.status === "ordered" ? `${COLORS.or}40` : COLORS.border,
                      }}
                      onClick={() => handleOpenOrder(order)}
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div 
                              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: `${status?.color || COLORS.gris}20` }}
                            >
                              <StatusIcon size={20} style={{ color: status?.color || COLORS.gris }} />
                            </div>
                            <div>
                              <h3 className="font-medium mb-1" style={{ color: COLORS.ivoire }}>
                                {order.proposal?.siteName || order.form_data?.businessName || "Projet sans nom"}
                              </h3>
                              <p className="text-sm mb-1" style={{ color: COLORS.gris }}>
                                {order.form_data?.businessType}
                              </p>
                              {order.form_data?.contactEmail && (
                                <p className="text-xs mb-2 flex items-center gap-1" style={{ color: COLORS.or }}>
                                  <Mail size={10} />
                                  {order.form_data.contactEmail}
                                </p>
                              )}
                              <div className="flex items-center gap-3 flex-wrap">
                                <Badge 
                                  variant="outline"
                                  style={{ 
                                    borderColor: status?.color,
                                    color: status?.color,
                                    backgroundColor: `${status?.color}10`
                                  }}
                                >
                                  {status?.label || "Généré"}
                                </Badge>
                                {order.is_express && (
                                  <Badge style={{ backgroundColor: `${COLORS.or}20`, color: COLORS.or }}>
                                    <Zap size={12} className="mr-1" />
                                    Express
                                  </Badge>
                                )}
                                <span className="text-xs" style={{ color: COLORS.gris }}>
                                  {order.proposal?.estimatedPages || "?"} pages
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-6 md:text-right">
                            <div>
                              <p className="text-lg font-medium" style={{ color: COLORS.or }}>
                                {order.price_eur || 0}€
                              </p>
                              <p className="text-xs" style={{ color: COLORS.gris }}>
                                {order.price_mad || 0} DH
                              </p>
                            </div>
                            <div>
                              <p className="text-sm" style={{ color: COLORS.ivoire }}>
                                {format(new Date(order.created_at), "dd MMM yyyy", { locale: fr })}
                              </p>
                              <p className="text-xs" style={{ color: COLORS.gris }}>
                                {format(new Date(order.created_at), "HH:mm", { locale: fr })}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <Card style={{ backgroundColor: COLORS.noirCard, borderColor: COLORS.border }}>
            <CardContent className="p-12 text-center">
              <Globe size={48} className="mx-auto mb-4" style={{ color: COLORS.gris }} />
              <h3 className="text-lg mb-2" style={{ color: COLORS.ivoire }}>
                Aucune commande trouvée
              </h3>
              <p className="text-sm" style={{ color: COLORS.gris }}>
                Les commandes Web Studio apparaîtront ici
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent 
          className="max-w-2xl max-h-[90vh] overflow-y-auto"
          style={{ backgroundColor: COLORS.noirCard, borderColor: COLORS.border }}
        >
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3" style={{ color: COLORS.ivoire }}>
                  <Globe size={24} style={{ color: COLORS.or }} />
                  {selectedOrder.proposal?.siteName || selectedOrder.form_data?.businessName}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 mt-4">
                {/* Status Update */}
                <div>
                  <label className="text-sm font-medium mb-2 block" style={{ color: COLORS.gris }}>
                    Statut
                  </label>
                  <Select 
                    value={selectedOrder.status || "generated"}
                    onValueChange={(value) => {
                      updateStatus.mutate({ 
                        id: selectedOrder.id, 
                        status: value,
                        currentHistory: selectedOrder.status_history || []
                      });
                      setSelectedOrder({ ...selectedOrder, status: value });
                    }}
                  >
                    <SelectTrigger style={{ backgroundColor: COLORS.noirSoft, borderColor: COLORS.border, color: COLORS.ivoire }}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent style={{ backgroundColor: COLORS.noirCard, borderColor: COLORS.border }}>
                      {Object.entries(statusConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <config.icon size={14} style={{ color: config.color }} />
                            {config.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Project Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl" style={{ backgroundColor: COLORS.noirSoft }}>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: COLORS.gris }}>Type</p>
                    <p className="font-medium" style={{ color: COLORS.ivoire }}>
                      {selectedOrder.form_data?.businessType || "N/A"}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl" style={{ backgroundColor: COLORS.noirSoft }}>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: COLORS.gris }}>Pages</p>
                    <p className="font-medium" style={{ color: COLORS.ivoire }}>
                      {selectedOrder.proposal?.estimatedPages || "N/A"}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl" style={{ backgroundColor: COLORS.noirSoft }}>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: COLORS.gris }}>Prix EUR</p>
                    <p className="font-medium" style={{ color: COLORS.or }}>
                      {selectedOrder.price_eur || 0}€
                    </p>
                  </div>
                  <div className="p-4 rounded-xl" style={{ backgroundColor: COLORS.noirSoft }}>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: COLORS.gris }}>Prix MAD</p>
                    <p className="font-medium" style={{ color: COLORS.or }}>
                      {selectedOrder.price_mad || 0} DH
                    </p>
                  </div>
                </div>

                {/* Contact Info */}
                {(selectedOrder.form_data?.contactEmail || selectedOrder.form_data?.contactPhone) && (
                  <div className="p-4 rounded-xl" style={{ backgroundColor: `${COLORS.or}15`, border: `1px solid ${COLORS.or}30` }}>
                    <p className="text-xs uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: COLORS.or }}>
                      <Mail size={12} />
                      Contact Client
                    </p>
                    <div className="space-y-1">
                      {selectedOrder.form_data?.contactEmail && (
                        <a 
                          href={`mailto:${selectedOrder.form_data.contactEmail}`}
                          className="block text-sm hover:underline"
                          style={{ color: COLORS.ivoire }}
                        >
                          📧 {selectedOrder.form_data.contactEmail}
                        </a>
                      )}
                      {selectedOrder.form_data?.contactPhone && (
                        <a 
                          href={`tel:${selectedOrder.form_data.contactPhone}`}
                          className="block text-sm hover:underline"
                          style={{ color: COLORS.ivoire }}
                        >
                          📱 {selectedOrder.form_data.contactPhone}
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Products/Services */}
                {selectedOrder.form_data?.products && (
                  <div className="p-4 rounded-xl" style={{ backgroundColor: COLORS.noirSoft }}>
                    <p className="text-xs uppercase tracking-wider mb-2" style={{ color: COLORS.gris }}>Produits / Services</p>
                    <p className="text-sm whitespace-pre-wrap" style={{ color: COLORS.ivoire }}>
                      {selectedOrder.form_data.products}
                    </p>
                  </div>
                )}

                {/* Tagline */}
                {selectedOrder.proposal?.tagline && (
                  <div className="p-4 rounded-xl" style={{ backgroundColor: COLORS.noirSoft }}>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: COLORS.gris }}>Tagline</p>
                    <p style={{ color: COLORS.ivoire }}>{selectedOrder.proposal.tagline}</p>
                  </div>
                )}

                {/* Features */}
                {selectedOrder.proposal?.features && selectedOrder.proposal.features.length > 0 && (
                  <div>
                    <p className="text-xs uppercase tracking-wider mb-2" style={{ color: COLORS.gris }}>Fonctionnalités</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedOrder.proposal.features.map((feature, i) => (
                        <Badge 
                          key={i}
                          variant="outline"
                          style={{ borderColor: COLORS.border, color: COLORS.ivoire }}
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Priority & Assignment */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-wider mb-2 block" style={{ color: COLORS.gris }}>
                      <Flag size={12} className="inline mr-1" />
                      Priorité
                    </label>
                    <Select value={priority} onValueChange={setPriority}>
                      <SelectTrigger style={{ backgroundColor: COLORS.noirSoft, borderColor: COLORS.border, color: COLORS.ivoire }}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent style={{ backgroundColor: COLORS.noirCard, borderColor: COLORS.border }}>
                        <SelectItem value="low">🟢 Basse</SelectItem>
                        <SelectItem value="normal">🟡 Normale</SelectItem>
                        <SelectItem value="high">🟠 Haute</SelectItem>
                        <SelectItem value="urgent">🔴 Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider mb-2 block" style={{ color: COLORS.gris }}>
                      <Calendar size={12} className="inline mr-1" />
                      Deadline
                    </label>
                    <Input
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      style={{ backgroundColor: COLORS.noirSoft, borderColor: COLORS.border, color: COLORS.ivoire }}
                    />
                  </div>
                </div>

                {/* Assigned To */}
                <div>
                  <label className="text-xs uppercase tracking-wider mb-2 block" style={{ color: COLORS.gris }}>
                    <User size={12} className="inline mr-1" />
                    Assigné à
                  </label>
                  <Input
                    placeholder="Nom du responsable..."
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    style={{ backgroundColor: COLORS.noirSoft, borderColor: COLORS.border, color: COLORS.ivoire }}
                  />
                </div>

                {/* Admin Notes */}
                <div>
                  <label className="text-xs uppercase tracking-wider mb-2 block" style={{ color: COLORS.gris }}>
                    <StickyNote size={12} className="inline mr-1" />
                    Notes admin
                  </label>
                  <Textarea
                    placeholder="Notes internes sur cette commande..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={3}
                    style={{ backgroundColor: COLORS.noirSoft, borderColor: COLORS.border, color: COLORS.ivoire }}
                  />
                </div>

                {/* Add Quick Note */}
                <div>
                  <label className="text-xs uppercase tracking-wider mb-2 block" style={{ color: COLORS.gris }}>
                    <Plus size={12} className="inline mr-1" />
                    Ajouter une note rapide
                  </label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Note rapide (ex: Client contacté, En attente retour...)"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      style={{ backgroundColor: COLORS.noirSoft, borderColor: COLORS.border, color: COLORS.ivoire }}
                    />
                  </div>
                </div>

                {/* Save Button */}
                <Button
                  onClick={() => saveOrderDetails.mutate({
                    id: selectedOrder.id,
                    admin_notes: adminNotes,
                    assigned_to: assignedTo,
                    priority,
                    deadline,
                    currentHistory: selectedOrder.status_history || [],
                    noteToAdd: newNote
                  })}
                  disabled={saveOrderDetails.isPending}
                  className="w-full gap-2"
                  style={{ backgroundColor: COLORS.or, color: COLORS.noir }}
                >
                  <Save size={16} />
                  {saveOrderDetails.isPending ? "Sauvegarde..." : "Sauvegarder les détails"}
                </Button>

                {/* Status History */}
                <div>
                  <label className="text-xs uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: COLORS.gris }}>
                    <History size={12} />
                    Historique des actions
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedOrder.status_history && selectedOrder.status_history.length > 0 ? (
                      [...selectedOrder.status_history].reverse().map((entry, i) => {
                        const entryStatus = entry.status === 'note' ? null : statusConfig[entry.status];
                        return (
                          <div 
                            key={i}
                            className="p-3 rounded-lg flex items-start gap-3"
                            style={{ backgroundColor: COLORS.noirSoft }}
                          >
                            <div 
                              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                              style={{ backgroundColor: entry.status === 'note' ? `${COLORS.gris}30` : `${entryStatus?.color || COLORS.gris}20` }}
                            >
                              {entry.status === 'note' ? (
                                <StickyNote size={14} style={{ color: COLORS.gris }} />
                              ) : entryStatus ? (
                                <entryStatus.icon size={14} style={{ color: entryStatus.color }} />
                              ) : (
                                <Clock size={14} style={{ color: COLORS.gris }} />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm" style={{ color: COLORS.ivoire }}>
                                {entry.note}
                              </p>
                              <p className="text-xs mt-1" style={{ color: COLORS.gris }}>
                                {format(new Date(entry.timestamp), "dd MMM yyyy à HH:mm", { locale: fr })}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-center py-4" style={{ color: COLORS.gris }}>
                        Aucun historique
                      </p>
                    )}
                  </div>
                </div>

                {/* Express Badge */}
                {selectedOrder.is_express && (
                  <div 
                    className="p-4 rounded-xl flex items-center gap-3"
                    style={{ backgroundColor: `${COLORS.or}15`, borderColor: `${COLORS.or}40` }}
                  >
                    <Zap size={20} style={{ color: COLORS.or }} />
                    <div>
                      <p className="font-medium" style={{ color: COLORS.or }}>Livraison Express</p>
                      <p className="text-sm" style={{ color: COLORS.gris }}>24-48h demandée</p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col gap-3 pt-4" style={{ borderTop: `1px solid ${COLORS.border}` }}>
                  <div className="flex gap-3">
                    <Button 
                      className="flex-1 gap-2"
                      style={{ 
                        backgroundColor: COLORS.or, 
                        color: COLORS.noir 
                      }}
                      onClick={() => handleContactWhatsApp(selectedOrder)}
                    >
                      <MessageCircle size={16} />
                      WhatsApp
                    </Button>
                    {selectedOrder.form_data?.contactEmail && (
                      <Button 
                        className="flex-1 gap-2"
                        variant="outline"
                        style={{ 
                          borderColor: COLORS.or, 
                          color: COLORS.or 
                        }}
                        onClick={() => handleOpenEmailDialog(selectedOrder)}
                      >
                        <Mail size={16} />
                        Envoyer un email
                      </Button>
                    )}
                  </div>
                  <Button 
                    variant="outline"
                    className="gap-2"
                    style={{ borderColor: COLORS.border, color: COLORS.ivoire }}
                    onClick={() => setSelectedOrder(null)}
                  >
                    Fermer
                  </Button>
                </div>

                {/* Metadata */}
                <div className="text-xs pt-4" style={{ color: COLORS.gris, borderTop: `1px solid ${COLORS.border}` }}>
                  <p>ID: {selectedOrder.id}</p>
                  <p>Session: {selectedOrder.session_id || "N/A"}</p>
                  <p>Créé le: {format(new Date(selectedOrder.created_at), "dd/MM/yyyy à HH:mm", { locale: fr })}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Email Followup Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent 
          className="max-w-lg"
          style={{ backgroundColor: COLORS.noirCard, borderColor: COLORS.border }}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3" style={{ color: COLORS.ivoire }}>
              <Mail size={20} style={{ color: COLORS.or }} />
              Envoyer un email de suivi
            </DialogTitle>
            <DialogDescription style={{ color: COLORS.gris }}>
              {selectedOrder?.form_data?.contactEmail}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            {/* Template Selector */}
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: COLORS.gris }}>
                Template
              </label>
              <Select 
                value={selectedTemplate} 
                onValueChange={(value) => {
                  const siteName = selectedOrder?.proposal?.siteName || selectedOrder?.form_data?.businessName || "votre projet";
                  applyTemplate(value, siteName);
                }}
              >
                <SelectTrigger style={{ backgroundColor: COLORS.noirSoft, borderColor: COLORS.border, color: COLORS.ivoire }}>
                  <SelectValue placeholder="Choisir un template..." />
                </SelectTrigger>
                <SelectContent style={{ backgroundColor: COLORS.noirCard, borderColor: COLORS.border }}>
                  {emailTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: COLORS.gris }}>
                Sujet
              </label>
              <Input
                placeholder="Sujet de l'email..."
                value={emailSubject}
                onChange={(e) => {
                  setEmailSubject(e.target.value);
                  setSelectedTemplate("custom");
                }}
                style={{ backgroundColor: COLORS.noirSoft, borderColor: COLORS.border, color: COLORS.ivoire }}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: COLORS.gris }}>
                Message
              </label>
              <Textarea
                placeholder="Votre message..."
                value={emailMessage}
                onChange={(e) => {
                  setEmailMessage(e.target.value);
                  setSelectedTemplate("custom");
                }}
                rows={10}
                style={{ backgroundColor: COLORS.noirSoft, borderColor: COLORS.border, color: COLORS.ivoire }}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeOrderDetails"
                checked={includeOrderDetails}
                onCheckedChange={(checked) => setIncludeOrderDetails(checked === true)}
              />
              <label 
                htmlFor="includeOrderDetails" 
                className="text-sm cursor-pointer"
                style={{ color: COLORS.ivoire }}
              >
                Inclure le récapitulatif de commande
              </label>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button
                className="flex-1 gap-2"
                style={{ backgroundColor: COLORS.or, color: COLORS.noir }}
                onClick={handleSendFollowupEmail}
                disabled={isSendingEmail || !emailSubject || !emailMessage}
              >
                {isSendingEmail ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Envoi...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Envoyer l'email
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                style={{ borderColor: COLORS.border, color: COLORS.ivoire }}
                onClick={() => setShowEmailDialog(false)}
                disabled={isSendingEmail}
              >
                Annuler
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function AdminWebStudioOrders() {
  return (
    <AdminGuard>
      <AdminWebStudioOrdersContent />
    </AdminGuard>
  );
}
