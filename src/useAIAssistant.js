import { useState, useRef, useCallback } from 'react'
import { buildSystemPrompt, buildUserMessage } from './taxData.js'

const API_URL = 'https://api.openai.com/v1/chat/completions'
const MODEL = 'gpt-4.1-mini'

function extractTextDelta(delta) {
  if (typeof delta === 'string') return delta
  if (Array.isArray(delta)) {
    return delta
      .filter(part => part?.type === 'text' && typeof part.text === 'string')
      .map(part => part.text)
      .join('')
  }
  return ''
}

export function useAIAssistant(apiKey) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeField, setActiveField] = useState(null)
  const historyRef = useRef([])

  const appendMessage = (role, text) => {
    setMessages(prev => [...prev, { role, text, id: Date.now() + Math.random() }])
  }

  const streamFromAPI = useCallback(async (userContent) => {
    if (!apiKey) {
      appendMessage('error', 'No API key set. Enter your OpenAI API key in the settings panel above.')
      return
    }

    historyRef.current.push({ role: 'user', content: userContent })
    setLoading(true)

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 1000,
          messages: [
            { role: 'system', content: buildSystemPrompt() },
            ...historyRef.current,
          ],
          stream: true,
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => null)
        appendMessage('error', `API error: ${err.error?.message || res.status}`)
        return
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let fullText = ''
      const msgId = Date.now()

      setMessages(prev => [...prev, { role: 'ai', text: '', id: msgId, streaming: true }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        for (const line of chunk.split('\n')) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6).trim()
          if (data === '[DONE]') break
          try {
            const parsed = JSON.parse(data)
            const deltaText = extractTextDelta(parsed.choices?.[0]?.delta?.content)
            if (deltaText) {
              fullText += deltaText
              setMessages(prev =>
                prev.map(m => m.id === msgId ? { ...m, text: fullText } : m)
              )
            }
          } catch (_) {}
        }
      }

      setMessages(prev =>
        prev.map(m => m.id === msgId ? { ...m, streaming: false } : m)
      )
      historyRef.current.push({ role: 'assistant', content: fullText })

    } catch (e) {
      appendMessage('error', 'Network error — check your connection or API key.')
    } finally {
      setLoading(false)
    }
  }, [apiKey])

  const onFieldFocus = useCallback((field, formValues) => {
    setActiveField(field)
    historyRef.current = []
    setMessages([])
    const userMsg = buildUserMessage(field.id, field.label, formValues)
    streamFromAPI(userMsg)
  }, [streamFromAPI])

  const sendFollowUp = useCallback((text, formValues, field) => {
    if (!text.trim() || loading) return
    const ctx = Object.entries(formValues).map(([k, v]) => `${k}=$${v}`).join(', ')
    const full = `${text} (Context: focused on ${field?.id || 'T5'}, values: ${ctx})`
    appendMessage('user', text)
    streamFromAPI(full)
  }, [loading, streamFromAPI])

  return { messages, loading, activeField, onFieldFocus, sendFollowUp }
}
