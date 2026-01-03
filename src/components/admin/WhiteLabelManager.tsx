/**
 * White-Label Manager - Admin Panel
 * 
 * Permet aux administrateurs de gérer le statut white-label des cartes.
 * Quand activé, le footer "Powered by i-Wasp.com" est masqué.
 * 
 * Règle: Seuls les admins peuvent activer/désactiver le white-label.
 */

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search, Shield, ShieldOff, Crown, User, Building2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CardWithBranding {
  id: string;
  slug: string;
  first_name: string;
  last_name: string;
  company: string | null;
  template: string;
  hide_branding: boolean;
  is_active: boolean;
  created_at: string;
}

export function WhiteLabelManager() {
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  // Fetch all cards with branding status
  const { data: cards, isLoading } = useQuery({
    queryKey: ["admin", "cards-branding"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("digital_cards")
        .select("id, slug, first_name, last_name, company, template, hide_branding, is_active, created_at")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as CardWithBranding[];
    },
  });

  // Mutation to toggle white-label status
  const toggleBranding = useMutation({
    mutationFn: async ({ cardId, hideBranding }: { cardId: string; hideBranding: boolean }) => {
      const { error } = await supabase
        .from("digital_cards")
        .update({ hide_branding: hideBranding })
        .eq("id", cardId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "cards-branding"] });
      toast.success(
        variables.hideBranding 
          ? "Mode white-label activé - Branding iWasp masqué" 
          : "Mode white-label désactivé - Branding iWasp visible"
      );
    },
    onError: (error: Error) => {
      console.error("Error toggling branding:", error);
      toast.error("Erreur lors de la mise à jour");
    },
  });

  // Filter cards based on search
  const filteredCards = cards?.filter((card) => {
    if (!searchQuery.trim()) return true;
    const search = searchQuery.toLowerCase();
    return (
      card.first_name.toLowerCase().includes(search) ||
      card.last_name.toLowerCase().includes(search) ||
      card.slug.toLowerCase().includes(search) ||
      (card.company?.toLowerCase().includes(search) ?? false)
    );
  });

  // Stats
  const whiteLabelCount = cards?.filter(c => c.hide_branding).length ?? 0;
  const totalCount = cards?.length ?? 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestion White-Label</h2>
          <p className="text-muted-foreground">
            Gérez le branding "Powered by i-Wasp.com" pour chaque carte
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="gap-2">
            <Crown className="h-3.5 w-3.5 text-amber-500" />
            {whiteLabelCount} white-label
          </Badge>
          <Badge variant="secondary" className="gap-2">
            <User className="h-3.5 w-3.5" />
            {totalCount} cartes
          </Badge>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher par nom, slug ou entreprise..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Cards Grid */}
      <div className="grid gap-4">
        {filteredCards?.length === 0 ? (
          <Card className="py-8">
            <CardContent className="text-center text-muted-foreground">
              Aucune carte trouvée
            </CardContent>
          </Card>
        ) : (
          filteredCards?.map((card) => (
            <Card 
              key={card.id} 
              className={cn(
                "transition-all",
                card.hide_branding && "border-amber-500/30 bg-amber-500/5"
              )}
            >
              <CardContent className="flex items-center justify-between p-4">
                {/* Card Info */}
                <div className="flex items-center gap-4">
                  <div 
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      card.hide_branding 
                        ? "bg-amber-500/20 text-amber-600" 
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {card.hide_branding ? (
                      <Crown className="h-6 w-6" />
                    ) : (
                      <User className="h-6 w-6" />
                    )}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">
                        {card.first_name} {card.last_name}
                      </h3>
                      {card.hide_branding && (
                        <Badge variant="secondary" className="text-amber-600 bg-amber-100">
                          White-label
                        </Badge>
                      )}
                      {!card.is_active && (
                        <Badge variant="destructive">Inactive</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="font-mono">/{card.slug}</span>
                      {card.company && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {card.company}
                          </span>
                        </>
                      )}
                      <span>•</span>
                      <span>{card.template}</span>
                    </div>
                  </div>
                </div>

                {/* Toggle */}
                <div className="flex items-center gap-4">
                  <div className="text-right text-sm">
                    <p className={card.hide_branding ? "text-amber-600 font-medium" : "text-muted-foreground"}>
                      {card.hide_branding ? "Branding masqué" : "Branding visible"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {card.hide_branding ? (
                        <span className="flex items-center gap-1 justify-end">
                          <ShieldOff className="h-3 w-3" />
                          Sans "Powered by i-Wasp"
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 justify-end">
                          <Shield className="h-3 w-3" />
                          Avec "Powered by i-Wasp"
                        </span>
                      )}
                    </p>
                  </div>
                  <Switch
                    checked={card.hide_branding}
                    onCheckedChange={(checked) => 
                      toggleBranding.mutate({ cardId: card.id, hideBranding: checked })
                    }
                    disabled={toggleBranding.isPending}
                    className={cn(
                      card.hide_branding && "data-[state=checked]:bg-amber-500"
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Info Card */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-500" />
            Mode White-Label
          </CardTitle>
          <CardDescription>
            Le mode white-label permet de masquer le footer "Powered by i-Wasp.com" 
            sur les cartes publiques. Cette option est réservée aux offres premium 
            et doit être activée manuellement par un administrateur.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

export default WhiteLabelManager;
