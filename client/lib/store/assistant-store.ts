import { create } from "zustand";

import type { AssistantMessage } from "@/lib/schemas/assistant.schema";
import type { AssistantRole, SectionId } from "@/lib/store/ui-store";

type AssistantState = {
  sessions: Record<string, AssistantMessage[]>;
  sendingBySession: Record<string, boolean>;
  errorBySession: Record<string, string | null>;

  ensureSession: (
    sessionKey: string,
    role: AssistantRole,
    welcomeMessage: string,
  ) => void;

  appendMessage: (sessionKey: string, message: AssistantMessage) => void;

  setSending: (sessionKey: string, isSending: boolean) => void;

  setError: (sessionKey: string, error: string | null) => void;

  clearSession: (sessionKey: string) => void;
};

export const useAssistantStore = create<AssistantState>((set) => ({
  sessions: {},
  sendingBySession: {},
  errorBySession: {},

  ensureSession: (sessionKey, role, welcomeMessage) =>
    set((state) => {
      if (state.sessions[sessionKey]) {
        return state;
      }

      const welcome: AssistantMessage = {
        id: createMessageId(),
        role: "assistant",
        assistantRole: role,
        content: welcomeMessage,
        createdAt: new Date().toISOString(),
        status: "sent",
      };

      return {
        sessions: {
          ...state.sessions,
          [sessionKey]: [welcome],
        },
      };
    }),

  appendMessage: (sessionKey, message) =>
    set((state) => ({
      sessions: {
        ...state.sessions,
        [sessionKey]: [...(state.sessions[sessionKey] ?? []), message],
      },
    })),

  setSending: (sessionKey, isSending) =>
    set((state) => ({
      sendingBySession: {
        ...state.sendingBySession,
        [sessionKey]: isSending,
      },
    })),

  setError: (sessionKey, error) =>
    set((state) => ({
      errorBySession: {
        ...state.errorBySession,
        [sessionKey]: error,
      },
    })),

  clearSession: (sessionKey) =>
    set((state) => {
      const sessions = { ...state.sessions };
      const sendingBySession = { ...state.sendingBySession };
      const errorBySession = { ...state.errorBySession };

      delete sessions[sessionKey];
      delete sendingBySession[sessionKey];
      delete errorBySession[sessionKey];

      return {
        sessions,
        sendingBySession,
        errorBySession,
      };
    }),
}));

export function buildAssistantSessionKey(
  projectId: string | null,
  contextId: SectionId | "report" | "home",
) {
  return `${projectId ?? "global"}:${contextId}`;
}

export function createMessageId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `message-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
