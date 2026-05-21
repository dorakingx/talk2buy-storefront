import Link from "next/link";
import {
  dashboardStats,
  recentPurchases,
  generatedAudioLog,
} from "@/lib/mock-data";

export function CreatorDashboard() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Creator Dashboard</h1>
          <p className="text-slate-400 mt-1">Your AI voice storefront at a glance</p>
        </div>
        <Link
          href="/"
          className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          ← Back to storefront
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <MetricCard
          label="Total revenue"
          value={`¥${dashboardStats.totalRevenue.toLocaleString()}`}
        />
        <MetricCard label="Total orders" value={String(dashboardStats.totalOrders)} />
        <MetricCard
          label="Avg order value"
          value={`¥${dashboardStats.avgOrderValue.toLocaleString()}`}
        />
        <MetricCard
          label="Voice messages"
          value={String(dashboardStats.voiceMessagesGenerated)}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card-glow rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-slate-100 mb-4">
            Recent purchases
          </h2>
          <ul className="space-y-3">
            {recentPurchases.map((p) => (
              <li
                key={p.id}
                className="flex justify-between items-start text-sm border-b border-slate-700/50 pb-3 last:border-0"
              >
                <div>
                  <p className="text-slate-200">{p.customer}</p>
                  <p className="text-slate-500">{p.product}</p>
                </div>
                <div className="text-right">
                  <p className="text-cyan-400">¥{p.amount.toLocaleString()}</p>
                  <p className="text-xs text-slate-600">
                    {new Date(p.date).toLocaleDateString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="card-glow rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-slate-100 mb-4">
            Generated audio messages
          </h2>
          <ul className="space-y-3">
            {generatedAudioLog.map((a) => (
              <li
                key={a.id}
                className="text-sm border-b border-slate-700/50 pb-3 last:border-0"
              >
                <p className="text-slate-200">
                  {a.customer} — {a.product}
                </p>
                <p className="text-slate-500 text-xs mt-1 truncate">{a.preview}</p>
                <p className="text-xs text-slate-600 mt-1">
                  {new Date(a.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="card-glow rounded-xl p-5">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className="text-xl font-bold text-slate-100">{value}</p>
    </div>
  );
}
