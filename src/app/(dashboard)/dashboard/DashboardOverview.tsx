"use client";

import { Activity, CalendarPlus, Stethoscope, Users } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { ErrorState } from "@/components/shared/States";
import { useDashboardStats } from "@/hooks/useDashboard";
import { formatNumber } from "@/lib/format";

/** Stat cards wired to live data. Charts are added in Phase 4. */
export function DashboardOverview() {
  const { data, isLoading, error, refetch } = useDashboardStats("30d");

  if (error && !data) {
    return (
      <div className="rounded-xl border bg-card">
        <ErrorState message={error.message} onRetry={() => refetch()} />
      </div>
    );
  }

  const totals = data?.totals;
  const monthDelta = totals ? totals.newThisMonth - totals.newLastMonth : 0;

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard
        label="Total doctors"
        icon={Stethoscope}
        loading={isLoading}
        value={formatNumber(totals?.doctors ?? 0)}
        hint={`${data?.bySpecialization.length ?? 0} specializations`}
      />
      <StatCard
        label="Total patients"
        icon={Users}
        tone="bg-blue-50 text-blue-600"
        loading={isLoading}
        value={formatNumber(totals?.patients ?? 0)}
        hint={`${formatNumber(totals?.activePatients ?? 0)} currently in care`}
      />
      <StatCard
        label="Avg. patients / doctor"
        icon={Activity}
        tone="bg-violet-50 text-violet-600"
        loading={isLoading}
        value={totals?.avgPatientsPerDoctor ?? 0}
        hint="Across all doctors"
      />
      <StatCard
        label="New this month"
        icon={CalendarPlus}
        tone="bg-amber-50 text-amber-600"
        loading={isLoading}
        value={formatNumber(totals?.newThisMonth ?? 0)}
        hint={`${monthDelta >= 0 ? "+" : ""}${monthDelta} vs last month`}
      />
    </div>
  );
}
