"use client";

import { cn } from "@/lib/utils";
import type { StatsRange } from "@/types/dashboard";

const RANGES: { value: StatsRange; label: string }[] = [
  { value: "7d", label: "7D" },
  { value: "30d", label: "30D" },
  { value: "12m", label: "12M" },
];

export function RangeToggle({ value, onChange }: { value: StatsRange; onChange: (range: StatsRange) => void }) {
  return (
    <div role="radiogroup" aria-label="Time range" className="inline-flex rounded-full border bg-slate-50 p-1">
      {RANGES.map((range) => {
        const active = range.value === value;
        return (
          <button
            key={range.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(range.value)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold tabular-nums transition-colors focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
              active ? "bg-primary text-primary-foreground shadow-sm" : "text-slate-600 hover:text-foreground",
            )}
          >
            {range.label}
          </button>
        );
      })}
    </div>
  );
}
