"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { dashboardService } from "@/services/dashboard.service";
import type { StatsRange } from "@/types/dashboard";

export function useDashboardStats(range: StatsRange) {
  return useQuery({
    queryKey: queryKeys.dashboard.stats(range),
    queryFn: async () => (await dashboardService.stats(range)).data,
    placeholderData: keepPreviousData,
  });
}
