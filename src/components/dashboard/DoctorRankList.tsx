import Link from "next/link";
import { DoctorAvatar } from "@/components/doctors/DoctorAvatar";
import type { DashboardStats } from "@/types/dashboard";

/** Ranked horizontal bars (largest first, one hue) — each row links to the doctor's profile. */
export function DoctorRankList({ doctors }: { doctors: DashboardStats["patientsPerDoctor"] }) {
  if (!doctors.length) return <p className="py-10 text-center text-sm text-muted-foreground">No patients yet</p>;
  const max = Math.max(...doctors.map((d) => d.patients), 1);

  return (
    <ol className="space-y-1">
      {doctors.map((d) => (
        <li key={d.doctorId}>
          <Link
            href={`/doctors/${d.doctorId}`}
            className="group -mx-2 flex items-center gap-3 rounded-xl px-2 py-1.5 transition-colors hover:bg-blue-50/70 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <DoctorAvatar name={d.name} className="size-8" />
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-baseline justify-between gap-3">
                <p className="min-w-0 truncate text-sm">
                  <span className="font-medium text-foreground">{d.name}</span>
                  <span className="ml-2 text-xs text-muted-foreground">{d.specialization}</span>
                </p>
                <span className="text-sm font-semibold tabular-nums">{d.patients}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-blue-50">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400 transition-[width] duration-500"
                  style={{ width: `${Math.max((d.patients / max) * 100, 3)}%` }}
                />
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ol>
  );
}
