import type { Product } from "@/types";

export const products: Product[] = [
  {
    id: "quantum-audio-guide",
    name: "Quantum Computing Beginner Audio Guide",
    description:
      "A friendly audio guide for learning the basics of quantum computing.",
    price: 1200,
    currency: "jpy",
    shortBenefit: "Learn qubits without the math overwhelm",
    whatYouGet:
      "A friendly voice-based introduction that explains qubits, superposition, and entanglement without heavy math.",
    sampleScript:
      "Imagine learning quantum computing from a calm personal guide instead of a dense textbook. This guide introduces qubits, superposition, and entanglement in a friendly voice-first format.",
    thankYouClosing: "Your journey into quantum ideas starts now.",
  },
  {
    id: "ai-art-prompt-pack",
    name: "AI Art Prompt Pack",
    description:
      "A curated collection of cinematic AI art prompts for creators.",
    price: 900,
    currency: "jpy",
    shortBenefit: "Cinematic prompts for stunning AI visuals",
    whatYouGet:
      "Unlock cinematic prompts for futuristic cities, fantasy worlds, product visuals, and social media posts.",
    sampleScript:
      "Unlock cinematic prompts for futuristic cities, fantasy worlds, product visuals, and social media posts.",
    thankYouClosing: "Your next visual masterpiece is one prompt away.",
  },
  {
    id: "research-coaching-mini",
    name: "Research Coaching Mini Session",
    description:
      "A short personalized guide for organizing your research ideas.",
    price: 2500,
    currency: "jpy",
    shortBenefit: "Turn scattered ideas into a focused research plan",
    whatYouGet:
      "A short personalized coaching guide that helps you structure hypotheses, sources, and next steps.",
    sampleScript:
      "Stop drowning in notes. This mini session helps you organize research ideas into a clear, actionable plan you can execute this week.",
    thankYouClosing: "Your research momentum starts today.",
  },
  {
    id: "cyberpunk-story-audio",
    name: "Cyberpunk Short Story Audio",
    description:
      "A custom cyberpunk-inspired short story delivered as audio.",
    price: 1500,
    currency: "jpy",
    shortBenefit: "An immersive cyberpunk story in AI voice",
    whatYouGet:
      "Receive a custom cyberpunk audio story generated just for you, delivered in an immersive AI voice.",
    sampleScript:
      "Receive a custom cyberpunk audio story generated just for you, delivered in an immersive AI voice.",
    thankYouClosing: "Your neon-lit story world awaits.",
  },
];

export const QUICK_REPLIES = [
  { label: "I want to learn quantum computing", productId: "quantum-audio-guide" },
  { label: "I need AI art prompts", productId: "ai-art-prompt-pack" },
  { label: "I want a custom audio story", productId: "cyberpunk-story-audio" },
] as const;

export function getAllProducts(): Product[] {
  return products;
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function formatPrice(price: number, currency: string): string {
  if (currency === "jpy") {
    return `¥${price.toLocaleString("ja-JP")}`;
  }
  return `${currency.toUpperCase()} ${(price / 100).toFixed(2)}`;
}

export function getThankYouMessage(
  customerName: string,
  product: Product
): string {
  return `Thank you, ${customerName}, for purchasing the ${product.name}. ${product.thankYouClosing}`;
}
