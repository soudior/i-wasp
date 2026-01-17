/**
 * AdminClients - Client Management with OMNIA Design System
 * 
 * Palette OMNIA:
 * - Obsidienne: #030303 (Fond principal)
 * - Champagne: #DCC7B0 (Accent principal)
 * - Ivoire: #FDFCFB (Texte & détails)
 */

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  Plus, 
  Pencil, 
  Copy, 
  X,
  Check,
  Loader2,
  Download,
  Trash2,
  ExternalLink,
  Users,
  Key,
  Crown,
  Search,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { downloadVCard } from "@/lib/vcard";
import { clientFormSchema, validateForm, type ClientFormData } from "@/lib/validation";
import { TemplateAssignmentPanel } from "@/components/admin/TemplateAssignmentPanel";
import { WhiteLabelManager } from "@/components/admin/WhiteLabelManager";
import { AdminOmniaLayout } from "@/layouts/AdminOmniaLayout";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// ═══════════════════════════════════════════════════════════════════════════
// OMNIA PALETTE
// ═══════════════════════════════════════════════════════════════════════════
const OMNIA = {
  obsidienne: '#030303',
  obsidienneSurface: '#0A0A0A',
  obsidienneElevated: '#111111',
  champagne: '#DCC7B0',
  champagneMuted: 'rgba(220, 199, 176, 0.15)',
  ivoire: '#FDFCFB',
  ivoireMuted: 'rgba(253, 252, 251, 0.6)',
  ivoireSubtle: 'rgba(253, 252, 251, 0.4)',
  border: 'rgba(255, 255, 255, 0.05)',
  borderActive: 'rgba(220, 199, 176, 0.2)',
  success: '#4ADE80',
  successMuted: 'rgba(74, 222, 128, 0.15)',
  warning: '#FBBF24',
  warningMuted: 'rgba(251, 191, 36, 0.15)',
  info: '#60A5FA',
  infoMuted: 'rgba(96, 165, 250, 0.15)',
  purple: '#A78BFA',
  purpleMuted: 'rgba(167, 139, 250, 0.15)',
  danger: '#F87171',
  dangerMuted: 'rgba(248, 113, 113, 0.15)',
};

interface Client {
  id: string;
  first_name: string;
  last_name: string;
  title: string | null;
  company: string | null;
  phone: string | null;
  email: string | null;
  linkedin: string | null;
  whatsapp: string | null;
  slug: string;
}

interface ClientFormState {
  first_name: string;
  last_name: string;
  title: string;
  company: string;
  phone: string;
  email: string;
  linkedin: string;
  whatsapp: string;
}

const initialFormData: ClientFormState = {
  first_name: "",
  last_name: "",
  title: "",
  company: "",
  phone: "",
  email: "",
  linkedin: "",
  whatsapp: "",
};

export default function AdminClients() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<ClientFormState>(initialFormData);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [deletingClientId, setDeletingClientId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [activeTab, setActiveTab] = useState<"clients" | "templates" | "whitelabel">("clients");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all clients (admin sees all cards)
  const { data: clients, isLoading } = useQuery({
    queryKey: ["adminClients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("digital_cards")
        .select("id, first_name, last_name, title, company, phone, email, linkedin, whatsapp, slug")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Client[];
    },
    enabled: !!user,
  });

  // Create client mutation
  const createClient = useMutation({
    mutationFn: async (data: ClientFormData) => {
      const { error } = await supabase.from("digital_cards").insert({
        first_name: data.first_name,
        last_name: data.last_name,
        title: data.title || null,
        company: data.company || null,
        phone: data.phone || null,
        email: data.email || null,
        linkedin: data.linkedin || null,
        whatsapp: data.whatsapp || null,
        user_id: user?.id,
        slug: `${data.first_name}-${data.last_name}`.toLowerCase().replace(/\s+/g, "-"),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminClients"] });
      toast.success("Client ajouté");
      resetForm();
    },
    onError: () => toast.error("Erreur lors de l'ajout"),
  });

  // Update client mutation
  const updateClient = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ClientFormData }) => {
      const { error } = await supabase
        .from("digital_cards")
        .update({
          first_name: data.first_name,
          last_name: data.last_name,
          title: data.title || null,
          company: data.company || null,
          phone: data.phone || null,
          email: data.email || null,
          linkedin: data.linkedin || null,
          whatsapp: data.whatsapp || null,
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminClients"] });
      toast.success("Client mis à jour");
      resetForm();
    },
    onError: () => toast.error("Erreur lors de la mise à jour"),
  });

  // Delete client mutation
  const deleteClient = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("digital_cards")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminClients"] });
      toast.success("Client supprimé");
      setDeleteDialogOpen(false);
      setClientToDelete(null);
    },
    onError: () => {
      toast.error("Erreur lors de la suppression");
    },
  });

  const resetForm = () => {
    setFormData(initialFormData);
    setFieldErrors({});
    setEditingClient(null);
    setShowForm(false);
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFieldErrors({});
    setFormData({
      first_name: client.first_name,
      last_name: client.last_name,
      title: client.title || "",
      company: client.company || "",
      phone: client.phone || "",
      email: client.email || "",
      linkedin: client.linkedin || "",
      whatsapp: client.whatsapp || "",
    });
    setShowForm(true);
  };

  const handleOpenDeleteDialog = (client: Client) => {
    setClientToDelete(client);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (clientToDelete) {
      deleteClient.mutate(clientToDelete.id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateForm(clientFormSchema, formData);
    
    if (validation.success === false) {
      setFieldErrors(validation.errors);
      const firstError = Object.values(validation.errors)[0];
      if (firstError) toast.error(String(firstError));
      return;
    }
    
    setFieldErrors({});
    const sanitizedData = validation.data;
    
    if (editingClient) {
      updateClient.mutate({ id: editingClient.id, data: sanitizedData });
    } else {
      createClient.mutate(sanitizedData);
    }
  };

  const handleFieldChange = (field: keyof ClientFormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (fieldErrors[field]) {
      setFieldErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const getNfcUrl = (slug: string) => `https://i-wasp.com/card/${slug}`;

  const copyNfcLink = (slug: string) => {
    const url = getNfcUrl(slug);
    navigator.clipboard.writeText(url);
    toast.success("Lien NFC copié");
  };

  const openNfcPage = (slug: string) => {
    window.open(getNfcUrl(slug), "_blank", "noopener,noreferrer");
  };

  const handleDownloadVCard = (client: Client) => {
    downloadVCard({
      firstName: client.first_name,
      lastName: client.last_name,
      title: client.title || undefined,
      company: client.company || undefined,
      email: client.email || undefined,
      phone: client.phone || undefined,
      nfcPageUrl: getNfcUrl(client.slug),
    });
    toast.success("vCard téléchargée");
  };

  // Filter clients based on search
  const filteredClients = clients?.filter(client => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      client.first_name.toLowerCase().includes(search) ||
      client.last_name.toLowerCase().includes(search) ||
      (client.company?.toLowerCase().includes(search)) ||
      (client.email?.toLowerCase().includes(search))
    );
  });

  const tabs = [
    { id: "clients", label: "Clients", icon: Users },
    { id: "templates", label: "Templates", icon: Key },
    { id: "whitelabel", label: "White-label", icon: Crown },
  ] as const;

  return (
    <AdminOmniaLayout title="Clients" subtitle="Gestion des cartes digitales">
      <div className="space-y-6">
        {/* Tabs */}
        <div 
          className="flex gap-1 p-1 rounded-xl w-fit"
          style={{ backgroundColor: OMNIA.obsidienneElevated, border: `1px solid ${OMNIA.border}` }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-light transition-all"
              style={{
                backgroundColor: activeTab === tab.id ? OMNIA.champagneMuted : 'transparent',
                color: activeTab === tab.id ? OMNIA.champagne : OMNIA.ivoireMuted,
                border: activeTab === tab.id ? `1px solid ${OMNIA.borderActive}` : '1px solid transparent',
              }}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Templates Tab */}
        {activeTab === "templates" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-6"
            style={{ 
              background: OMNIA.obsidienneElevated,
              border: `1px solid ${OMNIA.border}`,
            }}
          >
            <TemplateAssignmentPanel />
          </motion.div>
        )}

        {/* White-label Tab */}
        {activeTab === "whitelabel" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-6"
            style={{ 
              background: OMNIA.obsidienneElevated,
              border: `1px solid ${OMNIA.border}`,
            }}
          >
            <WhiteLabelManager />
          </motion.div>
        )}

        {/* Clients Tab */}
        {activeTab === "clients" && (
          <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              {/* Search */}
              <div 
                className="relative flex-1 max-w-md"
              >
                <Search 
                  size={16} 
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: OMNIA.ivoireSubtle }}
                />
                <input
                  type="text"
                  placeholder="Rechercher un client..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-transparent border outline-none transition-colors"
                  style={{ 
                    borderColor: OMNIA.border,
                    color: OMNIA.ivoire,
                  }}
                />
              </div>

              {/* Add Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{ 
                  backgroundColor: OMNIA.champagne,
                  color: OMNIA.obsidienne,
                }}
              >
                <Plus size={16} />
                Ajouter un client
              </motion.button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div 
                className="p-4 rounded-xl"
                style={{ backgroundColor: OMNIA.obsidienneElevated, border: `1px solid ${OMNIA.border}` }}
              >
                <p className="text-2xl font-light" style={{ color: OMNIA.champagne }}>
                  {clients?.length || 0}
                </p>
                <p className="text-xs uppercase tracking-wider mt-1" style={{ color: OMNIA.ivoireSubtle }}>
                  Total clients
                </p>
              </div>
              <div 
                className="p-4 rounded-xl"
                style={{ backgroundColor: OMNIA.obsidienneElevated, border: `1px solid ${OMNIA.border}` }}
              >
                <p className="text-2xl font-light" style={{ color: OMNIA.success }}>
                  {clients?.filter(c => c.email).length || 0}
                </p>
                <p className="text-xs uppercase tracking-wider mt-1" style={{ color: OMNIA.ivoireSubtle }}>
                  Avec email
                </p>
              </div>
              <div 
                className="p-4 rounded-xl"
                style={{ backgroundColor: OMNIA.obsidienneElevated, border: `1px solid ${OMNIA.border}` }}
              >
                <p className="text-2xl font-light" style={{ color: OMNIA.info }}>
                  {clients?.filter(c => c.phone).length || 0}
                </p>
                <p className="text-xs uppercase tracking-wider mt-1" style={{ color: OMNIA.ivoireSubtle }}>
                  Avec téléphone
                </p>
              </div>
              <div 
                className="p-4 rounded-xl"
                style={{ backgroundColor: OMNIA.obsidienneElevated, border: `1px solid ${OMNIA.border}` }}
              >
                <p className="text-2xl font-light" style={{ color: OMNIA.purple }}>
                  {clients?.filter(c => c.linkedin).length || 0}
                </p>
                <p className="text-xs uppercase tracking-wider mt-1" style={{ color: OMNIA.ivoireSubtle }}>
                  Avec LinkedIn
                </p>
              </div>
            </div>

            {/* Clients List */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl overflow-hidden"
              style={{ 
                background: OMNIA.obsidienneElevated,
                border: `1px solid ${OMNIA.border}`,
              }}
            >
              <div className="p-5 border-b" style={{ borderColor: OMNIA.border }}>
                <h3 
                  className="text-sm font-medium uppercase tracking-wider"
                  style={{ color: OMNIA.champagne }}
                >
                  Cartes digitales
                </h3>
                <p className="text-xs mt-1" style={{ color: OMNIA.ivoireSubtle }}>
                  {filteredClients?.length || 0} résultat(s)
                </p>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin" style={{ color: OMNIA.champagne }} />
                </div>
              ) : filteredClients && filteredClients.length > 0 ? (
                <div className="divide-y" style={{ borderColor: OMNIA.border }}>
                  {filteredClients.map((client, index) => (
                    <motion.div
                      key={client.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="p-4 hover:bg-white/[0.02] transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-medium flex-shrink-0"
                          style={{ backgroundColor: OMNIA.champagneMuted, color: OMNIA.champagne }}
                        >
                          {client.first_name.charAt(0)}{client.last_name.charAt(0)}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p 
                            className="font-medium truncate"
                            style={{ color: OMNIA.ivoire }}
                          >
                            {client.first_name} {client.last_name}
                          </p>
                          <p 
                            className="text-xs truncate"
                            style={{ color: OMNIA.ivoireMuted }}
                          >
                            {[client.title, client.company].filter(Boolean).join(" · ") || "—"}
                          </p>
                        </div>

                        {/* NFC Link */}
                        <div className="hidden md:block">
                          <p 
                            className="text-xs font-mono truncate max-w-[200px]"
                            style={{ color: OMNIA.ivoireSubtle }}
                          >
                            {getNfcUrl(client.slug)}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openNfcPage(client.slug)}
                            className="p-2 rounded-lg transition-colors hover:bg-white/5"
                            title="Ouvrir"
                          >
                            <ExternalLink size={14} style={{ color: OMNIA.ivoireMuted }} />
                          </button>
                          
                          <button
                            onClick={() => copyNfcLink(client.slug)}
                            className="p-2 rounded-lg transition-colors"
                            style={{ backgroundColor: OMNIA.successMuted }}
                            title="Copier le lien"
                          >
                            <Copy size={14} style={{ color: OMNIA.success }} />
                          </button>
                          
                          <button
                            onClick={() => handleDownloadVCard(client)}
                            className="p-2 rounded-lg transition-colors"
                            style={{ backgroundColor: OMNIA.infoMuted }}
                            title="Télécharger vCard"
                          >
                            <Download size={14} style={{ color: OMNIA.info }} />
                          </button>
                          
                          <button
                            onClick={() => handleEdit(client)}
                            className="p-2 rounded-lg transition-colors"
                            style={{ backgroundColor: OMNIA.champagneMuted }}
                            title="Modifier"
                          >
                            <Pencil size={14} style={{ color: OMNIA.champagne }} />
                          </button>
                          
                          <button
                            onClick={() => handleOpenDeleteDialog(client)}
                            className="p-2 rounded-lg transition-colors"
                            style={{ backgroundColor: OMNIA.dangerMuted }}
                            title="Supprimer"
                          >
                            <Trash2 size={14} style={{ color: OMNIA.danger }} />
                          </button>

                          <ChevronRight size={14} style={{ color: OMNIA.ivoireSubtle }} />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12" style={{ color: OMNIA.ivoireSubtle }}>
                  {searchQuery ? "Aucun résultat" : "Aucun client pour le moment"}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          ADD/EDIT CLIENT DIALOG
          ═══════════════════════════════════════════════════════════════════ */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-omnia-obsidienne-surface border-white/10 text-omnia-ivoire max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-omnia-champagne">
              {editingClient ? "Modifier le client" : "Nouveau client"}
            </DialogTitle>
            <DialogDescription className="text-omnia-ivoire-muted">
              {editingClient ? "Mettre à jour les informations" : "Créer une nouvelle carte digitale"}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-omnia-ivoire-muted text-xs uppercase tracking-wider">Prénom</Label>
                <Input
                  value={formData.first_name}
                  onChange={handleFieldChange("first_name")}
                  required
                  className={`bg-white/5 border-white/10 text-omnia-ivoire ${fieldErrors.first_name ? "border-red-500" : ""}`}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-omnia-ivoire-muted text-xs uppercase tracking-wider">Nom</Label>
                <Input
                  value={formData.last_name}
                  onChange={handleFieldChange("last_name")}
                  required
                  className={`bg-white/5 border-white/10 text-omnia-ivoire ${fieldErrors.last_name ? "border-red-500" : ""}`}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-omnia-ivoire-muted text-xs uppercase tracking-wider">Poste</Label>
                <Input
                  value={formData.title}
                  onChange={handleFieldChange("title")}
                  className="bg-white/5 border-white/10 text-omnia-ivoire"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-omnia-ivoire-muted text-xs uppercase tracking-wider">Entreprise</Label>
                <Input
                  value={formData.company}
                  onChange={handleFieldChange("company")}
                  className="bg-white/5 border-white/10 text-omnia-ivoire"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-omnia-ivoire-muted text-xs uppercase tracking-wider">Téléphone</Label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={handleFieldChange("phone")}
                  className="bg-white/5 border-white/10 text-omnia-ivoire"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-omnia-ivoire-muted text-xs uppercase tracking-wider">Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={handleFieldChange("email")}
                  className="bg-white/5 border-white/10 text-omnia-ivoire"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-omnia-ivoire-muted text-xs uppercase tracking-wider">LinkedIn</Label>
                <Input
                  value={formData.linkedin}
                  onChange={handleFieldChange("linkedin")}
                  placeholder="https://linkedin.com/in/..."
                  className="bg-white/5 border-white/10 text-omnia-ivoire"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-omnia-ivoire-muted text-xs uppercase tracking-wider">WhatsApp</Label>
                <Input
                  type="tel"
                  value={formData.whatsapp}
                  onChange={handleFieldChange("whatsapp")}
                  placeholder="+33 6 12 34 56 78"
                  className="bg-white/5 border-white/10 text-omnia-ivoire"
                />
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button 
                type="button"
                variant="outline" 
                onClick={resetForm}
                className="border-white/10 text-omnia-ivoire hover:bg-white/5"
              >
                Annuler
              </Button>
              <Button 
                type="submit"
                disabled={createClient.isPending || updateClient.isPending}
                className="bg-omnia-champagne text-omnia-obsidienne hover:bg-omnia-champagne/90"
              >
                {(createClient.isPending || updateClient.isPending) ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    {editingClient ? "Enregistrer" : "Créer"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ═══════════════════════════════════════════════════════════════════
          DELETE CONFIRMATION DIALOG
          ═══════════════════════════════════════════════════════════════════ */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-omnia-obsidienne-surface border-white/10 text-omnia-ivoire">
          <DialogHeader>
            <DialogTitle className="text-omnia-danger">Supprimer le client</DialogTitle>
            <DialogDescription className="text-omnia-ivoire-muted">
              Êtes-vous sûr de vouloir supprimer {clientToDelete?.first_name} {clientToDelete?.last_name} ?
            </DialogDescription>
          </DialogHeader>
          
          <div 
            className="p-4 rounded-xl my-4"
            style={{ backgroundColor: OMNIA.dangerMuted }}
          >
            <p className="text-sm" style={{ color: OMNIA.danger }}>
              ⚠️ Cette action est irréversible. La carte digitale et toutes les données associées seront définitivement supprimées.
            </p>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
              className="border-white/10 text-omnia-ivoire hover:bg-white/5"
            >
              Annuler
            </Button>
            <Button 
              onClick={handleConfirmDelete}
              disabled={deleteClient.isPending}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleteClient.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminOmniaLayout>
  );
}
