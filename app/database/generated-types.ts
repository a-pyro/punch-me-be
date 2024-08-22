export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      businesses: {
        Row: {
          address: string | null
          business_hours: Json | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          id: string
          logo_url: string | null
          name: string
          user_id: string | null
          website_url: string | null
        }
        Insert: {
          address?: string | null
          business_hours?: Json | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name: string
          user_id?: string | null
          website_url?: string | null
        }
        Update: {
          address?: string | null
          business_hours?: Json | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          user_id?: string | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "businesses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      punchcards: {
        Row: {
          business_id: string | null
          created_at: string | null
          description: string | null
          expiration_date: string | null
          id: string
          image_url: string | null
          name: string
          punches_needed: number
          terms_conditions: string | null
          total_punches: number
        }
        Insert: {
          business_id?: string | null
          created_at?: string | null
          description?: string | null
          expiration_date?: string | null
          id?: string
          image_url?: string | null
          name: string
          punches_needed?: number
          terms_conditions?: string | null
          total_punches?: number
        }
        Update: {
          business_id?: string | null
          created_at?: string | null
          description?: string | null
          expiration_date?: string | null
          id?: string
          image_url?: string | null
          name?: string
          punches_needed?: number
          terms_conditions?: string | null
          total_punches?: number
        }
        Relationships: [
          {
            foreignKeyName: "punchcards_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      qr_codes: {
        Row: {
          created_at: string | null
          id: string
          punchcard_id: string | null
          qr_code_data: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          punchcard_id?: string | null
          qr_code_data: string
        }
        Update: {
          created_at?: string | null
          id?: string
          punchcard_id?: string | null
          qr_code_data?: string
        }
        Relationships: [
          {
            foreignKeyName: "qr_codes_punchcard_id_fkey"
            columns: ["punchcard_id"]
            isOneToOne: false
            referencedRelation: "punchcards"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          business_id: string | null
          comment: string | null
          created_at: string | null
          id: string
          punchcard_id: string | null
          rating: number | null
          user_id: string | null
        }
        Insert: {
          business_id?: string | null
          comment?: string | null
          created_at?: string | null
          id?: string
          punchcard_id?: string | null
          rating?: number | null
          user_id?: string | null
        }
        Update: {
          business_id?: string | null
          comment?: string | null
          created_at?: string | null
          id?: string
          punchcard_id?: string | null
          rating?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_punchcard_id_fkey"
            columns: ["punchcard_id"]
            isOneToOne: false
            referencedRelation: "punchcards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          description: string | null
          id: string
          punchcard_id: string | null
          transaction_date: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          description?: string | null
          id?: string
          punchcard_id?: string | null
          transaction_date?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          description?: string | null
          id?: string
          punchcard_id?: string | null
          transaction_date?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_punchcard_id_fkey"
            columns: ["punchcard_id"]
            isOneToOne: false
            referencedRelation: "punchcards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_punchcards: {
        Row: {
          created_at: string | null
          id: string
          punchcard_id: string | null
          punches: number
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          punchcard_id?: string | null
          punches?: number
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          punchcard_id?: string | null
          punches?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_punchcards_punchcard_id_fkey"
            columns: ["punchcard_id"]
            isOneToOne: false
            referencedRelation: "punchcards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_punchcards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          address: string | null
          avatar_url: string | null
          created_at: string | null
          date_of_birth: string | null
          display_name: string | null
          email: string
          id: string
          is_verified: boolean | null
          password: string
          phone_number: string | null
          role: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          display_name?: string | null
          email: string
          id?: string
          is_verified?: boolean | null
          password: string
          phone_number?: string | null
          role?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          display_name?: string | null
          email?: string
          id?: string
          is_verified?: boolean | null
          password?: string
          phone_number?: string | null
          role?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
