"use client";

import Link from "next/link";
import { HeroRevenuePipeline } from "./HeroRevenuePipeline";
import { JudgeModeButton } from "./JudgeModeButton";

interface HeroSectionProps {
  onStartTalking: () => void;
  onRunJudgeDemo?: () => void;
}

export function HeroSection({ onStartTalking, onRunJudgeDemo }: HeroSectionProps) {
  return (
    <section id="hero" className="gradient-hero py-10 md:py-16 px-4 scroll-mt-20">
      <div className="max-w-5xl mx-auto text-center animate-fade-in">
        <p className="text-cyan-400 text-sm font-medium tracking-wider uppercase mb-2">
          ElevenLabs x Stripe Hackathon · Talk2Buy
        </p>
        <p className="text-lg md:text-xl font-semibold text-slate-100 mb-3 max-w-2xl mx-auto">
          Talk2Buy turns voice conversations into revenue.
        </p>

        <HeroRevenuePipeline />

        <h1 className="text-xl md:text-3xl lg:text-4xl font-bold mb-3 leading-tight text-slate-100">
          AI voice storefront with{" "}
          <span className="text-gradient">ElevenLabs previews</span> and{" "}
          <span className="text-gradient">Stripe checkout</span>
        </h1>
        <p className="text-sm text-violet-400/90 mb-6 italic max-w-xl mx-auto">
          Voice is not just content. Voice is the sales interface.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            type="button"
            onClick={onStartTalking}
            className="btn-neon rounded-2xl px-8 py-3.5 text-base"
          >
            Try the voice demo
          </button>
          <Link
            href="/dashboard"
            className="rounded-2xl px-8 py-3.5 text-base border border-slate-600 text-slate-200 hover:border-cyan-500/50 hover:text-cyan-300 transition-all text-center"
          >
            View creator dashboard
          </Link>
          {onRunJudgeDemo && <JudgeModeButton onRun={onRunJudgeDemo} />}
        </div>
        {onRunJudgeDemo && (
          <p className="mt-4 text-sm text-slate-500 flex flex-col sm:flex-row gap-2 justify-center items-center">
            <span>
              Judges:{" "}
              <button
                type="button"
                onClick={onRunJudgeDemo}
                className="text-fuchsia-400/90 hover:text-fuchsia-300 underline-offset-2 hover:underline"
              >
                run the guided demo
              </button>
            </span>
            <span className="hidden sm:inline text-slate-700">·</span>
            <Link
              href="/?recording=1"
              className="text-slate-500 hover:text-violet-300 text-xs"
            >
              Record demo (?recording=1)
            </Link>
          </p>
        )}
      </div>
    </section>
  );
}
