export type ChangeDirection = "up" | "down" | "flat";

/** Month-over-month change as stat-card copy, e.g. "6.1% vs last month" (one decimal below 10%). */
export function percentChange(current: number, previous: number): { text: string; direction: ChangeDirection } {
  if (!previous) return { text: "New this month", direction: "flat" };
  const pct = ((current - previous) / previous) * 100;
  const magnitude = Math.abs(pct);
  const rounded = magnitude < 10 ? magnitude.toFixed(1) : Math.round(magnitude).toString();
  return {
    text: `${pct < 0 ? "−" : ""}${rounded}% vs last month`,
    direction: pct > 0 ? "up" : pct < 0 ? "down" : "flat",
  };
}
