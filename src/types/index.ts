export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  sampleScript: string;
  shortBenefit: string;
  whatYouGet: string;
  thankYouClosing: string;
}

export type VoiceOrbState = "idle" | "listening" | "thinking" | "speaking";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  recommendedProductId?: string;
  whyItFits?: string;
  whatYouGet?: string;
  cta?: string;
}

export interface AssistantResponse {
  reply: string;
  recommendedProductId?: string;
  whyItFits?: string;
  whatYouGet?: string;
  cta?: string;
}

export interface StripeSessionResponse {
  customerName: string | null;
  customerEmail: string | null;
  productId: string | null;
  productName: string | null;
  paymentStatus: string;
  userIntent?: string | null;
}

export interface VoiceGenerateResponse {
  demo?: boolean;
  message?: string;
  fallback?: "browser";
}

export interface AppConfig {
  stripeEnabled: boolean;
  elevenLabsEnabled: boolean;
}

export interface CheckoutSessionResponse {
  url?: string;
  demo?: boolean;
  error?: string;
}
