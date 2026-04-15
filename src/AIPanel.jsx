import React, { useRef, useEffect, useState } from 'react'
import { FIELDS } from './taxData.js'
import styles from './AIPanel.module.css'

function TypingDots() {
  return (
    <div className={styles.dots}>
      <span /><span /><span />
    </div>
  )
}

function Message({ msg }) {
  if (msg.role === 'user') {
    return <div className={styles.userBubble}>{msg.text}</div>
  }
  if (msg.role === 'error') {
    return <div className={styles.errorBubble}>{msg.text}</div>
  }
  return (
    <div className={`${styles.aiBubble} ${msg.streaming ? styles.streaming : ''}`}>
      {msg.text}
    </div>
  )
}

export default function AIPanel({ messages, loading, activeField, onSend }) {
  const msgsRef = useRef(null)
  const inputRef = useRef(null)
  const [input, setInput] = useState('')

  useEffect(() => {
    if (msgsRef.current) {
      msgsRef.current.scrollTop = msgsRef.current.scrollHeight
    }
  }, [messages, loading])

  const hints = activeField
    ? (FIELDS.find(f => f.id === activeField.id)?.hints || [])
    : []

  const handleSend = () => {
    if (!input.trim() || loading) return
    onSend(input)
    setInput('')
  }

  const handleHint = (hint) => {
    onSend(hint)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.headerDot} />
        <span className={styles.headerLabel}>AI assistant</span>
        {activeField && (
          <span className={styles.fieldPill}>
            {activeField.box} · {activeField.label}
          </span>
        )}
      </div>

      <div className={styles.messages} ref={msgsRef}>
        {messages.length === 0 && !loading && (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4M12 8h.01"/>
              </svg>
            </div>
            <p>Click any field on the T5 to get a plain-English explanation based on your entries.</p>
          </div>
        )}
        {messages.map(msg => (
          <Message key={msg.id} msg={msg} />
        ))}
        {loading && messages.length === 0 && <TypingDots />}
        {loading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
          <TypingDots />
        )}
      </div>

      {hints.length > 0 && !loading && messages.length > 0 && (
        <div className={styles.hints}>
          {hints.map(h => (
            <button key={h} className={styles.hintBtn} onClick={() => handleHint(h)}>
              {h}
            </button>
          ))}
        </div>
      )}

      <div className={styles.footer}>
        <input
          ref={inputRef}
          className={styles.input}
          placeholder={activeField ? 'Ask a follow-up...' : 'Select a field first...'}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          disabled={!activeField || loading}
        />
        <button
          className={styles.sendBtn}
          onClick={handleSend}
          disabled={!activeField || loading || !input.trim()}
        >
          Ask
        </button>
      </div>
    </div>
  )
}
