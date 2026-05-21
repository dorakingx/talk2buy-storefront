# Talk-to-Buy Storefront

AI voice commerce platform for creators — an ElevenLabs-powered sales assistant that recommends products, speaks to customers, and drives purchases through Stripe.

## Demo flow (60–90s video)

1. Land on hero → click **Try the voice demo**
2. Watch auto intro + tap **I want to learn quantum computing**
3. See **AI Recommended for You** → **Hear sample**
4. **Buy with Stripe** (or **Try demo checkout** without API keys)
5. Success page: personalized thank-you audio + share
6. Cut to **Dashboard** for metrics and revenue chart

## Tech stack

- Next.js 16 (App Router)
- TypeScript · Tailwind CSS
- Stripe Checkout · ElevenLabs TTS · Rule-based assistant (optional OpenAI)

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
| `NEXT_PUBLIC_APP_URL` | Yes | App URL for Stripe redirects |
| `STRIPE_SECRET_KEY` | For live checkout | Without it, demo checkout is used |
| `ELEVENLABS_API_KEY` | For ElevenLabs audio | Without it, browser SpeechSynthesis fallback |
| `ELEVENLABS_VOICE_ID` | With ElevenLabs | Voice ID from ElevenLabs library |
| `OPENAI_API_KEY` | Optional | GPT-based assistant replies |

## Project structure

```
src/
  app/              # Pages and API routes
  components/       # VoiceOrb, VoiceAssistant, RecommendationCard, etc.
  lib/              # products, assistant, stripe, elevenlabs, voice-client
  types/
```

## Pages

- `/` — Voice-first storefront, products, pitch
- `/checkout/success` — Post-payment (Stripe or `?demo=1&productId=...`)
- `/dashboard` — Creator SaaS dashboard with chart

## Deploy to Vercel

1. Import from GitHub
2. Add env vars from `.env.example`
3. Set `NEXT_PUBLIC_APP_URL` to production URL
