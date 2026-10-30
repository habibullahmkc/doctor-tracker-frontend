import { FilterX } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FilterToolbarProps {
  children: ReactNode;
  /** Number of active filters; shows the reset button when > 0. */
  activeCount: number;
  onReset: () => void;
  className?: string;
}

export function FilterToolbar({ children, activeCount, onReset, className }: FilterToolbarProps) {
  return (
    <div className={cn("flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center", className)}>
      {children}
      {activeCount > 0 && (
        <Button variant="ghost" size="sm" onClick={onReset} className="h-9 text-muted-foreground sm:ml-auto">
          <FilterX />
          Clear filters ({activeCount})
        </Button>
      )}
    </div>
  );
}
