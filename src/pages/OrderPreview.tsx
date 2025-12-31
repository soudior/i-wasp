/**
 * OrderPreview - Shows card summary before ordering
 * Apple Cupertino style
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard, ExternalLink, ArrowRight, Lock } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";

interface Card {
  id: string;
  first_name: string;
  last_name: string;
  title: string | null;
  company: string | null;
  slug: string;
}

export default function OrderPreview() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Fetch user's cards
  const { data: cards, isLoading } = useQuery({
    queryKey: ["orderPreviewCards"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("digital_cards")
        .select("id, first_name, last_name, title, company, slug")
        .order("created_at", { ascending: false })
        .limit(1);
      if (error) throw error;
      return data as Card[];
    },
    enabled: !!user,
  });

  const getNfcUrl = (slug: string) => `https://i-wasp.com/card/${slug}`;

  // Loading state
  if (authLoading || isLoading) {
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
            Veuillez vous connecter pour commander.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full py-3 rounded-xl font-medium text-sm transition-all active:scale-[0.98]"
            style={{ backgroundColor: "#007AFF", color: "#FFFFFF" }}
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  // No cards → redirect to setup
  if (!cards || cards.length === 0) {
    return <Navigate to="/setup" replace />;
  }

  const card = cards[0];

  return (
    <div className="min-h-dvh flex items-center justify-center p-4" style={{ backgroundColor: "#F5F5F7" }}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <div
            className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ backgroundColor: "#1D1D1F" }}
          >
            <CreditCard className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "#1D1D1F" }}>
            Commander votre carte NFC
          </h1>
        </div>

        {/* Card Preview */}
        <div className="rounded-2xl shadow-sm overflow-hidden mb-6" style={{ backgroundColor: "#FFFFFF" }}>
          {/* Card Info */}
          <div className="p-5 border-b" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-semibold"
                style={{ backgroundColor: "#007AFF", color: "#FFFFFF" }}
              >
                {card.first_name.charAt(0)}{card.last_name.charAt(0)}
              </div>
              
              {/* Name & Role */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold truncate" style={{ color: "#1D1D1F" }}>
                  {card.first_name} {card.last_name}
                </h3>
                {(card.title || card.company) && (
                  <p className="text-sm truncate" style={{ color: "#8E8E93" }}>
                    {[card.title, card.company].filter(Boolean).join(" · ")}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* NFC URL Preview */}
          <div className="p-4" style={{ backgroundColor: "#F5F5F7" }}>
            <p className="text-xs font-medium mb-2" style={{ color: "#8E8E93" }}>
              Lien NFC qui sera encodé sur votre carte
            </p>
            <div 
              className="rounded-xl p-3 font-mono text-sm truncate"
              style={{ backgroundColor: "#FFFFFF", color: "#1D1D1F" }}
            >
              {getNfcUrl(card.slug)}
            </div>
          </div>

          {/* Preview Link */}
          <div className="p-4 border-t" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
            <a
              href={getNfcUrl(card.slug)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium transition-colors"
              style={{ backgroundColor: "#F5F5F7", color: "#007AFF" }}
            >
              <ExternalLink className="h-4 w-4" />
              Voir ma page NFC
            </a>
          </div>
        </div>

        {/* Order Button */}
        <button
          onClick={() => navigate("/checkout")}
          className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-medium transition-all active:scale-[0.98]"
          style={{ backgroundColor: "#1D1D1F", color: "#FFFFFF" }}
        >
          Continuer vers le paiement
          <ArrowRight className="h-5 w-5" />
        </button>

        {/* Back link */}
        <button
          onClick={() => navigate("/admin")}
          className="w-full mt-4 py-3 text-sm font-medium"
          style={{ color: "#8E8E93" }}
        >
          Retour au tableau de bord
        </button>
      </div>
    </div>
  );
}
