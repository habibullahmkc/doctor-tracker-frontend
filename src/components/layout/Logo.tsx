import { Stethoscope } from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Logo({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          "flex size-9 items-center justify-center rounded-xl shadow-sm",
          inverted ? "bg-white/15 text-white ring-1 ring-white/25" : "bg-primary text-primary-foreground",
        )}
      >
        <Stethoscope className="size-5" />
      </div>
      <span className={cn("text-lg font-semibold tracking-tight", inverted && "text-white")}>{APP_NAME}</span>
    </div>
  );
}
