/**
 * Client Data Export/Import System - GOTHAM Style
 * Export clients to CSV/Excel, import from CSV, download template
 */

import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Upload,
  FileSpreadsheet,
  FileDown,
  FileUp,
  Check,
  X,
  AlertCircle,
  Loader2,
  Users,
  Table,
  FileText,
  Copy,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
  warning: '#F59E0B',
  danger: '#EF4444',
  purple: '#A855F7',
};

// CSV Template columns
const TEMPLATE_COLUMNS = [
  { key: 'first_name', label: 'Prénom', required: true, example: 'Jean' },
  { key: 'last_name', label: 'Nom', required: true, example: 'Dupont' },
  { key: 'email', label: 'Email', required: false, example: 'jean.dupont@email.com' },
  { key: 'phone', label: 'Téléphone', required: false, example: '+33612345678' },
  { key: 'company', label: 'Entreprise', required: false, example: 'Ma Société' },
  { key: 'title', label: 'Poste', required: false, example: 'Directeur' },
  { key: 'linkedin', label: 'LinkedIn', required: false, example: 'https://linkedin.com/in/jeandupont' },
  { key: 'whatsapp', label: 'WhatsApp', required: false, example: '+33612345678' },
  { key: 'instagram', label: 'Instagram', required: false, example: '@jeandupont' },
  { key: 'website', label: 'Site Web', required: false, example: 'https://monsiteweb.com' },
  { key: 'location', label: 'Ville', required: false, example: 'Paris' },
  { key: 'tagline', label: 'Slogan', required: false, example: 'Expert en innovation' },
];

interface ImportPreview {
  valid: any[];
  invalid: { row: number; data: any; errors: string[] }[];
  headers: string[];
}

export function ClientDataExportImport() {
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importPreview, setImportPreview] = useState<ImportPreview | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  // Fetch all exportable data
  const { data: exportData, isLoading: isLoadingExport } = useQuery({
    queryKey: ['export-clients-data'],
    queryFn: async () => {
      const [cardsRes, leadsRes, ordersRes, proposalsRes] = await Promise.all([
        supabase.from('digital_cards').select('*').order('created_at', { ascending: false }),
        supabase.from('leads').select('*').order('created_at', { ascending: false }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('website_proposals').select('*').order('created_at', { ascending: false }),
      ]);

      return {
        cards: cardsRes.data || [],
        leads: leadsRes.data || [],
        orders: ordersRes.data || [],
        proposals: proposalsRes.data || [],
      };
    },
  });

  // Generate CSV content
  const generateCSV = (data: any[], columns: { key: string; label: string }[]) => {
    const header = columns.map(c => c.label).join(',');
    const rows = data.map(item => 
      columns.map(c => {
        const value = item[c.key];
        if (value === null || value === undefined) return '';
        // Escape quotes and wrap in quotes if contains comma
        const strValue = String(value);
        if (strValue.includes(',') || strValue.includes('"') || strValue.includes('\n')) {
          return `"${strValue.replace(/"/g, '""')}"`;
        }
        return strValue;
      }).join(',')
    );
    return [header, ...rows].join('\n');
  };

  // Export all cards
  const handleExportCards = () => {
    if (!exportData?.cards.length) {
      toast.error('Aucune carte à exporter');
      return;
    }

    const columns = [
      { key: 'first_name', label: 'Prénom' },
      { key: 'last_name', label: 'Nom' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Téléphone' },
      { key: 'company', label: 'Entreprise' },
      { key: 'title', label: 'Poste' },
      { key: 'slug', label: 'Slug' },
      { key: 'linkedin', label: 'LinkedIn' },
      { key: 'whatsapp', label: 'WhatsApp' },
      { key: 'instagram', label: 'Instagram' },
      { key: 'website', label: 'Site Web' },
      { key: 'location', label: 'Ville' },
      { key: 'tagline', label: 'Slogan' },
      { key: 'view_count', label: 'Vues' },
      { key: 'created_at', label: 'Créé le' },
    ];

    const csv = generateCSV(exportData.cards, columns);
    downloadFile(csv, `iwasp-cartes-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
    toast.success(`${exportData.cards.length} cartes exportées`);
  };

  // Export all leads
  const handleExportLeads = () => {
    if (!exportData?.leads.length) {
      toast.error('Aucun lead à exporter');
      return;
    }

    const columns = [
      { key: 'name', label: 'Nom' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Téléphone' },
      { key: 'company', label: 'Entreprise' },
      { key: 'message', label: 'Message' },
      { key: 'source', label: 'Source' },
      { key: 'status', label: 'Statut' },
      { key: 'lead_score', label: 'Score' },
      { key: 'location_city', label: 'Ville' },
      { key: 'location_country', label: 'Pays' },
      { key: 'consent_given', label: 'Consentement' },
      { key: 'created_at', label: 'Créé le' },
    ];

    const csv = generateCSV(exportData.leads, columns);
    downloadFile(csv, `iwasp-leads-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
    toast.success(`${exportData.leads.length} leads exportés`);
  };

  // Export all orders
  const handleExportOrders = () => {
    if (!exportData?.orders.length) {
      toast.error('Aucune commande à exporter');
      return;
    }

    const columns = [
      { key: 'order_number', label: 'N° Commande' },
      { key: 'shipping_name', label: 'Nom Client' },
      { key: 'customer_email', label: 'Email' },
      { key: 'shipping_phone', label: 'Téléphone' },
      { key: 'shipping_address', label: 'Adresse' },
      { key: 'shipping_city', label: 'Ville' },
      { key: 'shipping_country', label: 'Pays' },
      { key: 'status', label: 'Statut' },
      { key: 'total_price_cents', label: 'Total (centimes)' },
      { key: 'currency', label: 'Devise' },
      { key: 'payment_method', label: 'Paiement' },
      { key: 'created_at', label: 'Créé le' },
    ];

    const csv = generateCSV(exportData.orders, columns);
    downloadFile(csv, `iwasp-commandes-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
    toast.success(`${exportData.orders.length} commandes exportées`);
  };

  // Export everything
  const handleExportAll = () => {
    handleExportCards();
    setTimeout(() => handleExportLeads(), 500);
    setTimeout(() => handleExportOrders(), 1000);
  };

  // Download template
  const handleDownloadTemplate = () => {
    const header = TEMPLATE_COLUMNS.map(c => c.label).join(',');
    const exampleRow = TEMPLATE_COLUMNS.map(c => c.example).join(',');
    const csv = `${header}\n${exampleRow}\n`;
    downloadFile(csv, 'iwasp-template-import-clients.csv', 'text/csv');
    toast.success('Template téléchargé');
  };

  // Copy template structure
  const handleCopyTemplate = () => {
    const template = TEMPLATE_COLUMNS.map(c => `${c.label}${c.required ? '*' : ''}`).join('\t');
    navigator.clipboard.writeText(template);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
    toast.success('Structure copiée dans le presse-papier');
  };

  // Download file utility
  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob(['\ufeff' + content], { type: `${mimeType};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Parse CSV file
  const parseCSV = (text: string): { headers: string[]; rows: any[] } => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length === 0) return { headers: [], rows: [] };

    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    const rows = lines.slice(1).map(line => {
      const values: string[] = [];
      let current = '';
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          if (inQuotes && line[i + 1] === '"') {
            current += '"';
            i++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim());

      const row: any = {};
      headers.forEach((header, index) => {
        // Map French labels to keys
        const col = TEMPLATE_COLUMNS.find(c => c.label.toLowerCase() === header.toLowerCase());
        const key = col?.key || header.toLowerCase().replace(/\s+/g, '_');
        row[key] = values[index] || '';
      });
      return row;
    });

    return { headers, rows };
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const { headers, rows } = parseCSV(text);

      // Validate rows
      const valid: any[] = [];
      const invalid: { row: number; data: any; errors: string[] }[] = [];

      rows.forEach((row, index) => {
        const errors: string[] = [];

        // Check required fields
        if (!row.first_name?.trim()) errors.push('Prénom requis');
        if (!row.last_name?.trim()) errors.push('Nom requis');

        // Validate email format if provided
        if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
          errors.push('Email invalide');
        }

        if (errors.length > 0) {
          invalid.push({ row: index + 2, data: row, errors });
        } else {
          valid.push(row);
        }
      });

      setImportPreview({ valid, invalid, headers });
      setShowImportDialog(true);
    };
    reader.readAsText(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Import valid rows
  const handleImport = async () => {
    if (!importPreview?.valid.length) {
      toast.error('Aucune donnée valide à importer');
      return;
    }

    setIsImporting(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      // Prepare cards data
      const cardsToInsert = importPreview.valid.map(row => ({
        user_id: user.id,
        first_name: row.first_name.trim(),
        last_name: row.last_name.trim(),
        email: row.email?.trim() || null,
        phone: row.phone?.trim() || null,
        company: row.company?.trim() || null,
        title: row.title?.trim() || null,
        linkedin: row.linkedin?.trim() || null,
        whatsapp: row.whatsapp?.trim() || null,
        instagram: row.instagram?.trim() || null,
        website: row.website?.trim() || null,
        location: row.location?.trim() || null,
        tagline: row.tagline?.trim() || null,
        slug: `${row.first_name.toLowerCase().trim()}-${row.last_name.toLowerCase().trim()}-${Date.now().toString(36)}`.replace(/\s+/g, '-'),
        template: 'default',
      }));

      const { data, error } = await supabase
        .from('digital_cards')
        .insert(cardsToInsert)
        .select();

      if (error) throw error;

      toast.success(`${data.length} cartes importées avec succès`);
      queryClient.invalidateQueries({ queryKey: ['all-clients-unified'] });
      queryClient.invalidateQueries({ queryKey: ['export-clients-data'] });
      setShowImportDialog(false);
      setImportPreview(null);
    } catch (error: any) {
      console.error('Import error:', error);
      toast.error(`Erreur d'import: ${error.message}`);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <>
      <Card 
        className="border"
        style={{ backgroundColor: GOTHAM.surface, borderColor: GOTHAM.borderMuted }}
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2" style={{ color: GOTHAM.textMuted }}>
            <FileSpreadsheet size={16} style={{ color: GOTHAM.gold }} />
            Export / Import Données
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Export Section */}
          <div className="space-y-2">
            <p className="text-xs font-medium" style={{ color: GOTHAM.text }}>
              Exporter les données
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCards}
                disabled={isLoadingExport || !exportData?.cards.length}
                className="gap-2 text-xs border-0"
                style={{ backgroundColor: GOTHAM.bg, color: GOTHAM.text }}
              >
                <Download size={14} />
                Cartes ({exportData?.cards.length || 0})
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportLeads}
                disabled={isLoadingExport || !exportData?.leads.length}
                className="gap-2 text-xs border-0"
                style={{ backgroundColor: GOTHAM.bg, color: GOTHAM.text }}
              >
                <Download size={14} />
                Leads ({exportData?.leads.length || 0})
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportOrders}
                disabled={isLoadingExport || !exportData?.orders.length}
                className="gap-2 text-xs border-0"
                style={{ backgroundColor: GOTHAM.bg, color: GOTHAM.text }}
              >
                <Download size={14} />
                Commandes ({exportData?.orders.length || 0})
              </Button>
              <Button
                size="sm"
                onClick={handleExportAll}
                disabled={isLoadingExport}
                className="gap-2 text-xs"
                style={{ backgroundColor: GOTHAM.gold, color: '#000' }}
              >
                <FileDown size={14} />
                Tout exporter
              </Button>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t" style={{ borderColor: GOTHAM.borderMuted }} />

          {/* Import Section */}
          <div className="space-y-2">
            <p className="text-xs font-medium" style={{ color: GOTHAM.text }}>
              Importer des clients
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadTemplate}
                className="gap-2 text-xs border-0"
                style={{ backgroundColor: GOTHAM.bg, color: GOTHAM.gold }}
              >
                <FileText size={14} />
                Template CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyTemplate}
                className="gap-2 text-xs border-0"
                style={{ backgroundColor: GOTHAM.bg, color: GOTHAM.text }}
              >
                {copiedTemplate ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                {copiedTemplate ? 'Copié!' : 'Copier structure'}
              </Button>
            </div>
            
            <input
              type="file"
              accept=".csv,.txt"
              onChange={handleFileUpload}
              ref={fileInputRef}
              className="hidden"
            />
            <Button
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="w-full gap-2 text-xs"
              style={{ backgroundColor: GOTHAM.purple, color: '#fff' }}
            >
              <Upload size={14} />
              Importer un fichier CSV
            </Button>
          </div>

          {/* Template Info */}
          <div 
            className="p-3 rounded-lg text-xs space-y-2"
            style={{ backgroundColor: GOTHAM.bg }}
          >
            <p className="font-medium" style={{ color: GOTHAM.gold }}>
              📋 Format du template
            </p>
            <div className="space-y-1" style={{ color: GOTHAM.textMuted }}>
              <p><span style={{ color: GOTHAM.text }}>Champs requis*:</span> Prénom, Nom</p>
              <p><span style={{ color: GOTHAM.text }}>Optionnels:</span> Email, Téléphone, Entreprise, Poste, LinkedIn, WhatsApp, Instagram, Site Web, Ville, Slogan</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Import Preview Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent 
          className="max-w-2xl border"
          style={{ backgroundColor: GOTHAM.surface, borderColor: GOTHAM.border }}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2" style={{ color: GOTHAM.text }}>
              <FileUp size={20} style={{ color: GOTHAM.gold }} />
              Prévisualisation de l'import
            </DialogTitle>
            <DialogDescription style={{ color: GOTHAM.textMuted }}>
              Vérifiez les données avant de confirmer l'import
            </DialogDescription>
          </DialogHeader>

          {importPreview && (
            <div className="space-y-4">
              {/* Summary */}
              <div className="flex gap-4">
                <div 
                  className="flex-1 p-3 rounded-lg"
                  style={{ backgroundColor: `${GOTHAM.success}20` }}
                >
                  <div className="flex items-center gap-2">
                    <Check size={16} style={{ color: GOTHAM.success }} />
                    <span className="text-sm font-medium" style={{ color: GOTHAM.success }}>
                      {importPreview.valid.length} lignes valides
                    </span>
                  </div>
                </div>
                {importPreview.invalid.length > 0 && (
                  <div 
                    className="flex-1 p-3 rounded-lg"
                    style={{ backgroundColor: `${GOTHAM.danger}20` }}
                  >
                    <div className="flex items-center gap-2">
                      <AlertCircle size={16} style={{ color: GOTHAM.danger }} />
                      <span className="text-sm font-medium" style={{ color: GOTHAM.danger }}>
                        {importPreview.invalid.length} lignes invalides
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Valid Preview */}
              {importPreview.valid.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium" style={{ color: GOTHAM.text }}>
                    Aperçu des données valides
                  </p>
                  <ScrollArea className="h-[200px] rounded-lg border" style={{ borderColor: GOTHAM.borderMuted }}>
                    <table className="w-full text-xs">
                      <thead style={{ backgroundColor: GOTHAM.bg }}>
                        <tr>
                          <th className="p-2 text-left" style={{ color: GOTHAM.textMuted }}>Prénom</th>
                          <th className="p-2 text-left" style={{ color: GOTHAM.textMuted }}>Nom</th>
                          <th className="p-2 text-left" style={{ color: GOTHAM.textMuted }}>Email</th>
                          <th className="p-2 text-left" style={{ color: GOTHAM.textMuted }}>Téléphone</th>
                          <th className="p-2 text-left" style={{ color: GOTHAM.textMuted }}>Entreprise</th>
                        </tr>
                      </thead>
                      <tbody>
                        {importPreview.valid.slice(0, 10).map((row, i) => (
                          <tr key={i} style={{ borderBottom: `1px solid ${GOTHAM.borderMuted}` }}>
                            <td className="p-2" style={{ color: GOTHAM.text }}>{row.first_name}</td>
                            <td className="p-2" style={{ color: GOTHAM.text }}>{row.last_name}</td>
                            <td className="p-2" style={{ color: GOTHAM.textMuted }}>{row.email || '-'}</td>
                            <td className="p-2" style={{ color: GOTHAM.textMuted }}>{row.phone || '-'}</td>
                            <td className="p-2" style={{ color: GOTHAM.textMuted }}>{row.company || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {importPreview.valid.length > 10 && (
                      <p className="p-2 text-center text-xs" style={{ color: GOTHAM.textMuted }}>
                        ... et {importPreview.valid.length - 10} autres lignes
                      </p>
                    )}
                  </ScrollArea>
                </div>
              )}

              {/* Invalid Preview */}
              {importPreview.invalid.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium" style={{ color: GOTHAM.danger }}>
                    Lignes avec erreurs (seront ignorées)
                  </p>
                  <ScrollArea className="h-[120px] rounded-lg border" style={{ borderColor: `${GOTHAM.danger}40` }}>
                    <div className="space-y-1 p-2">
                      {importPreview.invalid.map((item, i) => (
                        <div 
                          key={i}
                          className="flex items-start gap-2 p-2 rounded"
                          style={{ backgroundColor: `${GOTHAM.danger}10` }}
                        >
                          <span className="text-xs font-mono" style={{ color: GOTHAM.danger }}>
                            Ligne {item.row}:
                          </span>
                          <span className="text-xs" style={{ color: GOTHAM.textMuted }}>
                            {item.errors.join(', ')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 justify-end pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowImportDialog(false);
                    setImportPreview(null);
                  }}
                  className="border-0"
                  style={{ backgroundColor: GOTHAM.bg, color: GOTHAM.textMuted }}
                >
                  Annuler
                </Button>
                <Button
                  size="sm"
                  onClick={handleImport}
                  disabled={!importPreview.valid.length || isImporting}
                  className="gap-2"
                  style={{ backgroundColor: GOTHAM.gold, color: '#000' }}
                >
                  {isImporting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Import en cours...
                    </>
                  ) : (
                    <>
                      <Check size={14} />
                      Importer {importPreview.valid.length} cartes
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
