/** Page buttons with gaps, e.g. `1 … 4 5 [6] 7 8 … 20`. */
export function getPageItems(page: number, totalPages: number): Array<number | "ellipsis"> {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

  const pages = new Set([1, totalPages, page - 1, page, page + 1]);
  if (page <= 3) for (const p of [2, 3, 4]) pages.add(p);
  if (page >= totalPages - 2) for (const p of [totalPages - 3, totalPages - 2, totalPages - 1]) pages.add(p);
  const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);

  const items: Array<number | "ellipsis"> = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) items.push("ellipsis");
    items.push(p);
  });
  return items;
}
