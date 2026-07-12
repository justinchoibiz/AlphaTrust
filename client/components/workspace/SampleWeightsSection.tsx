"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Scale } from "lucide-react";
import type { z } from "zod";

import type {
  AlphaCase,
  SampleWeightMethodSchema,
} from "@/lib/schemas/alpha-case.schema";
import { updateAlphaCase } from "@/lib/api/mock-api";
import { useUiStore } from "@/lib/store/ui-store";

import { WorkspaceSection } from "@/components/workspace/WorkspaceSection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type SampleWeightMethod = z.infer<typeof SampleWeightMethodSchema>;

type SampleWeightsSectionProps = {
  projectId: string;
  alphaCase: AlphaCase;
};

const weightOptions: Array<{
  value: SampleWeightMethod;
  title: string;
  description: string;
  disabled: boolean;
}> = [
  {
    value: "none",
    title: "None",
    description: "Treat every observation as equally informative.",
    disabled: true,
  },
  {
    value: "average_uniqueness",
    title: "Average Uniqueness",
    description: "Downweights events that overlap with many concurrent labels.",
    disabled: false,
  },
  {
    value: "return_attribution",
    title: "Return Attribution",
    description: "Weights observations by attributed absolute returns.",
    disabled: true,
  },
  {
    value: "time_decay",
    title: "Time Decay",
    description: "Assigns more weight to recent observations.",
    disabled: true,
  },
  {
    value: "class_weights",
    title: "Class Weights",
    description: "Compensates for imbalanced label classes.",
    disabled: true,
  },
];

export function SampleWeightsSection({
  projectId,
  alphaCase,
}: SampleWeightsSectionProps) {
  const [selectedMethod, setSelectedMethod] =
    useState<SampleWeightMethod>(alphaCase.sampleWeightMethod);

  const queryClient = useQueryClient();
  const unlockAndFocusSection = useUiStore(
    (state) => state.unlockAndFocusSection,
  );

  const mutation = useMutation({
    mutationFn: () =>
      updateAlphaCase(projectId, {
        sampleWeightMethod: selectedMethod,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["alpha-case", projectId],
      });

      unlockAndFocusSection("purged-cv");
      scrollToSection("purged-cv");
    },
  });

  return (
    <WorkspaceSection
      id="sample-weights"
      title="Sample Weights"
      description="Control how overlapping and redundant labeled events contribute to model training."
    >
      <div className="space-y-5">
        <div className="grid gap-3 md:grid-cols-2">
          {weightOptions.map((option) => {
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
                  <Scale className="h-5 w-5 text-neutral-300" />

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
            AFML Weighting Formulas
          </p>

          <div className="mt-3 space-y-2 overflow-x-auto font-mono text-sm text-neutral-400">
            <p>cₜ = Σᵢ 1ₜ,ᵢ</p>
            <p>uₜ,ᵢ = 1ₜ,ᵢ · cₜ⁻¹</p>
            <p>ūᵢ = (Σₜ uₜ,ᵢ)(Σₜ 1ₜ,ᵢ)⁻¹</p>
          </div>
        </div>

        <Button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Saving..." : "Confirm Sample Weights"}
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