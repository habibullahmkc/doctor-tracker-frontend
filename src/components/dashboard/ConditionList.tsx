import Link from "next/link";
import type { Condition } from "@/lib/constants";
import { CONDITION_ICONS } from "@/lib/medicalIcons";
import { cn } from "@/lib/utils";
import type { NameValue } from "@/types/dashboard";

/** Ranked bars with a direct label, count and share on every row. Rows open the filtered patient list. */
export function ConditionList({ data }: { data: NameValue<Condition>[] }) {
  if (!data.length) return <p className="py-10 text-center text-sm text-muted-foreground">No patients yet</p>;
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <ol className="space-y-1">
      {data.map((row) => {
        const { icon: Icon, tone } = CONDITION_ICONS[row.name] ?? CONDITION_ICONS.Fever;
        const share = total ? ((row.value / total) * 100).toFixed(1) : "0";
        return (
          <li key={row.name}>
            <Link
              href={`/patients?condition=${encodeURIComponent(row.name)}`}
              className="group -mx-2 flex items-center gap-3 rounded-xl px-2 py-1.5 transition-colors hover:bg-cyan-50/70 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-full", tone)}>
                <Icon className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
                  <span className="truncate font-medium text-foreground">{row.name}</span>
                  <span className="flex shrink-0 items-baseline gap-3 tabular-nums">
                    <span className="font-semibold">{row.value}</span>
                    <span className="w-11 text-right text-xs text-muted-foreground">{share}%</span>
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-cyan-50">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-600 to-teal-400 transition-[width] duration-500"
                    style={{ width: `${Math.max((row.value / max) * 100, 3)}%` }}
                  />
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
