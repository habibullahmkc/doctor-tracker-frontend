"use client";

import { format, parseISO } from "date-fns";
import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, type TooltipContentProps } from "recharts";
import type { DashboardStats, StatsRange } from "@/types/dashboard";

const SERIES = "#00786f"; // teal-700 (matches --primary), 5.4:1 on white

interface Point {
  key: string;
  label: string;
  fullLabel: string;
  count: number;
}

function toPoint(date: string, count: number, monthly: boolean): Point {
  const parsed = parseISO(monthly ? `${date}-01` : date);
  return {
    key: date,
    label: format(parsed, monthly ? "MMM" : "d MMM"),
    fullLabel: format(parsed, monthly ? "MMMM yyyy" : "EEE, d MMM yyyy"),
    count,
  };
}

function ChartTooltip({ active, payload }: TooltipContentProps) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload as Point;
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-xs shadow-md">
      <p className="text-muted-foreground">{point.fullLabel}</p>
      <p className="mt-0.5 font-medium text-foreground">
        <span className="tabular-nums">{point.count}</span> admission{point.count === 1 ? "" : "s"}
      </p>
    </div>
  );
}

export function AdmissionsChart({ data, range }: { data: DashboardStats["admissions"]; range: StatsRange }) {
  const monthly = range === "12m";
  const points = useMemo(() => data.map((d) => toPoint(d.date, d.count, monthly)), [data, monthly]);

  return (
    <div className="h-[280px] w-full" role="img" aria-label={`Patient admissions per ${monthly ? "month" : "day"}`}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="admissionsFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={SERIES} stopOpacity={0.22} />
              <stop offset="100%" stopColor={SERIES} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            interval="preserveStartEnd"
            minTickGap={24}
            tickMargin={8}
          />
          <YAxis
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            width={36}
          />
          <Tooltip
            content={ChartTooltip}
            cursor={{ stroke: "var(--muted-foreground)", strokeWidth: 1, strokeDasharray: "4 4" }}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke={SERIES}
            strokeWidth={2}
            fill="url(#admissionsFill)"
            activeDot={{ r: 5, strokeWidth: 2, stroke: "var(--card)", fill: SERIES }}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
