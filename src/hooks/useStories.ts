/**
 * useStories - Hook pour gérer les stories d'une carte
 */

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Story {
  id: string;
  card_id: string;
  content_type: "image" | "text";
  image_url?: string;
  text_content?: string;
  text_background_color?: string;
  created_at: string;
  expires_at: string;
  view_count: number;
  is_active: boolean;
}

export function useStories(cardId?: string) {
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStory = useCallback(async () => {
    if (!cardId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("card_stories")
        .select("*")
        .eq("card_id", cardId)
        .eq("is_active", true)
        .gt("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (fetchError) throw fetchError;

      setStory(data as Story | null);
      setError(null);
    } catch (err) {
      console.error("Error fetching story:", err);
      setError("Erreur lors du chargement de la story");
      setStory(null);
    } finally {
      setLoading(false);
    }
  }, [cardId]);

  useEffect(() => {
    fetchStory();
  }, [fetchStory]);

  const updateStory = useCallback((newStory: Story | null) => {
    setStory(newStory);
  }, []);

  return {
    story,
    loading,
    error,
    refetch: fetchStory,
    updateStory,
  };
}

/**
 * usePublicStory - Hook pour récupérer la story active d'une carte publique
 */
export function usePublicStory(cardId?: string) {
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cardId) {
      setLoading(false);
      return;
    }

    const fetchPublicStory = async () => {
      try {
        const { data, error } = await supabase
          .from("card_stories")
          .select("*")
          .eq("card_id", cardId)
          .eq("is_active", true)
          .gt("expires_at", new Date().toISOString())
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) throw error;
        setStory(data as Story | null);
      } catch (err) {
        console.error("Error fetching public story:", err);
        setStory(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicStory();
  }, [cardId]);

  return { story, loading };
}
