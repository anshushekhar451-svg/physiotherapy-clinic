'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { Plus, Edit2, Trash2, Search, Eye, Download, AlertCircle } from 'lucide-react'

export default function BillingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [invoices, setInvoices] = useState([])
  const [patients, setPatients] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    date: '',
    description: '',
    amount: '',
    status: 'Pending',
    dueDate: '',
  })
  const router = useRouter()

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn')
    if (!loggedIn) {
      router.push('/')
    } else {
      setIsLoggedIn(true)
      loadPatients()
      loadInvoices()
    }
  }, [router])

  const loadPatients = () => {
    const saved = localStorage.getItem('patients')
    if (saved) {
      setPatients(JSON.parse(saved))
    }
  }

  const loadInvoices = () => {
    const saved = localStorage.getItem('invoices')
    if (saved) {
      setInvoices(JSON.parse(saved))
    } else {
      const defaultInvoices = [
        {
          id: 'INV001',
          patientName: 'John Doe',
          patientId: '1',
          date: '2024-06-01',
          description: 'Session - Back Pain Treatment',
          amount: '1500',
          status: 'Paid',
          dueDate: '2024-06-15',
        },
        {
          id: 'INV002',
          patientName: 'Jane Wilson',
          patientId: '2',
          date: '2024-06-05',
          description: 'Consultation + Assessment',
          amount: '2000',
          status: 'Pending',
          dueDate: '2024-06-20',
        },
      ]
      setInvoices(defaultInvoices)
      localStorage.setItem('invoices', JSON.stringify(defaultInvoices))
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
      const updated = invoices.map(inv => inv.id === editingId ? { ...formData, id: editingId } : inv)
      setInvoices(updated)
      localStorage.setItem('invoices', JSON.stringify(updated))
    } else {
      const invoiceId = `INV${String(invoices.length + 1).padStart(3, '0')}`
      const newInvoice = { ...formData, id: invoiceId }
      const updated = [...invoices, newInvoice]
      setInvoices(updated)
      localStorage.setItem('invoices', JSON.stringify(updated))
    }
    resetForm()
  }

  const handleEdit = (invoice) => {
    setFormData(invoice)
    setEditingId(invoice.id)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (confirm('Delete this invoice?')) {
      const updated = invoices.filter(inv => inv.id !== id)
      setInvoices(updated)
      localStorage.setItem('invoices', JSON.stringify(updated))
    }
  }

  const resetForm = () => {
    setFormData({
      patientId: '', patientName: '', date: '', description: '', amount: '', status: 'Pending', dueDate: '',
    })
    setEditingId(null)
    setShowForm(false)
  }

  const filteredInvoices = invoices.filter(inv =>
    inv.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const billingStats = {
    totalInvoiced: invoices.reduce((sum, inv) => sum + parseFloat(inv.amount || 0), 0),
    paid: invoices.filter(inv => inv.status === 'Paid').reduce((sum, inv) => sum + parseFloat(inv.amount || 0), 0),
    pending: invoices.filter(inv => inv.status === 'Pending').reduce((sum, inv) => sum + parseFloat(inv.amount || 0), 0),
    overdue: invoices.filter(inv => inv.status === 'Overdue').reduce((sum, inv) => sum + parseFloat(inv.amount || 0), 0),
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'Paid': return 'bg-green-100 text-green-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'Overdue': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (!isLoggedIn) return null

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 flex flex-col lg:ml-64">
        <Header title="Billing & Invoicing" />
        
        <div className="flex-1 overflow-auto p-6">
          {!showForm ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 shadow">
                  <p className="text-sm text-gray-500">Total Invoiced</p>
                  <p className="text-2xl font-bold text-gray-900">₹{billingStats.totalInvoiced.toFixed(0)}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 shadow border-l-4 border-green-500">
                  <p className="text-sm text-gray-500">Paid</p>
                  <p className="text-2xl font-bold text-green-600">₹{billingStats.paid.toFixed(0)}</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 shadow border-l-4 border-yellow-500">
                  <p className="text-sm text-gray-500">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">₹{billingStats.pending.toFixed(0)}</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4 shadow border-l-4 border-red-500">
                  <p className="text-sm text-gray-500">Overdue</p>
                  <p className="text-2xl font-bold text-red-600">₹{billingStats.overdue.toFixed(0)}</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="relative flex-1 md:max-w-md">
                  <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search invoices..."
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
                  Create Invoice
                </button>
              </div>

              <div className="grid gap-4">
                {filteredInvoices.map(invoice => (
                  <div key={invoice.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start md:items-center">
                      <div>
                        <p className="text-sm text-gray-500">Invoice ID</p>
                        <p className="font-bold text-gray-900">{invoice.id}</p>
                        <p className="text-sm text-gray-600">{invoice.date}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Patient</p>
                        <p className="font-bold text-gray-900">{invoice.patientName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Amount</p>
                        <p className="text-xl font-bold text-gray-900">₹{parseFloat(invoice.amount).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(invoice.status)}`}>
                          {invoice.status}
                        </span>
                      </div>
                      <div className="flex gap-2 justify-end">
                        <button className="text-primary-500 hover:bg-blue-50 px-3 py-2 rounded-lg" title="View">
                          <Eye size={18} />
                        </button>
                        <button className="text-primary-500 hover:bg-blue-50 px-3 py-2 rounded-lg" title="Download">
                          <Download size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(invoice)}
                          className="text-primary-500 hover:bg-blue-50 px-3 py-2 rounded-lg"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(invoice.id)}
                          className="text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600">Description: {invoice.description}</p>
                      <p className="text-sm text-gray-600">Due: {invoice.dueDate}</p>
                    </div>
                  </div>
                ))}
              </div>

              {filteredInvoices.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No invoices found</p>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingId ? 'Edit Invoice' : 'Create New Invoice'}
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹) *</label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      placeholder="0.00"
                      step="0.01"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
                    <input
                      type="date"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="e.g., 5 Physiotherapy Sessions"
                    rows="2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                  <select name="status" value={formData.status} onChange={handleChange} required>
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Overdue">Overdue</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 rounded-lg"
                  >
                    {editingId ? 'Update Invoice' : 'Create Invoice'}
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
