import { create } from "zustand";

export type SectionId =
  | "project-summary"
  | "dataset"
  | "bars"
  | "features"
  | "expression"
  | "labeling"
  | "triple-barrier"
  | "sample-weights"
  | "purged-cv"
  | "embargo"
  | "bet-sizing"
  | "run-diagnostic"
  | "result";

export type AssistantRole =
  | "conductor"
  | "data-assistant"
  | "data-structure-assistant"
  | "feature-assistant"
  | "expression-assistant"
  | "labeling-assistant"
  | "triple-barrier-assistant"
  | "sample-weight-assistant"
  | "validation-assistant"
  | "bet-sizing-assistant"
  | "backtest-assistant"
  | "diagnostic-assistant"
  | "report-assistant";

const sectionRoleMap: Record<SectionId, AssistantRole> = {
  "project-summary": "conductor",
  dataset: "data-assistant",
  bars: "data-structure-assistant",
  features: "feature-assistant",
  expression: "expression-assistant",
  labeling: "labeling-assistant",
  "triple-barrier": "triple-barrier-assistant",
  "sample-weights": "sample-weight-assistant",
  "purged-cv": "validation-assistant",
  embargo: "validation-assistant",
  "bet-sizing": "bet-sizing-assistant",
  "run-diagnostic": "backtest-assistant",
  result: "diagnostic-assistant",
};

type UiState = {
  activeProjectId: string | null;
  activeSectionId: SectionId;
  unlockedSectionIds: SectionId[];
  isAssistantOpen: boolean;

  setActiveProjectId: (projectId: string) => void;
  setActiveSectionId: (sectionId: SectionId) => void;
  unlockSection: (sectionId: SectionId) => void;
  unlockAndFocusSection: (sectionId: SectionId) => void;
  setAssistantOpen: (isOpen: boolean) => void;
  getAssistantRole: () => AssistantRole;
};

export const useUiStore = create<UiState>((set, get) => ({
  activeProjectId: null,
  activeSectionId: "project-summary",
  unlockedSectionIds: ["project-summary"],
  isAssistantOpen: true,

  setActiveProjectId: (projectId) => set({ activeProjectId: projectId }),

  setActiveSectionId: (sectionId) => set({ activeSectionId: sectionId }),

  unlockSection: (sectionId) =>
    set((state) => ({
      unlockedSectionIds: state.unlockedSectionIds.includes(sectionId)
        ? state.unlockedSectionIds
        : [...state.unlockedSectionIds, sectionId],
    })),

  unlockAndFocusSection: (sectionId) =>
    set((state) => ({
      activeSectionId: sectionId,
      unlockedSectionIds: state.unlockedSectionIds.includes(sectionId)
        ? state.unlockedSectionIds
        : [...state.unlockedSectionIds, sectionId],
    })),

  setAssistantOpen: (isAssistantOpen) => set({ isAssistantOpen }),

  getAssistantRole: () => sectionRoleMap[get().activeSectionId],
}));