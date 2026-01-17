import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Bell, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Calendar,
  User,
  Tag,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { format, formatDistanceToNow, isPast, isToday } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CreateReminderDialog } from './CreateReminderDialog';

interface ClientReminder {
  id: string;
  client_id: string;
  client_type: string;
  tag_id: string | null;
  reminder_type: string;
  title: string;
  description: string | null;
  due_date: string;
  status: string;
  priority: string;
  created_at: string;
  completed_at: string | null;
}

interface ClientTag {
  id: string;
  name: string;
  color: string;
}

const priorityConfig = {
  low: { label: 'Basse', className: 'bg-muted text-muted-foreground' },
  medium: { label: 'Moyenne', className: 'bg-blue-500/20 text-blue-400' },
  high: { label: 'Haute', className: 'bg-orange-500/20 text-orange-400' },
  urgent: { label: 'Urgente', className: 'bg-red-500/20 text-red-400' },
};

const statusConfig = {
  pending: { label: 'En attente', icon: Clock, className: 'text-yellow-400' },
  completed: { label: 'Terminé', icon: CheckCircle2, className: 'text-green-400' },
  overdue: { label: 'En retard', icon: AlertTriangle, className: 'text-red-400' },
  cancelled: { label: 'Annulé', icon: X, className: 'text-muted-foreground' },
};

export function ClientRemindersWidget() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'all' | 'pending' | 'overdue' | 'completed'>('pending');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Fetch reminders
  const { data: reminders, isLoading } = useQuery({
    queryKey: ['client-reminders', filter],
    queryFn: async () => {
      let query = supabase
        .from('client_reminders')
        .select('*')
        .order('due_date', { ascending: true });

      if (filter === 'pending') {
        query = query.in('status', ['pending', 'overdue']);
      } else if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as ClientReminder[];
    },
  });

  // Fetch tags for display
  const { data: tags } = useQuery({
    queryKey: ['client-tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('client_tags')
        .select('*');
      if (error) throw error;
      return data as ClientTag[];
    },
  });

  // Complete reminder mutation
  const completeReminder = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('client_reminders')
        .update({ 
          status: 'completed', 
          completed_at: new Date().toISOString() 
        })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-reminders'] });
      toast.success('Rappel marqué comme terminé');
    },
    onError: () => {
      toast.error('Erreur lors de la mise à jour');
    },
  });

  // Cancel reminder mutation
  const cancelReminder = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('client_reminders')
        .update({ status: 'cancelled' })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-reminders'] });
      toast.success('Rappel annulé');
    },
    onError: () => {
      toast.error('Erreur lors de l\'annulation');
    },
  });

  const getTagById = (tagId: string | null) => {
    if (!tagId || !tags) return null;
    return tags.find(t => t.id === tagId);
  };

  const getClientTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      card: 'Carte NFC',
      lead: 'Lead',
      order: 'Commande',
      website: 'Site Web',
    };
    return labels[type] || type;
  };

  const getDueDateStatus = (dueDate: string) => {
    const date = new Date(dueDate);
    if (isPast(date) && !isToday(date)) return 'overdue';
    if (isToday(date)) return 'today';
    return 'upcoming';
  };

  const pendingCount = reminders?.filter(r => r.status === 'pending' || r.status === 'overdue').length || 0;
  const overdueCount = reminders?.filter(r => r.status === 'overdue' || (r.status === 'pending' && isPast(new Date(r.due_date)))).length || 0;

  if (isLoading) {
    return (
      <div className="bg-card rounded-2xl p-6 border border-border">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-muted rounded"></div>
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
          <div className="p-2 bg-primary/20 rounded-xl">
            <Bell className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Rappels Clients</h3>
            <p className="text-sm text-muted-foreground">
              {pendingCount} en attente
              {overdueCount > 0 && <span className="text-red-400 ml-2">({overdueCount} en retard)</span>}
            </p>
          </div>
        </div>
        <Button size="sm" onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Nouveau
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {[
          { key: 'pending', label: 'En attente' },
          { key: 'overdue', label: 'En retard' },
          { key: 'completed', label: 'Terminés' },
          { key: 'all', label: 'Tous' },
        ].map(({ key, label }) => (
          <Button
            key={key}
            variant={filter === key ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(key as typeof filter)}
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Reminders list */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {reminders?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Aucun rappel {filter !== 'all' && `"${filter}"`}
          </div>
        ) : (
          reminders?.map((reminder) => {
            const tag = getTagById(reminder.tag_id);
            const priority = priorityConfig[reminder.priority as keyof typeof priorityConfig];
            const status = statusConfig[reminder.status as keyof typeof statusConfig];
            const dueDateStatus = getDueDateStatus(reminder.due_date);
            const StatusIcon = status?.icon || Clock;

            return (
              <div
                key={reminder.id}
                className={`p-4 rounded-xl border transition-all ${
                  dueDateStatus === 'overdue' && reminder.status === 'pending'
                    ? 'border-red-500/50 bg-red-500/5'
                    : dueDateStatus === 'today' && reminder.status === 'pending'
                    ? 'border-yellow-500/50 bg-yellow-500/5'
                    : 'border-border bg-background/50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <StatusIcon className={`h-4 w-4 ${status?.className}`} />
                      <span className="font-medium text-foreground truncate">
                        {reminder.title}
                      </span>
                      <Badge className={priority?.className} variant="secondary">
                        {priority?.label}
                      </Badge>
                    </div>
                    
                    {reminder.description && (
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {reminder.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {getClientTypeLabel(reminder.client_type)}
                      </span>
                      
                      {tag && (
                        <span 
                          className="flex items-center gap-1 px-2 py-0.5 rounded-full text-white"
                          style={{ backgroundColor: tag.color }}
                        >
                          <Tag className="h-3 w-3" />
                          {tag.name}
                        </span>
                      )}
                      
                      <span className={`flex items-center gap-1 ${
                        dueDateStatus === 'overdue' ? 'text-red-400' :
                        dueDateStatus === 'today' ? 'text-yellow-400' : ''
                      }`}>
                        <Calendar className="h-3 w-3" />
                        {dueDateStatus === 'today' 
                          ? 'Aujourd\'hui' 
                          : formatDistanceToNow(new Date(reminder.due_date), { 
                              addSuffix: true, 
                              locale: fr 
                            })
                        }
                      </span>
                    </div>
                  </div>
                  
                  {reminder.status === 'pending' && (
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-green-400 hover:text-green-300 hover:bg-green-500/20"
                        onClick={() => completeReminder.mutate(reminder.id)}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-red-400 hover:bg-red-500/20"
                        onClick={() => cancelReminder.mutate(reminder.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <CreateReminderDialog 
        open={isCreateOpen} 
        onOpenChange={setIsCreateOpen} 
      />
    </div>
  );
}
