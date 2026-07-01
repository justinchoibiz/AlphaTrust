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
];