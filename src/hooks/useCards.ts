import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { SocialLink } from "@/lib/socialNetworks";
import { CardBlock } from "@/lib/cardBlocks";

export interface DigitalCard {
  id: string;
  user_id: string;
  slug: string;
  first_name: string;
  last_name: string;
  title: string | null;
  company: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  location: string | null;
  website: string | null;
  linkedin: string | null;
  instagram: string | null;
  twitter: string | null;
  tagline: string | null;
  photo_url: string | null;
  logo_url: string | null;
  template: string;
  is_active: boolean;
  nfc_enabled: boolean;
  wallet_enabled: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
  social_links: SocialLink[] | null;
  blocks: CardBlock[] | null;
}

export interface CreateCardData {
  first_name: string;
  last_name: string;
  title?: string;
  company?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  instagram?: string;
  twitter?: string;
  tagline?: string;
  photo_url?: string;
  logo_url?: string;
  template?: string;
  social_links?: SocialLink[];
  blocks?: CardBlock[];
}

// Generate a URL-safe slug from name
function generateSlug(firstName: string, lastName: string): string {
  const base = `${firstName}-${lastName}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  
  // Add random suffix for uniqueness
  const suffix = Math.random().toString(36).substring(2, 8);
  return `${base}-${suffix}`;
}

export function useCards() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["cards", user?.id],
    queryFn: async (): Promise<DigitalCard[]> => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("digital_cards" as any)
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []) as unknown as DigitalCard[];
    },
    enabled: !!user,
  });
}

export function useCard(slug: string) {
  return useQuery({
    queryKey: ["card", slug],
    queryFn: async (): Promise<DigitalCard | null> => {
      const { data, error } = await supabase
        .from("digital_cards" as any)
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();

      if (error) throw error;
      return data as unknown as DigitalCard | null;
    },
    enabled: !!slug,
  });
}

export function useCreateCard() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: CreateCardData): Promise<DigitalCard> => {
      if (!user) throw new Error("User not authenticated");

      // Generate slug from name
      const slug = generateSlug(data.first_name, data.last_name);

      const { data: card, error } = await supabase
        .from("digital_cards" as any)
        .insert({
          ...data,
          user_id: user.id,
          slug: slug,
          is_active: true, // Explicitly set active
        } as any)
        .select()
        .single();

      if (error) throw error;
      return card as unknown as DigitalCard;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      toast.success("Carte créée avec succès !");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<DigitalCard> }): Promise<DigitalCard> => {
      const { data: card, error } = await supabase
        .from("digital_cards" as any)
        .update(data as any)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return card as unknown as DigitalCard;
    },
    onSuccess: (card) => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      queryClient.invalidateQueries({ queryKey: ["card", card.slug] });
      toast.success("Carte mise à jour !");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const { error } = await supabase
        .from("digital_cards" as any)
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      toast.success("Carte supprimée");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
