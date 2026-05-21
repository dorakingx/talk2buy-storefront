import type { VoiceGenerateResponse } from "@/types";
import { VOICE_MSG } from "@/lib/voice-messages";

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

/** Stop audio/TTS only — does not revoke blob URLs (safe before playing a new URL). */
function stopPlaybackOnly(): void {
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

function tryBrowserVoice(
  text: string,
  callbacks: VoicePlaybackCallbacks | undefined,
  errorMessage: string
): VoiceResult {
  const ok = speakWithBrowser(text, callbacks);
  if (ok) {
    callbacks?.onError?.(errorMessage);
    return { url: null, demo: true, usedBrowserFallback: true };
  }
  callbacks?.onError?.(VOICE_MSG.browserUnavailable);
  callbacks?.onEnd?.();
  return { url: null, demo: true };
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
    callbacks?.onError?.(VOICE_MSG.browserUnavailable);
    callbacks?.onEnd?.();
  };
  isPlaying = true;
  window.speechSynthesis.speak(utterance);
  return true;
}

/** Full teardown: stop playback and revoke all object URLs. */
export function stopAllVoice(): void {
  stopPlaybackOnly();
  revokeAllUrls();
}

export function isVoicePlaying(): boolean {
  return isPlaying;
}

export async function playVoiceText(
  text: string,
  callbacks?: VoicePlaybackCallbacks
): Promise<VoiceResult> {
  // 1. Stop previous playback and revoke old URLs before starting a new request.
  if (isPlaying) {
    stopAllVoice();
  }

  // 2. Claim this playback generation.
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

  // 3. Fetch or generate new audio.
  const result = await fetchVoice(text);

  // 4. Abandon if superseded while fetching.
  if (gen !== playbackGeneration) {
    if (result.url) revokeUrl(result.url);
    return result;
  }

  // 5. Play blob URL from ElevenLabs.
  if (result.url) {
    const played = await playAudioUrl(result.url, wrapped, gen);
    if (played) return result;
    if (gen !== playbackGeneration) return result;
    return tryBrowserVoice(text, wrapped, VOICE_MSG.audioPlaybackFailed);
  }

  // 6. Demo / ElevenLabs unavailable — browser fallback.
  if (result.demo) {
    return tryBrowserVoice(text, wrapped, VOICE_MSG.elevenLabsUnavailable);
  }

  wrapped.onError?.(result.message ?? VOICE_MSG.browserUnavailable);
  wrapped.onEnd?.();
  return result;
}

/**
 * Play a blob URL. Does not call stopAllVoice() — only stops the prior element.
 * Revokes this URL after playback ends or errors.
 */
export function playAudioUrl(
  url: string,
  callbacks?: VoicePlaybackCallbacks,
  generation?: number
): Promise<boolean> {
  const gen = generation ?? ++playbackGeneration;

  return new Promise((resolve) => {
    // Stop prior element without revoking URLs in the set (including this one).
    stopPlaybackOnly();
    playbackGeneration = gen;

    const audio = new Audio(url);
    activeAudio = audio;
    isPlaying = true;

    const finish = (errorMsg?: string) => {
      if (gen !== playbackGeneration) {
        resolve(false);
        return;
      }
      isPlaying = false;
      activeAudio = null;
      revokeUrl(url);
      if (errorMsg) callbacks?.onError?.(errorMsg);
      callbacks?.onEnd?.();
      resolve(!errorMsg);
    };

    audio.onplay = () => {
      if (gen === playbackGeneration) callbacks?.onStart?.();
    };
    audio.onended = () => finish();
    audio.onerror = () => finish(VOICE_MSG.audioPlaybackFailed);
    audio.play().catch(() => finish(VOICE_MSG.audioPlaybackFailed));
  });
}
