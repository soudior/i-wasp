/**
 * Client Tags Manager - Create and manage tags for organizing clients
 */

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, Plus, X, Edit2, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const TAG_COLORS = [
  '#FFC700', // Gold
  '#22C55E', // Green
  '#3B82F6', // Blue
  '#A855F7', // Purple
  '#EC4899', // Pink
  '#F59E0B', // Orange
  '#EF4444', // Red
  '#6B7280', // Gray
  '#14B8A6', // Teal
  '#8B5CF6', // Violet
];

interface ClientTag {
  id: string;
  name: string;
  color: string;
  created_at: string;
}

interface ClientTagsManagerProps {
  onTagSelect?: (tag: ClientTag) => void;
  selectedTagIds?: string[];
  mode?: 'manage' | 'select';
}

export function ClientTagsManager({ 
  onTagSelect, 
  selectedTagIds = [], 
  mode = 'manage' 
}: ClientTagsManagerProps) {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState(TAG_COLORS[0]);
  const [editingTag, setEditingTag] = useState<ClientTag | null>(null);

  // Fetch all tags
  const { data: tags, isLoading } = useQuery({
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

  // Create tag mutation
  const createTag = useMutation({
    mutationFn: async ({ name, color }: { name: string; color: string }) => {
      const { data, error } = await supabase
        .from('client_tags')
        .insert({ name, color })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-tags'] });
      setIsAdding(false);
      setNewTagName('');
      setNewTagColor(TAG_COLORS[0]);
      toast.success('Tag créé');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de la création');
    },
  });

  // Update tag mutation
  const updateTag = useMutation({
    mutationFn: async ({ id, name, color }: { id: string; name: string; color: string }) => {
      const { error } = await supabase
        .from('client_tags')
        .update({ name, color })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-tags'] });
      setEditingTag(null);
      toast.success('Tag modifié');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de la modification');
    },
  });

  // Delete tag mutation
  const deleteTag = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('client_tags')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-tags'] });
      toast.success('Tag supprimé');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de la suppression');
    },
  });

  const handleCreateTag = () => {
    if (!newTagName.trim()) {
      toast.error('Nom du tag requis');
      return;
    }
    createTag.mutate({ name: newTagName.trim(), color: newTagColor });
  };

  const handleUpdateTag = () => {
    if (!editingTag || !editingTag.name.trim()) {
      toast.error('Nom du tag requis');
      return;
    }
    updateTag.mutate({ 
      id: editingTag.id, 
      name: editingTag.name.trim(), 
      color: editingTag.color 
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm" style={{ color: GOTHAM.textMuted }}>
        <Tag size={14} />
        Chargement...
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium" style={{ color: GOTHAM.textMuted }}>
          <Tag size={14} style={{ color: GOTHAM.gold }} />
          Tags ({tags?.length || 0})
        </div>
        {mode === 'manage' && !isAdding && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAdding(true)}
            className="h-7 gap-1 text-xs"
            style={{ color: GOTHAM.gold }}
          >
            <Plus size={12} />
            Nouveau
          </Button>
        )}
      </div>

      {/* Add new tag form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-3 rounded-lg border space-y-3"
            style={{ backgroundColor: GOTHAM.surfaceHover, borderColor: GOTHAM.borderMuted }}
          >
            <Input
              placeholder="Nom du tag..."
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              className="h-8 text-sm"
              style={{ backgroundColor: GOTHAM.bg, borderColor: GOTHAM.borderMuted, color: GOTHAM.text }}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateTag()}
            />
            
            {/* Color picker */}
            <div className="flex flex-wrap gap-2">
              {TAG_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setNewTagColor(color)}
                  className="w-6 h-6 rounded-full transition-transform hover:scale-110"
                  style={{ 
                    backgroundColor: color,
                    boxShadow: newTagColor === color ? `0 0 0 2px ${GOTHAM.bg}, 0 0 0 4px ${color}` : 'none',
                  }}
                />
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleCreateTag}
                disabled={createTag.isPending}
                className="h-7 text-xs"
                style={{ backgroundColor: GOTHAM.gold, color: '#000' }}
              >
                <Check size={12} className="mr-1" />
                Créer
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsAdding(false);
                  setNewTagName('');
                }}
                className="h-7 text-xs"
                style={{ color: GOTHAM.textMuted }}
              >
                <X size={12} className="mr-1" />
                Annuler
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tags list */}
      <div className="flex flex-wrap gap-2">
        {tags?.map((tag) => {
          const isSelected = selectedTagIds.includes(tag.id);
          const isEditing = editingTag?.id === tag.id;

          if (isEditing) {
            return (
              <motion.div
                key={tag.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-2 rounded-lg border space-y-2"
                style={{ backgroundColor: GOTHAM.surfaceHover, borderColor: GOTHAM.borderMuted }}
              >
                <Input
                  value={editingTag.name}
                  onChange={(e) => setEditingTag({ ...editingTag, name: e.target.value })}
                  className="h-7 text-xs w-24"
                  style={{ backgroundColor: GOTHAM.bg, borderColor: GOTHAM.borderMuted, color: GOTHAM.text }}
                />
                <div className="flex flex-wrap gap-1">
                  {TAG_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setEditingTag({ ...editingTag, color })}
                      className="w-4 h-4 rounded-full"
                      style={{ 
                        backgroundColor: color,
                        boxShadow: editingTag.color === color ? `0 0 0 1px ${GOTHAM.bg}, 0 0 0 2px ${color}` : 'none',
                      }}
                    />
                  ))}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={handleUpdateTag}
                    className="p-1 rounded hover:bg-white/10"
                    style={{ color: GOTHAM.gold }}
                  >
                    <Check size={12} />
                  </button>
                  <button
                    onClick={() => setEditingTag(null)}
                    className="p-1 rounded hover:bg-white/10"
                    style={{ color: GOTHAM.textMuted }}
                  >
                    <X size={12} />
                  </button>
                </div>
              </motion.div>
            );
          }

          return (
            <motion.button
              key={tag.id}
              onClick={() => onTagSelect?.(tag)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all"
              style={{ 
                backgroundColor: isSelected ? `${tag.color}30` : `${tag.color}15`,
                color: tag.color,
                border: `1px solid ${isSelected ? tag.color : 'transparent'}`,
              }}
            >
              <span 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: tag.color }} 
              />
              {tag.name}
              
              {mode === 'manage' && (
                <div className="hidden group-hover:flex items-center gap-0.5 ml-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingTag(tag);
                    }}
                    className="p-0.5 rounded hover:bg-white/20"
                  >
                    <Edit2 size={10} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Supprimer ce tag ?')) {
                        deleteTag.mutate(tag.id);
                      }
                    }}
                    className="p-0.5 rounded hover:bg-white/20"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              )}
            </motion.button>
          );
        })}

        {(!tags || tags.length === 0) && (
          <div className="text-xs" style={{ color: GOTHAM.textMuted }}>
            Aucun tag créé
          </div>
        )}
      </div>
    </div>
  );
}

export default ClientTagsManager;
