"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Gauge, Percent, Scale } from "lucide-react";
import type { z } from "zod";

import type {
  AlphaCase,
  BetSizingMethodSchema,
} from "@/lib/schemas/alpha-case.schema";
import { updateAlphaCase } from "@/lib/api/mock-api";
import { useUiStore } from "@/lib/store/ui-store";

import { WorkspaceSection } from "@/components/workspace/WorkspaceSection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

type BetSizingMethod = z.infer<typeof BetSizingMethodSchema>;

type BetSizingSectionProps = {
  projectId: string;
  alphaCase: AlphaCase;
};

const betSizingOptions: Array<{
  value: BetSizingMethod;
  title: string;
  description: string;
  disabled: boolean;
  icon: typeof Gauge;
}> = [
  {
    value: "fixed_size",
    title: "Fixed Size",
    description: "Uses the same position size for every event.",
    disabled: true,
    icon: Scale,
  },
  {
    value: "alpha_score_proportional",
    title: "Alpha Score Proportional",
    description: "Scales positions directly from normalized alpha scores.",
    disabled: true,
    icon: Gauge,
  },
  {
    value: "probability_based",
    title: "Probability-Based",
    description: "Uses calibrated prediction confidence to determine bet size.",
    disabled: false,
    icon: Percent,
  },
];

export function BetSizingSection({
  projectId,
  alphaCase,
}: BetSizingSectionProps) {
  const [selectedMethod, setSelectedMethod] =
    useState<BetSizingMethod>(alphaCase.betSizingMethod);

  const [maxPositionPct, setMaxPositionPct] = useState(
    alphaCase.maxPositionSize * 100,
  );

  const queryClient = useQueryClient();
  const unlockAndFocusSection = useUiStore(
    (state) => state.unlockAndFocusSection,
  );

  const isValid =
    Number.isFinite(maxPositionPct) &&
    maxPositionPct > 0 &&
    maxPositionPct <= 100;

  const mutation = useMutation({
    mutationFn: () =>
      updateAlphaCase(projectId, {
        betSizingMethod: selectedMethod,
        maxPositionSize: maxPositionPct / 100,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["alpha-case", projectId],
      });

      unlockAndFocusSection("run-diagnostic");
      scrollToSection("run-diagnostic");
    },
  });

  return (
    <WorkspaceSection
      id="bet-sizing"
      title="Bet Sizing"
      description="Translate model confidence into a target portfolio position."
    >
      <div className="space-y-5">
        <div className="grid gap-3 md:grid-cols-3">
          {betSizingOptions.map((option) => {
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

        <div className="max-w-sm">
          <label className="text-sm font-medium text-neutral-300">
            Maximum position size
          </label>

          <div className="mt-2 flex items-center gap-2">
            <Input
              type="number"
              min={0.1}
              max={100}
              step={0.1}
              value={maxPositionPct}
              onChange={(event) =>
                setMaxPositionPct(Number(event.target.value))
              }
              className="border-neutral-800 bg-neutral-950"
            />
            <span className="text-sm text-neutral-500">%</span>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
          <pre className="font-mono text-sm text-neutral-400">
            target_weight = bet_size × max_position_size
          </pre>
          <p className="mt-3 text-sm leading-6 text-neutral-500">
            Alpha score and prediction probability are not equivalent. The
            model probability represents calibrated confidence; the alpha score
            remains an input feature.
          </p>
        </div>

        <Button
          onClick={() => mutation.mutate()}
          disabled={!isValid || mutation.isPending}
        >
          {mutation.isPending ? "Saving..." : "Confirm Bet Sizing"}
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