import { Badge } from "@/components/ui/badge";
import type { Condition, PatientStatus } from "@/lib/constants";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<PatientStatus, string> = {
  Admitted: "bg-blue-50 text-blue-700 ring-blue-600/20",
  "Under Treatment": "bg-amber-50 text-amber-700 ring-amber-600/20",
  Recovered: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Discharged: "bg-slate-100 text-slate-600 ring-slate-500/20",
};

const STATUS_DOT: Record<PatientStatus, string> = {
  Admitted: "bg-blue-500",
  "Under Treatment": "bg-amber-500",
  Recovered: "bg-emerald-500",
  Discharged: "bg-slate-400",
};

export function StatusBadge({ status, className }: { status: PatientStatus; className?: string }) {
  return (
    <Badge variant="outline" className={cn("gap-1.5 border-0 ring-1 ring-inset", STATUS_STYLES[status], className)}>
      <span className={cn("size-1.5 rounded-full", STATUS_DOT[status])} aria-hidden />
      {status}
    </Badge>
  );
}

export function ConditionBadge({ condition, className }: { condition: Condition; className?: string }) {
  return (
    <Badge variant="secondary" className={cn("font-normal", className)}>
      {condition}
    </Badge>
  );
}
