import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import type { Metadata } from "next";
import { Suspense } from "react";
import { queryKeys } from "@/lib/queryKeys";
import { serverGet } from "@/lib/server-api";
import type { DashboardStats, StatsRange } from "@/types/dashboard";
import { DashboardOverview } from "./DashboardOverview";

export const metadata: Metadata = { title: "Dashboard" };

const RANGES: StatsRange[] = ["7d", "30d", "12m"];

/**
 * Prefetches the dashboard on the server and hands it to
 * TanStack Query through HydrationBoundary: the first paint already has data,
 * and the client keeps caching/refetching as usual. If the API is slow or
 * asleep, prefetching is skipped and the client loads it instead.
 */
export default async function DashboardPage({ searchParams }: PageProps<"/dashboard">) {
  const { range: requested } = await searchParams;
  const range = RANGES.includes(requested as StatsRange) ? (requested as StatsRange) : "30d";

  const queryClient = new QueryClient();
  const stats = await serverGet<DashboardStats>(`/dashboard/stats?range=${range}`);
  if (stats) queryClient.setQueryData(queryKeys.dashboard.stats(range), stats);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense>
        <DashboardOverview />
      </Suspense>
    </HydrationBoundary>
  );
}
