interface ChatBubbleProps {
  role: "user" | "assistant";
  content: string;
}

export function ChatBubble({ role, content }: ChatBubbleProps) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "bg-cyan-500/20 text-cyan-50 border border-cyan-500/30"
            : "bg-slate-800/80 text-slate-200 border border-violet-500/20"
        }`}
      >
        {!isUser && (
          <span className="block text-xs text-violet-400 mb-1 font-medium">
            Shop Assistant
          </span>
        )}
        {content}
      </div>
    </div>
  );
}
