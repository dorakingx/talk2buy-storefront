import { isElevenLabsConfigured } from "@/lib/elevenlabs";
import { getStripe } from "@/lib/stripe";
import type { AppConfig } from "@/types";

export function getAppConfig(): AppConfig {
  return {
    stripeEnabled: !!getStripe(),
    elevenLabsEnabled: isElevenLabsConfigured(),
  };
}
