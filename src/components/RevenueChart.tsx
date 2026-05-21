import { revenueByDay } from "@/lib/mock-data";

export function RevenueChart() {
  const max = Math.max(...revenueByDay.map((d) => d.amount));

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">Revenue (7 days)</h2>
          <p className="text-xs text-slate-500 mt-1">Daily storefront revenue</p>
        </div>
        <span className="text-xs text-emerald-400">+18% trend</span>
      </div>
      <div className="flex items-end justify-between gap-2 h-40">
        {revenueByDay.map((d) => {
          const height = `${(d.amount / max) * 100}%`;
          return (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex items-end justify-center h-32">
                <div
                  className="w-full max-w-[2rem] rounded-t-md bg-gradient-to-t from-cyan-600/80 to-violet-500/80 min-h-[4px] transition-all hover:opacity-90"
                  style={{ height }}
                  title={`¥${d.amount.toLocaleString()}`}
                />
              </div>
              <span className="text-[10px] text-slate-500">{d.day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
