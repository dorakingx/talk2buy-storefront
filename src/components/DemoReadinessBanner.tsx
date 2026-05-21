export function DemoReadinessBanner() {
  return (
    <div className="max-w-6xl mx-auto px-4 pt-3 pb-0">
      <p className="text-center text-xs md:text-sm text-slate-300 glass-card rounded-full py-2 px-4 border border-cyan-500/25">
        <span className="text-cyan-400 font-semibold">Demo-ready:</span> works with real
        ElevenLabs + Stripe keys, or fully in demo mode.
      </p>
    </div>
  );
}
