'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { Users, Calendar, Clock, DollarSign } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-lg p-6 shadow border-l-4" style={{ borderColor: color }}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
      </div>
      <div className="p-3 rounded-lg" style={{ backgroundColor: color + '20' }}>
        <Icon size={28} style={{ color }} />
      </div>
    </div>
  </div>
)

const chartData = [
  { month: 'Jan', patients: 45, appointments: 120 },
  { month: 'Feb', patients: 52, appointments: 135 },
  { month: 'Mar', patients: 48, appointments: 128 },
  { month: 'Apr', patients: 61, appointments: 155 },
  { month: 'May', patients: 58, appointments: 148 },
  { month: 'Jun', patients: 67, appointments: 165 },
]

const revenueData = [
  { week: 'Week 1', revenue: 4500 },
  { week: 'Week 2', revenue: 5200 },
  { week: 'Week 3', revenue: 4800 },
  { week: 'Week 4', revenue: 6100 },
]

export default function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn')
    if (!loggedIn) {
      router.push('/')
    } else {
      setIsLoggedIn(true)
    }
  }, [router])

  if (!isLoggedIn) return null

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 flex flex-col lg:ml-64">
        <Header title="Dashboard" />
        
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={Users} label="Total Patients" value="247" color="#0ea5e9" />
            <StatCard icon={Calendar} label="Today's Appointments" value="12" color="#10b981" />
            <StatCard icon={Clock} label="Attendance Rate" value="94%" color="#f59e0b" />
            <StatCard icon={DollarSign} label="Monthly Revenue" value="₹48,500" color="#8b5cf6" />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient & Appointment Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="appointments" fill="#0ea5e9" />
                  <Bar dataKey="patients" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Revenue</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Appointments</h3>
              <div className="space-y-3">
                {[
                  { patient: 'John Doe', time: '10:00 AM', therapist: 'Dr. Smith' },
                  { patient: 'Jane Wilson', time: '11:30 AM', therapist: 'Dr. Johnson' },
                  { patient: 'Mike Brown', time: '2:00 PM', therapist: 'Dr. Smith' },
                  { patient: 'Sarah Davis', time: '3:30 PM', therapist: 'Dr. Lee' },
                ].map((apt, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{apt.patient}</p>
                      <p className="text-sm text-gray-500">{apt.therapist}</p>
                    </div>
                    <p className="text-sm font-semibold text-primary-500">{apt.time}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
              <div className="space-y-4">
                {[
                  { metric: 'Patient Satisfaction', value: 96, color: '#10b981' },
                  { metric: 'Treatment Success Rate', value: 89, color: '#0ea5e9' },
                  { metric: 'Staff Utilization', value: 82, color: '#f59e0b' },
                  { metric: 'Billing Accuracy', value: 99, color: '#8b5cf6' },
                ].map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">{item.metric}</span>
                      <span className="text-sm font-bold" style={{ color: item.color }}>{item.value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ width: `${item.value}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
