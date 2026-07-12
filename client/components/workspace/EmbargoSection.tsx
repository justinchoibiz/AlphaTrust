"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { AlphaCase } from "@/lib/schemas/alpha-case.schema";
import { updateAlphaCase } from "@/lib/api/mock-api";
import { useUiStore } from "@/lib/store/ui-store";

import { WorkspaceSection } from "@/components/workspace/WorkspaceSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type EmbargoSectionProps = {
  projectId: string;
  alphaCase: AlphaCase;
};

export function EmbargoSection({
  projectId,
  alphaCase,
}: EmbargoSectionProps) {
  const [embargoPct, setEmbargoPct] = useState(alphaCase.embargoPct);

  const queryClient = useQueryClient();
  const unlockAndFocusSection = useUiStore(
    (state) => state.unlockAndFocusSection,
  );

  const isValid = Number.isFinite(embargoPct) && embargoPct >= 0 && embargoPct <= 100;

  const mutation = useMutation({
    mutationFn: () =>
      updateAlphaCase(projectId, {
        embargoPct,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["alpha-case", projectId],
      });

      unlockAndFocusSection("bet-sizing");
      scrollToSection("bet-sizing");
    },
  });

  return (
    <WorkspaceSection
      id="embargo"
      title="Embargo"
      description="Set the post-test exclusion interval used to reduce leakage."
    >
      <div className="space-y-5">
        <div className="max-w-sm">
          <label className="text-sm font-medium text-neutral-300">
            Embargo ratio
          </label>

          <div className="mt-2 flex items-center gap-2">
            <Input
              type="number"
              min={0}
              max={100}
              step={0.1}
              value={embargoPct}
              onChange={(event) =>
                setEmbargoPct(Number(event.target.value))
              }
              className="border-neutral-800 bg-neutral-950"
            />
            <span className="text-sm text-neutral-500">%</span>
          </div>

          {!isValid && (
            <p className="mt-2 text-sm text-red-400">
              Enter a value between 0 and 100.
            </p>
          )}
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
          <p className="text-sm font-medium text-neutral-300">
            Default approximation
          </p>
          <pre className="mt-3 font-mono text-sm text-neutral-400">
            h ≈ 0.01T
          </pre>
          <p className="mt-3 text-sm leading-6 text-neutral-500">
            For the MVP, 1% of the total observation period is used as a simple
            diagnostic default rather than a fully optimized embargo rule.
          </p>
        </div>

        <Button
          onClick={() => mutation.mutate()}
          disabled={!isValid || mutation.isPending}
        >
          {mutation.isPending ? "Saving..." : "Confirm Embargo"}
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