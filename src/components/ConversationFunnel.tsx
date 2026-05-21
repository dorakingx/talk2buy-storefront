const FUNNEL = [
  { label: "Visitor opens page", icon: "1" },
  { label: "Voice conversation starts", icon: "2" },
  { label: "AI recommends product", icon: "3" },
  { label: "Voice preview builds trust", badge: "ElevenLabs" },
  { label: "Stripe converts purchase", badge: "Stripe" },
  { label: "Personalized audio delights", icon: "6" },
];

export function ConversationFunnel() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <h2 className="text-2xl font-bold text-gradient text-center mb-2">
        From conversation to revenue
      </h2>
      <p className="text-slate-500 text-center text-sm mb-10 max-w-xl mx-auto">
        A voice-first funnel that connects ElevenLabs engagement with Stripe revenue.
      </p>
      <div className="glass-card rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {FUNNEL.map((step, i) => (
            <div key={step.label} className="flex md:flex-col items-center gap-3 md:flex-1 md:text-center">
              <div className="flex items-center gap-3 md:flex-col">
                <span className="w-10 h-10 rounded-full bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-sm font-bold text-cyan-400 shrink-0">
                  {step.icon ?? i + 1}
                </span>
                <div>
                  <p className="text-sm text-slate-200 font-medium">{step.label}</p>
                  {step.badge && (
                    <span className="text-[10px] mt-1 inline-block px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {step.badge}
                    </span>
                  )}
                </div>
              </div>
              {i < FUNNEL.length - 1 && (
                <span className="hidden md:block text-slate-600 text-lg">→</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
