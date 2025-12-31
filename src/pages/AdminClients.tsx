/**
 * AdminClients - Simple Client Management Dashboard
 * Apple Cupertino style, minimal and professional
 */

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  Plus, 
  Pencil, 
  Copy, 
  Phone, 
  Mail, 
  Globe,
  X,
  Check,
  Loader2,
  Download,
  Trash2,
  Lock,
  LogOut
} from "lucide-react";
import { Navigate } from "react-router-dom";
import { downloadVCard } from "@/lib/vcard";

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

interface ClientFormData {
  first_name: string;
  last_name: string;
  title: string;
  company: string;
  phone: string;
  email: string;
  linkedin: string;
  whatsapp: string;
}

const initialFormData: ClientFormData = {
  first_name: "",
  last_name: "",
  title: "",
  company: "",
  phone: "",
  email: "",
  linkedin: "",
  whatsapp: "",
};

// Simple password protection - change this password as needed
const ADMIN_PASSWORD = "iwasp2024";

export default function AdminClients() {
  const { user, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<ClientFormData>(initialFormData);
  const [deletingClientId, setDeletingClientId] = useState<string | null>(null);
  
  // Password protection state
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  // Check if already unlocked in session
  useEffect(() => {
    const unlocked = sessionStorage.getItem("iwasp_admin_unlocked");
    if (unlocked === "true") {
      setIsUnlocked(true);
    }
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsUnlocked(true);
      sessionStorage.setItem("iwasp_admin_unlocked", "true");
      setPasswordError(false);
    } else {
      setPasswordError(true);
      setPasswordInput("");
    }
  };

  const handleLockAdmin = () => {
    sessionStorage.removeItem("iwasp_admin_unlocked");
    setIsUnlocked(false);
    setPasswordInput("");
  };

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
        ...data,
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
        .update(data)
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
      setDeletingClientId(null);
    },
    onError: () => {
      toast.error("Erreur lors de la suppression");
      setDeletingClientId(null);
    },
  });

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingClient(null);
    setShowForm(false);
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.first_name.trim()) {
      toast.error("Le prénom est obligatoire");
      return;
    }
    if (!formData.last_name.trim()) {
      toast.error("Le nom est obligatoire");
      return;
    }
    
    if (editingClient) {
      updateClient.mutate({ id: editingClient.id, data: formData });
    } else {
      createClient.mutate(formData);
    }
  };

  // Generate NFC URL - use production domain
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

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-dvh flex items-center justify-center" style={{ backgroundColor: "#F5F5F7" }}>
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: "#007AFF" }} />
      </div>
    );
  }

  // Auth check - redirect with clear message
  if (!user) {
    return (
      <div className="min-h-dvh flex items-center justify-center p-4" style={{ backgroundColor: "#F5F5F7" }}>
        <div className="w-full max-w-sm rounded-2xl p-8 shadow-sm text-center" style={{ backgroundColor: "#FFFFFF" }}>
          <div 
            className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ backgroundColor: "#FEF3C7" }}
          >
            <Lock className="h-5 w-5" style={{ color: "#D97706" }} />
          </div>
          <h1 className="text-lg font-semibold mb-2" style={{ color: "#1D1D1F" }}>
            Non authentifié
          </h1>
          <p className="text-sm mb-6" style={{ color: "#8E8E93" }}>
            Veuillez vous connecter pour accéder à cette page.
          </p>
          <button
            onClick={() => window.location.href = "/login"}
            className="w-full py-3 rounded-xl font-medium text-sm transition-all active:scale-[0.98]"
            style={{ backgroundColor: "#007AFF", color: "#FFFFFF" }}
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  // Password gate
  if (!isUnlocked) {
    return (
      <div className="min-h-dvh flex items-center justify-center p-4" style={{ backgroundColor: "#F5F5F7" }}>
        <div className="w-full max-w-sm rounded-2xl p-8 shadow-sm" style={{ backgroundColor: "#FFFFFF" }}>
          <div className="text-center mb-6">
            <div 
              className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: "#F5F5F7" }}
            >
              <Lock className="h-5 w-5" style={{ color: "#8E8E93" }} />
            </div>
            <h1 className="text-xl font-semibold" style={{ color: "#1D1D1F" }}>
              Gestion des clients
            </h1>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Input
              type="password"
              value={passwordInput}
              onChange={(e) => {
                setPasswordInput(e.target.value);
                setPasswordError(false);
              }}
              placeholder="Mot de passe"
              className="rounded-xl border-gray-200 text-center"
              style={{ backgroundColor: "#F5F5F7" }}
              autoFocus
            />
            
            {passwordError && (
              <p className="text-sm text-center" style={{ color: "#FF3B30" }}>
                Mot de passe incorrect
              </p>
            )}

            <Button
              type="submit"
              className="w-full rounded-xl font-medium"
              style={{ backgroundColor: "#007AFF", color: "#FFFFFF" }}
            >
              Accéder
            </Button>
          </form>
        </div>
      </div>
    );
  }

  const hasNoClients = !isLoading && (!clients || clients.length === 0);

  // Auto-show form when no clients exist (first card experience)
  const shouldShowForm = showForm || hasNoClients;

  return (
    <div className="min-h-dvh" style={{ backgroundColor: "#F5F5F7" }}>
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-xl border-b" style={{ backgroundColor: "rgba(245, 245, 247, 0.8)", borderColor: "rgba(0,0,0,0.08)" }}>
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold tracking-tight" style={{ color: "#1D1D1F" }}>
            {hasNoClients ? "Créez votre première carte" : "Gestion des clients"}
          </h1>
          <button
            onClick={handleLockAdmin}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
            title="Verrouiller"
          >
            <LogOut className="h-5 w-5" style={{ color: "#8E8E93" }} />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Add Client Button - only show when clients exist and form is not shown */}
        {!shouldShowForm && clients && clients.length > 0 && (
          <Button
            onClick={() => setShowForm(true)}
            className="w-full sm:w-auto rounded-xl font-medium"
            style={{ backgroundColor: "#007AFF", color: "#FFFFFF" }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un client
          </Button>
        )}

        {/* Client Form */}
        {shouldShowForm && (
          <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "#FFFFFF" }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium" style={{ color: "#1D1D1F" }}>
                {editingClient ? "Modifier le client" : hasNoClients ? "Nouvelle carte NFC" : "Nouveau client"}
              </h2>
              {/* Only show close button if there are existing clients */}
              {!hasNoClients && (
                <button onClick={resetForm} className="p-2 rounded-full hover:bg-gray-100">
                  <X className="h-5 w-5" style={{ color: "#8E8E93" }} />
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label style={{ color: "#1D1D1F" }}>Prénom</Label>
                  <Input
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    required
                    className="rounded-xl border-gray-200"
                    style={{ backgroundColor: "#F5F5F7" }}
                  />
                </div>
                <div className="space-y-2">
                  <Label style={{ color: "#1D1D1F" }}>Nom</Label>
                  <Input
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    required
                    className="rounded-xl border-gray-200"
                    style={{ backgroundColor: "#F5F5F7" }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label style={{ color: "#1D1D1F" }}>Poste</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="rounded-xl border-gray-200"
                    style={{ backgroundColor: "#F5F5F7" }}
                  />
                </div>
                <div className="space-y-2">
                  <Label style={{ color: "#1D1D1F" }}>Entreprise</Label>
                  <Input
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="rounded-xl border-gray-200"
                    style={{ backgroundColor: "#F5F5F7" }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label style={{ color: "#1D1D1F" }}>Téléphone</Label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="rounded-xl border-gray-200"
                    style={{ backgroundColor: "#F5F5F7" }}
                  />
                </div>
                <div className="space-y-2">
                  <Label style={{ color: "#1D1D1F" }}>Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="rounded-xl border-gray-200"
                    style={{ backgroundColor: "#F5F5F7" }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label style={{ color: "#1D1D1F" }}>LinkedIn (optionnel)</Label>
                  <Input
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                    className="rounded-xl border-gray-200"
                    style={{ backgroundColor: "#F5F5F7" }}
                  />
                </div>
                <div className="space-y-2">
                  <Label style={{ color: "#1D1D1F" }}>WhatsApp (optionnel)</Label>
                  <Input
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    placeholder="+33 6 12 34 56 78"
                    className="rounded-xl border-gray-200"
                    style={{ backgroundColor: "#F5F5F7" }}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="flex-1 rounded-xl"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="flex-1 rounded-xl font-medium"
                  style={{ backgroundColor: "#007AFF", color: "#FFFFFF" }}
                  disabled={createClient.isPending || updateClient.isPending}
                >
                  {(createClient.isPending || updateClient.isPending) ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      {editingClient ? "Enregistrer" : "Ajouter"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Client List - only show when there are clients */}
        {!hasNoClients && (
        <div className="space-y-3">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin" style={{ color: "#007AFF" }} />
            </div>
          ) : (
            clients?.map((client) => (
              <div
                key={client.id}
                className="rounded-2xl p-4 shadow-sm"
                style={{ backgroundColor: "#FFFFFF" }}
              >
                {/* Client Info */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate" style={{ color: "#1D1D1F" }}>
                      {client.first_name} {client.last_name}
                    </h3>
                    {(client.title || client.company) && (
                      <p className="text-sm truncate" style={{ color: "#8E8E93" }}>
                        {[client.title, client.company].filter(Boolean).join(" · ")}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap gap-3 mt-2 text-sm" style={{ color: "#8E8E93" }}>
                      {client.phone && (
                        <a href={`tel:${client.phone}`} className="flex items-center gap-1.5 hover:opacity-70">
                          <Phone className="h-3.5 w-3.5" />
                          <span>{client.phone}</span>
                        </a>
                      )}
                      {client.email && (
                        <a href={`mailto:${client.email}`} className="flex items-center gap-1.5 hover:opacity-70">
                          <Mail className="h-3.5 w-3.5" />
                          <span className="truncate max-w-[180px]">{client.email}</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleEdit(client)}
                      className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                      title="Modifier"
                    >
                      <Pencil className="h-4 w-4" style={{ color: "#007AFF" }} />
                    </button>
                    <button
                      onClick={() => handleDownloadVCard(client)}
                      className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                      title="Télécharger vCard"
                    >
                      <Download className="h-4 w-4" style={{ color: "#34C759" }} />
                    </button>
                    {deletingClientId === client.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => deleteClient.mutate(client.id)}
                          className="p-2 rounded-xl bg-red-50 hover:bg-red-100 transition-colors"
                          title="Confirmer suppression"
                          disabled={deleteClient.isPending}
                        >
                          {deleteClient.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" style={{ color: "#FF3B30" }} />
                          ) : (
                            <Check className="h-4 w-4" style={{ color: "#FF3B30" }} />
                          )}
                        </button>
                        <button
                          onClick={() => setDeletingClientId(null)}
                          className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                          title="Annuler"
                        >
                          <X className="h-4 w-4" style={{ color: "#8E8E93" }} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeletingClientId(client.id)}
                        className="p-2 rounded-xl hover:bg-red-50 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" style={{ color: "#FF3B30" }} />
                      </button>
                    )}
                  </div>
                </div>

                {/* NFC Link Section */}
                <div 
                  className="rounded-xl p-3 border"
                  style={{ backgroundColor: "#F5F5F7", borderColor: "rgba(0,0,0,0.06)" }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium mb-1" style={{ color: "#8E8E93" }}>
                        Lien NFC
                      </p>
                      <p 
                        className="text-sm font-mono truncate" 
                        style={{ color: "#1D1D1F" }}
                        title={getNfcUrl(client.slug)}
                      >
                        {getNfcUrl(client.slug)}
                      </p>
                      <p className="text-xs mt-1" style={{ color: "#8E8E93" }}>
                        Slug: <span className="font-mono">{client.slug}</span>
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => copyNfcLink(client.slug)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors hover:bg-white"
                        style={{ color: "#007AFF" }}
                        title="Copier le lien NFC"
                      >
                        <Copy className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Copier</span>
                      </button>
                      <button
                        onClick={() => openNfcPage(client.slug)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors hover:bg-white"
                        style={{ color: "#34C759" }}
                        title="Ouvrir la page NFC"
                      >
                        <Globe className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Ouvrir</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        )}
      </main>
    </div>
  );
}
