/**
 * CRM Integration Panel
 * Premium webhook configuration for external CRM sync
 * Supports Zapier, Make, HubSpot, Notion, n8n
 * RGPD compliant - only syncs consented leads
 */

import { useState } from "react";
import {
  useWebhookConfigs,
  useCreateWebhookConfig,
  useUpdateWebhookConfig,
  useDeleteWebhookConfig,
  useWebhookLogs,
  PROVIDER_INFO,
  type WebhookConfig,
  type CreateWebhookConfigData,
} from "@/hooks/useWebhookConfig";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Zap,
  Plus,
  Trash2,
  Settings,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Send,
  Shield,
  Activity,
  Link2,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface CRMIntegrationPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CRMIntegrationPanel({ open, onOpenChange }: CRMIntegrationPanelProps) {
  const { user } = useAuth();
  const { data: configs = [], isLoading: loadingConfigs } = useWebhookConfigs();
  const { data: logs = [], isLoading: loadingLogs } = useWebhookLogs(20);
  const createConfig = useCreateWebhookConfig();
  const updateConfig = useUpdateWebhookConfig();
  const deleteConfig = useDeleteWebhookConfig();

  const [showAddForm, setShowAddForm] = useState(false);
  const [testing, setTesting] = useState<string | null>(null);
  const [newConfig, setNewConfig] = useState<CreateWebhookConfigData>({
    name: "",
    webhook_url: "",
    provider: "zapier",
    enabled: true,
    sync_consented_only: true,
    retry_count: 3,
  });

  const handleAddConfig = async () => {
    if (!newConfig.name || !newConfig.webhook_url) {
      toast.error("Nom et URL requis");
      return;
    }

    await createConfig.mutateAsync(newConfig);
    setNewConfig({
      name: "",
      webhook_url: "",
      provider: "zapier",
      enabled: true,
      sync_consented_only: true,
      retry_count: 3,
    });
    setShowAddForm(false);
  };

  const handleTestWebhook = async (config: WebhookConfig) => {
    if (!user) return;
    
    setTesting(config.id);
    try {
      const { data, error } = await supabase.functions.invoke("lead-webhook", {
        body: {
          action: "test",
          webhook_url: config.webhook_url,
          config_id: config.id,
          user_id: user.id,
        },
      });

      if (error || !data?.success) {
        toast.error("Échec du test webhook");
      } else {
        toast.success("Webhook testé avec succès !");
      }
    } catch (err) {
      toast.error("Erreur de connexion");
    }
    setTesting(null);
  };

  const handleToggle = async (config: WebhookConfig) => {
    await updateConfig.mutateAsync({
      id: config.id,
      enabled: !config.enabled,
    });
  };

  const handleDelete = async (id: string) => {
    await deleteConfig.mutateAsync(id);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="text-emerald-500" size={14} />;
      case "failed":
        return <XCircle className="text-destructive" size={14} />;
      case "retrying":
        return <RefreshCw className="text-amber-500 animate-spin" size={14} />;
      default:
        return <Clock className="text-muted-foreground" size={14} />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap size={22} className="text-amber-500" />
            Intégrations CRM
          </DialogTitle>
          <DialogDescription>
            Connectez IWASP à vos outils CRM pour synchroniser automatiquement les leads.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="integrations" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="integrations" className="gap-2">
              <Link2 size={16} />
              Intégrations
            </TabsTrigger>
            <TabsTrigger value="logs" className="gap-2">
              <Activity size={16} />
              Historique
            </TabsTrigger>
          </TabsList>

          <TabsContent value="integrations" className="flex-1 overflow-hidden mt-4">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {/* Existing Configs */}
                {configs.map((config) => {
                  const provider = PROVIDER_INFO[config.provider];
                  return (
                    <Card key={config.id} className={`border transition-all ${config.enabled ? 'border-border' : 'border-muted opacity-60'}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg">{provider.icon}</span>
                              <h4 className="font-medium truncate">{config.name}</h4>
                              <Badge variant="secondary" className={provider.color}>
                                {provider.label}
                              </Badge>
                              {config.sync_consented_only && (
                                <Badge variant="outline" className="gap-1">
                                  <Shield size={10} />
                                  RGPD
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate font-mono">
                              {config.webhook_url}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Retry: {config.retry_count}x
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={config.enabled}
                              onCheckedChange={() => handleToggle(config)}
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleTestWebhook(config)}
                              disabled={testing === config.id || !config.enabled}
                            >
                              {testing === config.id ? (
                                <RefreshCw size={16} className="animate-spin" />
                              ) : (
                                <Send size={16} />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDelete(config.id)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                {/* Empty State */}
                {configs.length === 0 && !showAddForm && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Zap size={40} className="mx-auto mb-4 opacity-30" />
                    <p>Aucune intégration configurée</p>
                    <p className="text-sm">Ajoutez un webhook pour synchroniser vos leads</p>
                  </div>
                )}

                {/* Add New Form */}
                {showAddForm && (
                  <Card className="border-primary/30 bg-primary/5">
                    <CardContent className="p-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Nom de l'intégration</Label>
                          <Input
                            value={newConfig.name}
                            onChange={(e) => setNewConfig({ ...newConfig, name: e.target.value })}
                            placeholder="Mon CRM"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Fournisseur</Label>
                          <Select
                            value={newConfig.provider}
                            onValueChange={(v) => setNewConfig({ ...newConfig, provider: v as WebhookConfig["provider"] })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(PROVIDER_INFO).map(([key, info]) => (
                                <SelectItem key={key} value={key}>
                                  <span className="flex items-center gap-2">
                                    <span>{info.icon}</span>
                                    {info.label}
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>URL du Webhook</Label>
                        <Input
                          value={newConfig.webhook_url}
                          onChange={(e) => setNewConfig({ ...newConfig, webhook_url: e.target.value })}
                          placeholder="https://hooks.zapier.com/..."
                          className="font-mono text-sm"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Switch
                              id="rgpd"
                              checked={newConfig.sync_consented_only}
                              onCheckedChange={(c) => setNewConfig({ ...newConfig, sync_consented_only: c })}
                            />
                            <Label htmlFor="rgpd" className="text-sm flex items-center gap-1">
                              <Shield size={14} />
                              RGPD uniquement
                            </Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Label className="text-sm">Retry:</Label>
                            <Select
                              value={String(newConfig.retry_count)}
                              onValueChange={(v) => setNewConfig({ ...newConfig, retry_count: parseInt(v) })}
                            >
                              <SelectTrigger className="w-16 h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">1x</SelectItem>
                                <SelectItem value="3">3x</SelectItem>
                                <SelectItem value="5">5x</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" onClick={() => setShowAddForm(false)}>
                          Annuler
                        </Button>
                        <Button onClick={handleAddConfig} disabled={createConfig.isPending}>
                          {createConfig.isPending ? "Ajout..." : "Ajouter"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Add Button */}
                {!showAddForm && (
                  <Button
                    variant="outline"
                    className="w-full h-12 border-dashed"
                    onClick={() => setShowAddForm(true)}
                  >
                    <Plus size={18} className="mr-2" />
                    Ajouter une intégration
                  </Button>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="logs" className="flex-1 overflow-hidden mt-4">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-2">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 text-sm"
                  >
                    {getStatusIcon(log.status)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {log.event_type}
                        </Badge>
                        {log.attempts > 1 && (
                          <span className="text-xs text-muted-foreground">
                            {log.attempts} tentatives
                          </span>
                        )}
                      </div>
                      {log.error_message && (
                        <p className="text-xs text-destructive mt-1 truncate">
                          {log.error_message}
                        </p>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(log.created_at), "dd/MM HH:mm", { locale: fr })}
                    </div>
                    {log.response_status && (
                      <Badge 
                        variant={log.response_status < 300 ? "default" : "destructive"} 
                        className="text-xs"
                      >
                        {log.response_status}
                      </Badge>
                    )}
                  </div>
                ))}

                {logs.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Activity size={40} className="mx-auto mb-4 opacity-30" />
                    <p>Aucune synchronisation récente</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <DialogFooter className="pt-4 border-t">
          <p className="text-xs text-muted-foreground flex-1">
            <Shield size={12} className="inline mr-1" />
            Seuls les leads consentants sont synchronisés (RGPD)
          </p>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CRMIntegrationPanel;
