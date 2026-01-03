/**
 * Gold Leads CRM Panel - La Machine à Fructifier
 * Glassmorphism table with gold accents
 * Excel export + status management
 */

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Users,
  Download,
  FileSpreadsheet,
  Search,
  Mail,
  Phone,
  Calendar,
  MoreVertical,
  MessageCircle,
  CheckCircle,
  Archive,
  Crown,
  Sparkles,
  Zap,
  ArrowUpRight,
} from "lucide-react";
import type { LeadWithCard } from "@/hooks/useLeads";

interface GoldLeadsCRMProps {
  leads: LeadWithCard[];
  onStatusChange?: (leadId: string, status: string) => void;
}

export function GoldLeadsCRM({ leads, onStatusChange }: GoldLeadsCRMProps) {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter leads
  const filteredLeads = useMemo(() => {
    if (!searchQuery) return leads.slice(0, 10);
    
    const query = searchQuery.toLowerCase();
    return leads.filter(lead => 
      lead.name?.toLowerCase().includes(query) ||
      lead.email?.toLowerCase().includes(query) ||
      lead.phone?.includes(query)
    ).slice(0, 10);
  }, [leads, searchQuery]);

  // Stats
  const stats = useMemo(() => ({
    total: leads.length,
    hot: leads.filter(l => l.lead_score >= 51).length,
    thisWeek: leads.filter(l => {
      const date = new Date(l.created_at);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return date >= weekAgo;
    }).length,
  }), [leads]);

  // Export to Excel
  const handleExportExcel = () => {
    if (leads.length === 0) {
      toast.error("Aucun lead à exporter");
      return;
    }

    const BOM = "\uFEFF";
    const headers = ["Nom", "Email", "Téléphone", "Score", "Statut", "Date", "Lead Chaud"];
    const rows = leads.map(lead => [
      lead.name || "",
      lead.email || "",
      lead.phone || "",
      lead.lead_score.toString(),
      lead.status === "new" ? "Nouveau" : lead.status === "contacted" ? "Contacté" : lead.status === "converted" ? "Converti" : "Archivé",
      format(new Date(lead.created_at), "dd/MM/yyyy HH:mm"),
      lead.lead_score >= 50 ? "🔥 OUI" : "NON",
    ]);

    const tsvContent = BOM + [
      headers.join("\t"),
      ...rows.map(row => row.map(cell => `${cell.replace(/\t/g, ' ')}`).join("\t"))
    ].join("\n");

    const blob = new Blob([tsvContent], { type: "application/vnd.ms-excel;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `iwasp-leads-gold-${format(new Date(), "yyyy-MM-dd")}.xls`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast.success(`${leads.length} leads exportés en Excel`);
  };

  const getStatusBadge = (status: string, score: number) => {
    if (score >= 51) {
      return (
        <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-black border-0 gap-1">
          <Zap className="h-3 w-3" />
          Chaud
        </Badge>
      );
    }
    
    switch (status) {
      case "new":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Nouveau</Badge>;
      case "contacted":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Contacté</Badge>;
      case "converted":
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Converti</Badge>;
      default:
        return <Badge variant="secondary">Archivé</Badge>;
    }
  };

  return (
    <Card className="relative overflow-hidden card-glass border-amber-500/20 backdrop-blur-xl">
      {/* Gold accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600" />

      {/* Header */}
      <div className="p-6 pb-4 border-b border-border/50">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
                Leads & CRM
                <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-black border-0 text-[10px]">
                  <Crown className="h-3 w-3 mr-0.5" />
                  GOLD
                </Badge>
              </h3>
              <p className="text-sm text-muted-foreground">La Machine à Fructifier</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick stats */}
            <div className="hidden md:flex items-center gap-4 mr-4">
              <div className="text-center">
                <p className="text-lg font-bold text-foreground">{stats.total}</p>
                <p className="text-[10px] text-muted-foreground">Total</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-amber-500">{stats.hot}</p>
                <p className="text-[10px] text-muted-foreground">Chauds</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-emerald-500">{stats.thisWeek}</p>
                <p className="text-[10px] text-muted-foreground">Cette semaine</p>
              </div>
            </div>

            <Button
              onClick={handleExportExcel}
              disabled={leads.length === 0}
              className="gap-2 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-black font-semibold"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Exporter Excel
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mt-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un lead..."
            className="pl-11 bg-secondary/50 border-amber-500/20 focus:border-amber-500/50"
          />
        </div>
      </div>

      <CardContent className="p-0">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50 bg-secondary/20">
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contact</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Téléphone</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Statut</th>
                <th className="text-right p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-2xl bg-secondary/50 flex items-center justify-center mb-3">
                        <Users className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground">
                        {searchQuery ? "Aucun lead trouvé" : "Aucun lead pour le moment"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead, index) => (
                  <motion.tr
                    key={lead.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-border/30 hover:bg-amber-500/5 transition-colors group"
                  >
                    {/* Contact */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          lead.lead_score >= 51 
                            ? "bg-gradient-to-br from-amber-400/30 to-amber-600/20" 
                            : "bg-secondary/50"
                        }`}>
                          <span className={`text-sm font-bold ${
                            lead.lead_score >= 51 ? "text-amber-500" : "text-foreground"
                          }`}>
                            {lead.name?.charAt(0)?.toUpperCase() || "?"}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{lead.name || "—"}</p>
                          <p className="text-xs text-muted-foreground">{lead.lead_score} pts</p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="p-4">
                      {lead.email ? (
                        <a 
                          href={`mailto:${lead.email}`}
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-amber-500 transition-colors"
                        >
                          <Mail className="h-4 w-4" />
                          <span className="truncate max-w-[150px]">{lead.email}</span>
                        </a>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>

                    {/* Phone */}
                    <td className="p-4 hidden md:table-cell">
                      {lead.phone ? (
                        <a 
                          href={`tel:${lead.phone}`}
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-amber-500 transition-colors"
                        >
                          <Phone className="h-4 w-4" />
                          {lead.phone}
                        </a>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(lead.created_at), "dd/MM/yy", { locale: fr })}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      {getStatusBadge(lead.status || "new", lead.lead_score)}
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur-xl border-border/50">
                          <DropdownMenuItem onClick={() => onStatusChange?.(lead.id, "contacted")}>
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Marquer contacté
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onStatusChange?.(lead.id, "converted")}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Marquer converti
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onStatusChange?.(lead.id, "archived")}>
                            <Archive className="h-4 w-4 mr-2" />
                            Archiver
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer with AI insight */}
        {leads.length > 0 && (
          <div className="p-4 border-t border-border/50 bg-gradient-to-r from-amber-500/5 to-transparent">
            <div className="flex items-center gap-3">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <p className="text-xs text-muted-foreground">
                <span className="text-amber-500 font-medium">{stats.hot} leads chauds</span> prêts à être convertis. 
                Contactez-les rapidement !
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
