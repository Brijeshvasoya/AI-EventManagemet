'use client'

import { Send, Bot, Sparkles } from 'lucide-react'

export default function ChatInput({ 
  inputValue,
  setInputValue,
  onSend,
  isLoading,
  placeholder = "Type your message...",
  disabled = false,
  showBotIcon = true,
  chatId = null
}) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  return (
    <div className="bg-gradient-to-r from-white via-gray-50 to-blue-50 border-t border-gray-200 px-6 py-6 sticky bottom-0 z-10 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled || isLoading}
              rows={1}
              className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent resize-none text-gray-900 placeholder-gray-400 transition-all duration-300 shadow-sm hover:shadow-md"
              style={{
                minHeight: '48px',
                maxHeight: '120px',
              }}
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              {showBotIcon ? (
                <Bot className="w-5 h-5 text-gray-400" />
              ) : (
                <Sparkles className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </div>
          <button
            onClick={onSend}
            disabled={disabled || isLoading || !inputValue.trim()}
            className="px-4 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center"
            style={{
              height: '48px',
              minHeight: '48px',
              maxHeight: '120px',
            }}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="mt-4 text-center text-xs text-gray-500">
          {chatId ? `Chat ID: ${chatId} • ` : ''}Powered by Mastra AI • Your conversations are private and secure
        </p>
      </div>
    </div>
  )
}
