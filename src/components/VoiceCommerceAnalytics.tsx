import { voiceCommerceAnalytics } from "@/lib/mock-data";

export function VoiceCommerceAnalytics() {
  const m = voiceCommerceAnalytics;

  const cards = [
    { label: "Voice preview plays", value: String(m.voicePreviewPlays) },
    { label: "Checkout starts", value: String(m.checkoutStarts) },
    { label: "Purchases completed", value: String(m.purchasesCompleted) },
    { label: "Conversion lift", value: m.estimatedConversionLift },
    {
      label: "Revenue influenced by voice",
      value: `¥${m.revenueInfluencedByVoice.toLocaleString()}`,
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <div className="flex flex-wrap items-center gap-3 mb-2">
        <h2 className="text-2xl font-bold text-slate-100">Voice commerce analytics</h2>
        <span className="text-[10px] px-2 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
          Demo analytics
        </span>
      </div>
      <p className="text-slate-400 mb-8 italic">
        Every voice preview is a measurable step toward purchase.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="glass-card rounded-xl p-5 relative overflow-hidden">
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500/40 to-violet-500/40" />
            <p className="text-xs text-slate-500 mb-2">{c.label}</p>
            <p className="text-xl font-bold text-slate-100">{c.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
