/**
 * useStoryAnalytics - Hook pour gérer les analytics des stories
 */

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface StoryStats {
  total_views: number;
  complete_views: number;
  whatsapp_clicks: number;
  email_clicks: number;
  avg_duration_ms: number;
  completion_rate: number;
}

interface UseStoryAnalyticsReturn {
  stats: Record<string, StoryStats>;
  loading: boolean;
  fetchStats: (storyIds: string[]) => Promise<void>;
  trackEvent: (storyId: string, eventType: 'view' | 'whatsapp_click' | 'email_click' | 'complete_view', durationMs?: number) => Promise<void>;
}

// Detect device type
function getDeviceType(): string {
  const ua = navigator.userAgent;
  if (/mobile/i.test(ua)) return 'mobile';
  if (/tablet/i.test(ua)) return 'tablet';
  return 'desktop';
}

export function useStoryAnalytics(): UseStoryAnalyticsReturn {
  const [stats, setStats] = useState<Record<string, StoryStats>>({});
  const [loading, setLoading] = useState(false);

  const fetchStats = useCallback(async (storyIds: string[]) => {
    if (storyIds.length === 0) return;

    setLoading(true);
    try {
      const statsPromises = storyIds.map(async (storyId) => {
        const { data, error } = await supabase.rpc('get_story_stats', {
          p_story_id: storyId
        });

        if (error) {
          console.error('Error fetching story stats:', error);
          return { storyId, stats: null };
        }

        return { storyId, stats: data as unknown as StoryStats };
      });

      const results = await Promise.all(statsPromises);
      
      const newStats: Record<string, StoryStats> = {};
      results.forEach(({ storyId, stats }) => {
        if (stats) {
          newStats[storyId] = stats;
        }
      });

      setStats(newStats);
    } catch (error) {
      console.error('Error fetching story analytics:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const trackEvent = useCallback(async (
    storyId: string, 
    eventType: 'view' | 'whatsapp_click' | 'email_click' | 'complete_view',
    durationMs?: number
  ) => {
    try {
      const { error } = await supabase.rpc('track_story_event', {
        p_story_id: storyId,
        p_event_type: eventType,
        p_duration_ms: durationMs || null,
        p_device_type: getDeviceType()
      });

      if (error) {
        console.error('Error tracking story event:', error);
      }
    } catch (error) {
      console.error('Error tracking story event:', error);
    }
  }, []);

  return {
    stats,
    loading,
    fetchStats,
    trackEvent
  };
}

/**
 * Format duration in ms to human readable string
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  const seconds = Math.round(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}
