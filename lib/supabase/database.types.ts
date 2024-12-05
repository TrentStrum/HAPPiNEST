export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          role: 'landlord' | 'tenant' | 'technician'
          email: string
          full_name: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role: 'landlord' | 'tenant' | 'technician'
          email: string
          full_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: 'landlord' | 'tenant' | 'technician'
          email?: string
          full_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          landlord_id: string
          name: string
          address: string
          city: string
          state: string
          zip: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          landlord_id: string
          name: string
          address: string
          city: string
          state: string
          zip: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          landlord_id?: string
          name?: string
          address?: string
          city?: string
          state?: string
          zip?: string
          created_at?: string
          updated_at?: string
        }
      }
      units: {
        Row: {
          id: string
          property_id: string
          unit_number: string
          rent_amount: number
          square_feet: number | null
          bedrooms: number | null
          bathrooms: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          unit_number: string
          rent_amount: number
          square_feet?: number | null
          bedrooms?: number | null
          bathrooms?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          unit_number?: string
          rent_amount?: number
          square_feet?: number | null
          bedrooms?: number | null
          bathrooms?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      leases: {
        Row: {
          id: string
          unit_id: string
          tenant_id: string
          start_date: string
          end_date: string
          rent_amount: number
          security_deposit: number
          document_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          unit_id: string
          tenant_id: string
          start_date: string
          end_date: string
          rent_amount: number
          security_deposit: number
          document_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          unit_id?: string
          tenant_id?: string
          start_date?: string
          end_date?: string
          rent_amount?: number
          security_deposit?: number
          document_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      maintenance_tickets: {
        Row: {
          id: string
          unit_id: string
          tenant_id: string
          technician_id: string | null
          title: string
          description: string
          status: 'open' | 'in_progress' | 'completed' | 'cancelled'
          priority: number
          category: string
          images: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          unit_id: string
          tenant_id: string
          technician_id?: string | null
          title: string
          description: string
          status?: 'open' | 'in_progress' | 'completed' | 'cancelled'
          priority?: number
          category: string
          images?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          unit_id?: string
          tenant_id?: string
          technician_id?: string | null
          title?: string
          description?: string
          status?: 'open' | 'in_progress' | 'completed' | 'cancelled'
          priority?: number
          category?: string
          images?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          lease_id: string
          amount: number
          status: 'pending' | 'completed' | 'failed' | 'refunded'
          stripe_payment_id: string | null
          due_date: string
          paid_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          lease_id: string
          amount: number
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          stripe_payment_id?: string | null
          due_date: string
          paid_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          lease_id?: string
          amount?: number
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          stripe_payment_id?: string | null
          due_date?: string
          paid_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'landlord' | 'tenant' | 'technician'
      ticket_status: 'open' | 'in_progress' | 'completed' | 'cancelled'
      payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
    }
  }
}