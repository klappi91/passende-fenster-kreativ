// Generated via mcp__supabase-db__generate_typescript_types (project: fvafvfhdrbziivlbuuqn)
// Re-generate with: npx supabase gen types typescript --project-id fvafvfhdrbziivlbuuqn
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      addition_categories: {
        Row: { code: string; id: number; name: string | null; sort_order: number | null }
        Insert: { code: string; id?: number; name?: string | null; sort_order?: number | null }
        Update: { code?: string; id?: number; name?: string | null; sort_order?: number | null }
        Relationships: []
      }
      article_addition_variant_property_values: {
        Row: { addition_variant_id: number; position: number | null; property_value_id: number }
        Insert: { addition_variant_id: number; position?: number | null; property_value_id: number }
        Update: { addition_variant_id?: number; position?: number | null; property_value_id?: number }
        Relationships: []
      }
      article_addition_variants: {
        Row: {
          addition_id: number
          created_at: string | null
          external_id: number
          id: number
          is_default: boolean | null
          price_cents: number | null
          price_old_cents: number | null
        }
        Insert: {
          addition_id: number
          created_at?: string | null
          external_id: number
          id?: number
          is_default?: boolean | null
          price_cents?: number | null
          price_old_cents?: number | null
        }
        Update: {
          addition_id?: number
          created_at?: string | null
          external_id?: number
          id?: number
          is_default?: boolean | null
          price_cents?: number | null
          price_old_cents?: number | null
        }
        Relationships: []
      }
      article_additions: {
        Row: {
          article_id: number
          category_id: number
          external_id: number
          id: number
          image_storage_path: string | null
          is_default: boolean | null
          name: string
          price_cents: number | null
          price_old_cents: number | null
          sort_order: number | null
          type_name: string | null
        }
        Insert: {
          article_id: number
          category_id: number
          external_id: number
          id?: number
          image_storage_path?: string | null
          is_default?: boolean | null
          name: string
          price_cents?: number | null
          price_old_cents?: number | null
          sort_order?: number | null
          type_name?: string | null
        }
        Update: {
          article_id?: number
          category_id?: number
          external_id?: number
          id?: number
          image_storage_path?: string | null
          is_default?: boolean | null
          name?: string
          price_cents?: number | null
          price_old_cents?: number | null
          sort_order?: number | null
          type_name?: string | null
        }
        Relationships: []
      }
      article_group_mappings: {
        Row: {
          article_id: number
          created_at: string | null
          group_id: number
          id: number
          qlein_article_id: number
        }
        Insert: {
          article_id: number
          created_at?: string | null
          group_id: number
          id?: number
          qlein_article_id: number
        }
        Update: {
          article_id?: number
          created_at?: string | null
          group_id?: number
          id?: number
          qlein_article_id?: number
        }
        Relationships: []
      }
      article_images: {
        Row: {
          article_id: number | null
          id: number
          metadata: Json | null
          sort_order: number | null
          source_url: string | null
          storage_path: string
          type: string
        }
        Insert: {
          article_id?: number | null
          id?: number
          metadata?: Json | null
          sort_order?: number | null
          source_url?: string | null
          storage_path: string
          type: string
        }
        Update: {
          article_id?: number | null
          id?: number
          metadata?: Json | null
          sort_order?: number | null
          source_url?: string | null
          storage_path?: string
          type?: string
        }
        Relationships: []
      }
      article_price_points: {
        Row: {
          article_id: number
          base_price_cents: number
          group_id: number
          height_mm: number
          id: number
          scraped_at: string | null
          width_mm: number
        }
        Insert: {
          article_id: number
          base_price_cents: number
          group_id: number
          height_mm: number
          id?: number
          scraped_at?: string | null
          width_mm: number
        }
        Update: {
          article_id?: number
          base_price_cents?: number
          group_id?: number
          height_mm?: number
          id?: number
          scraped_at?: string | null
          width_mm?: number
        }
        Relationships: []
      }
      article_properties: {
        Row: {
          article_id: number
          external_id: number | null
          icon: string | null
          id: number
          is_main: boolean | null
          name: string
          short_name: string
          sort_order: number | null
          unit: string | null
          value: string
        }
        Insert: {
          article_id: number
          external_id?: number | null
          icon?: string | null
          id?: number
          is_main?: boolean | null
          name: string
          short_name: string
          sort_order?: number | null
          unit?: string | null
          value: string
        }
        Update: {
          article_id?: number
          external_id?: number | null
          icon?: string | null
          id?: number
          is_main?: boolean | null
          name?: string
          short_name?: string
          sort_order?: number | null
          unit?: string | null
          value?: string
        }
        Relationships: []
      }
      article_variant_property_values: {
        Row: { position: number | null; property_value_id: number; variant_id: number }
        Insert: { position?: number | null; property_value_id: number; variant_id: number }
        Update: { position?: number | null; property_value_id?: number; variant_id?: number }
        Relationships: []
      }
      article_variants: {
        Row: {
          article_id: number
          created_at: string | null
          external_id: number
          id: number
          is_default: boolean | null
          price_cents: number | null
        }
        Insert: {
          article_id: number
          created_at?: string | null
          external_id: number
          id?: number
          is_default?: boolean | null
          price_cents?: number | null
        }
        Update: {
          article_id?: number
          created_at?: string | null
          external_id?: number
          id?: number
          is_default?: boolean | null
          price_cents?: number | null
        }
        Relationships: []
      }
      articles: {
        Row: {
          brand_id: number
          created_at: string | null
          datasheet_url: string | null
          description: string | null
          external_id: number | null
          id: number
          name: string
          profile_depth: number | null
          slug: string
          updated_at: string | null
          uw_value: number | null
        }
        Insert: {
          brand_id: number
          created_at?: string | null
          datasheet_url?: string | null
          description?: string | null
          external_id?: number | null
          id?: number
          name: string
          profile_depth?: number | null
          slug: string
          updated_at?: string | null
          uw_value?: number | null
        }
        Update: {
          brand_id?: number
          created_at?: string | null
          datasheet_url?: string | null
          description?: string | null
          external_id?: number | null
          id?: number
          name?: string
          profile_depth?: number | null
          slug?: string
          updated_at?: string | null
          uw_value?: number | null
        }
        Relationships: []
      }
      brands: {
        Row: {
          created_at: string | null
          external_id: number | null
          id: number
          logo_url: string | null
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          external_id?: number | null
          id?: number
          logo_url?: string | null
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          external_id?: number | null
          id?: number
          logo_url?: string | null
          name?: string
          slug?: string
        }
        Relationships: []
      }
      delivery_time_rules: {
        Row: {
          description: string
          id: number
          match_criteria: Json
          sort_order: number | null
          weeks_max: number
          weeks_min: number
        }
        Insert: {
          description: string
          id?: number
          match_criteria: Json
          sort_order?: number | null
          weeks_max: number
          weeks_min: number
        }
        Update: {
          description?: string
          id?: number
          match_criteria?: Json
          sort_order?: number | null
          weeks_max?: number
          weeks_min?: number
        }
        Relationships: []
      }
      groups: {
        Row: {
          category: number
          external_id: number | null
          id: number
          name: string
          shape_configuration: Json
          sort_order: number | null
        }
        Insert: {
          category: number
          external_id?: number | null
          id?: number
          name: string
          shape_configuration: Json
          sort_order?: number | null
        }
        Update: {
          category?: number
          external_id?: number | null
          id?: number
          name?: string
          shape_configuration?: Json
          sort_order?: number | null
        }
        Relationships: []
      }
      inquiries: {
        Row: {
          article_id: number | null
          configuration: Json
          contact_email: string
          contact_name: string
          contact_phone: string | null
          created_at: string | null
          group_external_id: number | null
          height_mm: number | null
          id: number
          message: string | null
          order_id: number | null
          shape: string | null
          status: string | null
          total_price_cents: number | null
          width_mm: number | null
        }
        Insert: {
          article_id?: number | null
          configuration: Json
          contact_email: string
          contact_name: string
          contact_phone?: string | null
          created_at?: string | null
          group_external_id?: number | null
          height_mm?: number | null
          id?: number
          message?: string | null
          order_id?: number | null
          shape?: string | null
          status?: string | null
          total_price_cents?: number | null
          width_mm?: number | null
        }
        Update: {
          article_id?: number | null
          configuration?: Json
          contact_email?: string
          contact_name?: string
          contact_phone?: string | null
          created_at?: string | null
          group_external_id?: number | null
          height_mm?: number | null
          id?: number
          message?: string | null
          order_id?: number | null
          shape?: string | null
          status?: string | null
          total_price_cents?: number | null
          width_mm?: number | null
        }
        Relationships: []
      }
      properties: {
        Row: { external_id: number; id: number; name: string; short_name: string }
        Insert: { external_id: number; id?: number; name: string; short_name: string }
        Update: { external_id?: number; id?: number; name?: string; short_name?: string }
        Relationships: []
      }
      property_values: {
        Row: {
          external_id: number
          id: number
          image_storage_path: string | null
          name: string
          position: number | null
          property_id: number
          short_name: string
          value: string
          value_code: string | null
        }
        Insert: {
          external_id: number
          id?: number
          image_storage_path?: string | null
          name: string
          position?: number | null
          property_id: number
          short_name: string
          value: string
          value_code?: string | null
        }
        Update: {
          external_id?: number
          id?: number
          image_storage_path?: string | null
          name?: string
          position?: number | null
          property_id?: number
          short_name?: string
          value?: string
          value_code?: string | null
        }
        Relationships: []
      }
      shapes: {
        Row: { code: string; id: number; name: string }
        Insert: { code: string; id?: number; name: string }
        Update: { code?: string; id?: number; name?: string }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
