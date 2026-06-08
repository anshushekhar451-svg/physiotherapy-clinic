'use client'

import { useState, useEffect } from 'react'
import type { Database } from '@/types/database'

type Attendance = Database['public']['Tables']['attendance']['Row']

interface AttendanceFormProps {
  attendance?: Attendance
  appointmentId?: string
  onSuccess?: (attendance: Attendance) => void
  onCancel?: () => void
}

export default function AttendanceForm({
  attendance,
  appointmentId,
  onSuccess,
  onCancel,
}: AttendanceFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [appointments, setAppointments] = useState<any[]>([])
  const [formData, setFormData] = useState({
    appointment_id: attendance?.appointment_id || appointmentId || '',
    attended: attendance?.attended ?? true,
    check_in: attendance?.check_in || '',
    check_out: attendance?.check_out || '',
  })

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const response = await fetch('/api/appointments?upcoming=true')
        if (response.ok) {
          const data = await response.json()
          setAppointments(data)
        }
      } catch (err) {
        console.error('Failed to load appointments:', err)
      }
    }
    if (!appointmentId) {
      loadAppointments()
    }
  }, [appointmentId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const target = e.target as HTMLInputElement
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? target.checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const url = `/api/attendance${attendance ? `?id=${attendance.id}` : ''}`
      const method = attendance ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save attendance')
      }

      const result = await response.json()
      onSuccess?.(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Appointment *</label>
          <select
            name="appointment_id"
            value={formData.appointment_id}
            onChange={handleChange}
            required
            disabled={!!appointmentId}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50"
          >
            <option value="">Select an appointment</option>
            {appointments.map(apt => (
              <option key={apt.id} value={apt.id}>
                {apt.patient_id} - {new Date(apt.date).toLocaleDateString()} {apt.time}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="attended"
              checked={formData.attended}
              onChange={handleChange}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm font-medium text-gray-700">Patient Attended</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Time</label>
          <input
            type="datetime-local"
            name="check_in"
            value={formData.check_in}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Time</label>
          <input
            type="datetime-local"
            name="check_out"
            value={formData.check_out}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg disabled:opacity-50 transition"
        >
          {loading ? 'Saving...' : attendance ? 'Update Attendance' : 'Mark Attendance'}
        </button>
      </div>
    </form>
  )
}
