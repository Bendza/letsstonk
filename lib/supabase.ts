import { createClient } from '@supabase/supabase-js'

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      portfolios: {
        Row: {
          created_at: string | null
          current_pnl: number | null
          id: string
          initial_investment: number
          is_active: boolean | null
          last_rebalanced: string | null
          pnl_percentage: number | null
          rebalance_count: number | null
          risk_level: number
          total_value: number | null
          updated_at: string | null
          user_id: string | null
          wallet_address: string
        }
        Insert: {
          created_at?: string | null
          current_pnl?: number | null
          id?: string
          initial_investment: number
          is_active?: boolean | null
          last_rebalanced?: string | null
          pnl_percentage?: number | null
          rebalance_count?: number | null
          risk_level: number
          total_value?: number | null
          updated_at?: string | null
          user_id?: string | null
          wallet_address: string
        }
        Update: {
          created_at?: string | null
          current_pnl?: number | null
          id?: string
          initial_investment?: number
          is_active?: boolean | null
          last_rebalanced?: string | null
          pnl_percentage?: number | null
          rebalance_count?: number | null
          risk_level?: number
          total_value?: number | null
          updated_at?: string | null
          user_id?: string | null
          wallet_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolios_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      positions: {
        Row: {
          amount: number
          average_price: number | null
          created_at: string | null
          current_percentage: number | null
          current_price: number | null
          id: string
          pnl: number | null
          pnl_percentage: number | null
          portfolio_id: string | null
          symbol: string
          target_percentage: number
          token_address: string
          updated_at: string | null
          value: number | null
        }
        Insert: {
          amount: number
          average_price?: number | null
          created_at?: string | null
          current_percentage?: number | null
          current_price?: number | null
          id?: string
          pnl?: number | null
          pnl_percentage?: number | null
          portfolio_id?: string | null
          symbol: string
          target_percentage: number
          token_address: string
          updated_at?: string | null
          value?: number | null
        }
        Update: {
          amount?: number
          average_price?: number | null
          created_at?: string | null
          current_percentage?: number | null
          current_price?: number | null
          id?: string
          pnl?: number | null
          pnl_percentage?: number | null
          portfolio_id?: string | null
          symbol?: string
          target_percentage?: number
          token_address?: string
          updated_at?: string | null
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "positions_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      price_history: {
        Row: {
          id: string
          market_cap: number | null
          price: number
          symbol: string
          timestamp: string | null
          token_address: string
          volume_24h: number | null
        }
        Insert: {
          id?: string
          market_cap?: number | null
          price: number
          symbol: string
          timestamp?: string | null
          token_address: string
          volume_24h?: number | null
        }
        Update: {
          id?: string
          market_cap?: number | null
          price?: number
          symbol?: string
          timestamp?: string | null
          token_address?: string
          volume_24h?: number | null
        }
        Relationships: []
      }
      rebalance_logs: {
        Row: {
          completed_at: string | null
          created_at: string | null
          error_message: string | null
          id: string
          new_allocations: Json | null
          old_allocations: Json | null
          portfolio_id: string | null
          status: string | null
          transactions: Json | null
          trigger_type: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          new_allocations?: Json | null
          old_allocations?: Json | null
          portfolio_id?: string | null
          status?: string | null
          transactions?: Json | null
          trigger_type: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          new_allocations?: Json | null
          old_allocations?: Json | null
          portfolio_id?: string | null
          status?: string | null
          transactions?: Json | null
          trigger_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "rebalance_logs_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          block_time: string | null
          created_at: string | null
          fees: number | null
          id: string
          input_amount: number
          input_token: string
          output_amount: number
          output_token: string
          portfolio_id: string | null
          price_impact: number | null
          slippage: number | null
          status: string | null
          transaction_signature: string
          transaction_type: string
        }
        Insert: {
          block_time?: string | null
          created_at?: string | null
          fees?: number | null
          id?: string
          input_amount: number
          input_token: string
          output_amount: number
          output_token: string
          portfolio_id?: string | null
          price_impact?: number | null
          slippage?: number | null
          status?: string | null
          transaction_signature: string
          transaction_type: string
        }
        Update: {
          block_time?: string | null
          created_at?: string | null
          fees?: number | null
          id?: string
          input_amount?: number
          input_token?: string
          output_amount?: number
          output_token?: string
          portfolio_id?: string | null
          price_impact?: number | null
          slippage?: number | null
          status?: string | null
          transaction_signature?: string
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          id: string
          risk_tolerance: number | null
          total_invested: number | null
          updated_at: string | null
          wallet_address: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          risk_tolerance?: number | null
          total_invested?: number | null
          updated_at?: string | null
          wallet_address?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          risk_tolerance?: number | null
          total_invested?: number | null
          updated_at?: string | null
          wallet_address?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)

// Server-side client for admin operations
export const createServerClient = () => {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}
 