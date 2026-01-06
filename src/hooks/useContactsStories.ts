/**
 * useContactsStories - Hook pour récupérer les stories des contacts/leads
 * Récupère les cartes qui ont des stories actives
 */

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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
}

interface CardWithStories {
  id: string;
  firstName: string;
  lastName: string;
  photoUrl?: string;
  whatsappNumber?: string;
  email?: string;
  stories: Story[];
  company?: string;
}

export function useContactsStories() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<CardWithStories[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContactsWithStories = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // 1. Récupérer toutes les stories actives
      const { data: storiesData, error: storiesError } = await supabase
        .from("card_stories")
        .select(`
          id,
          card_id,
          content_type,
          image_url,
          text_content,
          text_background_color,
          created_at,
          expires_at,
          view_count
        `)
        .eq("is_active", true)
        .gt("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false });

      if (storiesError) throw storiesError;

      if (!storiesData || storiesData.length === 0) {
        setContacts([]);
        setLoading(false);
        return;
      }

      // 2. Obtenir les card_ids uniques
      const cardIds = [...new Set(storiesData.map((s) => s.card_id))];

      // 3. Récupérer les infos des cartes
      const { data: cardsData, error: cardsError } = await supabase
        .from("digital_cards")
        .select(`
          id,
          first_name,
          last_name,
          photo_url,
          whatsapp,
          email,
          company
        `)
        .in("id", cardIds)
        .eq("is_active", true);

      if (cardsError) throw cardsError;

      // 4. Grouper les stories par carte
      const storiesByCard = new Map<string, Story[]>();
      storiesData.forEach((story) => {
        const existing = storiesByCard.get(story.card_id) || [];
        existing.push({
          id: story.id,
          card_id: story.card_id,
          content_type: story.content_type as "image" | "text",
          image_url: story.image_url || undefined,
          text_content: story.text_content || undefined,
          text_background_color: story.text_background_color || undefined,
          created_at: story.created_at,
          expires_at: story.expires_at,
          view_count: story.view_count || 0,
        });
        storiesByCard.set(story.card_id, existing);
      });

      // 5. Construire les contacts avec stories
      const contactsWithStories: CardWithStories[] = (cardsData || [])
        .map((card) => ({
          id: card.id,
          firstName: card.first_name,
          lastName: card.last_name,
          photoUrl: card.photo_url || undefined,
          whatsappNumber: card.whatsapp || undefined,
          email: card.email || undefined,
          company: card.company || undefined,
          stories: storiesByCard.get(card.id) || [],
        }))
        .filter((c) => c.stories.length > 0)
        .sort((a, b) => {
          // Trier par story la plus récente
          const aLatest = new Date(a.stories[0].created_at).getTime();
          const bLatest = new Date(b.stories[0].created_at).getTime();
          return bLatest - aLatest;
        });

      setContacts(contactsWithStories);
      setError(null);
    } catch (err) {
      console.error("Error fetching contacts stories:", err);
      setError("Erreur lors du chargement des stories");
      setContacts([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchContactsWithStories();
  }, [fetchContactsWithStories]);

  return {
    contacts,
    loading,
    error,
    refetch: fetchContactsWithStories,
    hasStories: contacts.length > 0,
  };
}

/**
 * useOwnStories - Hook pour récupérer les stories de l'utilisateur connecté
 */
export function useOwnStories() {
  const { user } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [cardInfo, setCardInfo] = useState<{
    id: string;
    photoUrl?: string;
    firstName: string;
    lastName: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOwnStories = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // 1. Récupérer la carte principale de l'utilisateur
      const { data: cardData, error: cardError } = await supabase
        .from("digital_cards")
        .select("id, first_name, last_name, photo_url")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (cardError && cardError.code !== "PGRST116") {
        throw cardError;
      }

      if (!cardData) {
        setLoading(false);
        return;
      }

      setCardInfo({
        id: cardData.id,
        photoUrl: cardData.photo_url || undefined,
        firstName: cardData.first_name,
        lastName: cardData.last_name,
      });

      // 2. Récupérer les stories de cette carte
      const { data: storiesData, error: storiesError } = await supabase
        .from("card_stories")
        .select("*")
        .eq("card_id", cardData.id)
        .eq("is_active", true)
        .gt("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false });

      if (storiesError) throw storiesError;

      setStories(
        (storiesData || []).map((s) => ({
          id: s.id,
          card_id: s.card_id,
          content_type: s.content_type as "image" | "text",
          image_url: s.image_url || undefined,
          text_content: s.text_content || undefined,
          text_background_color: s.text_background_color || undefined,
          created_at: s.created_at,
          expires_at: s.expires_at,
          view_count: s.view_count || 0,
        }))
      );
    } catch (err) {
      console.error("Error fetching own stories:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchOwnStories();
  }, [fetchOwnStories]);

  return {
    stories,
    cardInfo,
    loading,
    refetch: fetchOwnStories,
    hasStories: stories.length > 0,
  };
}
