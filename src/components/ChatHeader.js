'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, Sparkles, ChevronDown, Bell } from 'lucide-react'

export default function ChatHeader({ title, subtitle }) {
  const router = useRouter()
  const [user, setUser]         = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem('currentUser')
    if (raw) setUser(JSON.parse(raw))
  }, [])

  const logout = () => {
    setMenuOpen(false)
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('currentUser')
    router.push('/login')
  }

  return (
    <>
      <header
        className="relative shrink-0 flex items-center justify-between px-5 py-3"
        style={{
          background: 'linear-gradient(180deg, rgba(12,14,31,0.98) 0%, rgba(8,11,24,0.95) 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)',
          zIndex: 30,
        }}
      >
        {/* Top accent line */}
        <div className="absolute top-0 inset-x-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(124,58,237,0.5) 30%, rgba(6,182,212,0.3) 70%, transparent 100%)' }} />

        {/* ── LEFT – Title ──────────────────────── */}
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center glow-pulse">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center"
              style={{ background: '#0c0e1f' }}>
              <div className="w-2 h-2 rounded-full bg-green-400"
                style={{ boxShadow: '0 0 6px rgba(34,197,94,0.9)' }} />
            </div>
          </div>
          <div>
            <h1 className="text-sm font-bold text-white leading-none" style={{ fontFamily: 'Syne, sans-serif' }}>
              {title || 'AI Event Manager'}
            </h1>
            <p className="text-xs mt-0.5 leading-none" style={{ color: 'rgba(156,163,175,0.7)' }}>
              {subtitle || 'Always online · Powered by Mastra AI'}
            </p>
          </div>
        </div>

        {/* ── RIGHT – User ──────────────────────── */}
        {user && (
          <div className="flex items-center gap-2">

            {/* Bell */}
            <button
              className="relative p-2 rounded-xl transition-colors"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <Bell className="w-4 h-4" style={{ color: 'rgba(156,163,175,0.7)' }} />
              <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-violet-500" />
            </button>

            {/* User chip */}
            <button
              id="user-menu-btn"
              onClick={() => setMenuOpen(prev => !prev)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all"
              style={{
                background: menuOpen ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.09)',
              }}
            >
              {/* Avatar */}
              <div className="w-7 h-7 rounded-full avatar flex items-center justify-center shrink-0">
                <span className="text-white text-xs font-bold">
                  {user.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              {/* Name only – no email in chip to avoid truncation */}
              <span className="hidden sm:block text-sm font-semibold text-gray-200">
                {user.name?.split(' ')[0]}
              </span>
              <ChevronDown
                className="w-3.5 h-3.5 transition-transform duration-200"
                style={{
                  color: 'rgba(156,163,175,0.6)',
                  transform: menuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              />
            </button>
          </div>
        )}
      </header>

      {/* ── Dropdown rendered outside header so it always layers above content ── */}
      {menuOpen && user && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0"
            style={{ zIndex: 9998 }}
            onClick={() => setMenuOpen(false)}
          />
          {/* Menu */}
          <div
            className="fixed top-[60px] right-4 w-52 rounded-2xl overflow-hidden animate-fade-down"
            style={{
              zIndex: 9999,
              background: 'linear-gradient(160deg, #11142a 0%, #0c0e1f 100%)',
              border: '1px solid rgba(255,255,255,0.11)',
              boxShadow: '0 24px 60px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.04) inset',
            }}
          >
            {/* User info header */}
            <div className="px-4 py-3.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full avatar flex items-center justify-center shrink-0">
                  <span className="text-white text-sm font-bold">
                    {user.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 break-all leading-snug">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-1.5">
              <button
                id="signout-btn"
                onClick={logout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{ color: '#f87171' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.12)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <LogOut className="w-4 h-4 shrink-0" />
                Sign out
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}