"use client";

import { CommandSearch } from "./CommandSearch";
import { MobileNav } from "./MobileNav";
import { NotificationsMenu } from "./NotificationsMenu";
import { UserMenu } from "./UserMenu";

export function Topbar() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-blue-100/70 bg-background/80 px-4 backdrop-blur-md supports-[backdrop-filter]:bg-background/70 sm:px-6 lg:h-20 lg:px-8">
      <MobileNav />
      <div className="flex min-w-0 flex-1 items-center">
        <CommandSearch />
      </div>
      <NotificationsMenu />
      <UserMenu />
    </header>
  );
}
