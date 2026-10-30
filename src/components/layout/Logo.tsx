import { Stethoscope } from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  inverted?: boolean;
  /** Show the "Better Care • Smarter Tracking" tagline. */
  tagline?: boolean;
}

export function Logo({ className, inverted = false, tagline = false }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          "flex size-10 items-center justify-center rounded-full shadow-sm",
          inverted ? "bg-white/15 text-white ring-1 ring-white/25" : "bg-gradient-to-br from-blue-500 to-blue-700 text-white",
        )}
      >
        <Stethoscope className="size-5" />
      </div>
      <div className="leading-tight">
        <span className={cn("block text-lg font-bold tracking-tight", inverted ? "text-white" : "text-slate-900")}>
          {APP_NAME}
        </span>
        {tagline && (
          <span className={cn("block text-[11px] font-medium", inverted ? "text-blue-100" : "text-blue-700")}>
            Better Care • Smarter Tracking
          </span>
        )}
      </div>
    </div>
  );
}
