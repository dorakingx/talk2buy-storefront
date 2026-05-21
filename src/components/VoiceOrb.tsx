import type { VoiceOrbState } from "@/types";

interface VoiceOrbProps {
  state: VoiceOrbState;
}

const STATE_LABELS: Record<VoiceOrbState, string> = {
  idle: "Ready to listen",
  listening: "Listening…",
  thinking: "Thinking…",
  speaking: "Speaking…",
};

export function VoiceOrb({ state }: VoiceOrbProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <div className="relative flex items-center justify-center w-40 h-40 md:w-48 md:h-48">
        {state === "speaking" && (
          <>
            <span className="absolute inset-0 rounded-full bg-cyan-400/20 animate-orb-pulse" />
            <span className="absolute inset-2 rounded-full bg-violet-500/15 animate-orb-pulse animation-delay-150" />
          </>
        )}
        {state === "listening" && (
          <span className="absolute inset-0 rounded-full border-2 border-cyan-400/60 animate-orb-listen" />
        )}
        {state === "thinking" && (
          <span className="absolute inset-0 rounded-full border-2 border-violet-400/40 animate-spin-slow" />
        )}
        <div
          className={`relative w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-cyan-400 via-violet-500 to-fuchsia-500 shadow-[0_0_60px_rgba(34,211,238,0.4)] ${
            state === "idle" ? "animate-orb-breathe" : ""
          } ${state === "speaking" ? "scale-105 transition-transform" : ""}`}
        >
          <div className="absolute inset-2 rounded-full bg-slate-950/30 backdrop-blur-sm" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`w-3 h-3 rounded-full bg-white/90 ${
                state === "speaking" ? "animate-pulse" : ""
              }`}
            />
          </div>
        </div>
      </div>
      <p className="text-sm text-slate-400 font-medium tracking-wide">
        {STATE_LABELS[state]}
      </p>
    </div>
  );
}
