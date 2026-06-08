import { supabase } from '@/lib/supabase'

// @ts-ignore
const insertHelper = (table: string, data: any) => supabase.from(table).insert(data).select().single()

// @ts-ignore
const updateHelper = (table: string, data: any, eq: [string, string]) => supabase.from(table).update(data).eq(eq[0], eq[1]).select().single()

export const paymentService = {
  async getAll() {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .order('date', { ascending: false })

    if (error) throw new Error(`Failed to fetch payments: ${error.message}`)
    return data || []
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw new Error(`Failed to fetch payment: ${error.message}`)
    return data
  },

  async getByPatient(patientId: string) {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('patient_id', patientId)
      .order('date', { ascending: false })

    if (error) throw new Error(`Failed to fetch patient payments: ${error.message}`)
    return data || []
  },

  async getTotalByPatient(patientId: string) {
    const { data, error } = await supabase
      .from('payments')
      .select('amount')
      .eq('patient_id', patientId)
      .eq('status', 'completed')

    if (error) throw new Error(`Failed to calculate total: ${error.message}`)
    return (data || []).reduce((sum: number, p: any) => sum + p.amount, 0)
  },

  async getPendingPayments() {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('status', 'pending')
      .order('date', { ascending: true })

    if (error) throw new Error(`Failed to fetch pending payments: ${error.message}`)
    return data || []
  },

  async create(payment: any) {
    const { data, error } = await insertHelper('payments', [payment])

    if (error) throw new Error(`Failed to create payment: ${error.message}`)
    return data
  },

  async update(id: string, updates: any) {
    const { data, error } = await updateHelper('payments', updates, ['id', id])

    if (error) throw new Error(`Failed to update payment: ${error.message}`)
    return data
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('payments')
      .delete()
      .eq('id', id)

    if (error) throw new Error(`Failed to delete payment: ${error.message}`)
  },
}
