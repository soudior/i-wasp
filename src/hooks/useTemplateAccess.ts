/**
 * Hook for template access control
 * Provides filtered templates based on user role
 */

import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { 
  getAccessibleTemplates, 
  getPublicTemplates,
  getAllTemplates,
  isTemplateAccessible,
  type TemplateRegistryEntry 
} from "@/lib/templateRegistry";

interface UseTemplateAccessReturn {
  // Accessible templates for current user
  templates: TemplateRegistryEntry[];
  // All templates (admin only)
  allTemplates: TemplateRegistryEntry[];
  // Check if specific template is accessible
  canAccessTemplate: (templateId: string) => boolean;
  // Is current user admin
  isAdmin: boolean;
  // Loading state
  isLoading: boolean;
}

export function useTemplateAccess(): UseTemplateAccessReturn {
  const { user, loading } = useAuth();
  
  // For now, we'll use a simple admin check
  // In production, this should check user_roles table
  const isAdmin = useMemo(() => {
    // Check if user has admin role
    // This is a simplified check - in production, query user_roles table
    return !!user?.email?.includes("admin") || !!user?.user_metadata?.is_admin;
  }, [user]);

  const templates = useMemo(() => {
    if (loading) return [];
    return getAccessibleTemplates(isAdmin, user?.id);
  }, [isAdmin, user?.id, loading]);

  const allTemplates = useMemo(() => {
    if (!isAdmin) return [];
    return getAllTemplates();
  }, [isAdmin]);

  const canAccessTemplate = useMemo(() => {
    return (templateId: string) => isTemplateAccessible(templateId, isAdmin, user?.id);
  }, [isAdmin, user?.id]);

  return {
    templates,
    allTemplates,
    canAccessTemplate,
    isAdmin,
    isLoading: loading,
  };
}

/**
 * Hook for public gallery only
 * No auth required
 */
export function usePublicTemplates(): TemplateRegistryEntry[] {
  return useMemo(() => getPublicTemplates(), []);
}
