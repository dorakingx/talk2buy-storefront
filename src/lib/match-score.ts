export interface MatchAnalysis {
  score: number;
  signals: string[];
  expectedOutcome: string;
}

const CREATOR_FIT: Record<string, string> = {
  "quantum-audio-guide": "Voice-first format fits beginner education",
  "ai-art-prompt-pack": "Built for creators who need fast visual output",
  "research-coaching-mini": "Structured for focused academic momentum",
  "cyberpunk-story-audio": "Immersive narrative format for creative inspiration",
};

const EXPECTED_OUTCOME: Record<string, string> = {
  "quantum-audio-guide":
    "Understand qubits, superposition, and entanglement without heavy math.",
  "ai-art-prompt-pack":
    "Produce cinematic AI visuals faster with production-ready prompts.",
  "research-coaching-mini":
    "Organize scattered ideas into a clear, actionable research plan.",
  "cyberpunk-story-audio":
    "Receive an immersive cyberpunk audio story tailored to your vibe.",
};

const KEYWORD_INTEREST: Record<string, string> = {
  quantum: "quantum learning",
  art: "AI art creation",
  prompt: "AI art creation",
  research: "research organization",
  story: "immersive storytelling",
  cyberpunk: "cyberpunk storytelling",
};

const HIGH_INTENT_PHRASES = [
  "i want to learn",
  "i want to",
  "i need",
  "looking for",
  "help me",
];

const PURCHASE_PHRASES = ["buy", "unlock", "get started", "purchase", "checkout"];

function clampScore(raw: number): number {
  return Math.min(98, Math.max(82, raw));
}

export function getExpectedOutcome(productId: string): string {
  return EXPECTED_OUTCOME[productId] ?? "Achieve your goal with a voice-first digital product.";
}

export function computeMatchAnalysis(
  productId: string,
  userIntent: string
): MatchAnalysis {
  const lower = userIntent.toLowerCase().trim();
  const signals: string[] = [];
  let points = 82;

  for (const [kw, label] of Object.entries(KEYWORD_INTEREST)) {
    if (lower.includes(kw)) {
      signals.push(`Matched your interest in ${label}`);
      points += 4;
      break;
    }
  }
  if (signals.length === 0) {
    signals.push("Matched your stated goals to this product category");
    points += 2;
  }

  for (const phrase of HIGH_INTENT_PHRASES) {
    if (lower.includes(phrase)) {
      const detected = phrase.replace("i ", "I ");
      signals.push(`High-intent phrase detected: '${detected}'`);
      points += 5;
      break;
    }
  }

  if (lower.length > 25) {
    points += 2;
  }

  const fit = CREATOR_FIT[productId];
  if (fit) {
    signals.push(fit);
    points += 3;
  }

  if (PURCHASE_PHRASES.some((p) => lower.includes(p))) {
    signals.push("Purchase-ready language detected");
    points += 4;
  }

  return {
    score: clampScore(points),
    signals: signals.slice(0, 4),
    expectedOutcome: getExpectedOutcome(productId),
  };
}

/** @deprecated Use computeMatchAnalysis */
export function computeMatchScore(productId: string, userIntent: string): number {
  return computeMatchAnalysis(productId, userIntent).score;
}
