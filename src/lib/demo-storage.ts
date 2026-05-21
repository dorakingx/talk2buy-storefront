export type DemoStep =
  | "talk"
  | "recommend"
  | "hear_sample"
  | "pay"
  | "thank_you";

export interface DemoContext {
  userIntent: string;
  recommendedProductId?: string;
  whyItFits?: string;
  whatYouGet?: string;
  cta?: string;
  matchScore?: number;
  customerName?: string;
  demoStep?: DemoStep;
}

const STORAGE_KEY = "talk2buy_demo";

const STEP_ORDER: DemoStep[] = [
  "talk",
  "recommend",
  "hear_sample",
  "pay",
  "thank_you",
];

export function loadDemoContext(): DemoContext | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DemoContext;
  } catch {
    return null;
  }
}

export function saveDemoContext(partial: Partial<DemoContext>): DemoContext {
  const existing = loadDemoContext() ?? { userIntent: "" };
  const next: DemoContext = { ...existing, ...partial };
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("talk2buy-demo-update"));
  }
  return next;
}

export function setDemoStep(step: DemoStep): void {
  saveDemoContext({ demoStep: step });
}

export function clearDemoContext(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("talk2buy-demo-update"));
}

export function getCompletedSteps(activeStep: DemoStep | null): DemoStep[] {
  if (!activeStep) return [];
  const idx = STEP_ORDER.indexOf(activeStep);
  if (idx <= 0) return [];
  return STEP_ORDER.slice(0, idx);
}

export const DEMO_STEP_ORDER = STEP_ORDER;
