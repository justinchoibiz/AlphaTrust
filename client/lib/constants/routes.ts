// lib/constants/routes.ts

export const routes = {
  login: "/auth/login",
  home: "/home",
  leaderboard: "/leaderboard",

  projectWorkspace: (projectId: string) =>
    `/projects/${projectId}/workspace`,

  projectReport: (projectId: string) =>
    `/projects/${projectId}/report`,

  projectReportFromLeaderboard: (projectId: string) =>
    `/projects/${projectId}/report?source=leaderboard`,
} as const;