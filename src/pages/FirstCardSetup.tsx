/**
 * FirstCardSetup - Mandatory first card creation screen
 * Apple Cupertino style
 */

import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, CreditCard, Lock } from "lucide-react";
import { useNavigate, Navigate } from "react-router-dom";

interface FormData {
  first_name: string;
  last_name: string;
  title: string;
  company: string;
  phone: string;
  email: string;
  linkedin: string;
  whatsapp: string;
}

const initialFormData: FormData = {
  first_name: "",
  last_name: "",
  title: "",
  company: "",
  phone: "",
  email: "",
  linkedin: "",
  whatsapp: "",
};

export default function FirstCardSetup() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<FormData>(initialFormData);

  // Check if user already has cards
  const { data: existingCards, isLoading: cardsLoading } = useQuery({
    queryKey: ["adminClients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("digital_cards")
        .select("id")
        .limit(1);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const createCard = useMutation({
    mutationFn: async (data: FormData) => {
      const slug = `${data.first_name}-${data.last_name}`
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

      const { error } = await supabase.from("digital_cards").insert({
        ...data,
        user_id: user?.id,
        slug,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminClients"] });
      toast.success("Carte créée avec succès");
      navigate("/admin");
    },
    onError: () => toast.error("Erreur lors de la création"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.first_name.trim()) {
      toast.error("Le prénom est obligatoire");
      return;
    }
    if (!formData.last_name.trim()) {
      toast.error("Le nom est obligatoire");
      return;
    }

    createCard.mutate(formData);
  };

  // Loading state
  if (authLoading || cardsLoading) {
    return (
      <div className="min-h-dvh flex items-center justify-center" style={{ backgroundColor: "#F5F5F7" }}>
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: "#007AFF" }} />
      </div>
    );
  }

  // Auth check
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

  // Redirect to admin if cards already exist
  if (existingCards && existingCards.length > 0) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-dvh flex items-center justify-center p-4" style={{ backgroundColor: "#F5F5F7" }}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ backgroundColor: "#007AFF" }}
          >
            <CreditCard className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "#1D1D1F" }}>
            Créer votre première carte NFC
          </h1>
        </div>

        {/* Form */}
        <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "#FFFFFF" }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label style={{ color: "#1D1D1F" }}>Prénom *</Label>
                <Input
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  required
                  className="rounded-xl border-gray-200"
                  style={{ backgroundColor: "#F5F5F7" }}
                />
              </div>
              <div className="space-y-2">
                <Label style={{ color: "#1D1D1F" }}>Nom *</Label>
                <Input
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  required
                  className="rounded-xl border-gray-200"
                  style={{ backgroundColor: "#F5F5F7" }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
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

            <div className="grid grid-cols-2 gap-4">
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label style={{ color: "#8E8E93" }}>LinkedIn (optionnel)</Label>
                <Input
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/..."
                  className="rounded-xl border-gray-200"
                  style={{ backgroundColor: "#F5F5F7" }}
                />
              </div>
              <div className="space-y-2">
                <Label style={{ color: "#8E8E93" }}>WhatsApp (optionnel)</Label>
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

            <Button
              type="submit"
              className="w-full rounded-xl font-medium h-12 mt-6"
              style={{ backgroundColor: "#007AFF", color: "#FFFFFF" }}
              disabled={createCard.isPending}
            >
              {createCard.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Générer ma carte"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
