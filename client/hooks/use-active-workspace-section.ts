"use client";

import { useEffect } from "react";

import { WORKSPACE_SECTION_IDS } from "@/lib/constants/sections";
import { type SectionId, useUiStore } from "@/lib/store/ui-store";

export function useActiveWorkspaceSection() {
  const setActiveSectionId = useUiStore((state) => state.setActiveSectionId);
  const assistantLock = useUiStore((state) => state.assistantLock);

  useEffect(() => {
    const elements = WORKSPACE_SECTION_IDS.map((sectionId) =>
      document.getElementById(sectionId),
    ).filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (left, right) => right.intersectionRatio - left.intersectionRatio,
          )[0];

        if (!visibleEntry) {
          return;
        }
        if (assistantLock) {
          return;
        }
        window.requestAnimationFrame(() => {
          setActiveSectionId(visibleEntry.target.id as SectionId);
        });
      },
      {
        threshold: [0.2, 0.4, 0.6],
        rootMargin: "-15% 0px -55% 0px",
      },
    );

    elements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
    };
  }, [assistantLock, setActiveSectionId]);
}
