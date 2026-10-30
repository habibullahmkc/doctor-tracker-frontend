"use client";

import {
  Activity,
  ArrowRight,
  CalendarPlus,
  ChartColumn,
  ChartSpline,
  ClipboardList,
  Table2,
  HeartPulse,
  Stethoscope,
  UserRound,
  Users,
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { useState } from "react";
import { AdmissionsTable } from "@/components/dashboard/AdmissionsTable";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { ConditionList } from "@/components/dashboard/ConditionList";
import { DoctorRankList } from "@/components/dashboard/DoctorRankList";
import { RangeToggle } from "@/components/dashboard/RangeToggle";
import { RecentPatients } from "@/components/dashboard/RecentPatients";
import { SpecializationGrid } from "@/components/dashboard/SpecializationGrid";
import { StatusBreakdown } from "@/components/dashboard/StatusBreakdown";
import { TrendStatCard } from "@/components/dashboard/TrendStatCard";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { ErrorState } from "@/components/shared/States";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardStats } from "@/hooks/useDashboard";
import { formatNumber } from "@/lib/format";
import { percentChange } from "@/lib/stats";
import type { DashboardStats } from "@/types/dashboard";

// Recharts is the heaviest dependency; load it in its own chunk so the rest of the dashboard renders first.
const AdmissionsChart = dynamic(() => import("@/components/dashboard/AdmissionsChart").then((m) => m.AdmissionsChart), {
  ssr: false,
  loading: () => <Skeleton className="h-[280px] w-full rounded-xl" />,
});

const RANGE_LABEL = { "7d": "last 7 days", "30d": "last 30 days", "12m": "last 12 months" } as const;
const rangeParser = parseAsStringLiteral(["7d", "30d", "12m"] as const).withDefault("30d");

function useCardData(data: DashboardStats | undefined) {
  const trends = data?.trends ?? [];
  const last = trends[trends.length - 1];
  const prev = trends[trends.length - 2];
  return {
    doctors: trends.map((t) => t.doctors),
    patients: trends.map((t) => t.patients),
    avg: trends.map((t) => t.avgPerDoctor),
    admissions: trends.map((t) => t.newPatients),
    newDoctorsThisMonth: last?.newDoctors ?? 0,
    patientsChange: last && prev ? percentChange(last.patients, prev.patients) : undefined,
    avgChange: last && prev ? percentChange(last.avgPerDoctor, prev.avgPerDoctor) : undefined,
    newChange: data ? percentChange(data.totals.newThisMonth, data.totals.newLastMonth) : undefined,
  };
}

export function DashboardOverview() {
  const [range, setRange] = useQueryState("range", rangeParser.withOptions({ history: "replace", scroll: false }));
  const [asTable, setAsTable] = useState(false);
  const { data, isLoading, isFetching, error, refetch } = useDashboardStats(range);
  const cards = useCardData(data);

  if (error && !data) {
    return (
      <div className="space-y-6">
        <WelcomeBanner />
        <div className="rounded-2xl border bg-card">
          <ErrorState message={error.message} onRetry={() => refetch()} />
        </div>
      </div>
    );
  }

  const totals = data?.totals;
  const admissionsInRange = data?.admissions.reduce((sum, d) => sum + d.count, 0) ?? 0;
  const loading = isLoading && !data;

  return (
    <div className="space-y-6">
      <WelcomeBanner />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <TrendStatCard
          label="Total doctors"
          icon={UserRound}
          tone="bg-blue-100 text-blue-700"
          color="#2563eb"
          series={cards.doctors}
          loading={loading}
          value={formatNumber(totals?.doctors ?? 0)}
          change={{
            text: `${cards.newDoctorsThisMonth} new this month`,
            direction: cards.newDoctorsThisMonth > 0 ? "up" : "flat",
          }}
        />
        <TrendStatCard
          label="Total patients"
          icon={Users}
          tone="bg-rose-100 text-rose-700"
          color="#e11d48"
          series={cards.patients}
          loading={loading}
          value={formatNumber(totals?.patients ?? 0)}
          change={cards.patientsChange}
        />
        <TrendStatCard
          label="Avg. patients / doctor"
          icon={Activity}
          tone="bg-violet-100 text-violet-700"
          color="#7c3aed"
          series={cards.avg}
          loading={loading}
          value={totals?.avgPatientsPerDoctor ?? 0}
          change={cards.avgChange}
        />
        <TrendStatCard
          label="New this month"
          icon={CalendarPlus}
          tone="bg-emerald-100 text-emerald-700"
          color="#059669"
          series={cards.admissions}
          loading={loading}
          value={formatNumber(totals?.newThisMonth ?? 0)}
          change={cards.newChange}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <ChartCard
          className="lg:col-span-2"
          title="Patient admissions"
          icon={ChartColumn}
          description={
            loading ? "Loading…" : `${formatNumber(admissionsInRange)} admissions in the ${RANGE_LABEL[data?.range ?? range]}`
          }
          action={
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon-sm"
                className="rounded-full"
                aria-pressed={asTable}
                aria-label={asTable ? "Show admissions as a chart" : "Show admissions as a table"}
                onClick={() => setAsTable((v) => !v)}
              >
                {asTable ? <ChartSpline /> : <Table2 />}
              </Button>
              <RangeToggle value={range} onChange={setRange} />
            </div>
          }
          loading={loading}
        >
          <div className={isFetching ? "opacity-60 transition-opacity" : "transition-opacity"}>
            {data &&
              (asTable ? (
                <AdmissionsTable data={data.admissions} range={data.range} />
              ) : (
                <AdmissionsChart data={data.admissions} range={data.range} />
              ))}
          </div>
        </ChartCard>

        <ChartCard
          title="Patients by status"
          description="Current care status"
          icon={ClipboardList}
          iconTone="bg-emerald-50 text-emerald-700"
          loading={loading}
          skeletonHeight={240}
        >
          {data && <StatusBreakdown data={data.byStatus} />}
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Patients per doctor"
          description="Top 10 doctors by patient count — select one to open their profile"
          icon={Users}
          loading={loading}
          skeletonHeight={420}
        >
          {data && <DoctorRankList doctors={data.patientsPerDoctor} />}
        </ChartCard>

        <ChartCard
          title="Patients by condition"
          description="Distribution across all patients"
          icon={HeartPulse}
          iconTone="bg-cyan-50 text-cyan-700"
          loading={loading}
          skeletonHeight={420}
          action={
            <Button variant="link" size="sm" asChild className="h-auto px-0">
              <Link href="/patients">
                View all <ArrowRight />
              </Link>
            </Button>
          }
        >
          {data && <ConditionList data={data.byCondition} />}
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Doctors by specialization"
          description="Team composition"
          icon={Stethoscope}
          loading={loading}
          skeletonHeight={260}
        >
          {data && <SpecializationGrid data={data.bySpecialization} />}
        </ChartCard>

        <ChartCard
          title="Recent admissions"
          description="Latest patients admitted"
          icon={CalendarPlus}
          iconTone="bg-indigo-50 text-indigo-700"
          loading={loading}
          skeletonHeight={260}
          action={
            <Button variant="link" size="sm" asChild className="h-auto px-0">
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
