"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getProductById, formatPrice } from "@/lib/products";
import { loadDemoContext, saveDemoContext } from "@/lib/demo-storage";
import { buildPersonalizedPreview } from "@/lib/voice-scripts";
import { playVoiceText, isVoicePlaying } from "@/lib/voice-client";
import { setDemoStep } from "@/lib/demo-storage";
import { CheckoutButton } from "./CheckoutButton";
import { useToast } from "./Toast";
import { useRecordingMode } from "@/hooks/useRecordingMode";
import type { VoiceOrbState } from "@/types";

interface RecommendationCardProps {
  productId: string;
  whyItFits?: string;
  whatYouGet?: string;
  cta?: string;
  matchScore?: number;
  matchSignals?: string[];
  expectedOutcome?: string;
  userIntent?: string;
  highlight?: boolean;
  onVoiceStateChange?: (state: VoiceOrbState) => void;
  onSampleEnded?: () => void;
  autoDemo?: boolean;
}

export function RecommendationCard({
  productId,
  whyItFits,
  whatYouGet,
  cta,
  matchScore = 94,
  matchSignals = [],
  expectedOutcome,
  userIntent,
  highlight = false,
  onVoiceStateChange,
  onSampleEnded,
  autoDemo = false,
}: RecommendationCardProps) {
  const product = getProductById(productId);
  const [sampleLoading, setSampleLoading] = useState(false);
  const { showToast } = useToast();
  const recordingMode = useRecordingMode();
  const autoSampleStartedRef = useRef(false);
  const autoSampleAdvancedRef = useRef(false);
  const handleHearSampleRef = useRef<() => void | Promise<void>>(() => {});
  const onSampleEndedRef = useRef<(() => void) | undefined>(onSampleEnded);

  const ctx = loadDemoContext();
  const intent = userIntent ?? ctx?.userIntent ?? "";
  const outcome = expectedOutcome ?? ctx?.expectedOutcome ?? product?.whatYouGet ?? "";
  const signals = matchSignals.length > 0 ? matchSignals : ctx?.matchSignals ?? [];

  const handleHearSample = useCallback(async () => {
    if (!product || isVoicePlaying() || sampleLoading) return;

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
      await playVoiceText(previewText, {
        onStart: () => onVoiceStateChange?.("speaking"),
        onEnd: () => {
          onVoiceStateChange?.("idle");
          saveDemoContext({ voicePreviewPlayed: true });
          onSampleEnded?.();
        },
        onError: (msg) => showToast(msg, "info"),
      });
    } finally {
      setSampleLoading(false);
    }
  }, [
    cta,
    intent,
    matchScore,
    onSampleEnded,
    onVoiceStateChange,
    product,
    productId,
    sampleLoading,
    showToast,
    whatYouGet,
    whyItFits,
  ]);

  useEffect(() => {
    handleHearSampleRef.current = handleHearSample;
  }, [handleHearSample]);

  useEffect(() => {
    onSampleEndedRef.current = onSampleEnded;
  }, [onSampleEnded]);

  useEffect(() => {
    if (!autoDemo || autoSampleStartedRef.current) return;
    autoSampleStartedRef.current = true;

    const sampleTimer = window.setTimeout(() => {
      void handleHearSampleRef.current();
    }, 6500);

    const advanceTimer = window.setTimeout(() => {
      if (autoSampleAdvancedRef.current) return;
      autoSampleAdvancedRef.current = true;
      onSampleEndedRef.current?.();
    }, 15500);

    return () => {
      window.clearTimeout(sampleTimer);
      window.clearTimeout(advanceTimer);
    };
  }, [autoDemo]);

  if (!product) return null;

  return (
    <div
      id="recommendation-card"
      className={`mx-4 mb-4 rec-card-highlight rounded-2xl p-5 md:p-6 transition-all ${
        highlight
          ? `ring-2 ring-cyan-400/50 ${recordingMode ? "" : "animate-pulse"}`
          : ""
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

      {signals.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3 mb-2">
          {signals.map((s) => (
            <span
              key={s}
              className="text-[10px] px-2 py-1 rounded-full bg-cyan-500/10 text-cyan-200/90 border border-cyan-500/20"
            >
              {s}
            </span>
          ))}
        </div>
      )}

      <p className="text-cyan-400 font-semibold">{formatPrice(product.price, product.currency)}</p>
      <p className="text-sm text-slate-300 mt-2">{product.shortBenefit}</p>

      <details className="mt-4 group" open={recordingMode || autoDemo}>
        <summary className="text-sm text-violet-300 cursor-pointer hover:text-violet-200 list-none flex items-center gap-2">
          <span className="group-open:rotate-90 transition-transform">▸</span>
          Why this recommendation?
        </summary>
        <div className="mt-3 space-y-3 text-sm pl-4 border-l border-violet-500/20">
          <div>
            <p className="text-slate-300 font-medium">Matched user intent</p>
            <p className="text-slate-400">{intent || "General discovery"}</p>
          </div>
          {whyItFits && (
            <div>
              <p className="text-slate-300 font-medium">Product fit</p>
              <p className="text-slate-400">{whyItFits}</p>
            </div>
          )}
          <div>
            <p className="text-slate-300 font-medium">Expected outcome</p>
            <p className="text-slate-400">{outcome}</p>
          </div>
          {cta && (
            <div>
              <p className="text-slate-300 font-medium">Best next action</p>
              <p className="text-slate-400">{cta}</p>
            </div>
          )}
        </div>
      </details>

      <div className="flex flex-wrap gap-3 mt-6">
        <div data-judge-target="checkout">
          <CheckoutButton
            productId={productId}
            label="Buy with Stripe"
            showStripeBadge
            onCheckoutStart={() => setDemoStep("pay")}
          />
        </div>
        <button
          type="button"
          data-judge-target="hear-sample"
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
