import { getProductById } from "@/lib/products";
import type { Product } from "@/types";
import type { DemoContext } from "@/lib/demo-storage";

export function computeMatchScore(productId: string, userIntent: string): number {
  let hash = 0;
  const str = `${productId}:${userIntent.toLowerCase().trim()}`;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return 88 + (Math.abs(hash) % 10);
}

export function buildPersonalizedPreview(ctx: DemoContext): string {
  const product = ctx.recommendedProductId
    ? getProductById(ctx.recommendedProductId)
    : undefined;

  if (!product) {
    return "Here is a short voice preview of this digital product for you.";
  }

  const interest = ctx.userIntent?.trim() || "your goals";

  return `Based on your interest in ${interest}, here is a short preview. The ${product.name} will help you ${product.shortBenefit.toLowerCase()}. ${product.whatYouGet}`;
}

export function buildPersonalizedThankYou(
  customerName: string,
  product: Product,
  ctx: DemoContext | null
): string {
  const name = customerName.trim() || "there";
  const intent = ctx?.userIntent?.trim();

  if (intent) {
    return `Thank you, ${name}, for purchasing the ${product.name}. Because you said you wanted ${intent}, I prepared a calm voice-first guide to help you ${product.shortBenefit.toLowerCase()}. ${product.thankYouClosing}`;
  }

  return `Thank you, ${name}, for purchasing the ${product.name}. ${product.whatYouGet} ${product.thankYouClosing}`;
}
