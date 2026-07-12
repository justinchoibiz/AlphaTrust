import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { routes } from "@/lib/constants/routes";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LeaderboardPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-8 py-10">
        <div className="mb-8">
          <p className="text-sm text-neutral-500">Future Feature</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-50">
            Strategy Leaderboard
          </h1>
          <p className="mt-3 max-w-2xl text-neutral-400">
            Public or internal strategy ranking is intentionally excluded from
            the MVP. AlphaTrust currently focuses on alpha case creation, AFML
            diagnostics, and report generation.
          </p>
        </div>

        <Card className="border-neutral-800 bg-neutral-900 text-neutral-50">
          <CardHeader>
            <CardTitle>Out of Scope for MVP</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 text-sm text-neutral-400">
            <p>
              A leaderboard would require public/private permissions, ranking
              rules, strategy visibility, report sharing, and anti-overfitting
              disclaimers.
            </p>

            <p>
              Later, ranking should not rely only on Sharpe Ratio. It should
              include PSR, DSR, drawdown, leakage risk, and average uniqueness.
            </p>

            <Button asChild>
              <Link href={routes.home}>Back to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}