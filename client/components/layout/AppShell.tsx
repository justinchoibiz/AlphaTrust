import type { ReactNode } from "react";

import { ProjectRail } from "@/components/layout/ProjectRail";
import { AssistantPanel } from "@/components/layout/AssistantPanel";

import type { AssistantRole, SectionId } from "@/lib/store/ui-store";

type AppShellProps = {
  children: ReactNode;
  assistantRole?: AssistantRole;
  assistantContextId?: SectionId | "report" | "home";
};

export function AppShell({
  children,
  assistantRole,
  assistantContextId,
}: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-neutral-950 text-neutral-50">
      <ProjectRail />

      <main className="min-w-0 flex-1">{children}</main>

      <AssistantPanel
        roleOverride={assistantRole}
        contextIdOverride={assistantContextId}
      />
    </div>
  );
}
