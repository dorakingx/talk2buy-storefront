const POINTS = [
  {
    title: "Creators struggle to convert",
    body: "Visitors browse but leave without understanding why a product is right for them.",
  },
  {
    title: "Static stores lack personality",
    body: "Product pages don't explain value in a human, conversational way.",
  },
  {
    title: "Voice AI feels human",
    body: "A living sales assistant builds trust and guides buyers in real time.",
  },
  {
    title: "Stripe closes the loop",
    body: "Recommendations turn into instant revenue with one-tap checkout.",
  },
  {
    title: "ElevenLabs brings the store alive",
    body: "Samples, replies, and thank-you messages make commerce memorable.",
  },
];

export function WhyItMatters() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <h2 className="text-2xl font-bold text-gradient text-center mb-10">
        Why this matters
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {POINTS.map((p) => (
          <article
            key={p.title}
            className="glass-card rounded-xl p-5 hover:border-violet-500/25 transition-colors"
          >
            <h3 className="font-semibold text-slate-100 mb-2">{p.title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{p.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
