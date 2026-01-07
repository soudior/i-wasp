/**
 * IWASP Leads Dashboard
 * Simplified, Apple-like design
 * Filters, search, bulk actions
 */

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { format, subDays, isAfter, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Search,
  Download,
  Trash2,
  Mail,
  Phone,
  Building2,
  Calendar,
  ChevronDown,
  MoreHorizontal,
  Users,
  Flame,
  Thermometer,
  Snowflake,
  CheckCircle2,
  XCircle,
  Clock,
  MessageSquare,
  ArrowUpDown,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useLeads, useUpdateLeadStatus, useDeleteLead, type LeadWithCard } from "@/hooks/useLeads";
import { useCards } from "@/hooks/useCards";
import { toast } from "sonner";
import { DashboardLayout } from "@/layouts/DashboardLayout";

type LeadTemperature = "hot" | "warm" | "cold";
type SortField = "created_at" | "lead_score" | "name";
type SortOrder = "asc" | "desc";

const ITEMS_PER_PAGE = 10;

function getLeadTemperature(score: number): LeadTemperature {
  if (score >= 30) return "hot";
  if (score >= 15) return "warm";
  return "cold";
}

function TemperatureBadge({ score }: { score: number }) {
  const temp = getLeadTemperature(score);
  const config = {
    hot: { icon: Flame, label: "Chaud", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
    warm: { icon: Thermometer, label: "Tiède", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
    cold: { icon: Snowflake, label: "Froid", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  };
  const { icon: Icon, label, className } = config[temp];
  
  return (
    <Badge variant="secondary" className={`${className} gap-1`}>
      <Icon className="h-3 w-3" />
      {score} pts
    </Badge>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { icon: typeof CheckCircle2; label: string; className: string }> = {
    new: { icon: Clock, label: "Nouveau", className: "bg-primary/10 text-primary" },
    contacted: { icon: MessageSquare, label: "Contacté", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
    converted: { icon: CheckCircle2, label: "Converti", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
    archived: { icon: XCircle, label: "Archivé", className: "bg-muted text-muted-foreground" },
  };
  const { icon: Icon, label, className } = config[status] || config.new;
  
  return (
    <Badge variant="secondary" className={`${className} gap-1`}>
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
}

export default function Leads() {
  const { data: leads = [], isLoading, refetch } = useLeads();
  const { data: cards = [] } = useCards();
  const updateStatus = useUpdateLeadStatus();
  const deleteLead = useDeleteLead();

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [temperatureFilter, setTemperatureFilter] = useState<string>("all");
  const [cardFilter, setCardFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  
  // Sorting
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  
  // Selection
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  
  // Modals
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<LeadWithCard | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  // Filter and sort leads
  const filteredLeads = useMemo(() => {
    let result = [...leads];

    // Search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (lead) =>
          lead.name?.toLowerCase().includes(searchLower) ||
          lead.email?.toLowerCase().includes(searchLower) ||
          lead.phone?.includes(search) ||
          lead.company?.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((lead) => lead.status === statusFilter);
    }

    // Temperature filter
    if (temperatureFilter !== "all") {
      result = result.filter((lead) => getLeadTemperature(lead.lead_score) === temperatureFilter);
    }

    // Card filter
    if (cardFilter !== "all") {
      result = result.filter((lead) => lead.card_id === cardFilter);
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();
      const cutoff = {
        today: subDays(now, 1),
        week: subDays(now, 7),
        month: subDays(now, 30),
      }[dateFilter];
      if (cutoff) {
        result = result.filter((lead) => isAfter(parseISO(lead.created_at), cutoff));
      }
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "created_at":
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case "lead_score":
          comparison = a.lead_score - b.lead_score;
          break;
        case "name":
          comparison = (a.name || "").localeCompare(b.name || "");
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [leads, search, statusFilter, temperatureFilter, cardFilter, dateFilter, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredLeads.length / ITEMS_PER_PAGE);
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Stats
  const stats = useMemo(() => ({
    total: leads.length,
    hot: leads.filter((l) => getLeadTemperature(l.lead_score) === "hot").length,
    new: leads.filter((l) => l.status === "new").length,
    converted: leads.filter((l) => l.status === "converted").length,
  }), [leads]);

  // Selection handlers
  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedLeads);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedLeads(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedLeads.size === paginatedLeads.length) {
      setSelectedLeads(new Set());
    } else {
      setSelectedLeads(new Set(paginatedLeads.map((l) => l.id)));
    }
  };

  // Bulk actions
  const handleBulkStatusChange = async (status: string) => {
    const promises = Array.from(selectedLeads).map((id) =>
      updateStatus.mutateAsync({ id, status })
    );
    await Promise.all(promises);
    setSelectedLeads(new Set());
    toast.success(`${selectedLeads.size} leads mis à jour`);
  };

  const handleBulkDelete = async () => {
    const promises = Array.from(selectedLeads).map((id) =>
      deleteLead.mutateAsync(id)
    );
    await Promise.all(promises);
    setSelectedLeads(new Set());
    setDeleteDialogOpen(false);
    toast.success(`${selectedLeads.size} leads supprimés`);
  };

  // Export
  const handleExport = () => {
    const csvContent = [
      ["Nom", "Email", "Téléphone", "Entreprise", "Score", "Statut", "Date"].join("\t"),
      ...filteredLeads.map((lead) =>
        [
          lead.name || "-",
          lead.email || "-",
          lead.phone || "-",
          lead.company || "-",
          lead.lead_score,
          lead.status,
          format(parseISO(lead.created_at), "dd/MM/yyyy", { locale: fr }),
        ].join("\t")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/tab-separated-values" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${format(new Date(), "yyyy-MM-dd")}.tsv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Export téléchargé");
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setTemperatureFilter("all");
    setCardFilter("all");
    setDateFilter("all");
    setCurrentPage(1);
  };

  const hasActiveFilters = search || statusFilter !== "all" || temperatureFilter !== "all" || cardFilter !== "all" || dateFilter !== "all";

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Contacts</h1>
              <p className="text-muted-foreground text-sm">
                Gérez vos leads et suivez vos conversions
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span className="hidden sm:inline">Actualiser</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                disabled={filteredLeads.length === 0}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Exporter</span>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Total", value: stats.total, icon: Users, color: "text-foreground" },
              { label: "Chauds", value: stats.hot, icon: Flame, color: "text-red-500" },
              { label: "Nouveaux", value: stats.new, icon: Clock, color: "text-primary" },
              { label: "Convertis", value: stats.converted, icon: CheckCircle2, color: "text-green-500" },
            ].map((stat) => (
              <Card key={stat.label} className="bg-card border-border">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`p-2 rounded-xl bg-muted ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filters */}
          <Card className="bg-card border-border">
            <CardContent className="p-4 space-y-4">
              {/* Search + Main filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par nom, email, téléphone..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-10 bg-background"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
                    <SelectTrigger className="w-[130px] bg-background">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous statuts</SelectItem>
                      <SelectItem value="new">Nouveau</SelectItem>
                      <SelectItem value="contacted">Contacté</SelectItem>
                      <SelectItem value="converted">Converti</SelectItem>
                      <SelectItem value="archived">Archivé</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={temperatureFilter} onValueChange={(v) => { setTemperatureFilter(v); setCurrentPage(1); }}>
                    <SelectTrigger className="w-[130px] bg-background">
                      <SelectValue placeholder="Température" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes temp.</SelectItem>
                      <SelectItem value="hot">Chaud</SelectItem>
                      <SelectItem value="warm">Tiède</SelectItem>
                      <SelectItem value="cold">Froid</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={dateFilter} onValueChange={(v) => { setDateFilter(v); setCurrentPage(1); }}>
                    <SelectTrigger className="w-[130px] bg-background">
                      <SelectValue placeholder="Période" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes dates</SelectItem>
                      <SelectItem value="today">Aujourd'hui</SelectItem>
                      <SelectItem value="week">7 derniers jours</SelectItem>
                      <SelectItem value="month">30 derniers jours</SelectItem>
                    </SelectContent>
                  </Select>

                  {cards.length > 1 && (
                    <Select value={cardFilter} onValueChange={(v) => { setCardFilter(v); setCurrentPage(1); }}>
                      <SelectTrigger className="w-[150px] bg-background">
                        <SelectValue placeholder="Carte" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes cartes</SelectItem>
                        {cards.map((card) => (
                          <SelectItem key={card.id} value={card.id}>
                            {card.first_name} {card.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>

              {/* Active filters + Clear */}
              {hasActiveFilters && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {filteredLeads.length} résultat{filteredLeads.length !== 1 ? "s" : ""}
                  </span>
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="text-primary">
                    Effacer les filtres
                  </Button>
                </div>
              )}

              {/* Bulk actions */}
              {selectedLeads.size > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/20"
                >
                  <span className="text-sm font-medium text-foreground">
                    {selectedLeads.size} sélectionné{selectedLeads.size !== 1 ? "s" : ""}
                  </span>
                  <div className="flex-1" />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        Changer statut
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleBulkStatusChange("contacted")}>
                        Marquer contacté
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleBulkStatusChange("converted")}>
                        Marquer converti
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleBulkStatusChange("archived")}>
                        Archiver
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteDialogOpen(true)}
                    className="gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Supprimer
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* Table */}
          <Card className="bg-card border-border overflow-hidden">
            {isLoading ? (
              <div className="p-12 text-center">
                <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
                <p className="text-muted-foreground mt-4">Chargement...</p>
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-foreground font-medium">Aucun contact trouvé</p>
                <p className="text-muted-foreground text-sm mt-1">
                  {hasActiveFilters
                    ? "Essayez de modifier vos filtres"
                    : "Les leads apparaîtront ici après un scan de carte"}
                </p>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedLeads.size === paginatedLeads.length && paginatedLeads.length > 0}
                          onCheckedChange={toggleSelectAll}
                        />
                      </TableHead>
                      <TableHead>
                        <button
                          onClick={() => {
                            if (sortField === "name") {
                              setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                            } else {
                              setSortField("name");
                              setSortOrder("asc");
                            }
                          }}
                          className="flex items-center gap-1 hover:text-foreground transition-colors"
                        >
                          Contact
                          <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        <button
                          onClick={() => {
                            if (sortField === "lead_score") {
                              setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                            } else {
                              setSortField("lead_score");
                              setSortOrder("desc");
                            }
                          }}
                          className="flex items-center gap-1 hover:text-foreground transition-colors"
                        >
                          Score
                          <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </TableHead>
                      <TableHead className="hidden sm:table-cell">Statut</TableHead>
                      <TableHead className="hidden lg:table-cell">
                        <button
                          onClick={() => {
                            if (sortField === "created_at") {
                              setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                            } else {
                              setSortField("created_at");
                              setSortOrder("desc");
                            }
                          }}
                          className="flex items-center gap-1 hover:text-foreground transition-colors"
                        >
                          Date
                          <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </TableHead>
                      <TableHead className="w-12" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedLeads.map((lead) => (
                      <TableRow
                        key={lead.id}
                        className="group cursor-pointer"
                        onClick={() => {
                          setSelectedLead(lead);
                          setDetailDialogOpen(true);
                        }}
                      >
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={selectedLeads.has(lead.id)}
                            onCheckedChange={() => toggleSelect(lead.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="min-w-0">
                            <p className="font-medium text-foreground truncate">
                              {lead.name || "—"}
                            </p>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground mt-0.5">
                              {lead.email && (
                                <span className="flex items-center gap-1 truncate">
                                  <Mail className="h-3 w-3 flex-shrink-0" />
                                  <span className="truncate">{lead.email}</span>
                                </span>
                              )}
                              {lead.phone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="h-3 w-3 flex-shrink-0" />
                                  {lead.phone}
                                </span>
                              )}
                            </div>
                            {lead.company && (
                              <span className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                                <Building2 className="h-3 w-3 flex-shrink-0" />
                                {lead.company}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <TemperatureBadge score={lead.lead_score} />
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <StatusBadge status={lead.status} />
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(parseISO(lead.created_at), "dd MMM yyyy", { locale: fr })}
                          </div>
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => updateStatus.mutate({ id: lead.id, status: "contacted" })}>
                                Marquer contacté
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateStatus.mutate({ id: lead.id, status: "converted" })}>
                                Marquer converti
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateStatus.mutate({ id: lead.id, status: "archived" })}>
                                Archiver
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {lead.email && (
                                <DropdownMenuItem onClick={() => window.location.href = `mailto:${lead.email}`}>
                                  Envoyer un email
                                </DropdownMenuItem>
                              )}
                              {lead.phone && (
                                <DropdownMenuItem onClick={() => window.location.href = `tel:${lead.phone}`}>
                                  Appeler
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => {
                                  setSelectedLeads(new Set([lead.id]));
                                  setDeleteDialogOpen(true);
                                }}
                              >
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="p-4 border-t border-border">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let page: number;
                          if (totalPages <= 5) {
                            page = i + 1;
                          } else if (currentPage <= 3) {
                            page = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            page = totalPages - 4 + i;
                          } else {
                            page = currentPage - 2 + i;
                          }
                          return (
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() => setCurrentPage(page)}
                                isActive={currentPage === page}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        })}
                        <PaginationItem>
                          <PaginationNext
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </Card>
        </div>

        {/* Lead Detail Dialog */}
        <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedLead?.name || "Contact"}</DialogTitle>
              <DialogDescription>
                Ajouté le {selectedLead && format(parseISO(selectedLead.created_at), "dd MMMM yyyy à HH:mm", { locale: fr })}
              </DialogDescription>
            </DialogHeader>
            {selectedLead && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <TemperatureBadge score={selectedLead.lead_score} />
                  <StatusBadge status={selectedLead.status} />
                </div>

                <div className="space-y-3">
                  {selectedLead.email && (
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a href={`mailto:${selectedLead.email}`} className="text-primary hover:underline">
                        {selectedLead.email}
                      </a>
                    </div>
                  )}
                  {selectedLead.phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a href={`tel:${selectedLead.phone}`} className="text-primary hover:underline">
                        {selectedLead.phone}
                      </a>
                    </div>
                  )}
                  {selectedLead.company && (
                    <div className="flex items-center gap-3 text-sm">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedLead.company}</span>
                    </div>
                  )}
                  {selectedLead.message && (
                    <div className="p-3 rounded-lg bg-muted">
                      <p className="text-sm text-foreground">{selectedLead.message}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Select
                    value={selectedLead.status}
                    onValueChange={(status) => {
                      updateStatus.mutate({ id: selectedLead.id, status });
                      setSelectedLead({ ...selectedLead, status });
                    }}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">Nouveau</SelectItem>
                      <SelectItem value="contacted">Contacté</SelectItem>
                      <SelectItem value="converted">Converti</SelectItem>
                      <SelectItem value="archived">Archivé</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => {
                      setSelectedLeads(new Set([selectedLead.id]));
                      setDetailDialogOpen(false);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Supprimer {selectedLeads.size} contact{selectedLeads.size !== 1 ? "s" : ""} ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. Les données seront définitivement supprimées conformément au RGPD.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleBulkDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}
