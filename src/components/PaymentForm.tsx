'use client'

import { useState, useEffect } from 'react'
import type { Database } from '@/types/database'

type Payment = Database['public']['Tables']['payments']['Row']

interface PaymentFormProps {
  payment?: Payment
  patientId?: string
  onSuccess?: (payment: Payment) => void
  onCancel?: () => void
}

export default function PaymentForm({
  payment,
  patientId,
  onSuccess,
  onCancel,
}: PaymentFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [patients, setPatients] = useState<any[]>([])
  const [formData, setFormData] = useState({
    patient_id: payment?.patient_id || patientId || '',
    amount: payment?.amount || '',
    date: payment?.date || new Date().toISOString().split('T')[0],
    method: payment?.method || 'cash',
    status: payment?.status || 'completed',
    notes: payment?.notes || '',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const url = `/api/payments${payment ? `?id=${payment.id}` : ''}`
      const method = payment ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save payment')
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹) *</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Method *</label>
          <select
            name="method"
            value={formData.method}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="check">Check</option>
            <option value="upi">UPI</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Payment notes..."
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
          {loading ? 'Saving...' : payment ? 'Update Payment' : 'Add Payment'}
        </button>
      </div>
    </form>
  )
}
