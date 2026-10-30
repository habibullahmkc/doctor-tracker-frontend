"use client";

import { useId } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const ALL = "__all__";

export type FilterOption = string | { value: string; label: string };

interface FilterSelectProps {
  /** Shown when nothing is selected, e.g. "All specializations". */
  allLabel: string;
  value: string;
  options: readonly FilterOption[];
  onChange: (value: string) => void;
  /** Hide the "All" choice (for required selects such as sort). */
  required?: boolean;
  className?: string;
  ariaLabel?: string;
  disabled?: boolean;
}

const normalize = (option: FilterOption) => (typeof option === "string" ? { value: option, label: option } : option);

export function FilterSelect({
  allLabel,
  value,
  options,
  onChange,
  required = false,
  className,
  ariaLabel,
  disabled,
}: FilterSelectProps) {
  const id = useId();
  const labelId = `${id}-label`;
  const valueId = `${id}-value`;

  return (
    <Select
      value={value || (required ? undefined : ALL)}
      onValueChange={(next) => onChange(next === ALL ? "" : next)}
      disabled={disabled}
    >
      <SelectTrigger
        data-filter={allLabel}
        // role=combobox doesn't take its name from content, so point at the context + the visible value.
        aria-labelledby={ariaLabel ? `${labelId} ${valueId}` : valueId}
        className={cn("h-9 w-full bg-card sm:w-auto sm:min-w-40", value && !required && "border-primary/40 text-foreground", className)}
      >
        {ariaLabel && (
          <span id={labelId} className="sr-only">
            {ariaLabel}:
          </span>
        )}
        <SelectValue id={valueId} placeholder={allLabel} />
      </SelectTrigger>
      <SelectContent position="popper" align="start">
        {!required && <SelectItem value={ALL}>{allLabel}</SelectItem>}
        {options.map(normalize).map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
