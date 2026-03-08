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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      diseases: {
        Row: {
          created_at: string
          description: string | null
          disease_category: string
          disease_id: string
          disease_name: string
          inheritance_pattern: string
          omim_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          disease_category: string
          disease_id: string
          disease_name: string
          inheritance_pattern: string
          omim_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          disease_category?: string
          disease_id?: string
          disease_name?: string
          inheritance_pattern?: string
          omim_id?: string | null
        }
        Relationships: []
      }
      functional_categories: {
        Row: {
          category_id: string
          category_name: string
          created_at: string
          description: string | null
        }
        Insert: {
          category_id: string
          category_name: string
          created_at?: string
          description?: string | null
        }
        Update: {
          category_id?: string
          category_name?: string
          created_at?: string
          description?: string | null
        }
        Relationships: []
      }
      gene_category_mappings: {
        Row: {
          category_id: string
          created_at: string
          gene_category_id: string
          gene_id: string
        }
        Insert: {
          category_id: string
          created_at?: string
          gene_category_id: string
          gene_id: string
        }
        Update: {
          category_id?: string
          created_at?: string
          gene_category_id?: string
          gene_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gene_category_mappings_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "functional_categories"
            referencedColumns: ["category_id"]
          },
          {
            foreignKeyName: "gene_category_mappings_gene_id_fkey"
            columns: ["gene_id"]
            isOneToOne: false
            referencedRelation: "genes"
            referencedColumns: ["gene_id"]
          },
        ]
      }
      gene_disease_associations: {
        Row: {
          association_type: string
          created_at: string
          disease_id: string
          gene_disease_id: string
          gene_id: string
        }
        Insert: {
          association_type?: string
          created_at?: string
          disease_id: string
          gene_disease_id: string
          gene_id: string
        }
        Update: {
          association_type?: string
          created_at?: string
          disease_id?: string
          gene_disease_id?: string
          gene_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gene_disease_associations_disease_id_fkey"
            columns: ["disease_id"]
            isOneToOne: false
            referencedRelation: "diseases"
            referencedColumns: ["disease_id"]
          },
          {
            foreignKeyName: "gene_disease_associations_gene_id_fkey"
            columns: ["gene_id"]
            isOneToOne: false
            referencedRelation: "genes"
            referencedColumns: ["gene_id"]
          },
        ]
      }
      genes: {
        Row: {
          created_at: string
          description: string | null
          full_gene_name: string
          gene_id: string
          gene_symbol: string
          gene_type: string
          omim_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          full_gene_name: string
          gene_id: string
          gene_symbol: string
          gene_type?: string
          omim_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          full_gene_name?: string
          gene_id?: string
          gene_symbol?: string
          gene_type?: string
          omim_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      suggestions: {
        Row: {
          admin_notes: string | null
          created_at: string
          disease: string
          gene: string
          id: string
          reference_links: string[] | null
          remarks: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          disease: string
          gene: string
          id?: string
          reference_links?: string[] | null
          remarks?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          disease?: string
          gene?: string
          id?: string
          reference_links?: string[] | null
          remarks?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      whitelist: {
        Row: {
          created_at: string
          email: string
          id: string
          temp_key: string
          used: boolean
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          temp_key?: string
          used?: boolean
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          temp_key?: string
          used?: boolean
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
