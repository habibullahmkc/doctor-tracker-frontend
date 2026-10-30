import Link from "next/link";
import { StatusBadge } from "@/components/patients/PatientBadges";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatRelative, initials } from "@/lib/format";
import type { DashboardStats } from "@/types/dashboard";

export function RecentPatients({ patients }: { patients: DashboardStats["recentPatients"] }) {
  if (!patients.length) return <p className="py-10 text-center text-sm text-muted-foreground">No admissions yet</p>;

  return (
    <ul className="-my-2 divide-y">
      {patients.map((patient) => (
        <li key={patient._id} className="flex items-center gap-3 py-3">
          <Avatar className="size-9">
            <AvatarFallback className="bg-blue-50 text-xs font-semibold text-blue-800">{initials(patient.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{patient.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {patient.condition} ·{" "}
              <Link href={`/doctors/${patient.doctor._id}`} className="hover:text-foreground hover:underline">
                {patient.doctor.name}
              </Link>
            </p>
          </div>
          {/* relative time can differ by a few seconds between server render and hydration */}
          <span suppressHydrationWarning className="hidden shrink-0 text-xs text-muted-foreground sm:inline">
            • {formatRelative(patient.admissionDate)}
          </span>
          <StatusBadge status={patient.status} className="shrink-0" />
        </li>
      ))}
    </ul>
  );
}
