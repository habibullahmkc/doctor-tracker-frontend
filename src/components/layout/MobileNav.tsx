"use client";

import { Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "./Logo";
import { LogoutButton } from "./LogoutButton";
import { SidebarCard } from "./Sidebar";
import { NavLinks } from "./NavLinks";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation menu">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex w-72 flex-col gap-0 p-0">
        <SheetHeader className="h-20 justify-center border-b px-5">
          <SheetTitle asChild>
            <div>
              <Logo tagline />
            </div>
          </SheetTitle>
          <SheetDescription className="sr-only">Main navigation</SheetDescription>
        </SheetHeader>
        <div className="flex flex-1 flex-col gap-6 px-3 py-5">
          <NavLinks onNavigate={() => setOpen(false)} />
          <div className="mt-auto px-1">
            <SidebarCard />
          </div>
        </div>
        <div className="border-t p-3">
          <LogoutButton />
        </div>
      </SheetContent>
    </Sheet>
  );
}
