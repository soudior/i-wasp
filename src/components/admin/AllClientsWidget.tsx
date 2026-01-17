/**
 * All Clients Widget - GOTHAM Style
 * Comprehensive view of all clients from cards, websites, leads, and orders
 */

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  CreditCard,
  Globe,
  Package,
  Mail,
  Phone,
  ExternalLink,
  ChevronRight,
  Eye,
  Star,
  Clock,
  Search,
  Filter,
  X,
  UserPlus,
  Crown,
  Sparkles,
  Edit2,
  Tag,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow, format } from "date-fns";
import { fr } from "date-fns/locale";
import { ClientEditModal } from "./ClientEditModal";
import { ClientTagAssignments } from "./ClientTagAssignments";

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

interface UnifiedClient {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  source: 'card' | 'website' | 'lead' | 'order';
  sourceLabel: string;
  sourceIcon: React.ElementType;
  sourceColor: string;
  createdAt: Date;
  extra?: Record<string, any>;
  slug?: string;
  status?: string;
  isPremium?: boolean;
}

export function AllClientsWidget() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState<string | null>(null);
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [editModal, setEditModal] = useState<{ open: boolean; id: string; type: 'card' | 'website' }>({
    open: false,
    id: '',
    type: 'card',
  });

  // Fetch all tags
  const { data: allTags } = useQuery({
    queryKey: ['client-tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('client_tags')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch tag assignments
  const { data: tagAssignments } = useQuery({
    queryKey: ['all-client-tag-assignments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('client_tag_assignments')
        .select('client_id, tag_id');
      
      if (error) throw error;
      return data;
    },
  });

  // Hardcoded premium client cards (not in database)
  const HARDCODED_CLIENTS: UnifiedClient[] = [
    {
      id: 'hardcoded-kech-exclu',
      name: 'Kech Exclu',
      phone: '+212 661 381 626',
      company: 'Kech Exclu Concierge',
      source: 'card',
      sourceLabel: 'Carte Premium',
      sourceIcon: Crown,
      sourceColor: GOTHAM.gold,
      createdAt: new Date('2024-12-01'),
      slug: 'kech-exclu',
      isPremium: true,
      extra: { type: 'hardcoded', description: 'Service Conciergerie Luxe Marrakech' },
    },
    {
      id: 'hardcoded-maison-b-optic',
      name: 'Maison B Optic x Marc Aurel',
      phone: '+33 1 42 97 41 14',
      company: 'Maison B Optic',
      source: 'card',
      sourceLabel: 'Carte Premium',
      sourceIcon: Crown,
      sourceColor: GOTHAM.gold,
      createdAt: new Date('2024-11-15'),
      slug: 'maison-b-optic',
      isPremium: true,
      extra: { type: 'hardcoded', description: 'Opticien Paris' },
    },
    {
      id: 'hardcoded-luxe-prestige',
      name: 'Luxe Prestige',
      phone: '+212 661 381 626',
      company: 'Luxe Prestige Concierge',
      source: 'card',
      sourceLabel: 'Carte Premium',
      sourceIcon: Crown,
      sourceColor: GOTHAM.gold,
      createdAt: new Date('2024-12-10'),
      slug: 'luxe-prestige',
      isPremium: true,
      extra: { type: 'hardcoded', description: 'Service Conciergerie VIP' },
    },
    {
      id: 'hardcoded-khokha-signature',
      name: 'Khokha Signature',
      phone: '+212 600 000 000',
      email: 'contact@khokhasignature.com',
      company: 'Khokha Signature Fashion',
      source: 'card',
      sourceLabel: 'Carte Premium',
      sourceIcon: Crown,
      sourceColor: GOTHAM.gold,
      createdAt: new Date('2025-01-10'),
      slug: 'khokha-signature',
      isPremium: true,
      extra: { type: 'hardcoded', description: 'Boutique Fashion Luxe' },
    },
    {
      id: 'hardcoded-la-maison-cupcake',
      name: 'La Maison Cupcake',
      phone: '+212 522 123 456',
      email: 'contact@lamaisoncupcake.com',
      company: 'La Maison Cupcake',
      source: 'card',
      sourceLabel: 'Carte Premium',
      sourceIcon: Crown,
      sourceColor: GOTHAM.gold,
      createdAt: new Date('2025-01-08'),
      slug: 'la-maison-cupcake',
      isPremium: true,
      extra: { type: 'hardcoded', description: 'Pâtisserie Artisanale' },
    },
    {
      id: 'hardcoded-herbalism',
      name: 'Herbalism Marrakech',
      phone: '+212 666 540 329',
      email: 'contact@herbalism.ma',
      company: 'Herbalism Marrakech',
      source: 'card',
      sourceLabel: 'Carte Premium',
      sourceIcon: Crown,
      sourceColor: GOTHAM.gold,
      createdAt: new Date('2024-10-20'),
      slug: 'herbalism-marrakech',
      isPremium: true,
      extra: { type: 'hardcoded', description: 'Expérience Herbale' },
    },
    {
      id: 'hardcoded-ibrahim-benelfares',
      name: 'Ibrahim Benelfares',
      phone: '+212 675 571 257',
      company: 'Herbalism Marrakech',
      source: 'card',
      sourceLabel: 'Carte Premium',
      sourceIcon: Crown,
      sourceColor: GOTHAM.gold,
      createdAt: new Date('2024-10-20'),
      slug: 'ibrahim-benelfares',
      isPremium: true,
      extra: { type: 'hardcoded', description: 'Fondateur Herbalism' },
    },
    {
      id: 'hardcoded-ariella',
      name: 'Ariella',
      phone: '+212 600 000 000',
      company: 'Ariella',
      source: 'card',
      sourceLabel: 'Carte Premium',
      sourceIcon: Crown,
      sourceColor: GOTHAM.gold,
      createdAt: new Date('2024-11-01'),
      slug: 'ariella',
      isPremium: true,
      extra: { type: 'hardcoded', description: 'Client Premium' },
    },
    {
      id: 'hardcoded-charles-lazimi',
      name: 'Charles Lazimi',
      phone: '+33 600 000 000',
      company: 'Charles Lazimi',
      source: 'card',
      sourceLabel: 'Carte Premium',
      sourceIcon: Crown,
      sourceColor: GOTHAM.gold,
      createdAt: new Date('2024-11-05'),
      slug: 'charles-lazimi',
      isPremium: true,
      extra: { type: 'hardcoded', description: 'Client Premium' },
    },
    {
      id: 'hardcoded-medina-travertin',
      name: 'Medina Travertin',
      phone: '+212 600 000 000',
      company: 'Medina Travertin & Fès Zellij',
      source: 'card',
      sourceLabel: 'Carte Premium',
      sourceIcon: Crown,
      sourceColor: GOTHAM.gold,
      createdAt: new Date('2024-10-15'),
      slug: 'medina-travertin',
      isPremium: true,
      extra: { type: 'hardcoded', description: 'Pierre & Zellij' },
    },
    {
      id: 'hardcoded-autoschluessel',
      name: 'Autoschlüssel Express',
      phone: '+49 800 000 000',
      company: 'Autoschlüssel Express',
      source: 'card',
      sourceLabel: 'Carte Premium',
      sourceIcon: Crown,
      sourceColor: GOTHAM.gold,
      createdAt: new Date('2024-09-20'),
      slug: 'autoschluessel',
      isPremium: true,
      extra: { type: 'hardcoded', description: 'Service Clé Auto' },
    },
    // Website clients
    {
      id: 'hardcoded-website-lamaisoncupcake',
      name: 'La Maison Cupcake (Site)',
      email: 'contact@lamaisoncupcake.com',
      company: 'La Maison Cupcake',
      source: 'website',
      sourceLabel: 'Site Web',
      sourceIcon: Globe,
      sourceColor: GOTHAM.purple,
      createdAt: new Date('2025-01-08'),
      slug: 'lamaisoncupcake',
      isPremium: true,
      extra: { type: 'hardcoded', description: 'Site vitrine pâtisserie', url: 'https://lamaisoncupcake.com' },
    },
  ];

  // Fetch all clients data
  const { data: allClients, isLoading } = useQuery({
    queryKey: ['all-clients-unified'],
    queryFn: async () => {
      // Start with hardcoded clients
      const clients: UnifiedClient[] = [...HARDCODED_CLIENTS];

      // 1. Digital Cards owners
      const { data: cards } = await supabase
        .from('digital_cards')
        .select('id, first_name, last_name, email, phone, company, slug, created_at, view_count, user_id')
        .order('created_at', { ascending: false });

      if (cards) {
        cards.forEach(card => {
          // Skip if slug matches a hardcoded card
          const isHardcoded = HARDCODED_CLIENTS.some(hc => hc.slug === card.slug);
          if (isHardcoded) return;

          clients.push({
            id: `card-${card.id}`,
            name: `${card.first_name} ${card.last_name}`,
            email: card.email || undefined,
            phone: card.phone || undefined,
            company: card.company || undefined,
            source: 'card',
            sourceLabel: 'Carte NFC',
            sourceIcon: CreditCard,
            sourceColor: GOTHAM.gold,
            createdAt: new Date(card.created_at),
            slug: card.slug,
            extra: { views: card.view_count, userId: card.user_id },
          });
        });
      }

      // 2. Website proposals
      const { data: proposals } = await supabase
        .from('website_proposals')
        .select('id, form_data, status, created_at')
        .order('created_at', { ascending: false });

      if (proposals) {
        proposals.forEach(proposal => {
          const formData = proposal.form_data as any;
          const businessName = formData?.businessName || formData?.business_name || 'Proposition Web';
          const email = formData?.email;
          const phone = formData?.phone;
          
          clients.push({
            id: `web-${proposal.id}`,
            name: businessName,
            email: email || undefined,
            phone: phone || undefined,
            source: 'website',
            sourceLabel: 'Web Studio',
            sourceIcon: Globe,
            sourceColor: GOTHAM.purple,
            createdAt: new Date(proposal.created_at),
            status: proposal.status || undefined,
            extra: { formData },
          });
        });
      }

      // 3. Leads
      const { data: leads } = await supabase
        .from('leads')
        .select('id, name, email, phone, company, source, status, created_at, lead_score')
        .order('created_at', { ascending: false });

      if (leads) {
        leads.forEach(lead => {
          clients.push({
            id: `lead-${lead.id}`,
            name: lead.name || lead.email || 'Lead',
            email: lead.email || undefined,
            phone: lead.phone || undefined,
            company: lead.company || undefined,
            source: 'lead',
            sourceLabel: 'Lead',
            sourceIcon: UserPlus,
            sourceColor: GOTHAM.pink,
            createdAt: new Date(lead.created_at),
            status: lead.status || undefined,
            extra: { score: lead.lead_score, originalSource: lead.source },
          });
        });
      }

      // 4. Orders (unique customers)
      const { data: orders } = await supabase
        .from('orders')
        .select('id, shipping_name, customer_email, shipping_phone, status, created_at, total_price_cents')
        .order('created_at', { ascending: false });

      if (orders) {
        // Deduplicate by email
        const seenEmails = new Set<string>();
        orders.forEach(order => {
          const email = order.customer_email?.toLowerCase();
          if (email && seenEmails.has(email)) return;
          if (email) seenEmails.add(email);

          clients.push({
            id: `order-${order.id}`,
            name: order.shipping_name || order.customer_email || 'Client',
            email: order.customer_email || undefined,
            phone: order.shipping_phone || undefined,
            source: 'order',
            sourceLabel: 'Commande',
            sourceIcon: Package,
            sourceColor: GOTHAM.info,
            createdAt: new Date(order.created_at),
            status: order.status,
            extra: { amount: order.total_price_cents },
          });
        });
      }

      // 5. Check premium status from subscriptions
      const { data: subscriptions } = await supabase
        .from('subscriptions')
        .select('user_id, plan, status')
        .eq('plan', 'premium')
        .eq('status', 'active');

      const premiumUserIds = new Set(subscriptions?.map(s => s.user_id) || []);
      
      // Mark premium clients
      clients.forEach(client => {
        if (client.source === 'card' && client.extra?.userId) {
          client.isPremium = premiumUserIds.has(client.extra.userId);
        }
      });

      // Sort by date (newest first)
      return clients.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    },
    refetchInterval: 60000,
  });

  // Filter clients
  const filteredClients = useMemo(() => {
    if (!allClients) return [];
    
    let filtered = allClients;
    
    // Source filter
    if (sourceFilter) {
      filtered = filtered.filter(c => c.source === sourceFilter);
    }

    // Tag filter
    if (tagFilter && tagAssignments) {
      const clientIdsWithTag = new Set(
        tagAssignments
          .filter(a => a.tag_id === tagFilter)
          .map(a => a.client_id)
      );
      filtered = filtered.filter(c => {
        // Extract real ID from prefixed ID
        const realId = c.id.replace(/^(card-|web-|lead-|order-)/, '');
        return clientIdsWithTag.has(realId) || clientIdsWithTag.has(c.id);
      });
    }
    
    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(searchLower) ||
        c.email?.toLowerCase().includes(searchLower) ||
        c.phone?.includes(search) ||
        c.company?.toLowerCase().includes(searchLower)
      );
    }
    
    return filtered;
  }, [allClients, search, sourceFilter, tagFilter, tagAssignments]);

  // Stats by source
  const stats = useMemo(() => {
    if (!allClients) return { card: 0, website: 0, lead: 0, order: 0, total: 0 };
    return {
      card: allClients.filter(c => c.source === 'card').length,
      website: allClients.filter(c => c.source === 'website').length,
      lead: allClients.filter(c => c.source === 'lead').length,
      order: allClients.filter(c => c.source === 'order').length,
      total: allClients.length,
    };
  }, [allClients]);

  const displayedClients = isExpanded ? filteredClients : filteredClients.slice(0, 8);


  return (
    <Card 
      className="border"
      style={{ backgroundColor: GOTHAM.surface, borderColor: GOTHAM.borderMuted }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2" style={{ color: GOTHAM.textMuted }}>
            <Users size={16} style={{ color: GOTHAM.gold }} />
            Tous les clients
            <span 
              className="px-2 py-0.5 rounded-full text-xs font-bold"
              style={{ backgroundColor: `${GOTHAM.gold}20`, color: GOTHAM.gold }}
            >
              {stats.total}
            </span>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/clients')}
            className="gap-1 text-xs"
            style={{ color: GOTHAM.textMuted }}
          >
            Voir tout
            <ChevronRight size={14} />
          </Button>
        </div>

        {/* Source tabs */}
        <div className="flex items-center gap-1 mt-3 overflow-x-auto pb-1">
          <button
            onClick={() => setSourceFilter(null)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap"
            style={{ 
              backgroundColor: !sourceFilter ? GOTHAM.gold : GOTHAM.bg,
              color: !sourceFilter ? '#000' : GOTHAM.textMuted,
            }}
          >
            Tous ({stats.total})
          </button>
          {[
            { id: 'card', label: 'Cartes', count: stats.card, icon: CreditCard, color: GOTHAM.gold },
            { id: 'website', label: 'Web', count: stats.website, icon: Globe, color: GOTHAM.purple },
            { id: 'lead', label: 'Leads', count: stats.lead, icon: UserPlus, color: GOTHAM.pink },
            { id: 'order', label: 'Commandes', count: stats.order, icon: Package, color: GOTHAM.info },
          ].map(source => (
            <button
              key={source.id}
              onClick={() => setSourceFilter(sourceFilter === source.id ? null : source.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap"
              style={{ 
                backgroundColor: sourceFilter === source.id ? `${source.color}30` : GOTHAM.bg,
                color: sourceFilter === source.id ? source.color : GOTHAM.textMuted,
              }}
            >
              <source.icon size={12} />
              {source.label}
              <span className="opacity-60">({source.count})</span>
            </button>
          ))}
        </div>

        {/* Tag filter */}
        {allTags && allTags.length > 0 && (
          <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1">
            <Tag size={12} style={{ color: GOTHAM.textMuted }} />
            {allTags.map((tag: any) => (
              <button
                key={tag.id}
                onClick={() => setTagFilter(tagFilter === tag.id ? null : tag.id)}
                className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium transition-colors whitespace-nowrap"
                style={{ 
                  backgroundColor: tagFilter === tag.id ? `${tag.color}30` : `${tag.color}10`,
                  color: tag.color,
                  border: tagFilter === tag.id ? `1px solid ${tag.color}` : '1px solid transparent',
                }}
              >
                {tag.name}
              </button>
            ))}
          </div>
        )}

        {/* Search */}
        <div className="relative mt-2">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: GOTHAM.textMuted }} />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, email, téléphone..."
            className="pl-9 h-9 text-xs border-0"
            style={{ backgroundColor: GOTHAM.bg, color: GOTHAM.text }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X size={14} style={{ color: GOTHAM.textMuted }} />
            </button>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <ScrollArea className={isExpanded ? "h-[400px]" : "h-auto"}>
          <div className="space-y-1">
            {displayedClients.map((client, index) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className="flex items-center gap-3 p-2.5 rounded-lg transition-colors hover:bg-white/5 cursor-pointer group"
                onClick={() => {
                  if (client.source === 'card') navigate('/admin/creator');
                  else if (client.source === 'website') navigate('/admin/webstudio');
                  else if (client.source === 'lead') navigate('/admin/clients');
                  else if (client.source === 'order') navigate('/admin/orders');
                }}
              >
                {/* Source icon */}
                <div 
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${client.sourceColor}20` }}
                >
                  <client.sourceIcon size={16} style={{ color: client.sourceColor }} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate" style={{ color: GOTHAM.text }}>
                      {client.name}
                    </p>
                    {client.isPremium && (
                      <Crown size={12} style={{ color: GOTHAM.gold }} />
                    )}
                    {client.status === 'new' && (
                      <span 
                        className="text-[10px] px-1.5 py-0.5 rounded-full"
                        style={{ backgroundColor: `${GOTHAM.success}20`, color: GOTHAM.success }}
                      >
                        Nouveau
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs" style={{ color: GOTHAM.textMuted }}>
                    {client.email && (
                      <span className="flex items-center gap-1 truncate">
                        <Mail size={10} />
                        {client.email}
                      </span>
                    )}
                    {client.phone && (
                      <span className="flex items-center gap-1">
                        <Phone size={10} />
                        {client.phone}
                      </span>
                    )}
                    {client.company && !client.email && (
                      <span className="truncate">{client.company}</span>
                    )}
                  </div>
                </div>

                {/* Edit button for editable clients */}
                {(client.source === 'card' || client.source === 'website') && !client.id.startsWith('hardcoded') && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      const realId = client.id.replace('card-', '').replace('web-', '');
                      setEditModal({ 
                        open: true, 
                        id: realId, 
                        type: client.source as 'card' | 'website' 
                      });
                    }}
                    className="h-7 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: GOTHAM.info }}
                    title="Modifier"
                  >
                    <Edit2 size={14} />
                  </Button>
                )}

                {/* Open card button for cards with slug */}
                {client.source === 'card' && client.slug && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`/card/${client.slug}`, '_blank');
                    }}
                    className="h-7 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: GOTHAM.gold }}
                    title="Voir la carte publique"
                  >
                    <ExternalLink size={14} />
                  </Button>
                )}

                {/* Open website for website clients */}
                {client.source === 'website' && client.extra?.url && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(client.extra?.url, '_blank');
                    }}
                    className="h-7 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: GOTHAM.purple }}
                    title="Voir le site"
                  >
                    <ExternalLink size={14} />
                  </Button>
                )}

                {/* Meta */}
                <div className="text-right flex-shrink-0">
                  <p className="text-[10px]" style={{ color: client.sourceColor }}>
                    {client.sourceLabel}
                  </p>
                  <p className="text-[10px]" style={{ color: GOTHAM.textMuted }}>
                    {formatDistanceToNow(client.createdAt, { addSuffix: true, locale: fr })}
                  </p>
                </div>

                {/* Arrow */}
                <ChevronRight 
                  size={14} 
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: GOTHAM.textMuted }} 
                />
              </motion.div>
            ))}

            {filteredClients.length === 0 && !isLoading && (
              <div className="text-center py-8">
                <Sparkles size={24} className="mx-auto mb-2" style={{ color: GOTHAM.textMuted }} />
                <p className="text-sm" style={{ color: GOTHAM.textMuted }}>
                  {search ? 'Aucun résultat' : 'Aucun client'}
                </p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Show more button */}
        {filteredClients.length > 8 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full mt-2 text-xs"
            style={{ color: GOTHAM.gold }}
          >
            {isExpanded ? 'Réduire' : `Voir ${filteredClients.length - 8} de plus`}
          </Button>
        )}

        {/* Quick stats footer */}
        <div 
          className="flex items-center justify-between mt-3 pt-3 border-t text-xs"
          style={{ borderColor: GOTHAM.borderMuted, color: GOTHAM.textMuted }}
        >
          <span>
            {allClients?.filter(c => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return c.createdAt >= today;
            }).length || 0} aujourd'hui
          </span>
          <span style={{ color: GOTHAM.gold }}>
            {allClients?.filter(c => c.isPremium).length || 0} premium
          </span>
        </div>
      </CardContent>

      {/* Edit Modal */}
      <ClientEditModal
        open={editModal.open}
        onClose={() => setEditModal({ open: false, id: '', type: 'card' })}
        clientId={editModal.id}
        clientType={editModal.type}
      />
    </Card>
  );
}
