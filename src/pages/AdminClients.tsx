/**
 * AdminClients - Simple Client Management Dashboard
 * Apple Cupertino style, minimal and professional
 */

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useAdmin";
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
  Loader2
} from "lucide-react";
import { Navigate } from "react-router-dom";

interface Client {
  id: string;
  first_name: string;
  last_name: string;
  title: string | null;
  company: string | null;
  phone: string | null;
  email: string | null;
  linkedin: string | null;
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
}

const initialFormData: ClientFormData = {
  first_name: "",
  last_name: "",
  title: "",
  company: "",
  phone: "",
  email: "",
  linkedin: "",
};

export default function AdminClients() {
  const { user, loading: authLoading } = useAuth();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const queryClient = useQueryClient();
  
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<ClientFormData>(initialFormData);

  // Fetch all clients (admin sees all cards)
  const { data: clients, isLoading } = useQuery({
    queryKey: ["adminClients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("digital_cards")
        .select("id, first_name, last_name, title, company, phone, email, linkedin, slug")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Client[];
    },
    enabled: !!isAdmin,
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
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClient) {
      updateClient.mutate({ id: editingClient.id, data: formData });
    } else {
      createClient.mutate(formData);
    }
  };

  const copyNfcLink = (slug: string) => {
    const url = `${window.location.origin}/c/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Lien copié");
  };

  // Loading states
  if (authLoading || adminLoading) {
    return (
      <div className="min-h-dvh flex items-center justify-center" style={{ backgroundColor: "#F5F5F7" }}>
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: "#007AFF" }} />
      </div>
    );
  }

  // Auth check
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Admin check
  if (!isAdmin) {
    return (
      <div className="min-h-dvh flex items-center justify-center" style={{ backgroundColor: "#F5F5F7" }}>
        <div className="text-center p-8">
          <p style={{ color: "#1D1D1F" }} className="text-lg font-medium">Accès refusé</p>
          <p style={{ color: "#8E8E93" }} className="text-sm mt-2">Vous n'avez pas les droits d'administration.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh" style={{ backgroundColor: "#F5F5F7" }}>
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-xl border-b" style={{ backgroundColor: "rgba(245, 245, 247, 0.8)", borderColor: "rgba(0,0,0,0.08)" }}>
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold tracking-tight" style={{ color: "#1D1D1F" }}>
            IWASP Admin
          </h1>
          <p className="text-sm" style={{ color: "#8E8E93" }}>
            Gestion des clients
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Add Client Button */}
        {!showForm && (
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
        {showForm && (
          <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "#FFFFFF" }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium" style={{ color: "#1D1D1F" }}>
                {editingClient ? "Modifier le client" : "Nouveau client"}
              </h2>
              <button onClick={resetForm} className="p-2 rounded-full hover:bg-gray-100">
                <X className="h-5 w-5" style={{ color: "#8E8E93" }} />
              </button>
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

        {/* Client List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin" style={{ color: "#007AFF" }} />
            </div>
          ) : clients?.length === 0 ? (
            <div className="text-center py-12 rounded-2xl" style={{ backgroundColor: "#FFFFFF" }}>
              <p style={{ color: "#8E8E93" }}>Aucun client pour le moment</p>
            </div>
          ) : (
            clients?.map((client) => (
              <div
                key={client.id}
                className="rounded-2xl p-4 shadow-sm"
                style={{ backgroundColor: "#FFFFFF" }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate" style={{ color: "#1D1D1F" }}>
                      {client.first_name} {client.last_name}
                    </h3>
                    {(client.title || client.company) && (
                      <p className="text-sm truncate" style={{ color: "#8E8E93" }}>
                        {[client.title, client.company].filter(Boolean).join(" · ")}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap gap-3 mt-3 text-sm" style={{ color: "#8E8E93" }}>
                      {client.phone && (
                        <a href={`tel:${client.phone}`} className="flex items-center gap-1.5 hover:opacity-70">
                          <Phone className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">{client.phone}</span>
                        </a>
                      )}
                      {client.email && (
                        <a href={`mailto:${client.email}`} className="flex items-center gap-1.5 hover:opacity-70">
                          <Mail className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline truncate max-w-[150px]">{client.email}</span>
                        </a>
                      )}
                      <a 
                        href={`/c/${client.slug}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 hover:opacity-70"
                      >
                        <Globe className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Page NFC</span>
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleEdit(client)}
                      className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                      title="Modifier"
                    >
                      <Pencil className="h-4 w-4" style={{ color: "#007AFF" }} />
                    </button>
                    <button
                      onClick={() => copyNfcLink(client.slug)}
                      className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                      title="Copier le lien NFC"
                    >
                      <Copy className="h-4 w-4" style={{ color: "#8E8E93" }} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
