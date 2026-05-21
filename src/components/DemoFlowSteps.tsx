"use client";

import { useDemoFlow } from "@/hooks/useDemoFlow";
import type { DemoStep } from "@/lib/demo-storage";

const STEPS: { id: DemoStep; title: string; desc: string }[] = [
  { id: "talk", title: "Talk", desc: "Visitor speaks with the AI assistant" },
  { id: "recommend", title: "Recommend", desc: "AI picks the best product" },
  { id: "hear_sample", title: "Hear sample", desc: "ElevenLabs voice preview" },
  { id: "pay", title: "Pay with Stripe", desc: "Checkout converts intent to revenue" },
  { id: "thank_you", title: "Personal audio", desc: "Thank-you message after purchase" },
];

export function DemoFlowSteps() {
  const { activeStep, completedSteps } = useDemoFlow();

  return (
    <section className="max-w-6xl mx-auto px-4 py-8 sticky top-16 z-40">
      <div className="glass-card rounded-2xl p-4 md:p-6">
        <h2 className="text-sm font-medium text-cyan-400 uppercase tracking-wider mb-1 text-center">
          Live demo progress
        </h2>
        <p className="text-xs text-slate-500 text-center mb-4">
          Voice is not just content. Voice is the sales interface.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-3">
          {STEPS.map((s) => {
            const isActive = activeStep === s.id;
            const isCompleted = completedSteps.includes(s.id);

            return (
              <div
                key={s.id}
                className={`rounded-xl p-3 text-center transition-all duration-300 border ${
                  isActive
                    ? "border-cyan-400/60 bg-cyan-500/10 shadow-[0_0_24px_rgba(34,211,238,0.15)] animate-pulse"
                    : isCompleted
                      ? "border-emerald-500/40 bg-emerald-500/5"
                      : "border-slate-700/50 bg-slate-900/30 opacity-60"
                }`}
              >
                <span
                  className={`inline-flex w-7 h-7 rounded-full text-xs font-bold items-center justify-center mb-2 ${
                    isActive
                      ? "bg-cyan-500/30 text-cyan-300"
                      : isCompleted
                        ? "bg-emerald-500/30 text-emerald-400"
                        : "bg-slate-800 text-slate-500"
                  }`}
                >
                  {isCompleted && !isActive ? "✓" : STEPS.indexOf(s) + 1}
                </span>
                <h3
                  className={`font-semibold text-xs ${
                    isActive ? "text-cyan-200" : isCompleted ? "text-slate-200" : "text-slate-500"
                  }`}
                >
                  {s.title}
                </h3>
                <p className="text-[10px] text-slate-500 mt-1 leading-snug hidden md:block">
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
