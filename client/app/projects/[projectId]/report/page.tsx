import { DiagnosticReport } from "@/components/report/DiagnosticReport";

type ReportPageProps = {
  params: Promise<{
    projectId: string;
  }>;
  searchParams: Promise<{
    source?: string;
    viewer?: string;
  }>;
};

export default async function ReportPage({
  params,
  searchParams,
}: ReportPageProps) {
  const { projectId } = await params;
  const query = await searchParams;
  const viewerMode =
    query.viewer === "public" || query.source === "leaderboard"
      ? "public"
      : "private";

  return <DiagnosticReport projectId={projectId} viewerMode={viewerMode} />;
}
