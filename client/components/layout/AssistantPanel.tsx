"use client";

import { useUiStore } from "@/lib/store/ui-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const roleCopy: Record<string, string> = {
  conductor: "Project-level navigation and next-action guidance.",
  "data-assistant": "Explains dataset fields, coverage, and data risks.",
  "data-structure-assistant": "Explains bar types and event sampling.",
  "feature-assistant": "Explains raw features, alpha scores, and feature matrix.",
  "expression-assistant": "Explains WorldQuant-style alpha expressions.",
  "labeling-assistant": "Explains supervised labels and triple-barrier outcomes.",
  "triple-barrier-assistant": "Explains upper, lower, and vertical barriers.",
  "sample-weight-assistant": "Explains concurrency, uniqueness, and sample weights.",
  "validation-assistant": "Explains purging, embargo, and leakage risk.",
  "bet-sizing-assistant": "Explains probability-based position sizing.",
  "backtest-assistant": "Checks whether the diagnostic is ready to run.",
  "diagnostic-assistant": "Interprets diagnostic result and warnings.",
  "report-assistant": "Helps convert diagnostics into a report.",
};

export function AssistantPanel() {
  const role = useUiStore((state) => state.getAssistantRole());

  return (
    <aside className="hidden w-80 border-l border-neutral-800 bg-neutral-950 p-4 xl:block">
      <Card className="border-neutral-800 bg-neutral-900 text-neutral-50">
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-base">Assistant</CardTitle>
            <Badge variant="secondary" className="capitalize">
              {role.replaceAll("-", " ")}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 text-sm text-neutral-300">
          <p>{roleCopy[role]}</p>

          <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-3 text-xs text-neutral-400">
            MVP mode: rule-based contextual assistant. No LLM call.
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}