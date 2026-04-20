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
      client_profiles: {
        Row: {
          bio: string | null
          profile_id: string
        }
        Insert: {
          bio?: string | null
          profile_id: string
        }
        Update: {
          bio?: string | null
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_profiles_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      dm_messages: {
        Row: {
          content: string
          created_at: string
          message_id: string
          room_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          message_id?: string
          room_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          message_id?: string
          room_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dm_messages_room_id_dm_rooms_room_id_fk"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "dm_rooms"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "dm_messages_sender_id_profiles_profile_id_fk"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      dm_room_members: {
        Row: {
          joined_at: string
          member_id: string
          profile_id: string
          room_id: string
        }
        Insert: {
          joined_at?: string
          member_id?: string
          profile_id: string
          room_id: string
        }
        Update: {
          joined_at?: string
          member_id?: string
          profile_id?: string
          room_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dm_room_members_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "dm_room_members_room_id_dm_rooms_room_id_fk"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "dm_rooms"
            referencedColumns: ["room_id"]
          },
        ]
      }
      dm_rooms: {
        Row: {
          created_at: string
          room_id: string
        }
        Insert: {
          created_at?: string
          room_id?: string
        }
        Update: {
          created_at?: string
          room_id?: string
        }
        Relationships: []
      }
      facilitator_profiles: {
        Row: {
          availability: string | null
          bio: string | null
          introduction: string | null
          is_certified: boolean
          languages: Json | null
          profile_id: string
        }
        Insert: {
          availability?: string | null
          bio?: string | null
          introduction?: string | null
          is_certified?: boolean
          languages?: Json | null
          profile_id: string
        }
        Update: {
          availability?: string | null
          bio?: string | null
          introduction?: string | null
          is_certified?: boolean
          languages?: Json | null
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "facilitator_profiles_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar: string | null
          created_at: string
          is_editor: boolean
          name: string
          profile_id: string
          role: Database["public"]["Enums"]["role"]
          updated_at: string
        }
        Insert: {
          avatar?: string | null
          created_at?: string
          is_editor?: boolean
          name: string
          profile_id: string
          role?: Database["public"]["Enums"]["role"]
          updated_at?: string
        }
        Update: {
          avatar?: string | null
          created_at?: string
          is_editor?: boolean
          name?: string
          profile_id?: string
          role?: Database["public"]["Enums"]["role"]
          updated_at?: string
        }
        Relationships: []
      }
      session_messages: {
        Row: {
          content: string
          created_at: string
          message_id: string
          sender_id: string
          sender_type: string
          session_id: string
        }
        Insert: {
          content: string
          created_at?: string
          message_id?: string
          sender_id: string
          sender_type: string
          session_id: string
        }
        Update: {
          content?: string
          created_at?: string
          message_id?: string
          sender_id?: string
          sender_type?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_messages_sender_id_profiles_profile_id_fk"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "session_messages_session_id_session_rooms_session_id_fk"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "session_rooms"
            referencedColumns: ["session_id"]
          },
        ]
      }
      session_rooms: {
        Row: {
          client_id: string
          created_at: string
          ended_at: string | null
          facilitator_id: string
          is_active: boolean
          openai_conversation_id: string | null
          room_code: string
          session_id: string
          session_number: number
          started_at: string | null
        }
        Insert: {
          client_id: string
          created_at?: string
          ended_at?: string | null
          facilitator_id: string
          is_active?: boolean
          openai_conversation_id?: string | null
          room_code: string
          session_id?: string
          session_number?: number
          started_at?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string
          ended_at?: string | null
          facilitator_id?: string
          is_active?: boolean
          openai_conversation_id?: string | null
          room_code?: string
          session_id?: string
          session_number?: number
          started_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "session_rooms_client_id_profiles_profile_id_fk"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "session_rooms_facilitator_id_profiles_profile_id_fk"
            columns: ["facilitator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      role: "client" | "facilitator"
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
      role: ["client", "facilitator"],
    },
  },
} as const
