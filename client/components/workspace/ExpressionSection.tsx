"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { AlphaCase } from "@/lib/schemas/alpha-case.schema";
import { updateAlphaCase } from "@/lib/api/mock-api";
import { useUiStore } from "@/lib/store/ui-store";

import { WorkspaceSection } from "@/components/workspace/WorkspaceSection";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

type ExpressionSectionProps = {
  projectId: string;
  alphaCase: AlphaCase;
};

export function ExpressionSection({ projectId, alphaCase }: ExpressionSectionProps) {
  const [expression, setExpression] = useState(alphaCase.expression);

  const queryClient = useQueryClient();
  const unlockAndFocusSection = useUiStore((state) => state.unlockAndFocusSection);

  const mutation = useMutation({
    mutationFn: () => updateAlphaCase(projectId, { expression }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alpha-case", projectId] });
      unlockAndFocusSection("triple-barrier");
      document.getElementById("triple-barrier")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    },
  });

  return (
    <WorkspaceSection
      id="expression"
      title="Expression"
      description="Define a WorldQuant-style alpha expression."
    >
      <div className="space-y-5">
        <div>
          <label className="text-sm font-medium text-neutral-300">
            Alpha Score Expression
          </label>
          <Textarea
            value={expression}
            onChange={(event) => setExpression(event.target.value)}
            className="mt-2 min-h-28 border-neutral-800 bg-neutral-950 font-mono text-sm text-neutral-100"
          />
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
          <p className="text-sm font-medium text-neutral-300">
            Parsed Interpretation
          </p>
          <p className="mt-2 text-sm text-neutral-400">
            This expression is interpreted as a low-leverage long / high-leverage
            short signal if it uses <code>liabilities/assets</code> with a negative rank.
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="outline" className="border-neutral-700 text-neutral-300">
              required: liabilities
            </Badge>
            <Badge variant="outline" className="border-neutral-700 text-neutral-300">
              required: assets
            </Badge>
            <Badge variant="outline" className="border-neutral-700 text-neutral-300">
              risk: sector bias
            </Badge>
          </div>
        </div>

        <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
          {mutation.isPending ? "Saving..." : "Save Expression"}
        </Button>
      </div>
    </WorkspaceSection>
  );
}