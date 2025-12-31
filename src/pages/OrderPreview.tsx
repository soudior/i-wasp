/**
 * OrderPreview - Shows card summary before ordering
 * Apple Cupertino style
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Loader2, ExternalLink, ArrowRight, Lock } from "lucide-react";
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
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-xl font-semibold tracking-tight" style={{ color: "#1D1D1F" }}>
            Commander votre carte NFC
          </h1>
        </div>

        {/* Physical Card Preview - Minimal rounded rectangle */}
        <div className="mb-6">
          <div 
            className="aspect-[1.586/1] rounded-2xl shadow-lg mx-auto max-w-[320px] p-6 flex flex-col justify-between"
            style={{ backgroundColor: "#1D1D1F" }}
          >
            {/* Top - Initials */}
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold"
              style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#FFFFFF" }}
            >
              {card.first_name.charAt(0)}{card.last_name.charAt(0)}
            </div>
            
            {/* Bottom - Name & Role */}
            <div>
              <p className="text-base font-medium" style={{ color: "#FFFFFF" }}>
                {card.first_name} {card.last_name}
              </p>
              {(card.title || card.company) && (
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                  {[card.title, card.company].filter(Boolean).join(" · ")}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* NFC URL */}
        <div className="rounded-2xl p-4 mb-6" style={{ backgroundColor: "#FFFFFF" }}>
          <p className="text-xs font-medium mb-2" style={{ color: "#8E8E93" }}>
            Lien NFC
          </p>
          <p 
            className="font-mono text-sm truncate"
            style={{ color: "#1D1D1F" }}
          >
            {getNfcUrl(card.slug)}
          </p>
        </div>

        {/* Preview Link */}
        <a
          href={getNfcUrl(card.slug)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium mb-4"
          style={{ backgroundColor: "#FFFFFF", color: "#007AFF" }}
        >
          <ExternalLink className="h-4 w-4" />
          Voir ma page NFC
        </a>

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
