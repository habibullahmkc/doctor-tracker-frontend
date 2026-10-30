"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/format";
import { getPageItems } from "@/lib/pagination";
import { PAGE_SIZES } from "@/lib/searchParams";
import { cn } from "@/lib/utils";
import { FilterSelect } from "./FilterSelect";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  className?: string;
}

export function Pagination({ page, totalPages, total, limit, onPageChange, onLimitChange, className }: PaginationProps) {
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className={cn("flex flex-col-reverse items-center gap-3 sm:flex-row sm:justify-between", className)}>
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span>
          Showing <span className="font-medium text-foreground">{formatNumber(start)}</span>–
          <span className="font-medium text-foreground">{formatNumber(end)}</span> of{" "}
          <span className="font-medium text-foreground">{formatNumber(total)}</span>
        </span>
        {onLimitChange && (
          <FilterSelect
            required
            allLabel="Rows"
            ariaLabel="Rows per page"
            value={String(limit)}
            options={PAGE_SIZES.map((size) => ({ value: String(size), label: `${size} / page` }))}
            onChange={(value) => onLimitChange(Number(value))}
            className="h-8 w-auto min-w-0 sm:min-w-0"
          />
        )}
      </div>

      <nav aria-label="Pagination" className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft />
        </Button>
        {getPageItems(page, totalPages).map((item, index) =>
          item === "ellipsis" ? (
            <span key={`e${index}`} className="hidden px-1.5 text-sm text-muted-foreground sm:inline" aria-hidden>
              …
            </span>
          ) : (
            <Button
              key={item}
              variant={item === page ? "default" : "ghost"}
              size="icon-sm"
              onClick={() => onPageChange(item)}
              aria-label={`Page ${item}`}
              aria-current={item === page ? "page" : undefined}
              className="hidden tabular-nums sm:inline-flex"
            >
              {item}
            </Button>
          ),
        )}
        {/* Compact indicator on small screens instead of page numbers */}
        <span className="px-3 text-sm text-muted-foreground tabular-nums sm:hidden">
          <span className="font-medium text-foreground">{page}</span> / {totalPages}
        </span>
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
        >
          <ChevronRight />
        </Button>
      </nav>
    </div>
  );
}
