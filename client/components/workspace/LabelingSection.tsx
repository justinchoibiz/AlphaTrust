"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Flag, GitBranch, Timer } from "lucide-react";
import type { z } from "zod";

import type {
  AlphaCase,
  LabelingMethodSchema,
} from "@/lib/schemas/alpha-case.schema";
import { updateAlphaCase } from "@/lib/api/mock-api";
import { useUiStore } from "@/lib/store/ui-store";

import { WorkspaceSection } from "@/components/workspace/WorkspaceSection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type LabelingMethod = z.infer<typeof LabelingMethodSchema>;

type LabelingSectionProps = {
  projectId: string;
  alphaCase: AlphaCase;
};

const labelingOptions: Array<{
  value: LabelingMethod;
  title: string;
  description: string;
  disabled: boolean;
  icon: typeof Flag;
}> = [
  {
    value: "fixed_horizon",
    title: "Fixed Horizon",
    description: "Assigns labels from returns measured after a fixed period.",
    disabled: true,
    icon: Timer,
  },
  {
    value: "triple_barrier",
    title: "Triple Barrier",
    description: "Labels events by which upper, lower, or vertical barrier is hit.",
    disabled: false,
    icon: Flag,
  },
  {
    value: "meta_labeling",
    title: "Meta-Labeling",
    description: "Learns whether to take a primary model's proposed side.",
    disabled: true,
    icon: GitBranch,
  },
];

export function LabelingSection({
  projectId,
  alphaCase,
}: LabelingSectionProps) {
  const [selectedMethod, setSelectedMethod] = useState<LabelingMethod>(
    alphaCase.labelingMethod,
  );

  const queryClient = useQueryClient();
  const unlockAndFocusSection = useUiStore(
    (state) => state.unlockAndFocusSection,
  );

  const mutation = useMutation({
    mutationFn: () =>
      updateAlphaCase(projectId, {
        labelingMethod: selectedMethod,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["alpha-case", projectId],
      });

      const nextSection =
        selectedMethod === "triple_barrier"
          ? "triple-barrier"
          : "sample-weights";

      unlockAndFocusSection(nextSection);
      scrollToSection(nextSection);
    },
  });

  return (
    <WorkspaceSection
      id="labeling"
      title="Labeling"
      description="Select how future outcomes are converted into supervised labels."
    >
      <div className="space-y-5">
        <div className="grid gap-3 md:grid-cols-3">
          {labelingOptions.map((option) => {
            const Icon = option.icon;
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
                  <Icon className="h-5 w-5 text-neutral-300" />

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
            Label Classes
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="outline">y = 1 · upper barrier</Badge>
            <Badge variant="outline">y = 0 · vertical barrier</Badge>
            <Badge variant="outline">y = -1 · lower barrier</Badge>
          </div>
        </div>

        <Button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Saving..." : "Confirm Labeling Method"}
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