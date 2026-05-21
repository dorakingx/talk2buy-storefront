# Talk2Buy Storefront

Built with **ElevenLabs** · Powered by **Stripe** · **Demo mode** available

**Talk2Buy turns voice conversations into revenue.** Visitors talk with an AI sales assistant, hear personalized ElevenLabs previews, pay through Stripe, and receive spoken thank-you audio tied to their original intent.

**Voice is not just content. Voice is the sales interface.**

Built for the **ElevenLabs x Stripe** hackathon. Judges: see [HACKATHON_SUBMISSION.md](HACKATHON_SUBMISSION.md).

**Live demo:** [talk2buy-storefront.vercel.app](https://talk2buy-storefront.vercel.app) · **Links:** [SUBMISSION_URLS.md](SUBMISSION_URLS.md) (demo video when recorded)

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Header pill shows **Demo mode** or **Live mode** (ElevenLabs + Stripe keys).

| Mode | Requirements |
|------|----------------|
| Demo | No env keys — browser voice + demo checkout |
| Live | `STRIPE_SECRET_KEY`, `ELEVENLABS_API_KEY`, `ELEVENLABS_VOICE_ID`, `NEXT_PUBLIC_APP_URL` |

## Winning demo path (60–90s)

1. Hero — Conversation → Revenue pipeline (ElevenLabs + Stripe visible)
2. **Run judge demo** — overlay: Hear sample → Buy with Stripe
3. Match score + “Why this recommendation?”
4. Demo checkout → success **experience loop** + thank-you audio
5. Dashboard — funnel + voice commerce analytics

Recording tip: use [/?recording=1](https://talk2buy-storefront.vercel.app/?recording=1) on production (or localhost when developing). Script: [DEMO_SCRIPT.md](DEMO_SCRIPT.md).

## Screenshots

![Hero — pipeline, demo-ready banner, mode pill](docs/screenshots/hero.png)

![AI assistant — recommendation and match signals](docs/screenshots/assistant.png)

![Voice commerce analytics](docs/screenshots/analytics.png)

![Checkout success — experience loop](docs/screenshots/success.png)

![Creator dashboard — conversion funnel](docs/screenshots/dashboard.png)

## Deploy (Vercel)

Production: **[talk2buy-storefront.vercel.app](https://talk2buy-storefront.vercel.app)** (project `doraking/talk2buy-storefront`).

To redeploy or configure env vars:

1. Repo: [github.com/dorakingx/talk2buy-storefront](https://github.com/dorakingx/talk2buy-storefront)
2. Add variables from `.env.example` in the [Vercel dashboard](https://vercel.com/doraking/talk2buy-storefront)
3. Set `NEXT_PUBLIC_APP_URL` to `https://talk2buy-storefront.vercel.app`
4. CLI: `vercel link --project talk2buy-storefront` then `vercel deploy --prod`

Canonical URLs: [SUBMISSION_URLS.md](SUBMISSION_URLS.md).

## Pre-submission checklist

- [x] App deployed — https://talk2buy-storefront.vercel.app
- [ ] `NEXT_PUBLIC_APP_URL` set on Vercel to production URL
- [ ] GitHub repo public
- [ ] Demo mode works without keys
- [ ] Live mode tested if keys configured
- [ ] Demo video recorded (60–90s); link added to HACKATHON_SUBMISSION
- [ ] No `TBD` placeholders in final submission docs
- [ ] First 5 seconds show Talk2Buy, voice, ElevenLabs, Stripe, revenue

See [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) for full QA steps.

## Docs

| File | Purpose |
|------|---------|
| [HACKATHON_SUBMISSION.md](HACKATHON_SUBMISSION.md) | Judge-facing summary |
| [DEMO_SCRIPT.md](DEMO_SCRIPT.md) | Video script |
| [SUBMISSION_URLS.md](SUBMISSION_URLS.md) | Live demo + video links (single place to edit) |
| [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) | Lint, build, deploy, QA |

## License

MIT
