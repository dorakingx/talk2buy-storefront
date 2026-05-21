"use client";

import { useEffect, useState } from "react";
import { useToast } from "./Toast";
import type { AppConfig } from "@/types";

interface CheckoutButtonProps {
  productId: string;
  customerName?: string;
  customerEmail?: string;
  label?: string;
  className?: string;
  showStripeBadge?: boolean;
}

export function CheckoutButton({
  productId,
  customerName,
  customerEmail,
  label,
  className = "",
  showStripeBadge = false,
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

  const isDemo = config && !config.stripeEnabled;
  const buttonLabel = label ?? (isDemo ? "Try demo checkout" : "Buy now");

  async function handleCheckout() {
    setLoading(true);
    setError(null);

    if (isDemo) {
      const params = new URLSearchParams({
        demo: "1",
        productId,
        customerName: customerName ?? "Demo Guest",
      });
      showToast("Demo mode — no payment required", "info");
      window.location.href = `/checkout/success?${params.toString()}`;
      return;
    }

    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, customerName, customerEmail }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Checkout failed");
      }
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed");
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
      {showStripeBadge && !isDemo && (
        <span className="text-[10px] text-slate-500">Secured by Stripe</span>
      )}
      {isDemo && (
        <span className="text-[10px] text-amber-400/80">Demo checkout — no Stripe key</span>
      )}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
