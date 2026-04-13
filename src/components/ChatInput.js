'use client'

import { Send, Sparkles, Mic } from 'lucide-react'
import { useEffect, useRef } from 'react'

export default function ChatInput({
  inputValue, setInputValue, onSend, isLoading,
  placeholder = 'Ask me anything about your event…',
  disabled = false,
}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current; if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 140) + 'px'
  }, [inputValue])

  const canSend = inputValue?.trim() && !isLoading && !disabled

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend() }
  }

  return (
    <div className="shrink-0 px-4 py-4"
      style={{
        background: 'linear-gradient(180deg, rgba(8,11,24,0.0) 0%, rgba(8,11,24,0.98) 40%)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>
      <div className="max-w-3xl mx-auto">
        {/* Input container */}
        <div className="relative flex items-end gap-2 p-2 rounded-2xl transition-all duration-300"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: canSend
              ? '1px solid rgba(124,58,237,0.5)'
              : '1px solid rgba(255,255,255,0.08)',
            boxShadow: canSend
              ? '0 0 0 3px rgba(124,58,237,0.08), 0 8px 32px rgba(0,0,0,0.3)'
              : '0 4px 20px rgba(0,0,0,0.2)',
          }}>

          {/* AI sparkle */}
          <div className="pb-2 pl-1.5 shrink-0">
            <div className={`transition-all duration-300 ${isLoading ? 'animate-spin-slow' : ''}`}>
              <Sparkles className={`w-4 h-4 transition-colors duration-300 ${isLoading ? 'text-violet-400' : canSend ? 'text-violet-500' : 'text-gray-700'}`} />
            </div>
          </div>

          {/* Textarea */}
          <textarea
            ref={ref}
            id="chat-input"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKey}
            placeholder={placeholder}
            disabled={disabled || isLoading}
            rows={1}
            className="flex-1 bg-transparent text-sm text-gray-100 placeholder-gray-700 resize-none leading-relaxed py-2 min-h-[36px] max-h-[120px]"
            style={{ outline: 'none', boxShadow: 'none' }}
          />

          {/* Actions */}
          <div className="flex items-center gap-1.5 pb-1.5 shrink-0">
            {/* Send */}
            <button
              id="chat-send-btn"
              onClick={onSend}
              disabled={!canSend}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
              style={{
                background: canSend
                  ? 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)'
                  : 'rgba(255,255,255,0.04)',
                border: canSend ? '1px solid rgba(124,58,237,0.5)' : '1px solid rgba(255,255,255,0.06)',
                boxShadow: canSend ? '0 4px 16px rgba(124,58,237,0.4)' : 'none',
                transform: canSend ? 'scale(1)' : 'scale(0.9)',
              }}>
              {isLoading
                ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full" style={{ animation: 'spin 0.7s linear infinite' }} />
                : <Send className={`w-3.5 h-3.5 ${canSend ? 'text-white' : 'text-gray-700'}`} />
              }
            </button>
          </div>
        </div>

        {/* Hint */}
        <p className="mt-2 text-center text-[11px] text-gray-700">
          <span className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)' }}>↵</span>
          {' '}to send &nbsp;·&nbsp;{' '}
          <span className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)' }}>⇧↵</span>
          {' '}for new line
        </p>
      </div>
    </div>
  )
}