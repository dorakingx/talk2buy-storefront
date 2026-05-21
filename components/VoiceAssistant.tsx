"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getGreeting } from "@/lib/assistant";
import { getProductById } from "@/lib/products";
import type { ChatMessage } from "@/types";
import { ChatBubble } from "./ChatBubble";
import { CheckoutButton } from "./CheckoutButton";
import { AudioPlayer } from "./AudioPlayer";

interface VoiceAssistantProps {
  id?: string;
}

export function VoiceAssistant({ id = "voice-assistant" }: VoiceAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "0", role: "assistant", content: getGreeting() },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [voiceLoading, setVoiceLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState(false);
  const [listening, setListening] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const playVoice = useCallback(async (text: string) => {
    setVoiceLoading(true);
    setAudioUrl(null);
    setDemoMode(false);
    try {
      const res = await fetch("/api/generate-voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const contentType = res.headers.get("content-type") ?? "";
      if (contentType.includes("application/json")) {
        const data = await res.json();
        if (data.demo) {
          setDemoMode(true);
        }
      } else if (res.ok) {
        const blob = await res.blob();
        setAudioUrl(URL.createObjectURL(blob));
      }
    } finally {
      setVoiceLoading(false);
    }
  }, []);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Assistant error");

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reply,
        recommendedProductId: data.recommendedProductId,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      await playVoice(data.reply);
    } catch {
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
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  function startListening() {
    const SpeechRecognition =
      typeof window !== "undefined" &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0]?.[0]?.transcript;
      if (transcript) {
        setInput(transcript);
        sendMessage(transcript);
      }
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }

  const lastRecommended = [...messages]
    .reverse()
    .find((m) => m.role === "assistant" && m.recommendedProductId);

  return (
    <section id={id} className="max-w-6xl mx-auto px-4 py-12 scroll-mt-24">
      <div className="card-glow rounded-2xl overflow-hidden">
        <div className="border-b border-cyan-500/10 px-6 py-4 flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <h2 className="font-semibold text-slate-100">AI Shop Assistant</h2>
          <span className="text-xs text-slate-500 ml-auto">Voice + text</span>
        </div>

        <div className="h-80 overflow-y-auto p-4 space-y-3 bg-slate-950/50">
          {messages.map((msg) => (
            <ChatBubble key={msg.id} role={msg.role} content={msg.content} />
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl px-4 py-2 bg-slate-800/80 text-slate-400 text-sm">
                Thinking…
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {lastRecommended?.recommendedProductId && (
          <div className="px-4 py-3 border-t border-violet-500/10 bg-violet-500/5 flex flex-wrap items-center gap-3">
            <span className="text-sm text-slate-300">
              Recommended: {getProductById(lastRecommended.recommendedProductId)?.name}
            </span>
            <CheckoutButton
              productId={lastRecommended.recommendedProductId}
              label="Purchase recommended product"
            />
          </div>
        )}

        <div className="p-4 border-t border-cyan-500/10 space-y-3">
          <AudioPlayer
            audioUrl={audioUrl}
            demoMode={demoMode}
            loading={voiceLoading}
          />
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tell me what you're looking for…"
              className="flex-1 rounded-xl bg-slate-900 border border-slate-700 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50"
              disabled={loading}
            />
            <button
              type="button"
              onClick={startListening}
              disabled={loading || listening}
              title="Voice input (optional)"
              className="rounded-xl px-3 py-2 border border-slate-600 text-slate-400 hover:border-cyan-500/50 hover:text-cyan-400 transition-colors disabled:opacity-50"
            >
              {listening ? "…" : "🎤"}
            </button>
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
