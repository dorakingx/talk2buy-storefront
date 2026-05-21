"use client";

import { useRef, useState } from "react";
import { DemoFlowSteps } from "@/components/DemoFlowSteps";
import { DemoReadinessBanner } from "@/components/DemoReadinessBanner";
import { HeroSection } from "@/components/HeroSection";
import { JudgeDemoGuide } from "@/components/JudgeDemoGuide";
import { LiveSalesPanel } from "@/components/LiveSalesPanel";
import { ProductCard } from "@/components/ProductCard";
import { VoiceCommerceAnalytics } from "@/components/VoiceCommerceAnalytics";
import {
  VoiceAssistant,
  type VoiceAssistantHandle,
  type JudgeGuidePhase,
} from "@/components/VoiceAssistant";
import { useToast } from "@/components/Toast";
import { WhyItMatters } from "@/components/WhyItMatters";
import { ConversationFunnel } from "@/components/ConversationFunnel";
import { getAllProducts } from "@/lib/products";

export default function HomePage() {
  const assistantRef = useRef<VoiceAssistantHandle>(null);
  const [judgeGuidePhase, setJudgeGuidePhase] = useState<JudgeGuidePhase>("idle");
  const { showToast } = useToast();

  function handleStartTalking() {
    document.getElementById("voice-assistant")?.scrollIntoView({ behavior: "smooth" });
  }

  function handleRunJudgeDemo() {
    void assistantRef.current?.runJudgeDemo();
  }

  function handleDismissJudgeGuide() {
    if (judgeGuidePhase === "awaiting_sample") {
      setJudgeGuidePhase("awaiting_checkout");
      return;
    }
    setJudgeGuidePhase("done");
    showToast("Continue to checkout when ready", "info");
  }

  const products = getAllProducts();

  return (
    <>
      <DemoReadinessBanner />
      <HeroSection
        onStartTalking={handleStartTalking}
        onRunJudgeDemo={handleRunJudgeDemo}
      />
      <DemoFlowSteps />
      <VoiceAssistant
        ref={assistantRef}
        id="voice-assistant"
        onJudgeGuidePhase={setJudgeGuidePhase}
      />
      <JudgeDemoGuide phase={judgeGuidePhase} onDismiss={handleDismissJudgeGuide} />
      <LiveSalesPanel />
      <VoiceCommerceAnalytics />
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
      <ConversationFunnel />
    </>
  );
}
