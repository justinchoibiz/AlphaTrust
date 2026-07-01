// src/lib/schemas/alpha-case.schema.ts
import { z } from "zod";

export const DataModeSchema = z.enum([
  "default_demo_dataset",
  "csv_upload",
  "example_dataset",
]);

export const BarTypeSchema = z.enum([
  "time_bars",
  "volume_bars",
  "dollar_bars",
]);

export const FeatureSourceSchema = z.enum([
  "alpha_score",
  "price_features",
  "volume_features",
  "fundamental_features",
]);

export const LabelingMethodSchema = z.enum([
  "fixed_horizon",
  "triple_barrier",
  "meta_labeling",
]);

export const SampleWeightMethodSchema = z.enum([
  "none",
  "average_uniqueness",
  "return_attribution",
  "time_decay",
  "class_weights",
]);

export const CvMethodSchema = z.enum([
  "train_test_split",
  "k_fold",
  "purged_k_fold",
  "purged_k_fold_embargo",
]);

export const BetSizingMethodSchema = z.enum([
  "fixed_size",
  "alpha_score_proportional",
  "probability_based",
]);

export const AlphaCaseSchema = z.object({
  projectId: z.string(),

  hypothesis: z.string().default(""),
  universe: z.string().default("US Large Cap Demo"),
  holdingPeriodDays: z.number().default(20),

  dataMode: DataModeSchema.default("default_demo_dataset"),
  barType: BarTypeSchema.default("time_bars"),

  featureSource: FeatureSourceSchema.default("alpha_score"),
  expression: z.string().default("-rank(liabilities/assets)"),

  labelingMethod: LabelingMethodSchema.default("triple_barrier"),
  verticalBarrierDays: z.number().default(10),
  upperBarrierPct: z.number().default(2),
  lowerBarrierPct: z.number().default(-2),

  sampleWeightMethod: SampleWeightMethodSchema.default("average_uniqueness"),
  cvMethod: CvMethodSchema.default("purged_k_fold_embargo"),
  embargoPct: z.number().default(1),

  betSizingMethod: BetSizingMethodSchema.default("probability_based"),
  maxPositionSize: z.number().default(0.1),
});

export type AlphaCase = z.infer<typeof AlphaCaseSchema>;