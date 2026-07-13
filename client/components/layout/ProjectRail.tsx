"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { getProjects } from "@/lib/api/mock-api";
import { routes } from "@/lib/constants/routes";
import { Button } from "@/components/ui/button";
import { ProjectCreateModal } from "@/components/home/ProjectCreateModal";

export function ProjectRail() {
  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  return (
    <aside className="sticky top-0 flex h-screen w-16 shrink-0 flex-col items-center border-r border-neutral-800 bg-neutral-950 py-4">
      <Link
        href={routes.home}
        className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-sm font-bold text-neutral-950"
      >
        A
      </Link>

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={routes.projectWorkspace(project.id)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 text-sm font-semibold text-neutral-200 hover:bg-neutral-800"
            title={project.name}
          >
            {project.name.slice(0, 1).toUpperCase()}
          </Link>
        ))}
        <ProjectCreateModal
          trigger={
            <Button
              type="button"
              size="icon"
              variant="outline"
              className="mt-4 h-10 w-10 border-neutral-800 bg-neutral-900 text-neutral-200 hover:bg-neutral-800"
              aria-label="Create project"
            >
              <Plus className="h-4 w-4" />
            </Button>
          }
        />
      </div>
    </aside>
  );
}
