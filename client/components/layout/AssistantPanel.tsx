"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import {
  Bot,
  LoaderCircle,
  MessageSquareText,
  Send,
  Trash2,
  X,
} from "lucide-react";

import {
  getAssistantRoleForSection,
  type AssistantRole,
  type SectionId,
  useUiStore,
} from "@/lib/store/ui-store";

import {
  buildAssistantSessionKey,
  createMessageId,
  useAssistantStore,
} from "@/lib/store/assistant-store";

import { assistantRoleConfig } from "@/lib/constants/assistant";
import { sendAssistantMessage } from "@/lib/api/assistant-api";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { AssistantMessage } from "@/lib/schemas/assistant.schema";

type AssistantPanelProps = {
  roleOverride?: AssistantRole;
  contextIdOverride?: SectionId | "report" | "home";
};

const EMPTY_MESSAGES: AssistantMessage[] = [];

export function AssistantPanel({
  roleOverride,
  contextIdOverride,
}: AssistantPanelProps) {
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const activeProjectId = useUiStore((state) => state.activeProjectId);
  const activeSectionId = useUiStore((state) => state.activeSectionId);
  const isAssistantOpen = useUiStore((state) => state.isAssistantOpen);
  const setAssistantOpen = useUiStore((state) => state.setAssistantOpen);
  const setAssistantLock = useUiStore((state) => state.setAssistantLock);

  const role = roleOverride ?? getAssistantRoleForSection(activeSectionId);

  const contextId = contextIdOverride ?? activeSectionId;

  const config = assistantRoleConfig[role];

  const sessionKey = useMemo(
    () => buildAssistantSessionKey(activeProjectId, contextId),
    [activeProjectId, contextId],
  );

  const messages =
  useAssistantStore(
    (state) => state.sessions[sessionKey]
  ) ?? EMPTY_MESSAGES;

  const isSending =
  useAssistantStore(
    state=>state.sendingBySession[sessionKey]
  ) ?? false

  const error =
  useAssistantStore(
    state=>state.errorBySession[sessionKey]
  ) ?? null

  const ensureSession = useAssistantStore((state) => state.ensureSession);
  const appendMessage = useAssistantStore((state) => state.appendMessage);
  const setSending = useAssistantStore((state) => state.setSending);
  const setError = useAssistantStore((state) => state.setError);
  const clearSession = useAssistantStore((state) => state.clearSession);

  useEffect(() => {
    ensureSession(sessionKey, role, config.welcomeMessage);
  }, [config.welcomeMessage, ensureSession, role, sessionKey]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isSending]);

  async function handleSend(overrideMessage?: string) {
    const message = overrideMessage?.trim() ?? draft.trim();

    if (!message || isSending) {
      return;
    }

    setDraft("");
    setError(sessionKey, null);

    setAssistantLock(true);

    appendMessage(sessionKey, {
      id: createMessageId(),
      role: "user",
      content: message,
      createdAt: new Date().toISOString(),
      status: "sent",
    });

    setSending(sessionKey, true);

    try {
      const response = await sendAssistantMessage({
        conversationId: sessionKey,
        projectId: activeProjectId,
        sectionId: contextId,
        assistantRole: role,
        message,
        context: {
          sectionLabel: config.label,
          source: "assistant-panel",
        },
      });

      appendMessage(sessionKey, {
        id: createMessageId(),
        role: "assistant",
        assistantRole: role,
        content: response.message,
        suggestions: response.suggestions,
        actions: response.actions,
        createdAt: new Date().toISOString(),
        status: "sent",
      });
    } catch (cause) {
      const message =
        cause instanceof Error ? cause.message : "Unknown assistant error.";

      setError(sessionKey, message);
    } finally {
      setSending(sessionKey, false);
      setTimeout(()=>{
        setAssistantLock(false);
        },300);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSend();
    }
  }

  if (!isAssistantOpen) {
    return (
      <Button
        type="button"
        size="icon"
        onClick={() => setAssistantOpen(true)}
        className="fixed right-4 top-4 z-50 hidden rounded-full xl:inline-flex"
        aria-label="Open assistant"
      >
        <MessageSquareText className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <aside className="sticky top-0 hidden h-screen w-[380px] shrink-0 flex-col border-l border-neutral-800 bg-neutral-950 xl:flex">
      <header className="border-b border-neutral-800 px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-neutral-700 bg-neutral-900">
              <Bot className="h-4 w-4 text-neutral-200" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-neutral-100">{config.label}</p>

                <Badge variant="secondary" className="text-[10px]">
                  {contextId.replaceAll("-", " ")}
                </Badge>
              </div>

              <p className="mt-1 text-xs leading-5 text-neutral-500">
                {config.description}
              </p>
            </div>
          </div>

          <div className="flex shrink-0">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => clearSession(sessionKey)}
              aria-label="Clear conversation"
            >
              <Trash2 className="h-4 w-4" />
            </Button>

            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => setAssistantOpen(false)}
              aria-label="Close assistant"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-4 p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={
                message.role === "user"
                  ? "ml-10 rounded-2xl rounded-br-md bg-neutral-100 px-4 py-3 text-sm leading-6 text-neutral-950"
                  : "mr-6 rounded-2xl rounded-bl-md border border-neutral-800 bg-neutral-900 px-4 py-3 text-sm leading-6 text-neutral-300"
              }
            >
              <p className="whitespace-pre-wrap">{message.content}</p>

              {message.role === "assistant" &&
                message.suggestions &&
                message.suggestions.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {message.suggestions.slice(0, 3).map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => void handleSend(suggestion)}
                        className="rounded-full border border-neutral-700 px-3 py-1.5 text-left text-xs text-neutral-400 transition hover:border-neutral-500 hover:text-neutral-200"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
            </div>
          ))}

          {isSending && (
            <div className="mr-20 flex items-center gap-2 rounded-2xl rounded-bl-md border border-neutral-800 bg-neutral-900 px-4 py-3 text-sm text-neutral-500">
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Analyzing current context...
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-900 bg-red-950/30 p-3 text-xs text-red-300">
              {error}
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      <footer className="border-t border-neutral-800 p-4">
        {messages.length <= 1 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {config.starterPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => setDraft(prompt)}
                className="rounded-full border border-neutral-800 px-3 py-1.5 text-xs text-neutral-500 transition hover:border-neutral-600 hover:text-neutral-300"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        <div className="rounded-2xl border border-neutral-700 bg-neutral-900 p-2 focus-within:border-neutral-500">
          <Textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask ${config.label}...`}
            disabled={isSending}
            className="min-h-20 resize-none border-0 bg-transparent text-sm shadow-none focus-visible:ring-0"
          />

          <div className="flex items-center justify-between px-1 pb-1">
            <p className="text-[10px] text-neutral-600">
              Enter to send · Shift+Enter for new line
            </p>

            <Button
              type="button"
              size="icon"
              onClick={() => void handleSend()}
              disabled={!draft.trim() || isSending}
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <p className="mt-2 text-center text-[10px] text-neutral-700">
          Mock transport · Provider-independent UI
        </p>
      </footer>
    </aside>
  );
}
