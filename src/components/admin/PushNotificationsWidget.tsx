/**
 * Push Notifications Widget - GOTHAM Style
 * Real-time notification center for the admin dashboard
 */

import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Bell,
  BellRing,
  X,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  ChevronRight,
  Loader2,
  MessageSquare,
  Zap,
  Calendar,
  History,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow, format } from "date-fns";
import { fr } from "date-fns/locale";

// Gotham colors
const GOTHAM = {
  bg: '#0A0A0B',
  surface: '#111113',
  surfaceHover: '#1A1A1D',
  border: 'rgba(255, 199, 0, 0.15)',
  borderMuted: 'rgba(255, 255, 255, 0.08)',
  gold: '#FFC700',
  goldMuted: 'rgba(255, 199, 0, 0.2)',
  text: '#F5F5F5',
  textMuted: 'rgba(245, 245, 245, 0.6)',
  success: '#22C55E',
  info: '#3B82F6',
  warning: '#F59E0B',
  danger: '#EF4444',
  purple: '#A855F7',
  pink: '#EC4899',
};

interface PushNotification {
  id: string;
  title: string;
  body: string;
  sent_count: number;
  failed_count: number;
  created_at: string;
  card_id: string;
}

interface ScheduledNotification {
  id: string;
  title: string;
  body: string;
  scheduled_at: string;
  status: string;
  card_id: string;
}

interface PushSubscription {
  id: string;
  card_id: string;
  is_active: boolean;
  created_at: string;
}

// Quick templates
const QUICK_TEMPLATES = [
  { id: 'update', icon: Sparkles, title: 'Mise à jour', body: 'Nouvelle mise à jour disponible ! Découvrez les nouveautés.' },
  { id: 'promo', icon: Zap, title: 'Offre spéciale', body: 'Profitez de notre offre exclusive -20% sur les cartes NFC !' },
  { id: 'reminder', icon: Clock, title: 'Rappel', body: 'N\'oubliez pas de mettre à jour votre carte digitale.' },
  { id: 'news', icon: MessageSquare, title: 'Actualité', body: 'Découvrez notre dernière fonctionnalité !' },
];

export function PushNotificationsWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'send' | 'history' | 'scheduled'>('send');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [selectedCardId, setSelectedCardId] = useState<string>('all');
  const [isSending, setIsSending] = useState(false);
  const queryClient = useQueryClient();

  // Fetch notification logs
  const { data: logs } = useQuery({
    queryKey: ['push-notification-logs-widget'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('push_notification_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      if (error) throw error;
      return data as PushNotification[];
    },
    refetchInterval: 30000,
  });

  // Fetch scheduled notifications
  const { data: scheduled } = useQuery({
    queryKey: ['scheduled-notifications-widget'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scheduled_push_notifications')
        .select('*')
        .eq('status', 'pending')
        .order('scheduled_at', { ascending: true })
        .limit(10);
      if (error) throw error;
      return data as ScheduledNotification[];
    },
    refetchInterval: 30000,
  });

  // Fetch active subscriptions count
  const { data: subscriptions } = useQuery({
    queryKey: ['push-subscriptions-count'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('push_subscriptions')
        .select('id, card_id, is_active')
        .eq('is_active', true);
      if (error) throw error;
      return data as PushSubscription[];
    },
    refetchInterval: 60000,
  });

  // Fetch cards for selection
  const { data: cards } = useQuery({
    queryKey: ['cards-for-push'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('digital_cards')
        .select('id, first_name, last_name, slug')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
  });

  // Get unique cards with subscriptions
  const cardsWithSubs = subscriptions?.reduce((acc, sub) => {
    if (!acc[sub.card_id]) {
      acc[sub.card_id] = 0;
    }
    acc[sub.card_id]++;
    return acc;
  }, {} as Record<string, number>) || {};

  // Total active subscribers
  const totalSubscribers = subscriptions?.length || 0;

  // Send notification
  const handleSend = async () => {
    if (!title.trim() || !body.trim()) {
      toast.error('Titre et message requis');
      return;
    }

    setIsSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-push-to-subscribers', {
        body: {
          cardId: selectedCardId === 'all' ? undefined : selectedCardId,
          title,
          body,
          sendToAll: selectedCardId === 'all',
        },
      });

      if (error) throw error;

      toast.success(`Notification envoyée à ${data?.sent || 0} abonnés`, {
        description: data?.failed ? `${data.failed} échecs` : undefined,
      });

      setTitle('');
      setBody('');
      queryClient.invalidateQueries({ queryKey: ['push-notification-logs-widget'] });
    } catch (err: any) {
      toast.error('Erreur lors de l\'envoi', { description: err.message });
    } finally {
      setIsSending(false);
    }
  };

  // Apply template
  const applyTemplate = (template: typeof QUICK_TEMPLATES[0]) => {
    setTitle(template.title);
    setBody(template.body);
  };

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 rounded-xl border transition-all hover:scale-105"
        style={{ 
          backgroundColor: GOTHAM.surface,
          borderColor: GOTHAM.borderMuted,
        }}
      >
        <Bell size={18} style={{ color: GOTHAM.gold }} />
        {totalSubscribers > 0 && (
          <span 
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center"
            style={{ backgroundColor: GOTHAM.gold, color: '#000' }}
          >
            {totalSubscribers > 99 ? '99+' : totalSubscribers}
          </span>
        )}
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center px-4"
            onClick={() => setIsOpen(false)}
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 backdrop-blur-sm"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg rounded-2xl border overflow-hidden shadow-2xl"
              style={{ 
                backgroundColor: GOTHAM.bg,
                borderColor: GOTHAM.border,
                boxShadow: `0 0 60px ${GOTHAM.gold}20`,
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div 
                className="flex items-center justify-between px-4 py-3 border-b"
                style={{ borderColor: GOTHAM.borderMuted }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${GOTHAM.gold}20` }}
                  >
                    <BellRing size={20} style={{ color: GOTHAM.gold }} />
                  </div>
                  <div>
                    <h2 className="font-semibold" style={{ color: GOTHAM.text }}>
                      Notifications Push
                    </h2>
                    <p className="text-xs" style={{ color: GOTHAM.textMuted }}>
                      {totalSubscribers} abonnés actifs
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X size={18} style={{ color: GOTHAM.textMuted }} />
                </button>
              </div>

              {/* Tabs */}
              <div 
                className="flex border-b"
                style={{ borderColor: GOTHAM.borderMuted }}
              >
                {[
                  { id: 'send' as const, label: 'Envoyer', icon: Send },
                  { id: 'history' as const, label: 'Historique', icon: History },
                  { id: 'scheduled' as const, label: 'Planifiées', icon: Calendar, count: scheduled?.length },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors border-b-2`}
                    style={{ 
                      color: activeTab === tab.id ? GOTHAM.gold : GOTHAM.textMuted,
                      borderColor: activeTab === tab.id ? GOTHAM.gold : 'transparent',
                    }}
                  >
                    <tab.icon size={16} />
                    {tab.label}
                    {tab.count !== undefined && tab.count > 0 && (
                      <span 
                        className="px-1.5 py-0.5 rounded-full text-[10px]"
                        style={{ backgroundColor: `${GOTHAM.warning}20`, color: GOTHAM.warning }}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="p-4">
                {activeTab === 'send' && (
                  <div className="space-y-4">
                    {/* Quick templates */}
                    <div>
                      <p className="text-xs mb-2" style={{ color: GOTHAM.textMuted }}>
                        Templates rapides
                      </p>
                      <div className="grid grid-cols-4 gap-2">
                        {QUICK_TEMPLATES.map(template => (
                          <button
                            key={template.id}
                            onClick={() => applyTemplate(template)}
                            className="p-2 rounded-lg border text-center transition-all hover:scale-105"
                            style={{ 
                              backgroundColor: GOTHAM.surface,
                              borderColor: GOTHAM.borderMuted,
                            }}
                          >
                            <template.icon size={16} className="mx-auto mb-1" style={{ color: GOTHAM.gold }} />
                            <p className="text-[10px]" style={{ color: GOTHAM.textMuted }}>
                              {template.title}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Target selection */}
                    <div>
                      <label className="text-xs mb-1 block" style={{ color: GOTHAM.textMuted }}>
                        Destinataires
                      </label>
                      <select
                        value={selectedCardId}
                        onChange={(e) => setSelectedCardId(e.target.value)}
                        className="w-full rounded-lg border px-3 py-2 text-sm bg-transparent"
                        style={{ 
                          borderColor: GOTHAM.borderMuted,
                          color: GOTHAM.text,
                        }}
                      >
                        <option value="all" style={{ backgroundColor: GOTHAM.bg }}>
                          Tous les abonnés ({totalSubscribers})
                        </option>
                        {cards?.filter(c => cardsWithSubs[c.id])?.map(card => (
                          <option 
                            key={card.id} 
                            value={card.id}
                            style={{ backgroundColor: GOTHAM.bg }}
                          >
                            {card.first_name} {card.last_name} ({cardsWithSubs[card.id] || 0})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Title */}
                    <div>
                      <label className="text-xs mb-1 block" style={{ color: GOTHAM.textMuted }}>
                        Titre
                      </label>
                      <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Titre de la notification"
                        className="border"
                        style={{ 
                          backgroundColor: GOTHAM.surface,
                          borderColor: GOTHAM.borderMuted,
                          color: GOTHAM.text,
                        }}
                      />
                    </div>

                    {/* Body */}
                    <div>
                      <label className="text-xs mb-1 block" style={{ color: GOTHAM.textMuted }}>
                        Message
                      </label>
                      <Textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        placeholder="Contenu de la notification..."
                        rows={3}
                        className="border resize-none"
                        style={{ 
                          backgroundColor: GOTHAM.surface,
                          borderColor: GOTHAM.borderMuted,
                          color: GOTHAM.text,
                        }}
                      />
                    </div>

                    {/* Send button */}
                    <Button
                      onClick={handleSend}
                      disabled={isSending || !title.trim() || !body.trim()}
                      className="w-full font-semibold gap-2"
                      style={{ 
                        background: `linear-gradient(135deg, ${GOTHAM.gold} 0%, #D4A853 100%)`,
                        color: '#000',
                      }}
                    >
                      {isSending ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Send size={16} />
                      )}
                      Envoyer maintenant
                    </Button>
                  </div>
                )}

                {activeTab === 'history' && (
                  <ScrollArea className="h-[300px]">
                    {logs && logs.length > 0 ? (
                      <div className="space-y-2">
                        {logs.map(log => (
                          <div
                            key={log.id}
                            className="p-3 rounded-lg border"
                            style={{ 
                              backgroundColor: GOTHAM.surface,
                              borderColor: GOTHAM.borderMuted,
                            }}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="font-medium text-sm" style={{ color: GOTHAM.text }}>
                                  {log.title}
                                </p>
                                <p className="text-xs mt-0.5 line-clamp-2" style={{ color: GOTHAM.textMuted }}>
                                  {log.body}
                                </p>
                              </div>
                              <div className="text-right ml-3">
                                <div className="flex items-center gap-1">
                                  <CheckCircle2 size={12} style={{ color: GOTHAM.success }} />
                                  <span className="text-xs" style={{ color: GOTHAM.success }}>
                                    {log.sent_count}
                                  </span>
                                  {log.failed_count > 0 && (
                                    <>
                                      <AlertCircle size={12} style={{ color: GOTHAM.danger }} />
                                      <span className="text-xs" style={{ color: GOTHAM.danger }}>
                                        {log.failed_count}
                                      </span>
                                    </>
                                  )}
                                </div>
                                <p className="text-[10px] mt-1" style={{ color: GOTHAM.textMuted }}>
                                  {formatDistanceToNow(new Date(log.created_at), { addSuffix: true, locale: fr })}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <History size={32} className="mx-auto mb-2" style={{ color: GOTHAM.textMuted }} />
                        <p className="text-sm" style={{ color: GOTHAM.textMuted }}>
                          Aucun historique
                        </p>
                      </div>
                    )}
                  </ScrollArea>
                )}

                {activeTab === 'scheduled' && (
                  <ScrollArea className="h-[300px]">
                    {scheduled && scheduled.length > 0 ? (
                      <div className="space-y-2">
                        {scheduled.map(notif => (
                          <div
                            key={notif.id}
                            className="p-3 rounded-lg border"
                            style={{ 
                              backgroundColor: GOTHAM.surface,
                              borderColor: GOTHAM.borderMuted,
                            }}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="font-medium text-sm" style={{ color: GOTHAM.text }}>
                                  {notif.title}
                                </p>
                                <p className="text-xs mt-0.5 line-clamp-2" style={{ color: GOTHAM.textMuted }}>
                                  {notif.body}
                                </p>
                              </div>
                              <div className="text-right ml-3">
                                <span 
                                  className="text-xs px-2 py-0.5 rounded-full"
                                  style={{ 
                                    backgroundColor: `${GOTHAM.warning}20`,
                                    color: GOTHAM.warning,
                                  }}
                                >
                                  {notif.status}
                                </span>
                                <p className="text-[10px] mt-1 flex items-center gap-1 justify-end" style={{ color: GOTHAM.textMuted }}>
                                  <Clock size={10} />
                                  {format(new Date(notif.scheduled_at), 'dd/MM HH:mm', { locale: fr })}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Calendar size={32} className="mx-auto mb-2" style={{ color: GOTHAM.textMuted }} />
                        <p className="text-sm" style={{ color: GOTHAM.textMuted }}>
                          Aucune notification planifiée
                        </p>
                      </div>
                    )}
                  </ScrollArea>
                )}
              </div>

              {/* Footer stats */}
              <div 
                className="flex items-center justify-between px-4 py-2 border-t text-xs"
                style={{ borderColor: GOTHAM.borderMuted }}
              >
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1" style={{ color: GOTHAM.textMuted }}>
                    <Users size={12} />
                    {totalSubscribers} abonnés
                  </span>
                  <span className="flex items-center gap-1" style={{ color: GOTHAM.success }}>
                    <CheckCircle2 size={12} />
                    {logs?.reduce((sum, l) => sum + l.sent_count, 0) || 0} envoyées
                  </span>
                </div>
                <span style={{ color: GOTHAM.gold }}>IWASP Push</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
