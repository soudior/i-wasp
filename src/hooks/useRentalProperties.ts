/**
 * Hook pour gérer les propriétés de location
 * CRUD complet avec synchronisation Supabase
 */

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface RentalProperty {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  price_per_night: number;
  currency: string;
  address: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  photos: string[];
  booking_url: string | null;
  airbnb_url: string | null;
  airbnb_ical_url: string | null;
  booking_ical_url: string | null;
  whatsapp_number: string | null;
  wifi_ssid: string | null;
  wifi_password: string | null;
  amenities: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreatePropertyInput {
  name: string;
  description?: string;
  price_per_night: number;
  currency?: string;
  address?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  photos?: string[];
  booking_url?: string;
  airbnb_url?: string;
  airbnb_ical_url?: string;
  booking_ical_url?: string;
  whatsapp_number?: string;
  wifi_ssid?: string;
  wifi_password?: string;
  amenities?: string[];
}

export interface UpdatePropertyInput extends Partial<CreatePropertyInput> {
  is_active?: boolean;
}

export function useRentalProperties() {
  const { user } = useAuth();
  const [properties, setProperties] = useState<RentalProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all properties for the current user
  const fetchProperties = useCallback(async () => {
    if (!user) {
      setProperties([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("rental_properties")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      setProperties(data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching properties:", err);
      setError("Impossible de charger les propriétés");
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Create a new property
  const createProperty = useCallback(async (input: CreatePropertyInput): Promise<RentalProperty | null> => {
    if (!user) {
      toast.error("Vous devez être connecté");
      return null;
    }

    try {
      const { data, error: insertError } = await supabase
        .from("rental_properties")
        .insert({
          user_id: user.id,
          name: input.name,
          description: input.description || null,
          price_per_night: input.price_per_night,
          currency: input.currency || "MAD",
          address: input.address || null,
          city: input.city || null,
          latitude: input.latitude || null,
          longitude: input.longitude || null,
          photos: input.photos || [],
          booking_url: input.booking_url || null,
          airbnb_url: input.airbnb_url || null,
          whatsapp_number: input.whatsapp_number || null,
          wifi_ssid: input.wifi_ssid || null,
          wifi_password: input.wifi_password || null,
          amenities: input.amenities || [],
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setProperties(prev => [data, ...prev]);
      toast.success("Propriété créée avec succès");
      return data;
    } catch (err) {
      console.error("Error creating property:", err);
      toast.error("Erreur lors de la création");
      return null;
    }
  }, [user]);

  // Update a property
  const updateProperty = useCallback(async (
    id: string, 
    input: UpdatePropertyInput
  ): Promise<RentalProperty | null> => {
    if (!user) {
      toast.error("Vous devez être connecté");
      return null;
    }

    try {
      const { data, error: updateError } = await supabase
        .from("rental_properties")
        .update({
          ...input,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (updateError) throw updateError;

      setProperties(prev => 
        prev.map(p => p.id === id ? data : p)
      );
      toast.success("Propriété mise à jour");
      return data;
    } catch (err) {
      console.error("Error updating property:", err);
      toast.error("Erreur lors de la mise à jour");
      return null;
    }
  }, [user]);

  // Delete a property
  const deleteProperty = useCallback(async (id: string): Promise<boolean> => {
    if (!user) {
      toast.error("Vous devez être connecté");
      return false;
    }

    try {
      const { error: deleteError } = await supabase
        .from("rental_properties")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (deleteError) throw deleteError;

      setProperties(prev => prev.filter(p => p.id !== id));
      toast.success("Propriété supprimée");
      return true;
    } catch (err) {
      console.error("Error deleting property:", err);
      toast.error("Erreur lors de la suppression");
      return false;
    }
  }, [user]);

  // Fetch on mount and when user changes
  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return {
    properties,
    loading,
    error,
    createProperty,
    updateProperty,
    deleteProperty,
    refetch: fetchProperties,
  };
}

// Hook to fetch a single property by ID (public access for NFC cards)
export function usePublicProperty(propertyId: string | undefined) {
  const [property, setProperty] = useState<RentalProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!propertyId) {
      setLoading(false);
      return;
    }

    const fetchProperty = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from("rental_properties")
          .select("*")
          .eq("id", propertyId)
          .eq("is_active", true)
          .maybeSingle();

        if (fetchError) throw fetchError;

        setProperty(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching property:", err);
        setError("Propriété introuvable");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  return { property, loading, error };
}
