# Talk2Buy Storefront — Hackathon Submission

## Project title

**Talk2Buy Storefront**

## One-sentence pitch

Turn live voice conversations into personalized product recommendations, ElevenLabs previews, and instant Stripe checkout — without a static, impersonal storefront.

## Problem

Digital creators lose sales on static product pages. Visitors cannot hear why a product fits them, and text-only chat feels like support — not sales.

## Solution

An AI voice storefront where visitors talk (push-to-talk or quick replies), receive a scored recommendation with explainable signals, hear a personalized ElevenLabs preview, pay via Stripe, and get thank-you audio tied to their original intent.

## How ElevenLabs is used

- Assistant replies spoken after recommendations
- **Hear sample** — personalized preview from conversation context (not generic product copy)
- Post-purchase thank-you audio on the success page
- Graceful browser-voice fallback when API keys are missing

## How Stripe is used

- Stripe Checkout when `STRIPE_SECRET_KEY` is configured
- Session metadata: product, customer name, user intent
- **Demo checkout** when Stripe is not configured — full success-page loop still works

## Why it is original

Voice is the **sales interface**, not a post-purchase perk. The same conversation thread drives recommendation, preview, payment, and delivery — measurable as a conversation-to-revenue pipeline (ElevenLabs engagement → Stripe conversion).

## Demo flow

1. Land on hero — see Conversation → Revenue pipeline (ElevenLabs + Stripe)
2. Click **Run judge demo** — guided overlay: Hear sample → Buy with Stripe
3. Review match score and “Why this recommendation?”
4. Complete demo or real checkout
5. Success page — **Your conversation became a product experience**
6. Creator dashboard — voice commerce analytics and conversion funnel (demo data)

## Links

| Resource | URL |
|----------|-----|
| GitHub | https://github.com/dorakingx/talk2buy-storefront |
| Live demo | TBD |
| Demo video | TBD |

## Before you record

- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
- [DEMO_SCRIPT.md](DEMO_SCRIPT.md)
