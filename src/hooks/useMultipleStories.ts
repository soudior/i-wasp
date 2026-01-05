/**
 * useMultipleStories - Hook pour gérer plusieurs stories d'une carte
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

export function useMultipleStories(cardId?: string) {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStories = useCallback(async () => {
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
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      setStories((data as Story[]) || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching stories:", err);
      setError("Erreur lors du chargement des stories");
      setStories([]);
    } finally {
      setLoading(false);
    }
  }, [cardId]);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  const addStory = useCallback((newStory: Story) => {
    setStories((prev) => [newStory, ...prev]);
  }, []);

  const removeStory = useCallback((storyId: string) => {
    setStories((prev) => prev.filter((s) => s.id !== storyId));
  }, []);

  return {
    stories,
    loading,
    error,
    refetch: fetchStories,
    addStory,
    removeStory,
    hasStories: stories.length > 0,
  };
}

/**
 * usePublicMultipleStories - Hook pour récupérer les stories actives d'une carte publique
 */
export function usePublicMultipleStories(cardId?: string) {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cardId) {
      setLoading(false);
      return;
    }

    const fetchPublicStories = async () => {
      try {
        const { data, error } = await supabase
          .from("card_stories")
          .select("*")
          .eq("card_id", cardId)
          .eq("is_active", true)
          .gt("expires_at", new Date().toISOString())
          .order("created_at", { ascending: false });

        if (error) throw error;
        setStories((data as Story[]) || []);
      } catch (err) {
        console.error("Error fetching public stories:", err);
        setStories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicStories();
  }, [cardId]);

  return { stories, loading, hasStories: stories.length > 0 };
}
