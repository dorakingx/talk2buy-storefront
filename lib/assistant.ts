import { getProductById } from "@/lib/products";
import type { AssistantResponse } from "@/types";

const KEYWORD_RULES: { keywords: string[]; productId: string }[] = [
  { keywords: ["quantum", "qubit", "physics"], productId: "quantum-audio-guide" },
  { keywords: ["art", "image", "prompt", "draw", "visual"], productId: "ai-art-prompt-pack" },
  { keywords: ["research", "phd", "paper", "thesis", "study"], productId: "research-coaching-mini" },
  { keywords: ["story", "cyberpunk", "novel", "fiction", "narrative"], productId: "cyberpunk-story-audio" },
];

const PRODUCT_FIT: Record<string, string> = {
  "quantum-audio-guide":
    "It is designed for people who want a clear and friendly introduction without getting lost in heavy math.",
  "ai-art-prompt-pack":
    "It gives you cinematic, production-ready prompts so you can create stunning AI art faster.",
  "research-coaching-mini":
    "It helps you organize scattered ideas into a focused research plan you can actually execute.",
  "cyberpunk-story-audio":
    "It delivers an immersive cyberpunk narrative experience — perfect for creative inspiration.",
};

function matchProductId(message: string): string {
  const lower = message.toLowerCase();
  for (const rule of KEYWORD_RULES) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      return rule.productId;
    }
  }
  return "quantum-audio-guide";
}

function buildReply(productId: string): string {
  const product = getProductById(productId);
  if (!product) {
    return "I'd love to help you find something. Could you tell me more about what you're looking for?";
  }
  const fit = PRODUCT_FIT[productId] ?? "It's a great fit for curious creators like you.";
  return `Based on what you said, I recommend the ${product.name}. ${fit} Would you like to purchase it?`;
}

export async function getAssistantReply(message: string): Promise<AssistantResponse> {
  const productId = matchProductId(message);

  if (process.env.OPENAI_API_KEY) {
    try {
      const product = getProductById(productId);
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are a friendly AI voice shop clerk for a digital creator storefront. Recommend "${product?.name}" naturally. Be sales-oriented but not pushy. Keep replies under 80 words.`,
            },
            { role: "user", content: message },
          ],
          max_tokens: 150,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const reply = data.choices?.[0]?.message?.content?.trim();
        if (reply) return { reply, recommendedProductId: productId };
      }
    } catch {
      // fall through to rule-based
    }
  }

  return {
    reply: buildReply(productId),
    recommendedProductId: productId,
  };
}

export function getGreeting(): string {
  return "Welcome to Talk-to-Buy! I'm your AI shop assistant. What are you looking for today — learning, creativity, research, or storytelling?";
}
