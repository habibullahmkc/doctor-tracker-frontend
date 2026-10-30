"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Status = "checking" | "waking" | "online" | "offline";

const LABELS: Record<Status, string> = {
  checking: "Connecting to server…",
  waking: "Waking up the server (free tier) — this can take up to 50s",
  online: "Server online",
  offline: "Server unreachable",
};

/**
 * Pings /api/health on mount. The backend runs on Render's free tier, which
 * sleeps when idle, so we tell the user why the first request may be slow.
 */
export function ServerStatus({ className }: { className?: string }) {
  const [status, setStatus] = useState<Status>("checking");

  useEffect(() => {
    const controller = new AbortController();
    let unmounted = false;
    const slowTimer = setTimeout(() => setStatus((s) => (s === "checking" ? "waking" : s)), 3000);
    const timeout = setTimeout(() => controller.abort(), 60_000);

    fetch("/api/health", { signal: controller.signal, cache: "no-store" })
      .then((res) => !unmounted && setStatus(res.ok ? "online" : "offline"))
      .catch(() => !unmounted && setStatus("offline"))
      .finally(() => {
        clearTimeout(slowTimer);
        clearTimeout(timeout);
      });

    return () => {
      unmounted = true;
      clearTimeout(slowTimer);
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("inline-flex items-center gap-2 text-xs text-muted-foreground", className)}
    >
      <span className="relative flex size-2">
        {(status === "checking" || status === "waking") && (
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-amber-400 opacity-75" />
        )}
        <span
          className={cn(
            "relative inline-flex size-2 rounded-full",
            status === "online" && "bg-emerald-500",
            status === "offline" && "bg-destructive",
            (status === "checking" || status === "waking") && "bg-amber-500",
          )}
        />
      </span>
      {LABELS[status]}
    </div>
  );
}
