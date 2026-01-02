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
  LogOut,
  ExternalLink,
  CreditCard,
  ShoppingBag
} from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { downloadVCard } from "@/lib/vcard";
import { clientFormSchema, validateForm, type ClientFormData } from "@/lib/validation";

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

// Security: Admin access is controlled by RLS policies using has_role(auth.uid(), 'admin')
// No client-side password needed - database enforces access control

export default function AdminClients() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<ClientFormState>(initialFormData);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [deletingClientId, setDeletingClientId] = useState<string | null>(null);
  
  // Check admin role via RLS - the database queries will fail if user doesn't have admin role
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);

  // Verify admin role on mount
  useEffect(() => {
    async function checkAdminRole() {
      if (!user) {
        setIsAdmin(false);
        setCheckingRole(false);
        return;
      }
      
      try {
        // Check if user has admin role via RLS
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();
        
        setIsAdmin(!!data);
      } catch (error) {
        console.error('Error checking admin role:', error);
        setIsAdmin(false);
      } finally {
        setCheckingRole(false);
      }
    }
    
    checkAdminRole();
  }, [user]);

  const handleLogout = async () => {
    navigate('/');
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
      setDeletingClientId(null);
    },
    onError: () => {
      toast.error("Erreur lors de la suppression");
      setDeletingClientId(null);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate with zod schema
    const validation = validateForm(clientFormSchema, formData);
    
    if (validation.success === false) {
      setFieldErrors(validation.errors);
      const firstError = Object.values(validation.errors)[0];
      if (firstError) toast.error(String(firstError));
      return;
    }
    
    // Clear errors on success
    setFieldErrors({});
    const sanitizedData = validation.data;
    
    if (editingClient) {
      updateClient.mutate({ id: editingClient.id, data: sanitizedData });
    } else {
      createClient.mutate(sanitizedData);
    }
  };

  // Handle field change with error clearing
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
  if (authLoading || checkingRole || isLoading) {
    return (
      <div className="min-h-dvh flex items-center justify-center" style={{ backgroundColor: "#F5F5F7" }}>
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: "#007AFF" }} />
      </div>
    );
  }

  // Redirect to setup if no cards exist
  if (!isLoading && clients && clients.length === 0) {
    return <Navigate to="/setup" replace />;
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

  // Admin role check - enforced by RLS
  if (!isAdmin) {
    return (
      <div className="min-h-dvh flex items-center justify-center p-4" style={{ backgroundColor: "#F5F5F7" }}>
        <div className="w-full max-w-sm rounded-2xl p-8 shadow-sm text-center" style={{ backgroundColor: "#FFFFFF" }}>
          <div 
            className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ backgroundColor: "#FEE2E2" }}
          >
            <Lock className="h-5 w-5" style={{ color: "#DC2626" }} />
          </div>
          <h1 className="text-lg font-semibold mb-2" style={{ color: "#1D1D1F" }}>
            Accès refusé
          </h1>
          <p className="text-sm mb-6" style={{ color: "#8E8E93" }}>
            Vous n'avez pas les droits administrateur pour accéder à cette page.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 rounded-xl font-medium text-sm transition-all active:scale-[0.98]"
            style={{ backgroundColor: "#007AFF", color: "#FFFFFF" }}
          >
            Retour à l'accueil
          </button>
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
            onClick={handleLogout}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
            title="Retour"
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
                    onChange={handleFieldChange("first_name")}
                    required
                    className={`rounded-xl border-gray-200 ${fieldErrors.first_name ? "border-red-500" : ""}`}
                    style={{ backgroundColor: "#F5F5F7" }}
                  />
                  {fieldErrors.first_name && (
                    <p className="text-xs text-red-500">{fieldErrors.first_name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label style={{ color: "#1D1D1F" }}>Nom</Label>
                  <Input
                    value={formData.last_name}
                    onChange={handleFieldChange("last_name")}
                    required
                    className={`rounded-xl border-gray-200 ${fieldErrors.last_name ? "border-red-500" : ""}`}
                    style={{ backgroundColor: "#F5F5F7" }}
                  />
                  {fieldErrors.last_name && (
                    <p className="text-xs text-red-500">{fieldErrors.last_name}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label style={{ color: "#1D1D1F" }}>Poste</Label>
                  <Input
                    value={formData.title}
                    onChange={handleFieldChange("title")}
                    className={`rounded-xl border-gray-200 ${fieldErrors.title ? "border-red-500" : ""}`}
                    style={{ backgroundColor: "#F5F5F7" }}
                  />
                  {fieldErrors.title && (
                    <p className="text-xs text-red-500">{fieldErrors.title}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label style={{ color: "#1D1D1F" }}>Entreprise</Label>
                  <Input
                    value={formData.company}
                    onChange={handleFieldChange("company")}
                    className={`rounded-xl border-gray-200 ${fieldErrors.company ? "border-red-500" : ""}`}
                    style={{ backgroundColor: "#F5F5F7" }}
                  />
                  {fieldErrors.company && (
                    <p className="text-xs text-red-500">{fieldErrors.company}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label style={{ color: "#1D1D1F" }}>Téléphone</Label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={handleFieldChange("phone")}
                    className={`rounded-xl border-gray-200 ${fieldErrors.phone ? "border-red-500" : ""}`}
                    style={{ backgroundColor: "#F5F5F7" }}
                  />
                  {fieldErrors.phone && (
                    <p className="text-xs text-red-500">{fieldErrors.phone}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label style={{ color: "#1D1D1F" }}>Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={handleFieldChange("email")}
                    className={`rounded-xl border-gray-200 ${fieldErrors.email ? "border-red-500" : ""}`}
                    style={{ backgroundColor: "#F5F5F7" }}
                  />
                  {fieldErrors.email && (
                    <p className="text-xs text-red-500">{fieldErrors.email}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label style={{ color: "#1D1D1F" }}>LinkedIn (optionnel)</Label>
                  <Input
                    value={formData.linkedin}
                    onChange={handleFieldChange("linkedin")}
                    placeholder="https://linkedin.com/in/..."
                    className={`rounded-xl border-gray-200 ${fieldErrors.linkedin ? "border-red-500" : ""}`}
                    style={{ backgroundColor: "#F5F5F7" }}
                  />
                  {fieldErrors.linkedin && (
                    <p className="text-xs text-red-500">{fieldErrors.linkedin}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label style={{ color: "#1D1D1F" }}>WhatsApp (optionnel)</Label>
                  <Input
                    type="tel"
                    value={formData.whatsapp}
                    onChange={handleFieldChange("whatsapp")}
                    placeholder="+33 6 12 34 56 78"
                    className={`rounded-xl border-gray-200 ${fieldErrors.whatsapp ? "border-red-500" : ""}`}
                    style={{ backgroundColor: "#F5F5F7" }}
                  />
                  {fieldErrors.whatsapp && (
                    <p className="text-xs text-red-500">{fieldErrors.whatsapp}</p>
                  )}
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

        {/* Client Cards - Clean preview */}
        {!hasNoClients && (
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin" style={{ color: "#007AFF" }} />
            </div>
          ) : (
            clients?.map((client) => (
              <div
                key={client.id}
                className="rounded-2xl shadow-sm overflow-hidden"
                style={{ backgroundColor: "#FFFFFF" }}
              >
                {/* Card Preview Header */}
                <div className="p-5 border-b" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div 
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-semibold"
                      style={{ backgroundColor: "#007AFF", color: "#FFFFFF" }}
                    >
                      {client.first_name.charAt(0)}{client.last_name.charAt(0)}
                    </div>
                    
                    {/* Name & Role */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold truncate" style={{ color: "#1D1D1F" }}>
                        {client.first_name} {client.last_name}
                      </h3>
                      {(client.title || client.company) && (
                        <p className="text-sm truncate" style={{ color: "#8E8E93" }}>
                          {[client.title, client.company].filter(Boolean).join(" · ")}
                        </p>
                      )}
                    </div>

                    {/* Edit Button */}
                    <button
                      onClick={() => handleEdit(client)}
                      className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
                      title="Modifier"
                    >
                      <Pencil className="h-5 w-5" style={{ color: "#007AFF" }} />
                    </button>
                  </div>
                </div>

                {/* NFC Link - Prominent */}
                <div className="p-4" style={{ backgroundColor: "#F5F5F7" }}>
                  <p className="text-xs font-medium mb-2" style={{ color: "#8E8E93" }}>
                    Lien NFC
                  </p>
                  <div 
                    className="rounded-xl p-3 font-mono text-sm truncate"
                    style={{ backgroundColor: "#FFFFFF", color: "#1D1D1F" }}
                    title={getNfcUrl(client.slug)}
                  >
                    {getNfcUrl(client.slug)}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-4 grid grid-cols-3 gap-3">
                  <button
                    onClick={() => openNfcPage(client.slug)}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl transition-colors hover:bg-gray-50"
                    style={{ backgroundColor: "#F5F5F7" }}
                  >
                    <ExternalLink className="h-5 w-5" style={{ color: "#007AFF" }} />
                    <span className="text-xs font-medium" style={{ color: "#1D1D1F" }}>
                      Ouvrir
                    </span>
                  </button>
                  
                  <button
                    onClick={() => copyNfcLink(client.slug)}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl transition-colors hover:bg-gray-50"
                    style={{ backgroundColor: "#F5F5F7" }}
                  >
                    <Copy className="h-5 w-5" style={{ color: "#34C759" }} />
                    <span className="text-xs font-medium" style={{ color: "#1D1D1F" }}>
                      Copier
                    </span>
                  </button>
                  
                  <button
                    onClick={() => handleDownloadVCard(client)}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl transition-colors hover:bg-gray-50"
                    style={{ backgroundColor: "#F5F5F7" }}
                  >
                    <Download className="h-5 w-5" style={{ color: "#FF9500" }} />
                    <span className="text-xs font-medium" style={{ color: "#1D1D1F" }}>
                      vCard
                    </span>
                  </button>
                </div>

                {/* Order NFC Card Button */}
                <div className="px-4 pb-4">
                  <button
                    onClick={() => navigate("/order")}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-medium text-sm transition-all active:scale-[0.98]"
                    style={{ backgroundColor: "#1D1D1F", color: "#FFFFFF" }}
                  >
                    <CreditCard className="h-4 w-4" />
                    Commander ma carte NFC
                  </button>
                </div>

                {/* Delete - Small, secondary */}
                <div className="px-4 pb-4 flex justify-end">
                  {deletingClientId === client.id ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => deleteClient.mutate(client.id)}
                        className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                        style={{ backgroundColor: "#FEE2E2", color: "#DC2626" }}
                        disabled={deleteClient.isPending}
                      >
                        {deleteClient.isPending ? "..." : "Confirmer"}
                      </button>
                      <button
                        onClick={() => setDeletingClientId(null)}
                        className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                        style={{ color: "#8E8E93" }}
                      >
                        Annuler
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeletingClientId(client.id)}
                      className="text-xs px-3 py-1.5 rounded-lg transition-colors hover:bg-red-50"
                      style={{ color: "#8E8E93" }}
                    >
                      Supprimer
                    </button>
                  )}
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
