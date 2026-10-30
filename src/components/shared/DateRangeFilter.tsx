"use client";

import { startOfYear, subDays } from "date-fns";
import { CalendarDays, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { formatDate, toYMD } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface DateRange {
  from: string;
  to: string;
}

interface DateRangeFilterProps extends DateRange {
  onChange: (range: DateRange) => void;
  /** Prefix for the trigger label, e.g. "Admitted" or "Joined". */
  label: string;
  className?: string;
}

const PRESETS: { label: string; range: () => DateRange }[] = [
  { label: "Last 7 days", range: () => ({ from: toYMD(subDays(new Date(), 6)), to: toYMD(new Date()) }) },
  { label: "Last 30 days", range: () => ({ from: toYMD(subDays(new Date(), 29)), to: toYMD(new Date()) }) },
  { label: "Last 90 days", range: () => ({ from: toYMD(subDays(new Date(), 89)), to: toYMD(new Date()) }) },
  { label: "This year", range: () => ({ from: toYMD(startOfYear(new Date())), to: toYMD(new Date()) }) },
];

function describe({ from, to }: DateRange) {
  if (!from && !to) return null;
  const preset = PRESETS.find((p) => {
    const range = p.range();
    return range.from === from && range.to === to;
  });
  if (preset) return preset.label;
  if (from && to) return `${formatDate(from)} – ${formatDate(to)}`;
  return from ? `From ${formatDate(from)}` : `Until ${formatDate(to)}`;
}

export function DateRangeFilter({ from, to, onChange, label, className }: DateRangeFilterProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DateRange>({ from, to });
  const summary = describe({ from, to });
  const invalid = Boolean(draft.from && draft.to && draft.from > draft.to);

  const apply = (range: DateRange) => {
    onChange(range);
    setOpen(false);
  };

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        if (next) setDraft({ from, to });
        setOpen(next);
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-9 w-full justify-start gap-2 bg-card font-normal sm:w-auto",
            summary ? "border-primary/40 text-foreground" : "text-muted-foreground",
            className,
          )}
        >
          <CalendarDays className="size-4" />
          <span className="truncate">{summary ? `${label}: ${summary}` : `${label}: Any time`}</span>
          <ChevronDown className="ml-auto size-4 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 p-0">
        <div className="grid gap-1 p-2">
          {PRESETS.map((preset) => (
            <Button
              key={preset.label}
              variant="ghost"
              size="sm"
              className="justify-start"
              onClick={() => apply(preset.range())}
            >
              {preset.label}
            </Button>
          ))}
          <Button variant="ghost" size="sm" className="justify-start" onClick={() => apply({ from: "", to: "" })}>
            Any time
          </Button>
        </div>
        <Separator />
        <form
          className="space-y-3 p-3"
          onSubmit={(event) => {
            event.preventDefault();
            if (!invalid) apply(draft);
          }}
        >
          <p className="text-xs font-medium text-muted-foreground">Custom range</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label htmlFor="range-from" className="text-xs">
                From
              </Label>
              <Input
                id="range-from"
                type="date"
                value={draft.from}
                max={draft.to || undefined}
                onChange={(event) => setDraft((d) => ({ ...d, from: event.target.value }))}
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="range-to" className="text-xs">
                To
              </Label>
              <Input
                id="range-to"
                type="date"
                value={draft.to}
                min={draft.from || undefined}
                onChange={(event) => setDraft((d) => ({ ...d, to: event.target.value }))}
                className="h-8 text-xs"
              />
            </div>
          </div>
          {invalid && <p className="text-xs text-destructive">&quot;From&quot; must be before &quot;To&quot;.</p>}
          <Button type="submit" size="sm" className="w-full" disabled={invalid || (!draft.from && !draft.to)}>
            Apply
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
}
