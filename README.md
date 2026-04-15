# Wealthsimple Tax — AI Assistant (Concept Demo)

A context-aware AI assistant for T5 slip entry, built as a cold outreach prototype for Wealthsimple.

---

## Setup (5 minutes)

### Prerequisites
- Node.js 18+ installed ([nodejs.org](https://nodejs.org))
- An Anthropic API key ([console.anthropic.com](https://console.anthropic.com))

### Run locally

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev

# 3. Open http://localhost:5173 in your browser
```

### In the app
1. Paste your Anthropic API key in the top bar and click **Save**
2. Click any T5 field to get a live AI explanation
3. Use the hint buttons or type your own follow-up questions

---

## Project structure

```
src/
  App.jsx              # Root layout, API key management
  App.module.css
  T5Form.jsx           # T5 slip form with 8 fields
  T5Form.module.css
  AIPanel.jsx          # Streaming AI response panel + chat
  AIPanel.module.css
  useAIAssistant.js    # Claude API integration + streaming
  taxData.js           # Field definitions, system prompt, default values
  index.css            # Global design tokens
  main.jsx             # Entry point
```

---

## How it works

1. User focuses a T5 field (e.g., Box 25)
2. The app reads all current field values from the form
3. A structured prompt is built: field identity + all current values + system instructions
4. Claude API is called with streaming enabled
5. The response streams token-by-token into the AI panel
6. Follow-up questions maintain conversation history for that field session

The system prompt instructs Claude to:
- Use the user's actual dollar amounts in explanations
- Flag Form T2209 when foreign tax is present
- Explain the 38% gross-up when Box 25 > Box 24
- Warn about TFSA income not being reportable
- Stay under 3 sentences — specific, not generic

---

## Pitch Guide

### Who to contact at Wealthsimple
Search LinkedIn for:
- **Product Manager, Tax** or **PM, Wealthsimple Tax**
- **Senior Product Designer, Tax**
- **Engineering Manager, Tax platform**

The tax team is small (~5–10 people). A PM or EM is your best target.

---

### Cold email template

**Subject:** Built a small AI feature for Wealthsimple Tax — T5 confusion

Hi [Name],

I'm a 4th-year CS student and Wealthsimple user. I noticed T5 slip entry is one of the highest drop-off points in any tax product — users hit an unfamiliar field, can't figure it out, and either abandon or file incorrectly.

I built a small prototype: a context-aware AI panel that explains T5 fields using the user's actual entered values, not generic help text. Box 25 showing $414 when Box 24 shows $300 gets a specific explanation of the gross-up — not a link to CRA docs.

Happy to share a 90-second demo video if it's useful. No ask beyond that.

[Your name]
[GitHub or demo link]

---

### Demo script (90 seconds)

**0:00–0:20 — Set the scene**
"This is a mock Wealthsimple Tax T5 entry screen. I've pre-filled it with a realistic slip — foreign income, eligible dividends. I'm going to act like a confused first-time filer."

**0:20–0:45 — Box 25 demo**
Click Box 25. Let the AI response stream in. Read the key line aloud: "It uses the actual numbers I entered — $300 actual, $414 taxable — not a generic definition."

**0:45–1:10 — Foreign tax demo**
"Now watch what happens when I click Box 15 with foreign tax paid already entered in Box 16."
Click Box 15. Point out that T2209 is surfaced proactively.

**1:10–1:30 — Follow-up**
Type: "Can I get that foreign tax back?"
Show the streamed answer. "It remembers the conversation. This isn't a static tooltip — it's a session."

**1:30 — Close**
"The current help text is the same for everyone. This is specific to what you actually entered. That's the whole idea."

---

### Resume bullets

- Built a context-aware AI assistant for Wealthsimple Tax's T5 slip entry screen, integrating the Claude API with streaming to deliver field-specific explanations using the user's actual entered values
- Designed the full system prompt architecture to handle the most common T5 confusion scenarios (gross-up, foreign tax credits, TFSA income) without generic fallbacks
- Shipped a working React + Vite prototype in under a week, including conversation memory, streaming UI, and a mocked T5 form

---

## What's mocked vs real

| Thing | Status |
|---|---|
| Claude API calls | **Real** — live streaming responses |
| Conversation memory (per field) | **Real** |
| T5 form fields | **Mocked** — hardcoded RBC slip |
| User auth / session | **Mocked** — no login |
| CRA Auto-fill | **Not implemented** |
| Save & continue | **Not implemented** |
| Wealthsimple branding | **Approximate** — concept demo only |

---

## Extending this

**PDF upload (next feature):**
- Add a file input that accepts PDF T5s
- Send the PDF as base64 to Claude's vision API
- Prompt: "Extract T5 fields as JSON matching this schema: {box13, box14, box15, box16, box24, box25, box26, box18}"
- Auto-fill the form with the extracted values
- Trigger AI explanation on any field where the extracted value is non-zero

This closes the gap that CRA Auto-fill can't cover: foreign slips (1099-DIV, W-8BEN) that never reach the CRA's system.
