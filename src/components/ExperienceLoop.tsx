import { getProductById } from "@/lib/products";
import type { DemoContext } from "@/lib/demo-storage";

interface ExperienceLoopProps {
  ctx: DemoContext | null;
  productName?: string;
  thankYouGenerated?: boolean;
}

export function ExperienceLoop({
  ctx,
  productName,
  thankYouGenerated = true,
}: ExperienceLoopProps) {
  const product = ctx?.recommendedProductId
    ? getProductById(ctx.recommendedProductId)
    : undefined;
  const name = productName ?? product?.name ?? "Your product";

  const steps = [
    {
      label: "Original intent",
      value: ctx?.userIntent || "Explored the storefront",
      done: !!ctx?.userIntent,
    },
    {
      label: "Recommended product",
      value: name,
      done: !!ctx?.recommendedProductId || !!productName,
    },
    {
      label: "Voice preview played",
      value: ctx?.voicePreviewPlayed ? "Personalized ElevenLabs preview" : "Skipped in this session",
      done: !!ctx?.voicePreviewPlayed,
    },
    {
      label: "Purchase completed",
      value: "Stripe checkout confirmed",
      done: true,
    },
    {
      label: "Personal audio generated",
      value: thankYouGenerated ? "Thank-you message ready" : "Generating…",
      done: thankYouGenerated,
    },
  ];

  return (
    <section className="glass-card rounded-2xl p-6 mb-8 text-left">
      <h2 className="text-lg font-semibold text-gradient mb-1">
        Your conversation became a product experience
      </h2>
      <p className="text-sm text-slate-400 mb-6">
        Talk2Buy turns voice conversations into revenue — here is your full loop.
      </p>
      <ol className="space-y-4">
        {steps.map((s, i) => (
          <li key={s.label} className="flex gap-4">
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 ${
                s.done
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                  : "bg-slate-800 text-slate-500 border border-slate-700"
              }`}
            >
              {s.done ? "✓" : i + 1}
            </span>
            <div>
              <p className="text-sm font-medium text-slate-200">{s.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{s.value}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
