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
            Public strategy ranking is out of scope for the current MVP. Later,
            submitted AFML diagnostic reports can be ranked by DSR-adjusted
            reliability, PSR, drawdown risk, and average uniqueness.
          </p>
        </div>

        <Card className="border-neutral-800 bg-neutral-900 text-neutral-50">
          <CardHeader>
            <CardTitle>Out of Scope</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 text-sm text-neutral-400">
            <p>
              The current MVP focuses on alpha case creation, guided diagnostic
              workflow, mock AFML result generation, and report presentation.
            </p>

            <Button asChild>
              <Link href={routes.home}>Back to home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}