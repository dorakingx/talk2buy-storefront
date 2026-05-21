import type { VoiceGenerateResponse } from "@/types";

export interface VoiceResult {
  url: string | null;
  demo: boolean;
  message?: string;
  usedBrowserFallback?: boolean;
}

export interface VoicePlaybackCallbacks {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (message: string) => void;
}

const objectUrls = new Set<string>();
let activeAudio: HTMLAudioElement | null = null;
let playbackGeneration = 0;
let isPlaying = false;

function revokeUrl(url: string) {
  if (objectUrls.has(url)) {
    URL.revokeObjectURL(url);
    objectUrls.delete(url);
  }
}

function revokeAllUrls() {
  objectUrls.forEach((url) => URL.revokeObjectURL(url));
  objectUrls.clear();
}

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
    const url = URL.createObjectURL(blob);
    objectUrls.add(url);
    return { url, demo: false };
  }

  return {
    url: null,
    demo: true,
    message: "Voice generation failed.",
  };
}

export function speakWithBrowser(
  text: string,
  callbacks?: VoicePlaybackCallbacks
): boolean {
  if (typeof window === "undefined" || !window.speechSynthesis) return false;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  utterance.pitch = 1;
  utterance.onstart = () => callbacks?.onStart?.();
  utterance.onend = () => {
    isPlaying = false;
    callbacks?.onEnd?.();
  };
  utterance.onerror = () => {
    isPlaying = false;
    callbacks?.onError?.("Browser voice playback failed");
    callbacks?.onEnd?.();
  };
  isPlaying = true;
  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopAllVoice(): void {
  playbackGeneration += 1;
  isPlaying = false;
  if (typeof window !== "undefined") {
    window.speechSynthesis?.cancel();
  }
  if (activeAudio) {
    activeAudio.pause();
    activeAudio.src = "";
    activeAudio = null;
  }
  revokeAllUrls();
}

export function isVoicePlaying(): boolean {
  return isPlaying;
}

export async function playVoiceText(
  text: string,
  callbacks?: VoicePlaybackCallbacks
): Promise<VoiceResult> {
  if (isPlaying) {
    stopAllVoice();
  }

  const gen = ++playbackGeneration;
  const wrapped: VoicePlaybackCallbacks = {
    onStart: () => {
      if (gen === playbackGeneration) callbacks?.onStart?.();
    },
    onEnd: () => {
      if (gen === playbackGeneration) {
        isPlaying = false;
        callbacks?.onEnd?.();
      }
    },
    onError: (msg) => {
      if (gen === playbackGeneration) {
        isPlaying = false;
        callbacks?.onError?.(msg);
        callbacks?.onEnd?.();
      }
    },
  };

  const result = await fetchVoice(text);
  if (gen !== playbackGeneration) return result;

  if (result.url) {
    await playAudioUrl(result.url, wrapped, gen);
    return result;
  }

  if (result.demo) {
    const ok = speakWithBrowser(text, wrapped);
    if (ok) {
      callbacks?.onError?.("Demo voice mode (browser)");
      return { ...result, usedBrowserFallback: true };
    }
    wrapped.onError?.("Voice unavailable — please read the message on screen");
    wrapped.onEnd?.();
    return result;
  }

  wrapped.onError?.(result.message ?? "Voice playback failed");
  wrapped.onEnd?.();
  return result;
}

export function playAudioUrl(
  url: string,
  callbacks?: VoicePlaybackCallbacks,
  generation?: number
): Promise<void> {
  const gen = generation ?? ++playbackGeneration;

  return new Promise((resolve) => {
    stopAllVoice();
    playbackGeneration = gen;

    const audio = new Audio(url);
    activeAudio = audio;
    isPlaying = true;

    const finish = (errorMsg?: string) => {
      if (gen !== playbackGeneration) {
        resolve();
        return;
      }
      isPlaying = false;
      activeAudio = null;
      revokeUrl(url);
      if (errorMsg) callbacks?.onError?.(errorMsg);
      callbacks?.onEnd?.();
      resolve();
    };

    audio.onplay = () => {
      if (gen === playbackGeneration) callbacks?.onStart?.();
    };
    audio.onended = () => finish();
    audio.onerror = () => finish("Audio playback failed");
    audio.play().catch(() => finish("Could not play audio"));
  });
}
