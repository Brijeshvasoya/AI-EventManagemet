'use client'

import { useChat } from '@ai-sdk/react'
import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { useParams } from 'next/navigation'
import { Bot, User, ChevronUp, ChevronDown } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import ChatInput from '@/components/ChatInput'

const markdownComponents = {
  h1: ({ children }) => <h1 className="text-lg font-bold mt-4 mb-2 text-white">{children}</h1>,
  h2: ({ children }) => <h2 className="text-base font-bold mt-3 mb-1.5 text-white">{children}</h2>,
  h3: ({ children }) => <h3 className="text-sm font-semibold mt-3 mb-1 text-gray-100">{children}</h3>,
  p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed text-gray-300 text-sm">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
  em: ({ children }) => <em className="italic text-gray-400">{children}</em>,
  ul: ({ children }) => <ul className="list-disc pl-5 space-y-1 mb-2 text-gray-300 text-sm">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-5 space-y-1 mb-2 text-gray-300 text-sm">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  code: ({ inline, children }) => inline
    ? <code className="text-violet-300 px-1.5 py-0.5 rounded text-xs font-mono" style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)' }}>{children}</code>
    : <pre className="p-3.5 rounded-xl text-xs font-mono overflow-x-auto my-3" style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}><code className="text-gray-300">{children}</code></pre>,
  blockquote: ({ children }) => <blockquote className="pl-3 my-2 text-sm italic text-gray-400" style={{ borderLeft: '2px solid rgba(124,58,237,0.6)', background: 'rgba(124,58,237,0.05)', padding: '8px 12px', borderRadius: '0 8px 8px 0' }}>{children}</blockquote>,
  hr: () => <hr className="my-3" style={{ borderColor: 'rgba(255,255,255,0.08)' }} />,
  table: ({ children }) => <div className="overflow-x-auto my-3 rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}><table className="min-w-full text-sm">{children}</table></div>,
  thead: ({ children }) => <thead style={{ background: 'rgba(124,58,237,0.12)' }}>{children}</thead>,
  tbody: ({ children }) => <tbody style={{ background: 'rgba(8,11,24,0.6)' }}>{children}</tbody>,
  tr: ({ children }) => <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{children}</tr>,
  th: ({ children }) => <th className="px-4 py-2.5 text-left text-xs font-semibold text-violet-300 uppercase tracking-wider">{children}</th>,
  td: ({ children }) => <td className="px-4 py-2.5 text-xs text-gray-300">{children}</td>,
}

import { useMutation, useQuery } from '@apollo/client/react'
import { Sparkles } from 'lucide-react'
import { SAVE_CHAT_MUTATION, GET_CHAT } from '../../../graphql/client'

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
  const [saveChat] = useMutation(SAVE_CHAT_MUTATION)

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('currentUser'))
      if (user) {
        setCurrentUser(user)
      }
    } catch { }
  }, [])

  const { data: chatData, loading: chatLoading } = useQuery(GET_CHAT, {
    variables: { chatId, userId: currentUser?.id },
    skip: !currentUser?.id || !chatId,
    fetchPolicy: 'network-only'
  })

  const { messages, status, sendMessage, setMessages } = useChat({
    api: '/api/chat',
    id: chatId,
    onFinish: async ({ message, messages: allMessages }) => {
      const lastText = getMessageText(message)

      const userMessages = allMessages.filter((m) => m.role === 'user')
      const title = userMessages.length > 0 ? getMessageText(userMessages[0]) : 'New Chat'

      const messagesToStore = allMessages.map((m) => ({
        id: m.id,
        role: m.role,
        text: getMessageText(m),
      }))

      if (currentUser?.id && chatId) {
        try {
          await saveChat({
            variables: {
              chatId,
              userId: currentUser.id,
              title,
              lastMessage: lastText,
              messages: messagesToStore
            }
          })
          window.dispatchEvent(new Event('chatHistoryUpdated'))
        } catch (err) {
          console.error("Failed to save chat to DB:", err)
        }
      }
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

  /* ---------------- LOAD HISTORY ---------------- */

  useEffect(() => {
    if (!chatId || !chatData) return

    try {
      if (chatData?.getChat?.messages) {
        const uiMessages = chatData.getChat.messages.map((m) => ({
          id: m.id,
          role: m.role,
          parts: [{ type: 'text', text: m.text }],
        }))

        setMessages(uiMessages)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoadingHistory(false)
    }
  }, [chatId, chatData, setMessages])

  const handleSend = () => {
    if (!inputValue.trim() || isLoading) return
    sendMessage({ text: inputValue })
    setInputValue('')
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden relative">

      {/* Subtle top glow */}
      <div className="absolute inset-x-0 top-0 h-40 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 100% at 50% 0%, rgba(124,58,237,0.06) 0%, transparent 100%)' }} />

      {/* SCROLL BUTTON */}
      {scrollDirection && (
        <button
          onClick={scrollDirection === 'up' ? scrollToTop : scrollToBottom}
          className="absolute bottom-24 right-5 z-20 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-105"
          style={{ background: 'rgba(124,58,237,0.25)', border: '1px solid rgba(124,58,237,0.4)', backdropFilter: 'blur(8px)', boxShadow: '0 4px 16px rgba(0,0,0,0.5)' }}
        >
          {scrollDirection === 'up'
            ? <ChevronUp className="w-4 h-4 text-violet-300" />
            : <ChevronDown className="w-4 h-4 text-violet-300" />}
        </button>
      )}

      {/* MESSAGES */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-4 py-6 h-0 scrollbar-hide">
        <div className="max-w-3xl mx-auto space-y-5">

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
                    background: 'rgba(255,255,255,0.045)',
                    border: '1px solid rgba(255,255,255,0.09)',
                    boxShadow: '0 2px 16px rgba(0,0,0,0.35)',
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
              <div className="px-4 py-3.5 flex items-center gap-1.5"
                style={{ background: 'rgba(255,255,255,0.045)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: '4px 18px 18px 18px' }}>
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