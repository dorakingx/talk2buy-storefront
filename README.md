# Talk-to-Buy Storefront

AI voice storefront MVP — visitors chat with an AI shop assistant, receive product recommendations, pay via Stripe Checkout, and get a personalized ElevenLabs thank-you message after purchase.

## Tech stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Stripe Checkout
- ElevenLabs Text-to-Speech
- Rule-based assistant (optional OpenAI)

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_APP_URL` | Yes | App URL for Stripe redirects (e.g. `http://localhost:3000`) |
| `STRIPE_SECRET_KEY` | For checkout | Stripe secret key (test mode) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Optional | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Optional | Reserved for future webhooks |
| `ELEVENLABS_API_KEY` | For voice | ElevenLabs API key |
| `ELEVENLABS_VOICE_ID` | For voice | ElevenLabs voice ID |
| `OPENAI_API_KEY` | Optional | Enables GPT-based assistant replies |

Without Stripe keys, checkout shows a configuration error. Without ElevenLabs keys, voice runs in **demo mode** with an informational message.

## Stripe setup

1. Create a [Stripe](https://stripe.com) account and enable test mode.
2. Copy **Secret key** → `STRIPE_SECRET_KEY` in `.env.local`.
3. Use test card `4242 4242 4242 4242` with any future expiry and CVC.

Success redirect: `/checkout/success?session_id={CHECKOUT_SESSION_ID}`

## ElevenLabs setup

1. Sign up at [ElevenLabs](https://elevenlabs.io).
2. Copy API key → `ELEVENLABS_API_KEY`.
3. Pick a voice from the voice library → `ELEVENLABS_VOICE_ID`.

## Pages

- `/` — Landing, products, AI assistant
- `/checkout/success` — Post-payment confirmation + voice message
- `/dashboard` — Creator dashboard (mock data)

## Deploy to Vercel

1. Push to GitHub and import in Vercel.
2. Add all env vars from `.env.example`.
3. Set `NEXT_PUBLIC_APP_URL` to your production URL.

## Project structure

```
app/           # Pages and API routes
components/    # UI components
lib/           # Products, assistant, Stripe, ElevenLabs, mock data
types/         # TypeScript types
```
