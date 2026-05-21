import { getProductById, QUICK_REPLIES } from "@/lib/products";
import type { AssistantResponse } from "@/types";

const KEYWORD_RULES: { keywords: string[]; productId: string }[] = [
  { keywords: ["quantum", "qubit", "physics", "computing"], productId: "quantum-audio-guide" },
  { keywords: ["art", "image", "prompt", "draw", "visual"], productId: "ai-art-prompt-pack" },
  { keywords: ["research", "phd", "paper", "thesis", "study"], productId: "research-coaching-mini" },
  { keywords: ["story", "cyberpunk", "novel", "fiction", "narrative", "audio story"], productId: "cyberpunk-story-audio" },
];

const QUICK_REPLY_MAP = Object.fromEntries(
  QUICK_REPLIES.map((q) => [q.label.toLowerCase(), q.productId])
);

function matchProductId(message: string): string {
  const lower = message.toLowerCase().trim();
  if (QUICK_REPLY_MAP[lower]) return QUICK_REPLY_MAP[lower];

  for (const rule of KEYWORD_RULES) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      return rule.productId;
    }
  }
  return "quantum-audio-guide";
}

function buildStructuredReply(productId: string, userInterest?: string): AssistantResponse {
  const product = getProductById(productId);
  if (!product) {
    return {
      reply:
        "I'd love to help you find something. Tell me what kind of digital product you're looking for.",
    };
  }

  const interest = userInterest ?? "what you're looking for";
  const whyItFits = `Based on your interest in ${interest}, this is the best match for your goals right now.`;
  const whatYouGet = product.whatYouGet;
  const cta = "Would you like to unlock it now?";
  const reply = `Based on your interest in ${interest}, I recommend the ${product.name}. You'll get ${whatYouGet} ${cta}`;

  return {
    reply,
    recommendedProductId: productId,
    whyItFits,
    whatYouGet,
    cta,
  };
}

function extractInterest(message: string, productId: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("quantum")) return "quantum computing";
  if (lower.includes("art") || lower.includes("prompt")) return "AI art and visuals";
  if (lower.includes("research")) return "research organization";
  if (lower.includes("story") || lower.includes("cyberpunk")) return "immersive storytelling";
  const product = getProductById(productId);
  return product?.shortBenefit.toLowerCase() ?? "your goals";
}

export async function getAssistantReply(message: string): Promise<AssistantResponse> {
  const productId = matchProductId(message);
  const interest = extractInterest(message, productId);

  if (process.env.OPENAI_API_KEY) {
    try {
      const product = getProductById(productId);
      const structured = buildStructuredReply(productId, interest);
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
              content: `You are a friendly AI voice sales assistant. Recommend "${product?.name}". Why it fits: ${structured.whyItFits}. What they get: ${structured.whatYouGet}. End with: ${structured.cta}. Be persuasive but warm. Under 90 words.`,
            },
            { role: "user", content: message },
          ],
          max_tokens: 180,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const reply = data.choices?.[0]?.message?.content?.trim();
        if (reply) {
          return {
            reply,
            recommendedProductId: productId,
            whyItFits: structured.whyItFits,
            whatYouGet: structured.whatYouGet,
            cta: structured.cta,
          };
        }
      }
    } catch {
      // fall through
    }
  }

  return buildStructuredReply(productId, interest);
}

export function getGreeting(): string {
  return "Hi, I'm your AI sales assistant. Tell me what kind of digital product you're looking for, and I'll help you find the right one.";
}
