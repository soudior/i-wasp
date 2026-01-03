/**
 * Hook for managing template assignments
 * Allows admins to assign private templates to clients
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface TemplateAssignment {
  id: string;
  user_id: string;
  template_id: string;
  assigned_by: string | null;
  is_locked: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface AssignTemplateParams {
  userId: string;
  templateId: string;
  isLocked?: boolean;
  notes?: string;
}

/**
 * Fetch all template assignments (admin only)
 */
export function useAllTemplateAssignments() {
  return useQuery({
    queryKey: ["template-assignments", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("template_assignments")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as TemplateAssignment[];
    },
  });
}

/**
 * Fetch assignments for current user
 */
export function useMyTemplateAssignments() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["template-assignments", "my", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("template_assignments")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;
      return data as TemplateAssignment[];
    },
    enabled: !!user?.id,
  });
}

/**
 * Check if user has a specific template assigned
 */
export function useHasTemplateAssigned(templateId: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["template-assignments", "check", user?.id, templateId],
    queryFn: async () => {
      if (!user?.id) return false;

      const { data, error } = await supabase
        .from("template_assignments")
        .select("id, is_locked")
        .eq("user_id", user.id)
        .eq("template_id", templateId)
        .maybeSingle();

      if (error) throw error;
      return data ? { assigned: true, isLocked: data.is_locked } : { assigned: false, isLocked: false };
    },
    enabled: !!user?.id,
  });
}

/**
 * Assign a template to a user (admin only)
 */
export function useAssignTemplate() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ userId, templateId, isLocked = true, notes }: AssignTemplateParams) => {
      const { data, error } = await supabase
        .from("template_assignments")
        .insert({
          user_id: userId,
          template_id: templateId,
          assigned_by: user?.id,
          is_locked: isLocked,
          notes: notes || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["template-assignments"] });
      toast.success("Template assigné avec succès");
    },
    onError: (error: Error) => {
      console.error("Error assigning template:", error);
      toast.error("Erreur lors de l'assignation du template");
    },
  });
}

/**
 * Remove a template assignment (admin only)
 */
export function useRemoveTemplateAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assignmentId: string) => {
      const { error } = await supabase
        .from("template_assignments")
        .delete()
        .eq("id", assignmentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["template-assignments"] });
      toast.success("Assignation supprimée");
    },
    onError: (error: Error) => {
      console.error("Error removing assignment:", error);
      toast.error("Erreur lors de la suppression");
    },
  });
}

/**
 * Update template assignment lock status (admin only)
 */
export function useUpdateTemplateAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      assignmentId, 
      isLocked, 
      notes 
    }: { 
      assignmentId: string; 
      isLocked?: boolean; 
      notes?: string;
    }) => {
      const updates: Partial<TemplateAssignment> = {};
      if (isLocked !== undefined) updates.is_locked = isLocked;
      if (notes !== undefined) updates.notes = notes;

      const { data, error } = await supabase
        .from("template_assignments")
        .update(updates)
        .eq("id", assignmentId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["template-assignments"] });
      toast.success("Assignation mise à jour");
    },
    onError: (error: Error) => {
      console.error("Error updating assignment:", error);
      toast.error("Erreur lors de la mise à jour");
    },
  });
}

/**
 * Apply assigned template to user's card
 */
export function useApplyTemplateToCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ cardId, templateId }: { cardId: string; templateId: string }) => {
      const { data, error } = await supabase
        .from("digital_cards")
        .update({ template: templateId })
        .eq("id", cardId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      queryClient.invalidateQueries({ queryKey: ["digital-cards"] });
      toast.success("Template appliqué à la carte");
    },
    onError: (error: Error) => {
      console.error("Error applying template:", error);
      toast.error("Erreur lors de l'application du template");
    },
  });
}
