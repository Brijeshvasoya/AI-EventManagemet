'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, Sparkles, ChevronDown, Bell, Sun, Moon } from 'lucide-react'
import { useTheme } from '@/providers/ThemeProvider'

export default function ChatHeader({ title, subtitle }) {
  const router = useRouter()
  const [user, setUser]         = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const { theme, toggleTheme }  = useTheme()

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
          background: 'var(--t-header-bg)',
          borderBottom: `1px solid var(--t-header-border)`,
          backdropFilter: 'blur(20px)',
          zIndex: 30,
        }}
      >
        {/* Top accent line */}
        <div className="absolute top-0 inset-x-0 h-px"
          style={{ background: 'var(--t-header-accent)' }} />

        {/* ── LEFT – Title ──────────────────────── */}
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center glow-pulse">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center"
              style={{ background: 'var(--t-status-dot-bg)' }}>
              <div className="w-2 h-2 rounded-full bg-green-400"
                style={{ boxShadow: '0 0 6px rgba(34,197,94,0.9)' }} />
            </div>
          </div>
          <div>
            <h1 className="text-sm font-bold leading-none" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--t-header-title)' }}>
              {title || 'AI Event Manager'}
            </h1>
            <p className="text-xs mt-0.5 leading-none" style={{ color: 'var(--t-header-subtitle)' }}>
              {subtitle || 'Always online · Powered by Mastra AI'}
            </p>
          </div>
        </div>

        {/* ── RIGHT – Theme toggle + User ──────────────────────── */}
        <div className="flex items-center gap-2">

          {/* Theme Toggle */}
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            <Sun className="theme-toggle-icon theme-toggle-icon-sun" />
            <Moon className="theme-toggle-icon theme-toggle-icon-moon" />
            <div className="theme-toggle-knob">
              {theme === 'light'
                ? <Sun className="w-3 h-3 text-white" strokeWidth={2.5} />
                : <Moon className="w-3 h-3 text-white" strokeWidth={2.5} />
              }
            </div>
          </button>

          {user && (
            <>
              {/* Bell */}
              {/* <button
                className="relative p-2 rounded-xl transition-colors"
                style={{ background: 'var(--t-header-bell-bg)', border: `1px solid var(--t-header-bell-border)` }}
              >
                <Bell className="w-4 h-4" style={{ color: 'var(--t-header-bell-icon)' }} />
                <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-violet-500" />
              </button> */}

              {/* User chip */}
              <button
                id="user-menu-btn"
                onClick={() => setMenuOpen(prev => !prev)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all"
                style={{
                  background: menuOpen ? 'var(--t-header-user-bg-open)' : 'var(--t-header-user-bg)',
                  border: `1px solid var(--t-header-user-border)`,
                }}
              >
                {/* Avatar */}
                <div className="w-7 h-7 rounded-full avatar flex items-center justify-center shrink-0">
                  <span className="text-white text-xs font-bold">
                    {user.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                {/* Name only – no email in chip to avoid truncation */}
                <span className="hidden sm:block text-sm font-semibold" style={{ color: 'var(--t-header-user-name)' }}>
                  {user.name?.split(' ')[0]}
                </span>
                <ChevronDown
                  className="w-3.5 h-3.5 transition-transform duration-200"
                  style={{
                    color: 'var(--t-header-chevron)',
                    transform: menuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                />
              </button>
            </>
          )}
        </div>
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
              background: 'var(--t-dropdown-bg)',
              border: `1px solid var(--t-dropdown-border)`,
              boxShadow: `0 24px 60px var(--t-dropdown-shadow), 0 0 0 1px rgba(255,255,255,0.04) inset`,
            }}
          >
            {/* User info header */}
            <div className="px-4 py-3.5" style={{ borderBottom: `1px solid var(--t-dropdown-divider)` }}>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full avatar flex items-center justify-center shrink-0">
                  <span className="text-white text-sm font-bold">
                    {user.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: 'var(--t-dropdown-name)' }}>{user.name}</p>
                  <p className="text-xs break-all leading-snug" style={{ color: 'var(--t-dropdown-email)' }}>{user.email}</p>
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