import type { FieldError } from "@/types/api";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly errors?: FieldError[],
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Thin fetch wrapper for the backend. All calls go to same-origin `/api/*`,
 * which next.config.ts rewrites to the Express server, so the HttpOnly auth
 * cookie is sent automatically.
 */
export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`/api${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init.headers },
      credentials: "same-origin",
    });
  } catch {
    throw new ApiError("Unable to reach the server. Check your connection.", 0);
  }

  if (res.status === 204) return undefined as T;

  const body = await res.json().catch(() => null);

  if (res.status === 401 && !path.startsWith("/auth/") && typeof window !== "undefined") {
    const next = encodeURIComponent(window.location.pathname + window.location.search);
    // Full reload on session expiry so all cached client state is discarded.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = `/login?next=${next}`;
  }

  if (!res.ok || !body?.success) {
    throw new ApiError(body?.message ?? `Request failed (${res.status})`, res.status, body?.errors);
  }

  return body as T;
}

export function toQueryString(params: Record<string, unknown>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}
