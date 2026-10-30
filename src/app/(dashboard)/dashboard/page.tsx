import type { Metadata } from "next";
import { Suspense } from "react";
import { DashboardOverview } from "./DashboardOverview";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <Suspense>
      <DashboardOverview />
    </Suspense>
  );
}
