/**
 * Client Tag Assignments - Assign tags to a specific client
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Tag, Plus, X } from "lucide-react";
import { toast } from "sonner";

const GOTHAM = {
  bg: '#0A0A0B',
  surface: '#111113',
  surfaceHover: '#1A1A1D',
  border: 'rgba(255, 199, 0, 0.15)',
  borderMuted: 'rgba(255, 255, 255, 0.08)',
  gold: '#FFC700',
  text: '#F5F5F5',
  textMuted: 'rgba(245, 245, 245, 0.6)',
};

interface ClientTag {
  id: string;
  name: string;
  color: string;
}

interface TagAssignment {
  id: string;
  client_id: string;
  tag_id: string;
  client_tags: ClientTag;
}

interface ClientTagAssignmentsProps {
  clientId: string;
  clientType: 'card' | 'website' | 'lead' | 'order';
  compact?: boolean;
}

export function ClientTagAssignments({ clientId, clientType, compact = false }: ClientTagAssignmentsProps) {
  const queryClient = useQueryClient();

  // Fetch all tags
  const { data: allTags } = useQuery({
    queryKey: ['client-tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('client_tags')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as ClientTag[];
    },
  });

  // Fetch assigned tags for this client
  const { data: assignments } = useQuery({
    queryKey: ['client-tag-assignments', clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('client_tag_assignments')
        .select('id, client_id, tag_id, client_tags(*)')
        .eq('client_id', clientId);
      
      if (error) throw error;
      return data as TagAssignment[];
    },
  });

  // Assign tag mutation
  const assignTag = useMutation({
    mutationFn: async (tagId: string) => {
      const { error } = await supabase
        .from('client_tag_assignments')
        .insert({ 
          client_id: clientId, 
          client_type: clientType, 
          tag_id: tagId 
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-tag-assignments', clientId] });
      queryClient.invalidateQueries({ queryKey: ['all-clients-unified'] });
      toast.success('Tag ajouté');
    },
    onError: (error: any) => {
      if (error.message?.includes('duplicate')) {
        toast.error('Tag déjà assigné');
      } else {
        toast.error(error.message || 'Erreur');
      }
    },
  });

  // Remove tag mutation
  const removeTag = useMutation({
    mutationFn: async (assignmentId: string) => {
      const { error } = await supabase
        .from('client_tag_assignments')
        .delete()
        .eq('id', assignmentId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-tag-assignments', clientId] });
      queryClient.invalidateQueries({ queryKey: ['all-clients-unified'] });
      toast.success('Tag retiré');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur');
    },
  });

  const assignedTagIds = new Set(assignments?.map(a => a.tag_id) || []);
  const unassignedTags = allTags?.filter(t => !assignedTagIds.has(t.id)) || [];

  if (compact) {
    // Compact view - just show assigned tags
    return (
      <div className="flex flex-wrap gap-1">
        {assignments?.map((assignment) => (
          <span
            key={assignment.id}
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium"
            style={{ 
              backgroundColor: `${assignment.client_tags.color}20`,
              color: assignment.client_tags.color,
            }}
          >
            {assignment.client_tags.name}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2 text-sm font-medium" style={{ color: GOTHAM.textMuted }}>
        <Tag size={14} style={{ color: GOTHAM.gold }} />
        Tags client
      </div>

      {/* Assigned tags */}
      <div className="flex flex-wrap gap-2">
        {assignments?.map((assignment) => (
          <motion.div
            key={assignment.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
            style={{ 
              backgroundColor: `${assignment.client_tags.color}20`,
              color: assignment.client_tags.color,
              border: `1px solid ${assignment.client_tags.color}40`,
            }}
          >
            <span 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: assignment.client_tags.color }} 
            />
            {assignment.client_tags.name}
            <button
              onClick={() => removeTag.mutate(assignment.id)}
              className="ml-1 p-0.5 rounded-full hover:bg-white/20 transition-colors opacity-0 group-hover:opacity-100"
            >
              <X size={10} />
            </button>
          </motion.div>
        ))}

        {(!assignments || assignments.length === 0) && (
          <span className="text-xs" style={{ color: GOTHAM.textMuted }}>
            Aucun tag
          </span>
        )}
      </div>

      {/* Add tags dropdown */}
      {unassignedTags.length > 0 && (
        <div className="pt-2 border-t" style={{ borderColor: GOTHAM.borderMuted }}>
          <div className="flex items-center gap-1.5 text-xs mb-2" style={{ color: GOTHAM.textMuted }}>
            <Plus size={12} />
            Ajouter un tag
          </div>
          <div className="flex flex-wrap gap-1.5">
            {unassignedTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => assignTag.mutate(tag.id)}
                disabled={assignTag.isPending}
                className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all hover:scale-105 opacity-60 hover:opacity-100"
                style={{ 
                  backgroundColor: `${tag.color}10`,
                  color: tag.color,
                  border: `1px dashed ${tag.color}40`,
                }}
              >
                <Plus size={10} />
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ClientTagAssignments;
