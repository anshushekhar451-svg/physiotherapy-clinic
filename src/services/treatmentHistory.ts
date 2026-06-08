import { supabase } from '@/lib/supabase'

// @ts-ignore
const insertHelper = (table: string, data: any) => supabase.from(table).insert(data).select().single()

// @ts-ignore
const updateHelper = (table: string, data: any, eq: [string, string]) => supabase.from(table).update(data).eq(eq[0], eq[1]).select().single()

export const treatmentHistoryService = {
  async getAll() {
    const { data, error } = await supabase
      .from('treatment_history')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw new Error(`Failed to fetch treatment history: ${error.message}`)
    return data || []
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('treatment_history')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw new Error(`Failed to fetch treatment: ${error.message}`)
    return data
  },

  async getByPatient(patientId: string) {
    const { data, error } = await supabase
      .from('treatment_history')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false })

    if (error) throw new Error(`Failed to fetch patient treatment history: ${error.message}`)
    return data || []
  },

  async getByAppointment(appointmentId: string) {
    const { data, error } = await supabase
      .from('treatment_history')
      .select('*')
      .eq('appointment_id', appointmentId)
      .order('created_at', { ascending: false })

    if (error) throw new Error(`Failed to fetch appointment treatment: ${error.message}`)
    return data || []
  },

  async create(treatment: any) {
    const { data, error } = await insertHelper('treatment_history', [treatment])

    if (error) throw new Error(`Failed to create treatment: ${error.message}`)
    return data
  },

  async update(id: string, updates: any) {
    const { data, error } = await updateHelper('treatment_history', updates, ['id', id])

    if (error) throw new Error(`Failed to update treatment: ${error.message}`)
    return data
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('treatment_history')
      .delete()
      .eq('id', id)

    if (error) throw new Error(`Failed to delete treatment: ${error.message}`)
  },
}
