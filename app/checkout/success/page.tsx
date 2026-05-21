"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { AudioPlayer } from "@/components/AudioPlayer";
import type { StripeSessionResponse } from "@/types";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [session, setSession] = useState<StripeSessionResponse | null>(null);
  const [sessionError, setSessionError] = useState<string | null>(
    sessionId ? null : "No session ID provided"
  );
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState(false);
  const [voiceLoading, setVoiceLoading] = useState(false);

  useEffect(() => {
    if (!sessionId) return;

    async function loadSession() {
      try {
        const res = await fetch(`/api/stripe-session?session_id=${sessionId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Failed to load session");
        setSession(data);
      } catch (e) {
        setSessionError(e instanceof Error ? e.message : "Failed to load session");
      }
    }

    loadSession();
  }, [sessionId]);

  useEffect(() => {
    if (!session?.productName) return;

    const name = session.customerName ?? "there";
    const message = `Thank you, ${name}, for purchasing ${session.productName}. I hope this helps you explore your creative and technical journey.`;

    async function generateVoice() {
      setVoiceLoading(true);
      try {
        const res = await fetch("/api/generate-voice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: message }),
        });
        const contentType = res.headers.get("content-type") ?? "";
        if (contentType.includes("application/json")) {
          const data = await res.json();
          if (data.demo) setDemoMode(true);
        } else if (res.ok) {
          const blob = await res.blob();
          setAudioUrl(URL.createObjectURL(blob));
        }
      } finally {
        setVoiceLoading(false);
      }
    }

    generateVoice();
  }, [session]);

  if (!sessionId) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-red-400">Invalid checkout session.</p>
        <Link href="/" className="text-cyan-400 mt-4 inline-block">
          Return to storefront
        </Link>
      </div>
    );
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
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="card-glow rounded-2xl p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl text-emerald-400">✓</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-100 mb-2">
          Purchase complete
        </h1>
        {session ? (
          <>
            <p className="text-slate-400 mb-6">
              Thank you for purchasing{" "}
              <span className="text-cyan-400">{session.productName}</span>.
              {session.customerEmail && (
                <> A confirmation was sent to {session.customerEmail}.</>
              )}
            </p>
            <div className="text-left bg-slate-900/50 rounded-xl p-4 mb-6 text-sm text-slate-300">
              <p className="font-medium text-slate-200 mb-2">Your product access</p>
              <p>
                Your digital product is ready. Check your email for download
                instructions, or visit your creator dashboard for access links.
              </p>
            </div>
          </>
        ) : (
          <p className="text-slate-400 mb-6 animate-pulse">Loading order details…</p>
        )}

        <AudioPlayer
          audioUrl={audioUrl}
          demoMode={demoMode}
          loading={voiceLoading}
        />

        <Link
          href="/"
          className="inline-block mt-8 text-cyan-400 hover:text-cyan-300 text-sm"
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
