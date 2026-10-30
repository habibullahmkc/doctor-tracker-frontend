import { useEffect } from "react";

/** If the current page no longer exists (e.g. after deleting the last row), step back to the last page. */
export function usePageClamp(page: number, totalPages: number | undefined, setPage: (page: number) => void) {
  useEffect(() => {
    if (totalPages !== undefined && page > totalPages) setPage(totalPages);
  }, [page, totalPages, setPage]);
}
