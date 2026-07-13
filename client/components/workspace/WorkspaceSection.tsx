"use client";

import { ReactNode } from "react";
import { CheckCircle2, Circle } from "lucide-react";

import type { SectionId } from "@/lib/store/ui-store";
import { useUiStore } from "@/lib/store/ui-store";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type WorkspaceSectionProps = {
  id: SectionId;
  title: string;
  description: string;
  children: ReactNode;
};

export function WorkspaceSection({
  id,
  title,
  description,
  children,
}: WorkspaceSectionProps) {
  const activeSectionId = useUiStore((state) => state.activeSectionId);
  const unlockedSectionIds = useUiStore((state) => state.unlockedSectionIds);
  const setActiveSectionId = useUiStore((state) => state.setActiveSectionId);

  const isActive = activeSectionId === id;
  const isUnlocked = unlockedSectionIds.includes(id);

  if (!isUnlocked) {
    return (
      <section id={id} className="scroll-mt-8">
        <Card className="border-neutral-800 bg-neutral-950 text-neutral-500">
          <CardHeader className="flex flex-row items-center gap-3">
            <Circle className="h-5 w-5" />
            <div>
              <CardTitle className="text-base text-neutral-500">
                {title}
              </CardTitle>
              <p className="mt-1 text-sm text-neutral-600">{description}</p>
            </div>
          </CardHeader>
        </Card>
      </section>
    );
  }

  return (
    <section id={id} className="scroll-mt-8">
      <Card
        className={
          isActive
            ? "border-neutral-600 bg-neutral-900 text-neutral-50"
            : "border-neutral-800 bg-neutral-950 text-neutral-300"
        }
      >
        <CardHeader
          onClick={() => setActiveSectionId(id)}
          className="flex cursor-pointer flex-row items-center gap-3"
        >
          <CheckCircle2
            className={
              isActive ? "h-5 w-5 text-emerald-400" : "h-5 w-5 text-neutral-600"
            }
          />

          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            <p className="mt-1 text-sm text-neutral-500">{description}</p>
          </div>
        </CardHeader>

        {isActive && <CardContent>{children}</CardContent>}
      </Card>
    </section>
  );
}
