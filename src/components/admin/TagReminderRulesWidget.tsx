import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Settings2, 
  Tag, 
  Clock, 
  Plus, 
  Pencil, 
  Trash2,
  Check,
  X,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface TagReminderRule {
  id: string;
  tag_id: string;
  days_after_assignment: number;
  reminder_title: string;
  reminder_description: string | null;
  priority: string;
  is_active: boolean;
  created_at: string;
}

interface ClientTag {
  id: string;
  name: string;
  color: string;
}

const priorityLabels: Record<string, string> = {
  low: 'Basse',
  medium: 'Moyenne',
  high: 'Haute',
  urgent: 'Urgente',
};

export function TagReminderRulesWidget() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<TagReminderRule | null>(null);

  // Form states
  const [formTagId, setFormTagId] = useState('');
  const [formDays, setFormDays] = useState('7');
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPriority, setFormPriority] = useState('medium');

  // Fetch rules
  const { data: rules, isLoading } = useQuery({
    queryKey: ['tag-reminder-rules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tag_reminder_rules')
        .select('*')
        .order('created_at');
      if (error) throw error;
      return data as TagReminderRule[];
    },
  });

  // Fetch tags
  const { data: tags } = useQuery({
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

  // Create rule mutation
  const createRule = useMutation({
    mutationFn: async () => {
      if (!formTagId || !formTitle) {
        throw new Error('Tag et titre requis');
      }

      const { error } = await supabase
        .from('tag_reminder_rules')
        .insert({
          tag_id: formTagId,
          days_after_assignment: parseInt(formDays) || 7,
          reminder_title: formTitle,
          reminder_description: formDescription || null,
          priority: formPriority,
          is_active: true,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tag-reminder-rules'] });
      toast.success('Règle créée');
      resetForm();
      setIsCreateOpen(false);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Update rule mutation
  const updateRule = useMutation({
    mutationFn: async (rule: TagReminderRule) => {
      const { error } = await supabase
        .from('tag_reminder_rules')
        .update({
          days_after_assignment: parseInt(formDays) || 7,
          reminder_title: formTitle,
          reminder_description: formDescription || null,
          priority: formPriority,
        })
        .eq('id', rule.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tag-reminder-rules'] });
      toast.success('Règle modifiée');
      resetForm();
      setEditingRule(null);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Toggle active mutation
  const toggleActive = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('tag_reminder_rules')
        .update({ is_active })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tag-reminder-rules'] });
      toast.success('Règle mise à jour');
    },
    onError: () => {
      toast.error('Erreur lors de la mise à jour');
    },
  });

  // Delete rule mutation
  const deleteRule = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tag_reminder_rules')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tag-reminder-rules'] });
      toast.success('Règle supprimée');
    },
    onError: () => {
      toast.error('Erreur lors de la suppression');
    },
  });

  const resetForm = () => {
    setFormTagId('');
    setFormDays('7');
    setFormTitle('');
    setFormDescription('');
    setFormPriority('medium');
  };

  const openEdit = (rule: TagReminderRule) => {
    setEditingRule(rule);
    setFormTagId(rule.tag_id);
    setFormDays(rule.days_after_assignment.toString());
    setFormTitle(rule.reminder_title);
    setFormDescription(rule.reminder_description || '');
    setFormPriority(rule.priority);
  };

  const getTagById = (tagId: string) => {
    return tags?.find(t => t.id === tagId);
  };

  // Tags without rules
  const tagsWithoutRules = tags?.filter(
    tag => !rules?.some(rule => rule.tag_id === tag.id)
  );

  if (isLoading) {
    return (
      <div className="bg-card rounded-2xl p-6 border border-border">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/20 rounded-xl">
            <Settings2 className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Règles de Rappels Automatiques</h3>
            <p className="text-sm text-muted-foreground">
              Créer des rappels basés sur les tags
            </p>
          </div>
        </div>
        <Button size="sm" onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Nouvelle règle
        </Button>
      </div>

      {/* Suggestions for tags without rules */}
      {tagsWithoutRules && tagsWithoutRules.length > 0 && (
        <div className="mb-4 p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-yellow-400 mt-0.5" />
            <div className="text-sm">
              <span className="text-yellow-400 font-medium">Tags sans règle: </span>
              <span className="text-muted-foreground">
                {tagsWithoutRules.map(t => t.name).join(', ')}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Rules list */}
      <div className="space-y-3">
        {rules?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Aucune règle configurée
          </div>
        ) : (
          rules?.map((rule) => {
            const tag = getTagById(rule.tag_id);

            return (
              <div
                key={rule.id}
                className={`p-4 rounded-xl border transition-all ${
                  rule.is_active 
                    ? 'border-border bg-background/50' 
                    : 'border-border/50 bg-muted/20 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {tag && (
                        <Badge
                          className="text-white"
                          style={{ backgroundColor: tag.color }}
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {tag.name}
                        </Badge>
                      )}
                      <span className="text-sm font-medium text-foreground">
                        {rule.reminder_title}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Après {rule.days_after_assignment} jour{rule.days_after_assignment > 1 ? 's' : ''}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {priorityLabels[rule.priority]}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={rule.is_active}
                      onCheckedChange={(checked) => 
                        toggleActive.mutate({ id: rule.id, is_active: checked })
                      }
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={() => openEdit(rule)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/20"
                      onClick={() => deleteRule.mutate(rule.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog 
        open={isCreateOpen || !!editingRule} 
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false);
            setEditingRule(null);
            resetForm();
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingRule ? 'Modifier la règle' : 'Nouvelle règle de rappel'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {!editingRule && (
              <div className="space-y-2">
                <Label>Tag associé *</Label>
                <Select value={formTagId} onValueChange={setFormTagId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un tag" />
                  </SelectTrigger>
                  <SelectContent>
                    {tags?.map((tag) => (
                      <SelectItem key={tag.id} value={tag.id}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: tag.color }}
                          />
                          {tag.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label>Jours après assignation du tag</Label>
              <Input
                type="number"
                min="1"
                max="365"
                value={formDays}
                onChange={(e) => setFormDays(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Titre du rappel *</Label>
              <Input
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Ex: Relancer le client"
              />
            </div>

            <div className="space-y-2">
              <Label>Description (optionnel)</Label>
              <Textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Détails du rappel..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Priorité</Label>
              <Select value={formPriority} onValueChange={setFormPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Basse</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="high">Haute</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setIsCreateOpen(false);
                  setEditingRule(null);
                  resetForm();
                }}
              >
                Annuler
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  if (editingRule) {
                    updateRule.mutate(editingRule);
                  } else {
                    createRule.mutate();
                  }
                }}
                disabled={createRule.isPending || updateRule.isPending}
              >
                {editingRule ? 'Enregistrer' : 'Créer'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
