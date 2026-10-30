import { useId } from "react";
import { cn } from "@/lib/utils";

/** Heart-pulse + stethoscope mark used on the sign-in screen. */
export function BrandMark({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 64 64" className={cn("size-12", className)} aria-hidden>
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#14b8a6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
      {/* Heart */}
      <path
        d="M36 40 C22 31 15 24 15 15.5 C15 9.5 19.6 5 25.4 5 C29.6 5 33.4 7.2 36 10.8 C38.6 7.2 42.4 5 46.6 5 C52.4 5 57 9.5 57 15.5 C57 24 50 31 36 40 Z"
        fill={`url(#${id}-g)`}
      />
      <path
        d="M20 20 H28 L31 14 L35 26 L38 18 L40 21 H51"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Stethoscope */}
      <path
        d="M22 33 C14 40 12 50 18 55 C24 60 33 57 36 50 L38 44"
        fill="none"
        stroke={`url(#${id}-g)`}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="13" cy="51" r="6" fill="none" stroke={`url(#${id}-g)`} strokeWidth="4" />
      <circle cx="13" cy="51" r="1.8" fill="#1d4ed8" />
    </svg>
  );
}

export function BrandWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-bold tracking-tight", className)}>
      <span className="text-[#0f2a5f]">Doctor</span>{" "}
      <span className="bg-gradient-to-r from-teal-700 to-emerald-700 bg-clip-text text-transparent">Tracker</span>
    </span>
  );
}
