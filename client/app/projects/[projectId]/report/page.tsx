import { DiagnosticReport } from "@/components/report/DiagnosticReport";  

type ReportPageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function ReportPage({ params }: ReportPageProps) {
  const { projectId } = await params;

  return <DiagnosticReport projectId={projectId} />;
}