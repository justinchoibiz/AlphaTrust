import type { Project } from "@/lib/schemas/project.schema";
import type { AlphaCase } from "@/lib/schemas/alpha-case.schema";

export const mockProjects: Project[] = [
  {
    id: "p001",
    name: "Low Leverage Diagnostic",
    template: "fundamental_ratio",
    status: "draft",
    createdAt: "2026-06-29T00:00:00.000Z",
    updatedAt: "2026-06-29T00:00:00.000Z",
  },
  {
    id: "p002",
    name: "Momentum Alpha Test",
    template: "momentum",
    status: "diagnostic_completed",
    createdAt: "2026-06-29T00:00:00.000Z",
    updatedAt: "2026-06-29T00:00:00.000Z",
  },
];

export const mockAlphaCases: AlphaCase[] = [
  {
    projectId: "p001",
    hypothesis: "Low-leverage firms may outperform high-leverage firms.",
    universe: "US Large Cap Demo",
    holdingPeriodDays: 20,

    dataMode: "default_demo_dataset",
    barType: "time_bars",

    featureSource: "alpha_score",
    expression: "-rank(liabilities/assets)",

    labelingMethod: "triple_barrier",
    verticalBarrierDays: 10,
    upperBarrierPct: 2,
    lowerBarrierPct: -2,

    sampleWeightMethod: "average_uniqueness",
    cvMethod: "purged_k_fold_embargo",
    embargoPct: 1,

    betSizingMethod: "probability_based",
    maxPositionSize: 0.1,
  },
  {
    projectId: "p002",
    hypothesis: "Recent price momentum may predict short-term continuation.",
    universe: "US Large Cap Demo",
    holdingPeriodDays: 20,

    dataMode: "default_demo_dataset",
    barType: "time_bars",

    featureSource: "alpha_score",
    expression: "rank(ts_delta(close, 20))",

    labelingMethod: "triple_barrier",
    verticalBarrierDays: 10,
    upperBarrierPct: 2,
    lowerBarrierPct: -2,

    sampleWeightMethod: "average_uniqueness",
    cvMethod: "purged_k_fold_embargo",
    embargoPct: 1,

    betSizingMethod: "probability_based",
    maxPositionSize: 0.1,
  },
];