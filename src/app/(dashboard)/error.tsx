"use client";

import { RotateCw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { ErrorState } from "@/components/shared/States";
import { Button } from "@/components/ui/button";

/** Keeps the app shell (sidebar/topbar) usable if a page throws while rendering. */
export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="rounded-xl border bg-card">
      <ErrorState message="This page hit an unexpected error. You can retry or head back to the dashboard." />
      <div className="flex justify-center gap-2 pb-10">
        <Button variant="outline" size="sm" onClick={reset}>
          <RotateCw />
          Retry
        </Button>
        <Button size="sm" asChild>
          <Link href="/dashboard">Go to dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
