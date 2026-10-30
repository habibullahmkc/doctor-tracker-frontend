import type { ReactNode } from "react";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  description?: ReactNode;
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
  action,
  loading,
  skeletonHeight = 280,
  children,
  className,
}: ChartCardProps) {
  return (
    <Card className={cn("gap-4 border shadow-xs ring-0", className)}>
      <CardHeader>
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
        {action && <CardAction>{action}</CardAction>}
      </CardHeader>
      <CardContent className="flex-1">
        {loading ? <Skeleton className="w-full rounded-lg" style={{ height: skeletonHeight }} /> : children}
      </CardContent>
    </Card>
  );
}
