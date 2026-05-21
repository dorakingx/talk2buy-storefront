"use client";

import { useEffect, useState } from "react";
import { loadDemoContext } from "@/lib/demo-storage";
import { useToast } from "./Toast";
import type { AppConfig, CheckoutSessionResponse } from "@/types";

interface CheckoutButtonProps {
  productId: string;
  customerName?: string;
  customerEmail?: string;
  label?: string;
  className?: string;
  showStripeBadge?: boolean;
  onCheckoutStart?: () => void;
}

export function CheckoutButton({
  productId,
  customerName,
  customerEmail,
  label,
  className = "",
  showStripeBadge = false,
  onCheckoutStart,
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<AppConfig | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then(setConfig)
      .catch(() => setConfig({ stripeEnabled: false, elevenLabsEnabled: false }));
  }, []);

  const isDemoMode = config && !config.stripeEnabled;
  const buttonLabel = label ?? (isDemoMode ? "Try demo checkout" : "Buy now");

  function buildClientDemoUrl(): string {
    const ctx = loadDemoContext();
    const params = new URLSearchParams({
      demo: "1",
      productId,
      customerName: customerName ?? ctx?.customerName ?? "Demo Guest",
    });
    if (ctx?.userIntent) {
      params.set("userIntent", ctx.userIntent.slice(0, 200));
    }
    return `/checkout/success?${params.toString()}`;
  }

  async function handleCheckout() {
    if (loading) return;
    setLoading(true);
    setError(null);
    onCheckoutStart?.();

    const ctx = loadDemoContext();

    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          customerName: customerName ?? ctx?.customerName,
          customerEmail,
          userIntent: ctx?.userIntent,
        }),
      });
      const data = (await res.json()) as CheckoutSessionResponse;

      if (data.demo && data.url) {
        showToast("Demo mode — no payment required", "info");
        window.location.href = data.url;
        return;
      }

      if (!res.ok) {
        if (!config?.stripeEnabled) {
          showToast("Demo mode — no payment required", "info");
          window.location.href = buildClientDemoUrl();
          return;
        }
        throw new Error(data.error ?? "Checkout failed");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (e) {
      if (!config?.stripeEnabled) {
        showToast("Demo mode — no payment required", "info");
        window.location.href = buildClientDemoUrl();
      } else {
        setError(e instanceof Error ? e.message : "Checkout failed");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading}
        className={`btn-neon rounded-xl px-4 py-2 text-sm ${className}`}
      >
        {loading ? "Redirecting…" : buttonLabel}
      </button>
      {showStripeBadge && !isDemoMode && (
        <span className="text-[10px] text-slate-500">Checkout secured by Stripe</span>
      )}
      {showStripeBadge && isDemoMode && (
        <span className="text-[10px] text-amber-400/80">Demo checkout available</span>
      )}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
