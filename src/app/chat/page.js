/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import { useChat } from '@ai-sdk/react'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Bot, User, Calendar, Users, MapPin, Clock, DollarSign, Send } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import ChatInput from '@/components/ChatInput'

const markdownComponents = {
  h1: ({ children }) => <h1 className="text-xl font-bold mt-4 mb-2">{children}</h1>,
  h2: ({ children }) => <h2 className="text-lg font-bold mt-3 mb-2">{children}</h2>,
  h3: ({ children }) => <h3 className="text-base font-bold mt-3 mb-1">{children}</h3>,
  p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  ul: ({ children }) => <ul className="list-disc pl-5 space-y-1 mb-2">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-5 space-y-1 mb-2">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  code: ({ inline, children }) =>
    inline ? (
      <code className="bg-gray-100 text-pink-600 px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>
    ) : (
      <pre className="bg-gray-100 text-gray-800 p-3 rounded-lg text-xs font-mono overflow-x-auto my-2">
        <code>{children}</code>
      </pre>
    ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-indigo-300 pl-4 italic text-gray-600 my-2">{children}</blockquote>
  ),
  hr: () => <hr className="border-gray-200 my-3" />,
  table: ({ children }) => (
  <div className="overflow-x-auto my-6 rounded-2xl border border-gray-200 shadow-sm">
    <table className="min-w-full border-collapse text-sm">
      {children}
    </table>
  </div>
),

thead: ({ children }) => (
  <thead className="bg-gradient-to-r from-indigo-50 to-purple-50 sticky top-0 z-10">
    {children}
  </thead>
),

tbody: ({ children }) => (
  <tbody className="divide-y divide-gray-100 bg-white">
    {children}
  </tbody>
),

tr: ({ children }) => (
  <tr className="hover:bg-indigo-50/50 transition-colors duration-200">
    {children}
  </tr>
),

th: ({ children }) => (
  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
    {children}
  </th>
),

td: ({ children }) => (
  <td className="px-6 py-4 text-sm text-gray-700">
    {children}
  </td>
),
}

// Extract plain text from a UIMessage part
function getMessageText(message) {
  return message.parts?.filter((p) => p.type === 'text').map((p) => p.text).join('') || ''
}

// Save both metadata and full messages to localStorage
function saveToLocalStorage(chatId, allMessages, lastAssistantText) {
  try {
    // 1. Save full messages for this chat (for history restore)
    const messagesToStore = allMessages.map((m) => ({
      id: m.id,
      role: m.role,
      text: getMessageText(m),
    }))
    localStorage.setItem(`chatMessages_${chatId}`, JSON.stringify(messagesToStore))

    // 2. Update chat metadata list
    const userMessages = allMessages.filter((m) => m.role === 'user')
    if (userMessages.length === 0) return

    const firstUserText = getMessageText(userMessages[0])
    const chatEntry = {
      id: chatId,
      title: firstUserText,
      lastMessage: lastAssistantText,
      timestamp: new Date().toISOString(),
    }

    const existing = JSON.parse(localStorage.getItem('chatHistory') || '[]')
    const idx = existing.findIndex((c) => c.id === chatId)
    if (idx >= 0) {
      existing[idx] = chatEntry
    } else {
      existing.unshift(chatEntry)
    }
    localStorage.setItem('chatHistory', JSON.stringify(existing.slice(0, 50)))
    window.dispatchEvent(new Event('chatHistoryUpdated'))
  } catch (e) {
    console.error('Error saving to localStorage:', e)
  }
}

export default function ChatPage() {
  const router = useRouter()
  const chatIdRef = useRef(null)
  const hasRoutedRef = useRef(false)
  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)
  const [inputValue, setInputValue] = useState('')
  const [chatId, setChatId] = useState(null)

  useEffect(() => {
    const id = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    chatIdRef.current = id
    setChatId(id)
  }, [])

  const { messages, status, error, sendMessage } = useChat({
    api: '/api/chat',
    id: chatId ?? undefined,
    onFinish: ({ message, messages: allMessages }) => {
      const lastText = getMessageText(message)
      saveToLocalStorage(chatIdRef.current, allMessages, lastText)

      if (!hasRoutedRef.current && chatIdRef.current) {
        hasRoutedRef.current = true
        router.replace(`/chat/${chatIdRef.current}`)
      }
    },
    onError: (err) => console.error('Chat error:', err),
  })

  const isLoading = status === 'submitted' || status === 'streaming'

  // Enhanced scroll functionality
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const suggestions = [
    { icon: Calendar, text: 'Plan a wedding event', color: 'bg-blue-100 text-blue-600' },
    { icon: Users, text: 'Manage guest list efficiently', color: 'bg-green-100 text-green-600' },
    { icon: MapPin, text: 'Find perfect venue location', color: 'bg-purple-100 text-purple-600' },
    { icon: DollarSign, text: 'Optimize event budget', color: 'bg-yellow-100 text-yellow-600' },
    { icon: Clock, text: 'Create event timeline', color: 'bg-pink-100 text-pink-600' },
    { icon: Send, text: 'Coordinate with vendors', color: 'bg-indigo-100 text-indigo-600' },
  ]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!inputValue.trim() || isLoading) return
    sendMessage({ text: inputValue })
    setInputValue('')
  }

  return (
    <div className="flex-1 flex min-h-screen flex-col bg-gradient-to-b from-white via-gray-50 to-blue-50">
      {/* Messages */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-6 py-6 relative">
        <div className="max-w-4xl mx-auto">
          {messages?.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Bot className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4 gradient-text">Welcome to AI Event Manager</h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Start planning your perfect event with AI-powered assistance. From corporate meetings to weddings, I&apos;m here to help every step of the way.
              </p>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Quick Start</h3>
              <div className="flex flex-wrap gap-3 justify-center">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setInputValue(suggestion.text)}
                    className="flex items-center gap-2 px-4 py-3 glass-card border border-white/20 rounded-xl hover:border-purple-300 hover:shadow-md transition-all group"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center glass group-hover:gradient-primary transition-all`}>
                      <suggestion.icon className="w-4 h-4 text-gray-600 group-hover:text-gray-900" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{suggestion.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages?.length > 0 && (
            <div className="space-y-6">
              {messages?.map((message) => (
                <div key={message.id} className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.role === 'assistant' && (
                    <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div className={`max-w-3xl px-5 py-4 rounded-2xl ${message.role === 'user'
                      ? 'gradient-primary text-white shadow-lg'
                      : 'glass-card border border-white/20 text-gray-900 shadow-sm'
                    }`}>
                    {message.role === 'user' ? (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{getMessageText(message)}</p>
                    ) : (
                      <div className="text-sm">
                        <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                          {getMessageText(message)}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                  {message.role === 'user' && (
                    <div className="w-10 h-10 glass-card rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <User className="w-5 h-5 text-gray-700" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}

          {isLoading && (
            <div className="flex gap-4 justify-start mt-6">
              <div className="glass-card border border-white/20 px-5 py-4 rounded-2xl shadow-sm">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 glass-card border border-red-200 rounded-xl text-red-600 text-sm">
              Something went wrong: {error.message}
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <ChatInput
        inputValue={inputValue}
        setInputValue={setInputValue}
        onSend={handleSend}
        isLoading={isLoading}
        placeholder="Continue your conversation about event management..."
        showBotIcon={false}
      />
    </div>
  )
}