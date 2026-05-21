import { conversionFunnel, funnelInsight } from "@/lib/mock-data";

export function ConversionFunnelViz() {
  const max = conversionFunnel[0]?.count ?? 1;

  return (
    <div className="glass-card rounded-2xl p-6 mb-8">
      <div className="flex flex-wrap items-center gap-2 mb-1">
        <h2 className="text-lg font-semibold text-slate-100">Conversion funnel</h2>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
          Demo analytics
        </span>
      </div>
      <p className="text-sm text-slate-400 mb-6">
        Step-by-step voice commerce conversion (demo scenario)
      </p>

      <div className="space-y-3">
        {conversionFunnel.map((step, i) => {
          const prev = i > 0 ? conversionFunnel[i - 1].count : null;
          const pct =
            prev && prev > 0 ? Math.round((step.count / prev) * 100) : null;
          const width = Math.max(8, (step.count / max) * 100);

          return (
            <div key={step.label} className="flex items-center gap-4">
              <div className="w-40 shrink-0 text-sm text-slate-300">{step.label}</div>
              <div className="flex-1 h-8 bg-slate-900/80 rounded-lg overflow-hidden relative">
                <div
                  className="h-full bg-gradient-to-r from-cyan-600/70 to-violet-600/70 rounded-lg transition-all"
                  style={{ width: `${width}%` }}
                />
                <span className="absolute inset-0 flex items-center px-3 text-xs font-semibold text-slate-100">
                  {step.count}
                </span>
              </div>
              {pct !== null && (
                <span className="text-xs text-emerald-400/90 w-12 text-right">{pct}%</span>
              )}
              {pct === null && <span className="w-12" />}
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 rounded-xl bg-violet-500/10 border border-violet-500/25">
        <p className="text-xs text-violet-400 font-semibold uppercase mb-1">Demo insight</p>
        <p className="text-sm text-slate-300">{funnelInsight}</p>
      </div>
    </div>
  );
}
