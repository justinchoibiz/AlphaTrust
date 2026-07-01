// src/lib/schemas/diagnostic.schema.ts
import { z } from "zod";

export const RiskLevelSchema = z.enum([
  "low",
  "medium",
  "high",
  "extreme",
]);

export const DiagnosticResultSchema = z.object({
  projectId: z.string(),

  probabilities: z.object({
    pUp: z.number(),
    pFlat: z.number(),
    pDown: z.number(),
  }),

  metrics: z.object({
    returns: z.number(),
    drawdown: z.number(),
    turnover: z.number(),
    sharpe: z.number(),
    psr: z.number(),
    dsrPass: z.boolean(),
    averageUniqueness: z.number(),
  }),

  risks: z.object({
    leakageRisk: RiskLevelSchema,
    overfittingRisk: RiskLevelSchema,
    featureRedundancyRisk: RiskLevelSchema,
    dataRisk: RiskLevelSchema,
  }),

  warnings: z.array(z.string()),
  recommendedFixes: z.array(z.string()),
});

export type DiagnosticResult = z.infer<typeof DiagnosticResultSchema>;