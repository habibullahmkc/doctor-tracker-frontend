import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: ReactNode;
  icon: LucideIcon;
  hint?: ReactNode;
  loading?: boolean;
  /** Tailwind classes for the icon badge, e.g. "bg-teal-50 text-teal-600". */
  tone?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  loading,
  tone = "bg-primary/10 text-primary",
  className,
}: StatCardProps) {
  return (
    <Card className={cn("gap-3 border px-4 py-4 shadow-xs ring-0 sm:px-5 sm:py-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs leading-snug font-medium text-muted-foreground sm:text-sm">{label}</p>
        <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg sm:size-9", tone)}>
          <Icon className="size-[18px]" />
        </span>
      </div>
      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-3.5 w-32" />
        </div>
      ) : (
        <div className="space-y-1">
          <p className="text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl">{value}</p>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
      )}
    </Card>
  );
}
