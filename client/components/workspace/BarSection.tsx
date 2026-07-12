"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Clock3, DollarSign, Gauge } from "lucide-react";

import type {
  AlphaCase,
  BarTypeSchema,
} from "@/lib/schemas/alpha-case.schema";
import type { z } from "zod";

import { updateAlphaCase } from "@/lib/api/mock-api";
import { useUiStore } from "@/lib/store/ui-store";

import { WorkspaceSection } from "@/components/workspace/WorkspaceSection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type BarType = z.infer<typeof BarTypeSchema>;

type BarSectionProps = {
  projectId: string;
  alphaCase: AlphaCase;
};

const barOptions: Array<{
  value: BarType;
  title: string;
  description: string;
  disabled: boolean;
  icon: typeof Clock3;
}> = [
  {
    value: "time_bars",
    title: "Time Bars",
    description: "Samples observations at fixed time intervals.",
    disabled: false,
    icon: Clock3,
  },
  {
    value: "volume_bars",
    title: "Volume Bars",
    description: "Samples whenever a predefined amount of volume is traded.",
    disabled: true,
    icon: Gauge,
  },
  {
    value: "dollar_bars",
    title: "Dollar Bars",
    description: "Samples whenever a predefined dollar value is traded.",
    disabled: true,
    icon: DollarSign,
  },
];

export function BarSection({
  projectId,
  alphaCase,
}: BarSectionProps) {
  const [selectedBarType, setSelectedBarType] = useState<BarType>(
    alphaCase.barType,
  );

  const queryClient = useQueryClient();
  const unlockAndFocusSection = useUiStore(
    (state) => state.unlockAndFocusSection,
  );

  const mutation = useMutation({
    mutationFn: () =>
      updateAlphaCase(projectId, {
        barType: selectedBarType,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["alpha-case", projectId],
      });

      unlockAndFocusSection("features");
      scrollToSection("features");
    },
  });

  return (
    <WorkspaceSection
      id="bars"
      title="Bars"
      description="Select how raw observations are sampled into market bars."
    >
      <div className="space-y-5">
        <div className="grid gap-3 md:grid-cols-3">
          {barOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedBarType === option.value;

            return (
              <button
                key={option.value}
                type="button"
                disabled={option.disabled}
                onClick={() => setSelectedBarType(option.value)}
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

        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 text-sm leading-6 text-neutral-400">
          Time bars are retained as the MVP default because the demo dataset
          does not contain sufficient tick-level information for robust volume
          or dollar-bar construction.
        </div>

        <Button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Saving..." : "Confirm Bar Type"}
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