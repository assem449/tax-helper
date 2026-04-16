#  Tax AI Assistant Demo

A simple MVP for an idea I wish existed in Wealthsimple Tax as a user: contextual, plain-English help directly inside tax filing.

This prototype focuses on the T5 slip experience. When a user clicks into a field like foreign income, dividend tax credit, or eligible dividends, the app explains that specific box using the values already entered in the form. The goal is to reduce confusion without forcing users to leave the flow, open support articles, or search the CRA site mid-return.

## Why I Built This

Tax products are often accurate but not always reassuring. For many users, the hardest part is not typing numbers into boxes. It is understanding what a box means, whether it applies to them, and what the number will do.

This demo explores a small but useful product idea:

- Keep the user inside the filing experience.
- Give help exactly when they focus on a field.
- Tailor the explanation to the numbers already on the slip.
- Use simple language instead of generic tax jargon.

## What The Demo Does

- Simulates a Wealthsimple Tax-style T5 slip entry screen.
- Watches which T5 field the user focuses on.
- Sends the active field plus current form values to an AI assistant.
- Returns short, contextual explanations in plain English.
- Supports follow-up questions and quick suggested prompts.
- Includes prompt logic for common T5-specific scenarios such as foreign income, foreign tax paid, Form T2209, eligible dividend gross-up, and TFSA clarification.

## Product Idea

The product direction behind this MVP is:

"Explain this field in context, at the moment the user needs it."

Instead of a generic chatbot floating beside the product, this is meant to feel embedded in the tax workflow. The assistant reacts to the form itself and answers with the user’s current numbers in mind.

## Stack

- React
- Vite
- OpenAI API
- Lightweight CSS modules for the UI

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root:

```env
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

Do not commit your real `.env` file or API key.

3. Start the app:

```bash
npm run dev
```

4. Open the local Vite URL in your browser.

## Build

To create a production build:

```bash
npm run build
```

## How To Use The Demo

1. Open the app.
2. Click into any T5 field.
3. The AI panel will generate a short explanation based on that field and the current form values.
4. Ask a follow-up question in the input at the bottom of the assistant panel.

## Current Scope

This is intentionally a narrow MVP. Right now it is focused on:

- one slip type: T5
- one workflow: field-level explanation during entry
- one UI concept: embedded assistant panel

It is not trying to solve the entire tax filing journey.

## Known Limitation

This demo currently calls the OpenAI API directly from the frontend using a Vite environment variable. That is acceptable for a local prototype, but it is not production-safe because browser-based frontend apps can expose client-side secrets.

If this concept were taken further, the next step would be:

- move model requests behind a backend or serverless proxy
- add auth / rate limiting
- add stronger prompt and response guardrails
- expand coverage beyond T5 to other slips and filing flows

## Why This Could Matter

A feature like this could help:

- reduce drop-off caused by uncertainty
- lower support burden for common filing questions
- increase user confidence during self-serve filing
- make Wealthsimple Tax feel more guided without making it feel heavier

## Notes

- This is an independent product demo inspired by the Wealthsimple Tax experience.
- It is not an official Wealthsimple project.
- The UI and workflow are intentionally lightweight to keep the concept easy to evaluate.
