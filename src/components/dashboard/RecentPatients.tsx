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
            <AvatarFallback className="bg-muted text-xs font-medium">{initials(patient.name)}</AvatarFallback>
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
          <div className="flex shrink-0 flex-col items-end gap-1">
            <StatusBadge status={patient.status} />
            <span className="text-[11px] text-muted-foreground">{formatRelative(patient.admissionDate)}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
