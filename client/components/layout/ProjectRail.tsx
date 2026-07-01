"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { getProjects } from "@/lib/api/mock-api";
import { routes } from "@/lib/constants/routes";
import { Button } from "@/components/ui/button";

export function ProjectRail() {
  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  return (
    <aside className="flex w-16 flex-col items-center border-r border-neutral-800 bg-neutral-950 py-4">
      <Link
        href={routes.home}
        className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-sm font-bold text-neutral-950"
      >
        A
      </Link>

      <div className="flex flex-1 flex-col gap-3">
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
      </div>

      <Button
        size="icon"
        variant="outline"
        className="h-10 w-10 border-neutral-800 bg-neutral-900 text-neutral-200 hover:bg-neutral-800"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </aside>
  );
}