"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Database, Upload } from "lucide-react";

import type { AlphaCase } from "@/lib/schemas/alpha-case.schema";
import { updateAlphaCase } from "@/lib/api/mock-api";
import { useUiStore } from "@/lib/store/ui-store";

import { WorkspaceSection } from "@/components/workspace/WorkspaceSection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type DatasetSectionProps = {
  projectId: string;
  alphaCase: AlphaCase;
};

export function DatasetSection({
  projectId,
  alphaCase,
}: DatasetSectionProps) {
  const queryClient = useQueryClient();
  const unlockAndFocusSection = useUiStore(
    (state) => state.unlockAndFocusSection,
  );

  const mutation = useMutation({
    mutationFn: () =>
      updateAlphaCase(projectId, {
        dataMode: "default_demo_dataset",
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["alpha-case", projectId],
      });

      unlockAndFocusSection("bars");
      scrollToSection("bars");
    },
  });

  return (
    <WorkspaceSection
      id="dataset"
      title="Dataset"
      description="Select the data source used by the diagnostic workflow."
    >
      <div className="space-y-5">
        <button
          type="button"
          className="w-full rounded-xl border border-neutral-600 bg-neutral-950 p-5 text-left"
        >
          <div className="flex items-start gap-4">
            <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-2">
              <Database className="h-5 w-5 text-neutral-200" />
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-neutral-100">
                  Default Demo Dataset
                </p>
                <Badge>Selected</Badge>
                <Badge variant="outline">MVP</Badge>
              </div>

              <p className="mt-2 text-sm leading-6 text-neutral-400">
                Demo data containing market, volume, fundamental, and sector
                fields required by the sample alpha expressions.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  "date",
                  "asset",
                  "close",
                  "returns",
                  "volume",
                  "assets",
                  "liabilities",
                  "sector",
                ].map((field) => (
                  <Badge
                    key={field}
                    variant="outline"
                    className="border-neutral-800 text-neutral-400"
                  >
                    {field}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </button>

        <div className="cursor-not-allowed rounded-xl border border-neutral-800 bg-neutral-950 p-5 opacity-50">
          <div className="flex items-start gap-4">
            <Upload className="mt-1 h-5 w-5 text-neutral-500" />

            <div>
              <p className="font-medium text-neutral-400">Upload CSV</p>
              <p className="mt-1 text-sm text-neutral-600">
                Custom dataset upload will be added after the engine schema is
                finalized.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-amber-900/50 bg-amber-950/20 p-4 text-sm leading-6 text-amber-200/80">
          The current demo dataset does not guarantee point-in-time correctness,
          survivorship-bias control, or realistic fundamental reporting lag.
        </div>

        <Button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Saving..." : "Use Demo Dataset"}
        </Button>
      </div>
    </WorkspaceSection>
  );
}

function scrollToSection(sectionId: string) {
  window.setTimeout(() => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 50);
}