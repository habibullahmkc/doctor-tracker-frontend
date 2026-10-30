"use client";

import { FilterX, SlidersHorizontal } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface FilterToolbarProps {
  /** Always-visible search input. */
  search: ReactNode;
  /** Filter controls: inline on desktop, inside a bottom sheet on mobile. */
  children: ReactNode;
  /** Number of active filters (excluding search); drives badges and the reset button. */
  activeCount: number;
  onReset: () => void;
  className?: string;
}

export function FilterToolbar({ search, children, activeCount, onReset, className }: FilterToolbarProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {/* Desktop / tablet */}
      <div className="hidden flex-wrap items-center gap-2 md:flex">
        <div className="w-full max-w-xs">{search}</div>
        {children}
        {activeCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onReset} className="h-9 text-muted-foreground lg:ml-auto">
            <FilterX />
            Clear filters ({activeCount})
          </Button>
        )}
      </div>

      {/* Mobile */}
      <div className="flex items-center gap-2 md:hidden">
        <div className="min-w-0 flex-1">{search}</div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="h-9 shrink-0 bg-card" aria-label={`Filters, ${activeCount} active`}>
              <SlidersHorizontal />
              Filters
              {activeCount > 0 && (
                <Badge className="ml-0.5 h-5 min-w-5 rounded-full px-1.5 tabular-nums">{activeCount}</Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[85vh] gap-0 rounded-t-2xl">
            <SheetHeader className="border-b">
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>Narrow down the list.</SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-3 overflow-y-auto p-4 [&>*]:w-full">{children}</div>
            <SheetFooter className="flex-row border-t">
              <Button variant="outline" className="flex-1" onClick={onReset} disabled={activeCount === 0}>
                Reset
              </Button>
              <Button className="flex-1" onClick={() => setOpen(false)}>
                Show results
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
