"use client";

import Link from "next/link";

interface HeroSectionProps {
  onStartTalking: () => void;
}

export function HeroSection({ onStartTalking }: HeroSectionProps) {
  return (
    <section className="gradient-hero py-20 md:py-28 px-4">
      <div className="max-w-4xl mx-auto text-center animate-fade-in">
        <p className="text-cyan-400 text-sm font-medium tracking-wider uppercase mb-4">
          AI Voice Commerce · ElevenLabs + Stripe
        </p>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-slate-100">
          Turn conversations into sales with an{" "}
          <span className="text-gradient">AI voice storefront</span>.
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
          An ElevenLabs-powered sales assistant that recommends products, speaks
          to customers, and drives purchases through Stripe.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
        </div>
      </div>
    </section>
  );
}
