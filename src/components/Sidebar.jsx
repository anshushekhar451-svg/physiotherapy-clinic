'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  Activity, 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Clock, 
  DollarSign, 
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Users, label: 'Patients', href: '/patients' },
  { icon: Calendar, label: 'Appointments', href: '/appointments' },
  { icon: Clock, label: 'Attendance', href: '/attendance' },
  { icon: DollarSign, label: 'Billing', href: '/billing' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userEmail')
    router.push('/')
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-primary-500 text-white rounded-lg lg:hidden"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-gray-900 text-white transform lg:translate-x-0 transition-transform z-40
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex items-center gap-3 border-b border-gray-700">
          <div className="bg-primary-500 p-2 rounded-lg">
            <Activity size={28} />
          </div>
          <div>
            <h2 className="font-bold text-xl">PhysioClinic</h2>
            <p className="text-xs text-gray-400">Management System</p>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      <div
        className={`fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30 transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />
    </>
  )
}
