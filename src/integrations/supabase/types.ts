export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      alliance_chat: {
        Row: {
          created_at: string
          id: string
          message: string
          name: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          name: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      brand_assets: {
        Row: {
          asset_type: string
          created_at: string
          file_name: string
          file_url: string
          id: string
          is_locked: boolean
          notes: string | null
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          asset_type: string
          created_at?: string
          file_name: string
          file_url: string
          id?: string
          is_locked?: boolean
          notes?: string | null
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          asset_type?: string
          created_at?: string
          file_name?: string
          file_url?: string
          id?: string
          is_locked?: boolean
          notes?: string | null
          updated_at?: string
          uploaded_by?: string | null
        }
        Relationships: []
      }
      card_properties: {
        Row: {
          card_id: string
          created_at: string
          id: string
          property_id: string
        }
        Insert: {
          card_id: string
          created_at?: string
          id?: string
          property_id: string
        }
        Update: {
          card_id?: string
          created_at?: string
          id?: string
          property_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "card_properties_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "digital_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "card_properties_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "public_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "card_properties_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "rental_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      card_scans: {
        Row: {
          card_id: string
          id: string
          ip_address: string | null
          referrer: string | null
          scanned_at: string
          user_agent: string | null
        }
        Insert: {
          card_id: string
          id?: string
          ip_address?: string | null
          referrer?: string | null
          scanned_at?: string
          user_agent?: string | null
        }
        Update: {
          card_id?: string
          id?: string
          ip_address?: string | null
          referrer?: string | null
          scanned_at?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "card_scans_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "digital_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "card_scans_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "public_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      card_stories: {
        Row: {
          card_id: string
          content_type: string
          created_at: string
          expires_at: string
          id: string
          image_url: string | null
          is_active: boolean
          text_background_color: string | null
          text_content: string | null
          view_count: number
        }
        Insert: {
          card_id: string
          content_type?: string
          created_at?: string
          expires_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          text_background_color?: string | null
          text_content?: string | null
          view_count?: number
        }
        Update: {
          card_id?: string
          content_type?: string
          created_at?: string
          expires_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          text_background_color?: string | null
          text_content?: string | null
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "card_stories_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "digital_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "card_stories_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "public_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_requests: {
        Row: {
          admin_notes: string | null
          company: string | null
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          quantity: number | null
          request_type: string
          responded_at: string | null
          status: string
        }
        Insert: {
          admin_notes?: string | null
          company?: string | null
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          quantity?: number | null
          request_type?: string
          responded_at?: string | null
          status?: string
        }
        Update: {
          admin_notes?: string | null
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          quantity?: number | null
          request_type?: string
          responded_at?: string | null
          status?: string
        }
        Relationships: []
      }
      digital_cards: {
        Row: {
          blocks: Json | null
          company: string | null
          created_at: string
          custom_styles: Json | null
          email: string | null
          first_name: string
          hide_branding: boolean
          id: string
          instagram: string | null
          is_active: boolean
          last_name: string
          linkedin: string | null
          location: string | null
          logo_url: string | null
          nfc_enabled: boolean
          phone: string | null
          photo_url: string | null
          slug: string
          social_links: Json | null
          tagline: string | null
          template: string
          title: string | null
          twitter: string | null
          updated_at: string
          user_id: string
          view_count: number
          wallet_enabled: boolean
          website: string | null
          whatsapp: string | null
        }
        Insert: {
          blocks?: Json | null
          company?: string | null
          created_at?: string
          custom_styles?: Json | null
          email?: string | null
          first_name: string
          hide_branding?: boolean
          id?: string
          instagram?: string | null
          is_active?: boolean
          last_name: string
          linkedin?: string | null
          location?: string | null
          logo_url?: string | null
          nfc_enabled?: boolean
          phone?: string | null
          photo_url?: string | null
          slug: string
          social_links?: Json | null
          tagline?: string | null
          template?: string
          title?: string | null
          twitter?: string | null
          updated_at?: string
          user_id: string
          view_count?: number
          wallet_enabled?: boolean
          website?: string | null
          whatsapp?: string | null
        }
        Update: {
          blocks?: Json | null
          company?: string | null
          created_at?: string
          custom_styles?: Json | null
          email?: string | null
          first_name?: string
          hide_branding?: boolean
          id?: string
          instagram?: string | null
          is_active?: boolean
          last_name?: string
          linkedin?: string | null
          location?: string | null
          logo_url?: string | null
          nfc_enabled?: boolean
          phone?: string | null
          photo_url?: string | null
          slug?: string
          social_links?: Json | null
          tagline?: string | null
          template?: string
          title?: string | null
          twitter?: string | null
          updated_at?: string
          user_id?: string
          view_count?: number
          wallet_enabled?: boolean
          website?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          card_id: string
          company: string | null
          consent_given: boolean | null
          consent_timestamp: string | null
          created_at: string
          device_type: string | null
          email: string | null
          id: string
          lead_score: number | null
          location_city: string | null
          location_country: string | null
          message: string | null
          name: string | null
          notes: string | null
          phone: string | null
          source: string | null
          status: string | null
        }
        Insert: {
          card_id: string
          company?: string | null
          consent_given?: boolean | null
          consent_timestamp?: string | null
          created_at?: string
          device_type?: string | null
          email?: string | null
          id?: string
          lead_score?: number | null
          location_city?: string | null
          location_country?: string | null
          message?: string | null
          name?: string | null
          notes?: string | null
          phone?: string | null
          source?: string | null
          status?: string | null
        }
        Update: {
          card_id?: string
          company?: string | null
          consent_given?: boolean | null
          consent_timestamp?: string | null
          created_at?: string
          device_type?: string | null
          email?: string | null
          id?: string
          lead_score?: number | null
          location_city?: string | null
          location_country?: string | null
          message?: string | null
          name?: string | null
          notes?: string | null
          phone?: string | null
          source?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "digital_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "public_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      leads_partenaires: {
        Row: {
          certified_at: string | null
          city: string
          created_at: string
          email: string | null
          id: string
          is_certified: boolean | null
          manicure_stations: number | null
          notes: string | null
          salon_name: string
          status: string
          updated_at: string
          whatsapp: string
        }
        Insert: {
          certified_at?: string | null
          city: string
          created_at?: string
          email?: string | null
          id?: string
          is_certified?: boolean | null
          manicure_stations?: number | null
          notes?: string | null
          salon_name: string
          status?: string
          updated_at?: string
          whatsapp: string
        }
        Update: {
          certified_at?: string | null
          city?: string
          created_at?: string
          email?: string | null
          id?: string
          is_certified?: boolean | null
          manicure_stations?: number | null
          notes?: string | null
          salon_name?: string
          status?: string
          updated_at?: string
          whatsapp?: string
        }
        Relationships: []
      }
      legacy_flags: {
        Row: {
          city: string
          country: string | null
          created_at: string
          id: string
          name: string
          user_id: string | null
          x_position: number
          y_position: number
        }
        Insert: {
          city: string
          country?: string | null
          created_at?: string
          id?: string
          name: string
          user_id?: string | null
          x_position: number
          y_position: number
        }
        Update: {
          city?: string
          country?: string | null
          created_at?: string
          id?: string
          name?: string
          user_id?: string | null
          x_position?: number
          y_position?: number
        }
        Relationships: []
      }
      orders: {
        Row: {
          admin_notes: string | null
          background_color: string | null
          background_image_url: string | null
          background_type: string
          card_color: string
          created_at: string
          currency: string
          customer_email: string | null
          delivered_at: string | null
          id: string
          logo_url: string | null
          order_items: Json
          order_number: string
          order_type: Database["public"]["Enums"]["order_type"]
          paid_at: string | null
          payment_method: string
          print_file_url: string | null
          production_started_at: string | null
          quantity: number
          shipped_at: string | null
          shipping_address: string | null
          shipping_city: string | null
          shipping_country: string | null
          shipping_name: string | null
          shipping_phone: string | null
          shipping_postal_code: string | null
          status: Database["public"]["Enums"]["order_status"]
          template: string
          total_price_cents: number
          tracking_number: string | null
          unit_price_cents: number
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          background_color?: string | null
          background_image_url?: string | null
          background_type?: string
          card_color?: string
          created_at?: string
          currency?: string
          customer_email?: string | null
          delivered_at?: string | null
          id?: string
          logo_url?: string | null
          order_items?: Json
          order_number: string
          order_type?: Database["public"]["Enums"]["order_type"]
          paid_at?: string | null
          payment_method?: string
          print_file_url?: string | null
          production_started_at?: string | null
          quantity?: number
          shipped_at?: string | null
          shipping_address?: string | null
          shipping_city?: string | null
          shipping_country?: string | null
          shipping_name?: string | null
          shipping_phone?: string | null
          shipping_postal_code?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          template?: string
          total_price_cents: number
          tracking_number?: string | null
          unit_price_cents: number
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          background_color?: string | null
          background_image_url?: string | null
          background_type?: string
          card_color?: string
          created_at?: string
          currency?: string
          customer_email?: string | null
          delivered_at?: string | null
          id?: string
          logo_url?: string | null
          order_items?: Json
          order_number?: string
          order_type?: Database["public"]["Enums"]["order_type"]
          paid_at?: string | null
          payment_method?: string
          print_file_url?: string | null
          production_started_at?: string | null
          quantity?: number
          shipped_at?: string | null
          shipping_address?: string | null
          shipping_city?: string | null
          shipping_country?: string | null
          shipping_name?: string | null
          shipping_phone?: string | null
          shipping_postal_code?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          template?: string
          total_price_cents?: number
          tracking_number?: string | null
          unit_price_cents?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      push_notification_logs: {
        Row: {
          body: string
          card_id: string
          created_at: string
          failed_count: number
          id: string
          sent_count: number
          title: string
          user_id: string
        }
        Insert: {
          body: string
          card_id: string
          created_at?: string
          failed_count?: number
          id?: string
          sent_count?: number
          title: string
          user_id: string
        }
        Update: {
          body?: string
          card_id?: string
          created_at?: string
          failed_count?: number
          id?: string
          sent_count?: number
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "push_notification_logs_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "digital_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "push_notification_logs_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "public_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      push_subscriptions: {
        Row: {
          auth_key: string
          card_id: string
          created_at: string
          endpoint: string
          id: string
          is_active: boolean
          last_used_at: string | null
          p256dh_key: string
          user_agent: string | null
        }
        Insert: {
          auth_key: string
          card_id: string
          created_at?: string
          endpoint: string
          id?: string
          is_active?: boolean
          last_used_at?: string | null
          p256dh_key: string
          user_agent?: string | null
        }
        Update: {
          auth_key?: string
          card_id?: string
          created_at?: string
          endpoint?: string
          id?: string
          is_active?: boolean
          last_used_at?: string | null
          p256dh_key?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "push_subscriptions_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "digital_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "push_subscriptions_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "public_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      rental_properties: {
        Row: {
          address: string | null
          airbnb_ical_url: string | null
          airbnb_url: string | null
          amenities: string[] | null
          booking_ical_url: string | null
          booking_url: string | null
          city: string | null
          created_at: string
          currency: string
          description: string | null
          id: string
          is_active: boolean
          latitude: number | null
          longitude: number | null
          name: string
          photos: string[] | null
          price_per_night: number
          updated_at: string
          user_id: string
          whatsapp_number: string | null
          wifi_password: string | null
          wifi_ssid: string | null
        }
        Insert: {
          address?: string | null
          airbnb_ical_url?: string | null
          airbnb_url?: string | null
          amenities?: string[] | null
          booking_ical_url?: string | null
          booking_url?: string | null
          city?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          is_active?: boolean
          latitude?: number | null
          longitude?: number | null
          name: string
          photos?: string[] | null
          price_per_night?: number
          updated_at?: string
          user_id: string
          whatsapp_number?: string | null
          wifi_password?: string | null
          wifi_ssid?: string | null
        }
        Update: {
          address?: string | null
          airbnb_ical_url?: string | null
          airbnb_url?: string | null
          amenities?: string[] | null
          booking_ical_url?: string | null
          booking_url?: string | null
          city?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          is_active?: boolean
          latitude?: number | null
          longitude?: number | null
          name?: string
          photos?: string[] | null
          price_per_night?: number
          updated_at?: string
          user_id?: string
          whatsapp_number?: string | null
          wifi_password?: string | null
          wifi_ssid?: string | null
        }
        Relationships: []
      }
      story_analytics: {
        Row: {
          created_at: string
          device_type: string | null
          duration_ms: number | null
          event_type: string
          id: string
          story_id: string
        }
        Insert: {
          created_at?: string
          device_type?: string | null
          duration_ms?: number | null
          event_type: string
          id?: string
          story_id: string
        }
        Update: {
          created_at?: string
          device_type?: string | null
          duration_ms?: number | null
          event_type?: string
          id?: string
          story_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_analytics_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "card_stories"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          cancelled_at: string | null
          created_at: string
          currency: string
          expires_at: string | null
          id: string
          notes: string | null
          payment_method: string | null
          plan: string
          price_cents: number
          started_at: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cancelled_at?: string | null
          created_at?: string
          currency?: string
          expires_at?: string | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          plan?: string
          price_cents?: number
          started_at?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cancelled_at?: string | null
          created_at?: string
          currency?: string
          expires_at?: string | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          plan?: string
          price_cents?: number
          started_at?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      template_assignments: {
        Row: {
          assigned_by: string | null
          created_at: string
          id: string
          is_locked: boolean
          notes: string | null
          template_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_by?: string | null
          created_at?: string
          id?: string
          is_locked?: boolean
          notes?: string | null
          template_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_by?: string | null
          created_at?: string
          id?: string
          is_locked?: boolean
          notes?: string | null
          template_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      webhook_configs: {
        Row: {
          created_at: string
          enabled: boolean
          field_mapping: Json | null
          id: string
          name: string
          provider: string
          retry_count: number
          sync_consented_only: boolean
          updated_at: string
          user_id: string
          webhook_url: string
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          field_mapping?: Json | null
          id?: string
          name?: string
          provider?: string
          retry_count?: number
          sync_consented_only?: boolean
          updated_at?: string
          user_id: string
          webhook_url: string
        }
        Update: {
          created_at?: string
          enabled?: boolean
          field_mapping?: Json | null
          id?: string
          name?: string
          provider?: string
          retry_count?: number
          sync_consented_only?: boolean
          updated_at?: string
          user_id?: string
          webhook_url?: string
        }
        Relationships: []
      }
      webhook_logs: {
        Row: {
          attempts: number
          created_at: string
          error_message: string | null
          event_type: string
          id: string
          last_attempt_at: string | null
          lead_id: string | null
          payload: Json | null
          response_status: number | null
          status: string
          user_id: string
          webhook_config_id: string | null
        }
        Insert: {
          attempts?: number
          created_at?: string
          error_message?: string | null
          event_type: string
          id?: string
          last_attempt_at?: string | null
          lead_id?: string | null
          payload?: Json | null
          response_status?: number | null
          status?: string
          user_id: string
          webhook_config_id?: string | null
        }
        Update: {
          attempts?: number
          created_at?: string
          error_message?: string | null
          event_type?: string
          id?: string
          last_attempt_at?: string | null
          lead_id?: string | null
          payload?: Json | null
          response_status?: number | null
          status?: string
          user_id?: string
          webhook_config_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "webhook_logs_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "webhook_logs_webhook_config_id_fkey"
            columns: ["webhook_config_id"]
            isOneToOne: false
            referencedRelation: "webhook_configs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      public_cards: {
        Row: {
          blocks: Json | null
          company: string | null
          first_name: string | null
          has_email: boolean | null
          has_instagram: boolean | null
          has_linkedin: boolean | null
          has_phone: boolean | null
          has_twitter: boolean | null
          has_whatsapp: boolean | null
          id: string | null
          last_name: string | null
          location: string | null
          logo_url: string | null
          photo_url: string | null
          slug: string | null
          social_links: Json | null
          tagline: string | null
          template: string | null
          title: string | null
          website: string | null
        }
        Insert: {
          blocks?: Json | null
          company?: string | null
          first_name?: string | null
          has_email?: never
          has_instagram?: never
          has_linkedin?: never
          has_phone?: never
          has_twitter?: never
          has_whatsapp?: never
          id?: string | null
          last_name?: string | null
          location?: string | null
          logo_url?: string | null
          photo_url?: string | null
          slug?: string | null
          social_links?: Json | null
          tagline?: string | null
          template?: string | null
          title?: string | null
          website?: string | null
        }
        Update: {
          blocks?: Json | null
          company?: string | null
          first_name?: string | null
          has_email?: never
          has_instagram?: never
          has_linkedin?: never
          has_phone?: never
          has_twitter?: never
          has_whatsapp?: never
          id?: string | null
          last_name?: string | null
          location?: string | null
          logo_url?: string | null
          photo_url?: string | null
          slug?: string | null
          social_links?: Json | null
          tagline?: string | null
          template?: string | null
          title?: string | null
          website?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_card_action_url: {
        Args: { p_action: string; p_slug: string }
        Returns: string
      }
      get_public_card: { Args: { p_slug: string }; Returns: Json }
      get_story_stats: { Args: { p_story_id: string }; Returns: Json }
      get_vcard_data: { Args: { p_slug: string }; Returns: Json }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_card_view: { Args: { p_slug: string }; Returns: undefined }
      increment_story_view: { Args: { p_story_id: string }; Returns: undefined }
      is_premium: { Args: { p_user_id: string }; Returns: boolean }
      track_story_event: {
        Args: {
          p_device_type?: string
          p_duration_ms?: number
          p_event_type: string
          p_story_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      order_status:
        | "pending"
        | "paid"
        | "in_production"
        | "shipped"
        | "delivered"
      order_type: "standard" | "personalized"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      order_status: [
        "pending",
        "paid",
        "in_production",
        "shipped",
        "delivered",
      ],
      order_type: ["standard", "personalized"],
    },
  },
} as const
