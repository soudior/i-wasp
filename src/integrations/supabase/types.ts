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
          email: string | null
          first_name: string
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
          email?: string | null
          first_name: string
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
          email?: string | null
          first_name?: string
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
