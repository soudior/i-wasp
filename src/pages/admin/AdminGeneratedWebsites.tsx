/**
 * Admin Generated Websites - Gestion des sites générés
 * Vue complète avec prévisualisation intégrée
 */

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminGuard } from "@/components/AdminGuard";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Eye,
  ExternalLink,
  Search,
  Loader2,
  RefreshCw,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  Copy,
  Check,
  Trash2,
  Edit3,
  Calendar,
  User,
  Mail,
  Building,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Sparkles,
  LayoutGrid,
  List
} from "lucide-react";

interface GeneratedWebsite {
  id: string;
  created_at: string;
  updated_at: string;
  proposal_id: string;
  slug: string | null;
  status: string;
  is_published: boolean | null;
  preview_url: string | null;
  full_page_html: string | null;
  generated_at: string | null;
  proposal?: {
    id: string;
    form_data: {
      businessName?: string;
      contactEmail?: string;
      contactName?: string;
      sector?: string;
      packageId?: string;
      packageName?: string;
    };
    status: string | null;
    price_mad: number | null;
    price_eur: number | null;
    is_express: boolean | null;
  };
}

type ViewMode = 'grid' | 'list';
type PreviewDevice = 'desktop' | 'tablet' | 'mobile';

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: "En attente", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400", icon: <Clock className="h-3 w-3" /> },
  generating: { label: "Génération", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400", icon: <Sparkles className="h-3 w-3 animate-pulse" /> },
  completed: { label: "Terminé", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", icon: <CheckCircle className="h-3 w-3" /> },
  failed: { label: "Échec", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400", icon: <XCircle className="h-3 w-3" /> },
};

export default function AdminGeneratedWebsites() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedSite, setSelectedSite] = useState<GeneratedWebsite | null>(null);
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>("desktop");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  // Fetch all generated websites with their proposals
  const { data: websites, isLoading, refetch } = useQuery({
    queryKey: ["admin-generated-websites"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("generated_websites")
        .select(`
          *,
          proposal:website_proposals(
            id,
            form_data,
            status,
            price_mad,
            price_eur,
            is_express
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as GeneratedWebsite[];
    },
  });

  // Toggle publish status
  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, isPublished }: { id: string; isPublished: boolean }) => {
      const { error } = await supabase
        .from("generated_websites")
        .update({ 
          is_published: isPublished,
          published_at: isPublished ? new Date().toISOString() : null
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-generated-websites"] });
      toast.success("Statut de publication mis à jour");
    },
    onError: (error) => {
      toast.error("Erreur: " + (error as Error).message);
    },
  });

  // Delete website
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("generated_websites")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-generated-websites"] });
      toast.success("Site supprimé");
      setDeleteConfirm(null);
      setSelectedSite(null);
    },
    onError: (error) => {
      toast.error("Erreur: " + (error as Error).message);
    },
  });

  // Filter websites
  const filteredWebsites = useMemo(() => {
    if (!websites) return [];
    return websites.filter((site) => {
      const matchesSearch =
        !searchTerm ||
        site.slug?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (site.proposal?.form_data?.businessName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (site.proposal?.form_data?.contactEmail || "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "all" || site.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [websites, searchTerm, statusFilter]);

  // Stats
  const stats = useMemo(() => {
    if (!websites) return { total: 0, completed: 0, published: 0, failed: 0 };
    return {
      total: websites.length,
      completed: websites.filter((w) => w.status === "completed").length,
      published: websites.filter((w) => w.is_published).length,
      failed: websites.filter((w) => w.status === "failed").length,
    };
  }, [websites]);

  const handleCopyUrl = async (slug: string) => {
    const url = `${window.location.origin}/s/${slug}`;
    await navigator.clipboard.writeText(url);
    setCopied(slug);
    setTimeout(() => setCopied(null), 2000);
  };

  const getPreviewWidth = () => {
    switch (previewDevice) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      default: return '100%';
    }
  };

  const getStatusBadge = (status: string) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
    return (
      <Badge variant="outline" className={`${config.color} flex items-center gap-1`}>
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  return (
    <AdminGuard>
      <DashboardLayout>
        <div className="p-4 md:p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Sites Générés</h1>
              <p className="text-muted-foreground">
                Gérer et prévisualiser tous les sites Web Studio
              </p>
            </div>
            <Button onClick={() => refetch()} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                  <Globe className="h-8 w-8 text-muted-foreground/50" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Terminés</p>
                    <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500/50" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Publiés</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.published}</p>
                  </div>
                  <Sparkles className="h-8 w-8 text-blue-500/50" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Échecs</p>
                    <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-red-500/50" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par nom, slug ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="completed">Terminés</SelectItem>
                    <SelectItem value="generating">En génération</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="failed">Échecs</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex gap-1 border rounded-lg p-1">
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {/* Grid View */}
          {!isLoading && viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredWebsites.map((site) => (
                <Card
                  key={site.id}
                  className="group cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedSite(site)}
                >
                  <CardContent className="p-4">
                    {/* Preview Thumbnail */}
                    <div className="aspect-video bg-muted rounded-lg mb-4 overflow-hidden relative">
                      {site.full_page_html ? (
                        <iframe
                          srcDoc={site.full_page_html}
                          className="w-[200%] h-[200%] scale-50 origin-top-left pointer-events-none"
                          title={site.slug || "Preview"}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Globe className="h-12 w-12 text-muted-foreground/30" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <Eye className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">
                            {site.proposal?.form_data?.businessName || site.slug || "Sans nom"}
                          </h3>
                          <p className="text-sm text-muted-foreground truncate">
                            {site.slug ? `/${site.slug}` : "Pas de slug"}
                          </p>
                        </div>
                        {getStatusBadge(site.status)}
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(site.created_at), "dd MMM yyyy", { locale: fr })}
                        </span>
                        {site.is_published && (
                          <Badge variant="secondary" className="text-xs">
                            <Globe className="h-3 w-3 mr-1" />
                            Publié
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* List View */}
          {!isLoading && viewMode === "list" && (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr className="text-left">
                        <th className="p-4 font-medium">Site</th>
                        <th className="p-4 font-medium">Slug</th>
                        <th className="p-4 font-medium">Statut</th>
                        <th className="p-4 font-medium">Publié</th>
                        <th className="p-4 font-medium">Date</th>
                        <th className="p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredWebsites.map((site) => (
                        <tr key={site.id} className="border-b hover:bg-muted/50">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-8 bg-muted rounded overflow-hidden flex-shrink-0">
                                {site.full_page_html ? (
                                  <iframe
                                    srcDoc={site.full_page_html}
                                    className="w-[400%] h-[400%] scale-[0.25] origin-top-left pointer-events-none"
                                    title={site.slug || "Preview"}
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Globe className="h-4 w-4 text-muted-foreground/30" />
                                  </div>
                                )}
                              </div>
                              <span className="font-medium">
                                {site.proposal?.form_data?.businessName || "Sans nom"}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <code className="text-sm bg-muted px-2 py-1 rounded">
                              {site.slug || "-"}
                            </code>
                          </td>
                          <td className="p-4">{getStatusBadge(site.status)}</td>
                          <td className="p-4">
                            {site.is_published ? (
                              <Badge variant="secondary">Oui</Badge>
                            ) : (
                              <Badge variant="outline">Non</Badge>
                            )}
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">
                            {format(new Date(site.created_at), "dd/MM/yyyy HH:mm", { locale: fr })}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setSelectedSite(site)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {site.slug && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleCopyUrl(site.slug!)}
                                >
                                  {copied === site.slug ? (
                                    <Check className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {!isLoading && filteredWebsites.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Globe className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="font-semibold mb-1">Aucun site trouvé</h3>
                <p className="text-muted-foreground text-sm">
                  {searchTerm || statusFilter !== "all"
                    ? "Essayez de modifier vos filtres"
                    : "Les sites générés apparaîtront ici"}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Preview Sheet */}
        <Sheet open={!!selectedSite} onOpenChange={() => setSelectedSite(null)}>
          <SheetContent className="w-full sm:max-w-[90vw] lg:max-w-[80vw] p-0">
            {selectedSite && (
              <div className="h-full flex flex-col">
                {/* Sheet Header */}
                <div className="p-4 border-b flex items-center justify-between bg-background">
                  <div className="flex-1 min-w-0">
                    <SheetTitle className="truncate">
                      {selectedSite.proposal?.form_data?.businessName || selectedSite.slug || "Site"}
                    </SheetTitle>
                    <p className="text-sm text-muted-foreground">
                      Créé le {format(new Date(selectedSite.created_at), "dd MMMM yyyy à HH:mm", { locale: fr })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Device Switcher */}
                    <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                      <Button
                        size="sm"
                        variant={previewDevice === "desktop" ? "secondary" : "ghost"}
                        onClick={() => setPreviewDevice("desktop")}
                      >
                        <Monitor className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant={previewDevice === "tablet" ? "secondary" : "ghost"}
                        onClick={() => setPreviewDevice("tablet")}
                      >
                        <Tablet className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant={previewDevice === "mobile" ? "secondary" : "ghost"}
                        onClick={() => setPreviewDevice("mobile")}
                      >
                        <Smartphone className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="preview" className="flex-1 flex flex-col">
                  <div className="px-4 border-b">
                    <TabsList className="h-10">
                      <TabsTrigger value="preview">Aperçu</TabsTrigger>
                      <TabsTrigger value="details">Détails</TabsTrigger>
                      <TabsTrigger value="actions">Actions</TabsTrigger>
                    </TabsList>
                  </div>

                  {/* Preview Tab */}
                  <TabsContent value="preview" className="flex-1 m-0 p-4 bg-muted/30">
                    <div className="h-full flex items-start justify-center overflow-auto">
                      <div
                        className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300"
                        style={{
                          width: getPreviewWidth(),
                          height: previewDevice === "desktop" ? "100%" : "80%",
                          maxHeight: "calc(100vh - 200px)",
                        }}
                      >
                        {selectedSite.full_page_html ? (
                          <iframe
                            srcDoc={selectedSite.full_page_html}
                            className="w-full h-full border-0"
                            title="Website Preview"
                            sandbox="allow-scripts allow-same-origin"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center">
                              <Globe className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                              <p className="text-muted-foreground">Contenu non disponible</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  {/* Details Tab */}
                  <TabsContent value="details" className="flex-1 m-0">
                    <ScrollArea className="h-[calc(100vh-200px)]">
                      <div className="p-4 space-y-6">
                        {/* Site Info */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Informations du site</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm text-muted-foreground">Slug</label>
                                <p className="font-mono">{selectedSite.slug || "-"}</p>
                              </div>
                              <div>
                                <label className="text-sm text-muted-foreground">Statut</label>
                                <div className="mt-1">{getStatusBadge(selectedSite.status)}</div>
                              </div>
                              <div>
                                <label className="text-sm text-muted-foreground">Publié</label>
                                <p>{selectedSite.is_published ? "Oui" : "Non"}</p>
                              </div>
                              <div>
                                <label className="text-sm text-muted-foreground">Généré le</label>
                                <p>
                                  {selectedSite.generated_at
                                    ? format(new Date(selectedSite.generated_at), "dd/MM/yyyy HH:mm", { locale: fr })
                                    : "-"}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Proposal Info */}
                        {selectedSite.proposal && (
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">Informations client</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                  <Building className="h-4 w-4 text-muted-foreground" />
                                  <div>
                                    <label className="text-sm text-muted-foreground">Entreprise</label>
                                    <p>{selectedSite.proposal.form_data?.businessName || "-"}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                  <div>
                                    <label className="text-sm text-muted-foreground">Contact</label>
                                    <p>{selectedSite.proposal.form_data?.contactName || "-"}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4 text-muted-foreground" />
                                  <div>
                                    <label className="text-sm text-muted-foreground">Email</label>
                                    <p>{selectedSite.proposal.form_data?.contactEmail || "-"}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-muted-foreground" />
                                  <div>
                                    <label className="text-sm text-muted-foreground">Package</label>
                                    <p>{selectedSite.proposal.form_data?.packageName || "-"}</p>
                                  </div>
                                </div>
                              </div>
                              {selectedSite.proposal.price_mad && (
                                <div className="pt-4 border-t">
                                  <label className="text-sm text-muted-foreground">Prix</label>
                                  <p className="text-lg font-semibold">
                                    {selectedSite.proposal.price_mad} MAD
                                    {selectedSite.proposal.price_eur && (
                                      <span className="text-sm text-muted-foreground ml-2">
                                        (~{selectedSite.proposal.price_eur}€)
                                      </span>
                                    )}
                                  </p>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  {/* Actions Tab */}
                  <TabsContent value="actions" className="flex-1 m-0">
                    <div className="p-4 space-y-4">
                      {/* Quick Actions */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Actions rapides</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {/* Copy URL */}
                          {selectedSite.slug && (
                            <Button
                              variant="outline"
                              className="w-full justify-start"
                              onClick={() => handleCopyUrl(selectedSite.slug!)}
                            >
                              {copied === selectedSite.slug ? (
                                <Check className="h-4 w-4 mr-2 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4 mr-2" />
                              )}
                              Copier le lien public
                            </Button>
                          )}

                          {/* Open in new tab */}
                          {selectedSite.slug && (
                            <Button
                              variant="outline"
                              className="w-full justify-start"
                              onClick={() => window.open(`/s/${selectedSite.slug}`, "_blank")}
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Ouvrir dans un nouvel onglet
                            </Button>
                          )}

                          {/* Blog Editor */}
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => {
                              // TODO: Get blog token and open editor
                              toast.info("Éditeur de blog en cours d'implémentation");
                            }}
                          >
                            <Edit3 className="h-4 w-4 mr-2" />
                            Ouvrir l'éditeur de blog
                          </Button>

                          {/* Toggle Publish */}
                          <Button
                            variant={selectedSite.is_published ? "outline" : "default"}
                            className="w-full justify-start"
                            onClick={() =>
                              togglePublishMutation.mutate({
                                id: selectedSite.id,
                                isPublished: !selectedSite.is_published,
                              })
                            }
                            disabled={togglePublishMutation.isPending}
                          >
                            {togglePublishMutation.isPending ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : selectedSite.is_published ? (
                              <XCircle className="h-4 w-4 mr-2" />
                            ) : (
                              <Globe className="h-4 w-4 mr-2" />
                            )}
                            {selectedSite.is_published ? "Dépublier" : "Publier"}
                          </Button>
                        </CardContent>
                      </Card>

                      {/* Danger Zone */}
                      <Card className="border-destructive/50">
                        <CardHeader>
                          <CardTitle className="text-lg text-destructive">Zone de danger</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {deleteConfirm === selectedSite.id ? (
                            <div className="space-y-3">
                              <p className="text-sm text-muted-foreground">
                                Êtes-vous sûr de vouloir supprimer ce site ? Cette action est irréversible.
                              </p>
                              <div className="flex gap-2">
                                <Button
                                  variant="destructive"
                                  className="flex-1"
                                  onClick={() => deleteMutation.mutate(selectedSite.id)}
                                  disabled={deleteMutation.isPending}
                                >
                                  {deleteMutation.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    "Confirmer la suppression"
                                  )}
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => setDeleteConfirm(null)}
                                >
                                  Annuler
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <Button
                              variant="outline"
                              className="w-full justify-start text-destructive hover:text-destructive"
                              onClick={() => setDeleteConfirm(selectedSite.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer ce site
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </DashboardLayout>
    </AdminGuard>
  );
}
