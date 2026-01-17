/**
 * Advanced Filters Panel - GOTHAM Style
 * Tag system and advanced filters for orders and clients
 */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Filter,
  X,
  Tag,
  Calendar,
  DollarSign,
  Package,
  CreditCard,
  Users,
  Globe,
  CheckCircle2,
  Clock,
  Truck,
  AlertCircle,
  ChevronDown,
  Search,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { format, subDays, subMonths, isWithinInterval, startOfDay, endOfDay } from "date-fns";

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

// Filter types
export interface FilterState {
  search: string;
  status: string[];
  source: string[];
  dateRange: 'all' | '7d' | '30d' | '90d' | 'custom';
  customDateFrom?: Date;
  customDateTo?: Date;
  tags: string[];
  minAmount?: number;
  maxAmount?: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export const defaultFilters: FilterState = {
  search: '',
  status: [],
  source: [],
  dateRange: 'all',
  tags: [],
  sortBy: 'created_at',
  sortOrder: 'desc',
};

interface AdvancedFiltersPanelProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  type: 'orders' | 'clients' | 'cards';
  resultCount?: number;
}

// Predefined tags
const ORDER_TAGS = [
  { id: 'vip', label: 'VIP', color: GOTHAM.gold },
  { id: 'urgent', label: 'Urgent', color: GOTHAM.danger },
  { id: 'express', label: 'Express', color: GOTHAM.warning },
  { id: 'premium', label: 'Premium', color: GOTHAM.purple },
  { id: 'recurring', label: 'Récurrent', color: GOTHAM.info },
];

const CLIENT_TAGS = [
  { id: 'active', label: 'Actif', color: GOTHAM.success },
  { id: 'premium', label: 'Premium', color: GOTHAM.gold },
  { id: 'new', label: 'Nouveau', color: GOTHAM.info },
  { id: 'lead', label: 'Lead', color: GOTHAM.pink },
  { id: 'web', label: 'Web Studio', color: GOTHAM.purple },
];

const ORDER_STATUSES = [
  { id: 'pending', label: 'En attente', color: GOTHAM.warning, icon: Clock },
  { id: 'paid', label: 'Payé', color: GOTHAM.success, icon: CheckCircle2 },
  { id: 'in_production', label: 'En production', color: GOTHAM.info, icon: Package },
  { id: 'shipped', label: 'Expédié', color: GOTHAM.purple, icon: Truck },
  { id: 'delivered', label: 'Livré', color: GOTHAM.success, icon: CheckCircle2 },
];

const CLIENT_SOURCES = [
  { id: 'card', label: 'Carte NFC', color: GOTHAM.gold, icon: CreditCard },
  { id: 'web', label: 'Site Web', color: GOTHAM.purple, icon: Globe },
  { id: 'lead', label: 'Lead Form', color: GOTHAM.pink, icon: Users },
  { id: 'order', label: 'Commande', color: GOTHAM.info, icon: Package },
];

const DATE_RANGES = [
  { id: 'all', label: 'Tout' },
  { id: '7d', label: '7 jours' },
  { id: '30d', label: '30 jours' },
  { id: '90d', label: '3 mois' },
];

export function AdvancedFiltersPanel({ 
  filters, 
  onChange, 
  type,
  resultCount,
}: AdvancedFiltersPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const tags = type === 'orders' ? ORDER_TAGS : CLIENT_TAGS;
  const statuses = type === 'orders' ? ORDER_STATUSES : [];
  const sources = type !== 'orders' ? CLIENT_SOURCES : [];
  
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.status.length) count++;
    if (filters.source.length) count++;
    if (filters.dateRange !== 'all') count++;
    if (filters.tags.length) count++;
    if (filters.minAmount || filters.maxAmount) count++;
    return count;
  }, [filters]);

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (key: 'status' | 'source' | 'tags', value: string) => {
    const current = filters[key];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    updateFilter(key, updated);
  };

  const resetFilters = () => {
    onChange(defaultFilters);
  };

  return (
    <div 
      className="rounded-xl border overflow-hidden"
      style={{ 
        backgroundColor: GOTHAM.surface,
        borderColor: GOTHAM.borderMuted,
      }}
    >
      {/* Search bar + Toggle */}
      <div className="flex items-center gap-3 p-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: GOTHAM.textMuted }} />
          <Input
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            placeholder={`Rechercher ${type === 'orders' ? 'commandes' : 'clients'}...`}
            className="pl-10 border-0"
            style={{ 
              backgroundColor: GOTHAM.bg,
              color: GOTHAM.text,
            }}
          />
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="gap-2"
          style={{ color: activeFiltersCount > 0 ? GOTHAM.gold : GOTHAM.textMuted }}
        >
          <Filter size={16} />
          Filtres
          {activeFiltersCount > 0 && (
            <span 
              className="w-5 h-5 rounded-full text-xs flex items-center justify-center"
              style={{ backgroundColor: GOTHAM.gold, color: '#000' }}
            >
              {activeFiltersCount}
            </span>
          )}
          <ChevronDown 
            size={14} 
            className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          />
        </Button>
        
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="gap-1"
            style={{ color: GOTHAM.textMuted }}
          >
            <RotateCcw size={14} />
            Reset
          </Button>
        )}
      </div>

      {/* Expanded filters */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t overflow-hidden"
            style={{ borderColor: GOTHAM.borderMuted }}
          >
            <div className="p-4 space-y-4">
              {/* Date range */}
              <div>
                <label className="text-xs mb-2 block" style={{ color: GOTHAM.textMuted }}>
                  <Calendar size={12} className="inline mr-1" />
                  Période
                </label>
                <div className="flex flex-wrap gap-2">
                  {DATE_RANGES.map(range => (
                    <button
                      key={range.id}
                      onClick={() => updateFilter('dateRange', range.id as FilterState['dateRange'])}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                      style={{ 
                        backgroundColor: filters.dateRange === range.id ? GOTHAM.gold : GOTHAM.bg,
                        color: filters.dateRange === range.id ? '#000' : GOTHAM.textMuted,
                      }}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status (for orders) */}
              {statuses.length > 0 && (
                <div>
                  <label className="text-xs mb-2 block" style={{ color: GOTHAM.textMuted }}>
                    <Package size={12} className="inline mr-1" />
                    Statut
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {statuses.map(status => (
                      <button
                        key={status.id}
                        onClick={() => toggleArrayFilter('status', status.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                        style={{ 
                          backgroundColor: filters.status.includes(status.id) ? `${status.color}30` : GOTHAM.bg,
                          color: filters.status.includes(status.id) ? status.color : GOTHAM.textMuted,
                          border: `1px solid ${filters.status.includes(status.id) ? status.color : 'transparent'}`,
                        }}
                      >
                        <status.icon size={12} />
                        {status.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Source (for clients) */}
              {sources.length > 0 && (
                <div>
                  <label className="text-xs mb-2 block" style={{ color: GOTHAM.textMuted }}>
                    <Users size={12} className="inline mr-1" />
                    Source
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {sources.map(source => (
                      <button
                        key={source.id}
                        onClick={() => toggleArrayFilter('source', source.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                        style={{ 
                          backgroundColor: filters.source.includes(source.id) ? `${source.color}30` : GOTHAM.bg,
                          color: filters.source.includes(source.id) ? source.color : GOTHAM.textMuted,
                          border: `1px solid ${filters.source.includes(source.id) ? source.color : 'transparent'}`,
                        }}
                      >
                        <source.icon size={12} />
                        {source.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              <div>
                <label className="text-xs mb-2 block" style={{ color: GOTHAM.textMuted }}>
                  <Tag size={12} className="inline mr-1" />
                  Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <button
                      key={tag.id}
                      onClick={() => toggleArrayFilter('tags', tag.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                      style={{ 
                        backgroundColor: filters.tags.includes(tag.id) ? `${tag.color}30` : GOTHAM.bg,
                        color: filters.tags.includes(tag.id) ? tag.color : GOTHAM.textMuted,
                        border: `1px solid ${filters.tags.includes(tag.id) ? tag.color : 'transparent'}`,
                      }}
                    >
                      <span 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: tag.color }}
                      />
                      {tag.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount range (for orders) */}
              {type === 'orders' && (
                <div>
                  <label className="text-xs mb-2 block" style={{ color: GOTHAM.textMuted }}>
                    <DollarSign size={12} className="inline mr-1" />
                    Montant (MAD)
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.minAmount || ''}
                      onChange={(e) => updateFilter('minAmount', e.target.value ? Number(e.target.value) : undefined)}
                      className="w-24 text-center"
                      style={{ backgroundColor: GOTHAM.bg, color: GOTHAM.text }}
                    />
                    <span style={{ color: GOTHAM.textMuted }}>—</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.maxAmount || ''}
                      onChange={(e) => updateFilter('maxAmount', e.target.value ? Number(e.target.value) : undefined)}
                      className="w-24 text-center"
                      style={{ backgroundColor: GOTHAM.bg, color: GOTHAM.text }}
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results count */}
      {resultCount !== undefined && (
        <div 
          className="px-4 py-2 border-t text-xs"
          style={{ borderColor: GOTHAM.borderMuted, color: GOTHAM.textMuted }}
        >
          <span style={{ color: GOTHAM.gold }}>{resultCount}</span> résultat{resultCount !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}

// Filter helper function
export function applyFilters<T extends { 
  created_at?: string; 
  status?: string;
  source?: string;
  total_price_cents?: number;
}>(
  items: T[],
  filters: FilterState,
  searchFields: (keyof T)[]
): T[] {
  return items.filter(item => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = searchFields.some(field => {
        const value = item[field];
        return value && String(value).toLowerCase().includes(searchLower);
      });
      if (!matchesSearch) return false;
    }

    // Status filter
    if (filters.status.length > 0 && item.status) {
      if (!filters.status.includes(item.status)) return false;
    }

    // Source filter  
    if (filters.source.length > 0 && item.source) {
      if (!filters.source.includes(item.source)) return false;
    }

    // Date range filter
    if (filters.dateRange !== 'all' && item.created_at) {
      const itemDate = new Date(item.created_at);
      const now = new Date();
      let startDate: Date;

      switch (filters.dateRange) {
        case '7d':
          startDate = subDays(now, 7);
          break;
        case '30d':
          startDate = subDays(now, 30);
          break;
        case '90d':
          startDate = subMonths(now, 3);
          break;
        default:
          startDate = new Date(0);
      }

      if (!isWithinInterval(itemDate, { start: startOfDay(startDate), end: endOfDay(now) })) {
        return false;
      }
    }

    // Amount filter
    if (item.total_price_cents !== undefined) {
      const amountMAD = item.total_price_cents / 100;
      if (filters.minAmount && amountMAD < filters.minAmount) return false;
      if (filters.maxAmount && amountMAD > filters.maxAmount) return false;
    }

    return true;
  });
}
