"use client";

import { useEffect, useRef, useState } from "react";
import type { JudgeGuidePhase } from "./VoiceAssistant";

interface JudgeDemoGuideProps {
  phase: JudgeGuidePhase;
  onDismiss: () => void;
}

const CALLOUT_HEIGHT_ESTIMATE = 120;

export function JudgeDemoGuide({ phase, onDismiss }: JudgeDemoGuideProps) {
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const calloutRef = useRef<HTMLDivElement>(null);
  const [calloutHeight, setCalloutHeight] = useState(CALLOUT_HEIGHT_ESTIMATE);

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
        el.scrollIntoView({ block: "nearest", behavior: "smooth" });
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

  useEffect(() => {
    if (calloutRef.current) {
      setCalloutHeight(calloutRef.current.offsetHeight);
    }
  }, [phase, targetRect]);

  if (phase === "idle" || phase === "done") return null;

  const message =
    phase === "awaiting_sample"
      ? "Step 3: Tap Hear sample — ElevenLabs generates a personalized voice preview"
      : "Step 4: Tap Buy with Stripe — turn the conversation into revenue";

  let top = displayRect ? displayRect.bottom + 12 : 200;
  if (displayRect && typeof window !== "undefined") {
    const belowBottom = displayRect.bottom + 12 + calloutHeight > window.innerHeight - 16;
    if (belowBottom) {
      top = Math.max(16, displayRect.top - calloutHeight - 12);
    }
  }

  const left = displayRect
    ? Math.min(Math.max(displayRect.left, 16), window.innerWidth - 296)
    : 16;

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none">
      <div
        className="absolute inset-0 bg-slate-950/50 pointer-events-none"
        aria-hidden
      />
      {displayRect && (
        <div
          className="absolute rounded-xl ring-2 ring-cyan-400 ring-offset-2 ring-offset-transparent pointer-events-none z-[201]"
          style={{
            top: displayRect.top - 4,
            left: displayRect.left - 4,
            width: displayRect.width + 8,
            height: displayRect.height + 8,
          }}
        />
      )}
      <div
        ref={calloutRef}
        className="absolute pointer-events-auto max-w-[min(280px,calc(100vw-32px))] glass-card rounded-xl p-4 border-cyan-400/50 shadow-xl z-[202]"
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
