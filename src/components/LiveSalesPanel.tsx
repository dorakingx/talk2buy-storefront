import { liveSalesStats } from "@/lib/mock-data";

export function LiveSalesPanel() {
  const { revenueToday, conversionRate, conversionDelta, voiceInteractions, purchasedProducts } =
    liveSalesStats;

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-sm font-medium text-cyan-400 uppercase tracking-wider mb-4">
          Live sales
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard label="Revenue today" value={`¥${revenueToday.toLocaleString()}`} />
          <StatCard label="Conversion rate" value={`${conversionRate}%`} sub={conversionDelta} />
          <StatCard label="Voice interactions" value={String(voiceInteractions)} />
          <StatCard label="Orders today" value={String(purchasedProducts.reduce((s, p) => s + p.count, 0))} />
        </div>
        <div>
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
    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className="text-lg font-semibold text-slate-100">{value}</p>
      {sub && <p className="text-[10px] text-emerald-400/80 mt-1">{sub}</p>}
    </div>
  );
}
