"use client";

import { useRecordingMode } from "@/hooks/useRecordingMode";

export function RecordingModeBanner() {
  const recording = useRecordingMode();
  if (!recording) return null;

  return (
    <div className="bg-violet-500/10 border-b border-violet-500/25 py-2 text-center text-xs text-violet-300">
      Recording mode — stable demo layout (ElevenLabs + Stripe labels visible)
    </div>
  );
}
