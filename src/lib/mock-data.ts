export const funnelMetrics = {
  voiceConversationsToday: 47,
  recommendationsGenerated: 38,
  voicePreviewPlays: 29,
  stripeCheckoutStarts: 14,
  purchasesCompleted: 6,
  estimatedConversionLift: "+18%",
};

export const liveSalesStats = {
  revenueToday: 12400,
  conversionRate: 4.8,
  conversionDelta: "+12% vs last week",
  voiceInteractions: funnelMetrics.voiceConversationsToday,
  purchasedProducts: [
    { name: "AI Art Prompt Pack", count: 3 },
    { name: "Quantum Computing Beginner Audio Guide", count: 2 },
    { name: "Cyberpunk Short Story Audio", count: 1 },
  ],
  funnel: funnelMetrics,
};

export const dashboardStats = {
  totalRevenue: 89400,
  totalOrders: 34,
  avgOrderValue: 2630,
  voiceMessagesGenerated: 28,
  voiceConversations: 156,
  conversionRate: 4.8,
  conversionDelta: "+12% vs last week",
  topRecommendedProduct: "Quantum Computing Beginner Audio Guide",
  funnel: funnelMetrics,
};

export const revenueByDay = [
  { day: "Mon", amount: 8200 },
  { day: "Tue", amount: 12400 },
  { day: "Wed", amount: 9800 },
  { day: "Thu", amount: 15600 },
  { day: "Fri", amount: 11200 },
  { day: "Sat", amount: 18900 },
  { day: "Sun", amount: 13400 },
];

export const recentPurchases = [
  {
    id: "1",
    customer: "Alex M.",
    product: "AI Art Prompt Pack",
    amount: 900,
    date: "2025-05-21T10:32:00Z",
  },
  {
    id: "2",
    customer: "Jordan K.",
    product: "Quantum Computing Beginner Audio Guide",
    amount: 1200,
    date: "2025-05-21T09:15:00Z",
  },
  {
    id: "3",
    customer: "Sam L.",
    product: "Research Coaching Mini Session",
    amount: 2500,
    date: "2025-05-20T18:44:00Z",
  },
  {
    id: "4",
    customer: "Riley T.",
    product: "Cyberpunk Short Story Audio",
    amount: 1500,
    date: "2025-05-20T14:20:00Z",
  },
];

export const voiceCommerceAnalytics = {
  voicePreviewPlays: 48,
  checkoutStarts: 21,
  purchasesCompleted: 13,
  estimatedConversionLift: "+18%",
  revenueInfluencedByVoice: 89400,
};

export const conversionFunnel = [
  { label: "Visitors", count: 128 },
  { label: "Voice conversations", count: 74 },
  { label: "Recommendations", count: 52 },
  { label: "Voice preview plays", count: 48 },
  { label: "Checkout starts", count: 21 },
  { label: "Purchases", count: 13 },
];

export const funnelInsight =
  "Products with voice previews converted 2.1x better than static product cards in this demo scenario.";

export const generatedAudioLog = [
  {
    id: "a1",
    customer: "Alex M.",
    product: "AI Art Prompt Pack",
    preview: "Thank you, Alex, for purchasing AI Art Prompt Pack...",
    createdAt: "2025-05-21T10:33:00Z",
  },
  {
    id: "a2",
    customer: "Jordan K.",
    product: "Quantum Computing Beginner Audio Guide",
    preview: "Thank you, Jordan, for purchasing Quantum Computing...",
    createdAt: "2025-05-21T09:16:00Z",
  },
  {
    id: "a3",
    customer: "Tomoya H.",
    product: "Cyberpunk Short Story Audio",
    preview: "Thank you, Tomoya, for purchasing Cyberpunk Short Story...",
    createdAt: "2025-05-21T11:00:00Z",
  },
];
