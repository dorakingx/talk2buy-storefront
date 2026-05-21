"use client";

import { useState } from "react";
import { getProductById, formatPrice } from "@/lib/products";
import { loadDemoContext } from "@/lib/demo-storage";
import { buildPersonalizedPreview } from "@/lib/voice-scripts";
import { playVoiceText, isVoicePlaying } from "@/lib/voice-client";
import { setDemoStep } from "@/lib/demo-storage";
import { CheckoutButton } from "./CheckoutButton";
import { useToast } from "./Toast";
import type { VoiceOrbState } from "@/types";

interface RecommendationCardProps {
  productId: string;
  whyItFits?: string;
  whatYouGet?: string;
  cta?: string;
  matchScore?: number;
  userIntent?: string;
  highlight?: boolean;
  onVoiceStateChange?: (state: VoiceOrbState) => void;
}

export function RecommendationCard({
  productId,
  whyItFits,
  whatYouGet,
  cta,
  matchScore = 94,
  userIntent,
  highlight = false,
  onVoiceStateChange,
}: RecommendationCardProps) {
  const product = getProductById(productId);
  const [sampleLoading, setSampleLoading] = useState(false);
  const { showToast } = useToast();

  if (!product) return null;

  const ctx = loadDemoContext();
  const intent = userIntent ?? ctx?.userIntent ?? "";

  async function handleHearSample() {
    if (isVoicePlaying() || sampleLoading) return;

    setSampleLoading(true);
    setDemoStep("hear_sample");
    onVoiceStateChange?.("speaking");

    const previewText = buildPersonalizedPreview({
      userIntent: intent,
      recommendedProductId: productId,
      whyItFits,
      whatYouGet,
      cta,
      matchScore,
    });

    try {
      const result = await playVoiceText(previewText, {
        onStart: () => onVoiceStateChange?.("speaking"),
        onEnd: () => onVoiceStateChange?.("idle"),
        onError: (msg) => showToast(msg, "info"),
      });
      if (result.demo && result.usedBrowserFallback) {
        showToast("Demo voice mode (browser)", "info");
      }
    } finally {
      setSampleLoading(false);
      onVoiceStateChange?.("idle");
    }
  }

  return (
    <div
      className={`mx-4 mb-4 rec-card-highlight rounded-2xl p-5 md:p-6 transition-all ${
        highlight ? "ring-2 ring-cyan-400/50 animate-pulse" : ""
      }`}
    >
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-violet-400">
          AI Recommended for You
        </p>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
          Recommended from your conversation
        </span>
      </div>

      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
        <h3 className="text-xl font-bold text-slate-100">{product.name}</h3>
        <span className="text-sm font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
          {Math.round(matchScore)}% match
        </span>
      </div>

      <p className="text-cyan-400 font-semibold">{formatPrice(product.price, product.currency)}</p>
      <p className="text-sm text-slate-300 mt-2">{product.shortBenefit}</p>

      <ul className="mt-4 space-y-3 text-sm">
        {whyItFits && (
          <li className="flex gap-2 text-slate-400">
            <span className="text-cyan-400 shrink-0">→</span>
            <span>
              <span className="text-slate-200 font-medium">Why this fits: </span>
              {whyItFits}
            </span>
          </li>
        )}
        {whatYouGet && (
          <li className="flex gap-2 text-slate-400">
            <span className="text-violet-400 shrink-0">→</span>
            <span>
              <span className="text-slate-200 font-medium">What you get: </span>
              {whatYouGet}
            </span>
          </li>
        )}
        {cta && (
          <li className="flex gap-2 text-slate-400">
            <span className="text-fuchsia-400 shrink-0">→</span>
            <span>
              <span className="text-slate-200 font-medium">Best next step: </span>
              {cta}
            </span>
          </li>
        )}
      </ul>

      <div className="flex flex-wrap gap-3 mt-6">
        <CheckoutButton
          productId={productId}
          label="Buy with Stripe"
          showStripeBadge
          onCheckoutStart={() => setDemoStep("pay")}
        />
        <button
          type="button"
          onClick={handleHearSample}
          disabled={sampleLoading}
          className="rounded-xl px-4 py-2 text-sm border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10 transition-colors disabled:opacity-50"
        >
          {sampleLoading ? "Generating preview…" : "Hear sample"}
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        <span className="text-[10px] px-2 py-1 rounded-md bg-slate-800/80 text-slate-400 border border-slate-700">
          Voice preview by ElevenLabs
        </span>
        <span className="text-[10px] px-2 py-1 rounded-md bg-slate-800/80 text-slate-400 border border-slate-700">
          Checkout secured by Stripe
        </span>
      </div>
    </div>
  );
}
