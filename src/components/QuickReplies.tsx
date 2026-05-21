"use client";

import { QUICK_REPLIES } from "@/lib/products";

interface QuickRepliesProps {
  onSelect: (message: string) => void;
  visible: boolean;
}

export function QuickReplies({ onSelect, visible }: QuickRepliesProps) {
  if (!visible) return null;

  return (
    <div className="flex flex-wrap gap-2 justify-center px-4 pb-2">
      {QUICK_REPLIES.map((q) => (
        <button
          key={q.label}
          type="button"
          onClick={() => onSelect(q.label)}
          className="text-xs md:text-sm px-3 py-2 rounded-full glass-card text-slate-200 hover:border-cyan-400/40 hover:text-cyan-300 transition-all"
        >
          {q.label}
        </button>
      ))}
    </div>
  );
}
