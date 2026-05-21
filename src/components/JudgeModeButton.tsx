"use client";

interface JudgeModeButtonProps {
  onRun: () => void;
  className?: string;
}

export function JudgeModeButton({ onRun, className = "" }: JudgeModeButtonProps) {
  return (
    <button
      type="button"
      onClick={onRun}
      className={`rounded-xl px-4 py-2 text-sm font-medium border border-fuchsia-500/40 text-fuchsia-300 bg-fuchsia-500/10 hover:bg-fuchsia-500/20 hover:border-fuchsia-400/60 transition-all ${className}`}
    >
      Run 30-sec demo
    </button>
  );
}
