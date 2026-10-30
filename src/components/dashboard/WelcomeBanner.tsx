"use client";

import { CalendarDays } from "lucide-react";
import { useMe } from "@/hooks/useAuth";
import { formatToday } from "@/lib/format";

/** Decorative illustration drawn in SVG — no image download, crisp at any size. */
function Illustration() {
  return (
    <svg viewBox="0 0 320 180" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="wb-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#dbeafe" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="wb-heart" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <radialGradient id="wb-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#93c5fd" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="210" cy="90" r="95" fill="url(#wb-glow)" />
      <circle cx="250" cy="40" r="38" fill="#bfdbfe" opacity="0.45" />
      <circle cx="292" cy="140" r="22" fill="#c7d2fe" opacity="0.5" />
      {/* Pulse line */}
      <path
        d="M10 112 H92 l12 -26 l16 50 l14 -64 l14 52 l10 -12 H180"
        fill="none"
        stroke="#93c5fd"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />
      {/* Glass card with heart */}
      <rect x="150" y="38" width="112" height="104" rx="24" fill="url(#wb-glass)" stroke="#ffffff" strokeWidth="2" />
      <path
        d="M206 124 C176 104 166 90 166 76 C166 64 175 56 186 56 C194 56 201 60 206 67 C211 60 218 56 226 56 C237 56 246 64 246 76 C246 90 236 104 206 124 Z"
        fill="url(#wb-heart)"
      />
      <path
        d="M176 88 H192 l6 -12 l8 24 l6 -18 l4 6 H236"
        fill="none"
        stroke="#ffffff"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Medical crosses */}
      <g fill="#3b82f6" opacity="0.85">
        <rect x="282" y="72" width="16" height="5" rx="2.5" />
        <rect x="287.5" y="66.5" width="5" height="16" rx="2.5" />
      </g>
      <g fill="#60a5fa" opacity="0.6">
        <rect x="120" y="30" width="12" height="4" rx="2" />
        <rect x="124" y="26" width="4" height="12" rx="2" />
      </g>
      <circle cx="136" cy="150" r="4" fill="#93c5fd" />
      <circle cx="300" cy="28" r="3" fill="#93c5fd" />
    </svg>
  );
}

export function WelcomeBanner() {
  const { data: admin } = useMe();
  const today = formatToday();

  return (
    <section className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-blue-100/70 px-5 py-[22px] shadow-xs sm:px-6">
      <div className="pointer-events-none absolute -top-16 -left-10 size-40 rounded-full bg-blue-200/30 blur-3xl" aria-hidden />
      <div className="relative z-10 max-w-2xl space-y-0.5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h1 className="text-xl font-bold tracking-tight">
            Welcome back, {admin?.name ?? "Admin"} <span aria-hidden>👋</span>
          </h1>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-white/80 px-2 py-0.5 text-xs font-medium text-blue-800">
            <CalendarDays className="size-3.5" />
            <span suppressHydrationWarning>{today}</span>
          </span>
        </div>
        <p className="text-sm text-slate-600">Here&apos;s what&apos;s happening with your healthcare system today.</p>
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-2 hidden w-64 md:block">
        <Illustration />
      </div>
    </section>
  );
}
