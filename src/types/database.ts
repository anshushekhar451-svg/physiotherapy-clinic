export type Database = {
  public: {
    Tables: {
      patients: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          dob: string
          address: string
          medical_history: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          dob: string
          address: string
          medical_history?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          dob?: string
          address?: string
          medical_history?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          patient_id: string
          date: string
          time: string
          duration: number
          type: string
          notes: string | null
          status: 'scheduled' | 'completed' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          date: string
          time: string
          duration: number
          type: string
          notes?: string | null
          status?: 'scheduled' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          date?: string
          time?: string
          duration?: number
          type?: string
          notes?: string | null
          status?: 'scheduled' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
      }
      attendance: {
        Row: {
          id: string
          appointment_id: string
          attended: boolean
          check_in: string | null
          check_out: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          appointment_id: string
          attended?: boolean
          check_in?: string | null
          check_out?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          appointment_id?: string
          attended?: boolean
          check_in?: string | null
          check_out?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          patient_id: string
          amount: number
          date: string
          method: 'cash' | 'card' | 'check' | 'upi'
          status: 'pending' | 'completed' | 'failed'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          amount: number
          date: string
          method: 'cash' | 'card' | 'check' | 'upi'
          status?: 'pending' | 'completed' | 'failed'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          amount?: number
          date?: string
          method?: 'cash' | 'card' | 'check' | 'upi'
          status?: 'pending' | 'completed' | 'failed'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      treatment_history: {
        Row: {
          id: string
          patient_id: string
          appointment_id: string | null
          treatment_type: string
          description: string
          result: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          appointment_id?: string | null
          treatment_type: string
          description: string
          result?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          appointment_id?: string | null
          treatment_type?: string
          description?: string
          result?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
