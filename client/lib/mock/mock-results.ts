import type { DiagnosticResult } from "@/lib/schemas/diagnostic.schema";

export const mockDiagnosticResults: DiagnosticResult[] = [
  {
    projectId: "p001",

    probabilities: {
      pUp: 0.58,
      pFlat: 0.17,
      pDown: 0.25,
    },

    metrics: {
      returns: -12.73,
      drawdown: 50.5,
      turnover: 1.53,
      sharpe: -1.78,
      psr: 0.08,
      dsrPass: false,
      averageUniqueness: 0.42,
    },

    risks: {
      leakageRisk: "medium",
      overfittingRisk: "high",
      featureRedundancyRisk: "medium",
      dataRisk: "high",
    },

    warnings: [
      "The expression may contain sector bias because leverage ratios differ structurally across sectors.",
      "Fundamental data may be stale or affected by reporting lag.",
      "The observed Sharpe is negative and does not pass the DSR threshold.",
      "Average uniqueness is moderate, suggesting potential overlap among labeled events.",
    ],

    recommendedFixes: [
      "Try group_rank(liabilities/assets, sector).",
      "Try group_neutralize(-rank(liabilities/assets), sector).",
      "Use point-in-time fundamentals if available.",
      "Run purged K-Fold validation with embargo before trusting the signal.",
    ],
  },
  {
    projectId: "p002",

    probabilities: {
      pUp: 0.61,
      pFlat: 0.16,
      pDown: 0.23,
    },

    metrics: {
      returns: 18.42,
      drawdown: 12.8,
      turnover: 2.14,
      sharpe: 1.34,
      psr: 0.82,
      dsrPass: true,
      averageUniqueness: 0.67,
    },

    risks: {
      leakageRisk: "low",
      overfittingRisk: "medium",
      featureRedundancyRisk: "medium",
      dataRisk: "medium",
    },

    warnings: [
      "Momentum signals can decay quickly when transaction costs are included.",
      "Turnover is elevated, so slippage assumptions should be tested before deployment.",
      "DSR passes in the mock diagnostic, but this is not a real engine result yet.",
    ],

    recommendedFixes: [
      "Stress test holding period sensitivity around 10, 20, and 60 days.",
      "Add transaction cost and slippage assumptions before ranking this strategy.",
      "Compare time bars with dollar bars after the engine supports information-driven bars.",
    ],
  },
];
