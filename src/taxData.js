export const FIELDS = [
  {
    id: 'box13',
    box: 'Box 13',
    label: 'Interest from Canadian sources',
    placeholder: '0.00',
    hints: [
      'Is savings account interest taxable?',
      'Does GIC interest go here?',
    ],
  },
  {
    id: 'box14',
    box: 'Box 14',
    label: 'Other income from Canadian sources',
    placeholder: '0.00',
    hints: [
      'What counts as "other" income?',
      'Is this different from interest?',
    ],
  },
  {
    id: 'box15',
    box: 'Box 15',
    label: 'Foreign income',
    placeholder: '0.00',
    hints: [
      'Does US dividend income go here?',
      'How is this taxed differently?',
    ],
  },
  {
    id: 'box16',
    box: 'Box 16',
    label: 'Foreign tax paid',
    placeholder: '0.00',
    hints: [
      'Can I get this money back?',
      'Do I need Form T2209?',
    ],
  },
  {
    id: 'box24',
    box: 'Box 24',
    label: 'Actual amount of eligible dividends',
    placeholder: '0.00',
    hints: [
      'What makes a dividend "eligible"?',
      'Is this from a TFSA?',
    ],
  },
  {
    id: 'box25',
    box: 'Box 25',
    label: 'Taxable amount of eligible dividends',
    placeholder: '0.00',
    hints: [
      'Why is this higher than box 24?',
      'Do I get a tax credit for this?',
    ],
  },
  {
    id: 'box26',
    box: 'Box 26',
    label: 'Dividend tax credit for eligible dividends',
    placeholder: '0.00',
    hints: [
      'Do I enter this manually?',
      'How much does this reduce my taxes?',
    ],
  },
  {
    id: 'box18',
    box: 'Box 18',
    label: 'Capital gains dividends',
    placeholder: '0.00',
    hints: [
      'How are capital gains dividends taxed?',
      'Is this the same as selling shares?',
    ],
  },
]

export const DEFAULT_VALUES = {
  box13: '0.00',
  box14: '0.00',
  box15: '850.00',
  box16: '127.50',
  box24: '300.00',
  box25: '414.00',
  box26: '55.68',
  box18: '0.00',
}

export function buildSystemPrompt() {
  return `You are a concise Canadian tax assistant embedded inside Wealthsimple Tax. You help users understand their T5 slip fields while they fill them out.

Rules:
- Maximum 3 sentences per response. Be specific, not generic.
- Always use the actual dollar amounts from the user's form when explaining.
- Plain English only — no tax jargon without a brief explanation.
- If box 16 (foreign tax paid) is greater than $0, proactively mention Form T2209 once.
- If box 25 is greater than box 24, explain the 38% CRA gross-up when either box is focused.
- If the user mentions TFSA, clarify that TFSA income is tax-free and should NOT be reported.
- If box 16 > 0 and box 15 > 0, mention that Canada likely has a tax treaty covering this.
- Never say "consult a tax professional" for standard T5 questions.
- Never pad or hedge. Answer directly and stop.`
}

export function buildUserMessage(fieldId, fieldLabel, formValues) {
  const ctx = Object.entries(formValues)
    .map(([k, v]) => `${k}: $${v}`)
    .join(', ')

  return `I just focused on ${fieldId} ("${fieldLabel}") on my T5 slip. My current entries are: ${ctx}. Please explain what this field means and what I should do with it, given my specific entries.`
}
