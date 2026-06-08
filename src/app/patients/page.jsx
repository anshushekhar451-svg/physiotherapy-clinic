'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { Plus, Edit2, Trash2, Search, Phone, Mail, MapPin } from 'lucide-react'

export default function PatientsPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [patients, setPatients] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    condition: '',
    address: '',
    joinDate: new Date().toISOString().split('T')[0],
  })
  const router = useRouter()

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn')
    if (!loggedIn) {
      router.push('/')
    } else {
      setIsLoggedIn(true)
      loadPatients()
    }
  }, [router])

  const loadPatients = () => {
    const saved = localStorage.getItem('patients')
    if (saved) {
      setPatients(JSON.parse(saved))
    } else {
      const defaultPatients = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '9876543210',
          age: '35',
          gender: 'Male',
          condition: 'Lower Back Pain',
          address: '123 Main St, City',
          joinDate: '2024-01-15',
        },
        {
          id: '2',
          name: 'Jane Wilson',
          email: 'jane@example.com',
          phone: '9876543211',
          age: '28',
          gender: 'Female',
          condition: 'Knee Injury',
          address: '456 Oak Ave, City',
          joinDate: '2024-02-20',
        },
        {
          id: '3',
          name: 'Mike Brown',
          email: 'mike@example.com',
          phone: '9876543212',
          age: '42',
          gender: 'Male',
          condition: 'Shoulder Strain',
          address: '789 Pine Rd, City',
          joinDate: '2024-03-10',
        },
      ]
      setPatients(defaultPatients)
      localStorage.setItem('patients', JSON.stringify(defaultPatients))
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingId) {
      setPatients(prev =>
        prev.map(p => p.id === editingId ? { ...formData, id: editingId } : p)
      )
    } else {
      setPatients(prev => [...prev, { ...formData, id: Date.now().toString() }])
    }
    localStorage.setItem('patients', JSON.stringify(editingId ? patients : [...patients, { ...formData, id: Date.now().toString() }]))
    resetForm()
  }

  const handleEdit = (patient) => {
    setFormData(patient)
    setEditingId(patient.id)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (confirm('Are you sure?')) {
      const updated = patients.filter(p => p.id !== id)
      setPatients(updated)
      localStorage.setItem('patients', JSON.stringify(updated))
    }
  }

  const resetForm = () => {
    setFormData({
      name: '', email: '', phone: '', age: '', gender: '', condition: '', address: '',
      joinDate: new Date().toISOString().split('T')[0],
    })
    setEditingId(null)
    setShowForm(false)
  }

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!isLoggedIn) return null

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 flex flex-col lg:ml-64">
        <Header title="Patient Management" />
        
        <div className="flex-1 overflow-auto p-6">
          {!showForm ? (
            <>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="relative flex-1 md:max-w-md">
                  <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search patients..."
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
                  Add Patient
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPatients.map(patient => (
                  <div key={patient.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{patient.name}</h3>
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <Mail size={16} />
                        <span>{patient.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={16} />
                        <span>{patient.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        <span>{patient.address}</span>
                      </div>
                      <p className="text-gray-700 font-medium mt-3">
                        Condition: <span className="text-primary-500">{patient.condition}</span>
                      </p>
                      <p className="text-gray-600">Age: {patient.age} | {patient.gender}</p>
                    </div>
                    <div className="flex gap-2 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleEdit(patient)}
                        className="flex-1 flex items-center justify-center gap-2 text-primary-500 hover:bg-blue-50 py-2 rounded-lg"
                      >
                        <Edit2 size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(patient.id)}
                        className="flex-1 flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 py-2 rounded-lg"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredPatients.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No patients found</p>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingId ? 'Edit Patient' : 'Add New Patient'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} required>
                      <option value="">Select...</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Join Date *</label>
                    <input
                      type="date"
                      name="joinDate"
                      value={formData.joinDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Condition *</label>
                  <input
                    type="text"
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    placeholder="e.g., Lower Back Pain"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    required
                  />
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 rounded-lg"
                  >
                    {editingId ? 'Update Patient' : 'Add Patient'}
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
