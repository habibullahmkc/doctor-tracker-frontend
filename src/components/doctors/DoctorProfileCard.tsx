import { Building2, CalendarDays, Mail, Pencil, Phone, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { STATUS_COLORS } from "@/components/patients/PatientBadges";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PATIENT_STATUSES } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import type { DoctorDetail } from "@/types/doctor";
import { DoctorAvatar } from "./DoctorAvatar";

function Detail({ icon: Icon, children }: { icon: typeof Mail; children: ReactNode }) {
  return (
    <li className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
      <Icon className="size-4 shrink-0" />
      <span className="min-w-0 truncate">{children}</span>
    </li>
  );
}

interface DoctorProfileCardProps {
  doctor: DoctorDetail;
  onEdit: () => void;
  onDelete: () => void;
}

export function DoctorProfileCard({ doctor, onEdit, onDelete }: DoctorProfileCardProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="gap-0 border p-5 shadow-xs ring-0 sm:p-6 lg:col-span-2">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <DoctorAvatar name={doctor.name} className="size-16 text-lg [&_[data-slot=avatar-fallback]]:text-lg" />
          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 space-y-1.5">
                <h1 className="text-2xl font-semibold tracking-tight">{doctor.name}</h1>
                <Badge className="bg-primary/10 text-primary hover:bg-primary/10">{doctor.specialization}</Badge>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button variant="outline" size="sm" onClick={onEdit}>
                  <Pencil />
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={onDelete}>
                  <Trash2 />
                  Delete
                </Button>
              </div>
            </div>
            <ul className="grid gap-2 sm:grid-cols-2">
              <Detail icon={Building2}>{doctor.hospital}</Detail>
              <Detail icon={CalendarDays}>Joined {formatDate(doctor.createdAt)}</Detail>
              <Detail icon={Phone}>
                <a href={`tel:${doctor.phone}`} className="hover:text-foreground hover:underline">
                  {doctor.phone}
                </a>
              </Detail>
              <Detail icon={Mail}>
                <a href={`mailto:${doctor.email}`} className="hover:text-foreground hover:underline">
                  {doctor.email}
                </a>
              </Detail>
            </ul>
          </div>
        </div>
      </Card>

      <Card className="gap-4 border p-5 shadow-xs ring-0 sm:p-6">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Total patients</p>
          <p className="text-3xl font-semibold tracking-tight tabular-nums">{doctor.patientCount}</p>
        </div>
        <ul className="space-y-2">
          {PATIENT_STATUSES.map((status) => (
            <li key={status} className="flex items-center gap-2.5 text-sm">
              <span className="size-2.5 rounded-sm" style={{ backgroundColor: STATUS_COLORS[status] }} aria-hidden />
              <span className="flex-1">{status}</span>
              <span className="font-medium tabular-nums">{doctor.patientsByStatus[status] ?? 0}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

export function DoctorProfileSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="flex-row gap-5 border p-6 shadow-xs ring-0 lg:col-span-2">
        <Skeleton className="size-16 rounded-full" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-5 w-28" />
          <div className="grid gap-2 sm:grid-cols-2">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-4 w-40" />
            ))}
          </div>
        </div>
      </Card>
      <Card className="gap-3 border p-6 shadow-xs ring-0">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-16" />
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </Card>
    </div>
  );
}
