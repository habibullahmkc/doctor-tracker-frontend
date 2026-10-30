import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  description?: ReactNode;
  icon?: LucideIcon;
  /** Tailwind classes for the icon tile. */
  iconTone?: string;
  action?: ReactNode;
  loading?: boolean;
  /** Skeleton height while loading, to avoid layout shift. */
  skeletonHeight?: number;
  children: ReactNode;
  className?: string;
}

export function ChartCard({
  title,
  description,
  icon: Icon,
  iconTone = "bg-blue-50 text-blue-700",
  action,
  loading,
  skeletonHeight = 280,
  children,
  className,
}: ChartCardProps) {
  return (
    <section className={cn("relative flex flex-col gap-4 overflow-hidden rounded-2xl border bg-card p-4 shadow-xs sm:p-5", className)}>
      <header className="flex items-start gap-3">
        {Icon && (
          <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl", iconTone)}>
            <Icon className="size-[18px]" />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <h2 className="text-base leading-tight font-semibold">{title}</h2>
          {description && <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">{description}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </header>
      <div className="flex-1">
        {loading ? <Skeleton className="w-full rounded-xl" style={{ height: skeletonHeight }} /> : children}
      </div>
    </section>
  );
}
