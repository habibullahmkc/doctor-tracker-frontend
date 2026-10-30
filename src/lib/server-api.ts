import { cookies } from "next/headers";

const BACKEND_URL = (process.env.BACKEND_URL ?? "http://localhost:5000").replace(/\/$/, "");

/**
 * Server-side GET to the API with the visitor's session cookie, used to
 * prefetch data into the TanStack Query cache before the page streams.
 *
 * Returns null on any failure (no cookie, error, or a slow/sleeping API after
 * `timeoutMs`), so the page still renders and the client simply fetches.
 */
export async function serverGet<T>(path: string, timeoutMs = 3500): Promise<T | null> {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;
  try {
    const res = await fetch(`${BACKEND_URL}/api${path}`, {
      headers: { Cookie: `token=${token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { success?: boolean; data?: T };
    return body.success ? (body.data ?? null) : null;
  } catch {
    return null;
  }
}
