/**
 * Global Search Modal (⌘K) - GOTHAM Style
 * Search across clients, orders, cards in real-time
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Package,
  CreditCard,
  Users,
  FileText,
  Globe,
  Mail,
  Phone,
  ArrowRight,
  Command,
  Loader2,
  Hash,
  User,
  Clock,
  Sparkles,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
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

interface SearchResult {
  id: string;
  type: 'order' | 'card' | 'client' | 'lead' | 'proposal';
  title: string;
  subtitle: string;
  meta?: string;
  icon: React.ElementType;
  color: string;
  path: string;
  createdAt?: Date;
}

interface GlobalSearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function GlobalSearchModal({ open, onClose }: GlobalSearchModalProps) {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Search query
  const { data: results, isLoading } = useQuery({
    queryKey: ["globalSearch", query],
    queryFn: async (): Promise<SearchResult[]> => {
      if (!query || query.length < 2) return [];

      const searchQuery = `%${query}%`;
      const results: SearchResult[] = [];

      // Search orders
      const { data: orders } = await supabase
        .from("orders")
        .select("id, order_number, shipping_name, customer_email, status, created_at, total_price_cents")
        .or(`order_number.ilike.${searchQuery},shipping_name.ilike.${searchQuery},customer_email.ilike.${searchQuery}`)
        .limit(5);

      if (orders) {
        results.push(...orders.map(o => ({
          id: `order-${o.id}`,
          type: 'order' as const,
          title: `Commande #${o.order_number}`,
          subtitle: o.shipping_name || o.customer_email || 'Client',
          meta: `${((o.total_price_cents || 0) / 100).toFixed(0)} MAD • ${o.status}`,
          icon: Package,
          color: GOTHAM.gold,
          path: '/admin/orders',
          createdAt: new Date(o.created_at),
        })));
      }

      // Search cards
      const { data: cards } = await supabase
        .from("digital_cards")
        .select("id, first_name, last_name, slug, company, email, created_at")
        .or(`first_name.ilike.${searchQuery},last_name.ilike.${searchQuery},slug.ilike.${searchQuery},company.ilike.${searchQuery},email.ilike.${searchQuery}`)
        .limit(5);

      if (cards) {
        results.push(...cards.map(c => ({
          id: `card-${c.id}`,
          type: 'card' as const,
          title: `${c.first_name} ${c.last_name}`,
          subtitle: c.company || c.email || c.slug,
          meta: `/${c.slug}`,
          icon: CreditCard,
          color: GOTHAM.purple,
          path: `/admin/creator?edit=${c.id}`,
          createdAt: new Date(c.created_at),
        })));
      }

      // Search profiles (clients)
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, user_id, created_at")
        .or(`first_name.ilike.${searchQuery},last_name.ilike.${searchQuery}`)
        .limit(5);

      if (profiles) {
        results.push(...profiles.map(p => ({
          id: `client-${p.id}`,
          type: 'client' as const,
          title: `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Client',
          subtitle: `ID: ${p.user_id?.slice(0, 8)}...`,
          icon: Users,
          color: GOTHAM.info,
          path: '/admin/clients',
          createdAt: new Date(p.created_at),
        })));
      }

      // Search leads
      const { data: leads } = await supabase
        .from("leads")
        .select("id, name, email, phone, company, created_at")
        .or(`name.ilike.${searchQuery},email.ilike.${searchQuery},company.ilike.${searchQuery}`)
        .limit(5);

      if (leads) {
        results.push(...leads.map(l => ({
          id: `lead-${l.id}`,
          type: 'lead' as const,
          title: l.name || 'Lead',
          subtitle: l.email || l.phone || l.company || '',
          icon: User,
          color: GOTHAM.pink,
          path: '/admin/clients',
          createdAt: new Date(l.created_at),
        })));
      }

      // Search website proposals
      const { data: proposals } = await supabase
        .from("website_proposals")
        .select("id, form_data, status, created_at")
        .limit(10);

      if (proposals) {
        const matchingProposals = proposals.filter(p => {
          const formData = p.form_data as any;
          const businessName = formData?.businessName || formData?.business_name || '';
          const email = formData?.email || '';
          return businessName.toLowerCase().includes(query.toLowerCase()) ||
                 email.toLowerCase().includes(query.toLowerCase());
        }).slice(0, 5);

        results.push(...matchingProposals.map(p => {
          const formData = p.form_data as any;
          return {
            id: `proposal-${p.id}`,
            type: 'proposal' as const,
            title: formData?.businessName || formData?.business_name || 'Proposition',
            subtitle: formData?.email || '',
            meta: p.status,
            icon: Globe,
            color: '#D4A853',
            path: `/admin/webstudio?id=${p.id}`,
            createdAt: new Date(p.created_at),
          };
        }));
      }

      // Sort by relevance (exact matches first, then by date)
      return results.sort((a, b) => {
        const aExact = a.title.toLowerCase().includes(query.toLowerCase()) ? 1 : 0;
        const bExact = b.title.toLowerCase().includes(query.toLowerCase()) ? 1 : 0;
        if (aExact !== bExact) return bExact - aExact;
        return (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0);
      });
    },
    enabled: open && query.length >= 2,
    staleTime: 5000,
  });

  // Filter by category
  const filteredResults = activeCategory
    ? results?.filter(r => r.type === activeCategory)
    : results;

  // Categories with counts
  const categories = results ? [
    { id: 'order', label: 'Commandes', count: results.filter(r => r.type === 'order').length, icon: Package, color: GOTHAM.gold },
    { id: 'card', label: 'Cartes', count: results.filter(r => r.type === 'card').length, icon: CreditCard, color: GOTHAM.purple },
    { id: 'client', label: 'Clients', count: results.filter(r => r.type === 'client').length, icon: Users, color: GOTHAM.info },
    { id: 'lead', label: 'Leads', count: results.filter(r => r.type === 'lead').length, icon: User, color: GOTHAM.pink },
    { id: 'proposal', label: 'Web', count: results.filter(r => r.type === 'proposal').length, icon: Globe, color: '#D4A853' },
  ].filter(c => c.count > 0) : [];

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, (filteredResults?.length || 1) - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, 0));
      } else if (e.key === 'Enter' && filteredResults?.[selectedIndex]) {
        e.preventDefault();
        handleSelect(filteredResults[selectedIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, filteredResults, selectedIndex, onClose]);

  // Focus input on open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery("");
      setSelectedIndex(0);
      setActiveCategory(null);
    }
  }, [open]);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, activeCategory]);

  const handleSelect = useCallback((result: SearchResult) => {
    navigate(result.path);
    onClose();
  }, [navigate, onClose]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 backdrop-blur-sm"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl rounded-2xl border overflow-hidden shadow-2xl"
          style={{ 
            backgroundColor: GOTHAM.bg,
            borderColor: GOTHAM.border,
            boxShadow: `0 0 60px ${GOTHAM.gold}20`,
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Search header */}
          <div 
            className="flex items-center gap-3 px-4 py-4 border-b"
            style={{ borderColor: GOTHAM.borderMuted }}
          >
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${GOTHAM.gold}20` }}
            >
              <Command size={16} style={{ color: GOTHAM.gold }} />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher commandes, cartes, clients..."
              className="flex-1 bg-transparent text-base outline-none placeholder:text-[#666]"
              style={{ color: GOTHAM.text }}
            />
            {isLoading && (
              <Loader2 size={16} className="animate-spin" style={{ color: GOTHAM.gold }} />
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X size={16} style={{ color: GOTHAM.textMuted }} />
            </button>
          </div>

          {/* Category filters */}
          {categories.length > 0 && (
            <div 
              className="flex items-center gap-2 px-4 py-2 border-b overflow-x-auto"
              style={{ borderColor: GOTHAM.borderMuted }}
            >
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                  !activeCategory ? 'text-black' : ''
                }`}
                style={{ 
                  backgroundColor: !activeCategory ? GOTHAM.gold : GOTHAM.surface,
                  color: !activeCategory ? '#000' : GOTHAM.textMuted,
                }}
              >
                Tout ({results?.length || 0})
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id === activeCategory ? null : cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap`}
                  style={{ 
                    backgroundColor: activeCategory === cat.id ? `${cat.color}30` : GOTHAM.surface,
                    color: activeCategory === cat.id ? cat.color : GOTHAM.textMuted,
                  }}
                >
                  <cat.icon size={12} />
                  {cat.label} ({cat.count})
                </button>
              ))}
            </div>
          )}

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {query.length < 2 ? (
              <div className="p-8 text-center">
                <div 
                  className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${GOTHAM.gold}10` }}
                >
                  <Search size={28} style={{ color: GOTHAM.gold }} />
                </div>
                <p className="text-sm mb-2" style={{ color: GOTHAM.text }}>
                  Recherche globale
                </p>
                <p className="text-xs" style={{ color: GOTHAM.textMuted }}>
                  Tapez au moins 2 caractères pour rechercher
                </p>
                <div className="flex items-center justify-center gap-4 mt-4">
                  {[
                    { icon: Package, label: 'Commandes' },
                    { icon: CreditCard, label: 'Cartes' },
                    { icon: Users, label: 'Clients' },
                  ].map((item) => (
                    <div 
                      key={item.label}
                      className="flex items-center gap-1.5 text-xs"
                      style={{ color: GOTHAM.textMuted }}
                    >
                      <item.icon size={12} />
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>
            ) : filteredResults && filteredResults.length > 0 ? (
              <div className="p-2">
                {filteredResults.map((result, index) => (
                  <motion.button
                    key={result.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    onClick={() => handleSelect(result)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all`}
                    style={{ 
                      backgroundColor: index === selectedIndex ? `${result.color}15` : 'transparent',
                      boxShadow: index === selectedIndex ? `inset 0 0 0 1px ${result.color}` : 'none',
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${result.color}20` }}
                    >
                      <result.icon size={18} style={{ color: result.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate" style={{ color: GOTHAM.text }}>
                        {result.title}
                      </p>
                      <p className="text-xs truncate" style={{ color: GOTHAM.textMuted }}>
                        {result.subtitle}
                      </p>
                    </div>
                    {result.meta && (
                      <span 
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${result.color}15`, color: result.color }}
                      >
                        {result.meta}
                      </span>
                    )}
                    {result.createdAt && (
                      <span className="text-xs hidden sm:block" style={{ color: GOTHAM.textMuted }}>
                        {formatDistanceToNow(result.createdAt, { addSuffix: true, locale: fr })}
                      </span>
                    )}
                    <ArrowRight size={14} style={{ color: GOTHAM.textMuted }} />
                  </motion.button>
                ))}
              </div>
            ) : query.length >= 2 && !isLoading ? (
              <div className="p-8 text-center">
                <div 
                  className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: GOTHAM.surface }}
                >
                  <Sparkles size={28} style={{ color: GOTHAM.textMuted }} />
                </div>
                <p className="text-sm mb-1" style={{ color: GOTHAM.text }}>
                  Aucun résultat pour "{query}"
                </p>
                <p className="text-xs" style={{ color: GOTHAM.textMuted }}>
                  Essayez avec d'autres termes
                </p>
              </div>
            ) : null}
          </div>

          {/* Footer */}
          <div 
            className="flex items-center justify-between px-4 py-2 border-t text-xs"
            style={{ borderColor: GOTHAM.borderMuted, color: GOTHAM.textMuted }}
          >
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded" style={{ backgroundColor: GOTHAM.surface }}>↑↓</kbd>
                naviguer
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded" style={{ backgroundColor: GOTHAM.surface }}>↵</kbd>
                ouvrir
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded" style={{ backgroundColor: GOTHAM.surface }}>esc</kbd>
                fermer
              </span>
            </div>
            <span style={{ color: GOTHAM.gold }}>IWASP Command</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
