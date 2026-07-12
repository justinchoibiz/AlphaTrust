"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Braces, ChartNoAxesCombined, Database, Waves } from "lucide-react";
import type { z } from "zod";

import type {
  AlphaCase,
  FeatureSourceSchema,
} from "@/lib/schemas/alpha-case.schema";
import { updateAlphaCase } from "@/lib/api/mock-api";
import { useUiStore } from "@/lib/store/ui-store";

import { WorkspaceSection } from "@/components/workspace/WorkspaceSection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type FeatureSource = z.infer<typeof FeatureSourceSchema>;

type FeatureSectionProps = {
  projectId: string;
  alphaCase: AlphaCase;
};

const featureOptions: Array<{
  value: FeatureSource;
  title: string;
  description: string;
  disabled: boolean;
  icon: typeof Braces;
}> = [
  {
    value: "alpha_score",
    title: "Alpha Score",
    description: "WorldQuant-style engineered expression used as an ML feature.",
    disabled: false,
    icon: Braces,
  },
  {
    value: "price_features",
    title: "Price Features",
    description: "Returns, volatility, momentum, and other price-derived inputs.",
    disabled: true,
    icon: ChartNoAxesCombined,
  },
  {
    value: "volume_features",
    title: "Volume Features",
    description: "Volume imbalance and activity-derived inputs.",
    disabled: true,
    icon: Waves,
  },
  {
    value: "fundamental_features",
    title: "Fundamental Features",
    description: "Raw accounting fields used directly by the model.",
    disabled: true,
    icon: Database,
  },
];

export function FeatureSection({
  projectId,
  alphaCase,
}: FeatureSectionProps) {
  const [selectedFeature, setSelectedFeature] = useState<FeatureSource>(
    alphaCase.featureSource,
  );

  const queryClient = useQueryClient();
  const unlockAndFocusSection = useUiStore(
    (state) => state.unlockAndFocusSection,
  );

  const mutation = useMutation({
    mutationFn: () =>
      updateAlphaCase(projectId, {
        featureSource: selectedFeature,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["alpha-case", projectId],
      });

      const nextSection =
        selectedFeature === "alpha_score" ? "expression" : "labeling";

      unlockAndFocusSection(nextSection);
      scrollToSection(nextSection);
    },
  });

  return (
    <WorkspaceSection
      id="features"
      title="Features"
      description="Select the source used to construct the ML feature matrix."
    >
      <div className="space-y-5">
        <div className="grid gap-3 md:grid-cols-2">
          {featureOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedFeature === option.value;

            return (
              <button
                key={option.value}
                type="button"
                disabled={option.disabled}
                onClick={() => setSelectedFeature(option.value)}
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
            Feature Matrix Preview
          </p>
          <pre className="mt-3 overflow-x-auto font-mono text-sm text-neutral-400">
            Xᵢ = [alpha₁,ᵢ, alpha₂,ᵢ, ..., alphaₖ,ᵢ]
          </pre>
        </div>

        <Button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Saving..." : "Confirm Feature Source"}
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