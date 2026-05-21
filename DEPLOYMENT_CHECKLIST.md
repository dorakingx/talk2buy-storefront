# Talk2Buy Deployment Checklist

Use this list before submitting to judges or deploying to production.

## Local verification

- [ ] `npm install` completes without errors
- [ ] `npm run lint` passes with no errors
- [ ] `npm run build` completes successfully
- [ ] `npm run dev` — storefront loads at [http://localhost:3000](http://localhost:3000)

## Environment variables

Copy `.env.example` to `.env.local` and set as needed:

| Variable | Required for |
|----------|----------------|
| `NEXT_PUBLIC_APP_URL` | Stripe redirect URLs (production domain) |
| `STRIPE_SECRET_KEY` | Real Stripe Checkout |
| `ELEVENLABS_API_KEY` | ElevenLabs TTS |
| `ELEVENLABS_VOICE_ID` | Voice ID from ElevenLabs library |
| `OPENAI_API_KEY` | Optional GPT assistant replies |

## Demo mode (no keys)

- [ ] Home page loads; **Run judge demo** runs the guided flow
- [ ] Voice assistant recommends a product with match score and signals
- [ ] **Hear sample** plays (browser TTS fallback labeled as demo)
- [ ] **Buy with Stripe** redirects to demo success URL
- [ ] Success page shows **Experience loop** and thank-you audio

## Live integrations

- [ ] With `STRIPE_SECRET_KEY`: checkout creates a real Stripe session
- [ ] With `ELEVENLABS_API_KEY` + `ELEVENLABS_VOICE_ID`: previews and thank-you use ElevenLabs
- [ ] Success page loads Stripe session via `/api/stripe-session?session_id=...`

## Judge demo recording

- [ ] Hero pipeline visible above the fold on desktop
- [ ] Header shows Demo mode or Live mode pill (`/api/config`)
- [ ] Judge overlay highlights **Hear sample** then **Buy with Stripe** (buttons remain clickable)
- [ ] Creator dashboard shows conversion funnel and demo insight
- [ ] Record 60–90s using [DEMO_SCRIPT.md](DEMO_SCRIPT.md) — optional `/?recording=1`

## Pre-submission

- [ ] Update [SUBMISSION_URLS.md](SUBMISSION_URLS.md) with real Vercel URL (sync README / HACKATHON)
- [ ] Add demo video link in SUBMISSION_URLS.md after recording
- [ ] Screenshots committed under `docs/screenshots/`
- [ ] GitHub repo is public

## Deploy (Vercel)

- [ ] Import repo and add env vars from `.env.example`
- [ ] Set `NEXT_PUBLIC_APP_URL` to production URL
- [ ] Smoke-test judge demo and one real or demo checkout on production URL
