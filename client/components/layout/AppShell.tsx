import { ReactNode } from "react";
import { ProjectRail } from "@/components/layout/ProjectRail";
import { AssistantPanel } from "@/components/layout/AssistantPanel";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-neutral-950 text-neutral-50">
      <ProjectRail />

      <main className="min-w-0 flex-1">
        {children}
      </main>

      <AssistantPanel />
    </div>
  );
}