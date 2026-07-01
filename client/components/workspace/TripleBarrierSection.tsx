"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { AlphaCase } from "@/lib/schemas/alpha-case.schema";
import { updateAlphaCase } from "@/lib/api/mock-api";
import { useUiStore } from "@/lib/store/ui-store";

import { WorkspaceSection } from "@/components/workspace/WorkspaceSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type TripleBarrierSectionProps = {
  projectId: string;
  alphaCase: AlphaCase;
};

export function TripleBarrierSection({
  projectId,
  alphaCase,
}: TripleBarrierSectionProps) {
  const [verticalBarrierDays, setVerticalBarrierDays] = useState(
    alphaCase.verticalBarrierDays,
  );
  const [upperBarrierPct, setUpperBarrierPct] = useState(alphaCase.upperBarrierPct);
  const [lowerBarrierPct, setLowerBarrierPct] = useState(alphaCase.lowerBarrierPct);

  const queryClient = useQueryClient();
  const unlockAndFocusSection = useUiStore((state) => state.unlockAndFocusSection);

  const mutation = useMutation({
    mutationFn: () =>
      updateAlphaCase(projectId, {
        verticalBarrierDays,
        upperBarrierPct,
        lowerBarrierPct,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alpha-case", projectId] });
      unlockAndFocusSection("run-diagnostic");
      document.getElementById("run-diagnostic")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    },
  });

  return (
    <WorkspaceSection
      id="triple-barrier"
      title="Triple Barrier"
      description="Configure future outcome labels: y ∈ {-1, 0, 1}."
    >
      <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-3">
          <Field
            label="Vertical Barrier Days"
            value={verticalBarrierDays}
            onChange={setVerticalBarrierDays}
          />
          <Field
            label="Upper Barrier %"
            value={upperBarrierPct}
            onChange={setUpperBarrierPct}
          />
          <Field
            label="Lower Barrier %"
            value={lowerBarrierPct}
            onChange={setLowerBarrierPct}
          />
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 text-sm text-neutral-400">
          Triple-barrier labeling converts future price paths into supervised
          labels. Upper barrier first means <span className="text-emerald-400">+1</span>,
          lower barrier first means <span className="text-red-400">-1</span>, and
          vertical barrier without hit means <span className="text-neutral-300">0</span>.
        </div>

        <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
          {mutation.isPending ? "Saving..." : "Save Triple Barrier"}
        </Button>
      </div>
    </WorkspaceSection>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-neutral-300">{label}</label>
      <Input
        type="number"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-2 border-neutral-800 bg-neutral-950 text-neutral-100"
      />
    </div>
  );
}