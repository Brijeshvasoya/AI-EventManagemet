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
    <div className="shrink-0 px-4 pb-4"
      style={{
        background: 'var(--t-chatinput-grad)',
      }}>
      <div className="max-w-3xl mx-auto">
        {/* Input container */}
        <div className="relative flex items-end gap-2 p-2 rounded-2xl transition-all duration-300"
          style={{
            background: 'var(--t-chatinput-bg)',
            border: canSend
              ? `1px solid var(--t-chatinput-active-border)`
              : `1px solid var(--t-chatinput-border)`,
            boxShadow: canSend
              ? `0 0 0 3px var(--t-chatinput-active-shadow), 0 8px 32px var(--t-shadow)`
              : `0 4px 20px var(--t-chatinput-shadow)`,
          }}>

          {/* AI sparkle */}
          <div className="pb-2 pl-1.5 shrink-0">
            <div className={`transition-all duration-300 ${isLoading ? 'animate-spin-slow' : ''}`}>
              <Sparkles className="w-4 h-4 transition-colors duration-300"
                style={{ color: isLoading ? '#8b5cf6' : canSend ? 'var(--t-sparkle-can-send)' : 'var(--t-sparkle-inactive)' }} />
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
            className="flex-1 bg-transparent text-sm resize-none leading-relaxed py-2 min-h-[36px] max-h-[120px]"
            style={{
              outline: 'none',
              boxShadow: 'none',
              color: 'var(--t-chatinput-text)',
              '--tw-placeholder-opacity': 1,
            }}
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
                  : 'var(--t-chatinput-inactive-bg)',
                border: canSend ? '1px solid rgba(124,58,237,0.5)' : `1px solid var(--t-chatinput-inactive-border)`,
                boxShadow: canSend ? '0 4px 16px rgba(124,58,237,0.4)' : 'none',
                transform: canSend ? 'scale(1)' : 'scale(0.9)',
              }}>
              {isLoading
                ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full" style={{ animation: 'spin 0.7s linear infinite' }} />
                : <Send className="w-3.5 h-3.5" style={{ color: canSend ? '#fff' : 'var(--t-sparkle-inactive)' }} />
              }
            </button>
          </div>
        </div>

        {/* Hint */}
        <p className="mt-2 text-center text-[11px]" style={{ color: 'var(--t-chatinput-hint-text)' }}>
          <span className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: 'var(--t-chatinput-hint-bg)', border: `1px solid var(--t-chatinput-hint-border)` }}>↵</span>
          {' '}to send &nbsp;·&nbsp;{' '}
          <span className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: 'var(--t-chatinput-hint-bg)', border: `1px solid var(--t-chatinput-hint-border)` }}>shift + ↵</span>
          {' '}for new line
        </p>
      </div>
    </div>
  )
}