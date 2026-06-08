import { supabase } from '@/lib/supabase'

// @ts-ignore
const insertHelper = (table: string, data: any) => supabase.from(table).insert(data).select().single()

// @ts-ignore
const updateHelper = (table: string, data: any, eq: [string, string]) => supabase.from(table).update(data).eq(eq[0], eq[1]).select().single()

export const patientService = {
  async getAll() {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw new Error(`Failed to fetch patients: ${error.message}`)
    return data || []
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw new Error(`Failed to fetch patient: ${error.message}`)
    return data
  },

  async search(query: string) {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .or(`name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
      .order('name')

    if (error) throw new Error(`Failed to search patients: ${error.message}`)
    return data || []
  },

  async create(patient: any) {
    const { data, error } = await insertHelper('patients', [patient])

    if (error) throw new Error(`Failed to create patient: ${error.message}`)
    return data
  },

  async update(id: string, updates: any) {
    const { data, error } = await updateHelper('patients', updates, ['id', id])

    if (error) throw new Error(`Failed to update patient: ${error.message}`)
    return data
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('patients')
      .delete()
      .eq('id', id)

    if (error) throw new Error(`Failed to delete patient: ${error.message}`)
  },
}
