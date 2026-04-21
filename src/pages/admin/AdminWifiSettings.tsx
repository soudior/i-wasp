/**
 * AdminWifiSettings — Wi-Fi configuration manager
 *
 * Allows administrators to edit each property's Wi-Fi config
 * (SSID, password, brand info, networks). Saves to Supabase
 * and broadcasts realtime updates to public /wifi/:slug pages.
 */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  ArrowLeft,
  Wifi,
  Save,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  Loader2,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { useAllWifiConfigs } from "@/hooks/useWifiConfig";
import type { PropertyConfig, WifiNetwork } from "@/config/wifiProperties";

type EditableConfig = PropertyConfig & { _dirty?: boolean };

export default function AdminWifiSettings() {
  const { configs, loading } = useAllWifiConfigs();
  const [drafts, setDrafts] = useState<Record<string, EditableConfig>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  // Sync drafts when remote configs load (only for non-dirty entries)
  useEffect(() => {
    setDrafts((prev) => {
      const next = { ...prev };
      for (const cfg of configs) {
        if (!next[cfg.slug] || !next[cfg.slug]._dirty) {
          next[cfg.slug] = { ...cfg };
        }
      }
      return next;
    });
  }, [configs]);

  const updateDraft = (slug: string, patch: Partial<PropertyConfig>) => {
    setDrafts((prev) => ({
      ...prev,
      [slug]: { ...prev[slug], ...patch, _dirty: true },
    }));
  };

  const updateNetwork = (
    slug: string,
    index: number,
    patch: Partial<WifiNetwork>
  ) => {
    setDrafts((prev) => {
      const cfg = prev[slug];
      if (!cfg) return prev;
      const networks = cfg.networks.map((n, i) =>
        i === index ? { ...n, ...patch } : n
      );
      return { ...prev, [slug]: { ...cfg, networks, _dirty: true } };
    });
  };

  const addNetwork = (slug: string) => {
    setDrafts((prev) => {
      const cfg = prev[slug];
      if (!cfg) return prev;
      const newNetwork: WifiNetwork = {
        ssid: "",
        password: "",
        security: "WPA",
        label: "Connexion Wi-Fi",
        recommended: cfg.networks.length === 0,
        description: "Réseau secondaire",
      };
      return {
        ...prev,
        [slug]: {
          ...cfg,
          networks: [...cfg.networks, newNetwork],
          _dirty: true,
        },
      };
    });
  };

  const removeNetwork = (slug: string, index: number) => {
    setDrafts((prev) => {
      const cfg = prev[slug];
      if (!cfg) return prev;
      return {
        ...prev,
        [slug]: {
          ...cfg,
          networks: cfg.networks.filter((_, i) => i !== index),
          _dirty: true,
        },
      };
    });
  };

  const setRecommended = (slug: string, index: number) => {
    setDrafts((prev) => {
      const cfg = prev[slug];
      if (!cfg) return prev;
      const networks = cfg.networks.map((n, i) => ({
        ...n,
        recommended: i === index,
      }));
      return { ...prev, [slug]: { ...cfg, networks, _dirty: true } };
    });
  };

  const handleSave = async (slug: string) => {
    const cfg = drafts[slug];
    if (!cfg) return;

    // Basic validation
    if (!cfg.brandName.trim()) {
      toast.error("Le nom de marque est requis");
      return;
    }
    if (cfg.networks.length === 0) {
      toast.error("Au moins un réseau Wi-Fi est requis");
      return;
    }
    for (const n of cfg.networks) {
      if (!n.ssid.trim() || !n.password.trim()) {
        toast.error("SSID et mot de passe requis pour chaque réseau");
        return;
      }
    }

    setSaving(slug);
    const { error } = await supabase
      .from("wifi_configs")
      .update({
        brand_name: cfg.brandName,
        suite_name: cfg.suiteName ?? null,
        subtitle: cfg.subtitle,
        footer_text: cfg.footerText,
        footer_tagline: cfg.footerTagline,
        whatsapp_number: cfg.whatsappNumber ?? null,
        networks: cfg.networks as unknown as never,
      })
      .eq("slug", slug);

    setSaving(null);

    if (error) {
      toast.error("Erreur de sauvegarde", { description: error.message });
      return;
    }

    setDrafts((prev) => ({
      ...prev,
      [slug]: { ...prev[slug], _dirty: false },
    }));
    toast.success("Configuration sauvegardée", {
      description: "Les changements sont visibles en temps réel.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#007AFF]" />
      </div>
    );
  }

  const slugs = Object.keys(drafts);

  return (
    <div className="min-h-screen bg-[#F5F5F7] py-6 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/admin"
            className="inline-flex items-center text-sm text-[#8E8E93] hover:text-[#1D1D1F] mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Retour au dashboard
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#007AFF]/10 flex items-center justify-center">
              <Wifi className="w-5 h-5 text-[#007AFF]" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-[#1D1D1F]">
                Réglages Wi-Fi
              </h1>
              <p className="text-sm text-[#8E8E93]">
                Modifiez SSID & mot de passe — mis à jour en temps réel.
              </p>
            </div>
          </div>
        </div>

        {/* Properties */}
        <div className="space-y-4">
          {slugs.map((slug) => {
            const cfg = drafts[slug];
            const dirty = cfg._dirty;
            const isSaving = saving === slug;
            return (
              <Card key={slug} className="border-0 shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-base text-[#1D1D1F] flex items-center gap-2">
                        {cfg.brandName}
                        {cfg.suiteName && (
                          <Badge variant="secondary" className="font-normal">
                            {cfg.suiteName}
                          </Badge>
                        )}
                        {dirty && (
                          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 font-normal">
                            Non sauvegardé
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="mt-1 flex items-center gap-2">
                        <code className="text-xs">/wifi/{slug}</code>
                        <a
                          href={`/wifi/${slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#007AFF] hover:underline inline-flex items-center gap-1 text-xs"
                        >
                          ouvrir <ExternalLink className="w-3 h-3" />
                        </a>
                      </CardDescription>
                    </div>
                    <Button
                      onClick={() => handleSave(slug)}
                      disabled={!dirty || isSaving}
                      className="bg-[#007AFF] hover:bg-[#0066D6] rounded-xl"
                      size="sm"
                    >
                      {isSaving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-1.5" /> Sauvegarder
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-5">
                  {/* Networks */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium text-[#1D1D1F]">
                        Réseaux Wi-Fi ({cfg.networks.length})
                      </Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => addNetwork(slug)}
                        className="text-[#007AFF] hover:text-[#007AFF] hover:bg-[#007AFF]/10"
                      >
                        <Plus className="w-4 h-4 mr-1" /> Ajouter
                      </Button>
                    </div>

                    {cfg.networks.map((net, idx) => {
                      const pwKey = `${slug}-${idx}`;
                      const visible = showPasswords[pwKey];
                      return (
                        <div
                          key={idx}
                          className="rounded-xl border border-[#E5E5EA] bg-white p-4 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => setRecommended(slug, idx)}
                              className="inline-flex items-center gap-1.5 text-xs"
                            >
                              <Star
                                className={`w-3.5 h-3.5 ${
                                  net.recommended
                                    ? "fill-[#FFC700] text-[#FFC700]"
                                    : "text-[#8E8E93]"
                                }`}
                              />
                              <span
                                className={
                                  net.recommended
                                    ? "text-[#1D1D1F] font-medium"
                                    : "text-[#8E8E93]"
                                }
                              >
                                {net.recommended ? "Recommandé" : "Marquer recommandé"}
                              </span>
                            </button>
                            {cfg.networks.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeNetwork(slug, idx)}
                                className="text-[#FF3B30] p-1 rounded hover:bg-[#FF3B30]/10"
                                aria-label="Supprimer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <Label className="text-xs text-[#8E8E93]">SSID</Label>
                              <Input
                                value={net.ssid}
                                onChange={(e) =>
                                  updateNetwork(slug, idx, { ssid: e.target.value })
                                }
                                placeholder="Nom du réseau"
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-[#8E8E93]">
                                Mot de passe
                              </Label>
                              <div className="relative mt-1">
                                <Input
                                  type={visible ? "text" : "password"}
                                  value={net.password}
                                  onChange={(e) =>
                                    updateNetwork(slug, idx, {
                                      password: e.target.value,
                                    })
                                  }
                                  className="pr-9 font-mono"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    setShowPasswords((p) => ({
                                      ...p,
                                      [pwKey]: !visible,
                                    }))
                                  }
                                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8E8E93] hover:text-[#1D1D1F]"
                                >
                                  {visible ? (
                                    <EyeOff className="w-4 h-4" />
                                  ) : (
                                    <Eye className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                            </div>
                            <div>
                              <Label className="text-xs text-[#8E8E93]">Libellé</Label>
                              <Input
                                value={net.label}
                                onChange={(e) =>
                                  updateNetwork(slug, idx, { label: e.target.value })
                                }
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-[#8E8E93]">
                                Sécurité
                              </Label>
                              <Input
                                value={net.security}
                                onChange={(e) =>
                                  updateNetwork(slug, idx, {
                                    security: e.target.value,
                                  })
                                }
                                placeholder="WPA"
                                className="mt-1"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <Label className="text-xs text-[#8E8E93]">
                                Description
                              </Label>
                              <Input
                                value={net.description}
                                onChange={(e) =>
                                  updateNetwork(slug, idx, {
                                    description: e.target.value,
                                  })
                                }
                                className="mt-1"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Branding (advanced) */}
                  <Accordion type="single" collapsible>
                    <AccordionItem value="branding" className="border-0">
                      <AccordionTrigger className="text-sm text-[#8E8E93] hover:no-underline py-2">
                        Branding & textes
                      </AccordionTrigger>
                      <AccordionContent className="space-y-3 pt-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs text-[#8E8E93]">
                              Nom de marque
                            </Label>
                            <Input
                              value={cfg.brandName}
                              onChange={(e) =>
                                updateDraft(slug, { brandName: e.target.value })
                              }
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-[#8E8E93]">
                              Suite (optionnel)
                            </Label>
                            <Input
                              value={cfg.suiteName ?? ""}
                              onChange={(e) =>
                                updateDraft(slug, {
                                  suiteName: e.target.value || undefined,
                                })
                              }
                              placeholder="Ex: Suite 2"
                              className="mt-1"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <Label className="text-xs text-[#8E8E93]">
                              Sous-titre
                            </Label>
                            <Input
                              value={cfg.subtitle}
                              onChange={(e) =>
                                updateDraft(slug, { subtitle: e.target.value })
                              }
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-[#8E8E93]">
                              Texte de pied
                            </Label>
                            <Input
                              value={cfg.footerText}
                              onChange={(e) =>
                                updateDraft(slug, { footerText: e.target.value })
                              }
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-[#8E8E93]">
                              Tagline pied
                            </Label>
                            <Input
                              value={cfg.footerTagline}
                              onChange={(e) =>
                                updateDraft(slug, {
                                  footerTagline: e.target.value,
                                })
                              }
                              className="mt-1"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <Label className="text-xs text-[#8E8E93]">
                              Numéro WhatsApp (concierge)
                            </Label>
                            <Input
                              value={cfg.whatsappNumber ?? ""}
                              onChange={(e) =>
                                updateDraft(slug, {
                                  whatsappNumber: e.target.value || undefined,
                                })
                              }
                              placeholder="+212600000000"
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <p className="text-xs text-[#8E8E93] text-center mt-6">
          Les changements sont diffusés instantanément aux pages /wifi/:slug ouvertes.
        </p>
      </div>
    </div>
  );
}
