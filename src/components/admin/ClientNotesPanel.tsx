/**
 * Client Notes Panel - Add and view notes for a specific client
 */

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { StickyNote, Plus, Trash2, Edit2, Check, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

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

interface ClientNote {
  id: string;
  client_id: string;
  client_type: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface ClientNotesPanelProps {
  clientId: string;
  clientType: 'card' | 'website' | 'lead' | 'order';
}

export function ClientNotesPanel({ clientId, clientType }: ClientNotesPanelProps) {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [editingNote, setEditingNote] = useState<ClientNote | null>(null);

  // Fetch notes for this client
  const { data: notes, isLoading } = useQuery({
    queryKey: ['client-notes', clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('client_notes')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ClientNote[];
    },
  });

  // Create note mutation
  const createNote = useMutation({
    mutationFn: async (content: string) => {
      const { data, error } = await supabase
        .from('client_notes')
        .insert({ 
          client_id: clientId, 
          client_type: clientType, 
          content 
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-notes', clientId] });
      setIsAdding(false);
      setNewNote('');
      toast.success('Note ajoutée');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de l\'ajout');
    },
  });

  // Update note mutation
  const updateNote = useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      const { error } = await supabase
        .from('client_notes')
        .update({ content })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-notes', clientId] });
      setEditingNote(null);
      toast.success('Note modifiée');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de la modification');
    },
  });

  // Delete note mutation
  const deleteNote = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('client_notes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-notes', clientId] });
      toast.success('Note supprimée');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de la suppression');
    },
  });

  const handleCreateNote = () => {
    if (!newNote.trim()) {
      toast.error('Contenu requis');
      return;
    }
    createNote.mutate(newNote.trim());
  };

  const handleUpdateNote = () => {
    if (!editingNote || !editingNote.content.trim()) {
      toast.error('Contenu requis');
      return;
    }
    updateNote.mutate({ id: editingNote.id, content: editingNote.content.trim() });
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium" style={{ color: GOTHAM.textMuted }}>
          <StickyNote size={14} style={{ color: GOTHAM.gold }} />
          Notes ({notes?.length || 0})
        </div>
        {!isAdding && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAdding(true)}
            className="h-7 gap-1 text-xs"
            style={{ color: GOTHAM.gold }}
          >
            <Plus size={12} />
            Ajouter
          </Button>
        )}
      </div>

      {/* Add note form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-3 rounded-lg border space-y-3"
            style={{ backgroundColor: GOTHAM.surfaceHover, borderColor: GOTHAM.borderMuted }}
          >
            <Textarea
              placeholder="Ajouter une note..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="min-h-[80px] text-sm resize-none"
              style={{ backgroundColor: GOTHAM.bg, borderColor: GOTHAM.borderMuted, color: GOTHAM.text }}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleCreateNote}
                disabled={createNote.isPending}
                className="h-7 text-xs"
                style={{ backgroundColor: GOTHAM.gold, color: '#000' }}
              >
                <Check size={12} className="mr-1" />
                Ajouter
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsAdding(false);
                  setNewNote('');
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

      {/* Notes list */}
      {isLoading ? (
        <div className="text-sm" style={{ color: GOTHAM.textMuted }}>
          Chargement...
        </div>
      ) : (
        <div className="space-y-2">
          {notes?.map((note) => {
            const isEditing = editingNote?.id === note.id;

            if (isEditing) {
              return (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-3 rounded-lg border space-y-2"
                  style={{ backgroundColor: GOTHAM.surfaceHover, borderColor: GOTHAM.borderMuted }}
                >
                  <Textarea
                    value={editingNote.content}
                    onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                    className="min-h-[60px] text-sm resize-none"
                    style={{ backgroundColor: GOTHAM.bg, borderColor: GOTHAM.borderMuted, color: GOTHAM.text }}
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleUpdateNote}
                      disabled={updateNote.isPending}
                      className="h-6 text-xs"
                      style={{ backgroundColor: GOTHAM.gold, color: '#000' }}
                    >
                      <Check size={10} className="mr-1" />
                      Sauvegarder
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingNote(null)}
                      className="h-6 text-xs"
                      style={{ color: GOTHAM.textMuted }}
                    >
                      <X size={10} className="mr-1" />
                      Annuler
                    </Button>
                  </div>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="group p-3 rounded-lg border relative"
                style={{ backgroundColor: GOTHAM.surfaceHover, borderColor: GOTHAM.borderMuted }}
              >
                <p className="text-sm whitespace-pre-wrap pr-16" style={{ color: GOTHAM.text }}>
                  {note.content}
                </p>
                
                <div className="flex items-center gap-1 mt-2 text-xs" style={{ color: GOTHAM.textMuted }}>
                  <Clock size={10} />
                  {formatDistanceToNow(new Date(note.created_at), { addSuffix: true, locale: fr })}
                </div>

                {/* Action buttons */}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditingNote(note)}
                    className="p-1.5 rounded hover:bg-white/10 transition-colors"
                    style={{ color: GOTHAM.textMuted }}
                  >
                    <Edit2 size={12} />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Supprimer cette note ?')) {
                        deleteNote.mutate(note.id);
                      }
                    }}
                    className="p-1.5 rounded hover:bg-red-500/20 transition-colors"
                    style={{ color: '#EF4444' }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </motion.div>
            );
          })}

          {(!notes || notes.length === 0) && !isAdding && (
            <div 
              className="text-center py-6 rounded-lg border border-dashed"
              style={{ borderColor: GOTHAM.borderMuted, color: GOTHAM.textMuted }}
            >
              <StickyNote size={24} className="mx-auto mb-2 opacity-40" />
              <p className="text-xs">Aucune note</p>
              <button
                onClick={() => setIsAdding(true)}
                className="mt-2 text-xs hover:underline"
                style={{ color: GOTHAM.gold }}
              >
                Ajouter une note
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ClientNotesPanel;
