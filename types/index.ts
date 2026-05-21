export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  recommendedProductId?: string;
}

export interface AssistantResponse {
  reply: string;
  recommendedProductId?: string;
}

export interface StripeSessionResponse {
  customerName: string | null;
  customerEmail: string | null;
  productId: string | null;
  productName: string | null;
  paymentStatus: string;
}

export interface VoiceGenerateResponse {
  demo?: boolean;
  message?: string;
}
