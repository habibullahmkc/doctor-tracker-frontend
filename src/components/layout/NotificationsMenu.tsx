"use client";

import { Bell } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { StatusBadge } from "@/components/patients/PatientBadges";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDashboardStats } from "@/hooks/useDashboard";
import { formatRelative } from "@/lib/format";

const DAY = 24 * 60 * 60 * 1000;

/** Recent admissions as notifications; the badge counts admissions in the last 24 hours. */
export function NotificationsMenu() {
  const { data } = useDashboardStats("30d"); // shares the dashboard's default cache entry
  const recent = useMemo(() => data?.recentPatients ?? [], [data]);
  // eslint-disable-next-line react-hooks/purity -- relative "last 24h" window is evaluated per render on purpose
  const now = Date.now();
  const fresh = recent.filter((p) => now - new Date(p.admissionDate).getTime() < DAY).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full"
          aria-label={fresh ? `Notifications: ${fresh} new admission${fresh === 1 ? "" : "s"} today` : "Notifications"}
        >
          <Bell className="size-5" />
          {fresh > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex size-[18px] items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white ring-2 ring-background">
              {fresh}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span className="font-semibold">Recent admissions</span>
          {fresh > 0 && <span className="text-xs font-normal text-muted-foreground">{fresh} in the last 24h</span>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {recent.length === 0 && <p className="px-2 py-6 text-center text-sm text-muted-foreground">No admissions yet</p>}
        {recent.map((p) => (
          <DropdownMenuItem key={p._id} asChild>
            <Link href={`/doctors/${p.doctor._id}`} className="flex items-start gap-3 py-2">
              <span className="mt-1.5 size-2 shrink-0 rounded-full bg-blue-600" aria-hidden />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{p.name} admitted</span>
                <span className="block truncate text-xs text-muted-foreground">
                  {p.condition} · {p.doctor.name} · {formatRelative(p.admissionDate)}
                </span>
              </span>
              <StatusBadge status={p.status} className="shrink-0" />
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/patients" className="justify-center text-sm font-medium text-blue-700">
            View all patients
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
