"use client";

import { useState } from "react";

interface CheckoutButtonProps {
  productId: string;
  customerName?: string;
  customerEmail?: string;
  label?: string;
  className?: string;
}

export function CheckoutButton({
  productId,
  customerName,
  customerEmail,
  label = "Buy now",
  className = "",
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setLoading(true);
    setError(null);
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
        {loading ? "Redirecting…" : label}
      </button>
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}
