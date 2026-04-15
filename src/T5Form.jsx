import React from 'react'
import { FIELDS } from './taxData.js'
import styles from './T5Form.module.css'

export default function T5Form({ values, onChange, onFieldFocus, activeFieldId }) {
  const rows = []
  for (let i = 0; i < FIELDS.length; i += 2) {
    rows.push(FIELDS.slice(i, i + 2))
  }

  return (
    <div className={styles.form}>
      <div className={styles.slipHeader}>
        <div>
          <div className={styles.slipName}>RBC Direct Investing</div>
          <div className={styles.slipYear}>Tax year 2024 — T5 Statement of Investment Income</div>
        </div>
        <div className={styles.slipBadge}>1 slip</div>
      </div>

      {rows.map((row, ri) => (
        <div className={styles.row} key={ri}>
          {row.map(field => (
            <div
              key={field.id}
              className={`${styles.fieldWrap} ${activeFieldId === field.id ? styles.active : ''}`}
            >
              <div className={styles.fieldMeta}>
                <span className={styles.boxTag}>{field.box}</span>
                <span className={styles.fieldLabel}>{field.label}</span>
              </div>
              <div className={styles.inputWrap}>
                <span className={styles.dollar}>$</span>
                <input
                  className={styles.input}
                  type="text"
                  value={values[field.id]}
                  onChange={e => onChange(field.id, e.target.value)}
                  onFocus={() => onFieldFocus(field)}
                  placeholder={field.placeholder}
                />
              </div>
            </div>
          ))}
          {row.length === 1 && <div className={styles.fieldWrap} />}
        </div>
      ))}

      <div className={styles.formNote}>
        Click any field to get a live AI explanation tailored to your entries
      </div>
    </div>
  )
}
