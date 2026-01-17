/**
 * Client Edit Modal - GOTHAM Style
 * Modal to edit client cards and website proposals
 */

import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import {
  X,
  Save,
  Loader2,
  User,
  Mail,
  Phone,
  Building2,
  Briefcase,
  MapPin,
  Globe,
  Linkedin,
  MessageCircle,
  Instagram,
  FileText,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

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
  danger: '#EF4444',
  purple: '#A855F7',
};

interface ClientEditModalProps {
  open: boolean;
  onClose: () => void;
  clientId: string;
  clientType: 'card' | 'website';
}

interface CardData {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  title: string | null;
  linkedin: string | null;
  whatsapp: string | null;
  instagram: string | null;
  website: string | null;
  location: string | null;
  tagline: string | null;
  slug: string;
}

interface WebsiteData {
  id: string;
  form_data: any;
  status: string;
  admin_notes: string | null;
}

export function ClientEditModal({ open, onClose, clientId, clientType }: ClientEditModalProps) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [websiteData, setWebsiteData] = useState<WebsiteData | null>(null);

  // Load data
  useEffect(() => {
    if (!open || !clientId) return;

    const loadData = async () => {
      setIsLoading(true);
      try {
        if (clientType === 'card') {
          const { data, error } = await supabase
            .from('digital_cards')
            .select('id, first_name, last_name, email, phone, company, title, linkedin, whatsapp, instagram, website, location, tagline, slug')
            .eq('id', clientId)
            .single();

          if (error) throw error;
          setCardData(data);
        } else {
          const { data, error } = await supabase
            .from('website_proposals')
            .select('id, form_data, status, admin_notes')
            .eq('id', clientId)
            .single();

          if (error) throw error;
          setWebsiteData(data);
        }
      } catch (error: any) {
        console.error('Error loading client:', error);
        toast.error('Erreur de chargement');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [open, clientId, clientType]);

  // Save card
  const handleSaveCard = async () => {
    if (!cardData) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('digital_cards')
        .update({
          first_name: cardData.first_name,
          last_name: cardData.last_name,
          email: cardData.email || null,
          phone: cardData.phone || null,
          company: cardData.company || null,
          title: cardData.title || null,
          linkedin: cardData.linkedin || null,
          whatsapp: cardData.whatsapp || null,
          instagram: cardData.instagram || null,
          website: cardData.website || null,
          location: cardData.location || null,
          tagline: cardData.tagline || null,
        })
        .eq('id', cardData.id);

      if (error) throw error;

      toast.success('Carte mise à jour');
      queryClient.invalidateQueries({ queryKey: ['all-clients-unified'] });
      onClose();
    } catch (error: any) {
      console.error('Error saving card:', error);
      toast.error(`Erreur: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Save website
  const handleSaveWebsite = async () => {
    if (!websiteData) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('website_proposals')
        .update({
          form_data: websiteData.form_data,
          admin_notes: websiteData.admin_notes,
        })
        .eq('id', websiteData.id);

      if (error) throw error;

      toast.success('Proposition mise à jour');
      queryClient.invalidateQueries({ queryKey: ['all-clients-unified'] });
      onClose();
    } catch (error: any) {
      console.error('Error saving website:', error);
      toast.error(`Erreur: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const inputStyle = {
    backgroundColor: GOTHAM.bg,
    borderColor: GOTHAM.borderMuted,
    color: GOTHAM.text,
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent 
        className="max-w-lg border"
        style={{ backgroundColor: GOTHAM.surface, borderColor: GOTHAM.border }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2" style={{ color: GOTHAM.text }}>
            {clientType === 'card' ? (
              <>
                <User size={20} style={{ color: GOTHAM.gold }} />
                Modifier la carte
              </>
            ) : (
              <>
                <Globe size={20} style={{ color: GOTHAM.purple }} />
                Modifier la proposition
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={24} className="animate-spin" style={{ color: GOTHAM.gold }} />
          </div>
        ) : clientType === 'card' && cardData ? (
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-4 pr-4">
              {/* Name fields */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs flex items-center gap-1.5" style={{ color: GOTHAM.textMuted }}>
                    <User size={12} /> Prénom *
                  </Label>
                  <Input
                    value={cardData.first_name}
                    onChange={(e) => setCardData({ ...cardData, first_name: e.target.value })}
                    className="h-9 text-sm"
                    style={inputStyle}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs flex items-center gap-1.5" style={{ color: GOTHAM.textMuted }}>
                    <User size={12} /> Nom *
                  </Label>
                  <Input
                    value={cardData.last_name}
                    onChange={(e) => setCardData({ ...cardData, last_name: e.target.value })}
                    className="h-9 text-sm"
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Contact fields */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs flex items-center gap-1.5" style={{ color: GOTHAM.textMuted }}>
                    <Mail size={12} /> Email
                  </Label>
                  <Input
                    type="email"
                    value={cardData.email || ''}
                    onChange={(e) => setCardData({ ...cardData, email: e.target.value })}
                    className="h-9 text-sm"
                    style={inputStyle}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs flex items-center gap-1.5" style={{ color: GOTHAM.textMuted }}>
                    <Phone size={12} /> Téléphone
                  </Label>
                  <Input
                    value={cardData.phone || ''}
                    onChange={(e) => setCardData({ ...cardData, phone: e.target.value })}
                    className="h-9 text-sm"
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Company & Title */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs flex items-center gap-1.5" style={{ color: GOTHAM.textMuted }}>
                    <Building2 size={12} /> Entreprise
                  </Label>
                  <Input
                    value={cardData.company || ''}
                    onChange={(e) => setCardData({ ...cardData, company: e.target.value })}
                    className="h-9 text-sm"
                    style={inputStyle}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs flex items-center gap-1.5" style={{ color: GOTHAM.textMuted }}>
                    <Briefcase size={12} /> Poste
                  </Label>
                  <Input
                    value={cardData.title || ''}
                    onChange={(e) => setCardData({ ...cardData, title: e.target.value })}
                    className="h-9 text-sm"
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Location & Website */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs flex items-center gap-1.5" style={{ color: GOTHAM.textMuted }}>
                    <MapPin size={12} /> Ville
                  </Label>
                  <Input
                    value={cardData.location || ''}
                    onChange={(e) => setCardData({ ...cardData, location: e.target.value })}
                    className="h-9 text-sm"
                    style={inputStyle}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs flex items-center gap-1.5" style={{ color: GOTHAM.textMuted }}>
                    <Globe size={12} /> Site Web
                  </Label>
                  <Input
                    value={cardData.website || ''}
                    onChange={(e) => setCardData({ ...cardData, website: e.target.value })}
                    className="h-9 text-sm"
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Social */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs flex items-center gap-1.5" style={{ color: GOTHAM.textMuted }}>
                    <Linkedin size={12} /> LinkedIn
                  </Label>
                  <Input
                    value={cardData.linkedin || ''}
                    onChange={(e) => setCardData({ ...cardData, linkedin: e.target.value })}
                    className="h-9 text-sm"
                    style={inputStyle}
                    placeholder="URL"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs flex items-center gap-1.5" style={{ color: GOTHAM.textMuted }}>
                    <MessageCircle size={12} /> WhatsApp
                  </Label>
                  <Input
                    value={cardData.whatsapp || ''}
                    onChange={(e) => setCardData({ ...cardData, whatsapp: e.target.value })}
                    className="h-9 text-sm"
                    style={inputStyle}
                    placeholder="+212..."
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs flex items-center gap-1.5" style={{ color: GOTHAM.textMuted }}>
                    <Instagram size={12} /> Instagram
                  </Label>
                  <Input
                    value={cardData.instagram || ''}
                    onChange={(e) => setCardData({ ...cardData, instagram: e.target.value })}
                    className="h-9 text-sm"
                    style={inputStyle}
                    placeholder="@username"
                  />
                </div>
              </div>

              {/* Tagline */}
              <div className="space-y-1.5">
                <Label className="text-xs flex items-center gap-1.5" style={{ color: GOTHAM.textMuted }}>
                  <FileText size={12} /> Slogan / Bio
                </Label>
                <Textarea
                  value={cardData.tagline || ''}
                  onChange={(e) => setCardData({ ...cardData, tagline: e.target.value })}
                  className="text-sm min-h-[60px]"
                  style={inputStyle}
                  placeholder="Votre accroche..."
                />
              </div>

              {/* Slug (read-only) */}
              <div className="space-y-1.5">
                <Label className="text-xs" style={{ color: GOTHAM.textMuted }}>
                  URL de la carte
                </Label>
                <div 
                  className="flex items-center gap-2 p-2 rounded text-xs"
                  style={{ backgroundColor: GOTHAM.bg }}
                >
                  <span style={{ color: GOTHAM.textMuted }}>i-wasp.lovable.app/card/</span>
                  <span style={{ color: GOTHAM.gold }}>{cardData.slug}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 ml-auto"
                    onClick={() => window.open(`/card/${cardData.slug}`, '_blank')}
                    style={{ color: GOTHAM.gold }}
                  >
                    <ExternalLink size={12} />
                  </Button>
                </div>
              </div>
            </div>
          </ScrollArea>
        ) : clientType === 'website' && websiteData ? (
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-4 pr-4">
              {/* Business Name */}
              <div className="space-y-1.5">
                <Label className="text-xs flex items-center gap-1.5" style={{ color: GOTHAM.textMuted }}>
                  <Building2 size={12} /> Nom de l'entreprise
                </Label>
                <Input
                  value={websiteData.form_data?.businessName || websiteData.form_data?.business_name || ''}
                  onChange={(e) => setWebsiteData({
                    ...websiteData,
                    form_data: { ...websiteData.form_data, businessName: e.target.value }
                  })}
                  className="h-9 text-sm"
                  style={inputStyle}
                />
              </div>

              {/* Contact */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs flex items-center gap-1.5" style={{ color: GOTHAM.textMuted }}>
                    <Mail size={12} /> Email
                  </Label>
                  <Input
                    value={websiteData.form_data?.email || ''}
                    onChange={(e) => setWebsiteData({
                      ...websiteData,
                      form_data: { ...websiteData.form_data, email: e.target.value }
                    })}
                    className="h-9 text-sm"
                    style={inputStyle}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs flex items-center gap-1.5" style={{ color: GOTHAM.textMuted }}>
                    <Phone size={12} /> Téléphone
                  </Label>
                  <Input
                    value={websiteData.form_data?.phone || ''}
                    onChange={(e) => setWebsiteData({
                      ...websiteData,
                      form_data: { ...websiteData.form_data, phone: e.target.value }
                    })}
                    className="h-9 text-sm"
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label className="text-xs flex items-center gap-1.5" style={{ color: GOTHAM.textMuted }}>
                  <FileText size={12} /> Description
                </Label>
                <Textarea
                  value={websiteData.form_data?.description || ''}
                  onChange={(e) => setWebsiteData({
                    ...websiteData,
                    form_data: { ...websiteData.form_data, description: e.target.value }
                  })}
                  className="text-sm min-h-[80px]"
                  style={inputStyle}
                />
              </div>

              {/* Admin Notes */}
              <div className="space-y-1.5">
                <Label className="text-xs" style={{ color: GOTHAM.gold }}>
                  Notes admin (internes)
                </Label>
                <Textarea
                  value={websiteData.admin_notes || ''}
                  onChange={(e) => setWebsiteData({ ...websiteData, admin_notes: e.target.value })}
                  className="text-sm min-h-[60px]"
                  style={{ ...inputStyle, borderColor: GOTHAM.gold }}
                  placeholder="Notes internes..."
                />
              </div>

              {/* Status */}
              <div 
                className="flex items-center justify-between p-3 rounded-lg"
                style={{ backgroundColor: GOTHAM.bg }}
              >
                <span className="text-xs" style={{ color: GOTHAM.textMuted }}>Statut</span>
                <span 
                  className="px-2 py-1 rounded text-xs font-medium"
                  style={{ 
                    backgroundColor: websiteData.status === 'completed' ? `${GOTHAM.success}20` : `${GOTHAM.gold}20`,
                    color: websiteData.status === 'completed' ? GOTHAM.success : GOTHAM.gold,
                  }}
                >
                  {websiteData.status}
                </span>
              </div>
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-8" style={{ color: GOTHAM.textMuted }}>
            Données non trouvées
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 justify-end pt-4 border-t" style={{ borderColor: GOTHAM.borderMuted }}>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="border-0"
            style={{ backgroundColor: GOTHAM.bg, color: GOTHAM.textMuted }}
          >
            Annuler
          </Button>
          <Button
            size="sm"
            onClick={clientType === 'card' ? handleSaveCard : handleSaveWebsite}
            disabled={isSaving}
            className="gap-2"
            style={{ backgroundColor: GOTHAM.gold, color: '#000' }}
          >
            {isSaving ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save size={14} />
                Enregistrer
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
