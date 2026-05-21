"use client";

import { useEffect, useState } from "react";
import type { JudgeGuidePhase } from "./VoiceAssistant";

interface JudgeDemoGuideProps {
  phase: JudgeGuidePhase;
  onDismiss: () => void;
}

export function JudgeDemoGuide({ phase, onDismiss }: JudgeDemoGuideProps) {
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const displayRect =
    phase === "idle" || phase === "done" ? null : targetRect;

  useEffect(() => {
    if (phase === "idle" || phase === "done") {
      return;
    }

    const selector =
      phase === "awaiting_sample"
        ? '[data-judge-target="hear-sample"]'
        : '[data-judge-target="checkout"]';

    function updateRect() {
      const el = document.querySelector(selector);
      if (el) {
        setTargetRect(el.getBoundingClientRect());
      }
    }

    updateRect();
    const t = setInterval(updateRect, 300);
    window.addEventListener("scroll", updateRect, true);
    window.addEventListener("resize", updateRect);
    return () => {
      clearInterval(t);
      window.removeEventListener("scroll", updateRect, true);
      window.removeEventListener("resize", updateRect);
    };
  }, [phase]);

  if (phase === "idle" || phase === "done") return null;

  const message =
    phase === "awaiting_sample"
      ? "Step 3: Tap Hear sample — ElevenLabs generates a personalized voice preview"
      : "Step 4: Tap Buy with Stripe — turn the conversation into revenue";

  const top = displayRect ? displayRect.bottom + 12 : 200;
  const left = displayRect
    ? Math.min(Math.max(displayRect.left, 16), window.innerWidth - 280)
    : 16;

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none">
      <div
        className="absolute inset-0 bg-slate-950/60 pointer-events-auto"
        onClick={onDismiss}
        aria-hidden
      />
      {displayRect && (
        <div
          className="absolute rounded-xl ring-2 ring-cyan-400 ring-offset-2 ring-offset-transparent pointer-events-none"
          style={{
            top: displayRect.top - 4,
            left: displayRect.left - 4,
            width: displayRect.width + 8,
            height: displayRect.height + 8,
          }}
        />
      )}
      <div
        className="absolute pointer-events-auto max-w-xs glass-card rounded-xl p-4 border-cyan-400/50 shadow-xl animate-fade-in"
        style={{ top, left }}
      >
        <p className="text-xs text-cyan-400 font-semibold uppercase mb-1">Judge demo</p>
        <p className="text-sm text-slate-100">{message}</p>
        <button
          type="button"
          onClick={onDismiss}
          className="mt-3 text-xs text-slate-400 hover:text-cyan-300"
        >
          Dismiss guide
        </button>
      </div>
    </div>
  );
}
