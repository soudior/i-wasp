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
  AlertTriangle,
  Loader2,
  Users,
  Table,
  FileText,
  Copy,
  CheckCircle2,
  Sparkles,
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

// ============= DATA VALIDATION & CLEANING UTILITIES =============

/**
 * Normalize phone number to international format
 * Supports: France (+33), Morocco (+212), international formats
 */
const normalizePhone = (phone: string): { normalized: string; isValid: boolean; warning?: string } => {
  if (!phone || !phone.trim()) return { normalized: '', isValid: true };
  
  // Remove all non-digit characters except +
  let cleaned = phone.replace(/[^\d+]/g, '');
  
  // If starts with 00, replace with +
  if (cleaned.startsWith('00')) {
    cleaned = '+' + cleaned.slice(2);
  }
  
  // Handle French numbers
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    cleaned = '+33' + cleaned.slice(1);
  }
  
  // Handle Moroccan numbers (06, 07, 05)
  if (cleaned.match(/^0[567]\d{8}$/)) {
    cleaned = '+212' + cleaned.slice(1);
  }
  
  // Validate final format
  const isValid = /^\+\d{10,15}$/.test(cleaned) || cleaned === '';
  
  // Detect potential issues
  let warning: string | undefined;
  if (cleaned && !cleaned.startsWith('+')) {
    warning = 'Format international recommandé (+XX...)';
  }
  
  return { normalized: cleaned || phone.trim(), isValid, warning };
};

/**
 * Normalize and validate email
 */
const normalizeEmail = (email: string): { normalized: string; isValid: boolean; suggestions: string[] } => {
  if (!email || !email.trim()) return { normalized: '', isValid: true, suggestions: [] };
  
  let cleaned = email.trim().toLowerCase();
  const suggestions: string[] = [];
  
  // Common typo fixes
  const typoFixes: Record<string, string> = {
    'gmial.com': 'gmail.com',
    'gmal.com': 'gmail.com',
    'gamil.com': 'gmail.com',
    'gnail.com': 'gmail.com',
    'gmail.fr': 'gmail.com',
    'hotmal.com': 'hotmail.com',
    'hotmai.com': 'hotmail.com',
    'hotmial.com': 'hotmail.com',
    'outook.com': 'outlook.com',
    'outlok.com': 'outlook.com',
    'yahooo.com': 'yahoo.com',
    'yaho.com': 'yahoo.com',
    'yahoo.fr': 'yahoo.fr',
  };
  
  // Check for common typos
  const domain = cleaned.split('@')[1];
  if (domain && typoFixes[domain]) {
    const corrected = cleaned.replace(domain, typoFixes[domain]);
    suggestions.push(`Correction suggérée: ${corrected}`);
    cleaned = corrected;
  }
  
  // Validate email format
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isValid = emailRegex.test(cleaned);
  
  return { normalized: cleaned, isValid, suggestions };
};

/**
 * Normalize name (capitalize properly)
 */
const normalizeName = (name: string): string => {
  if (!name || !name.trim()) return '';
  
  return name
    .trim()
    .toLowerCase()
    .split(/[\s-]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(name.includes('-') ? '-' : ' ');
};

/**
 * Normalize company name
 */
const normalizeCompany = (company: string): string => {
  if (!company || !company.trim()) return '';
  
  let cleaned = company.trim();
  
  // Capitalize first letter of each word, preserve acronyms
  cleaned = cleaned
    .split(' ')
    .map(word => {
      // Keep all-caps words (acronyms like SARL, SAS)
      if (word === word.toUpperCase() && word.length <= 5) return word;
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
  
  return cleaned;
};

/**
 * Normalize URL (website, LinkedIn, etc.)
 */
const normalizeUrl = (url: string, type: 'website' | 'linkedin' | 'instagram'): { normalized: string; isValid: boolean } => {
  if (!url || !url.trim()) return { normalized: '', isValid: true };
  
  let cleaned = url.trim();
  
  // Add https:// if missing for website/linkedin
  if (type !== 'instagram' && !cleaned.match(/^https?:\/\//i)) {
    cleaned = 'https://' + cleaned;
  }
  
  // Handle Instagram handles
  if (type === 'instagram') {
    // Remove @ if present
    cleaned = cleaned.replace(/^@/, '');
    // If it's a URL, extract username
    const instaMatch = cleaned.match(/instagram\.com\/([^\/\?]+)/);
    if (instaMatch) {
      cleaned = instaMatch[1];
    }
  }
  
  // Validate LinkedIn URL
  if (type === 'linkedin') {
    const isValid = cleaned.includes('linkedin.com');
    return { normalized: cleaned, isValid };
  }
  
  // Basic URL validation
  try {
    if (type === 'website') {
      new URL(cleaned);
    }
    return { normalized: cleaned, isValid: true };
  } catch {
    return { normalized: cleaned, isValid: false };
  }
};

/**
 * Normalize WhatsApp number
 */
const normalizeWhatsApp = (whatsapp: string): { normalized: string; isValid: boolean } => {
  if (!whatsapp || !whatsapp.trim()) return { normalized: '', isValid: true };
  
  // Use phone normalization
  const { normalized, isValid } = normalizePhone(whatsapp);
  
  // Remove + for WhatsApp (use digits only)
  const whatsappNum = normalized.replace(/^\+/, '');
  
  return { normalized: whatsappNum, isValid };
};

/**
 * Clean and validate a complete row
 */
interface CleanedRow {
  original: any;
  cleaned: any;
  errors: string[];
  warnings: string[];
  corrections: string[];
}

const cleanAndValidateRow = (row: any): CleanedRow => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const corrections: string[] = [];
  const cleaned: any = { ...row };
  
  // Required fields
  if (!row.first_name?.trim()) {
    errors.push('Prénom requis');
  } else {
    const normalizedFirst = normalizeName(row.first_name);
    if (normalizedFirst !== row.first_name.trim()) {
      corrections.push(`Prénom: "${row.first_name}" → "${normalizedFirst}"`);
    }
    cleaned.first_name = normalizedFirst;
  }
  
  if (!row.last_name?.trim()) {
    errors.push('Nom requis');
  } else {
    const normalizedLast = normalizeName(row.last_name);
    if (normalizedLast !== row.last_name.trim()) {
      corrections.push(`Nom: "${row.last_name}" → "${normalizedLast}"`);
    }
    cleaned.last_name = normalizedLast;
  }
  
  // Email
  if (row.email) {
    const { normalized, isValid, suggestions } = normalizeEmail(row.email);
    if (!isValid) {
      errors.push('Email invalide');
    }
    if (normalized !== row.email.trim().toLowerCase()) {
      corrections.push(`Email: "${row.email}" → "${normalized}"`);
    }
    suggestions.forEach(s => warnings.push(s));
    cleaned.email = normalized;
  }
  
  // Phone
  if (row.phone) {
    const { normalized, isValid, warning } = normalizePhone(row.phone);
    if (!isValid) {
      warnings.push('Format téléphone non standard');
    }
    if (warning) warnings.push(warning);
    if (normalized !== row.phone.trim()) {
      corrections.push(`Tél: "${row.phone}" → "${normalized}"`);
    }
    cleaned.phone = normalized;
  }
  
  // WhatsApp
  if (row.whatsapp) {
    const { normalized, isValid } = normalizeWhatsApp(row.whatsapp);
    if (!isValid) {
      warnings.push('Format WhatsApp non standard');
    }
    if (normalized !== row.whatsapp.trim().replace(/^\+/, '')) {
      corrections.push(`WhatsApp: "${row.whatsapp}" → "${normalized}"`);
    }
    cleaned.whatsapp = normalized;
  }
  
  // Company
  if (row.company) {
    const normalizedCompany = normalizeCompany(row.company);
    if (normalizedCompany !== row.company.trim()) {
      corrections.push(`Entreprise: "${row.company}" → "${normalizedCompany}"`);
    }
    cleaned.company = normalizedCompany;
  }
  
  // Website
  if (row.website) {
    const { normalized, isValid } = normalizeUrl(row.website, 'website');
    if (!isValid) {
      warnings.push('URL site web invalide');
    }
    if (normalized !== row.website.trim()) {
      corrections.push(`Site: "${row.website}" → "${normalized}"`);
    }
    cleaned.website = normalized;
  }
  
  // LinkedIn
  if (row.linkedin) {
    const { normalized, isValid } = normalizeUrl(row.linkedin, 'linkedin');
    if (!isValid) {
      warnings.push('URL LinkedIn invalide');
    }
    if (normalized !== row.linkedin.trim()) {
      corrections.push(`LinkedIn: "${row.linkedin}" → "${normalized}"`);
    }
    cleaned.linkedin = normalized;
  }
  
  // Instagram
  if (row.instagram) {
    const { normalized } = normalizeUrl(row.instagram, 'instagram');
    if (normalized !== row.instagram.trim().replace(/^@/, '')) {
      corrections.push(`Instagram: "${row.instagram}" → "@${normalized}"`);
    }
    cleaned.instagram = normalized;
  }
  
  // Title (capitalize)
  if (row.title) {
    const normalizedTitle = row.title.trim().charAt(0).toUpperCase() + row.title.trim().slice(1);
    cleaned.title = normalizedTitle;
  }
  
  // Location (capitalize)
  if (row.location) {
    cleaned.location = normalizeName(row.location);
  }
  
  // Tagline (trim only)
  if (row.tagline) {
    cleaned.tagline = row.tagline.trim();
  }
  
  return { original: row, cleaned, errors, warnings, corrections };
};

interface ImportPreview {
  valid: CleanedRow[];
  invalid: CleanedRow[];
  headers: string[];
  totalCorrections: number;
  totalWarnings: number;
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

      // Clean and validate all rows
      const valid: CleanedRow[] = [];
      const invalid: CleanedRow[] = [];
      let totalCorrections = 0;
      let totalWarnings = 0;

      rows.forEach((row, index) => {
        const cleanedRow = cleanAndValidateRow(row);
        // Add row number for reference
        (cleanedRow as any).rowNumber = index + 2;
        
        totalCorrections += cleanedRow.corrections.length;
        totalWarnings += cleanedRow.warnings.length;

        if (cleanedRow.errors.length > 0) {
          invalid.push(cleanedRow);
        } else {
          valid.push(cleanedRow);
        }
      });

      setImportPreview({ valid, invalid, headers, totalCorrections, totalWarnings });
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

      // Prepare cards data using cleaned data
      const cardsToInsert = importPreview.valid.map(item => ({
        user_id: user.id,
        first_name: item.cleaned.first_name || '',
        last_name: item.cleaned.last_name || '',
        email: item.cleaned.email || null,
        phone: item.cleaned.phone || null,
        company: item.cleaned.company || null,
        title: item.cleaned.title || null,
        linkedin: item.cleaned.linkedin || null,
        whatsapp: item.cleaned.whatsapp || null,
        instagram: item.cleaned.instagram || null,
        website: item.cleaned.website || null,
        location: item.cleaned.location || null,
        tagline: item.cleaned.tagline || null,
        slug: `${(item.cleaned.first_name || '').toLowerCase()}-${(item.cleaned.last_name || '').toLowerCase()}-${Date.now().toString(36)}`.replace(/\s+/g, '-'),
        template: 'default',
      }));

      const { data, error } = await supabase
        .from('digital_cards')
        .insert(cardsToInsert)
        .select();

      if (error) throw error;

      toast.success(`${data.length} cartes importées avec succès (${importPreview.totalCorrections} corrections appliquées)`);
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
              <div className="flex gap-4 flex-wrap">
                <div 
                  className="flex-1 min-w-[140px] p-3 rounded-lg"
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
                    className="flex-1 min-w-[140px] p-3 rounded-lg"
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
                {importPreview.totalCorrections > 0 && (
                  <div 
                    className="flex-1 min-w-[140px] p-3 rounded-lg"
                    style={{ backgroundColor: `${GOTHAM.info}20` }}
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} style={{ color: GOTHAM.info }} />
                      <span className="text-sm font-medium" style={{ color: GOTHAM.info }}>
                        {importPreview.totalCorrections} corrections auto
                      </span>
                    </div>
                  </div>
                )}
                {importPreview.totalWarnings > 0 && (
                  <div 
                    className="flex-1 min-w-[140px] p-3 rounded-lg"
                    style={{ backgroundColor: `${GOTHAM.warning}20` }}
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={16} style={{ color: GOTHAM.warning }} />
                      <span className="text-sm font-medium" style={{ color: GOTHAM.warning }}>
                        {importPreview.totalWarnings} avertissements
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Valid Preview with corrections */}
              {importPreview.valid.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium" style={{ color: GOTHAM.text }}>
                    Aperçu des données nettoyées
                  </p>
                  <ScrollArea className="h-[200px] rounded-lg border" style={{ borderColor: GOTHAM.borderMuted }}>
                    <table className="w-full text-xs">
                      <thead style={{ backgroundColor: GOTHAM.bg }}>
                        <tr>
                          <th className="p-2 text-left" style={{ color: GOTHAM.textMuted }}>Prénom</th>
                          <th className="p-2 text-left" style={{ color: GOTHAM.textMuted }}>Nom</th>
                          <th className="p-2 text-left" style={{ color: GOTHAM.textMuted }}>Email</th>
                          <th className="p-2 text-left" style={{ color: GOTHAM.textMuted }}>Téléphone</th>
                          <th className="p-2 text-left" style={{ color: GOTHAM.textMuted }}>Corrections</th>
                        </tr>
                      </thead>
                      <tbody>
                        {importPreview.valid.slice(0, 10).map((item, i) => (
                          <tr key={i} style={{ borderBottom: `1px solid ${GOTHAM.borderMuted}` }}>
                            <td className="p-2" style={{ color: GOTHAM.text }}>{item.cleaned.first_name}</td>
                            <td className="p-2" style={{ color: GOTHAM.text }}>{item.cleaned.last_name}</td>
                            <td className="p-2" style={{ color: GOTHAM.textMuted }}>{item.cleaned.email || '-'}</td>
                            <td className="p-2" style={{ color: GOTHAM.textMuted }}>{item.cleaned.phone || '-'}</td>
                            <td className="p-2">
                              {item.corrections.length > 0 ? (
                                <span 
                                  className="px-1.5 py-0.5 rounded text-[10px]"
                                  style={{ backgroundColor: `${GOTHAM.info}20`, color: GOTHAM.info }}
                                  title={item.corrections.join('\n')}
                                >
                                  {item.corrections.length} fix
                                </span>
                              ) : (
                                <span style={{ color: GOTHAM.textMuted }}>-</span>
                              )}
                            </td>
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
                  
                  {/* Corrections detail */}
                  {importPreview.totalCorrections > 0 && (
                    <div 
                      className="p-3 rounded-lg text-xs space-y-1"
                      style={{ backgroundColor: `${GOTHAM.info}10` }}
                    >
                      <p className="font-medium" style={{ color: GOTHAM.info }}>
                        ✨ Corrections automatiques appliquées:
                      </p>
                      <ul className="space-y-0.5 max-h-[80px] overflow-y-auto" style={{ color: GOTHAM.textMuted }}>
                        {importPreview.valid
                          .flatMap(item => item.corrections)
                          .slice(0, 8)
                          .map((correction, i) => (
                            <li key={i}>• {correction}</li>
                          ))}
                        {importPreview.totalCorrections > 8 && (
                          <li style={{ color: GOTHAM.info }}>
                            ... et {importPreview.totalCorrections - 8} autres corrections
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
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
                            Ligne {(item as any).rowNumber || i + 2}:
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
