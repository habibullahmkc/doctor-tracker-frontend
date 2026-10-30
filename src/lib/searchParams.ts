import { parseAsInteger, parseAsString, parseAsStringLiteral } from "nuqs";

/**
 * URL-backed list state (page, filters, sort). Lives in the query string so
 * refresh, back/forward and shared links all restore the same view.
 */
const SORTS = ["newest", "oldest", "name"] as const;
export const PAGE_SIZES = [10, 20, 50] as const;

const common = {
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
  search: parseAsString.withDefault(""),
  from: parseAsString.withDefault(""),
  to: parseAsString.withDefault(""),
  sort: parseAsStringLiteral(SORTS).withDefault("newest"),
};

export const doctorListParsers = {
  ...common,
  specialization: parseAsString.withDefault(""),
  hospital: parseAsString.withDefault(""),
};

export const patientListParsers = {
  ...common,
  condition: parseAsString.withDefault(""),
  status: parseAsString.withDefault(""),
  gender: parseAsString.withDefault(""),
  doctor: parseAsString.withDefault(""),
};

export const listStateOptions = { history: "replace", scroll: false, clearOnDefault: true } as const;

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "name", label: "Name (A–Z)" },
] as const;
