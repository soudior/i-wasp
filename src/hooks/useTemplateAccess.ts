/**
 * Hook for template access control
 * Provides filtered templates based on user role
 * Includes assignment-based access control
 */

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  getAccessibleTemplates, 
  getPublicTemplates,
  getAllTemplates,
  isTemplateAccessible,
  TEMPLATE_REGISTRY,
  type TemplateRegistryEntry 
} from "@/lib/templateRegistry";

interface UseTemplateAccessReturn {
  // Accessible templates for current user
  templates: TemplateRegistryEntry[];
  // All templates (admin only)
  allTemplates: TemplateRegistryEntry[];
  // Check if specific template is accessible
  canAccessTemplate: (templateId: string) => boolean;
  // Check if user can change template (not locked)
  canChangeTemplate: boolean;
  // Currently assigned template (if any)
  assignedTemplate: string | null;
  // Is template locked
  isTemplateLocked: boolean;
  // Is current user admin
  isAdmin: boolean;
  // Loading state
  isLoading: boolean;
}

/**
 * Check if user is admin via user_roles table
 */
function useIsAdmin() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["user-role-admin", user?.id],
    queryFn: async () => {
      if (!user?.id) return false;

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (error) {
        console.error("Error checking admin role:", error);
        return false;
      }

      return !!data;
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

/**
 * Get user's template assignments
 */
function useUserAssignments() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["template-assignments", "user", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("template_assignments")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching assignments:", error);
        return [];
      }

      return data || [];
    },
    enabled: !!user?.id,
  });
}

export function useTemplateAccess(): UseTemplateAccessReturn {
  const { user, loading } = useAuth();
  const { data: isAdmin = false, isLoading: adminLoading } = useIsAdmin();
  const { data: assignments = [], isLoading: assignmentsLoading } = useUserAssignments();

  // Get assigned templates for this user
  const { assignedTemplate, isTemplateLocked } = useMemo(() => {
    if (!assignments.length) {
      return { assignedTemplate: null, isTemplateLocked: false };
    }

    // Get the first locked assignment (priority)
    const lockedAssignment = assignments.find((a) => a.is_locked);
    if (lockedAssignment) {
      return { 
        assignedTemplate: lockedAssignment.template_id, 
        isTemplateLocked: true 
      };
    }

    // Otherwise, return first assignment
    return { 
      assignedTemplate: assignments[0]?.template_id || null, 
      isTemplateLocked: false 
    };
  }, [assignments]);

  // User can change template only if not locked
  const canChangeTemplate = !isTemplateLocked || isAdmin;

  // Get accessible templates including assigned ones
  const templates = useMemo(() => {
    if (loading || adminLoading) return [];

    const baseTemplates = getAccessibleTemplates(isAdmin, user?.id);
    
    // Add assigned templates that aren't already in the list
    const assignedTemplateIds = assignments.map((a) => a.template_id);
    const additionalTemplates = TEMPLATE_REGISTRY.filter(
      (t) => assignedTemplateIds.includes(t.id) && !baseTemplates.some((bt) => bt.id === t.id)
    );

    return [...baseTemplates, ...additionalTemplates];
  }, [isAdmin, user?.id, loading, adminLoading, assignments]);

  const allTemplates = useMemo(() => {
    if (!isAdmin) return [];
    return getAllTemplates();
  }, [isAdmin]);

  const canAccessTemplate = useMemo(() => {
    return (templateId: string) => {
      // Admin can access all
      if (isAdmin) return true;
      
      // Check if template is assigned to user
      if (assignments.some((a) => a.template_id === templateId)) return true;
      
      // Check regular access
      return isTemplateAccessible(templateId, isAdmin, user?.id);
    };
  }, [isAdmin, user?.id, assignments]);

  return {
    templates,
    allTemplates,
    canAccessTemplate,
    canChangeTemplate,
    assignedTemplate,
    isTemplateLocked,
    isAdmin,
    isLoading: loading || adminLoading || assignmentsLoading,
  };
}

/**
 * Hook for public gallery only
 * No auth required
 */
export function usePublicTemplates(): TemplateRegistryEntry[] {
  return useMemo(() => getPublicTemplates(), []);
}
