# Talk2Buy Storefront — Hackathon Submission

**Talk2Buy turns voice conversations into revenue.**

## One-sentence pitch

Turn live voice conversations into personalized product recommendations, ElevenLabs previews, and instant Stripe checkout — without a static, impersonal storefront.

## Problem

Creators lose sales on static product pages. Visitors cannot hear why a product fits them; text-only chat feels like support, not sales.

## Solution

AI voice storefront: talk → scored recommendation → ElevenLabs preview → Stripe checkout → personalized thank-you audio from the same conversation context.

## ElevenLabs

- Spoken assistant replies
- **Hear sample** from visitor intent (not generic copy)
- Post-purchase thank-you on success page
- Browser voice fallback when keys are missing

## Stripe

- Checkout Sessions with metadata: `productId`, `customerName`, `userIntent`
- Demo checkout when Stripe is not configured

## Why it is original

Voice is the **sales interface**. One thread drives recommendation, preview, payment, and delivery — a measurable conversation-to-revenue pipeline.

## Demo flow

1. Hero pipeline (ElevenLabs + Stripe badges)
2. **Run judge demo** → Hear sample → Buy with Stripe
3. Match score + explanation expander
4. Checkout → success experience loop
5. Dashboard funnel (demo analytics)

Record with `?recording=1` for stable layout.

## Links

| Resource | URL |
|----------|-----|
| GitHub | https://github.com/dorakingx/talk2buy-storefront |
| Live demo | Deploy to Vercel — set `NEXT_PUBLIC_APP_URL` to `https://YOUR-APP.vercel.app` |
| Demo video | Add YouTube/Loom link after recording |

## Before submit

- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
- [DEMO_SCRIPT.md](DEMO_SCRIPT.md)

Replace `YOUR-APP` and video `TBD` before final submission.
