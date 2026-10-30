import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DashboardOverview } from "./DashboardOverview";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Overview of doctors, patients and admissions." />
      <Suspense>
        <DashboardOverview />
      </Suspense>
    </div>
  );
}
