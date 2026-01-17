/**
 * Serial Codes Widget - Admin Dashboard
 * Affiche les codes de série des cartes digitales
 */

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { 
  Key, 
  Copy, 
  Check, 
  Search,
  ExternalLink,
  User,
  Building2,
  QrCode
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// MANSORY Ultra-Luxe Color Palette
const MANSORY = {
  bg: '#050506',
  bgDeep: '#030304',
  surface: '#0A0A0C',
  surfaceElevated: '#0F0F12',
  surfaceHover: '#141418',
  gold: '#C9A962',
  goldLight: '#D4B978',
  goldMuted: 'rgba(201, 169, 98, 0.15)',
  goldGlow: 'rgba(201, 169, 98, 0.3)',
  border: 'rgba(201, 169, 98, 0.12)',
  borderMuted: 'rgba(255, 255, 255, 0.04)',
  borderActive: 'rgba(201, 169, 98, 0.4)',
  text: '#F8F8F8',
  textSecondary: '#B8B8BC',
  textMuted: 'rgba(184, 184, 188, 0.6)',
  success: '#4ADE80',
  successMuted: 'rgba(74, 222, 128, 0.15)',
  info: '#60A5FA',
  infoMuted: 'rgba(96, 165, 250, 0.15)',
  cyan: '#22D3EE',
  cyanMuted: 'rgba(34, 211, 238, 0.15)',
};

interface CardWithSerial {
  id: string;
  first_name: string;
  last_name: string;
  company: string | null;
  serial_code: string | null;
  slug: string;
  is_active: boolean;
  nfc_enabled: boolean;
  created_at: string;
}

export function SerialCodesWidget() {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { data: cards, isLoading } = useQuery({
    queryKey: ['admin-serial-codes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('digital_cards')
        .select('id, first_name, last_name, company, serial_code, slug, is_active, nfc_enabled, created_at')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as CardWithSerial[];
    }
  });

  const filteredCards = cards?.filter(card => {
    const query = searchQuery.toLowerCase();
    return (
      card.first_name?.toLowerCase().includes(query) ||
      card.last_name?.toLowerCase().includes(query) ||
      card.company?.toLowerCase().includes(query) ||
      card.serial_code?.toLowerCase().includes(query) ||
      card.slug?.toLowerCase().includes(query)
    );
  });

  const handleCopy = async (serialCode: string, id: string) => {
    try {
      await navigator.clipboard.writeText(serialCode);
      setCopiedId(id);
      toast.success("Code copié !");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error("Erreur de copie");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl overflow-hidden"
      style={{ 
        backgroundColor: MANSORY.surface,
        border: `1px solid ${MANSORY.border}`,
      }}
    >
      {/* Header */}
      <div 
        className="px-5 py-4 flex items-center justify-between"
        style={{ borderBottom: `1px solid ${MANSORY.border}` }}
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: MANSORY.cyanMuted }}
          >
            <Key size={18} style={{ color: MANSORY.cyan }} />
          </div>
          <div>
            <h3 
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: MANSORY.text }}
            >
              Codes de Série
            </h3>
            <p className="text-xs" style={{ color: MANSORY.textMuted }}>
              {cards?.length || 0} cartes enregistrées
            </p>
          </div>
        </div>
        <Badge 
          className="text-xs px-2 py-0.5"
          style={{ 
            backgroundColor: MANSORY.goldMuted,
            color: MANSORY.gold,
            border: 'none'
          }}
        >
          Activation
        </Badge>
      </div>

      {/* Search */}
      <div className="px-4 py-3" style={{ borderBottom: `1px solid ${MANSORY.borderMuted}` }}>
        <div className="relative">
          <Search 
            size={16} 
            className="absolute left-3 top-1/2 -translate-y-1/2" 
            style={{ color: MANSORY.textMuted }}
          />
          <Input
            placeholder="Rechercher par nom, entreprise ou code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-sm border-0"
            style={{ 
              backgroundColor: MANSORY.surfaceHover,
              color: MANSORY.text,
            }}
          />
        </div>
      </div>

      {/* Cards List */}
      <ScrollArea className="h-[360px]">
        <div className="p-3 space-y-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div 
                className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
                style={{ borderColor: MANSORY.gold, borderTopColor: 'transparent' }}
              />
            </div>
          ) : filteredCards?.length === 0 ? (
            <p className="text-center py-12 text-sm" style={{ color: MANSORY.textMuted }}>
              {searchQuery ? "Aucun résultat trouvé" : "Aucune carte enregistrée"}
            </p>
          ) : (
            filteredCards?.map((card) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="group rounded-xl p-3 transition-all duration-200"
                style={{ 
                  backgroundColor: MANSORY.surfaceElevated,
                  border: `1px solid ${MANSORY.borderMuted}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = MANSORY.surfaceHover;
                  e.currentTarget.style.borderColor = MANSORY.border;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = MANSORY.surfaceElevated;
                  e.currentTarget.style.borderColor = MANSORY.borderMuted;
                }}
              >
                {/* Card Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: MANSORY.goldMuted }}
                    >
                      <User size={14} style={{ color: MANSORY.gold }} />
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: MANSORY.text }}>
                        {card.first_name} {card.last_name}
                      </p>
                      {card.company && (
                        <div className="flex items-center gap-1">
                          <Building2 size={10} style={{ color: MANSORY.textMuted }} />
                          <p className="text-xs" style={{ color: MANSORY.textSecondary }}>
                            {card.company}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {card.nfc_enabled && (
                      <Badge 
                        className="text-[10px] px-1.5 py-0"
                        style={{ 
                          backgroundColor: MANSORY.infoMuted,
                          color: MANSORY.info,
                          border: 'none'
                        }}
                      >
                        NFC
                      </Badge>
                    )}
                    <Badge 
                      className="text-[10px] px-1.5 py-0"
                      style={{ 
                        backgroundColor: card.is_active ? MANSORY.successMuted : MANSORY.borderMuted,
                        color: card.is_active ? MANSORY.success : MANSORY.textMuted,
                        border: 'none'
                      }}
                    >
                      {card.is_active ? "Actif" : "Inactif"}
                    </Badge>
                  </div>
                </div>

                {/* Serial Code */}
                <div 
                  className="flex items-center justify-between rounded-lg px-3 py-2"
                  style={{ backgroundColor: MANSORY.bg }}
                >
                  <div className="flex items-center gap-2">
                    <QrCode size={14} style={{ color: MANSORY.cyan }} />
                    <code 
                      className="text-sm font-mono tracking-wider"
                      style={{ color: MANSORY.cyan }}
                    >
                      {card.serial_code || "N/A"}
                    </code>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => card.serial_code && handleCopy(card.serial_code, card.id)}
                      disabled={!card.serial_code}
                    >
                      {copiedId === card.id ? (
                        <Check size={14} style={{ color: MANSORY.success }} />
                      ) : (
                        <Copy size={14} style={{ color: MANSORY.textMuted }} />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => window.open(`/c/${card.slug}`, '_blank')}
                    >
                      <ExternalLink size={14} style={{ color: MANSORY.textMuted }} />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div 
        className="px-4 py-3 flex items-center justify-between"
        style={{ borderTop: `1px solid ${MANSORY.border}` }}
      >
        <p className="text-xs" style={{ color: MANSORY.textMuted }}>
          Portail d'activation: <span style={{ color: MANSORY.gold }}>/activation</span>
        </p>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 text-xs"
          style={{ color: MANSORY.gold }}
          onClick={() => window.open('/activation', '_blank')}
        >
          Ouvrir le portail
          <ExternalLink size={12} className="ml-1" />
        </Button>
      </div>
    </motion.div>
  );
}
