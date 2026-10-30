"use client";

import type { ReactNode } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ErrorState, TableSkeleton } from "./States";

export interface Column<T> {
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  className?: string;
  headerClassName?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[] | undefined;
  getRowId: (row: T) => string;
  /** First load (no data yet) → skeleton. */
  isLoading?: boolean;
  /** Background refetch (e.g. page change) → keep rows, show progress. */
  isFetching?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  emptyState: ReactNode;
  onRowClick?: (row: T) => void;
  /** Card layout used below the `md` breakpoint instead of the table. */
  renderMobileCard?: (row: T) => ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  getRowId,
  isLoading,
  isFetching,
  error,
  onRetry,
  emptyState,
  onRowClick,
  renderMobileCard,
  footer,
  className,
}: DataTableProps<T>) {
  const rows = data ?? [];
  const showSkeleton = isLoading && !data;
  const refreshing = Boolean(isFetching && !showSkeleton);

  let body: ReactNode;
  if (error && !data) {
    body = <ErrorState message={error.message} onRetry={onRetry} />;
  } else if (showSkeleton) {
    body = <TableSkeleton columns={Math.min(columns.length, 6)} />;
  } else if (!rows.length) {
    body = emptyState;
  } else {
    body = (
      <>
        <div className={cn("hidden md:block", !renderMobileCard && "block")}>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                {columns.map((column) => (
                  <TableHead
                    key={column.key}
                    className={cn("h-10 text-xs font-medium tracking-wide text-muted-foreground uppercase", column.headerClassName)}
                  >
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={getRowId(row)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(onRowClick && "cursor-pointer")}
                >
                  {columns.map((column) => (
                    <TableCell key={column.key} className={cn("py-3", column.className)}>
                      {column.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {renderMobileCard && (
          <ul className="divide-y md:hidden">
            {rows.map((row) => (
              <li key={getRowId(row)}>{renderMobileCard(row)}</li>
            ))}
          </ul>
        )}
      </>
    );
  }

  return (
    <div className={cn("relative overflow-hidden rounded-xl border bg-card shadow-xs", className)}>
      {/* Thin progress bar during background refetches */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-x-0 top-0 z-10 h-0.5 origin-left bg-primary transition-opacity duration-300",
          refreshing ? "animate-pulse opacity-100" : "opacity-0",
        )}
      />
      <div className={cn("transition-opacity duration-200", refreshing && "opacity-60")} aria-busy={refreshing}>
        {body}
      </div>
      {footer && rows.length > 0 && <div className="border-t px-4 py-3">{footer}</div>}
    </div>
  );
}
