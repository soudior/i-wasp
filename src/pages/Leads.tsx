/**
 * IWASP Leads Dashboard
 * Premium lead management interface
 * Apple-level design, full export capabilities
 */

import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useLeads, type LeadWithCard } from "@/hooks/useLeads";
import { useCards } from "@/hooks/useCards";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { 
  Users, Download, Search, Phone, Mail, Building2,
  Calendar, CreditCard, ArrowLeft, Filter, X, ExternalLink
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const Leads = () => {
  const { data: leads = [], isLoading } = useLeads();
  const { data: cards = [] } = useCards();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCardId, setSelectedCardId] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<LeadWithCard | null>(null);

  // Filter leads
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      // Card filter
      if (selectedCardId !== "all" && lead.card_id !== selectedCardId) {
        return false;
      }
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          lead.name?.toLowerCase().includes(query) ||
          lead.email?.toLowerCase().includes(query) ||
          lead.phone?.includes(query) ||
          lead.company?.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
  }, [leads, selectedCardId, searchQuery]);

  // Stats
  const stats = useMemo(() => {
    const total = leads.length;
    const thisMonth = leads.filter(l => {
      const date = new Date(l.created_at);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length;
    const withEmail = leads.filter(l => l.email).length;
    const withPhone = leads.filter(l => l.phone).length;
    
    return { total, thisMonth, withEmail, withPhone };
  }, [leads]);

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredLeads.length === 0) {
      toast.error("Aucun lead à exporter");
      return;
    }

    const headers = ["Nom", "Email", "Téléphone", "Société", "Carte", "Date"];
    const rows = filteredLeads.map(lead => [
      lead.name || "",
      lead.email || "",
      lead.phone || "",
      lead.company || "",
      `${lead.digital_cards?.first_name || ""} ${lead.digital_cards?.last_name || ""}`,
      format(new Date(lead.created_at), "dd/MM/yyyy HH:mm"),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `iwasp-leads-${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast.success(`${filteredLeads.length} leads exportés`);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCardId("all");
  };

  const hasActiveFilters = searchQuery || selectedCardId !== "all";

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-20 left-1/4 w-[600px] h-[600px] orb opacity-20 animate-pulse-glow" />
      <div className="noise" />
      
      <Navbar />
      
      <main className="relative z-10 pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="flex flex-col gap-6 mb-8 animate-fade-up">
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ArrowLeft size={20} />
                </Button>
              </Link>
              <div className="flex-1">
                <h1 className="font-display text-3xl md:text-4xl font-bold">
                  Leads
                </h1>
                <p className="text-muted-foreground mt-1">
                  Gérez vos contacts capturés
                </p>
              </div>
              <Button 
                variant="chrome" 
                onClick={handleExportCSV}
                disabled={filteredLeads.length === 0}
              >
                <Download size={18} />
                Exporter CSV
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total leads", value: stats.total, icon: Users },
              { label: "Ce mois", value: stats.thisMonth, icon: Calendar },
              { label: "Avec email", value: stats.withEmail, icon: Mail },
              { label: "Avec téléphone", value: stats.withPhone, icon: Phone },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="animate-fade-up"
                style={{ animationDelay: `${0.1 + index * 0.05}s` }}
              >
                <Card variant="premium" className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-foreground/10 flex items-center justify-center">
                      <stat.icon size={20} className="text-chrome" />
                    </div>
                  </div>
                  <p className="font-display text-2xl font-bold text-foreground mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </Card>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un lead..."
                className="pl-12 h-12 bg-secondary/50 border-0 rounded-xl"
              />
            </div>
            
            <Select value={selectedCardId} onValueChange={setSelectedCardId}>
              <SelectTrigger className="w-full md:w-[200px] h-12 bg-secondary/50 border-0 rounded-xl">
                <CreditCard size={16} className="mr-2 text-muted-foreground" />
                <SelectValue placeholder="Toutes les cartes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les cartes</SelectItem>
                {cards.map(card => (
                  <SelectItem key={card.id} value={card.id}>
                    {card.first_name} {card.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="h-12 rounded-xl gap-2"
              >
                <X size={16} />
                Effacer
              </Button>
            )}
          </div>

          {/* Leads List */}
          <div className="animate-fade-up" style={{ animationDelay: '0.3s' }}>
            {isLoading ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 rounded-full border-2 border-foreground/20 border-t-foreground animate-spin" />
              </div>
            ) : filteredLeads.length === 0 ? (
              <Card variant="premium" className="p-12 text-center">
                <Users size={48} className="mx-auto mb-4 text-muted-foreground/30" />
                <h3 className="font-display text-lg font-medium text-foreground mb-2">
                  {hasActiveFilters ? "Aucun résultat" : "Aucun lead capturé"}
                </h3>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                  {hasActiveFilters 
                    ? "Essayez de modifier vos filtres"
                    : "Partagez votre carte NFC pour commencer à capturer des leads qualifiés."
                  }
                </p>
              </Card>
            ) : (
              <Card variant="premium" className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-secondary/30">
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Contact</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Société</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">Carte</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                        <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLeads.map((lead) => (
                        <tr 
                          key={lead.id} 
                          className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors cursor-pointer"
                          onClick={() => setSelectedLead(lead)}
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center flex-shrink-0">
                                <span className="text-sm font-medium text-foreground">
                                  {lead.name?.charAt(0)?.toUpperCase() || "?"}
                                </span>
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium text-foreground truncate">
                                  {lead.name || "—"}
                                </p>
                                <p className="text-sm text-muted-foreground truncate">
                                  {lead.email || lead.phone || "—"}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-muted-foreground hidden md:table-cell">
                            {lead.company || "—"}
                          </td>
                          <td className="p-4 hidden lg:table-cell">
                            <span className="text-sm text-muted-foreground">
                              {lead.digital_cards?.first_name} {lead.digital_cards?.last_name}
                            </span>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">
                            {format(new Date(lead.created_at), "dd MMM yyyy", { locale: fr })}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              {lead.phone && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-full"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(`tel:${lead.phone}`);
                                  }}
                                >
                                  <Phone size={14} />
                                </Button>
                              )}
                              {lead.email && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-full"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(`mailto:${lead.email}`);
                                  }}
                                >
                                  <Mail size={14} />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>

          {/* Results count */}
          {filteredLeads.length > 0 && (
            <p className="text-sm text-muted-foreground text-center mt-6">
              {filteredLeads.length} lead{filteredLeads.length > 1 ? "s" : ""} 
              {hasActiveFilters && " (filtré)"}
            </p>
          )}
        </div>
      </main>

      <Footer />

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center"
          onClick={() => setSelectedLead(null)}
        >
          <div 
            className="bg-background w-full md:max-w-md md:rounded-2xl rounded-t-2xl p-6 animate-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-foreground/10 flex items-center justify-center">
                  <span className="text-xl font-semibold text-foreground">
                    {selectedLead.name?.charAt(0)?.toUpperCase() || "?"}
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {selectedLead.name || "Sans nom"}
                  </h3>
                  {selectedLead.company && (
                    <p className="text-sm text-muted-foreground">{selectedLead.company}</p>
                  )}
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full"
                onClick={() => setSelectedLead(null)}
              >
                <X size={20} />
              </Button>
            </div>

            <div className="space-y-4 mb-6">
              {selectedLead.email && (
                <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl">
                  <Mail size={18} className="text-muted-foreground" />
                  <span className="text-foreground">{selectedLead.email}</span>
                </div>
              )}
              {selectedLead.phone && (
                <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl">
                  <Phone size={18} className="text-muted-foreground" />
                  <span className="text-foreground">{selectedLead.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl">
                <Calendar size={18} className="text-muted-foreground" />
                <span className="text-foreground">
                  {format(new Date(selectedLead.created_at), "dd MMMM yyyy à HH:mm", { locale: fr })}
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl">
                <CreditCard size={18} className="text-muted-foreground" />
                <span className="text-muted-foreground">Via</span>
                <span className="text-foreground">
                  {selectedLead.digital_cards?.first_name} {selectedLead.digital_cards?.last_name}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              {selectedLead.phone && (
                <Button 
                  variant="chrome" 
                  className="flex-1"
                  onClick={() => window.open(`tel:${selectedLead.phone}`)}
                >
                  <Phone size={16} />
                  Appeler
                </Button>
              )}
              {selectedLead.email && (
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => window.open(`mailto:${selectedLead.email}`)}
                >
                  <Mail size={16} />
                  Email
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;
