"use client";

import type { Project } from "@/lib/schemas/project.schema";
import type { AlphaCase } from "@/lib/schemas/alpha-case.schema";

import { WorkspaceSection } from "@/components/workspace/WorkspaceSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUiStore } from "@/lib/store/ui-store";

type ProjectSummarySectionProps = {
  project: Project;
  alphaCase: AlphaCase;
};

export function ProjectSummarySection({
  project,
  alphaCase,
}: ProjectSummarySectionProps) {
  const unlockAndFocusSection = useUiStore(
    (state) => state.unlockAndFocusSection,
  );

  return (
    <WorkspaceSection
      id="project-summary"
      title="Project Summary"
      description="Review the current alpha case before configuring the diagnostic."
    >
      <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <SummaryItem label="Project" value={project.name} />
          <SummaryItem
            label="Status"
            value={project.status.replaceAll("_", " ")}
          />
          <SummaryItem label="Universe" value={alphaCase.universe} />
          <SummaryItem
            label="Holding Period"
            value={`${alphaCase.holdingPeriodDays} days`}
          />
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-sm font-medium text-neutral-300">
              Hypothesis
            </span>
            <Badge
              variant="outline"
              className="border-neutral-700 text-neutral-400"
            >
              draft
            </Badge>
          </div>
          <p className="text-sm text-neutral-400">
            {alphaCase.hypothesis || "No hypothesis provided yet."}
          </p>
        </div>

        <Button
          onClick={() => {
            unlockAndFocusSection("dataset");

            requestAnimationFrame(() => {
              document.getElementById("dataset")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            });
          }}
        >
          Continue to Dataset
        </Button>
      </div>
    </WorkspaceSection>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
      <p className="text-xs text-neutral-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-neutral-200">{value}</p>
    </div>
  );
}
