"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { getGreeting } from "@/lib/assistant";
import { saveDemoContext, setDemoStep, clearDemoContext } from "@/lib/demo-storage";
import { playVoiceText, stopAllVoice } from "@/lib/voice-client";
import type { AssistantResponse, ChatMessage, VoiceOrbState } from "@/types";
import { ChatBubble } from "./ChatBubble";
import { QuickReplies } from "./QuickReplies";
import { RecommendationCard } from "./RecommendationCard";
import { VoiceOrb } from "./VoiceOrb";
import { useToast } from "./Toast";

const JUDGE_DEMO_MESSAGE = "I want to learn quantum computing";

export type JudgeGuidePhase = "idle" | "awaiting_sample" | "awaiting_checkout" | "done";

export interface VoiceAssistantHandle {
  runJudgeDemo: () => Promise<void>;
}

interface VoiceAssistantProps {
  id?: string;
  onJudgeGuidePhase?: (phase: JudgeGuidePhase) => void;
}

export const VoiceAssistant = forwardRef<VoiceAssistantHandle, VoiceAssistantProps>(
  function VoiceAssistant({ id = "voice-assistant", onJudgeGuidePhase }, ref) {
    const [messages, setMessages] = useState<ChatMessage[]>(() => [
      { id: "0", role: "assistant", content: getGreeting() },
    ]);
    const [orbState, setOrbState] = useState<VoiceOrbState>("idle");
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [showQuickReplies, setShowQuickReplies] = useState(true);
    const [lastReply, setLastReply] = useState<string | null>(null);
    const [recommendation, setRecommendation] = useState<AssistantResponse | null>(null);
    const [userIntent, setUserIntent] = useState("");
    const [cardHighlight, setCardHighlight] = useState(false);
    const [matchScore, setMatchScore] = useState(94);
    const [matchSignals, setMatchSignals] = useState<string[]>([]);
    const [expectedOutcome, setExpectedOutcome] = useState<string | undefined>();

    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const pttTranscriptRef = useRef("");
    const introSpokenRef = useRef(false);
    const { showToast } = useToast();

    const speak = useCallback(async (text: string) => {
      await playVoiceText(text, {
        onStart: () => setOrbState("speaking"),
        onEnd: () => setOrbState("idle"),
        onError: (msg) => showToast(msg, "info"),
      });
    }, [showToast]);

    useEffect(() => {
      if (introSpokenRef.current) return;
      introSpokenRef.current = true;
      void speak(getGreeting());
    }, [speak]);

    const sendMessage = useCallback(
      async (text: string) => {
        if (!text.trim() || loading) return;

        setShowQuickReplies(false);
        setUserIntent(text.trim());
        setDemoStep("talk");

        const userMsg: ChatMessage = {
          id: Date.now().toString(),
          role: "user",
          content: text.trim(),
        };
        setMessages((prev) => [...prev.slice(-2), userMsg]);
        setInput("");
        setLoading(true);
        setOrbState("thinking");
        stopAllVoice();

        try {
          const res = await fetch("/api/assistant", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: text.trim() }),
          });
          const data = (await res.json()) as AssistantResponse;
          if (!res.ok) throw new Error("Assistant error");

          const assistantMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: data.reply,
            recommendedProductId: data.recommendedProductId,
            whyItFits: data.whyItFits,
            whatYouGet: data.whatYouGet,
            cta: data.cta,
          };
          setMessages((prev) => [...prev.slice(-2), assistantMsg]);
          setLastReply(data.reply);

          if (data.recommendedProductId) {
            setRecommendation(data);
            setMatchScore(data.matchScore ?? 94);
            setMatchSignals(data.matchSignals ?? []);
            setExpectedOutcome(data.expectedOutcome);
            setDemoStep("recommend");
            saveDemoContext({
              userIntent: text.trim(),
              recommendedProductId: data.recommendedProductId,
              whyItFits: data.whyItFits,
              whatYouGet: data.whatYouGet,
              cta: data.cta,
              matchScore: data.matchScore,
              matchSignals: data.matchSignals,
              expectedOutcome: data.expectedOutcome,
            });
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                onJudgeGuidePhase?.("awaiting_sample");
                document
                  .querySelector('[data-judge-target="hear-sample"]')
                  ?.scrollIntoView({ block: "nearest", behavior: "smooth" });
              });
            });
          }

          await speak(data.reply);
        } catch {
          setOrbState("idle");
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              role: "assistant",
              content: "Sorry, I had trouble responding. Please try again.",
            },
          ]);
        } finally {
          setLoading(false);
        }
      },
      [loading, speak, onJudgeGuidePhase]
    );

    useImperativeHandle(ref, () => ({
      runJudgeDemo: async () => {
        clearDemoContext();
        setRecommendation(null);
        setCardHighlight(false);
        onJudgeGuidePhase?.("idle");
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        await sendMessage(JUDGE_DEMO_MESSAGE);
        setCardHighlight(true);
        setTimeout(() => setCardHighlight(false), 3000);
      },
    }));

    function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      sendMessage(input);
    }

    function startPTT() {
      const SpeechRecognition =
        typeof window !== "undefined" &&
        (window.SpeechRecognition || window.webkitSpeechRecognition);
      if (!SpeechRecognition) {
        showToast(
          "Push-to-talk is not supported in this browser — use quick replies or type your message.",
          "info"
        );
        return;
      }

      stopAllVoice();
      pttTranscriptRef.current = "";
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        pttTranscriptRef.current = transcript;
      };
      recognition.onerror = () => setOrbState("idle");
      recognition.onend = () => setOrbState("idle");

      recognitionRef.current = recognition;
      recognition.start();
      setOrbState("listening");
    }

    function endPTT() {
      recognitionRef.current?.stop();
      recognitionRef.current = null;
      setOrbState("idle");
      const transcript = pttTranscriptRef.current.trim();
      if (transcript) sendMessage(transcript);
    }

    async function replayVoice() {
      if (!lastReply) return;
      await speak(lastReply);
    }

    const visibleMessages = messages.slice(-3);

    return (
      <section id={id} className="max-w-6xl mx-auto px-4 py-12 scroll-mt-24">
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="border-b border-cyan-500/10 px-6 py-4 flex items-center gap-3">
            <span
              className={`w-2 h-2 rounded-full ${
                orbState === "idle" ? "bg-emerald-400" : "bg-cyan-400 animate-pulse"
              }`}
            />
            <h2 className="font-semibold text-slate-100">AI Voice Sales Assistant</h2>
            <span className="text-xs text-slate-500 ml-auto">Voice-first commerce</span>
          </div>

          {visibleMessages.length > 0 && (
            <div className="max-h-28 overflow-y-auto px-4 pt-3 space-y-2">
              {visibleMessages.map((msg) => (
                <ChatBubble key={msg.id} role={msg.role} content={msg.content} />
              ))}
            </div>
          )}

          <VoiceOrb state={loading ? "thinking" : orbState} />

          <QuickReplies
            visible={showQuickReplies && !loading}
            onSelect={(msg) => sendMessage(msg)}
          />

          <div className="flex flex-wrap justify-center gap-3 px-4 pb-4">
            <button
              type="button"
              onPointerDown={startPTT}
              onPointerUp={endPTT}
              onPointerLeave={endPTT}
              disabled={loading}
              className="select-none rounded-2xl px-8 py-4 text-sm font-semibold bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border-2 border-cyan-400/50 text-cyan-300 hover:border-cyan-400 active:scale-95 transition-all disabled:opacity-50"
            >
              {orbState === "listening" ? "Release to send" : "Push to Talk"}
            </button>
            {lastReply && (
              <button
                type="button"
                onClick={replayVoice}
                disabled={loading || orbState === "speaking"}
                className="rounded-xl px-4 py-3 text-sm border border-slate-600 text-slate-400 hover:text-cyan-400 transition-colors disabled:opacity-50"
              >
                Replay assistant voice
              </button>
            )}
          </div>

        {recommendation?.recommendedProductId && (
          <RecommendationCard
            productId={recommendation.recommendedProductId}
            whyItFits={recommendation.whyItFits}
            whatYouGet={recommendation.whatYouGet}
            cta={recommendation.cta}
            matchScore={matchScore}
            matchSignals={matchSignals}
            expectedOutcome={expectedOutcome}
            userIntent={userIntent}
            highlight={cardHighlight}
            onVoiceStateChange={setOrbState}
            onSampleEnded={() => onJudgeGuidePhase?.("awaiting_checkout")}
          />
        )}

          <div className="p-4 border-t border-cyan-500/10">
            <p className="text-xs text-slate-500 mb-2 text-center">Text fallback</p>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type what you're looking for…"
                className="flex-1 rounded-xl bg-slate-900/80 border border-slate-700 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="btn-neon rounded-xl px-5 py-2.5 text-sm"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </section>
    );
  }
);
