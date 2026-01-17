import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Calendar, Tag, User } from 'lucide-react';

interface CreateReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultClientId?: string;
  defaultClientType?: string;
}

interface ClientTag {
  id: string;
  name: string;
  color: string;
}

export function CreateReminderDialog({ 
  open, 
  onOpenChange,
  defaultClientId,
  defaultClientType 
}: CreateReminderDialogProps) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [clientType, setClientType] = useState(defaultClientType || 'card');
  const [clientId, setClientId] = useState(defaultClientId || '');
  const [tagId, setTagId] = useState<string>('none');

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

  // Fetch clients based on type
  const { data: clients } = useQuery({
    queryKey: ['clients-for-reminder', clientType],
    queryFn: async () => {
      let data: Array<{ id: string; label: string }> = [];
      
      if (clientType === 'card') {
        const { data: cards, error } = await supabase
          .from('digital_cards')
          .select('id, first_name, last_name, company')
          .order('first_name');
        if (error) throw error;
        data = (cards || []).map(c => ({
          id: c.id,
          label: `${c.first_name} ${c.last_name}${c.company ? ` (${c.company})` : ''}`
        }));
      } else if (clientType === 'lead') {
        const { data: leads, error } = await supabase
          .from('leads')
          .select('id, name, email')
          .order('name');
        if (error) throw error;
        data = (leads || []).map(l => ({
          id: l.id,
          label: l.name || l.email || l.id
        }));
      } else if (clientType === 'order') {
        const { data: orders, error } = await supabase
          .from('orders')
          .select('id, order_number, shipping_name')
          .order('created_at', { ascending: false });
        if (error) throw error;
        data = (orders || []).map(o => ({
          id: o.id,
          label: `#${o.order_number} - ${o.shipping_name || 'Sans nom'}`
        }));
      } else if (clientType === 'website') {
        const { data: websites, error } = await supabase
          .from('website_proposals')
          .select('id, form_data')
          .order('created_at', { ascending: false });
        if (error) throw error;
        data = (websites || []).map(w => ({
          id: w.id,
          label: (w.form_data as any)?.businessName || w.id
        }));
      }
      
      return data;
    },
  });

  // Create reminder mutation
  const createReminder = useMutation({
    mutationFn: async () => {
      if (!title || !dueDate || !clientId) {
        throw new Error('Veuillez remplir tous les champs requis');
      }

      const { error } = await supabase
        .from('client_reminders')
        .insert({
          client_id: clientId,
          client_type: clientType,
          tag_id: tagId !== 'none' ? tagId : null,
          title,
          description: description || null,
          due_date: new Date(dueDate).toISOString(),
          priority,
          status: 'pending',
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-reminders'] });
      toast.success('Rappel créé avec succès');
      resetForm();
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de la création');
    },
  });

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDueDate('');
    setPriority('medium');
    setClientId(defaultClientId || '');
    setClientType(defaultClientType || 'card');
    setTagId('none');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nouveau Rappel</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Relancer le client"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Détails du rappel..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date d'échéance *
              </Label>
              <Input
                id="dueDate"
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priorité</Label>
              <Select value={priority} onValueChange={setPriority}>
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
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Type de client *
            </Label>
            <Select value={clientType} onValueChange={(v) => {
              setClientType(v);
              setClientId('');
            }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="card">Carte NFC</SelectItem>
                <SelectItem value="lead">Lead</SelectItem>
                <SelectItem value="order">Commande</SelectItem>
                <SelectItem value="website">Site Web</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Client *</Label>
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un client" />
              </SelectTrigger>
              <SelectContent>
                {clients?.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Tag associé (optionnel)
            </Label>
            <Select value={tagId} onValueChange={setTagId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Aucun</SelectItem>
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

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button
              className="flex-1"
              onClick={() => createReminder.mutate()}
              disabled={createReminder.isPending}
            >
              {createReminder.isPending ? 'Création...' : 'Créer le rappel'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
