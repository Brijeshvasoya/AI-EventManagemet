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
    <header className="glass border-b border-white/20 shadow-lg px-6 py-5 backdrop-blur-sm">
      <div className="pl-4 pr-4 flex items-center justify-between">

        {/* LEFT SIDE (Title + Subtitle) */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-105 transition-all duration-300">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold gradient-text">
                {title}
              </h1>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-sm text-gray-600 font-medium">{subtitle}</p>
              </div>
            </div>
          </div>

        {/* RIGHT SIDE (User Info + Logout) */}
        <div className="flex items-center gap-4 shrink-0">
          {currentUser && (
            <>
              <div className="hidden sm:flex items-center gap-3 px-5 py-3 glass-card rounded-xl border border-white/20 shadow-md hover:shadow-lg transition-all duration-300">
                <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center shadow-md">
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
                className="flex items-center cursor-pointer gap-2 px-5 py-3 text-sm font-medium glass hover:bg-red-500/20 text-red-600 rounded-xl transition-all duration-300 hover:shadow-md border border-white/20 hover:scale-105"
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