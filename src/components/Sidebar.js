'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Plus, MessageSquare, Search, Calendar, Trash2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

function loadChatHistoryFromStorage() {
  try {
    return JSON.parse(localStorage.getItem('chatHistory') || '[]')
  } catch {
    return []
  }
}

export default function Sidebar() {
  const [chatHistory, setChatHistory] = useState(() => [])
  const [searchQuery, setSearchQuery] = useState('')
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [deleteConfirmChat, setDeleteConfirmChat] = useState(null)

  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkMobile = () => {
      setIsCollapsed(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    setChatHistory(loadChatHistoryFromStorage())
  }, [])

  useEffect(() => {
    const onUpdate = () => setChatHistory(loadChatHistoryFromStorage())
    window.addEventListener('chatHistoryUpdated', onUpdate)
    return () => window.removeEventListener('chatHistoryUpdated', onUpdate)
  }, [])

  useEffect(() => {
    setChatHistory(loadChatHistoryFromStorage())
  }, [pathname])

  const formatTimestamp = (date) => {
    const now = new Date()
    const diff = now.getTime() - new Date(date).getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return new Date(date).toLocaleDateString()
  }

  const removeChat = (chatId, e) => {
    e.stopPropagation()
    setDeleteConfirmChat(chatId)
  }

  const confirmDelete = () => {
    if (!deleteConfirmChat) return
    
    try {
      const existing = JSON.parse(localStorage.getItem('chatHistory') || '[]')
      const updated = existing.filter(chat => chat.id !== deleteConfirmChat)
      localStorage.setItem('chatHistory', JSON.stringify(updated))
      localStorage.removeItem(`chatMessages_${deleteConfirmChat}`)
      setChatHistory(updated)
      window.dispatchEvent(new Event('chatHistoryUpdated'))
      if (pathname === `/chat/${deleteConfirmChat}`) {
        router.push('/chat')
      }
    } catch (error) {
      console.error('Error removing chat:', error)
    } finally {
      setDeleteConfirmChat(null)
    }
  }

  const cancelDelete = () => {
    setDeleteConfirmChat(null)
  }

  const filteredHistory = chatHistory?.filter(
    (chat) =>
      chat?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat?.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
  )
  return (
    <>
      <div
        className={`bg-gradient-to-br from-white via-gray-50 to-blue-50 text-gray-800 h-screen flex flex-col transition-all duration-300 shadow-2xl border-r border-gray-200 ${
          isCollapsed ? 'w-20' : 'w-80'
        }`}
      >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Event AI</h1>
                <p className="text-xs text-gray-600">Management Assistant</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 backdrop-blur-sm"
          >
            <Plus className={`w-4 h-4 transition-transform text-gray-600 ${isCollapsed ? 'rotate-45' : ''}`} />
          </button>
        </div>

        {!isCollapsed && (
          <button
            onClick={() => router.push('/chat')}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white py-3 px-4 rounded-xl transition-all transform hover:scale-[1.02] shadow-xl backdrop-blur-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="font-medium">New Chat</span>
          </button>
        )}
      </div>

      {/* Search */}
      {!isCollapsed && (
        <div className="p-4 border-b border-gray-200 backdrop-blur-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent text-sm placeholder-gray-400 transition-all"
            />
          </div>
        </div>
      )}

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-4">
        {!isCollapsed && (
          <>
            <h2 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Chat History
            </h2>
            <div className="space-y-2">
              {filteredHistory?.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">
                    {searchQuery ? 'No chats found' : 'No chat history yet'}
                  </p>
                </div>
              ) : (
                filteredHistory?.map((chat) => (
                  <div
                    key={chat?.id}
                    className={`w-full text-left p-3 rounded-xl cursor-pointer transition-all group backdrop-blur-sm relative ${
                      pathname === `/chat/${chat?.id}`
                        ? 'bg-indigo-50 border border-indigo-200 text-indigo-900 shadow-lg'
                        : 'hover:bg-gray-100 border border-gray-200 text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    <button
                      onClick={() => router.push(`/chat/${chat?.id}`)}
                      className="w-full text-left"
                    >
                      <div className="flex items-start gap-3 pr-8">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                            pathname === `/chat/${chat?.id}`
                              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg'
                              : 'bg-gray-200 group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600'
                          }`}
                        >
                          <MessageSquare className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium truncate">{chat?.title}</h3>
                          <p className="text-xs text-gray-500 truncate mt-1 line-clamp-2">{chat?.lastMessage}</p>
                          <p className="text-xs text-gray-400 mt-1">{formatTimestamp(chat?.timestamp)}</p>
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={(e) => removeChat(chat?.id, e)}
                      className="absolute top-3 right-3 p-2 hover:bg-red-50 rounded-lg transition-all duration-200 text-red-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transform hover:scale-110 hover:rotate-12 shadow-lg hover:shadow-red-500/25"
                      title="Delete chat"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Alert - Fixed Position */}
      {deleteConfirmChat && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4 transform transition-all relative z-[10000]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Chat</h3>
            </div>
            
            <Alert className="mb-4 border-0">
              <AlertDescription className="text-gray-600">
                This will permanently delete the chat and all its messages. You won&apos;t be able to recover this conversation later.
              </AlertDescription>
            </Alert>

            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-gray-600 bg-gray-100 cursor-pointer hover:text-gray-800 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 cursor-pointer hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  )
}