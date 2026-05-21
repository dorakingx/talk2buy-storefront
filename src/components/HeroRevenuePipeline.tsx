const STEPS = [
  { label: "Visitor intent", icon: "💬" },
  { label: "AI voice recommendation", icon: "🎯" },
  { label: "ElevenLabs preview", icon: "🔊", badge: "ElevenLabs" },
  { label: "Stripe checkout", icon: "💳", badge: "Stripe" },
  { label: "Personal audio", icon: "✨", badge: "ElevenLabs" },
  { label: "Creator revenue", icon: "📈" },
];

export function HeroRevenuePipeline() {
  return (
    <div className="mt-10 max-w-5xl mx-auto">
      <p className="text-xs text-slate-500 uppercase tracking-wider mb-4 text-center">
        Conversation → Revenue in one flow
      </p>
      <div className="glass-card rounded-2xl p-4 md:p-6 overflow-x-auto">
        <div className="flex items-stretch gap-2 md:gap-1 min-w-[640px] md:min-w-0">
          {STEPS.map((step, i) => (
            <div key={step.label} className="flex items-center flex-1 min-w-0">
              <div
                className={`flex-1 text-center px-2 py-3 rounded-xl border transition-all pipeline-step ${
                  i >= 1 && i <= 3 ? "pipeline-step-active border-cyan-500/30" : "border-slate-700/50"
                }`}
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <span className="text-lg block mb-1">{step.icon}</span>
                <p className="text-[10px] md:text-xs text-slate-200 font-medium leading-tight">
                  {step.label}
                </p>
                {step.badge && (
                  <span className="text-[9px] mt-1 inline-block px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400/90 border border-cyan-500/20">
                    {step.badge}
                  </span>
                )}
              </div>
              {i < STEPS.length - 1 && (
                <span className="text-slate-600 px-1 shrink-0 hidden sm:inline">→</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
