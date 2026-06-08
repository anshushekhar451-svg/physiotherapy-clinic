'use client'

import { useState, useEffect } from 'react'
import type { Database } from '@/types/database'

type TreatmentHistory = Database['public']['Tables']['treatment_history']['Row']

interface TreatmentHistoryFormProps {
  treatment?: TreatmentHistory
  patientId?: string
  onSuccess?: (treatment: TreatmentHistory) => void
  onCancel?: () => void
}

export default function TreatmentHistoryForm({
  treatment,
  patientId,
  onSuccess,
  onCancel,
}: TreatmentHistoryFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [patients, setPatients] = useState<any[]>([])
  const [appointments, setAppointments] = useState<any[]>([])
  const [formData, setFormData] = useState({
    patient_id: treatment?.patient_id || patientId || '',
    appointment_id: treatment?.appointment_id || '',
    treatment_type: treatment?.treatment_type || '',
    description: treatment?.description || '',
    result: treatment?.result || '',
  })

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const response = await fetch('/api/patients')
        if (response.ok) {
          const data = await response.json()
          setPatients(data)
        }
      } catch (err) {
        console.error('Failed to load patients:', err)
      }
    }
    loadPatients()
  }, [])

  useEffect(() => {
    if (formData.patient_id) {
      const loadAppointments = async () => {
        try {
          const response = await fetch(`/api/appointments?patientId=${formData.patient_id}`)
          if (response.ok) {
            const data = await response.json()
            setAppointments(data)
          }
        } catch (err) {
          console.error('Failed to load appointments:', err)
        }
      }
      loadAppointments()
    }
  }, [formData.patient_id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const url = `/api/treatment-history${treatment ? `?id=${treatment.id}` : ''}`
      const method = treatment ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save treatment')
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Patient *</label>
          <select
            name="patient_id"
            value={formData.patient_id}
            onChange={handleChange}
            required
            disabled={!!patientId}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50"
          >
            <option value="">Select a patient</option>
            {patients.map(patient => (
              <option key={patient.id} value={patient.id}>
                {patient.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Appointment</label>
          <select
            name="appointment_id"
            value={formData.appointment_id}
            onChange={handleChange}
            disabled={!formData.patient_id}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50"
          >
            <option value="">Select an appointment (optional)</option>
            {appointments.map(apt => (
              <option key={apt.id} value={apt.id}>
                {new Date(apt.date).toLocaleDateString()} - {apt.type}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Treatment Type *</label>
          <input
            type="text"
            name="treatment_type"
            value={formData.treatment_type}
            onChange={handleChange}
            required
            placeholder="e.g., Massage, Stretching, Exercise"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Detailed description of the treatment..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Result/Outcome</label>
        <textarea
          name="result"
          value={formData.result}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Treatment result and patient response..."
        />
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
          {loading ? 'Saving...' : treatment ? 'Update Treatment' : 'Add Treatment'}
        </button>
      </div>
    </form>
  )
}
