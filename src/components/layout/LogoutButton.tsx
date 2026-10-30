"use client";

import { Loader2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/useAuth";

export function LogoutButton() {
  const logout = useLogout();

  return (
    <Button
      variant="ghost"
      className="h-10 w-full justify-start gap-3 px-3 text-sidebar-foreground/80 hover:bg-destructive/10 hover:text-destructive"
      onClick={() => logout.mutate()}
      disabled={logout.isPending}
    >
      {logout.isPending ? <Loader2 className="size-[18px] animate-spin" /> : <LogOut className="size-[18px]" />}
      Sign out
    </Button>
  );
}
