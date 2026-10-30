import { HeartPulse } from "lucide-react";
import { STATUS_COLORS } from "@/components/patients/PatientBadges";
import { PATIENT_STATUSES, type PatientStatus } from "@/lib/constants";
import { formatNumber } from "@/lib/format";
import type { NameValue } from "@/types/dashboard";

/** One whole split into 4 parts → a tall segmented bar with a labelled legend. */
export function StatusBreakdown({ data }: { data: NameValue<PatientStatus>[] }) {
  const counts = new Map(data.map((d) => [d.name, d.value]));
  const rows = PATIENT_STATUSES.map((status) => ({ status, value: counts.get(status) ?? 0 }));
  const total = rows.reduce((sum, row) => sum + row.value, 0);

  return (
    <div className="relative space-y-5">
      <HeartPulse className="pointer-events-none absolute -top-2 right-0 size-24 text-blue-100" aria-hidden />
      <div className="relative">
        <p className="text-4xl font-bold tracking-tight tabular-nums">{formatNumber(total)}</p>
        <p className="text-xs text-muted-foreground">patients in total</p>
      </div>

      {/* 2px surface gap between segments; rounded outer ends */}
      <div className="relative flex h-3 w-full gap-0.5 overflow-hidden rounded-full" role="img" aria-label="Patients by status">
        {rows
          .filter((row) => row.value > 0)
          .map((row) => (
            <div
              key={row.status}
              title={`${row.status}: ${row.value}`}
              className="h-full first:rounded-l-full last:rounded-r-full"
              style={{ width: `${(row.value / total) * 100}%`, backgroundColor: STATUS_COLORS[row.status] }}
            />
          ))}
      </div>

      <ul className="space-y-2.5">
        {rows.map((row) => (
          <li key={row.status} className="flex items-center gap-2.5 text-sm">
            <span className="size-2.5 shrink-0 rounded-sm" style={{ backgroundColor: STATUS_COLORS[row.status] }} aria-hidden />
            <span className="flex-1 text-foreground">{row.status}</span>
            <span className="font-medium tabular-nums">{formatNumber(row.value)}</span>
            <span className="w-10 text-right text-xs text-muted-foreground tabular-nums">
              {total ? Math.round((row.value / total) * 100) : 0}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
