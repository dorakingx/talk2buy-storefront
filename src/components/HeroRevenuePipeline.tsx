const STEPS = [
  { label: "Visitor Intent", icon: "💬" },
  { label: "AI Voice Recommendation", icon: "🎯" },
  { label: "ElevenLabs Preview", icon: "🔊", badge: "ElevenLabs" },
  { label: "Stripe Checkout", icon: "💳", badge: "Stripe" },
  { label: "Personal Audio", icon: "✨", badge: "ElevenLabs" },
  { label: "Creator Revenue", icon: "📈" },
];

export function HeroRevenuePipeline() {
  return (
    <div className="mb-8 max-w-5xl mx-auto">
      <p className="text-[10px] md:text-xs text-slate-500 uppercase tracking-wider mb-3 text-center">
        Conversation → Revenue in one flow
      </p>
      <div className="glass-card rounded-2xl p-3 md:p-5 overflow-x-auto">
        <div className="flex items-stretch gap-1.5 md:gap-1 min-w-[560px] md:min-w-0">
          {STEPS.map((step, i) => (
            <div key={step.label} className="flex items-center flex-1 min-w-0">
              <div
                className={`flex-1 text-center px-1.5 py-2 md:py-3 rounded-xl border transition-all pipeline-step ${
                  i >= 1 && i <= 3 ? "pipeline-step-active border-cyan-500/30" : "border-slate-700/50"
                }`}
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <span className="text-base md:text-lg block mb-0.5">{step.icon}</span>
                <p className="text-[9px] md:text-[10px] text-slate-200 font-medium leading-tight">
                  {step.label}
                </p>
                {step.badge && (
                  <span className="text-[8px] md:text-[9px] mt-0.5 inline-block px-1 py-0.5 rounded bg-slate-800 text-cyan-400/90 border border-cyan-500/20">
                    {step.badge}
                  </span>
                )}
              </div>
              {i < STEPS.length - 1 && (
                <span className="text-slate-600 px-0.5 shrink-0 hidden sm:inline text-xs">→</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
