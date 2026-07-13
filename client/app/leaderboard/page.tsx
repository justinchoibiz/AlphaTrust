"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Trophy } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLeaderboardEntries } from "@/lib/api/mock-api";
import { routes } from "@/lib/constants/routes";

export default function LeaderboardPage() {
  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: getLeaderboardEntries,
  });

  return (
    <AppShell assistantRole="report-assistant" assistantContextId="home">
      <div className="mx-auto max-w-6xl px-8 py-10">
        <div className="mb-8 flex items-start justify-between gap-6">
          <div>
            <p className="text-sm text-neutral-500">Public Strategy Ranking</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-50">
              Strategy Leaderboard
            </h1>
            <p className="mt-3 max-w-2xl text-neutral-400">
              Mock public ranking for AFML diagnostic reports. Scores combine
              PSR, DSR, Sharpe, average uniqueness, drawdown, and risk flags.
            </p>
          </div>

          <Button asChild variant="outline" className="border-neutral-800">
            <Link href={routes.home}>Back to home</Link>
          </Button>
        </div>

        {isLoading ? (
          <Card className="border-neutral-800 bg-neutral-900 text-neutral-50">
            <CardContent className="p-6 text-sm text-neutral-400">
              Loading leaderboard...
            </CardContent>
          </Card>
        ) : entries.length === 0 ? (
          <Card className="border-neutral-800 bg-neutral-900 text-neutral-50">
            <CardHeader>
              <CardTitle>No public strategies yet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-neutral-400">
              <p>
                Run a diagnostic first. Strategies need diagnostic results
                before they can appear on the leaderboard.
              </p>
              <Button asChild>
                <Link href={routes.home}>Open projects</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => {
              const riskLevel = getOverallRiskLevel(
                entry.diagnosticResult.risks,
              );

              return (
                <Link
                  key={entry.project.id}
                  href={routes.projectReportFromLeaderboard(entry.project.id)}
                  className="block"
                >
                  <Card className="border-neutral-800 bg-neutral-900 text-neutral-50 transition hover:border-neutral-700 hover:bg-neutral-800">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-6">
                        <div className="flex min-w-0 gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-950 text-lg font-semibold">
                            {entry.rank === 1 ? (
                              <Trophy className="h-5 w-5 text-yellow-300" />
                            ) : (
                              `#${entry.rank}`
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h2 className="text-lg font-semibold">
                                {entry.project.name}
                              </h2>
                              <RiskBadge risk={riskLevel} />
                              {entry.diagnosticResult.metrics.dsrPass && (
                                <Badge className="bg-emerald-500 text-emerald-950">
                                  DSR Pass
                                </Badge>
                              )}
                            </div>

                            <p className="mt-1 font-mono text-sm text-neutral-400">
                              {entry.alphaCase.expression}
                            </p>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
                              {entry.alphaCase.hypothesis ||
                                "No hypothesis provided."}
                            </p>
                          </div>
                        </div>

                        <ArrowRight className="mt-2 h-4 w-4 shrink-0 text-neutral-500" />
                      </div>

                      <div className="mt-5 grid gap-3 md:grid-cols-6">
                        <LeaderboardMetric
                          label="Score"
                          value={entry.score.toFixed(1)}
                        />
                        <LeaderboardMetric
                          label="Sharpe"
                          value={entry.diagnosticResult.metrics.sharpe.toFixed(
                            2,
                          )}
                        />
                        <LeaderboardMetric
                          label="PSR"
                          value={entry.diagnosticResult.metrics.psr.toFixed(2)}
                        />
                        <LeaderboardMetric
                          label="Avg uniq"
                          value={entry.diagnosticResult.metrics.averageUniqueness.toFixed(
                            2,
                          )}
                        />
                        <LeaderboardMetric
                          label="Return"
                          value={`${entry.diagnosticResult.metrics.returns.toFixed(
                            1,
                          )}%`}
                        />
                        <LeaderboardMetric
                          label="Drawdown"
                          value={`${entry.diagnosticResult.metrics.drawdown.toFixed(
                            1,
                          )}%`}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}

function LeaderboardMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3">
      <p className="text-xs text-neutral-500">{label}</p>
      <p className="mt-1 text-base font-semibold text-neutral-100">{value}</p>
    </div>
  );
}

function RiskBadge({ risk }: { risk: "low" | "medium" | "high" | "extreme" }) {
  const className =
    risk === "low"
      ? "border-emerald-800 bg-emerald-950 text-emerald-300"
      : risk === "medium"
        ? "border-yellow-800 bg-yellow-950 text-yellow-300"
        : risk === "high"
          ? "border-orange-800 bg-orange-950 text-orange-300"
          : "border-red-800 bg-red-950 text-red-300";

  return (
    <Badge variant="outline" className={className}>
      {risk} risk
    </Badge>
  );
}

function getOverallRiskLevel(risks: {
  leakageRisk: "low" | "medium" | "high" | "extreme";
  overfittingRisk: "low" | "medium" | "high" | "extreme";
  featureRedundancyRisk: "low" | "medium" | "high" | "extreme";
  dataRisk: "low" | "medium" | "high" | "extreme";
}) {
  const values = Object.values(risks);

  if (values.includes("extreme")) return "extreme";
  if (values.includes("high")) return "high";
  if (values.includes("medium")) return "medium";
  return "low";
}
