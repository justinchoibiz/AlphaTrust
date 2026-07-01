import type { Project, ProjectTemplate } from "@/lib/schemas/project.schema";
import type { AlphaCase } from "@/lib/schemas/alpha-case.schema";
import type { DiagnosticResult } from "@/lib/schemas/diagnostic.schema";
import { mockAlphaCases, mockProjects } from "@/lib/mock/mock-projects";
import { mockDiagnosticResults } from "@/lib/mock/mock-results";

let projects: Project[] = [...mockProjects];
let alphaCases: AlphaCase[] = [...mockAlphaCases];
let diagnosticResults: DiagnosticResult[] = [...mockDiagnosticResults];

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export async function loginWithTestAccount(email: string, password: string) {
  await delay();

  if (email === "test@test.com" && password === "testtest") {
    return {
      id: "u001",
      email,
      name: "Test User",
    };
  }

  throw new Error("Invalid email or password.");
}

export async function getProjects() {
  await delay();
  return projects;
}

export async function getProject(projectId: string) {
  await delay();

  const project = projects.find((item) => item.id === projectId);

  if (!project) {
    throw new Error("Project not found.");
  }

  return project;
}

export async function createProject(input: {
  name: string;
  template: ProjectTemplate;
}) {
  await delay();

  const now = new Date().toISOString();

  const project: Project = {
    id: `p${String(projects.length + 1).padStart(3, "0")}`,
    name: input.name,
    template: input.template,
    status: "draft",
    createdAt: now,
    updatedAt: now,
  };

  const alphaCase: AlphaCase = {
    projectId: project.id,

    hypothesis:
      input.template === "fundamental_ratio"
        ? "Low-leverage firms may outperform high-leverage firms."
        : "",

    universe: "US Large Cap Demo",
    holdingPeriodDays: 20,

    dataMode: "default_demo_dataset",
    barType: "time_bars",

    featureSource: "alpha_score",
    expression:
      input.template === "momentum"
        ? "rank(ts_delta(close, 20))"
        : input.template === "sector_neutral"
          ? "group_neutralize(-rank(liabilities/assets), sector)"
          : "-rank(liabilities/assets)",

    labelingMethod: "triple_barrier",
    verticalBarrierDays: 10,
    upperBarrierPct: 2,
    lowerBarrierPct: -2,

    sampleWeightMethod: "average_uniqueness",
    cvMethod: "purged_k_fold_embargo",
    embargoPct: 1,

    betSizingMethod: "probability_based",
    maxPositionSize: 0.1,
  };

  projects = [project, ...projects];
  alphaCases = [alphaCase, ...alphaCases];

  return project;
}

export async function getAlphaCase(projectId: string) {
  await delay();

  const alphaCase = alphaCases.find((item) => item.projectId === projectId);

  if (!alphaCase) {
    throw new Error("Alpha case not found.");
  }

  return alphaCase;
}

export async function updateAlphaCase(
  projectId: string,
  patch: Partial<AlphaCase>,
) {
  await delay();

  alphaCases = alphaCases.map((item) =>
    item.projectId === projectId ? { ...item, ...patch } : item,
  );

  const updated = alphaCases.find((item) => item.projectId === projectId);

  if (!updated) {
    throw new Error("Alpha case not found.");
  }

  return updated;
}

export async function runDiagnostic(projectId: string) {
  await delay(800);

  let result = diagnosticResults.find((item) => item.projectId === projectId);

  if (!result) {
    result = {
      projectId,

      probabilities: {
        pUp: 0.58,
        pFlat: 0.17,
        pDown: 0.25,
      },

      metrics: {
        returns: -12.73,
        drawdown: 50.5,
        turnover: 1.53,
        sharpe: -1.78,
        psr: 0.08,
        dsrPass: false,
        averageUniqueness: 0.42,
      },

      risks: {
        leakageRisk: "medium",
        overfittingRisk: "high",
        featureRedundancyRisk: "medium",
        dataRisk: "high",
      },

      warnings: [
        "The expression may contain sector bias.",
        "Fundamental data may be stale or affected by reporting lag.",
        "The observed Sharpe is negative and does not pass the DSR threshold.",
      ],

      recommendedFixes: [
        "Try group_rank(liabilities/assets, sector).",
        "Try group_neutralize(-rank(liabilities/assets), sector).",
        "Use point-in-time fundamentals if available.",
      ],
    };

    diagnosticResults = [result, ...diagnosticResults];
  }

  projects = projects.map((item) =>
    item.id === projectId
      ? {
          ...item,
          status: "diagnostic_completed",
          updatedAt: new Date().toISOString(),
        }
      : item,
  );

  return result;
}

export async function getDiagnosticResult(projectId: string) {
  await delay();

  const result = diagnosticResults.find((item) => item.projectId === projectId);

  if (!result) {
    throw new Error("Diagnostic result not found.");
  }

  return result;
}