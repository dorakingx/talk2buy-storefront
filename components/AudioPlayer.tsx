"use client";

import { useRef, useState } from "react";

interface AudioPlayerProps {
  audioUrl?: string | null;
  demoMode?: boolean;
  demoMessage?: string;
  loading?: boolean;
}

export function AudioPlayer({
  audioUrl,
  demoMode = false,
  demoMessage = "Voice generation is running in demo mode.",
  loading = false,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play();
      setPlaying(true);
    }
  }

  if (loading) {
    return (
      <div className="card-glow rounded-xl p-4 animate-pulse">
        <p className="text-sm text-slate-400">Generating your personalized voice message…</p>
      </div>
    );
  }

  if (demoMode) {
    return (
      <div className="card-glow rounded-xl p-4 border-amber-500/30">
        <p className="text-sm text-amber-200/90">{demoMessage}</p>
        <p className="text-xs text-slate-500 mt-2">
          Add ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID to enable real voice generation.
        </p>
      </div>
    );
  }

  if (!audioUrl) return null;

  return (
    <div key={audioUrl} className="card-glow rounded-xl p-4">
      <p className="text-sm text-slate-400 mb-3">Your personalized thank-you message</p>
      <audio
        key={audioUrl}
        ref={audioRef}
        src={audioUrl}
        onEnded={() => setPlaying(false)}
        onPause={() => setPlaying(false)}
        className="hidden"
      />
      <button
        type="button"
        onClick={togglePlay}
        className="btn-neon rounded-xl px-6 py-2.5 text-sm flex items-center gap-2"
      >
        {playing ? (
          <>
            <span className="w-2 h-2 bg-slate-950 rounded-sm" />
            Pause
          </>
        ) : (
          <>
            <span className="w-0 h-0 border-l-[10px] border-l-slate-950 border-y-[6px] border-y-transparent ml-0.5" />
            Play message
          </>
        )}
      </button>
    </div>
  );
}
