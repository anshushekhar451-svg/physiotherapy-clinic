import { supabase } from '@/lib/supabase'

// @ts-ignore
const insertHelper = (table: string, data: any) => supabase.from(table).insert(data).select().single()

// @ts-ignore
const updateHelper = (table: string, data: any, eq: [string, string]) => supabase.from(table).update(data).eq(eq[0], eq[1]).select().single()

export const attendanceService = {
  async getAll() {
    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw new Error(`Failed to fetch attendance: ${error.message}`)
    return data || []
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw new Error(`Failed to fetch attendance: ${error.message}`)
    return data
  },

  async getByAppointment(appointmentId: string) {
    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('appointment_id', appointmentId)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to fetch attendance: ${error.message}`)
    }
    return data || null
  },

  async create(attendance: any) {
    const { data, error } = await insertHelper('attendance', [attendance])

    if (error) throw new Error(`Failed to create attendance: ${error.message}`)
    return data
  },

  async update(id: string, updates: any) {
    const { data, error } = await updateHelper('attendance', updates, ['id', id])

    if (error) throw new Error(`Failed to update attendance: ${error.message}`)
    return data
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('attendance')
      .delete()
      .eq('id', id)

    if (error) throw new Error(`Failed to delete attendance: ${error.message}`)
  },

  async markAttended(appointmentId: string, attended: boolean) {
    const existingAttendance = await this.getByAppointment(appointmentId)

    if (existingAttendance) {
      return this.update(existingAttendance.id, { attended })
    }

    return this.create({
      appointment_id: appointmentId,
      attended,
      check_in: attended ? new Date().toISOString() : null,
      check_out: null,
    })
  },
}
