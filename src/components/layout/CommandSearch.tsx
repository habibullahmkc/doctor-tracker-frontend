"use client";

import { useQuery } from "@tanstack/react-query";
import { CornerDownLeft, HeartPulse, LayoutDashboard, Loader2, Search, Stethoscope, UserRound, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useDebounce } from "@/hooks/useDebounce";
import { useRestoreFocus } from "@/hooks/useRestoreFocus";
import { CONDITIONS, SPECIALIZATIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { doctorsService } from "@/services/doctors.service";
import { patientsService } from "@/services/patients.service";

interface Result {
  id: string;
  group: "Pages" | "Doctors" | "Patients" | "Conditions" | "Specializations";
  label: string;
  sublabel?: string;
  href: string;
  icon: ReactNode;
}

const PAGES: Result[] = [
  { id: "p-dashboard", group: "Pages", label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="size-4" /> },
  { id: "p-doctors", group: "Pages", label: "Doctors", href: "/doctors", icon: <Stethoscope className="size-4" /> },
  { id: "p-patients", group: "Pages", label: "Patients", href: "/patients", icon: <Users className="size-4" /> },
];

/** Global search (Ctrl/⌘ + K) across doctors, patients, conditions and specializations. */
export function CommandSearch() {
  const [open, setOpen] = useState(false);
  const restoreFocus = useRestoreFocus();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* Desktop: looks like an input */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden h-10 w-full max-w-md items-center gap-2.5 rounded-full border bg-card px-4 text-sm text-slate-500 shadow-xs transition-colors hover:border-blue-200 hover:bg-blue-50/40 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none md:flex"
      >
        <Search className="size-4 text-slate-500" />
        <span className="flex-1 text-left">Search doctors, patients, conditions…</span>
        <kbd className="rounded-md border bg-slate-50 px-1.5 py-0.5 font-sans text-[11px] font-medium text-slate-500">Ctrl K</kbd>
      </button>
      {/* Mobile: icon */}
      <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(true)} aria-label="Search">
        <Search className="size-5" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent showCloseButton={false} className="top-[15%] translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-xl" {...restoreFocus}>
          <DialogTitle className="sr-only">Search</DialogTitle>
          <DialogDescription className="sr-only">Search doctors, patients, conditions and specializations</DialogDescription>
          {open && <SearchPanel onNavigate={() => setOpen(false)} />}
        </DialogContent>
      </Dialog>
    </>
  );
}

function SearchPanel({ onNavigate }: { onNavigate: () => void }) {
  const router = useRouter();
  const listId = useId();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const term = useDebounce(query.trim(), 250);
  const enabled = term.length > 0;

  const doctors = useQuery({
    queryKey: ["search", "doctors", term],
    queryFn: () => doctorsService.list({ search: term, limit: 5 }),
    enabled,
    staleTime: 30_000,
  });
  const patients = useQuery({
    queryKey: ["search", "patients", term],
    queryFn: () => patientsService.list({ search: term, limit: 5 }),
    enabled,
    staleTime: 30_000,
  });

  const results = useMemo<Result[]>(() => {
    if (!enabled) return PAGES;
    const lower = term.toLowerCase();
    return [
      ...(doctors.data?.data ?? []).map((d) => ({
        id: `d-${d._id}`,
        group: "Doctors" as const,
        label: d.name,
        sublabel: `${d.specialization} · ${d.hospital}`,
        href: `/doctors/${d._id}`,
        icon: <UserRound className="size-4" />,
      })),
      ...(patients.data?.data ?? []).map((p) => ({
        id: `p-${p._id}`,
        group: "Patients" as const,
        label: p.name,
        sublabel: `${p.condition} · ${p.doctor.name}`,
        href: `/patients?search=${encodeURIComponent(p.name)}`,
        icon: <Users className="size-4" />,
      })),
      ...CONDITIONS.filter((c) => c.toLowerCase().includes(lower)).map((c) => ({
        id: `c-${c}`,
        group: "Conditions" as const,
        label: c,
        sublabel: "View patients with this condition",
        href: `/patients?condition=${encodeURIComponent(c)}`,
        icon: <HeartPulse className="size-4" />,
      })),
      ...SPECIALIZATIONS.filter((s) => s.toLowerCase().includes(lower)).map((s) => ({
        id: `s-${s}`,
        group: "Specializations" as const,
        label: s,
        sublabel: "View doctors in this specialization",
        href: `/doctors?specialization=${encodeURIComponent(s)}`,
        icon: <Stethoscope className="size-4" />,
      })),
    ];
  }, [enabled, term, doctors.data, patients.data]);

  const activeIndex = Math.min(active, Math.max(results.length - 1, 0));
  const loading = enabled && (doctors.isFetching || patients.isFetching);

  const go = (result: Result | undefined) => {
    if (!result) return;
    router.push(result.href);
    onNavigate();
  };

  return (
    <div>
      <div className="flex items-center gap-2 border-b px-4">
        {loading ? <Loader2 className="size-4 animate-spin text-slate-500" /> : <Search className="size-4 text-slate-500" />}
        <input
          role="combobox"
          aria-expanded="true"
          aria-controls={listId}
          aria-activedescendant={results[activeIndex] ? `${listId}-${results[activeIndex].id}` : undefined}
          aria-label="Search doctors, patients, conditions"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setActive((i) => Math.min(i + 1, results.length - 1));
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              setActive((i) => Math.max(i - 1, 0));
            } else if (event.key === "Enter") {
              event.preventDefault();
              go(results[activeIndex]);
            }
          }}
          placeholder="Search doctors, patients, conditions…"
          className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-500"
        />
        <kbd className="rounded-md border bg-slate-50 px-1.5 py-0.5 text-[11px] text-slate-500">Esc</kbd>
      </div>

      <ul id={listId} role="listbox" aria-label="Search results" className="max-h-[min(60vh,420px)] overflow-y-auto p-2">
        {results.length === 0 && !loading && (
          <li className="px-3 py-10 text-center text-sm text-muted-foreground">No results for “{term}”</li>
        )}
        {results.map((result, index) => {
          const header = index === 0 || results[index - 1].group !== result.group ? result.group : null;
          return (
            <li key={result.id} role="presentation">
              {header && (
                <p className="px-3 pt-2 pb-1 text-[11px] font-semibold tracking-wider text-slate-500 uppercase" aria-hidden>
                  {enabled ? header : "Jump to"}
                </p>
              )}
              <div
                id={`${listId}-${result.id}`}
                role="option"
                aria-selected={index === activeIndex}
                onMouseMove={() => setActive(index)}
                onClick={() => go(result)}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2",
                  index === activeIndex ? "bg-blue-50 text-blue-900" : "text-foreground",
                )}
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white text-blue-700 shadow-xs ring-1 ring-blue-100">
                  {result.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{result.label}</span>
                  {result.sublabel && <span className="block truncate text-xs text-slate-500">{result.sublabel}</span>}
                </span>
                {index === activeIndex && <CornerDownLeft className="size-4 text-blue-700" aria-hidden />}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
