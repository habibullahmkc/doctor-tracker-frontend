"use client";

import { Activity, ArrowRight, CalendarPlus, Stethoscope, Users } from "lucide-react";
import Link from "next/link";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { AdmissionsChart } from "@/components/dashboard/AdmissionsChart";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { RangeToggle } from "@/components/dashboard/RangeToggle";
import { RankedBars } from "@/components/dashboard/RankedBars";
import { RecentPatients } from "@/components/dashboard/RecentPatients";
import { StatusBreakdown } from "@/components/dashboard/StatusBreakdown";
import { StatCard } from "@/components/shared/StatCard";
import { ErrorState } from "@/components/shared/States";
import { Button } from "@/components/ui/button";
import { useDashboardStats } from "@/hooks/useDashboard";
import { formatNumber } from "@/lib/format";

const RANGE_LABEL = { "7d": "last 7 days", "30d": "last 30 days", "12m": "last 12 months" } as const;
const rangeParser = parseAsStringLiteral(["7d", "30d", "12m"] as const).withDefault("30d");

export function DashboardOverview() {
  const [range, setRange] = useQueryState("range", rangeParser.withOptions({ history: "replace", scroll: false }));
  const { data, isLoading, isFetching, error, refetch } = useDashboardStats(range);

  if (error && !data) {
    return (
      <div className="rounded-xl border bg-card">
        <ErrorState message={error.message} onRetry={() => refetch()} />
      </div>
    );
  }

  const totals = data?.totals;
  const monthDelta = totals ? totals.newThisMonth - totals.newLastMonth : 0;
  const admissionsInRange = data?.admissions.reduce((sum, d) => sum + d.count, 0) ?? 0;
  const loading = isLoading && !data;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total doctors"
          icon={Stethoscope}
          loading={loading}
          value={formatNumber(totals?.doctors ?? 0)}
          hint={`${data?.bySpecialization.length ?? 0} specializations`}
        />
        <StatCard
          label="Total patients"
          icon={Users}
          tone="bg-blue-50 text-blue-600"
          loading={loading}
          value={formatNumber(totals?.patients ?? 0)}
          hint={`${formatNumber(totals?.activePatients ?? 0)} currently in care`}
        />
        <StatCard
          label="Avg. patients / doctor"
          icon={Activity}
          tone="bg-violet-50 text-violet-600"
          loading={loading}
          value={totals?.avgPatientsPerDoctor ?? 0}
          hint="Across all doctors"
        />
        <StatCard
          label="New this month"
          icon={CalendarPlus}
          tone="bg-amber-50 text-amber-600"
          loading={loading}
          value={formatNumber(totals?.newThisMonth ?? 0)}
          hint={
            <span className={monthDelta >= 0 ? "text-emerald-700" : "text-destructive"}>
              {monthDelta >= 0 ? "▲" : "▼"} {Math.abs(monthDelta)} vs last month
            </span>
          }
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <ChartCard
          className="lg:col-span-2"
          title="Patient admissions"
          description={
            loading ? "Loading…" : `${formatNumber(admissionsInRange)} admissions in the ${RANGE_LABEL[data?.range ?? range]}`
          }
          action={<RangeToggle value={range} onChange={setRange} />}
          loading={loading}
        >
          <div className={isFetching ? "opacity-60 transition-opacity" : "transition-opacity"}>
            {data && <AdmissionsChart data={data.admissions} range={data.range} />}
          </div>
        </ChartCard>

        <ChartCard title="Patients by status" description="Current care status" loading={loading} skeletonHeight={220}>
          {data && <StatusBreakdown data={data.byStatus} />}
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Patients per doctor"
          description="Top 10 doctors by patient count — select one to open their profile"
          loading={loading}
          skeletonHeight={360}
        >
          {data && (
            <RankedBars
              unit="patients"
              total={totals?.patients}
              items={data.patientsPerDoctor.map((d) => ({
                key: d.doctorId,
                label: d.name,
                sublabel: d.specialization,
                value: d.patients,
                href: `/doctors/${d.doctorId}`,
              }))}
            />
          )}
        </ChartCard>

        <ChartCard title="Patients by condition" description="Distribution across all patients" loading={loading} skeletonHeight={360}>
          {data && (
            <RankedBars
              unit="patients"
              items={data.byCondition.map((c) => ({ key: c.name, label: c.name, value: c.value }))}
            />
          )}
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Doctors by specialization" description="Team composition" loading={loading} skeletonHeight={360}>
          {data && (
            <RankedBars
              unit="doctors"
              items={data.bySpecialization.map((s) => ({ key: s.name, label: s.name, value: s.value }))}
            />
          )}
        </ChartCard>

        <ChartCard
          title="Recent admissions"
          description="Latest patients admitted"
          loading={loading}
          skeletonHeight={360}
          action={
            <Button variant="ghost" size="sm" asChild>
              <Link href="/patients">
                View all <ArrowRight />
              </Link>
            </Button>
          }
        >
          {data && <RecentPatients patients={data.recentPatients} />}
        </ChartCard>
      </div>
    </div>
  );
}
