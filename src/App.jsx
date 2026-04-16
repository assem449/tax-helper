import React, { useState, useCallback } from 'react'
import T5Form from './T5Form.jsx'
import AIPanel from './AIPanel.jsx'
import { useAIAssistant } from './useAIAssistant.js'
import { DEFAULT_VALUES } from './taxData.js'
import styles from './App.module.css'

export default function App() {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY?.trim() || ''
  const [formValues, setFormValues] = useState(DEFAULT_VALUES)

  const { messages, loading, activeField, onFieldFocus, sendFollowUp } = useAIAssistant(apiKey)

  const handleFieldFocus = useCallback((field) => {
    onFieldFocus(field, formValues)
  }, [onFieldFocus, formValues])

  const handleSend = useCallback((text) => {
    sendFollowUp(text, formValues, activeField)
  }, [sendFollowUp, formValues, activeField])

  const handleChange = (id, val) => {
    setFormValues(prev => ({ ...prev, [id]: val }))
  }

  return (
    <div className={styles.shell}>
      <div className={styles.topBar}>
        <div className={styles.logo}>W</div>
        <div className={styles.topBarText}>
          <span className={styles.title}>Wealthsimple Tax</span>
          <span className={styles.sub}>2024 return · T5 slip entry</span>
        </div>
        <div className={styles.topBarRight}>
          <span className={styles.demoTag}>Concept demo</span>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.formSide}>
          <div className={styles.sectionLabel}>T5 · Statement of investment income</div>
          <T5Form
            values={formValues}
            onChange={handleChange}
            onFieldFocus={handleFieldFocus}
            activeFieldId={activeField?.id}
          />
        </div>
        <AIPanel
          messages={messages}
          loading={loading}
          activeField={activeField}
          onSend={handleSend}
        />
      </div>
    </div>
  )
}
