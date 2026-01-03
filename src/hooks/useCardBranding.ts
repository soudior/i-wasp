/**
 * Hook to check if a card should hide IWASP branding
 * Based on template assignment from database
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { shouldHideBranding, getTemplateById } from "@/lib/templateRegistry";

interface CardBrandingInfo {
  hideBranding: boolean;
  isPrivateTemplate: boolean;
  templateId: string | null;
  isLoading: boolean;
}

/**
 * Check if a card has a private template assignment
 * and should hide IWASP branding
 */
export function useCardBranding(cardId: string | undefined): CardBrandingInfo {
  const { data, isLoading } = useQuery({
    queryKey: ["card-branding", cardId],
    queryFn: async () => {
      if (!cardId) return null;

      // First, get the card's current template
      const { data: card, error: cardError } = await supabase
        .from("digital_cards")
        .select("template, user_id")
        .eq("id", cardId)
        .maybeSingle();

      if (cardError || !card) return null;

      // Check if there's an assignment for this user and template
      const { data: assignment, error: assignmentError } = await supabase
        .from("template_assignments")
        .select("template_id, is_locked")
        .eq("user_id", card.user_id)
        .eq("template_id", card.template)
        .maybeSingle();

      // Check template registry for branding settings
      const templateInfo = getTemplateById(card.template);
      const isPrivate = templateInfo?.visibility === "private" || templateInfo?.visibility === "client";
      
      return {
        templateId: card.template,
        hasAssignment: !!assignment,
        isPrivateTemplate: isPrivate,
        hideBranding: isPrivate ? shouldHideBranding(card.template) : false,
      };
    },
    enabled: !!cardId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  return {
    hideBranding: data?.hideBranding ?? false,
    isPrivateTemplate: data?.isPrivateTemplate ?? false,
    templateId: data?.templateId ?? null,
    isLoading,
  };
}

/**
 * Check branding by template ID only (no database query)
 * Useful for preview purposes
 */
export function useTemplateBranding(templateId: string | null): {
  hideBranding: boolean;
  isPrivateTemplate: boolean;
} {
  if (!templateId) {
    return { hideBranding: false, isPrivateTemplate: false };
  }

  const templateInfo = getTemplateById(templateId);
  const isPrivate = templateInfo?.visibility === "private" || templateInfo?.visibility === "client";

  return {
    hideBranding: isPrivate ? shouldHideBranding(templateId) : false,
    isPrivateTemplate: isPrivate,
  };
}
