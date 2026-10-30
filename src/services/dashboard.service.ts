import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api";
import type { DashboardStats, StatsRange } from "@/types/dashboard";

export const dashboardService = {
  stats: (range: StatsRange) => api<ApiResponse<DashboardStats>>(`/dashboard/stats?range=${range}`),
};
