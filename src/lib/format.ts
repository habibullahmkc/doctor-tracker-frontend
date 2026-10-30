import { format, formatDistanceToNowStrict, parseISO } from "date-fns";

const toDate = (value: string | Date) => (typeof value === "string" ? parseISO(value) : value);

/** 30 Oct 2026 */
export const formatDate = (value: string | Date) => format(toDate(value), "d MMM yyyy");

/** 3 days ago */
export const formatRelative = (value: string | Date) => `${formatDistanceToNowStrict(toDate(value))} ago`;

/** "Dr. Sarah Ahmed" → "SA" */
export function initials(name: string) {
  const words = name
    .replace(/^dr\.?\s+/i, "")
    .split(/\s+/)
    .filter(Boolean);
  return ((words[0]?.[0] ?? "") + (words.length > 1 ? words[words.length - 1][0] : "")).toUpperCase();
}

export const formatNumber = (value: number) => new Intl.NumberFormat("en-US").format(value);

/** Local "YYYY-MM-DD" (used for date inputs and API date filters). */
export const toYMD = (date: Date) => format(date, "yyyy-MM-dd");
