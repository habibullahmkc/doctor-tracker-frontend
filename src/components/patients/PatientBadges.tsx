import { Badge } from "@/components/ui/badge";
import type { Condition, PatientStatus } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * Status hues validated with the dataviz palette checker (CVD ΔE ≥ 9, normal-vision ΔE ≥ 27).
 * Charts use the hex values; badges use matching tints. Status is never color-alone — always labelled.
 */
export const STATUS_COLORS: Record<PatientStatus, string> = {
  Admitted: "#2a78d6",
  "Under Treatment": "#eb6834",
  Recovered: "#1baf7a",
  Discharged: "#6250d6",
};

const STATUS_BADGE: Record<PatientStatus, string> = {
  Admitted: "bg-blue-50 text-blue-700 ring-blue-600/20",
  "Under Treatment": "bg-orange-50 text-orange-700 ring-orange-600/20",
  Recovered: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Discharged: "bg-violet-50 text-violet-700 ring-violet-600/20",
};

export function StatusBadge({ status, className }: { status: PatientStatus; className?: string }) {
  return (
    <Badge variant="outline" className={cn("gap-1.5 border-0 ring-1 ring-inset", STATUS_BADGE[status], className)}>
      <span className="size-1.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[status] }} aria-hidden />
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
