'use client'

import { useChat } from '@ai-sdk/react'
import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { useParams } from 'next/navigation'
import { Bot, User, ChevronUp, ChevronDown, Sparkles } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import ChatInput from '@/components/ChatInput'

const markdownComponents = {
  h1: ({ children }) => <h1 className="text-3xl font-black mt-8 mb-4 tracking-tight leading-tight" style={{ color: 'var(--t-md-h-color)', fontFamily: 'Syne, sans-serif' }}>{children}</h1>,
  h2: ({ children }) => <h2 className="text-2xl font-bold mt-7 mb-3 tracking-tight" style={{ color: 'var(--t-md-h-color)', fontFamily: 'Syne, sans-serif' }}>{children}</h2>,
  h3: ({ children }) => <h3 className="text-xl font-semibold mt-6 mb-2 tracking-tight" style={{ color: 'var(--t-md-h-color)', fontFamily: 'Syne, sans-serif' }}>{children}</h3>,
  p: ({ children }) => <p className="mb-4 last:mb-0 leading-relaxed text-base text-pretty" style={{ color: 'var(--t-md-p-color)' }}>{children}</p>,
  strong: ({ children }) => <strong className="font-semibold px-1.5 py-0.5 rounded-md" style={{ color: 'var(--t-md-strong-color)', background: 'rgba(124,58,237,0.08)' }}>{children}</strong>,
  em: ({ children }) => <em className="italic text-base" style={{ color: 'var(--t-md-em-color)' }}>{children}</em>,
  ul: ({ children }) => <ul className="list-outside list-disc pl-5 space-y-2 mb-6 text-base marker:text-purple-500" style={{ color: 'var(--t-md-list-color)' }}>{children}</ul>,
  ol: ({ children }) => <ol className="list-outside list-decimal pl-5 space-y-2 mb-6 text-base font-medium marker:text-purple-500" style={{ color: 'var(--t-md-list-color)' }}>{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed pl-1" style={{ color: 'var(--t-md-list-color)' }}>{children}</li>,
  code: ({ inline, children }) => inline
    ? <code className="px-1.5 py-0.5 rounded-md text-sm font-mono tracking-tight" style={{ background: 'var(--t-md-code-bg)', border: `1px solid var(--t-md-code-border)`, color: 'var(--t-md-code-text)' }}>{children}</code>
    : <div className="group relative my-5 max-w-full">
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-purple-500/15 to-cyan-500/15 opacity-0 group-hover:opacity-100 blur transition-opacity duration-300 pointer-events-none" />
      <pre className="relative p-4 rounded-xl text-sm font-mono overflow-x-auto shadow-sm" style={{ background: 'var(--t-md-pre-bg)', border: `1px solid var(--t-md-pre-border)'` }}><code style={{ color: 'var(--t-md-pre-text)' }}>{children}</code></pre>
    </div>,
  blockquote: ({ children }) => (
    <div className="my-6 relative">
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-gradient-to-b from-purple-500 to-cyan-500" />
      <blockquote className="pl-6 py-2 text-base italic leading-relaxed" style={{ background: 'var(--t-md-quote-bg)', borderRadius: '0 12px 12px 0', color: 'var(--t-md-quote-text)' }}>
        {children}
      </blockquote>
    </div>
  ),
  hr: () => <hr className="my-6 border-t-2" style={{ borderColor: 'var(--t-md-hr)' }} />,
  table: ({ children }) => (
    <div className="overflow-x-auto my-8 rounded-2xl shadow-sm border border-black/5 dark:border-white/10" style={{ background: 'var(--t-md-tbody-bg)' }}>
      <table className="w-full text-left border-collapse text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead style={{ background: 'var(--t-md-thead-bg)' }}>
      {children}
    </thead>
  ),
  tbody: ({ children }) => (
    <tbody className="divide-y" style={{ borderColor: 'var(--t-md-tr-border)' }}>
      {children}
    </tbody>
  ),
  tr: ({ children }) => (
    <tr className="transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.02] group">
      {children}
    </tr>
  ),
  th: ({ children }) => (
    <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest whitespace-nowrap" style={{ color: 'var(--t-md-th-text)', borderBottom: `2px solid var(--t-md-tr-border)` }}>
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-6 py-4 leading-relaxed" style={{ color: 'var(--t-md-td-text)' }}>
      {children}
    </td>
  ),
}

function getMessageText(message) {
  return message.parts?.filter((p) => p.type === 'text').map((p) => p.text).join('') || ''
}

export default function SpecificChatPage() {
  const params = useParams()
  const chatId = params.id

  const [isLoadingHistory, setIsLoadingHistory] = useState(true)
  const [inputValue, setInputValue] = useState('')
  const [scrollDirection, setScrollDirection] = useState(null)

  const messagesContainerRef = useRef(null)

  const [currentUser, setCurrentUser] = useState(null)
  const currentUserRef = useRef(null)

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('currentUser'))
      if (user) {
        setCurrentUser(user)
        currentUserRef.current = user
      }
    } catch { }
  }, [])

  const { messages, status, sendMessage, setMessages } = useChat({
    api: '/api/chat',
    id: chatId,
    body: {
      resourceId: currentUser?.id || 'anonymous',
    },
    onFinish: async () => {
      // Mastra Memory handles storing messages automatically
      // Just notify sidebar to refresh the thread list
      window.dispatchEvent(new Event('chatHistoryUpdated'))
    },
    onError: (err) => console.error('Chat error:', err),
  })

  const isLoading = status === 'submitted' || status === 'streaming'

  /* ---------------- AUTO SCROLL TO BOTTOM ---------------- */

  useLayoutEffect(() => {
    const container = messagesContainerRef.current
    if (!container) return

    const id = requestAnimationFrame(() => {
      container.scrollTop = container.scrollHeight
    })

    return () => cancelAnimationFrame(id)
  }, [messages, status])

  /* ---------------- SCROLL POSITION DETECTION ---------------- */

  useEffect(() => {
    const container = messagesContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const threshold = 50
      const isOverflowing = container.scrollHeight > container.clientHeight

      if (!isOverflowing) {
        setScrollDirection(prev => (prev !== null ? null : prev))
        return
      }

      const isAtBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight < threshold

      const newDirection = isAtBottom ? 'up' : 'down'

      setScrollDirection(prev =>
        prev !== newDirection ? newDirection : prev
      )
    }

    container.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  /* ---------------- SCROLL ACTIONS ---------------- */

  const scrollToTop = () => {
    const container = messagesContainerRef.current
    if (!container) return
    container.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollToBottom = () => {
    const container = messagesContainerRef.current
    if (!container) return
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' })
  }

  /* ---------------- LOAD HISTORY FROM MASTRA MEMORY ---------------- */

  useEffect(() => {
    if (!chatId || !currentUser?.id) return

    const loadHistory = async () => {
      try {
        const res = await fetch(`/api/chat/threads/${chatId}`)
        if (!res.ok) {
          setIsLoadingHistory(false)
          return
        }

        const data = await res.json()

        if (data.messages && data.messages.length > 0) {
          // Convert MastraDBMessage format to useChat UI format
          // Mastra stores content as JSON string: {"format":2,"parts":[...],"content":"..."}
          const uiMessages = data.messages
            .filter((m) => m.role === 'user' || m.role === 'assistant')
            .map((m) => {
              let text = ''
              try {
                if (typeof m.content === 'string') {
                  // Try parsing as JSON first (Mastra format)
                  const parsed = JSON.parse(m.content)
                  if (parsed.parts && Array.isArray(parsed.parts)) {
                    text = parsed.parts
                      .filter((p) => p.type === 'text')
                      .map((p) => p.text)
                      .join('')
                  } else if (parsed.content) {
                    text = parsed.content
                  } else {
                    text = m.content
                  }
                } else if (m.content?.parts) {
                  text = m.content.parts
                    .filter((p) => p.type === 'text')
                    .map((p) => p.text)
                    .join('')
                } else if (m.content?.content) {
                  text = m.content.content
                } else {
                  text = String(m.content || '')
                }
              } catch {
                // Not JSON, use as plain text
                text = String(m.content || '')
              }

              return {
                id: m.id,
                role: m.role,
                parts: [{ type: 'text', text }],
              }
            })
            .filter((m) => m.parts[0].text.trim().length > 0)

          setMessages(uiMessages)
        }
      } catch (e) {
        console.error('Failed to load chat history:', e)
      } finally {
        setIsLoadingHistory(false)
      }
    }

    loadHistory()
  }, [chatId, currentUser?.id, setMessages])

  const handleSend = () => {
    if (!inputValue.trim() || isLoading) return
    const userId = currentUserRef.current?.id || currentUser?.id || 'anonymous'
    sendMessage({ text: inputValue }, { body: { resourceId: userId } })
    setInputValue('')
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden relative animate-fade-slide-up">

      {/* Subtle top glow */}
      <div className="absolute inset-x-0 top-0 h-40 pointer-events-none animate-float-slow" style={{ background: `radial-gradient(ellipse 60% 100% at 50% 0%, var(--t-chat-glow) 0%, transparent 100%)` }} />

      {/* SCROLL BUTTON */}
      {scrollDirection && (
        <button
          onClick={scrollDirection === 'up' ? scrollToTop : scrollToBottom}
          className="absolute bottom-24 right-5 z-20 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-105"
          style={{ background: 'var(--t-scroll-btn-bg)', border: `1px solid var(--t-scroll-btn-border)`, backdropFilter: 'blur(8px)', boxShadow: `0 4px 16px var(--t-scroll-btn-shadow)` }}
        >
          {scrollDirection === 'up'
            ? <ChevronUp className="w-4 h-4 text-violet-400" />
            : <ChevronDown className="w-4 h-4 text-violet-400" />}
        </button>
      )}

      {/* MESSAGES */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-4 py-6 h-0 scrollbar-hide">
        <div className="max-w-5xl mx-auto space-y-5">

          {messages.map(message => {
            const isUser = message.role === 'user'
            return (
              <div key={message.id} className={`flex gap-3 msg-enter ${isUser ? 'justify-end' : 'justify-start'}`}>

                {!isUser && (
                  <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center shrink-0 mt-0.5"
                    style={{ boxShadow: '0 0 16px rgba(124,58,237,0.4)' }}>
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                )}

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
                    ? <p className="text-sm text-white leading-relaxed whitespace-pre-wrap">{getMessageText(message)}</p>
                    : <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={markdownComponents}>{getMessageText(message)}</ReactMarkdown>
                  }
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl avatar flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            )
          })}

          {isLoading && (
            <div className="flex gap-3 msg-enter">
              <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center shrink-0 mt-0.5"
                style={{ boxShadow: '0 0 16px rgba(124,58,237,0.4)' }}>
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="px-4 py-3.5 flex items-center gap-1.5 animate-breathe-glow"
                style={{ background: 'var(--t-typing-bg)', border: `1px solid var(--t-typing-border)`, borderRadius: '4px 18px 18px 18px' }}>
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* INPUT */}
      <ChatInput
        inputValue={inputValue}
        setInputValue={setInputValue}
        onSend={handleSend}
        isLoading={isLoading}
        placeholder="Continue your event planning conversation…"
        disabled={isLoadingHistory}
      />
    </div>
  )
}