'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Plus, MessageSquare, Search, Trash2, Calendar, ChevronLeft, ChevronRight, Clock, Sparkles } from 'lucide-react'
import { useQuery, useMutation } from '@apollo/client/react'
import { GET_CHAT_HISTORY, DELETE_CHAT_MUTATION } from '../graphql/client'

function formatTime(date) {
  const now = new Date()
  const diff = now - new Date(date)
  const h = Math.floor(diff / 3600000)
  const d = Math.floor(diff / 86400000)
  if (h < 1) return 'Just now'
  if (h < 24) return `${h}h ago`
  if (d < 7) return `${d}d ago`
  return new Date(date).toLocaleDateString()
}

function groupByTime(chats) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1)
  const week = new Date(today); week.setDate(week.getDate() - 7)
  const groups = { Today: [], Yesterday: [], 'This Week': [], Older: [] }
  chats?.forEach(c => {
    const d = new Date(c.timestamp)
    if (d >= today) groups.Today.push(c)
    else if (d >= yesterday) groups.Yesterday.push(c)
    else if (d >= week) groups['This Week'].push(c)
    else groups.Older.push(c)
  })
  return groups
}

export default function Sidebar() {
  const [search, setSearch] = useState('')
  const [collapsed, setCollapsed] = useState(false)
  const [toDelete, setToDelete] = useState(null)
  const [user, setUser] = useState(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    try { const u = JSON.parse(localStorage.getItem('currentUser')); if (u) setUser(u) } catch { }
  }, [])

  useEffect(() => {
    const check = () => setCollapsed(window.innerWidth < 768)
    check(); window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const { data, refetch } = useQuery(GET_CHAT_HISTORY, {
    variables: { userId: user?.id }, skip: !user?.id, fetchPolicy: 'network-only',
  })
  const [deleteChat] = useMutation(DELETE_CHAT_MUTATION)

  useEffect(() => {
    const fn = () => refetch()
    window.addEventListener('chatHistoryUpdated', fn)
    return () => window.removeEventListener('chatHistoryUpdated', fn)
  }, [refetch])

  useEffect(() => { if (user?.id) refetch() }, [pathname, user, refetch])

  const all = data?.getChatHistory || []
  const filtered = all.filter(c =>
    c?.title?.toLowerCase().includes(search.toLowerCase()) ||
    c?.lastMessage?.toLowerCase().includes(search.toLowerCase())
  )
  const grouped = groupByTime(filtered)

  const confirmDelete = async () => {
    if (!toDelete || !user?.id) return
    try {
      await deleteChat({ variables: { chatId: toDelete, userId: user.id } })
      refetch()
      if (pathname === `/chat/${toDelete}`) router.push('/chat')
    } catch (e) { console.error(e) }
    finally { setToDelete(null) }
  }

  const isActive = (id) => pathname === `/chat/${id}`

  return (
    <>
      {/* ── SIDEBAR ─────────────────────────────────── */}
      <aside
        className={`relative flex flex-col h-screen transition-all duration-300 ease-in-out shrink-0 ${collapsed ? 'w-[64px]' : 'w-[268px]'}`}
        style={{
          background: 'linear-gradient(180deg, #0c0e1f 0%, #080b18 100%)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Top shimmer line */}
        <div className="absolute top-0 inset-x-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.6), transparent)' }} />

        {/* ── HEADER ─────────────────────────── */}
        <div className="p-3 space-y-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex items-center justify-between">
            {!collapsed && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center glow-pulse shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white leading-none" style={{ fontFamily: 'Syne, sans-serif' }}>
                    Event <span className="gradient-text">AI</span>
                  </p>
                  <p className="text-[10px] leading-none mt-0.5" style={{ color: 'rgba(156,163,175,0.75)' }}>Your AI Assistant</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-lg text-gray-600 hover:text-gray-300 transition-colors ml-auto"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* New Chat button */}
          {collapsed ? (
            <button onClick={() => router.push('/chat')}
              className="w-full flex items-center justify-center p-2.5 rounded-xl btn-primary"
              title="New Chat">
              <Plus className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={() => router.push('/chat')}
              className="btn-primary w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold">
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              New Conversation
            </button>
          )}
        </div>

        {/* ── SEARCH ─────────────────────────── */}
        {!collapsed && (
          <div className="px-3 py-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: 'rgba(156,163,175,0.5)' }} />
              <input
                type="text"
                placeholder="Search conversations…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  color: '#e5e7eb',
                }}
              />
            </div>
          </div>
        )}

        {/* ── CHAT LIST ──────────────────────── */}
        <div className="flex-1 overflow-y-auto py-3 scrollbar-hide">
          {!collapsed ? (
            filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                <div className="w-10 h-10 rounded-2xl mb-3 flex items-center justify-center"
                  style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}>
                  <MessageSquare className="w-5 h-5 text-violet-500" />
                </div>
                <p className="text-xs text-gray-600">{search ? 'No results found' : 'No conversations yet'}</p>
                {!search && <p className="text-xs text-gray-700 mt-1">Start a new chat above</p>}
              </div>
            ) : (
              Object.entries(grouped).map(([label, chats]) =>
                chats.length === 0 ? null : (
                  <div key={label} className="mb-4 px-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest px-2 mb-1.5" style={{ color: 'rgba(156,163,175,0.5)' }}>{label}</p>
                    <div className="space-y-0.5">
                      {chats.map(chat => (
                        <div
                          key={chat.id}
                          className="group relative rounded-xl cursor-pointer transition-all duration-200"
                          style={isActive(chat.id) ? {
                            background: 'linear-gradient(135deg, rgba(124,58,237,0.18) 0%, rgba(79,70,229,0.12) 100%)',
                            border: '1px solid rgba(124,58,237,0.3)',
                          } : {
                            border: '1px solid transparent',
                          }}
                        >
                          <button
                            onClick={() => router.push(`/chat/${chat.id}`)}
                            className="w-full text-left p-2.5 pr-8"
                          >
                            <div className="flex items-start gap-2.5">
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-all ${isActive(chat.id) ? 'gradient-primary' : 'bg-white/[0.05] group-hover:bg-violet-500/10'}`}>
                                <MessageSquare className={`w-3.5 h-3.5 ${isActive(chat.id) ? 'text-white' : 'text-gray-600 group-hover:text-violet-400'}`} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className={`text-xs font-semibold truncate leading-snug ${isActive(chat.id) ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                                  {chat.title}
                                </p>
                                {chat.lastMessage && (
                                  <p className="text-[11px] truncate mt-0.5 leading-tight" style={{ color: 'rgba(156, 163, 175, 0.7)' }}>{chat.lastMessage}</p>
                                )}
                                <div className="flex items-center gap-1 mt-1">
                                  <Clock className="w-2.5 h-2.5" style={{ color: 'rgba(156,163,175,0.4)' }} />
                                  <span className="text-[10px]" style={{ color: 'rgba(156,163,175,0.45)' }}>{formatTime(chat.timestamp)}</span>
                                </div>
                              </div>
                            </div>
                          </button>
                          <button
                            onClick={e => { e.stopPropagation(); setToDelete(chat.id) }}
                            className="absolute top-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all text-gray-600 hover:text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )
            )
          ) : (
            /* Collapsed icon list */
            <div className="px-2 space-y-1">
              {all.slice(0, 10).map(chat => (
                <button key={chat.id} onClick={() => router.push(`/chat/${chat.id}`)} title={chat.title}
                  className={`w-full p-2.5 rounded-xl flex items-center justify-center transition-all ${isActive(chat.id) ? 'gradient-primary' : 'text-gray-600 hover:text-violet-400 hover:bg-violet-500/10'}`}>
                  <MessageSquare className="w-4 h-4" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── USER FOOTER ────────────────────── */}
        {!collapsed && user && (
          <div className="p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div className="w-7 h-7 rounded-full avatar flex items-center justify-center shrink-0">
                <span className="text-white text-xs font-bold">{user.name?.charAt(0)?.toUpperCase()}</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-200 truncate">{user.name}</p>
                <p className="text-[10px] truncate" style={{ color: 'rgba(156,163,175,0.6)' }}>{user.email}</p>
              </div>
              <div className="ml-auto shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" style={{ boxShadow: '0 0 6px rgba(34,197,94,0.8)' }} />
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* ── DELETE MODAL ────────────────────────────── */}
      {toDelete && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)' }}>
          <div className="w-full max-w-sm rounded-2xl p-6 animate-scale-in"
            style={{ background: '#0c0e1f', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 24px 80px rgba(0,0,0,0.8)' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)' }}>
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">Delete conversation?</h3>
                <p className="text-gray-500 text-xs">This cannot be undone</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-5 leading-relaxed">
              All messages in this conversation will be permanently removed.
            </p>
            <div className="flex gap-2">
              <button onClick={() => setToDelete(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-400"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                Cancel
              </button>
              <button onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white"
                style={{ background: 'rgba(239,68,68,0.75)', border: '1px solid rgba(239,68,68,0.35)' }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}