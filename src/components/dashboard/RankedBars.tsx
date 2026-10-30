import Link from "next/link";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface RankedItem {
  key: string;
  label: string;
  sublabel?: string;
  value: number;
  href?: string;
}

interface RankedBarsProps {
  items: RankedItem[];
  /** Unit for the accessible label, e.g. "patients". */
  unit: string;
  /** Total used for the share shown on hover; defaults to the sum of items. */
  total?: number;
  emptyText?: string;
}

/**
 * Ranked horizontal bars (largest first, one hue, shared baseline) — the
 * part-to-whole form that lets values be compared exactly. Every bar is
 * direct-labelled, so identity and value never rely on colour.
 */
export function RankedBars({ items, unit, total, emptyText = "No data yet" }: RankedBarsProps) {
  if (!items.length) return <p className="py-10 text-center text-sm text-muted-foreground">{emptyText}</p>;

  const max = Math.max(...items.map((item) => item.value), 1);
  const sum = total ?? items.reduce((acc, item) => acc + item.value, 0);

  return (
    <ol className="space-y-2.5">
      {items.map((item) => {
        const share = sum ? Math.round((item.value / sum) * 100) : 0;
        const content = (
          <>
            <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
              <span className="min-w-0 truncate">
                <span className="font-medium text-foreground">{item.label}</span>
                {item.sublabel && <span className="ml-1.5 text-xs text-muted-foreground">{item.sublabel}</span>}
              </span>
              <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                <span className="font-medium text-foreground">{formatNumber(item.value)}</span>
                <span className="ml-1.5 opacity-0 transition-opacity group-hover:opacity-100">{share}%</span>
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-[width,filter] duration-500 group-hover:brightness-90"
                style={{ width: `${Math.max((item.value / max) * 100, 2)}%` }}
              />
            </div>
          </>
        );

        return (
          <li key={item.key} aria-label={`${item.label}: ${item.value} ${unit} (${share}%)`}>
            {item.href ? (
              <Link
                href={item.href}
                className={cn(
                  "group -mx-2 block rounded-md px-2 py-1 transition-colors hover:bg-muted/60",
                  "focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
                )}
              >
                {content}
              </Link>
            ) : (
              <div className="group -mx-2 rounded-md px-2 py-1">{content}</div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
