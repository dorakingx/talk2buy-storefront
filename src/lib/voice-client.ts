import type { VoiceGenerateResponse } from "@/types";

export interface VoiceResult {
  url: string | null;
  demo: boolean;
  message?: string;
  usedBrowserFallback?: boolean;
}

let activeAudio: HTMLAudioElement | null = null;

export async function fetchVoice(text: string): Promise<VoiceResult> {
  const res = await fetch("/api/generate-voice", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const data = (await res.json()) as VoiceGenerateResponse;
    return {
      url: null,
      demo: !!data.demo,
      message: data.message,
    };
  }

  if (res.ok) {
    const blob = await res.blob();
    return { url: URL.createObjectURL(blob), demo: false };
  }

  return {
    url: null,
    demo: true,
    message: "Voice generation failed.",
  };
}

export function speakWithBrowser(
  text: string,
  callbacks?: { onStart?: () => void; onEnd?: () => void }
): boolean {
  if (typeof window === "undefined" || !window.speechSynthesis) return false;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  utterance.pitch = 1;
  utterance.onstart = () => callbacks?.onStart?.();
  utterance.onend = () => callbacks?.onEnd?.();
  utterance.onerror = () => callbacks?.onEnd?.();
  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopAllVoice(): void {
  if (typeof window !== "undefined") {
    window.speechSynthesis?.cancel();
  }
  if (activeAudio) {
    activeAudio.pause();
    activeAudio = null;
  }
}

export async function playVoiceText(
  text: string,
  callbacks?: { onStart?: () => void; onEnd?: () => void }
): Promise<VoiceResult> {
  stopAllVoice();
  const result = await fetchVoice(text);

  if (result.url) {
    await playAudioUrl(result.url, callbacks);
    return result;
  }

  if (result.demo) {
    const ok = speakWithBrowser(text, {
      onStart: callbacks?.onStart,
      onEnd: () => {
        callbacks?.onEnd?.();
      },
    });
    return { ...result, usedBrowserFallback: ok };
  }

  callbacks?.onEnd?.();
  return result;
}

export function playAudioUrl(
  url: string,
  callbacks?: { onStart?: () => void; onEnd?: () => void }
): Promise<void> {
  return new Promise((resolve) => {
    stopAllVoice();
    const audio = new Audio(url);
    activeAudio = audio;
    audio.onplay = () => callbacks?.onStart?.();
    audio.onended = () => {
      activeAudio = null;
      callbacks?.onEnd?.();
      resolve();
    };
    audio.onerror = () => {
      activeAudio = null;
      callbacks?.onEnd?.();
      resolve();
    };
    audio.play().catch(() => {
      callbacks?.onEnd?.();
      resolve();
    });
  });
}
