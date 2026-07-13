import type { AssistantRole } from "@/lib/store/ui-store";

type AssistantRoleConfig = {
  label: string;
  description: string;
  welcomeMessage: string;
  starterPrompts: string[];
};

export const assistantRoleConfig: Record<AssistantRole, AssistantRoleConfig> = {
  conductor: {
    label: "Conductor",
    description: "Guides the project workflow and recommends the next step.",
    welcomeMessage:
      "I can summarize the current Alpha Case and guide you to the next configuration step.",
    starterPrompts: [
      "What should I configure next?",
      "Summarize this Alpha Case.",
    ],
  },

  "data-assistant": {
    label: "Data Assistant",
    description: "Explains dataset fields, coverage, and data-quality risks.",
    welcomeMessage:
      "I can explain the selected dataset, required fields, and point-in-time data risks.",
    starterPrompts: [
      "What fields are included?",
      "What are the main data risks?",
    ],
  },

  "data-structure-assistant": {
    label: "Data Structure Assistant",
    description: "Explains time, volume, and dollar bars.",
    welcomeMessage:
      "I can explain how the selected bar structure changes the statistical properties of the dataset.",
    starterPrompts: [
      "Why use time bars for the MVP?",
      "When should dollar bars be used?",
    ],
  },

  "feature-assistant": {
    label: "Feature Assistant",
    description: "Explains feature sources and the ML feature matrix.",
    welcomeMessage:
      "I can explain how alpha scores and raw inputs become model features.",
    starterPrompts: [
      "Is an alpha score a probability?",
      "What should be included in X_train?",
    ],
  },

  "expression-assistant": {
    label: "Expression Assistant",
    description: "Explains and validates WorldQuant-style expressions.",
    welcomeMessage:
      "Enter an alpha expression and I will explain its direction, required fields, and potential biases.",
    starterPrompts: [
      "Explain -rank(liabilities/assets).",
      "Suggest a sector-neutral variant.",
    ],
  },

  "labeling-assistant": {
    label: "Labeling Assistant",
    description: "Explains how future outcomes become supervised labels.",
    welcomeMessage:
      "I can explain the difference between an alpha feature and its future-outcome label.",
    starterPrompts: [
      "Why is the expression not the label?",
      "Compare fixed horizon and triple barrier.",
    ],
  },

  "triple-barrier-assistant": {
    label: "Triple Barrier Assistant",
    description: "Explains upper, lower, and vertical barriers.",
    welcomeMessage:
      "I can explain how the three barriers produce y = 1, 0, or -1.",
    starterPrompts: [
      "Explain each barrier.",
      "How should I select barrier values?",
    ],
  },

  "sample-weight-assistant": {
    label: "Sample Weight Assistant",
    description: "Explains concurrency, uniqueness, and sample weighting.",
    welcomeMessage:
      "I can explain why overlapping financial events should not receive equal effective weight.",
    starterPrompts: [
      "What is average uniqueness?",
      "Why do overlapping labels matter?",
    ],
  },

  "validation-assistant": {
    label: "Validation Assistant",
    description: "Explains purging, embargo, and leakage control.",
    welcomeMessage:
      "I can identify temporal leakage risks and explain Purged K-Fold with embargo.",
    starterPrompts: [
      "Why does normal K-Fold leak?",
      "What does the embargo ratio mean?",
    ],
  },

  "bet-sizing-assistant": {
    label: "Bet Sizing Assistant",
    description: "Explains how confidence becomes a portfolio position.",
    welcomeMessage:
      "I can explain the difference between alpha strength, probability, and target position size.",
    starterPrompts: [
      "Why use probability-based sizing?",
      "How is target weight calculated?",
    ],
  },

  "backtest-assistant": {
    label: "Backtest Assistant",
    description: "Checks whether the diagnostic is ready to run.",
    welcomeMessage:
      "I can review the selected pipeline and identify missing or inconsistent settings before execution.",
    starterPrompts: [
      "Review the current configuration.",
      "What will the diagnostic calculate?",
    ],
  },

  "diagnostic-assistant": {
    label: "Diagnostic Assistant",
    description: "Interprets metrics, warnings, and reliability risks.",
    welcomeMessage:
      "I can interpret Sharpe, PSR, DSR, average uniqueness, and validation risks.",
    starterPrompts: ["Interpret these results.", "What should I fix first?"],
  },

  "report-assistant": {
    label: "Report Assistant",
    description: "Converts diagnostics into a clear research report.",
    welcomeMessage:
      "I can summarize the findings, limitations, and recommended fixes for this report.",
    starterPrompts: ["Summarize the report.", "Explain the main limitation."],
  },
};
