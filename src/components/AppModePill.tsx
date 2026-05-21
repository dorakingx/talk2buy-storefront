"use client";

import { useEffect, useState } from "react";
import type { AppConfig } from "@/types";

export function AppModePill() {
  const [config, setConfig] = useState<AppConfig | null>(null);

  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then(setConfig)
      .catch(() => setConfig({ stripeEnabled: false, elevenLabsEnabled: false }));
  }, []);

  if (!config) {
    return (
      <span className="h-6 w-36 rounded-full bg-slate-800/80 animate-pulse shrink-0" />
    );
  }

  const isLive = config.stripeEnabled && config.elevenLabsEnabled;

  return (
    <span
      className={`text-[10px] md:text-xs px-2.5 py-1 rounded-full border shrink-0 ${
        isLive
          ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/35"
          : "bg-amber-500/15 text-amber-300 border-amber-500/35"
      }`}
      title={isLive ? "ElevenLabs and Stripe API keys are configured" : "Runs without API keys"}
    >
      {isLive
        ? "Live mode: ElevenLabs + Stripe enabled"
        : "Demo mode: no API keys required"}
    </span>
  );
}
