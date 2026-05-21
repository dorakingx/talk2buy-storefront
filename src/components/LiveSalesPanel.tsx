import { liveSalesStats, funnelMetrics } from "@/lib/mock-data";

export function LiveSalesPanel() {
  const { revenueToday, conversionRate, conversionDelta, purchasedProducts } =
    liveSalesStats;

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-sm font-medium text-cyan-400 uppercase tracking-wider mb-1">
          Live voice commerce
        </h2>
        <p className="text-sm text-slate-400 mb-6 italic">
          Voice previews convert passive visitors into confident buyers.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <StatCard label="Voice conversations" value={String(funnelMetrics.voiceConversationsToday)} />
          <StatCard label="Recommendations" value={String(funnelMetrics.recommendationsGenerated)} />
          <StatCard label="Voice preview plays" value={String(funnelMetrics.voicePreviewPlays)} />
          <StatCard label="Checkout starts" value={String(funnelMetrics.stripeCheckoutStarts)} />
          <StatCard label="Purchases" value={String(funnelMetrics.purchasesCompleted)} />
          <StatCard label="Conv. lift" value={funnelMetrics.estimatedConversionLift} sub="estimated" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t border-slate-700/50 pt-6">
          <StatCard label="Revenue today" value={`¥${revenueToday.toLocaleString()}`} />
          <StatCard label="Conversion rate" value={`${conversionRate}%`} sub={conversionDelta} />
          <StatCard
            label="Orders today"
            value={String(purchasedProducts.reduce((s, p) => s + p.count, 0))}
          />
        </div>

        <div className="mt-6">
          <p className="text-xs text-slate-500 mb-2">Top products today</p>
          <ul className="space-y-1">
            {purchasedProducts.map((p) => (
              <li key={p.name} className="text-sm text-slate-300 flex justify-between">
                <span>{p.name}</span>
                <span className="text-cyan-400">{p.count} sold</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-700/50">
      <p className="text-[10px] text-slate-500 mb-1">{label}</p>
      <p className="text-base font-semibold text-slate-100">{value}</p>
      {sub && <p className="text-[10px] text-emerald-400/80 mt-0.5">{sub}</p>}
    </div>
  );
}
