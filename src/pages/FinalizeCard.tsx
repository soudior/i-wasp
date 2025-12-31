/**
 * Finalize Card
 * 
 * Saves guest card to database after authentication.
 * Handles the transition from guest to authenticated user.
 */

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useGuestCard } from "@/contexts/GuestCardContext";
import { Loader2, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function FinalizeCard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const { guestCard, hasGuestCard, clearGuestCard } = useGuestCard();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<"saving" | "success" | "error">("saving");
  
  const shouldOrder = searchParams.get("order") === "true";

  const saveCard = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not authenticated");
      if (!hasGuestCard) throw new Error("No card data");

      const slug = `${guestCard.first_name}-${guestCard.last_name}`
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        + `-${Date.now().toString(36)}`;

      const { data: insertedCard, error } = await supabase
        .from("digital_cards")
        .insert({
          first_name: guestCard.first_name,
          last_name: guestCard.last_name,
          title: guestCard.title || null,
          company: guestCard.company || null,
          phone: guestCard.phone || null,
          email: guestCard.email || null,
          linkedin: guestCard.linkedin || null,
          whatsapp: guestCard.whatsapp || null,
          website: guestCard.website || null,
          photo_url: guestCard.photo_url || null,
          user_id: user.id,
          slug,
        })
        .select("slug, first_name, last_name")
        .single();

      if (error) throw error;
      return insertedCard;
    },
    onSuccess: (card) => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      clearGuestCard();
      setStatus("success");
      
      // Short delay then navigate
      setTimeout(() => {
        if (shouldOrder) {
          navigate(`/order?cardSlug=${card.slug}`);
        } else {
          navigate(`/onboarding/success?slug=${card.slug}&name=${encodeURIComponent(`${card.first_name} ${card.last_name}`)}`);
        }
      }, 1500);
    },
    onError: (error) => {
      console.error("Failed to save card:", error);
      setStatus("error");
      toast.error("Erreur lors de la sauvegarde");
    },
  });

  // Auto-save when authenticated and has guest card
  useEffect(() => {
    if (!authLoading && user && hasGuestCard && status === "saving") {
      saveCard.mutate();
    }
  }, [authLoading, user, hasGuestCard, status]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login?returnTo=/onboarding/finalize");
    }
  }, [authLoading, user, navigate]);

  // Redirect if no guest card
  useEffect(() => {
    if (!authLoading && user && !hasGuestCard) {
      navigate("/dashboard");
    }
  }, [authLoading, user, hasGuestCard, navigate]);

  if (authLoading || status === "saving") {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center bg-background p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-foreground">Sauvegarde en cours...</h1>
          <p className="text-muted-foreground mt-2">
            Création de votre carte digitale
          </p>
        </motion.div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center bg-background p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-xl font-semibold text-foreground">Carte créée !</h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <p className="text-muted-foreground">Redirection...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center bg-background p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <h1 className="text-xl font-semibold text-foreground mb-4">Une erreur est survenue</h1>
          <button
            onClick={() => {
              setStatus("saving");
              saveCard.mutate();
            }}
            className="text-primary underline"
          >
            Réessayer
          </button>
        </motion.div>
      </div>
    );
  }

  return null;
}
