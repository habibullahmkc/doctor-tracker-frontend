"use client";

import { MoreHorizontal, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface RowAction {
  label: string;
  icon: LucideIcon;
  onSelect: () => void;
  destructive?: boolean;
}

/** "⋯" menu for a table row. Stops click propagation so it doesn't trigger row navigation. */
export function RowActions({ label, actions }: { label: string; actions: RowAction[] }) {
  const regular = actions.filter((a) => !a.destructive);
  const destructive = actions.filter((a) => a.destructive);

  return (
    <div onClick={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${label}`}>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          {regular.map(({ label: text, icon: Icon, onSelect }) => (
            <DropdownMenuItem key={text} onSelect={onSelect}>
              <Icon />
              {text}
            </DropdownMenuItem>
          ))}
          {regular.length > 0 && destructive.length > 0 && <DropdownMenuSeparator />}
          {destructive.map(({ label: text, icon: Icon, onSelect }) => (
            <DropdownMenuItem key={text} variant="destructive" onSelect={onSelect}>
              <Icon />
              {text}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
