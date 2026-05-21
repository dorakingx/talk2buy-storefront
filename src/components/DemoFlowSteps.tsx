const STEPS = [
  { step: 1, title: "Talk", desc: "Visitor speaks with the AI voice assistant" },
  { step: 2, title: "Recommend", desc: "AI picks the best product for their intent" },
  { step: 3, title: "Hear sample", desc: "ElevenLabs preview brings the product to life" },
  { step: 4, title: "Pay", desc: "Stripe Checkout turns conversation into revenue" },
  { step: 5, title: "Thank you", desc: "Personalized AI audio after purchase" },
];

export function DemoFlowSteps() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <h2 className="text-2xl font-bold text-slate-100 text-center mb-2">
        How it works in 30 seconds
      </h2>
      <p className="text-slate-500 text-center mb-10 text-sm">
        The full voice commerce loop — built for creators
      </p>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {STEPS.map((s) => (
          <div
            key={s.step}
            className="glass-card rounded-xl p-4 text-center hover:border-cyan-500/30 transition-colors"
          >
            <span className="inline-flex w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 text-sm font-bold items-center justify-center mb-3">
              {s.step}
            </span>
            <h3 className="font-semibold text-slate-100 text-sm">{s.title}</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
