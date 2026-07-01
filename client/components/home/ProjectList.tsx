"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";

import { getProjects } from "@/lib/api/mock-api";
import { routes } from "@/lib/constants/routes";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ProjectList() {
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  if (isLoading) {
    return <p className="text-neutral-400">Loading projects...</p>;
  }

  return (
    <div className="grid gap-4">
      {projects.map((project) => (
        <Link key={project.id} href={routes.projectWorkspace(project.id)}>
          <Card className="border-neutral-800 bg-neutral-900 text-neutral-50 transition hover:bg-neutral-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">{project.name}</CardTitle>
                <p className="mt-1 text-sm text-neutral-500">
                  {project.template.replaceAll("_", " ")}
                </p>
              </div>

              <ArrowRight className="h-4 w-4 text-neutral-500" />
            </CardHeader>

            <CardContent className="flex items-center gap-3">
              <Badge variant="outline" className="border-neutral-700 text-neutral-300">
                {project.status.replaceAll("_", " ")}
              </Badge>
              <span className="text-xs text-neutral-500">
                Updated {new Date(project.updatedAt).toLocaleDateString()}
              </span>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}