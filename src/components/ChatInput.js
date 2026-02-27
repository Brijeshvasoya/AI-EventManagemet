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
    <div className="border-t border-gray-200 px-6 py-6 sticky bottom-0 z-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="w-full px-5 py-4 pr-12 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              disabled={isLoading || disabled}
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
            disabled={isLoading || disabled || !inputValue.trim()}
            className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] shadow-lg flex items-center gap-2"
          >
            <Send className="w-5 h-5" />
            <span className="font-medium">Send</span>
          </button>
        </div>
        <p className="mt-4 text-center text-xs text-gray-500">
          {chatId ? `Chat ID: ${chatId} • ` : ''}Powered by Mastra AI • Your conversations are private and secure
        </p>
      </div>
    </div>
  )
}
