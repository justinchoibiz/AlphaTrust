import { z } from "zod";

import { type AssistantRole, type SectionId } from "@/lib/store/ui-store";

export const AssistantMessageRoleSchema = z.enum([
  "user",
  "assistant",
  "system",
]);

export const AssistantMessageStatusSchema = z.enum([
  "sent",
  "pending",
  "error",
]);

export const AssistantActionSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.enum([
    "fill-input",
    "navigate",
    "apply-expression",
    "rerun-diagnostic",
  ]),
  payload: z.record(z.string(), z.unknown()).optional(),
});

export const AssistantMessageSchema = z.object({
  id: z.string(),
  role: AssistantMessageRoleSchema,
  content: z.string(),
  assistantRole: z.string().optional(),
  createdAt: z.string(),
  status: AssistantMessageStatusSchema.default("sent"),
  suggestions: z.array(z.string()).optional(),
  actions: z.array(AssistantActionSchema).optional(),
});

export const AssistantRequestSchema = z.object({
  conversationId: z.string(),
  projectId: z.string().nullable(),
  sectionId: z.string(),
  assistantRole: z.string(),
  message: z.string().min(1),
  context: z.record(z.string(), z.unknown()).optional(),
});

export const AssistantResponseSchema = z.object({
  message: z.string(),
  assistantRole: z.string(),
  suggestions: z.array(z.string()).default([]),
  actions: z.array(AssistantActionSchema).default([]),
});

export type AssistantMessage = z.infer<typeof AssistantMessageSchema>;
export type AssistantAction = z.infer<typeof AssistantActionSchema>;
export type AssistantRequest = z.infer<typeof AssistantRequestSchema>;
export type AssistantResponse = z.infer<typeof AssistantResponseSchema>;

export type TypedAssistantRequest = Omit<
  AssistantRequest,
  "assistantRole" | "sectionId"
> & {
  assistantRole: AssistantRole;
  sectionId: SectionId | "report" | "home";
};
