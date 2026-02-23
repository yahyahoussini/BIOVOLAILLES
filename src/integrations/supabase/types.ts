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
      cooperative: {
        Row: {
          certification_number: string | null
          created_at: string
          gps_lat: number | null
          gps_lng: number | null
          id: string
          location: string | null
          manager_name: string | null
          name: string
          photo_url: string | null
        }
        Insert: {
          certification_number?: string | null
          created_at?: string
          gps_lat?: number | null
          gps_lng?: number | null
          id?: string
          location?: string | null
          manager_name?: string | null
          name: string
          photo_url?: string | null
        }
        Update: {
          certification_number?: string | null
          created_at?: string
          gps_lat?: number | null
          gps_lng?: number | null
          id?: string
          location?: string | null
          manager_name?: string | null
          name?: string
          photo_url?: string | null
        }
        Relationships: []
      }
      flock: {
        Row: {
          arrival_date: string
          breed: string
          breed_photo_url: string | null
          cooperative_id: string
          created_at: string
          feed_type: string | null
          id: string
          quantity_hens: number
          quantity_males: number
        }
        Insert: {
          arrival_date?: string
          breed: string
          breed_photo_url?: string | null
          cooperative_id: string
          created_at?: string
          feed_type?: string | null
          id?: string
          quantity_hens?: number
          quantity_males?: number
        }
        Update: {
          arrival_date?: string
          breed?: string
          breed_photo_url?: string | null
          cooperative_id?: string
          created_at?: string
          feed_type?: string | null
          id?: string
          quantity_hens?: number
          quantity_males?: number
        }
        Relationships: [
          {
            foreignKeyName: "flock_cooperative_id_fkey"
            columns: ["cooperative_id"]
            isOneToOne: false
            referencedRelation: "cooperative"
            referencedColumns: ["id"]
          },
        ]
      }
      livestock: {
        Row: {
          id: string
          cooperative_id: string
          animal_type: string
          breed: string
          quantity: number
          weight_avg_kg: number | null
          feed_type: string | null
          arrival_date: string
          created_at: string
        }
        Insert: {
          id?: string
          cooperative_id: string
          animal_type: string
          breed: string
          quantity?: number
          weight_avg_kg?: number | null
          feed_type?: string | null
          arrival_date?: string
          created_at?: string
        }
        Update: {
          id?: string
          cooperative_id?: string
          animal_type?: string
          breed?: string
          quantity?: number
          weight_avg_kg?: number | null
          feed_type?: string | null
          arrival_date?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "livestock_cooperative_id_fkey"
            columns: ["cooperative_id"]
            isOneToOne: false
            referencedRelation: "cooperative"
            referencedColumns: ["id"]
          },
        ]
      }
      incubation_batch: {
        Row: {
          created_at: string
          flock_id: string
          hatch_date: string
          hatch_rate: number | null
          id: string
          poussin_count: number | null
        }
        Insert: {
          created_at?: string
          flock_id: string
          hatch_date?: string
          hatch_rate?: number | null
          id?: string
          poussin_count?: number | null
        }
        Update: {
          created_at?: string
          flock_id?: string
          hatch_date?: string
          hatch_rate?: number | null
          id?: string
          poussin_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "incubation_batch_flock_id_fkey"
            columns: ["flock_id"]
            isOneToOne: false
            referencedRelation: "flock"
            referencedColumns: ["id"]
          },
        ]
      }
      packaging_batch: {
        Row: {
          batch_ref: string
          created_at: string
          expiry_date: string | null
          flock_id: string
          grade: string | null
          id: string
          onssa_number: string | null
          package_date: string
          qr_code_url: string | null
          quantity_eggs: number
          scan_count: number
        }
        Insert: {
          batch_ref: string
          created_at?: string
          expiry_date?: string | null
          flock_id: string
          grade?: string | null
          id?: string
          onssa_number?: string | null
          package_date?: string
          qr_code_url?: string | null
          quantity_eggs?: number
          scan_count?: number
        }
        Update: {
          batch_ref?: string
          created_at?: string
          expiry_date?: string | null
          flock_id?: string
          grade?: string | null
          id?: string
          onssa_number?: string | null
          package_date?: string
          qr_code_url?: string | null
          quantity_eggs?: number
          scan_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "packaging_batch_flock_id_fkey"
            columns: ["flock_id"]
            isOneToOne: false
            referencedRelation: "flock"
            referencedColumns: ["id"]
          },
        ]
      }
      production_log: {
        Row: {
          collection_date: string
          created_at: string
          feed_type: string | null
          flock_id: string
          id: string
          vet_check_passed: boolean | null
        }
        Insert: {
          collection_date?: string
          created_at?: string
          feed_type?: string | null
          flock_id: string
          id?: string
          vet_check_passed?: boolean | null
        }
        Update: {
          collection_date?: string
          created_at?: string
          feed_type?: string | null
          flock_id?: string
          id?: string
          vet_check_passed?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "production_log_flock_id_fkey"
            columns: ["flock_id"]
            isOneToOne: false
            referencedRelation: "flock"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          approved: boolean
          cooperative_id: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          approved?: boolean
          cooperative_id?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          approved?: boolean
          cooperative_id?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_cooperative_id_fkey"
            columns: ["cooperative_id"]
            isOneToOne: false
            referencedRelation: "cooperative"
            referencedColumns: ["id"]
          },
        ]
      }
      scan_log: {
        Row: {
          batch_ref: string
          id: string
          ip_address: string | null
          region: string | null
          scanned_at: string | null
        }
        Insert: {
          batch_ref: string
          id?: string
          ip_address?: string | null
          region?: string | null
          scanned_at?: string | null
        }
        Update: {
          batch_ref?: string
          id?: string
          ip_address?: string | null
          region?: string | null
          scanned_at?: string | null
        }
        Relationships: []
      }
      slaughter_batch: {
        Row: {
          batch_ref: string
          created_at: string
          flock_id: string | null
          livestock_id: string | null
          id: string
          qr_code_url: string | null
          quantity_birds: number
          slaughter_date: string
          total_kg: number
        }
        Insert: {
          batch_ref: string
          created_at?: string
          flock_id?: string | null
          livestock_id?: string | null
          id?: string
          qr_code_url?: string | null
          quantity_birds?: number
          slaughter_date?: string
          total_kg?: number
        }
        Update: {
          batch_ref?: string
          created_at?: string
          flock_id?: string | null
          livestock_id?: string | null
          id?: string
          qr_code_url?: string | null
          quantity_birds?: number
          slaughter_date?: string
          total_kg?: number
        }
        Relationships: [
          {
            foreignKeyName: "slaughter_batch_flock_id_fkey"
            columns: ["flock_id"]
            isOneToOne: false
            referencedRelation: "flock"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "slaughter_batch_livestock_id_fkey"
            columns: ["livestock_id"]
            isOneToOne: false
            referencedRelation: "livestock"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_all_users_admin: {
        Args: never
        Returns: {
          cooperative_id: string
          created_at: string
          email: string
          full_name: string
          id: string
          role: string
        }[]
      }
      get_user_cooperative_id: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_scan_count: {
        Args: { batch_ref_input: string }
        Returns: number
      }
      set_user_cooperative_admin: {
        Args: { new_coop_id: string; target_user_id: string }
        Returns: undefined
      }
      set_user_role_admin: {
        Args: {
          new_role: Database["public"]["Enums"]["app_role"]
          target_user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role:
      | "super_admin"
      | "cooperative_manager"
      | "hatchery_tech"
      | "conditioning_operator"
      | "abattoir_operator"
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
      app_role: [
        "super_admin",
        "cooperative_manager",
        "hatchery_tech",
        "conditioning_operator",
        "abattoir_operator",
      ],
    },
  },
} as const
