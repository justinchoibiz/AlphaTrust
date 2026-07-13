"use client";

import { type ReactNode, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { createProject } from "@/lib/api/mock-api";
import { routes } from "@/lib/constants/routes";
import { PROJECT_TEMPLATE_OPTIONS } from "@/lib/constants/templates";
import type { ProjectTemplate } from "@/lib/schemas/project.schema";
import { useUiStore } from "@/lib/store/ui-store";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type ProjectCreateModalProps = {
  trigger: ReactNode;
};

export function ProjectCreateModal({ trigger }: ProjectCreateModalProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const resetWorkspaceNavigation = useUiStore(
    (state) => state.resetWorkspaceNavigation,
  );

  const [open, setOpen] = useState(false);
  const [name, setName] = useState(PROJECT_TEMPLATE_OPTIONS[0].defaultName);
  const [template, setTemplate] = useState<ProjectTemplate>("empty");

  const selectedTemplate = useMemo(
    () =>
      PROJECT_TEMPLATE_OPTIONS.find((option) => option.value === template) ??
      PROJECT_TEMPLATE_OPTIONS[0],
    [template],
  );

  const mutation = useMutation({
    mutationFn: () =>
      createProject({
        name: name.trim(),
        template,
      }),
    onSuccess: async (project) => {
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
      resetWorkspaceNavigation();
      setOpen(false);
      toast.success("Project created");
      router.push(routes.projectWorkspace(project.id));
    },
    onError: (cause) => {
      const message =
        cause instanceof Error ? cause.message : "Failed to create project.";

      toast.error(message);
    },
  });

  const canSubmit = name.trim().length > 0 && !mutation.isPending;

  function handleOpenChange(nextOpen: boolean) {
    if (mutation.isPending) {
      return;
    }

    setOpen(nextOpen);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    mutation.mutate();
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="border border-neutral-800 bg-neutral-950 text-neutral-50 sm:max-w-xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Alpha Case</DialogTitle>
            <DialogDescription>
              Choose a starting template. You can revise the workflow after the
              project opens.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-5 space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="project-name"
                className="text-sm font-medium text-neutral-300"
              >
                Project Name
              </label>
              <Input
                id="project-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Name this alpha case"
                className="h-10 border-neutral-800 bg-neutral-900 text-neutral-50"
                autoFocus
              />
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-neutral-300">
                  Template
                </p>
                <p className="mt-1 text-xs text-neutral-500">
                  MVP templates only seed the mock alpha case. They do not run
                  a real engine yet.
                </p>
              </div>

              <div className="grid gap-3">
                {PROJECT_TEMPLATE_OPTIONS.map((option) => {
                  const isSelected = option.value === template;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setTemplate(option.value);

                        if (
                          !name.trim() ||
                          name === selectedTemplate.defaultName
                        ) {
                          setName(option.defaultName);
                        }
                      }}
                      className={
                        isSelected
                          ? "rounded-xl border border-neutral-500 bg-neutral-900 p-4 text-left"
                          : "rounded-xl border border-neutral-800 bg-neutral-950 p-4 text-left transition hover:border-neutral-700 hover:bg-neutral-900"
                      }
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-medium text-neutral-100">
                            {option.label}
                          </p>
                          <p className="mt-1 text-sm leading-6 text-neutral-500">
                            {option.description}
                          </p>
                        </div>

                        {isSelected && <Badge>Selected</Badge>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6 border-neutral-800 bg-neutral-950">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={mutation.isPending}
              className="border-neutral-800 bg-neutral-900 text-neutral-200 hover:bg-neutral-800"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!canSubmit}>
              {mutation.isPending && (
                <LoaderCircle className="mr-1 h-4 w-4 animate-spin" />
              )}
              Create Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
