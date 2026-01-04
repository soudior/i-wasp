/**
 * IWASP Public Card Hook
 * Secure access to public card data using RPC functions
 * Never exposes raw email/phone/whatsapp to client
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CardCustomStyles {
  backgroundColor?: string;
  accentColor?: string;
  textColor?: string;
  secondaryTextColor?: string;
  headingFont?: string;
  bodyFont?: string;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  shadowPreset?: "none" | "subtle" | "medium" | "strong" | "glow";
  theme?: "dark" | "light" | "auto";
}

export interface PublicCardData {
  id: string;
  slug: string;
  first_name: string;
  last_name: string;
  title: string | null;
  company: string | null;
  location: string | null;
  website: string | null;
  tagline: string | null;
  photo_url: string | null;
  logo_url: string | null;
  template: string;
  social_links: any[] | null;
  blocks: any[] | null;
  custom_styles: CardCustomStyles | null;
  // Boolean flags - never expose raw contact data
  has_email: boolean;
  has_phone: boolean;
  has_linkedin: boolean;
  has_whatsapp: boolean;
  has_instagram: boolean;
  has_twitter: boolean;
}

export function usePublicCard(slug: string) {
  return useQuery({
    queryKey: ["publicCard", slug],
    queryFn: async (): Promise<PublicCardData | null> => {
      const { data, error } = await supabase.rpc("get_public_card", {
        p_slug: slug,
      });

      if (error) throw error;
      if (!data) return null;
      return data as unknown as PublicCardData;
    },
    enabled: !!slug,
  });
}

export function useCardActionUrl() {
  return async (slug: string, action: "email" | "phone" | "whatsapp" | "linkedin"): Promise<string | null> => {
    const { data, error } = await supabase.rpc("get_card_action_url", {
      p_slug: slug,
      p_action: action,
    });

    if (error) {
      console.error("Error getting action URL:", error);
      return null;
    }
    return data;
  };
}

export function useIncrementCardView() {
  return async (slug: string): Promise<void> => {
    const { error } = await supabase.rpc("increment_card_view", {
      p_slug: slug,
    });

    if (error) {
      console.error("Error incrementing view count:", error);
    }
  };
}
