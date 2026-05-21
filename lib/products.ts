import type { Product } from "@/types";

export const products: Product[] = [
  {
    id: "quantum-audio-guide",
    name: "Quantum Computing Beginner Audio Guide",
    description:
      "A friendly audio guide for learning the basics of quantum computing.",
    price: 1200,
    currency: "jpy",
  },
  {
    id: "ai-art-prompt-pack",
    name: "AI Art Prompt Pack",
    description:
      "A curated collection of cinematic AI art prompts for creators.",
    price: 900,
    currency: "jpy",
  },
  {
    id: "research-coaching-mini",
    name: "Research Coaching Mini Session",
    description:
      "A short personalized guide for organizing your research ideas.",
    price: 2500,
    currency: "jpy",
  },
  {
    id: "cyberpunk-story-audio",
    name: "Cyberpunk Short Story Audio",
    description:
      "A custom cyberpunk-inspired short story delivered as audio.",
    price: 1500,
    currency: "jpy",
  },
];

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
