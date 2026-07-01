// src/lib/schemas/project.schema.ts
import { z } from "zod";

export const ProjectTemplateSchema = z.enum([
  "empty",
  "fundamental_ratio",
  "momentum",
  "sector_neutral",
  "backtest_summary",
]);

export const ProjectStatusSchema = z.enum([
  "draft",
  "configured",
  "diagnostic_completed",
  "report_ready",
]);

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  template: ProjectTemplateSchema,
  status: ProjectStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Project = z.infer<typeof ProjectSchema>;
export type ProjectTemplate = z.infer<typeof ProjectTemplateSchema>;
export type ProjectStatus = z.infer<typeof ProjectStatusSchema>;