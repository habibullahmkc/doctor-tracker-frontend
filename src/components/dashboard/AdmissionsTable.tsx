import { format, parseISO } from "date-fns";
import type { DashboardStats, StatsRange } from "@/types/dashboard";

/** Table view of the admissions series — the accessible, exact-numbers alternative to the chart. */
export function AdmissionsTable({ data, range }: { data: DashboardStats["admissions"]; range: StatsRange }) {
  const monthly = range === "12m";
  const rows = [...data].reverse(); // newest first

  return (
    <div className="h-[280px] overflow-y-auto rounded-xl border">
      <table className="w-full text-sm">
        <caption className="sr-only">Patient admissions per {monthly ? "month" : "day"}</caption>
        <thead className="sticky top-0 bg-slate-50 text-xs text-slate-600 uppercase">
          <tr>
            <th scope="col" className="px-4 py-2 text-left font-medium">
              {monthly ? "Month" : "Date"}
            </th>
            <th scope="col" className="px-4 py-2 text-right font-medium">
              Admissions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {rows.map((row) => (
            <tr key={row.date}>
              <th scope="row" className="px-4 py-2 text-left font-normal">
                {format(parseISO(monthly ? `${row.date}-01` : row.date), monthly ? "MMMM yyyy" : "EEE, d MMM yyyy")}
              </th>
              <td className="px-4 py-2 text-right font-medium tabular-nums">{row.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
