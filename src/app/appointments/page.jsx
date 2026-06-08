'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { Plus, Edit2, Trash2, Search, Calendar, Clock, User } from 'lucide-react'

export default function AppointmentsPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [appointments, setAppointments] = useState([])
  const [patients, setPatients] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    date: '',
    time: '',
    therapist: '',
    type: '',
    status: 'Scheduled',
    notes: '',
  })
  const router = useRouter()

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn')
    if (!loggedIn) {
      router.push('/')
    } else {
      setIsLoggedIn(true)
      loadPatients()
      loadAppointments()
    }
  }, [router])

  const loadPatients = () => {
    const saved = localStorage.getItem('patients')
    if (saved) {
      setPatients(JSON.parse(saved))
    }
  }

  const loadAppointments = () => {
    const saved = localStorage.getItem('appointments')
    if (saved) {
      setAppointments(JSON.parse(saved))
    } else {
      const defaultAppointments = [
        {
          id: '1',
          patientName: 'John Doe',
          patientId: '1',
          date: '2024-06-10',
          time: '10:00 AM',
          therapist: 'Dr. Smith',
          type: 'Follow-up',
          status: 'Scheduled',
          notes: 'Knee assessment',
        },
        {
          id: '2',
          patientName: 'Jane Wilson',
          patientId: '2',
          date: '2024-06-10',
          time: '11:30 AM',
          therapist: 'Dr. Johnson',
          type: 'Initial',
          status: 'Scheduled',
          notes: 'Comprehensive evaluation',
        },
      ]
      setAppointments(defaultAppointments)
      localStorage.setItem('appointments', JSON.stringify(defaultAppointments))
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'patientId') {
      const patient = patients.find(p => p.id === value)
      setFormData(prev => ({
        ...prev,
        patientId: value,
        patientName: patient ? patient.name : '',
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingId) {
      const updated = appointments.map(a => a.id === editingId ? { ...formData, id: editingId } : a)
      setAppointments(updated)
      localStorage.setItem('appointments', JSON.stringify(updated))
    } else {
      const newAppointment = { ...formData, id: Date.now().toString() }
      const updated = [...appointments, newAppointment]
      setAppointments(updated)
      localStorage.setItem('appointments', JSON.stringify(updated))
    }
    resetForm()
  }

  const handleEdit = (appointment) => {
    setFormData(appointment)
    setEditingId(appointment.id)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (confirm('Delete this appointment?')) {
      const updated = appointments.filter(a => a.id !== id)
      setAppointments(updated)
      localStorage.setItem('appointments', JSON.stringify(updated))
    }
  }

  const resetForm = () => {
    setFormData({
      patientId: '', patientName: '', date: '', time: '', therapist: '', type: '', status: 'Scheduled', notes: '',
    })
    setEditingId(null)
    setShowForm(false)
  }

  const filteredAppointments = appointments.filter(a =>
    a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.therapist.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'bg-green-100 text-green-800'
      case 'Cancelled': return 'bg-red-100 text-red-800'
      case 'No Show': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-blue-100 text-blue-800'
    }
  }

  if (!isLoggedIn) return null

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 flex flex-col lg:ml-64">
        <Header title="Appointment Tracking" />
        
        <div className="flex-1 overflow-auto p-6">
          {!showForm ? (
            <>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="relative flex-1 md:max-w-md">
                  <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search appointments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2"
                  />
                </div>
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium"
                >
                  <Plus size={20} />
                  Schedule Appointment
                </button>
              </div>

              <div className="grid gap-4">
                {filteredAppointments.map(apt => (
                  <div key={apt.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start md:items-center">
                      <div>
                        <p className="text-sm text-gray-500">Patient</p>
                        <p className="font-bold text-gray-900">{apt.patientName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Calendar size={16} /> Date & Time
                        </p>
                        <p className="font-bold text-gray-900">{apt.date} at {apt.time}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <User size={16} /> Therapist
                        </p>
                        <p className="font-bold text-gray-900">{apt.therapist}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(apt.status)}`}>
                          {apt.status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600">Type: <span className="font-semibold">{apt.type}</span> | Notes: {apt.notes}</p>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleEdit(apt)}
                        className="flex items-center gap-1 text-primary-500 hover:bg-blue-50 px-3 py-2 rounded-lg"
                      >
                        <Edit2 size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(apt.id)}
                        className="flex items-center gap-1 text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredAppointments.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No appointments found</p>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingId ? 'Edit Appointment' : 'Schedule New Appointment'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Patient *</label>
                    <select
                      name="patientId"
                      value={formData.patientId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Patient...</option>
                      {patients.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Therapist *</label>
                    <input
                      type="text"
                      name="therapist"
                      value={formData.therapist}
                      onChange={handleChange}
                      placeholder="e.g., Dr. Smith"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                    <select name="type" value={formData.type} onChange={handleChange} required>
                      <option value="">Select...</option>
                      <option value="Initial">Initial Consultation</option>
                      <option value="Follow-up">Follow-up</option>
                      <option value="Assessment">Assessment</option>
                      <option value="Treatment">Treatment</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                    <select name="status" value={formData.status} onChange={handleChange} required>
                      <option value="Scheduled">Scheduled</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="No Show">No Show</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Additional notes..."
                  />
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 rounded-lg"
                  >
                    {editingId ? 'Update Appointment' : 'Schedule Appointment'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
