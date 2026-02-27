'use client'

import { useChat } from '@ai-sdk/react'
import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { useParams } from 'next/navigation'
import { Bot, User, ChevronUp, ChevronDown } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
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
    <div className="overflow-x-auto my-4">
      <table className="min-w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-gray-50 border-b border-gray-300">
      {children}
    </thead>
  ),
  tbody: ({ children }) => (
    <tbody className="divide-y divide-gray-200">
      {children}
    </tbody>
  ),
  tr: ({ children }) => (
    <tr className="hover:bg-gray-50 transition-colors">
      {children}
    </tr>
  ),
  th: ({ children }) => (
    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b border-gray-300">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-3 text-sm text-gray-900 border-b border-gray-100">
      {children}
    </td>
  ),
}

function getMessageText(message) {
  return message.parts?.filter((p) => p.type === 'text').map((p) => p.text).join('') || ''
}

// Save full messages + metadata to localStorage after every AI response
function saveToLocalStorage(chatId, allMessages, lastAssistantText) {
  try {
    // Save full messages array for this chat
    const messagesToStore = allMessages.map((m) => ({
      id: m.id,
      role: m.role,
      text: getMessageText(m),
    }))
    localStorage.setItem(`chatMessages_${chatId}`, JSON.stringify(messagesToStore))

    // Update metadata in chatHistory list
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

export default function SpecificChatPage() {
  const params = useParams()
  const chatId = params.id

  const [isLoadingHistory, setIsLoadingHistory] = useState(true)
  const [inputValue, setInputValue] = useState('')
  const [scrollDirection, setScrollDirection] = useState(null)

  const messagesContainerRef = useRef(null)

  const { messages, status, sendMessage, setMessages } = useChat({
    api: '/api/chat',
    id: chatId,
    onFinish: ({ message, messages: allMessages }) => {
      const lastText = getMessageText(message)
      saveToLocalStorage(chatId, allMessages, lastText)
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
    if (!chatId) return

    try {
      const stored = localStorage.getItem(`chatMessages_${chatId}`)
      if (stored) {
        const parsed = JSON.parse(stored)

        const uiMessages = parsed.map((m) => ({
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
  }, [chatId, setMessages])

  const handleSend = () => {
    if (!inputValue.trim() || isLoading) return
    sendMessage({ text: inputValue })
    setInputValue('')
  }

  return (
    <div className="flex flex-1 flex-col bg-gradient-to-b from-white via-gray-50 to-blue-50 h-full relative">

      {/* SCROLL BUTTON */}
      {scrollDirection && (
        <button
          onClick={scrollDirection === 'up' ? scrollToTop : scrollToBottom}
          className="absolute bottom-40 right-10 z-20 w-11 h-11 bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all hover:scale-110"
        >
          {scrollDirection === 'up' ? (
            <ChevronUp className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-600" />
          )}
        </button>
      )}

      {/* MESSAGES */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-6 py-6 h-0"
      >
        <div className="max-w-4xl mx-auto space-y-6">

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
            >
              {message.role === 'assistant' && (
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}

              <div
                className={`max-w-3xl px-5 py-4 rounded-2xl ${message.role === 'user'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white border border-gray-200 text-gray-900 shadow-sm'
                  }`}
              >
                {message.role === 'user' ? (
                  <p className="text-sm whitespace-pre-wrap">
                    {getMessageText(message)}
                  </p>
                ) : (
                  <div className="text-sm">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={markdownComponents}
                    >
                      {getMessageText(message)}
                    </ReactMarkdown>
                  </div>
                )}
              </div>

              {message.role === 'user' && (
                <div className="w-10 h-10 bg-gray-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4 justify-start mt-6">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white border border-gray-200 px-5 py-4 rounded-2xl shadow-sm">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
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
        placeholder="Continue your conversation about event management..."
        disabled={isLoadingHistory}
        chatId={chatId}
      />
    </div>
  )
}