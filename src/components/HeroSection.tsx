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
    <section id="hero" className="gradient-hero py-14 md:py-20 px-4 scroll-mt-20">
      <div className="max-w-5xl mx-auto text-center animate-fade-in">
        <p className="text-cyan-400 text-sm font-medium tracking-wider uppercase mb-3">
          ElevenLabs x Stripe Hackathon · Talk2Buy
        </p>
        <p className="text-lg md:text-xl font-semibold text-slate-100 mb-4 max-w-2xl mx-auto">
          Talk2Buy turns voice conversations into revenue.
        </p>

        <HeroRevenuePipeline />

        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight text-slate-100">
          An <span className="text-gradient">AI voice storefront</span> that sells while
          customers talk.
        </h1>
        <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto mb-2">
          ElevenLabs-powered recommendations and previews, Stripe-powered checkout, and
          personalized audio that closes the loop.
        </p>
        <p className="text-sm text-violet-400/90 mb-8 italic">
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
          <p className="mt-4 text-sm text-slate-500">
            Judges:{" "}
            <button
              type="button"
              onClick={onRunJudgeDemo}
              className="text-fuchsia-400/90 hover:text-fuchsia-300 underline-offset-2 hover:underline"
            >
              run the guided demo
            </button>
          </p>
        )}
      </div>
    </section>
  );
}
