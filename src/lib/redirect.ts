/**
 * Post-login destination from `?next=`. Only same-site paths are allowed:
 * "//evil.com" and "/\evil.com" are protocol-relative in browsers (open redirect).
 */
export function safeRedirect(next: string | string[] | undefined, fallback = "/dashboard") {
  const value = Array.isArray(next) ? next[0] : next;
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return fallback;
  return value;
}
