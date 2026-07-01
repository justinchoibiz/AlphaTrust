import { AppShell } from "@/components/layout/AppShell";
import { ProjectList } from "@/components/home/ProjectList";

export default function HomePage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-8 py-10">
        <div className="mb-8">
          <p className="text-sm text-neutral-500">Project Home</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            AlphaTrust
          </h1>
          <p className="mt-3 max-w-2xl text-neutral-400">
            Create alpha cases, configure AFML diagnostics, and generate
            screenshot-friendly reliability reports.
          </p>
        </div>

        <ProjectList />
      </div>
    </AppShell>
  );
}