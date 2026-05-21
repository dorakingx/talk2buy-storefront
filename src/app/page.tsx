"use client";

import { useEffect, useRef, useState } from "react";
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
import { setDemoStep } from "@/lib/demo-storage";
import { getAllProducts } from "@/lib/products";

export default function HomePage() {
  const assistantRef = useRef<VoiceAssistantHandle>(null);
  const [judgeGuidePhase, setJudgeGuidePhase] = useState<JudgeGuidePhase>("idle");
  const { showToast } = useToast();
  const autoStartedRef = useRef(false);
  const autoCheckoutRef = useRef(false);

  const autoDemo =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("autoplay") === "1";

  useEffect(() => {
    if (!autoDemo || autoStartedRef.current) return;
    autoStartedRef.current = true;

    const timer = window.setTimeout(() => {
      void assistantRef.current?.runJudgeDemo();
    }, 6500);

    return () => window.clearTimeout(timer);
  }, [autoDemo]);

  useEffect(() => {
    if (!autoDemo || judgeGuidePhase !== "awaiting_checkout" || autoCheckoutRef.current) {
      return;
    }

    autoCheckoutRef.current = true;
    setDemoStep("pay");

    const timer = window.setTimeout(() => {
      const params = new URLSearchParams({
        recording: "1",
        autoplay: "1",
        demo: "1",
        productId: "quantum-audio-guide",
        customerName: "Demo Guest",
        userIntent: "I want to learn quantum computing",
      });
      window.location.href = `/checkout/success?${params.toString()}`;
    }, 6500);

    return () => window.clearTimeout(timer);
  }, [autoDemo, judgeGuidePhase]);

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
        autoDemo={autoDemo}
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
