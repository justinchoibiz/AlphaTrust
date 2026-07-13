import {
  AssistantRequestSchema,
  AssistantResponseSchema,
  type AssistantRequest,
  type AssistantResponse,
} from "@/lib/schemas/assistant.schema";

import { assistantRoleConfig } from "@/lib/constants/assistant";
import type { AssistantRole } from "@/lib/store/ui-store";

export interface AssistantTransport {
  send(request: AssistantRequest): Promise<AssistantResponse>;
}

class MockAssistantTransport implements AssistantTransport {
  async send(request: AssistantRequest): Promise<AssistantResponse> {
    await delay(500);

    const role = request.assistantRole as AssistantRole;
    const config = assistantRoleConfig[role];

    return {
      assistantRole: role,
      message: createMockReply(role, request.message),
      suggestions: config.starterPrompts,
      actions: [],
    };
  }
}

class HttpAssistantTransport implements AssistantTransport {
  constructor(private readonly endpoint: string) {}

  async send(request: AssistantRequest): Promise<AssistantResponse> {
    const response = await fetch(this.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Assistant request failed: ${response.status}`);
    }

    const payload: unknown = await response.json();

    return AssistantResponseSchema.parse(payload);
  }
}

const transport: AssistantTransport =
  process.env.NEXT_PUBLIC_ASSISTANT_MODE === "api"
    ? new HttpAssistantTransport(
        process.env.NEXT_PUBLIC_ASSISTANT_ENDPOINT ?? "/api/assistant",
      )
    : new MockAssistantTransport();

export async function sendAssistantMessage(
  input: AssistantRequest,
): Promise<AssistantResponse> {
  const request = AssistantRequestSchema.parse(input);
  const response = await transport.send(request);

  return AssistantResponseSchema.parse(response);
}

function createMockReply(role: AssistantRole, userMessage: string): string {
  const subject = userMessage.trim();

  const roleReplies: Record<AssistantRole, string> = {
    conductor:
      "The current workflow should proceed through the unlocked workspace sections in order.",

    "data-assistant":
      "The demo dataset supports the current expression, but it does not guarantee point-in-time correctness, survivorship control, or realistic reporting lag.",

    "data-structure-assistant":
      "Time bars are suitable for the current MVP because the mock dataset does not contain sufficient transaction-level data for robust volume or dollar bars.",

    "feature-assistant":
      "The alpha expression becomes an engineered feature in X_train. It is not itself a future-outcome label or calibrated probability.",

    "expression-assistant":
      "This expression should be checked for direction, required fields, sector exposure, reporting lag, and unstable outliers.",

    "labeling-assistant":
      "The label must be generated from the future price path, independently of the alpha expression used as an input feature.",

    "triple-barrier-assistant":
      "The upper and lower barriers define favorable and adverse outcomes, while the vertical barrier limits the event horizon.",

    "sample-weight-assistant":
      "Average uniqueness reduces the effective weight of events whose information intervals overlap with many other labels.",

    "validation-assistant":
      "Purging removes overlapping training observations, while embargo excludes observations immediately after the test interval.",

    "bet-sizing-assistant":
      "Prediction probability represents calibrated confidence, while the alpha score represents relative signal strength.",

    "backtest-assistant":
      "Before running, verify that the feature, label, sample-weight, validation, and bet-sizing settings are mutually consistent.",

    "diagnostic-assistant":
      "Interpret the result through reliability rather than raw Sharpe alone. PSR, DSR, overlap, leakage, and drawdown must be considered together.",

    "report-assistant":
      "The final report should separate observed performance, reliability risks, methodological limitations, and recommended corrections.",
  };

  return `${roleReplies[role]}\n\nYour question: “${subject}”`;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
