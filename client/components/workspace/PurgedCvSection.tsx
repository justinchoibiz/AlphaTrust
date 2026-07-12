"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ShieldCheck } from "lucide-react";
import type { z } from "zod";

import type {
  AlphaCase,
  CvMethodSchema,
} from "@/lib/schemas/alpha-case.schema";
import { updateAlphaCase } from "@/lib/api/mock-api";
import { useUiStore } from "@/lib/store/ui-store";

import { WorkspaceSection } from "@/components/workspace/WorkspaceSection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type CvMethod = z.infer<typeof CvMethodSchema>;

type PurgedCvSectionProps = {
  projectId: string;
  alphaCase: AlphaCase;
};

const cvOptions: Array<{
  value: CvMethod;
  title: string;
  description: string;
  disabled: boolean;
}> = [
  {
    value: "train_test_split",
    title: "Train / Test Split",
    description: "Simple chronological holdout without purging.",
    disabled: true,
  },
  {
    value: "k_fold",
    title: "K-Fold",
    description: "Standard K-Fold that may leak overlapping financial labels.",
    disabled: true,
  },
  {
    value: "purged_k_fold",
    title: "Purged K-Fold",
    description: "Removes train observations overlapping with test labels.",
    disabled: true,
  },
  {
    value: "purged_k_fold_embargo",
    title: "Purged K-Fold + Embargo",
    description: "Adds both overlap removal and a post-test embargo interval.",
    disabled: false,
  },
];

export function PurgedCvSection({
  projectId,
  alphaCase,
}: PurgedCvSectionProps) {
  const [selectedMethod, setSelectedMethod] = useState<CvMethod>(
    alphaCase.cvMethod,
  );

  const queryClient = useQueryClient();
  const unlockAndFocusSection = useUiStore(
    (state) => state.unlockAndFocusSection,
  );

  const mutation = useMutation({
    mutationFn: () =>
      updateAlphaCase(projectId, {
        cvMethod: selectedMethod,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["alpha-case", projectId],
      });

      const nextSection =
        selectedMethod === "purged_k_fold_embargo"
          ? "embargo"
          : "bet-sizing";

      unlockAndFocusSection(nextSection);
      scrollToSection(nextSection);
    },
  });

  return (
    <WorkspaceSection
      id="purged-cv"
      title="Purged Cross-Validation"
      description="Configure validation controls for overlapping financial labels."
    >
      <div className="space-y-5">
        <div className="grid gap-3 md:grid-cols-2">
          {cvOptions.map((option) => {
            const isSelected = selectedMethod === option.value;

            return (
              <button
                key={option.value}
                type="button"
                disabled={option.disabled}
                onClick={() => setSelectedMethod(option.value)}
                className={[
                  "rounded-xl border p-4 text-left transition",
                  isSelected
                    ? "border-neutral-500 bg-neutral-800"
                    : "border-neutral-800 bg-neutral-950",
                  option.disabled
                    ? "cursor-not-allowed opacity-40"
                    : "hover:border-neutral-600",
                ].join(" ")}
              >
                <div className="flex items-center justify-between">
                  <ShieldCheck className="h-5 w-5 text-neutral-300" />

                  {option.disabled ? (
                    <Badge variant="outline">Future</Badge>
                  ) : isSelected ? (
                    <Badge>Selected</Badge>
                  ) : null}
                </div>

                <p className="mt-4 font-medium text-neutral-200">
                  {option.title}
                </p>
                <p className="mt-2 text-sm leading-5 text-neutral-500">
                  {option.description}
                </p>
              </button>
            );
          })}
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
          <p className="text-sm font-medium text-neutral-300">
            Purging Condition
          </p>
          <pre className="mt-3 font-mono text-sm text-neutral-400">
            Φᵢ ∩ Φⱼ ≠ ∅
          </pre>
          <p className="mt-3 text-sm leading-6 text-neutral-500">
            Train labels whose information intervals overlap with the test
            interval must be removed from the training fold.
          </p>
        </div>

        <Button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Saving..." : "Confirm Validation Method"}
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