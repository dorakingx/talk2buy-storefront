"use client";

import { DemoFlowSteps } from "@/components/DemoFlowSteps";
import { HeroSection } from "@/components/HeroSection";
import { LiveSalesPanel } from "@/components/LiveSalesPanel";
import { ProductCard } from "@/components/ProductCard";
import { VoiceAssistant } from "@/components/VoiceAssistant";
import { WhyItMatters } from "@/components/WhyItMatters";
import { getAllProducts } from "@/lib/products";

export default function HomePage() {
  function handleStartTalking() {
    document.getElementById("voice-assistant")?.scrollIntoView({ behavior: "smooth" });
  }

  const products = getAllProducts();

  return (
    <>
      <HeroSection onStartTalking={handleStartTalking} />
      <DemoFlowSteps />
      <VoiceAssistant id="voice-assistant" />
      <LiveSalesPanel />
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Digital products</h2>
        <p className="text-slate-400 mb-8">
          Curated creator offerings — buy instantly or let the assistant recommend one for you.
        </p>
        <div className="grid sm:grid-cols-2 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      <WhyItMatters />
    </>
  );
}
