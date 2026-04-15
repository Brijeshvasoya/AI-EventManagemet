/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import { useChat } from '@ai-sdk/react'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Bot, User, Calendar, Users, MapPin, Clock, DollarSign, Sparkles, Zap, ArrowRight } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import ChatInput from '@/components/ChatInput'

/* ── Markdown renderer ───────────────────────────────────── */
const md = {
  h1: ({ children }) => <h1 className="text-lg font-bold mt-4 mb-2" style={{ color: 'var(--t-md-h-color)' }}>{children}</h1>,
  h2: ({ children }) => <h2 className="text-base font-bold mt-3 mb-1.5" style={{ color: 'var(--t-md-h-color)' }}>{children}</h2>,
  h3: ({ children }) => <h3 className="text-sm font-semibold mt-3 mb-1" style={{ color: 'var(--t-md-h-color)' }}>{children}</h3>,
  p:  ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed text-sm" style={{ color: 'var(--t-md-p-color)' }}>{children}</p>,
  strong: ({ children }) => <strong className="font-semibold" style={{ color: 'var(--t-md-strong-color)' }}>{children}</strong>,
  em: ({ children }) => <em className="italic" style={{ color: 'var(--t-md-em-color)' }}>{children}</em>,
  ul: ({ children }) => <ul className="list-disc pl-5 space-y-1 mb-2 text-sm" style={{ color: 'var(--t-md-list-color)' }}>{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-5 space-y-1 mb-2 text-sm" style={{ color: 'var(--t-md-list-color)' }}>{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  code: ({ inline, children }) => inline
    ? <code className="px-1.5 py-0.5 rounded text-xs font-mono" style={{ background: 'var(--t-md-code-bg)', border: `1px solid var(--t-md-code-border)`, color: 'var(--t-md-code-text)' }}>{children}</code>
    : <pre className="p-3.5 rounded-xl text-xs font-mono overflow-x-auto my-3" style={{ background: 'var(--t-md-pre-bg)', border: `1px solid var(--t-md-pre-border)` }}><code style={{ color: 'var(--t-md-pre-text)' }}>{children}</code></pre>,
  blockquote: ({ children }) => <blockquote className="pl-3 my-2 text-sm italic" style={{ borderLeft: `2px solid var(--t-md-quote-border)`, background: 'var(--t-md-quote-bg)', padding: '8px 12px', borderRadius: '0 8px 8px 0', color: 'var(--t-md-quote-text)' }}>{children}</blockquote>,
  hr: () => <hr className="my-3" style={{ borderColor: 'var(--t-md-hr)' }} />,
  table: ({ children }) => <div className="overflow-x-auto my-3 rounded-xl" style={{ border: `1px solid var(--t-md-table-border)` }}><table className="min-w-full text-sm">{children}</table></div>,
  thead: ({ children }) => <thead style={{ background: 'var(--t-md-thead-bg)' }}>{children}</thead>,
  tbody: ({ children }) => <tbody style={{ background: 'var(--t-md-tbody-bg)' }}>{children}</tbody>,
  tr: ({ children }) => <tr style={{ borderBottom: `1px solid var(--t-md-tr-border)` }}>{children}</tr>,
  th: ({ children }) => <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--t-md-th-text)' }}>{children}</th>,
  td: ({ children }) => <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--t-md-td-text)' }}>{children}</td>,
}

function getText(msg) {
  return msg.parts?.filter(p => p.type === 'text').map(p => p.text).join('') || ''
}

const suggestions = [
  { icon: Calendar,   text: 'Plan a wedding event',        color: '#8b5cf6', bg: 'rgba(139,92,246,0.10)' },
  { icon: Users,      text: 'Manage my guest list',        color: '#06b6d4', bg: 'rgba(6,182,212,0.08)'  },
  { icon: MapPin,     text: 'Find a venue in Mumbai',      color: '#ec4899', bg: 'rgba(236,72,153,0.08)' },
  { icon: DollarSign, text: 'Optimize my event budget',    color: '#22c55e', bg: 'rgba(34,197,94,0.08)'  },
  { icon: Clock,      text: 'Create a detailed timeline',  color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
  { icon: Zap,        text: 'Coordinate with vendors',     color: '#a78bfa', bg: 'rgba(167,139,250,0.08)'},
]

export default function ChatPage() {
  const router          = useRouter()
  const chatIdRef       = useRef(null)
  const hasRoutedRef    = useRef(false)
  const bottomRef       = useRef(null)
  const [inputValue, setInputValue] = useState('')
  const [chatId, setChatId]         = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const currentUserRef = useRef(null)

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('currentUser'))
      if (u) {
        setCurrentUser(u)
        currentUserRef.current = u
      }
    } catch {}
  }, [])

  useEffect(() => {
    const id = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    chatIdRef.current = id; setChatId(id)
  }, [])

  const { messages, status, error, sendMessage } = useChat({
    api: '/api/chat',
    id: chatId ?? undefined,
    body: {
      resourceId: currentUser?.id || 'anonymous',
    },
    onFinish: async () => {
      // Mastra Memory handles storing messages automatically
      // Just notify sidebar to refresh the thread list
      window.dispatchEvent(new Event('chatHistoryUpdated'))

      if (!hasRoutedRef.current && chatIdRef.current) {
        hasRoutedRef.current = true
        router.replace(`/chat/${chatIdRef.current}`)
      }
    },
    onError: e => console.error(e),
  })

  const isLoading = status === 'submitted' || status === 'streaming'

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const handleSend = () => {
    if (!inputValue.trim() || isLoading) return
    const userId = currentUserRef.current?.id || currentUser?.id || 'anonymous'
    sendMessage({ text: inputValue }, { body: { resourceId: userId } })
    setInputValue('')
  }

  const firstName = currentUser?.name?.split(' ')[0]

  return (
    <div className="flex flex-col flex-1 overflow-hidden relative animate-fade-slide-up">

      {/* Subtle background gradient */}
      <div className="absolute inset-0 pointer-events-none animate-float-slow" style={{
        background: `radial-gradient(ellipse 70% 50% at 50% 0%, var(--t-chat-glow) 0%, transparent 70%)`,
      }} />

      {/* ── MESSAGES ──────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide relative">
        <div className="max-w-2xl mx-auto">

          {/* Empty State */}
          {messages.length === 0 && (
            <div className="pt-6 pb-8 text-center">
              <div className="relative inline-block mb-5">
                <div className="absolute inset-0 rounded-3xl opacity-60" style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', filter: 'blur(16px)', transform: 'scale(0.9)' }} />
                <div className="relative w-20 h-20 rounded-3xl gradient-primary flex items-center justify-center glow-pulse">
                  <Bot className="w-10 h-10 text-white" />
                </div>
              </div>

              <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--t-text-primary)' }}>
                {firstName ? `Hey ${firstName}! 👋` : 'Hello there! 👋'}
              </h2>
              <p className="text-sm max-w-sm mx-auto leading-relaxed mb-8" style={{ color: 'var(--t-chat-empty-text)' }}>
                I&apos;m your AI event planning assistant. Tell me about your event and I&apos;ll help you plan every detail perfectly.
              </p>

              {/* Suggestion grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-w-lg mx-auto">
                {suggestions.map((s, i) => (
                  <button
                    key={s.text}
                    onClick={() => setInputValue(s.text)}
                    className="group flex items-center gap-2.5 p-3 rounded-2xl text-left transition-all duration-300 hover:scale-[1.03] hover:brightness-110 hover:-translate-y-0.5"
                    style={{
                      background: s.bg,
                      border: `1px solid ${s.color}28`,
                    }}
                  >
                    <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110"
                      style={{ background: `${s.color}18` }}>
                      <s.icon className="w-3.5 h-3.5" style={{ color: s.color }} />
                    </div>
                    <span className="text-xs font-medium leading-tight" style={{ color: 'var(--t-chat-suggestion-text)' }}>{s.text}</span>
                  </button>
                ))}
              </div>

              <p className="mt-6 text-xs" style={{ color: 'var(--t-chat-empty-hint)' }}>or type your own question below ↓</p>
            </div>
          )}

          {/* Messages */}
          {messages.length > 0 && (
            <div className="space-y-5">
              {messages.map(msg => {
                const isUser = msg.role === 'user'
                return (
                  <div key={msg.id} className={`flex gap-3 msg-enter ${isUser ? 'justify-end' : 'justify-start'}`}>

                    {/* AI avatar */}
                    {!isUser && (
                      <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center shrink-0 mt-0.5 glow-violet"
                        style={{ boxShadow: '0 0 16px rgba(124,58,237,0.4)' }}>
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                    )}

                    {/* Bubble */}
                    <div className="max-w-[80%]"
                      style={isUser ? {
                        background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                        border: '1px solid rgba(124,58,237,0.4)',
                        boxShadow: '0 4px 20px rgba(124,58,237,0.3), 0 1px 0 rgba(255,255,255,0.08) inset',
                        borderRadius: '18px 18px 4px 18px',
                        padding: '12px 16px',
                      } : {
                        background: 'var(--t-msg-ai-bg)',
                        border: `1px solid var(--t-msg-ai-border)`,
                        boxShadow: `0 2px 16px var(--t-msg-ai-shadow)`,
                        borderRadius: '4px 18px 18px 18px',
                        padding: '14px 18px',
                      }}>
                      {isUser
                        ? <p className="text-sm text-white leading-relaxed whitespace-pre-wrap">{getText(msg)}</p>
                        : <ReactMarkdown components={md} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{getText(msg)}</ReactMarkdown>
                      }
                    </div>

                    {/* User avatar */}
                    {isUser && (
                      <div className="w-8 h-8 rounded-xl avatar flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">{currentUser?.name?.charAt(0) || 'U'}</span>
                      </div>
                    )}
                  </div>
                )
              })}

              {/* Typing */}
              {isLoading && (
                <div className="flex gap-3 msg-enter">
                  <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center shrink-0 mt-0.5" style={{ boxShadow: '0 0 16px rgba(124,58,237,0.4)' }}>
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="px-4 py-3.5 rounded-[4px_18px_18px_18px] flex items-center gap-1.5 animate-breathe-glow"
                    style={{ background: 'var(--t-typing-bg)', border: `1px solid var(--t-typing-border)` }}>
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                </div>
              )}

              {error && (
                <div className="px-4 py-3 rounded-xl text-sm text-red-400"
                  style={{ background: 'var(--t-error-bg)', border: `1px solid var(--t-error-border)` }}>
                  ⚠ {error.message}
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          )}
        </div>
      </div>

      {/* ── INPUT ─────────────────────────────────── */}
      <ChatInput
        inputValue={inputValue}
        setInputValue={setInputValue}
        onSend={handleSend}
        isLoading={isLoading}
        placeholder="Ask about venues, budgets, timelines, guests…"
      />
    </div>
  )
}