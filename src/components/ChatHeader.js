/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, Sparkles } from 'lucide-react'

export default function ChatHeader({ title, subtitle }) {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const raw = localStorage.getItem('currentUser')
    if (raw) {
      setCurrentUser(JSON.parse(raw))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('currentUser')
    router.push('/login')
  }

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">

        {/* LEFT SIDE (Title + Subtitle) */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {title}
              </h1>
              <p className="text-sm text-gray-600 font-medium">{subtitle}</p>
            </div>
          </div>

        {/* RIGHT SIDE (User Info + Logout) */}
        <div className="flex items-center gap-4 shrink-0">
          {currentUser && (
            <>
              <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {currentUser?.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {currentUser?.email || 'user@example.com'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center cursor-pointer gap-2 px-4 py-2.5 text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200 hover:shadow-md border border-red-200"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}