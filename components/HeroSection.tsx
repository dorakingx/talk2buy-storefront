"use client";

interface HeroSectionProps {
  onStartTalking: () => void;
}

export function HeroSection({ onStartTalking }: HeroSectionProps) {
  return (
    <section className="gradient-hero py-20 md:py-28 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-cyan-400 text-sm font-medium tracking-wider uppercase mb-4">
          AI Voice Commerce
        </p>
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          <span className="text-gradient">Talk-to-Buy</span>
          <br />
          <span className="text-slate-100">Storefront</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-4">
          Voice is not just content anymore. It is a sales interface.
        </p>
        <p className="text-slate-500 max-w-xl mx-auto mb-10">
          Talk with an AI shop assistant, discover digital products, pay via Stripe,
          and receive a personalized voice thank-you after purchase.
        </p>
        <button
          type="button"
          onClick={onStartTalking}
          className="btn-neon rounded-2xl px-8 py-3.5 text-base"
        >
          Start talking
        </button>
      </div>
    </section>
  );
}
