'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { Plus, Edit2, Trash2, Search, CheckCircle, XCircle, Calendar } from 'lucide-react'

export default function AttendancePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [attendance, setAttendance] = useState([])
  const [patients, setPatients] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    date: '',
    time: '',
    status: 'Present',
    remarks: '',
  })
  const router = useRouter()

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn')
    if (!loggedIn) {
      router.push('/')
    } else {
      setIsLoggedIn(true)
      loadPatients()
      loadAttendance()
    }
  }, [router])

  const loadPatients = () => {
    const saved = localStorage.getItem('patients')
    if (saved) {
      setPatients(JSON.parse(saved))
    }
  }

  const loadAttendance = () => {
    const saved = localStorage.getItem('attendance')
    if (saved) {
      setAttendance(JSON.parse(saved))
    } else {
      const defaultAttendance = [
        {
          id: '1',
          patientName: 'John Doe',
          patientId: '1',
          date: '2024-06-07',
          time: '10:00 AM',
          status: 'Present',
          remarks: 'On time',
        },
        {
          id: '2',
          patientName: 'Jane Wilson',
          patientId: '2',
          date: '2024-06-07',
          time: '11:30 AM',
          status: 'Present',
          remarks: 'Attended full session',
        },
        {
          id: '3',
          patientName: 'Mike Brown',
          patientId: '3',
          date: '2024-06-07',
          time: '2:00 PM',
          status: 'Absent',
          remarks: 'No show',
        },
      ]
      setAttendance(defaultAttendance)
      localStorage.setItem('attendance', JSON.stringify(defaultAttendance))
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
      const updated = attendance.map(a => a.id === editingId ? { ...formData, id: editingId } : a)
      setAttendance(updated)
      localStorage.setItem('attendance', JSON.stringify(updated))
    } else {
      const newRecord = { ...formData, id: Date.now().toString() }
      const updated = [...attendance, newRecord]
      setAttendance(updated)
      localStorage.setItem('attendance', JSON.stringify(updated))
    }
    resetForm()
  }

  const handleEdit = (record) => {
    setFormData(record)
    setEditingId(record.id)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (confirm('Delete this record?')) {
      const updated = attendance.filter(a => a.id !== id)
      setAttendance(updated)
      localStorage.setItem('attendance', JSON.stringify(updated))
    }
  }

  const resetForm = () => {
    setFormData({
      patientId: '', patientName: '', date: '', time: '', status: 'Present', remarks: '',
    })
    setEditingId(null)
    setShowForm(false)
  }

  const filteredRecords = attendance.filter(a =>
    a.patientName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const attendanceStats = {
    total: attendance.length,
    present: attendance.filter(a => a.status === 'Present').length,
    absent: attendance.filter(a => a.status === 'Absent').length,
    late: attendance.filter(a => a.status === 'Late').length,
  }

  const attendanceRate = attendanceStats.total > 0 
    ? Math.round((attendanceStats.present / attendanceStats.total) * 100)
    : 0

  if (!isLoggedIn) return null

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 flex flex-col lg:ml-64">
        <Header title="Attendance Management" />
        
        <div className="flex-1 overflow-auto p-6">
          {!showForm ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-sm text-gray-500">Total Sessions</p>
                  <p className="text-3xl font-bold text-gray-900">{attendanceStats.total}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 shadow border-l-4 border-green-500">
                  <p className="text-sm text-gray-500">Present</p>
                  <p className="text-3xl font-bold text-green-600">{attendanceStats.present}</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4 shadow border-l-4 border-red-500">
                  <p className="text-sm text-gray-500">Absent</p>
                  <p className="text-3xl font-bold text-red-600">{attendanceStats.absent}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 shadow border-l-4 border-blue-500">
                  <p className="text-sm text-gray-500">Rate</p>
                  <p className="text-3xl font-bold text-blue-600">{attendanceRate}%</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="relative flex-1 md:max-w-md">
                  <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search patient attendance..."
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
                  Mark Attendance
                </button>
              </div>

              <div className="grid gap-3">
                {filteredRecords.map(record => (
                  <div key={record.id} className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                      <div>
                        <p className="text-sm text-gray-500">Patient</p>
                        <p className="font-bold text-gray-900">{record.patientName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Calendar size={16} /> Date & Time
                        </p>
                        <p className="font-bold text-gray-900">{record.date} {record.time}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <div className="flex items-center gap-2">
                          {record.status === 'Present' ? (
                            <><CheckCircle size={20} className="text-green-500" /> <span className="font-semibold text-green-600">{record.status}</span></>
                          ) : (
                            <><XCircle size={20} className="text-red-500" /> <span className="font-semibold text-red-600">{record.status}</span></>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleEdit(record)}
                          className="text-primary-500 hover:bg-blue-50 px-3 py-2 rounded-lg"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(record.id)}
                          className="text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    {record.remarks && (
                      <p className="text-sm text-gray-600 mt-2 border-t border-gray-200 pt-2">Remarks: {record.remarks}</p>
                    )}
                  </div>
                ))}
              </div>

              {filteredRecords.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No attendance records found</p>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingId ? 'Edit Attendance' : 'Mark Attendance'}
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                    <select name="status" value={formData.status} onChange={handleChange} required>
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                      <option value="Late">Late</option>
                      <option value="Excused">Excused</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                  <textarea
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Additional remarks..."
                  />
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 rounded-lg"
                  >
                    {editingId ? 'Update' : 'Mark Attendance'}
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
