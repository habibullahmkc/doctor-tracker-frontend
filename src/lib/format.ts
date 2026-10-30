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
    .filter((word) => /^\p{L}/u.test(word)); // skip numbers / symbols
  return ((words[0]?.[0] ?? "") + (words.length > 1 ? words[words.length - 1][0] : "")).toUpperCase();
}

export const formatNumber = (value: number) => new Intl.NumberFormat("en-US").format(value);

const dhakaLongDate = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Dhaka",
});

/** "Sat 31 Oct 2026" in Bangladesh time — identical on the server and in the browser. */
export const formatToday = (date = new Date()) => dhakaLongDate.format(date);

/** Local "YYYY-MM-DD" (used for date inputs and API date filters). */
export const toYMD = (date: Date) => format(date, "yyyy-MM-dd");
