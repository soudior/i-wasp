/**
 * useWifiConfig - Real-time Wi-Fi configuration loader
 *
 * Fetches a single Wi-Fi config by slug from Supabase and subscribes
 * to live changes so any update from the admin dashboard is reflected
 * instantly on the public /wifi/:slug pages.
 */

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { PropertyConfig, WifiNetwork } from "@/config/wifiProperties";
import { getPropertyBySlug } from "@/config/wifiProperties";

type Row = {
  slug: string;
  brand_name: string;
  suite_name: string | null;
  subtitle: string;
  footer_text: string;
  footer_tagline: string;
  whatsapp_number: string | null;
  networks: WifiNetwork[] | unknown;
};

const rowToConfig = (row: Row): PropertyConfig => ({
  slug: row.slug,
  brandName: row.brand_name,
  suiteName: row.suite_name ?? undefined,
  subtitle: row.subtitle,
  footerText: row.footer_text,
  footerTagline: row.footer_tagline,
  whatsappNumber: row.whatsapp_number ?? undefined,
  networks: Array.isArray(row.networks) ? (row.networks as WifiNetwork[]) : [],
});

export function useWifiConfig(slug: string | undefined) {
  const [config, setConfig] = useState<PropertyConfig | undefined>(() =>
    slug ? getPropertyBySlug(slug) : undefined
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      const { data, error } = await supabase
        .from("wifi_configs")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (cancelled) return;

      if (!error && data) {
        setConfig(rowToConfig(data as Row));
      } else {
        // Fallback to static config
        setConfig(getPropertyBySlug(slug));
      }
      setLoading(false);
    };

    load();

    const channel = supabase
      .channel(`wifi_config_${slug}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "wifi_configs",
          filter: `slug=eq.${slug}`,
        },
        (payload) => {
          if (payload.eventType === "DELETE") {
            setConfig(getPropertyBySlug(slug));
          } else if (payload.new) {
            setConfig(rowToConfig(payload.new as Row));
          }
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [slug]);

  return { config, loading };
}

export function useAllWifiConfigs() {
  const [configs, setConfigs] = useState<PropertyConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const { data, error } = await supabase
        .from("wifi_configs")
        .select("*")
        .order("brand_name");

      if (cancelled) return;
      if (!error && data) {
        setConfigs((data as Row[]).map(rowToConfig));
      }
      setLoading(false);
    };

    load();

    const channel = supabase
      .channel("wifi_configs_all")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "wifi_configs" },
        () => load()
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, []);

  return { configs, loading, reload: () => setLoading(true) };
}
