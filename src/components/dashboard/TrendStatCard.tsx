import { ArrowDown, ArrowUp, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Sparkline } from "./Sparkline";

interface TrendStatCardProps {
  label: string;
  value: ReactNode;
  icon: LucideIcon;
  /** Tailwind classes for the icon circle. */
  tone: string;
  /** Sparkline colour (hex). */
  color: string;
  series: number[];
  /** Change text, e.g. "12% vs last month"; direction drives the arrow. */
  change?: { text: string; direction: "up" | "down" | "flat" };
  loading?: boolean;
}

export function TrendStatCard({ label, value, icon: Icon, tone, color, series, change, loading }: TrendStatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border bg-card p-4 shadow-xs sm:p-5">
      <div className="flex items-center gap-3">
        <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-full sm:size-11", tone)}>
          <Icon className="size-5" />
        </span>
        <p className="text-sm leading-tight font-semibold text-foreground">{label}</p>
      </div>

      {loading ? (
        <div className="mt-4 space-y-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-3.5 w-28" />
        </div>
      ) : (
        <>
          <div className="mt-3 flex items-end justify-between gap-2">
            <p className="text-2xl font-bold tracking-tight tabular-nums sm:text-3xl">{value}</p>
            <div className="hidden shrink-0 sm:block">
              <Sparkline values={series} color={color} width={110} height={40} label={`${label} trend over the last ${series.length} months`} />
            </div>
          </div>
          {change && (
            <p
              className={cn(
                "mt-1.5 flex items-center gap-1 text-xs font-medium whitespace-nowrap",
                change.direction === "down" ? "text-red-700" : change.direction === "up" ? "text-emerald-700" : "text-muted-foreground",
              )}
            >
              {change.direction === "up" && <ArrowUp className="size-3.5 shrink-0" aria-hidden />}
              {change.direction === "down" && <ArrowDown className="size-3.5 shrink-0" aria-hidden />}
              <span className="truncate">{change.text}</span>
            </p>
          )}
        </>
      )}
    </div>
  );
}
