import { HeartPulse } from "lucide-react";
import Link from "next/link";
import { Logo } from "./Logo";
import { LogoutButton } from "./LogoutButton";
import { NavLinks } from "./NavLinks";

/** Soft decorative card at the bottom of the sidebar. */
export function SidebarCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-b from-white to-blue-50 p-4 text-center">
      <svg viewBox="0 0 200 60" className="pointer-events-none absolute inset-x-0 top-0 w-full text-blue-100" aria-hidden>
        <path d="M0 30 C40 10 70 50 110 30 S170 10 200 28 V0 H0 Z" fill="currentColor" />
      </svg>
      <div className="relative mx-auto mb-2 flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-md">
        <HeartPulse className="size-5" />
      </div>
      <p className="relative text-sm leading-snug font-semibold text-slate-700">
        Healthy Community
        <br />
        Better Tomorrow
      </p>
    </div>
  );
}

/** Fixed desktop sidebar (lg+). On smaller screens the same links live in MobileNav. */
export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r bg-gradient-to-b from-white via-white to-blue-50/60 lg:flex">
      <div className="flex h-20 items-center px-5">
        <Link href="/dashboard" className="rounded-lg focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none">
          <Logo tagline />
        </Link>
      </div>
      <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-4">
        <div className="space-y-2">
          <p className="px-3 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">Menu</p>
          <NavLinks />
        </div>
        <div className="mt-auto px-1">
          <SidebarCard />
        </div>
      </div>
      <div className="border-t p-3">
        <LogoutButton />
      </div>
    </aside>
  );
}
