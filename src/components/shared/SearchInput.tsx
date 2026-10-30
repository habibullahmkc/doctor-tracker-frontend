"use client";

import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  delay?: number;
}

/**
 * Keeps keystrokes in local state and only reports the debounced value,
 * so typing doesn't re-render the page or fire a request per character.
 */
export function SearchInput({ value, onChange, placeholder = "Search…", className, delay = 350 }: SearchInputProps) {
  const [text, setText] = useState(value);
  const [syncedValue, setSyncedValue] = useState(value);
  const debounced = useDebounce(text, delay);

  // Sync when the value changes from outside (e.g. "Clear filters") —
  // adjusted during render instead of in an effect to avoid an extra pass.
  if (value !== syncedValue) {
    setSyncedValue(value);
    setText(value);
  }

  useEffect(() => {
    if (debounced.trim() !== value) onChange(debounced.trim());
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only react to the debounced text
  }, [debounced]);

  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setText("");
        }}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-9 bg-card pr-9 pl-9 [&::-webkit-search-cancel-button]:hidden"
      />
      {text && (
        <button
          type="button"
          onClick={() => setText("")}
          className="absolute top-1/2 right-2 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Clear search"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}
