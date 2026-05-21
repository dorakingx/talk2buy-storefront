"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AudioPlayer } from "@/components/AudioPlayer";
import { useToast } from "@/components/Toast";
import { getProductById, formatPrice } from "@/lib/products";
import { loadDemoContext, setDemoStep, saveDemoContext } from "@/lib/demo-storage";
import { buildPersonalizedThankYou } from "@/lib/voice-scripts";
import { playVoiceText } from "@/lib/voice-client";
import type { DemoContext } from "@/lib/demo-storage";
import type { StripeSessionResponse } from "@/types";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const isDemo = searchParams.get("demo") === "1";
  const demoProductId = searchParams.get("productId");
  const demoCustomerName = searchParams.get("customerName") ?? "Guest";
  const queryIntent = searchParams.get("userIntent");

  const [stripeSession, setStripeSession] = useState<StripeSessionResponse | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState(false);
  const [voiceLoading, setVoiceLoading] = useState(false);
  const [replayLoading, setReplayLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    setDemoStep("thank_you");
  }, []);

  const demoSession = useMemo((): StripeSessionResponse | null => {
    if (!isDemo || !demoProductId) return null;
    const p = getProductById(demoProductId);
    if (!p) return null;
    return {
      customerName: decodeURIComponent(demoCustomerName),
      customerEmail: null,
      productId: demoProductId,
      productName: p.name,
      paymentStatus: "paid",
      userIntent: queryIntent ? decodeURIComponent(queryIntent) : null,
    };
  }, [isDemo, demoProductId, demoCustomerName, queryIntent]);

  const session = isDemo ? demoSession : stripeSession;

  const sessionError = useMemo(() => {
    if (isDemo) {
      if (!demoProductId) return "Missing product";
      if (!demoSession) return "Product not found";
      return null;
    }
    if (!sessionId) return "No session ID provided";
    return fetchError;
  }, [isDemo, demoProductId, demoSession, sessionId, fetchError]);

  const product =
    session?.productId != null ? getProductById(session.productId) : undefined;

  const customerName = session?.customerName ?? "there";

  const demoCtx = useMemo((): DemoContext | null => {
    const stored = loadDemoContext();
    const intent =
      (queryIntent ? decodeURIComponent(queryIntent) : null) ??
      session?.userIntent ??
      stored?.userIntent ??
      "";
    if (!intent && !stored) return stored;
    return {
      userIntent: intent,
      recommendedProductId: session?.productId ?? stored?.recommendedProductId,
      whyItFits: stored?.whyItFits,
      whatYouGet: stored?.whatYouGet,
      cta: stored?.cta,
      matchScore: stored?.matchScore,
      customerName: session?.customerName ?? undefined,
    };
  }, [queryIntent, session]);

  const thankYouText =
    product && customerName
      ? buildPersonalizedThankYou(customerName, product, demoCtx)
      : null;

  useEffect(() => {
    if (isDemo || !sessionId) return;

    fetch(`/api/stripe-session?session_id=${sessionId}`)
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data.error ?? "Failed to load session");
        setStripeSession(data);
        if (data.userIntent || data.productId) {
          saveDemoContext({
            userIntent: data.userIntent ?? loadDemoContext()?.userIntent ?? "",
            recommendedProductId: data.productId ?? undefined,
            customerName: data.customerName ?? undefined,
          });
        }
      })
      .catch((e) => {
        setFetchError(e instanceof Error ? e.message : "Failed to load session");
      });
  }, [sessionId, isDemo]);

  useEffect(() => {
    if (!thankYouText) return;

    let active = true;
    const message = thankYouText;

    async function run() {
      setVoiceLoading(true);
      setAudioUrl(null);
      setDemoMode(false);
      const result = await playVoiceText(message, {
        onError: (msg) => showToast(msg, "info"),
      });
      if (!active) return;
      if (result.url) {
        setAudioUrl(result.url);
      } else if (result.demo) {
        setDemoMode(true);
      }
      setVoiceLoading(false);
    }

    run();
    return () => {
      active = false;
    };
  }, [thankYouText, showToast]);

  async function handleReplay() {
    if (!thankYouText) return;
    setReplayLoading(true);
    setVoiceLoading(true);
    const result = await playVoiceText(thankYouText, {
      onError: (msg) => showToast(msg, "info"),
    });
    if (result.url) setAudioUrl(result.url);
    else if (result.demo) setDemoMode(true);
    setVoiceLoading(false);
    setReplayLoading(false);
  }

  function handleShare() {
    navigator.clipboard?.writeText(window.location.href);
    showToast("Link copied to clipboard (demo)", "success");
  }

  if (sessionError) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-red-400">{sessionError}</p>
        <Link href="/" className="text-cyan-400 mt-4 inline-block">
          Return to storefront
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 relative overflow-hidden">
      <div className="confetti pointer-events-none absolute inset-0" aria-hidden />
      <div className="glass-card rounded-2xl p-8 text-center relative z-10">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400/50 flex items-center justify-center mx-auto mb-6 animate-fade-in">
          <span className="text-3xl text-emerald-400">✓</span>
        </div>
        <h1 className="text-3xl font-bold text-gradient mb-2">Purchase complete</h1>
        {isDemo && (
          <span className="inline-block text-xs px-2 py-1 rounded-full bg-amber-500/20 text-amber-300 mb-4">
            Demo checkout
          </span>
        )}

        {product ? (
          <>
            <p className="text-xl text-slate-200 font-medium mt-4">{product.name}</p>
            <p className="text-cyan-400 mt-1">
              {formatPrice(product.price, product.currency)}
            </p>
            <p className="text-slate-400 mt-4 max-w-md mx-auto text-sm leading-relaxed">
              {thankYouText ?? "Preparing your personalized message…"}
            </p>
          </>
        ) : (
          <p className="text-slate-400 animate-pulse mt-4">Loading order details…</p>
        )}

        <div className="mt-8 text-left">
          <AudioPlayer
            audioUrl={audioUrl}
            demoMode={demoMode}
            loading={voiceLoading}
            onReplay={handleReplay}
            replayLoading={replayLoading}
          />
        </div>

        <div className="glass-card rounded-xl p-5 mt-6 text-left text-sm text-slate-300">
          <p className="font-semibold text-slate-100 mb-2">Download & access</p>
          <p className="mb-3">
            Your digital product is ready. Access your purchase from the creator
            dashboard or download instantly below.
          </p>
          <button
            type="button"
            className="text-cyan-400 hover:text-cyan-300 text-sm font-medium"
            onClick={() => showToast("Download started (demo)", "success")}
          >
            Download product →
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <button
            type="button"
            onClick={handleShare}
            className="rounded-xl px-5 py-2.5 text-sm border border-slate-600 text-slate-300 hover:border-cyan-500/50 transition-colors"
          >
            Share purchase
          </button>
          <Link href="/dashboard" className="rounded-xl px-5 py-2.5 text-sm btn-neon">
            View dashboard
          </Link>
        </div>

        <Link
          href="/"
          className="inline-block mt-6 text-cyan-400 hover:text-cyan-300 text-sm"
        >
          ← Back to storefront
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-xl mx-auto px-4 py-20 text-center text-slate-400">
          Loading…
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
