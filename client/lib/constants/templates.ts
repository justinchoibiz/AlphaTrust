import type { ProjectTemplate } from "@/lib/schemas/project.schema";

export type ProjectTemplateOption = {
  value: ProjectTemplate;
  label: string;
  description: string;
  defaultName: string;
};

export const PROJECT_TEMPLATE_OPTIONS: ProjectTemplateOption[] = [
  {
    value: "empty",
    label: "Empty Template",
    description: "Start with the default AFML workflow and no strong hypothesis.",
    defaultName: "Untitled Alpha Case",
  },
  {
    value: "fundamental_ratio",
    label: "Fundamental Ratio Alpha",
    description: "Use -rank(liabilities/assets) as a simple leverage example.",
    defaultName: "Low Leverage Diagnostic",
  },
  {
    value: "momentum",
    label: "Momentum Alpha",
    description: "Use rank(ts_delta(close, 20)) as a simple momentum expression.",
    defaultName: "Momentum Alpha Test",
  },
  {
    value: "sector_neutral",
    label: "Sector-Neutral Alpha",
    description: "Use group_neutralize to reduce simple sector exposure.",
    defaultName: "Sector Neutral Alpha",
  },
];
