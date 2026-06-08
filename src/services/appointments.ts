import { supabase } from '@/lib/supabase'

// Helper to work around Supabase type constraints
// @ts-ignore
const insertHelper = (table: string, data: any) => supabase.from(table).insert(data).select().single()

// @ts-ignore
const updateHelper = (table: string, data: any, eq: [string, string]) => supabase.from(table).update(data).eq(eq[0], eq[1]).select().single()

export const appointmentService = {
  async getAll() {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('date', { ascending: false })

    if (error) throw new Error(`Failed to fetch appointments: ${error.message}`)
    return data || []
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw new Error(`Failed to fetch appointment: ${error.message}`)
    return data
  },

  async getByPatient(patientId: string) {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('patient_id', patientId)
      .order('date', { ascending: false })

    if (error) throw new Error(`Failed to fetch patient appointments: ${error.message}`)
    return data || []
  },

  async getUpcoming() {
    const today = new Date().toISOString().split('T')[0]
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .gte('date', today)
      .eq('status', 'scheduled')
      .order('date', { ascending: true })

    if (error) throw new Error(`Failed to fetch upcoming appointments: ${error.message}`)
    return data || []
  },

  async create(appointment: any) {
    const { data, error } = await insertHelper('appointments', [appointment])

    if (error) throw new Error(`Failed to create appointment: ${error.message}`)
    return data
  },

  async update(id: string, updates: any) {
    const { data, error } = await updateHelper('appointments', updates, ['id', id])

    if (error) throw new Error(`Failed to update appointment: ${error.message}`)
    return data
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id)

    if (error) throw new Error(`Failed to delete appointment: ${error.message}`)
  },
}
