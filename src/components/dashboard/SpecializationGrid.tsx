import Link from "next/link";
import type { Specialization } from "@/lib/constants";
import { SPECIALIZATION_ICONS } from "@/lib/medicalIcons";
import { cn } from "@/lib/utils";
import type { NameValue } from "@/types/dashboard";

/** Doctor count per specialization as labelled tiles; each opens the filtered doctors list. */
export function SpecializationGrid({ data }: { data: NameValue<Specialization>[] }) {
  if (!data.length) return <p className="py-10 text-center text-sm text-muted-foreground">No doctors yet</p>;

  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {data.map((row) => {
        const { icon: Icon, tone } = SPECIALIZATION_ICONS[row.name] ?? SPECIALIZATION_ICONS["General Medicine"];
        return (
          <li key={row.name}>
            <Link
              href={`/doctors?specialization=${encodeURIComponent(row.name)}`}
              className="flex items-center gap-3 rounded-xl border border-transparent bg-slate-50/70 px-3 py-2 transition-colors hover:border-blue-100 hover:bg-blue-50/60 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-full", tone)}>
                <Icon className="size-4" />
              </span>
              <span className="flex-1 truncate text-sm font-medium">{row.name}</span>
              <span className="rounded-md bg-white px-2 py-0.5 text-sm font-semibold tabular-nums shadow-xs">{row.value}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
