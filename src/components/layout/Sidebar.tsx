import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Logo } from "./Logo";
import { LogoutButton } from "./LogoutButton";
import { NavLinks } from "./NavLinks";

/** Fixed desktop sidebar (lg+). On smaller screens the same links live in MobileNav. */
export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r bg-sidebar lg:flex">
      <div className="flex h-16 items-center px-5">
        <Link href="/dashboard" aria-label="Doctor Tracker home">
          <Logo />
        </Link>
      </div>
      <Separator />
      <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-5">
        <div className="space-y-2">
          <p className="px-3 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">Menu</p>
          <NavLinks />
        </div>
      </div>
      <div className="border-t p-3">
        <LogoutButton />
      </div>
    </aside>
  );
}
